// src/types/auth.types.ts

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  jwtSecretKey: string;
}

interface LoginUserInput {
  username: string;
  password: string;
  jwtSecretKey: string;
}
export type { RegisterUserInput, LoginUserInput };
