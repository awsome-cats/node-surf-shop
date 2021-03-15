require('dotenv').config()
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_BOX_TOKEN})

async function geoCorder (location) {
    try {
        let response = await geocodingClient
        .forwardGeocode({
            query:location,
            limit: 1
        })
         .send();
        //  console.log('resp', response.body.features[0].geometry.coordinates)

    } catch(err) {
        console.log('err', err.message)
    }
}
geoCorder('Tokyo, Japan')



/**
 * NOTE: Map box skd
 * 場所を検索すると、取得できる
 * TEST: このテストファイルでためす
 * node mapbox-test.js
 */

        // geocodingClient
        // .forwardGeocode({
        //     query: 'paris, France',
        //     limit: 1
        // })
        //  .send()
        // .then(response => {
        //     const match = response.body;
        //     console.log('match', match.features[0].geometry)
        // })

        /**
         * RESULT:
         * match { type: 'Point', coordinates: [ 2.35183, 48.85658 ] }
         * NOTE: DBのtypeがわかる
         */



