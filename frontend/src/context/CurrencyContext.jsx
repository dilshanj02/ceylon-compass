import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("LKR");
  const [rates, setRates] = useState({
    LKR: 1,
    USD: 0.0032,
    EUR: 0.003,
  });

  const convert = (amount, to = currency) => {
    return (amount * rates[to]).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
