import express from 'express';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';
import memotreeRouter from './memotreeRouter.js';

const __dirname = path.resolve();

const app = express();

app.use(cors());
app.set('views', path.join(process.cwd() + '/dist'));
app.use(express.static(path.join(process.cwd(), '/dist')));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use('/memotree', memotreeRouter);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:id', (req, res) => {
  res.render('index');
});

app.listen(process.env.PORT || 5000, function() {
  console.log('server started, used cors');
});