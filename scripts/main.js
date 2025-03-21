const products = {
	Hats: [
	{
		name: "Stylish Hat",
		images: ["hat1.png", "hat2.jpg", "hat3.jpg"],
		price: "500EGP",
		stock: "In Stock",
		sizes: ["S", "M", "L"],
		colors: ["red", "blue", "green"],
		description: "A stylish hat perfect for any occasion."
	},
	{
		name: "Limited Edition Hat",
		images: ["hat4.jpg", "hat5.jpg", "hat6.jpg"],
		price: "1000EGP",
		stock: "In Stock",
		description: "Limited edition hat, currently unavailable."
	},
	{
		name: "Classic Hat",
		images: ["hat7.jpg", "hat8.jpg", "hat9.jpg"],
		price: "28EGP",
		stock: "In Stock",
		sizes: ["M", "L"],
		colors: ["black", "white"],
		description: "A classic hat for any outfit."
	}]
};

const shippingFees = {
    "Cairo": 50,          
    "Giza": 45,           
    "Alexandria": 50,     
    "South Sinai": 60,    
    "Red Sea": 55,        
    "Luxor": 50,          
    "Aswan": 55,          
    "Sharqia": 40,        
    "Dakahlia": 45,       
    "Beheira": 40,        
    "Minya": 50,          
    "Suez": 45,           
    "Ismailia": 40,       
    "Port Said": 35,      
    "Qalyubia": 30,       
    "Sohag": 45,          
    "Beni Suef": 40,      
    "Fayoum": 45,         
    "Qena": 50,           
    "Assiut": 55          
};

const calculateShippingFee = () => {
    const selectedLocation = document.getElementById("location").value;
    return shippingFees[selectedLocation] || 0; 
};

const productContainer = document.getElementById("productContainer");
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalPrice = document.getElementById("modalPrice");
const modalStock = document.getElementById("modalStock");
const modalSizes = document.getElementById("modalSizes");
const modalColors = document.getElementById("modalColors");
const modalDescription = document.getElementById("modalDescription");
const imageDots = document.getElementById("imageDots");
const prevButton = document.getElementById("prevImage");
const nextButton = document.getElementById("nextImage");
const closeModalButton = document.getElementById("closeModal");
const showNotification = (title, message, icon = "warning") =>
{
	Swal.fire(
	{
		text: message,
		icon: icon,
		timer: 3000,
		showConfirmButton: false,
		toast: true,
		position: "top-end",
		customClass:
		{
			popup: 'swal-custom'
		}
	});

};

const showNotification2 = (title, message, icon = "success") =>
{
	Swal.fire(
	{
		text: message,
		icon: icon,
		timer: 1000,
		showConfirmButton: false,
		toast: true,
		position: "top-end",
		customClass:
		{
			popup: 'swal-custom'
		}
	});

};

document.querySelectorAll("#sidebar a").forEach((link) =>
{
	link.addEventListener("click", (event) =>
	{
		event.preventDefault();
		const category = event.target.getAttribute("data-category");

		document.getElementById("aboutUsSection").style.display = "none";
		document.getElementById("privacyPolicySection").style.display = "none";
		document.getElementById("privacyPolicySection").style.display = "none";
		document.getElementById("shippingPolicySection").style.display = "none";

		productContainer.innerHTML = "";
		productContainer.style.display = "flex";
		if(products[category])
		{
			products[category].forEach((product) =>
			{
				const box = document.createElement("div");
				box.classList.add("product-box");

				const name = document.createElement("div");
				name.classList.add("product-name");
				name.textContent = product.name;
				name.addEventListener("click", (event) => {
					event.stopPropagation();
					openModal(product);
				});

				const img = document.createElement("img");
				img.classList.add("product-image");
				img.src = product.images[0];
				img.addEventListener("click", (event) => {
					event.stopPropagation(); 
					openModal(product);
				});

				const price = document.createElement("div");
				price.classList.add("product-price");
				price.textContent = product.price;
				price.classList.add("product-price");
				price.textContent = product.price;
				price.addEventListener("click", (event) =>
				{
					event.stopPropagation();
					openModal(product);
				});

				const stock = document.createElement("div");
				stock.classList.add(product.stock === "In Stock" ? "product-stock" : "out-of-stock");
				stock.textContent = product.stock;
				stock.addEventListener("click", (event) => {
					event.stopPropagation(); 
					openModal(product);
				});
				if(product.stock === "Out of Stock") stock.style.color = "red";

				box.appendChild(img);
				box.appendChild(name);
				box.appendChild(price);
				box.appendChild(stock);
				productContainer.appendChild(box);

				box.addEventListener("click", () => openModal(product));
			});

		}
	});
});

