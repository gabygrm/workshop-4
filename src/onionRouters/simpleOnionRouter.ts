import bodyParser from "body-parser";
import express from "express";
import { BASE_ONION_ROUTER_PORT, REGISTRY_PORT } from "../config";
import { generateRsaKeyPair, exportPubKey, exportPrvKey, rsaDecrypt, symDecrypt, importPrvKey} from "../crypto";

export async function simpleOnionRouter(nodeId: number) {
  const onionRouter = express();
  onionRouter.use(express.json());
  onionRouter.use(bodyParser.json());

  let lastReceivedEncryptedMessage: string | null = null;
  let lastReceivedDecryptedMessage: string | null = null;
  var lastMessageSource: number | null = null;
  let lastMessageDestination: number | null = null;

  // génère la paire de clés RSA
  const { publicKey, privateKey } = await generateRsaKeyPair();
  const pubKeyString = await exportPubKey(publicKey);
  const prvKeyString = await exportPrvKey(privateKey);

  // enregistre le nœud dans le registre
  await fetch(`http://localhost:${REGISTRY_PORT}/registerNode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId, pubKey: pubKeyString}),
  });

  onionRouter.get("/status", (req, res) => {
    res.send("live");
  });

  onionRouter.get("/getLastReceivedEncryptedMessage", (req, res) => {
    res.json({ result: lastReceivedEncryptedMessage });
  });

  onionRouter.get("/getLastReceivedDecryptedMessage", (req, res) => {
    res.json({ result: lastReceivedDecryptedMessage });
  });

  onionRouter.get("/getLastMessageSource", (req, res) => {
    res.json({ result: lastMessageSource });
  });

  onionRouter.get("/getLastMessageDestination", (req, res) => {
    res.json({ result: lastMessageDestination });
  });

  onionRouter.get("/getPrivateKey", (req,res) => {
    res.json({ result: prvKeyString});
  });

  onionRouter.post("/message", async (req, res) => {
    const layer = req.body.message;

    const encryptedSymKey = layer.slice(0, 344);
    const symKey = prvKeyString ? await rsaDecrypt(encryptedSymKey, await importPrvKey(prvKeyString)) : null;
    const encryptedMessage = layer.slice(344);
    const message = symKey ? await symDecrypt(symKey, encryptedMessage) : null;
    lastMessageDestination = message ? parseInt(message.slice(0, 10), 10) : null;
    lastReceivedEncryptedMessage = layer;
    


    lastMessageSource = nodeId;
    lastReceivedDecryptedMessage = message ? message.slice(10) : null;
    

    
    if (lastMessageDestination) {
      await fetch(`http://localhost:${lastMessageDestination}/message`, {
        method: "POST",
        body: JSON.stringify({ message: lastReceivedDecryptedMessage }),
        headers: { "Content-Type": "application/json" },
      });
    }
    res.send("success");
  });
  
  
  

  const server = onionRouter.listen(BASE_ONION_ROUTER_PORT + nodeId, () => {
    console.log(
      `Onion router ${nodeId} is listening on port ${BASE_ONION_ROUTER_PORT + nodeId}`
    );
  });


  return server;
}