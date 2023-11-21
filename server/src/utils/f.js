const Decimal = require('decimal.js');

function weiToEther(bigIntValue, decimalPlaces, precision) {
    const bigDecimalValue = new Decimal(bigIntValue.toString());
    return Number(bigDecimalValue.div(new Decimal(10).pow(decimalPlaces)).toNumber().toPrecision(precision));
}

function bigIntToBigDecimal(bigIntValue) {
    return new Decimal(bigIntValue.toString());
}

module.exports = {
    weiToEther,
    bigIntToBigDecimal
};