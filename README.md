### JWT

JSON Web Token is a self-contained way for securely transmitting information between parties as a JSON object.

Since JWT can encode users data, its a great way to handle API authentication & authorization.
However, JWT are stateless, so we can't use standard Sessions. But don't despair, with a little bit of configuration,
we can manage all our authentication & authorization requirements in a single place.

### Passport

Passport is authentication middleware. It is designed to serve a singular purpose: authenticate requests.
Authentication is done by defining "strategies".

### What we're gonna do?
We'll secure our app endpoints with JWT. Once a user authenticate himself by supplying password, we'll generate a JWT for him.
The user can then interact with our API by supplying this token at his requests headers/cookies.

I assume you already familiar with Express, Sequelize, Mocha & Chai.

### User Model

First we'll define our User

```javascript
// user_spec.js

const db = require('../../../server/models/index.js');
const expect = require('chai').expect;

describe("User", () => {
  // clean the db before each test
  beforeEach((done) => {
    db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
  });

  it('should be defined', () => {
    expect(db.User).to.be.ok;
  });
});
```

And create the migration & model

```javascript
// 20161216233015-create-user.js
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      password_digest: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};

```

```javascript
// user.js
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [1,255]
      }
    },
    active: DataTypes.BOOLEAN,
    password_digest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password_confirmation: {
      type: DataTypes.VIRTUAL
    }
  }, {
    indexes: [{unique: true, fields: ['email']}],
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return User;
};
```

### User controller
We'll define a controller functionality that retrieves users from our db. Nothing fancy here

```javascript
// user_controller.js
import db from '../models/index';

const User = db.User;

export const index = async (req, res) => {
  try {
    User.findAll({
      attributes: ['id', 'email'],
    }).then((users) => {
      res.json(users.map(u => u.dataValues));
    });
  }
  catch(err) {
    console.error(err);
  }
};
```

### Router

```javascript
// routes/index.js
import express from 'express';
import passport from 'passport';
var router = express.Router();

import models from '../models/index';
import * as userController from '../controllers/user_controller';


router.get('/', (req, res, next) => {
  res.render('layout', { title: 'The index page!' , DEV_SERVER: process.env.DEV_SERVER, nodemon_live_reload: change_me_to_see_live_reload });
});


router.get('/user/index', userController.index);

export default router;
```


### User Password

We now can perform GET requests, and view our users data, but so does everyone else. Not ideal...

We want to identify our users by email/password. Before creating & updating users we'll
 - make sure emails are lowercase
 - make sure emails are unique
 - hash passwords 

```javascript
// user_spec.js
  .
  .
  .
  describe('create', () => {
    describe('when params are valid', () => {
      it('should insert to db', async () => {
        const args = { email: 'Some@email.COM', password: '123456', password_confirmation: '123456' };
        await db.User.create(args);
        const users = await db.User.findAll({where: {email: 'some@email.com'}});
        expect(users.length).to.eql(1);
      });
    });
  });
```


```javascript
// user.js
var bcrypt = require('bcrypt-nodejs');

'use strict';
module.exports = function(sequelize, DataTypes) {
  .
  .
  .

  const hasSecurePassword = (user, options, callback) => {
    if (user.password != user.password_confirmation) {
      throw new Error("Password confirmation doesn't match Password");
    }
    bcrypt.hash(user.get('password'), null, null, function(err, hash) {
      if (err) {
        return callback(err);}
      user.set('password_digest', hash);
      return callback(null, options);
    });
  };

  User.beforeCreate((user, options, callback) => {
    user.email = user.email.toLowerCase();
    if (user.password)
      hasSecurePassword(user, options, callback);
    else
      return callback(null, options);
  })
  User.beforeUpdate((user, options, callback) => {
    user.email = user.email.toLowerCase();
    if (user.password)
      hasSecurePassword(user, options, callback);
    else
      return callback(null, options);
  })

  return User;
};
```

### Password Authentication Strategy
We'll use `passport-local` to define our by_password strategy.
This strategy receives email/password as input, and trys to validate the user.

```javascript
// passport_strategies.js
import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';

const db = require('../models');
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
  passport.use('by_password', by_password);
};
```

Now that we can authenticate users, we want to generate JWT tokens for for them.
In this example, we just encode the user id, by we can encode additional data
(for example, his permissions/role at our system, token expiry...)

```javascript
//jwtHelper.js
import jwt from 'jsonwebtoken';

const jwtHelper = {};

jwtHelper.getJwtSecret = () => {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error("passport_strategies: process.env.JWT_SECRET is not set while running in production mode!");
    return null;
  }
  return process.env.JWT_SECRET || 'JWT_SECRET';
};

jwtHelper.generateJwt = (user) => {
  return jwt.sign({
    id: user.id,
  }, jwtHelper.getJwtSecret());
};
export default jwtHelper;

```

All we need now, is to define an endpoint the user can get his JTW from.

```javascript
// auth_controller.js
import jwtHelper from '../helpers/jwt_helper'

export const authenticated = async (req, res) => {
  try {
    res.json({
      token: `JWT ${jwtHelper.generateJwt(req.user)}`,
    });
  }
  catch(err) {
    console.error(err);
  }
}
```

