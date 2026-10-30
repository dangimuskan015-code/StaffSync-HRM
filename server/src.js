import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, email: { type: String, required: true, unique: true },
  department: { type: String, default: 'General' }, position: { type: String, default: 'Employee' },
  role: { type: String, enum: ['Admin','Manager','Employee'], default: 'Employee' },
  status: { type: String, enum: ['Active','On Leave'], default: 'Active' },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });
const Employee = mongoose.model('Employee', employeeSchema);
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'Admin' } });
const User = mongoose.model('User', userSchema);

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ message: 'Invalid or expired token' }); }
};
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'StaffSync API' }));
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email and password (6+ chars) are required' });
    const existing = await User.findOne({ email }); if (existing) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) { res.status(500).json({ message: 'Could not register user' }); }
});
app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
app.get('/api/employees', auth, async (_req, res) => res.json(await Employee.find().sort({ createdAt: -1 })));
app.post('/api/employees', auth, async (req, res) => {
  try { const employee = await Employee.create(req.body); res.status(201).json(employee); }
  catch (e) { res.status(400).json({ message: e.code === 11000 ? 'Email already exists' : 'Invalid employee details' }); }
});
app.put('/api/employees/:id', auth, async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ message: 'Employee not found' }); res.json(employee);
});
app.delete('/api/employees/:id', auth, async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id); if (!employee) return res.status(404).json({ message: 'Employee not found' }); res.json({ message: 'Employee removed' });
});

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`StaffSync API listening on ${port}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
