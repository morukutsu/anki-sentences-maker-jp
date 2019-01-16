import Head from "next/head";
import React, { Component, useState, useRef, useEffect } from "react";
import fetch from "isomorphic-unfetch";

import Button from "../components/Button";

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
        return json;
    } catch (e) {
        console.error(e);
        return {};
    }
};

const Item = props => {
    return (
        <div style={styles.item}>
            <div>{props.kanji}</div>
            <div>{props.kana}</div>
            <div>{props.english}</div>
            <Button color={props.color} size="small" onClick={props.onClick}>
                {props.text}
            </Button>
        </div>
    );
};

const Pagination = props => {
    const pagesCount = props.count / props.itemsPerPage;
    const items = [];

    for (let i = 0; i < pagesCount; i++) items.push(i + 1);

    const elems = items.map((e, i) => {
        let currentPageStyle = props.currentPage == i ? styles.currentPage : {};
        return (
            <a
                key={i}
                style={{ ...styles.paginationItem, ...currentPageStyle }}
                onClick={() => props.onChangePage(i)}
            >
                {e}
            </a>
        );
    });

    return <div style={styles.pagination}>{elems}</div>;
};

const ITEMS_PER_PAGE = 5;

const Page = props => {
    const [page, setPage] = useState(0);
    const [cards, setCards] = useState(props.cards);
    const [count, setCount] = useState(props.count);
    const [mode, setMode] = useState(0);
    const [searchString, setSearchString] = useState("");
    const [searchCards, setSearchCards] = useState([]);
    const [added, setAdded] = useState({});

    const onPageChange = async page => {
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const data = await dataFetchCards(start, end);
        setCards(data.cards);
        setCount(data.count);
        setPage(page);
    };

    const onSearch = async () => {
        const data = await dataSearchCards(searchString);
        setSearchCards(data);
        setAdded({});
    };

    const onAdd = (card, index) => {
        dataAddCard(card);

        added[index] = true;
        setAdded(added);
    };

    const renderMyCards = () => {
        const items = cards.map((e, i) => (
            <Item color="light" text="Remove" key={i} {...e} />
        ));

        return (
            <div>
                <div>{items}</div>
                <Pagination
                    currentPage={page}
                    itemsPerPage={ITEMS_PER_PAGE}
                    count={count}
                    onChangePage={page => onPageChange(page)}
                />
            </div>
        );
    };

    const renderSearch = () => {
        const items = searchCards.map((e, i) => (
            <Item
                color={added[i] ? "light" : "positive"}
                text={added[i] ? "Added" : "Add"}
                key={i}
                {...e}
                onClick={() => onAdd(e, i)}
            />
        ));

        return (
            <div>
                <div>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Type in vocabulary, kanji..."
                        value={searchString}
                        onChange={e => setSearchString(e.target.value)}
                    />
                    <Button
                        color="neutral"
                        size="small"
                        onClick={() => onSearch()}
                    >
                        Search
                    </Button>
                </div>
                <div>
                    <div>{items}</div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <section style={styles.page}>
                <div style={styles.content}>
                    <h2>Anki Sentences Deck Maker</h2>
                    <h3>{count} cards</h3>
                    <div style={styles.topButtons}>
                        <Button color="neutral" onClick={() => setMode(0)}>
                            My cards
                        </Button>
                        <Button color="neutral" onClick={() => setMode(1)}>
                            Find...
                        </Button>
                    </div>
                    <div style={styles.cards}>
                        {mode ? renderSearch() : renderMyCards()}
                    </div>
                    <Button color="positive" href={FETCH_URI + "/save"}>
                        Save to Anki
                    </Button>
                </div>
            </section>
        </div>
    );
};

Page.getInitialProps = async ({ req }) => {
    return dataFetchCards();
};

const styles = {
    page: {
        height: "100vh"
    },

    content: {
        display: "flex",
        flexDirection: "column",
        width: 800,
        justifyContent: "center",
        margin: "0 auto",
        paddingTop: "20px",
        alignItems: "center"
    },

    item: {
        marginBottom: 20
    },

    paginationItem: {
        cursor: "pointer",
        marginRight: 10,
        fontWeight: "bold",
        fontSize: 24
    },

    pagination: {
        marginBottom: 20
    },

    currentPage: {
        textDecoration: "underline"
    },

    topButtons: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 10
    },

    cards: {
        width: 800
    },

    input: {
        fontSize: 20,
        width: 300,
        height: 28
    }
};

export default Page;
