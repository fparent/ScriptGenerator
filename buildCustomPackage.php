<?php
include("CreateZipFile.inc.php");

$action = $_REQUEST['download'];

if ($action == "custom") {
	if(isset($_POST['plugins'])) {
		$ziper = new zipfile();
		$ziper->addFiles($_POST['plugins']);
		$ziper->output("UI_GeneratedScript.zip");
	}
}

if ($action == "complete") {
	$directoryToZip="Plugins";
	$createZipFile=new zipfile();
	$createZipFile->zipDirectory($directoryToZip,$directoryToZip);
	$createZipFile->output("UI_GeneratedScript(Complete).zip");
}
?>