import { toNumber } from "lodash";

export const priceStringToNumber = (price: string) => {
  return toNumber(price?.replace(/(\.)|(\$)|(c\/u)/gi, ""));
};
