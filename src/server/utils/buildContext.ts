import { Request, Response } from "express";

import { User } from "../entities";

const promisifiedLogin = <T = any, S = any>(
  req: Request,
  user: T,
  options: S
) =>
  new Promise((resolve, reject) =>
    req.login(user, options, err => {
      if (err) reject(err);
      else resolve();
    })
  );

export const buildContext = <OptionsType = any>({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  return {
    login: (user: User, options?: OptionsType) =>
      promisifiedLogin(req, user, options),
    logout: () => {
      if (req.session) {
        req.session.destroy(() => {});
      }
      res.clearCookie("connect.sid");
      req.logout();
    },
    isAuthenticated: () => req.isAuthenticated(),
    isUnauthenticated: () => req.isUnauthenticated(),
    get user(): User {
      return req.user;
    },
  };
};
