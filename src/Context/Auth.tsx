import { ApolloError } from "apollo-client";

import {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { CURRENT_USER, IAuthenticatedUser, LOGOUT } from "../graphql/auth";

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
  firstLoading: true,
});

export const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState<IAuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const stateRef = useRef({ firstLoading: true });

  const {
    loading: loadingCurrentUser,
    data,
    error: errorCurrentUser,
  } = useQuery(CURRENT_USER, {
    ssr: false,
  });

  const [
    doLogout,
    { loading: loadingLogout, error: errorLogout },
  ] = useMutation<{
    logout: boolean;
  }>(LOGOUT, {
    update: (cache) => {
      cache.writeQuery({
        query: CURRENT_USER,
        data: { current_user: null },
      });
    },
  });

  useEffect(() => {
    const isLoading = loadingCurrentUser || loadingLogout;
    setLoading(isLoading);
    if (!isLoading) {
      stateRef.current.firstLoading = false;
    }
  }, [loadingCurrentUser, loadingLogout]);

  useEffect(() => {
    if (!loadingCurrentUser && data?.current_user) setUser(data.current_user);
  }, [loadingCurrentUser, data]);

  const logout = useCallback(async () => {
    try {
      const { data, errors } = await doLogout();
      if (errors && errors.length > 0)
        throw new Error(errors.map((v) => v.message).join("|"));
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
        ...stateRef.current,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
