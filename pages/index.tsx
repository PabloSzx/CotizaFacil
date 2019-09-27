import { NextPage } from "next";
import { useContext } from "react";
import { Button, Segment } from "semantic-ui-react";

import { AuthContext } from "../src/Components/Auth/Context";
import Login from "../src/Components/Auth/Login";
import SignUp from "../src/Components/Auth/SignUp";

const Index: NextPage = () => {
  const { user, logout, loading } = useContext(AuthContext);

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
    </div>
  );
};

export default Index;
