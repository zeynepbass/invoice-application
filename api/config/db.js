const mongoose = require("mongoose");
const { mongoUri } = require("./env");

const connectDatabase = () => mongoose.connect(mongoUri);

module.exports = connectDatabase;
