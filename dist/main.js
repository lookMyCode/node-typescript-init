import express from "express";
import * as dotenv from 'dotenv';
import tunnel from 'tunnel-ssh';
import * as mongoose from 'mongoose';
import App from "./app/app.js";
dotenv.config();
const { PORT, SERVER_USERNAME, SERVER_PASSWORD, SERVER_HOST, SERVER_PORT, DST_HOST, DST_PORT, LOCAL_HOST, LOCAL_PORT, IS_SERVER, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB_NAME, } = process.env;
const isServer = IS_SERVER == '1';
const tunnelConfig = {
    username: SERVER_USERNAME,
    password: SERVER_PASSWORD,
    host: SERVER_HOST,
    port: +SERVER_PORT,
    dstHost: DST_HOST,
    dstPort: +DST_PORT,
    localHost: LOCAL_HOST,
    localPort: +LOCAL_PORT,
};
const app = express();
if (isServer) {
    start();
}
else {
    tunnel(tunnelConfig, (e, s) => {
        if (e) {
            console.error(e);
            return;
        }
        console.log('===============');
        console.log('CONNECTED TO REMOTE SERVER');
        console.log('===============');
        start();
    });
}
function start() {
    mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${LOCAL_HOST}:${LOCAL_PORT}/${MONGODB_DB_NAME}`, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, async (err) => {
        if (err) {
            console.log('===============');
            console.log(err);
            console.log('===============');
            return;
        }
        console.log('===============');
        console.log('CONNECTED TO DATABASE');
        console.log('===============');
        listen();
    });
    mongoose.set('strictQuery', false);
}
function listen() {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        new App();
    });
}
//# sourceMappingURL=main.js.map