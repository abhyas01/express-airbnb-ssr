const { express, bodyParser, path, rootDir, PORT } = require('./config.js');

const { hostRouter } = require('./routes/hostRouter.js');
const { storeRouter } = require('./routes/storeRouter.js');

const { loggingMiddleware } = require('./middlewares/loggingMiddleware.js');
const errorController = require('./controllers/errorController.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(loggingMiddleware);

app.use(express.static(path.join(rootDir, 'public')));

app.use(storeRouter);
app.use('/host', hostRouter);

app.use(errorController.get404);

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});