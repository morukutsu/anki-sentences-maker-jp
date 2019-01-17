const AWS = require("aws-sdk");

// Load the AWS SDK for Node.js
AWS.config.loadFromPath("./aws-config.json");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

const getCards = async (start, end) => {
    try {
        const cards = await getAllCards();

        start = start ? start : 0;
        end = end ? end : 5;

        return cards.slice(start, end);
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getAllCards = async () => {
    let params = {
        TableName: "decks",
        Key: {
            id: { S: "test" }
        }
    };

    try {
        const result = await ddb.getItem(params).promise();
        if (!result.Item) return [];

        const cardsId = result.Item.cards.SS;
        const keys = cardsId.map(e => ({
            id: {
                S: e
            }
        }));

        params = {
            RequestItems: {
                cards: {
                    Keys: keys
                }
            }
        };

        const resultCards = await ddb.batchGetItem(params).promise();
        if (!resultCards.Responses.cards) return [];

        const cards = resultCards.Responses.cards.map(e => ({
            kanji: e.kanji.S,
            kana: e.kana.S,
            english: e.english.S
        }));

        return cards;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getCardsCount = async () => {
    let params = {
        TableName: "decks",
        Key: {
            id: { S: "test" }
        }
    };

    try {
        const result = await ddb.getItem(params).promise();
        if (!result.Item) return [];

        return result.Item.cards.SS.length;
    } catch (e) {
        return 0;
    }
};

module.exports = {
    getCards: getCards,
    getCardsCount: getCardsCount,
    getAllCards: getAllCards
};
