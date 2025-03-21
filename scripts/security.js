let requestCounter = 0;
setInterval(() => requestCounter = 0, 1000);

document.addEventListener("mousemove", () => requestCounter++);
document.addEventListener("keydown", () => requestCounter++);

setInterval(() => {
    if (requestCounter > 20) { 
        console.warn("🚫 Possible bot/DDoS attack detected!");
        blockUser("DDoS Attempt Detected");
    }
}, 1000);

function sanitizeInput(input) {
    const blacklistedPatterns = [/script/i, /<[^>]+>/, /union.*select/i, /drop.*table/i, /exec/i, /' or '/i];
    for (let pattern of blacklistedPatterns) {
        if (pattern.test(input)) {
            console.error("🚫 Malicious activity detected: " + input);
            blockUser("SQL Injection / XSS Attempt");
            return false;
        }
    }
    return true;
}

document.addEventListener("input", (event) => {
    if (!sanitizeInput(event.target.value)) {
        console.log("%cBlocked Malicious Input: " + event.target.value, "color: orange; font-weight: bold;");
        event.target.value = ""; 
    }
});


setTimeout(() => {
    if (!navigator.webdriver && navigator.userAgent) {
        console.log("%c✅ Browser Passed Security Check", "color: green;");
    } else {
        console.error("🚫 Headless Browser Detected! Blocking user.");
        blockUser("Headless Browser / Bot Detected");
    }
}, 1000);




function blockUser(reason) {
    console.error(`🚨 User Blocked! Reason: ${reason}`);
    document.body.innerHTML = "<h1>🚫 Access Denied</h1>";
}