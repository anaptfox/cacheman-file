const Fs = require('fs');
const Path = require('path');

const ClearCache = require('./lib/clear-cache');
const GetKey = require('./lib/get-key');
const SetKey = require('./lib/set-key');
const DeleteKey = require('./lib/delete-key');

module.exports = function () {
  var self = this;
  var tmpDir = Path.join(process.cwd(), 'tmp');
  self.cache = {};

  if (!Fs.existsSync(tmpDir)) Fs.mkdirSync(tmpDir);

  var cacheFiles = Fs.readdirSync(tmpDir);

  cacheFiles.forEach(function (file) {
    file = file.replace('.json', '').replace('_', ':');
    self.cache[file] = true;
  });

  var cacheman = {
    get: GetKey.bind(self),
    set: SetKey.bind(self),
    clearCache: ClearCache.bind(self),
    deleteKey: DeleteKey.bind(self)
  };

  return cacheman;
};
