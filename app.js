// app.js: server using to test the lambdas locally
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// lambdas
const search = require("./lambdas/search");
const save = require("./lambdas/save");

app.get("/search/:token", search);
app.post("/save", save);

app.listen(3001);
