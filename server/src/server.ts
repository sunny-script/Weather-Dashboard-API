import dotenv from 'dotenv';
import express from 'express';
//import path from 'path';
dotenv.config();

// Import the routes
import routes from './routes/index.js';
//import apiRoutes from './routes/api/index.js';
//import htmlRoutes from './routes/htmlRoutes.js';
//import { fileURLToPath } from 'url';

//const _filename = fileURLToPath(import.meta.url);
//const _dirname = path.dirname(_filename);

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder DONE
//app.use(express.static(path.join(_dirname, '../client/dist')));
app.use(express.static('../client/dist'));

// TODO: Implement middleware for parsing JSON and urlencoded form data DONE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Implement middleware to connect the routes DONE
console.log("Hit Server");
app.use(routes)
//app.use('/api', apiRoutes);
//app.use('/', htmlRoutes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
