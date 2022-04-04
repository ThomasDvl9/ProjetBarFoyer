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
      $objPDOStatement = $this->PDO->query("UPDATE * FROM produits");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json["produitsDispos"] = $result;
      } else {
        $json["produitsDispos"] = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }
     
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

    public function getTables() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM tables");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if ($result) {
        $json["tables"] = $result;
      } else {
        $json["tables"] = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function addTable() {
      $objPDOStatement = $this->PDO->query("INSERT INTO tables (numero, lien_QRcode) VALUES (15, 'lien du QRcode')");

      return $objPDOStatement;
    } 
    
    public function deleteTable($table) {
      $objPDOStatement = $this->PDO->query("DELETE * FROM tables WHERE id_table = $table");
  
      return $objPDOStatement;      
    }

    public function getOrdersDetails() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM detail_commandes");

      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);

      if($result) {
        $json["detailCommandes"] = $result;
      } else {
        $json["detailCommandes"] = 0;
      }

      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }    

    public function addCommande() {
      // comment recupérer body requete
      // email
      // id_table dans url
      // confirmee = 0
      // preparee = 0
      // dateCommande = date actuel

      $date = date_create();

      date_timezone_get($date);

      $header = $_POST;

      echo $header;

      $objPDOStatement = $this->PDO->query("INSERT INTO commande (id_table, email, confirmee, preparee, dateCommande) VALUES ('', '', '0', '0', '')");

      return $objPDOStatement;
    }

    // authentification

    public function getUser() {
      // récuperer body de la requête
      $objPDOStatement = $this->PDO->query("SELECT * FROM users");

      // $mdp = md5("Password1234");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json = $result;
      } else {
        $json = 0;
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }
}


?>