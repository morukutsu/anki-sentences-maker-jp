const Database = require("./api/Database");

const getRequestBody = req => {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            resolve(body);
        });
    });
};

module.exports = async (req, res) => {
    try {
        const data = await getRequestBody(req);
        const result = JSON.parse(data);

        //Database.addCard(data);

        res.json({});
    } catch (e) {
        console.log(e);
        res.json({ result: "error" });
    }
};
