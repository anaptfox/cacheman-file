'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs-extra'),
  path = require('path'),
  cwd = process.cwd(),
  noop = function() {};

/**
 * RedisStore constructor.
 *
 * @param {Object} options
 * @param {Bucket} bucket
 * @api public
 */

function FileStore() {

  var self = this;

  if (!fs.existsSync(path.join(cwd, 'tmp'))) {

    fs.mkdirSync(path.join(cwd, 'tmp'));

  }

  var cacheFiles = fs.readdirSync(path.join(cwd, 'tmp'));

  self.cache = {};

  cacheFiles.forEach(function(file) {

    self.cache[file] = true;

  });

}

/**
 * Get an entry.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

FileStore.prototype.get = function get(key, fn) {

  fn = fn || noop;

  var val, data;

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  // if (this.cache[key] < Date.now()) {

  //   return fn(null, null);

  // }

  if (fs.existsSync(cacheFile)) {

    data = fs.readFileSync(cacheFile);

    data = JSON.parse(data);

  } else {

    return fn(null, null);

  }

  if (!this.cache[key]) {

    return fn(null, null);

  }

  if (!data) return fn(null, data);

  if (data.expire < Date.now()) {

    this.del(key);

    return fn(null, null);

  }

  try {

    val = JSON.parse(data.value);

  } catch (e) {

    return fn(e);

  }

  process.nextTick(function tick() {

    fn(null, val);

  });

};

/**
 * Set an entry.
 *
 * @param {String} key
 * @param {Mixed} val
 * @param {Number} ttl
 * @param {Function} fn
 * @api public
 */

FileStore.prototype.set = function set(key, val, ttl, fn) {

  var data, self = this;

  if ('function' === typeof ttl) {

    fn = ttl;

    ttl = null;

  }

  fn = fn || noop;

  if ('undefined' === typeof val) return fn();

  try {

    data = {

      value: JSON.stringify(val),

      expire: JSON.stringify(Date.now() + ((ttl || 60) * 1000))

    };

  } catch (e) {

    return fn(e);

  }

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  fs.writeFileSync(cacheFile, JSON.stringify(data, null, 4));

  process.nextTick(function tick() {

    self.cache[key] = data.expire;

    fn(null, val);

  });

};

/**
 * Delete an entry.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

FileStore.prototype.del = function del(key, fn) {

  var self = this;

  fn = fn || noop;

  var cacheFile = path.join(cwd, 'tmp', key + '.json');

  if (!fs.existsSync(cacheFile)) {

    self.cache[key] = null;

    return fn();

  }

  try {

    fs.removeSync(cacheFile);

  } catch (e) {

    return fn(e);

  }

  process.nextTick(function tick() {

    self.cache[key] = null;

    fn(null);

  });

};

/**
 * Clear all entries for this bucket.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */

FileStore.prototype.clear = function clear(key, fn) {

  var self = this;

  if ('function' === typeof key) {

    fn = key;

    key = null;

  }

  fn = fn || noop;

  try {

    // Delete tmp folder
    fs.removeSync(path.join(cwd, 'tmp'));
    // Recreate empty folder
    fs.mkdirSync(path.join(cwd, 'tmp'));

  } catch (e) {

    return fn(e);

  }

  process.nextTick(function tick() {

    self.cache = {};

    fn(null);

  });

};

/**
 * Export `FileStore`.
 */

module.exports = FileStore;