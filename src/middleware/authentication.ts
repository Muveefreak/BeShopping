import express from 'express';
import { AuthFailureError, AccessTokenError, TokenExpiredError } from '../core/ApiError';
import * as jwt from 'jsonwebtoken';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { jwtSecret } from '../config';
import schema from './schema';

const router = express.Router();

export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req, res, next) => {
    let token = getAccessToken(req.headers.authorization);
  try {
    if (!token) {
      throw new AccessTokenError("No token provided!");
    }
    let decodedToken = jwt.decode(token) as jwt.JwtPayload;
     
    jwt.verify(token, jwtSecret, (err: any, decoded : any) => {
      if (err) {
        throw new AccessTokenError("Unauthorized!!");
      }
      
      req.body.role = decodedToken?.role;
      req.body.user_id = decodedToken?.userId;
      req.body.email = decodedToken?.username;
      return next();
    });
  } catch (e) {
    if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
    throw e;
  }
  }),
);

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError('Invalid Authorization');
    if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
    return authorization.split(' ')[1];
  };
