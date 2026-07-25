import { NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { ApiResponse } from "@/lib/api/api-response";
import { ApiErrorHandler } from "@/lib/api/api-error";
import { ApiError } from "@/lib/api/api-error";


import { requireAuth } from "@/middleware/auth.middleware";

import { MEDIA_TYPE } from "@/enums";
import mediaService from "@/services/media/media.service";

export async function POST(
    request: NextRequest
) {
    try {
        await connectDB();

        const user =
            await requireAuth(request);

        const formData =
            await request.formData();

        const file =
            formData.get("file") as File | null;

        if (!file) {
            throw new ApiError(
                400,
                "File is required."
            );
        }

        /**
         * Replace this section with Cloudinary/S3 upload later.
         */

        const bytes =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(bytes);

        console.log(
            "Received file:",
            file.name,
            buffer.length
        );

        const media =
            await mediaService.createMedia(
                {
                    fileName: file.name,
                    publicId: crypto.randomUUID(),
                    url: `/uploads/${file.name}`,
                    mimeType: file.type,
                    mediaType: file.type.startsWith(
                        "image/"
                    )
                        ? MEDIA_TYPE.IMAGE
                        : file.type.startsWith(
                            "video/"
                        )
                            ? MEDIA_TYPE.VIDEO
                            : MEDIA_TYPE.DOCUMENT,
                    size: file.size,
                    width: undefined,
                    height: undefined,
                    alt: "",
                    caption: "",
                    folder: "",
                },
                user._id.toString()
            );

        return ApiResponse.success(
            media,
            "File uploaded successfully."
        );
    } catch (error) {
        return ApiErrorHandler.handle(error);
    }
}