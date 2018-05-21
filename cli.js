#!/usr/bin/env node

const argon2 = require('argon2')
const argparse = require('argparse')

function typeToString (type) {
  switch (type) {
    case argon2.argon2d:
      return 'Argon2d'
    case argon2.argon2id:
      return 'Argon2id'
    default:
      return 'Argon2i'
  }
}

const hash = async (password, options) => {
  // argparse sets an unset optional argument to null. WTF?
  if (options.salt === null) {
    delete options.salt
  } else {
    options.salt = Buffer.from(options.salt)
  }
  if (options.type === null) {
    delete options.type
  }
  options.memoryCost = options.memoryCostAbs || (1 << options.memoryCostExp)
  options.version = parseInt(options.version, 16)

  const start = Date.now()
  const hash = await argon2.hash(password, options)
  const delta = Date.now() - start

  if (options.raw) {
    console.info(hash.toString('hex'))
  } else if (options.encoded) {
    console.info(hash)
  } else {
    console.info(`Type: \t\t${typeToString(options.type)}`)
    console.info('Iterations: \t%d', options.timeCost)
    console.info('Memory: \t%d KiB', options.memoryCost)
    console.info('Parallelism: \t%d', options.parallelism)
    console.info('Encoded: \t%s', hash)
    console.info('%s seconds', (delta / 1000).toFixed(3))

    const result = argon2.verify(hash, password)
    console.info('Verification %s', result ? 'ok' : 'failed')
  }
}

const main = () => {
  const {defaults} = argon2

  const parser = new argparse.ArgumentParser({
    prog: 'argon2',
    usage: './argon2 [-h] salt [-i|-d|-id] [-t iterations] [-m log2(memory in KiB) | -k memory in KiB] [-p parallelism] [-l hash length] [-e|-r] [-v (10|13)]' +
      '\n  Password is read from stdin'
  })
  parser.addArgument(['salt'], {
    nargs: argparse.Const.OPTIONAL
  })

  const type = parser.addMutuallyExclusiveGroup()
  type.addArgument(['-i'], {
    action: 'storeConst',
    constant: argon2.argon2i,
    dest: 'type',
    help: 'Use Argon2i (this is the default)'
  })
  type.addArgument(['-d'], {
    action: 'storeConst',
    constant: argon2.argon2d,
    dest: 'type',
    help: 'Use Argon2d instead of Argon2i'
  })
  type.addArgument(['-id'], {
    action: 'storeConst',
    constant: argon2.argon2id,
    dest: 'type',
    help: 'Use Argon2id instead of Argon2i'
  })

  parser.addArgument(['-t'], {
    defaultValue: defaults.timeCost,
    dest: 'timeCost',
    help: `Sets the number of iterations to N (default ${defaults.timeCost})`,
    metavar: 'N'
  })

  const memory = parser.addMutuallyExclusiveGroup()
  memory.addArgument(['-m'], {
    defaultValue: Math.log2(defaults.memoryCost),
    dest: 'memoryCostExp',
    help: `Sets the memory usage to 2^N KiB (default ${Math.log2(defaults.memoryCost)})`,
    metavar: 'N',
    type: 'int'
  })
  memory.addArgument(['-k'], {
    defaultValue: defaults.memoryCost,
    dest: 'memoryCostAbs',
    help: `Sets the memory usage to N KiB (default ${defaults.memoryCost})`,
    metavar: 'N',
    type: 'int'
  })

  parser.addArgument(['-p'], {
    defaultValue: defaults.parallelism,
    dest: 'parallelism',
    help: `Sets parallelism to N threads (default ${defaults.parallelism})`,
    metavar: 'N',
    type: 'int'
  })
  parser.addArgument(['-l'], {
    defaultValue: defaults.hashLength,
    dest: 'hashLength',
    help: `Sets hash output length to N bytes (default ${defaults.hashLength})`,
    metavar: 'N',
    type: 'int'
  })

  const output = parser.addMutuallyExclusiveGroup()
  output.addArgument(['-e'], {
    action: 'storeTrue',
    dest: 'encoded',
    help: 'Output only encoded hash'
  })
  output.addArgument(['-r'], {
    action: 'storeTrue',
    dest: 'raw',
    help: 'Output only the raw bytes of the hash'
  })

  parser.addArgument(['-v'], {
    choices: ['10', '13'],
    defaultValue: '13',
    dest: 'version',
    help: 'Argon2 version (defaults to the most recent version, currently 13)',
    metavar: '(10|13)'
  })

  const args = parser.parseArgs()

  let password = Buffer.alloc(0)
  process.stdin.on('data', data => {
    password = Buffer.concat([password, data])
  })
  process.stdin.on('end', () => {
    hash(password, args).catch(err => {
      console.error('Error: %s', err.message)

      // invalid argument error
      process.exit(22)
    })
  })
}

main()
