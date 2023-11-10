import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../entities/userManager/typeDef";
import userService from "../../services/user";
import { Auth } from "../../middleware/auth";
import { UserClass } from "../../entities/userManager/schema";

@Resolver()
export default class Profile {
  @Query(() => UserClass, { nullable: true })
  @UseMiddleware(Auth)
  async profile(@Ctx() ctx: MyContext): Promise<UserClass | null> {
    return await userService.userProfile(ctx.req.session.userId);
  }
}
