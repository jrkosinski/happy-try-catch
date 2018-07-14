try-wrapper
===========

Use Case
--------
You want to 
- wrap code in try/catch and/or try/catch/finally
- provide some level of standard error handling throughout your app or module

You do not want to: 
- clutter your code with repetitive & unattractive try/catch/finally code
- repeat yourself 

Simplest Usage
--------------
The following code provides you with an object that will provide out-of-the-box standard default error handling (the default behavior is simply to print out errors to the console, with a logging prefix) when used as such: 

```javascript
    const exception = require('try-wrapper').create({ logPrefix: 'TEST'});

    //simple try/catch, using all default or pre-configured options 
    return exception.try(() => {

        //returns the return value of functionThatErrors, if it has one 
        return functionThatErrors();
    });
```

Customization
--------------
You can customize each of the following, either globally or on a case-by-case basis: 
- provide additional error handling to the default 
- completely override the default error handling
- add a finally clause 
- specify whether or not to rethrow errors after handling them (default is false) 
- provide a default return value (gets returned if function errors)

Additional Info
---------------
- works with async() type awaitables (asyncawait module) 
- works with promises 
- works with functions that return a value, or not

Examples
--------

### Simplest Use Case
```javascript
    const exception = require('try-wrapper').create({ logPrefix: 'TEST'});

    //simple try/catch, using all default or pre-configured options 
    return exception.try(() => {

        //returns the return value of functionThatErrors, if it has one 
        return functionThatErrors();
    });
```

### Add a Finally
```javascript
    const exception = require('./index').create({ logPrefix: 'TEST'});

    //simple try/catch, add finally 
    return exception.try(() => {
        return functionThatErrors();
    }, { 
        finally: (e, opts) => {
            console.log("error has been duly handled, m'liege"); 
        }
    });
```

### Customize Options Globally
```javascript
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',          // log prefix
        rethrow: true,              // re-throw all caught exceptions after handling
        finally: (e, opts) => {},   // provide a default finally 
        onError: (e, opts) => {},   // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''      // value returned if error is caught/handled (default is undefined)
    });

    //simple try/catch, using all pre-configured options 
    exception.try(() => {
        return functionThatErrors();
    });
```

### Override Options per Call
```javascript
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',      // log prefix
        rethrow: true,          // re-throw all caught exceptions after handling
        finally: (e, opts) => {},     // provide a default finally 
        onError: (e, opts) => {},     // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''  // value returned if error is caught/handled (default is undefined)
    });

    //override some or all default options on a per-call basis
    exception.try(() => {
        return functionThatErrors();
    }, {
        logPrefix: 'TEST A',        // change log prefix just for this one call
        finally: null,              // do not execute a finally for this call
        defaultReturnValue: null,   // change default return value for this call
        onError: (e, opts) => {            // additional error handling for this call
            console.log(opts.logPrefix() + ' - some custom logging...');
        }
    });
```

### Override Default Handling Globally
```javascript
    const exception = require('./index').create({ logPrefix: 'TEST'});

    //globally override the default handler 
    exception.handleErrorOverride = (e, options) => {
        console.log(options.logPrefix() + ' - eep eep'); 
    }; 

    exception.try(() => {
        return functionThatErrors();
    });
```

### Use with Promise
```javascript
    const exception = require('./index').create({ logPrefix: 'TEST'});

    //inside of promise 
    return new Promise((resolve, reject) => {

        //usage as normal 
        exception.try(() => {   
            functionThatErrors();
        }, {
            //on error, be sure to reject promise (else it will hang forever) 
            onError: (e) => {
                console.log('rejecting promise'); 
                reject(e); 
            }
        });
    }); 
```

### Use with Async/Await
```javascript
    //usage with asyncawait library 
    const exception = require('./index').create({ logPrefix: 'TEST'});
    const async = require('asyncawait/async');
    const await = require('asyncawait/await');

    //async function 
    const asyncFunctionThatErrors = async(() => {
        const x = 0; return 1/x; 
    }); 

    return exception.try(() => {
        return await(asyncFunctionThatErrors()); 
    });
```