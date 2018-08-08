<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
//獲取回調函數名
$jsoncallback = htmlspecialchars($_REQUEST ['keyWord']);
//json資料
$file = file_get_contents('https://uhotel.liontravel.com/search/keyWord=?'.$jsoncallback);
//輸出jsonp格式的資料
echo $file;
?>
