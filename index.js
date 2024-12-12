const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "JWT_SECRET_KEY_XRPAPI";

// Middleware
app.use(
  cors({
    origin: "https://xrp-ai-front.vercel.app", 
    credentials: true,
  })
);

app.use(express.json());

// Mongoose
mongoose
  .connect(
    "mongodb+srv://jamoliddin:kucharov@cluster0.jnb1tpl.mongodb.net/XRPAI"
  )
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB error:", err));

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Заполните все поля!" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "Пользователь существует!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });

  await user.save();
  res.status(201).json({ message: "Пользователь успешно создан!" });
});

// signin
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Заполните все поля!" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: "Пользователь не найден!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Пароль неверен!" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Вход успешен!", token });
});

// Server running
app.listen(PORT, () => console.log(`Server ${PORT}-connected...`));
