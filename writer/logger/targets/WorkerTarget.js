
//WorkerTarget.prototype = new Target;

/*WorkerTarget.prototype.log = function(message) {
    postMessage({log: message});
}*/

this.WorkerTarget = function(level) {

    supported();

    this.includeTime = true;
    this.includeLevel = true;

    this.level = level;


    this.log = function(message) {
        postMessage({log: message});
    }

     function supported() {
        if (!postMessage) {
            throw new Error("Worker target unsupported");
        }
    }

}
