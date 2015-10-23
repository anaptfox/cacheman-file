const Fs = require('fs');
const Path = require('path');

function _deleteKey(key, done) {
  process.nextTick(function () {
    delete this.cache[key];
    done();
  });
}

/**
 * Delete an entry.
 *
 * @param {String} key
 * @param {Function} done
 * @api public
 */
module.exports = function (key, done) {
  if (typeof key === 'undefined') return done(new Error('key is required'));

  var self = this;
  var cacheFile = Path.join(process.cwd(), 'tmp', key + '.json');

  if (!Fs.existsSync(cacheFile)) {
    delete self.cache[key];
    return done();
  }

  Fs.unlink(cacheFile, function (err) {
    if (err) return done(err);
    _deleteKey(key, done);
  });
};