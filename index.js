const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = 3000;
const path = "./data.json";

app.use(bodyParser.json());

// Fungsi membaca data
const readData = () => {
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
};

// Fungsi menulis data
const writeData = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
};

// CREATE
app.post("/items", (req, res) => {
    const data = readData();
    const newItem = { id: data.length ? data[data.length - 1].id + 1 : 1, ...req.body };
    data.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

// READ (All)
app.get("/items", (req, res) => {
    const data = readData();
    res.json(data);
});

// READ (By ID)
app.get("/items/:id", (req, res) => {
    const data = readData();
    const item = data.find((d) => d.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

// UPDATE
app.put("/items/:id", (req, res) => {
    const data = readData();
    const index = data.findIndex((d) => d.id === parseInt(req.params.id));
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        writeData(data);
        res.json(data[index]);
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

// DELETE
app.delete("/items/:id", (req, res) => {
    const data = readData();
    const filteredData = data.filter((d) => d.id !== parseInt(req.params.id));
    if (filteredData.length === data.length) {
        res.status(404).json({ error: "Item not found" });
    } else {
        writeData(filteredData);
        res.json({ message: `Item with id ${req.params.id} deleted` });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
