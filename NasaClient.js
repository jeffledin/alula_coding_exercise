const axios = require('axios');

const BASE_NASA_NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1';
const NASA_FEED_API_URL = `${BASE_NASA_NEO_API_URL}/feed`;

class NasaClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getNearMissAsteroids(dateStart, dateEnd, within) {
    try {
      const { data } = await axios.get(NASA_FEED_API_URL, {
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

      return asteroids;
    } catch (err) {
      console.log(err);
      throw {
        status: 500,
        message: 'Unknown error'
      };
    }
  }
}

module.exports = {
  NasaClient
};
