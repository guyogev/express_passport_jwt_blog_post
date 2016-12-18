import jsdom from 'jsdom';
import chai from 'chai';
// import chaiImmutable from 'chai-immutable';
import _ from 'lodash';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

win._ = _;
win.localStorage = {
  getItem: (i) => {return i;}
};

global.document = doc;
global.window = win;

global.mockCookies = (cookies) => { document.cookie = cookies; };
global.clearMockedCookies = () => { document.cookie = ''; };

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

// chai.use(chaiImmutable);
// import * as Global from '../cross_device_app/app/shared/global';
