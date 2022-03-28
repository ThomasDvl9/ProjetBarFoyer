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

    public function getAvailableProducts() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM produits");
  
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
        $json["cmdEnCours"] = $result;
      } else {
        $json["cmdEnCours"] = 0;
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
      $objPDOStatement = $this->PDO->query("INSERT INTO tables (table_id, numero, lien_QRcode) VALUES (15, 15, 'lien du QRcode')");

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
      $header = $_POST;

      echo $header;

      $objPDOStatement = $this->PDO->query("INSERT INTO commande (id_table, email, confirmee, preparee, dateCommande) VALUES ('', '', '', '', '')");

      return $objPDOStatement;
    }
}

?>