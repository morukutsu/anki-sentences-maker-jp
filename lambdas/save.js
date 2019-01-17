const { APKG } = require("anki-apkg");
const Database = require("./api/Database");

module.exports = async (req, res) => {
    const id = 1370591359;
    const name = "VocabularyBuilder";
    const fields = ["Id", "Semantic1", "Semantic1Reading", "Semantic1English"];
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

    const cards = await Database.getAllCards();
    for (let card of cards) {
        apkg.addCard({
            timestamp: +new Date(), // create time
            content: [0, card.kanji, card.kana, card.english]
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
