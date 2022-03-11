const jwt = require('jsonwebtoken');

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
        message: 'Signup failed',
        error: e
      }
    );
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUser(email);
    const validated = user.password === password;
    const body = { id: user.id, email: user.email };
    const token = jwt.sign(body, process.env.JWT_KEY || 'SECRET_KEY');

    console.log(user.password, password);

    if (validated) {
      res.json({
        message: 'Logged in successfully',
        user: { email: user.email },
        token
      });
    } else if (!validated) {
      res.json({
        message: 'Invalid password'
      });
    }
  } catch (e) {
    res.json({
      message: 'Invalid user'
    });
  }
};


module.exports = { signup, login };
