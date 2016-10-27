const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//cookie가 아니므로 인증에 성공해도 session생성을 따로하지 말 것
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session:false });

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
