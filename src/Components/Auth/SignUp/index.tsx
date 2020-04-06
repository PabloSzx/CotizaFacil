import { FC, useState } from "react";
import { Form, Header, Input, Label } from "semantic-ui-react";
import sha512 from "crypto-js/sha512";
import { useMutation } from "@apollo/react-hooks";

import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { CURRENT_USER, SIGN_UP } from "../../../graphql/auth";

const SignUp: FC = () => {
  const [signUp, { loading: loading, error }] = useMutation(SIGN_UP, {
    update: (cache, data) => {
      if (data.data?.sign_up) {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            current_user: data.data.sign_up,
          },
        });
      }
    },
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        signUp({
          variables: { email, password: sha512(password).toString(), name },
        });
      }}
    >
      <Header as="h1">Sign Up</Header>

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
