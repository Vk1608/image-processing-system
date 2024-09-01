# Image Processing System

## Overview

This project is an asynchronous image processing system that accepts CSV files containing image URLs, processes the images by compressing them, and stores the processed images along with associated product information in a MongoDB database. The system uses a webhook to notify when processing is complete.

## Features

- **CSV Input:** Accepts CSV files with product details and image URLs.
- **Asynchronous Processing:** Utilizes Bull queues to handle image processing tasks asynchronously.
- **Image Compression:** Compresses images to 50% of their original quality using `sharp`.
- **Data Storage:** Stores product information and processed image URLs in MongoDB.
- **Webhook Notification:** Triggers a webhook upon completion of image processing.
- **Rate Limiting:** Limits the number of requests to prevent overload.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Redis
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/image-processing-system.git
    cd image-processing-system
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:
    - Create a `.env` file based on the `.env.example` provided.
    - Add your MongoDB connection string, Redis URL, and other necessary configurations.

### Running the Application

1. Start MongoDB and Redis services.

2. Run the application:

    ```bash
    npm start
    ```

3. The API will be available at `http://localhost:5000`.

## API Endpoints

- **Upload CSV:** `POST /api/v1/upload`
    - Upload a CSV file to start processing.

- **Check Status:** `GET /api/v1/status/:requestId`
    - Retrieve the status of a processing request.

## Webhook

- The system triggers a POST request to the configured webhook URL with processing results once all images are processed.

## Rate Limiting

- The system includes rate limiting to control the number of API requests a client can make.
