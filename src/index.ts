import express from 'express';

const app = express();
const PORT = 3001;

// JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to FaithfulHands API' });
});

// Start server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running at ${url}`);
});
