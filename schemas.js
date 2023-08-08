const RootJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({ // prevent cross site scripting (XSS), put extension where there is text user input
    type: 'string', // create an extension on joi.string()
    base: joi.string(),
    messages: {
        'string.htmlSafe': '{{#label}} must not include HTML!'
    },
    rules: {
        htmlSafe: {
            validate(value,msg) {
                const clean = sanitizeHtml(value, { // sanitizeHtml is a package that stripes html tags 
                    allowedTags: [],
                    allowedAttributes: {}
                    // no tags and attributes is allowed
                });
                if (clean !== value) return msg.error('string.htmlSafe', { value }) // if there is a difference between 'value' and 'clean' (ie. something is removed), then show the message
                else return clean;
            }
        }
    }
})

const Joi = RootJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().htmlSafe(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().htmlSafe(),
        description: Joi.string().required().htmlSafe()
    }).required(), // means an object 'campground' is required
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().htmlSafe()
    }).required()
});