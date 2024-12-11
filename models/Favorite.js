const { fs, path, rootDir } = require('../config.js');
const { Home } = require('./Home.js');

class Favorite {
  static filePath = path.join(rootDir, 'data', 'favorite.json');

  static async fetchAll(){
    try {
      const data = await fs.promises.readFile(Favorite.filePath, 'utf-8');
      return JSON.parse(data);
    } catch(err) {
      await Favorite.initializeDatabase();
      return {};
    }
  }

  static async fetchAllHomes(){
    try {
      const favoriteIds = await Favorite.fetchAll();
      const homeData = await Home.fetchAll();
      const favoriteHomes = {};
      for(const key in favoriteIds){
        favoriteHomes[key] = homeData[key];
      }
      return favoriteHomes;
    } catch(err) {
      throw err;
    }
  }

  static async initializeDatabase(){
    try {
      await fs.promises.writeFile(Favorite.filePath, JSON.stringify({}, null, 4), 'utf-8');
    } catch(err) {
      throw err;
    }
  }

  static async addToFavorite(homeId){
    try {
      homeId = Number(homeId);
      const data = await Favorite.fetchAll();
      if(!data.hasOwnProperty(homeId)){
        const newData = {...data, [homeId]: null};
        await fs.promises.writeFile(Favorite.filePath, JSON.stringify(newData, null, 4), 'utf-8');
      }
    } catch(err) {
      throw err;
    }
  }

  static async removeFromFavorite(homeId){
    try {
      homeId = Number(homeId);
      const data = await Favorite.fetchAll();
      if(data.hasOwnProperty(homeId)){
        delete data[homeId];
        await fs.promises.writeFile(Favorite.filePath, JSON.stringify(data, null, 4), 'utf-8');
      }
    } catch(err) {
      throw err;
    }
  }
};

module.exports = {
  Favorite
};