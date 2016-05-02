# cacheman-file

[![Build Status](https://api.travis-ci.org/anaptfox/cacheman-file.png?branch=master)](https://travis-ci.org/anaptfox/cacheman-file)
[![NPM version](https://badge.fury.io/js/cacheman-file.png)](http://badge.fury.io/js/cacheman-file)

File caching library for Node.JS and also cache engine for [cacheman](https://github.com/cayasso/cacheman).

## Instalation

``` bash
$ npm install cacheman-file
```

## Usage

```javascript
var CachemanFile = require('cacheman-file');
var cache = new CachemanFile();

// set the value
cache.set('my key', { foo: 'bar' }, function (error) {

  if (error) throw error;

  // get the value
  cache.get('my key', function (error, value) {

    if (error) throw error;

    console.log(value); //-> {foo:"bar"}

    // delete entry
    cache.del('my key', function (error){

      if (error) throw error;

      console.log('value deleted');
    });

  });
});
```

## API

### CachemanFile()

Create `cacheman-file` instance.

```javascript
var cache = new CachemanFile();
```

### cache.set(key, value, [ttl, [fn]])

Stores or updates a value.

```javascript
cache.set('foo', { a: 'bar' }, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

Or add a TTL(Time To Live) in seconds like this:

```javascript
// key will expire in 60 seconds
cache.set('foo', { a: 'bar' }, 60, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

### cache.get(key, fn)

Retrieves a value for a given key, if there is no value for the given key a null value will be returned.

```javascript
cache.get(function (err, value) {
  if (err) throw err;
  console.log(value);
});
```

### cache.del(key, [fn])

Deletes a key out of the cache.

```javascript
cache.del('foo', function (err) {
  if (err) throw err;
  // foo was deleted
});
```

### cache.clear([fn])

Clear the cache entirely, throwing away all values.

```javascript
cache.clear(function (err) {
  if (err) throw err;
  // cache is now clear
});
```

### cache.getAll([fn])

Get all entries in the cache. Entries are returned as an array

```javascript
cache.set('foo', { a: 'bar' }, 10, function (err, result) {
  cache.getAll(function (err, results) {
    console.log(results) // [ { a: 'bar' } ]
  });
});
```

## Run tests

``` bash
$ make test
```

## License

(The MIT License)

Copyright (c) 2013 Taron Foxworth &lt;taronfoxworth@gmail.com&gt; , Jeremiah Harlan &lt;jeremiah.harlan@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
