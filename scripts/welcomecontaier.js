const text = "Welcome to Elitère Store";
const typingElement = document.querySelector(".typing");
let index = 0;

function type() {
	if (index < text.length) {
		let char = text[index];
		
		let temp = typingElement.innerHTML + char;
		typingElement.innerHTML = temp;
		let containerWidth = typingElement.parentElement.clientWidth;
		let textWidth = typingElement.scrollWidth;

		if (textWidth > containerWidth) {
			let words = temp.split(" ");
			if (words.length > 1) {
				words[words.length - 2] += "<br>"; 
			}
			typingElement.innerHTML = words.join(" ");
		}

		index++;
		setTimeout(type, Math.random() * 150 + 50); 
	} else {
		typingElement.style.borderRight = "none"; 
	}
}

type();

const welcomeContainer = document.getElementById("welcomeContainer");
document.querySelectorAll('[data-category]').forEach(item => {
         item.addEventListener("click", () => {
                  if (welcomeContainer) {
                           welcomeContainer.style.opacity = "0"; 
                           setTimeout(() => {
                                    welcomeContainer.style.display = "none"; 
                           }, 500); 
                  } else {
                           console.error("welcomeContainer not found!");
                  }
         });
});   