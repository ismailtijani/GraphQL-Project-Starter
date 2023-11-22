import { DocumentType, ReturnModelType, getModelForClass, pre, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import bcrypt from "bcrypt";
import { Field, ID, ObjectType, Int, Root } from "type-graphql";
import { AccountStatusEnum, UserLevelEnum } from "../../library/enums";
import { GraphQLError } from "graphql";
import crypto from "crypto";

//Hashing User plain text password before saving
@pre<Users>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
    next();
  }
})
//User Calls declaring TypeGraphQL, Typpegoose and Typescript interface
@ObjectType()
export class Users {
  @Field(() => ID)
  readonly _id: Types.ObjectId;

  // FirstName
  @Field({ description: "The first name of the user" })
  @prop({ required: [true, "First name must be provided"], trim: true })
  public firstName!: string;

  // LastName
  @Field()
  @prop({ required: [true, "Last name must be provided"], trim: true })
  public lastName!: string;

  // FullName
  // @Field()
  // public fullName(@Root() parent: Users): string {
  //   console.log(parent.firstName); //Returning undefined, check it out later
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  // Email
  @Field()
  @prop({ required: [true, "Email is required"], unique: true, trim: true, lowercase: true })
  public email!: string;

  // PhoneNumber
  @Field(() => Int, { nullable: true })
  @prop({ type: String })
  public phoneNumber?: string;

  // Status
  @Field()
  @prop({
    type: String,
    enum: Object.values(AccountStatusEnum),
    default: AccountStatusEnum.PENDING,
  })
  public status?: AccountStatusEnum;

  // Role
  @Field()
  @prop({ type: String, enum: Object.values(UserLevelEnum), default: UserLevelEnum.isUser })
  userLevel?: UserLevelEnum;

  // Password
  @prop({ required: [true, "Password is required"] })
  password: string;

  //Confrimation Code
  @prop({ type: String, select: false })
  confirmationCode: string | null;

  // Reset Password Token
  @prop({ select: false })
  resetPasswordToken?: string;

  // Reset Password Expirying Date
  @prop({ select: false })
  resetPasswordExpire?: number;

  // Generate and hash password token (Instance Method)
  public async generateResetPasswordToken(this: DocumentType<Users>) {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash token and send to resetPassword token field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set expire
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    await this.save();
    return resetToken;
  }

  //Login User Authentication (Static Method)
  public static async findByCredentials(
    this: ReturnModelType<typeof Users>,
    email: string,
    password: string
  ) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        //Change to new Error for separation of concerns
        throw new GraphQLError("Invalid Email or Password", {
          extensions: { code: 400 },
        });
      } else if (user && user.status !== AccountStatusEnum.ACTIVATED)
        throw new GraphQLError(
          "Account not activated, kindly check your mail for activation link",
          {
            extensions: { code: 400 },
          }
        );
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new GraphQLError("Email or Password is incorrect", { extensions: { code: 400 } });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

//Removing sensitive datas from the user
// User.prototype.toJSON = function () {
//   const userObject = this.toObject();
//   delete userObject.password;
//   delete userObject.confirmationCode;
//   return userObject;
// };

const UserModel = getModelForClass(Users, { schemaOptions: { timestamps: true } });
export { UserModel as User };
