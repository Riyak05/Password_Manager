const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

dotenv.config();

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "passop";
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// Connect to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to database");
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

// Get all the passwords
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a password
app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const insertResult = await collection.insertOne(password);
    res.send({ success: true, result: insertResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a password by id
app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 1) {
      res.send({ success: true });
    } else {
      res.status(404).send({ success: false, message: "Password not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
