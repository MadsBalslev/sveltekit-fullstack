import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(255)
})
export type LoginSchema = typeof loginSchema;

export const signUpSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255),
})

export type SignUpSchema = typeof signUpSchema;
