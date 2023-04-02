const calendarUrl = 'https://standrewspolaris.org/events/month/?ical=1';
const currentDate = new Date();
// create a date object for  April 3 6:30 pm
// const currentDate = new Date(2023, 3, 3, 1, 30, 0, 0);

fetch(`/.netlify/functions/node-fetch?url=${encodeURIComponent(calendarUrl)}`)
  .then(response => response.text())
  .then(data => {
    const jCalData = ICAL.parse(data);
    const comp = new ICAL.Component(jCalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      const start = event.startDate.toJSDate();
      const end = event.endDate.toJSDate();
      
      // if (true) {
      if (start.getDate() === currentDate.getDate() &&
          start.getMonth() === currentDate.getMonth() &&
          start.getFullYear() === currentDate.getFullYear() &&
          end.getDate() === currentDate.getDate() &&
          end.getMonth() === currentDate.getMonth() &&
          end.getFullYear() === currentDate.getFullYear()) {
        return {
          summary: event.summary,
          uid: event.uid,
          description: event.description,
          start: start,
          end: end
        };
      } else {
        return null;
      }
    }).filter(event => event !== null);

    console.log(events);
  })
  .catch(error => console.error(error));
