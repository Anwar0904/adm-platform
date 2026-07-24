import { roleController } from "@/controllers/role.controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const roles = await roleController.findAll();

        return NextResponse.json({
            success: true,
            data: roles,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: (error as Error).message,
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const role = await roleController.create(req);

        return NextResponse.json(
            {
                success: true,
                data: role,
            },
            { status: 201 }
        );
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