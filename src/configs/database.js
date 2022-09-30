import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const connectToDatabase = async () => {
  try {
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const dbName = process.env.DB_NAME;

    const databaseUrl = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=${dbName}`;
    await mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
    });
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

export default connectToDatabase;
