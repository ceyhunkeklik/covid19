#!/usr/bin/env node

const axios = require("axios").default;
const Spinner = require("clui").Spinner;
const Table = require("cli-table");
const argv = require("minimist")(process.argv.slice(2));
const chalk = require("chalk");

var countdown = new Spinner("Loading...  ", [
  "⣾",
  "⣽",
  "⣻",
  "⢿",
  "⡿",
  "⣟",
  "⣯",
  "⣷"
]);

countdown.start();

const getValue = country => [
  chalk.yellow.bold(country.totalConfirmed),
  chalk.green.bold(country.totalRecovered),
  chalk.red.bold(country.totalDeaths)
];

axios
  .get("https://www.bing.com/covid/data")
  .then(response => response.data)
  .then(response => {
    countdown.stop();

    const table = new Table({
      head: [
        chalk.black.bold("Area"),
        chalk.black.bold("Total Confirmed"),
        chalk.black.bold("Total Recovered"),
        chalk.black.bold("Total Death")
      ],
      colWidths: [30, 30, 30, 30]
    });

    if (argv.country) {
      var country = response.areas.find(area => {
        return (
          area.displayName.indexOf(argv.country) >= 0 ||
          area.country.indexOf(argv.country) >= 0
        );
      });
    }

    if (country) {
      table.push([country.country, ...getValue(country)]);
    } else {
      table.push(["Worldwide", ...getValue(response)]);

      response.areas.forEach(area => {
        table.push([area.country, ...getValue(area)]);
      });
    }

    console.log(table.toString());

    process.exit(0);
  });
