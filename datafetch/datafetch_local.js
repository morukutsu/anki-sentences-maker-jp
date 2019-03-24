const Database = require("../lambdas/api/Database_localstorage.js");
const SHA256 = require("crypto-js/sha256");

// TODO: fix that
let FETCH_URI;

if (process.env.NODE_ENV === "production") {
    FETCH_URI = "";
} else {
    FETCH_URI = "http://localhost:3001";
}

const dataFetchCards = async (start, end) => {
    const cards = await Database.getCards(start, end);
    const count = await Database.getCardsCount();

    return {
        cards: cards,
        count: count
    };
};

const dataAddCard = async card => {
    card.id = SHA256(
        card.english + card.kanji + card.kana
    ).toString();

    const added = await Database.addCard(card);

    return { added: added };
};

const dataRemoveCard = async card => {
    await Database.removeCard(card.id);
};

const dataSearchCards = async string => {
    let uri = FETCH_URI + "/search/" + string;

    try {
        const res = await fetch(uri);
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export {
    dataFetchCards,
    dataSearchCards,
    dataAddCard,
    dataRemoveCard,
    FETCH_URI
};
