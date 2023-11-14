import { Stream } from "stream";

export interface Upload {
  filename: string;
  mimesize: string;
  encoding: string;
  createReadStream: () => Stream;
}
