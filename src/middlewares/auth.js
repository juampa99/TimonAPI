const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const { token } = req.query;

  try {
    const user = jwt.verify(token, process.env.JWT_KEY || 'SECRET_KEY');

    if (user) {
      req.user = user;
      req.token = token;
      next();
    }
  } catch (e) {
    // Unauthorized
    res.status(401);
    res.json({
      message: 'Unauthorized'
    });
  }
};

module.exports = { authMiddleware };
