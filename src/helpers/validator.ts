import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, TokenExpiredError, AccessTokenError, AuthFailureError } from '../core/ApiError';
import { jwtSecret } from '../config';
import * as jwt from 'jsonwebtoken';
import { User } from '../database/entity/User';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!regexExp.test(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes('://')) return helpers.error('any.invalid');
    return value;
  }, 'Url Endpoint Validation');

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error } = schema.validate(req[source]);

    if (!error) return next();

    const { details } = error;
    const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
    console.error(message);

    next(new BadRequestError(message));
  } catch (error) {
    next(error);
  }
};

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');

export const signJwt = (user: User) => {
  const token = jwt.sign({userId: user.id, username: user.email, role: user.role},
    jwtSecret, { expiresIn: '1h' });
    let firstTimeLogIn = false;
    try {
      return token;
    } catch(err) {
      console.log(`Error occurred: ${err}`);
      return null;
    }
  };

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};
