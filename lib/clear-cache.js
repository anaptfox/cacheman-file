const Fs = require('fs');
const Path = require('path');

function resetCache(self, done) {
  process.nextTick(function () {
    self.cache = {};
    done();
  });
}

/**
 * Clear all entries for this bucket.
 *
 * @param {String} key
 * @param {Function} done
 * @api public
 */
module.exports = function (key, done) {
  if (typeof key === 'undefined') return done(new Error('key is required'));

  var self = this;
  var tmpDir = Path.join(process.cwd(), 'tmp');

  if (typeof key === 'function') {
    done = key;
    key = null;
  }

  Fs.rmdir(tmpDir, function(err) {
    if (err) return done(err);

    Fs.mkdir(tmpDir, function(err) {
      if (err) return done(err);
      resetCache(self, done);
    });
  });
};