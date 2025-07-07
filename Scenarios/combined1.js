import http from 'k6/http';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-vus',
      exec: 'contacts',
      vus: 5,
      duration: '5s',
    },
    news: {
      executor: 'per-vu-iterations',
      exec: 'news',
      vus: 5,
      iterations: 10,
      startTime: '10s',
      maxDuration: '20s',
    },
  },
};

export function contacts() {
  http.get('https://test.k6.io/contacts.php', {
    tags: { my_custom_tag: 'contacts' },
  });
}

export function news() {
  http.get('https://test.k6.io/news.php', { tags: { my_custom_tag: 'news' } });
}


