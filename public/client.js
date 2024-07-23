const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  draw(data);
};

const draw = (data) => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const { rectangle, point, timestamp } = data;

  const rectX = rectangle.X * canvas.width;
  const rectY = rectangle.Y * canvas.height;
  const rectWidth = rectangle.Width * canvas.width;
  const rectHeight = rectangle.Height * canvas.height;

  const pointX = point.X * canvas.width;
  const pointY = point.Y * canvas.height;

  context.beginPath();
  context.rect(rectX, rectY, rectWidth, rectHeight);

  if (pointX >= rectX && pointX <= rectX + rectWidth &&
      pointY >= rectY && pointY <= rectY + rectHeight) {
    context.fillStyle = 'green';
  } else {
    context.fillStyle = 'red';
  }

  context.fill();
  context.closePath();

  context.beginPath();
  context.arc(pointX, pointY, 5, 0, Math.PI * 2);
  context.fillStyle = 'blue';
  context.fill();
  context.closePath();

  context.font = '16px Arial';
  context.fillStyle = 'black';
  context.fillText(`Timestamp: ${timestamp.toFixed(2)}`, 10, 20);
};
