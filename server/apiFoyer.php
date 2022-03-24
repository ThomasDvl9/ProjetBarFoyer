<?php

  class API_Foyer {
  
    private $PDO;      

    public function __construct($base, $username, $password, $host) {
      try {
        $this->PDO = new PDO("mysql:dbname=" . $base . ";host=" . $host, $username, $password);
      } catch(Exception $err) {
        echo "erreur db : " . utf8_encode($err->getMessage()) . "<br/>";
      } finally {
        $Connect = NULL;
      }
    }

    public function getAvailableProducts() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM produits");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json["produitsDispos"] = $result;
      } else {
        $json["produitsDispos"] = "vide";
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }

    public function getPendingOrders() {
      $objPDOStatement = $this->PDO->query("SELECT * FROM commandes");
  
      $result = $objPDOStatement->fetchAll(PDO::FETCH_ASSOC);
  
      if($result) {
        $json["cmdEnCours"] = $result;
      } else {
        $json["cmdEnCours"] = "vide";
      }
  
      return json_encode($json, JSON_UNESCAPED_UNICODE);
    }
  }


?>