import { Router } from 'express';
import multer from 'multer';
import { entitiesMap } from '../config/entities';
import { BaseService } from '../services/base.service';
import { BaseController } from '../controllers/base.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

Object.entries(entitiesMap).forEach(([entityKey, config]) => {
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