const modalName = document.getElementById("modalName");

const openModal = (product) =>
{
	closeAllModals();
	modalImage.src = product.images[0];
	modalName.textContent = product.name;
	modalPrice.textContent = product.price;
	modalStock.textContent = product.stock;
	modalStock.style.color = product.stock === "Out of Stock" ? "red" : "green";

	const sizeSelect = document.getElementById("sizeSelect");
	sizeSelect.innerHTML = "";
	product.sizes?.forEach(size =>
	{
		let option = document.createElement("option");
		option.value = size;
		option.textContent = size;
		sizeSelect.appendChild(option);
	});

	const colorSelect = document.getElementById("colorSelect");
	colorSelect.innerHTML = "";
	product.colors?.forEach(color =>
	{
		let option = document.createElement("option");
		option.value = color;
		option.textContent = color;
		colorSelect.appendChild(option);
	});

	modal.style.display = "flex";

	let currentIndex = 0;
	modalImage.src = product.images[currentIndex];
	modalStock.textContent = product.stock;
	modalStock.style.color = product.stock === "Out of Stock" ? "red" : "rgba(0, 255, 0, 0.7)";
	modalDescription.innerHTML = "";

	if(product.stock === "In Stock")
	{
		const descWrapper = document.createElement("div");
		descWrapper.classList.add("description-wrapper");

		const descLabel = document.createElement("strong");
		descLabel.textContent = "Product Description:";
		descLabel.classList.add("desc-title");

		const descText = document.createElement("span");
		descText.textContent = product.description;
		descText.classList.add("desc-text");

		descWrapper.appendChild(descLabel);
		descWrapper.appendChild(document.createElement("br"));
		descWrapper.appendChild(descText);

		modalDescription.appendChild(descWrapper);
	}

	modalSizes.innerHTML = "";
	modalColors.innerHTML = "";
	imageDots.innerHTML = "";

	if(product.stock === "In Stock")
	{
		if(product.sizes?.length)
		{
			const sizeLabel = document.createElement("strong");
			sizeLabel.textContent = "Available Sizes:";
			modalSizes.appendChild(sizeLabel);
			modalSizes.appendChild(document.createElement("br"));

			product.sizes.forEach(size =>
			{
				let sizeBox = document.createElement("div");
				sizeBox.classList.add("size-box");
				sizeBox.textContent = size;
				modalSizes.appendChild(sizeBox);
			});
		}

		if(product.colors?.length)
		{
			const colorLabel = document.createElement("strong");
			colorLabel.textContent = "Available Colors:";
			modalColors.appendChild(colorLabel);
			modalColors.appendChild(document.createElement("br"));

			product.colors.forEach(color =>
			{
				let colorCircle = document.createElement("div");
				colorCircle.classList.add("color-circle");
				colorCircle.style.backgroundColor = color;
				modalColors.appendChild(colorCircle);
			});
		}
	}

	product.images.forEach((_, index) =>
	{
		let dot = document.createElement("span");
		dot.classList.add("dot");
		if(index === currentIndex) dot.classList.add("active");
		imageDots.appendChild(dot);
	});

	const updateModalImage = () =>
	{
		modalImage.src = product.images[currentIndex];
		document.querySelectorAll(".dot").forEach((dot, idx) =>
		{
			dot.classList.toggle("active", idx === currentIndex);
		});
	};

	prevButton.onclick = () =>
	{
		currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
		updateModalImage();
	};

	nextButton.onclick = () =>
	{
		currentIndex = (currentIndex + 1) % product.images.length;
		updateModalImage();
	};

	modal.style.display = "flex";
};

closeModalButton.onclick = () => closeAllModals();
window.onkeydown = (event) =>
{
	if(event.key === "Escape") modal.style.display = "none";
};

const cart = JSON.parse(localStorage.getItem("cart")) || [];

