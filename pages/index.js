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

    const res = await fetch(uri);
    const json = await res.json();
    return json;
};

const Item = props => {
    return (
        <div style={styles.item}>
            <div>{props.kanji}</div>
            <div>{props.kana}</div>
            <div>{props.english}</div>
            <Button color="neutral" size="small">
                Remove
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

    const onPageChange = async page => {
        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const data = await dataFetchCards(start, end);
        setCards(data.cards);
        setCount(data.count);
        setPage(page);
    };

    const items = cards.map((e, i) => <Item key={i} {...e} />);

    return (
        <div>
            <section style={styles.page}>
                <div style={styles.content}>
                    <h2>Lingo</h2>
                    <div>{items}</div>
                    <Pagination
                        currentPage={page}
                        itemsPerPage={ITEMS_PER_PAGE}
                        count={count}
                        onChangePage={page => onPageChange(page)}
                    />
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
        maxWidth: 700,
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
    }
};

export default Page;
