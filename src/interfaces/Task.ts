import { z } from "zod";
import { ObjectId } from "mongodb";

export enum Status {
    Pending,
    Completed
}

export const taskEntitySchema = z.object({
    _id: z.instanceof(ObjectId),
    creatorId: z.instanceof(ObjectId),
    title: z.string(),
    description: z.string(),
    endDate: z.date(),
    status: z.nativeEnum(Status),
});

export type TaskEntity = z.infer<typeof taskEntitySchema>;