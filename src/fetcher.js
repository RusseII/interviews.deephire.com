const root = 'https://a.deephire.com';

const fetcher = async url => {
  const res = await fetch(`${root}${url}`, { method: 'GET' });

  if (!res.ok) {
    throw new Error('Error status code');
  }
  return res.json();
};

export default fetcher;
