import gql from "graphql-tag";
import { NextPage } from "next";
import { useContext } from "react";
import { useQuery } from "react-apollo";
import { Button, Segment } from "semantic-ui-react";

import { AuthContext } from "../src/client/Components/Auth/Context";
import Login from "../src/client/Components/Auth/Login";
import SignUp from "../src/client/Components/Auth/SignUp";

const Index: NextPage = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const { data } = useQuery<{ HelloWorld: string }>(gql`
    query {
      HelloWorld
    }
  `);
  return (
    <div>
      <div>
        {user ? (
          <>
            <h1>Welcome {user.name}</h1>
            <br></br>
            <Button negative onClick={() => logout()} loading={loading}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Segment.Group>
              <Segment>
                <Login />
              </Segment>
              <Segment>
                <SignUp />
              </Segment>
            </Segment.Group>
          </>
        )}
      </div>
      <div>{data && data.HelloWorld}</div>
    </div>
  );
};

export default Index;
