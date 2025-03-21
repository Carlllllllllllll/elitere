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