// ================ //
function getXDomainRequest() {
    var xdr = null;

    if (window.XDomainRequest) {
        xdr = new XDomainRequest();
    } else if (window.XMLHttpRequest) {
        xdr = new XMLHttpRequest();
    } else {
        alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
    }

    return xdr;
}

var tabTemparature   = [];
var taHumidity       = [];
var tabPresure       = [];
var tabWind_strength = [];
var tabWind_angle    = [];

var marker = [];

function getTemperature(json) {
    json.forEach(station => {
        for (let key in station.measures) {

            if (station.measures[key].wind_strength != undefined){
                tabWind_strength.push(station.measures[key].wind_strength);
            }
            if (station.measures[key].wind_angle != undefined) {
                tabWind_angle.push(station.measures[key].wind_angle);
            }

            for (let key2 in station.measures[key].res) {

                if (station.measures[key].type[0] == 'temperature') { 
                    tabTemparature.push(station.measures[key].res[key2][0]);
                }

                if (station.measures[key].type[1] == 'humidity') {
                    taHumidity.push(station.measures[key].res[key2][1])
                }

                if (station.measures[key].type[0] == 'pressure') {
                    tabPresure.push(station.measures[key].res[key2][0])
                }
            }
        }
    });
}

function setMarker(json) {
    json.forEach(station => {
        marker.push(new mapboxgl.Marker()
            .setLngLat([station.place.location[0], station.place.location[1]])
            .addTo(map)
        );
    });
}

function setChar() {
    document.getElementById('char').innerHTML = `<canvas id="tempChar" width="100" height="20vh" style='color:#fff'></canvas>`;
    var ctx = document.getElementById('tempChar').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tabTemparature,
            datasets: [{
                label: 'Relever des stations',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 255, 255)',
                fillColor: "rgba(255,255,255,1)",
                data: tabTemparature
            }]
        },
        options: {
            responsive: true,
            defaultFontColor : '#fff',
            labelColor: "#fff",
            legend: {
                font: {
                    color: "#fff"
                }
            },
            scaleFontColor: "#fff",
        }
    });
}

function calculAvg(data) {
    avg = 0
    for (let i = 0; i < data.length; i++) {
        avg += data[i];
    }
    return avg / data.length
}

function setdivAvg(value, span, unit) {
    document.getElementById('avg').innerHTML += `<div><div>
                                                    <div>${value} <span>${unit}</span></div>
                                                    <div>${span}</div>
                                                 </div></div>`
}

function setBackground() {
    let str  = '';
    let temp = calculAvg(tabTemparature);
    if (temp < 0)       str = 'snow%20landscape';
    else if (temp < 10) str = 'cold%20landscape';
    else if (temp < 20) str = 'spring%20landscape';
    else if (temp > 20) str = 'summer%20landscape';
    

    document.querySelector('body').setAttribute('style', `background: url('https://source.unsplash.com/1600x900/?${str}'`);
}

function setAvg(nbStation) {
    document.getElementById('avg').innerHTML = '';
    setdivAvg(nbStation, 'Stations', '');
    
    if (tabTemparature.length != 0)     setdivAvg(calculAvg(tabTemparature).toFixed(2),    'Temperature',              '°C');
    if (taHumidity.length != 0)         setdivAvg(calculAvg(taHumidity).toFixed(2),        'Humidité',                 '%');
    if (tabPresure.length != 0)         setdivAvg(calculAvg(tabPresure).toFixed(0),        'Pression admospherique',   'mbar');
    if (tabWind_strength.length != 0)   setdivAvg(calculAvg(tabWind_strength).toFixed(2),  'Force du vent',            'kph');
    if (tabWind_angle.length != 0)      setdivAvg(calculAvg(tabWind_angle).toFixed(0),     'Direction du vent',        'deg');
}

function createHTML(json, nbStation) {
    document.querySelector('body').setAttribute('class', 'open');
    map.resize();
    getTemperature(json);
    
    setChar();
    setAvg(nbStation);
    setBackground();

    // ** Ne fonctionne pas nivaux design ** //
                // setMarker(json);
}

// ================ //

mapboxgl.accessToken = 'pk.eyJ1IjoiY2lyaWxsIiwiYSI6ImNrMjF4bW9zNzFlcmUzbXVnYWQzM2gxYzkifQ._-HCvw4kSIIjw5WV5xUTzQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [6.061707500000011, 44.579727060706944],
    zoom: 10
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);

var km = document.getElementById('km');
var rangeValue = function () {
    var newValue = km.value;
    var target = document.querySelector('.value');
    target.innerHTML = newValue + ' <span>Km</span>';
}
km.addEventListener("input", rangeValue);

document.querySelector('.recherche').addEventListener('click', function() {
    let coor = map.getCenter();
    // console.log(coor);
    let lat_ne = coor.lat + (km.value /2  / 100);
    let lon_ne = coor.lng + (km.value / 2 / 100); 
    let lat_sw = coor.lat - (km.value / 2 / 100);
    let lon_sw = coor.lng - (km.value / 2 / 100);

    tabTemparature   = [];
    taHumidity       = [];
    tabPresure       = [];
    tabWind_strength = [];
    tabWind_angle    = [];

    // console.log(lat_ne);

    var xdr = getXDomainRequest();
    xdr.onload = function () {
        json = JSON.parse(xdr.responseText);
        // console.log(json);
        if (json.body.length >= 3) {
            createHTML(json.body, json.body.length);
        }
        else {
            alert(`=== Nombre de station trouvé : ` + json.body.length + ` ===\nMerci de cherché dans une zone plus large ou dans un autre secteur proche\n\n(min : 3 stations)`)
        }
    }

    xdr.open("GET", `http://miw.asheart.fr/Weather/php/getNetatmoAPI.php?lat_ne=${lat_ne}&lon_ne=${lon_ne}&lat_sw=${lat_sw}&lon_sw=${lon_sw}`);
    xdr.send();
});


