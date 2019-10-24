const router = require("express").Router();

// Load User model
const User = require("../../models/User.js");

router.post("/add", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        auth0_key:req.body.auth0_key,
        name: req.body.name,
        email: req.body.email        
      });

      newUser
      .save()
      .then(user => res.json(user))
      .catch(err => console.log(err));

        // Hash password before saving in database
        //   bcrypt.genSalt(10, (err, salt) => {
        //     bcrypt.hash(newUser.password, salt, (err, hash) => {
        //       if (err) throw err;
        //       newUser.password = hash;
        //       newUser
        //         .save()
        //         .then(user => res.json(user))
        //         .catch(err => console.log(err));
        //     });
        //   });
    }
  });
});


module.exports = router;
