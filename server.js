require("dotenv").config();
const express = require("express");
const { urlencoded } = require("body-parser");

const MessagingResponse = require("twilio").twiml.MessagingResponse;
const { GoogleSpreadsheet } = require("google-spreadsheet");

const app = express();
app.use(urlencoded({ extended: false }));

const sheetId = "1wswCabOKHPI0hgMBOzrRNz3oLLf70CkhWjCVIq9imxU";

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(sheetId);

app.post("/sms", async (req, res) => {
  // Start our TwiML response.
  const twiml = new MessagingResponse();

  // Initialize Auth
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0];

  const newRow = await sheet.addRow({
    sender: req.body.From,
    note: req.body.Body,
  });

  // Add a text message.
  const msg = twiml.message(`You shall write to:  ${doc.title}!`);

  res.end(msg.toString());
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
