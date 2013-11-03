filewriter
==========

FileSystem API..

##Supported commands:
- <b>cd</b>(<i>path</i>)
- <b>pwd</b>()
- <b>ls</b>()
- <b>cp</b>(<i>name</i>, <i>path</i>) <br/>
  copy file to directory with <i>path</i>
- <b>mv</b>(<i>name1</i>, <i><name2/i>) <br/>
  move file <i>name1</i> to .. <br/>
  optional: <i>name2</i> to rename
- <b>mkdir</b>(<i>name</i>) <br/>
  create directory
- <b>rm</b>(<i>name</i>) <br/>
  removes file by name
- <b>rmdir</b>(<i>name</i>, <i>recursively</i>) <br/>
  removes directory by name <br/>
  optional: recursively - removes directory no matter includes it files or not
- <b>mkfile</b>(<i>name</i>, <i>data</i>)
- <b>appendfile</b>(<i>name</i>, <i>data</i>)
- <b>getfile</b>(<i>name</i>)
