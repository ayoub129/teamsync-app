import Echo from 'laravel-echo';
window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key:process.env.REACT_APP_PUSHER_KEY,
    cluster: 'eu',
    forceTLS: true
});
