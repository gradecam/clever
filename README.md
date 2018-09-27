# @gradecam/clever [![Build Status](https://travis-ci.org/gradecam/clever.svg?branch=master)](https://travis-ci.org/gradecam/clever)

A Promise based HTTP client for interacting with the Clever's API.

## Installing

Using npm:

```bash
$ npm install @gradecam/clever
```

## Example

Retrieving a list of teachers.

```js
import * as Clever from '@gradecam/clever';

async function main() {
  const clever = Clever.createInstance({token: 'YOUR_BEARER_TOKEN'});
  const teachers = await clever.teachers.list();
  // do something with the teachers
}
```

If you just want to play around with the test data that Clever provides you
can call `createInstance` without any parameters to use the default `DEMO_TOKEN`.
See the [developer guide](https://dev.clever.com/) for more details.

This package deviates significantly from
[Clever's offical module](https://github.com/Clever/clever-js).
Notably due to changes in v2.0 of the Clever API it is no longer possible to request
data using syntax similar to MongoDB's query syntax. As such the API interface has
been completely overhauled. It is more similar to the API provided by Google for
[Google Classroom](https://developers.google.com/classroom/quickstart/nodejs).
Additionally this implementation does not utilize any callback style invocation
as I feel promises are both easier to work with and to understand -- especially with `async/await`.

List APIs for the Data and Event endpoints support a [stream](https://nodejs.org/api/stream.html)
interface for auto-pagination:

```js
import * as Clever from '@gradecam/clever';

// retrieve students 50 at a time using a stream.
async function countStudents(clever): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    const stream = clever.students.list({params: {limit: 50}, stream: true});
    stream.on('data', (student) => {
      count++;
    });
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      console.log(`total students: ${count}`);
      resolve(count);
    }
  });
}

async function main() {
  const clever = Clever.createInstance();
  const numStudents = await countStudents(clever);
  console.log(`total students: ${numStudents}`);
}
```

## Supported Node versions

Because the library uses `Promise` internally your node version will need to
either support it natively or you may be able to use compatible shim.

## TypeScript

This module was written with TypeScript so if you happen to be using TypeScript
there is no need to try to find types for the library as they are already included.
If you want to reference one of the Schemas you should be able to do the following:
I don't know of an elegant and supported way of doing so. If you need them you can
gain access to them by doing something like the following:

```ts
import { Schema } from '@gradecam/clever';

let section: Schema.Section;
// do something interesting
```

Also since the TypeScript is transpiled into JavaScript prior to being published
to NPM there is no runtime dependency on it, unlike Coffeescript in the official
Clever module.

## Feedback

I will try to be responsive to questions, feature requests, or feedback. Please
note that we do NOT work for Clever and as such we cannot change how their API
functions. If you encounter any issues with their API, which aren't related to
this library, please contact their technical support team directly at
[tech-support@clever.com](mailto:tech-support@clever.com).
