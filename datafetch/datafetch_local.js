import * as Database from "../lambdas/api/Database_localstorage"
import SHA256 from "crypto-js/sha256"

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

const dataSearchCards = async (baseUri, string) => {
    let uri = baseUri + "/search/" + string;

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
    dataRemoveCard
};
