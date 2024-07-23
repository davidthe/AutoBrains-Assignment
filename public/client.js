const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const container = document.getElementById('3d-container');
let renderer, scene, camera;

const ws = new WebSocket('ws://localhost:3000');

document.getElementById('2d-button').onclick = () => {
  ws.send('2D');
  canvas.style.display = 'block';
  container.style.display = 'none';
};

document.getElementById('3d-button').onclick = () => {
  ws.send('3D');
  canvas.style.display = 'none';
  container.style.display = 'block';
  if (!renderer) init3D();
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.rectangle.Depth) {
    draw3D(data);
  } else {
    draw2D(data);
  }
};

const draw2D = (data) => {
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

const init3D = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
};

const draw3D = (data) => {
  const { rectangle, point, timestamp } = data;

  // Clear previous objects
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  // Create the rectangle (box) and scale by 10
  const geometry = new THREE.BoxGeometry(rectangle.Width * 10, rectangle.Height * 10, rectangle.Depth * 10);
  const material = new THREE.MeshBasicMaterial();

  // Check if the point is inside the rectangle
  const isPointInside = point.X >= rectangle.X && point.X <= (rectangle.X + rectangle.Width) &&
                        point.Y >= rectangle.Y && point.Y <= (rectangle.Y + rectangle.Height) &&
                        point.Z >= rectangle.Z && point.Z <= (rectangle.Z + rectangle.Depth);

  if (isPointInside) {
    material.color.set(0x00ff00); // Green
  } else {
    material.color.set(0xff0000); // Red
  }

  const cube = new THREE.Mesh(geometry, material);
  cube.position.set((rectangle.X - 0.5) * 10, (rectangle.Y - 0.5) * 10, (rectangle.Z - 0.5) * 10);
  scene.add(cube);

  // Create the point (sphere) and scale by 10
  const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Scaled up radius
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const sphere = new THREE.Mesh(pointGeometry, pointMaterial);
  sphere.position.set((point.X - 0.5) * 10, (point.Y - 0.5) * 10, (point.Z - 0.5) * 10);
  scene.add(sphere);

  renderer.render(scene, camera);
};
