// src/routes/index.ts
import { Router } from 'express';
import multer from 'multer';
import { entitiesMap } from '../config/entities';
import { BaseService } from '../services/base.service';
import { BaseController } from '../controllers/base.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

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
  if (['purchase', 'sale', 'purchaseReturn', 'saleReturn'].includes(entityKey)) {
    return;
  }

  const { entity, createDto, updateDto, searchableFields } = config;
  const service = new BaseService<any>({
    entity,
    entityName: entityKey,
    createDtoClass: createDto,
    updateDtoClass: updateDto,
    searchableFields,
  });
  const controller = new BaseController<any>(service);
  const subRouter = Router();

  // CREATE
  if (createDto) {
    subRouter.post(
      '/',
      authMiddleware,
      requirePermission(entityKey, 'create'),
      validationMiddleware(createDto),
      controller.create
    );
  } else {
    subRouter.post(
      '/',
      authMiddleware,
      requirePermission(entityKey, 'create'),
      controller.create
    );
  }

  // GET ALL
  subRouter.get(
    '/',
    authMiddleware,
    requirePermission(entityKey, 'read'),
    controller.getAll
  );

  // VIEW TRASH
  subRouter.get(
    '/trash',
    authMiddleware,
    requirePermission(entityKey, 'viewTrash'),
    controller.getTrash
  );

  // GET ONE
  subRouter.get(
    '/:id',
    authMiddleware,
    requirePermission(entityKey, 'read'),
    controller.getOne
  );

  // UPDATE
  if (updateDto) {
    subRouter.put(
      '/:id',
      authMiddleware,
      requirePermission(entityKey, 'update'),
      validationMiddleware(updateDto),
      controller.update
    );
  } else {
    subRouter.put(
      '/:id',
      authMiddleware,
      requirePermission(entityKey, 'update'),
      controller.update
    );
  }

  // SOFT DELETE
  subRouter.patch(
    '/:id/soft-delete',
    authMiddleware,
    requirePermission(entityKey, 'delete'),
    controller.softDelete
  );

  // RESTORE
  subRouter.patch(
    '/:id/restore',
    authMiddleware,
    requirePermission(entityKey, 'restore'),
    controller.restore
  );

  // HARD DELETE
  subRouter.delete(
    '/:id',
    authMiddleware,
    requirePermission(entityKey, 'hardDelete'),
    controller.hardDelete
  );

  // BULK SOFT DELETE
  subRouter.patch(
    '/bulk-soft-delete',
    authMiddleware,
    requirePermission(entityKey, 'delete'),
    controller.softDeleteMany
  );

  // BULK RESTORE
  subRouter.patch(
    '/bulk-restore',
    authMiddleware,
    requirePermission(entityKey, 'restore'),
    controller.restoreMany
  );

  // BULK HARD DELETE
  subRouter.delete(
    '/bulk',
    authMiddleware,
    requirePermission(entityKey, 'hardDelete'),
    controller.hardDeleteMany
  );

  // EXPORT
  subRouter.get(
    '/export/:format',
    authMiddleware,
    requirePermission(entityKey, 'export'),
    controller.export
  );

  // IMPORT
  subRouter.post(
    '/import',
    authMiddleware,
    requirePermission(entityKey, 'import'),
    upload.single('file'),
    controller.import
  );

  router.use(`/${entityKey}`, subRouter);
});

export default router;
