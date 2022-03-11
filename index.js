require('dotenv').config();

const PORT = process.env.PORT || 8080;

const setup = require('./setup');

const app = setup();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
