import { Type } from "@sinclair/typebox";

export const RegisterRequest = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export const User = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
