const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

const generateHelper = require("../../../helpers/generate.helper");
const sendMailHelper = require("../../../helpers/send-mail.helper");

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

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const emailExist = await User.findOne({
    email: email,
    deleted: false
  });

  if(!emailExist) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  // Việc 1: Lưu vào database gồm email, mã otp gửi cho email đó + thời gian hết hạn
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 5*60*1000
    // 5p = 5*60*1000ms
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Việc 2: Gửi mã OTP qua email của user
  const subject = `Mã OTP lấy lại mật khẩu`;
  const content = `Mã OTP để lấy lại mật khẩu là ${otp}. Vui lòng không để lộ mã OTP.`;
  sendMailHelper.sendMail(email, subject, content);

  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!"
  });
};

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  // check email và otp
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result) {
    res.json({
      code: 400,
      message: "Mã OTP không hợp lệ!"
    });
    return;
  }

  // check thành công thì trả về user và token của user đó
  const user = await User.findOne({
    email: email
  });

  res.json({
    code: 200,
    message: "Xác thực thành công!",
    token: user.token
  });
};

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;

  const user = await User.findOne({
    token: token,
    deleted: false
  });

  if(!user) {
    res.json({
      code: 400,
      message: "Người dùng không tồn tại!"
    });
    return;
  }

  await User.updateOne({
    token: token
  }, {
    password: md5(password)
  });

  res.json({
    code: 200,
    message: "Cập nhật mật khẩu thành công!"
  });
};