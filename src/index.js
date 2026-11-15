
// import { initMongoDB } from './db/initMongoDB.js';
// import { startServer } from './server.js';

// const bootstrap = async () => {
//     await initMongoDB();
//     startServer();
// };

// bootstrap();


import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { MongoClient } from 'mongodb';
import { createLeadSchema } from './validation/project.js';

let client;
const getDb = async (env) => {
    if (!client) {
        client = new MongoClient(
            `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_URL}/${env.MONGODB_DB}?retryWrites=true&w=majority`
        );
        await client.connect();
    }
    return client.db(env.MONGODB_DB);
};

const notifyTelegram = (env, lead) =>
    fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: env.TG_CHAT_ID,
            text: `Нова заявка!\nІм'я: ${lead.username}\nТелефон: ${lead.phone}`,
        }),
    }).catch((e) => console.error('Telegram error', e));

const app = new Hono();
app.use('*', cors());

app.get('/leads', async (c) => {
    const db = await getDb(c.env);
    const leads = await db.collection('leads').find().toArray();
    return c.json({ data: leads });
});

app.post('/leads', async (c) => {
    let body;
    try {
        body = await createLeadSchema.validateAsync(await c.req.json(), {
            abortEarly: false,
            stripUnknown: true,
        });
    } catch (err) {
        return c.json({ status: 400, message: 'Bad Request', errors: err.details }, 400);
    }

    const db = await getDb(c.env);
    const doc = { ...body, createdAt: new Date(), updatedAt: new Date() };
    const { insertedId } = await db.collection('leads').insertOne(doc);

    c.executionCtx.waitUntil(notifyTelegram(c.env, body));

    return c.json(
        { status: 201, message: 'Successfully created a lead!', data: { _id: insertedId, ...doc } },
        201,
    );
});

app.notFound((c) => c.json({ status: 404, message: 'Route not found' }, 404));
app.onError((err, c) => {
    console.error(err);
    return c.json({ status: 500, message: 'Something went wrong' }, 500);
});

export default app;
