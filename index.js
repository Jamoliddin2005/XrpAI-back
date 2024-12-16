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

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true, unique: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);

// get

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Parollarni chiqarishni oldini olish
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка на сервере!" });
  }
});
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

app.post("/send-message", async (req, res) => {
  try {
    const { content, email } = req.body;

    if (!content || !email) {
      return res
        .status(400)
        .json({ error: "Both content and email are required!" });
    }

    // Email mavjudligini tekshirish
    const existingMessage = await Message.findOne({ email });
    const exists = !!existingMessage;

    if (exists) {
      // Agar email mavjud bo'lsa, eski email va content qiymatlarini qaytaramiz
      return res.status(200).json({
        message: "Email already exists in the database.",
        exists: true,
        email: existingMessage.email,
        content: existingMessage.content,
      });
    }

    // Email mavjud bo'lmasa, yangi xabarni saqlash
    const newMessage = new Message({ content, email });
    await newMessage.save();

    res.status(201).json({
      message: "Message saved successfully!",
      exists: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred!" });
  }
});

app.get("/send-message", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred!" });
  }
});

app.listen(PORT, () => console.log(`Server ${PORT}-connected...`));
