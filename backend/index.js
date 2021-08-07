const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const routes = require('./routes.js');
const cors = require('cors')

app.use(cors({
  origin: '*'
}));
app.set('port', PORT);
app.set('env', NODE_ENV);
app.use(express.json());
app.use(express.urlencoded());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});
