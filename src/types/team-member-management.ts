import { CreateTeamMemberSchema, TeamMemberQuerySchema, UpdateTeamMemberSchema } from "@/validators/team-member.validator";
import { z } from "zod";



export type CreateTeamMemberInput =
    z.infer<typeof CreateTeamMemberSchema>;

export type UpdateTeamMemberInput =
    z.infer<typeof UpdateTeamMemberSchema>;

export type TeamMemberQuery =
    z.infer<typeof TeamMemberQuerySchema>;