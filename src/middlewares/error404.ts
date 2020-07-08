import { NextFunction, Request, Response } from 'express';
import HttpException from '../utils/httpException';
import logger from '../utils/logger';

const error404Middleware = (request: Request, response: Response, next: NextFunction) => {
    const status = 404;
    const message = 'Unable to find the requested resource!';
    logger.error(`${status}: ${message}`);
    response.status(status).send({status, message});
}

export default error404Middleware;