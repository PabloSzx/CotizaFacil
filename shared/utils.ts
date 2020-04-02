import { toNumber } from "lodash";

export const priceStringToNumber = (price: string) => {
  return toNumber(price?.replace(/[^0-9]/gi, ""));
};
