<?php
require '../database/config.php';

$sql = "CREATE DATABASE CD2TEC";
if (mysqli_query($conn, $sql)) {
  echo "Database created successfully";
} else {
  echo "Error creating database: " . mysqli_error($conn);
}