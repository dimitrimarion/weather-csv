This script takes one or several cities as parameters and generate a 4 day weather forecast as a csv file.

It uses the [WeatherAPI](https://www.weatherapi.com) to fetch the weather. You have to create an `.env` file and add your API key to the env variable `WEATHER_API_KEY`.

Install packages:

```
npm install
```

How to call the script:

```
node index.js Nice

node index.js Nice Paris Lyon
```

If you don't create a .env file you can directly pass the env variable when calling the script:

```
WEATHER_API_KEY=xxxxxxxxxxxx node index.js Nice
```
