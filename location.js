function getCurrentLocation() {
    return new Promise((resolve, reject) => { //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
        if (!navigator.geolocation) {
            reject('Twoja przeglądarka nie wspiera usług lokalizacji bądź lokalizacja jest zablokowana');
        } else {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                }),
                error => reject(error.message),
                {
                    enableHighAccuracy: true,
                    maximumAge: 10000,
                    timeout: 10000
                }
            );
        }
    });
}

/*getCurrentLocation()
    .then(location => console.log('Current location:', location))
    .catch(error => console.error('Error getting location:', error)); */
    