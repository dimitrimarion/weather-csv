import axios from "axios";

const args = process.argv.slice(2);
console.log(args);

async function fetchWeather(location) {
  try {
    const response = await axios.get(
      "http://api.weatherapi.com/v1/forecast.json",
      {
        params: {
          key: "c7ddd9a98ae54282bd1142642240709",
          q: location,
          days: 4,
          aqi: "no",
          alerts: "no",
        },
      }
    );

    const { forecast } = response.data;
    const { forecastday } = forecast;

    forecastday.forEach((forecast) => {
      const { date, day } = forecast;
      const averageTemp = day.avgtemp_c;
      const condition = day.condition.text;

      console.log(`${date}, ${condition}, ${averageTemp}`);
    });
  } catch (e) {
    const { code } = e;
    console.log(code);
    console.log(`Wheater forecast for '${location}' not found`);
  }
}

fetchWeather(args[0]);
