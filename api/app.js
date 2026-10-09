const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { clientOrigin, isProduction } = require("./config/env");
const { requireAuth } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(logger(isProduction ? "combined" : "dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", requireAuth, require("./routes/categories"));
app.use("/api/products", requireAuth, require("./routes/products"));
app.use("/api/bills", requireAuth, require("./routes/bills"));
app.use("/api/users", requireAuth, require("./routes/users"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
