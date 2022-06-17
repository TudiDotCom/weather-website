const request = require("postman-request");

// request the weather
const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=fc6efe743be9005b2cc5ecd7c44637d7&units=m&query=" +
    latitude +
    "," +
    longitude;

  request({ url, json: true }, (error, {body}) => {
    //    console.log(error);

    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("Unable to find the location", undefined);
      console.log("Unable to find location");
    } else {
      callback(undefined, {
        weather_descriptions: body.current.weather_descriptions,
        temperature: body.current.temperature,
        feelsLike: body.current.feelslike,
        precip: body.current.precip
      });
    }
  });
};

module.exports = forecast;
