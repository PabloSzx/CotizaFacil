import gql from "graphql-tag";
import { NextPage } from "next";
import { useQuery } from "react-apollo";

const Index: NextPage = () => {
  const { data } = useQuery<{ HelloWorld: string }>(gql`
    query {
      HelloWorld
    }
  `);
  return <div>{data && data.HelloWorld}</div>;
};

export default Index;
