var assert = require('assert');
var Path = require('path');
var Fs = require('fs-extra');
var sanitize = require('sanitize-filename');
var Cache = require('../');
var cache;

describe('cacheman-file', function() {

  before(function(done) {
    cache = new Cache({tmpDir: Path.join(process.cwd(), 'temp')}, {});
    done();
  });

  after(function(done) {
    cache.clear('test');
    done();
  });

  it('should have main methods', function() {
    assert.ok(cache.set);
    assert.ok(cache.get);
    assert.ok(cache.del);
    assert.ok(cache.clear);
    assert.ok(cache.getAll);
  });

  it('should set temp directory from options', function (done) {
    Fs.ensureDir(Path.join(process.cwd(), 'temp'), function(err, results) {
      assert.strictEqual(err, null);
      done();
    });
  });

  it('should store items', function(done) {
    cache.set('test1', {
      a: 1
    }, function(err) {
      if (err) return done(err);
      cache.get('test1', function(err, data) {
        if (err) return done(err);
        assert.equal(data.a, 1);
        done();
      });
    });
  });

  it('should store zero', function(done) {
    cache.set('test2', 0, function(err) {
      if (err) return done(err);
      cache.get('test2', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, 0);
        done();
      });
    });
  });

  it('should store false', function(done) {
    cache.set('test3', false, function(err) {
      if (err) return done(err);
      cache.get('test3', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, false);
        done();
      });
    });
  });

  it('should store null', function(done) {
    cache.set('test4', null, function(err) {
      if (err) return done(err);
      cache.get('test4', function(err, data) {
        if (err) return done(err);
        assert.strictEqual(data, null);
        done();
      });
    });
  });

  it('should allow special characters on keys', function(done) {
    var key = '/path/to/url/?param=123';
    cache.set(key, {
      a: 1
    }, function(err) {
      if (err) return done(err);

      // compare cached key against sanitized key
      var lastKey = Object.keys(cache.cache).pop();
      var sanitizedKey = sanitize(key);
      assert.equal(sanitizedKey, lastKey);

      // check functionality, along the way
      cache.get(key, function(err, data) {
        if (err) return done(err);
        assert.equal(data.a, 1);
        done();
      });
    });
  });

  it('should delete items', function(done) {
    var value = Date.now();
    cache.set('test5', value, function(err) {
      if (err) return done(err);
      cache.get('test5', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.del('test5', function(err) {
          if (err) return done(err);
          cache.get('test5', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should clear items', function(done) {
    var value = Date.now();
    cache.set('test6', value, function(err) {
      if (err) return done(err);
      cache.get('test6', function(err, data) {
        if (err) return done(err);
        assert.equal(data, value);
        cache.clear('', function(err) {
          if (err) return done(err);
          cache.get('test6', function(err, data) {
            if (err) return done(err);
            assert.equal(data, null);
            done();
          });
        });
      });
    });
  });

  it('should expire key', function(done) {
    this.timeout(0);
    cache.set('test1', {
      a: 1
    }, 1, function(err) {
      if (err) return done(err);
      setTimeout(function() {
        cache.get('test1', function(err, data) {
          if (err) return done(err);
          assert.equal(data, null);
          done();
        });
      }, 1100);
    });
  });

  it('should get entire cache', function (done) {
    var items = [
      { a: 'test1' },
      { a: 'test2' },
      { a: 'test3' }
    ];

    cache.set('test1', items[0], function (err) {
      assert.deepEqual(null, err);
      cache.set('test2', items[1], function (err) {
        assert.deepEqual(null, err);
        cache.set('test3', items[2], function (err) {
          assert.deepEqual(null, err);

          cache.getAll(function (err, results) {
            assert.deepEqual(null, err);
            assert.deepEqual(items, results);
            done();
          });
        });
      });
    });
  });
});
