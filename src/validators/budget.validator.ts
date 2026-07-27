import { Currency } from "@/enums";
import { z } from "zod";



export const BudgetSchema =
    z.object({
        amount: z
            .number()
            .min(0),

        currency: z
            .enum(Currency),
    });