import { z } from "zod";
import { ObjectId } from "mongodb";

export const User = z.object({
  _id: z.instanceof(ObjectId),
  username: z.string(),
  isAdmin: z.boolean()
});

export type UserEntity = z.infer<typeof User>;