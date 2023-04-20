const jwt = require("jsonwebtoken");
const util = require("util");

const AppError = require("../utils/appError");
const Customer = require("./../models/customerModel");

exports.checkAlreadyCustomer = async (req, res, next) => {
  if (req.body.name && req.body.area && req.body.firmName) {
    const alreadyCustomer = await Customer.find({
      name: req.body.name.toLowerCase(),
      area: req.body.area.toLowerCase(),
      firmName: req.body.firmName.toLowerCase()
    });

    if (alreadyCustomer[0]) {
      return next(
        new AppError(
          409,
          "There is already a person with same Name, Area and Firmname"
        )
      );
    }
  }
  next();
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new AppError(401, "Please provide username and password"));
    }

    const admin = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    };

    if (username !== admin.username || password !== admin.password)
      return next(new AppError(401, "Wrong username or password"));

    const token = jwt.sign({}, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Logged in! Welcome"
    });
  } catch (err) {
    console.log("Error from login controller", err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return res.status(401).render("unauthorized");

    await util.promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: "failed",
        message: "Invalid token"
      });
    } else {
      console.log("Error from protect route", err);
    }
  }
};
