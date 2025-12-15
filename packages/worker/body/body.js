const body = async (request) => {
  /POST|PUT/i.test(request.method) &&
    /application\/json/i.test(request.headers.get("Content-Type")) &&
    Object.assign(body, await request.json());
};

export default body;
