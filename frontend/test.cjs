const http = require('http');

const data = JSON.stringify({
  title: 'Test Event',
  description: 'Testing',
  category: 'Burn Energy',
  author: 'Jeridrin'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/events',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log("POST Response: ", body);
    const event = JSON.parse(body);
    const deleteId = event._id || event.id;
    console.log("EVENT:", event);

    const delData = JSON.stringify({ userName: 'Jeridrin' });
    const delReq = http.request({
      hostname: 'localhost', port: 3000, path: '/api/events/' + deleteId, method: 'DELETE', headers: {
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(delData)
      }
    }, (delRes) => {
      let delBody = '';
      delRes.on('data', d => delBody += d);
      delRes.on('end', () => console.log("DELETE Response: ", delRes.statusCode, delBody));
    });
    delReq.write(delData);
    delReq.end();
  });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
