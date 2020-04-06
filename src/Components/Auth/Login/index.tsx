import { FC, useState } from "react";
import { Form, Header, Input, Label } from "semantic-ui-react";
import sha512 from "crypto-js/sha512";

import { useMutation } from "@apollo/react-hooks";

import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { CURRENT_USER, LOGIN } from "../../../graphql/auth";

const Login: FC = () => {
  const [login, { loading, error }] = useMutation(LOGIN, {
    update: (cache, data) => {
      if (data.data?.login) {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            current_user: data.data.login,
          },
        });
      }
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        login({ variables: { email, password: sha512(password).toString() } });
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
