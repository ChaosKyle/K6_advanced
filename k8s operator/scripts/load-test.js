import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '2m', target: 30 },
    { duration: '5m', target: 30 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const baseUrl = 'https://test.k6.io';
  
  // Test multiple endpoints
  const endpoints = [
    `${baseUrl}/`,
    `${baseUrl}/my_messages.php`,
    `${baseUrl}/contacts.php`,
  ];
  
  endpoints.forEach(url => {
    const response = http.get(url);
    
    check(response, {
      'status is 200': (r) => r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    
    sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
  });
}

export function handleSummary(data) {
  return {
    'load-test-summary.json': JSON.stringify(data, null, 2),
  };
}