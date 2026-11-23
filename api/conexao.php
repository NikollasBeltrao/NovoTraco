<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, FILES");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
date_default_timezone_set('America/Sao_Paulo');
class Connection {
    
    private function __construct(){}
   
    public static function getConnection() {    
         
        try {
            if(!isset($connection)){
                $host = getenv('NOVOTRACO_DB_HOST');
                $name = getenv('NOVOTRACO_DB_NAME');
                $user = getenv('NOVOTRACO_DB_USER');
                $password = getenv('NOVOTRACO_DB_PASSWORD');
                if (!$host || !$name || !$user || $password === false) {
                    throw new Exception('Database connection environment variables are not configured.');
                }
                $connection = new PDO("mysql:dbname=$name;host=$host;charset=utf8mb4", $user, $password);
                $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            return $connection;
         } catch (PDOException $e) {
            $mensagem = "Drivers disponiveis: " . implode(",", PDO::getAvailableDrivers());
            $mensagem .= "\nErro: " . $e->getMessage();
            throw new Exception($mensagem);
         }
     }
}
