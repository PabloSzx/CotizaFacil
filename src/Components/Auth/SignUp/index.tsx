import { FC, useState } from "react";
import {
  Form,
  Header,
  Divider,
  Grid,
  Segment,
  Message,
  Container
} from "semantic-ui-react";
import sha512 from "crypto-js/sha512";
import { useMutation } from "@apollo/react-hooks";
import { isEmail } from "validator";
import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { CURRENT_USER, SIGN_UP } from "../../../graphql/auth";
import Link from "next/link";

const SignUp: FC = () => {
  const [signUp, { loading: loading, error }] = useMutation(SIGN_UP, {
    update: (cache, data) => {
      if (data.data?.sign_up) {
        cache.writeQuery({
          query: CURRENT_USER,
          data: {
            current_user: data.data.sign_up
          }
        });
      }
    }
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const invalidData = !isEmail(email) || !name || !password;

  return (
    <Container textAlign="center">
      <Grid
        textAlign="center"
        style={{ height: "100%" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1">Registrarse</Header>
          <Form
            size="large"
            onSubmit={ev => {
              ev.preventDefault();
              signUp({
                variables: {
                  input: { email, password: sha512(password).toString(), name }
                }
              });
            }}
          >
            <Segment stacked>
              <Divider hidden />
              <ErrorGQLAlert error={error} />
              <Form.Field>
                <Form.Input
                  fluid
                  name="email"
                  type="email"
                  label="Email"
                  icon="mail"
                  iconPosition="left"
                  placeholder="Email"
                  value={email}
                  onChange={(_e, { value }) => setEmail(value)}
                  disabled={loading}
                />
              </Form.Field>
              <Divider hidden />
              <Form.Field>
                <Form.Input
                  name="name"
                  type="text"
                  fluid
                  iconPosition="left"
                  placeholder="Nombre..."
                  icon="user"
                  label="Nombre"
                  value={name}
                  onChange={(_e, { value }) => {
                    if (value.length <= 50) {
                      setName(value);
                    }
                  }}
                  disabled={loading}
                />
              </Form.Field>
              <Divider hidden />
              <Form.Field>
                <Form.Input
                  name="password"
                  label="Contraseña"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="contraseña..."
                  value={password}
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
                Sign Up
              </Form.Button>
              <Divider hidden />
              <Message>
                ¿Ya estás registrado?{" "}
                <Link href="/login" passHref>
                  <a>Ingresa</a>
                </Link>
              </Message>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default SignUp;
