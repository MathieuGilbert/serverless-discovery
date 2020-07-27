# Picture Service

Sample request:

POST:

`https://API_URL_ID.appsync-api.us-west-2.amazonaws.com/graphql`

Headers:

`x-api-key: API_KEY_VALUE`

Body:
```
query getPictures($query: String!) {
    getPictures(query: $query) {
        id
        tags
        previewURL
        previewWidth
        previewHeight
        webformatURL
        webformatWidth
        webformatHeight
    }
}
```

Variables:
```
{
    "query": "flowers"
}
```