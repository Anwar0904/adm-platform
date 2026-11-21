import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { put } from "@vercel/blob";

import { connectDB } from "@/lib/db";
import { Media } from "@/models/media.model";

import { requirePermission } from "@/middleware/auth.middleware";
import { PERMISSIONS } from "@/constants/permissions";

import { ApiResponse } from "@/lib/api/api-response";
import {
    ApiError,
    ApiErrorHandler,
} from "@/lib/api/api-error";

const UPLOAD_DIR = path.join(
    process.cwd(),
    "public",
    "uploads",
    "media"
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_REQUEST_SIZE = 32 * 1024 * 1024;
const MAX_FILES = 5;

const USE_BLOB_STORAGE =
    process.env.NODE_ENV === "production";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",

    "application/pdf",
];

async function readBoundedFormData(request: NextRequest) {
    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
        throw new ApiError(413, "Upload request is too large.");
    }
    if (!request.body) throw new ApiError(400, "Upload body is required.");

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > MAX_REQUEST_SIZE) {
                await reader.cancel();
                throw new ApiError(413, "Upload request is too large.");
            }
            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }
    const body = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
    return new Response(body, { headers: request.headers }).formData();
}

function hasValidSignature(mimeType: string, bytes: Buffer) {
    if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    if (mimeType === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    if (mimeType === "image/gif") return ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"));
    if (mimeType === "image/webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    if (mimeType === "application/pdf") return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
    if (mimeType === "video/mp4") return bytes.subarray(4, 8).toString("ascii") === "ftyp";
    if (mimeType === "video/webm") return bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    return false;
}

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMediaType(mimeType: string) {
    if (mimeType.startsWith("image/")) {
        return "image";
    }

    if (mimeType.startsWith("video/")) {
        return "video";
    }

    return "document";
}

function sanitizeFilename(filename: string) {
    return filename
        .normalize("NFKD")
        .replace(/[^\w.-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getSafeExtension(filename: string) {
    return path
        .extname(filename)
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");
}

function hasMatchingExtension(mimeType: string, extension: string) {
    const allowed: Record<string, string[]> = {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
        "video/mp4": [".mp4", ".m4v"],
        "video/webm": [".webm"],
        "application/pdf": [".pdf"],
    };
    return allowed[mimeType]?.includes(extension) ?? false;
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        await requirePermission(
            request,
            PERMISSIONS.MEDIA_READ
        );

        const search =
            request.nextUrl.searchParams.get("search");

        const type =
            request.nextUrl.searchParams.get("type");

        const filter: Record<string, unknown> = {
            isDeleted: false,
        };

        if (search?.trim()) {
            filter.$or = [
                {
                    name: {
                        $regex: escapeRegex(search.trim().slice(0, 100)),
                        $options: "i",
                    },
                },
                {
                    originalName: {
                        $regex: escapeRegex(search.trim().slice(0, 100)),
                        $options: "i",
                    },
                },
            ];
        }

        if (
            type &&
            ["image", "video", "document"].includes(type)
        ) {
            filter.type = type;
        }

        const media = await Media.find(filter)
            .populate(
                "uploadedBy",
                "name email avatar"
            )
            .sort({
                createdAt: -1,
            })
            .limit(100)
            .lean();

        return ApiResponse.success(
            media,
            "Media fetched successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const currentUser =
            await requirePermission(
                request,
                PERMISSIONS.MEDIA_CREATE
            );

        if (
            USE_BLOB_STORAGE &&
            !process.env.BLOB_READ_WRITE_TOKEN
        ) {
            throw new ApiError(
                503,
                "Media storage is not configured. Set BLOB_READ_WRITE_TOKEN in the production environment."
            );
        }

        const formData = await readBoundedFormData(request);

        const files = formData
            .getAll("files")
            .filter(
                (value): value is File =>
                    value instanceof File
            );

        /*
         * Also support a single "file" field.
         * This makes the endpoint compatible with
         * both uploaders and the media picker.
         */
        const singleFile =
            formData.get("file");

        if (
            files.length === 0 &&
            singleFile instanceof File
        ) {
            files.push(singleFile);
        }

        if (files.length === 0) {
            throw new ApiError(
                400,
                "No files uploaded."
            );
        }
        if (files.length > MAX_FILES) {
            throw new ApiError(400, `Upload no more than ${MAX_FILES} files at a time.`);
        }

        if (!USE_BLOB_STORAGE) {
            await fs.mkdir(
                UPLOAD_DIR,
                {
                    recursive: true,
                }
            );
        }

        const uploaded = [];

        for (const file of files) {
            if (!file.name) {
                continue;
            }

            if (file.size <= 0) {
                throw new ApiError(
                    400,
                    `File "${file.name}" is empty.`
                );
            }

            if (file.size > MAX_FILE_SIZE) {
                throw new ApiError(
                    400,
                    `File "${file.name}" exceeds the 10 MB limit.`
                );
            }

            if (
                !ALLOWED_MIME_TYPES.includes(
                    file.type
                )
            ) {
                throw new ApiError(
                    400,
                    `File type "${file.type}" is not supported.`
                );
            }

            const extension =
                getSafeExtension(
                    file.name
                );
            if (!hasMatchingExtension(file.type, extension)) {
                throw new ApiError(400, "File extension does not match its declared type.");
            }

            const originalBaseName =
                path.basename(
                    file.name,
                    path.extname(file.name)
                );

            const baseName =
                sanitizeFilename(
                    originalBaseName
                ) || "file";

            const uniqueName =
                `${baseName}-${Date.now()}-${crypto
                    .randomBytes(6)
                    .toString("hex")}${extension}`;

            const filePath = path.join(
                UPLOAD_DIR,
                uniqueName
            );

            let fileWritten = false;
            let publicUrl = "";

            try {
                const arrayBuffer =
                    await file.arrayBuffer();

                const buffer =
                    Buffer.from(arrayBuffer);

                if (!hasValidSignature(file.type, buffer)) {
                    throw new ApiError(400, "File content does not match its declared type.");
                }

                if (USE_BLOB_STORAGE) {
                    const blob = await put(
                        `media/${uniqueName}`,
                        buffer,
                        {
                            access: "public",
                            addRandomSuffix: false,
                            contentType: file.type,
                        }
                    );

                    publicUrl = blob.url;
                } else {
                    await fs.writeFile(
                        filePath,
                        buffer
                    );

                    fileWritten = true;
                    publicUrl =
                        `/uploads/media/${uniqueName}`;
                }

                const media =
                    await Media.create({
                        name: uniqueName,

                        originalName:
                            file.name,

                        // Older deployments have a unique publicId index.
                        // Give local files an ID too, rather than inserting
                        // repeated null values into that index.
                        publicId: uniqueName,

                        url: publicUrl,

                        type:
                            getMediaType(
                                file.type
                            ),

                        mimeType:
                            file.type,

                        size:
                            file.size,

                        folder:
                            "general",

                        uploadedBy:
                            currentUser._id,

                        isDeleted: false,

                        deletedAt: null,
                    });

                uploaded.push(media);
            } catch (error) {
                /*
                 * If DB creation fails after the file
                 * was written, remove the orphan file.
                 */
                if (fileWritten) {
                    try {
                        await fs.unlink(
                            filePath
                        );
                    } catch {
                        // Ignore cleanup failure.
                    }
                }

                throw error;
            }
        }

        return ApiResponse.created(
            uploaded,
            "Media uploaded successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}
