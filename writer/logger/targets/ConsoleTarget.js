
this.ConsoleTarget = function() {
    supported();

    this.supported = function () {
        if (!console) {
            throw new Error("Console target unsupported");
        }
    }
}

ConsoleTarget.prototype = new Target();

ConsoleTarget.prototype.log = function(message) {
    console.log(message);
}