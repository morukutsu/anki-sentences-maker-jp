const Database = require("./api/Database");

module.exports = async (req, res) => {
    const cards = await Database.getCards(req.params.start, req.params.end);
    const count = await Database.getCardsCount();

    res.json({
        cards: cards,
        count: count
    });
};
