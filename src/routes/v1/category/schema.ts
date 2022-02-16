import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  categoryCreate: Joi.object().keys({
    name: Joi.string().required().min(1).max(200),
    description: Joi.string().required().min(1).max(500)
  }),
};
