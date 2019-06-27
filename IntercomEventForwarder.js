(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	(global = global || self, factory(global['mp-intercom-kit'] = {}));
}(this, function (exports) {
	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var IntercomEventForwarder = createCommonjsModule(function (module) {
	//
	//  Copyright 2015 mParticle, Inc.
	//
	//  Licensed under the Apache License, Version 2.0 (the "License");
	//  you may not use this file except in compliance with the License.
	//  You may obtain a copy of the License at
	//
	//      http://www.apache.org/licenses/LICENSE-2.0
	//
	//  Unless required by applicable law or agreed to in writing, software
	//  distributed under the License is distributed on an "AS IS" BASIS,
	//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	//  See the License for the specific language governing permissions and
	//  limitations under the License.

	(function (window) {
	    var name = 'IntercomEventForwarder',
	        moduleId = 18,
	        MessageType = {
	            SessionStart: 1,
	            SessionEnd  : 2,
	            PageView    : 3,
	            PageEvent   : 4,
	            CrashReport : 5,
	            OptOut      : 6,
	            Commerce    : 16
	        };

	    function createObject(key, value) {
	        var obj  = {};
	        obj[key] = value;

	        return obj;
	    }

	    var constructor = function () {
	        var self              = this,
	            isInitialized     = false,
	            forwarderSettings = null,
	            reportingService  = null;


	        self.name = name;


	        function initForwarder(settings, service, testMode) {
	            forwarderSettings = settings;
	            reportingService  = service;

	            try {

	                if(!testMode) {
	                    (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update');}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;                    s.src='https://widget.intercom.io/widget/{app_id}';
	                    var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
	                }

	                bootIntercom();
	                isInitialized = true;
	                return 'Successfully initialized: ' + name;
	            }
	            catch (e) {
	                return 'Can\'t initialize forwarder: ' + name + ': ' + e;
	            }
	        }

	        function bootIntercom() {
	            var appid = forwarderSettings.appid;
	            if(!appid) {
	                return 'Can\'t boot forwarder: ' + name + ', appid is not defined';
	            }

	            var obj      = createObject('app_id', appid),
	                widgetId = forwarderSettings.widgetid || '#IntercomDefaultWidget';

	            obj.widget   = createObject('activator', widgetId);


	            try {
	                window.Intercom('boot', obj);
	            }
	            catch (e) {
	                return 'Can\'t initialize forwarder: ' + name + ': ' + e;
	            }
	            return 'Successfully booted: ' + name;
	        }


	        function processEvent(event) {
	            var reportEvent = false;

	            if (!isInitialized) {
	                return 'Can\'t send to forwarder: ' + name + ', not initialized';
	            }

	            try {
	                if (event.EventDataType == MessageType.PageEvent ||
	                    event.EventDataType == MessageType.PageView) {

	                    reportEvent = true;
	                    logEvent(event);

	                    if(reportingService) {
	                        reportingService(self, event);
	                    }
	                }
	                return 'Successfully sent to forwarder: ' + name;
	            }
	            catch (e) {
	                return 'Can\'t send to forwarder: ' + name + ' ' + e;
	            }
	        }

	        function logEvent(event) {
	            if (!isInitialized) {
	                return 'Can\'t log event on forwarder: ' + name + ', not initialized';
	            }

	            if(!event.EventName) {
	                return 'Can\'t log event on forwarder: ' + name + ', no event name';
	            }

	            event.EventAttributes = event.EventAttributes || {};

	            try {
	                window.Intercom('trackEvent',
	                    event.EventName,
	                    event.EventAttributes);
	            }
	            catch (e) {
	                return 'Can\'t log event on forwarder: ' + name + ': ' + e;
	            }
	            return 'Successfully logged event from forwarder: ' + name;
	        }

	        function setUserAttribute(key, value) {
	            if (!isInitialized) {
	                return 'Can\'t set user identity on forwarder: ' + name + ', not initialized';
	            }

	            var attr = createObject(key, value);

	            try {
	                window.Intercom('update', attr);
	            }
	            catch (e) {
	                return 'Can\'t set user attribute on forwarder: ' + name + ': ' + e;
	            }
	            return 'Successfully called update on forwarder: ' + name;
	        }

	        function setUserIdentity(id, type) {

	            if (!isInitialized) {
	                return 'Can\'t call setUserIdentity on forwarder: ' + name + ', not initialized';
	            }

	            if(!id) {
	                return 'Can\'t call setUserIdentity on forwarder: ' + name + ', without id or email';
	            }

	            var key = '';

	            if(window.mParticle.IdentityType.CustomerId === type) {
	                key = 'user_id';
	            }
	            else if(window.mParticle.IdentityType.Email === type) {
	                key = 'email';
	            }
	            else {
	                return;
	            }

	            var obj = createObject(key, id);

	            try {
	                window.Intercom('update', obj);
	            }
	            catch(e) {
	                return 'Can\'t call identify on forwarder: ' + name + ': ' + e;
	            }
	            return 'Successfully called update on forwarder: ' + name;
	        }

	        this.init             = initForwarder;
	        this.process          = processEvent;
	        this.setUserAttribute = setUserAttribute;
	        this.setUserIdentity  = setUserIdentity;
	    };

	    function getId() {
	        return moduleId;
	    }

	    function register(config) {
	        if (config.kits) {
	            config.kits[name] = {
	                constructor: constructor
	            };
	        }
	    }

	    if (!window ||
	        !window.mParticle ||
	        !window.mParticle.addForwarder) {

	        return;
	    }

	    window.mParticle.addForwarder({
	        name       : name,
	        constructor: constructor,
	        getId: getId
	    });

	    module.exports = {
	        register: register
	    };

	})(window);
	});
	var IntercomEventForwarder_1 = IntercomEventForwarder.register;

	exports.default = IntercomEventForwarder;
	exports.register = IntercomEventForwarder_1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