document.getElementById("addToCartBtn").addEventListener("click", () =>
{
	const size = document.getElementById("sizeSelect").value;
	const color = document.getElementById("colorSelect").value;
	let quantity = parseInt(document.getElementById("quantityInput").value, 10);

	if(!size || !color || quantity <= 0)
	{
		showNotification("Something is missing", "Please select size, color, and quantity");
		return;
	}

	if(quantity > 5)
	{
		showNotification("Limit Reached", "You can only add a maximum of 5 per product.");
		return;
	}

	let found = cart.find(item => item.image === modalImage.src && item.size === size && item.color === color);

	if(found)
	{
		if(found.quantity + quantity > 5)
		{
			showNotification("Limit Reached", "You can only add a maximum of 5 per product.");
			return;
		}
		else
		{
			found.quantity += quantity;
		}
	}
	else
	{
		cart.push(
		{
			image: modalImage.src,
			name: modalName.textContent || "Unknown Product",
			price: modalPrice.textContent,
			size,
			color,
			quantity
		});
	}

	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartCount();
	showNotification2("success", "Added to cart!");
});

const updateCartCount = () =>
{
	const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
	const cartCount = document.getElementById("cartCount");
	cartCount.textContent = totalItems;
	cartCount.style.display = totalItems > 0 ? "block" : "none";
};

document.addEventListener("DOMContentLoaded", updateCartCount);

document.getElementById("cartIcon").addEventListener("click", () =>
{
	displayCart();
});

const displayCart = () =>
{
	let cartHTML = `<div class="cart-header">
                      <h2>Your Cart</h2>
                      <button id="closeCartModal" class="close-btn">&times;</button>
                  </div>`;

	let totalPrice = 0;

	const updatedCart = cart.filter(item =>
	{
		const product = products.Hats.find(p => p.name === item.name);
		return product && product.stock === "In Stock"; 
	});

	if(updatedCart.length !== cart.length)
	{
		localStorage.setItem("cart", JSON.stringify(updatedCart));
		cart.length = 0; 
		updatedCart.forEach(item => cart.push(item)); 
	}

	updateCartCount();

	if(updatedCart.length === 0)
	{
		cartHTML += "<p class='empty-cart'>Your cart is empty.</p>";
	}
	else
	{
		updatedCart.forEach((item, index) =>
		{
			const product = products.Hats.find(p => p.name === item.name);
			let currentPrice = product ? parseFloat(product.price.replace('EGP', '').trim()) : 0;

			if(currentPrice !== parseFloat(item.price.replace('EGP', '').trim()))
			{
				item.price = `${currentPrice}EGP`; 
			}

			const itemTotal = currentPrice * item.quantity;
			totalPrice += itemTotal;

			cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" class="cart-img">
                    <div class="cart-info">
                        <strong>${item.name}</strong>
                        <div class="cart-row"><strong>Price:</strong> <span class="item-total">${item.price}</span></div>
                        <div class="cart-row"><strong>Size:</strong> <div class="size-box">${item.size}</div></div>
                        <div class="cart-row"><strong>Color:</strong> <div class="color-circle" style="background-color: ${item.color};"></div></div>
                        <div class="cart-row">
                            <strong>Quantity:</strong> 
                            <div class="quantity-control">
                                <button onclick="updateQuantity(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `;
		});

		cartHTML += `<div class="cart-total">
                    <strong>Total Price:</strong> <span id="totalCartPrice">${totalPrice.toFixed(2)}EGP</span>
                  </div>`;
		cartHTML += `<button id="checkoutBtn" class="checkout-btn">Proceed to Checkout</button>`;
	}

	document.getElementById("cartModal").innerHTML = cartHTML;
	document.getElementById("cartModal").style.display = "block";

	document.getElementById("closeCartModal").addEventListener("click", () =>
	{
		document.getElementById("cartModal").style.display = "none";
	});

	const checkoutBtn = document.getElementById("checkoutBtn");
	if(checkoutBtn)
	{
		checkoutBtn.addEventListener("click", () =>
		{
			document.getElementById("cartModal").style.display = "none";
			openCheckoutModal();
		});
	}
};
const updateQuantity = (index, change) =>
{
	if(cart[index].quantity + change > 5)
	{
		showNotification("Limit Reached", "You can only add a maximum of 5 per product.");
		cart[index].quantity = 5;
	}
	else if(cart[index].quantity + change > 0)
	{
		cart[index].quantity += change;
	}
	else
	{
		cart.splice(index, 1);
	}

	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartCount();
	displayCart();
};

const openCheckoutModal = () =>
{
	closeAllModals();
	displayCartItemsInCheckoutModal();

	const modal = document.getElementById("checkoutModal");
	if(modal)
	{
		modal.style.display = "flex";
		modal.style.position = "fixed";
		modal.style.top = "50%";
		modal.style.left = "50%";
		modal.style.transform = "translate(-50%, -50%)";
		modal.style.zIndex = "9999";
	}
	else
	{
		console.error("checkoutModal not found in the DOM.");
	}
};

