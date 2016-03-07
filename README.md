# node-argon2-cli [![NPM package][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Coverage status][coverage-image]][coverage-url] [![Code Quality][codequality-image]][codequality-url] [![Dependencies][david-dm-image]][david-dm-url]
CLI utility for [node-argon2](https://github.com/ranisalt/node-argon2).

**Want to use it in your Javascript application? Instead check
[node-argon2](https://github.com/ranisalt/node-argon2).**

### Before installing
Check requirements for [node-argon2](https://github.com/ranisalt/node-argon2)
prior to installing this.

**node-argon2-cli** works only and is tested against Node >=4.0.0.


### Usage
Run `argon2 -h` for a quick help on usage and arguments:
```bash
$ argon2 -h
usage: argon2 salt [-d] [-t iterations] [-m memory] [-p parallelism]
	Password is read from stdin

Positional arguments:
  salt

Optional arguments:
  -h, --help     Show this help message and exit.
  -d, --argon2d  Use Argon2d instead of Argon2i (default: false)
  -m N           Sets the memory usage to 2^N KiB (default: 12)
  -t N           Sets the number of iterations to N (default: 3)
  -p N           Sets parallelism to N threads (default: 1)
  -q             Do not output timing information (default: false)
```

To hash a password:
```bash
$ echo -n "password" | argon2
Type:           Argon2i
Iterations:     3
Memory:         4096 KiB
Parallelism:    1
Encoded:        $argon2i$m=4096,t=3,p=1$cZVXCGXwTBcocU4aOhjMkQ$HSAo4K9SAYUTdl/GWluOJNthqmTk1YmzNQHpZPp9sn8
0.010 seconds
Verification ok
```

By default, the output is verbose. You can output the hash only with `-q`:
```bash
$ echo -n "password" | argon2 -q
$argon2i$m=4096,t=3,p=1$BFUGTNcvBjSAtYklcJFhZQ$lQsmd5Fjef2/4UTFlgXLNb8D7iFFgt0PvYVsgn+6lLs
```

You can choose between Argon2i and Argon2d by using the `--argon2d` (`-d`) flag:
```bash
$ echo -n "password" | argon2 -d -q
$argon2d$m=4096,t=3,p=1$x7OyWwTq0HryCyqahgZcMA$25HOolJnT/uBw4kK2rKZ4IanAA8eAYqUcg+9o0lIj2g
```

You can provide your own salt as the positional argument. It is **highly**
recommended to use the generated salt instead of a hardcoded salt, though:
```bash
$ echo -n "password" | argon2 somesalt -q
$argon2i$m=4096,t=3,p=1$c29tZXNhbHQ$vpOd0mbc3AzXEHMgcTb1CrZt5XuoRQuz1kQtGBv7ejk
```

You can also modify time, memory and parallelism constraints with `-t`, `-m` and
`-p` respectively, followed by a valid number:
```bash
$ echo -n "password" | ./cli.js -t 2 -m 16 -p 4
Type:           Argon2i
Iterations:     2
Memory:         65536 KiB
Parallelism:    4
Encoded:        $argon2i$m=65536,t=2,p=4$/tH9944/9OdsUauNaTVgfw$Glxg3SkUfkLETBHxaq1GamsaTBiYdBNRppL2Mqm7hqo
0.077 seconds
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
