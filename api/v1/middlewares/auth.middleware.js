const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if(req.headers.authorization) {
      // lấy token (do bên FE gửi lên thông qua headers)
      const token = req.headers.authorization.split(" ")[1];

      // tìm tk có token đó
      const user = await User.findOne({
        token: token,
        deleted: false
      }).select("-password -token");

      // k có -> sai token || chưa đăng nhập
      if(!user) {
        res.json({
          code: 400,
          message: "Không có quyền truy cập!"
        });
      } else {
        // có -> tạo 1 biến local user
        res.locals.user = user;
        next();
      }
    } else {
      res.json({
        code: 400,
        message: "Vui lòng gửi kèm theo token!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không có quyền truy cập!"
    });
  }
}