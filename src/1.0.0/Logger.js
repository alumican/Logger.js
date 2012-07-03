net.alumican.util.Namespace('net.alumican.logger').register('Logger', (function() {

	function Logger() {
	}

	//----------------------------------------
	// PUBLC STATIC MEMBER
	//----------------------------------------

	Logger.VERBOSE = 10;
	Logger.INFO    = 20;
	Logger.WARN    = 30;
	Logger.ERROR   = 40;
	Logger.FATAL   = 50;
	Logger.SILENT  = Number.POSITIVE_INFINITY;

	//----------------------------------------
	// PUBLC STATIC METHOD
	//----------------------------------------

	Logger.setLevel = function(level) {
		_level = level;
	};

	Logger.getLevel = function() {
		return _level;
	};

	Logger.addWriter = function(writer) {
		if ((typeof writer.logger_guid != 'undefined') && (typeof _writers[writer.logger_guid] != 'undefined')) return;
		_writers[_guid] = writer;
		writer.logger_guid = _guid;
		++_guid;
	};

	Logger.removeWriter = function(writer) {
		if ((typeof writer.logger_guid == 'undefined') || (typeof _writers[writer.logger_guid] == 'undefined')) return;
		delete _writers[writer.logger_guid];
		delete writer.logger_guid;
	};

	Logger.print = function(message) {
		for (var guid in _writers) {
			_writers[guid].print.apply(null, [message]);
		}
	};

	Logger.clear = function() {
		for (var guid in _writers) {
			_writers[guid].clear.apply(null);
		}
	};

	Logger.verbose = function(messages) {
		if (_level > Logger.VERBOSE) return;
		Logger.print('[VERBOSE] ' + Array.prototype.join.call(arguments, ' '));
	};

	Logger.info = function(messages) {
		if (_level > Logger.INFO) return;
		Logger.print('[INFO]    ' + Array.prototype.join.call(arguments, ' '));
	};

	Logger.warn = function(messages) {
		if (_level > Logger.WARN) return;
		Logger.print('[WARN]    ' + Array.prototype.join.call(arguments, ' '));
	};

	Logger.error = function(messages) {
		if (_level > Logger.ERROR) return;
		Logger.print('[ERROR]   ' + Array.prototype.join.call(arguments, ' '));
	};

	Logger.fatal = function(messages) {
		if (_level > Logger.FATAL) return;
		Logger.print('[FATAL]   ' + Array.prototype.join.call(arguments, ' '));
	};

	//----------------------------------------
	// PRIVATE STATIC MEMBER
	//----------------------------------------

	var _level = Logger.VERBOSE;
	var _writers = {};
	var _guid = 0;

	return Logger;
})());

/**
 * Logging with "window.alert(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('AlertWriter',
	function AlertWriter() {
		this.print = function(message) {
			alert(message);
		};
		this.clear = function() {
		};
	}
);

/**
 * Logging with "console.log(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('ConsoleWriter',
	function ConsoleWriter() {
		var isAvailable = (typeof console != 'undefined') && (typeof console.log != 'undefined');
		this.print = function(message) {
			if(isAvailable) console.log(message);
		};
		this.clear = function() {
			if(isAvailable) console.clear();
		};
	}
);

/**
 * Logging with "callback(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('CallbackWriter',
	function CallbackWriter(print, remove) {
		this.print = function(message) {
			print.apply(null, [message]);
		};
		this.clear = function() {
			if (typeof remove != 'undefined') remove.remove();
		};
	}
);

/**
 * Logging with jQuery "element.append(message)" or "element.prepend(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('JQueryWriter',
	function JQueryWriter(element, append) {
		if (typeof append == 'undefined') append = true;
		this.print = function(message) {
			append ? element.append(message + '\n') : element.prepend(message + '\n');
		};
		this.clear = function() {
			element.remove();
		};
	}
);