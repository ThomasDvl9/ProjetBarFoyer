<?php

  class API_Foyer {
  
    private $PDO;

    public function __construct($base, $username, $password, $host) {
      try {
        $this->PDO = new PDO("mysql:dbname=" . $base . ";host=" . $host, $username, $password);
      } catch(Exception $err) {
        echo "erreur db : " . utf8_encode($err->getMessage()) . "<br/>";
        $PDO = null;
      }
    }

    // setcookie("nom", "contenu");
    // session_start();

    // PRODUITS

    public function getAvailableProducts() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM produits");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;
      } else { 
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function getProductById($id) {
      $objPDOStatement = $this->PDO->query("SELECT * FROM produits WHERE id_produit = $id");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;
      } else { 
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function updateProduct() {
      $data = json_decode(file_get_contents('php://input'));

      $id = $data->id;
      $nom = $data->nom;
      $prix = $data->prix;
      $quantite = $data->quantite;
      $peremption = $data->peremption;
      
      if($id && $nom && $prix && $quantite && $peremption) {
        $objPDOStatement = $this->PDO->query("UPDATE produits SET denomination = '$nom', qt_dispo = $quantite, prix = $prix, peremption = '$peremption' WHERE id_produit = $id");        
        http_response_code(200);
      } else {
        http_response_code(400);
      }
      
      return $objPDOStatement;
    }

    public function addProduct() {
      $data = json_decode(file_get_contents('php://input'));

      $nom = $data->nom;
      $prix = $data->prix;
      $quantite = $data->quantite;
      $peremption = $data->peremption;
      
      if($nom && $prix && $quantite && $peremption) {
        $objPDOStatement = $this->PDO->query("INSERT INTO produits (denomination, prix, qt_dispo, peremption) 
          VALUES ($nom, $prix, $quantite, $peremption)");
        http_response_code(200);
      } else {
        http_response_code(400);
      }

      return $objPDOStatement;
    }  

    public function deleteProduct($product) {
      $objPDOStatement = $this->PDO->query("DELETE FROM produits WHERE id_produit = $product");
  
      return $objPDOStatement;      
    }

    // COMMANDES
     
    public function getPendingOrders() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM commandes");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;
      } else {
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function addCommand() {
      $data = json_decode(file_get_contents('php://input'));

      $date = date("Y-m-d h:i:s");
      $email = $data->email;
      $table = $data->table;
      
      if($date && $email) {
        $this->PDO->query("INSERT INTO commandes 
          (id_table, email, confirmee, preparee, dateCommande) 
          VALUES ($table, '$email', 0, 0, '$date')");
  
        http_response_code(200);
        return $this->PDO->lastInsertId();
      } 
      
      http_response_code(400);
      return 0;
    }

    // DETAIL COMMANDES

    public function getCommandsDetails() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM detail_commandes");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;        
      } else {
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    // old version
    // public function getOrdersDetails() {
    //   $objPDOStatement = $this->PDO->query("SELECT * FROM detail_commandes");

    //   $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

    //   if($result) {
    //     $json["detailCommandes"] = $result;
    //   } else {
    //     $json["detailCommandes"] = 0;
    //   }

    //   return json_encode($json, JSON_UNESCAPED_UNICODE);
    // } 

    public function getCommandDetailById($id) {
      $objPDOStatement = $this->PDO->query("SELECT * FROM detail_commandes WHERE id_commande = $id");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;        
      } else {
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function addCommandDetails($cmdid) {
      $data = json_decode(file_get_contents('php://input'));
      
      $product = $data->product;
      $qt = $data->qt;
      
      if($cmdid && $product && ((int) $qt % 1) == 0) {
        $objPDOStatement = $this->PDO->exec("INSERT INTO detail_commandes 
          (id_commande, id_produit, qt_commandee, cochee) 
          VALUES ($cmdid, $product, $qt, 0)");
        
        http_response_code(200);
      } else {
        http_response_code(400);
      }

      return $objPDOStatement;
    }

    // TABLES

    public function getTables() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM tables");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if ($result) {
        $json = $result;
      } else {
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function addTable() {
      $data = json_decode(file_get_contents('php://input'));

      $table = $data->table;

      $objPDOStatement = $this->PDO->query("INSERT INTO tables (numero, lien_QRcode) VALUES ($table, 'null')");

      return $objPDOStatement;
    } 
    
    public function deleteTable($table) {
      $objPDOStatement = $this->PDO->query("DELETE FROM tables WHERE id_table = $table");
  
      return $objPDOStatement;      
    }

    // AUTH

    public function getUserAccessLevel() {
      $data = json_decode(file_get_contents('php://input'));
      
      $role = $data->role;
      $password = strtoupper(md5($data->password));

      if($role && $password) {
        $objPDOStatement = $this->PDO->query("SELECT accessLevel FROM users WHERE _login = '$role' AND _password = '$password'");

        $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
        
        if($result) {
          return json_encode($result, JSON_UNESCAPED_UNICODE);
        }
      }
      
      return 0;
    }
}


?>