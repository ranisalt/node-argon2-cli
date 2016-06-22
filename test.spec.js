const spawn = require('child_process').spawn;
const argon2 = require('argon2');
const t = require('tap');

const defaults = argon2.defaults;
const limits = argon2.limits;

// hashes for argon2i and argon2d with default options
const hashes = Object.freeze({
  argon2i: '\\$argon2i\\$v=19\\$m=4096,t=3,p=1\\$c29tZXNhbHQ\\$iWh06vD8Fy27wf9npn6FXWiCX4K6pW6Ue1Bnzz07Z8A',
  argon2d: '\\$argon2d\\$v=19\\$m=4096,t=3,p=1\\$c29tZXNhbHQ\\$2+JCoQtY/2x5F0VB9pEVP3xBNguWP1T25Ui0PtZuk8o'
});

const genChild = params => new Promise((resolve, reject) => {
  'use strict';

  const child = spawn('./cli.js', params.split(' ').filter(Boolean));
  child.stdin.end('password');

  let errbuf = new Buffer(0);
  let outbuf = new Buffer(0);

  child.stderr.on('data', data => {
    errbuf = Buffer.concat([errbuf, data]);
  });

  child.stdout.on('data', data => {
    outbuf = Buffer.concat([outbuf, data]);
  });

  child.on('close', () => {
    if (errbuf.length) {
      reject(errbuf.toString());
    } else {
      resolve(outbuf.toString());
    }
  });
});

t.test('hash with defaults', t => {
  'use strict';

  t.plan(7);

  return genChild('somesalt').then(output => {
    output = output.split('\n');
    t.match(output[0], /Type:\s*Argon2i/);
    t.match(output[1], new RegExp(`Iterations:\\s*${defaults.timeCost}`));
    t.match(output[2], new RegExp(`Memory:\\s*${1 << defaults.memoryCost} KiB`));
    t.match(output[3], new RegExp(`Parallelism:\\s*${defaults.parallelism}`));
    t.match(output[4], new RegExp(`Encoded:\\s*${hashes.argon2i}`));
    t.match(output[5], /\d+.\d{3} seconds/);
    t.match(output[6], /Verification ok/);
  });
});

t.test('hash with generated salt', t => {
  'use strict';

  t.plan(1);

  return genChild('').then(output => {
    t.match(output, /^Encoded:.*\$.{22}\$[^$]*$/m);
  });
});

t.test('hash with argon2d', t => {
  'use strict';

  t.plan(2);

  return genChild('somesalt -d').then(output => {
    t.match(output, /^Type:\s+Argon2d$/m);
    t.match(output, /^Encoded:.*\$argon2d\$/m);
  });
});

t.test('hash with time cost', t => {
  'use strict';

  t.plan(2);

  return genChild('-t 4').then(output => {
    t.match(output, /^Iterations:\s*4/m);
    t.match(output, /^Encoded:.*,t=4,/m);
  });
});

t.test('hash with invalid time cost', t => {
  'use strict';

  t.plan(1);

  return genChild('-t foo').catch(err => {
    t.match(err, /Error: Invalid timeCost.+must be an integer/);
  });
});

t.test('hash with low time cost', t => {
  'use strict';

  t.plan(1);

  return genChild(`-t ${limits.timeCost.min - 1}`).catch(err => {
    t.match(err, /Error: Invalid timeCost.+between \d+ and \d+/);
  });
});

t.test('hash with high time cost', t => {
  'use strict';

  t.plan(1);

  return genChild(`-t ${limits.timeCost.max + 1}`).catch(err => {
    t.match(err, /Error: Invalid timeCost.+between \d+ and \d+/);
  });
});

t.test('hash with memory cost', t => {
  'use strict';

  t.plan(2);

  return genChild('-m 13').then(output => {
    t.match(output, /^Memory:\s*8192 KiB$/m);
    t.match(output, /^Encoded:.*\$m=8192,/m);
  });
});

t.test('hash with invalid memory cost', t => {
  'use strict';

  t.plan(1);

  return genChild('-m foo').catch(err => {
    t.match(err, /Error: Invalid memoryCost.+must be an integer/);
  });
});

t.test('hash with low memory cost', t => {
  'use strict';

  t.plan(1);

  return genChild(`-m ${limits.memoryCost.min - 1}`).catch(err => {
    t.match(err, /Error: Invalid memoryCost.+between \d+ and \d+/);
  });
});

t.test('hash with high memory cost', t => {
  'use strict';

  t.plan(1);

  return genChild(`-m ${limits.memoryCost.max + 1}`).catch(err => {
    t.match(err, /Error: Invalid memoryCost.+between \d+ and \d+/);
  });
});

t.test('hash with parallelism', t => {
  'use strict';

  t.plan(2);

  return genChild('-p 2').then(output => {
    t.match(output, /^Parallelism:\s*2$/m);
    t.match(output, /^Encoded:.*,p=2\$/m);
  });
});

t.test('hash with invalid parallelism', t => {
  'use strict';

  t.plan(1);

  return genChild('-p foo').catch(err => {
    t.match(err, /Error: Invalid parallelism.+must be an integer/);
  });
});

t.test('hash with low parallelism', t => {
  'use strict';

  t.plan(1);

  return genChild(`-p ${limits.parallelism.min - 1}`).catch(err => {
    t.match(err, /Error: Invalid parallelism.+between \d+ and \d+/);
  });
});

t.test('hash with high parallelism', t => {
  'use strict';

  t.plan(1);

  return genChild(`-p ${limits.parallelism.max + 1}`).catch(err => {
    t.match(err, /Error: Invalid parallelism.+between \d+ and \d+/);
  });
});

t.test('hash with all options', t => {
  'use strict';

  t.plan(6);

  return genChild('-d -t 4 -m 13 -p 2').then(output => {
    t.match(output, /^Type:\s*Argon2d$/m);
    t.match(output, /^Iterations:\s*4$/m);
    t.match(output, /^Memory:\s*8192 KiB$/m);
    t.match(output, /^Parallelism:\s*2$/m);
    t.match(output, /^Encoded:.*\$argon2d\$v=19\$m=8192,t=4,p=2\$/m);
    t.match(output, /^Verification ok$/m);
  });
});

t.test('hash quiet', t => {
  'use strict';

  t.plan(1);

  return genChild('somesalt -q').then(output => {
    // trim the trailing newline
    t.match(output.trim(), new RegExp(`^${hashes.argon2i}$`));
  });
});
