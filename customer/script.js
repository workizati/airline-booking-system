document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date for departure (today)
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = yyyy + '-' + mm + '-' + dd;
    document.getElementById('departure').min = minDate;
    
    // Update return date min when departure changes
    document.getElementById('departure').addEventListener('change', function() {
        document.getElementById('return').min = this.value;
        if (document.getElementById('return').value < this.value) {
            document.getElementById('return').value = this.value;
        }
    });
    
    // Toggle return date visibility based on trip type
    const tripTypeRadios = document.querySelectorAll('input[name="trip-type"]');
    const returnDateGroup = document.getElementById('return-date-group');
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'oneway') {
                returnDateGroup.style.display = 'none';
            } else {
                returnDateGroup.style.display = 'block';
            }
        });
    });
    
    // Passenger selector functionality
    const passengerInput = document.getElementById('passengers');
    const passengerDropdown = document.querySelector('.passenger-dropdown');
    
    passengerInput.addEventListener('click', function() {
        document.querySelector('.passenger-selector').classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!passengerInput.contains(e.target) && !passengerDropdown.contains(e.target)) {
            document.querySelector('.passenger-selector').classList.remove('active');
        }
    });
    
    // Passenger count controls
    const passengerCounts = {
        adults: 1,
        children: 0,
        infants: 0
    };
    
    function updatePassengerDisplay() {
        let displayText = '';
        if (passengerCounts.adults > 0) {
            displayText += `${passengerCounts.adults} Adult${passengerCounts.adults > 1 ? 's' : ''}`;
        }
        if (passengerCounts.children > 0) {
            displayText += `${displayText ? ', ' : ''}${passengerCounts.children} Child${passengerCounts.children > 1 ? 'ren' : ''}`;
        }
        if (passengerCounts.infants > 0) {
            displayText += `${displayText ? ', ' : ''}${passengerCounts.infants} Infant${passengerCounts.infants > 1 ? 's' : ''}`;
        }
        passengerInput.value = displayText;
    }
    
    document.querySelectorAll('.passenger-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            passengerCounts[type]++;
            document.querySelector(`.passenger-count[data-type="${type}"]`).textContent = passengerCounts[type];
            updatePassengerDisplay();
        });
    });
    
    document.querySelectorAll('.passenger-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (passengerCounts[type] > (type === 'adults' ? 1 : 0)) {
                passengerCounts[type]--;
                document.querySelector(`.passenger-count[data-type="${type}"]`).textContent = passengerCounts[type];
                updatePassengerDisplay();
            }
        });
    });
    
    document.querySelector('.done-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.passenger-selector').classList.remove('active');
    });
    
    // Swap locations
    document.getElementById('swap-locations').addEventListener('click', function(e) {
        e.preventDefault();
        const fromValue = document.getElementById('from').value;
        const toValue = document.getElementById('to').value;
        document.getElementById('from').value = toValue;
        document.getElementById('to').value = fromValue;
    });
    
    // Modal functionality
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const closeModals = document.querySelectorAll('.close-modal');
    
    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(loginModal);
    });
    
    registerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(registerModal);
    });
    
    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });
    
    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });
    
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    // Add this to the existing DOMContentLoaded event listener

// Payment functionality
const paymentModal = document.getElementById('payment-modal');
const paymentTabs = document.querySelectorAll('.payment-tab-btn');
const paymentContents = document.querySelectorAll('.payment-content');

// Payment tab switching
paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        paymentTabs.forEach(t => t.classList.remove('active'));
        paymentContents.forEach(c => c.style.display = 'none');
        
        // Add active class to clicked tab and show corresponding content
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(`${tabId}-payment`).style.display = 'block';
    });
});

// FPX form submission
document.getElementById('fpx-form').addEventListener('submit', function(e) {
    e.preventDefault();
    processPayment('fpx');
});

// Credit card form submission
document.getElementById('credit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    processPayment('credit');
});

