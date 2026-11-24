import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import mongoose, { type Connection } from "mongoose";

import { SUPER_ADMIN_ROLE_DEFINITION } from "@/lib/seed/role-definitions";
import { Role } from "@/models/role.model";
import { User } from "@/models/user.model";
import { CreateUserSchema } from "@/validators/user.validator";

const TARGET_DATABASE = "blood-connect";
const EXCLUSIVE_STAGING_CONFIRMATION = "I CONFIRM BLOOD-CONNECT IS EXCLUSIVELY AUTHORIZED FOR ADM PREVIEW STAGING";
const QUIESCED_WRITERS_CONFIRMATION = "I CONFIRM ALL OTHER ADM PREVIEW DATABASE WRITERS ARE PAUSED";
const ROLE_WRITE_CONFIRMATION = "CREATE SUPER ADMIN ROLE IN blood-connect";
const USER_WRITE_CONFIRMATION = "CREATE ONE DISPOSABLE SUPER ADMIN IN blood-connect";

class SafeStopError extends Error {}

function assertLocalOnlyTarget() {
    if (process.env.ADM_PREVIEW_BOOTSTRAP_LOCAL_ONLY !== "1") {
        throw new SafeStopError("Local-only bootstrap guard is missing.");
    }
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || process.env.VERCEL_ENV) {
        throw new SafeStopError("Refusing to run outside a local shell.");
    }
    if (process.env.ADM_PREVIEW_BOOTSTRAP_DB !== TARGET_DATABASE) {
        throw new SafeStopError("Explicit database confirmation must be blood-connect.");
    }

    const uri = process.env.ADM_PREVIEW_MONGODB_URI;
    const expectedHost = process.env.ADM_PREVIEW_MONGODB_HOST?.trim().toLowerCase();
    if (!uri || !expectedHost) {
        throw new SafeStopError("Provide the approved staging URI and separately verified Atlas hostname.");
    }

    let parsed: URL;
    try {
        parsed = new URL(uri);
    } catch {
        throw new SafeStopError("Staging MongoDB URI is malformed.");
    }

    const uriHost = parsed.hostname.toLowerCase();
    if (
        !["mongodb+srv:", "mongodb:"].includes(parsed.protocol) ||
        !uriHost.endsWith(".mongodb.net") ||
        uriHost !== expectedHost
    ) {
        throw new SafeStopError("MongoDB URI host did not match the separately verified Atlas staging hostname.");
    }

    let uriDatabase: string;
    try {
        uriDatabase = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    } catch {
        throw new SafeStopError("MongoDB URI database path is malformed.");
    }
    if (uriDatabase && uriDatabase !== TARGET_DATABASE) {
        throw new SafeStopError("URI database path conflicts with blood-connect.");
    }

    return { uri, expectedHost };
}

async function readLine(prompt: string) {
    const terminal = createInterface({ input: stdin, output: stdout });
    try {
        return (await terminal.question(prompt)).trim();
    } finally {
        terminal.close();
    }
}

async function readHiddenPassword(prompt: string) {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
        throw new SafeStopError("A local interactive terminal is required for hidden password entry.");
    }

    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    return new Promise<string>((resolve, reject) => {
        let value = "";
        const finish = (error?: Error) => {
            stdin.off("data", onData);
            stdin.setRawMode(false);
            stdout.write("\n");
            if (error) reject(error);
            else resolve(value);
        };
        const onData = (chunk: string) => {
            for (const character of chunk) {
                if (character === "\u0003") {
                    finish(new SafeStopError("Password entry cancelled."));
                    return;
                }
                if (character === "\r" || character === "\n") {
                    finish();
                    return;
                }
                if (character === "\b" || character === "\u007f") {
                    value = Array.from(value).slice(0, -1).join("");
                    continue;
                }
                if (character >= " ") value += character;
            }
        };
        stdin.on("data", onData);
    });
}

async function countDatabaseDocuments(connection: Connection) {
    const db = connection.db;
    if (!db) throw new SafeStopError("MongoDB connection has no selected database.");

    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const counts = await Promise.all(
        collections
            .filter(({ name }) => !name.startsWith("system."))
            .map(async ({ name }) => ({
                name,
                count: await db.collection(name).countDocuments({}),
            })),
    );
    return new Map(counts.map(({ name, count }) => [name, count]));
}

