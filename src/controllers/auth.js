const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { register, getUser } = require('../services/auth');

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // TODO: Hash password
    await register(email, password);
    res.json(
      {
        message: 'Signup successful',
        user: req.user
      }
    );
  } catch (e) {
    res.json(
      {
        message: 'Signup failed'
      }
    );
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUser(email);
    const validated = await bcrypt.compare(password, user.password);
    const body = { id: user.id, email: user.email };
    const token = jwt.sign(body, process.env.JWT_KEY || 'SECRET_KEY');

    if (validated) {
      res.json({
        message: 'Logged in successfully',
        user: { email: user.email },
        token
      });
    } else if (!validated) {
      res.status(401);
      res.json({
        message: 'Invalid password'
      });
    }
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({
      message: 'Invalid email'
    });
  }
};

module.exports = { signup, login };
