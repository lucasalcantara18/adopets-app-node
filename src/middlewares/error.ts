import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/httpException';
import logger from '../utils/logger';

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'something went wrong';
    logger.error(`${status}: ${message}`);
    response.status(status).send({status, message});
}

export default errorMiddleware;