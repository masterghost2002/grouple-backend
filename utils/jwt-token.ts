import jwt, { Secret } from 'jsonwebtoken';
import { UserWithoutPassword } from '../types';
const jwtSecret:Secret = process.env.JWT_SECRET as string;
const jwtToken = async (data:UserWithoutPassword)=>{
    let token:string;
    try {
        token = await jwt.sign(data, jwtSecret, { expiresIn: '60d' });
    } catch (error) {
        throw error;
    }
    return token;
};
export default jwtToken;