const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const rectangles = readData('Rect.json'); 
const points = readData('Point.json');

const mergeData = (rectangles, points) => {
  const data = [];

  rectangles.forEach(rect => {
    const point = points.find(p => p.ts >= rect.ts);
    if (point) {
      data.push({
        rectangle: rect,
        point: point,
        timestamp: rect.ts
      });
    }
  });

  return data.sort((a, b) => a.timestamp - b.timestamp);
};

const data = mergeData(rectangles, points);

const sendData = (ws) => {
  data.forEach((item) => {
    setTimeout(() => {
      ws.send(JSON.stringify(item));
    }, item.timestamp);
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  sendData(ws);
});
