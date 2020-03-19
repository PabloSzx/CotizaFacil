import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";

import { Box, Stack } from "@chakra-ui/core";

import { AuthContext } from "../Auth/Context";
import { MyQuotations } from "../MyQuotations";

export const Navigation: FC = () => {
  const { user, logout, loading, firstLoading } = useContext(AuthContext);
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
      justifyContent={user ? "space-between" : "flex-end"}
      padding="10px"
      marginBottom="15px"
      width="100%"
    >
      {user && (
        <Box>
          <MyQuotations />
        </Box>
      )}

      <Stack isInline shouldWrapChildren spacing="1em">
        <Button
          color="blue"
          onClick={() => {
            Router.push("/");
          }}
          icon
          labelPosition="left"
        >
          <Icon name="home" />
          Inicio
        </Button>

        {!firstLoading && (
          <>
            {user ? (
              <Stack justifySelf="flex-end" isInline spacing="1em">
                <Box>
                  <h1>Bienvenido {user.name}</h1>
                </Box>
                <Box>
                  <Button
                    disabled={loading}
                    negative
                    onClick={() => logout()}
                    loading={loading}
                    icon
                    labelPosition="left"
                  >
                    <Icon name="log out" />
                    Cerrar Sesión
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack isInline justifySelf="flex-end">
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
          </>
        )}
      </Stack>
    </Stack>
  );
};
