import { ApolloError } from "apollo-client";
import gql from "graphql-tag";
import { DocumentNode } from "graphql-tag-ts";
import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useMutation, useQuery } from "@apollo/react-hooks";

export type IAuthenticatedUser = {
  email: string;
  name: string;
  admin: boolean;
};

export const AuthContext = createContext<{
  user: IAuthenticatedUser | null;
  logout: () => Promise<null>;
  loading: boolean;
  firstLoading: boolean;
  error?: ApolloError;
}>({
  user: null,
  logout: async () => null,
  loading: true,
  firstLoading: true
});

export const currentUserGQL: DocumentNode<{
  current_user: IAuthenticatedUser;
}> = gql`
  query {
    current_user {
      email
      name
      admin
    }
  }
`;

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const stateRef = useRef({ firstLoading: true });

  const {
    loading: loadingCurrentUser,
    data,
    error: errorCurrentUser
  } = useQuery(currentUserGQL, {
    ssr: false
  });

  const [
    doLogout,
    { loading: loadingLogout, error: errorLogout }
  ] = useMutation<{
    logout: boolean;
  }>(
    gql`
      mutation {
        logout
      }
    `,
    {
      update: cache => {
        cache.writeQuery({
          query: currentUserGQL,
          data: { current_user: null }
        });
      }
    }
  );

  useEffect(() => {
    const isLoading = loadingCurrentUser || loadingLogout;
    setLoading(isLoading);
    if (!isLoading) {
      stateRef.current.firstLoading = false;
    }
  }, [loadingCurrentUser, loadingLogout]);

  useEffect(() => {
    if (!loadingCurrentUser && data) setUser(data.current_user);
  }, [loadingCurrentUser, data]);

  const logout = useCallback(async () => {
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
  }, [doLogout]);

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        logout,
        error: errorCurrentUser || errorLogout,
        ...stateRef.current
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
