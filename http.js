import { data } from "./data.mjs";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
const server = createServer((req, res) => {
  if (req.url === "/products" && req.method === "GET") {
    res.end(JSON.stringify(data));
  } else if (req.url.startsWith("/product/") && req.method === "GET") {
    const id = req.url.split("/")[2];
    const product = data.find((item) => item.id == id);
    res.writeHead(200, { "Content-Type": "text/json" });
    res.end(JSON.stringify(product));
  } else if (req.url === "/product" && req.method === "POST") {
    req.on("data", (chunk) => {
      const newProduct = JSON.parse(chunk);
      newProduct.id = uuidv4();
      data.push(newProduct);
      res.writeHead(201, { "Content-Type": "text/json" });
      res.end(JSON.stringify(newProduct));
      console.log("New product added:", newProduct);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});
const port = 3000;
server.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://localhost:${port}/`);
});
