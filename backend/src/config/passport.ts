import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "JWT_SECRET",
};

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    done(null, { id: jwtPayload.id });
  })
);
