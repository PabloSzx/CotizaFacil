import { NextPage } from "next";

import { Stack } from "@chakra-ui/core";

import SignUp from "../src/Components/Auth/SignUp";

const SignUpPage: NextPage = () => {
  return (
    <Stack padding="50px">
      <SignUp />
    </Stack>
  );
};

export default SignUpPage;
