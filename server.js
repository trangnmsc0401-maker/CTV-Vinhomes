const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "registrations.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readRegistrations() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveRegistrations(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

const PHONE_REGEX = /^(0|\+84)(\d){9,10}$/;

app.post("/api/register", (req, res) => {
  const { fullName, phone, email, city, experience } = req.body || {};

  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: "Vui lòng nhập họ và tên." });
  }
  if (!phone || !PHONE_REGEX.test(phone.trim())) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ." });
  }

  const entry = {
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: (email || "").trim(),
    city: (city || "").trim(),
    experience: (experience || "").trim(),
    createdAt: new Date().toISOString(),
  };

  const list = readRegistrations();
  list.push(entry);
  saveRegistrations(list);

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`CTV Vinhomes site running at http://localhost:${PORT}`);
});
