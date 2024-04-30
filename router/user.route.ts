import {Router} from 'express';
import UPDATE_PROFILE_PICTURE from '../controllers/user/update-profile-picture/route';
import auth from '../middlewares/auth/auth.middleware';
import upload from '../utils/multer-upload-s3';
const userRouter = Router();
userRouter.use(auth.validateUser);
userRouter.post('/update-profile-picture', upload.single('file'), UPDATE_PROFILE_PICTURE);
export default  userRouter;