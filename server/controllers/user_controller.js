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
