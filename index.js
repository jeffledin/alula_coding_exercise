const express = require('express');
const { body, validationResult } = require('express-validator');

const { NasaClient } = require('./NasaClient');

const app = express();
const port = 3000;

app.use(express.json());

if (!process.env.NASA_API_KEY) {
  console.error('NASA_API_KEY environment variable not set');
  process.exit(1);
}

app.post(
  '/api/v1/asteroids',
  [
    body('dateStart', 'Invalid start date').isString(),
    body('dateEnd', 'Invalid end date').isString(),
    body(
      'within.value',
      'Invalid distance value, must be positive number'
    ).isFloat({
      min: 0.0
    }),
    body('within.units', 'Invalid units, must be kilometers or miles').isIn([
      'kilometers',
      'miles'
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: errors.array()[0].msg
      });
    }

    const { body } = req;

    try {
      const { dateStart, dateEnd, within } = body;

      const nasaClient = new NasaClient(process.env.NASA_API_KEY);
      const asteroids = await nasaClient.getNearMissAsteroids(
        dateStart,
        dateEnd,
        within
      );

      res.json({ asteroids });
    } catch (err) {
      res.status(err.status ? err.status : 500).json({
        error: true,
        message: err.message ? err.message : 'Unknown'
      });
    }
  }
);

app.use((req, res) => {
  res.status(501).json({
    error: true,
    message: 'Endpoint not implemented'
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
