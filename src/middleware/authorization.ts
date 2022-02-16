import express from 'express';
import { AuthFailureError } from '../core/ApiError';
import asyncHandler from '../helpers/asyncHandler';
import { UserRole } from '../database/entity/UserRole';


const router = express.Router();

export default router.use(
  asyncHandler(async (req: any, res, next) => {
    if (!req.body || !req.body.role)
      throw new AuthFailureError('Permission denied');

    if(UserRole.Administrator != req.body.role && UserRole.Customer != req.body.role) {
        throw new AuthFailureError('Permission denied');
    }
    delete req.body.role;
    delete req.body.email;
    return next();
  }),
);