const closeAllModals = () =>
{
	modal.style.display = "none";
	document.getElementById("cartModal").style.display = "none";
	document.getElementById("checkoutModal").style.display = "none";
	document.getElementById("orderModal").style.display = "none";
};

const displayCartItemsInCheckoutModal = () =>
{
	const cartItemsDiv = document.getElementById('cart-items');
	cartItemsDiv.innerHTML = '';
	let totalPrice = 0;

	cart.forEach(item =>
	{
		const itemDiv = document.createElement('div');
		itemDiv.textContent = `${item.name} - ${item.price} x ${item.quantity}`;
		cartItemsDiv.appendChild(itemDiv);

		const priceValue = parseFloat(item.price.replace('$', ''));
		totalPrice += priceValue * item.quantity;
	});

	const shippingFee = calculateShippingFee(); 
    const shippingFeeDiv = document.createElement('div');
    shippingFeeDiv.textContent = `Shipping Fee: ${shippingFee}EGP`;
    cartItemsDiv.appendChild(shippingFeeDiv);

	totalPrice += shippingFee;
	const totalPriceDiv = document.getElementById('total-price');
	totalPriceDiv.textContent = `Total Price: ${totalPrice.toFixed(2)}EGP`;
};

document.getElementById("addToCartBtn").addEventListener("click", () =>
{

	updateCartCount();
	displayCartItemsInCheckoutModal();
});

const removeFromCart = (index) =>
{
	cart.splice(index, 1);
	localStorage.setItem("cart", JSON.stringify(cart));
	updateCartCount();
	displayCart();
};

