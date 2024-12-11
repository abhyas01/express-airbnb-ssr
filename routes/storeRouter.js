const { express } = require('../config.js');
const storeController = require('../controllers/storeController.js');

const storeRouter = express.Router();

storeRouter.get('/', storeController.getFeatured);

storeRouter.get('/homes', storeController.getHomes);

storeRouter.get('/favorites', storeController.getFavorites);

storeRouter.get('/homes/:homeId', storeController.getHomeDetails);

storeRouter.post('/favorites', storeController.postFavorites);

storeRouter.post('/favorites-remove', storeController.postFavoritesRemove)

module.exports = {
  storeRouter
};