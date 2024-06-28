// Establish a socket connection to the server
const socket = io("http://localhost:8004", { transports: ["websocket"] });

//Get DOM Elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//Audio that will play on recieving the message
var audio = new Audio('ting.mp3')

// Function to append messages to the message container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {

        audio.play();
    }
}


// Prompt the user to enter their name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name); // Notify the server of the new user

// Listen for 'user-joined' events from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right'); // Append a notification when a new user joins
});

// Listen for 'receive' events from the server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for 'left' events from the server
socket.on('left', name => {
    append(`${name} left the chat`, 'right'); // Append a notification when a user leaves
});

// Event listener for the form submit event to send messages
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; // Clear the input field
});







