import { Router } from 'express';
import GET_MOVIES from '../controllers/movies/route';
import ADD_MOVIE from '../controllers/movies/add-movie/route'
import auth from '../middlewares/auth/auth.middleware';
const movieRouter = Router();
movieRouter.get('/', GET_MOVIES);
movieRouter.post('/add-movie', auth.validateAdmin, ADD_MOVIE);
export default movieRouter;