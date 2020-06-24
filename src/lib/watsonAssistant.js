const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config();

const Assistant = () => {
  return new AssistantV2({
    authenticator: new IamAuthenticator({
      apikey: process.env.WATSON_APIKEY,
    }),
    version: process.env.WATSON_VERSION,
    url: process.env.WATSON_URL,
    disableSslVerification: true,
  });
};

module.exports = Assistant;
