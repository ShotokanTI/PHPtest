<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = 'cd2tec';
$conn = mysqli_connect($servername, $username, $password);

if (!$conn) {
  echo ("Conexão falhou: " . mysqli_connect_error());
}


$sql = "create database CD2TEC";

if (mysqli_query($conn, $sql)) {
  echo "Database created successfully";
}

$conn = mysqli_connect($servername, $username, $password, $dbname);

createTable($conn);

function createTable($conn)
{
  $sql = "CREATE TABLE ViaCepEnderecos (
        Id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        Cep VARCHAR(9)  UNIQUE,
        Localidade VARCHAR(12) ,
        Logradouro VARCHAR(60) ,
        Complemento VARCHAR(60),
        Bairro VARCHAR(60),
        Uf CHAR(2) ,
        Ibge INT(10),
        DDD INT (3),
        Siafi INT (5))";
  if (mysqli_query($conn, $sql)) {
  } else {
    mysqli_error($conn);
  }
}
