const axios = require('axios');

const BASE_NASA_NEO_API_URL = 'https://api.nasa.gov/neo/rest/v1';
const NASA_FEED_API_URL = `${BASE_NASA_NEO_API_URL}/feed`;

/**
 * Represents a NASA NeoWs API client.
 */
class NasaClient {
  /**
   * @constructor
   * @param {string} apiKey - The API key required to access the NASA API.
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Gets the near-miss asteroids within a certain distance of Earth over a
   * specified date range. Note: the NASA API requires that the maximum date
   * range is 7 days.
   *
   * @param {string} dateStart - The start date to use for the asteroid search, formatted YYYY-MM-DD.
   * @param {string} dateEnd - The end date to use for the asteroid search, formatted YYYY-MM-DD.
   * @param {Object} within - The maximum near-miss distance required to include an asteroid in the result. 
   *                          Supports units of miles and kilometers. See example below.
   * @returns {Array}
   */
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

      // Iterate through all of the date ranges and filter the
      // asteroids in-memory based off the provided distance.
      const asteroids = [];
      for (const date in nearEarthObjects) {
        for (const asteroid of nearEarthObjects[date]) {
          // NOTE: close_approach_data is an array that appears to
          // only have one element. It is assumed that the first
          // element is used when reading the miss_distance for a
          // given asteroid.
          if (
            asteroid.close_approach_data[0].miss_distance[within.units] <=
            within.value
          ) {
            asteroids.push(asteroid.name);
          }
        }
      }

      return asteroids;
    } catch (err) {
      throw {
        status: err.response.data.code ? err.response.data.code : 500,
        message: err.response.data.error_message
          ? err.response.data.error_message
          : 'Unknown error'
      };
    }
  }
}

module.exports = {
  NasaClient
};
