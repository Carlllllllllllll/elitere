const text = "Welcome to Elitère Store";
const typingElement = document.querySelector(".typing");
let index = 0;

function type() {
    if (index < text.length) {
        typingElement.textContent += text[index];
        index++;
        setTimeout(type, 100);
    }
}
type();

function hideWelcomeScreen() {
    const bg = document.getElementById("welcomeBackground");
    const container = document.getElementById("welcomeContainer");
    
    if (bg && container) {
        bg.style.opacity = "0";
        container.style.opacity = "0";
        
        setTimeout(() => {
            bg.style.display = "none";
            container.style.display = "none";
        }, 500);
    }
}


document.querySelectorAll('[data-category]').forEach(item => {
    item.addEventListener("click", hideWelcomeScreen);
});


const specialLinks = ["aboutUsLink", "privacypolicyLink", "shippingpolicyLink"];

document.addEventListener("click", function(event) {
    const target = event.target;
    

    const isSpecialLink = specialLinks.some(id => 
        target.id === id || target.closest(`#${id}`)
    );
    
    if (isSpecialLink) {
        event.preventDefault();
        hideWelcomeScreen();
        
        const sectionMap = {
            aboutUsLink: "aboutUsSection",
            privacypolicyLink: "privacyPolicySection",
            shippingpolicyLink: "shippingPolicySection"
        };
        
        const sectionId = sectionMap[target.id] || sectionMap[target.closest("a").id];
        if (sectionId) {
            document.getElementById(sectionId).style.display = "block";
        }
    }
});