
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
    await initMongoDB();
    startServer();
};

bootstrap();




// mongodb + srv://<db_username>:BqCKH9rLEPZ2f3SB@cluster0.wsurpgj.mongodb.net/

