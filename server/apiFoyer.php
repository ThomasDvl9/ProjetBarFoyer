<?php

  define("MINUTES", 15);

  class API_Foyer {
  
    private $PDO;

    public function __construct($base, $username, $password, $host) {
      try {
        $this->PDO = new PDO("mysql:dbname=" . $base . ";host=" . $host, $username, $password);
      } catch(Exception $err) {
        echo "erreur db : " . utf8_encode($err->getMessage()) . "<br/>";
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
      $illustration = $data->illustration;
      
      if($id && $nom && $prix && $quantite && $peremption && $illustration) {
        $this->PDO->query("UPDATE produits SET denomination = '$nom', qt_dispo = $quantite, prix = $prix, peremption = '$peremption', illustration = '$illustration' WHERE id_produit = $id");        
        http_response_code(200);
        return 1;
      } else {
        http_response_code(400);
        return 0;
      }
    }

    public function addProduct() {
      $data = json_decode(file_get_contents('php://input'));

      $nom = $data->nom;
      $prix = $data->prix;
      $quantite = $data->quantite;
      $peremption = $data->peremption;
      $illustration = $data->illustration;
      
      if($nom && $prix && $quantite && $peremption && $illustration) {
        $this->PDO->exec("INSERT INTO produits (denomination, prix, qt_dispo, peremption, illustration) 
          VALUES ('$nom', $prix, $quantite, '$peremption', '$illustration')");
        http_response_code(200);
      } else {
        http_response_code(400);
      }
    }  

    public function deleteProduct($product) {
      return $this->PDO->exec("DELETE FROM produits WHERE id_produit = $product");
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

      $date = date("Y-m-d H:i:s");
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
 
      $productList = $data->productList;
      
      if(!($cmdid && $productList)) { 
        http_response_code(400);
        return 0;
      }
      
      foreach($productList as $id => $qt) {
        if(((int) $qt % 1)) {
          http_response_code(400);
          return 0;
        }
      }
      
      foreach($productList as $id => $qt) {
        $this->PDO->exec("INSERT INTO detail_commandes 
          (id_commande, id_produit, qt_commandee, cochee) 
          VALUES ($cmdid, $id, $qt, 0)");
      }
      
      http_response_code(200);
      return 1;
    }

    // TABLES

    public function getTable($numero) {
      $objPDOStatement = $this->PDO->query("SELECT * FROM tables WHERE numero = $numero");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if ($result) {
        return json_encode($result, JSON_UNESCAPED_UNICODE); 
      }
  
      return 0;
    }    

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

      $num = $data->num;
      $lien = $data->lien;

      if($num && $lien) {
        $objPDOStatement = $this->PDO->exec("INSERT INTO tables (numero, lien_QRcode) VALUES ($num, $lien)");
        if($objPDOStatement) {
          http_response_code(200);
          return 1;
        } else {
          http_response_code(400);
          return 0;
        }
      }

      http_response_code(400);
      return 0;
    } 
    
    public function deleteTable($table) {
      return $this->PDO->query("DELETE FROM tables WHERE id_table = $table");     
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

    public function createToken($cmdid) {
      $validity_timer = time() + 60 * MINUTES;

      $content = $cmdid . "." . $validity_timer;
      
      $encrypt_method = "AES-256-CBC";
      $key = '08086b54-ca82-4804-8e9a-fe83f796c558';
      $iv = '4024d606a0116e47';
    
      $token = base64_encode(openssl_encrypt($content, $encrypt_method, $key, 0, $iv));

      if(!$token) {
        return 0;
      }
      
      return $token;
    }
    
    public function decodeToken() {   
      $data = json_decode(file_get_contents('php://input'));
      
      $token = $data->token;

      $encrypt_method = "AES-256-CBC";
      $key = '08086b54-ca82-4804-8e9a-fe83f796c558';
      $iv = '4024d606a0116e47';

      if(!$token) {
        return 0;
      }

      $content = openssl_decrypt(base64_decode($token), $encrypt_method, $key, 0, $iv);  

      if(!$content) {
        return 0;
      }
      
      $len = strlen($content);
      $split = strpos($content, ".");

      $tokenDate = substr($content, $split + 1, $len);

      if($tokenDate < time()) {
        return false;
      }

      $cmdid = substr($content, 0, $split);       
      
      return $cmdid;
    }  
}


?>