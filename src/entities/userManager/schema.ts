import { Prop, getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Field, ID, ObjectType, Int, Root } from "type-graphql";
import { AccountStatusEnum, UserLevelEnum } from "../../library/enums";

@ObjectType()
export class User {
  @Field(() => ID)
  readonly _id: Types.ObjectId;

  // FirstName
  @Field({ description: "The first name of the user" })
  @prop({ required: [true, "First name must be provided"], trim: true })
  public firstName: string;

  // LastName
  @Field()
  @prop({ required: [true, "Last name must be provided"], trim: true })
  public lastName: string;

  // FullName
  @Field(() => String)
  fullName(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // Email
  @Field()
  @prop({ required: true, unique: true, trim: true, lowercase: true })
  public email: string;

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
  public status: string;

  // Role
  @Field()
  @prop({ type: String, enum: Object.values(UserLevelEnum), default: UserLevelEnum.isUser })
  userLevel: string;

  // Password
  @prop({ required: true })
  password: string;

  @prop()
  confirmationCode: String;

  @prop()
  resetPasswordToken: String;

  @prop()
  resetPasswordExpire: Date;
}

export const UserModel = getModelForClass(User);
