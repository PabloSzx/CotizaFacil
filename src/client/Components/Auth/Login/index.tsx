import { FC, useContext, useState } from "react";
import { Form, Header, Input, Label } from "semantic-ui-react";

import { AuthContext } from "../Context";

const Login: FC = () => {
  const { login, loading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={ev => {
        ev.preventDefault();
        login({ email, password });
      }}
    >
      <Header as="h1">Login</Header>

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
