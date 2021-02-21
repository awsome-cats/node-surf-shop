# Geocoding Post Address and Adding Its Marker to the Map

## Update Post Model

remove lat and lng add coordinaates: Array

```js
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.ACCESSTOKEN )}
```

- update create (POST) method

```js
let response = await geocodingClient
.forwardGeocode({
query: req.body.post.location,
limit: 1
})
.send();
```

- Assign the response's  coordinates to req.body.post.coordinates
- Sae the post

# Update the Posts Show View

- Remove geojson object
- remove forEach loop over geoson.features
- Assign post variable from EJS local variable
- Update marker to use post instead
