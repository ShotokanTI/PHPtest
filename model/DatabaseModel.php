<?php

function searchCepBd($conn, $endereco)
{
    $sql = "SELECT * FROM ViaCepEnderecos where Cep =" . '' . $endereco["cep"] . '';
    $result = mysqli_query($conn, $sql);
    return $result;
}
function dataExist($conn, $endereco)
{
    $result = searchCepBd($conn, $endereco);
    return mysqli_num_rows($result) > 0 ? dataFound(mysqli_fetch_assoc($result)) : (['status' => false]);
}
function destroyColumnNull($row){
    foreach($row as $key=>$data){
        if(is_null($data)){
            unset($row[$key]);
        }
    }
    return $row;
}
function dataFound($row)
{
    $row = destroyColumnNull($row);

    $data = [
        'status' => true,
        'msg' => 'Cep encontrado no banco,resgatando...',
        'dadosTabela' => $row
    ];
    return ($data);
}
function insertTable($conn, $data)
{
    $data['cep'] = str_replace('-', '', $data['cep']);
    $row = dataExist($conn, $data);
    if ($row['status']) {
        $data = dataFound($row);
        return $data;
    } else {
        $sql = 'INSERT INTO viacependerecos';
        $sql .= "(";
        foreach ($data as $key => $title) {
            $key != 'siafi' ?
                $sql .= $key . ',' : $sql .= $key;
        }
        $sql .= ")";
        $sql .= "VALUES";
        $sql .= "(";
        foreach ($data as $key => $values) {
            $key != 'siafi' ?
                $sql .= "'" . $values . "'" . ',' : $sql .= "'" . $values . "'";
        }
        $sql .= ")";
        if (mysqli_query($conn, $sql)) {
            $data = [
                'status' => true,
                'msg' => 'Endereço inserido no banco com sucesso !!',
            ];
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}
