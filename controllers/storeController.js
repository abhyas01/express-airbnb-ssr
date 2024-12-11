const { Home } = require('../models/Home.js');
const { Favorite } = require('../models/Favorite.js')
const { z } = require('../config.js');

const getFeatured = async(req, res) => {
  try{
    const data = await Home.fetchAll();
    res.status(200).render('store/index', { homes: data, pageTitle: "Airbnb" });
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not fetch homes.'] });
  }
};

const getHomes = async(req, res) => {
  try{
    const data = await Home.fetchAll();
    res.status(200).render('store/homes', { homes: data, pageTitle: "Homes" });
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not fetch homes.'] });
  }
};

const getHomeDetails = async (req, res) => {
  const homeId = req?.params?.homeId;
  if (homeId === undefined || isNaN(homeId)) return res.status(403).render('error/err.ejs', { errorMessage: ['This home does not exist.'] });
  try{
    const homeDetails = await Home.fetchOne(homeId);
    if (!homeDetails) return res.status(403).render('error/err.ejs', { errorMessage: ['This home does not exist.'] });
    res.status(200).render('store/home-detail', { home: homeDetails, pageTitle: homeDetails.houseName });
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error.'] });
  }
};

const getFavorites = async (req, res) => {
  try{
    const data = await Favorite.fetchAllHomes();
    res.status(200).render('store/favorites', { homes: data, pageTitle: "Favorites" });
  } catch(err){
    console.log(err);
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not fetch homes.'] });
  }
};

const postFavorites = async (req, res) => {
  const initialCheckSchema = z.object({
    id: z.string().min(1).max(10)
  }).strict();
  const initialCheck = initialCheckSchema.safeParse(req.body);
  if (!initialCheck.success) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Invalid request body format.'] });
  }
  const id = req?.body?.id;
  if(id === undefined || isNaN(id)){
    return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
  }
  const data = { id: Number(id) };
  const requiredBody = z.object({
    id: z.number().min(0).max(9999999999)
  }).strict();
  const parsedWithSuccess = requiredBody.safeParse(data);
  if (!parsedWithSuccess.success) return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
  try{
    const response = await Home.addToFavorite(id);
    if (!response) return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
    await Favorite.addToFavorite(id);
    res.status(200).redirect('/favorites');
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error!'] });
  }
};

const postFavoritesRemove = async (req, res) => {
  const initialCheckSchema = z.object({
    id: z.string().min(1).max(10)
  }).strict();
  const initialCheck = initialCheckSchema.safeParse(req.body);
  if (!initialCheck.success) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Invalid request body format.'] });
  }
  const id = req?.body?.id;
  if(id === undefined || isNaN(id)){
    return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
  }
  const data = { id: Number(id) };
  const requiredBody = z.object({
    id: z.number().min(0).max(9999999999)
  }).strict();
  const parsedWithSuccess = requiredBody.safeParse(data);
  if (!parsedWithSuccess.success) return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
  try{
    const response = await Home.removeFromFavorite(id);
    if (!response) return res.status(403). render('error/err.ejs', { errorMessage: ['Illegal request'] });
    await Favorite.removeFromFavorite(id);
    res.status(200).redirect('/homes');
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error!'] });
  }
};

module.exports = {
  getFeatured,
  getHomes,
  getHomeDetails,
  getFavorites,
  postFavorites,
  postFavoritesRemove
};