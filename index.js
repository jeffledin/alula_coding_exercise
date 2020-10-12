const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

const BASE_NASA_NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';

if (!process.env.NASA_API_KEY) {
  console.error('NASA_API_KEY environment variable not set');
  process.exit(1);
}

const validateBodyContents = body => {
  if (!body || !Object.keys(body).length) {
    throw new Error('Missing required parameters');
  }

  if (
    !body.dateStart ||
    !body.dateEnd ||
    !body.within ||
    !body.within.value ||
    !body.within.units
  ) {
    throw new Error('One or more parameters are missing');
  }

  if (body.within.units !== 'kilometers' && body.within.units !== 'miles') {
    throw new Error(
      'Invalid unit provided, must be either kilometers or miles'
    );
  }
};

app.post('/api/v1/asteroids', async (req, res) => {
  const { body } = req;

  try {
    validateBodyContents(body);

    const { dateStart, dateEnd, within } = body;

    // TODO: pagination
    const { data } = await axios.get(BASE_NASA_NEO_API_URL, {
      params: {
        start_date: dateStart,
        end_date: dateEnd,
        api_key: process.env.NASA_API_KEY
      }
    });

    const { near_earth_objects: nearEarthObjects } = data;

    const asteroids = [];
    for (const date in nearEarthObjects) {
      for (const asteroid of nearEarthObjects[date]) {
        // TODO: close_approach_data is an array... interesting...
        if (
          asteroid.close_approach_data[0].miss_distance[within.units] <=
          within.value
        ) {
          //   console.log(asteroid.close_approach_data);
          asteroids.push(asteroid.name);
        }
      }
    }

    res.send({ asteroids });
  } catch (err) {
    console.log(err);
    res.send({
      error: true,
      message: err.message ? err.message : 'Unknown'
    });
  }
});

// TODO: handle unsupported routes

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
