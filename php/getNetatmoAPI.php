<?php
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    session_start();

    if (
        isset($_GET['lat_ne']) &&
        isset($_GET['lon_ne']) &&
        isset($_GET['lat_sw']) &&
        isset($_GET['lon_sw']) 
    ) {
        // On recurpere un token pour appelle a https://api.netatmo.com/api/getpublicdata
        // cependant si on a deja un token, il n'est pas utilise dans recup un nouveaux
        // (pour faire les chose bien il vaudrais garder la duré de vie du token et en recup
        //  un nouveaux si il n'est plus valide)

        if(!isset($_SESSION['token'])) {
            // les donne devrais etre recup en base de donnée  
            $client_id     = 'REPLACE_HERE_YOUR_DATA';
            $client_secret = 'REPLACE_HERE_YOUR_DATA';
            $username      = 'REPLACE_HERE_YOUR_DATA';
            $password      = 'REPLACE_HERE_YOUR_DATA';

            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.netatmo.com/oauth2/token",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => 
                    "client_id="            .$client_id.
                    "&client_secret="       .$client_secret.
                    "&grant_type=password"  .
                    "&username="            .$username.
                    "&password="            .$password,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/x-www-form-urlencoded"
                ),
            ));

            $_SESSION['token'] = json_decode(curl_exec($curl))->access_token;
            curl_close($curl);
        }

        $lat_ne = $_GET['lat_ne'];
        $lon_ne = $_GET['lon_ne'];
        $lat_sw = $_GET['lat_sw'];
        $lon_sw = $_GET['lon_sw'];

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://api.netatmo.com/api/getpublicdata?".
                "lat_ne=" . $lat_ne. 
                "&lon_ne=". $lon_ne.
                "&lat_sw=". $lat_sw.
                "&lon_sw=". $lon_sw.
                "&filter=true&required_data=temperature",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer ". $_SESSION['token'] 
            ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);
        echo $response;

    }

    


?>