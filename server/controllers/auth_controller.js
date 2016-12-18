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
