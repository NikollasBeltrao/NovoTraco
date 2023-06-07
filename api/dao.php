<?php
require_once "./conexao.php";
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        if (isset($_POST['login'])) {
            login();
        } else if (isset($_POST['cadastrarPost'])) {
            cadastrarPost();
        }
        break;
    case 'GET':
        if (isset($_GET['listarPosts'])) {
            listarPosts();
        } else if (isset($_GET['listarImagens'])) {
            listarImagens();
        } else if (isset($_GET['getPost'])) {
            getPost();
        }
        break;
    default:
        echo '{"err": "Método inválido"}';
        break;
}

function login()
{
    try {
        $Conexao = Connection::getConnection();
        $query = $Conexao->prepare("SELECT * FROM usuario WHERE nome = :nome AND senha = :sen");
        $query->bindValue(':nome', ($_POST['nome']));
        $query->bindValue(":sen", ($_POST['senha']));
        $query->execute();
        $resposta = $query->fetchAll(PDO::FETCH_OBJ);
        if (count($resposta) > 0) {
            echo json_encode('{"response": true, "data": ' . json_encode($resposta) . '}');
        } else {
            echo json_encode('{"response": false}');
        }
    } catch (Exception $e) {
        echo json_encode('{"err": "' . $e . '"}');
    }
}

function cadastrarPost()
{
    try {
        $Conexao = Connection::getConnection();
        $query = $Conexao->prepare("INSERT INTO post (titulo, descricao, idusuario) VALUES (:titulo, :descricao, :idusuario)");
        $query->bindValue(':titulo', $_POST['titulo']);
        $query->bindValue(":descricao", $_POST['descricao']);
        $query->bindValue(':idusuario', $_POST['idusuario']);
        $query->execute();
        $lastID = $Conexao->lastInsertId();
        $imgs = json_decode($_POST['imgs']);
        foreach ($imgs as $img) {  
            $i = uploadImg($img);          
            $query2 = $Conexao->prepare("INSERT INTO img (texto, idpost) VALUES (:texto, :idpost)");
            $query2->bindValue(":texto", $i?$i:'');
            $query2->bindValue(':idpost', $lastID);
            $query2->execute();
        }
        echo json_encode('{"response": true}');
    } catch (Exception $e) {
        echo json_encode('{"err": "' . $e . '"}');
    }
}

function uploadImg($data)
{
    if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
            throw new \Exception('invalid image type');
        }
        $data = str_replace(' ', '+', $data);
        $data = base64_decode($data);

        if ($data === false) {
            throw new \Exception('base64_decode failed');
        }
    } else {
        throw new \Exception('did not match data URI with image data');
    }
    $file = "imagens/" . uniqid() . ".{$type}";
    $sucess = file_put_contents($file, $data);
    if ($sucess == false) {
        return $sucess;
    } else {
        return $file;
    }
}

function listarPosts()
{
    try {
        $Conexao = Connection::getConnection();
        $query = $Conexao->prepare("SELECT p.*, i.texto FROM post AS p 
        JOIN img AS i ON i.idpost = p.idpost
        GROUP BY i.idpost ORDER BY datac DESC");
        $query->execute();
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } catch (Exception $e) {
        echo json_encode('{"err": "' . $e . '"}');
    }
}

function listarImagens()
{
    try {
        $Conexao = Connection::getConnection();
        $query = $Conexao->prepare("SELECT * FROM img WHERE idpost = :id");
        $query->bindValue(":id", $_GET["idpost"]);
        $query->execute();
        echo json_encode($query->fetchAll(PDO::FETCH_OBJ));
    } catch (Exception $e) {
        echo json_encode('{"err": "' . $e . '"}');
    }
}

function getPost()
{
    try {
        $Conexao = Connection::getConnection();
        $query = $Conexao->prepare("SELECT * FROM post WHERE idpost = :id LIMIT 1");
        $query->bindValue(":id", $_GET["idpost"]);
        $query->execute();
        echo json_encode($query->fetchObject());
    } catch (Exception $e) {
        echo json_encode('{"err": "' . $e . '"}');
    }
}
