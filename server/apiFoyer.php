<?php

define("MINUTES_CMD", 15);
define("MINUTES_AUTH", 90);

class API_Foyer
{

  private $PDO;

  public function __construct($base, $username, $password, $host)
  {
    try {
      $this->PDO = new PDO("mysql:dbname=" . $base . ";host=" . $host, $username, $password);
    } catch (Exception $err) {
      echo "erreur db : " . utf8_encode($err->getMessage()) . "<br/>";
    }
  }

  // PRODUITS

  public function getAvailableProducts()
  {
    try {
      $result = $this->PDO->query("SELECT * FROM produits")
        ->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $err) {
      $result = null;
    }

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function getProductById($id)
  {
    try {
      $result = $this->PDO->query("SELECT * FROM produits WHERE id_produit = $id")
        ->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $err) {
      $result = null;
    }

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function getProductsFromCommandId($cmdid)
  {
    try {
      $result = $this->PDO->query("SELECT id_produit FROM detail_commandes WHERE id_commande = $cmdid")
        ->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $err) {
      return 0;
    }

    $productsTab = array();

    foreach ($result as $id) {
      $pid = $id["id_produit"];
      $productQuery = $this->PDO->query("SELECT * FROM produits WHERE id_produit = $pid");
      $product = $productQuery->fetchAll(PDO::FETCH_ASSOC);

      array_push($productsTab, $product);
    }

    return json_encode($productsTab ? $productsTab : null, JSON_UNESCAPED_UNICODE);
  }

  public function updateProduct()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $id = $datas->id;
    $nom = $datas->nom;
    $prix = $datas->prix;
    $quantite = $datas->quantite;
    $peremption = $datas->peremption;
    $illustration = $datas->illustration;
    $token = $datas->token;

    if (!$this->isValidPassword("Gestionnaire", $token)) {
      http_response_code(400);
      return 0;
    }

    if ($id && $nom && $prix && $quantite && $peremption && $illustration) {
      $this->PDO->query("UPDATE produits SET denomination = '$nom', qt_dispo = $quantite, prix = $prix, peremption = '$peremption', illustration = '$illustration' WHERE id_produit = $id");
      http_response_code(200);
      return 1;
    } else {
      http_response_code(400);
      return 0;
    }
  }

  public function addProduct()
  {
    $data = json_decode(file_get_contents('php://input'));

    $nom = $data->nom;
    $prix = $data->prix;
    $quantite = $data->quantite;
    $peremption = $data->peremption;
    $illustration = $data->illustration;
    $password = $data->token;

    if (!$this->isValidPassword("Gestionnaire", $password)) {
      http_response_code(400);
      return 0;
    }

    if ($nom && $prix && $quantite && $peremption && $illustration) {
      $this->PDO->exec("INSERT INTO produits (denomination, prix, qt_dispo, peremption, illustration) 
          VALUES ('$nom', $prix, $quantite, '$peremption', '$illustration')");
      http_response_code(200);
      return 1;
    }

    http_response_code(400);
    return 0;
  }

  public function commandProductFromCommand($cmdid)
  {
    $commandeDetails = $this->PDO->query("SELECT id_produit, qt_commandee FROM detail_commandes WHERE id_commande = $cmdid")->fetchAll(PDO::FETCH_ASSOC);

    if (!$commandeDetails) {
      http_response_code(400);
      return 0;
    }

    foreach ($commandeDetails as $commandeDetail) {
      $pid = $commandeDetail["id_produit"];
      $qt = $commandeDetail["qt_commandee"];
      $qtProduit = $this->PDO->query("SELECT qt_dispo FROM produits WHERE id_produit = $pid")->fetchAll(PDO::FETCH_ASSOC);

      if (!$qtProduit) {
        http_response_code(400);
        return 0;
      }

      if ((int) $qt > (int) $qtProduit[0]["qt_dispo"]) {
        http_response_code(401);
        return 0;
      }
    }

    foreach ($commandeDetails as $commandeDetail) {
      $pid = $commandeDetail["id_produit"];
      $qt = $commandeDetail["qt_commandee"];
      $this->PDO->exec("UPDATE produits SET qt_dispo = qt_dispo - $qt WHERE id_produit = $pid");
    }

    http_response_code(200);
    return 1;
  }

  public function deleteProduct()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $id = $datas->id;
    $token = $datas->token;

    if (!$this->isValidPassword("Gestionnaire", $token)) {
      http_response_code(400);
      return -1;
    }

    if ($id) {
      return $this->PDO->exec("DELETE FROM produits WHERE id_produit = $id");
    }

    http_response_code(400);
    return json_encode("Data no valid");
  }

  // COMMANDES

  public function getCommandById($cmdid)
  {
    $objPDOStatement = $this->PDO->query("SELECT * FROM commandes WHERE id_commande = $cmdid");

    $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function getPendingOrders()
  {
    $objPDOStatement = $this->PDO->query("SELECT * FROM commandes");

    $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function getAllDetailsCommandForCheckedCommand()
  {
    $commandes = $this->PDO->query("SELECT * FROM commandes WHERE confirmee = 1 AND preparee = 0")
      ->fetchAll(PDO::FETCH_ASSOC);

    $tables = array();
    $commandesDetails = array();

    foreach ($commandes as $commande) {
      $tableid = $commande["id_table"];
      $table = $this->PDO->query("SELECT numero FROM tables WHERE id_table = $tableid")
        ->fetchAll(PDO::FETCH_ASSOC);
      array_push($tables, $table[0]["numero"]);

      $cmdid = $commande["id_commande"];
      $commandeDetails = $this->PDO->query("SELECT * FROM detail_commandes WHERE id_commande = $cmdid")
        ->fetchAll(PDO::FETCH_ASSOC);
      array_push($commandesDetails, $commandeDetails);
    }

    $produits = $this->PDO->query("SELECT * FROM produits")
      ->fetchAll(PDO::FETCH_ASSOC);

    $result = array();
    array_push($result, $commandes, $tables, $commandesDetails, $produits);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function addCommand()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $date = date("Y-m-d H:i:s");
    $email = $datas->email;
    $table = $datas->table;

    if ($date && $email) {
      $this->PDO->query("INSERT INTO commandes 
          (id_table, email, confirmee, preparee, dateCommande) 
          VALUES ($table, '$email', 0, 0, '$date')");

      http_response_code(200);
      return $this->PDO->lastInsertId();
    }

    http_response_code(400);
    return 0;
  }

  public function confirmCommand($id)
  {
    try {
      $query = $this->PDO->query("UPDATE commandes SET confirmee = '1' WHERE id_commande = $id");
    } catch (Exception $err) {
      return 0;
    }
    if ($query) {
      http_response_code(200);
      return 1;
    }
    http_response_code(400);
    return 0;
  }

  public function prepareCommand()
  {
    $data = json_decode(file_get_contents('php://input'));

    $id = $data->id;
    $token = $data->token;

    if (!($id && $token)) {
      return 0;
    }

    if (!($this->isValidPassword("Barman", $token) || $this->isValidPassword("Gestionnaire", $token))) {
      return 0;
    }

    try {
      $query = $this->PDO->query("UPDATE commandes SET preparee = '1' WHERE id_commande = $id");
    } catch (Exception $err) {
      return 0;
    }

    if (!$query) {
      return 0;
    }

    return 1;
  }

  // DETAILS COMMANDES

  public function getCommandsDetails()
  {
    $objPDOStatement = $this->PDO->query("SELECT * FROM detail_commandes");

    $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function getCommandDetailByCommandId($id)
  {
    $result = $this->PDO->query("SELECT * FROM detail_commandes WHERE id_commande = $id")
      ->fetchAll(PDO::FETCH_ASSOC);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function addCommandDetails($cmdid)
  {
    $data = json_decode(file_get_contents('php://input'));

    $productList = $data->productList;

    if (!($cmdid && $productList)) {
      http_response_code(400);
      return 0;
    }

    foreach ($productList as $id => $qt) {
      if (((int) $qt % 1)) {
        http_response_code(400);
        return 0;
      }
    }

    foreach ($productList as $id => $qt) {
      $this->PDO->exec("INSERT INTO detail_commandes 
          (id_commande, id_produit, qt_commandee, cochee) 
          VALUES ($cmdid, $id, $qt, 0)");
    }

    http_response_code(200);
    return 1;
  }

  public function checkDetailCommand()
  {
    $data = json_decode(file_get_contents('php://input'));

    $id = $data->id;
    $token = $data->token;

    if (!($id && $token)) {
      return 0;
    }

    if (!($this->isValidPassword("Barman", $token) || $this->isValidPassword("Gestionnaire", $token))) {
      return 0;
    }

    try {
      $query = $this->PDO->query("UPDATE detail_commandes SET cochee = '1' WHERE id_detail = $id");
    } catch (Exception $err) {
      return 0;
    }

    if (!$query) {
      return 0;
    }

    return 1;
  }

  // TABLES

  public function getTable($numero)
  {
    $objPDOStatement = $this->PDO->query("SELECT * FROM tables WHERE numero = $numero");

    $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    if ($result) {
      return json_encode($result, JSON_UNESCAPED_UNICODE);
    }

    return 0;
  }

  public function getTables()
  {
    $objPDOStatement = $this->PDO->query("SELECT * FROM tables");

    $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
  }

  public function addTable()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $num = $datas->num;
    $lien = $datas->lien;
    $token = $datas->token;

    if (!$this->isValidPassword("Gestionnaire", $token)) {
      http_response_code(400);
      return 0;
    }

    if ($num && $lien) {
      $objPDOStatement = $this->PDO->exec("INSERT INTO tables (numero, lien_QRcode) VALUES ($num, $lien)");
      if ($objPDOStatement) {
        http_response_code(200);
        return 1;
      }
    }

    http_response_code(400);
    return 0;
  }

  public function updateTable()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $id = $datas->id;
    $num = $datas->num;
    $lien = $datas->lien;
    $token = $datas->token;

    if (!$this->isValidPassword("Gestionnaire", $token)) {
      http_response_code(400);
      return 0;
    }

    if ($id && $num != '' && $lien != '') {
      try {
        $this->PDO->query("UPDATE tables SET numero = '$num', lien_QRcode = '$lien' WHERE id_table = $id");
      } catch (Exception $err) {
        return 0;
      }
      http_response_code(200);
      return 1;
    }

    http_response_code(400);
    return 0;
  }

  public function deleteTable()
  {
    $datas = json_decode(file_get_contents('php://input'));

    $id = $datas->id;
    $token = $datas->token;

    if (!$this->isValidPassword("Gestionnaire", $token)) {
      http_response_code(400);
      return -1;
    }

    if ($id) {
      return $this->PDO->query("DELETE FROM tables WHERE id_table = $id");
    }

    http_response_code(400);
    return json_encode("Data no valid");
  }

  // Authentification

  public function createPass()
  {
    $pass = base64_encode(random_bytes(150));
    $query = $this->PDO->query("UPDATE pass SET passcode = '$pass' WHERE id = 1");
    if ($query) {
      return $pass;
    }
    return 0;
  }

  public function getPass()
  {
    try {
      $pass = $this->PDO->query("SELECT passcode FROM pass WHERE id = 1")
        ->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $err) {
      return 0;
    }
    return $pass ? $pass[0]["passcode"] : null;
  }

  public function isValidPassword($role, $password)
  {
    try {
      $result = $this->PDO->query("SELECT _password FROM users WHERE _login = '$role'")
        ->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $err) {
      return 0;
    }

    if (!$result) {
      return 0;
    }

    $validToken = md5($result[0]["_password"] . $this->getPass());

    if ($password == $validToken) {
      return 1;
    }

    return 0;
  }

  public function authentificationUser()
  {
    $data = json_decode(file_get_contents('php://input'));

    $id = $data->id;
    $password = strtoupper(md5($data->password));

    if (!$this->isValidPassword($id, $password)) {
      return 0;
    }

    if ($id) {
      $result = $this->PDO->query("SELECT accessLevel FROM users WHERE _login = '$id'")
        ->fetchAll(PDO::FETCH_ASSOC);

      $this->createPass();

      return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
    }

    return 0;
  }

  public function getUserAccessLevel()
  {
    $data = json_decode(file_get_contents('php://input'));

    $uid = $data->uid;

    if ($uid) {
      $result = $this->PDO->query("SELECT accessLevel FROM users WHERE id_user = '$uid'")
        ->fetchAll(PDO::FETCH_ASSOC);

      return json_encode($result ? $result : null, JSON_UNESCAPED_UNICODE);
    }

    return null;
  }

  public function createToken($id, $validity_timer)
  {
    // if pass est le meme
    $content = $id . "." . $validity_timer;

    $encrypt_method = "AES-256-CBC";
    $key = '08086b54-ca82-4804-8e9a-fe83f796c558';
    $iv = '4024d606a0116e47';

    $token = base64_encode(openssl_encrypt($content, $encrypt_method, $key, 0, $iv));

    if (!$token) {
      return 0;
    }

    return $token;
  }

  public function createCommandToken($cmdid)
  {
    $command = $this->commandProductFromCommand($cmdid);
    $validity_timer = time() + 60 * MINUTES_CMD;

    if (!$command) {
      return 0;
    }

    return $this->createToken($cmdid, $validity_timer);
  }

  public function decodeToken()
  {
    $data = json_decode(file_get_contents('php://input'));

    if (!$data->token) {
      return 0;
    }

    $token = $data->token;

    $encrypt_method = "AES-256-CBC";
    $key = '08086b54-ca82-4804-8e9a-fe83f796c558';
    $iv = '4024d606a0116e47';

    $content = openssl_decrypt(base64_decode($token), $encrypt_method, $key, 0, $iv);

    if (!$content) {
      return 0;
    }

    $len = strlen($content);
    $split = strpos($content, ".");

    $tokenDate = substr($content, $split + 1, $len);

    if ($tokenDate < time()) {
      return false;
    }

    return substr($content, 0, $split);
  }

  public function decodeCommandToken()
  {
    $cmdid = $this->decodeToken();

    if ($cmdid <= 0) {
      return 0;
    }

    $this->confirmcommand($cmdid);
    return $cmdid;
  }

  // check access level middleware
}