<?php

require_once "./Route.php";
// include "/home/profsir/yanngouville/public_html/MiniProjetFoyer/API_Foyer.php";
include "./apiFoyer.php";
header("Access-Control-Allow-Origin: *");

$user = "paul";
$mdp = "Password123!";
$host = "localhost";
$base = "foyerbdd";
$api = new API_Foyer($base, $user, $mdp, $host);

// ensemble des methodes GET

Route::add(
    "/",
    function () {
        echo "Bienvenue sur REST API du groupe6";
    },
    "get"
);

// PRODUITS

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
    "/updateProduct",
    function () {
        global $api;
        if($api->updateProduct()) {
            echo 1;
        } else {
            echo 0;
        }
    },
    "post"
);

Route::add(
    "/addProduct",
    function () {
        global $api;
        if($api->addProduct()) {
            echo 1;
        } else {
            echo 0; 
        }
    },
    "post"
);

Route::add(
    "/deleteProduct",
    function () {
        global $api;
        $product = $_GET['table'];
        if($product) {
            if($api->deleteProduct($product)) {
                http_response_code(200);
                echo 1;
                return 1;
            }
        } 
        http_response_code(400);
        echo 0;
    },
    "post"
);

// COMMANDES

Route::add(
    "/getPendingOrders",
    function () {
        global $api;
        echo $api->getPendingOrders();
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

// DETAIL_COMMANDES

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
    "/addCommandDetails",
    function() {
        global $api;
        $id = $api->addCommand();
        if($id && $api->addCommandDetails($id)) {
            echo 1;
            return 1;
        }
        echo 0;
        return 0;
    },
    "post",
);

// TABLES

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
    "update"
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

// USERS

Route::add(
    "/getUserAccessLevel",
    function() {
        global $api;
        if($api->getUserAccessLevel()) {
            echo $api->getUserAccessLevel();
        } else {
            echo 0;
        }
    },
    "post",
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

// gestion des messages d'erreur

Route::pathNotFound(function () {
    echo "Ce chemin n'existe pas";
});

Route::methodNotAllowed(function () {
    echo "Cette méthode n'existe pas";
});

Route::run("/apifoyer");

?>