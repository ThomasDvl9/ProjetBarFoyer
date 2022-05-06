<?php

require_once "./Route.php";
include "./apiFoyer.php";
include "./mailer.php";
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
        return "Bienvenue sur REST API du groupe6";
    },
    "get"
);

// PRODUITS

Route::add(
    "/getAvailableProducts",
    function () {
        global $api;
        $data = json_decode(file_get_contents('php://input'));

        if ($api->isValidPassword("Gestionnaire", $data->token)) {
            http_response_code(200);
            return $api->getAvailableProducts();
        }
        http_response_code(400);
        return json_encode("invalid token");
    },
    "post"
);

Route::add(
    "/getAvailableProducts",
    function () {
        global $api;
        return $api->getAvailableProducts();
    },
    "get"
);

Route::add(
    "/getProductById",
    function () {
        global $api;
        $id = $_GET["id"];
        if ($id) {
            return $api->getProductById($id);
        }
        http_response_code(400);
    },
    "get"
);

Route::add(
    "/getProductsFromCommandId",
    function () {
        global $api;
        $id = $_GET["id"];
        if ($id) {
            return $api->getProductsFromCommandId($id);
        }
        http_response_code(400);
    },
    "get"
);

Route::add(
    "/updateProduct",
    function () {
        global $api;
        if ($api->updateProduct()) {
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
        if ($api->addProduct()) {
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
        $result = $api->deleteProduct();
        if ($result == -1) {
            http_response_code(400);
            return json_encode("invalid token");
        } else if ($result) {
            http_response_code(200);
            return 1;
        } else {
            http_response_code(400);
            return json_encode("already in command");
        }
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
        if ($id) {
            return $api->getCommandById($id);
        }
    },
    "get"
);

Route::add(
    "/getAllDetailsCommandForCheckedCommand",
    function () {
        global $api;
        return $api->getAllDetailsCommandForCheckedCommand();
    },
    "get"
);

// DETAIL_COMMANDES

Route::add(
    "/getCommandsDetails",
    function () {
        global $api;
        echo $api->getCommandsDetails();
    },
    "get"
);

Route::add(
    "/getCommandDetailByCommandId",
    function () {
        global $api;
        $id = $_GET["id"];
        if ($id) {
            return $api->getCommandDetailByCommandId($id);
        }
        http_response_code(400);
        return 0;
    },
    "get"
);

Route::add(
    "/addCommandDetails",
    function () {
        global $api;

        $datas = $api->addCommand();

        var_dump($datas);

        if ($datas[0] == 0) {
            http_response_code(400);
            return 0;
        }

        if (!$api->addCommandDetails($datas[0])) {
            return 0;
        }

        $token = $api->createCommandToken($datas[0]);

        if (!$token) {
            return 0;
        }

        sendmail($datas[1], $token);

        return 0;
    },
    "post"
);

Route::add(
    "/checkDetailCommand",
    function () {
        global $api;
        if ($api->checkDetailCommand()) {
            http_response_code(200);
            return 1;
        }
        http_response_code(400);
        return 0;
    },
    "post"
);

Route::add(
    "/prepareCommand",
    function () {
        global $api;
        if ($api->prepareCommand()) {
            http_response_code(200);
            return 1;
        }
        http_response_code(400);
        return 0;
    },
    "post"
);

Route::add(
    "/checkValidationTokenCommand",
    function () {
        global $api;
        $cmdid = $api->decodeCommandToken();
        if (!$cmdid) {
            http_response_code(400);
            return 0;
        }

        http_response_code(200);
        return json_encode($cmdid);
    },
    "post"
);

// TABLES

Route::add(
    "/getTable",
    function () {
        global $api;
        $numero = $_GET["num"];
        if ($numero) {
            $res = $api->getTable($numero);
            if ($res) {
                http_response_code(200);
                return $res;
            }
        }
        http_response_code(400);
    },
    "get"
);

Route::add(
    "/getTables",
    function () {
        global $api;
        $data = json_decode(file_get_contents('php://input'));

        if ($api->isValidPassword("Gestionnaire", $data->token)) {
            http_response_code(200);
            return $api->getTables();
        }
        http_response_code(400);
        return json_encode("invalid token");
    },
    "post"
);

Route::add(
    "/getTables",
    function () {
        global $api;
        return $api->getTables();
    },
    "get"
);

Route::add(
    "/addTable",
    function () {
        global $api;
        if ($api->addTable()) {
            return 1;
        }
        return 0;
    },
    "post"
);

Route::add(
    "/updateTable",
    function () {
        global $api;
        // check accessLevel = 0
        $result = $api->updateTable();
        if ($result) {
            return 1;
        }

        return null;
    },
    "post"
);

Route::add(
    "/deleteTable",
    function () {
        global $api;
        $result = $api->deleteTable();
        if ($result == -1) {
            http_response_code(400);
            return json_encode("invalid token");
        } else if ($result) {
            http_response_code(200);
            return 1;
        }
        http_response_code(400);
        return json_encode("already in command");
    },
    "post"
);

// USERS

Route::add(
    "/getPass",
    function () {
        global $api;
        return json_encode($api->getPass());
    },
    "get"
);

Route::add(
    "/getUser",
    function () {
        global $api;
        $result = $api->authentificationUser();
        if ($result) {
            return $result;
        }
        return null;
    },
    "post"
);

Route::add(
    "/getUserAccessLevel",
    function () {
        global $api;
        $result = $api->getUserAccessLevel();
        if ($result) {
            return $result;
        }
        return null;
    },
    "post"
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

Route::run("/foyerbdd");