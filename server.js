require("dotenv").config();
const express = require("express");
const { urlencoded } = require("body-parser");

const MessagingResponse = require("twilio").twiml.MessagingResponse;
const { GoogleSpreadsheet } = require("google-spreadsheet");
const {
  AssetVersionContext,
} = require("twilio/lib/rest/serverless/v1/service/asset/assetVersion");

const app = express();
app.use(urlencoded({ extended: false }));

const docId = "1wswCabOKHPI0hgMBOzrRNz3oLLf70CkhWjCVIq9imxU";

const validMessageTypes = ["idea", "todo"];

// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(docId);

async function initializeDoc() {
  // Initialize Auth
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
}

function isValid(s) {
  return s in validMessageTypes;
}

function parseMessageType(message) {
  // parse message based on first word.
  const splitMessage = message.split(" ");

  const firstWord = splitMessage[0].toLowerCase();

  const messageType = validMessageTypes.includes(firstWord) ? firstWord : "";

  if (messageType === "") throw new Error(`Invalid Message Type: ${firstWord}`);

  const test = splitMessage.slice(1);

  return {
    note: splitMessage.slice(1).join(" "),
    messageType,
  };
}

app.post("/sms", async (req, res) => {
  // should map to sheet depending on input of text

  const {
    body: { Body: rawMessage, From: sender },
  } = req;

  const { note, messageType } = parseMessageType(rawMessage);

  const twiml = new MessagingResponse();

  await initializeDoc();

  switch (messageType) {
    case "idea":
      break;

    default:
      break;
  }

  let sheet;

  try {
    sheet = doc.sheetsByTitle[messageType];
  } catch (e) {
    throw new Error(`Invalid sheet key: ${messageType}`);
  }

  const newRow = await sheet.addRow({
    sender,
    note,
  });

  // Add a text message.
  const msg = twiml.message(
    `Just added your note to the '${messageType}' list!`
  );

  res.end(msg.toString());
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
