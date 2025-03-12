import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";

export type Node = { nodeId: number; pubKey: string };

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};



export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  const nodeRegistry: Node[] = [];

  _registry.get("/status", (req, res) => {
    res.send("live");
  });

  _registry.post("/registerNode", (req: Request, res: Response) => {
    console.log("Received body:", req.body); 
    const { nodeId, pubKey}: RegisterNodeBody = req.body;
    if (nodeId === undefined || pubKey === undefined || pubKey === "") {
      return res.status(400).json({ error: "Missing nodeId, pubKey, or prvKey" });
    }

    if (nodeRegistry.some(node => node.nodeId === nodeId)) {
      return res.status(400).json({ error: "Node already registered" });
    }

    nodeRegistry.push({ nodeId, pubKey });

    return res.json({ message: "Node registered successfully" });
  });

  _registry.get("/getNodeRegistry", (req: Request, res: Response) => {
    return res.json({ nodes: nodeRegistry });
  });

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`Registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}