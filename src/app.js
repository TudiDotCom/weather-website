const request = require("postman-request");
const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/weather");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Tudicul",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Tudicul me",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "This is some helpful text :-) ",
    name: "Hello motherfucker",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  let location = req.query.address;

  geocode(location, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(
      latitude,
      longitude,
      (error, { weather_descriptions, temperature, feelsLike } = {}) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          address: req.query.address,
          location,
          forecast: weather_descriptions,
          temperature,
          feelsLike,
        });

        console.log(
          "\nWeather summary: " +
            weather_descriptions +
            "\nTemperature: " +
            temperature +
            "\nThe temperature feels like: " +
            feelsLike
        );
      }
    );
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404notfound", {
    title: "404 404 404 404 404",
    errorMessage: "Help article not found. ",
    name: "Hyper",
  });
});

app.get("*", (req, res) => {
  res.render("404notfound", {
    title: "404",
    errorMessage: "Page not found. ",
    name: "Hyper",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
