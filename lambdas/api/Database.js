const data = require("../../data/deck");

const getCards = (start, end) => {
    start = start ? start : 0;
    end = end ? end : 5;

    return data.cards.slice(start, end);
};

const getAllCards = () => {
    return data.cards;
};

const getCardsCount = () => {
    return data.cards.length;
};

module.exports = {
    getCards: getCards,
    getCardsCount: getCardsCount,
    getAllCards: getAllCards
};
