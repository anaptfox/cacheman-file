const Fs = require('fs');
const Path = require('path');

/**
 * Set an entry.
 *
 * @param {String}   key
 * @param {Mixed}    value
 * @param {Number}   ttl
 * @param {Function} done
 * @api public
 */
module.exports = function (key, value, ttl, done) {
  if (typeof key === 'undefined') return done(new Error('key is required'));
  if (typeof value === 'undefined') return done(new Error('value is require'));

  var self = this;
  var data = {};

  if (typeof ttl === 'function') {
    done = ttl;
    ttl = 60;
  }

  try {
    data.value = JSON.stringify(value);
    data.expire = JSON.stringify(Date.now() + (ttl * 1000));
  } catch (err) {
    return done(err);
  }

  var cacheFile = Path.join(process.cwd(), 'tmp', key + '.json');

  Fs.writeFile(cacheFile, JSON.stringify(data, null, 4), function(err) {
    if (err) return done(err);

    process.nextTick(function () {
      self.cache[key] = data.expire;
      done(null, value);
    });
  });
};
