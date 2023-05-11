const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Set up a route for the ConceptNet API
app.get('/api/conceptnet', async (req, res) => {
  const term = req.query.term;

  try {
    const response = await axios.get(`http://api.conceptnet.io/c/en/${encodeURIComponent(term)}?rel=/r/IsA`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
