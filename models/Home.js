const { fs, path, rootDir } = require('../config.js');

class Home {
  static filePath = path.join(rootDir, 'data', 'homes.json');
  static countPath = path.join(rootDir, 'data', 'idCount.json');
  
  #isPushed = false;

  constructor(houseName, price, location, rating, photoUrl){
    this.id = null;
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.isFavorite = false;
  };

  async save(){
    if(!this.#isPushed){
      try {
        const data = await Home.fetchAll();
        const currentId = await Home.fetchIdCount();
        this.id = Number(currentId);
        const addedData = {...data, [this.id]: this }
        await Home.writeData(addedData, (this.id + 1));
        this.#isPushed = true;
      } catch(err) {
        this.#isPushed = false;
        throw err;
      }
    }
  };

  static async editHome(id, houseName, price, location, rating, photoUrl){
    try{
      id = Number(id);
      let homes = await Home.fetchAll();
      let data = await Home.fetchOne(id);
      if (!data) return false;
      data = {...data, id, houseName, price, location, rating, photoUrl };
      homes = {...homes, [id]: data };
      await fs.promises.writeFile(Home.filePath, JSON.stringify(homes, null, 4), 'utf-8');
      return true;
    } catch(err) {
      throw err;
    }
  };

  static async deleteHome(id){
    try {
      id = Number(id);
      const homes = await Home.fetchAll();
      if (homes.hasOwnProperty(id)){
        delete homes[id];
        await fs.promises.writeFile(Home.filePath, JSON.stringify(homes, null, 4), 'utf-8');
        return true;
      } else {
        return false;
      }
    } catch(err) {
      throw err;
    }
  };

  static async fetchAll(){
    try {
      const data = await fs.promises.readFile(Home.filePath, 'utf-8');
      return JSON.parse(data);
    } catch(err) {
      await Home.initializeDatabase();
      return {};
    }
  };

  static async fetchOne(id){
    try{
      id = Number(id);
      const data = await Home.fetchAll();
      if(data.hasOwnProperty(id)){
        return data[id];
      } else {
        return null;
      }
    } catch(err) {
      throw err;
    }
  };

  static async fetchIdCount(){
    try {
      const data = await fs.promises.readFile(Home.countPath, 'utf-8');
      return JSON.parse(data).id;
    } catch(err) {
      throw err;
    }
  };

  static async writeData(data, id){
    try{
      await fs.promises.writeFile(Home.filePath, JSON.stringify(data, null, 4), 'utf-8');
      await fs.promises.writeFile(Home.countPath, JSON.stringify({ id: id }, null, 4), 'utf-8');
    } catch(err){
      throw err;
    }
  };

  static async addToFavorite(id){
    try{
      id = Number(id);
      const homes = await Home.fetchAll();
      const data = await Home.fetchOne(id);
      if(!data) return false;
      data.isFavorite = true;
      const newData = {...homes, [id]: data};
      await fs.promises.writeFile(Home.filePath, JSON.stringify(newData, null, 4), 'utf-8');
      return true;
    } catch(err){
      throw err;
    }
  };

  static async removeFromFavorite(id){
    try{
      id = Number(id);
      const homes = await Home.fetchAll();
      const data = await Home.fetchOne(id);
      if(!data) return false;
      data.isFavorite = false;
      const newData = {...homes, [id]: data};
      await fs.promises.writeFile(Home.filePath, JSON.stringify(newData, null, 4), 'utf-8');
      return true;
    } catch(err){
      throw err;
    }
  };

  static async initializeDatabase(){
    try{
      await fs.promises.writeFile(Home.countPath, JSON.stringify({ id: 1 }, null, 4), 'utf-8');
      await fs.promises.writeFile(Home.filePath, JSON.stringify({}, null, 4), 'utf-8');
    } catch(err){
      throw err;
    }
  };
};

module.exports = {
  Home
};