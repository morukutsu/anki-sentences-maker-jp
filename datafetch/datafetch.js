import fetch from "isomorphic-unfetch";

const FETCH_URI = "http://localhost:3001";

const dataFetchCards = async (start, end) => {
    let uri;

    if (start != undefined && end != undefined) {
        uri = FETCH_URI + "/list/" + start + "/" + end;
    } else {
        uri = FETCH_URI + "/list";
    }

    try {
        const res = await fetch(uri);
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(e);
        return {};
    }
};

const dataSearchCards = async string => {
    let uri = FETCH_URI + "/search/" + string;

    try {
        const res = await fetch(uri);
        const json = await res.json();
        return json;
    } catch (e) {
        console.error(e);
        return {};
    }
};

const dataAddCard = async card => {
    let uri = FETCH_URI + "/add";

    try {
        const res = await fetch(uri, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(card)
        });
        const json = await res.json();
        return json.added;
    } catch (e) {
        console.error(e);
        return false;
    }
};

const dataRemoveCard = async card => {
    let uri = FETCH_URI + "/remove/" + card.id;

    try {
        await fetch(uri);
    } catch (e) {
        console.error(e);
    }
};

export {
    dataFetchCards,
    dataSearchCards,
    dataAddCard,
    dataRemoveCard,
    FETCH_URI
};
