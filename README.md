# 🎃 Magic Image Recognizer 🧙‍♀️

Welcome to the **Magic Image Recognizer**, where the mystical powers of AI and the eerie charm of Halloween come together to reveal the secrets hidden within your images! 🧙‍♂️✨

## 👻 About the Project

The Magic Image Recognizer is a spellbinding Node.js application that uses the power of Azure's Computer Vision API to analyze images and uncover their hidden descriptions and tags. Whether it's a spooky ghost or a mysterious pumpkin, our app will unveil the magic behind every image you upload.

## 🧛‍♂️ Features

- **Image Upload**: Easily upload your images through a web interface.
- **Image Analysis**: Leverage Azure's Computer Vision to analyze and describe your images.
- **SSL Secured**: Enjoy secure connections with HTTPS, ensuring your magical images are protected.
- **Dockerized**: Run the application effortlessly using Docker and Docker Compose.

## 🕸️ Getting Started

Follow these steps to summon the Magic Image Recognizer on your local machine:

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/)
- [Azure Computer Vision API Key](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/magic-image-recognizer.git
   cd magic-image-recognizer
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file in the root directory with your Azure credentials and SSL paths:
   ```plaintext
   AZURE_COMPUTER_VISION_KEY=your_azure_key
   AZURE_COMPUTER_VISION_ENDPOINT=your_azure_endpoint
   SSL_CERT_FILE=C:\\path\\to\\your\\cert_key\\cert.pem
   SSL_KEY_FILE=C:\\path\\to\\your\\cert_key\\key.pem
   ```

3. **Build and Run with Docker**:
   ```bash
   docker compose up --build
   ```

4. **Access the App**:
   Open your web browser and navigate to `https://localhost:3001` to start uploading and analyzing your magical images.

## 🦇 Usage

- **Upload an Image**: Click the "Choose Your Magical Image" button to select an image from your device.
- **Analyze the Image**: Watch as the app reveals the description and tags of your image.
- **Enjoy the Magic**: Share the results with your friends and family!

## 🎃 Contributing

We welcome contributions from fellow wizards and witches! Feel free to fork the repository and submit pull requests with your enhancements.

## 🧙‍♀️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🕷️ Acknowledgments

- Special thanks to the Azure Computer Vision team for their enchanting API.
- Inspired by the spirit of Halloween and the magic of technology.

---

Unleash the magic within your images and let the Magic Image Recognizer cast its spell! 🧙‍♂️✨