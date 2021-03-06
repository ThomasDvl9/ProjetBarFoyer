<?php

use PHPMailer\PHPMailer\PHPMailer;

function sendmail($mailAddress, $token)
{
  $name = "Commande Bar foyer - Institut lemonnier";
  $to = $mailAddress;
  $subject = "Validation de votre commande au bar";
  $body = '<h3>Voici le lien pour valider votre commande : <a href="http://172.20.10.7:5500/client/pages/commande.html?token=' . $token . '">lien de validation</a>, vous avez 15 minutes pour confirmer la commande !</h3>';
  $from = "institutlemonniertestmailer@gmail.com";
  $password = "Passwordgroupe6!";

  require_once "./vendor/phpmailer/phpmailer/src/PHPMailer.php";
  require_once "./vendor/phpmailer/phpmailer/src/SMTP.php";
  require_once "./vendor/phpmailer/phpmailer/src/Exception.php";
  $mail = new PHPMailer();

  $mail->isSMTP();
  // $mail->SMTPDebug = 3;                        
  $mail->Host = "smtp.gmail.com";
  $mail->SMTPAuth = true;
  $mail->Username = $from;
  $mail->Password = $password;
  $mail->Port = 587;
  $mail->SMTPSecure = "tls";
  $mail->smtpConnect([
    'ssl' => [
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => true
    ]
  ]);

  $mail->isHTML(true);
  $mail->setFrom($from, $name);
  $mail->addAddress($to);
  $mail->Subject = ("$subject");
  $mail->msgHTML($body);
  $mail->Body = $body;
  $mail->send();
}