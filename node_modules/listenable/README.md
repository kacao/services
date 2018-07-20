# listenable
Simplified async EventEmitter for Node.js

Installation
------
```javascript
npm install -s kacao/listenable
```

Usage
------
```javascript
const Listenable = require('listenable');
let l = new Listenable('some-id');
l.on('test', async () => { console.log('testing') });
l.emit('test');
```
