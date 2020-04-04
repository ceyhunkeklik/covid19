const axios = require("axios").default;

const prop = "total_cases";

const { filterProp, displayProp } = require("./config");

const headers = {
  "Accept-Language": "en-US",
};

function compare(b, a) {
  if (a[prop] < b[prop]) {
    return -1;
  }
  if (a[prop] > b[prop]) {
    return 1;
  }
  return 0;
}

module.exports = new Promise((resolve) => {
  const countriesUrl =
    "https://api.thevirustracker.com/free-api?countryTotals=ALL";
  const globalUrl = "https://api.thevirustracker.com/free-api?global=stats";

  const globalRequest = axios.get(globalUrl);
  const countriesRequest = axios.get(countriesUrl);

  axios
    .all([globalRequest, countriesRequest])
    .then(
      axios.spread((...responses) => {
        const worldwide = responses[0].data.results[0];
        const areas = Object.values(responses[1].data.countryitems[0])
          .sort(compare)
          .map((country) => ({
            [displayProp]: country.title,
            totalConfirmed: country.total_cases,
            totalRecovered: country.total_recovered,
            totalDeaths: country.total_deaths,
          }));

        resolve({
          totalConfirmed: worldwide.total_cases,
          totalRecovered: worldwide.total_recovered,
          totalDeaths: worldwide.total_deaths,
          areas,
        });
      })
    )
    .catch((errors) => {
      // react on errors.
    });
});
