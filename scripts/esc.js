window.addEventListener("keydown", (event) =>
    {
        if(event.key === "Escape")
        {
            closeAllModals();
        }
    });
    
    window.addEventListener("keydown", (event) =>
    {
        if(event.key === "Escape")
        {
            if(modal.style.display === "flex") modal.style.display = "none";
            if(document.getElementById("cartModal").style.display === "block") document.getElementById("cartModal").style.display = "none";
            if(document.getElementById("checkoutModal").style.display === "flex") document.getElementById("checkoutModal").style.display = "none";
            if(document.getElementById("orderModal").style.display === "flex") document.getElementById("orderModal").style.display = "none";
        }
    });

    const reportModal = document.getElementById("reportModal");
const reportButton = document.getElementById("reportButton");
const closeReportModal = document.getElementById("closeReportModal");

reportButton.addEventListener("click", () =>
{
	reportModal.classList.remove("hidden");
	reportModal.style.display = "flex";
});

closeReportModal.addEventListener("click", () =>
{
	reportModal.classList.add("hidden");
	reportModal.style.display = "none";
});

window.addEventListener("click", (event) =>
{
	if(event.target === reportModal)
	{
		reportModal.classList.add("hidden");
		reportModal.style.display = "none";
	}
});

window.addEventListener("keydown", (event) =>
{
	if(event.key === "Escape")
	{
		reportModal.classList.add("hidden");
		reportModal.style.display = "none";
	}
});