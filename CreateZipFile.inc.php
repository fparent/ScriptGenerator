<?php
/* $Id: zip.lib.php,v 1.1 2004/02/14 15:21:18 anoncvs_tusedb Exp $ */
// vim: expandtab sw=4 ts=4 sts=4:

// http://www.phpclasses.org/package/2322-PHP-Create-ZIP-file-archives-and-serve-for-download.html
// http://www.web-development-blog.com/archives/tutorial-create-a-zip-file-from-folders-on-the-fly/


/**
* Zip file creation class.
* Makes zip files.
*
* Last Modification and Extension By :
*
*  Hasin Hayder
*  HomePage : www.hasinme.info
*  Email : countdraculla@gmail.com
*  IDE : PHP Designer 2005
*
*
* Originally Based on :
*
*  http://www.zend.com/codex.php?id=535&single=1
*  By Eric Mueller <eric@themepark.com>
*
*  http://www.zend.com/codex.php?id=470&single=1
*  by Denis125 <webmaster@atlant.ru>
*
*  a patch from Peter Listiak <mlady@users.sourceforge.net> for last modified
*  date and time of the compressed file
*
* Official ZIP file format: http://www.pkware.com/appnote.txt
*
* @access  public
*/
class zipfile
{
    /**
	* Array to store compressed data
	*
	* @var  array    $datasec
	*/
    var $datasec      = array();

    /**
	* Central directory
	*
	* @var  array    $ctrl_dir
	*/
    var $ctrl_dir     = array();

    /**
	* End of central directory record
	*
	* @var  string   $eof_ctrl_dir
	*/
    var $eof_ctrl_dir = "\x50\x4b\x05\x06\x00\x00\x00\x00";

    /**
	* Last offset position
	*
	* @var  integer  $old_offset
	*/
    var $old_offset   = 0;
	
	
	public $compressedData = array();
    public $centralDirectory = array(); // central directory
    public $endOfCentralDirectory = "\x50\x4b\x05\x06\x00\x00\x00\x00"; //end of Central directory record


    /**
	* Converts an Unix timestamp to a four byte DOS date and time format (date
	* in high two bytes, time in low two bytes allowing magnitude comparison).
	*
	* @param  integer  the current Unix timestamp
	*
	* @return integer  the current date in a four byte DOS format
	*
	* @access private
	*/
    function unix2DosTime($unixtime = 0) {
        $timearray = ($unixtime == 0) ? getdate() : getdate($unixtime);

        if ($timearray['year'] < 1980) {
            $timearray['year']    = 1980;
            $timearray['mon']     = 1;
            $timearray['mday']    = 1;
            $timearray['hours']   = 0;
            $timearray['minutes'] = 0;
            $timearray['seconds'] = 0;
        } // end if

        return (($timearray['year'] - 1980) << 25) | ($timearray['mon'] << 21) | ($timearray['mday'] << 16) |
                ($timearray['hours'] << 11) | ($timearray['minutes'] << 5) | ($timearray['seconds'] >> 1);
    } // end of the 'unix2DosTime()' method
	

