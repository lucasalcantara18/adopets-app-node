const cookieParser = require("cookie-parser");
import express, { response, Application } from 'express';
import path from 'path';
// import routes from './routes';
const mongoose = require("mongoose");
import cors from 'cors';
import { errors } from 'celebrate';
import UserController from './controllers/UserController';
import errorMiddleware from './middlewares/error';
import logger from './utils/logger';
import error404Middleware from './middlewares/error404';
import ProductController from './controllers/ProductController';


export default class App{

    public app: Application;

    public controllers = [
        new UserController,
        new ProductController
    ]

    constructor() {        
        this.app = express();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
        this.errorHandlingMiddleware();
    }

    private initializeMiddlewares(){
        this.app.use(express.json());
        this.app.use(cookieParser());
        const corsOptions = {
            exposedHeaders: ['Authorization', 'Cookie', 'Set-Cookie'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
            credentials: true,

          };
        this.app.use(cors(corsOptions));
    }

    private errorHandlingMiddleware(){
        this.app.use(errorMiddleware);
        this.app.use(error404Middleware)

    }

    private initializeControllers(){
        this.controllers.forEach((controller) => {
            this.app.use('/', controller.router);
          });
    }

    private connectToDatabase(){
        const {MONGO_USER, MONGO_PASSWORD, MONGO_PATH} = process.env;
          mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {useNewUrlParser: true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', function (){
            logger.error('Failed to connect to database');
        });
        db.once('open', function() {
            logger.info("successful connection on database");
        });
    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            logger.info(`App listening on port ${process.env.PORT}`);
        });
    }



}



