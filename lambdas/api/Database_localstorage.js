const createOrReadDb = () => {
    const localStorage = window.localStorage;

    let data = localStorage.getItem("db");
    if (!data) data = "{ \"cards\": [] }";

    const content = JSON.parse(data);
    return content;
};

const updateDb = content => {
    const localStorage = window.localStorage;

    localStorage.setItem("db", JSON.stringify(content));
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

export {
    getCards,
    getCardsCount,
    getAllCards,
    addCard,
    removeCard
};
