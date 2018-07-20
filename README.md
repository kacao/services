# Services
Running async services with dependencies in node.js

Installation
------
```javascript
npm install kacao/services
```

Usage
------

This creates 5 services: `config`, `db`, `settings`, `backend` and `frontend`, call run() will load services in this order (services will wait for dependencies to be ready before starting to run): 
- `config`
- `db`
- `settings`
- `backend` and `frontend` (asynchronously without waiting for each other)&nbsp;
```javascript
const {Service, Services} = require('./index');

let services = new Services();
services.add([
  new Service('config', []),
  new Service('db', ['config']);                         // db depends on config
  new Service('settings', ['config', 'db']),             // settings depends on config and db
  new Service('backend', ['config', 'db', 'settings'])   // backend depends on config, db and settings
  new Service('frontend', ['config', 'db', 'settings'])  // frontend depends on config, db and settings
  
]);

services.run().then( () => {
  console.log('done');
});
```

### The run() function
Services have `async run()` which we can override to run a service after all dependencies are ready.&nbsp;
```javascript
let db = new Service('db', ['config']);
services.add(db);

db.run = async (ready, fail) => {
     console.log('db service init');
    // sleep for 3s then set to ready
    (new Promise(resolve => setTimeout(resolve, 3000))).then( () => {
      console.log('db ready');
      ready();
    });
}
```

Calling `ready()` will let depending services to start running, calling `fail()` will cause `Services` to stop loading services and return an `Error`.
