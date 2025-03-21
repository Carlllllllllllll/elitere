document.addEventListener('DOMContentLoaded', () =>
    {
        const submitreportdata = document.getElementById('submit-report');
    
        submitreportdata.addEventListener('click', async (event) =>
        {
            event.preventDefault();
    
            const now = Date.now();
    
            const firstNameValue = document.getElementById("report-first-name").value.trim();
            const lastNameValue = document.getElementById("report-last-name").value.trim();
            const emailValue = document.getElementById("report-email").value.trim();
            const descriptionValue = document.getElementById("report-description").value.trim();
            const phone1Value = document.getElementById("report-phone1").value.trim();
            const phone2Value = document.getElementById("report-phone2") ? document.getElementById("report-phone2").value.trim() : '';
    
            const validateForm4 = () =>
            {
                if(!firstNameValue)
                {
                    showNotification("Missing Information", "First Name is missing.");
                    return false;
                }
    
                if(!lastNameValue)
                {
                    showNotification("Missing Information", "Last Name is missing.");
                    return false;
                }
    
                if(!emailValue)
                {
                    showNotification("Missing Information", "Email is missing.");
                    return false;
                }
    
                if(!descriptionValue)
                {
                    showNotification("Missing Information", "Description is missing.");
                    return false;
                }
    
                if(!phone1Value)
                {
                    showNotification("Missing Information", "Phone Number 1 is missing.");
                    return false;
                }
    
                if(firstNameValue.split(' ').length > 2)
                {
                    showNotification("Invalid Name", "Please type your first name correctly.");
                    return false;
                }
                if(lastNameValue.split(' ').length > 2)
                {
                    showNotification("Invalid Name", "Please type your last name correctly.");
                    return false;
                }
    
                const phoneRegex = /^(010|011|012|015)\d{8}$/;
                if(!phoneRegex.test(phone1Value))
                {
                    showNotification("Invalid Phone", "Phone number is incorrect.");
                    return false;
                }
    
                if (phone2Value) {
                    if (!phoneRegex.test(phone2Value)) {
                        showNotification("Invalid Phone", "Phone Number 2 is incorrect.");
                        return false;
                    }
            
                    if (phone1Value === phone2Value) {
                        showNotification("Invalid Phone", "Phone Number 2 cannot be the same as Phone Number 1.");
                        return false;
                    }
                }
            
    
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(emailValue))
                {
                    showNotification("Invalid Email", "Please enter a valid email address.");
                    return false;
                }
    
                return true;
            };
    
            if(!validateForm4()) return;
    
            const formData = {
                firstName: firstNameValue,
                lastName: lastNameValue,
                email: emailValue,
                phone1: phone1Value,
                phone2: phone2Value,
                description: descriptionValue,
            };
    
            try
            {
                const response = await fetch('https://elitere.ooguy.com/api/reports',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData),
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
                    localStorage.setItem('lastReportTime', now);
                    Swal.fire(
                    {
                        text: 'Your report has been successfully received. We will respond within 48 hours.',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        background: '#121212',
                        color: '#ffffff',
                        confirmButtonColor: '#000000',
                        customClass:
                        {
                            popup: 'swal-visible',
                            confirmButton: 'swal-button',
                        },
                    });
                    document.getElementById("report-first-name").value = '';
                    document.getElementById("report-last-name").value = '';
                    document.getElementById("report-email").value = '';
                    document.getElementById("report-phone1").value = '';
                    document.getElementById("report-phone2").value = '';
                    document.getElementById("report-description").value = '';
    
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
                            confirmButton: 'swal-button',
                        },
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
                        confirmButton: 'swal-button',
                    },
                });
            }
        });
    });