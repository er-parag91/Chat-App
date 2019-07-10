const socket = io();

// elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
socket.on('message', (message) => {
    console.log(message);

    const html = Mustache.render($messageTemplate, {
        createdAt: moment(message.createdAt).format('h:mm a'),
        message: message.text
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (message) => {
    console.log(message);

    const html = Mustache.render($locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        // Enable send button, clear the form and focus input
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }
        console.log('Message Delivered!!');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Sorry! your browser does not support geo location at the moment!')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared!!');
        });
    })
})