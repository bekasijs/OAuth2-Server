const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const redis = require('./../adapters/redis');

let opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JWTStrategy(opts, (payload, done) => {
  redis.get(`AccessToken:${JSON.stringify(payload)}`, (err, data) => {
    if (err) return done(err, false);
    if (!data) return done(false, false);
    if (data) return done(false, JSON.parse(data));
  });
}));