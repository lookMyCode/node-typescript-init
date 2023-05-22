import express, { Application } from "express";
import * as dotenv from 'dotenv';
import App from "./app/app.js";


dotenv.config();

const {
  PORT,
  IS_SERVER,
} = process.env as {[k: string]: string};

const isServer = IS_SERVER == '1';

const app: Application = express();


if (isServer) {
  listen();
} else {
  console.error('Remote server is not allowed');
}

function listen() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    new App();
  });
}
