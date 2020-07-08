import { NextFunction, Request, Response } from "express";
import jwt, { decode } from 'jsonwebtoken';
import { JWT_SECRET } from "../utils/utils";
import { DataStoredInToken } from "../models/authentication/auth";
import userModel from "../models/user/user.schema";
import logger from "../utils/logger";
import HttpException from "../utils/httpException";

export const AuthMiddleware = async (req:Request, res: Response, next: NextFunction) => {

            
        const cookies = req.header('Authorization');       
        

        if(!cookies){
            logger.error('No token provided');
            return res.status(401).send({error: 'No token provided'});
        }
    
        
        const parts = cookies.split(' ');
        
        if(parts.length !== 2){
            logger.error('Token error');
            return res.status(401).send({error: 'Token error'});
        }

        const [first, second] = parts;

        if(first.includes('Bearer') != true){
            logger.error('Token malformated');
            return res.status(401).send({error: 'Token malformated'});
        }
        console.log(second);
        
        let verificationResponse:DataStoredInToken = undefined;
        jwt.verify(second, JWT_SECRET, function (err: any, decode: any) {
            if(err)
                return next(new HttpException(400, `Token Expired, Log in again to continue`));  
            verificationResponse = decode as DataStoredInToken; 
        });        
        console.log(verificationResponse);
        
        const user = await userModel.findOne({uuid: verificationResponse._uuid});

        if(user){
            return next();
        }else{
            logger.error('Token malformated');
            return res.status(401).send({error: 'Invalid Token'});
        }



}
