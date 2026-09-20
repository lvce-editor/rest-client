# REST client

Open a `.rest` file containing a method and URL, for example:

```http
GET https://example.com/api
```

Edit the method or URL and click **Run** to inspect the response status, headers, and body. Each open file keeps its own request state.

Requests run in a browser worker and follow the endpoint's CORS policy. HTTPS endpoints and local HTTP services at `localhost` or `127.0.0.1` are supported.

## Contributing

```sh
git clone git@github.com:lvce-editor/rest-client.git &&
cd rest-client &&
npm ci &&
npm test
```
