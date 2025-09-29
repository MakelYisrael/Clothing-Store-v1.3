// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, "SalesPageHTM.html"); // change to your HTML file

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});

/*fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error("❌ Error reading file:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error: " + err.message); // show the actual error
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  }
});*/
