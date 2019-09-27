import { Router } from "express";
import ExpressSession from "express-session";
import passport from "passport";
import requireEnv from "require-env-variable";
import { Repository } from "typeorm";
import { TypeormStore } from "typeorm-store";

import { WRONG_INFO } from "../consts";
import { connection } from "../db";
import { Session, User } from "../entities";

const { COOKIE_KEY } = requireEnv(["COOKIE_KEY"]);
export const auth = Router();

function SessionMiddleware(repository: Repository<Session>) {
  return ExpressSession({
    secret: COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 86400000, secure: false },
    store: new TypeormStore({ repository }),
  });
}

auth.use(async (req, res, next) => {
  SessionMiddleware((await connection).getRepository(Session))(req, res, next);
});

auth.use(passport.initialize());
auth.use(passport.session());

passport.serializeUser<User, string>((user, cb) => {
  if (user) cb(null, user.email);
  else cb(WRONG_INFO);
});

passport.deserializeUser<User | null, string>(async (id, done) => {
  try {
    const UserRepository = (await connection).getRepository(User);

    const user = await UserRepository.findOne(id);

    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  } catch (err) {
    console.error(err);
  }
});

export const requireAuth = Router();
requireAuth.use(auth, (req, res, next) => {
  if (req.user && req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
});
