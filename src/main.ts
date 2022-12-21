import express, { Application, Request, Response } from "express";
import * as dotenv from 'dotenv';
import tunnel, { Config } from 'tunnel-ssh';
import * as mongoose from 'mongoose';
import App from "./app/app.js";


dotenv.config();

const {
  PORT,
  SERVER_USERNAME,
  SERVER_PASSWORD,
  SERVER_HOST,
  SERVER_PORT,
  DST_HOST,
  DST_MONGO_PORT,
  LOCAL_HOST,
  LOCAL_MONGO_PORT,
  IS_SERVER,
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DB_NAME,
  DST_REDIS_PORT,
  LOCAL_REDIS_PORT,
} = process.env as {[k: string]: string};

const isServer = IS_SERVER == '1';
const mongoTunnelConfig: Config = {
  username: SERVER_USERNAME,
  password: SERVER_PASSWORD,
  host: SERVER_HOST,
  port: +SERVER_PORT,
  dstHost: DST_HOST,
  dstPort: +DST_MONGO_PORT,
  localHost: LOCAL_HOST,
  localPort: +LOCAL_MONGO_PORT,
}

const conFlags = {
  mongoConnected: false,
  redisConnected: false,
}

const app: Application = express();


if (isServer) {
  startMongo();
  startRedis();
} else {
  startMongoTunnel();
  startRedisTunnel();
}

function startMongoTunnel() {
  tunnel(mongoTunnelConfig, (e: any, s: any) => {
    if (e) {
      console.error(e);
      return;
    }

    console.log('===============');
    console.log('CONNECTED TO REMOTE SERVER');
    console.log('===============');

    startMongo();
  });
}

function startRedisTunnel() {
  tunnel({
    username: SERVER_USERNAME,
    password: SERVER_PASSWORD,
    host: SERVER_HOST,
    port: +SERVER_PORT,
    dstHost: DST_HOST,
    dstPort: +DST_REDIS_PORT,
    localHost: LOCAL_HOST,
    localPort: +LOCAL_REDIS_PORT
  }, async (e: any, s: any) => {
    if (e) {
      console.log(e);
    }

    startRedis();
  });
}

function startMongo() {
  mongoose.connect(
    `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${LOCAL_HOST}:${LOCAL_MONGO_PORT}/${MONGODB_DB_NAME}`, 
      {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any,
    async err => {
      if (err) {
        console.log('===============');
        console.log(err);
        console.log('===============');
        return;
      }

      console.log('===============');
      console.log('CONNECTED TO DATABASE');
      console.log('===============');

      conFlags.mongoConnected = true;
      listen();
    }
  );

  mongoose.set('strictQuery', false);
}

function startRedis() {
  console.log('===============');
  console.log('CONNECTED TO REDIS');
  console.log('===============');

  conFlags.redisConnected = true;
  listen();
}

function listen() {
  const allFlags = Object.values(conFlags).every(flag => flag);
  if (!allFlags) return;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    new App();
  });
}
