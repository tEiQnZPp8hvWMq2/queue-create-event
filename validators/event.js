const Joi = require('@hapi/joi');
const option = {
    abortEarly: false,
    stripUnknown: {
        objects: true
    }
}


class Validator {

    calculateEvent (request) {
        return new Promise((resolve) => {
            const registerSchema =  Joi.object({
                agent_id : Joi.string().uuid().required(),
                type_status : Joi.string().required(),
                eventByAgent_id : Joi.string().uuid().required(),
                currency : Joi.string().required(),
                sDate :  Joi.date().required(),
                eDate :  Joi.date().required()
            })
            const { error } = registerSchema.validate(request, option);
            resolve(this.compareValidator(error));
        })
    }

    compareValidator(error, prefix = null){
        if (error) {
            var list = [];
            error.details.forEach(function (item, index) { 
                let { label } = item.context;
                list.push({label : prefix ? `${prefix}-${label}` : label, message : item.message});
            });
            
        }
        return list ? list : [];
    }
}

module.exports = new Validator();