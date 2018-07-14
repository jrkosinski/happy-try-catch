'use strict'; 

//better overriding of default handler 
//break into class files
//test all cases 
//write readme

simpleCase();

function simpleCase() {
    const exception = require('./index').create({ logPrefix: 'TEST'});

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

    //simple try/catch, using all default or pre-configured options 
    exception.try(() => {
        functionThatErrors();
    });
}


function allOptions() {
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',      // log prefix
        rethrow: true,          // re-throw all caught exceptions after handling
        finally: () => {},      // provide a default finally 
        onError: () => {},      // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''  // value returned if error is caught/handled (default is undefined)
    });

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

    //simple try/catch, using all pre-configured options 
    exception.try(() => {
        functionThatErrors();
    });
}

function overrideOptions() {
    //provide default options on construction
    const exception = require('./index').create({ 
        logPrefix: 'TEST',      // log prefix
        rethrow: true,          // re-throw all caught exceptions after handling
        finally: (e) => {},     // provide a default finally 
        onError: (e) => {},     // add additional, custom error handling (e.g. custom logging) 
        defaultReturnValue: ''  // value returned if error is caught/handled (default is undefined)
    });

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

    //override some or all default options on a per-call basis
    exception.try(() => {
        functionThatErrors();
    }, {
        logPrefix: 'TEST A',        // change log prefix just for this one call
        finally: null,              // do not execute a finally for this call
        defaultReturnValue: null,   // change default return value for this call
        onError: (e) => {            // additional error handling for this call
            console.log('some custom logging...');
        }
    });
}

function overrideDefaultHandling() {

    const exception = require('./index').create({ logPrefix: 'TEST'});

    //globally override the default handler 
    exception.handleError = (e, options) => {
        console.log(options.logPrefix)
    }; 

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

    exception.try(() => {
        functionThatErrors();
    });
}

function addFinally() {
    const exception = require('./index').create({ logPrefix: 'TEST'});

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

}

function withAsync() {
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
}

function withPromises() {

    const exception = require('./index').create({ logPrefix: 'TEST'});

    function functionThatErrors() {
        const x = 0; return 1/x; 
    }

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
}