const { APKG } = require("anki-apkg");
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
    // Receive the full DB content form the post request
    const data = await getRequestBody(req);
    const db = JSON.parse(data);
    const cards = db.cards;

    // Generates the anki deck
    const name = "SentencesDeck";
    const fields = ["Semantic1", "Semantic1Reading", "Semantic1English"];
    const template = {
        question: `<div style="font-family: MS Mincho, Arial; font-size: 30px;">{{Semantic1}}</div><hr/>
        <div style="font-family: MS Mincho, Arial; font-size: 30px;">{{Semantic1Reading}}</div>`,
        answer: `<div style="font-family: MS Mincho, Arial; font-size: 30px;">{{Semantic1}}</div><hr/>
        <div style="font-family: MS Mincho, Arial; font-size: 30px;">{{Semantic1Reading}}</div><hr/>
        <div style="font-family: Arial; font-size: 20px;color:blue;">{{Semantic1English}}</div>`
    };

    const style =
        ".card { font-family: arial; font-size: 24px; text-align: center; color: black; background-color: white; } .card1 { background-color: #ffffff; } .card2 { background-color: #ffffff; } .card3 { background-color: #ffffff; }";

    const apkg = new APKG({
        name: name,
        card: {
            fields: fields,
            template: template,
            styleText: style
        }
    });

    for (let card of cards) {
        const id = parseInt(card.id.substr(0, 8), 16);
        apkg.addCard({
            id: id,
            content: [card.kanji, card.kana, card.english]
        });
    }

    const filename = "deck.apkg";
    const mimetype = "application/zip";

    apkg.saveToBuffer(buf => {
        res.writeHead(200, {
            "Content-Type": mimetype,
            "Content-disposition": "attachment;filename=" + filename,
            "Content-Length": buf.length
        });

        res.end(new Buffer(buf, "binary"));
    });
};
