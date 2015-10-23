const Fs = require('fs');
const Path = require('path');

const delete_key = require('./delete-key');

/**
 * Get an entry.
 *
 * @param {String} key
 * @param {Function} done
 * @api public
 */
module.exports = function get(key, done) {
  if (typeof key === 'undefined') return done(new Error('key is required'));

  var self = this;
  var cacheFile = Path.join(process.cwd(), 'tmp', key + '.json');

  if (!self.cache[key]) return done(new Error('key not found'));
  if (!Fs.existsSync(cacheFile)) return done(new Error('data not found'));

  var data = JSON.parse(Fs.readFileSync(cacheFile));

  if (!data) return done(null, data);

  if (data.expire < Date.now()) {
    delete_key(key, done);
  } else {
    process.nextTick(function () {
      done(null, data.value);
    });
  }
};
