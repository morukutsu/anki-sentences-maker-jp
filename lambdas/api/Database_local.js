const fs = require("fs");

const DB_PATH = "./db/db.json";

const createOrReadDb = () => {
    if (!fs.existsSync(DB_PATH))
        fs.writeFileSync(DB_PATH, JSON.stringify({ cards: [] }));

    const content = JSON.parse(fs.readFileSync(DB_PATH));
    return content;
};

const updateDb = content => {
    fs.writeFileSync(DB_PATH, JSON.stringify(content));
};

const getCards = async (start, end) => {
    const db = createOrReadDb();

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
    const db = createOrReadDb();
    return db.cards.map((e, i) => {
        return { ...e, order: i };
    });
};

const getCardsCount = async () => {
    const db = createOrReadDb();
    return db.cards.length;
};

const addCard = async data => {
    const db = createOrReadDb();
    db.cards.push(data);
    updateDb(db);
    return true;
};

const removeCard = async id => {
    const db = createOrReadDb();
    for (let i = 0; i < db.cards.length; i++) {
        const card = db.cards[i];
        if (id === card.id) {
            db.cards.splice(i, 1);
            updateDb(db);
            return;
        }
    }
};

module.exports = {
    getCards: getCards,
    getCardsCount: getCardsCount,
    getAllCards: getAllCards,
    addCard: addCard,
    removeCard: removeCard
};
