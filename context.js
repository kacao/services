exports = module.exports = class {

  constructor(ready, fail, services) {
    this.ready = ready;
    this.fail = fail;
    this.getService = (id) => { return services.service(id); }
  }

}
