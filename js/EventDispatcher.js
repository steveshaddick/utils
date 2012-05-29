/**
 * @title 	Javascript Event Dispatcher
 * @author	Josh Ho & Steve Shaddick
 * @version 1.0
 *
 * @description 	Provides global event dispatching and listening
 *
 *
 */
 var EventDispatcher = (function(){

	var events = [];
	
	/**********************
	 * @function	addEventListener
	 * @input	type (string) : event type
				callback (function) : callback function (handler). Handler definition should accept a return object as parameter (ex. "function handler(e)", see dispatchEvent)
				scope (object) :[optional] scope for handler "this"			
	 */
	function addEventListener(type, callback, scope)
	{
		if (typeof callback == "undefined") {
			return;
		}
		if (typeof events[type] == "undefined") {
			events[type] = [];
		}
		scope = (typeof scope == "undefined") ? null : scope;
		
		events[type].push({
						  callback:callback,
						  scope: scope
						  });
	}
	
	/**********************
	 * @function	removeEventListener
	 * @input	type (string) : event type
				callback (function) : callback function (handler)		
	 */
	function removeEventListener(type, callback)
	{
		if (typeof events[type] == "undefined") {
			return;
		}
		
		for (var i=0; i<events[type].length; i++)
		{
			if (events[type][i].callback == callback) {
				events[type].splice (i,1);
				i--;
			}
		}
		
		if (events[type].length == 0) {
			delete events[type];
		}
	}
	
	/**********************
	 * @function	removeEventListener
	 * @input	type (string) : event type
				data (*) : [optional] anything to pass to the handler
	
	* @output	Dispatches an event. 
				Passes an object to the handler with the following parameters:
					type (string) : event type
					data (*) : whatever is defined as data from the dispatcher
				
	 */
	function dispatchEvent(type, data)
	{
		if (typeof events[type] == "undefined") {
			return;
		}
		
		for (var i=0, len=events[type].length; i<len; i++)
		{
			if (events[type][i].scope) {
				events[type][i].callback.call(events[type][i].scope, {
																   type: type,
																   data: data
																   });
			} else {
				events[type][i].callback({
								   type: type,
								   data: data
								   });
			}
		}
	}
	
	return {
		addEventListener: addEventListener,
		removeEventListener: removeEventListener,
		dispatchEvent: dispatchEvent
	};

}());