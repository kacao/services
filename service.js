const Listenable = require('listenable');

exports = module.exports = class Service extends Listenable {

  constructor(id, deps) {
    super(id);
    if (!Array.isArray(deps)) {
      throw "[service] options.deps should be an array";
    }
    this._deps = [].concat(deps);
  }

  async run(ready, fail) {
    ready();
  }

  get deps() {
    return this._deps;
  }

  get id() {
    return this._id;
  }

}
