import { NextPage } from "next";

import { Stack } from "@chakra-ui/core";

import Login from "../src/Components/Auth/Login";

const LoginPage: NextPage = () => {
  return (
    <Stack padding="10px" bg="teal.500">
      <Login />
    </Stack>
  );
};

export default LoginPage;
