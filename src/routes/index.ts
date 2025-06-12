import { Router } from 'express';
import multer from 'multer';
import { entitiesMap } from '../config/entities';
import { BaseService } from '../services/base.service';
import { BaseController } from '../controllers/base.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

// Import custom controllers
import { PurchaseController } from '../controllers/purchase.controller';
import { SaleController } from '../controllers/sale.controller';
import { PurchaseReturnController } from '../controllers/purchase-return.controller';
import { SaleReturnController } from '../controllers/sale-return.controller';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Custom routes for complex entities
const purchaseController = new PurchaseController();
const saleController = new SaleController();
const purchaseReturnController = new PurchaseReturnController();
const saleReturnController = new SaleReturnController();

router.use('/purchase', authMiddleware, purchaseController.router);
router.use('/sale', authMiddleware, saleController.router);
router.use('/purchaseReturn', authMiddleware, purchaseReturnController.router);
router.use('/saleReturn', authMiddleware, saleReturnController.router);

// Generic routes for other entities
Object.entries(entitiesMap).forEach(([entityKey, config]) => {
  // Skip entities that have custom controllers
  if (['purchase', 'sale', 'purchaseReturn', 'saleReturn'].includes(entityKey)) {
    return;
  }

  const {
    entity,
    createDto,
    updateDto,
  } = config;

  const service = new BaseService<any>({
    entity,
    entityName: entityKey,
    createDtoClass: createDto,
    updateDtoClass: updateDto,
    journalConfig: config.journalConfig,
  });
  const controller = new BaseController<any>(service);

  const subRouter = Router();

  if (createDto) {
    subRouter.post(
      '/',
      authMiddleware,
      validationMiddleware(createDto),
      controller.create
    );
  } else {
    subRouter.post('/', authMiddleware, controller.create);
  }

  subRouter.get('/', authMiddleware, controller.getAll);
  subRouter.get('/:id', authMiddleware, controller.getOne);

  if (updateDto) {
    subRouter.put(
      '/:id',
      authMiddleware,
      validationMiddleware(updateDto),
      controller.update
    );
  } else {
    subRouter.put('/:id', authMiddleware, controller.update);
  }

  subRouter.patch('/:id/soft-delete', authMiddleware, controller.softDelete);
  subRouter.patch('/:id/restore', authMiddleware, controller.restore);
  subRouter.delete('/:id', authMiddleware, controller.hardDelete);

  subRouter.get('/export/:format', authMiddleware, controller.export);
  subRouter.post(
    '/import',
    authMiddleware,
    upload.single('file'),
    controller.import
  );

  router.use(`/${entityKey}`, subRouter);
});

export default router;