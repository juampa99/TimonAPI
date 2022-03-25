const { getAll, getDetails, deleteMedia, updateMedia, getByTitle, createMedia } = require('../services/media');

const getAllMovies = async (req, res) => {
  try {
    const movies = await getAll(req.query.title, req.query.genre, req.query.order);
    const parsedMovies = movies.map((m) => {
      return { image_url: m.image_url, title: m.title, release_date: m.release_date };
    });
    res.json(parsedMovies);
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error retrieving movies' });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const details = await getDetails(req.params.title);
    res.json(details);
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error retrieving movie' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    await deleteMedia(req.params.title);
    res.json({ message: `Successfully deleted ${req.params.title}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error deleting movie' });
  }
};

const updateMovie = async (req, res) => {
  try {
    const media = await getByTitle(req.params.title);
    // This could be risky
    await updateMedia(media, req.query);
    res.json({ message: `Successfully updated ${req.params.title}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error updating movie' });
  }
};

const createMovie = async (req, res) => {
  try {
    await createMedia(req.query);
    res.json({ message: `Successfully created ${req.params.title}` });
  } catch (e) {
    res.status(500);
    res.json({ message: 'Error updating movie' });
  }
};

module.exports = { getAllMovies, getMovieDetails, deleteMovie, updateMovie, createMovie };
