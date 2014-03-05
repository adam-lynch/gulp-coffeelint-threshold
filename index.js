'use strict';
var through = require('through');

module.exports = function(maxWarnings, maxErrors, callbackOnFailure){
    var pluginName = 'coffeelint-threshold',
        fail = false,
        checkForErrors = maxErrors !== -1,
        checkForWarnings = maxWarnings !== -1;

    if(checkForErrors){
        var errorThreshold = maxErrors === -1 ? null : maxErrors,
            numberOfErrors = 0;
    }

    if(checkForWarnings){
        var warningThreshold = maxWarnings === -1 ? null : maxWarnings,
            numberOfWarnings = 0;
    }

    function bufferContents(file){
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new Error(pluginName, 'Streaming not supported'));

        if(checkForErrors){
            numberOfErrors += file.coffeelint.errorCount;

            if(!fail && numberOfErrors > errorThreshold){
                fail = true;
            }
        }

        if(checkForWarnings){
            numberOfWarnings += file.coffeelint.warningCount;

            if(!fail && numberOfWarnings > warningThreshold){
                fail = true;
            }
        }

        this.emit('data', file);
    }

    function endStream(){
        if(fail) callbackOnFailure(numberOfWarnings, numberOfErrors);
    }

    return through(bufferContents, endStream);
};

