require('dotenv').config();

const app = require('./app');
const { createServer } = require('http');

const httpServer = createServer(app);

httpServer.listen(process.env.APP_PORT, () =>
  console.log(`Server is listening on port: ${process.env.APP_PORT}`)
);

app.io.attach(httpServer);
