import { Router } from 'express';
import GET_MOVIES from '../controllers/movies/route';
const movieRouter = Router();
movieRouter.get('/', GET_MOVIES);
export default movieRouter;