

// 'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const http = require('http');
// const { Card, Suggestion } = require('dialogflow-fulfillment');

const host = 'api.worldweatheronline.com';
const wwoApiKey = '876d784e29d14d2782f115732182209';

process.env.DEBUG = 'dialogflow:debug';

function callWeatherApi(city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = `${'/premium/v1/weather.ashx?format=json&num_of_days=1&q='}${encodeURIComponent(city)}&key=${wwoApiKey}`;

    if (date) {
      path += `&date=${date}`;
    }
    console.log(`API Request: ${host}${path}`);

    // Make the HTTP request to get the weather
    http.get({ host, path }, res => {
      let body = ''; // var to store the response chunks
      res.on('data', d => {
        body += d;
      }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        const wwoResponse = JSON.parse(body);
        const forecast = wwoResponse.data.weather[0];
        const location = wwoResponse.data.request[0];

        // Create response
        const output = `Aujourd'hui à ${location.query} la température maximale est de ${forecast.maxtempC}°C et la température minimale est de ${forecast.mintempC}°C`;

        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', error => {
        console.log(`Error calling the weather API: ${error}`);
        reject();
      });
    });
  });
}

async function giveWeather(agent) {
  const { city } = agent.parameters;
  const date = '';
  // Call the weather API
  await callWeatherApi(city, date).then(output => {
    agent.add(output); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    agent.add('Je ne sais pas quel temps il fait mais j\'espère qu\'il fait beau mais frais mais beau');
  });
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agentHook = new WebhookClient({ request, response });
  console.log(`Dialogflow Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Dialogflow Request body: ${JSON.stringify(request.body)}`);

  const intentMap = new Map();
  intentMap.set('weather', giveWeather);
  agentHook.handleRequest(intentMap);
});

exports.callWeatherApi = callWeatherApi;