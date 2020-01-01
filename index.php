<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Netatmo geocarte | Cirill Ferrier</title>
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js"></script>
        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css" rel="stylesheet" />
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.2/mapbox-gl-geocoder.min.js"></script>
        <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.4.2/mapbox-gl-geocoder.css"
            type="text/css"
        />
        <!-- Promise polyfill script required to use Mapbox GL Geocoder in IE 11 -->
        <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <nav>
            <div id="map"></div>
            <div class="search">
                <div class="value">9 <span>Km</span></div>
                <input type="range" id="km" min="1" max="9" step="1" value="9">
                <button class="recherche">Recherche météo</button>    
            </div>
        </nav>
        <div class="inner">
            <div id="char">
                <!-- remplie par JS -->
            </div>
            <div id="avg">
                <!-- remplie par JS -->
            </div>
        </div>
        <script src="js/script.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
    </body>
</html>