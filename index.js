const setup = require('./setup');

const PORT = 8080; // This should be moved to an .env file

const app = setup();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
