async function fetchEvents() {
    const response = await fetch('/events');
    const events = await response.json();
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = '';

    events.forEach(event => {
        let listItem = document.createElement('li');
        let text = '';

        if (event.type === 'PUSH') {
            text = `${event.author} pushed to ${event.to_branch} on ${new Date(event.timestamp).toLocaleString()}`
        } else if (event.type === 'PULL_REQUEST') {
            text = `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${new Date(event.timestamp).toLocaleString()}`
        } else if (event.type === 'MERGE') {
            text = `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${new Date(event.timestamp).toLocaleString()}`
        }

        listItem.textContent = text;
        eventsList.appendChild(listItem);
    });
}

setInterval(fetchEvents, 15000);
fetchEvents();
