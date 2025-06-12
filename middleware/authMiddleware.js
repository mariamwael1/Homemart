function isAdmin(req, res, next) {
  const user = req.session.user;
  if (user?.role === 'admin') {
    req.user = user;
    return next();
  }

  req.session.error = 'You must be an admin to access this page.';
  return res.redirect('/');
}

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
    return next();
  }

  const wantsJson = req.headers.accept && req.headers.accept.includes('application/json');

  if (wantsJson) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }

  req.session.error = 'Please log in to continue.';
  return res.redirect('/login');
}

module.exports = {
  isAdmin,
  isLoggedIn,
};