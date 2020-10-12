const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

const BASE_NASA_NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse';

if (!process.env.NASA_API_KEY) {
  console.error('NASA_API_KEY environment variable not set');
  process.exit(1);
}

app.post('/api/v1/asteroids', async (req, res) => {
  try {
    const { data } = await axios.get(BASE_NASA_NEO_API_URL, {
      params: {
        api_key: process.env.NASA_API_KEY
      }
    });

    console.log(data);

    res.send(data);
  } catch (err) {
    console.log(err);
    res.send({
      error: true
    });
  }
});

// TODO: handle unsupported routes

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
