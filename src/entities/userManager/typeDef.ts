import { IsEmail, Length, MinLength } from "class-validator";
import { Request, Response } from "express";
import { Field, InputType } from "type-graphql";
import { UserClass } from "./schema";

@InputType()
class Password {
  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class SignupInput extends Password implements Partial<UserClass> {
  @Field()
  @Length(3, 30, { message: "First name must be greater then 3 characters" })
  firstName: string;

  @Field()
  @Length(1)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(10)
  phoneNumber: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: false })
  password!: string;
}

@InputType()
export class ResetPasswordInputs extends Password {
  @Field({ nullable: false })
  token: string;
}

export interface MyContext {
  req: Request;
  res: Response;
}

declare module "express-session" {
  interface Session {
    userId: string;
  }
}
