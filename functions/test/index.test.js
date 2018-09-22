const test = require('firebase-functions-test')();
const assert = require('assert');
const myFunctions = require('../lib/index.js');

describe('Cloud Functions', () => {
  after(() => {
    test.cleanup();
  });

  describe('dialogflowFirebaseFulfillment', () => {
    it('should return a 200 code', (done) => {
      const req = {
        responseId: 'c35788dc-b7af-4fad-85b8-db73f527c245',
        queryResult: {
          queryText: 'Il fait moche à Nice ?',
          parameters: {
            city: 'Nice',
          },
          allRequiredParamsPresent: true,
          fulfillmentMessages: [
            {
              text: {
                text: [''],
              },
            },
          ],
          intent: {
            name: 'projects/jose-15c01/agent/intents/4f1e8bd4-61e6-4c77-a5ab-bb4e8ef23620',
            displayName: 'weather',
          },
          intentDetectionConfidence: 0.7,
          languageCode: 'fr',
        },
        originalDetectIntentRequest: {
          payload: {},
        },
        session: 'projects/jose-15c01/agent/sessions/e6fde53a-7b37-c238-a545-55b3e16f07bb',
      };

      const res = {
        fullfillmentText: (text) => {
          assert.equal(text, 'wesolu');
          done();
        },
      };
      myFunctions.dialogflowFirebaseFulfillment(req, res);
    });
  });
});
