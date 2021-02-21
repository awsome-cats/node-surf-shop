require('dotenv').config()
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.ACCESSTOKEN})

async function geoCorder (location) {
    try {
        let response = await geocodingClient
        .forwardGeocode({
            query:location,
            limit: 1
        })
         .send();
         console.log('resp', response.body.features[0].geometry.coordinates)

    } catch(err) {
        console.log('err', err.message)
    }
}
geoCorder('Tokyo, Japan')


