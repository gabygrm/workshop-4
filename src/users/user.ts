import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Node } from '../registry/registry';
import { BASE_ONION_ROUTER_PORT, BASE_USER_PORT, REGISTRY_PORT } from "../config";
import { rsaEncrypt, symEncrypt, exportSymKey, createRandomSymmetricKey, importSymKey } from '../crypto';

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

let lastReceivedDecryptedMessage: string | null = null;
let lastSendDecryptedMessage: string | null = null;
export type circuitNode = {
  nodeId: number;
  pubKey: string;
};
let lastCircuit: circuitNode[] | null = null;

export async function user(userId: number) {
    const _user = express();
    _user.use(bodyParser.json());
    _user.use(express.json());

    _user.get("/status", (_, res) => {
        res.status(200).send("live");
    });

    _user.get("/getLastReceivedMessage", (_, res) => {
        res.status(200).json({ result: lastReceivedDecryptedMessage });
    });
    
    _user.get("/getLastSentMessage", (_, res) => {  
        res.status(200).json({ result: lastSendDecryptedMessage });
    });

    _user.post("/message", (req, res) => {
        lastReceivedDecryptedMessage = req.body.message;
        res.status(200).send("success");
    });

    _user.get("/getLastCircuit", (_, res) => {
        if (lastCircuit) {
            res.status(200).json({ result: lastCircuit.map(node => node.nodeId) });
        } else {
            res.status(404).send("No circuit found");
        }
    });

    _user.post('/sendMessage', async (req, res) => {
        const { message, destinationUserId } = req.body;
        lastSendDecryptedMessage = message;

        try {
            const response = await axios.get(`http://localhost:${REGISTRY_PORT}/getNodeRegistry`);
            const nodes = response.data.nodes as Node[];

            const circuit: circuitNode[] = [];
            while (circuit.length < 3) {
                const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
                if (!circuit.includes(randomNode)) {
                    circuit.push(randomNode);
                }
            }
            let destination = String(BASE_USER_PORT + destinationUserId).padStart(10, '0');
            let encryptedMessage = message;
            for (const node of circuit) {
                const symKeyCrypto = await createRandomSymmetricKey();
                const symKeyString = await exportSymKey(symKeyCrypto);
                const symKey = await importSymKey(symKeyString);
                
                const tempMessage = await symEncrypt(symKey, destination + encryptedMessage);
                destination = String(BASE_ONION_ROUTER_PORT + node.nodeId).padStart(10, '0');
                const encryptedSymKey = await rsaEncrypt(symKeyString, node.pubKey);
                encryptedMessage = encryptedSymKey + tempMessage;
            }
            circuit.reverse();
            lastCircuit = circuit;
            const entryNode = circuit[0];
            
            if (encryptedMessage) {
                await axios.post(`http://localhost:${BASE_ONION_ROUTER_PORT + entryNode.nodeId}/message`, {
                    message: encryptedMessage,
                });
                res.status(200).send('Message sent');
            }
        } catch (error) {
            res.status(500).send('Error sending message');
        }
    });

    const server = _user.listen(BASE_USER_PORT + userId, () => {
        console.log(`User ${userId} is listening on port ${BASE_USER_PORT + userId}`);
    });

    return server;
}
