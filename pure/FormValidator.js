/**
 * @author romajs
 * @param {type} prefix
 * @returns {FormValidator}
 */
var FormValidator = function(prefix) {

    var self = this;
    this.errors = [];
    this.prefix = prefix;

    /**
     * set prefix
     * @param {type} prefix
     * @returns {undefined}
     */
    this.setPrefix = function(prefix) {
        this.prefix = prefix;
    };

    /**
     * clear all form errors
     * @returns {FormValidator}
     */
    this.clearErrors = function() {
        this.errors = [];
        return this;
    };

    /**
     * force add error
     * @param {type} error
     * @param {type} params (optional)
     * @returns {undefined}
     */
    this.addError = function(error, params) {
        if (typeof params === 'string') {
            params = [params];
        }
        this.errors.push({message: this.prefix + '.' + error, params: params});
        return this;
    };

    /**
     * list all errors
     * @returns {Array}
     */
    this.listErrors = function() {
        var messages = [];
        for (var i in this.errors) {
            messages.push(this.errors[i].message);
        }
        return messages;
    };

    /**
     * verify if has errors
     * @returns {Boolean}
     */
    this.hasErrors = function() {
        return this.errors.length > 0;
    };

    /**
     * verify if has NO errors
     * @returns {Boolean}
     */
    this.hasNoErrors = function() {
        return !this.hasErrors();
    };

    /**
     * default compare expression
     * @param {type} value
     * @returns {Boolean}
     */
    this.compare = function(value) {
        return value !== undefined && value !== null && value !== '';
    };

    /**
     * validate if expression is true
     * @param {type} expression
     * @param {type} error
     * @param {type} compare
     * @returns {FormValidator}
     */
    this.validateExpression = function(expression, error, compare) {

        compare = compare || this.compare;

        if (!compare(expression)) {
            this.addError(error);
        }

        return this;
    };

    /**
     * validate regular expression
     * @param {type} pattern
     * @param {type} value
     * @param {type} error
     * @returns {FormValidator}
     */
    this.validateRegExp = function(pattern, value, error) {
        if (!new RegExp(pattern).test(value)) {
            this.addError(error);
        }
        return this;
    };

    /**
     * compare each element of the collection, could be an object or an array
     * @param {type} obj
     * @param {type} error
     * @param {type} ignoredFields
     * @param {type} compare
     * @returns {FormValidator}
     */
    this.validateCollection = function(obj, error, ignoredFields, compare) {

        compare = compare || this.compare;

        isIgnoredField = function(field) {
            for (var key in ignoredFields) {
                if (field === ignoredFields[key]) {
                    return true;
                }
            }
            return false;
        };

        for (var key in obj) {
            if (isIgnoredField(key)) {
                continue;
            }
            if (!compare(obj[key])) {
                this.addError(error, key);
            }
        }

        return this;
    };

    /**
     * valid fields in form
     * @param {type} form
     * @returns {FormValidator}
     */
    this.validateForm = function(form) {
        angular.forEach(form, function(field, fieldName) {
            if (field.$invalid) {
                angular.forEach(field.$error, function(error, errorName) {
                    if (error) {
                        self.addError(fieldName + '.' + errorName);
                    }
                });
            }
        });
        return this;
    };

};