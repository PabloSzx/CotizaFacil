import { reduce } from "lodash";

export const updateSetTemplate = (
  obj: Record<string, any>,
  {
    conflictKeys,
    updateKeys,
    ignoreKeys
  }: {
    conflictKeys: string[] | string;
    updateKeys?: string[] | string;
    ignoreKeys?: string[] | string;
  }
) => {
  if (updateKeys && !Array.isArray(updateKeys)) {
    updateKeys = [updateKeys];
  }
  if (ignoreKeys && !Array.isArray(ignoreKeys)) {
    ignoreKeys = [ignoreKeys];
  }
  if (!Array.isArray(conflictKeys)) {
    conflictKeys = [conflictKeys];
  }
  return `(${conflictKeys.join(",")}) DO UPDATE SET ${reduce(
    obj,
    (acum, value, key) => {
      if (updateKeys && !updateKeys.includes(key)) {
        return acum;
      }
      if (ignoreKeys && ignoreKeys.includes(key)) {
        return acum;
      }

      if (acum !== "") {
        acum += ",";
      }

      acum += ` ${key}='${value}'`;

      return acum;
    },
    ""
  )}`;
};
