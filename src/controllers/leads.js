import { getDb } from '../db/mongo.js';
import { getAllLeads, createLead } from '../services/leads.js';
import { notifyTelegram } from '../services/telegram.js';

export const getLeadsController = async (c) => {
    const leads = await getAllLeads(await getDb(c.env));
    return c.json({ status: 200, data: leads });
};

export const createLeadController = async (c) => {
    const body = c.get('body');
    const lead = await createLead(await getDb(c.env), body);
    c.executionCtx.waitUntil(notifyTelegram(c.env, body));
    
    return c.json({ status: 201, message: 'Successfully created a lead!', data: lead }, 201);
};
