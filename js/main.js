function initializeStreetView() {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': newlocation}, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            latitude = parseFloat(results[0].geometry.location.lat());
            longitude = parseFloat(results[0].geometry.location.lng());
            var fenway = {lat: latitude, lng: longitude};

            for (var i = 0; i < 2; i++) {
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementsByClassName('pano')[i], {
                        position: fenway,
                        pov: {
                            heading: 34,
                            pitch: 10,
                            motionTracking: true
                        }
                    }
                );
            }

        }
    });
    console.log(latitude);
    console.log(longitude);
}