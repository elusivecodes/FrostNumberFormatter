# FrostNumberFormatter

**FrostNumberFormatter** is a free, open-source number formatting library for *JavaScript*.

It is a tiny (~1kb gzipped) and modern library, extending the native [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) class, with additional capabilities for parsing formatted number strings into numbers.


## Table Of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Formatting](#formatting)
- [Parsing](#parsing)



## Installation

**In Browser**

```html
<script type="text/javascript" src="/path/to/frost-numberformatter.min.js"></script>
```

**Using NPM**

```
npm i @fr0st/numberformatter
```

In Node.js:

```javascript
import NumberFormatter from '@fr0st/numberformatter';
```


## Basic Usage

As the class internally utilizes the native [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) class, usage is very straightforward.

- `locale` is a string with a BCP 47 language tag, or an array of such strings, and will default to the system locale.
- `options` is an object containing options for formatting.

For a full list of supported options, see the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) documentation.

```javascript
const formatter = new NumberFormatter(locale, options);
```


## Formatting

Return a formatted number string, using the locale and formatting options.

- `number` is the number you wish to format.

```javascript
const numberString = formatter.format(number);
```

**Format To Parts**

Return an array of objects, containing the formatted number string in parts.

- `number` is the number you wish to format.

```javascript
const numberParts = formatter.formatToParts(number);
```


## Parsing

Return a parsed number from a formatted number string.

- `numberString` is the string you wish to parse.

```javascript
const number = formatter.parse(numberString);
```