const router = require('express').Router();

const { authMiddleware } = require('../middlewares/auth');
const { getAllCharacters, getDetails, deleteCharacterRoute, updateCharacterRoute, createCharacterRoute } = require('../controllers/character');

router.get('/', authMiddleware, getAllCharacters);
router.get('/details/:name', authMiddleware, getDetails);
router.get('/delete/:name', authMiddleware, deleteCharacterRoute);
router.get('/update/:name', authMiddleware, updateCharacterRoute);
router.get('/create', authMiddleware, createCharacterRoute);

module.exports = router;
