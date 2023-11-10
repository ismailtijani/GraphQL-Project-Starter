import userService from "../../services/user";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserClass } from "../../entities/userManager/schema";
import { LoginInput, MyContext } from "../../entities/userManager/typeDef";

@Resolver()
export default class Login {
  @Mutation(() => UserClass, { nullable: true })
  async login(
    @Arg("logininputs") { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<UserClass | null> {
    const user = await userService.login(email, password);
    ctx.req.session.userId = user._id.toString();
    return user;
  }
}