function assertEmptyDatabase(counts: Map<string, number>) {
    const populated = [...counts].filter(([, count]) => count > 0);
    if (populated.length > 0) {
        const summary = populated.map(([name, count]) => `${name}=${count}`).join(", ");
        throw new SafeStopError(`Unexpected existing documents detected (${summary}); no further writes will be made.`);
    }
}

function assertOnlyBootstrapRole(counts: Map<string, number>) {
    const unexpected = [...counts].filter(([name, count]) => name !== "roles" && count > 0);
    if (counts.get("roles") !== 1 || unexpected.length > 0) {
        throw new SafeStopError("Database changed unexpectedly after role creation; no account write will be made.");
    }
}

async function main() {
    if (!stdin.isTTY || !stdout.isTTY) {
        throw new SafeStopError("Run this procedure from a local interactive terminal.");
    }

    const { uri, expectedHost } = assertLocalOnlyTarget();
    const databaseConfirmation = await readLine(`Type ${TARGET_DATABASE} to confirm the database: `);
    if (databaseConfirmation !== TARGET_DATABASE) throw new SafeStopError("Database confirmation did not match.");

    const hostConfirmation = await readLine(`Type the verified Atlas staging hostname (${expectedHost}): `);
    if (hostConfirmation.trim().toLowerCase() !== expectedHost) {
        throw new SafeStopError("Atlas hostname confirmation did not match.");
    }

    const ownershipConfirmation = await readLine(
        `After verifying the Atlas project, cluster, staging-only database credential, and exclusive ADM staging ownership, type exactly:\n${EXCLUSIVE_STAGING_CONFIRMATION}\n> `,
    );
    if (ownershipConfirmation !== EXCLUSIVE_STAGING_CONFIRMATION) {
        throw new SafeStopError("Exclusive ADM staging authorization was not confirmed.");
    }
    const quiescenceConfirmation = await readLine(
        `Pause ADM Preview database writers, then type exactly:\n${QUIESCED_WRITERS_CONFIRMATION}\n> `,
    );
    if (quiescenceConfirmation !== QUIESCED_WRITERS_CONFIRMATION) {
        throw new SafeStopError("Database writer quiescence was not confirmed.");
    }

    // Prevent Mongoose from creating collections or indexes before an explicit write approval.
    mongoose.set("autoCreate", false);
    mongoose.set("autoIndex", false);
    await mongoose.connect(uri, {
        dbName: TARGET_DATABASE,
        autoCreate: false,
        autoIndex: false,
        serverSelectionTimeoutMS: 5_000,
        connectTimeoutMS: 5_000,
    });

    const connection = mongoose.connection;
    if (connection.db?.databaseName !== TARGET_DATABASE) {
        throw new SafeStopError("Connected database name did not match blood-connect.");
    }

    const initialCounts = await countDatabaseDocuments(connection);
    assertEmptyDatabase(initialCounts);
    stdout.write(`Read-only preflight passed: ${TARGET_DATABASE} has no documents in its collections.\n`);
    stdout.write(`The approved role definition contains ${SUPER_ADMIN_ROLE_DEFINITION.permissions.length} permissions.\n`);

    const firstName = await readLine("Disposable staging administrator first name: ");
    const lastName = await readLine("Last name (optional): ");
    const email = await readLine("Disposable staging email: ");
    const activeApproval = await readLine(
        "Type ACTIVE only if the approved staging procedure authorizes an active account: ",
    );
    if (activeApproval !== "ACTIVE") throw new SafeStopError("Active account status was not approved.");
    const verifiedApproval = await readLine(
        "Type VERIFIED only if the approved staging procedure authorizes verified email: ",
    );
    if (verifiedApproval !== "VERIFIED") throw new SafeStopError("Email verification was not approved.");

    const roleId = new mongoose.Types.ObjectId();
    let password = "";
    let passwordConfirmation = "";
    let passwordHash = "";
    try {
        password = await readHiddenPassword("Password (hidden): ");
        passwordConfirmation = await readHiddenPassword("Confirm password (hidden): ");
        if (password !== passwordConfirmation) throw new SafeStopError("Password confirmation did not match.");
        passwordConfirmation = "";

        const userInput = CreateUserSchema.parse({
            firstName,
            lastName,
            email,
            password,
            role: roleId.toString(),
            status: "active",
            isEmailVerified: true,
        });
        userInput.password = "";
        passwordHash = await (await import("@/lib/auth/bcrypt")).PasswordService.hash(password);
        password = "";

        const roleApproval = await readLine(`Type exactly ${ROLE_WRITE_CONFIRMATION} to insert the one role: `);
        if (roleApproval !== ROLE_WRITE_CONFIRMATION) throw new SafeStopError("Role write was not approved.");
        const beforeRoleWrite = await countDatabaseDocuments(connection);
        assertEmptyDatabase(beforeRoleWrite);

        // Insert only; never upsert or modify a role.
        await Role.create({
            _id: roleId,
            ...SUPER_ADMIN_ROLE_DEFINITION,
            status: "active",
        });
        stdout.write("Inserted the approved Super Admin role.\n");

        const afterRoleWrite = await countDatabaseDocuments(connection);
        assertOnlyBootstrapRole(afterRoleWrite);
        const storedRole = await Role.findById(roleId).lean();
        const roleMatchesDefinition = Boolean(
            storedRole &&
            storedRole.name === SUPER_ADMIN_ROLE_DEFINITION.name &&
            storedRole.status === "active" &&
            storedRole.permissions.length === SUPER_ADMIN_ROLE_DEFINITION.permissions.length &&
            SUPER_ADMIN_ROLE_DEFINITION.permissions.every((permission) => storedRole.permissions.includes(permission)),
        );
        if (!roleMatchesDefinition) {
            throw new SafeStopError("Inserted role did not match the approved definition; no account write will be made.");
        }

        const beforeUserWrite = await countDatabaseDocuments(connection);
        assertOnlyBootstrapRole(beforeUserWrite);
        if (await User.exists({ email: userInput.email })) {
            throw new SafeStopError("A user with that normalized email exists; no account write will be made.");
        }

        const userApproval = await readLine(`Type exactly ${USER_WRITE_CONFIRMATION} to insert the one user: `);
        if (userApproval !== USER_WRITE_CONFIRMATION) throw new SafeStopError("User write was not approved.");
        const immediatelyBeforeUserWrite = await countDatabaseDocuments(connection);
        assertOnlyBootstrapRole(immediatelyBeforeUserWrite);
        if (await User.exists({ email: userInput.email })) {
            throw new SafeStopError("A user with that normalized email exists; no account write will be made.");
        }

        // Insert only; no account, role, or existing document is overwritten.
        const createdUser = await User.create({
            firstName: userInput.firstName,
            lastName: userInput.lastName,
            email: userInput.email,
            password: passwordHash,
            role: roleId,
            status: "active",
            emailVerified: true,
            isEmailVerified: true,
            createdBy: null,
            updatedBy: null,
            isDeleted: false,
            deletedAt: null,
            passwordChangedAt: new Date(),
        });

        const finalCounts = await countDatabaseDocuments(connection);
        if (finalCounts.get("roles") !== 1 || finalCounts.get("users") !== 1) {
            throw new SafeStopError("Post-write verification found an unexpected database state; inspect staging manually.");
        }
        const otherDocuments = [...finalCounts].filter(
            ([name, count]) => name !== "roles" && name !== "users" && count > 0,
        );
        if (otherDocuments.length > 0 || !(await User.exists({ _id: createdUser._id, role: roleId }))) {
            throw new SafeStopError("Post-write verification failed; inspect staging manually without rerunning this script.");
        }

        stdout.write("Created and verified one disposable staging Super Admin and the required role.\n");
        stdout.write("No credentials, password, hash, or database URI were printed.\n");
    } finally {
        password = "";
        passwordConfirmation = "";
        passwordHash = "";
    }
}

main()
    .catch((error: unknown) => {
        if (error instanceof SafeStopError) {
            stdout.write(`Staging initializer stopped: ${error.message}\n`);
        } else if (error instanceof Error && error.name === "ZodError") {
            stdout.write("Staging initializer stopped: supplied fields do not meet ADM user validation rules.\n");
        } else {
            // MongoDB and driver errors may contain connection details; suppress their contents.
            stdout.write("Staging initializer failed during a database or credential operation; details were suppressed.\n");
        }
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            try {
                await mongoose.disconnect();
            } catch {
                stdout.write("Database disconnect failed; details were suppressed.\n");
                process.exitCode = 1;
            }
        }
    });
