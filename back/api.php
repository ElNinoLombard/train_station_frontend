<?php
include 'db_connect.php';

$request_method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$location = '/sncf/train_station_frontend/back';
$returnData = ['data' => [], 'message' => 'Succes'];

if ($location) {
    $route = str_replace($location, '', $uri);
}

switch ($request_method) {
    case 'GET':
        if (preg_match('/trajets.*/', $route)) {
            if (!empty($_GET['id_gare'])){
              getAllTrajetsByGare($_GET['id_gare']);
            } else {
              getAllTrajets();
            }
        } else if (preg_match('/ca.*/', $route)) {
                getCA();
            }
        break;
    case 'POST':
        if (!empty($_POST['id'])) {
            $id = intval($_POST['id']);

            if (preg_match('/retard.*/', $route)) {
                $duree = intval($_POST['duree']);
                $commentaire = $_POST['commentaire'];
                setRetard($id, $duree, $commentaire );
            } else if (preg_match('/annulation.*/', $route)) {
                $commentaire = $_POST['commentaire'];
                setAnnulation($id, $commentaire);
            }
        } else {
            echo json_encode($returnData['message'] = 'Id manquant');
        }
        break;
    default:
        break;
}

function getAllTrajets() {
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `trajets`
LEFT JOIN models_trajet on models_trajet.id = id_models_trajet
LEFT JOIN trains on trains.id = id_train
ORDER BY models_trajet.depart_heure ASC";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function setTrajet($id_models_trajet, $id_train, $date, $places_reservees) {
    global $connexion;
    global $returnData;

    $query = "INSERT INTO `trajets` (`id`, `id_models_trajet`, `id_train`, `date`, `places_reservees`)
            VALUES (NULL, '$id_models_trajet', '$id_train', '$date', '$places_reservees');";


    if ($returnData['data']) {
        $returnData['message'] = 'PUT réussi';
    } else {
        $returnData['message'] = 'PUT échoué';
    }

    echo json_encode($returnData);
}

function setRetard($id_trajet, $duree, $commentaire) {
    global $connexion;
    global $returnData;

    $query = "INSERT INTO `retards` (`id`, `id_trajet`, `duree`, `commentaire`)
        VALUES (NULL, '$id_trajet', '$duree', '$commentaire')";

    $returnData['data'] = mysqli_query($connexion, $query);

    if ($returnData['data']) {
        $returnData['message'] = 'PUT réussi';
    } else {
        $returnData['message'] = 'PUT échoué';
    }

    echo json_encode($returnData);
}

function setAnnulation($id_trajet, $commentaire) {
    global $connexion;
    global $returnData;

    $query = "INSERT INTO `annulations` (`id`, `id_trajet`, `commentaire`)
        VALUES (NULL, '$id_trajet', '$commentaire')";

    $returnData['data'] = mysqli_query($connexion, $query);

    if ($returnData['data']) {
        $returnData['message'] = 'PUT réussi';
    } else {
        $returnData['message'] = 'PUT échoué';
    }

    echo json_encode($returnData);
}

function getCA() {
    global $connexion;
    global $returnData;

    $query = "SELECT places_reservees, types_train.cout_unitaire, types_train.cout_km, models_trajet.distance FROM `trajets`
LEFT JOIN types_train on types_train.id = id_train
LEFT JOIN annulations on trajets.id = annulations.id_trajet
LEFT JOIN models_trajet on models_trajet.id = id_models_trajet
WHERE annulations.id is null;";

    $result = mysqli_query($connexion, $query);
    if ($result) {
        $ca = 0;
        foreach (mysqli_fetch_all($result, MYSQLI_ASSOC) as $trajet) {
            $ca += $trajet['places_reservees'] * ($trajet['cout_unitaire'] + $trajet['cout_km'] * $trajet['distance']);
        }
        $returnData['data'] = $ca;
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function getAllTrajetsByGare($id_gare) {
    global $connexion;
    global $returnData;

//    $date = new DateTime('now');
  $date = new DateTime('2023-06-08');
  $date_max = $date->format('Y-m-d');
    $date_min = $date->modify("-1 day")->format('y-m-d');

    $query = "SELECT date, places_reservees, depart_lieu, depart_heure, arrivee_lieu, arrivee_heure, places_max, trains.nom as nom_train, gares.nom as nom_gare, ville FROM `trajets`
LEFT JOIN models_trajet on models_trajet.id = id_models_trajet
LEFT JOIN trains on trains.id = id_train
LEFT JOIN gares on gares.id = models_trajet.depart_lieu or gares.id = models_trajet.arrivee_lieu
WHERE date = '$date_min' or date = '$date_max' AND gares.id = $id_gare
ORDER BY models_trajet.depart_heure ASC;";
    $result = mysqli_query($connexion, $query);
    if ($result) {
      $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
      $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}
