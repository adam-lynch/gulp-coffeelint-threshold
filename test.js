var coffeelintThreshold = require('./');
var mocha = require('mocha');
var File = require('vinyl');
var Buffer = require('buffer').Buffer;
var chai = require('chai');
var expect = chai.expect;


var createFile = function(success, numberOfWarnings, numberOfErrors) {
    var file =  new File({
        cwd: "/",
        base: "/test/",
        path: "/test/file.coffee",
        contents: new Buffer("the actual content of the file doesn't matter")
    });

    file.coffeelint = {
        success: success,
        warningCount: numberOfWarnings,
        errorCount: numberOfErrors
    };

    return file;
};

describe('gulp-coffeelint-threshold', function(){

    it("should skip file if file.coffeelint doesn't exist", function(done){
        var file = new File({
            cwd: "/",
            base: "/test/",
            path: "/test/file.coffee",
            contents: new Buffer("aaa")
        });

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(0, 0, function(){
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(0);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("shouldn't call callback if no errors or warnings were given", function(done){
        var file = createFile(true, 0, 0);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(0, 0, function(){
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(0);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should ignore errors and warnings if specified to", function(done){
        var file = createFile(false, 2222, 199);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(-1, -1, function(){
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(0);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should call callback if warning count exceeds specified threshold", function(done){
        var file = createFile(false, 2, 0);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(0, 0, function(numberOfWarnings){
            expect(numberOfWarnings).to.equal(2);
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(1);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should call callback if error count exceeds specified threshold", function(done){
        var file = createFile(false, 0, 5);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(0, 1, function(numberOfWarnings, numberOfErrors){
            expect(numberOfErrors).to.equal(5);
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(1);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("shouldn't call callback if error or warning count matches specified threshold", function(done){
        var file = createFile(false, 4, 5);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(4, 5, function(){
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(0);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should pass warning count to callback on failure even if -1 was passed for threshold of warnings", function(done){
        var file = createFile(false, 3, 4);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(-1, 0, function(numberOfWarnings, numberOfErrors){
            expect(numberOfWarnings).to.equal(3);
            expect(numberOfErrors).to.equal(4);
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(1);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should pass error count to callback on failure even if -1 was passed for threshold of errors", function(done){
        var file = createFile(false, 3, 4);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(1, -1, function(numberOfWarnings, numberOfErrors){
            expect(numberOfWarnings).to.equal(3);
            expect(numberOfErrors).to.equal(4);
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(1);
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("shouldn't call callback on failure if -1 was passed for thresholds", function(done){
        var fileA = createFile(false, 3, 4),
            fileB = createFile(false, 13, 14);

        var numberOfTimesTheCallbackWasCalled = 0;
        var numberOfOutputFiles = 0;

        var stream = coffeelintThreshold(-1, -1, function(){
            numberOfTimesTheCallbackWasCalled++;
        });

        stream.on('data', function(){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfTimesTheCallbackWasCalled).to.equal(0);
            expect(numberOfOutputFiles).to.equal(2);
            done();
        });

        stream.write(fileA);
        stream.write(fileB);
        stream.end();
    });
});