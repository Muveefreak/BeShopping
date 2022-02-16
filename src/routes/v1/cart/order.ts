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
    console.log(user);
    
    if (!user) throw new NotFoundError('User not found');

    const orderRepo = getCustomRepository(OrderRepo);
    console.log(`item ${req.body.orderItems}`);
    
    const createdOrder = await orderRepo.createOrder({
      user_id : user.id,
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
    console.log(`===> ${JSON.stringify(order)}`);
    return new SuccessResponse('success', _.pick(order.orderItems, ['name', 'quantity'])).send(res);
  }),
);

router.get(
    '/user/get-orders/userId/:id',
    validator(schema.userId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
      const orderRepo = getCustomRepository(OrderRepo);
      console.log(`Here ${req.params.id}`);
      
      const orders = await orderRepo.findByUserId(req.params.id);
      console.log(`Here ${JSON.stringify(orders)}`);
      if (orders.length < 1) throw new BadRequestError('Order does not exist');
      return new SuccessResponse('success',_.map(orders, item => _.pick(item, 'status', 'id', 'user_id', 'created_at'))).send(res);
    }),
  );

router.post(
    '/user/remove-order/orderId/:id',
    validator(schema.orderId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const userRepo = getCustomRepository(UserRepo);
        const user = await userRepo.findById(req.body.user_id);
        if (!user) throw new NotFoundError('User not found');

        const orderRepo = getCustomRepository(OrderRepo);
        const order = await orderRepo.findById(req.params.id);
        if (!order) throw new BadRequestError('Order does not exist');
        console.log(order.user_id);
        console.log(user.id);
        
        
        if (order.user_id != user.id) throw new BadRequestError('User Order does not exist');

        const removedOrder = await orderRepo.removeOrder(order.id);

        new SuccessResponse('Order removed successfully', removedOrder).send(res);
    }),
);

export default router;
