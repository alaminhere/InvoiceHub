const express = require('express');
const connectDb = require('./db/db');
const rootMiddleware = require('./middlewares/root.middleware');
const rootRoute = require('./routes/root.route');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const app = express();
require('dotenv').config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieparser());

/*-----------------------------------*
 *         Database Connection       *
 *-----------------------------------*/
let dbConnectionPromise;

const ensureDbConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDb()
      .then(() => {
        console.log('Database was connected');
      })
      .catch(err => {
        console.error('Database Connect Failed!!', err);
        dbConnectionPromise = null;
        throw err;
      });
  }

  await dbConnectionPromise;
};

/*-----------------------------------*
 *        Database Middleware        *
 *-----------------------------------*/
app.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (err) {
    next(err);
  }
});
/*-----------------------------------*
 *         root middleware           *
 *-----------------------------------*/
rootMiddleware(app);

/*-----------------------------------*
 *             rootRoute             *
 *-----------------------------------*/
rootRoute(app);

/*-----------------------------------*
 *               404 config          *
 *-----------------------------------*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'The request was not Found!',
  });
});

/*------------------------------------*
 *        error handle config         *
 *------------------------------------*/
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: 'Internal Server Error!!',
  });
});

/*------------------------------------*
 *     connect DB and listen app      *
 *------------------------------------*/
// connectDb()
//   .then(() => {
//     console.log('Database was connected');

//     app.listen(PORT, () => {
//       console.log(`App is Running at http://localhost:${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('Database Connect Failed!!', err);
//   });

/*------------------------------------*
 *          Local Development        *
 *------------------------------------*/
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`App is Running at http://localhost:${PORT}`);
  });
}

/*------------------------------------*
 *          Vercel Export             *
 *------------------------------------*/
module.exports = app;
