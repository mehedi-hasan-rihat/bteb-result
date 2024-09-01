const express = require('express');
const cors = require('cors');

app.use(cors({
    origin: "http://localhost:3000"
}));

const app = express();

// Set up a server-side endpoint to handle requests
app.get('/api/results', async (req, res) => {
    const rollNumber = req.query.rollNumber;
    const url = `https://btebresulthub-temp-server.vercel.app/results/individual/${rollNumber}`;

    try {
        // Make a secure request to the BTEB result API
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

