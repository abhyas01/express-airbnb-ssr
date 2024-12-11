const { Home } = require('../models/Home.js');
const { Favorite } = require('../models/Favorite.js')
const { z } = require('../config.js');

const getAddHome = (req, res) => {
  res.status(200).render('host/edit-home', { pageTitle: 'Add Home', edit: false });
};

const getHostHomes = async (req, res) => {
  try{
    const data = await Home.fetchAll();
    res.status(200).render('host/host-homes', { homes: data, pageTitle: "Host Homes" });
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not fetch homes.'] });
  }
};

const postHomeAdded = async (req, res) => {
  const initialCheckSchema = z.object({
    houseName: z.string().min(2).max(36),
    price: z.string().min(1).max(6),
    location: z.string().min(4).max(100),
    rating: z.string().min(1).max(1),
    photoUrl: z.string().min(5).max(2048)
  }).strict();
  const initialCheck = initialCheckSchema.safeParse(req.body);
  if (!initialCheck.success) {
    const initialErrorMessages = initialCheck.error.errors.map(error => error.message);
    return res.status(403).render('error/err.ejs', { errorMessage: initialErrorMessages });
  }
  const priceNumber = req?.body?.price;
  const ratingNumber = req?.body?.rating;
  if (priceNumber === undefined || isNaN(priceNumber)) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Price must be a valid number'] });
  }
  if (ratingNumber === undefined || isNaN(ratingNumber)) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Rating must be a valid number'] });
  }
  const formData = {
    ...req.body,
    price: Number(priceNumber),
    rating: Number(ratingNumber)
  };
  const requiredBody = z.object({
    houseName: z.string().min(2).max(36),
    price: z.number().min(0).max(150000),
    location: z.string().min(4).max(100),
    rating: z.number().min(0).max(5),
    photoUrl: z.string().min(5).max(2048)
  }).strict();
  const parsedWithSuccess = requiredBody.safeParse(formData);
  if (!parsedWithSuccess.success) {
    const errorMessages = parsedWithSuccess.error.errors.map(error => error.message);
    return res.status(403).render('error/err.ejs', { errorMessage: errorMessages });
  }
  const { houseName, price, location, rating, photoUrl } = formData;
  const newHome = new Home(houseName, price, location, rating, photoUrl);
  try {
    await newHome.save();
  } catch(err) {
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not add your home.'] });
  }
  res.status(200).render('host/home-added', { pageTitle: 'Added Successfully!' });
};

const getHomeEdit = async (req, res) => {
  const homeId = req?.params?.homeId;
  let edit = req?.query?.edit;
  edit = edit === 'true' ? true : false;
  if (homeId === undefined || isNaN(homeId)) return res.status(403).render('error/err.ejs', { errorMessage: ['This home does not exist.'] });
  try{
    const homeDetails = await Home.fetchOne(homeId);
    if (!homeDetails) return res.status(403).render('error/err.ejs', { errorMessage: ['This home does not exist.'] });
    res.status(200).render('host/edit-home', { home: homeDetails, pageTitle: homeDetails.houseName, edit: Boolean(edit) });
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error.'] });
  }
};

const postHomeEdit = async (req, res) => {
  const initialCheckSchema = z.object({
    id: z.string().min(1).max(10),
    houseName: z.string().min(2).max(36),
    price: z.string().min(1).max(6),
    location: z.string().min(4).max(100),
    rating: z.string().min(1).max(1),
    photoUrl: z.string().min(5).max(2048)
  }).strict();
  const initialCheck = initialCheckSchema.safeParse(req.body);
  if (!initialCheck.success) {
    const initialErrorMessages = initialCheck.error.errors.map(error => error.message);
    return res.status(403).render('error/err.ejs', { errorMessage: initialErrorMessages });
  }
  const idNumber = req?.body?.id;
  const priceNumber = req?.body?.price;
  const ratingNumber = req?.body?.rating;
  if (idNumber === undefined || isNaN(idNumber)) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request! This page does not exist'] });
  }
  if (priceNumber === undefined || isNaN(priceNumber)) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Price must be a valid number'] });
  }
  if (ratingNumber === undefined || isNaN(ratingNumber)) {
    return res.status(403).render('error/err.ejs', { errorMessage: ['Rating must be a valid number'] });
  }
  const formData = {
    ...req.body,
    id: Number(idNumber),
    price: Number(priceNumber),
    rating: Number(ratingNumber)
  };
  const requiredBody = z.object({
    id: z.number().min(0).max(9999999999),
    houseName: z.string().min(2).max(36),
    price: z.number().min(0).max(150000),
    location: z.string().min(4).max(100),
    rating: z.number().min(0).max(5),
    photoUrl: z.string().min(5).max(2048)
  }).strict();
  const parsedWithSuccess = requiredBody.safeParse(formData);
  if (!parsedWithSuccess.success) {
    const errorMessages = parsedWithSuccess.error.errors.map(error => error.message);
    return res.status(403).render('error/err.ejs', { errorMessage: errorMessages });
  }
  const { id, houseName, price, location, rating, photoUrl } = formData;
  try {
    const response = await Home.editHome(id, houseName, price, location, rating, photoUrl);
    if (!response) return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
    res.status(200).redirect(`/homes/${id}`);
  } catch(err) {
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not add your home.'] });
  }
};

const postDeleteHome = async (req, res) => {
  const initialCheckSchema = z.object({
    id: z.string().min(1).max(10)
  }).strict();
  const initialCheck = initialCheckSchema.safeParse(req.body);
  if (!initialCheck.success) return res.status(403).render('error/err.ejs', { errorMessage: ['Invalid request body format.'] });
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
    const response = Home.deleteHome(id);
    if (!response) return res.status(403).render('error/err.ejs', { errorMessage: ['Illegal request'] });
    await Favorite.removeFromFavorite(id);
    res.status(200).redirect('/homes');
  } catch(err){
    return res.status(500).render('error/err.ejs', { errorMessage: ['Server error, could not add your home.'] });
  }
};

module.exports = {
  getAddHome,
  getHostHomes,
  postHomeAdded,
  getHomeEdit,
  postHomeEdit,
  postDeleteHome
};