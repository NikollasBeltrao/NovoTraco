<?php
require_once __DIR__ . '/conexao.php';

header('Content-Type: application/json; charset=utf-8');
session_name('MURAL_SESSION');
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'path' => '/']);
session_start();

function respond($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function fail(string $message, int $status): void
{
    respond(['error' => $message], $status);
    exit;
}

function sessionUser(): ?array
{
    return $_SESSION['user'] ?? null;
}

function authenticate(array $user): void
{
    session_regenerate_id(true);
    $_SESSION['user'] = ['id' => (int) $user['idusuario'], 'nome' => $user['nome']];
}

function getPosts(PDO $db, ?int $id = null): array
{
    $sql = 'SELECT p.idpost, p.titulo, p.descricao, p.datac, u.nome AS autor, i.idimg, i.texto
            FROM post p JOIN usuario u ON u.idusuario = p.idusuario
            LEFT JOIN img i ON i.idpost = p.idpost';
    if ($id !== null) {
        $sql .= ' WHERE p.idpost = :id';
    }
    $sql .= ' ORDER BY p.datac DESC, p.idpost DESC, i.idimg ASC';
    $query = $db->prepare($sql);
    $query->execute($id !== null ? [':id' => $id] : []);
    $posts = [];
    foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $key = $row['idpost'];
        if (!isset($posts[$key])) {
            $posts[$key] = [
                'id' => (int) $key,
                'titulo' => $row['titulo'],
                'descricao' => $row['descricao'],
                'data' => $row['datac'],
                'autor' => $row['autor'],
                'imagens' => [],
            ];
        }
        if ($row['idimg'] !== null && $row['texto'] !== '') {
            $posts[$key]['imagens'][] = $row['texto'];
        }
    }
    return array_values($posts);
}

