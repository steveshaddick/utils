/**
 * @title 	Javascript Resize Handler
 * @author	Steve Shaddick
 * @version 1.0
 *
 * @description 	Handles window resizing, timeout based to avoid clogging the execution stack while resizing
 *
 *
 */
var ResizeHandler = (function(){

	var callbacks = [];
	
	var needResize = false;
	var resizeTimeout = null;
	var callbacksLength = 0;
	
	/**********************
	 * @function	add
	 * @input	callback (function) : function to add to the window resize handler
	 * 
	 * @description		adds a function to the general callback handler
	 * 
	 */
	function add(callback) {
		if (typeof callback == "undefined") return;
		
		for (var i=0; i<callbacksLength; i++) {
			if (callbacks[i] == callback) {
				return;
			}
		}
		callbacks.push(callback);
		callbacksLength = callbacks.length;
		
		if (callbacksLength === 1) {
			$(window).bind('resize', windowResize);
		}
		
	}
	
	/**********************
	 * @function	remove
	 * @input	callback (function) : function to remove from the window resize handler
	 * 
	 * @description		removes a function from the general callback handler
	 * 
	 */
	function remove(callback) {
		for (var i=callbacksLength; i>=0; i--) {
			if (callbacks[i] == callback) {
				callbacks.splice(i, 1);
				break;
			}
		}
		callbacksLength = callbacks.length;
		if (callbacksLength === 0) {
			$(window).unbind('resize', windowResize);
		}
	}
	
	/**********************
	 * @function	resize
	 * 
	 *  @description		forces the resize handler
	 * 
	 */
	function resize() {
		resizeHandler(null, true);
	}
	
	function windowResize(e) {
		if (needResize) return;
		needResize = true;
		if (!resizeTimeout) {
			resizeHandler(e, false);
		}
	}

	function resizeHandler(e, forced) {
		if (!forced) {
			if (needResize) {
				resizeTimeout = setTimeout(resizeHandler, 50);
			} else {
				resizeTimeout = null;
				return;
			}
		} else {
			resizeTimeout = null;
		}
		
		for (var i=0; i<callbacksLength; i++) {
			callbacks[i](e);
		}
		needResize = false;
	}


	return {
		resize: resize,
		remove: remove,
		add: add
	}

}());