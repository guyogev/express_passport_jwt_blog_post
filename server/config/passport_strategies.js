import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import jwtHelper from '../helpers/jwt_helper'

const db = require('../models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

module.exports = (app) => {
  app.use(passport.initialize());
  // Serialize Sessions
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize Sessions
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  /* ******************* PASSWORD ******************* */
  const verifyByPassword = (email, password, done) => {
    db.User.findOne({ where: { email } })
      .then((dbuser) => {
        if (!dbuser) {
          done(false, null);
        } else {
          bcrypt.compare(password, dbuser.password_digest, (err, isvalid) => {
            if (isvalid) {
              done(null, dbuser);
            } else {
              done(err, null);
            }
          });
        }
      })
      .error((err) => {
        console.log('LocalStrategy err', err);
        done(err, null);
      });
  };
  const by_password_options = {
    usernameField: 'email',
    passwordField: 'password',
  };

  const by_password = new LocalStrategy(by_password_options, verifyByPassword);

  /* ******************* JWT ******************* */

  const cookieExtractor = (req) => {
    if (req && req.cookies && req.cookies.jwt_token) { return req.cookies.jwt_token; }
    return null;
  };
  
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeader(), cookieExtractor]),
    // Telling Passport where to find the secret
    secretOrKey: jwtHelper.getJwtSecret(),
  };

  // Setting up JWT login strategy
  const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    db.User.findOne({ where: { id: payload.id } })
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });

  /* ******************* USE ******************* */
  passport.use('jwt', jwtLogin);
  passport.use('by_password', by_password);
};
