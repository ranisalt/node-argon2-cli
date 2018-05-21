const {spawn} = require('child_process')
const _assert = require('assert')
const argon2 = require('argon2')

const {defaults, limits} = argon2

const salt = Buffer.from('somesalt')

const genChild = (...params) => new Promise((resolve, reject) => {
  const child = spawn('./cli.js', params)
  child.stdin.end('password')

  let errbuf = Buffer.alloc(0)
  let outbuf = Buffer.alloc(0)

  child.stderr.on('data', data => {
    errbuf = Buffer.concat([errbuf, data])
  })

  child.stdout.on('data', data => {
    outbuf = Buffer.concat([outbuf, data])
  })

  child.on('close', () => {
    if (errbuf.length) {
      reject(errbuf.toString())
    } else {
      resolve(outbuf.toString().split('\n').map(s => s.trim()))
    }
  })
})

describe('hash', () => {
  const assert = _assert.strict || _assert

  it('hash with defaults', async () => {
    const expected = await argon2.hash('password', {salt})
    const output = await genChild('somesalt')
    assert.equal('Type: \t\tArgon2i', output[0])
    assert.equal(`Iterations: \t${defaults.timeCost}`, output[1])
    assert.equal(`Memory: \t${defaults.memoryCost} KiB`, output[2])
    assert.equal(`Parallelism: \t${defaults.parallelism}`, output[3])
    assert.equal(`Encoded: \t${expected}`, output[4])
    assert.equal('Verification ok', output[6])
  })

  it('hash with generated salt', async () => {
    const output = await genChild()
    assert(/Encoded:.*\$.{22}\$[^$]*/.test(output[4]))
  })

  it('hash with argon2d', async () => {
    const expected = await argon2.hash('password', {salt, type: argon2.argon2d})
    const output = await genChild('somesalt', '-d')
    assert.equal('Type: \t\tArgon2d', output[0])
    assert.equal(`Encoded: \t${expected}`, output[4])
  })

  it('hash with options', async () => {
    const expected = await argon2.hash('password', {
      timeCost: 4, memoryCost: 8192, parallelism: 2, salt
    })
    const output = await genChild('somesalt', '-t', '4', '-k', '8192', '-p', '2')
    assert.equal(`Iterations: \t4`, output[1])
    assert.equal(`Memory: \t8192 KiB`, output[2])
    assert.equal(`Parallelism: \t2`, output[3])
    assert.equal(`Encoded: \t${expected}`, output[4])
  })

  it('hash encoded', async () => {
    const expected = await argon2.hash('password', {salt})
    const output = await genChild('somesalt', '-e')
    assert.equal(expected, output[0])
  })

  it('hash raw', async () => {
    const expected = await argon2.hash('password', {salt, raw: true})
    const output = await genChild('somesalt', '-r')
    assert.equal(expected.toString('hex'), output[0])
  })
})
