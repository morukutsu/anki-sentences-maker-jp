const AWS = require("aws-sdk");

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

const getAllCardIds = async () => {
    let params = {
        TableName: "decks",
        Key: {
            id: { S: "test" }
        }
    };

    try {
        const result = await ddb.getItem(params).promise();
        if (!result.Item) return [];
        if (!result.Item.cards) return [];
        if (!result.Item.cards.SS) return [];

        const cardsId = result.Item.cards.SS;
        return cardsId;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getAllCards = async () => {
    try {
        const cardsId = await getAllCardIds();
        if (cardsId.length == 0) return [];

        const keys = cardsId.map(e => ({
            id: {
                S: e
            }
        }));

        let params = {
            RequestItems: {
                cards: {
                    Keys: keys
                }
            }
        };

        const resultCards = await ddb.batchGetItem(params).promise();
        if (!resultCards.Responses.cards) return [];

        const cards = resultCards.Responses.cards.map(e => ({
            id: e.id.S,
            kanji: e.kanji.S,
            kana: e.kana.S,
            english: e.english.S,
            order: e.order.N
        }));

        return cards.sort((a, b) => b.order - a.order);
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

const updateCardsIds = async cardsId => {
    let params = {
        TableName: "decks",
        Key: {
            id: { S: "test" }
        },
        ReturnValues: "ALL_NEW",
        ExpressionAttributeNames: {
            "#Y": "cards"
        },
        ExpressionAttributeValues: {
            ":y": {
                SS: cardsId
            }
        },
        UpdateExpression: "SET #Y = :y"
    };

    return await ddb.updateItem(params).promise();
};

const addCard = async data => {
    try {
        // Add card id in deck set
        const cardsId = await getAllCardIds();
        if (cardsId.indexOf(data.id) != -1) {
            return false;
        }

        cardsId.push(data.id);

        let result = await updateCardsIds(cardsId);

        // Add card content
        params = {
            TableName: "cards",
            Item: {
                id: {
                    S: data.id
                },
                english: {
                    S: data.english
                },
                kana: {
                    S: data.kana
                },
                kanji: {
                    S: data.kanji
                },
                order: {
                    N: cardsId.length.toString()
                }
            }
        };

        result = await ddb.putItem(params).promise();
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

const removeCard = async id => {
    let params = {
        TableName: "cards",
        Key: {
            id: { S: id }
        }
    };

    try {
        // Remove card id from deck set
        const cardsId = await getAllCardIds();
        const index = cardsId.indexOf(id);
        cardsId.splice(index, 1);
        let result = await updateCardsIds(cardsId);

        // Remove content
        await ddb.deleteItem(params).promise();
    } catch (e) {}
};

module.exports = {
    getCards: getCards,
    getCardsCount: getCardsCount,
    getAllCards: getAllCards,
    addCard: addCard,
    removeCard: removeCard
};
