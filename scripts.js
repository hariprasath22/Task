document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let currentPage = 1;
    const propertiesPerPage = 5;
    let properties = [];
 
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const loginForm = document.getElementById('login-form');
    const postPropertyForm = document.getElementById('post-property-form');
    const propertyList = document.getElementById('property-list');
    const filterForm = document.getElementById('filter-form');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const loginSection = document.getElementById('login');
 
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registration').style.display = 'none';
loginSection.style.display = 'block';
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login').style.display = 'none';
    });
 
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null;
loginLink.style.display = 'block';
logoutLink.style.display = 'none';
        alert('Logged out successfully');
    });
 
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const role = document.getElementById('role').value;
        
        currentUser = { firstName, lastName, email, phoneNumber, role };
        alert('User registered successfully!');
    });
 
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simplified authentication
if (currentUser && currentUser.email === email) {
loginLink.style.display = 'none';
logoutLink.style.display = 'block';
loginSection.style.display = 'none';
            alert('Logged in successfully!');
        } else {
            alert('Invalid credentials!');
        }
    });
 
    postPropertyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const propertyTitle = document.getElementById('property-title').value;
        const propertyDescription = document.getElementById('property-description').value;
        const bedrooms = document.getElementById('bedrooms').value;
        const bathrooms = document.getElementById('bathrooms').value;
        const location = document.getElementById('location').value;
        const nearbyAmenities = document.getElementById('nearby-amenities').value;
        
        const property = {
            title: propertyTitle,
            description: propertyDescription,
            bedrooms,
            bathrooms,
            location,
            nearbyAmenities,
            likes: 0,
            seller: currentUser
        };
        
        properties.push(property);
        displayProperties();
        alert('Property posted successfully!');
    });
 
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const filterBedrooms = document.getElementById('filter-bedrooms').value;
        const filterBathrooms = document.getElementById('filter-bathrooms').value;
        const filterLocation = document.getElementById('filter-location').value;
 
        displayProperties(filterBedrooms, filterBathrooms, filterLocation);
    });
 
    propertyList.addEventListener('click', (e) => {
        if (e.target.classList.contains('interested-button')) {
            if (!currentUser) {
                alert('You must be logged in to view seller details.');
                document.getElementById('registration').style.display = 'none';
loginSection.style.display = 'block';
                return;
            }
 
            const propertyIndex = Array.from(propertyList.children).indexOf(e.target.closest('.property-widget'));
            const property = properties[(currentPage - 1) * propertiesPerPage + propertyIndex];
alert(`Showing seller details: ${property.seller.email}, ${property.seller.phoneNumber}`);
        } else if (e.target.classList.contains('like-button')) {
            const propertyIndex = Array.from(propertyList.children).indexOf(e.target.closest('.property-widget'));
            const property = properties[(currentPage - 1) * propertiesPerPage + propertyIndex];
            property.likes += 1;
            e.target.querySelector('.like-count').textContent = property.likes;
        }
    });
 
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProperties();
        }
    });
 
    document.getElementById('next-page').addEventListener('click', () => {
        if ((currentPage * propertiesPerPage) < properties.length) {
            currentPage++;
            displayProperties();
        }
    });
 
    function displayProperties(filterBedrooms = null, filterBathrooms = null, filterLocation = null) {
        propertyList.innerHTML = '';
        let filteredProperties = properties;
 
        if (filterBedrooms || filterBathrooms || filterLocation) {
            filteredProperties = properties.filter(property => {
                return (!filterBedrooms || property.bedrooms >= filterBedrooms) &&
                       (!filterBathrooms || property.bathrooms >= filterBathrooms) &&
                       (!filterLocation || property.location.toLowerCase().includes(filterLocation.toLowerCase()));
            });
        }
 
        const paginatedProperties = filteredProperties.slice((currentPage - 1) * propertiesPerPage, currentPage * propertiesPerPage);
 
        paginatedProperties.forEach(property => {
            const propertyWidget = document.createElement('div');
            propertyWidget.classList.add('property-widget');
            propertyWidget.innerHTML = `
                <h4>${property.title}</h4>
                <p>${property.description}</p>
                <p>Bedrooms: ${property.bedrooms}</p>
                <p>Bathrooms: ${property.bathrooms}</p>
                <p>Location: ${property.location}</p>
                <p>Nearby Amenities: ${property.nearbyAmenities}</p>
                <button class="interested-button">I'm Interested</button>
                <button class="like-button">Like (<span class="like-count">${property.likes}</span>)</button>
            `;
            propertyList.appendChild(propertyWidget);
        });
 
        document.getElementById('page-number').textContent = currentPage;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = (currentPage * propertiesPerPage) >= filteredProperties.length;
    }
});