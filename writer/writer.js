/**
 * Base commands to work with filesystem
 * @param fileSystem
 * @constructor
 */
this.Writer = function(fileSystem) {

const MOVE_BACK = "..";

/**
* @default '/'
*/
this.separator = "/";

var fileSystem = fileSystem;

/**
* @default root
*/
var currentEntry = fileSystem.rootEntry;

var savedPositions = [];

this.cd = function(path) {
	var entry = currentEntry;
	/*if (path instanceof DirectoryEntrySync) {
		entry = path;
	} else {*/
		var folders = parsePath(path);
		try {
			for (var i = 0; i < folders.length; i++) {
				var name = folders[i];
				entry = getDirectoryEntry(name, entry);
			}
		} catch (error) {
			throw new Error("Can't find a path");
		}
	//}

    currentEntry = entry;
    return path;
}

this.ls = function() {
	var isEntries = arguments.length;// && arguments[1]==true;
	
	var entries = currentEntry.createReader().readEntries();
	
	if (isEntries) {
		return entries;
	}
    var names = [];
    for (var i = 0; i < entries.length; i++) {
        names.push(entries[i].name);
    }
	return names;
}

this.pwd = function() {
	return currentEntry.fullPath || "/";
}

this.mkdir = function(name) {
    var entry = currentEntry.getDirectory(name, {create: true, exclusive: true});
    return entry.name || "";
}

this.rm = function(name) {
    currentEntry.getFile(name, {create: false}).remove();
    return name;
}

this.rmdir = function(name, recursively) {
    var recursionNum = arguments.length > 2 ? arguments[3] : 1;
    if (recursionNum == 1) {
        safePosition();
    }

	if (recursively) {
        this.cd(name);
        currentEntry.removeRecursively();
	} else {
		var entries = this.ls(true);
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if (entry.isFile) {
				restorePosition();
				throw new Error("Directory can't be deleted, cause contains files");
			} else if (entry.isDirectory) {
				this.cd(entry.name);
				this.rmdir(entry.name, false, ++recursionNum);
			} else {
                throw new Error("Entity is undefined");
            }
		}
	}

    if (recursionNum == 1) {
        restorePosition();
        return name;
    }
}

this.cp = function(name, path) {
    var entry = currentEntry.getFile(name, {create: false});
    safePosition();
    this.cd(path);
    var fileEntry = entry.copyTo(currentEntry);
    restorePosition();
    return fileEntry.name;
}

this.mv = function(name1, fullpath) {
    var res = parseFullPath(fullpath)
    var name2 = res.file;
    var path = res.path;
    var entry = currentEntry.getFile(name1, {create: false});
    safePosition();
    cd(path);
    var fileEntry = entry.moveTo(currentEntry, name2);
    restorePosition();
    return name2;
}

this.mkfile = function(name, data) {
    var isAppend = arguments[3] === true;
    var entry = currentEntry.getFile(name, {create: !isAppend, exclusive: true});
    var fileWriter = entry.createWriter();
    if (isAppend) {
        fileWriter.seek(fileWriter.length);
    }
    fileWriter.write((data instanceof Blob) ? data : new Blob([data], {type: 'text/plain'}));
    return entry.name || "";
}

this.getfile = function(name) {
    var entry = currentEntry.getFile(name, {create: false});
    var file = entry.file();
    return file;
}

this.apppendfile = function(name, data) {
    return mkfile(name, data, true);
}

function getDirectoryEntry(name, baseDirectoryEntry) {
    baseDirectoryEntry = baseDirectoryEntry || currentEntry;
    if (name == MOVE_BACK) {
        return baseDirectoryEntry.getParent();
    } else {
        return baseDirectoryEntry.getDsirectory(name, {create: false});
    }
}

function safePosition() {
	savedPositions.push(currentEntry);
}

function restorePosition() {
	currentEntry = savedPositions.pop();
}


function parseFullPath(fullpath) {
    var filename = fullpath.replace(/^.*[\\\/]/, '');
    var path = fullpath.substring(0, fullpath.indexOf(filename));
    return {path: path, file: filename};
}

function parsePath(path) {
	var folders = path.split(this.separator);
	for (var i = 0; i < folders.length; i++) {
        if (folders[i] === "" || folders[i] === " ") {
            folders.splice(i--, 1);
        }
    }
	return folders;
}

}