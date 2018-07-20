const should = require('should');
const Listenable = require('../listenable');

describe('Listenable', () => {
  console.log(Listenable);
  it('should fail on on invalid id', () => {
    (() => {new Listenable('')}).should.throw();
    (() => {new Listenable(3)}).should.throw();
  });
  it('should add handlers correctly', () => {
    let l = new Listenable('test');
    l.on('test', async () => {});
    should.exist(l._callbacks.test);
  });
  it('should emit correctly', (done) => {
    let l = new Listenable('test');
    l.on('test', async () => { done(); });
    l.emit('test'); 
  });
});
