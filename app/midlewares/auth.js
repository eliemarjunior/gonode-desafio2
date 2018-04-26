module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.sessionName = req.session.user.name;
    return next();
  }

  req.flash('error', 'Não autorizado');
  return res.redirect('/');
};
