import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './ormconfig';
import router from './routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();
const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error:', err));

app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));