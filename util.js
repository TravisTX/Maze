var Util = function () {
    randomRangeInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    randomRange = function (min, max) {
        return Math.random() * (max - min) + min;
    }

    mapRange = function (value, min1, max1, min2, max2) {
        return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
    }

    clamp = function(value, min, max) {
        return Math.min(Math.max(min, value), max);
    }

    return {
        randomRangeInt: randomRangeInt,
        randomRange: randomRange,
        mapRange: mapRange,
        clamp: clamp
    }
} ();