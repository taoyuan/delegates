/**
 * Expose `Delegator`.
 */

exports = module.exports = function (proto, target) {
    return new Delegator(proto, target);
};

exports.Delegator = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
    if (!(this instanceof Delegator)) return new Delegator(proto, target);
    this.proto = proto;
    this.target = target;
    this.methods = [];
    this.getters = [];
    this.setters = [];
}

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function (name) {
    var proto = this.proto;
    var target = this.target;
    this.methods.push(name);

    if (typeof target === 'object') {
        proto[name] = function () {
            return target[name].apply(this[target], arguments);
        };
    } else {
        proto[name] = function () {
            return this[target][name].apply(this[target], arguments);
        };
    }

    return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function (name) {
    return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function (name) {
    var proto = this.proto;
    var target = this.target;
    this.getters.push(name);

    if (typeof target === 'object') {
        proto.__defineGetter__(name, function () {
            return target[name];
        });
    } else {
        proto.__defineGetter__(name, function () {
            return this[target][name];
        });
    }

    return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function (name) {
    var proto = this.proto;
    var target = this.target;
    this.setters.push(name);

    if (typeof target === 'object') {
        proto.__defineSetter__(name, function (val) {
            return target[name] = val;
        });
    } else {
        proto.__defineSetter__(name, function (val) {
            return this[target][name] = val;
        });
    }

    return this;
};