function requireAll(require) {
  require.keys().forEach(require);
}

require('./main');

require.context('../css', true, /.*/);
