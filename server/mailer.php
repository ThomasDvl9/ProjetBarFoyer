<?php

  include "PHPMailer/src/PHPMailer.php";
  include "PHPMailer/src/SMTP.php";
  include "PHPMailer/src/Exception.php";

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  $mail = new PHPMailer();

  $mail->isSMTP();

  $mail->Host = "smtp.gmail.com";

  $mail->SMTPAuth = "true";

  $mail->SMTPSecure = "tls";

  $mail->Port = "587";

  $mail->Username = "institutlemonniertestmailer@gmail.com";

  $mail->Password = "Passwordgroupe6!";

  $mail->Subject = "Test email PHPMailer";

  $mail->setFrom("institutlemonniertestmailer@gmail.com");

  $mail->Body = "Test contenu email commande !";

  $mail->addAddress("institutlemonniertestmailer@gmail.com");

  if($mail->send()) {
    echo "Email envoyer !";
  } else {
    echo "Email non envoyer !";
  }

  $mail->smtpClose();

?>