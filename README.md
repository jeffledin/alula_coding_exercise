# Allula Coding Exercise: Problem #1

## Requirements

- Node.js 12.x or above

## Running the API Server

First, install any dependencies:

```shell
npm install
```

Once the dependencies have been installed successfully, run the API server:

```shell
node index.js
```

## Using the API

The API runs on localhost, listening on port 3000. The supported endpoint(s) are
shown below.

### POST /api/v1/asteroids

Description: Retrieves a list of asteroids expected to pass near the earth during the specified date range.
Only asteroids less than or equal to the specified distance range are returned.

Required body parameters:
| Parameter | Description |
| ----------- | ----------- |
| dateStart | The start date to use for the asteroid search, formatted YYYY-MM-DD. |
| dateEnd | The end date to use for the asteroid search, formatted YYYY-MM-DD. |
| within | The maximum near-miss distance required to include an asteroid in the result. Supports units of miles and kilometers. See example below. |

Example body:

```json
{
  "dateStart": "2019-01-01",
  "dateEnd": "2019-01-07",
  "within": {
    "value": 900000,
    "units": "kilometers"
  }
}
```

Example response:

```json
{
  "asteroids": ["(2019 AH3)", "(2019 AB)", "(2019 AS3)", "(2019 AE3)"]
}
```
