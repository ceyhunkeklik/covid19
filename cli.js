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
  "⣷",
]);

countdown.start();

const isCountry = !!argv.country;
const endpoint = isCountry
  ? `https://corona.lmao.ninja/v2/countries/${argv.country}`
  : `https://corona.lmao.ninja/v2/countries`;

axios(endpoint)
  .then((response) => {
    countdown.stop();

    const table = new Table({
      head: [
        chalk.black.bold("Area"),
        chalk.black.bold("Total Confirmed"),
        chalk.black.bold("Total Recovered"),
        chalk.black.bold("Total Death"),
      ],
      colWidths: [30, 30, 30, 30],
      colAligns: ["left", "right", "right", "right"],
    });

    const mappedData = Array.isArray(response.data)
      ? response.data.map(({ country, cases, recovered, deaths }) => ({
          country,
          cases,
          recovered,
          deaths,
        }))
      : [
          {
            country: response.data.country,
            cases: response.data.cases,
            recovered: response.data.recovered,
            deaths: response.data.deaths,
          },
        ];

    if (!isCountry) {
      table.push(["Worldwide", 0, 0, 0]);
    }

    const formatter = new Intl.NumberFormat();

    const formatCell = (value, percentage) => {
      return `${value} (${chalk.black.bold(`${percentage.toFixed(2)}%`)})`;
    };

    mappedData.forEach(({ country, cases, recovered, deaths }) => {
      if (!isCountry) {
        table[0][1] += cases;
        table[0][2] += recovered;
        table[0][3] += deaths;
      }

      table.push([
        country,
        formatter.format(cases),
        formatCell(recovered, (recovered * 100) / cases),
        formatCell(deaths, (deaths * 100) / cases),
      ]);
    });

    if (!isCountry) {
      table[0][2] = formatCell(table[0][2], (table[0][2] * 100) / table[0][1]);
      table[0][3] = formatCell(table[0][3], (table[0][3] * 100) / table[0][1]);
      table[0][1] = formatter.format(table[0][1]);
    }

    console.log(table.toString());

    process.exit(0);
  })
  .catch((reason) => {
    countdown.stop();
    console.error(reason);
  });
