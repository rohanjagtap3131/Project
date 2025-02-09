const joi = require('joi');

module.exports.listingSehema = joi.object({
    listing :joi.object({
       titles :joi.string().required(),
       description :joi.string().required(),
       location :joi.string().required(),
       country :joi.string().required(),
       price :joi.number().required().min(0),
       image :joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchema =joi.object({
    review :joi.object({
        comment :joi.string().required(),
       rating :joi.number().required().min(0).max(5),
      
    }).required()
});   