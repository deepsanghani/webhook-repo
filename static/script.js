async function fetchEvents() {
    const response = await fetch('/events');
    const events = await response.json();
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';

    events.forEach(event => {
        let listItem = document.createElement('li');
        let text = '';
        let eventDate = new Date(event.timestamp);
        let options = { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' };

        if (event.action === 'PUSH') {
            text = `${event.author} pushed to ${event.to_branch} on ${eventDate.toLocaleString('en-IN', options)} IST`;
        } else if (event.action === 'PULL_REQUEST') {
            text = `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${eventDate.toLocaleString('en-IN', options)} IST`;
        } else if (event.action === 'MERGE') {
            text = `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${eventDate.toLocaleString('en-IN', options)} IST`;
        }

        listItem.textContent = text;
        eventsList.appendChild(listItem);
    });
}

setInterval(fetchEvents, 15000);
fetchEvents();
