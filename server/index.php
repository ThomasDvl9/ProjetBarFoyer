<?php

include "./Route.php";
include "/home/profsir/yanngouville/public_html/MiniProjetFoyer/API_Foyer.php";
header("Access-Control-Allow-Origin: *");

$user = "groupe6";
$mdp = "Password1234g6";
$host = "localhost";
$base = "foyerbdd_g6";
$api = new API_Foyer($user, $mdp, $host, $base);

// ensemble des methodes GET

Route::add(
    "/",
    function () {
        echo "welcome ";
    },
    "get"
);

Route::add(
    "/getAvailableProducts",
    function () {
        global $api;
        echo $api->getAvailableProducts();
    },
    "get"
);

Route::add(
    "/getPendingOrders",
    function () {
        global $api;
        echo $api->getPendingOrders();
    },
    "get"
);

Route::add(
    "/validateOrder",
    function () {
        global $api;
        echo $api->validateOrder();
    },
    "get"
);

Route::add(
    "/getTables", 
    function() {

    },
    "get"
);

/*
Route::add('/isAlreadyPreordered',function(){
    global $api;
    echo $api->isAlreadyPreordered();
},'get');

// ensemble des méthodes POST
*/

Route::add(
    "/authentication",
    function () {
        global $api;
        header("Content-Type:application/json");
        echo $api->authentication();
    },
    "post"
);

/*  
Route::add('/order',function(){
    global $api;
    echo $api->order();
},'post');
*/

Route::add(
    "/preorder",
    function () {
        global $api;
        echo $api->preorder();
    },
    "post"
);

/*
// ensemble des methodes PUT

Route::add('/orderReady',function(){
    global $api;
    echo $api->orderReady() ;
},'put');

*/

//gestion des messages d'erreur

Route::pathNotFound(function () {
    echo "Ce chemin n'existe pas";
});

Route::methodNotAllowed(function () {
    echo "Cette méthode n'existe pas";
});

Route::run("/~paulhelleu/MiniProjet/index.php");

?>