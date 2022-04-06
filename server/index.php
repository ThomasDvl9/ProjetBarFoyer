<?php

require_once "./Route.php";
// include "/home/profsir/yanngouville/public_html/MiniProjetFoyer/API_Foyer.php";
include "./apiFoyer.php";
header("Access-Control-Allow-Origin: *");

$user = "groupe6";
$mdp = "Password1234g6";
$host = "localhost";
$base = "foyerbdd_g6";
$api = new API_Foyer($base, $user, $mdp, $host);

// ensemble des methodes GET

Route::add(
    "/",
    function () {
        echo "Bienvenue sur REST API du groupe6";
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
    "/getProductById",
    function () {
        global $api;
        $id = $_GET["id"];
        echo $api->getProductById($id);
    },
    "get"
);

Route::add(
    "/addProduct",
    function () {
        global $api;
        $api->addProduct();
        http_response_code(200);
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
    "/getCommandsDetails",
    function() {
        global $api;
        echo $api->getCommandsDetails();
    },
    "get"
);

Route::add(
    "/getCommandDetailById",
    function() {
        global $api;
        echo $api->getCommandDetailById($_GET["id"]);
    },
    "get"
);

Route::add(
    "/getCommandById",
    function () {
        global $api;
        $id = $_GET["id"];
        echo $api->getProductById($id);
    },
    "get"
);

// Route::add(
//     "/validateOrder",
//     function () {
//         global $api;
//         echo $api->validateOrder();
//     },
//     "get"
// );

// Route::add(
//     "/hasAccessLevel",
//     function() {
//         global $api;
//         echo $api->hasAccessLevel();
//     },
//     "get"
// );

Route::add(
    "/getTables", 
    function() {
        global $api;
        echo $api->getTables();
    },
    "get"
);

Route::add(
    "/addTable",
    function() {
        global $api;
        if($api->addTable()) {
            echo 1;
        } else {
            echo 0;
        }
    },
    "post"
);

Route::add(
    "/updateTable",
    function() {
        global $api;
        if (isset($_GET['table'])) {
            // check accessLevel = 0
            $table = $_GET['table'];
            echo $api->addTable($table);
        } else {
            echo null;
        }
    },
    "post"
);

Route::add(
    "/deleteTable",
    function() {
        global $api;
        if (isset($_GET['table'])) {
            // check accessLevel = 0
            $table = $_GET['table'];
            $api->deleteTable($table);
            http_response_code(200);
        } else {
            echo null;
        }
    },
    "get"
    // "delete" ou "get"
);

Route::add(
    "/addCommande",
    function() {
        global $api;
        echo $api->addCommande();
    },
    "post"
);

/*
Route::add('/isAlreadyPreordered',function(){
    global $api;
    echo $api->isAlreadyPreordered();
},'get');

// ensemble des méthodes POST
*/

// Route::add(
//     "/authentication",
//     function () {
//         global $api;
//         header("Content-Type:application/json");
//         echo $api->authentication();
//     },
//     "post"
// );

/*  
Route::add('/order',function(){
    global $api;
    echo $api->order();
},'post');
*/

// Route::add(
//     "/preorder",
//     function () {
//         global $api;
//         echo $api->preorder();
//     },
//     "post"
// );

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