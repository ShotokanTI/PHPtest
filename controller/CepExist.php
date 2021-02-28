<?php
include '../database/config.php';
include '../controller/sendCep.php';
include '../model/DatabaseModel.php';
echo json_encode(dataExist($conn,$decoded));