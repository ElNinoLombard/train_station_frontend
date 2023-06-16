<?php
include 'db_connect.php';

$request_method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$location = '/sncf/train_station_frontend/back/api.php';
$returnData = ['data' => [], 'message' => 'Succes'];

if ($location) {
    $route = str_replace($location, '', $uri);
}

switch ($request_method) {
    case 'GET':
        if (preg_match('/trajets.*/', $route)) {
            if (!empty($_GET['id_gare'])) {
                getAllTrajetsByGare($_GET['id_gare']);
            } else {
                getAllTrajets();
            }
        } else if (preg_match('/ca.*/', $route)) {
            getCA();
        } else if (preg_match('/gare.*/', $route)) {
            getAllGares();
        } else if (preg_match('/retard.*/', $route)) {
            if (!empty($_GET['id'])) {
                getRetardByTrajet($_GET['id']);
            } else {
                getAllRetards();
            }
        } else if (preg_match('/annulation.*/', $route)) {
            if (!empty($_GET['id'])) {
                getAnnulationByTrajet($_GET['id']);
            } else {
                getAllAnnulations();
            }
        }

        break;
    case 'POST':
        if (!empty($_POST['id'])) {
            $id = intval($_POST['id']);

            if (preg_match('/retard.*/', $route)) {
                $duree = intval($_POST['duree']);
                $commentaire = $_POST['commentaire'];
                setRetard($id, $duree, $commentaire);
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

function getAllTrajets()
{
    global $connexion;
    global $returnData;

    //$date = date('Y-m-d');
    $date = '2023-06-08';
    $query = "SELECT trajets.id as id_trajet, date, places_reservees, g1.nom as gare_depart, g1.ville as ville_depart, depart_heure, g2.nom as gare_arrivee, g2.ville as ville_arrivee, arrivee_heure, places_max, trains.nom as nom_train, SUM(retards.duree) as retards, annulations.id as annulations FROM `trajets`

LEFT JOIN models_trajet on models_trajet.id = id_models_trajet
LEFT JOIN trains on trains.id = id_train
LEFT JOIN gares as g1 on g1.id = models_trajet.depart_lieu
LEFT JOIN gares as g2 on g2.id = models_trajet.arrivee_lieu
LEFT JOIN retards on retards.id_trajet = trajets.id
LEFT JOiN annulations on annulations.id_trajet = trajets.id
GROUP BY trajets.id, annulations.id
ORDER BY models_trajet.depart_heure ASC;";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function setTrajet($id_models_trajet, $id_train, $date, $places_reservees)
{
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

function setRetard($id_trajet, $duree, $commentaire)
{
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

function setAnnulation($id_trajet, $commentaire)
{
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

function getCA()
{
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

function getAllTrajetsByGare($id_gare)
{
    global $connexion;
    global $returnData;

    //    $date = new DateTime('now');
    $date = new DateTime('2023-06-08');
    $date_max = $date->format('Y-m-d');
    $date_min = $date->modify("-1 day")->format('y-m-d');

    $query = "SELECT trajets.id AS id_trajet, date, places_reservees, g1.nom AS gare_depart, g1.ville AS ville_depart, depart_heure, g2.nom AS gare_arrivee, g2.ville AS ville_arrivee, arrivee_heure, places_max, trains.nom AS nom_train, SUM(retards.duree) AS retards, annulations.id AS annulations
FROM `trajets`
LEFT JOIN models_trajet ON models_trajet.id = trajets.id_models_trajet
LEFT JOIN trains ON trains.id = trajets.id_train
LEFT JOIN gares AS g1 ON g1.id = models_trajet.depart_lieu
LEFT JOIN gares AS g2 ON g2.id = models_trajet.arrivee_lieu
LEFT JOIN retards ON retards.id_trajet = trajets.id
LEFT JOIN annulations ON annulations.id_trajet = trajets.id
WHERE date IN ('$date_min', '$date_max') AND (g1.id = $id_gare OR g2.id = $id_gare)
GROUP BY trajets.id, annulations.id;";
    $result = mysqli_query($connexion, $query);
    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function getAllGares()
{
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `gares`";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function getAllRetards()
{
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `retards`";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}
function getRetardByTrajet($id_trajet)
{
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `retards` WHERE id_trajet = $id_trajet";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}

function getAllAnnulations()
{
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `annulation`";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}
function getAnnulationByTrajet($id_trajet)
{
    global $connexion;
    global $returnData;

    $query = "SELECT * FROM `annulations` WHERE id_trajet = $id_trajet";
    $result = mysqli_query($connexion, $query);

    if ($result) {
        $returnData['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
    } else {
        $returnData['message'] = mysqli_connect_error();
    }

    echo json_encode($returnData);
}
