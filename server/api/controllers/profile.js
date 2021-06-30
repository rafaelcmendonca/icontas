const mongoose = require('mongoose');
const User = mongoose.model('User');

function validateMessage(req, res){
  if (!req.payload._id) {
    res.status(401).json({
      message: 'Unauthorized'
    });
    return false;
  } else {
    return true;
  }
}

module.exports.profileRead = (req, res) => {
  if (validateMessage(req,res)) {
    User.findById(req.payload._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

module.exports.getUserById = (req, res) => {
  if (validateMessage(req,res)) {
    User.findById(req.params._id).exec(function(err, user) {
      res.status(200).json(user);
    });
  }
};

module.exports.updatePassword = (req, res) => {
  if (validateMessage(req,res)) {
    User.findOne({email: req.body.email}, function(err, user) {
      if (err){
        res.send(err);
      } else {
        user.setPassword(req.body.password);
        user.save(() => {
          const token = user.generateJwt();
          res.status(200);
          res.json({
            token: token
          });
        });
      }
  });
  };
};
