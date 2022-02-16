import express from 'express';
import category from './category/category';
import auth from './auth/auth';
import product from './catalog/product';
import order from './cart/order';

const router = express.Router();

router.use('/category', category);
router.use('/auth', auth);
router.use('/product', product);
router.use('/order', order);

export default router;
