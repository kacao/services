const Listenable = require('listenable');
const Service = require('./service');
const Context = require('./context');
const sort = require('toposort');
const uuid = require('uuid-random');

function isFunction(f) {
 return f && {}.toString.call(f) === '[object Function]';
}

exports = module.exports = class Services {

  constructor() {
    this._services = {};
  }

  add(services) {
    let self = this;
    if (!Array.isArray(services)) {
      services = [services];
    }
    for (let i=0; i<services.length; i++) {
      this._addService(services[i], this._services);
    }
  }

  addFunc(id, func, deps) {
    if (func.prototype instanceof Service) {
      return this._addService(this._services, service);
    }
    if ((!id) || (id == '')) { id == uuird() };
    let service = new Service(id, deps);
    service.run = func.bind(service);
    this._addService(this._services, service);
  }

  _addService(services, service) {
    if (!service.prototype instanceof Service) {
      throw "Service should be subclass of Service";
    }
    services[service.id] = service;
   
    let f = () => {
      return new Promise( async (resolve, reject) => {
        let context = new Context(() => { resolve(service.id) }, () => { reject(false) }, services);
        await service.run.call(service, context);
      });
    }
    service.__runService = f;
  }

  async run() {
    let list = this._sort(this._services);
    if (list instanceof Error) {
      return list;
    }
    if (!list) { return false };
    let allResults = [];
    for (let i=0; i<list.length; i++) {
      let group = list[i];
      let tasks = [];
      for (let j=0; j<group.length; j++) {
        let service = this._services[group[j]];
        tasks.push(service.__runService.call(service));
      }
      let results = await Promise.all(tasks);
      allResults.push(results);
      for (let k=0; k<results.length; k++) {
        if (!results[k]) {
          console.log("[services] service failed.");
          return false;
        }
      }
    }
    return allResults;
  }
  
  service(id) {
    return this._services[id];
  }

  _sort(services) {
    let graph = [];
    for (let i in services) {
      let service = services[i];
      let deps = service._deps;
      console.log('eps');
      console.log(service);
      for (let j=0; j<deps.length; j++) {
        if (!services.hasOwnProperty(deps[j])) {
          return new Error("Service not found: " + deps[j]);
        }
        graph.push([deps[j], service.id]);
      }
    }
    let sorted = sort(graph);
    let list = [];
    if (sorted.length > 1) {
      let c = [sorted[0]];
      for (let i=1; i<sorted.length; i++) {
        let prev = services[sorted[i-1]];
        let cur = services[sorted[i]];
        if (!cur._deps.includes(prev.id)) {
          c.push(cur.id);
        } else {
          list.push(c);
          c = [cur.id];
        }
      }
      list.push(c);
    } else {
      list.push([sorted[0]]);
    }
    return list;
  }

}
