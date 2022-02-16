import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, NoEntryError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import {getCustomRepository} from "typeorm";
import { CategoryRepo } from '../../../database/repository/CategoryRepo';
import { Category } from '../../../database/entity/Category';
import { UserRole } from '../../../database/entity/UserRole';
import role from '../../../helpers/role';
import authentication from '../../../middleware/authentication';
import authorization from '../../../middleware/authorization';

const router = express.Router();

router.use('/admin', authentication, role(UserRole.Administrator), authorization);

router.post(
  '/admin/create-category',
  validator(schema.categoryCreate),
  asyncHandler(async (req, res) => {
    const categoryRepo = getCustomRepository(CategoryRepo);
    const category = await categoryRepo.findByName(req.body.name);
    if (category) throw new BadRequestError('Category with this name already exists');

    const createdCategory = await categoryRepo.createCategory({
        name: req.body.name,
        description: req.body.description
    } as Category);
    
    new SuccessResponse('Category created successfully', createdCategory).send(res);
  }),
);

router.get(
  '/get-category/id/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const categoryRepo = getCustomRepository(CategoryRepo);
    const category = await categoryRepo.findById(req.params.id);
    if (!category) throw new BadRequestError('Category does not exist');
    return new SuccessResponse('success', _.pick(category, ['name', 'description'])).send(res);
  }),
);

router.get(
  '/get-categories',
  asyncHandler(async (req, res) => {
    const categoryRepo = getCustomRepository(CategoryRepo);
    const categories = await categoryRepo.getAll();
    if (categories.length < 1) throw new NoEntryError('No record found');
    return new SuccessResponse('success', _.map(categories, item => _.pick(item, 'name', 'description', 'id'))).send(res);
  }),
);

export default router;
