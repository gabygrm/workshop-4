import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { BASE_USER_PORT } from "../config";

export type SendMessageBody = {
  message: string;
  destinationUserId: number;
};

export type User = {
  userId: number;
  lastReceivedMessage: string | null;
  lastSentMessage: string | null;
};

const users: User[] = []; // Tableau pour stocker les utilisateurs et leurs messages reçus/envoyés

export async function user(userId: number) {
  let _lastReceivedMessage: string | null = null;
  let _lastSentMessage: string | null = null;
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  // Route /status
  _user.get("/status", (req, res) => {
    res.send("live");
  });

  // Route pour récupérer le dernier message reçu
  _user.get("/getLastReceivedMessage", (req, res) => {
    return res.json({ result: _lastReceivedMessage });
  });

  // Route pour récupérer le dernier message envoyé
  _user.get("/getLastSentMessage", (req, res) => {
    return res.status(404).json({ result: _lastSentMessage });
  });

  // Route pour envoyer un message à un utilisateur
  _user.post("/sendMessage", async (req: Request, res: Response) => {
    const { message, destinationUserId }: { message: string, destinationUserId: number } = req.body;
    _lastSentMessage = message;
    await fetch(
      `http://localhost:${BASE_USER_PORT + destinationUserId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      }
    ).then((test) => res.status(200).send("success"))
  });

  // Route pour envoyer un message à un utilisateur
  _user.post("/message", (req: Request, res: Response) => {
    const { message }: { message: string } = req.body;

    // Enregistrer le message reçu
    _lastReceivedMessage = message;

    // // Si le message est destiné à un autre utilisateur, l'enregistrer aussi pour lui
    // const destinationUser = users.find(
    //   (u) => u.userId === req.body.destinationUserId
    // );
    // if (destinationUser) {
    //   destinationUser.lastReceivedMessage = message;
    // }

    res.status(200).send("success");
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(`User ${userId} is listening on port ${BASE_USER_PORT + userId}`);
  });

  return server;
}