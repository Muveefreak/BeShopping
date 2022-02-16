import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { OrderRepo } from '../../../database/repository/OrderRepo';
import { BadRequestError, NoEntryError, NotFoundError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import { Order } from '../../../database/entity/Order';
import {getCustomRepository} from "typeorm";
import { UserRepo } from '../../../database/repository/UserRepo';
import authentication from '../../../middleware/authentication';
import authorization from '../../../middleware/authorization';
import role from '../../../helpers/role';
import { UserRole } from '../../../database/entity/UserRole';

const router = express.Router();

router.use('/user', authentication, role(UserRole.Customer), authorization);

router.post(
  '/user/create-order',
  validator(schema.orderCreate),
  asyncHandler(async (req, res) => {
    const userRepo = getCustomRepository(UserRepo);
    const user = await userRepo.findById(req.body.user_id);
    if (!user) throw new NotFoundError('User not found');

    const orderRepo = getCustomRepository(OrderRepo);
    console.log(`item ${req.body.orderItems}`);
    
    const createdOrder = await orderRepo.createOrder({
      user_id : user.id,
      user : user,
      orderItems: req.body.orderItems
    } as Order);
    
    new SuccessResponse('Order created successfully', createdOrder).send(res);
  }),
);

router.get(
  '/user/get-order/orderId/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const orderRepo = getCustomRepository(OrderRepo);
    const order = await orderRepo.findById(req.params.id);
    if (!order) throw new BadRequestError('Order does not exist');

    if(order.user_id != req.body.user_id) throw new BadRequestError('Order does not exist');

    return new SuccessResponse('success', _.pick(order.orderItems, ['name', 'quantity'])).send(res);
  }),
);

export default router;
