import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// --- Database setup (MongoDB) ---
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/runya';
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  profile: {
    photo: String,
    age: Number,
    height: Number,
    weight: Number,
    goals: String
  }
});

const WorkoutSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  type: String,
  duration: Number,
  calories: Number,
  timestamp: { type: Date, default: Date.now }
});

const MealSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  name: String,
  calories: Number,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Workout = mongoose.model('Workout', WorkoutSchema);
const Meal = mongoose.model('Meal', MealSchema);

const SECRET = process.env.JWT_SECRET || 'secretkey';

// --- Helper ---
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Routes ---
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  res.json({ id: user._id });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Wrong password' });
  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

app.get('/api/user', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

app.get('/api/workouts', authMiddleware, async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.id });
  res.json(workouts);
});

app.post('/api/workouts', authMiddleware, async (req, res) => {
  const workout = await Workout.create({ ...req.body, userId: req.user.id });
  res.json(workout);
});

app.get('/api/meals', authMiddleware, async (req, res) => {
  const meals = await Meal.find({ userId: req.user.id });
  res.json(meals);
});

app.post('/api/meals', authMiddleware, async (req, res) => {
  const meal = await Meal.create({ ...req.body, userId: req.user.id });
  res.json(meal);
});

app.get('/api/progress', authMiddleware, async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.id });
  const meals = await Meal.find({ userId: req.user.id });
  res.json({ workoutCount: workouts.length, mealCount: meals.length });
});

app.get('/api/export', authMiddleware, async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.id });
  const meals = await Meal.find({ userId: req.user.id });
  const csv = ['Type,Duration,Calories,Timestamp'];
  workouts.forEach(w => csv.push(`workout,${w.duration},${w.calories},${w.timestamp}`));
  meals.forEach(m => csv.push(`meal,,${m.calories},${m.timestamp}`));
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv.join('\n'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
