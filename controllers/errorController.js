const get404 = (req, res) => {
  res.status(404).render('error/err.ejs', { errorMessage: ['Page Not Found'] });
};

module.exports = {
  get404
};