import http from 'k6/http';

const scenarios = {
  my_web_test: {
    executor: 'per-vu-iterations',
    vus: 1,
    iterations: 1,
    maxDuration: '30s',
  },
  my_api_test: {
    executor: 'per-vu-iterations',
    vus: 1,
    iterations: 1,
    maxDuration: '30s',
  },
};

const { SCENARIO } = __ENV;
export const options = {
  // if a scenario is passed via a CLI env variable, then run that scenario. Otherwise, run
  // using the pre-configured scenarios above.
  scenarios: SCENARIO ? { [SCENARIO]: scenarios[SCENARIO] } : scenarios,
  discardResponseBodies: true,
  thresholds: {
    http_req_duration: ['p(95)<250', 'p(99)<350'],
  },
};

export default function () {
  const response = http.get('https://quickpizza.grafana.com');
}


