# promise-waitlist
[![Build Status](https://travis-ci.org/indutny/promise-waitlist.svg?branch=master)](http://travis-ci.org/indutny/promise-waitlist)

Promise-based Wait List for your apps.

## Usage

```js
import WaitList from 'promise-waitlist';

const waitList = new WaitList();

const entry = waitList.waitFor('event');

setTimeout(() => {
  waitList.resolve('event', value);
}, 1000);

console.log(await entry.promise);  // 42
```

Entries can be cancelled as well:
```js
entry.cancel(/* optional error here */);
```

Wait time could be limited by supplying timeout argument (in milliseconds):
```js
waitList.waitFor('event', 5000);
```

Or, if you wish to pass resolved entry:
```js
const entry = WaitList.resolve(42);
```

## LICENSE

This software is licensed under the MIT License.

Copyright Fedor Indutny, 2019.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
