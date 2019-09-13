import { AuthChecker } from "type-graphql";

import { ADMIN } from "../../consts";
import { IContext } from "../interfaces/server";

export const authChecker: AuthChecker<IContext> = async (
  { context: { isAuthenticated, user } },
  roles
) => {
  const authenticated = isAuthenticated();

  if (!authenticated) return false;

  for (const role of roles) {
    switch (role) {
      case ADMIN: {
        if (!user.admin) return false;
        continue;
      }
      default:
    }
  }
  return true;
};
