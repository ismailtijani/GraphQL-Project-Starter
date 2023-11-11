import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../entities/userManager/typeDef";
import userService from "../../services/user";
import { Auth } from "../../middleware/auth";
import { Users } from "../../entities/userManager/schema";

@Resolver()
export default class Profile {
  @Query(() => Users, { nullable: true })
  @UseMiddleware(Auth)
  async profile(@Ctx() ctx: MyContext): Promise<Users | null> {
    return await userService.userProfile(ctx.req.session.userId);
  }
}
