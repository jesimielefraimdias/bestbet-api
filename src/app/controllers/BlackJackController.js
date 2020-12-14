const knex = require("../../database");
const bcrypt = require("bcryptjs");
const mailer = require("../../services/mailer");
const { environment } = require("../../config/environment");
const { key, emailKey } = require("../../config/jwb.json");
const path = require("path");
const { getUserFromToken } = require("../helpers/userToken");
const { decodeCard } = require("../helpers/blackJack");

//CTR + K + 2
module.exports = {

    overflowProbability(req, res, next) {
        const { deck, cards, valuePlayerHand, numberOfDeckes } = req.body;

        let addTooltip = "add teste", stopTooltip = "stop teste", splitTooltip = "split teste",
            doubleTooltip = "double teste", hiddenTooltip = "hidden teste";

        let x = 21 - valuePlayerHand;
        let s = 0;
        let t = 0;
        let ten = false;


        if (valuePlayerHand <= 11 || deck === null || !deck || deck.length === 0) {
            addTooltip = 0;
        } else {
            deck.forEach(element => {
                t += element.cardsAvailable;
            });

            console.log("entrou", t);
            deck.forEach((element, index) => {
                let quantity = 0;
                let cardValue = 0;

                if (!ten && (element.card === "10" || element.card === "Q" || element.card === "J" || element.card === "K")) {
                    quantity = deck[9].cardsAvailable +
                        deck[10].cardsAvailable +
                        deck[11].cardsAvailable +
                        deck[12].cardsAvailable;
                    ten = true;
                    cardValue = 10;
                } else {
                    quantity = element.cardsAvailable;
                    cardValue = decodeCard(element.card) >= 10 ? 10 : decodeCard(element.card) + 1;
                }

                if (cardValue <= x) {
                    s += quantity;
                }
            });
            addTooltip = 1 - ((1 * s) / t);

        }

        res.status(200).json({
            addTooltip: "Chance de estourar a mão: " + (addTooltip * 100).toFixed(2) + "%",
            stopTooltip,
            splitTooltip,
            doubleTooltip,
            hiddenTooltip,
        });

    },

    hiddenProbability(req, res, next) {

        const { deck } = req.body;
        let t = 0, hiddenTooltip = [];

        deck.forEach(element => {
            t += element.cardsAvailable;
        });

        deck.forEach((element, index) => {
            hiddenTooltip.push(`${element.card} - ${((element.cardsAvailable / t) * 100).toFixed(2)}%`);
        });

        res.status(200).json({
            hiddenTooltip,
        });

    },

    doubleProbability(req, res, next) {

        const { deck, valuePlayerHand } = req.body;
        console.log("entrou?");
        let t = 0, doubleTooltip = [], ten = false;

        deck.forEach(element => {
            t += element.cardsAvailable;
        });

        console.log("entrou", t);
        deck.forEach((element, index) => {
            let quantity = 0;
            let cardValue = 0;

            if (!ten && (element.card === "10" || element.card === "Q" || element.card === "J" || element.card === "K")) {
                quantity = deck[9].cardsAvailable +
                    deck[10].cardsAvailable +
                    deck[11].cardsAvailable +
                    deck[12].cardsAvailable;
                ten = false;
                cardValue = 10;

            } else if (element.card === "A" && valuePlayerHand < 11) {
                quantity = element.cardsAvailable;
                cardValue = 11;
            } else if (element.card !== "10" && element.card !== "Q" && element.card !== "J" && element.card !== "K") {
                quantity = element.cardsAvailable;
                cardValue = decodeCard(element.card) >= 10 ? 10 : decodeCard(element.card) + 1;
            }

            if (!ten && (element.card === "10" || element.card === "Q" || element.card === "J" || element.card === "K")) {
                ten = true;
                doubleTooltip.push(`Mão corrente + a carta 10, Q, J ou K  = ${valuePlayerHand + cardValue} - ${((quantity / t) * 100).toFixed(2)}%`);
            } else if (element.card !== "10" && element.card !== "Q" && element.card !== "J" && element.card !== "K") {
                doubleTooltip.push(`Mão corrente + a carta ${element.card} = ${valuePlayerHand + cardValue} - ${((quantity / t) * 100).toFixed(2)}%`);
            }


        });
        console.log(doubleTooltip);
        res.status(200).json({
            doubleTooltip,
        });

    },
}