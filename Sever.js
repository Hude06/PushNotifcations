// server.mjs
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
const port = 3500;
let newUser = false;
const clientId = '3f9756c0e365406b866a';
const clientSecret = '2657f125505c135d73786f452d7095edefd71ad4'
let currentOnlineUsers = ["NoName"];
app.use(cors({ origin: [ "*"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/save', (req, res) => {
  res.send("Simple Notifacation")
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
