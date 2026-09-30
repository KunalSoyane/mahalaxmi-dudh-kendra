import repl from 'node:repl';
const session=repl.start({prompt:'milk-lab> '});
session.context.products=[{name:'Milk',price:29},{name:'Biscuits',price:30}];
console.log('Try: products.map(p => p.price)');
console.log('Try: products.reduce((total, p) => total + p.price, 0)');
console.log('Type .exit to finish.');
