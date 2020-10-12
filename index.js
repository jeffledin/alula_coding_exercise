const express = require('express');

const { NasaClient } = require('./NasaClient');

const app = express();
const port = 3000;

app.use(express.json());

if (!process.env.NASA_API_KEY) {
  console.error('NASA_API_KEY environment variable not set');
  process.exit(1);
}

const validateBodyContents = body => {
  if (!body || !Object.keys(body).length) {
    throw {
      status: 400,
      message: 'Missing required parameters'
    };
  }

  if (
    !body.dateStart ||
    !body.dateEnd ||
    !body.within ||
    !body.within.value ||
    !body.within.units
  ) {
    throw {
      status: 400,
      message: 'One or more parameters are missing'
    };
  }

  if (body.within.units !== 'kilometers' && body.within.units !== 'miles') {
    throw {
      status: 400,
      message: 'Invalid unit provided, must be either kilometers or miles'
    };
  }
};

app.post('/api/v1/asteroids', async (req, res) => {
  const { body } = req;

  try {
    validateBodyContents(body);

    const { dateStart, dateEnd, within } = body;

    const nasaClient = new NasaClient(process.env.NASA_API_KEY);
    const asteroids = await nasaClient.getNearMissAsteroids(dateStart, dateEnd, within);

    res.send({ asteroids });
  } catch (err) {
    console.log(err);
    res.status(err.status ? err.status : 500).send({
      error: true,
      message: err.message ? err.message : 'Unknown'
    });
  }
});

// TODO: handle unsupported routes

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
