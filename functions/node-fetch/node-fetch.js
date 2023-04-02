const fetch = require('node-fetch')

exports.handler = async function(event, context) {
  // Extract the URL of the iCal file from the query parameters
  const url = event.queryStringParameters.url;
  
  // Fetch the iCal data from the server
  const response = await fetch(url);
  const data = await response.text();
  
  // Return the iCal data in the response
  return {
    statusCode: 200,
    body: data,
    headers: {
      'Content-Type': 'text/calendar',
    },
  };
};

