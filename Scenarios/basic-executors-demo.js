import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    // 1. Shared Iterations - 10 VUs compete to complete 100 total iterations
    shared_iterations: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 100,
      startTime: '0s',
      tags: { scenario: 'shared-iterations' },
    },
    
    // 2. Per VU Iterations - Each of 5 VUs runs exactly 10 iterations
    per_vu_iterations: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 10,
      startTime: '15s',
      tags: { scenario: 'per-vu-iterations' },
    },
    
    // 3. Constant VUs - 8 VUs run continuously for 30 seconds
    constant_vus: {
      executor: 'constant-vus',
      vus: 8,
      duration: '30s',
      startTime: '30s',
      tags: { scenario: 'constant-vus' },
    },
    
    // 4. Ramping VUs - VUs ramp up and down over time
    ramping_vus: {
      executor: 'ramping-vus',
      startTime: '65s',
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 15 },
        { duration: '10s', target: 0 },
      ],
      tags: { scenario: 'ramping-vus' },
    },
    
    // 5. Constant Arrival Rate - Start 5 iterations per second
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      rate: 5,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 10,
      maxVUs: 20,
      startTime: '110s',
      tags: { scenario: 'constant-arrival-rate' },
    },
    
    // 6. Ramping Arrival Rate - Rate changes over time
    ramping_arrival_rate: {
      executor: 'ramping-arrival-rate',
      startTime: '145s',
      preAllocatedVUs: 10,
      maxVUs: 30,
      stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 20 },
        { duration: '10s', target: 0 },
      ],
      tags: { scenario: 'ramping-arrival-rate' },
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
    'http_req_duration{scenario:shared-iterations}': ['p(95)<300'],
    'http_req_duration{scenario:constant-vus}': ['p(95)<400'],
  },
};

export default function () {
  const response = http.get('https://test.k6.io/');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'body contains "Collection of simple web-pages"': (r) => 
      r.body.includes('Collection of simple web-pages'),
  });
  
  sleep(Math.random() * 2);
}