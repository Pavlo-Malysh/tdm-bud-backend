import Joi from 'joi';

export const createLeadSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required().messages({
        'string.empty': "Ім'я обов'язкове",
        'string.min': "Ім'я має містити щонайменше 3 символи",
        'string.max': "Ім'я занадто довге",
        'any.required': "Ім'я обов'язкове",
    }),
    phone: Joi.string()
        .replace(/\D/g, '')
        .pattern(/^(380\d{9}|0\d{9})$/)
        .custom((value) => (value.startsWith('0') ? `+38${value}` : `+${value}`))
        .required()
        .messages({
            'string.empty': "Вкажіть номер телефону",
            'string.min': "Номер телефону надто короткий",
            'string.max': "Телефон занадто довгий",
            'any.required': "Телефон обов'язковий",
        }),

});
