"use client";
import React, { useState } from "react";

const HighClassCalculator: React.FC = () => {
  const [input, setInput] = useState<string>(""); // To store the current input
  const [output, setOutput] = useState<string>(""); // To store the result of evaluation

  // Handle button click
  const handleButtonClick = (value: string) => {
    setInput((prevInput) => prevInput + value);
  };

  // Evaluate the expression
  const handleEqualClick = () => {
    try {
      const result = eval(input); // Evaluates the input expression
      setOutput(result.toString()); // Sets the result as output
    } catch (error) {
      setOutput("Error"); // Sets "Error" if evaluation fails
    }
  };

  // Clear all input and output
  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.calculatorContainer}>
        <div style={styles.displayContainer}>
          <div style={styles.inputOutput}>
            <div style={styles.input}>{input || "0"}</div>
            <div style={styles.output}>{output || ""}</div>
          </div>
        </div>
        <div style={styles.buttons}>
          {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(
            (btn) => (
              <button
                key={btn}
                style={styles.button}
                onClick={() =>
                  btn === "=" ? handleEqualClick() : handleButtonClick(btn)
                }
              >
                {btn}
              </button>
            )
          )}
          <button style={styles.clearButton} onClick={handleClear}>
            C
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#add8e6",
    padding: "20px",
  },
  calculatorContainer: {
    width: "100%",
    maxWidth: "360px", /* Set to a max-width that fits well on mobile */
    background: "#2e2e2e",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease", // Smooth transition effect
  },
  displayContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  inputOutput: {
    padding: "15px",
    backgroundColor: "#222",
    borderRadius: "10px",
    textAlign: "right",
    color: "#fff",
    fontSize: "28px", /* Adjust font size for mobile screens */
  },
  input: {
    fontWeight: "300",
  },
  output: {
    fontWeight: "bold",
    fontSize: "32px",
    color: "#4caf50",
  },
  buttons: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", /* 4 buttons per row */
    gap: "10px",
    width: "100%",
  },
  button: {
    padding: "15px",
    fontSize: "22px", /* Larger font size for buttons */
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s", /* Smooth background change and button click animation */
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  buttonHover: {
    transform: "scale(1.1)", /* Slight grow effect on hover */
  },
  clearButton: {
    backgroundColor: "#f44336",
    color: "#fff",
    borderRadius: "10px",
    gridColumn: "span 4",
    padding: "15px",
    fontSize: "22px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
};

export default HighClassCalculator;
