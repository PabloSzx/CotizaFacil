import gql from "graphql-tag";
import { createContext, FC, useEffect, useState } from "react";
import { useQuery } from "react-apollo";

export type IAuthenticatedUser = {
  email: string;
  name: string;
  admin: boolean;
};

export const AuthContext = createContext<{
  user: IAuthenticatedUser | null;
  setUser: (user: IAuthenticatedUser | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);

  const { loading, data } = useQuery<{ current_user: IAuthenticatedUser }>(
    gql`
      query {
        current_user {
          email
          name
          admin
        }
      }
    `,
    {
      ssr: false,
    }
  );

  useEffect(() => {
    if (!loading && data) setUser(data.current_user);
  }, [loading, data]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
