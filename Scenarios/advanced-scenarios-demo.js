import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics for advanced tracking
const loginFailures = new Counter('login_failures');
const searchSuccessRate = new Rate('search_success_rate');
const apiResponseTime = new Trend('api_response_time');

export const options = {
  scenarios: {
    // Scenario 1: Warmup - Light load to prepare system
    warmup: {
      executor: 'constant-vus',
      exec: 'warmup',
      vus: 2,
      duration: '30s',
      startTime: '0s',
      tags: { scenario: 'warmup' },
      env: { SCENARIO_TYPE: 'warmup' },
    },
    
    // Scenario 2: User Login Flow - Simulates authentication
    user_login: {
      executor: 'ramping-vus',
      exec: 'userLogin',
      startTime: '30s',
      stages: [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario: 'user-login' },
      env: { SCENARIO_TYPE: 'login' },
    },
    
    // Scenario 3: API Load Test - High throughput API testing
    api_load_test: {
      executor: 'constant-arrival-rate',
      exec: 'apiTest',
      rate: 50,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 20,
      maxVUs: 100,
      startTime: '1m',
      tags: { scenario: 'api-load' },
      env: { SCENARIO_TYPE: 'api' },
    },
    
    // Scenario 4: Stress Test - Breaking point testing
    stress_test: {
      executor: 'ramping-arrival-rate',
      exec: 'stressTest',
      startTime: '2m',
      preAllocatedVUs: 50,
      maxVUs: 200,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '10m', target: 0 },
      ],
      tags: { scenario: 'stress-test' },
      env: { SCENARIO_TYPE: 'stress' },
    },
    
    // Scenario 5: Soak Test - Long duration stability test
    soak_test: {
      executor: 'constant-vus',
      exec: 'soakTest',
      vus: 20,
      duration: '10m',
      startTime: '5m',
      tags: { scenario: 'soak-test' },
      env: { SCENARIO_TYPE: 'soak' },
    },
    
    // Scenario 6: Spike Test - Sudden load increase
    spike_test: {
      executor: 'ramping-vus',
      exec: 'spikeTest',
      startTime: '8m',
      stages: [
        { duration: '10s', target: 0 },
        { duration: '30s', target: 100 },
        { duration: '10s', target: 0 },
      ],
      tags: { scenario: 'spike-test' },
      env: { SCENARIO_TYPE: 'spike' },
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.02'],
    login_failures: ['count<10'],
    search_success_rate: ['rate>0.95'],
    api_response_time: ['p(95)<500'],
    
    // Scenario-specific thresholds
    'http_req_duration{scenario:warmup}': ['p(95)<200'],
    'http_req_duration{scenario:user-login}': ['p(95)<800'],
    'http_req_duration{scenario:api-load}': ['p(95)<600'],
    'http_req_duration{scenario:stress-test}': ['p(95)<2000'],
    'http_req_duration{scenario:soak-test}': ['p(95)<1000'],
    'http_req_duration{scenario:spike-test}': ['p(95)<1500'],
  },
  
  noConnectionReuse: false,
  userAgent: 'K6-Advanced-Scenarios-Demo/1.0',
};

export function warmup() {
  const response = http.get('https://test.k6.io/');
  check(response, {
    'warmup: status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function userLogin() {
  const credentials = {
    username: `user_${Math.floor(Math.random() * 1000)}`,
    password: 'password123',
  };
  
  const loginResponse = http.post('https://test.k6.io/my_messages.php', credentials);
  
  const loginSuccess = check(loginResponse, {
    'login: status is 200': (r) => r.status === 200,
    'login: response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!loginSuccess) {
    loginFailures.add(1);
  }
  
  sleep(Math.random() * 3);
}

export function apiTest() {
  const endpoints = [
    'https://test.k6.io/contacts.php',
    'https://test.k6.io/news.php',
    'https://test.k6.io/pi.php?decimals=3',
  ];
  
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const start = Date.now();
  const response = http.get(endpoint);
  const duration = Date.now() - start;
  
  apiResponseTime.add(duration);
  
  check(response, {
    'api: status is 200': (r) => r.status === 200,
    'api: response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(0.1);
}

export function stressTest() {
  const response = http.get('https://test.k6.io/');
  
  check(response, {
    'stress: status is 200': (r) => r.status === 200,
    'stress: response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  
  sleep(Math.random() * 0.5);
}

export function soakTest() {
  const searchTerm = `search_${Math.floor(Math.random() * 100)}`;
  const response = http.get(`https://test.k6.io/?search=${searchTerm}`);
  
  const searchSuccess = check(response, {
    'soak: status is 200': (r) => r.status === 200,
    'soak: response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  searchSuccessRate.add(searchSuccess);
  
  sleep(Math.random() * 2);
}

export function spikeTest() {
  const response = http.get('https://test.k6.io/');
  
  check(response, {
    'spike: status is 200': (r) => r.status === 200,
    'spike: response time < 1500ms': (r) => r.timings.duration < 1500,
  });
  
  sleep(0.1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data, null, 2),
    stdout: `
=== K6 Advanced Scenarios Demo Summary ===
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${data.metrics.http_req_failed.values.rate * 100}%
Average Response Time: ${data.metrics.http_req_duration.values.avg}ms
95th Percentile: ${data.metrics.http_req_duration.values['p(95)']}ms
99th Percentile: ${data.metrics.http_req_duration.values['p(99)']}ms
Login Failures: ${data.metrics.login_failures?.values.count || 0}
Search Success Rate: ${(data.metrics.search_success_rate?.values.rate || 0) * 100}%
==========================================
    `,
  };
}