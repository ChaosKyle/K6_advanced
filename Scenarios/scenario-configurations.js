import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration Examples for Different Testing Patterns

// 1. Load Testing Configuration
export const loadTestConfig = {
  scenarios: {
    load_test: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      tags: { test_type: 'load' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

// 2. Stress Testing Configuration
export const stressTestConfig = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '10m', target: 0 },
      ],
      tags: { test_type: 'stress' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.1'],
  },
};

// 3. Spike Testing Configuration
export const spikeTestConfig = {
  scenarios: {
    spike_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 0 },
        { duration: '30s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 0 },
      ],
      tags: { test_type: 'spike' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

// 4. Volume Testing Configuration
export const volumeTestConfig = {
  scenarios: {
    volume_test: {
      executor: 'constant-vus',
      vus: 200,
      duration: '30m',
      tags: { test_type: 'volume' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.02'],
  },
};

// 5. Breakpoint Testing Configuration
export const breakpointTestConfig = {
  scenarios: {
    breakpoint_test: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 1000,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '10m', target: 0 },
      ],
      tags: { test_type: 'breakpoint' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.2'],
  },
};

// 6. Multi-Stage Testing Configuration
export const multiStageTestConfig = {
  scenarios: {
    ramp_up: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 10 },
      ],
      tags: { stage: 'ramp-up' },
    },
    steady_state: {
      executor: 'constant-vus',
      vus: 10,
      duration: '10m',
      startTime: '3m',
      tags: { stage: 'steady-state' },
    },
    ramp_down: {
      executor: 'ramping-vus',
      startTime: '13m',
      stages: [
        { duration: '2m', target: 0 },
      ],
      tags: { stage: 'ramp-down' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    'http_req_duration{stage:ramp-up}': ['p(95)<800'],
    'http_req_duration{stage:steady-state}': ['p(95)<600'],
    'http_req_duration{stage:ramp-down}': ['p(95)<1200'],
  },
};

// Configuration selector based on environment variable
const TEST_TYPE = __ENV.TEST_TYPE || 'load';

let selectedConfig;
switch (TEST_TYPE) {
  case 'load':
    selectedConfig = loadTestConfig;
    break;
  case 'stress':
    selectedConfig = stressTestConfig;
    break;
  case 'spike':
    selectedConfig = spikeTestConfig;
    break;
  case 'volume':
    selectedConfig = volumeTestConfig;
    break;
  case 'breakpoint':
    selectedConfig = breakpointTestConfig;
    break;
  case 'multi-stage':
    selectedConfig = multiStageTestConfig;
    break;
  default:
    selectedConfig = loadTestConfig;
}

export const options = selectedConfig;

export default function () {
  const response = http.get('https://test.k6.io/');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  sleep(Math.random() * 2);
}