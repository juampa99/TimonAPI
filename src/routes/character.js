const router = require('express').Router();

const { authMiddleware } = require('../middlewares/auth');
const { getAllCharacters } = require('../controllers/character');

router.get('/', authMiddleware, getAllCharacters);

module.exports = router;
