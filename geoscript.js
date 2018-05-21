var myPlaces = [
    {
        lat: 18.9221484,
        lon: 72.8343463,
        name: "Mumbai,India",
        address:"Nariman Point,Mumbai,India"
       

    },
    {
        lat: 40.7127753,
        lon: -74.0059728,
        name: "New York,United States",
        address:"Broadway,Brooklyn,NY,U.S.A"
       

    }, {
        lat: -37.8193707,
        lon: 144.9599253,
        name: "Melbourne,Australia",
        address:"Blackburn,ViC ,Australia"
       

    },
    {
        lat: 37.3306668,
        lon: -121.9045668,
        name: "Sanjose, United States",
        address:"Winchester Blvd,Sanjose, CA,U.S.A"
      
    }
];
var capturedLocation = {
    capturedLatitue: "Not Available",
    capturedLongitue: "Not Available",
    map: null
}
/* Calculate distance between two points in Earth in KM */
/* Calculate distance between two points in Earth in KM */
function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);

    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
document.addEventListener("DOMContentLoaded", function () {

    var showMap = document.querySelector("#showMap");
    var userCurrentLocation = document.querySelector("#userCurrentLocation");
    var myAllPlaces = document.querySelector("#myAllPlaces");


    showMap.addEventListener("click", function () {

        if (this.innerHTML == "Show Map") {
            this.innerHTML = "Hide Map";
            document.getElementById('map').style.display = "block";

            return;
        }
        this.innerHTML = "Show Map";
        document.getElementById('map').style.display = "none";

    });
    userCurrentLocation.addEventListener("click", function () {
        this.innerHTML = "Lat:" + capturedLocation.capturedLatitue.toFixed(2) + "<br>Lon:" + capturedLocation.capturedLongitue.toFixed(2) + " ";
    });
    myAllPlaces.addEventListener("click", function () {
        //get i and content for infowindow
        function markerMaker(i,infoContent){
            var marker = new google.maps.Marker({
                position: {
                    lat: myPlaces[i].lat,
                    lng: myPlaces[i].lon
                },
                map: capturedLocation.map,
                title: myPlaces[i].name
            });
            capturedLocation.map.setZoom(2);
            
            //use content here in infowindow instance
            var infowindow = new google.maps.InfoWindow({
                content:infoContent
            });
            //add event listerner to marker
              marker.addListener('click', function() {
                infowindow.open(capturedLocation.map, marker);
            });   

        }

        for (var i = 0; i < myPlaces.length; i++) {
            //get the distance between captured location and current location in myplaces loop
           var d = getDistance(capturedLocation.capturedLatitue, capturedLocation.capturedLongitue, myPlaces[i].lat, myPlaces[i].lon);
          
           //make content for infowindow object //
           var content= "<p>Distance in miles(approx) : "+(d/1.6).toFixed(1)+"<br>"+myPlaces[i].address+"</p>";
           //pass content to marker maker function
           markerMaker(i,content);             

        }
    });

});

//get user location called by google script api call back///

function initMap() {
    //map instance  
    capturedLocation.map = new google.maps.Map(document.getElementById('map'));
    //set zoom level on map instance
    capturedLocation.map.setZoom(6);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            capturedLocation.capturedLatitue = position.coords.latitude;//global level variable without var
            capturedLocation.capturedLongitue = position.coords.longitude; //global level variable without var

            //set lat and lon for map center
            capturedLocation.map.setCenter({ lat: capturedLocation.capturedLatitue, lng: capturedLocation.capturedLongitue });
            //marker instance
            var marker = new google.maps.Marker({
                position: {
                    lat: capturedLocation.capturedLatitue,
                    lng: capturedLocation.capturedLongitue
                },
                map: capturedLocation.map,
                title: "Your Current Location"
            });

        }, function () {
            alert("We can not locate you.")
        }, {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 60000
            });
    }


}


