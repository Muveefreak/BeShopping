import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  userCreate: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    email: Joi.string().required().min(1).max(200),
    password: Joi.string().required().min(1).max(20),
    role: Joi.number().required().min(1).max(2)
  }),
  userLogin: Joi.object().keys({
    email: Joi.string().required().min(1).max(200),
    password: Joi.string().required().min(1).max(20)
  })
};
