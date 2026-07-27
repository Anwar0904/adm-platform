import { z } from "zod";

import { FAQSchema } from "@/validators/faq.validator";

export type CreateFAQInput =
    z.infer<typeof FAQSchema>;

export type UpdateFAQInput =
    Partial<CreateFAQInput>;