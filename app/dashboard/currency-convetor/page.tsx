"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming you've set up these components
import { Input } from "@/components/ui/input";

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // API Key (store this in an environment variable in a production app)
  const API_KEY = "c5f3c2c7f37fd83eb6367c01"; 

  // Fetch exchange rates on page load
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}?apikey=${API_KEY}`
        );
        const data = await response.json();
        setExchangeRates(data.rates); // Store the exchange rates
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [fromCurrency]); // Re-fetch when the 'fromCurrency' changes

  const handleConversion = () => {
    if (amount && exchangeRates[toCurrency]) {
      const converted = amount * exchangeRates[toCurrency];
      setConvertedAmount(converted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-blue-300 to-blue-500 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6 sm:p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 sm:text-5xl">Currency Converter</h1>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-lg text-gray-700 font-semibold">Amount</label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter amount"
            />
          </div>

          {/* From Currency Input */}
          <div>
            <label htmlFor="fromCurrency" className="block text-lg text-gray-700 font-semibold">From Currency</label>
            <Input
              type="text"
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter from currency (e.g., USD)"
            />
          </div>

          {/* To Currency Input */}
          <div>
            <label htmlFor="toCurrency" className="block text-lg text-gray-700 font-semibold">To Currency</label>
            <Input
              type="text"
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter to currency (e.g., EUR)"
            />
          </div>

          {/* Convert Button */}
          <Button
            onClick={handleConversion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            Convert
          </Button>

          {/* Loading Indicator */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}

          {/* Converted Amount Display */}
          {convertedAmount !== null && !loading && (
            <div className="text-center text-xl font-semibold text-gray-800 mt-4">
              <p>{`Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
