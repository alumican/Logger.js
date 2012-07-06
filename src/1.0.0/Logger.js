net.alumican.util.Namespace('net.alumican.logger').register('Logger', (function() {

	function Logger() {
	}

	//----------------------------------------
	// PUBLC STATIC MEMBER
	//----------------------------------------

	Logger.DEBUG  = 10;
	Logger.INFO   = 20;
	Logger.WARN   = 30;
	Logger.ERROR  = 40;
	Logger.FATAL  = 50;
	Logger.SILENT = Number.POSITIVE_INFINITY;

	//----------------------------------------
	// PUBLC STATIC METHOD
	//----------------------------------------

	/**
	 * logging level
	 */
	Logger.setLevel = function(level) { _level = level; };
	Logger.getLevel = function() { return _level; };

	/**
	 * whether dumpler is enavled or not
	 */
	Logger.setDumpEnabled = function(enabled) { _dumpEnabled = enabled; };
	Logger.getDumpEnabled = function() { return _dumpEnabled; };

	/**
	 * add log writer
	 */
	Logger.addWriter = function(writer) {
		if ((typeof writer.logger_guid != 'undefined') && (typeof _writers[writer.logger_guid] != 'undefined')) return;
		_writers[_guid] = writer;
		writer.logger_guid = _guid;
		++_guid;
	};

	/**
	 * remove log writer
	 */
	Logger.removeWriter = function(writer) {
		if ((typeof writer.logger_guid == 'undefined') || (typeof _writers[writer.logger_guid] == 'undefined')) return;
		delete _writers[writer.logger_guid];
		delete writer.logger_guid;
	};

	/**
	 * logging with debug level
	 */
	Logger.debug = function(messages) {
		if (_level > Logger.DEBUG) return;
		_print('[DEBUG] ' + Array.prototype.join.call(arguments, ' '), Logger.DEBUG);
	};

	/**
	 * logging with info level
	 */
	Logger.info = function(messages) {
		if (_level > Logger.INFO) return;
		_print('[INFO]  ' + Array.prototype.join.call(arguments, ' '), Logger.INFO);
	};

	/**
	 * logging with warn level
	 */
	Logger.warn = function(messages) {
		if (_level > Logger.WARN) return;
		_print('[WARN]  ' + Array.prototype.join.call(arguments, ' '), Logger.WARN);
	};

	/**
	 * logging with error level
	 */
	Logger.error = function(messages) {
		if (_level > Logger.ERROR) return;
		_print('[ERROR] ' + Array.prototype.join.call(arguments, ' '), Logger.ERROR);
	};

	/**
	 * logging with fatal level
	 */
	Logger.fatal = function(messages) {
		if (_level > Logger.FATAL) return;
		_print('[FATAL] ' + Array.prototype.join.call(arguments, ' '), Logger.FATAL);
	};

	/**
	 * clear all log
	 */
	Logger.clear = function() {
		for (var guid in _writers) {
			_writers[guid].clear.apply(null);
		}
	};

	/**
	 * dump object
	 */
	Logger.dumpToConsole = function(object) {
		if (!_dumpEnabled || typeof console == 'undefined' || typeof console.log == 'undefined') return;
		console.log(object);
	};

	//----------------------------------------
	// PRIVATE STATIC MEMBER
	//----------------------------------------

	var _level = Logger.DEBUG;
	var _dumpEnabled = false;
	var _writers = {};
	var _guid = 0;

	//----------------------------------------
	// PRIVATE STATIC METHOD
	//----------------------------------------

	var _print = function(message, level) {
		for (var guid in _writers) {
			_writers[guid].print.apply(null, [message, level]);
		}
	};

	return Logger;
})());

/**
 * Logging with "window.alert(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('AlertWriter',
	function AlertWriter() {
		this.print = function(message, level) {
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
		var isConsoleAvailable = typeof console != 'undefined';
		var isPrintAvailable = isConsoleAvailable && (typeof console.log != 'undefined');
		var isClearAvailable = isConsoleAvailable && (typeof console.clear != 'undefined');
		this.print = function(message, level) {
			if(isPrintAvailable) console.log(message);
		};
		this.clear = function() {
			if(isClearAvailable) console.clear();
		};
	}
);

/**
 * Logging with "callback(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('CallbackWriter',
	function CallbackWriter(print, remove) {
		this.print = function(message, level) {
			print.apply(null, arguments);
		};
		this.clear = function() {
			if (typeof remove != 'undefined') remove.apply(null, arguments);
		};
	}
);

/**
 * Logging with jQuery "element.append(message)" or "element.prepend(message)"
 */
net.alumican.util.Namespace('net.alumican.logger').register('JQueryWriter',
	function JQueryWriter(element, append) {
		if (typeof append == 'undefined') append = true;
		this.print = function(message, level) {
			append ? element.append(message + '\n') : element.prepend(message + '\n');
		};
		this.clear = function() {
			element.remove();
		};
	}
);

/**
 * Logging with pushing to stack
 */
net.alumican.util.Namespace('net.alumican.logger').register('StackWriter',
	function StackWriter() {
		this.log = [];
		var self = this;
		this.print = function(message, level) {
			self.log.push({ message : message, level : level });
		};
		this.clear = function() {
			self.log = [];
		};
	}
);