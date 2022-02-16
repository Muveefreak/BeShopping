import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
import routesV1 from './routes/v1';

process.on('uncaughtException', (e) => {
  console.error(e);
});

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
app.use('/v1', routesV1);

export default app;
