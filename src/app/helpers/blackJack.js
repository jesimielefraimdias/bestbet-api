exports.decodeCard = (card) => {
    switch (card) {
        case "H":
            return -1;
            break;
        case "A":
            return 0;
            break;
        case "Q":
            return 10;
            break;
        case "J":
            return 11;
            break;
        case "K":
            return 12;
            break;

        default:
            return parseInt(card) - 1;
            break;
    }
}
