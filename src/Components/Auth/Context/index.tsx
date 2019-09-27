import gql from "graphql-tag";
import { createContext, FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-apollo";

export type IAuthenticatedUser = {
  email: string;
  name: string;
  admin: boolean;
};

export const AuthContext = createContext<{
  user: IAuthenticatedUser | null;
  login: (data: {
    email: string;
    password: string;
  }) => Promise<IAuthenticatedUser>;
  logout: () => Promise<null>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<IAuthenticatedUser>;
  loading: boolean;
}>({
  user: null,
  login: async () => ({ email: "", name: "", admin: false }),
  logout: async () => null,
  signUp: async () => ({ email: "", name: "", admin: false }),
  loading: false,
});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);

  const { loading: loadingCurrentUser, data } = useQuery<{
    current_user: IAuthenticatedUser;
  }>(
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

  const [doLogin, { loading: loadingLogin }] = useMutation<
    { login: IAuthenticatedUser },
    { email: string; password: string }
  >(gql`
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        email
        name
        admin
      }
    }
  `);

  const [doSignUp, { loading: loadingSignUp }] = useMutation<
    { sign_up: IAuthenticatedUser },
    { email: string; password: string; name: string }
  >(gql`
    mutation($email: String!, $password: String!, $name: String!) {
      sign_up(email: $email, password: $password, name: $name) {
        email
        name
        admin
      }
    }
  `);

  const [doLogout, { loading: loadingLogout }] = useMutation<{
    logout: boolean;
  }>(gql`
    mutation {
      logout
    }
  `);

  useEffect(() => {
    setLoading(
      loadingCurrentUser || loadingLogin || loadingSignUp || loadingLogout
    );
  }, [loadingCurrentUser, loadingLogin, loadingSignUp, loadingLogout]);

  useEffect(() => {
    if (!loadingCurrentUser && data) setUser(data.current_user);
  }, [loadingCurrentUser, data]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data, errors } = await doLogin({
        variables: { email, password },
      });
      if (errors && errors.length > 0)
        throw new Error(errors.map(v => v.message).join("|"));

      if (data) {
        setUser(data.login);

        return data.login;
      }
      throw new Error("Data Not Found!");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { data, errors } = await doLogout();
      if (errors && errors.length > 0)
        throw new Error(errors.map(v => v.message).join("|"));
      if (data && data.logout) setUser(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
    return null;
  };

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const { data, errors } = await doSignUp({
        variables: { email, password, name },
      });
      if (errors && errors.length > 0)
        throw new Error(errors.map(v => v.message).join("|"));

      if (data) {
        setUser(data.sign_up);
        return data.sign_up;
      }
      throw new Error("Data Not Found!");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        login,
        logout,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
