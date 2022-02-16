import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { ProductRepo } from '../../../database/repository/ProductRepo';
import { BadRequestError, NoEntryError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import { Product } from '../../../database/entity/Product';
import {getCustomRepository} from "typeorm";
import { CategoryRepo } from '../../../database/repository/CategoryRepo';
import { UserRole } from '../../../database/entity/UserRole';
import role from '../../../helpers/role';
import authentication from '../../../middleware/authentication';
import authorization from '../../../middleware/authorization';


const router = express.Router();

router.use('/admin', authentication, role(UserRole.Administrator), authorization);

router.post(
  '/admin/create-product',
  validator(schema.productCreate),
  asyncHandler(async (req, res) => {
    const prodRepo = getCustomRepository(ProductRepo);
    const product = await prodRepo.findByName(req.body.name);
    if (product) throw new BadRequestError('Product with this name already exists');

    const categoryRepo = getCustomRepository(CategoryRepo);
    const category = await categoryRepo.findById(req.body.categoryId);
    if (!category) throw new BadRequestError('Category does not exist');
    console.log(`category ${JSON.stringify(category)}`);
    const createdProduct = await prodRepo.createProduct({
        name: req.body.name,
        quantity: req.body.quantity,
        category_id : category.id,
        category : category
    } as Product);
    
    new SuccessResponse('Product created successfully', createdProduct).send(res);
  }),
);

router.post(
  '/admin/update-product-quantity',
  validator(schema.productUpdate),
  asyncHandler(async (req, res) => {
    const prodRepo = getCustomRepository(ProductRepo);
    const product = await prodRepo.findById(req.body.id);
    if (!product) throw new BadRequestError('Product does not exit, kindly create product');
    
    const updatedProduct = await prodRepo.updateProductQuantity(product, req.body.quantity);
    
    new SuccessResponse('Product updated successfully', updatedProduct).send(res);
  }),
);

router.get(
  '/get-product/name/:name',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const prodRepo = getCustomRepository(ProductRepo);
    const product = await prodRepo.findByName(req.params.name);
    if (!product) throw new BadRequestError('Product does not exist');
    return new SuccessResponse('success', _.pick(product, ['name', 'quantity'])).send(res);
  }),
);

router.get(
  '/get-products/categoryId/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const prodRepo = getCustomRepository(ProductRepo);
    console.log(`Here ${req.params.id}`);
    
    const products = await prodRepo.findByCategoryId(req.params.id);
    console.log(`Here ${JSON.stringify(products)}`);
    if (products.length < 1) throw new BadRequestError('Product does not exist');
    return new SuccessResponse('success',_.map(products, item => _.pick(item, 'name', 'quantity'))).send(res);
  }),
);

router.get(
  '/get-products',
  asyncHandler(async (req, res) => {
    const prodRepo = getCustomRepository(ProductRepo);
    const products = await prodRepo.getAll();
    if (products.length < 1) throw new NoEntryError('No record found');
    return new SuccessResponse('success', _.map(products, item => _.pick(item, 'name', 'quantity'))).send(res);
  }),
);

export default router;
