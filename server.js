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

const rectangles2D = readData('Rect.json');
const points2D = readData('Point.json');

const rectangles3D = readData('Rect3D.json');
const points3D = readData('Point3D.json');

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

const data2D = mergeData(rectangles2D, points2D);
const data3D = mergeData(rectangles3D, points3D);

const sendData = (ws, data) => {
    console.log('sending data')
  data.forEach((item) => {
    setTimeout(() => {
      ws.send(JSON.stringify(item));
    }, item.timestamp);
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {// recive request for data from the client
    message = message.toString()
    if (message === '2D') {
      sendData(ws, data2D);
    } else if (message === '3D') {
      sendData(ws, data3D);
    }
  });
});
