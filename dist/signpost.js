const calendarUrl = "https://standrewspolaris.org/events/month/?ical=1";
// const currentDate = new Date(); // TODO: uncomment this line and comment below line to enable date filtering
// create a new date object for Sat Dec 01 2018 17:00:00
const currentDate = new Date(2018, 11, 1, 17, 0, 0);

const locationDict = {
  "Sanctuary": "arrow-straight",
  "Room 101": "arrow-left",
  "Gathering Area": "arrow-left",
};

fetch(`/.netlify/functions/node-fetch?url=${encodeURIComponent(calendarUrl)}`)
  .then((response) => response.text())
  .then((data) => {
    const jCalData = ICAL.parse(data);
    const comp = new ICAL.Component(jCalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const events = vevents
      .map((vevent) => {
        const event = new ICAL.Event(vevent);
        // console.log(event.location);
        const start = event.startDate.toJSDate();
        const end = event.endDate.toJSDate();

        if (
			true // TODO: Remove this line to enable date filtering
        //   start.getDate() === currentDate.getDate() &&
        //   start.getMonth() === currentDate.getMonth() &&
        //   start.getFullYear() === currentDate.getFullYear() &&
        //   end.getDate() === currentDate.getDate() &&
        //   end.getMonth() === currentDate.getMonth() &&
        //   end.getFullYear() === currentDate.getFullYear()
        ) {
          return {
            summary: event.summary,
            uid: event.uid,
            description: event.description,
            start: start,
            end: end,
            location: event.location,
          };
        } else {
          return null;
        }
      })
      .filter((event) => event !== null);

    const eventTable = document.getElementById("event-table");
    const tbody = eventTable.querySelector("tbody");

	events.forEach(event => {
		const row = tbody.insertRow();
	
		const summaryCell = row.insertCell();
		summaryCell.textContent = event.summary;
	
		const timeCell = row.insertCell();
		const timeFormat = new Intl.DateTimeFormat('en-US', { timeStyle: 'short' });
		const startTimeString = timeFormat.format(event.start);
		const endTimeString = timeFormat.format(event.end);
		timeCell.textContent = `${startTimeString} - ${endTimeString}`;
	
		const locationCell = row.insertCell();

		let direction = null;

		Object.keys(locationDict).forEach(key => {
			if (event.location.includes(key)) {
			  direction = locationDict[key];
			  console.log(`Direction for location ${event.location}: ${direction}`);
			}
		  });
			
		const arrow = document.createElement('span');
		arrow.classList.add('arrow');
		arrow.classList.add(direction);
		locationCell.appendChild(arrow);
		locationCell.appendChild(document.createTextNode(event.location || 'TBD'));
	});
	
  })
  .catch((error) => console.error(error));
