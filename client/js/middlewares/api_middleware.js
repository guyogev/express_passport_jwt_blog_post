/* global document */
/* eslint-disable no-param-reassign, no-console, arrow-body-style*/

import request from 'superagent';

const getCookie = (cname) => {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  let i = 0;
  for (i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const onSucc = (req, next) => {
  return (response) => {
    next({
      type: `${req.url}_SUCCESS`,
      response,
    });
  };
};

const onErr = (req, next) => {
  return (response) => {
    console.error(response);
    next({
      type: `${req.url}_ERROR`,
      response,
    });
  };
};

const get = (req, next) => {
  req.headers = req.headers || {};
  req.params = req.params || {};
  request
    .get(req.url)
    .set(req.headers)
    .query(req.params)
    .then(onSucc(req, next), onErr(req, next));
};
const post = (req, next) => {
  req.headers = req.headers || {};
  req.params = req.params || {};
  req.headers['XSRF-TOKEN'] = getCookie('XSRF-TOKEN'); // set XSRF-TOKEN for csrf production
  request
    .post(req.url)
    .set(req.headers)
    .send(req.params)
    .end(onSucc(req, next), onErr(req, next));
};

const sendRequest = (req, next) => {
  switch (req.method) {
    case 'get':
      get(req, next);
      break;
    case 'post':
      post(req, next);
      break;
    default:
      console.warn(`ApiMiddleware.sendRequest: request method "${req.method}" is not supported yet`);
  }
};

const ApiMiddleware = store => next => (action) => {
  /*
  Pass all actions through by default
  */
  next(action);
  switch (action.type) {
    case 'API':
      sendRequest(action.request, next);
      break;
    default:
      break;
  }
};

export default ApiMiddleware;
