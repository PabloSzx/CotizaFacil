import { ApolloError } from "apollo-client";
import { FC } from "react";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from "@chakra-ui/core";

export const ErrorGQLAlert: FC<{ error?: ApolloError } & AlertProps> = ({
  error,
  ...props
}) => {
  if (error) {
    console.error({
      error,
    });
    return (
      <Alert status="error" {...props}>
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>
          {error.graphQLErrors.length === 0 && error.message}
          {error.graphQLErrors.map((value) => value.message).join("|")}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
