const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "JWT_SECRET_KEY_XRPAPI";

const availableTokens = [
  "rwkKmLEpfx6BVDrs6bhiwncsFgPntLaY7i",
  "rfqRff8Jp8ponq1Rq1nRy5HYDvGGNLHo4m",
  "rLKPyAGWd5ZJMsPnfLR9rSu9JUiMokGxVm",
  "rfrStx3zLYQpyz1nAav9SHn1WoNoQrhaKw",
  "rB1bY7rSdzT3NVGYJNJ4FonroGi1MTLopF",
  "rsPwMrK9B8kXaw1aMum1yVs7qbhjTHSDRW",
  "rnCUjUQMZCMYD1Vb5XLHQ5qgFhwerSmznp",
  "rEDrAdvtmiD1dgpzewYBLWhRhwApor4Rjy",
  "rBzTCwM1rMdi4zoUr4HyY1s1TJ9wf9KZz",
  "rn3TgmvkjSiek51moYKJ4Hds6KfaAD5cJR",
  "rBupSWiAmDJxX25DaCkpWMik4Xg2K4Y5eb",
  "rwaBdkg5KSn7F7BqtyheXJhDuC38Es35eY",
  "rDmZSqHLghomDhjMi6KuM5CoyKcaRjbF3z",
  "rH6za3AF4nA8DBgLs7DcWsguqWrb2Hocok",
  "rsvCv3gAHQbCzYpmcrj3vpP6UH4FvAgtkZ",
  "r3Aua39NqzmjwtjBXVNYX12rr1yH35dRX",
  "rhpyaVSsXWhsoxEeSkPDk5eXFsAcPCbd9P",
  "rNMZuPd7eXZkktinGYJmUSA5YmS5bUNhLk",
  "rnL1Ni5FPLwGWD5F6E8MkcneqYxZPpnJP3",
  "rDGwKw7qJqrWWe2unLaxLehZedWv8SDBxf",
  "rP6DocMtScPXYiYtv8hwupRRJpAtA1fuVp",
  "r3kSg4zwEMWLwLBPFPDfuK9ja9yrShhboa",
  "rG6khTY8q2SbfiDAaXabBLGwSxjQfwZzi6",
  "rsbYWYXFw2dzTh1RGEso7jR5FyYQ86qvZV",
  "r9Jx3fPG2rXhVZY96z2mCvifMa3izSZQ4e",
  "rsYr37jCgMbTksxJnq7924xkhDpxaYdYfL",
  "rpjeVBSuYWH2xzHXD4cCKPvrybE2qb75RD",
  "rZBSqrXkEyRuU1WfVZpVn4LUWfWcxxoa8",
  "rwz1bBRhJnEhuSfDj5tQHaYd6wncCt23sY",
  "r9kKzzUQpsMLgCvC1uGysC78ZkzbZd4ReM",
  "rHTW8woW82Ydprb3KBsYGF7bzQQppMQxD8",
  "rfsXLSfbptuA6Jc7KyKtCvLnqxPFL7NMkh",
  "rwycD6NrmJSdZFwCeipG3FGNrBJaH2kXGY",
  "r9NY1gYCDUtNjYHXAAPLC32TXXMsZGZojN",
  "rKsQePEWEuf8j7DRx3oW6tuqSPqnF4Gku5",
  "r3w4YRD7VqQL9tedKmV5qxJdNt1envoJRg",
  "rNx9DDMSnPB7PK66PNsfDKY81CtyEYvySd",
  "rM8VApRhWh3ddc1dEsy4JjCWAtAPoF6sds",
  "rfv3Ymf8LkEZsNdPJ4RGjWqmAi1ar1z3Qd",
  "rfs6jkofjofDUzL32tZ3Xmx7LuNtTmZFH2",
  "rRzJmJpv3qvsw6KQV52fUpfi2SxfhAQo1",
  "rDst4HyExXRNbMPoWdV3XDjYMBAPYGLKCr",
  "rDzgHLjWPvJ7dh2sRPqP3sQSNWPNCoz8Qy",
  "rfL1mrEAnKMd1FruFv92VkNCEzUgQ1Vjr1",
  "rMgBWzcUPApVfVq2GLaYd9JDMr4aS3zmiJ",
  "rDsbXyu1EHJQqsoUSrkGMCDMn93ss6RD7b",
  "rEkUv3ZozVrfMogSkUG4pAMzhpvhw9saWw",
  "rH6A4GfkwtS4TXoSaCrk1i2B6dc8tmQB3k",
  "rUeXH5AhqMntwSqy3xB3Kh3e8diyGGqjmJ",
  "rwkKmLEpfx6BVDrs6bhiwncsFgPntLaY7i",
  "rfqRff8Jp8ponq1Rq1nRy5HYDvGGNLHo4m",
  "rLKPyAGWd5ZJMsPnfLR9rSu9JUiMokGxVm",
  "rfrStx3zLYQpyz1nAav9SHn1WoNoQrhaKw",
  "rB1bY7rSdzT3NVGYJNJ4FonroGi1MTLopF",
  "rsPwMrK9B8kXaw1aMum1yVs7qbhjTHSDRW",
  "rnCUjUQMZCMYD1Vb5XLHQ5qgFhwerSmznp",
  "rEDrAdvtmiD1dgpzewYBLWhRhwApor4Rjy",
  "rBzTCwM1rMdi4zoUr4HyY1s1TJ9wf9KZz",
  "rn3TgmvkjSiek51moYKJ4Hds6KfaAD5cJR",
  "rBupSWiAmDJxX25DaCkpWMik4Xg2K4Y5eb",
  "rwaBdkg5KSn7F7BqtyheXJhDuC38Es35eY",
  "rDmZSqHLghomDhjMi6KuM5CoyKcaRjbF3z",
  "rH6za3AF4nA8DBgLs7DcWsguqWrb2Hocok",
  "rsvCv3gAHQbCzYpmcrj3vpP6UH4FvAgtkZ",
  "r3Aua39NqzmjwtjBXVNYX12rr1yH35dRX",
  "rhpyaVSsXWhsoxEeSkPDk5eXFsAcPCbd9P",
  "rNMZuPd7eXZkktinGYJmUSA5YmS5bUNhLk",
  "rnL1Ni5FPLwGWD5F6E8MkcneqYxZPpnJP3",
  "rDGwKw7qJqrWWe2unLaxLehZedWv8SDBxf",
  "rP6DocMtScPXYiYtv8hwupRRJpAtA1fuVp",
  "r3kSg4zwEMWLwLBPFPDfuK9ja9yrShhboa",
  "rG6khTY8q2SbfiDAaXabBLGwSxjQfwZzi6",
  "rsbYWYXFw2dzTh1RGEso7jR5FyYQ86qvZV",
  "r9Jx3fPG2rXhVZY96z2mCvifMa3izSZQ4e",
  "rsYr37jCgMbTksxJnq7924xkhDpxaYdYfL",
  "rpjeVBSuYWH2xzHXD4cCKPvrybE2qb75RD",
  "rZBSqrXkEyRuU1WfVZpVn4LUWfWcxxoa8",
  "rwz1bBRhJnEhuSfDj5tQHaYd6wncCt23sY",
  "r9kKzzUQpsMLgCvC1uGysC78ZkzbZd4ReM",
  "rHTW8woW82Ydprb3KBsYGF7bzQQppMQxD8",
  "rfsXLSfbptuA6Jc7KyKtCvLnqxPFL7NMkh",
  "rwycD6NrmJSdZFwCeipG3FGNrBJaH2kXGY",
  "r9NY1gYCDUtNjYHXAAPLC32TXXMsZGZojN",
  "rKsQePEWEuf8j7DRx3oW6tuqSPqnF4Gku5",
];

let currentIndex = 0;

function getNextToken() {
  const token = availableTokens[currentIndex];
  currentIndex = (currentIndex + 1) % availableTokens.length;
  return token;
}

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
  .then(() => console.log("MongoDBga ulanish muvaffaqiyatli!"))
  .catch((err) => console.error("MongoDBga ulanishda xato:", err));

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: true }, // Token qo'shildi
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
  const token = getNextToken();

  const user = new User({ username, password: hashedPassword, token });

  console.log(user);

  await user.save();
  res.status(201).json({ message: "Пользователь успешно создан!", token });
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

app.get("/checkSignupStatus", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token нет!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден!" });
    }
    res.json({ message: "Foydalanuvchi tizimga kirgan!", user });
  } catch (err) {
    res.status(400).json({ error: "Token yaroqsiz!" });
  }
});

// Server running
app.listen(PORT, () => console.log(`Server ${PORT}-connected...`));
