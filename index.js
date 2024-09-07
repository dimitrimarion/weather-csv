import axios from "axios";
import "dotenv/config";
import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import { format } from "date-fns";

const args = process.argv.slice(2);

async function fetchWeather(location) {
  try {
    const response = await axios.get(
      "http://api.weatherapi.com/v1/forecast.json",
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: location,
          days: 4,
          aqi: "no",
          alerts: "no",
        },
      }
    );

    const { forecast } = response.data;
    const { forecastday } = forecast;
    const csvData = [];

    forecastday.forEach((forecast) => {
      const { date, day } = forecast;
      const averageTemp = day.avgtemp_c;
      const condition = day.condition.text;

      csvData.push({
        date: format(new Date(date), "dd/MM/yyyy"),
        météo: condition,
        "température moyenne": averageTemp,
      });
    });
    return { csvData, location };
  } catch (e) {
    const { code } = e;
    throw new Error(`Failed to fetch weather data for '${location}': ${code}`);
  }
}

function generateForecastCSV(data, location) {
  // mkConfig merges your options with the defaults
  // and returns WithDefaults<ConfigOptions>
  const csvConfig = mkConfig({ useKeysAsHeaders: true });
  const csv = generateCsv(csvConfig)(data);
  const filename = `${location}-${data.length}d.csv`;
  const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

  // Write the csv file to disk
  writeFile(filename, csvBuffer, (err) => {
    if (err) throw err;
    console.log("file saved: ", filename);
  });
}

async function main() {
  const fetchPromises = args.map((arg) => fetchWeather(arg));
  const fetchResults = await Promise.allSettled(fetchPromises);
  for (const result of fetchResults) {
    if (result.status == "fulfilled") {
      const { csvData, location } = result.value;
      generateForecastCSV(csvData, location);
    } else if (result.status === "rejected") {
      console.error(`Error: ${result.reason.message}`);
    }
  }
}

main();
