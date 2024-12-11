const { express } = require('../config.js');
const hostController = require('../controllers/hostController.js');

const hostRouter = express.Router();

hostRouter.get('/add-home', hostController.getAddHome);

hostRouter.get('/host-homes', hostController.getHostHomes);

hostRouter.get('/edit-home/:homeId', hostController.getHomeEdit);

hostRouter.post('/add-home', hostController.postHomeAdded);

hostRouter.post('/edit-home', hostController.postHomeEdit);

hostRouter.post('/delete-home', hostController.postDeleteHome);

module.exports = {
  hostRouter,
};