function processPayment(method) {
    // Show loading state
    const submitBtn = document.querySelector(`#${method}-form .primary-btn`);
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    // Simulate API call to backend
    setTimeout(() => {
        // In a real implementation, you would:
        // 1. Call your backend to process payment
        // 2. Handle the response
        
        // For demo, we'll simulate a successful payment
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        closeModal(paymentModal);
        window.location.href = 'booking.html';
    }, 2000);
}

// Update the flight selection handler to show payment modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('select-btn')) {
        // Get flight details from the card
        const flightCard = e.target.closest('.flight-card');
        const flightDetails = {
            airline: flightCard.querySelector('.flight-airline span').textContent.split(' • ')[0],
            flightNo: flightCard.querySelector('.flight-airline span').textContent.split(' • ')[1],
            departure: flightCard.querySelectorAll('.flight-time .time')[0].textContent,
            arrival: flightCard.querySelectorAll('.flight-time .time')[1].textContent,
            date: flightCard.querySelector('.flight-time .date').textContent,
            duration: flightCard.querySelector('.duration').textContent,
            stops: flightCard.querySelector('.stops').textContent,
            price: parseFloat(flightCard.querySelector('.price').textContent.replace('RM', '').trim())
        };
        
        // Update payment modal with flight details
        document.getElementById('payment-flight').textContent = 
            `${flightDetails.flightNo} - ${document.getElementById('from').value} to ${document.getElementById('to').value}`;
        document.getElementById('payment-passengers').textContent = 
            document.getElementById('passengers').value;
        document.getElementById('payment-class').textContent = 
            document.getElementById('cabin-class').options[document.getElementById('cabin-class').selectedIndex].text;
        document.getElementById('payment-total').textContent = 
            `RM ${flightDetails.price.toFixed(2)}`;
        
        openModal(paymentModal);
    }
});
    // Form submission
    document.getElementById('search-flights').addEventListener('click', function(e) {
        e.preventDefault();
        showSampleFlights();
    });
    
    // Sample flight data for demo
    function showSampleFlights() {
        const flightResults = document.getElementById('flight-results');
        const flightList = document.getElementById('flight-list');
        
        // Clear any existing results
        flightList.innerHTML = '';
        
        // Sample flight data
        const flights = [
            {
                airline: 'Malaysia Airlines',
                flightNo: 'MH 604',
                departure: '08:30',
                arrival: '09:30',
                date: '15 Nov 2023',
                duration: '1h 0m',
                stops: 'Non-stop',
                price: 299,
                aircraft: 'Boeing 737'
            },
            {
                airline: 'Malaysia Airlines',
                flightNo: 'MH 608',
                departure: '12:15',
                arrival: '13:15',
                date: '15 Nov 2023',
                duration: '1h 0m',
                stops: 'Non-stop',
                price: 349,
                aircraft: 'Airbus A330'
            },
            {
                airline: 'Malaysia Airlines',
                flightNo: 'MH 612',
                departure: '18:45',
                arrival: '19:45',
                date: '15 Nov 2023',
                duration: '1h 0m',
                stops: 'Non-stop',
                price: 279,
                aircraft: 'Boeing 737'
            }
        ];
        
        // Add flights to the list
        flights.forEach(flight => {
            const flightCard = document.createElement('div');
            flightCard.className = 'flight-card';
            flightCard.innerHTML = `
                <div class="flight-info">
                    <div class="flight-time">
                        <div class="time">${flight.departure}</div>
                        <div class="date">${flight.date}</div>
                    </div>
                    <div class="flight-duration">
                        <div class="duration">${flight.duration}</div>
                        <div class="stops">${flight.stops}</div>
                    </div>
                    <div class="flight-time">
                        <div class="time">${flight.arrival}</div>
                        <div class="date">${flight.date}</div>
                    </div>
                    <div class="flight-airline">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Malaysia_Airlines_logo.svg/1200px-Malaysia_Airlines_logo.svg.png" alt="${flight.airline}">
                        <span>${flight.flightNo} • ${flight.aircraft}</span>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price">RM${flight.price}</div>
                    <div class="per-person">per person</div>
                    <button class="select-btn">Select</button>
                </div>
            `;
            
            flightList.appendChild(flightCard);
        });
        
        // Show the results section
        flightResults.style.display = 'block';
        
        // Scroll to results
        flightResults.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Airport suggestions (simplified for demo)
    const airports = [
        { code: 'KUL', name: 'Kuala Lumpur International Airport' },
        { code: 'SIN', name: 'Singapore Changi Airport' },
        { code: 'BKK', name: 'Bangkok Suvarnabhumi Airport' },
        { code: 'CGK', name: 'Jakarta Soekarno-Hatta Airport' },
        { code: 'HKG', name: 'Hong Kong International Airport' },
        { code: 'TPE', name: 'Taiwan Taoyuan International Airport' },
        { code: 'NRT', name: 'Tokyo Narita Airport' },
        { code: 'ICN', name: 'Seoul Incheon International Airport' },
        { code: 'SYD', name: 'Sydney Kingsford Smith Airport' },
        { code: 'MEL', name: 'Melbourne Airport' },
        { code: 'LHR', name: 'London Heathrow Airport' },
        { code: 'CDG', name: 'Paris Charles de Gaulle Airport' },
        { code: 'FRA', name: 'Frankfurt Airport' },
        { code: 'JFK', name: 'New York John F. Kennedy Airport' },
        { code: 'LAX', name: 'Los Angeles International Airport' }
    ];
    
    function showSuggestions(inputElement, suggestionsElement) {
        const value = inputElement.value.toLowerCase();
        
        if (value.length < 2) {
            suggestionsElement.innerHTML = '';
            suggestionsElement.classList.remove('active');
            return;
        }
        
        const matches = airports.filter(airport => 
            airport.code.toLowerCase().includes(value) || 
            airport.name.toLowerCase().includes(value)
        );
        
        if (matches.length > 0) {
            suggestionsElement.innerHTML = '';
            matches.forEach(airport => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = `${airport.name} (${airport.code})`;
                item.addEventListener('click', function() {
                    inputElement.value = `${airport.name} (${airport.code})`;
                    suggestionsElement.classList.remove('active');
                });
                suggestionsElement.appendChild(item);
            });
            suggestionsElement.classList.add('active');
        } else {
            suggestionsElement.innerHTML = '<div class="suggestion-item">No matches found</div>';
            suggestionsElement.classList.add('active');
        }
    }
    
    document.getElementById('from').addEventListener('input', function() {
        showSuggestions(this, document.getElementById('from-suggestions'));
    });
    
    document.getElementById('to').addEventListener('input', function() {
        showSuggestions(this, document.getElementById('to-suggestions'));
    });
    
    // Close suggestions when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.matches('#from, #to')) {
            document.getElementById('from-suggestions').classList.remove('active');
            document.getElementById('to-suggestions').classList.remove('active');
        }
    });

    // Handle flight selection
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-btn')) {
            // Get flight details from the card
            const flightCard = e.target.closest('.flight-card');
            const flightDetails = {
                airline: flightCard.querySelector('.flight-airline span').textContent.split(' • ')[0],
                flightNo: flightCard.querySelector('.flight-airline span').textContent.split(' • ')[1],
                departure: flightCard.querySelectorAll('.flight-time .time')[0].textContent,
                arrival: flightCard.querySelectorAll('.flight-time .time')[1].textContent,
                date: flightCard.querySelector('.flight-time .date').textContent,
                duration: flightCard.querySelector('.duration').textContent,
                stops: flightCard.querySelector('.stops').textContent,
                price: parseFloat(flightCard.querySelector('.price').textContent.replace('RM', '').trim())
            };
            
            // In a real app, this would redirect to the booking page with flight details
            window.location.href = 'booking.html';
        }
    });
});