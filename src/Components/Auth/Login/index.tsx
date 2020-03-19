import gql, { DocumentNode } from "graphql-tag-ts";
import { FC, useState } from "react";
import { Form, Header, Input, Label } from "semantic-ui-react";

import { useMutation } from "@apollo/react-hooks";

import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { currentUserGQL, IAuthenticatedUser } from "../Context";

const loginGQL: DocumentNode<
  { login: IAuthenticatedUser },
  { email: string; password: string }
> = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      name
      admin
    }
  }
`;

const Login: FC = () => {
  const [login, { loading, error }] = useMutation(loginGQL, {
    update: (cache, data) => {
      if (data.data?.login) {
        cache.writeQuery({
          query: currentUserGQL,
          data: {
            current_user: data.data.login
          }
        });
      }
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={ev => {
        ev.preventDefault();
        login({ variables: { email, password } });
      }}
    >
      <Header as="h1">Login</Header>

      <ErrorGQLAlert error={error} />
      <Form.Field>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(_e, { value }) => setEmail(value)}
          disabled={loading}
        />
      </Form.Field>
      <Form.Field>
        <Label>Password</Label>
        <Input
          name="password"
          value={password}
          type="password"
          onChange={(_e, { value }) => setPassword(value)}
          disabled={loading}
        />
      </Form.Field>
      <Form.Button type="submit" positive disabled={loading} loading={loading}>
        Login
      </Form.Button>
    </Form>
  );
};

export default Login;
