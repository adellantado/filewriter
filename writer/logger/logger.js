/**
 * Simple logger
 *
 * @author Alex
 *
 */

function Log(active, target) {

    const DEBUG_LEVEL = 0;
    const INFO_LEVEL = 2;
    const WARNING_LEVEL = 4;
    const ERROR_LEVEL = 8;
    const FATAL_LEVEL = 16;

    var active = active;
    var targets = [];

    if (target instanceof Target) {
        targets.push(target);
    }

    this.debug = function(msg) {
        write(parse(msg, arguments), DEBUG_LEVEL);
    }

    this.info = function(msg) {
        write(parse(msg, arguments), INFO_LEVEL);
    }

    this.warning = function(msg) {
        write(parse(msg, arguments), WARNING_LEVEL);
    }

    this.error = function(msg) {
        write(parse(msg, arguments), ERROR_LEVEL);
    }

    this.fatal = function(msg) {
        write(parse(msg, arguments), FATAL_LEVEL);
    }

    this.addTarget = function(target) {
        if (target instanceof Target) {
            targets.push(target);
        }
    }

    this.removeTarget = function(target) {
        var index = targets.indexOf(target);
        if (index < 0) {
            throw new Error("Target can't be found");
        }
        targets.splice(index, 1);
    }

    function getTime() {
        var date = new Date();
        return "["+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"]";
    }

    function getLevel(level) {
        switch (level) {
            case DEBUG_LEVEL:
                return "[DEBUG]";
            case INFO_LEVEL:
                return "[INFO]";
            case WARNING_LEVEL:
                return "[WARNING]";
            case ERROR_LEVEL:
                return "[ERROR]";
            case FATAL_LEVEL:
                return "[FATAL]";
        }
        return "";
    }

    function parse(msg, agrs) {
        for (var i = 1; i < agrs.length; i++) {
            msg = msg.replace(new RegExp("\\{"+i+"\\}", "g"), agrs[i]);
        }
        return msg;
    }

    function write(msg, level) {
        if (!active) return;
        targets.forEach(function(target) {
            if (target.level > level) return;
            var prefix = "";
            if (target.includeLevel) {
                prefix += getLevel(level) + " ";
            }
            if (target.includeTime) {
                prefix += getTime() + " ";
            }
            target.log(prefix + msg);
        });
    }

}

this.Target = function(level, includeTime, includeLevel) {

    this.log = function(message) {
        //
    }

    this.isSupported = function() {
        //
    }

    this.level = level;
    this.includeTime = includeTime;
    this.includeLevel = includeLevel;

}

this.WorkerTarget = function(level, includeTime, includeLevel) {
    var self = this;
    this.__proto__ = new Target();
    Target.call(this, level, includeTime, includeLevel);

    this.log = function(message) {
        self.__proto__.log(message);
        postMessage({log: message});
    }

    this.isSupported = function() {
        self.__proto__.isSupported();
        if (!postMessage) {
            throw new Error("Worker target unsupported");
        }
    }();

}

this.ConsoleTarget = function(level, includeTime, includeLevel) {
    var self = this;
    this.__proto__ = new Target();
    Target.call(this, level, includeTime, includeLevel);

    this.log = function(message) {
        self.__proto__.log(message);
        console.log(message);
    }

    this.isSupported = function() {
        self.__proto__.isSupported();
        if (!console) {
            throw new Error("Console target unsupported");
        }
    }();

}