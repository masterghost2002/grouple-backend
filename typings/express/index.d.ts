import 'express';
import { UserWithoutPassword } from '../../types';
declare global {
  namespace Express {
    export interface Request {
      user?:UserWithoutPassword;
      access_token?:string;
    }
  }
}