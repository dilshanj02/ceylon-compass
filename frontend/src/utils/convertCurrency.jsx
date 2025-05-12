const convertCurrency = (amountLKR, selectedCurrency, rates) => {
  if (selectedCurrency === "USD") {
    return amountLKR / rates.USD;
  } else if (selectedCurrency === "EUR") {
    return amountLKR / rates.EUR;
  }
  return amountLKR; // default: LKR
};

export default convertCurrency;
