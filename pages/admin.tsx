import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import { ALL_USERS } from "../src/graphql/admin";
import { Stack, Spinner } from "@chakra-ui/core";
import { Table, Icon } from "semantic-ui-react";
import { FC, memo, useContext, useEffect } from "react";
import { User } from "../typings/graphql";
import { AuthContext } from "../src/Context/Auth";
import Router from "next/router";

const UserRow: FC<{ user: Pick<User, "admin" | "email" | "name"> }> = memo(
  ({ user: { email, name, admin } }) => {
    return (
      <Table.Row>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>
          {admin ? <Icon name="check" /> : <Icon name="close" />}
        </Table.Cell>
      </Table.Row>
    );
  }
);

const AdminPage: NextPage = () => {
  const { user, firstLoading } = useContext(AuthContext);
  const { data, loading } = useQuery(ALL_USERS, {
    skip: !user?.admin,
  });

  useEffect(() => {
    if (!firstLoading && !user?.admin) {
      Router.replace("/");
    }
  }, [firstLoading, user]);

  return (
    <Stack>
      {(loading || !user?.admin) && <Spinner size="xl" alignSelf="center" />}
      {user?.admin && (
        <Table celled selectable sortable stackable>
          <Table.Header>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Nombre</Table.HeaderCell>
            <Table.HeaderCell>Admin</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {data?.allUsers.map((user) => {
              return <UserRow key={user.email} user={user} />;
            })}
          </Table.Body>
        </Table>
      )}
    </Stack>
  );
};

export default AdminPage;
