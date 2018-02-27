import Pretender from 'fetch-pretender';

const server = new Pretender();

let cartID = 0;
let cart = [];
const products = {
  'P0001': { id:'P0001', name:'F22 Raptor' },
  'P0002': { id:'P0002', name:'B52 Carpet Bomber' }
}

server.get('/A12345678tom/api/cart', req => {
  return [400, {'content-type':'application/json'}, JSON.stringify({
    cid: cartID,
    items: []
  })];
});

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
        cart.push(Object.assign({}, item, {id: item.id, name: products[item.id].name}));
      }
    });
  }

  return [200, {'content-type':'application/json'}, JSON.stringify({items: cart})];
});

server.delete('/A12345678tom/api/cart', (req) => {
  const data = JSON.parse(req.requestBody);
  console.log(data);
  const {id} = data;

  if (id) {
    cart.splice(cart.findIndex(it => it.id === id), 1);
  }

  return [200, {'content-type':'application/json'}, JSON.stringify({items: cart})];
});

server.post('/A12345678tom/api/checkout', (req) => {
  const data = JSON.parse(req.requestBody);
  console.log(data);
  const {items} = data;

  return [200, {'content-type':'application/json'}, JSON.stringify({
    id: 'O1234',
    total: 2100,
    currency: 'USD',
    items
  })];
});

server.post('/A12345678tom/api/orders', (req) => {
  const data = JSON.parse(req.requestBody);
  console.log(data);
  const {id} = data;

  return [200, {'content-type':'application/json'}, JSON.stringify({
    order: {
      id,
      transaction_id: Date.now(),
    },
    next_cid: ++cartID
  })];
});

server.post('/A12345678tom/api/pay', (req) => {
  const {transaction_id} = extractBody(req, ['transaction_id']);

  return json({
    transaction_id,
    method: 'paypal',
    payment_url: '/mock-paypal-webscr.html'
  });
});

function extractBody(req, fields = []) {
  const data = JSON.parse(req.requestBody);
  console.log(data);
  const result = {};

  fields.forEach(field => {
    result[field] = data[field];
  });

  return result;
}

function json(data, status = 200) {
  return [status, {'content-type':'application/json'}, JSON.stringify(data)];
}
