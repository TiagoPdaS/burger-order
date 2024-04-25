const express = require('express');
const uuid = require('uuid');
const port = 3000;

const app = express();
app.use(express.json());


// Array to store the orders
const orders = [];

// Middleware to check if the ID exists
const checkIdExists = (req, res, next) => {
    
  const { id } = req.params;

  const index = orders.findIndex((order) => order.id == id);
  if (index < 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  req.orderIndex = index;
  req.orderID = id;


  next();
}

// Route to list all orders
app.get('/orders', (req, res) => {
    return res.json(orders);
  });
  

// Route to create a new order
app.post('/orders', (req, res) => {
  const { order, clientName, price } = req.body;
  const newOrder = { id:uuid.v4(), order, clientName, price };
  orders.push(newOrder);
  return res.status(201).json(newOrder);
});


// Route to update an existing order
app.put('/orders/:id', checkIdExists, (req, res) => {
  const { order, clientName, price } = req.body;
  const index = req.orderIndex;
  const  id  = req.orderID;
  const updateOrder = {id, order, clientName, price };

  orders[index] = updateOrder;
  return res.json(updateOrder);
});

// Route to delete an order
app.delete('/orders/:id', checkIdExists, (req, res) => {
  const index = req.orderIndex;
  orders.splice(index, 1);
  return res.status(204).json();
});

// Route to get a specific order
app.get('/orders/:id', checkIdExists, (req, res) => {
    const index = req.orderIndex;
    
    return res.json(orders);
  });

app.listen(port, () => {
  console.log(`🚀🚀 Server is running on port ${port} 🚀🚀`);
});

