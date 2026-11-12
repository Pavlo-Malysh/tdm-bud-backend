import { notifyTelegram } from "../middlewares/notifyTelegram.js";
import { createLead, getAllLeads } from "../services/projects.js";



export const getLeadsController = async (req, res) => {

    const leads = await getAllLeads();

    res.status(200).json({
        data: leads,
    });
};


export const createLeadController = async (req, res) => {
    const lead = await createLead(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a lead!",
        data: lead
    });

    notifyTelegram(req.body);
};
