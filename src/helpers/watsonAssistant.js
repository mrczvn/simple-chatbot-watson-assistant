const Assistant = require('../lib/watsonAssistant');

require('dotenv').config();

const createSession = async (assistantId) =>
  await Assistant()
    .createSession({ assistantId })
    .then((res) => res.result.session_id);

const sendMessage = async (assistantId, sessionId, msg) =>
  await Assistant().message({
    assistantId,
    sessionId,
    input: {
      message_type: 'text',
      text: msg.message,
    },
  });

module.exports = {
  createSession,
  sendMessage,
};
