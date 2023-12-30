import { ObjectId } from "mongoose";

export default class Server {
  constructor(
    public _id: ObjectId,
    public id: string,
    public name: string,
    public ip: string,
    public waifu: Array<String>,
    public description: string,
    public invite: string,
    public splash: string
  ) {}
}
