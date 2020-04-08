import { NextPage } from "next";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  ALL_USERS,
  IUser,
  UPDATE_USER,
  REMOVE_USER
} from "../src/graphql/admin";
import {
  Stack,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalOverlay,
  Box,
  Input,
  Checkbox,
  Button,
  Text,
  ModalHeader
} from "@chakra-ui/core";
import { Table, Icon } from "semantic-ui-react";
import { FC, memo, useContext, useEffect, useState, ChangeEvent } from "react";
import { AuthContext } from "../src/Context/Auth";
import Router from "next/router";
import { Confirm } from "../src/Components/Confirm";
import { ErrorGQLAlert } from "../src/Components/ErrorGQLAlert";
import { CURRENT_USER } from "../src/graphql/auth";
import { useUpdateEffect } from "react-use";
import ms from "ms";
import { usePagination } from "../src/utils/pagination";

const THIRTY_SECS = ms("30 seconds");

const UserModal: FC<{
  user: IUser;
  children: (openModal: () => void) => JSX.Element;
}> = ({ children, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: authenticatedUser } = useContext(AuthContext);

  const [updateUser, dataUpdateUser] = useMutation(UPDATE_USER, {
    update: (cache, { data }) => {
      if (data?.updateUser) {
        if (data.updateUser.email === authenticatedUser?.email) {
          cache.writeQuery({
            query: CURRENT_USER,
            data: {
              current_user: data.updateUser
            }
          });
        }
        const dataAllUsers = cache.readQuery<{
          allUsers: IUser[];
        }>({
          query: ALL_USERS
        });

        cache.writeQuery({
          query: ALL_USERS,
          data: {
            allUsers: dataAllUsers?.allUsers.map(user => {
              if (user.email === data?.updateUser.email) {
                return data?.updateUser;
              }
              return user;
            })
          }
        });
      }
    },
    refetchQueries: [
      {
        query: ALL_USERS
      }
    ]
  });
  const [removeUser, dataRemoveUser] = useMutation(REMOVE_USER, {
    variables: {
      email: user.email
    },
    update: (cache, { data }) => {
      if (data?.removeUser) {
        const dataAllUsers = cache.readQuery<{
          allUsers: IUser[];
        }>({
          query: ALL_USERS
        });

        cache.writeQuery({
          query: ALL_USERS,
          data: {
            allUsers: dataAllUsers?.allUsers.filter(userValue => {
              return userValue.email !== user.email;
            })
          }
        });
      }
    }
  });
  const [name, setName] = useState(user.name);
  const [admin, setAdmin] = useState(user.admin);

  useUpdateEffect(() => {
    setName(user.name);
  }, [user.name]);
  useUpdateEffect(() => {
    setAdmin(user.admin);
  }, [user.admin]);

  return (
    <>
      {children(onOpen)}
      <Modal isOpen={isOpen} onClose={onClose} size="fit-content">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>{user.email}</Text>
          </ModalHeader>
          <ModalBody>
            <Stack shouldWrapChildren spacing="50px">
              {dataUpdateUser.error && (
                <ErrorGQLAlert error={dataUpdateUser.error} />
              )}
              {dataRemoveUser.error && (
                <ErrorGQLAlert error={dataRemoveUser.error} />
              )}
              <Box>
                <Text>Nombre</Text>

                <Input
                  type="text"
                  value={name}
                  onChange={({
                    target: { value }
                  }: ChangeEvent<HTMLInputElement>) => {
                    if (value.length <= 50) {
                      setName(value);
                    }
                  }}
                  width="40em"
                  maxWidth="100%"
                />
              </Box>
              <Box>
                <Checkbox
                  border="1px solid grey"
                  isChecked={admin}
                  isDisabled={authenticatedUser?.email === user.email}
                  onChange={() => {
                    setAdmin(admin => !admin);
                  }}
                  padding="10px"
                >
                  Admin
                </Checkbox>
              </Box>
              <Box>
                <Button
                  isLoading={dataUpdateUser.loading}
                  onClick={() => {
                    updateUser({
                      variables: {
                        user: {
                          email: user.email,
                          name,
                          admin
                        }
                      }
                    });
                  }}
                  isDisabled={
                    dataUpdateUser.loading ||
                    !name ||
                    (user.name === name && user.admin === admin)
                  }
                  variantColor="blue"
                >
                  Guardar cambios
                </Button>
              </Box>
              <Box>
                <Confirm
                  header={`¿Estás seguro que deseas eliminar el usuario ${user.email} ${user.name}?`}
                  content="El usuario tendrá que registrarse de nuevo si así lo desea"
                >
                  <Button
                    isLoading={dataRemoveUser.loading}
                    variantColor="red"
                    isDisabled={
                      dataRemoveUser.loading ||
                      authenticatedUser?.email === user.email
                    }
                    onClick={() => {
                      removeUser();
                    }}
                  >
                    Eliminar usuario
                  </Button>
                </Confirm>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const UserRow: FC<{ user: IUser }> = memo(({ user }) => {
  const { email, name, admin } = user;
  return (
    <UserModal user={user}>
      {openModal => {
        return (
          <Table.Row
            className="pointer"
            onClick={() => {
              openModal();
            }}
          >
            <Table.Cell>{email}</Table.Cell>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>
              {admin ? <Icon name="check" /> : <Icon name="close" />}
            </Table.Cell>
          </Table.Row>
        );
      }}
    </UserModal>
  );
});

const AdminPage: NextPage = () => {
  const { user, firstLoading } = useContext(AuthContext);
  const { data, loading } = useQuery(ALL_USERS, {
    skip: !user?.admin,
    pollInterval: THIRTY_SECS
  });

  useEffect(() => {
    if (!firstLoading && !user?.admin) {
      Router.replace("/");
    }
  }, [firstLoading, user]);

  const { selectedData, pagination } = usePagination({
    name: "CotizaFacilAdminUsersPagination",
    data: data?.allUsers
  });

  return (
    <Stack
      padding="10px"
      shouldWrapChildren
      spacing="10px"
      justify="center"
      align="center"
    >
      {(loading || !user?.admin) && <Spinner size="xl" alignSelf="center" />}
      {user?.admin && (
        <>
          <Box textAlign="center">{pagination}</Box>
          <Table celled selectable stackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Nombre</Table.HeaderCell>
                <Table.HeaderCell>Admin</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {selectedData.map(user => {
                return <UserRow key={user.email} user={user} />;
              })}
            </Table.Body>
          </Table>
        </>
      )}
    </Stack>
  );
};

export default AdminPage;
