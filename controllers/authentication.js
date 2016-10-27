const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({error: "You must provide email and password"});
  }

  //해당 이메일 주소를 가진 유저가 존재하는지 체크하라
  User.findOne({ email: email }, function(err, existingUser){
    if (err) { return next(err); }

    //해당 이메일 주소를 가진 유저가 존재하면 에러를 리턴하라
    if(existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }

    //해당 이메일 주소를 가진 유저가 존재하지 않으면 유저레코드를 생성하고 저장해라
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      //유저생성 리퀘스트에 대한 리스폰스 보내기
      res.json({ token: tokenForUser(user) });
    });
  });

}
