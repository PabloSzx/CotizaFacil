import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { Button } from "semantic-ui-react";

import { Box, Flex, Stack } from "@chakra-ui/core";

import { AuthContext } from "../Auth/Context";

export const Navigation: FC = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const Router = useRouter();

  useEffect(() => {
    switch (Router?.pathname) {
      case "/login":
      case "/signup": {
        if (user) {
          Router.push("/");
        }
        break;
      }
    }
  }, [user, Router?.pathname]);

  return (
    <Stack
      isInline
      justifyContent="flex-end"
      padding="10px"
      marginBottom="15px"
    >
      <Box>
        <Button
          color="blue"
          onClick={() => {
            Router.push("/");
          }}
        >
          Inicio
        </Button>
      </Box>
      {user ? (
        <Stack isInline spacing="1em">
          <Box>
            <h1>Bienvenido {user.name}</h1>
          </Box>
          <Box>
            <Button negative onClick={() => logout()} loading={loading}>
              Cerrar Sesión
            </Button>
          </Box>
        </Stack>
      ) : (
        <Stack isInline>
          <Box>
            <Button
              positive
              onClick={() => {
                Router.push("/login");
              }}
            >
              Autenticarse
            </Button>
          </Box>
          <Box>
            <Button
              positive
              onClick={() => {
                Router.push("/signup");
              }}
            >
              Registrarse
            </Button>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
