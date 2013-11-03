self.addEventListener('message', function(e) {
    var data = e.data;
    if (data == "init") {
        callFileSystem();
    } else if (data.run) {
        log.info(data.command + ": " + writer[data.command].apply(this, data.args));
    } else {
        self.postMessage({get: data});
    }
}, false);

importScripts('logger/logger.js');
importScripts('logger/targets/WorkerTarget.js');
importScripts('writer.js');


var log = new Log(true, new WorkerTarget(0));

self.requestFileSystemSync = self.requestFileSystemSync || self.webkitRequestFileSystemSync;


self.size = 5*1024*1024;

function callFileSystem() {
    if (self.requestFileSystemSync) {
        self.fileSystem = self.requestFileSystemSync(self.PERSISTENT, self.size);
        if (self.fileSystem) {
            log.info("File System initialized: name={1}, type={2}, size={3}",self.fileSystem.name, self.PERSISTENT, self.size);
            self.writer = test();
        } else {
            log.error("File system haven't been initialized");
        }
    } else {
        log.error("File System doesn't supported");
    }
}


function errorHandler(e) {
    var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Quota exceeded.';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'Not found.';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error.';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification.';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state.';
            break;
        default:
            msg = 'Unknown error.';
            break;
    };
    var errorMsg = "FileWriter error";
    log.error(errorMsg+": message={1}", msg);
}

function test() {
    var writer = new Writer(self.fileSystem.root);
    /*log.info("pwd: "+writer.pwd());
    log.info("mkdir-cd: "+writer.cd(writer.mkdir("asd1")));
    log.info("mkdir-cd: "+writer.cd(writer.mkdir("asd2")));
    log.info("mkdir-cd: "+writer.cd(writer.mkdir("asd3")));
    log.info("mkfile: "+writer.mkfile("asd4.txt", "file datasssss"));*/
    return writer;
}


