const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nocache = require("nocache");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");

const customerRouter = require("./routes/customerRoutes");
const adminRouter = require("./routes/adminRoutes");
const ledgerEntriesRouter = require("./routes/ledgerEntriesRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(nocache());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request, try again after some time"
});
app.use("/api", limiter);

app.use(helmet({ contentSecurityPolicy: false }));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/", viewRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/ledgerEntries", ledgerEntriesRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message:
      "Message coming from app.js * route handler. There is no link with that path"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  err.status = err.status || "fail";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
