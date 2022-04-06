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
      $objPDOStatement = $this->PDO->query("UPDATE produits SET denomination = '', prix = '', qt_dispo = '', peremption = ''");
  
      return $objPDOStatement;
    }

    public function addProduct() {
      $data = json_decode(file_get_contents('php://input'));

      $nom = $data->nom;
      $prix = $data->prix;
      $quantite = $data->quantite;
      $peremption = $data->peremption;
      
      $objPDOStatement = $this->PDO->query("INSERT INTO produits (denomination, prix, qt_dispo, peremption) VALUES ($nom, $prix, $quantite, $peremption)");

      return $objPDOStatement;
    } 

    public function deleteProduct($product) {
      $objPDOStatement = $this->PDO->query("DELETE FROM produits WHERE id_produit = $product");
  
      return $objPDOStatement;      
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

      $data = json_decode(file_get_contents('php://input'));


      $objPDOStatement = $this->PDO->query("INSERT INTO commande (id_table, email, confirmee, preparee, dateCommande) VALUES ('', '', '0', '0', '$date')");

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