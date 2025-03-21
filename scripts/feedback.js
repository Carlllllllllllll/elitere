const feedbackModal = document.getElementById("feedbackModal");
const feedbackButton = document.getElementById("feedbackButton");
const closefeedbackModal = document.getElementById("closeFeedbackModal");

feedbackButton.addEventListener("click", () =>
{
	feedbackModal.classList.remove("hidden");
	feedbackModal.style.display = "flex";
});

closefeedbackModal.addEventListener("click", () =>
{
	feedbackModal.classList.add("hidden");
	feedbackModal.style.display = "none";
});

window.addEventListener("click", (event) =>
{
	if(event.target === feedbackModal)
	{
		feedbackModal.classList.add("hidden");
		feedbackModal.style.display = "none";
	}
});

window.addEventListener("keydown", (event) =>
{
	if(event.key === "Escape")
	{
		feedbackModal.classList.add("hidden");
		feedbackModal.style.display = "none";
	}
});

document.addEventListener('DOMContentLoaded', () =>
{
	const feedbacksubmit = document.getElementById('feedback-submit');
	const feedbackModal = document.getElementById('feedbackModal');

	feedbacksubmit.addEventListener('click', async (event) =>
	{
		event.preventDefault();

		const fdescriptionValue = document.getElementById("fdescription").value.trim();

		const now = Date.now();

		if(!validateForm1()) return;

		const formData = {
			fdescription: fdescriptionValue,
		};

		try
		{
			const response = await fetch('https://elitere.ooguy.com/api/feedback',
			{
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

if (response.status === 401 && data.message) {
            Swal.fire({
                text: data.message,
                icon: 'warning',
                confirmButtonText: 'Ok',
                background: '#121212',
                color: '#ffffff',
                confirmButtonColor: '#000000',
                customClass: {
                    popup: 'swal-visible',
                    confirmButton: 'swal-button'
                }
            });
            return;
        }

						if (response.status === 429) {
                Swal.fire({
                    text: 'You are on cooldown. Please try again later.',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    background: '#121212',
                    color: '#ffffff',
                    confirmButtonColor: '#000000',
                    customClass: {
                        popup: 'swal-visible',
                        confirmButton: 'swal-button'
                    }
                });
                return;
            }

			if(response.ok)
			{
				localStorage.setItem('lastFeedbackTime', now);
				Swal.fire(
				{
					text: 'Your Feedback has been successfully received, Thank You!',
					icon: 'success',
					confirmButtonText: 'Ok',
					background: '#121212',
					color: '#ffffff',
					confirmButtonColor: '#000000',
					customClass:
					{
						popup: 'swal-visible',
						confirmButton: 'swal-button'
					}
				});
				document.getElementById("fdescription").value = '';
			}
			else
			{
				Swal.fire(
				{
					text: 'Oops! Something went wrong. Please try again later.',
					icon: 'error',
					confirmButtonText: 'Ok',
					background: '#121212',
					color: '#ffffff',
					confirmButtonColor: '#000000',
					customClass:
					{
						popup: 'swal-visible',
						confirmButton: 'swal-button'
					}
				});
			}
		}
		catch (error)
		{
			console.error('Error:', error);
			Swal.fire(
			{
				text: 'Oops! Something went wrong. Please try again later.',
				icon: 'error',
				confirmButtonText: 'Ok',
				background: '#121212',
				color: '#ffffff',
				confirmButtonColor: '#000000',
				customClass:
				{
					popup: 'swal-visible',
					confirmButton: 'swal-button'
				}
			});
		}
	});
});

const validateForm1 = () =>
{
	const fdescription = document.getElementById("fdescription").value.trim();

	if(!fdescription)
	{
		showNotification("Missing Information", "Description is missing.");
		return false;
	}

	return true;
};