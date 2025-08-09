const ROWS = 5;
const COLS = 7;
let seats = Array.from({ length: ROWS }, () => Array(COLS).fill('O'));
let currentUser = '';
let pendingSeat = null;

// On initial load, show the login form
document.getElementById('register-form').classList.add('hidden');

function toggleAuthForms() {
    document.getElementById('register-form').classList.toggle('hidden');
    document.getElementById('login-form').classList.toggle('hidden');
}

function renderSeats() {
    const grid = document.getElementById('seat-grid');
    grid.innerHTML = '';
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            if (seats[i][j] === 'X') {
                seat.classList.add('booked');
                seat.textContent = 'X';
            } else {
                seat.textContent = 'O';
            }
            grid.appendChild(seat);
        }
    }
}

function showMessage(msg) {
    document.getElementById('message-box').textContent = msg;
}

function bookSeat() {
    const row = parseInt(document.getElementById('row').value) - 1;
    const col = parseInt(document.getElementById('col').value) - 1;
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        if (seats[row][col] === 'X') {
            showMessage("⛔ Seat already booked!");
        } else {
            pendingSeat = [row, col];
            document.getElementById('payment-box').classList.remove('hidden');
            showMessage(`Proceed to payment for seat R${row + 1}C${col + 1}.`);
        }
    } else {
        showMessage("⚠ Invalid seat position!");
    }
}

function confirmPayment() {
    if (pendingSeat) {
        const [row, col] = pendingSeat;
        seats[row][col] = 'X';
        renderSeats();
        // CORRECTED: Used backticks for template literal
        showMessage(`🎉 Yay! Seat at Row ${row + 1}, Column ${col + 1} booked successfully!`);
        document.getElementById('payment-box').classList.add('hidden');
        pendingSeat = null;
    }
}

function cancelSeat() {
    const row = parseInt(document.getElementById('row').value) - 1;
    const col = parseInt(document.getElementById('col').value) - 1;
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        if (seats[row][col] === 'O') {
            showMessage("⚠ Seat is not booked, so it cannot be canceled!");
        } else {
            seats[row][col] = 'O';
            renderSeats();
            // CORRECTED: Used backticks for template literal
            showMessage(`✅ Booking at Row ${row + 1}, Column ${col + 1} successfully cancelled.`);
        }
    } else {
        showMessage("⚠ Invalid seat position!");
    }
}

function register() {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();
    if (user && pass) {
        // CORRECTED: Used backticks for template literal
        if (localStorage.getItem(`user_${user}`)) {
            alert("Username already exists. Please login or choose a different username.");
            return;
        }
        localStorage.setItem(`user_${user}`, pass);
        alert("Registration successful! Please login.");
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        toggleAuthForms(); // Switch to login form
    } else {
        alert("Please enter a valid username and password.");
    }
}

function login() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    // CORRECTED: Used backticks for template literal
    const storedPass = localStorage.getItem(`user_${user}`);
    if (storedPass && storedPass === pass) {
        currentUser = user;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        renderSeats();
    } else {
        alert("Invalid username or password!");
    }
}

function logout() {
    // CORRECTED: Used alert for a visible logout message and reset state
    alert(`👋 You have been logged out. See you next time, ${currentUser}!`);
    currentUser = '';
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    // Reset forms
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    showMessage(''); // Clear any old messages
}

function toggleChatbot() {
    const bot = document.getElementById('chatbot');
    bot.style.display = bot.style.display === 'block' ? 'none' : 'block';
}

function chatResponse(query) {
    let response = '';
    if (query === 'seats') {
        response = '📍 Booked seats: ';
        let bookedList = [];
        seats.forEach((row, i) => {
            row.forEach((seat, j) => {
                if (seat === 'X') bookedList.push(`R${i + 1}C${j + 1}`);
            });
        });
        response += bookedList.length > 0 ? bookedList.join(', ') : 'None yet!';
    } else if (query === 'available') {
        let count = 0;
        seats.forEach(row => row.forEach(seat => {
            if (seat === 'O') count++;
        }));
        // CORRECTED: Used backticks for template literal
        response = `🟢 ${count} seats are still available.`;
    } else if (query === 'movies') {
        response = '🎥 Currently showing: "The Code Master" in all screens.';
    } else if (query === 'greeting') {
        response = `👋 Hi there, ${currentUser}! I am Achin, your movie buddy. How can I help?`;
    }
    document.getElementById('chatbot-response').textContent = response;
}
