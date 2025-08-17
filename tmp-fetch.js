const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/courses/CMA/inter/1?includeStandalone=true',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('RAW', data);
    }
  });
});

req.on('error', e => console.error('Request error', e));
req.end();
