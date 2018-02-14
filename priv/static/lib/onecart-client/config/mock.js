import Pretender from 'fetch-pretender';

const server = new Pretender();

let cartID = 0;
let cart = [];
const products = {
  'P0001': { id:'P0001', name:'F22 Raptor' },
  'P0002': { id:'P0002', name:'B52 Carpet Bomber' }
}

server.post('/A12345678tom/api/cart', (req) => {

  return [200, {'content-type':'application/json'}, JSON.stringify({cid: ++cartID})];
});

server.put('/A12345678tom/api/cart', (req) => {
  const data = JSON.parse(req.requestBody);
  console.log(data);

  if (data) {
    data.forEach(item => {
      const it = cart.find(it => it.id === item.id);
      if (it) {
        it.qty = item.qty;
      } else {
        cart.push(Object.assign({}, item, {product: products[item.id].name}));
      }
    });
  }

  return [200, {'content-type':'application/json'}, JSON.stringify(cart)];
});

server.delete('/A12345678tom/api/cart', (req) => {
  const data = JSON.parse(req.requestBody);
  console.log(data);
  const {id} = data;

  if (id) {
    cart.splice(cart.findIndex(it => it.id === id), 1);
  }

  return [200, {'content-type':'application/json'}, JSON.stringify(cart)];
});

