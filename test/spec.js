const should = require('should');
const Services = require('../services');
const Service = require('../service');

describe('Services', () => {
  let services = new Services();

  services.add([
    new Service('config', []),
    new Service('settings', ['config', 'db']),
    new Service('back', ['settings']),
    new Service('front', ['settings'])
  ]);

  let db = new Service('db', ['config']);
  db.run = async (ready, fail) => {
    // sleep 1s
    (new Promise(resolve => setTimeout(resolve, 1000))).then( () => {
      ready();
    });
  }
  services.add(db);

  let expected = [
    ['config'],
    ['db'],
    ['settings'],
    ['back', 'front']
  ];
  it('should return correct orders of services', (done) => {
    let list = services._sort(services._services);
    list.should.eql(expected);
    done();
  });
  it('should run with a correct order', (done) => {
    services.run().then((results) => {
      results.should.eql(expected);
      done();
    }); 
  });
  it('should fail when adding non-existing dep', async () => {
    let services = new Services();
    services.add([
      new Service('front', ['config'])
    ]);
    let results = await services.run();
    results.should.be.an.instanceOf(Error);
  });
});
