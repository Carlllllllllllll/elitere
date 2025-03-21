function showSection(sectionId) {
    document.getElementById("cartModal").style.display = "none";
    document.getElementById("checkoutModal").style.display = "none";
    document.getElementById("orderModal").style.display = "none";
    document.getElementById("welcomeContainer").style.display = "none";
    document.getElementById("privacyPolicySection").style.display = "none";
    document.getElementById("shippingPolicySection").style.display = "none";
    document.getElementById("aboutUsSection").style.display = "none";
    document.getElementById("productContainer").style.display = "none";

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = "block";
    }
}