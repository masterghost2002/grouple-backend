import { Router } from 'express';
import GET_MOVIES from '../controllers/movies/route';
import ADD_MOVIE from '../controllers/movies/add-movie/route';
import DELETE_MOVIE from '../controllers/movies/delete-movie/route';
import GET_MOVIE_BY_ID from '../controllers/movies/[id]/route'
import auth from '../middlewares/auth/auth.middleware';
const movieRouter = Router();
movieRouter.get('/', GET_MOVIES);
movieRouter.get('/:id', GET_MOVIE_BY_ID);
movieRouter.post('/add-movie', auth.validateAdmin, ADD_MOVIE);
movieRouter.delete('/delete-movie', auth.validateAdmin,DELETE_MOVIE);
export default movieRouter;