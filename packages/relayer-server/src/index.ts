import express from 'express';
import bodyParser from 'body-parser';
import { JSONRPCServer } from 'json-rpc-2.0';
import { TESTNET } from '@iobridge/constants';

const server = new JSONRPCServer<{ text: string }>();

// TODO
server.addMethod('getDepositLock', () => TESTNET.CKB_BRIDGE_LOCK);

const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
  const jsonRPCRequest = req.body;
  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204);
    }
  });
});

app.listen(3030);
