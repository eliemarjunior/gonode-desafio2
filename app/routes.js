const express = require('express');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const projectController = require('./controllers/projectController');
const sectionController = require('./controllers/sectionController');
const authMidleware = require('./midlewares/auth');
const guestMidleware = require('./midlewares/guest');

const routes = express.Router();

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

routes.get('/', guestMidleware, authController.signin);
routes.get('/signup', guestMidleware, authController.signup);
routes.get('/signout', authController.signout);
routes.post('/register', authController.register);
routes.post('/autenticate', authController.autenticate);

routes.use('/app', authMidleware);
routes.get('/app/dashboard', dashboardController.index);

routes.get('/app/projects/:projectId', projectController.show);
routes.delete('/app/projects/:projectId', projectController.destroy);
routes.post('/app/projects/create', projectController.store);

routes.get('/app/projects/:projectId/sections/:id', projectController.show);
routes.put('/app/projects/:projectId/sections/:id', sectionController.update);
routes.delete('/app/projects/:projectId/sections/:id', sectionController.destroy);
routes.post('/app/projects/:projectId/sections/create', sectionController.store);

routes.use((req, res) => res.render('errors/404'));

routes.use((err, req, res, _next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;