    /**
	* Adds "file" to archive
	*
	* @param  string   file contents
	* @param  string   name of the file in the archive (may contains the path)
	* @param  integer  the current timestamp
	* @access public
	*/
    function addFile($data, $name, $time = 0)
    {
        $name     = str_replace('\\', '/', $name);

        $dtime    = dechex($this->unix2DosTime($time));
        $hexdtime = '\x' . $dtime[6] . $dtime[7]
                  . '\x' . $dtime[4] . $dtime[5]
                  . '\x' . $dtime[2] . $dtime[3]
                  . '\x' . $dtime[0] . $dtime[1];
        eval('$hexdtime = "' . $hexdtime . '";');

        $fr   = "\x50\x4b\x03\x04";
        $fr   .= "\x14\x00";            // ver needed to extract
        $fr   .= "\x00\x00";            // gen purpose bit flag
        $fr   .= "\x08\x00";            // compression method
        $fr   .= $hexdtime;             // last mod time and date

        // "local file header" segment
        $unc_len = strlen($data);
        $crc     = crc32($data);
        $zdata   = gzcompress($data);
        $zdata   = substr(substr($zdata, 0, strlen($zdata) - 4), 2); // fix crc bug
        $c_len   = strlen($zdata);
        $fr      .= pack('V', $crc);             // crc32
        $fr      .= pack('V', $c_len);           // compressed filesize
        $fr      .= pack('V', $unc_len);         // uncompressed filesize
        $fr      .= pack('v', strlen($name));    // length of filename
        $fr      .= pack('v', 0);                // extra field length
        $fr      .= $name;

        // "file data" segment
        $fr .= $zdata;

        // "data descriptor" segment (optional but necessary if archive is not
        // served as file)
        $fr .= pack('V', $crc);                 // crc32
        $fr .= pack('V', $c_len);               // compressed filesize
        $fr .= pack('V', $unc_len);             // uncompressed filesize

        // add this entry to array
        $this -> datasec[] = $fr;

        // now add to central directory record
        $cdrec = "\x50\x4b\x01\x02";
        $cdrec .= "\x00\x00";                // version made by
        $cdrec .= "\x14\x00";                // version needed to extract
        $cdrec .= "\x00\x00";                // gen purpose bit flag
        $cdrec .= "\x08\x00";                // compression method
        $cdrec .= $hexdtime;                 // last mod time & date
        $cdrec .= pack('V', $crc);           // crc32
        $cdrec .= pack('V', $c_len);         // compressed filesize
        $cdrec .= pack('V', $unc_len);       // uncompressed filesize
        $cdrec .= pack('v', strlen($name) ); // length of filename
        $cdrec .= pack('v', 0 );             // extra field length
        $cdrec .= pack('v', 0 );             // file comment length
        $cdrec .= pack('v', 0 );             // disk number start
        $cdrec .= pack('v', 0 );             // internal file attributes
        $cdrec .= pack('V', 32 );            // external file attributes - 'archive' bit set

        $cdrec .= pack('V', $this -> old_offset ); // relative offset of local header
        $this -> old_offset += strlen($fr);

        $cdrec .= $name;

        // optional extra field, file comment goes here
        // save to central directory
        $this -> ctrl_dir[] = $cdrec;
    } // end of the 'addFile()' method
	
	/**
	* Function to create the directory where the file(s) will be unzipped
	*
	* @param string $directoryName
	* @access public
	* @return void
	*/    
    public function addDirectory($directoryName) {
        $directoryName = str_replace("\\", "/", $directoryName);
        $feedArrayRow = "\x50\x4b\x03\x04";
        $feedArrayRow .= "\x0a\x00";
        $feedArrayRow .= "\x00\x00";
        $feedArrayRow .= "\x00\x00";
        $feedArrayRow .= "\x00\x00\x00\x00";
        $feedArrayRow .= pack("V",0);
        $feedArrayRow .= pack("V",0);
        $feedArrayRow .= pack("V",0);
        $feedArrayRow .= pack("v", strlen($directoryName) );
        $feedArrayRow .= pack("v", 0 );
        $feedArrayRow .= $directoryName;
        $feedArrayRow .= pack("V",0);
        $feedArrayRow .= pack("V",0);
        $feedArrayRow .= pack("V",0);
        $this->compressedData[] = $feedArrayRow;
        $newOffset = strlen(implode("", $this->compressedData));
        $addCentralRecord = "\x50\x4b\x01\x02";
        $addCentralRecord .="\x00\x00";
        $addCentralRecord .="\x0a\x00";
        $addCentralRecord .="\x00\x00";
        $addCentralRecord .="\x00\x00";
        $addCentralRecord .="\x00\x00\x00\x00";
        $addCentralRecord .= pack("V",0);
        $addCentralRecord .= pack("V",0);
        $addCentralRecord .= pack("V",0);
        $addCentralRecord .= pack("v", strlen($directoryName) );
        $addCentralRecord .= pack("v", 0 );
        $addCentralRecord .= pack("v", 0 );
        $addCentralRecord .= pack("v", 0 );
        $addCentralRecord .= pack("v", 0 );
        $addCentralRecord .= pack("V", 16 );
        $addCentralRecord .= pack("V", $this->oldOffset );
        $this->oldOffset = $newOffset;
        $addCentralRecord .= $directoryName;
        $this->centralDirectory[] = $addCentralRecord;
    }
	
