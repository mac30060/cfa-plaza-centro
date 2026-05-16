const https = require('https');

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' };
  }

  return new Promise((resolve) => {
    try {
      const requestBody = event.body;

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
          'x-api-key': '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',
          'anthropic-version': '2023-06-01'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: data
          });
        });
      });

      req.on('error', (err) => {
        resolve({
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({ error: err.message })
        });
      });

      req.write(requestBody);
      req.end();

    } catch (err) {
      resolve({
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: err.message })
      });
    }
  });
};
