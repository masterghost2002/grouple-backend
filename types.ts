import type { User } from "@prisma/client";
export type UserWithoutPassword = Omit<User, 'hash_password'>