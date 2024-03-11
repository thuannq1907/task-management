const md5 = require("md5");
const User = require("../models/user.model");

const generateHelper = require("../../../helpers/generate.helper");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  const emailExist = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if(emailExist) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!"
    });
  } else {
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);

    const user = new User(req.body);
    const data = await user.save();

    res.json({
      code: 200,
      message: "Tạo tài khoản thành công!",
      token: data.token
    });
  }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // check email
  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  // check password
  if(md5(password) != user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!"
    });
    return;
  }

  // đăng nhập thành công thì trả về cho user 1 cái token (đưa lên cookies)
  const token = user.token;

  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token: token
  });
};