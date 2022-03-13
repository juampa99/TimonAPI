const router = require('express').Router();

const { signup, login } = require('../controllers/auth');
const { authMiddleware } = require('../middlewares/auth');

router.post('/register', signup);
router.post('/login', login);

router.get('/protected', authMiddleware, async (req, res) => {
  res.json(
    {
      message: 'You made it to the secure route',
      user: req.user,
      token: req.token
    }
  );
});

module.exports = router;
