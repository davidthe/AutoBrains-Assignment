# Canvas Rendering Home Assignment

## Overview

This project demonstrates a server-client architecture where the server streams (using WebSocket) data containing coordinates and timestamps for rectangles and points, and the client renders these shapes on a 2D or 3D canvas. The 2D rendering is done using vanilla JavaScript and HTML5 Canvas, while the 3D rendering is achieved with Three.js.

## Features

- Simple two hours implementation
- 2D and 3D rendering support.
- Color-coding of rectangles based on point positions:
  - Green if the point is inside the rectangle.
  - Red if the point is outside the rectangle.

## Requirements

- Node.js (version 12 or higher)
- npm (Node package manager)

## Installation

1. enter canvas-rendering-assignment then Install the required npm packages:

   ```sh
   npm install
   ```

## Running the Project

1. Start the server:

   ```sh
   node server.js
   ```
2. Open `index.html` in your web browser. by entering localhost:3000

## Usage

- Click the "Start 2D Rendering" button to begin 2D rendering.
- Click the "Start 3D Rendering" button to begin 3D rendering.
- The shapes will be drawn on the canvas according to the data streamed from the server.

## File Structure

- `server.js`: The server script that reads JSON files and streams data to the client using WebSocket.
- `client.js`: The client script that handles 2D and 3D rendering and sending commands to the servers.
- `index.html`: The HTML file containing the canvas and buttons for rendering options.
- `data/rectangles.json`: The JSON file containing 2D rectangle data.
- `data/points.json`: The JSON file containing 2D point data.
- `data/rectangles3D.json`: The JSON file containing 3D rectangle data.
- `data/points3D.json`: The JSON file containing 3D point data.
