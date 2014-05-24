'use strict';
var through = require('through');

module.exports = function(maxWarnings, maxErrors, callbackOnFailure){
    var pluginName = 'gulp-coffeelint-threshold',
        fail = false,
        checkForErrors = maxErrors !== -1,
        checkForWarnings = maxWarnings !== -1,
        numberOfWarnings = 0,
        numberOfErrors = 0;

    if(checkForErrors){
        var errorThreshold = maxErrors === -1 ? null : maxErrors;
    }

    if(checkForWarnings){
        var warningThreshold = maxWarnings === -1 ? null : maxWarnings;
    }

    function bufferContents(file) {
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new Error(pluginName, 'Streaming not supported'));

        if (file.coffeelint) {
            numberOfErrors += file.coffeelint.errorCount;
            numberOfWarnings += file.coffeelint.warningCount;

            if (!fail && (checkForWarnings && numberOfWarnings > warningThreshold)
                || (checkForErrors && numberOfErrors > errorThreshold)) {
                fail = true;
            }
        }

        this.emit('data', file);
    }

    function endStream(){
        if(fail) callbackOnFailure(numberOfWarnings, numberOfErrors);
        this.emit('end');
    }

    return through(bufferContents, endStream);
};

