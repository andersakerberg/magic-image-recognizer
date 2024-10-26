require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");
const https = require('https'); // Add this line to require the https module

const app = express();
const port = 3001; // Changed port number to 3001

// Azure credentials from environment variables
const key = process.env.AZURE_COMPUTER_VISION_KEY;
const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;

const credentials = new ApiKeyCredentials({
  inHeader: { "Ocp-Apim-Subscription-Key": key },
});
const client = new ComputerVisionClient(credentials, endpoint);

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Serve static files from the "public" directory and uploads directory
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Function to delete files in the uploads directory
function deleteUploads() {
  fs.readdir('uploads', (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join('uploads', file), err => {
        if (err) throw err;
      });
    }
  });
}

// Analyze image function
async function analyzeImage(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const result = await client.analyzeImageInStream(() => imageBuffer, {
      visualFeatures: ["Description", "Tags"],
    });

    // Extract description and tags
    const captions = result.description.captions.map((c) => {
      const text = c.text;
      const confidence = (c.confidence * 100).toFixed(2) + "%";
      return `${text} (Confidence: ${confidence})`;
    }).join(", ");

    const tags = result.tags.map(tag => tag.name).join(", ");

    // Combine description with tags for a richer output
    return `Description: ${captions}. Tags: ${tags}.`;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    throw error;
  }
}

// Handle image upload and processing
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/styles.css">
        <title>Error</title>
      </head>
      <body>
        <div class="container">
          <h1>No file uploaded!</h1>
          <p>Please select a file to upload.</p>
          <button class="button" onclick="window.history.back()">Back</button>
        </div>
      </body>
      </html>
    `);
  }

  try {
    const filePath = req.file.path;
    const outputFilePath = path.join(
      "uploads",
      `${path.parse(req.file.filename).name}.png`
    );

    // Resize and convert image to PNG
    await sharp(filePath)
      .resize({ width: 1024 }) // Resize to a width of 1024 pixels, maintaining aspect ratio
      .png()
      .toFile(outputFilePath);

    // Analyze the resized image
    const description = await analyzeImage(outputFilePath);

    // Send response with image preview and description
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/styles.css">
        <title>Image Analysis Result</title>
      </head>
      <body>
        <div class="container">
          <h1>Image Analysis Result</h1>
          <img src="/${outputFilePath}" alt="Uploaded Image" style="max-width: 300px; height: auto;"/> <!-- Set max-width to 300px -->
          <p><strong>${description}</strong></p>
          <button class="button" onclick="window.history.back()">Back</button>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Error processing image");
  } finally {
    // Check if the file is accessible
    fs.access(req.file.path, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`No write permission for file ${req.file.path}:`, err.message);
      } else {
        // Asynchronously delete the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(`Failed to delete file ${req.file.path}:`, err.message);
          }
        });
      }
    });

    // Schedule deletion of the uploads folder contents after 2 minutes
    setTimeout(deleteUploads, 2 * 60 * 1000);
  }
});

// Serve the upload form
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="/styles.css">
      <title>Magic Image Recognizer</title>
      <style>
        #loading {
          display: none;
          font-size: 18px;
          color: #ffcc00;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the Magic Image Recognizer!</h1>
        <p>Upload an image and let the magic unfold as we reveal its secrets!</p>
        <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
          <label for="file-upload" class="button">
            Choose Your Magical Image
          </label>
          <input id="file-upload" type="file" name="image" accept="image/*" required onchange="showLoadingAndSubmit();" />
        </form>
        <div id="loading">Processing your magical image...</div>
      </div>
      <script>
        function showLoadingAndSubmit() {
          document.getElementById('loading').style.display = 'block';
          document.getElementById('uploadForm').submit();
        }
      </script>
    </body>
    </html>
  `);
});

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_FILE), // Read the SSL key from the environment variable
  cert: fs.readFileSync(process.env.SSL_CERT_FILE), // Read the SSL certificate from the environment variable
};

// Replace the existing app.listen with https.createServer
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
