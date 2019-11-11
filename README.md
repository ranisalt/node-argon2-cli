# node-argon2-cli [![NPM package][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Coverage status][coverage-image]][coverage-url] [![Code Quality][codequality-image]][codequality-url] [![Dependencies][david-dm-image]][david-dm-url]
CLI utility for [node-argon2](https://github.com/ranisalt/node-argon2).

**Want to use it in your Javascript application? Instead check
[node-argon2](https://github.com/ranisalt/node-argon2).**

### Before installing
Check requirements for [node-argon2](https://github.com/ranisalt/node-argon2)
prior to installing this.

**node-argon2-cli** works only and is tested against Node >=4.0.0.


### Usage
Run `argon2-cli -h` for a quick help on usage and arguments:
```bash
$ argon2-cli -h
usage: argon2-cli [-h] salt [-i|-d|-id] [-t iterations] [-m log2(memory in KiB) | -k memory in KiB] [-p parallelism] [-l hash length] [-e|-r] [-v (10|13)]
  Password is read from stdin

Positional arguments:
  salt

Optional arguments:
  -h, --help  Show this help message and exit.
  -i          Use Argon2i (this is the default)
  -d          Use Argon2d instead of Argon2i
  -id         Use Argon2id instead of Argon2i
  -t N        Sets the number of iterations to N (default 3)
  -m N        Sets the memory usage to 2^N KiB (default 12)
  -k N        Sets the memory usage to N KiB (default 4096)
  -p N        Sets parallelism to N threads (default 1)
  -l N        Sets hash output length to N bytes (default 32)
  -e          Output only encoded hash
  -r          Output only the raw bytes of the hash
  -v (10|13)  Argon2 version (defaults to the most recent version, currently 13)
```

To hash a password:
```bash
$ echo -n "password" | argon2-cli
Type: 		Argon2i
Iterations: 	3
Memory: 	4096 KiB
Parallelism: 	1
Encoded: 	$argon2i$v=19$m=4096,t=3,p=1$lwEEWp+MVB8ha79mVt8Gog$KXc3+y9Lg4YBm0C1nxk7t6j3ku4pw/uyd4RfVq3e8yI
0.010 seconds
Verification ok
```

By default, the output is verbose. You can output the hash only with `-e`:
```bash
$ echo -n "password" | argon2-cli -e
$argon2i$v=19$m=4096,t=3,p=1$wST5QhBgk2lu1ih4DMuxvg$LS1alrVdIWtvZHwnzCM1DUGg+5DTO3Dt1d5v9XtLws4
```

You can choose between Argon2i and Argon2d by using the `-d` flag:
```bash
$ echo -n "password" | argon2-cli -d -e
$argon2d$v=19$m=4096,t=3,p=1$diS6FEpcDzlFacSfAHyWSw$+JLnSo3YQP/CJ7g2cRSx6YjC1eRmxHPETmd99R6eaa8
```

You can provide your own salt as the positional argument. It is **highly**
recommended to use the generated salt instead of a hardcoded salt, though:
```bash
$ echo -n "password" | argon2-cli somesalt -e
$argon2i$v=19$m=4096,t=3,p=1$c29tZXNhbHQ$iWh06vD8Fy27wf9npn6FXWiCX4K6pW6Ue1Bnzz07Z8A
```

You can also modify time, memory and parallelism constraints with `-t`, `-m` and
`-p` respectively, followed by a valid number:
```bash
$ echo -n "password" | argon2-cli -t 2 -k 65536 -p 4
Type: 		Argon2i
Iterations: 	2
Memory: 	65536 KiB
Parallelism: 	4
Encoded: 	$argon2i$v=19$m=65536,t=2,p=4$1LoWDI7KvUoSIUlA+26nHw$KK1P9iYjYn8+FE1ACGWFNhC3UfJsc1LYS7ciMcxS7EA
0.058 seconds
Verification ok
```

All arguments are optional, and it's not possible to pass your password as
argument for safety purposes (consider you should never write a password with
`echo`).

# License
Work licensed under the [MIT License](LICENSE). Please check
[P-H-C/phc-winner-argon2] (https://github.com/P-H-C/phc-winner-argon2) for
license over Argon2 and the reference implementation.

[npm-image]: https://img.shields.io/npm/v/argon2-cli.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/argon2-cli
[travis-image]: https://img.shields.io/travis/ranisalt/node-argon2-cli/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/ranisalt/node-argon2-cli
[coverage-image]: https://img.shields.io/coveralls/ranisalt/node-argon2-cli/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/ranisalt/node-argon2-cli
[codequality-image]: https://img.shields.io/codacy/15927f4eb15747fd8a537e48a04bd4f6/master.svg?style=flat-square
[codequality-url]: https://www.codacy.com/app/ranisalt/node-argon2-cli
[david-dm-image]: https://img.shields.io/david/ranisalt/node-argon2-cli.svg?style=flat-square
[david-dm-url]: https://david-dm.org/ranisalt/node-argon2-cli
