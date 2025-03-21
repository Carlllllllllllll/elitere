document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector(".popup-modal");
    const overlay = document.querySelector(".popup-overlay");
    const acceptBtn = document.querySelector(".popup-accept");
    const declineBtn = document.querySelector(".popup-decline");

    const POLICY_KEY = "acceptedPolicy";
    const LAST_ACCEPTED_KEY = "lastAcceptedDate";
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000; 

    const lastAccepted = localStorage.getItem(LAST_ACCEPTED_KEY);
    const now = Date.now();


    if (lastAccepted && now - Number(lastAccepted) < ONE_WEEK) {
        popup.style.display = "none";
        overlay.style.display = "none";
        document.body.style.overflow = "auto"; 
    } else {
        localStorage.removeItem(POLICY_KEY);
        localStorage.removeItem(LAST_ACCEPTED_KEY);
        popup.style.display = "block";
        overlay.style.display = "block";
        document.body.style.overflow = "hidden"; 
    }


    acceptBtn.addEventListener("click", () => {
        localStorage.setItem(POLICY_KEY, "true");
        localStorage.setItem(LAST_ACCEPTED_KEY, now.toString());
        popup.style.display = "none";
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
    });

    declineBtn.addEventListener("click", () => {
        alert("You must accept the policy to continue.");
    });

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (target.id === "privacypolicyLink") {
            event.preventDefault();
            showSection("privacyPolicySection");
        }

        if (target.id === "shippingpolicyLink") {
            event.preventDefault();
            showSection("shippingPolicySection");
        }
    });
});
