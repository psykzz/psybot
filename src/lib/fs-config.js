var fs = require('fs');
var debug = require('debug')('fs-config');

class FSConfig {
  constructor(dataPath) {
    this.dataPath = dataPath || './data/psybot-data.json';
    try {
      this.data = this.load();
    } catch (err) {
      this.data = {};
      this.save();
    }
  }

  get(key, _default) {
    if (this.data[key] === undefined && _default !== undefined) {
      this.set(key, _default);
      return this.get(key);
    }
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  clear(key) {
    delete this.data[key];
    this.save();
  }

  load(path, encoding) {
    path = path || this.dataPath;
    encoding = encoding || 'utf8';
    debug("Loading config", path, encoding);
    return JSON.parse(fs.readFileSync(path, encoding));
  }

  save(path, encoding, data) {
    path = path || this.dataPath;
    encoding = encoding || 'utf8';
    data = data || this.data;
    debug("Saving config", path, encoding, data);
    return fs.writeFileSync(path, JSON.stringify(data), encoding);
  }
}

module.exports = FSConfig;
