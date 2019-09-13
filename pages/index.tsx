import gql from "graphql-tag";
import { NextPage } from "next";
import { useContext } from "react";
import { useQuery } from "react-apollo";

import { AuthContext } from "../src/client/Components/Auth/Context";

const Index: NextPage = () => {
  const { user } = useContext(AuthContext);
  const { data } = useQuery<{ HelloWorld: string }>(gql`
    query {
      HelloWorld
    }
  `);
  return (
    <div>
      <div>
        {user && (
          <>
            <h1>Welcome {user.name}</h1>
            <br></br>
          </>
        )}
      </div>
      <div>{data && data.HelloWorld}</div>
    </div>
  );
};

export default Index;