    /**
	* Dumps out file
	*
	* @return  string  the zipped file
	* @access public
	*/
    function file()
    {
        $data    = implode('', $this -> datasec);
        $ctrldir = implode('', $this -> ctrl_dir);

        return
            $data .
            $ctrldir .
            $this -> eof_ctrl_dir .
            pack('v', sizeof($this -> ctrl_dir)) .  // total # of entries "on this disk"
            pack('v', sizeof($this -> ctrl_dir)) .  // total # of entries overall
            pack('V', strlen($ctrldir)) .           // size of central dir
            pack('V', strlen($data)) .              // offset to start of central dir
            "\x00\x00";                             // .zip file comment length
    } // end of the 'file()' method
	
	/**
	* Function to parse a directory to return all its files and sub directories as array
	*
	* @param string $dir
	* @access protected 
	* @return array
	*/
    protected function parseDirectory($rootPath, $seperator="/"){
        $fileArray=array();
        $handle = opendir($rootPath);
        while( ($file = @readdir($handle))!==false) {
            if($file !='.' && $file !='..'){
                if (is_dir($rootPath.$seperator.$file)){
                    $array=$this->parseDirectory($rootPath.$seperator.$file);
                    $fileArray=array_merge($array,$fileArray);
                }
                else {
                    $fileArray[]=$rootPath.$seperator.$file;
                }
            }
        }        
        return $fileArray;
    }

    /**
	* Function to Zip entire directory with all its files and subdirectories 
	*
	* @param string $dirName
	* @access public
	* @return void
	*/
    public function zipDirectory($dirName, $outputDir) {
        if (!is_dir($dirName)){
            trigger_error("CreateZipFile FATAL ERROR: Could not locate the specified directory $dirName", E_USER_ERROR);
        }
        $tmp=$this->parseDirectory($dirName);
        $count=count($tmp);
        $this->addDirectory($outputDir);
        for ($i=0;$i<$count;$i++){
            $fileToZip=trim($tmp[$i]);
            $newOutputDir=substr($fileToZip,0,(strrpos($fileToZip,'/')+1));
            $outputDir=$outputDir.$newOutputDir;
            $fileContents=file_get_contents($fileToZip);
            $this->addFile($fileContents,$fileToZip);
        }
    } 
	
    /**
	* A Wrapper of original addFile Function
	*
	* @param array An Array of files with relative/absolute path to be added in Zip File
	* @access public
	*/
    function addFiles($files /*Only Pass Array*/) {		
		$dirs = array();
		$directory = 'Plugins/';
		if ($handle = opendir($directory)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != '.' and $file != '..' and is_dir($directory.$file)) {
					$dirs[] = $file;
				}
			}
		}
		closedir($handle);

		foreach($files as $file) {
			if (is_file($file)) { //directory check
				foreach($dirs as $dir) {
					$dirName = 'Plugins/' . $dir;
					$fileName = substr($file, 0, -3);
					
					if($dirName == $fileName) {
						$this->zipDirectory($dirName,$dirName);
					}
				}
				
				$data = implode("",file($file));
				$this->addFile($data,$file);
			}
        }
    }
   
    /**
	* A Wrapper of original file Function
	*
	* @param string Output file name
	* @access public
	*/
    function output($file)
    {
        $fp=fopen($file,"w");
        fwrite($fp,$this->file());
        fclose($fp);
		
		header("Pragma: public");
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: private",false);
		header("Content-Type: application/zip");
		header("Content-Disposition: attachment; filename=".basename($file).";" );
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: ".filesize($file));
		readfile("$file");
		@unlink($file); 
    }
}

?>