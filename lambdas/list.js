const Database = require("./api/Database");

module.exports = async (req, res) => {
    const cards = Database.getCards(req.params.start, req.params.end);
    const count = Database.getCardsCount();

    res.json({
        cards: cards,
        count: count
    });
};
