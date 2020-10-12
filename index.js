const express = require('express');
const app = express();
const port = 3000;

app.get('/api/v1', (req, res) => {
    res.send('Hello from Express API!');
});

// TODO: handle unsupported routes

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

