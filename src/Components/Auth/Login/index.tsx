import gql, { DocumentNode } from "graphql-tag-ts";
import { FC, useState } from "react";
import { Form, Header, Container, Divider,Grid, Segment, Message } from "semantic-ui-react";

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
    <Container textAlign="center"  >
      <Grid textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }} >
          <Header as='h1' color="black" textAlign='center' inverted>
            Login
            {/* <Image src='/logo.png' /> Log-in to your account */}
          </Header>

          <Form 
            size='large' 
            onSubmit={ev => {
                ev.preventDefault();
                login({ variables: { email, password } });
          }}>
            <Segment stacked>
              <Divider hidden />
              <ErrorGQLAlert error={error} />
              <Form.Field>
                {/* <Label>Email</Label> */}
                <Form.Input
                  name="email"
                  type="email"
                  fluid 
                  value={email}
                  onChange={(_e, { value }) => setEmail(value)}
                  disabled={loading}
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  label='Email'
                />
              </Form.Field>
              <Divider hidden />              

              <Form.Field>
                {/* <Label>Password</Label> */}
                <Form.Input
                  fluid
                  name='password'
                  label='Password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  value={password}
                  type='password'
                  onChange={(_e, { value }) => setPassword(value)}
                  disabled={loading}
                />
              </Form.Field>
              <Divider hidden />
              {/* <Button color='teal' fluid size='large'>
                Login
              </Button> */}

              <Form.Button type="submit"  fluid size='large' positive disabled={loading} loading={loading}>
                Login
              </Form.Button>
            </Segment>
          </Form>

          <Message>
            ¿Eres nuevo? <a href='#'>Registrate</a>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>    
  );
};

export default Login;
