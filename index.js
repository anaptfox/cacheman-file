'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs-extra'),
  path = require('path'),
  cwd = process.cwd(),
  noop = function() {};

/**
 * FileStore constructor.
 *
 * @param {Object} options
 * @api public
 */

function FileStore() {

  var self = this;
  self.path = options.path || path.join(cwd, 'tmp');

  if (!fs.existsSync(self.path)) {

    fs.mkdirSync(self.path);

  }

  var cacheFiles = fs.readdirSync(self.path);

  self.cache = {};

  cacheFiles.forEach(function(file) {

    file = file.replace('.json', '').replace('_', ':');

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

  var self = this;
  fn = fn || noop;

  var val, data;

  var fileKey = key.replace(':', '_');
  var cacheFile = path.join(this.path, fileKey + '.json');

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

  var fileKey = key.replace(':', '_');
  var cacheFile = path.join(self.path, fileKey + '.json');

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

  var fileKey = key.replace(':', '_');
  var cacheFile = path.join(self.path, fileKey + '.json');

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
    fs.removeSync(self.path);
    // Recreate empty folder
    fs.mkdirSync(self.path);

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
