import { FC, useContext, useState } from "react";
import { Form, Header, Input, Label } from "semantic-ui-react";

import { AuthContext } from "../Context";

const SignUp: FC = () => {
  const { signUp, loading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={ev => {
        ev.preventDefault();
        signUp({ email, password, name });
      }}
    >
      <Header as="h1">Sign Up</Header>
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
        <Label>Name</Label>
        <Input
          name="name"
          type="text"
          value={name}
          onChange={(_e, { value }) => setName(value)}
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
        Sign Up
      </Form.Button>
    </Form>
  );
};

export default SignUp;
