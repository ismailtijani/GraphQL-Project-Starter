import { AuthenticationError, MiddlewareFn } from "type-graphql";
import { MyContext } from "../entities/userManager/typeDef";

export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId)
    throw new AuthenticationError("Access denied.Please Authenticate.");
  return next();
};
