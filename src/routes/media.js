const router = require('express').Router();

const { authMiddleware } = require('../middlewares/auth');
const { getAllMovies, getMovieDetails, deleteMovie, updateMovie, createMovie } = require('../controllers/media');

router.get('/', authMiddleware, getAllMovies);
router.get('/details/:title', authMiddleware, getMovieDetails);
router.get('/delete/:title', authMiddleware, deleteMovie);
router.get('/update/:title', authMiddleware, updateMovie);
router.get('/create', authMiddleware, createMovie);

module.exports = router;
