"use client";
import { useState, useEffect } from "react";
import { Button, Card, Spacer } from "@nextui-org/react";
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

    const handleNotify = async () => {
        const response = await fetch("/api/notify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "rajamohamednawfal11@gmail.com" }), // Use the dynamic email here
        });

        if (response.ok) {
            alert("You have been notified!");
        } else {
            alert("An error occurred, please try again.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "url('/images/your-image.jpg') no-repeat center center fixed", // Correct image path
                backgroundSize: "cover",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
                color: "#fff",
                padding: "0 20px",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    maxWidth: "600px",
                    margin: "auto",
                    padding: "20px",
                    backdropFilter: "blur(10px)",
                    width: "100%", // Ensuring it takes up full width on smaller screens
                }}
            >
                <h1
                    style={{
                        fontSize: "5vw", // Responsive font size
                        fontWeight: "bold",
                        marginBottom: "20px",
                        textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    Coming Soon
                </h1>

                <h3
                    style={{
                        marginBottom: "20px",
                        textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        color: "black",
                    }}
                >
                    Something amazing is on the way
                </h3>

                <Card
                    style={{
                        background: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "15px",
                        padding: "20px",
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(15px)",
                        width: "100%", // Ensure the card adapts to different screen sizes
                        maxWidth: "600px", // Limit the maximum width
                    }}
                >
                    <h3
                        style={{
                            marginBottom: "20px",
                            color: "#FF5733",
                            textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        Update will be available in
                    </h3>

                    <h2
                        style={{
                            fontSize: "5vw", // Responsive font size
                            fontWeight: "bold",
                            color: "#FFD700",
                            textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {countdown > 0 ? `${countdown} seconds` : "Launching Soon!"}
                    </h2>

                    <Spacer y={2} />

                    {showMessage && (
                        <p
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "#fff",
                                padding: "10px",
                                borderRadius: "10px",
                                textShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            Premium Code Update Complete! We will notify you soon.
                        </p>
                    )}

                    <Spacer y={2} />

                </Card>
            </motion.div>
        </div>
    );
};

export default ComingSoonPage;
