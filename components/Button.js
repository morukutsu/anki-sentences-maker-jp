import React, { Component, useState, useRef, useEffect } from "react";
import { useSpring, animated } from "react-spring/hooks";
import useHover from "../hooks/useHover";

const colors = {
    neutral: "#2CB1F4",
    positive: "#7BC528",
    negative: "#FC7322",
    light: "#AAAAAA"
};

export default props => {
    const btn = hovered => {
        const opacity = hovered ? 0.7 : 1;

        let style = useSpring({
            ...styles.container,
            backgroundColor: colors[props.color],

            opacity: opacity,
            from: { opacity: 0 },
            config: { tension: 500, friction: 20 }
        });

        if (props.size === "small") {
            style = { ...style, ...styles.small };
        } else {
            style = { ...style, ...styles.normal };
        }

        const linkProps = {};

        if (props.onClick) linkProps.onClick = () => props.onClick();
        if (props.href) linkProps.href = props.href;

        return (
            <animated.a style={style} {...linkProps}>
                {props.children}
            </animated.a>
        );
    };

    const [hoverable, hovered] = useHover(btn);

    return hoverable;
};

const styles = {
    container: {
        display: "inline-block",
        textAlign: "center",
        color: "#f0f0f0",
        cursor: "pointer",
        userSelect: "none"
    },

    normal: {
        width: 160,
        height: 48,
        borderRadius: 32,
        margin: 5,
        fontSize: 24,
        lineHeight: "48px"
    },

    small: {
        width: 80,
        height: 24,
        borderRadius: 16,
        margin: 5,
        fontSize: 14,
        lineHeight: "24px"
    }
};
