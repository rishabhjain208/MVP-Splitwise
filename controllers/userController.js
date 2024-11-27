const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    const { email, currency } = req.body;
    const already_user = await User.findOne({ email });

    if (already_user) {
      return res
        .status(403)
        .json({ success: false, message: "User already registered !" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hash,
      currency: req.body.currency,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ success: true, message: "Successfull created", newUser });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Some error", error });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not Found" });
    }
    const checkpassword = await bcrypt.compare(password, user.password);
    if (!checkpassword) {
      return res
        .status(403)
        .json({ success: false, message: "Password is Incorrect!" });
    }
    //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ success: true, message: "Login Successfull !" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Some error", error });
  }
};
