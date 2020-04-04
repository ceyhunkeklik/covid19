#!/usr/bin/env node

const axios = require("axios").default;
const Spinner = require("clui").Spinner;
const Table = require("cli-table");
const argv = require("minimist")(process.argv.slice(2));
const chalk = require("chalk");
const fetchData = require("./src/fetch");

var countdown = new Spinner("Loading...  ", [
  "⣾",
  "⣽",
  "⣻",
  "⢿",
  "⡿",
  "⣟",
  "⣯",
  "⣷",
]);

const { filterProp, displayProp } = require("./src/config");

countdown.start();

const getValue = (country) => [
  chalk.yellow.bold(country.totalConfirmed ? country.totalConfirmed : 0),
  chalk.green.bold(country.totalRecovered ? country.totalRecovered : 0),
  chalk.red.bold(country.totalDeaths ? country.totalDeaths : 0),
];

fetchData.then((response) => {
  countdown.stop();

  const table = new Table({
    head: [
      chalk.black.bold("Area"),
      chalk.black.bold("Total Confirmed"),
      chalk.black.bold("Total Recovered"),
      chalk.black.bold("Total Death"),
    ],
    colWidths: [30, 30, 30, 30],
  });

  if (argv.country) {
    var country = response.areas.find(
      (area) => area[filterProp].indexOf(argv.country) >= 0
    );
  }

  if (country) {
    table.push([country[displayProp], ...getValue(country)]);
  } else {
    table.push(["Worldwide", ...getValue(response)]);

    response.areas.forEach((area) => {
      if (area[displayProp]) {
        table.push([area[displayProp], ...getValue(area)]);
      }
    });
  }

  console.log(table.toString());

  process.exit(0);
});
