const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// lambdas
const search = require("./lambdas/search");
const list = require("./lambdas/list");
const save = require("./lambdas/save");

app.get("/search/:token", search);
app.get("/list/:start?/:end?", list);
app.get("/save", save);

app.listen(3001);
