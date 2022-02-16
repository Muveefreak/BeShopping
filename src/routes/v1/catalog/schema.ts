import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  productCreate: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    quantity: Joi.number().required().min(1).max(500),
    categoryId: Joi.string().required(),
    user_id: Joi.string().required()
  }),
  productUpdate: Joi.object().keys({
    quantity: Joi.number().required().min(1).max(500),
    id: Joi.string().required(),
    user_id: Joi.string().required()
  }),
};