```javascript
// routes/index.js
import * as authController from '../controllers/auth_controller';
.
.
.
router.post('/authenticate', passport.authenticate('by_password'), authController.authenticated);
```

### JWT Authentication Strategy
Passport was kind to us, and supplied `ExtractJwt.fromAuthHeader` to extract the JWT token from requests header.
It assumes client will add the token in the `Authorization` header with the value `JWT <...token...>`

One important note, is that after we decode the JWT token, we do not pass that as our user object.
We fetch the latest user data from DB, incase the token is out of date (for example, the user was deleted by system admin)

```javascript
  import jwtHelper from '../helpers/jwt_helper'
  const JwtStrategy = require('passport-jwt').Strategy;
  const ExtractJwt = require('passport-jwt').ExtractJwt;
  .
  .
  .
  
  const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
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

  passport.use('jwt', jwtLogin);
```

Now we can protect our `/user/index` endpoint

```javascript
// routes/index.js
import * as authController from '../controllers/auth_controller';
.
.
.
router.get('/user/index', passport.authenticate('jwt'), userController.index);

```

### Cookie JWT Authorization
Our jwt strategy is great for API. It supply all the protection we have from the standard API tokens system,
with the advantages of JWT encoded data (such as permissions, expiry).

However, this doesn't help us much when creating standard Ajax requests from the webapp. 
It forces us to add Authorization header to every request at the client side.

We can avoid that if we'll store the JWT token on the browser cookies.

Luckily, passport is very modular, and we can expand our jwt strategy to do just that.
Our strategy will look for JWT token on the request header, if not found, it will search it on our cookie.

```javascript
// passport_strategies.js
  .
  .
  .
  const cookieExtractor = (req) => {
    if (req && req.cookies && req.cookies.jwt_token) { return req.cookies.jwt_token; }
    return null;
  };
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeader(), cookieExtractor]),
    secretOrKey: jwtHelper.getJwtSecret(),
  };
```
### Testing
Thats it, we can now use tools such as cUrl or Postman to check our setup:
  - POST `/authenticate` with email/password params should return a JWT token.
  - GET `/user/index` with the token in the cookies or Authorization header will give us the user list

Lets add some integration tests for that

```javascript
//authentication_routes_spec.js
import request from 'supertest';
import server from '../../../server/server';
import db from '../../../server/models';

describe('authentication', () => {
  describe('POST /authenticate', () => {
    const user_params = {
      email: 'some@email.com',
      password: 'password',
      password_confirmation: 'password',
    };

    const expectJwtTokenOn = (body) => {
      if (!body.token) { throw new Error('missing token'); }
      if (body.token.split('.').length !== 3) { throw new Error('invalid JWT'); }
    };

    before((done) => {
      db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
    });
    before((done) => {
      db.User.create(user_params).then(() => { done(); });
    });

    describe('when email and password are valid', () => {
      it('responds with status 200 and valid JWT token', (done) => {
        request(server)
          .post('/authenticate')
          .send({ email: user_params.email, password: user_params.password })
          .expect(200)
          .expect((res) => {
            expectJwtTokenOn(res.body);
          })
          .end(done);
      });
    });

    describe('when email and password are invalid', () => {
      it('responds with 401 Unauthorized', (done) => {
        request(server)
          .post('/authenticate')
          .send({ email: 'other@email.com', password: user_params.password })
          .expect(401)
          .end(done);
      });
    });
  });
});
```

```javascript
// user_route_spec.js
import request from 'supertest';
import server from '../../../server/server';
import db from '../../../server/models';
import jwtHelper from '../../../server/helpers/jwt_helper';

describe('user routes', () => {
  describe('GET /user/index', () => {
    const user_params = {
      email: 'some@email.com',
      password: 'password',
      password_confirmation: 'password',
      active: true,
    };

    const expectJwtTokenOn = (body) => {
      if (!body.token) { throw new Error('missing token'); }
      if (body.token.split('.').length !== 3) { throw new Error('invalid JWT'); }
    };

    before((done) => {
      db.sequelize.sync({ force: true, logging: false }).then(() => { done(); });
    });
    before((done) => {
      db.User.create(user_params).then(() => { done(); });
    });

    describe('when jwt is missing', () => {
      it('responds with status 401', (done) => {
        request(server)
          .get('/user/index')
          .expect(401)
          .end(done);
      });
    });

    describe('when jwt found', () => {
      let jwt_token = null;
      before((done) => {
        db.User.findOne({ where: { email: user_params.email } })
          .then((user) => {
            jwt_token = jwtHelper.generateJwt(user);
            done();
          });
      });
      it('in header', (done) => {
        request(server)
          .get('/user/index')
          .set('Authorization', `JWT ${jwt_token}`)
          .expect(200)
          .end(done);
      });
      it('in cookies', (done) => {
        request(server)
          .get('/user/index')
          .set('Cookie', [`jwt_token=${jwt_token}`])
          .expect(200)
          .end(done);
      });
    });
  });
});
```

### Resources
 - [About JWT](https://jwt.io/)
 - [PassportJS](http://passportjs.org/)
 - [Passport Local](https://github.com/jaredhanson/passport-local)
 - [Passport JWT](https://www.npmjs.com/package/passport-jwt)
 - [Working example](https://github.com/guyogev/express_passport_jwt_blog_post)
