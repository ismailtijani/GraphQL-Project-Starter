import { Arg, Mutation, Resolver } from "type-graphql";
import GraphQLUpload from "graphql-upload";
import { createWriteStream } from "fs";
import { Upload } from "../../typeDefs/typeDef";

@Resolver()
export class AddProfilePicture {
  @Mutation(() => Boolean)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload
  ): Promise<boolean> {
    return new Promise(async (resolve, rejects) =>
      createReadStream()
        .pipe(createWriteStream(__dirname + `../../images/${filename}`))
        .on("finish", () => resolve(true))
        .on("error", () => rejects(false))
    );
  }
}
