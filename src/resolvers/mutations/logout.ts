import { Ctx, Mutation, Resolver } from "type-graphql";
import userService from "../../services/user";
import { MyContext } from "../../entities/userManager/typeDef";

@Resolver()
export default class Logout {
  @Mutation(() => String)
  async logout(@Ctx() ctx: MyContext): Promise<string> {
    return await userService.logout(ctx);
  }
}
