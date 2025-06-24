const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Connect to MongoDB
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/IDcard_collection');
  console.log("db connected");
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Schemas and Models

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => /^\S+@\S+\.\S+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: { type: String, required: true, minlength: 6 },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  location: { type: String, default: '' }
});
const User = mongoose.model('User', userSchema);

// LoginLog Schema
const loginLogSchema = new mongoose.Schema({
  email: String,
  success: Boolean,
  timestamp: { type: Date, default: Date.now },
  ip: String,
});
const LoginLog = mongoose.model('LoginLog', loginLogSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address1: { type: String, required: true, trim: true },
  address2: { type: String, trim: true, default: '' },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[0-9]{10}$/.test(v),
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  state: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[0-9]{6}$/.test(v),
      message: props => `${props.value} is not a valid pincode!`
    }
  },
  country: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Order = mongoose.model('Order', orderSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }
});
const Payment = mongoose.model('Payment', paymentSchema);

// Design Schema
const designSchema = new mongoose.Schema({
  designName: { type: String, required: true, trim: true },
  frontSvg: { type: String, required: true },
  backSvg: { type: String, required: true },
  designId: { type: String, required: true, unique: true }
});
const Design = mongoose.model('Design', designSchema);

// UserDesignHistory Schema
const userDesignHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  zipFile: { type: Buffer, required: true }
});
const UserDesignHistory = mongoose.model('UserDesignHistory', userDesignHistorySchema);

// Middleware
app.use(express.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// Routes

// User CRUD
app.post('/user', async (req, res) => {
  const { name, email, password, mobileNumber, location } = req.body;
  try {
    const newUser = new User({ name, email, password, mobileNumber, location });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.put('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, mobileNumber, location } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password, mobileNumber, location },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let success = false;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await LoginLog.create({ email, success });
      return res.status(404).json({ message: 'User not found' });
    }
    if (existingUser.password !== password) {
      await LoginLog.create({ email, success });
      return res.status(401).json({ message: 'Invalid password' });
    }
    success = true;
    await LoginLog.create({ email, success });
    res.status(200).json({ message: 'Login successful', user: existingUser });
    console.log("login successful");
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Order creation
app.post('/user/order', async (req, res) => {
  const {
    name,
    address1,
    address2,
    mobileNumber,
    email,
    state,
    city,
    pincode,
    country,
    userId
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    const newOrder = new Order({
      name,
      address1,
      address2,
      mobileNumber,
      email,
      state,
      city,
      pincode,
      country,
      userId
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get user's orders
app.get('/user/order/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order
app.put('/user/order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { name, mobileNumber, address2, address1 } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { name, mobileNumber, address2, address1 },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete order
app.delete('/user/order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// Payment routes
app.post('/user/order/payment', async (req, res) => {
  const { amount, userId, orderId, date } = req.body;
  try {
    const newPayment = new Payment({ amount, userId, orderId, date: date || Date.now() });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/user/order/payment/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    const orderIds = orders.map(order => order._id);
    const payments = await Payment.find({ orderId: { $in: orderIds } });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Design routes
app.post('/design', async (req, res) => {
  const { designName, frontSvg, backSvg } = req.body;
  try {
    const newDesign = new Design({ designName, frontSvg, backSvg, designId: uuidv4() });
    await newDesign.save();
    res.status(201).json(newDesign);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/designs/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) return res.status(404).json({ message: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save history (upload zip file)
app.post('/save-history', upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.body;
    const fileBuffer = fs.readFileSync(req.file.path); // Read file into Buffer

    const newHistory = new UserDesignHistory({
      userId,
      fileName: req.file.originalname,
      zipFile: fileBuffer,
    });

    await newHistory.save();

    // Optionally delete the uploaded file after reading
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'File saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// Fetch history
app.get('/get-history/:userId', async (req, res) => {
  try {
    const history = await UserDesignHistory.find({ userId: req.params.userId })
      .sort({ uploadedAt: -1 })
      .select('-zipFile'); // exclude zipFile data
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Error fetching history.' });
  }
});

// Download ZIP file
app.delete('/delete-history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await DesignModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting design' });
  }
});

app.get('/design-history/download/:id', async (req, res) => {
  try {
    const design = await UserDesignHistory.findById(req.params.id);
    if (!design || !design.zipFile) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${design.fileName}"`,
    });
    res.send(design.zipFile);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading design.' });
  }
});


// GET /api/svg/:modelName
app.get('/svgmodel/:designName', async (req, res) => {
  try {
    const { designName } = req.params;
    const designDoc = await Design.findOne({ designName });

    if (!designDoc) {
      return res.status(404).json({ message: "Design not found" });
    }

    res.json({
      frontSvg: designDoc.frontSvg,
      backSvg: designDoc.backSvg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Server start
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});