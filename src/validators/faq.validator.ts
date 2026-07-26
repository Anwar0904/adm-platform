import { z } from "zod";

export const FAQSchema = z.object({
    question: z.string().min(1),

    answer: z.string().min(1),
});