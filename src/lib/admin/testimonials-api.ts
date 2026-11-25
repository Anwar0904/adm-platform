export type TestimonialWriteMethod = "POST" | "PATCH";

export class TestimonialWriteError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
        this.name = "TestimonialWriteError";
    }
}

export async function requestTestimonialWrite<T>(
    url: string,
    method: TestimonialWriteMethod,
    payload: unknown,
    request: typeof fetch = fetch,
): Promise<T> {
    const response = await request(url, {
        method,
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = await response.json() as { success?: boolean; message?: string; data?: T; errors?: unknown };

    if (!response.ok || !result.success) {
        const message = response.status === 401
            ? "Your session has expired. Sign in again."
            : response.status === 403
                ? "You do not have permission to perform this action."
                : response.status === 400
                    ? validationMessage(result.errors) ?? "Check the testimonial fields and try again."
                    : result.message ?? "The request could not be completed. Please try again.";
        throw new TestimonialWriteError(message, response.status);
    }

    if (result.data === undefined || result.data === null) {
        throw new TestimonialWriteError("The server did not confirm a saved testimonial.", response.status);
    }

    return result.data;
}

function validationMessage(errors: unknown) {
    if (!errors || typeof errors !== "object" || !("fieldErrors" in errors)) return null;
    const messages = Object.values((errors as { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {}).flat();
    return messages.length ? messages.join(" ") : null;
}
