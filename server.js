const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());


// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/memorygame', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ เชื่อมต่อ MongoDB สำเร็จ'))
.catch(err => console.error('❌ เชื่อมต่อ MongoDB ล้มเหลว:', err));

const cardSchema = new mongoose.Schema({
  imageUrl: String,
  description: String,
});

// กำหนด Schema สำหรับ Leaderboard
const leaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number,
  timeLeft: Number,
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

// กำหนด Schema สำหรับ Card Image
const Card = mongoose.model('Card', cardSchema);

// API ดึงข้อมูลการ์ดทั้งหมด
app.get('/cardimages', async (req, res) => {
  try {
    const cards = await Card.find(); // ดึงข้อมูลทั้งหมดจาก MongoDB
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error });
  }
});

// API สำหรับเพิ่มข้อมูลลงใน leaderboard
app.use(express.json());  // เพื่อให้สามารถรับ JSON ได้

app.post('/leaderboard', async (req, res) => {
  const { name, score, timeLeft } = req.body;

  try {
    const entry = new Leaderboard({ name, score, timeLeft });
    await entry.save();
    res.status(201).send(entry);
  } catch (error) {
    res.status(500).send('Error saving leaderboard entry');
  }
});

// API สำหรับดึงข้อมูล leaderboard
app.get('/leaderboard', async (req, res) => {
  try {
    const entries = await Leaderboard.find().sort({ score: -1 }).limit(10);  // ดึง 10 อันดับแรก
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).send('Error fetching leaderboard');
  }
});

// API ดึงข้อมูล card images (แก้ไข)
app.get('/cardimages', async (req, res) => {
  try {
    const cardImages = await Card.find();  // ใช้ Card.find() ไม่ใช่ CardImage.find()
    res.status(200).json(cardImages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching card images', error });
  }
});

// API เพิ่มข้อมูลการ์ด (แก้ไข)
app.post('/cardimages', async (req, res) => {
  const { imageUrl, description } = req.body;

  try {
    const card = new Card({ imageUrl, description });  // ใช้ Card แทน CardImage
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error saving card image', error });
  }
});


// เริ่มเซิร์ฟเวอร์
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
