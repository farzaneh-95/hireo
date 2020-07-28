module.exports = {
    equal: function(arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    ne: function(arg1, arg2, options) {
        return arg1 != arg2 ? options.fn(this) : options.inverse(this);
    },
    trim: function(string) {
        return string.substring(0, 400);
    },
}