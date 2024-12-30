import React from "react";

const ComingSoonPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.leftContent}>
                    <h1 style={styles.title}>Coming Soon!</h1>
                    <h2 style={styles.subTitle}>
                        Our new feature is being built. Stay tuned for updates!
                    </h2>
                    <p style={styles.message}>
                        We're working on a big update that will allow users to receive their 4-digit PIN soon.
                    </p>
                    <div style={styles.footer}>
                        <p style={styles.footerText}>We appreciate your patience!</p>
                    </div>
                </div>
                <div style={styles.rightContent}>
                    <div style={styles.imageWrapper}>
                        <img
                            src="https://via.placeholder.com/500x500"
                            alt="Under construction"
                            style={styles.image}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6e7fdb, #4a5a92)",
        padding: "0 20px",
        boxSizing: "border-box",
        color: "#fff",
    },
    contentWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        padding: "40px",
        borderRadius: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 5px 30px rgba(0, 0, 0, 0.2)",
    },
    leftContent: {
        flex: 1,
        textAlign: "left",
    },
    rightContent: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: "50px",
        fontWeight: "bold",
        letterSpacing: "3px",
        textTransform: "uppercase",
        marginBottom: "20px",
        animation: "fadeIn 1s ease-out",
    },
    subTitle: {
        fontSize: "26px",
        fontWeight: "400",
        marginBottom: "15px",
        fontFamily: "'Roboto', sans-serif",
    },
    message: {
        fontSize: "18px",
        lineHeight: "1.6",
        color: "#d1d1d1",
        maxWidth: "400px",
        marginBottom: "30px",
        fontFamily: "'Arial', sans-serif",
    },
    footer: {
        borderTop: "2px solid #fff",
        paddingTop: "15px",
    },
    footerText: {
        fontSize: "14px",
        color: "#e1e1e1",
        fontStyle: "italic",
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "400px",
        height: "auto",
        borderRadius: "10px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease",
    },
    // Add hover effect on image
    "@media (hover: hover)": {
        image: {
            ":hover": {
                transform: "scale(1.05)",
            },
        },
    },
    // Responsive design for medium screens
    "@media (max-width: 768px)": {
        contentWrapper: {
            flexDirection: "column",
            padding: "30px 20px",
        },
        leftContent: {
            textAlign: "center",
            marginBottom: "30px",
        },
        rightContent: {
            marginTop: "30px",
        },
        title: {
            fontSize: "40px",
        },
        subTitle: {
            fontSize: "22px",
        },
        message: {
            fontSize: "16px",
        },
        footerText: {
            fontSize: "12px",
        },
    },
    // Responsive design for small screens
    "@media (max-width: 480px)": {
        title: {
            fontSize: "32px",
        },
        subTitle: {
            fontSize: "20px",
        },
        message: {
            fontSize: "14px",
        },
        footerText: {
            fontSize: "10px",
        },
        image: {
            width: "80%",
        },
    },
};

export default ComingSoonPage;
