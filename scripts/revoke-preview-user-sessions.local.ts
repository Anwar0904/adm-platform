import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import mongoose from "mongoose";

import SessionRepository from "@/repositories/session.repository";
import { Session } from "@/models/session.model";
import { User } from "@/models/user.model";

const TARGET_DATABASE = "blood-connect";
const LOCAL_ONLY_CONFIRMATION = "I CONFIRM THIS IS THE AUTHORIZED ISOLATED ADM PREVIEW DATABASE";
const EXECUTION_CONFIRMATION = "I AUTHORIZE REVOKING ONLY THIS PREVIEW USER'S SESSIONS";

class SafeStop extends Error {}

function readTarget() {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL || process.env.VERCEL_ENV) {
        throw new SafeStop();
    }
    if (process.env.ADM_PREVIEW_SESSION_REVOKE_LOCAL_ONLY !== "1") {
        throw new SafeStop();
    }

    const configuredDb = process.env.MONGODB_DB?.trim();
    const previewDb = process.env.ADM_PREVIEW_MONGODB_DB?.trim();
    const uri = process.env.ADM_PREVIEW_MONGODB_URI;
    const expectedHost = process.env.ADM_PREVIEW_MONGODB_HOST?.trim().toLowerCase();
    if (
        configuredDb !== TARGET_DATABASE || previewDb !== TARGET_DATABASE ||
        !uri || !expectedHost || !expectedHost.endsWith(".mongodb.net")
    ) {
        throw new SafeStop();
    }

    let parsed: URL;
    try {
        parsed = new URL(uri);
    } catch {
        throw new SafeStop();
    }
    if (
        !["mongodb+srv:", "mongodb:"].includes(parsed.protocol) ||
        parsed.hostname.toLowerCase() !== expectedHost
    ) {
        throw new SafeStop();
    }

    let uriDb: string;
    try {
        uriDb = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
    } catch {
        throw new SafeStop();
    }
    if (uriDb && uriDb !== TARGET_DATABASE) throw new SafeStop();

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

async function readHidden(prompt: string) {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") throw new SafeStop();
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
                    finish(new SafeStop());
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

async function main() {
    const execute = process.argv.length === 3 && process.argv[2] === "--execute";
    if (process.argv.length > 3 || (process.argv.length === 3 && !execute)) throw new SafeStop();
    const { uri, expectedHost } = readTarget();

    const isolation = await readLine("Type the Preview isolation confirmation to continue: ");
    if (isolation !== LOCAL_ONLY_CONFIRMATION) throw new SafeStop();
    const hostConfirmation = await readLine("Type HOST-MATCHED after confirming the Preview Atlas host in Vercel: ");
    if (hostConfirmation !== "HOST-MATCHED") throw new SafeStop();
    if (expectedHost.length === 0) throw new SafeStop();

    const email = (await readHidden("Affected active staging account email (hidden): ")).trim().toLowerCase();
    const emailConfirmation = (await readHidden("Re-enter the same account email (hidden): ")).trim().toLowerCase();
    if (!email || email !== emailConfirmation) throw new SafeStop();

    mongoose.set("autoCreate", false);
    mongoose.set("autoIndex", false);
    await mongoose.connect(uri, {
        dbName: TARGET_DATABASE,
        autoCreate: false,
        autoIndex: false,
        serverSelectionTimeoutMS: 5_000,
        connectTimeoutMS: 5_000,
    });

    if (mongoose.connection.db?.databaseName !== TARGET_DATABASE) throw new SafeStop();
    const users = await User.find({ email, isDeleted: { $ne: true } })
        .select("_id status")
        .limit(2)
        .lean();
    if (users.length !== 1 || users[0]?.status !== "active") throw new SafeStop();

    const userId = users[0]._id.toString();
    const activeBefore = await Session.countDocuments({ user: userId, isRevoked: false });
    if (!execute) {
        stdout.write(`STATUS=dry-run-ready UNREVOKED_SESSIONS=${activeBefore}\n`);
        return;
    }

    const authorization = await readLine("Type the explicit one-user execution authorization: ");
    if (authorization !== EXECUTION_CONFIRMATION) throw new SafeStop();

    const result = await SessionRepository.revokeAllUserSessions(userId);
    const remaining = await Session.countDocuments({ user: userId, isRevoked: false });
    if (remaining !== 0) {
        stdout.write(`STATUS=verification-failed REVOKED_COUNT=${result.modifiedCount} REMAINING_ACTIVE=${remaining}\n`);
        process.exitCode = 1;
        return;
    }
    stdout.write(`STATUS=revoked REVOKED_COUNT=${result.modifiedCount} REMAINING_ACTIVE=0\n`);
}

main()
    .catch(() => {
        stdout.write("STATUS=aborted\n");
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            try {
                await mongoose.disconnect();
            } catch {
                stdout.write("STATUS=disconnect-failed\n");
                process.exitCode = 1;
            }
        }
    });
