'use strict'; 

/**
 * Handler 
 * 
 * John R. Kosinski 
 * 11 May 2016
 * 
 * Options: 
 *  logPrefix {string}
 *  onError {function}
 *  finally {function}
 *  rethrow {bool}
 *  defaultReturnValue {*}
 */
function Handler(options) {
    const _this = this; 
    const _options = options; 

    /**
     * returns the appropriate option value to use, given the preconfigured options and the 
     * given option overrides 
     * 
     * @param {*} name 
     *  name of the desired option 
     * @param {*} overrides 
     *  json structure containing option overrides (optional) 
     */
    const getOptionForUse = (name, overrides) => {
        if (overrides && isDefined(overrides[name]))
            return overrides[name]; 
        return _this.getOption(name);
    }; 

    /**
     * gets the current value of the given option 
     * 
     * @param {*} name 
     *  name of an option property 
     */
    /* any */ this.getOption = (name) => {
        if (_options) {
            return _options[name];
        }
        return null;
    }; 

    /**
     * wraps the given functional expression in a try-catch-finally, executes it, and 
     * reacts to errors according to  configured options 
     * 
     * @param {*} f 
     *  the functional expression to wrap & execute
     * @param {*} options 
     *  any options to be overridden for this particular call 
     * 
     * @returns
     *  the return value of the given expression, if any; or in the event of an error, the 
     *  configured default return value (if any) 
     */
    /* any */ this.try = (f, options) => {
        let error = null; 
        try {
            return f();
        }
        catch(e) {
            error = err;

            //basic error handling first 
            if (_this.handleError)
                _this.handleError(err, options); 

            //get options as defined or overridden
            const onError = getOptionForUse('onError', options); 
            const rethrow = getOptionForUse('rethrow', options); 
            const defaultReturnValue = getOptionForUse('defaultReturnValue', options); 

            //additional error handling
            if (onError && isFunction(onError)) {
                return onError(err); 
            }

            //rethrow option 
            if (rethrow) {
                throw err; 
            }

            //return default value by default
            return defaultReturnValue; 
        }
        finally {
            //finally if configured 
            const fin = getOptionForUse('finally', options); 
            if (fin && isFunction(fin)) {
                fin(error); 
            }
        }
    };

    /**
     * default handling of errors caught; can be overridden globally 
     * 
     * @param {*} e 
     *  the exception caught
     */
    this.handleError = (e, options) => {
        const logPrefix = getOptionForUse('logPrefix', options); 
        if (logPrefix)
            console.log(logPrefix + ': ' + err); 
        else 
            console.log(err); 
    }; 
}

/**
 * creates & returns a new instance 
 * 
 * @param {json} options
 *  configuration options 
 */
/*Handler*/ function create(options) {
    return new Handler(options);
}

// *** HELPER FUNCTIONS ***

/**
 * determines whether the given value is a callable function
 * 
 * @param {*} f 
 *  value to check for function-ness
 */
/*bool*/ function isFunction(f) {
    return f && {}.toString.call(f) === '[object Function]';
}

/**
 * determines whether the given value is defined 
 * 
 * @param {*} v     
 *  value to check 
 */
/*bool*/ function isDefined(v) {
    return typeof v === 'undefined'; 
}


module.exports = {
    create
};

module.exports = function excepUtil(logPrefix) {
    function ExcepUtil() {
        const _this = this; 

        this.try = (expr, options) => {
            let error = null; 
            try {
                return expr();
            }
            catch(err) {
                try {
                    error = err;
                    _this.handleError(err); 
                    if (options && options.onError) {
                        return options.onError(err); 
                    }
                    if (options && options.rethrow) {
                        throw err; 
                    }

                    return options ? options.defaultValue : null; 
                } catch(e) {}
            }
            finally {
                if (options && options.finally) 
                    return options.finally(error); 
            }
        }; 

        this.handleError = (err) => {
            console.log(logPrefix + ': ' + err); 
        }; 
    }

    return new ExcepUtil();
};