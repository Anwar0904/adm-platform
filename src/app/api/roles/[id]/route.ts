import { roleController } from "@/controllers/role.controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const role = await roleController.findById(id);

        return NextResponse.json({
            success: true,
            data: role,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            { status: 404 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const role = await roleController.update(req, id);

        return NextResponse.json({
            success: true,
            data: role,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            { status: 400 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await roleController.delete(id);

        return NextResponse.json({
            success: true,
            message: "Role deleted successfully.",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            { status: 400 }
        );
    }
}