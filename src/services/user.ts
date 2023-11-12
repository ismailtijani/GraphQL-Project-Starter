import crypto from "crypto";
import { AccountStatusEnum } from "../library/enums";
import MailService from "../mail/service";
import { MyContext } from "../entities/userManager/typeDef";
import { GraphQLError } from "graphql";
import { User } from "../entities/userManager/schema";

export default class userService {
  static signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    try {
      const confirmationCode = crypto.randomBytes(20).toString("hex");
      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmationCode,
      });

      if (!user) throw new GraphQLError("Signup failed, try again", { extensions: { code: 400 } });

      // Send Confirmation Message to new user
      await MailService.sendAccountActivationCode({ email, token: confirmationCode });
      return "Account created successfuly!";
    } catch (error) {
      throw error;
    }
  };

  static confirmAccount = async (confirmationCode: string) => {
    try {
      const user = await User.findOne({ confirmationCode });
      if (!user) return "Invalid or Expired confirmation code";

      const updateData = { status: AccountStatusEnum.ACTIVATED, confirmationCode: null };
      await User.findOneAndUpdate({ _id: user._id }, updateData, {
        new: true,
        runValidators: true,
      });
      //Send Account confirmation Success mail
      await MailService.sendAccountSuccessEmail({ email: user.email });

      return "Account Activation was successful";
    } catch (error) {
      throw error;
    }
  };

  static login = async (email: string, password: string) => {
    try {
      return await User.findByCredentials(email, password);
    } catch (error) {
      throw error;
    }
  };

  static async userProfile(id: any) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static logout(ctx: MyContext): Promise<string> {
    return new Promise((resolve, reject) =>
      ctx.req.session.destroy((error) => {
        if (error) {
          console.log(error);
          return reject("Error occured, please try again");
        }

        ctx.res.clearCookie("authToken");
        return resolve("You have successfully logged out of this system");
      })
    );
  }

  static async forgetPassword(email: string) {
    try {
      // Search for user Account
      const user = await User.findOne({ email });
      if (!user) return "Sorry, we don't recognize this account";
      //Generate reset Password Token
      const resetToken = await user.generateResetPasswordToken();
      await MailService.sendPasswordReset({ name: user.firstName, email, token: resetToken });
      return "Reset password link has been sent to your Email✅";
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(token: string, password: string) {
    // Hash token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) return "Invalid or Expired Token";
      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return "Password reset successfully ✅";
    } catch (error) {
      throw error;
    }
  }
}
