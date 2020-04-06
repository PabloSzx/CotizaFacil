import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";

import { Box, Stack, Flex, Heading } from "@chakra-ui/core";

import { AuthContext } from "../../Context/Auth";
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

  const showMyQuotations = user && Router.pathname === "/";

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Heading
          as="h1"
          size="xl"
          className="pointer"
          onClick={() => {
            Router.push("/");
          }}
        >
          CotizaFácil
        </Heading>
      </Flex>
      <Stack
        isInline
        justifyContent={showMyQuotations ? "space-between" : "flex-end"}
        alignContent="space-around"
        alignItems="center"
        padding="10px"
        flexWrap="wrap"
        shouldWrapChildren
        spacing="10px"
      >
        {user && (
          <Box>
            <h1>Bienvenido {user?.name}</h1>
          </Box>
        )}

        <Stack isInline shouldWrapChildren spacing="1em" m={1} flexWrap="wrap">
          {showMyQuotations && (
            <Box
              display={{ sm: "none", md: "flex" }}
              width={{ sm: "full", md: "auto" }}
              flexGrow={1}
            >
              <MyQuotations />
            </Box>
          )}

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
                <Stack
                  alignItems="center"
                  justifySelf="flex-end"
                  isInline
                  spacing="1em"
                >
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
    </Flex>
  );
};
