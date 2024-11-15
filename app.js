require('dotenv').config();
const express = require('express');
const { Parser } = require('json2csv');
const axios = require('axios');

const app = express();
app.get('/download-suppressions', async (req, res) => {
    // Sample API response
    const response = await axios.get(
        process.env.API_URL,
        {
            headers: {
                'Accept': 'application/json',
                'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN
            }
        }
    );
    const suppressions = response.data.Suppressions;

    // Fields for the CSV file
    const fields  = ['EmailAddress', 'SuppressionReason', 'Origin', 'CreatedAt'];
    const json2csvParser = new Parser({fields});

    try {
        // Convert JSON to CSV
        const csv = json2csvParser.parse(suppressions);

        // Set response headers for file download
        res.header('Content-Type', 'text/csv');
        res.attachment('postmark.csv');
        res.send(csv);
        res.status(200).send('Importing');
    } catch (error) {
        res.status(500).send('Error generating CSV');
    }
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
