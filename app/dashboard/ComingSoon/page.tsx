"use client";
import { useState, useEffect } from "react";
import { Card, Spacer } from "@nextui-org/react";
import { motion } from "framer-motion";

const ComingSoonPage = () => {
    const [countdown, setCountdown] = useState<number>(10); // Countdown timer in seconds
    const [showMessage, setShowMessage] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        if (countdown <= 0) {
            clearInterval(timer);
            setShowMessage(true);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f5f5", // Light neutral background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: "0 20px",
                fontFamily: "'Roboto', sans-serif",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                style={{
                    maxWidth: "95%", // Ensures container doesn't exceed screen width
                    width: "600px", // Default size for large screens
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    boxSizing: "border-box", // Ensures padding doesn't exceed container width
                }}
            >
                {/* Main Heading */}
                <h1
                    style={{
                        fontSize: "clamp(24px, 6vw, 48px)", // Fully responsive font size
                        fontWeight: "700",
                        marginBottom: "15px",
                        color: "#5c6bc0", // Vibrant blue color
                    }}
                >
                    Coming Soon
                </h1>

                {/* Subheading */}
                <h3
                    style={{
                        fontSize: "clamp(16px, 4vw, 24px)", // Adjusts based on screen size
                        marginBottom: "25px",
                        color: "#555", // Subtle gray for subheading
                        fontWeight: "500",
                    }}
                >
                    Something amazing is on the way
                </h3>

                {/* Countdown Card */}
                <Card
                    style={{
                        background: "#fafafa",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "clamp(14px, 3.5vw, 20px)", // Responsive card heading
                            color: "#8e24aa", // Vibrant purple
                            marginBottom: "15px",
                            fontWeight: "500",
                        }}
                    >
                        Update will be available in
                    </h3>

                    {/* Countdown */}
                    <h2
                        style={{
                            fontSize: "clamp(24px, 10vw, 60px)", // Large and responsive
                            fontWeight: "700",
                            color: "#FF7043", // Bright orange
                            letterSpacing: "1px",
                            margin: "10px 0",
                        }}
                    >
                        {countdown > 0 ? `${countdown} seconds` : "Launching Soon!"}
                    </h2>

                    <Spacer y={2} />

                    {/* Success Message */}
                    {showMessage && (
                        <p
                            style={{
                                fontSize: "clamp(14px, 3.5vw, 18px)", // Responsive paragraph font size
                                backgroundColor: "#4caf50", // Success green
                                color: "#fff",
                                padding: "10px",
                                borderRadius: "10px",
                                fontWeight: "600",
                                marginTop: "15px",
                            }}
                        >
                            Premium Code Update Complete! We will notify you soon.
                        </p>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
