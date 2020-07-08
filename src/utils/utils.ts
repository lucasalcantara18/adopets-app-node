import jwt from 'jsonwebtoken';
import {cleanEnv, str, port} from 'envalid';
export const JWT_SECRET: string  = String(process.env.JWT_SECRET);

export const validateEnv = () => {
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
      });
}