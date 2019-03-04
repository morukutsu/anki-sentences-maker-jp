import Head from "next/head";
import React, { Component, useState, useRef, useEffect } from "react";

import Button from "../components/Button";
import {
    dataFetchCards,
    dataSearchCards,
    dataAddCard,
    dataRemoveCard,
    FETCH_URI
} from "../datafetch/datafetch";

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
        const currentPageStyle =
            props.currentPage == i ? styles.currentPage : {};
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

const Search = props => {
    const searchCards = props.searchCards;
    const added = props.added;
    const onAdd = props.onAdd;
    const onSearch = props.onSearch;

    const [searchString, setSearchString] = useState("");

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
                    onClick={() => onSearch(searchString)}
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

const ITEMS_PER_PAGE = 5;

const Page = props => {
    const [page, setPage] = useState(0);
    const [cards, setCards] = useState(props.cards);
    const [count, setCount] = useState(props.count);
    const [mode, setMode] = useState(0);
    const [searchCards, setSearchCards] = useState([]);
    const [added, setAdded] = useState({});

    const reloadCards = async newPage => {
        if (newPage == undefined) newPage = page;

        const start = newPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const data = await dataFetchCards(start, end);
        setCards(data.cards);
        setCount(data.count);
    };

    const onChangeMode = async mode => {
        if (mode == 0) await reloadCards();
        setMode(mode);
    };

    const onPageChange = async newPage => {
        await reloadCards(newPage);
        setPage(newPage);
    };

    const onSearch = async str => {
        const data = await dataSearchCards(str);
        setSearchCards(data);
        setAdded({});
    };

    const onAdd = async (card, index) => {
        if (added[index]) return;

        const isAdded = await dataAddCard(card);
        added[index] = true;
        setAdded(added);

        // The card was not already in DB
        if (isAdded) setCount(prev => prev + 1);
    };

    const onRemove = async (card, index) => {
        await dataRemoveCard(card);
        await reloadCards();
    };

    const MyCards = props => {
        const items = cards.map((e, i) => (
            <Item
                color="light"
                text="Remove"
                key={e.id}
                {...e}
                onClick={() => onRemove(e, i)}
            />
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

    return (
        <div>
            <section style={styles.page}>
                <div style={styles.content}>
                    <h2>Anki Sentences Deck Maker</h2>
                    <h3>{count} cards</h3>
                    <div style={styles.topButtons}>
                        <Button color="neutral" onClick={() => onChangeMode(0)}>
                            My cards
                        </Button>
                        <Button color="neutral" onClick={() => onChangeMode(1)}>
                            Find...
                        </Button>
                    </div>
                    <div style={styles.cards}>
                        {mode ? (
                            <Search
                                searchCards={searchCards}
                                added={added}
                                onAdd={onAdd}
                                onSearch={onSearch}
                            />
                        ) : (
                            <MyCards />
                        )}
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
