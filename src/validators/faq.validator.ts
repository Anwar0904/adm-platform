import { z } from "zod";

export const FAQSchema =
    z.object({
        question: z
            .string()
            .min(5)
            .max(300),

        answer: z
            .string()
            .min(5),
    });