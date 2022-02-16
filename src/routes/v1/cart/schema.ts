import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  orderId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  orderCreate: Joi.object().keys({
    user_id: Joi.string().required(),
    orderItems: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().required().min(1)
    })),
  }),
};
