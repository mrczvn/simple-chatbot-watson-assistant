const fnsAssitant = require('../helpers/watsonAssistant');

require('dotenv').config();

const handleSocketConn = ({ io }) => {
  const assistantId = process.env.WATSON_ASSISTANT_ID;

  io.on('connection', (socket) => {
    try {
      socket.on('message', async (msg) => {
        const sessionId = await fnsAssitant.createSession(assistantId);

        const message = await fnsAssitant.sendMessage(
          assistantId,
          sessionId,
          msg
        );

        if (message.result.output.generic) {
          if (message.result.output.generic.length > 0) {
            if (message.result.output.generic[0].response_type === 'text') {
              let msg = {
                user: 'Watson Assistent',
                message: message.result.output.generic[0].text,
              };
              socket.emit('message', msg);
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = handleSocketConn;
