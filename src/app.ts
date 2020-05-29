import express, { Application } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import socketIO, { Server as SocketIOServer } from 'socket.io';
import { join } from 'path';
import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';
import * as dotenv from 'dotenv';

dotenv.config();

export class App {
  private app!: Application;
  private httpServer!: HTTPServer;
  private io!: SocketIOServer;
  private assistant!: AssistantV2;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = socketIO(this.httpServer);

    this.middleware();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(join(__dirname, '../public')));
  }

  private handleRoutes(): void {
    this.app.get('/', (req, res) => {
      res.sendFile('index.html');
    });
  }

  private handleSocketConnection(): void {
    // Conecta ao serviço Watson Assistant
    this.assistant = new AssistantV2({
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_APIKEY!,
      }),
      version: process.env.WATSON_VERSION!,
      url: process.env.WATSON_URL,
      disableSslVerification: true,
    });

    const assistantId = process.env.WATSON_ASSISTANT_ID!; // ID do meu assitente

    // Abre a conexão com o socket
    this.io.on('connection', async (socket) => {
      console.log(`connectd ${socket.id}`); // ID do usuario conectado

      try {
        // Criando uma sessão para o usuário
        const session = await this.assistant.createSession({ assistantId });
        const { session_id } = session.result;
        // Escutando a mensagem do usuário e passando para o Watson Assistant
        socket.on('message', async (msg) => {
          const message = await this.assistant.message({
            assistantId,
            sessionId: session_id,
            input: {
              message_type: 'text',
              text: msg.message,
            },
          });
          // Tratando a resposta do Watson Assistant
          if (message.result.output.generic) {
            if (message.result.output.generic.length > 0) {
              if (message.result.output.generic[0].response_type === 'text') {
                let msg = {
                  user: 'Watson Assistent',
                  message: message.result.output.generic[0].text,
                };
                socket.emit('message', msg); // Enviando a mensagem para o usuário
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(process.env.APP_PORT, () =>
      callback(parseInt(<string>process.env.APP_PORT, 10))
    );
  }
}
