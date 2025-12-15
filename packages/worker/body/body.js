async function body(request) {
  const data = /POST|PUT/i.test(request.method) &&
    /application\/json/i.test(request.headers.get("Content-Type"))
    ? await request.json()
    : {};

  Object.keys(data).forEach(key => {
    Object.defineProperty(body, key, {
      value: data[key],
      writable: true,
      configurable: true,
      enumerable: true
    });
  });
}

export default body;
