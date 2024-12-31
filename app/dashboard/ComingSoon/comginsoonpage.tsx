import React from "react";

// Define the type for styles
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6e7fdb, #4a5a92)",
        padding: "0 20px",
        boxSizing: "border-box",
        color: "#fff",
        borderRadius: "20px", // Keep rounded corners if desired
        flexDirection: "column", // Ensure it's flexible on mobile
    },
    contentWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        maxWidth: "100%",
        width: "100%",
        margin: "0 auto",
        padding: "40px",
        borderRadius: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 5px 30px rgba(0, 0, 0, 0.2)",
        flexWrap: "wrap", // Allow content to wrap
    },
    leftContent: {
        flex: 1,
        textAlign: "left",
        paddingRight: "20px",
        marginBottom: "20px", // Ensure space for mobile
    },
    rightContent: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px", // Adjust space for mobile
    },
    title: {
        fontSize: "50px",
        fontWeight: "bold",
        letterSpacing: "3px",
        textTransform: "uppercase",
        marginBottom: "20px",
    },
    subTitle: {
        fontSize: "26px",
        fontWeight: "400",
        marginBottom: "15px",
    },
    message: {
        fontSize: "18px",
        lineHeight: "1.6",
        color: "#d1d1d1",
        maxWidth: "400px",
        marginBottom: "30px",
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
    },
};

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
                    
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
