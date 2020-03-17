import { buildContext } from "../utils";

export type IContext = ReturnType<typeof buildContext>;

export interface IProduct {
  name: string;
  price: string;
  url: string;
  image: string;
}
