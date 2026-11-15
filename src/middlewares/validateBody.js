import { HTTPException } from 'hono/http-exception';

export const validateBody = (schema) => async (c, next) => {
    try {
        const value = await schema.validateAsync(await c.req.json(), {
            abortEarly: false,
            stripUnknown: true,
        });
        c.set('body', value);
    } catch (err) {
        throw new HTTPException(400, { message: 'Bad Request', cause: err.details });
    }
    await next();
};
