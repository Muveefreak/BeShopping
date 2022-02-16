import { User } from "../../../database/entity/User";
import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, NoEntryError, NotFoundError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import {getCustomRepository} from "typeorm";
import { UserRepo } from "../../../database/repository/UserRepo";

const router = express.Router();

router.post(
  '/login',
  validator(schema.userLogin),
  asyncHandler(async (req, res) => {
    const userRepo = getCustomRepository(UserRepo);
    const user = await userRepo.findByEmail(req.body.email);
    if (!user) throw new NotFoundError('User not found');

    if(!user.validateUnencryptedPassword(req.body.password)) {
    throw new BadRequestError('Incorrect email or password'); }
    
    new SuccessResponse('Login successfully', user).send(res);
  }),
);

router.post(
    '/create-user',
    validator(schema.userCreate),
    asyncHandler(async (req, res) => {
      const userRepo = getCustomRepository(UserRepo);
      const user = await userRepo.findByEmail(req.body.email);
      if (user) throw new NotFoundError('User already exists');
    const userCreated = new User();
    userCreated.email = req.body.email;
    userCreated.name = req.body.name;
    userCreated.role = req.body.role;
    userCreated.passwordHash = req.body.password;
    userCreated.hashPassword();
      const createdUser = await userRepo.createUser(userCreated as User);
      
      new SuccessResponse('Order created successfully', createdUser).send(res);
    }),
  );

export default router;