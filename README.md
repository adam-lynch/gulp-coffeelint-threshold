gulp-coffeelint-threshold
==========


# Information
<table>
<tr>
<td>Package</td><td>gulp-coffeelint-threshold</td>
</tr>
<tr>
<td>Description</td>
<td>A [GulpJS](http://github.com/gulpjs/gulp) plugin to catch the output from [gulp-coffeelint]() and call a callback if the error or warning count is above a threshold you set.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
</table>

# Installation
```js
npm install gulp-coffeelint-threshold
```

# Usage
```js
var gulp = require('gulp');
var coffeelint = require('gulp-coffeelint');
var coffeelintThreshold = require('gulp-coffeelint-threshold');

gulp.task('lint', function() {
    gulp.src('./*.coffee')
        .pipe(coffeelint())
        .pipe(coffeelintThreshold(10, 0, function(numberOfWarnings, numberOfWarnings){
            gutil.beep();
            throw new Error('CoffeeLint failure; see above. Warning count: ' + numberOfWarnings
                + '. Error count: ' + numberOfErrors + '.');
        }));
});

gulp.task('default', ['lint']);
```

## Arguments

`coffeelintThreshold(maxWarnings, maxErrors, callbackOnFailure)`

- `maxWarnings`, a number. Set to `-1` if you don't want any warning threshold.
- `errorWarnings`, a number. Set to `-1` if you don't want any warning threshold.
- `callbackOnFailure(numberOfWarnings, numberOfWarnings)`, a function that gets called when the number of warnings or errors are over their respective thresholds you have set. It gets passed the number of warnings and errors as arguments.