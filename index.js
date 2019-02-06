const fs = require('fs');
const path = require('path');

const DEFAULT_DIR = '/tmp/log';
try {
  fs.mkdirSync(DEFAULT_DIR);
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

exports.decorateSessionOptions = defaults => {
  console.log('decorateSessionOptions', defaults);
  return defaults;
};

exports.decorateSessionClass = Session => {
  return class mySession extends Session {
    constructor(options) {
      super(options);

      const filename = path.join(DEFAULT_DIR, `${options.uid}.log`);
      this.file = fs.createWriteStream(filename);
      this.on('data', data => {
        const content = data.slice(36);
        this.file.write(content);
      });
    }
    destroy() {
      this.file.end();
      super.destroy();
    }
  };
};
