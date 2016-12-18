import passport from 'passport';
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
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  return jwt.sign({
    id: user.id,
    // exp: parseInt(expiry.getTime() / 1000, 10),
  }, jwtHelper.getJwtSecret());
};
export default jwtHelper;
