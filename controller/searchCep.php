<?php
require '../controller/createdatabase.php';

$json = file_get_contents('php://input');
$data = json_decode($json);
var_dump($data);