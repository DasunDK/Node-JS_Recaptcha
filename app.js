require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const siteKey = process.env.RECAPTCHA_SITE_KEY;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index", { siteKey: siteKey });
});

app.post('/submit', async (req, res) => {
    const token = req.body['g-recaptcha-response'];
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    try {
        const response = await axios.post(url);
        const data = response.data;

        if (data.success) {
            res.send('reCAPTCHA verified successfully!');
        } else {
            res.send('reCAPTCHA verification failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred during reCAPTCHA verification.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});