function registerUser(PDO $db): void
{
    $nome = trim($_POST['nome'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $nameLength = preg_match_all('/./us', $nome);
    $passwordLength = preg_match_all('/./us', $senha);
    if (!$nameLength || $nameLength > 100 || $passwordLength === false || $passwordLength < 6 || strlen($senha) > 72) {
        fail('Informe um nome de até 100 caracteres e uma senha de pelo menos 6 caracteres e no máximo 72 bytes.', 422);
    }
    $hash = password_hash($senha, PASSWORD_DEFAULT);
    try {
        $query = $db->prepare('INSERT INTO usuario (nome, senha) VALUES (:nome, :senha)');
        $query->execute([':nome' => $nome, ':senha' => $hash]);
    } catch (PDOException $e) {
        if (($e->errorInfo[1] ?? null) === 1062) {
            fail('Este nome já está em uso. Escolha outro.', 409);
        }
        throw $e;
    }
    authenticate(['idusuario' => $db->lastInsertId(), 'nome' => $nome]);
    respond(['user' => sessionUser()], 201);
}

function login(PDO $db): void
{
    $nome = trim($_POST['nome'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $query = $db->prepare('SELECT idusuario, nome, senha FROM usuario WHERE nome = :nome LIMIT 1');
    $query->execute([':nome' => $nome]);
    $user = $query->fetch(PDO::FETCH_ASSOC);
    $legacy = $user && password_get_info($user['senha'])['algo'] === null;
    if (!$user || !(password_verify($senha, $user['senha']) || ($legacy && hash_equals($user['senha'], $senha)))) {
        fail('Nome ou senha incorretos.', 401);
    }
    if ($legacy || password_needs_rehash($user['senha'], PASSWORD_DEFAULT)) {
        $update = $db->prepare('UPDATE usuario SET senha = :senha WHERE idusuario = :id');
        $update->execute([':senha' => password_hash($senha, PASSWORD_DEFAULT), ':id' => $user['idusuario']]);
    }
    authenticate($user);
    respond(['user' => sessionUser()]);
}

function createPost(PDO $db): void
{
    $user = sessionUser();
    if (!$user) {
        fail('Entre na sua conta para publicar.', 401);
    }
    $titulo = trim($_POST['titulo'] ?? '');
    $descricao = trim($_POST['descricao'] ?? '');
    $files = $_FILES['imagens'] ?? null;
    if ($titulo === '' || strlen($titulo) > 255 || $descricao === '') {
        fail('Informe o título e a descrição da publicação.', 422);
    }
    if (!$files || !is_array($files['error']) || count($files['error']) < 1 || count($files['error']) > 4) {
        fail('Selecione de uma a quatro imagens.', 422);
    }
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $uploads = [];
    foreach ($files['error'] as $index => $error) {
        if ($error !== UPLOAD_ERR_OK || $files['size'][$index] > 5 * 1024 * 1024) {
            fail('Não foi possível enviar uma imagem. O limite é 5 MB por imagem.', 422);
        }
        $tmp = $files['tmp_name'][$index];
        $mime = $finfo->file($tmp);
        if (!isset($allowed[$mime]) || !getimagesize($tmp)) {
            fail('Use imagens JPEG, PNG, GIF ou WebP válidas.', 422);
        }
        $uploads[] = ['tmp' => $tmp, 'path' => 'imagens/' . bin2hex(random_bytes(16)) . '.' . $allowed[$mime]];
    }
    $maxPosts = getenv('MURAL_MAX_POSTS');
    $locked = false;
    if ($maxPosts !== false) {
        if (!ctype_digit($maxPosts) || (int) $maxPosts < 1) {
            throw new RuntimeException('MURAL_MAX_POSTS deve ser um inteiro positivo.');
        }
        $locked = (int) $db->query("SELECT GET_LOCK('mural_publication_limit', 5)")->fetchColumn() === 1;
        if (!$locked) {
            fail('O mural está ocupado. Tente novamente.', 503);
        }
        if ((int) $db->query('SELECT COUNT(*) FROM post')->fetchColumn() >= (int) $maxPosts) {
            $db->query("SELECT RELEASE_LOCK('mural_publication_limit')");
            fail('O mural atingiu o limite de publicações desta demonstração.', 409);
        }
    }
    $saved = [];
    try {
        $db->beginTransaction();
        $query = $db->prepare('INSERT INTO post (titulo, descricao, idusuario) VALUES (:titulo, :descricao, :id)');
        $query->execute([':titulo' => $titulo, ':descricao' => $descricao, ':id' => $user['id']]);
        $id = $db->lastInsertId();
        $imageQuery = $db->prepare('INSERT INTO img (texto, idpost) VALUES (:texto, :id)');
        foreach ($uploads as $upload) {
            $destination = __DIR__ . '/' . $upload['path'];
            if (!move_uploaded_file($upload['tmp'], $destination)) {
                throw new RuntimeException('Falha ao salvar imagem enviada.');
            }
            $saved[] = $destination;
            $imageQuery->execute([':texto' => $upload['path'], ':id' => $id]);
        }
        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        foreach ($saved as $file) {
            if (!unlink($file)) {
                error_log('Falha ao remover imagem incompleta: ' . $file);
            }
        }
        throw $e;
    } finally {
        if ($locked) {
            $db->query("SELECT RELEASE_LOCK('mural_publication_limit')");
        }
    }
    respond(['id' => (int) $id], 201);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? $_POST['action'] ?? '';
    if ($method === 'GET' && $action === 'session') {
        respond(['user' => sessionUser()]);
    } elseif ($method === 'POST' && $action === 'logout') {
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
        respond(['ok' => true]);
    } elseif ($method === 'POST' && $action === 'register') {
        registerUser(Connection::getConnection());
    } elseif ($method === 'POST' && $action === 'login') {
        login(Connection::getConnection());
    } elseif ($method === 'POST' && $action === 'post') {
        createPost(Connection::getConnection());
    } elseif ($method === 'GET' && $action === 'posts') {
        respond(['posts' => getPosts(Connection::getConnection())]);
    } elseif ($method === 'GET' && $action === 'post') {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        if (!$id) {
            fail('Publicação inválida.', 422);
        }
        $posts = getPosts(Connection::getConnection(), $id);
        if (!$posts) {
            fail('Publicação não encontrada.', 404);
        }
        respond(['post' => $posts[0]]);
    } else {
        fail('Operação inválida.', 400);
    }
} catch (Throwable $e) {
    error_log('Mural Criativo: ' . $e->getMessage());
    respond(['error' => 'Não foi possível concluir a operação. Tente novamente.'], 500);
}
