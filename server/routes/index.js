import express from 'express';
import passport from 'passport';
var router = express.Router();

import models from '../models/index';
import * as authController from '../controllers/auth_controller';
import * as userController from '../controllers/user_controller';

const change_me_to_see_live_reload = 'NodeMon is AMAZING!';

router.get('/', (req, res, next) => {
  res.render('layout', { title: 'The index page!' , DEV_SERVER: process.env.DEV_SERVER, nodemon_live_reload: change_me_to_see_live_reload });
});

router.post('/settings/create', (req, res) => {
  models.Setting.create({
    key: req.body.key,
    value: req.body.value,
  }).then((setting) => {
    res.json(setting);
  });
});

router.post('/csrf_test', (req, res) => {
  res.json({msg: 'csrf pass!'});
});

router.get('/settings/index', (req, res) => {
  models.Setting.findAll({}).then((settings) => {
    res.json(settings);
  });
});


router.post('/authenticate', passport.authenticate('by_password'), authController.authenticated);
router.get('/user/index', passport.authenticate('jwt'), userController.index);

export default router;