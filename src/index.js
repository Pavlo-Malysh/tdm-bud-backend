import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import projectsRouter from './routers/projects.js';
import reviewsRouter from './routers/reviews.js';
import leadsRouter from './routers/leads.js';

const app = new Hono();

app.use('*', cors());

app.route('/projects', projectsRouter);
app.route('/reviews', reviewsRouter);
app.route('/leads', leadsRouter);

app.notFound((c) => c.json({ status: 404, message: 'Route not found' }, 404));

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json(
            { status: err.status, message: err.message, errors: err.cause },
            err.status,
        );
    }
    console.error(err);
    return c.json({ status: 500, message: 'Something went wrong' }, 500);
});

export default app;
