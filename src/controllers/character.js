const { getAll } = require('../services/character');

const getAllCharacters = async (req, res) => {
  try {
    const rawCharacters = await getAll();
    const parsedCharList = rawCharacters.map((c) => ({ image: c.image_url, name: c.name }));
    res.json(parsedCharList);
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error retrieving characters' });
  }
};

module.exports = { getAllCharacters };
