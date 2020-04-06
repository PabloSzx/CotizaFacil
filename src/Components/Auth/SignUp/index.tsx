import gql, { DocumentNode } from "graphql-tag-ts";
import { FC, useState } from "react";
import { Form, Header, Container, Divider,Grid, Segment, Message } from "semantic-ui-react";

import { useMutation } from "@apollo/react-hooks";

import { ErrorGQLAlert } from "../../ErrorGQLAlert";
import { currentUserGQL, IAuthenticatedUser } from "../Context";

const signUpGQL: DocumentNode<
  { sign_up: IAuthenticatedUser },
  { email: string; password: string; name: string }
> = gql`
  mutation($email: String!, $password: String!, $name: String!) {
    sign_up(email: $email, password: $password, name: $name) {
      email
      name
      admin
    }
  }
`;
const SignUp: FC = () => {
  const [signUp, { loading: loading, error }] = useMutation(signUpGQL, {
    update: (cache, data) => {
      if (data.data?.sign_up) {
        cache.writeQuery({
          query: currentUserGQL,
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

  return (
    <Container textAlign='center'>
      <Grid textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color='teal' textAlign='center'>Registro</Header>

          <Form 
            size='large'
            onSubmit={ev => {
              ev.preventDefault();
              signUp({ variables: { email, password, name } });
            }}
          >
            <Segment stacked>
              <Divider hidden />
              <ErrorGQLAlert error={error} />
              <Form.Field>
                <Form.Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(_e, { value }) => setEmail(value)}
                  disabled={loading}
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  label='Email'
                />
              </Form.Field>
              <Divider hidden />
              <Form.Field>
                <Form.Input
                  name="name"
                  type="text"
                  value={name}
                  onChange={(_e, { value }) => setName(value)}
                  disabled={loading}
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Nombre'
                  label='Nombre'
                />
              </Form.Field>
              <Divider hidden />
              <Form.Field>
                <Form.Input
                  name="password"
                  value={password}
                  type="password"
                  onChange={(_e, { value }) => setPassword(value)}
                  disabled={loading}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  label='Password'
                />
              </Form.Field>
              <Divider hidden />
              <Form.Button  type="submit"  fluid size='large' positive disabled={loading} loading={loading}>
              Registrarse
              </Form.Button>
              <Divider hidden />
            </Segment>
          </Form>
          <Message>
            ¿Ya estás registrado? <a href='#'>Ingresa</a>
          </Message>
        </Grid.Column>    
      </Grid>    
    </Container>
  );
};

export default SignUp;