document.addEventListener('DOMContentLoaded', () =>
{
	const submitorderdata = document.getElementById('support-form-submit');
	const firstName = document.getElementById('first-name');
	const lastName = document.getElementById('last-name');
	const email = document.getElementById('email');
	const location = document.getElementById('location');
	const streetName = document.getElementById('street-name');
	const city = document.getElementById('city');
	const phone1 = document.getElementById('phone1');
	const phone2 = document.getElementById('phone2');
	const cartItemsDiv = document.getElementById('cart-items');
	const totalPriceDiv = document.getElementById('total-price');
	const paymentMethod = document.getElementById('payment-method');

	const cart = JSON.parse(localStorage.getItem("cart")) || [];

	const closeCheckoutModalButton = document.getElementById('closeCheckoutModal');
	closeCheckoutModalButton.addEventListener('click', () =>
	{
		document.getElementById("checkoutModal").style.display = "none";
	});

	const displayCartItems = () =>
	{
		cartItemsDiv.innerHTML = '';
		let totalPrice = 0;

		cart.forEach(item =>
		{
			const itemDiv = document.createElement('div');
			itemDiv.textContent = `${item.name} - ${item.price} x ${item.quantity}`;
			cartItemsDiv.appendChild(itemDiv);

			const priceValue = parseFloat(item.price.replace('$', ''));
			totalPrice += priceValue * item.quantity;
		});

		totalPriceDiv.textContent = `Total Price: ${totalPrice.toFixed(2)}EGP`;
	};

	displayCartItems();

	submitorderdata.addEventListener('click', async (event) =>
	{
		event.preventDefault();

		const now = Date.now();

		if(!validateForm()) return;

		const formData = {
			firstName: firstName.value.trim(),
			lastName: lastName.value.trim(),
			email: email.value.trim(),
			location: location.value.trim(),
			streetName: streetName.value.trim(),
			city: city.value.trim(),
			phone1: phone1.value.trim(),
			phone2: phone2.value.trim() || "Not provided",
			cartItems: cart,
			totalPrice: totalPriceDiv.textContent.replace('Total Price: $', ''),
			paymentMethod: paymentMethod.value
		};

		try
		{
			const response = await fetch('https://elitere.ooguy.com/api/orders',
			{
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

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
				if(response.ok)
				{
					localStorage.setItem('LastOrderTime', Date.now());
					document.getElementById("checkoutModal").style.display = "none";
					document.getElementById("orderModalContent").innerHTML = `  
    <div style="text-align: center; font-family: 'Poppins', sans-serif; padding: 20px;">  
        <h2 style="color: #4CAF50; font-size: 28px;">🎉 Order Confirmed! 🎉</h2>  
        <p style="font-size: 16px; color: #555;">✨ Your order has been successfully placed! ✨</p>  
        <p style="font-size: 16px; color: #ff9800; font-weight: bold;">📸 Take a screenshot of this confirmation! You'll need it for refunds and wallet payments. 🔥</p>  

        <div style="background:rgb(0, 0, 0); padding: 15px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin-top: 10px;">  
            <p style="font-size: 18px; font-weight: bold;">🆔 Order ID: <span style="color: #007bff;">${data.orderId}</span></p>  
            <p><strong>👤 Name:</strong> ${formData.firstName} ${formData.lastName}</p>  
            <p><strong>📧 Email:</strong> ${formData.email}</p>  
            <p><strong>📍 Location:</strong> ${formData.location}, ${formData.city}, ${formData.streetName}</p>  
            <p><strong>📞 Phone:</strong> ${formData.phone1} ${formData.phone2 ? ` / ${formData.phone2}` : ""}</p>  
            <p><strong>💳 Payment Method:</strong> ${formData.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💼 Wallet Payment'}</p>  
            <p><strong>💰 Total Price:</strong> <span style="color: #e91e63;">${formData.totalPrice.replace(/[^\d.]/g, '') || ''} EGP</span></p>  
        </div>  

        <p style="margin-top: 10px; color: #ff5722;">📦 We’ll contact you within 48 hours to confirm your order.</p>  

        <button id="closeOrderModal" style="background:rgb(39, 39, 39); color: #fff; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">OK</button>  
    </div>  
`;  

					document.getElementById("orderModal").style.display = "flex";

					document.getElementById("closeOrderModal").addEventListener("click", () =>
					{
						document.getElementById("orderModal").style.display = "none";
						window.location.reload(true);
						localStorage.removeItem("cart");
						clearForm();
						displayCartItems();

					});
				}

				localStorage.removeItem("cart");
				clearForm();
				displayCartItems();
			}
			else
			{
				showNotification("Failed", "Failed to submit order. Please try again later");
			}
		}
		catch (error)
		{
			console.error('Error:', error);
			showNotification("Failed", "Failed to submit order. Please try again later");
		}
	});

	const validateForm = () =>
	{
		const firstNameValue = document.getElementById("first-name").value.trim();
		const lastNameValue = document.getElementById("last-name").value.trim();
		const emailValue = document.getElementById("email").value.trim();
		const locationValue = document.getElementById("location").value.trim();
		const streetValue = document.getElementById("street-name").value.trim();
		const cityValue = document.getElementById("city").value.trim();
		const phone1Value = document.getElementById("phone1").value.trim();
		const paymentMethodValue = document.getElementById("payment-method").value;

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

		if(!locationValue)
		{
			showNotification("Missing Information", "Location is missing.");
			return false;
		}

		if(!streetValue)
		{
			showNotification("Missing Information", "Street Name is missing.");
			return false;
		}

		if(!cityValue)
		{
			showNotification("Missing Information", "City is missing.");
			return false;
		}

		if(!phone1Value)
		{
			showNotification("Missing Information", "Phone Number 1 is missing.");
			return false;
		}

		if (!paymentMethodValue) { 
			showNotification("Missing Information", "Payment Method is required.");
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

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if(!emailRegex.test(emailValue))
		{
			showNotification("Invalid Email", "Please enter a valid email address.");
			return false;
		}

		return true;
	};

	const clearForm = () =>
	{
		firstName.value = '';
		lastName.value = '';
		email.value = '';
		location.value = '';
		streetName.value = '';
		city.value = '';
		phone1.value = '';
		phone2.value = '';
	};
});

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

document.addEventListener('DOMContentLoaded', function()
{
	const sidebar = document.getElementById('sidebar');
	const hamburgerMenu = document.querySelector('.hamburger-menu');
	const categories = document.querySelectorAll('.category-title');

	hamburgerMenu.addEventListener('click', function(event)
	{
		event.stopPropagation();
		sidebar.classList.toggle('show');
		hamburgerMenu.classList.toggle('active');
	});

	document.addEventListener('click', function(event)
	{
		if(!sidebar.contains(event.target) && !hamburgerMenu.contains(event.target))
		{
			sidebar.classList.remove('show');
			hamburgerMenu.classList.remove('active');
		}
	});

	document.addEventListener('keydown', function(event)
	{
		if(event.key === 'Escape')
		{
			sidebar.classList.remove('show');
			hamburgerMenu.classList.remove('active');
		}
	});

	categories.forEach(category =>
	{
		category.addEventListener('click', function(event)
		{
			event.stopPropagation();

			const parent = this.parentElement;
			const submenu = parent.querySelector('.submenu');

			if(submenu.style.display === "flex")
			{
				submenu.style.display = "none";
				parent.classList.remove('open');
			}
			else
			{
				submenu.style.display = "flex";
				parent.classList.add('open');
			}
		});
	});

	document.querySelectorAll('.submenu a').forEach(link =>
	{
		link.addEventListener('click', function(event)
		{
			event.preventDefault();
			window.location.href = this.href;
		});
	});
});

document.getElementById('checkoutModal').style.display = 'none';
document.body.style.overflow = 'auto';

function adjustFooter()
{
	const footer = document.querySelector(".footer");
	const content = document.querySelector(".content");

}

window.addEventListener("load", adjustFooter);
window.addEventListener("resize", adjustFooter);

window.addEventListener("load", adjustFooter);
window.addEventListener("resize", adjustFooter);

document.getElementById("support-form-submit").addEventListener("click", function()
{
	let button = this;
	button.classList.add("loading");
	button.disabled = true;

	setTimeout(() =>
	{
		button.classList.remove("loading");
		button.disabled = false;
	}, 3000);
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

			if(response.status === 401 && data.message)
			{
				alert(data.message);
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

			if(response.status === 401 && data.message)
			{
				alert(data.message);
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

document.getElementById("aboutUsLink").addEventListener("click", () =>
{

	productContainer.style.display = "none";
	document.getElementById("cartModal").style.display = "none";
	document.getElementById("checkoutModal").style.display = "none";
	document.getElementById("orderModal").style.display = "none";
	document.getElementById("welcomeContainer").style.display = "none";
	document.getElementById("privacyPolicySection").style.display = "none";
	document.getElementById("shippingPolicySection").style.display = "none";
	document.getElementById("aboutUsSection").style.display = "block";
});

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
		document.getElementById("aboutUsSection").style.display = "block";
		document.getElementById("productContainer").style.display = "none";

		const section = document.getElementById(sectionId);
		if(section)
		{
			section.style.display = "block";
		}
	}
});

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
			const refundDateValue = document.getElementById("refund-date").value.trim();
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

			if(response.status === 401 && data.message)
			{
				alert(data.message);
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

document.getElementById("payment-method").addEventListener("change", function () {
    const walletInfo = document.getElementById("wallet-info");
    const codInfo = document.getElementById("cod-info"); 

    if (this.value === "wallet") {
        walletInfo.classList.remove("hidden");
        codInfo.classList.add("hidden"); 
    } 
    else if (this.value === "cod") {
        codInfo.classList.remove("hidden");
        walletInfo.classList.add("hidden"); 
    } 
    else {
        walletInfo.classList.add("hidden");
        codInfo.classList.add("hidden");
    }
});

window.addEventListener("click", (event) => {
	if (event.target === modal) {
		closeAllModals();
	}
	if (event.target === document.getElementById("cartModal")) {
		document.getElementById("cartModal").style.display = "none";
	}
	if (!modal.contains(event.target) && modal.style.display === "flex") {
		closeAllModals();
	}
});

document.getElementById("location").addEventListener("change", function() {
    const selectedLocation = this.value;
    const shippingFee = shippingFees[selectedLocation] || 0;

    const cartItemsDiv = document.getElementById('cart-items');
    let totalPrice = 0;

    cart.forEach(item => {
        const priceValue = parseFloat(item.price.replace('EGP', '').trim());
        totalPrice += priceValue * item.quantity;
    });

    totalPrice += shippingFee; 

    const totalPriceDiv = document.getElementById('total-price');
    totalPriceDiv.textContent = `Total Price: ${totalPrice.toFixed(2)}EGP (Shipping: ${shippingFee}EGP)`;
    displayCartItemsInCheckoutModal();
});

document.getElementById("city").addEventListener("change", function() {
    const selectedCity = this.value;
    const selectedLocation = document.getElementById("location").value;
    const shippingFee = shippingFees[selectedLocation][selectedCity] || 0;

    const cartItemsDiv = document.getElementById('cart-items');
    let totalPrice = 0;

    cart.forEach(item => {
        const priceValue = parseFloat(item.price.replace('EGP', '').trim());
        totalPrice += priceValue * item.quantity;
    });

    totalPrice += shippingFee; 

    const totalPriceDiv = document.getElementById('total-price');
    totalPriceDiv.textContent = `Total Price: ${totalPrice.toFixed(2)}EGP (Shipping: ${shippingFee}EGP)`;
	displayCartItemsInCheckoutModal();
});

