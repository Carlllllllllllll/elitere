function adjustFooter()
{
	const footer = document.querySelector(".footer");
	const content = document.querySelector(".content");

}

window.addEventListener("load", adjustFooter);
window.addEventListener("resize", adjustFooter);

window.addEventListener("load", adjustFooter);
window.addEventListener("resize", adjustFooter);

document.addEventListener("DOMContentLoaded", function()
{
	document.querySelector("footer").addEventListener("click", function(event)
	{
		const target = event.target;

		if(target.id === "privacypolicyLink")
		{
			event.preventDefault();
			showSection("privacyPolicySection");
		}

		if(target.id === "shippingpolicyLink")
		{
			event.preventDefault();
			showSection("shippingPolicySection");
		}
	});

	function showSection(sectionId)
	{
		document.getElementById("cartModal").style.display = "none";
		document.getElementById("checkoutModal").style.display = "none";
		document.getElementById("orderModal").style.display = "none";
		document.getElementById("welcomeContainer").style.display = "none";
		document.getElementById("privacyPolicySection").style.display = "none";
		document.getElementById("shippingPolicySection").style.display = "none";
		document.getElementById("aboutUsSection").style.display = "none";
		document.getElementById("productContainer").style.display = "none";

		const section = document.getElementById(sectionId);
		if(section)
		{
			section.style.display = "block";
		}
	}
});
