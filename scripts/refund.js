const refundModal = document.getElementById("refundModal");
const refundButton = document.getElementById("refundButton");
const closerefundModal = document.getElementById("closerefundModal");

refundButton.addEventListener("click", () =>
{
	refundModal.classList.remove("hidden");
	refundModal.style.display = "flex";
});

closerefundModal.addEventListener("click", () =>
{
	refundModal.classList.add("hidden");
	refundModal.style.display = "none";
});

window.addEventListener("click", (event) =>
{
	if(event.target === refundModal)
	{
		refundModal.classList.add("hidden");
		refundModal.style.display = "none";
	}
});

window.addEventListener("keydown", (event) =>
{
	if(event.key === "Escape")
	{
		refundModal.classList.add("hidden");
		refundModal.style.display = "none";
	}
});

document.addEventListener('DOMContentLoaded', () =>
{
	const submitrefund = document.getElementById('submit-refund');
	const refundModal = document.getElementById('refundModal');

	submitrefund.addEventListener('click', async (event) =>
	{
		event.preventDefault();

		const refundfirstnameValue = document.getElementById("refund-first-name").value.trim();
		const refundlastnameValue = document.getElementById("refund-last-name").value.trim();
		const RefundemailValue = document.getElementById("refund-email").value.trim();
		const refundphone1Value = document.getElementById("refund-phone1").value.trim();
		const refundphone2Value = document.getElementById("refund-phone2").value.trim();
		const refunddateValue = document.getElementById("refund-date").value.trim();
		const refundorderIDValue = document.getElementById("refund-orderID").value.trim();
		const refunditemValue = document.getElementById("refund-item").value.trim();
		const refundwhyValue = document.getElementById("refund-why").value.trim();

		const now = Date.now();

		const validateForm3 = () =>
		{
			const refundFirstNameValue = document.getElementById("refund-first-name").value.trim();
			const refundLastNameValue = document.getElementById("refund-last-name").value.trim();
			const refundEmailValue = document.getElementById("refund-email").value.trim();
			const refundPhone1Value = document.getElementById("refund-phone1").value.trim();
			const refundPhone2Value = document.getElementById("refund-phone2") ? document.getElementById("refund-phone2").value.trim() : "";
			const refundDateValue = document.getElementById("refund-date").value.trim();
			const refundOrderIDValue = document.getElementById("refund-orderID").value.trim();
			const refundItemValue = document.getElementById("refund-item").value.trim();
			const refundWhyValue = document.getElementById("refund-why").value.trim();

			if(!refundFirstNameValue)
			{
				showNotification("Missing Information", "First Name is missing.");
				return false;
			}

			if(!refundLastNameValue)
			{
				showNotification("Missing Information", "Last Name is missing.");
				return false;
			}

			if(!refundEmailValue)
			{
				showNotification("Missing Information", "Email is missing.");
				return false;
			}

			if(!refundPhone1Value)
			{
				showNotification("Missing Information", "Phone Number 1 is missing.");
				return false;
			}

			if(!refundItemValue)
			{
				showNotification("Missing Information", "Refund Item is missing.");
				return false;
			}

			if(!refundWhyValue)
			{
				showNotification("Missing Information", "Refund Reason is missing.");
				return false;
			}

			if(!refundDateValue)
				{
					showNotification("Missing Information", "Order Date is missing.");
					return false;
				}


				if(!refundOrderIDValue)
					{
						showNotification("Missing Information", "Order ID is missing.");
						return false;
					}

			if(refundFirstNameValue.split(' ').length > 2)
			{
				showNotification("Invalid Name", "Please type your first name correctly.");
				return false;
			}

			if(refundLastNameValue.split(' ').length > 2)
			{
				showNotification("Invalid Name", "Please type your last name correctly.");
				return false;
			}

			const phoneRegex = /^(010|011|012|015)\d{8}$/;
			if(!phoneRegex.test(refundPhone1Value))
			{
				showNotification("Invalid Phone", "Phone number 1 is incorrect.");
				return false;
			}

			if (refundPhone2Value) {
				if (!phoneRegex.test(refundPhone2Value)) {
					showNotification("Invalid Phone", "Phone Number 2 is incorrect.");
					return false;
				}
		
				if (refundPhone1Value === refundPhone2Value) {
					showNotification("Invalid Phone", "Phone Number 2 cannot be the same as Phone Number 1.");
					return false;
				}
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if(!emailRegex.test(refundEmailValue))
			{
				showNotification("Invalid Email", "Please enter a valid email address.");
				return false;
			}

			return true;
		};

		if(!validateForm3()) return;

		const formData = {
			firstName: refundfirstnameValue,
			lastName: refundlastnameValue,
			email: RefundemailValue,
			phone1: refundphone1Value,
			phone2: refundphone2Value,
			date: refunddateValue,
			orderID: refundorderIDValue,
			item: refunditemValue,
			reason: refundwhyValue
		};

		try
		{
			const response = await fetch('https://elitere.ooguy.com/api/refunds',
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

			if (response.status === 400) {
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
				Swal.fire(
				{
					text: 'Refund request received! Our team will review it and get back to you within 48 hours',
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

				document.getElementById("refund-first-name").value = '';
				document.getElementById("refund-last-name").value = '';
				document.getElementById("refund-email").value = '';
				document.getElementById("refund-phone1").value = '';
				document.getElementById("refund-phone2").value = '';
				document.getElementById("refund-date").value = '';
				document.getElementById("refund-orderID").value = '';
				document.getElementById("refund-item").value = '';
				document.getElementById("refund-why").value = '';
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