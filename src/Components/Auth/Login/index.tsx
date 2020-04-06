import { FC, useState } from "react";
import {
  Form,
  Header,
  Container,
  Divider,
  Grid,
  Segment,
  Message
} from "semantic-ui-react";
import sha512 from "crypto-js/sha512";
import { isEmail } from "validator";
import { useMutation } from "@apollo/react-hooks";
import Link from "next/link";
import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { CURRENT_USER, LOGIN } from "../../../graphql/auth";

const Login: FC = () => {
  const [login, { loading, error }] = useMutation(LOGIN, {
    update: (cache, data) => {
      if (data.data?.login) {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            current_user: data.data.login
          }
        });
      }
    }
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const invalidData = !isEmail(email) || !password;

  return (
    <Container textAlign="center">
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="black" textAlign="center" inverted>
            Autenticarse
          </Header>
          <Form
            size="large"
            onSubmit={ev => {
              ev.preventDefault();
              login({
                variables: {
                  input: { email, password: sha512(password).toString() }
                }
              });
            }}
          >
            <Segment stacked>
              <Form.Field>
                <Form.Input
                  name="email"
                  fluid
                  type="email"
                  value={email}
                  onChange={(_e, { value }) => setEmail(value)}
                  disabled={loading}
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email"
                  label="Email"
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  fluid
                  name="password"
                  value={password}
                  icon="lock"
                  label="Contraseña"
                  iconPosition="left"
                  placeholder="contraseña..."
                  type="password"
                  onChange={(_e, { value }) => setPassword(value)}
                  disabled={loading}
                />
              </Form.Field>
              <Divider hidden />
              <Form.Button
                type="submit"
                fluid
                size="large"
                positive
                disabled={loading || invalidData}
                loading={loading}
              >
                Login
              </Form.Button>
            </Segment>
            <ErrorGQLAlert error={error} />
          </Form>
          <Message>
            ¿Eres nuevo?{" "}
            <Link href="/signup" passHref>
              <a>Registrate</a>
            </Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Login;
