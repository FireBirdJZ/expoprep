# Frontend Mobile App

A modern React Native app built with Expo for monitoring and analyzing energy consumption.

## 📱 Quick Start with Expo Go

Try the app instantly on your mobile device:

1. Install [Expo Go](https://expo.dev/client) from your device's app store
2. Scan the QR code below or [click here to open](https://expo.dev/preview/update?message=night%20color%20hack%20to%20match%20day&updateRuntimeVersion=1.0.0&createdAt=2025-01-05T06%3A36%3A28.188Z&slug=exp&projectId=40a43b9d-358e-477d-882a-2c22351a1479&group=a9db9c9b-483b-4280-bcca-d54e12efa8b3)

![Expo QR Code](docs/expo_qr.svg)

## 🛠 Local Development Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
   ```bash
   git clone [your-repo-url]
   cd [your-project-name]

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the index

   ```bash
   npx expo start --go
   ```

## Tech Stack
- React Native
- Expo
- TypeScript
- Gifted Charts



# Backend Server Documentation

A Node.js/Express.js server deployed on Render with PostgreSQL database integration.

## 🌐 Live API Endpoints

### Base URL

https://expoprep.onrender.com

> ⚠️ Note: First request may take 30-60 seconds due to Render's free tier cold start

### Available Endpoints

1. **Health Check**
   GET /
   Test server connection status

2. **Data Retrieval**
   GET /data
   Returns complete database in JSON format

### Query Parameters

1. **Timezone Conversion**
   GET /data?timezone=[timezone]
   
   Examples:
   - timezone=Europe/Oslo
   - timezone=America/Chicago

2. **Date Range Filtering using Natural Language Parsing**

   The API uses Chronos to understand human-readable date formats. You can write dates naturally in various formats:
   
   GET /data?start=[date]&end=[date]
   
   Examples:
   - start=Dec20&end=December26
   - start=December23&end=Decemb24

4. **Combined Parameters**
   GET /data?timezone=Europe/Oslo&start=Dec20&end=December20

## 🛠 Local Development Setup

1. Navigate to backend directory
   cd backend_server

2. Install dependencies
   npm install

3. Configure environment
   - Create .env.local file
   - Add your database credentials:

   ```
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=your_host
   DB_PORT=your_port
   DB_NAME=your_database
   ```

4. Start server
   ```node
   node app.js
   ```

## 📊 Database Population

Use the included utility script to populate database from CSV:
node db_populate_from_csv.js

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- Chronos (Date handling)
- Render (Hosting)

## 📝 API Response Format

Basic Structure:
```json
{
  "success": true,
  "data": [...],
  "message": "Data fetched successfully"
}
```


Example Response:
```json
{
  "success": true,
  "data": [
{
      "id": 58,
      "timestamp": "2024-12-20T01:00:11.796Z",
      "local_time": "2024-12-20 02:00:11.796134",
      "fridge_kwh": 0.138031460512636,
      "oven_kwh": 0,
      "lights_kwh": 0.0617587823565352,
      "ev_charger_kwh": 0
    },
    {
      "id": 59,
      "timestamp": "2024-12-20T01:15:11.796Z",
      "local_time": "2024-12-20 02:15:11.796134",
      "fridge_kwh": 0.160295865701905,
      "oven_kwh": 0,
      "lights_kwh": 0.0459881467129023,
      "ev_charger_kwh": 0
    }
  ],
  "message": "Data fetched in Europe/Oslo timezone from 2024-12-20T12:00:00.000Z to 2024-12-26T12:00:00.000Z"
}
```

