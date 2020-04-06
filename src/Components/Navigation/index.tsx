import { useRouter } from "next/router";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Icon } from "semantic-ui-react";

import { Box, Stack, Flex, Heading } from "@chakra-ui/core";

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
          <Heading as="h1" size="xl">
            CotizaFácil
          </Heading>
      </Flex>

     
      <Stack
        isInline
        justifyContent={user ? "space-between" : "flex-end"}
        alignContent="space-around"
        padding="10px"
        flexWrap="wrap"
        shouldWrapChildren
        spacing="10px"
      >
        
        {user && (
            <Stack isInline m={1}>

              <Box>
                <h1>Bienvenido {user.name}</h1>                
              </Box>
              <Box 
              display={{ sm: "none", md: "flex" }}
              width={{ sm: "full", md: "auto" }}
              alignItems="center"
              flexGrow={1}
              >
                <MyQuotations />
              </Box>
            </Stack>
          )}
       

        <Stack isInline shouldWrapChildren spacing="1em" m={1} flexWrap="wrap">
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
                      color="blue" 
                      border="1px"
                      onClick={() => {
                        Router.push("/login");
                      }}
                    >
                      Login
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      positive
                      onClick={() => {
                        Router.push("/signup");
                      }}
                      bg="transparent" border="1px"
                    >
                      Registro
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
