const {Service, Services} = require('./index');

let services = new Services();
services.add([
  new Service('config', []),
  new Service('settings', ['config', 'db']),
  new Service('back', ['config', 'db', 'settings'])
]);

// override service.run()
class DB extends Service {

  async run(ready, fail) {
    console.log('db service init');
    // sleep for 3s then set to ready
    (new Promise(resolve => setTimeout(resolve, 3000))).then( () => {
      console.log('db ready');
      ready();
    });
  }

}
services.add(new DB('db', ['config']));

let front = new Service('front', ['config', 'db', 'settings']);

front.run = async (ready, fail) => {
  console.log('front end: init');
  ready();
};

services.add(front);

// run services
services.run().then((results) => {
  if (results instanceof Error) {
    console.log('error: ' + results);
  }
  console.log('done');
});



