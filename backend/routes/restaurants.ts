import { Router } from 'express';
import * as controller from '../controllers/restaurantController';

const router = Router();

router.get('/search', controller.search);
router.get('/filter', controller.filter);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;