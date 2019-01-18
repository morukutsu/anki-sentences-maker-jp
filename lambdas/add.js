const SHA256 = require("crypto-js/sha256");

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

        result.id = SHA256(
            result.english + result.kanji + result.kana
        ).toString();
        const added = await Database.addCard(result);

        res.json({ added: added });
    } catch (e) {
        console.log(e);
        res.json({ added: false });
    }
};
