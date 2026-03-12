"use strict";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _assert_this_initialized(self1) {
    if (self1 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self1;
}
function _async_generator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) back = back.next = request;
            else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var overloaded = value instanceof _overload_yield;
            Promise.resolve(overloaded ? value.v : value).then(function(arg) {
                if (overloaded) {
                    var nextKey = key === "return" ? "return" : "next";
                    if (!value.k || arg.done) return resume(nextKey, arg);
                    else arg = gen[nextKey](arg).value;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) resume(front.key, front.arg);
        else back = null;
    }
    this._invoke = send;
    if (typeof gen.return !== "function") this.return = undefined;
}
_async_generator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
};
_async_generator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
_async_generator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
_async_generator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function _async_generator_delegate(inner) {
    var iter = {}, waiting = false;
    function pump(key, value) {
        waiting = true;
        value = new Promise(function(resolve) {
            resolve(inner[key](value));
        });
        return {
            done: false,
            value: new _overload_yield(value, 1)
        };
    }
    iter[typeof Symbol !== "undefined" && Symbol.iterator || "@@iterator"] = function() {
        return this;
    };
    iter.next = function(value) {
        if (waiting) {
            waiting = false;
            return value;
        }
        return pump("next", value);
    };
    if (typeof inner.throw === "function") {
        iter.throw = function(value) {
            if (waiting) {
                waiting = false;
                throw value;
            }
            return pump("throw", value);
        };
    }
    if (typeof inner.return === "function") {
        iter.return = function(value) {
            if (waiting) {
                waiting = false;
                return value;
            }
            return pump("return", value);
        };
    }
    return iter;
}
function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self1 = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self1, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _await_async_generator(value) {
    return new _overload_yield(value, 0);
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _overload_yield(value, kind) {
    this.v = value;
    this.k = kind;
}
function _possible_constructor_return(self1, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self1);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _wrap_async_generator(fn) {
    return function() {
        return new _async_generator(fn.apply(this, arguments));
    };
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function wrapNativeSuper(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function _ts_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
(function() {
    var bind = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/bind.js
    function bind(fn, thisArg) {
        return function wrap() {
            return fn.apply(thisArg, arguments);
        };
    };
    var isBuffer = function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    };
    var isArrayBufferView = function isArrayBufferView(val) {
        var result;
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
            result = ArrayBuffer.isView(val);
        } else {
            result = val && val.buffer && isArrayBuffer(val.buffer);
        }
        return result;
    };
    var getGlobal = function getGlobal() {
        if (typeof globalThis !== "undefined") return globalThis;
        if (typeof self !== "undefined") return self;
        if (typeof window !== "undefined") return window;
        if (typeof global !== "undefined") return global;
        return {};
    };
    var forEach = function forEach(obj, fn) {
        var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, _ref_allOwnKeys = _ref.allOwnKeys, allOwnKeys = _ref_allOwnKeys === void 0 ? false : _ref_allOwnKeys;
        if (obj === null || typeof obj === "undefined") {
            return;
        }
        var i;
        var l;
        if ((typeof obj === "undefined" ? "undefined" : _type_of(obj)) !== "object") {
            obj = [
                obj
            ];
        }
        if (isArray(obj)) {
            for(i = 0, l = obj.length; i < l; i++){
                fn.call(null, obj[i], i, obj);
            }
        } else {
            if (isBuffer(obj)) {
                return;
            }
            var keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
            var len = keys.length;
            var key;
            for(i = 0; i < len; i++){
                key = keys[i];
                fn.call(null, obj[key], key, obj);
            }
        }
    };
    var findKey = function findKey(obj, key) {
        if (isBuffer(obj)) {
            return null;
        }
        key = key.toLowerCase();
        var keys = Object.keys(obj);
        var i = keys.length;
        var _key;
        while(i-- > 0){
            _key = keys[i];
            if (key === _key.toLowerCase()) {
                return _key;
            }
        }
        return null;
    };
    var isSpecCompliantForm = function isSpecCompliantForm(thing) {
        return !!(thing && isFunction(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
    };
    var isVisitable = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/toFormData.js
    function isVisitable(thing) {
        return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
    };
    var removeBrackets = function removeBrackets(key) {
        return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
    };
    var renderKey = function renderKey(path, key, dots) {
        if (!path) return key;
        return path.concat(key).map(function each(token, i) {
            token = removeBrackets(token);
            return !dots && i ? "[" + token + "]" : token;
        }).join(dots ? "." : "");
    };
    var isFlatArray = function isFlatArray(arr) {
        return utils_default.isArray(arr) && !arr.some(isVisitable);
    };
    var toFormData = function toFormData(obj, formData, options) {
        if (!utils_default.isObject(obj)) {
            throw new TypeError("target must be an object");
        }
        formData = formData || new (null_default || FormData)();
        options = utils_default.toFlatObject(options, {
            metaTokens: true,
            dots: false,
            indexes: false
        }, false, function defined(option, source) {
            return !utils_default.isUndefined(source[option]);
        });
        var metaTokens = options.metaTokens;
        var visitor = options.visitor || defaultVisitor;
        var dots = options.dots;
        var indexes = options.indexes;
        var _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
        var useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
        if (!utils_default.isFunction(visitor)) {
            throw new TypeError("visitor must be a function");
        }
        function convertValue(value) {
            if (value === null) return "";
            if (utils_default.isDate(value)) {
                return value.toISOString();
            }
            if (utils_default.isBoolean(value)) {
                return value.toString();
            }
            if (!useBlob && utils_default.isBlob(value)) {
                throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
            }
            if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
                return useBlob && typeof Blob === "function" ? new Blob([
                    value
                ]) : Buffer.from(value);
            }
            return value;
        }
        function defaultVisitor(value, key, path) {
            var arr = value;
            if (utils_default.isReactNative(formData) && utils_default.isReactNativeBlob(value)) {
                formData.append(renderKey(path, key, dots), convertValue(value));
                return false;
            }
            if (value && !path && (typeof value === "undefined" ? "undefined" : _type_of(value)) === "object") {
                if (utils_default.endsWith(key, "{}")) {
                    key = metaTokens ? key : key.slice(0, -2);
                    value = JSON.stringify(value);
                } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
                    key = removeBrackets(key);
                    arr.forEach(function each(el, index) {
                        !(utils_default.isUndefined(el) || el === null) && formData.append(// eslint-disable-next-line no-nested-ternary
                        indexes === true ? renderKey([
                            key
                        ], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
                    });
                    return false;
                }
            }
            if (isVisitable(value)) {
                return true;
            }
            formData.append(renderKey(path, key, dots), convertValue(value));
            return false;
        }
        var stack = [];
        var exposedHelpers = Object.assign(predicates, {
            defaultVisitor: defaultVisitor,
            convertValue: convertValue,
            isVisitable: isVisitable
        });
        function build(value, path) {
            if (utils_default.isUndefined(value)) return;
            if (stack.indexOf(value) !== -1) {
                throw Error("Circular reference detected in " + path.join("."));
            }
            stack.push(value);
            utils_default.forEach(value, function each(el, key) {
                var result = !(utils_default.isUndefined(el) || el === null) && visitor.call(formData, el, utils_default.isString(key) ? key.trim() : key, path, exposedHelpers);
                if (result === true) {
                    build(el, path ? path.concat(key) : [
                        key
                    ]);
                }
            });
            stack.pop();
        }
        if (!utils_default.isObject(obj)) {
            throw new TypeError("data must be an object");
        }
        build(obj);
        return formData;
    };
    var encode = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/AxiosURLSearchParams.js
    function encode(str) {
        var charMap = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\0"
        };
        return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
            return charMap[match];
        });
    };
    var AxiosURLSearchParams = function AxiosURLSearchParams(params, options) {
        this._pairs = [];
        params && toFormData_default(params, this, options);
    };
    var encode2 = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/buildURL.js
    function encode2(val) {
        return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
    };
    var buildURL = function buildURL(url, params, options) {
        if (!params) {
            return url;
        }
        var _encode = options && options.encode || encode2;
        var _options = utils_default.isFunction(options) ? {
            serialize: options
        } : options;
        var serializeFn = _options && _options.serialize;
        var serializedParams;
        if (serializeFn) {
            serializedParams = serializeFn(params, _options);
        } else {
            serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, _options).toString(_encode);
        }
        if (serializedParams) {
            var hashmarkIndex = url.indexOf("#");
            if (hashmarkIndex !== -1) {
                url = url.slice(0, hashmarkIndex);
            }
            url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
        }
        return url;
    };
    var toURLEncodedForm = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/toURLEncodedForm.js
    function toURLEncodedForm(data, options) {
        return toFormData_default(data, new platform_default.classes.URLSearchParams(), _object_spread({
            visitor: function visitor(value, key, path, helpers) {
                if (platform_default.isNode && utils_default.isBuffer(value)) {
                    this.append(key, value.toString("base64"));
                    return false;
                }
                return helpers.defaultVisitor.apply(this, arguments);
            }
        }, options));
    };
    var parsePropPath = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/formDataToJSON.js
    function parsePropPath(name) {
        return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map(function(match) {
            return match[0] === "[]" ? "" : match[1] || match[0];
        });
    };
    var arrayToObject = function arrayToObject(arr) {
        var obj = {};
        var keys = Object.keys(arr);
        var i;
        var len = keys.length;
        var key;
        for(i = 0; i < len; i++){
            key = keys[i];
            obj[key] = arr[key];
        }
        return obj;
    };
    var formDataToJSON = function formDataToJSON(formData) {
        function buildPath(path, value, target, index) {
            var name = path[index++];
            if (name === "__proto__") return true;
            var isNumericKey = Number.isFinite(+name);
            var isLast = index >= path.length;
            name = !name && utils_default.isArray(target) ? target.length : name;
            if (isLast) {
                if (utils_default.hasOwnProp(target, name)) {
                    target[name] = [
                        target[name],
                        value
                    ];
                } else {
                    target[name] = value;
                }
                return !isNumericKey;
            }
            if (!target[name] || !utils_default.isObject(target[name])) {
                target[name] = [];
            }
            var result = buildPath(path, value, target[name], index);
            if (result && utils_default.isArray(target[name])) {
                target[name] = arrayToObject(target[name]);
            }
            return !isNumericKey;
        }
        if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
            var obj = {};
            utils_default.forEachEntry(formData, function(name, value) {
                buildPath(parsePropPath(name), value, obj, 0);
            });
            return obj;
        }
        return null;
    };
    var stringifySafely = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/defaults/index.js
    function stringifySafely(rawValue, parser, encoder) {
        if (utils_default.isString(rawValue)) {
            try {
                (parser || JSON.parse)(rawValue);
                return utils_default.trim(rawValue);
            } catch (e) {
                if (e.name !== "SyntaxError") {
                    throw e;
                }
            }
        }
        return (encoder || JSON.stringify)(rawValue);
    };
    var normalizeHeader = function normalizeHeader(header) {
        return header && String(header).trim().toLowerCase();
    };
    var parseTokens = function parseTokens(str) {
        var tokens = /* @__PURE__ */ Object.create(null);
        var tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
        var match;
        while(match = tokensRE.exec(str)){
            tokens[match[1]] = match[2];
        }
        return tokens;
    };
    var matchHeaderValue = function matchHeaderValue(context, value, header, filter3, isHeaderNameFilter) {
        if (utils_default.isFunction(filter3)) {
            return filter3.call(this, value, header);
        }
        if (isHeaderNameFilter) {
            value = header;
        }
        if (!utils_default.isString(value)) return;
        if (utils_default.isString(filter3)) {
            return value.indexOf(filter3) !== -1;
        }
        if (utils_default.isRegExp(filter3)) {
            return filter3.test(value);
        }
    };
    var formatHeader = function formatHeader(header) {
        return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, function(w, char, str) {
            return char.toUpperCase() + str;
        });
    };
    var buildAccessors = function buildAccessors(obj, header) {
        var accessorName = utils_default.toCamelCase(" " + header);
        [
            "get",
            "set",
            "has"
        ].forEach(function(methodName) {
            Object.defineProperty(obj, methodName + accessorName, {
                value: function value(arg1, arg2, arg3) {
                    return this[methodName].call(this, header, arg1, arg2, arg3);
                },
                configurable: true
            });
        });
    };
    var transformData = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/transformData.js
    function transformData(fns, response) {
        var config = this || defaults_default;
        var context = response || config;
        var headers = AxiosHeaders_default.from(context.headers);
        var data = context.data;
        utils_default.forEach(fns, function transform2(fn) {
            data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
        });
        headers.normalize();
        return data;
    };
    var isCancel = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/cancel/isCancel.js
    function isCancel(value) {
        return !!(value && value.__CANCEL__);
    };
    var settle = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/settle.js
    function settle(resolve, reject, response) {
        var validateStatus2 = response.config.validateStatus;
        if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
            resolve(response);
        } else {
            reject(new AxiosError_default("Request failed with status code " + response.status, [
                AxiosError_default.ERR_BAD_REQUEST,
                AxiosError_default.ERR_BAD_RESPONSE
            ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
        }
    };
    var parseProtocol = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/parseProtocol.js
    function parseProtocol(url) {
        var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
        return match && match[1] || "";
    };
    var speedometer = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/speedometer.js
    function speedometer(samplesCount, min2) {
        samplesCount = samplesCount || 10;
        var bytes = new Array(samplesCount);
        var timestamps = new Array(samplesCount);
        var head = 0;
        var tail = 0;
        var firstSampleTS;
        min2 = min2 !== void 0 ? min2 : 1e3;
        return function push(chunkLength) {
            var now2 = Date.now();
            var startedAt = timestamps[tail];
            if (!firstSampleTS) {
                firstSampleTS = now2;
            }
            bytes[head] = chunkLength;
            timestamps[head] = now2;
            var i = tail;
            var bytesCount = 0;
            while(i !== head){
                bytesCount += bytes[i++];
                i = i % samplesCount;
            }
            head = (head + 1) % samplesCount;
            if (head === tail) {
                tail = (tail + 1) % samplesCount;
            }
            if (now2 - firstSampleTS < min2) {
                return;
            }
            var passed = startedAt && now2 - startedAt;
            return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
        };
    };
    var throttle = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/throttle.js
    function throttle(fn, freq) {
        var timestamp = 0;
        var threshold = 1e3 / freq;
        var lastArgs;
        var timer2;
        var invoke = function invoke(args) {
            var now2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Date.now();
            timestamp = now2;
            lastArgs = null;
            if (timer2) {
                clearTimeout(timer2);
                timer2 = null;
            }
            fn.apply(void 0, _to_consumable_array(args));
        };
        var throttled = function throttled() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            var now2 = Date.now();
            var passed = now2 - timestamp;
            if (passed >= threshold) {
                invoke(args, now2);
            } else {
                lastArgs = args;
                if (!timer2) {
                    timer2 = setTimeout(function() {
                        timer2 = null;
                        invoke(lastArgs);
                    }, threshold - passed);
                }
            }
        };
        var flush = function flush() {
            return lastArgs && invoke(lastArgs);
        };
        return [
            throttled,
            flush
        ];
    };
    var isAbsoluteURL = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/isAbsoluteURL.js
    function isAbsoluteURL(url) {
        if (typeof url !== "string") {
            return false;
        }
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
    var combineURLs = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/combineURLs.js
    function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
    };
    var buildFullPath = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/buildFullPath.js
    function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
        var isRelativeUrl = !isAbsoluteURL(requestedURL);
        if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
            return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
    };
    var mergeConfig = function mergeConfig(config1, config2) {
        config2 = config2 || {};
        var config = {};
        function getMergedValue(target, source, prop, caseless) {
            if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
                return utils_default.merge.call({
                    caseless: caseless
                }, target, source);
            } else if (utils_default.isPlainObject(source)) {
                return utils_default.merge({}, source);
            } else if (utils_default.isArray(source)) {
                return source.slice();
            }
            return source;
        }
        function mergeDeepProperties(a, b, prop, caseless) {
            if (!utils_default.isUndefined(b)) {
                return getMergedValue(a, b, prop, caseless);
            } else if (!utils_default.isUndefined(a)) {
                return getMergedValue(void 0, a, prop, caseless);
            }
        }
        function valueFromConfig2(a, b) {
            if (!utils_default.isUndefined(b)) {
                return getMergedValue(void 0, b);
            }
        }
        function defaultToConfig2(a, b) {
            if (!utils_default.isUndefined(b)) {
                return getMergedValue(void 0, b);
            } else if (!utils_default.isUndefined(a)) {
                return getMergedValue(void 0, a);
            }
        }
        function mergeDirectKeys(a, b, prop) {
            if (prop in config2) {
                return getMergedValue(a, b);
            } else if (prop in config1) {
                return getMergedValue(void 0, a);
            }
        }
        var mergeMap = {
            url: valueFromConfig2,
            method: valueFromConfig2,
            data: valueFromConfig2,
            baseURL: defaultToConfig2,
            transformRequest: defaultToConfig2,
            transformResponse: defaultToConfig2,
            paramsSerializer: defaultToConfig2,
            timeout: defaultToConfig2,
            timeoutMessage: defaultToConfig2,
            withCredentials: defaultToConfig2,
            withXSRFToken: defaultToConfig2,
            adapter: defaultToConfig2,
            responseType: defaultToConfig2,
            xsrfCookieName: defaultToConfig2,
            xsrfHeaderName: defaultToConfig2,
            onUploadProgress: defaultToConfig2,
            onDownloadProgress: defaultToConfig2,
            decompress: defaultToConfig2,
            maxContentLength: defaultToConfig2,
            maxBodyLength: defaultToConfig2,
            beforeRedirect: defaultToConfig2,
            transport: defaultToConfig2,
            httpAgent: defaultToConfig2,
            httpsAgent: defaultToConfig2,
            cancelToken: defaultToConfig2,
            socketPath: defaultToConfig2,
            responseEncoding: defaultToConfig2,
            validateStatus: mergeDirectKeys,
            headers: function headers(a, b, prop) {
                return mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true);
            }
        };
        utils_default.forEach(Object.keys(_object_spread({}, config1, config2)), function computeConfigValue(prop) {
            if (prop === "__proto__" || prop === "constructor" || prop === "prototype") return;
            var merge2 = utils_default.hasOwnProp(mergeMap, prop) ? mergeMap[prop] : mergeDeepProperties;
            var configValue = merge2(config1[prop], config2[prop], prop);
            utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
        });
        return config;
    };
    var getAdapter = function getAdapter(adapters, config) {
        adapters = utils_default.isArray(adapters) ? adapters : [
            adapters
        ];
        var length = adapters.length;
        var nameOrAdapter;
        var adapter2;
        var rejectedReasons = {};
        for(var i = 0; i < length; i++){
            nameOrAdapter = adapters[i];
            var id2 = void 0;
            adapter2 = nameOrAdapter;
            if (!isResolvedHandle(nameOrAdapter)) {
                adapter2 = knownAdapters[(id2 = String(nameOrAdapter)).toLowerCase()];
                if (adapter2 === void 0) {
                    throw new AxiosError_default("Unknown adapter '".concat(id2, "'"));
                }
            }
            if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
                break;
            }
            rejectedReasons[id2 || "#" + i] = adapter2;
        }
        if (!adapter2) {
            var reasons = Object.entries(rejectedReasons).map(function(param) {
                var _param = _sliced_to_array(param, 2), id2 = _param[0], state = _param[1];
                return "adapter ".concat(id2, " ") + (state === false ? "is not supported by the environment" : "is not available in the build");
            });
            var s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
            throw new AxiosError_default("There is no suitable adapter to dispatch the request " + s, "ERR_NOT_SUPPORT");
        }
        return adapter2;
    };
    var throwIfCancellationRequested = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/dispatchRequest.js
    function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
            config.cancelToken.throwIfRequested();
        }
        if (config.signal && config.signal.aborted) {
            throw new CanceledError_default(null, config);
        }
    };
    var dispatchRequest = function dispatchRequest(config) {
        throwIfCancellationRequested(config);
        config.headers = AxiosHeaders_default.from(config.headers);
        config.data = transformData.call(config, config.transformRequest);
        if ([
            "post",
            "put",
            "patch"
        ].indexOf(config.method) !== -1) {
            config.headers.setContentType("application/x-www-form-urlencoded", false);
        }
        var adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
        return adapter2(config).then(function onAdapterResolution(response) {
            throwIfCancellationRequested(config);
            response.data = transformData.call(config, config.transformResponse, response);
            response.headers = AxiosHeaders_default.from(response.headers);
            return response;
        }, function onAdapterRejection(reason) {
            if (!isCancel(reason)) {
                throwIfCancellationRequested(config);
                if (reason && reason.response) {
                    reason.response.data = transformData.call(config, config.transformResponse, reason.response);
                    reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
                }
            }
            return Promise.reject(reason);
        });
    };
    var assertOptions = function assertOptions(options, schema, allowUnknown) {
        if ((typeof options === "undefined" ? "undefined" : _type_of(options)) !== "object") {
            throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
        }
        var keys = Object.keys(options);
        var i = keys.length;
        while(i-- > 0){
            var opt = keys[i];
            var validator = schema[opt];
            if (validator) {
                var value = options[opt];
                var result = value === void 0 || validator(value, opt, options);
                if (result !== true) {
                    throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
                }
                continue;
            }
            if (allowUnknown !== true) {
                throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
            }
        }
    };
    var spread = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/spread.js
    function spread(callback) {
        return function wrap(arr) {
            return callback.apply(null, arr);
        };
    };
    var isAxiosError = // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/isAxiosError.js
    function isAxiosError(payload) {
        return utils_default.isObject(payload) && payload.isAxiosError === true;
    };
    var dispatch = function dispatch() {
        for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
            if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
            _[t] = [];
        }
        return new Dispatch(_);
    };
    var Dispatch = function Dispatch(_) {
        this._ = _;
    };
    var parseTypenames = function parseTypenames(typenames, types) {
        return typenames.trim().split(/^|\s+/).map(function(t) {
            var name = "", i = t.indexOf(".");
            if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
            if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
            return {
                type: t,
                name: name
            };
        });
    };
    var get = function get(type2, name) {
        for(var i = 0, n = type2.length, c; i < n; ++i){
            if ((c = type2[i]).name === name) {
                return c.value;
            }
        }
    };
    var set = function set(type2, name, callback) {
        for(var i = 0, n = type2.length; i < n; ++i){
            if (type2[i].name === name) {
                type2[i] = noop2, type2 = type2.slice(0, i).concat(type2.slice(i + 1));
                break;
            }
        }
        if (callback != null) type2.push({
            name: name,
            value: callback
        });
        return type2;
    };
    var namespace_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespace.js
    function namespace_default(name) {
        var prefix = name += "", i = prefix.indexOf(":");
        if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
        return namespaces_default.hasOwnProperty(prefix) ? {
            space: namespaces_default[prefix],
            local: name
        } : name;
    };
    var creatorInherit = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/creator.js
    function creatorInherit(name) {
        return function() {
            var document2 = this.ownerDocument, uri = this.namespaceURI;
            return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
        };
    };
    var creatorFixed = function creatorFixed(fullname) {
        return function() {
            return this.ownerDocument.createElementNS(fullname.space, fullname.local);
        };
    };
    var creator_default = function creator_default(name) {
        var fullname = namespace_default(name);
        return (fullname.local ? creatorFixed : creatorInherit)(fullname);
    };
    var none = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selector.js
    function none() {};
    var selector_default = function selector_default(selector) {
        return selector == null ? none : function() {
            return this.querySelector(selector);
        };
    };
    var select_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/select.js
    function select_default(select) {
        if (typeof select !== "function") select = selector_default(select);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
                if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                    if ("__data__" in node) subnode.__data__ = node.__data__;
                    subgroup[i] = subnode;
                }
            }
        }
        return new Selection(subgroups, this._parents);
    };
    var array = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/array.js
    function array(x) {
        return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
    };
    var empty = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selectorAll.js
    function empty() {
        return [];
    };
    var selectorAll_default = function selectorAll_default(selector) {
        return selector == null ? empty : function() {
            return this.querySelectorAll(selector);
        };
    };
    var arrayAll = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectAll.js
    function arrayAll(select) {
        return function() {
            return array(select.apply(this, arguments));
        };
    };
    var selectAll_default = function selectAll_default(select) {
        if (typeof select === "function") select = arrayAll(select);
        else select = selectorAll_default(select);
        for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
                if (node = group[i]) {
                    subgroups.push(select.call(node, node.__data__, i, group));
                    parents.push(node);
                }
            }
        }
        return new Selection(subgroups, parents);
    };
    var matcher_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/matcher.js
    function matcher_default(selector) {
        return function() {
            return this.matches(selector);
        };
    };
    var childMatcher = function childMatcher(selector) {
        return function(node) {
            return node.matches(selector);
        };
    };
    var childFind = function childFind(match) {
        return function() {
            return find.call(this.children, match);
        };
    };
    var childFirst = function childFirst() {
        return this.firstElementChild;
    };
    var selectChild_default = function selectChild_default(match) {
        return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
    };
    var children = function children() {
        return Array.from(this.children);
    };
    var childrenFilter = function childrenFilter(match) {
        return function() {
            return filter2.call(this.children, match);
        };
    };
    var selectChildren_default = function selectChildren_default(match) {
        return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    };
    var filter_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/filter.js
    function filter_default(match) {
        if (typeof match !== "function") match = matcher_default(match);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
                if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                    subgroup.push(node);
                }
            }
        }
        return new Selection(subgroups, this._parents);
    };
    var sparse_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sparse.js
    function sparse_default(update) {
        return new Array(update.length);
    };
    var enter_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/enter.js
    function enter_default() {
        return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
    };
    var EnterNode = function EnterNode(parent, datum2) {
        this.ownerDocument = parent.ownerDocument;
        this.namespaceURI = parent.namespaceURI;
        this._next = null;
        this._parent = parent;
        this.__data__ = datum2;
    };
    var constant_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/constant.js
    function constant_default(x) {
        return function() {
            return x;
        };
    };
    var bindIndex = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/data.js
    function bindIndex(parent, group, enter, update, exit, data) {
        var i = 0, node, groupLength = group.length, dataLength = data.length;
        for(; i < dataLength; ++i){
            if (node = group[i]) {
                node.__data__ = data[i];
                update[i] = node;
            } else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        for(; i < groupLength; ++i){
            if (node = group[i]) {
                exit[i] = node;
            }
        }
    };
    var bindKey = function bindKey(parent, group, enter, update, exit, data, key) {
        var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
        for(i = 0; i < groupLength; ++i){
            if (node = group[i]) {
                keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
                if (nodeByKeyValue.has(keyValue)) {
                    exit[i] = node;
                } else {
                    nodeByKeyValue.set(keyValue, node);
                }
            }
        }
        for(i = 0; i < dataLength; ++i){
            keyValue = key.call(parent, data[i], i, data) + "";
            if (node = nodeByKeyValue.get(keyValue)) {
                update[i] = node;
                node.__data__ = data[i];
                nodeByKeyValue.delete(keyValue);
            } else {
                enter[i] = new EnterNode(parent, data[i]);
            }
        }
        for(i = 0; i < groupLength; ++i){
            if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
                exit[i] = node;
            }
        }
    };
    var datum = function datum(node) {
        return node.__data__;
    };
    var data_default = function data_default(value, key) {
        if (!arguments.length) return Array.from(this, datum);
        var bind2 = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
        if (typeof value !== "function") value = constant_default(value);
        for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
            var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
            bind2(parent, group, enterGroup, updateGroup, exitGroup, data, key);
            for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0){
                if (previous = enterGroup[i0]) {
                    if (i0 >= i1) i1 = i0 + 1;
                    while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                    previous._next = next || null;
                }
            }
        }
        update = new Selection(update, parents);
        update._enter = enter;
        update._exit = exit;
        return update;
    };
    var arraylike = function arraylike(data) {
        return (typeof data === "undefined" ? "undefined" : _type_of(data)) === "object" && "length" in data ? data : Array.from(data);
    };
    var exit_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/exit.js
    function exit_default() {
        return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
    };
    var join_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/join.js
    function join_default(onenter, onupdate, onexit) {
        var enter = this.enter(), update = this, exit = this.exit();
        if (typeof onenter === "function") {
            enter = onenter(enter);
            if (enter) enter = enter.selection();
        } else {
            enter = enter.append(onenter + "");
        }
        if (onupdate != null) {
            update = onupdate(update);
            if (update) update = update.selection();
        }
        if (onexit == null) exit.remove();
        else onexit(exit);
        return enter && update ? enter.merge(update).order() : update;
    };
    var merge_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/merge.js
    function merge_default(context) {
        var selection2 = context.selection ? context.selection() : context;
        for(var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
            for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0; i < n; ++i){
                if (node = group0[i] || group1[i]) {
                    merge2[i] = node;
                }
            }
        }
        for(; j < m0; ++j){
            merges[j] = groups0[j];
        }
        return new Selection(merges, this._parents);
    };
    var order_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/order.js
    function order_default() {
        for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
            for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;){
                if (node = group[i]) {
                    if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                    next = node;
                }
            }
        }
        return this;
    };
    var sort_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sort.js
    function sort_default(compare) {
        if (!compare) compare = ascending;
        function compareNode(a, b) {
            return a && b ? compare(a.__data__, b.__data__) : !a - !b;
        }
        for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i){
                if (node = group[i]) {
                    sortgroup[i] = node;
                }
            }
            sortgroup.sort(compareNode);
        }
        return new Selection(sortgroups, this._parents).order();
    };
    var ascending = function ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    };
    var call_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/call.js
    function call_default() {
        var callback = arguments[0];
        arguments[0] = this;
        callback.apply(null, arguments);
        return this;
    };
    var nodes_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/nodes.js
    function nodes_default() {
        return Array.from(this);
    };
    var node_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/node.js
    function node_default() {
        for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
            for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
                var node = group[i];
                if (node) return node;
            }
        }
        return null;
    };
    var size_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/size.js
    function size_default() {
        var size = 0;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var node = _step.value;
                ++size;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return size;
    };
    var empty_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/empty.js
    function empty_default() {
        return !this.node();
    };
    var each_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/each.js
    function each_default(callback) {
        for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
            for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i){
                if (node = group[i]) callback.call(node, node.__data__, i, group);
            }
        }
        return this;
    };
    var attrRemove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/attr.js
    function attrRemove(name) {
        return function() {
            this.removeAttribute(name);
        };
    };
    var attrRemoveNS = function attrRemoveNS(fullname) {
        return function() {
            this.removeAttributeNS(fullname.space, fullname.local);
        };
    };
    var attrConstant = function attrConstant(name, value) {
        return function() {
            this.setAttribute(name, value);
        };
    };
    var attrConstantNS = function attrConstantNS(fullname, value) {
        return function() {
            this.setAttributeNS(fullname.space, fullname.local, value);
        };
    };
    var attrFunction = function attrFunction(name, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.removeAttribute(name);
            else this.setAttribute(name, v);
        };
    };
    var attrFunctionNS = function attrFunctionNS(fullname, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
            else this.setAttributeNS(fullname.space, fullname.local, v);
        };
    };
    var attr_default = function attr_default(name, value) {
        var fullname = namespace_default(name);
        if (arguments.length < 2) {
            var node = this.node();
            return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
        }
        return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
    };
    var window_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/window.js
    function window_default(node) {
        return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
    };
    var styleRemove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/style.js
    function styleRemove(name) {
        return function() {
            this.style.removeProperty(name);
        };
    };
    var styleConstant = function styleConstant(name, value, priority) {
        return function() {
            this.style.setProperty(name, value, priority);
        };
    };
    var styleFunction = function styleFunction(name, value, priority) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) this.style.removeProperty(name);
            else this.style.setProperty(name, v, priority);
        };
    };
    var style_default = function style_default(name, value, priority) {
        return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
    };
    var styleValue = function styleValue(node, name) {
        return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
    };
    var propertyRemove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/property.js
    function propertyRemove(name) {
        return function() {
            delete this[name];
        };
    };
    var propertyConstant = function propertyConstant(name, value) {
        return function() {
            this[name] = value;
        };
    };
    var propertyFunction = function propertyFunction(name, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (v == null) delete this[name];
            else this[name] = v;
        };
    };
    var property_default = function property_default(name, value) {
        return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
    };
    var classArray = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/classed.js
    function classArray(string) {
        return string.trim().split(/^|\s+/);
    };
    var classList = function classList(node) {
        return node.classList || new ClassList(node);
    };
    var ClassList = function ClassList(node) {
        this._node = node;
        this._names = classArray(node.getAttribute("class") || "");
    };
    var classedAdd = function classedAdd(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while(++i < n)list.add(names[i]);
    };
    var classedRemove = function classedRemove(node, names) {
        var list = classList(node), i = -1, n = names.length;
        while(++i < n)list.remove(names[i]);
    };
    var classedTrue = function classedTrue(names) {
        return function() {
            classedAdd(this, names);
        };
    };
    var classedFalse = function classedFalse(names) {
        return function() {
            classedRemove(this, names);
        };
    };
    var classedFunction = function classedFunction(names, value) {
        return function() {
            (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
        };
    };
    var classed_default = function classed_default(name, value) {
        var names = classArray(name + "");
        if (arguments.length < 2) {
            var list = classList(this.node()), i = -1, n = names.length;
            while(++i < n)if (!list.contains(names[i])) return false;
            return true;
        }
        return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
    };
    var textRemove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/text.js
    function textRemove() {
        this.textContent = "";
    };
    var textConstant = function textConstant(value) {
        return function() {
            this.textContent = value;
        };
    };
    var textFunction = function textFunction(value) {
        return function() {
            var v = value.apply(this, arguments);
            this.textContent = v == null ? "" : v;
        };
    };
    var text_default = function text_default(value) {
        return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
    };
    var htmlRemove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/html.js
    function htmlRemove() {
        this.innerHTML = "";
    };
    var htmlConstant = function htmlConstant(value) {
        return function() {
            this.innerHTML = value;
        };
    };
    var htmlFunction = function htmlFunction(value) {
        return function() {
            var v = value.apply(this, arguments);
            this.innerHTML = v == null ? "" : v;
        };
    };
    var html_default = function html_default(value) {
        return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
    };
    var raise = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/raise.js
    function raise() {
        if (this.nextSibling) this.parentNode.appendChild(this);
    };
    var raise_default = function raise_default() {
        return this.each(raise);
    };
    var lower = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/lower.js
    function lower() {
        if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    };
    var lower_default = function lower_default() {
        return this.each(lower);
    };
    var append_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/append.js
    function append_default(name) {
        var create2 = typeof name === "function" ? name : creator_default(name);
        return this.select(function() {
            return this.appendChild(create2.apply(this, arguments));
        });
    };
    var constantNull = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/insert.js
    function constantNull() {
        return null;
    };
    var insert_default = function insert_default(name, before) {
        var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
        return this.select(function() {
            return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
        });
    };
    var remove = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/remove.js
    function remove() {
        var parent = this.parentNode;
        if (parent) parent.removeChild(this);
    };
    var remove_default = function remove_default() {
        return this.each(remove);
    };
    var selection_cloneShallow = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/clone.js
    function selection_cloneShallow() {
        var clone = this.cloneNode(false), parent = this.parentNode;
        return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    };
    var selection_cloneDeep = function selection_cloneDeep() {
        var clone = this.cloneNode(true), parent = this.parentNode;
        return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    };
    var clone_default = function clone_default(deep) {
        return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    };
    var datum_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/datum.js
    function datum_default(value) {
        return arguments.length ? this.property("__data__", value) : this.node().__data__;
    };
    var contextListener = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/on.js
    function contextListener(listener) {
        return function(event) {
            listener.call(this, event, this.__data__);
        };
    };
    var parseTypenames2 = function parseTypenames2(typenames) {
        return typenames.trim().split(/^|\s+/).map(function(t) {
            var name = "", i = t.indexOf(".");
            if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
            return {
                type: t,
                name: name
            };
        });
    };
    var onRemove = function onRemove(typename) {
        return function() {
            var on = this.__on;
            if (!on) return;
            for(var j = 0, i = -1, m = on.length, o; j < m; ++j){
                if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                    this.removeEventListener(o.type, o.listener, o.options);
                } else {
                    on[++i] = o;
                }
            }
            if (++i) on.length = i;
            else delete this.__on;
        };
    };
    var onAdd = function onAdd(typename, value, options) {
        return function() {
            var on = this.__on, o, listener = contextListener(value);
            if (on) for(var j = 0, m = on.length; j < m; ++j){
                if ((o = on[j]).type === typename.type && o.name === typename.name) {
                    this.removeEventListener(o.type, o.listener, o.options);
                    this.addEventListener(o.type, o.listener = listener, o.options = options);
                    o.value = value;
                    return;
                }
            }
            this.addEventListener(typename.type, listener, options);
            o = {
                type: typename.type,
                name: typename.name,
                value: value,
                listener: listener,
                options: options
            };
            if (!on) this.__on = [
                o
            ];
            else on.push(o);
        };
    };
    var on_default = function on_default(typename, value, options) {
        var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
        if (arguments.length < 2) {
            var on = this.node().__on;
            if (on) for(var j = 0, m = on.length, o; j < m; ++j){
                for(i = 0, o = on[j]; i < n; ++i){
                    if ((t = typenames[i]).type === o.type && t.name === o.name) {
                        return o.value;
                    }
                }
            }
            return;
        }
        on = value ? onAdd : onRemove;
        for(i = 0; i < n; ++i)this.each(on(typenames[i], value, options));
        return this;
    };
    var dispatchEvent = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/dispatch.js
    function dispatchEvent(node, type2, params) {
        var window2 = window_default(node), event = window2.CustomEvent;
        if (typeof event === "function") {
            event = new event(type2, params);
        } else {
            event = window2.document.createEvent("Event");
            if (params) event.initEvent(type2, params.bubbles, params.cancelable), event.detail = params.detail;
            else event.initEvent(type2, false, false);
        }
        node.dispatchEvent(event);
    };
    var dispatchConstant = function dispatchConstant(type2, params) {
        return function() {
            return dispatchEvent(this, type2, params);
        };
    };
    var dispatchFunction = function dispatchFunction(type2, params) {
        return function() {
            return dispatchEvent(this, type2, params.apply(this, arguments));
        };
    };
    var dispatch_default2 = function dispatch_default2(type2, params) {
        return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type2, params));
    };
    var iterator_default = // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/iterator.js
    function iterator_default() {
        var groups, j, m, group, i, n, node;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    groups = this._groups, j = 0, m = groups.length;
                    _state.label = 1;
                case 1:
                    if (!(j < m)) return [
                        3,
                        6
                    ];
                    group = groups[j], i = 0, n = group.length;
                    _state.label = 2;
                case 2:
                    if (!(i < n)) return [
                        3,
                        5
                    ];
                    if (!(node = group[i])) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        node
                    ];
                case 3:
                    _state.sent();
                    _state.label = 4;
                case 4:
                    ++i;
                    return [
                        3,
                        2
                    ];
                case 5:
                    ++j;
                    return [
                        3,
                        1
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    };
    var Selection = function Selection(groups, parents) {
        this._groups = groups;
        this._parents = parents;
    };
    var selection = function selection() {
        return new Selection([
            [
                document.documentElement
            ]
        ], root);
    };
    var selection_selection = function selection_selection() {
        return this;
    };
    var define_default = // node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/define.js
    function define_default(constructor, factory2, prototype2) {
        constructor.prototype = factory2.prototype = prototype2;
        prototype2.constructor = constructor;
    };
    var extend2 = function extend2(parent, definition) {
        var prototype2 = Object.create(parent.prototype);
        for(var key in definition)prototype2[key] = definition[key];
        return prototype2;
    };
    var Color = // node_modules/.pnpm/d3-color@3.1.0/node_modules/d3-color/src/color.js
    function Color() {};
    var color_formatHex = function color_formatHex() {
        return this.rgb().formatHex();
    };
    var color_formatHex8 = function color_formatHex8() {
        return this.rgb().formatHex8();
    };
    var color_formatHsl = function color_formatHsl() {
        return hslConvert(this).formatHsl();
    };
    var color_formatRgb = function color_formatRgb() {
        return this.rgb().formatRgb();
    };
    var color = function color(format) {
        var m, l;
        format = (format + "").trim().toLowerCase();
        return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
    };
    var rgbn = function rgbn(n) {
        return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
    };
    var rgba = function rgba(r, g, b, a) {
        if (a <= 0) r = g = b = NaN;
        return new Rgb(r, g, b, a);
    };
    var rgbConvert = function rgbConvert(o) {
        if (!_instanceof(o, Color)) o = color(o);
        if (!o) return new Rgb();
        o = o.rgb();
        return new Rgb(o.r, o.g, o.b, o.opacity);
    };
    var rgb = function rgb(r, g, b, opacity) {
        return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    };
    var Rgb = function Rgb(r, g, b, opacity) {
        this.r = +r;
        this.g = +g;
        this.b = +b;
        this.opacity = +opacity;
    };
    var rgb_formatHex = function rgb_formatHex() {
        return "#".concat(hex(this.r)).concat(hex(this.g)).concat(hex(this.b));
    };
    var rgb_formatHex8 = function rgb_formatHex8() {
        return "#".concat(hex(this.r)).concat(hex(this.g)).concat(hex(this.b)).concat(hex((isNaN(this.opacity) ? 1 : this.opacity) * 255));
    };
    var rgb_formatRgb = function rgb_formatRgb() {
        var a = clampa(this.opacity);
        return "".concat(a === 1 ? "rgb(" : "rgba(").concat(clampi(this.r), ", ").concat(clampi(this.g), ", ").concat(clampi(this.b)).concat(a === 1 ? ")" : ", ".concat(a, ")"));
    };
    var clampa = function clampa(opacity) {
        return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    };
    var clampi = function clampi(value) {
        return Math.max(0, Math.min(255, Math.round(value) || 0));
    };
    var hex = function hex(value) {
        value = clampi(value);
        return (value < 16 ? "0" : "") + value.toString(16);
    };
    var hsla = function hsla(h, s, l, a) {
        if (a <= 0) h = s = l = NaN;
        else if (l <= 0 || l >= 1) h = s = NaN;
        else if (s <= 0) h = NaN;
        return new Hsl(h, s, l, a);
    };
    var hslConvert = function hslConvert(o) {
        if (_instanceof(o, Hsl)) return new Hsl(o.h, o.s, o.l, o.opacity);
        if (!_instanceof(o, Color)) o = color(o);
        if (!o) return new Hsl();
        if (_instanceof(o, Hsl)) return o;
        o = o.rgb();
        var r = o.r / 255, g = o.g / 255, b = o.b / 255, min2 = Math.min(r, g, b), max2 = Math.max(r, g, b), h = NaN, s = max2 - min2, l = (max2 + min2) / 2;
        if (s) {
            if (r === max2) h = (g - b) / s + (g < b) * 6;
            else if (g === max2) h = (b - r) / s + 2;
            else h = (r - g) / s + 4;
            s /= l < 0.5 ? max2 + min2 : 2 - max2 - min2;
            h *= 60;
        } else {
            s = l > 0 && l < 1 ? 0 : h;
        }
        return new Hsl(h, s, l, o.opacity);
    };
    var hsl = function hsl(h, s, l, opacity) {
        return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    };
    var Hsl = function Hsl(h, s, l, opacity) {
        this.h = +h;
        this.s = +s;
        this.l = +l;
        this.opacity = +opacity;
    };
    var clamph = function clamph(value) {
        value = (value || 0) % 360;
        return value < 0 ? value + 360 : value;
    };
    var clampt = function clampt(value) {
        return Math.max(0, Math.min(1, value || 0));
    };
    var hsl2rgb = function hsl2rgb(h, m1, m2) {
        return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
    };
    var basis = // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basis.js
    function basis(t1, v0, v1, v2, v3) {
        var t2 = t1 * t1, t3 = t2 * t1;
        return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
    };
    var basis_default = function basis_default(values) {
        var n = values.length - 1;
        return function(t) {
            var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    };
    var basisClosed_default = // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basisClosed.js
    function basisClosed_default(values) {
        var n = values.length;
        return function(t) {
            var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
            return basis((t - i / n) * n, v0, v1, v2, v3);
        };
    };
    var linear = // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/color.js
    function linear(a, d) {
        return function(t) {
            return a + t * d;
        };
    };
    var exponential = function exponential(a, b, y) {
        return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
            return Math.pow(a + t * b, y);
        };
    };
    var gamma = function gamma(y) {
        return (y = +y) === 1 ? nogamma : function(a, b) {
            return b - a ? exponential(a, b, y) : constant_default2(isNaN(a) ? b : a);
        };
    };
    var nogamma = function nogamma(a, b) {
        var d = b - a;
        return d ? linear(a, d) : constant_default2(isNaN(a) ? b : a);
    };
    var rgbSpline = function rgbSpline(spline) {
        return function(colors) {
            var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
            for(i = 0; i < n; ++i){
                color2 = rgb(colors[i]);
                r[i] = color2.r || 0;
                g[i] = color2.g || 0;
                b[i] = color2.b || 0;
            }
            r = spline(r);
            g = spline(g);
            b = spline(b);
            color2.opacity = 1;
            return function(t) {
                color2.r = r(t);
                color2.g = g(t);
                color2.b = b(t);
                return color2 + "";
            };
        };
    };
    var number_default = // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/number.js
    function number_default(a, b) {
        return a = +a, b = +b, function(t) {
            return a * (1 - t) + b * t;
        };
    };
    var zero = function zero(b) {
        return function() {
            return b;
        };
    };
    var one = function one(b) {
        return function(t) {
            return b(t) + "";
        };
    };
    var string_default = function string_default(a, b) {
        var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
        a = a + "", b = b + "";
        while((am = reA.exec(a)) && (bm = reB.exec(b))){
            if ((bs = bm.index) > bi) {
                bs = b.slice(bi, bs);
                if (s[i]) s[i] += bs;
                else s[++i] = bs;
            }
            if ((am = am[0]) === (bm = bm[0])) {
                if (s[i]) s[i] += bm;
                else s[++i] = bm;
            } else {
                s[++i] = null;
                q.push({
                    i: i,
                    x: number_default(am, bm)
                });
            }
            bi = reB.lastIndex;
        }
        if (bi < b.length) {
            bs = b.slice(bi);
            if (s[i]) s[i] += bs;
            else s[++i] = bs;
        }
        return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
            for(var i2 = 0, o; i2 < b; ++i2)s[(o = q[i2]).i] = o.x(t);
            return s.join("");
        });
    };
    var decompose_default = function decompose_default(a, b, c, d, e, f) {
        var scaleX, scaleY, skewX;
        if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
        if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
        if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
        if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
        return {
            translateX: e,
            translateY: f,
            rotate: Math.atan2(b, a) * degrees,
            skewX: Math.atan(skewX) * degrees,
            scaleX: scaleX,
            scaleY: scaleY
        };
    };
    var parseCss = function parseCss(value) {
        var m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
        return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
    };
    var parseSvg = function parseSvg(value) {
        if (value == null) return identity;
        if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgNode.setAttribute("transform", value);
        if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
        value = value.matrix;
        return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
    };
    var interpolateTransform = // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/index.js
    function interpolateTransform(parse, pxComma, pxParen, degParen) {
        function pop(s) {
            return s.length ? s.pop() + " " : "";
        }
        function translate(xa, ya, xb, yb, s, q) {
            if (xa !== xb || ya !== yb) {
                var i = s.push("translate(", null, pxComma, null, pxParen);
                q.push({
                    i: i - 4,
                    x: number_default(xa, xb)
                }, {
                    i: i - 2,
                    x: number_default(ya, yb)
                });
            } else if (xb || yb) {
                s.push("translate(" + xb + pxComma + yb + pxParen);
            }
        }
        function rotate(a, b, s, q) {
            if (a !== b) {
                if (a - b > 180) b += 360;
                else if (b - a > 180) a += 360;
                q.push({
                    i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                    x: number_default(a, b)
                });
            } else if (b) {
                s.push(pop(s) + "rotate(" + b + degParen);
            }
        }
        function skewX(a, b, s, q) {
            if (a !== b) {
                q.push({
                    i: s.push(pop(s) + "skewX(", null, degParen) - 2,
                    x: number_default(a, b)
                });
            } else if (b) {
                s.push(pop(s) + "skewX(" + b + degParen);
            }
        }
        function scale(xa, ya, xb, yb, s, q) {
            if (xa !== xb || ya !== yb) {
                var i = s.push(pop(s) + "scale(", null, ",", null, ")");
                q.push({
                    i: i - 4,
                    x: number_default(xa, xb)
                }, {
                    i: i - 2,
                    x: number_default(ya, yb)
                });
            } else if (xb !== 1 || yb !== 1) {
                s.push(pop(s) + "scale(" + xb + "," + yb + ")");
            }
        }
        return function(a, b) {
            var s = [], q = [];
            a = parse(a), b = parse(b);
            translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
            rotate(a.rotate, b.rotate, s, q);
            skewX(a.skewX, b.skewX, s, q);
            scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
            a = b = null;
            return function(t) {
                var i = -1, n = q.length, o;
                while(++i < n)s[(o = q[i]).i] = o.x(t);
                return s.join("");
            };
        };
    };
    var now = function now() {
        return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    };
    var clearNow = function clearNow() {
        clockNow = 0;
    };
    var Timer = function Timer() {
        this._call = this._time = this._next = null;
    };
    var timer = function timer(callback, delay, time) {
        var t = new Timer();
        t.restart(callback, delay, time);
        return t;
    };
    var timerFlush = function timerFlush() {
        now();
        ++frame;
        var t = taskHead, e;
        while(t){
            if ((e = clockNow - t._time) >= 0) t._call.call(void 0, e);
            t = t._next;
        }
        --frame;
    };
    var wake = function wake() {
        clockNow = (clockLast = clock.now()) + clockSkew;
        frame = timeout = 0;
        try {
            timerFlush();
        } finally{
            frame = 0;
            nap();
            clockNow = 0;
        }
    };
    var poke = function poke() {
        var now2 = clock.now(), delay = now2 - clockLast;
        if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
    };
    var nap = function nap() {
        var t0, t1 = taskHead, t2, time = Infinity;
        while(t1){
            if (t1._call) {
                if (time > t1._time) time = t1._time;
                t0 = t1, t1 = t1._next;
            } else {
                t2 = t1._next, t1._next = null;
                t1 = t0 ? t0._next = t2 : taskHead = t2;
            }
        }
        taskTail = t0;
        sleep(time);
    };
    var sleep = function sleep(time) {
        if (frame) return;
        if (timeout) timeout = clearTimeout(timeout);
        var delay = time - clockNow;
        if (delay > 24) {
            if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
            if (interval) interval = clearInterval(interval);
        } else {
            if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
            frame = 1, setFrame(wake);
        }
    };
    var timeout_default = // node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timeout.js
    function timeout_default(callback, delay, time) {
        var t = new Timer();
        delay = delay == null ? 0 : +delay;
        t.restart(function(elapsed) {
            t.stop();
            callback(elapsed + delay);
        }, delay, time);
        return t;
    };
    var schedule_default = function schedule_default(node, name, id2, index, group, timing) {
        var schedules = node.__transition;
        if (!schedules) node.__transition = {};
        else if (id2 in schedules) return;
        create(node, id2, {
            name: name,
            index: index,
            // For context during callback.
            group: group,
            // For context during callback.
            on: emptyOn,
            tween: emptyTween,
            time: timing.time,
            delay: timing.delay,
            duration: timing.duration,
            ease: timing.ease,
            timer: null,
            state: CREATED
        });
    };
    var init = function init(node, id2) {
        var schedule = get2(node, id2);
        if (schedule.state > CREATED) throw new Error("too late; already scheduled");
        return schedule;
    };
    var set2 = function set2(node, id2) {
        var schedule = get2(node, id2);
        if (schedule.state > STARTED) throw new Error("too late; already running");
        return schedule;
    };
    var get2 = function get2(node, id2) {
        var schedule = node.__transition;
        if (!schedule || !(schedule = schedule[id2])) throw new Error("transition not found");
        return schedule;
    };
    var create = function create(node, id2, self2) {
        var schedules = node.__transition, tween;
        schedules[id2] = self2;
        self2.timer = timer(schedule, 0, self2.time);
        function schedule(elapsed) {
            self2.state = SCHEDULED;
            self2.timer.restart(start2, self2.delay, self2.time);
            if (self2.delay <= elapsed) start2(elapsed - self2.delay);
        }
        function start2(elapsed) {
            var i, j, n, o;
            if (self2.state !== SCHEDULED) return stop();
            for(i in schedules){
                o = schedules[i];
                if (o.name !== self2.name) continue;
                if (o.state === STARTED) return timeout_default(start2);
                if (o.state === RUNNING) {
                    o.state = ENDED;
                    o.timer.stop();
                    o.on.call("interrupt", node, node.__data__, o.index, o.group);
                    delete schedules[i];
                } else if (+i < id2) {
                    o.state = ENDED;
                    o.timer.stop();
                    o.on.call("cancel", node, node.__data__, o.index, o.group);
                    delete schedules[i];
                }
            }
            timeout_default(function() {
                if (self2.state === STARTED) {
                    self2.state = RUNNING;
                    self2.timer.restart(tick, self2.delay, self2.time);
                    tick(elapsed);
                }
            });
            self2.state = STARTING;
            self2.on.call("start", node, node.__data__, self2.index, self2.group);
            if (self2.state !== STARTING) return;
            self2.state = STARTED;
            tween = new Array(n = self2.tween.length);
            for(i = 0, j = -1; i < n; ++i){
                if (o = self2.tween[i].value.call(node, node.__data__, self2.index, self2.group)) {
                    tween[++j] = o;
                }
            }
            tween.length = j + 1;
        }
        function tick(elapsed) {
            var t = elapsed < self2.duration ? self2.ease.call(null, elapsed / self2.duration) : (self2.timer.restart(stop), self2.state = ENDING, 1), i = -1, n = tween.length;
            while(++i < n){
                tween[i].call(node, t);
            }
            if (self2.state === ENDING) {
                self2.on.call("end", node, node.__data__, self2.index, self2.group);
                stop();
            }
        }
        function stop() {
            self2.state = ENDED;
            self2.timer.stop();
            delete schedules[id2];
            for(var i in schedules)return;
            delete node.__transition;
        }
    };
    var interrupt_default = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/interrupt.js
    function interrupt_default(node, name) {
        var schedules = node.__transition, schedule, active, empty2 = true, i;
        if (!schedules) return;
        name = name == null ? null : name + "";
        for(i in schedules){
            if ((schedule = schedules[i]).name !== name) {
                empty2 = false;
                continue;
            }
            active = schedule.state > STARTING && schedule.state < ENDING;
            schedule.state = ENDED;
            schedule.timer.stop();
            schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
            delete schedules[i];
        }
        if (empty2) delete node.__transition;
    };
    var interrupt_default2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/interrupt.js
    function interrupt_default2(name) {
        return this.each(function() {
            interrupt_default(this, name);
        });
    };
    var tweenRemove = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/tween.js
    function tweenRemove(id2, name) {
        var tween0, tween1;
        return function() {
            var schedule = set2(this, id2), tween = schedule.tween;
            if (tween !== tween0) {
                tween1 = tween0 = tween;
                for(var i = 0, n = tween1.length; i < n; ++i){
                    if (tween1[i].name === name) {
                        tween1 = tween1.slice();
                        tween1.splice(i, 1);
                        break;
                    }
                }
            }
            schedule.tween = tween1;
        };
    };
    var tweenFunction = function tweenFunction(id2, name, value) {
        var tween0, tween1;
        if (typeof value !== "function") throw new Error();
        return function() {
            var schedule = set2(this, id2), tween = schedule.tween;
            if (tween !== tween0) {
                tween1 = (tween0 = tween).slice();
                for(var t = {
                    name: name,
                    value: value
                }, i = 0, n = tween1.length; i < n; ++i){
                    if (tween1[i].name === name) {
                        tween1[i] = t;
                        break;
                    }
                }
                if (i === n) tween1.push(t);
            }
            schedule.tween = tween1;
        };
    };
    var tween_default = function tween_default(name, value) {
        var id2 = this._id;
        name += "";
        if (arguments.length < 2) {
            var tween = get2(this.node(), id2).tween;
            for(var i = 0, n = tween.length, t; i < n; ++i){
                if ((t = tween[i]).name === name) {
                    return t.value;
                }
            }
            return null;
        }
        return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
    };
    var tweenValue = function tweenValue(transition2, name, value) {
        var id2 = transition2._id;
        transition2.each(function() {
            var schedule = set2(this, id2);
            (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
        });
        return function(node) {
            return get2(node, id2).value[name];
        };
    };
    var interpolate_default = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/interpolate.js
    function interpolate_default(a, b) {
        var c;
        return (typeof b === "number" ? number_default : _instanceof(b, color) ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
    };
    var attrRemove2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attr.js
    function attrRemove2(name) {
        return function() {
            this.removeAttribute(name);
        };
    };
    var attrRemoveNS2 = function attrRemoveNS2(fullname) {
        return function() {
            this.removeAttributeNS(fullname.space, fullname.local);
        };
    };
    var attrConstant2 = function attrConstant2(name, interpolate, value1) {
        var string00, string1 = value1 + "", interpolate0;
        return function() {
            var string0 = this.getAttribute(name);
            return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
        };
    };
    var attrConstantNS2 = function attrConstantNS2(fullname, interpolate, value1) {
        var string00, string1 = value1 + "", interpolate0;
        return function() {
            var string0 = this.getAttributeNS(fullname.space, fullname.local);
            return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
        };
    };
    var attrFunction2 = function attrFunction2(name, interpolate, value) {
        var string00, string10, interpolate0;
        return function() {
            var string0, value1 = value(this), string1;
            if (value1 == null) return void this.removeAttribute(name);
            string0 = this.getAttribute(name);
            string1 = value1 + "";
            return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
        };
    };
    var attrFunctionNS2 = function attrFunctionNS2(fullname, interpolate, value) {
        var string00, string10, interpolate0;
        return function() {
            var string0, value1 = value(this), string1;
            if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
            string0 = this.getAttributeNS(fullname.space, fullname.local);
            string1 = value1 + "";
            return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
        };
    };
    var attr_default2 = function attr_default2(name, value) {
        var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
        return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
    };
    var attrInterpolate = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/attrTween.js
    function attrInterpolate(name, i) {
        return function(t) {
            this.setAttribute(name, i.call(this, t));
        };
    };
    var attrInterpolateNS = function attrInterpolateNS(fullname, i) {
        return function(t) {
            this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
        };
    };
    var attrTweenNS = function attrTweenNS(fullname, value) {
        var t0, i0;
        function tween() {
            var i = value.apply(this, arguments);
            if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
            return t0;
        }
        tween._value = value;
        return tween;
    };
    var attrTween = function attrTween(name, value) {
        var t0, i0;
        function tween() {
            var i = value.apply(this, arguments);
            if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
            return t0;
        }
        tween._value = value;
        return tween;
    };
    var attrTween_default = function attrTween_default(name, value) {
        var key = "attr." + name;
        if (arguments.length < 2) return (key = this.tween(key)) && key._value;
        if (value == null) return this.tween(key, null);
        if (typeof value !== "function") throw new Error();
        var fullname = namespace_default(name);
        return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    };
    var delayFunction = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/delay.js
    function delayFunction(id2, value) {
        return function() {
            init(this, id2).delay = +value.apply(this, arguments);
        };
    };
    var delayConstant = function delayConstant(id2, value) {
        return value = +value, function() {
            init(this, id2).delay = value;
        };
    };
    var delay_default = function delay_default(value) {
        var id2 = this._id;
        return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
    };
    var durationFunction = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/duration.js
    function durationFunction(id2, value) {
        return function() {
            set2(this, id2).duration = +value.apply(this, arguments);
        };
    };
    var durationConstant = function durationConstant(id2, value) {
        return value = +value, function() {
            set2(this, id2).duration = value;
        };
    };
    var duration_default = function duration_default(value) {
        var id2 = this._id;
        return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
    };
    var easeConstant = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/ease.js
    function easeConstant(id2, value) {
        if (typeof value !== "function") throw new Error();
        return function() {
            set2(this, id2).ease = value;
        };
    };
    var ease_default = function ease_default(value) {
        var id2 = this._id;
        return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
    };
    var easeVarying = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/easeVarying.js
    function easeVarying(id2, value) {
        return function() {
            var v = value.apply(this, arguments);
            if (typeof v !== "function") throw new Error();
            set2(this, id2).ease = v;
        };
    };
    var easeVarying_default = function easeVarying_default(value) {
        if (typeof value !== "function") throw new Error();
        return this.each(easeVarying(this._id, value));
    };
    var filter_default2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/filter.js
    function filter_default2(match) {
        if (typeof match !== "function") match = matcher_default(match);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i){
                if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                    subgroup.push(node);
                }
            }
        }
        return new Transition(subgroups, this._parents, this._name, this._id);
    };
    var merge_default2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/merge.js
    function merge_default2(transition2) {
        if (transition2._id !== this._id) throw new Error();
        for(var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
            for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge2 = merges[j] = new Array(n), node, i = 0; i < n; ++i){
                if (node = group0[i] || group1[i]) {
                    merge2[i] = node;
                }
            }
        }
        for(; j < m0; ++j){
            merges[j] = groups0[j];
        }
        return new Transition(merges, this._parents, this._name, this._id);
    };
    var start = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/on.js
    function start(name) {
        return (name + "").trim().split(/^|\s+/).every(function(t) {
            var i = t.indexOf(".");
            if (i >= 0) t = t.slice(0, i);
            return !t || t === "start";
        });
    };
    var onFunction = function onFunction(id2, name, listener) {
        var on0, on1, sit = start(name) ? init : set2;
        return function() {
            var schedule = sit(this, id2), on = schedule.on;
            if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
            schedule.on = on1;
        };
    };
    var on_default2 = function on_default2(name, listener) {
        var id2 = this._id;
        return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
    };
    var removeFunction = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/remove.js
    function removeFunction(id2) {
        return function() {
            var parent = this.parentNode;
            for(var i in this.__transition)if (+i !== id2) return;
            if (parent) parent.removeChild(this);
        };
    };
    var remove_default2 = function remove_default2() {
        return this.on("end.remove", removeFunction(this._id));
    };
    var select_default2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/select.js
    function select_default2(select) {
        var name = this._name, id2 = this._id;
        if (typeof select !== "function") select = selector_default(select);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i){
                if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                    if ("__data__" in node) subnode.__data__ = node.__data__;
                    subgroup[i] = subnode;
                    schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
                }
            }
        }
        return new Transition(subgroups, this._parents, name, id2);
    };
    var selectAll_default2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selectAll.js
    function selectAll_default2(select) {
        var name = this._name, id2 = this._id;
        if (typeof select !== "function") select = selectorAll_default(select);
        for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
                if (node = group[i]) {
                    for(var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k){
                        if (child = children2[k]) {
                            schedule_default(child, name, id2, k, children2, inherit2);
                        }
                    }
                    subgroups.push(children2);
                    parents.push(node);
                }
            }
        }
        return new Transition(subgroups, parents, name, id2);
    };
    var selection_default2 = function selection_default2() {
        return new Selection2(this._groups, this._parents);
    };
    var styleNull = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/style.js
    function styleNull(name, interpolate) {
        var string00, string10, interpolate0;
        return function() {
            var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
            return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
        };
    };
    var styleRemove2 = function styleRemove2(name) {
        return function() {
            this.style.removeProperty(name);
        };
    };
    var styleConstant2 = function styleConstant2(name, interpolate, value1) {
        var string00, string1 = value1 + "", interpolate0;
        return function() {
            var string0 = styleValue(this, name);
            return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
        };
    };
    var styleFunction2 = function styleFunction2(name, interpolate, value) {
        var string00, string10, interpolate0;
        return function() {
            var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
            if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
            return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
        };
    };
    var styleMaybeRemove = function styleMaybeRemove(id2, name) {
        var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
        return function() {
            var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
            if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
            schedule.on = on1;
        };
    };
    var style_default2 = function style_default2(name, value, priority) {
        var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
        return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
    };
    var styleInterpolate = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/styleTween.js
    function styleInterpolate(name, i, priority) {
        return function(t) {
            this.style.setProperty(name, i.call(this, t), priority);
        };
    };
    var styleTween = function styleTween(name, value, priority) {
        var t, i0;
        function tween() {
            var i = value.apply(this, arguments);
            if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
            return t;
        }
        tween._value = value;
        return tween;
    };
    var styleTween_default = function styleTween_default(name, value, priority) {
        var key = "style." + (name += "");
        if (arguments.length < 2) return (key = this.tween(key)) && key._value;
        if (value == null) return this.tween(key, null);
        if (typeof value !== "function") throw new Error();
        return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    };
    var textConstant2 = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/text.js
    function textConstant2(value) {
        return function() {
            this.textContent = value;
        };
    };
    var textFunction2 = function textFunction2(value) {
        return function() {
            var value1 = value(this);
            this.textContent = value1 == null ? "" : value1;
        };
    };
    var text_default2 = function text_default2(value) {
        return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
    };
    var textInterpolate = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/textTween.js
    function textInterpolate(i) {
        return function(t) {
            this.textContent = i.call(this, t);
        };
    };
    var textTween = function textTween(value) {
        var t0, i0;
        function tween() {
            var i = value.apply(this, arguments);
            if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
            return t0;
        }
        tween._value = value;
        return tween;
    };
    var textTween_default = function textTween_default(value) {
        var key = "text";
        if (arguments.length < 1) return (key = this.tween(key)) && key._value;
        if (value == null) return this.tween(key, null);
        if (typeof value !== "function") throw new Error();
        return this.tween(key, textTween(value));
    };
    var transition_default = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/transition.js
    function transition_default() {
        var name = this._name, id0 = this._id, id1 = newId();
        for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
                if (node = group[i]) {
                    var inherit2 = get2(node, id0);
                    schedule_default(node, name, id1, i, group, {
                        time: inherit2.time + inherit2.delay + inherit2.duration,
                        delay: 0,
                        duration: inherit2.duration,
                        ease: inherit2.ease
                    });
                }
            }
        }
        return new Transition(groups, this._parents, name, id1);
    };
    var end_default = // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/end.js
    function end_default() {
        var on0, on1, that = this, id2 = that._id, size = that.size();
        return new Promise(function(resolve, reject) {
            var cancel = {
                value: reject
            }, end = {
                value: function value() {
                    if (--size === 0) resolve();
                }
            };
            that.each(function() {
                var schedule = set2(this, id2), on = schedule.on;
                if (on !== on0) {
                    on1 = (on0 = on).copy();
                    on1._.cancel.push(cancel);
                    on1._.interrupt.push(cancel);
                    on1._.end.push(end);
                }
                schedule.on = on1;
            });
            if (size === 0) resolve();
        });
    };
    var Transition = function Transition(groups, parents, name, id2) {
        this._groups = groups;
        this._parents = parents;
        this._name = name;
        this._id = id2;
    };
    var transition = function transition(name) {
        return selection_default().transition(name);
    };
    var newId = function newId() {
        return ++id;
    };
    var cubicInOut = // node_modules/.pnpm/d3-ease@3.0.1/node_modules/d3-ease/src/cubic.js
    function cubicInOut(t) {
        return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    };
    var inherit = function inherit(node, id2) {
        var timing;
        while(!(timing = node.__transition) || !(timing = timing[id2])){
            if (!(node = node.parentNode)) {
                throw new Error("transition ".concat(id2, " not found"));
            }
        }
        return timing;
    };
    var transition_default2 = function transition_default2(name) {
        var id2, timing;
        if (_instanceof(name, Transition)) {
            id2 = name._id, name = name._name;
        } else {
            id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
        }
        for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i){
                if (node = group[i]) {
                    schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
                }
            }
        }
        return new Transition(groups, this._parents, name, id2);
    };
    var number1 = function number1(e) {
        return [
            +e[0],
            +e[1]
        ];
    };
    var number2 = function number2(e) {
        return [
            number1(e[0]),
            number1(e[1])
        ];
    };
    var type = function type(t) {
        return {
            type: t
        };
    };
    var Transform = // node_modules/.pnpm/d3-zoom@3.0.0/node_modules/d3-zoom/src/transform.js
    function Transform(k, x, y) {
        this.k = k;
        this.x = x;
        this.y = y;
    };
    var transform = function transform(node) {
        while(!node.__zoom)if (!(node = node.parentNode)) return identity2;
        return node.__zoom;
    };
    var __defProp = Object.defineProperty;
    var __export = function __export(target, all3) {
        for(var name in all3)__defProp(target, name, {
            get: all3[name],
            enumerable: true
        });
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/utils.js
    var toString = Object.prototype.toString;
    var getPrototypeOf = Object.getPrototypeOf;
    var iterator = Symbol.iterator, toStringTag = Symbol.toStringTag;
    var kindOf = /* @__PURE__ */ function(cache) {
        return function(thing) {
            var str = toString.call(thing);
            return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
        };
    }(/* @__PURE__ */ Object.create(null));
    var kindOfTest = function kindOfTest(type2) {
        type2 = type2.toLowerCase();
        return function(thing) {
            return kindOf(thing) === type2;
        };
    };
    var typeOfTest = function typeOfTest(type2) {
        return function(thing) {
            return (typeof thing === "undefined" ? "undefined" : _type_of(thing)) === type2;
        };
    };
    var isArray = Array.isArray;
    var isUndefined = typeOfTest("undefined");
    var isArrayBuffer = kindOfTest("ArrayBuffer");
    var isString = typeOfTest("string");
    var isFunction = typeOfTest("function");
    var isNumber = typeOfTest("number");
    var isObject = function isObject(thing) {
        return thing !== null && (typeof thing === "undefined" ? "undefined" : _type_of(thing)) === "object";
    };
    var isBoolean = function isBoolean(thing) {
        return thing === true || thing === false;
    };
    var isPlainObject = function isPlainObject(val) {
        if (kindOf(val) !== "object") {
            return false;
        }
        var prototype2 = getPrototypeOf(val);
        return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(toStringTag in val) && !(iterator in val);
    };
    var isEmptyObject = function isEmptyObject(val) {
        if (!isObject(val) || isBuffer(val)) {
            return false;
        }
        try {
            return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
        } catch (e) {
            return false;
        }
    };
    var isDate = kindOfTest("Date");
    var isFile = kindOfTest("File");
    var isReactNativeBlob = function isReactNativeBlob(value) {
        return !!(value && typeof value.uri !== "undefined");
    };
    var isReactNative = function isReactNative(formData) {
        return formData && typeof formData.getParts !== "undefined";
    };
    var isBlob = kindOfTest("Blob");
    var isFileList = kindOfTest("FileList");
    var isStream = function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
    };
    var G = getGlobal();
    var FormDataCtor = typeof G.FormData !== "undefined" ? G.FormData : void 0;
    var isFormData = function isFormData(thing) {
        var kind;
        return thing && (FormDataCtor && _instanceof(thing, FormDataCtor) || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
        kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
    };
    var isURLSearchParams = kindOfTest("URLSearchParams");
    var _map = _sliced_to_array([
        "ReadableStream",
        "Request",
        "Response",
        "Headers"
    ].map(kindOfTest), 4), isReadableStream = _map[0], isRequest = _map[1], isResponse = _map[2], isHeaders = _map[3];
    var trim = function trim(str) {
        return str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
    var _global = function() {
        if (typeof globalThis !== "undefined") return globalThis;
        return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
    }();
    var isContextDefined = function isContextDefined(context) {
        return !isUndefined(context) && context !== _global;
    };
    function merge() {
        var _ref = isContextDefined(this) && this || {}, caseless = _ref.caseless, skipUndefined = _ref.skipUndefined;
        var result = {};
        var assignValue = function assignValue(val, key) {
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
                return;
            }
            var targetKey = caseless && findKey(result, key) || key;
            if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
                result[targetKey] = merge(result[targetKey], val);
            } else if (isPlainObject(val)) {
                result[targetKey] = merge({}, val);
            } else if (isArray(val)) {
                result[targetKey] = val.slice();
            } else if (!skipUndefined || !isUndefined(val)) {
                result[targetKey] = val;
            }
        };
        for(var i = 0, l = arguments.length; i < l; i++){
            arguments[i] && forEach(arguments[i], assignValue);
        }
        return result;
    }
    var extend = function extend(a, b, thisArg) {
        var allOwnKeys = (arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}).allOwnKeys;
        forEach(b, function(val, key) {
            if (thisArg && isFunction(val)) {
                Object.defineProperty(a, key, {
                    value: bind(val, thisArg),
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else {
                Object.defineProperty(a, key, {
                    value: val,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        }, {
            allOwnKeys: allOwnKeys
        });
        return a;
    };
    var stripBOM = function stripBOM(content) {
        if (content.charCodeAt(0) === 65279) {
            content = content.slice(1);
        }
        return content;
    };
    var inherits = function inherits(constructor, superConstructor, props, descriptors) {
        constructor.prototype = Object.create(superConstructor.prototype, descriptors);
        Object.defineProperty(constructor.prototype, "constructor", {
            value: constructor,
            writable: true,
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(constructor, "super", {
            value: superConstructor.prototype
        });
        props && Object.assign(constructor.prototype, props);
    };
    var toFlatObject = function toFlatObject(sourceObj, destObj, filter3, propFilter) {
        var props;
        var i;
        var prop;
        var merged = {};
        destObj = destObj || {};
        if (sourceObj == null) return destObj;
        do {
            props = Object.getOwnPropertyNames(sourceObj);
            i = props.length;
            while(i-- > 0){
                prop = props[i];
                if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                    destObj[prop] = sourceObj[prop];
                    merged[prop] = true;
                }
            }
            sourceObj = filter3 !== false && getPrototypeOf(sourceObj);
        }while (sourceObj && (!filter3 || filter3(sourceObj, destObj)) && sourceObj !== Object.prototype);
        return destObj;
    };
    var endsWith = function endsWith(str, searchString, position) {
        str = String(str);
        if (position === void 0 || position > str.length) {
            position = str.length;
        }
        position -= searchString.length;
        var lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
    var toArray = function toArray(thing) {
        if (!thing) return null;
        if (isArray(thing)) return thing;
        var i = thing.length;
        if (!isNumber(i)) return null;
        var arr = new Array(i);
        while(i-- > 0){
            arr[i] = thing[i];
        }
        return arr;
    };
    var isTypedArray = /* @__PURE__ */ function(TypedArray) {
        return function(thing) {
            return TypedArray && _instanceof(thing, TypedArray);
        };
    }(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
    var forEachEntry = function forEachEntry(obj, fn) {
        var generator = obj && obj[iterator];
        var _iterator = generator.call(obj);
        var result;
        while((result = _iterator.next()) && !result.done){
            var pair = result.value;
            fn.call(obj, pair[0], pair[1]);
        }
    };
    var matchAll = function matchAll(regExp, str) {
        var matches;
        var arr = [];
        while((matches = regExp.exec(str)) !== null){
            arr.push(matches);
        }
        return arr;
    };
    var isHTMLForm = kindOfTest("HTMLFormElement");
    var toCamelCase = function toCamelCase(str) {
        return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
            return p1.toUpperCase() + p2;
        });
    };
    var hasOwnProperty = function(param) {
        var hasOwnProperty2 = param.hasOwnProperty;
        return function(obj, prop) {
            return hasOwnProperty2.call(obj, prop);
        };
    }(Object.prototype);
    var isRegExp = kindOfTest("RegExp");
    var reduceDescriptors = function reduceDescriptors(obj, reducer) {
        var descriptors = Object.getOwnPropertyDescriptors(obj);
        var reducedDescriptors = {};
        forEach(descriptors, function(descriptor, name) {
            var ret;
            if ((ret = reducer(descriptor, name, obj)) !== false) {
                reducedDescriptors[name] = ret || descriptor;
            }
        });
        Object.defineProperties(obj, reducedDescriptors);
    };
    var freezeMethods = function freezeMethods(obj) {
        reduceDescriptors(obj, function(descriptor, name) {
            if (isFunction(obj) && [
                "arguments",
                "caller",
                "callee"
            ].indexOf(name) !== -1) {
                return false;
            }
            var value = obj[name];
            if (!isFunction(value)) return;
            descriptor.enumerable = false;
            if ("writable" in descriptor) {
                descriptor.writable = false;
                return;
            }
            if (!descriptor.set) {
                descriptor.set = function() {
                    throw Error("Can not rewrite read-only method '" + name + "'");
                };
            }
        });
    };
    var toObjectSet = function toObjectSet(arrayOrString, delimiter) {
        var obj = {};
        var define = function define(arr) {
            arr.forEach(function(value) {
                obj[value] = true;
            });
        };
        isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
        return obj;
    };
    var noop = function noop() {};
    var toFiniteNumber = function toFiniteNumber(value, defaultValue) {
        return value != null && Number.isFinite(value = +value) ? value : defaultValue;
    };
    var toJSONObject = function toJSONObject(obj) {
        var stack = new Array(10);
        var visit = function visit1(source, i) {
            if (isObject(source)) {
                if (stack.indexOf(source) >= 0) {
                    return;
                }
                if (isBuffer(source)) {
                    return source;
                }
                if (!("toJSON" in source)) {
                    stack[i] = source;
                    var target = isArray(source) ? [] : {};
                    forEach(source, function(value, key) {
                        var reducedValue = visit(value, i + 1);
                        !isUndefined(reducedValue) && (target[key] = reducedValue);
                    });
                    stack[i] = void 0;
                    return target;
                }
            }
            return source;
        };
        return visit(obj, 0);
    };
    var isAsyncFn = kindOfTest("AsyncFunction");
    var isThenable = function isThenable(thing) {
        return thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
    };
    var _setImmediate = function(setImmediateSupported, postMessageSupported) {
        if (setImmediateSupported) {
            return setImmediate;
        }
        return postMessageSupported ? function(token, callbacks) {
            _global.addEventListener("message", function(param) {
                var source = param.source, data = param.data;
                if (source === _global && data === token) {
                    callbacks.length && callbacks.shift()();
                }
            }, false);
            return function(cb) {
                callbacks.push(cb);
                _global.postMessage(token, "*");
            };
        }("axios@".concat(Math.random()), []) : function(cb) {
            return setTimeout(cb);
        };
    }(typeof setImmediate === "function", isFunction(_global.postMessage));
    var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
    var isIterable = function isIterable(thing) {
        return thing != null && isFunction(thing[iterator]);
    };
    var utils_default = {
        isArray: isArray,
        isArrayBuffer: isArrayBuffer,
        isBuffer: isBuffer,
        isFormData: isFormData,
        isArrayBufferView: isArrayBufferView,
        isString: isString,
        isNumber: isNumber,
        isBoolean: isBoolean,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isEmptyObject: isEmptyObject,
        isReadableStream: isReadableStream,
        isRequest: isRequest,
        isResponse: isResponse,
        isHeaders: isHeaders,
        isUndefined: isUndefined,
        isDate: isDate,
        isFile: isFile,
        isReactNativeBlob: isReactNativeBlob,
        isReactNative: isReactNative,
        isBlob: isBlob,
        isRegExp: isRegExp,
        isFunction: isFunction,
        isStream: isStream,
        isURLSearchParams: isURLSearchParams,
        isTypedArray: isTypedArray,
        isFileList: isFileList,
        forEach: forEach,
        merge: merge,
        extend: extend,
        trim: trim,
        stripBOM: stripBOM,
        inherits: inherits,
        toFlatObject: toFlatObject,
        kindOf: kindOf,
        kindOfTest: kindOfTest,
        endsWith: endsWith,
        toArray: toArray,
        forEachEntry: forEachEntry,
        matchAll: matchAll,
        isHTMLForm: isHTMLForm,
        hasOwnProperty: hasOwnProperty,
        hasOwnProp: hasOwnProperty,
        // an alias to avoid ESLint no-prototype-builtins detection
        reduceDescriptors: reduceDescriptors,
        freezeMethods: freezeMethods,
        toObjectSet: toObjectSet,
        toCamelCase: toCamelCase,
        noop: noop,
        toFiniteNumber: toFiniteNumber,
        findKey: findKey,
        global: _global,
        isContextDefined: isContextDefined,
        isSpecCompliantForm: isSpecCompliantForm,
        toJSONObject: toJSONObject,
        isAsyncFn: isAsyncFn,
        isThenable: isThenable,
        setImmediate: _setImmediate,
        asap: asap,
        isIterable: isIterable
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/AxiosError.js
    var AxiosError = /*#__PURE__*/ function(Error1) {
        _inherits(_AxiosError, Error1);
        function _AxiosError(message, code, config, request, response) {
            _class_call_check(this, _AxiosError);
            var _this;
            _this = _call_super(this, _AxiosError, [
                message
            ]);
            Object.defineProperty(_this, "message", {
                value: message,
                enumerable: true,
                writable: true,
                configurable: true
            });
            _this.name = "AxiosError";
            _this.isAxiosError = true;
            code && (_this.code = code);
            config && (_this.config = config);
            request && (_this.request = request);
            if (response) {
                _this.response = response;
                _this.status = response.status;
            }
            return _this;
        }
        _create_class(_AxiosError, [
            {
                key: "toJSON",
                value: function toJSON() {
                    return {
                        // Standard
                        message: this.message,
                        name: this.name,
                        // Microsoft
                        description: this.description,
                        number: this.number,
                        // Mozilla
                        fileName: this.fileName,
                        lineNumber: this.lineNumber,
                        columnNumber: this.columnNumber,
                        stack: this.stack,
                        // Axios
                        config: utils_default.toJSONObject(this.config),
                        code: this.code,
                        status: this.status
                    };
                }
            }
        ], [
            {
                key: "from",
                value: function from(error, code, config, request, response, customProps) {
                    var axiosError = new _AxiosError(error.message, code || error.code, config, request, response);
                    axiosError.cause = error;
                    axiosError.name = error.name;
                    if (error.status != null && axiosError.status == null) {
                        axiosError.status = error.status;
                    }
                    customProps && Object.assign(axiosError, customProps);
                    return axiosError;
                }
            }
        ]);
        return _AxiosError;
    }(_wrap_native_super(Error));
    AxiosError.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE";
    AxiosError.ERR_BAD_OPTION = "ERR_BAD_OPTION";
    AxiosError.ECONNABORTED = "ECONNABORTED";
    AxiosError.ETIMEDOUT = "ETIMEDOUT";
    AxiosError.ERR_NETWORK = "ERR_NETWORK";
    AxiosError.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS";
    AxiosError.ERR_DEPRECATED = "ERR_DEPRECATED";
    AxiosError.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE";
    AxiosError.ERR_BAD_REQUEST = "ERR_BAD_REQUEST";
    AxiosError.ERR_CANCELED = "ERR_CANCELED";
    AxiosError.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT";
    AxiosError.ERR_INVALID_URL = "ERR_INVALID_URL";
    var AxiosError_default = AxiosError;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/null.js
    var null_default = null;
    var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
        return /^is[A-Z]/.test(prop);
    });
    var toFormData_default = toFormData;
    var prototype = AxiosURLSearchParams.prototype;
    prototype.append = function append(name, value) {
        this._pairs.push([
            name,
            value
        ]);
    };
    prototype.toString = function toString2(encoder) {
        var _encode = encoder ? function(value) {
            return encoder.call(this, value, encode);
        } : encode;
        return this._pairs.map(function each(pair) {
            return _encode(pair[0]) + "=" + _encode(pair[1]);
        }, "").join("&");
    };
    var AxiosURLSearchParams_default = AxiosURLSearchParams;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/InterceptorManager.js
    var InterceptorManager = /*#__PURE__*/ function() {
        function InterceptorManager() {
            _class_call_check(this, InterceptorManager);
            this.handlers = [];
        }
        _create_class(InterceptorManager, [
            {
                /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     * @param {Object} options The options for the interceptor, synchronous and runWhen
     *
     * @return {Number} An ID used to remove interceptor later
     */ key: "use",
                value: function use(fulfilled, rejected, options) {
                    this.handlers.push({
                        fulfilled: fulfilled,
                        rejected: rejected,
                        synchronous: options ? options.synchronous : false,
                        runWhen: options ? options.runWhen : null
                    });
                    return this.handlers.length - 1;
                }
            },
            {
                /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     *
     * @returns {void}
     */ key: "eject",
                value: function eject(id2) {
                    if (this.handlers[id2]) {
                        this.handlers[id2] = null;
                    }
                }
            },
            {
                /**
     * Clear all interceptors from the stack
     *
     * @returns {void}
     */ key: "clear",
                value: function clear() {
                    if (this.handlers) {
                        this.handlers = [];
                    }
                }
            },
            {
                /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     *
     * @returns {void}
     */ key: "forEach",
                value: function forEach(fn) {
                    utils_default.forEach(this.handlers, function forEachHandler(h) {
                        if (h !== null) {
                            fn(h);
                        }
                    });
                }
            }
        ]);
        return InterceptorManager;
    }();
    var InterceptorManager_default = InterceptorManager;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/defaults/transitional.js
    var transitional_default = {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
        legacyInterceptorReqResOrdering: true
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
    var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/browser/classes/FormData.js
    var FormData_default = typeof FormData !== "undefined" ? FormData : null;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/browser/classes/Blob.js
    var Blob_default = typeof Blob !== "undefined" ? Blob : null;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/browser/index.js
    var browser_default = {
        isBrowser: true,
        classes: {
            URLSearchParams: URLSearchParams_default,
            FormData: FormData_default,
            Blob: Blob_default
        },
        protocols: [
            "http",
            "https",
            "file",
            "blob",
            "url",
            "data"
        ]
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/common/utils.js
    var utils_exports = {};
    __export(utils_exports, {
        hasBrowserEnv: function hasBrowserEnv1() {
            return hasBrowserEnv;
        },
        hasStandardBrowserEnv: function hasStandardBrowserEnv1() {
            return hasStandardBrowserEnv;
        },
        hasStandardBrowserWebWorkerEnv: function hasStandardBrowserWebWorkerEnv1() {
            return hasStandardBrowserWebWorkerEnv;
        },
        navigator: function navigator1() {
            return _navigator;
        },
        origin: function origin1() {
            return origin;
        }
    });
    var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
    var _navigator = (typeof navigator === "undefined" ? "undefined" : _type_of(navigator)) === "object" && navigator || void 0;
    var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || [
        "ReactNative",
        "NativeScript",
        "NS"
    ].indexOf(_navigator.product) < 0);
    var hasStandardBrowserWebWorkerEnv = function() {
        return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
        _instanceof(self, WorkerGlobalScope) && typeof self.importScripts === "function";
    }();
    var origin = hasBrowserEnv && window.location.href || "http://localhost";
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/platform/index.js
    var platform_default = _object_spread({}, utils_exports, browser_default);
    var formDataToJSON_default = formDataToJSON;
    var defaults = {
        transitional: transitional_default,
        adapter: [
            "xhr",
            "http",
            "fetch"
        ],
        transformRequest: [
            function transformRequest(data, headers) {
                var contentType = headers.getContentType() || "";
                var hasJSONContentType = contentType.indexOf("application/json") > -1;
                var isObjectPayload = utils_default.isObject(data);
                if (isObjectPayload && utils_default.isHTMLForm(data)) {
                    data = new FormData(data);
                }
                var isFormData2 = utils_default.isFormData(data);
                if (isFormData2) {
                    return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
                }
                if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
                    return data;
                }
                if (utils_default.isArrayBufferView(data)) {
                    return data.buffer;
                }
                if (utils_default.isURLSearchParams(data)) {
                    headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
                    return data.toString();
                }
                var isFileList2;
                if (isObjectPayload) {
                    if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
                        return toURLEncodedForm(data, this.formSerializer).toString();
                    }
                    if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
                        var _FormData = this.env && this.env.FormData;
                        return toFormData_default(isFileList2 ? {
                            "files[]": data
                        } : data, _FormData && new _FormData(), this.formSerializer);
                    }
                }
                if (isObjectPayload || hasJSONContentType) {
                    headers.setContentType("application/json", false);
                    return stringifySafely(data);
                }
                return data;
            }
        ],
        transformResponse: [
            function transformResponse(data) {
                var transitional2 = this.transitional || defaults.transitional;
                var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
                var JSONRequested = this.responseType === "json";
                if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
                    return data;
                }
                if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
                    var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
                    var strictJSONParsing = !silentJSONParsing && JSONRequested;
                    try {
                        return JSON.parse(data, this.parseReviver);
                    } catch (e) {
                        if (strictJSONParsing) {
                            if (e.name === "SyntaxError") {
                                throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
                            }
                            throw e;
                        }
                    }
                }
                return data;
            }
        ],
        /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */ timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: {
            FormData: platform_default.classes.FormData,
            Blob: platform_default.classes.Blob
        },
        validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
        },
        headers: {
            common: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": void 0
            }
        }
    };
    utils_default.forEach([
        "delete",
        "get",
        "head",
        "post",
        "put",
        "patch"
    ], function(method) {
        defaults.headers[method] = {};
    });
    var defaults_default = defaults;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/parseHeaders.js
    var ignoreDuplicateOf = utils_default.toObjectSet([
        "age",
        "authorization",
        "content-length",
        "content-type",
        "etag",
        "expires",
        "from",
        "host",
        "if-modified-since",
        "if-unmodified-since",
        "last-modified",
        "location",
        "max-forwards",
        "proxy-authorization",
        "referer",
        "retry-after",
        "user-agent"
    ]);
    var parseHeaders_default = function parseHeaders_default(rawHeaders) {
        var parsed = {};
        var key;
        var val;
        var i;
        rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
            i = line.indexOf(":");
            key = line.substring(0, i).trim().toLowerCase();
            val = line.substring(i + 1).trim();
            if (!key || parsed[key] && ignoreDuplicateOf[key]) {
                return;
            }
            if (key === "set-cookie") {
                if (parsed[key]) {
                    parsed[key].push(val);
                } else {
                    parsed[key] = [
                        val
                    ];
                }
            } else {
                parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
            }
        });
        return parsed;
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/AxiosHeaders.js
    var $internals = /* @__PURE__ */ Symbol("internals");
    function normalizeValue(value) {
        if (value === false || value == null) {
            return value;
        }
        return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
    }
    var isValidHeaderName = function isValidHeaderName(str) {
        return /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
    };
    var AxiosHeaders = /*#__PURE__*/ function() {
        function AxiosHeaders(headers) {
            _class_call_check(this, AxiosHeaders);
            headers && this.set(headers);
        }
        _create_class(AxiosHeaders, [
            {
                key: "set",
                value: function set(header, valueOrRewrite, rewrite) {
                    var self2 = this;
                    function setHeader(_value, _header, _rewrite) {
                        var lHeader = normalizeHeader(_header);
                        if (!lHeader) {
                            throw new Error("header name must be a non-empty string");
                        }
                        var key = utils_default.findKey(self2, lHeader);
                        if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
                            self2[key || _header] = normalizeValue(_value);
                        }
                    }
                    var setHeaders = function setHeaders(headers, _rewrite) {
                        return utils_default.forEach(headers, function(_value, _header) {
                            return setHeader(_value, _header, _rewrite);
                        });
                    };
                    if (utils_default.isPlainObject(header) || _instanceof(header, this.constructor)) {
                        setHeaders(header, valueOrRewrite);
                    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
                        setHeaders(parseHeaders_default(header), valueOrRewrite);
                    } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
                        var obj = {}, dest, key;
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(var _iterator = header[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                var entry = _step.value;
                                if (!utils_default.isArray(entry)) {
                                    throw TypeError("Object iterator must return a key-value pair");
                                }
                                obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? _to_consumable_array(dest).concat([
                                    entry[1]
                                ]) : [
                                    dest,
                                    entry[1]
                                ] : entry[1];
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally{
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                        setHeaders(obj, valueOrRewrite);
                    } else {
                        header != null && setHeader(valueOrRewrite, header, rewrite);
                    }
                    return this;
                }
            },
            {
                key: "get",
                value: function get(header, parser) {
                    header = normalizeHeader(header);
                    if (header) {
                        var key = utils_default.findKey(this, header);
                        if (key) {
                            var value = this[key];
                            if (!parser) {
                                return value;
                            }
                            if (parser === true) {
                                return parseTokens(value);
                            }
                            if (utils_default.isFunction(parser)) {
                                return parser.call(this, value, key);
                            }
                            if (utils_default.isRegExp(parser)) {
                                return parser.exec(value);
                            }
                            throw new TypeError("parser must be boolean|regexp|function");
                        }
                    }
                }
            },
            {
                key: "has",
                value: function has(header, matcher) {
                    header = normalizeHeader(header);
                    if (header) {
                        var key = utils_default.findKey(this, header);
                        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
                    }
                    return false;
                }
            },
            {
                key: "delete",
                value: function _delete(header, matcher) {
                    var self2 = this;
                    var deleted = false;
                    function deleteHeader(_header) {
                        _header = normalizeHeader(_header);
                        if (_header) {
                            var key = utils_default.findKey(self2, _header);
                            if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
                                delete self2[key];
                                deleted = true;
                            }
                        }
                    }
                    if (utils_default.isArray(header)) {
                        header.forEach(deleteHeader);
                    } else {
                        deleteHeader(header);
                    }
                    return deleted;
                }
            },
            {
                key: "clear",
                value: function clear(matcher) {
                    var keys = Object.keys(this);
                    var i = keys.length;
                    var deleted = false;
                    while(i--){
                        var key = keys[i];
                        if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                            delete this[key];
                            deleted = true;
                        }
                    }
                    return deleted;
                }
            },
            {
                key: "normalize",
                value: function normalize(format) {
                    var self2 = this;
                    var headers = {};
                    utils_default.forEach(this, function(value, header) {
                        var key = utils_default.findKey(headers, header);
                        if (key) {
                            self2[key] = normalizeValue(value);
                            delete self2[header];
                            return;
                        }
                        var normalized = format ? formatHeader(header) : String(header).trim();
                        if (normalized !== header) {
                            delete self2[header];
                        }
                        self2[normalized] = normalizeValue(value);
                        headers[normalized] = true;
                    });
                    return this;
                }
            },
            {
                key: "concat",
                value: function concat() {
                    for(var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++){
                        targets[_key] = arguments[_key];
                    }
                    var _this_constructor;
                    return (_this_constructor = this.constructor).concat.apply(_this_constructor, [
                        this
                    ].concat(_to_consumable_array(targets)));
                }
            },
            {
                key: "toJSON",
                value: function toJSON(asStrings) {
                    var obj = /* @__PURE__ */ Object.create(null);
                    utils_default.forEach(this, function(value, header) {
                        value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
                    });
                    return obj;
                }
            },
            {
                key: Symbol.iterator,
                value: function value() {
                    return Object.entries(this.toJSON())[Symbol.iterator]();
                }
            },
            {
                key: "toString",
                value: function toString() {
                    return Object.entries(this.toJSON()).map(function(param) {
                        var _param = _sliced_to_array(param, 2), header = _param[0], value = _param[1];
                        return header + ": " + value;
                    }).join("\n");
                }
            },
            {
                key: "getSetCookie",
                value: function getSetCookie() {
                    return this.get("set-cookie") || [];
                }
            },
            {
                key: Symbol.toStringTag,
                get: function get() {
                    return "AxiosHeaders";
                }
            }
        ], [
            {
                key: "from",
                value: function from(thing) {
                    return _instanceof(thing, this) ? thing : new this(thing);
                }
            },
            {
                key: "concat",
                value: function concat(first) {
                    for(var _len = arguments.length, targets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                        targets[_key - 1] = arguments[_key];
                    }
                    var computed = new this(first);
                    targets.forEach(function(target) {
                        return computed.set(target);
                    });
                    return computed;
                }
            },
            {
                key: "accessor",
                value: function accessor(header) {
                    var internals = this[$internals] = this[$internals] = {
                        accessors: {}
                    };
                    var accessors = internals.accessors;
                    var prototype2 = this.prototype;
                    function defineAccessor(_header) {
                        var lHeader = normalizeHeader(_header);
                        if (!accessors[lHeader]) {
                            buildAccessors(prototype2, _header);
                            accessors[lHeader] = true;
                        }
                    }
                    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
                    return this;
                }
            }
        ]);
        return AxiosHeaders;
    }();
    AxiosHeaders.accessor([
        "Content-Type",
        "Content-Length",
        "Accept",
        "Accept-Encoding",
        "User-Agent",
        "Authorization"
    ]);
    utils_default.reduceDescriptors(AxiosHeaders.prototype, function(param, key) {
        var value = param.value;
        var mapped = key[0].toUpperCase() + key.slice(1);
        return {
            get: function get() {
                return value;
            },
            set: function set(headerValue) {
                this[mapped] = headerValue;
            }
        };
    });
    utils_default.freezeMethods(AxiosHeaders);
    var AxiosHeaders_default = AxiosHeaders;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/cancel/CanceledError.js
    var CanceledError = /*#__PURE__*/ function(AxiosError_default1) {
        _inherits(CanceledError, AxiosError_default1);
        function CanceledError(message, config, request) {
            _class_call_check(this, CanceledError);
            var _this;
            _this = _call_super(this, CanceledError, [
                message == null ? "canceled" : message,
                AxiosError_default.ERR_CANCELED,
                config,
                request
            ]);
            _this.name = "CanceledError";
            _this.__CANCEL__ = true;
            return _this;
        }
        return CanceledError;
    }(AxiosError_default);
    var CanceledError_default = CanceledError;
    var speedometer_default = speedometer;
    var throttle_default = throttle;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/progressEventReducer.js
    var progressEventReducer = function progressEventReducer(listener, isDownloadStream) {
        var freq = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 3;
        var bytesNotified = 0;
        var _speedometer = speedometer_default(50, 250);
        return throttle_default(function(e) {
            var loaded = e.loaded;
            var total = e.lengthComputable ? e.total : void 0;
            var progressBytes = loaded - bytesNotified;
            var rate = _speedometer(progressBytes);
            var inRange = loaded <= total;
            bytesNotified = loaded;
            var data = _define_property({
                loaded: loaded,
                total: total,
                progress: total ? loaded / total : void 0,
                bytes: progressBytes,
                rate: rate ? rate : void 0,
                estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
                event: e,
                lengthComputable: total != null
            }, isDownloadStream ? "download" : "upload", true);
            listener(data);
        }, freq);
    };
    var progressEventDecorator = function progressEventDecorator(total, throttled) {
        var lengthComputable = total != null;
        return [
            function(loaded) {
                return throttled[0]({
                    lengthComputable: lengthComputable,
                    total: total,
                    loaded: loaded
                });
            },
            throttled[1]
        ];
    };
    var asyncDecorator = function asyncDecorator(fn) {
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return utils_default.asap(function() {
                return fn.apply(void 0, _to_consumable_array(args));
            });
        };
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/isURLSameOrigin.js
    var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ function(origin2, isMSIE) {
        return function(url) {
            url = new URL(url, platform_default.origin);
            return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
        };
    }(new URL(platform_default.origin), platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)) : function() {
        return true;
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/cookies.js
    var cookies_default = platform_default.hasStandardBrowserEnv ? // Standard browser envs support document.cookie
    {
        write: function write(name, value, expires, path, domain, secure, sameSite) {
            if (typeof document === "undefined") return;
            var cookie = [
                "".concat(name, "=").concat(encodeURIComponent(value))
            ];
            if (utils_default.isNumber(expires)) {
                cookie.push("expires=".concat(new Date(expires).toUTCString()));
            }
            if (utils_default.isString(path)) {
                cookie.push("path=".concat(path));
            }
            if (utils_default.isString(domain)) {
                cookie.push("domain=".concat(domain));
            }
            if (secure === true) {
                cookie.push("secure");
            }
            if (utils_default.isString(sameSite)) {
                cookie.push("SameSite=".concat(sameSite));
            }
            document.cookie = cookie.join("; ");
        },
        read: function read(name) {
            if (typeof document === "undefined") return null;
            var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
            return match ? decodeURIComponent(match[1]) : null;
        },
        remove: function remove(name) {
            this.write(name, "", Date.now() - 864e5, "/");
        }
    } : // Non-standard browser env (web workers, react-native) lack needed support.
    {
        write: function write() {},
        read: function read() {
            return null;
        },
        remove: function remove() {}
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/mergeConfig.js
    var headersToObject = function headersToObject(thing) {
        return _instanceof(thing, AxiosHeaders_default) ? _object_spread({}, thing) : thing;
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/resolveConfig.js
    var resolveConfig_default = function resolveConfig_default(config) {
        var newConfig = mergeConfig({}, config);
        var data = newConfig.data, withXSRFToken = newConfig.withXSRFToken, xsrfHeaderName = newConfig.xsrfHeaderName, xsrfCookieName = newConfig.xsrfCookieName, headers = newConfig.headers, auth = newConfig.auth;
        newConfig.headers = headers = AxiosHeaders_default.from(headers);
        newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
        if (auth) {
            headers.set("Authorization", "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : "")));
        }
        if (utils_default.isFormData(data)) {
            if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
                headers.setContentType(void 0);
            } else if (utils_default.isFunction(data.getHeaders)) {
                var formHeaders = data.getHeaders();
                var allowedHeaders = [
                    "content-type",
                    "content-length"
                ];
                Object.entries(formHeaders).forEach(function(param) {
                    var _param = _sliced_to_array(param, 2), key = _param[0], val = _param[1];
                    if (allowedHeaders.includes(key.toLowerCase())) {
                        headers.set(key, val);
                    }
                });
            }
        }
        if (platform_default.hasStandardBrowserEnv) {
            withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
            if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
                var xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
                if (xsrfValue) {
                    headers.set(xsrfHeaderName, xsrfValue);
                }
            }
        }
        return newConfig;
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/adapters/xhr.js
    var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
    var xhr_default = isXHRAdapterSupported && function(config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
            var _config = resolveConfig_default(config);
            var requestData = _config.data;
            var requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
            var responseType = _config.responseType, onUploadProgress = _config.onUploadProgress, onDownloadProgress = _config.onDownloadProgress;
            var onCanceled;
            var uploadThrottled, downloadThrottled;
            var flushUpload, flushDownload;
            function done() {
                flushUpload && flushUpload();
                flushDownload && flushDownload();
                _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
                _config.signal && _config.signal.removeEventListener("abort", onCanceled);
            }
            var request = new XMLHttpRequest();
            request.open(_config.method.toUpperCase(), _config.url, true);
            request.timeout = _config.timeout;
            function onloadend() {
                if (!request) {
                    return;
                }
                var responseHeaders = AxiosHeaders_default.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
                var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                settle(function _resolve(value) {
                    resolve(value);
                    done();
                }, function _reject(err) {
                    reject(err);
                    done();
                }, response);
                request = null;
            }
            if ("onloadend" in request) {
                request.onloadend = onloadend;
            } else {
                request.onreadystatechange = function handleLoad() {
                    if (!request || request.readyState !== 4) {
                        return;
                    }
                    if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                        return;
                    }
                    setTimeout(onloadend);
                };
            }
            request.onabort = function handleAbort() {
                if (!request) {
                    return;
                }
                reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
                request = null;
            };
            request.onerror = function handleError(event) {
                var msg = event && event.message ? event.message : "Network Error";
                var err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
                err.event = event || null;
                reject(err);
                request = null;
            };
            request.ontimeout = function handleTimeout() {
                var timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
                var transitional2 = _config.transitional || transitional_default;
                if (_config.timeoutErrorMessage) {
                    timeoutErrorMessage = _config.timeoutErrorMessage;
                }
                reject(new AxiosError_default(timeoutErrorMessage, transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED, config, request));
                request = null;
            };
            requestData === void 0 && requestHeaders.setContentType(null);
            if ("setRequestHeader" in request) {
                utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
                    request.setRequestHeader(key, val);
                });
            }
            if (!utils_default.isUndefined(_config.withCredentials)) {
                request.withCredentials = !!_config.withCredentials;
            }
            if (responseType && responseType !== "json") {
                request.responseType = _config.responseType;
            }
            if (onDownloadProgress) {
                var ref;
                ref = _sliced_to_array(progressEventReducer(onDownloadProgress, true), 2), downloadThrottled = ref[0], flushDownload = ref[1], ref;
                request.addEventListener("progress", downloadThrottled);
            }
            if (onUploadProgress && request.upload) {
                var ref1;
                ref1 = _sliced_to_array(progressEventReducer(onUploadProgress), 2), uploadThrottled = ref1[0], flushUpload = ref1[1], ref1;
                request.upload.addEventListener("progress", uploadThrottled);
                request.upload.addEventListener("loadend", flushUpload);
            }
            if (_config.cancelToken || _config.signal) {
                onCanceled = function onCanceled(cancel) {
                    if (!request) {
                        return;
                    }
                    reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
                    request.abort();
                    request = null;
                };
                _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
                if (_config.signal) {
                    _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
                }
            }
            var protocol = parseProtocol(_config.url);
            if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
                reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
                return;
            }
            request.send(requestData || null);
        });
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/composeSignals.js
    var composeSignals = function composeSignals(signals, timeout2) {
        var length = (signals = signals ? signals.filter(Boolean) : []).length;
        if (timeout2 || length) {
            var controller = new AbortController();
            var aborted;
            var onabort = function onabort(reason) {
                if (!aborted) {
                    aborted = true;
                    unsubscribe();
                    var err = _instanceof(reason, Error) ? reason : this.reason;
                    controller.abort(_instanceof(err, AxiosError_default) ? err : new CanceledError_default(_instanceof(err, Error) ? err.message : err));
                }
            };
            var timer2 = timeout2 && setTimeout(function() {
                timer2 = null;
                onabort(new AxiosError_default("timeout of ".concat(timeout2, "ms exceeded"), AxiosError_default.ETIMEDOUT));
            }, timeout2);
            var unsubscribe = function unsubscribe() {
                if (signals) {
                    timer2 && clearTimeout(timer2);
                    timer2 = null;
                    signals.forEach(function(signal2) {
                        signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
                    });
                    signals = null;
                }
            };
            signals.forEach(function(signal2) {
                return signal2.addEventListener("abort", onabort);
            });
            var signal = controller.signal;
            signal.unsubscribe = function() {
                return utils_default.asap(unsubscribe);
            };
            return signal;
        }
    };
    var composeSignals_default = composeSignals;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/trackStream.js
    var streamChunk = function streamChunk(chunk, chunkSize) {
        var len, pos, end;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    len = chunk.byteLength;
                    if (!(!chunkSize || len < chunkSize)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        chunk
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    pos = 0;
                    _state.label = 3;
                case 3:
                    if (!(pos < len)) return [
                        3,
                        5
                    ];
                    end = pos + chunkSize;
                    return [
                        4,
                        chunk.slice(pos, end)
                    ];
                case 4:
                    _state.sent();
                    pos = end;
                    return [
                        3,
                        3
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    };
    var readBytes = function readBytes(iterable, chunkSize) {
        return _wrap_async_generator(function() {
            var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _iteratorAbruptCompletion = false, _didIteratorError = false;
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            7,
                            8,
                            13
                        ]);
                        _iterator = _async_iterator(readStream(iterable));
                        _state.label = 2;
                    case 2:
                        return [
                            4,
                            _await_async_generator(_iterator.next())
                        ];
                    case 3:
                        if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                            3,
                            6
                        ];
                        _value = _step.value;
                        chunk = _value;
                        return [
                            5,
                            _ts_values(_async_generator_delegate(_async_iterator(streamChunk(chunk, chunkSize))))
                        ];
                    case 4:
                        _state.sent();
                        _state.label = 5;
                    case 5:
                        _iteratorAbruptCompletion = false;
                        return [
                            3,
                            2
                        ];
                    case 6:
                        return [
                            3,
                            13
                        ];
                    case 7:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            13
                        ];
                    case 8:
                        _state.trys.push([
                            8,
                            ,
                            11,
                            12
                        ]);
                        if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                            3,
                            10
                        ];
                        return [
                            4,
                            _await_async_generator(_iterator.return())
                        ];
                    case 9:
                        _state.sent();
                        _state.label = 10;
                    case 10:
                        return [
                            3,
                            12
                        ];
                    case 11:
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                        return [
                            7
                        ];
                    case 12:
                        return [
                            7
                        ];
                    case 13:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var readStream = function readStream(stream) {
        return _wrap_async_generator(function() {
            var reader, _ref, done, value;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!stream[Symbol.asyncIterator]) return [
                            3,
                            2
                        ];
                        return [
                            5,
                            _ts_values(_async_generator_delegate(_async_iterator(stream)))
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                    case 2:
                        reader = stream.getReader();
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            ,
                            9,
                            11
                        ]);
                        _state.label = 4;
                    case 4:
                        return [
                            4,
                            _await_async_generator(reader.read())
                        ];
                    case 5:
                        _ref = _state.sent(), done = _ref.done, value = _ref.value;
                        if (done) {
                            return [
                                3,
                                8
                            ];
                        }
                        return [
                            4,
                            value
                        ];
                    case 6:
                        _state.sent();
                        _state.label = 7;
                    case 7:
                        return [
                            3,
                            4
                        ];
                    case 8:
                        return [
                            3,
                            11
                        ];
                    case 9:
                        return [
                            4,
                            _await_async_generator(reader.cancel())
                        ];
                    case 10:
                        _state.sent();
                        return [
                            7
                        ];
                    case 11:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var trackStream = function trackStream(stream, chunkSize, onProgress, onFinish) {
        var iterator2 = readBytes(stream, chunkSize);
        var bytes = 0;
        var done;
        var _onFinish = function _onFinish(e) {
            if (!done) {
                done = true;
                onFinish && onFinish(e);
            }
        };
        return new ReadableStream({
            pull: function pull(controller) {
                return _async_to_generator(function() {
                    var _ref, done2, value, len, loadedBytes, err;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                return [
                                    4,
                                    iterator2.next()
                                ];
                            case 1:
                                _ref = _state.sent(), done2 = _ref.done, value = _ref.value;
                                if (done2) {
                                    _onFinish();
                                    controller.close();
                                    return [
                                        2
                                    ];
                                }
                                len = value.byteLength;
                                if (onProgress) {
                                    loadedBytes = bytes += len;
                                    onProgress(loadedBytes);
                                }
                                controller.enqueue(new Uint8Array(value));
                                return [
                                    3,
                                    3
                                ];
                            case 2:
                                err = _state.sent();
                                _onFinish(err);
                                throw err;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            },
            cancel: function cancel(reason) {
                _onFinish(reason);
                return iterator2.return();
            }
        }, {
            highWaterMark: 2
        });
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/adapters/fetch.js
    var DEFAULT_CHUNK_SIZE = 64 * 1024;
    var isFunction2 = utils_default.isFunction;
    var globalFetchAPI = function(param) {
        var Request = param.Request, Response = param.Response;
        return {
            Request: Request,
            Response: Response
        };
    }(utils_default.global);
    var _utils_default_global = utils_default.global, ReadableStream2 = _utils_default_global.ReadableStream, TextEncoder = _utils_default_global.TextEncoder;
    var test = function test(fn) {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        try {
            return !!fn.apply(void 0, _to_consumable_array(args));
        } catch (e) {
            return false;
        }
    };
    var factory = function factory(env) {
        env = utils_default.merge.call({
            skipUndefined: true
        }, globalFetchAPI, env);
        var envFetch = env.fetch, Request = env.Request, Response = env.Response;
        var isFetchSupported = envFetch ? isFunction2(envFetch) : typeof fetch === "function";
        var isRequestSupported = isFunction2(Request);
        var isResponseSupported = isFunction2(Response);
        if (!isFetchSupported) {
            return false;
        }
        var isReadableStreamSupported = isFetchSupported && isFunction2(ReadableStream2);
        var encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ function(encoder) {
            return function(str) {
                return encoder.encode(str);
            };
        }(new TextEncoder()) : function(str) {
            return _async_to_generator(function() {
                var _;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _ = Uint8Array.bind;
                            return [
                                4,
                                new Request(str).arrayBuffer()
                            ];
                        case 1:
                            return [
                                2,
                                new (_.apply(Uint8Array, [
                                    void 0,
                                    _state.sent()
                                ]))
                            ];
                    }
                });
            })();
        });
        var supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(function() {
            var duplexAccessed = false;
            var hasContentType = new Request(platform_default.origin, {
                body: new ReadableStream2(),
                method: "POST",
                get duplex () {
                    duplexAccessed = true;
                    return "half";
                }
            }).headers.has("Content-Type");
            return duplexAccessed && !hasContentType;
        });
        var supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(function() {
            return utils_default.isReadableStream(new Response("").body);
        });
        var resolvers = {
            stream: supportsResponseStream && function(res) {
                return res.body;
            }
        };
        isFetchSupported && function() {
            [
                "text",
                "arrayBuffer",
                "blob",
                "formData",
                "stream"
            ].forEach(function(type2) {
                !resolvers[type2] && (resolvers[type2] = function(res, config) {
                    var method = res && res[type2];
                    if (method) {
                        return method.call(res);
                    }
                    throw new AxiosError_default("Response type '".concat(type2, "' is not supported"), AxiosError_default.ERR_NOT_SUPPORT, config);
                });
            });
        }();
        var getBodyLength = function getBodyLength(body) {
            return _async_to_generator(function() {
                var _request;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            if (body == null) {
                                return [
                                    2,
                                    0
                                ];
                            }
                            if (utils_default.isBlob(body)) {
                                return [
                                    2,
                                    body.size
                                ];
                            }
                            if (!utils_default.isSpecCompliantForm(body)) return [
                                3,
                                2
                            ];
                            _request = new Request(platform_default.origin, {
                                method: "POST",
                                body: body
                            });
                            return [
                                4,
                                _request.arrayBuffer()
                            ];
                        case 1:
                            return [
                                2,
                                _state.sent().byteLength
                            ];
                        case 2:
                            if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
                                return [
                                    2,
                                    body.byteLength
                                ];
                            }
                            if (utils_default.isURLSearchParams(body)) {
                                body = body + "";
                            }
                            if (!utils_default.isString(body)) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                encodeText(body)
                            ];
                        case 3:
                            return [
                                2,
                                _state.sent().byteLength
                            ];
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        var resolveBodyLength = function resolveBodyLength(headers, body) {
            return _async_to_generator(function() {
                var length;
                return _ts_generator(this, function(_state) {
                    length = utils_default.toFiniteNumber(headers.getContentLength());
                    return [
                        2,
                        length == null ? getBodyLength(body) : length
                    ];
                });
            })();
        };
        return function(config) {
            return _async_to_generator(function() {
                var _resolveConfig_default, url, method, data, signal, cancelToken, timeout2, onDownloadProgress, onUploadProgress, responseType, headers, _resolveConfig_default_withCredentials, withCredentials, fetchOptions, _fetch, composedSignal, request, unsubscribe, requestContentLength, _tmp, _request, contentTypeHeader, _progressEventDecorator, onProgress, flush, isCredentialsSupported, resolvedOptions, response, isStreamResponse, options, responseContentLength, _ref, onProgress1, flush1, responseData, err;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _resolveConfig_default = resolveConfig_default(config), url = _resolveConfig_default.url, method = _resolveConfig_default.method, data = _resolveConfig_default.data, signal = _resolveConfig_default.signal, cancelToken = _resolveConfig_default.cancelToken, timeout2 = _resolveConfig_default.timeout, onDownloadProgress = _resolveConfig_default.onDownloadProgress, onUploadProgress = _resolveConfig_default.onUploadProgress, responseType = _resolveConfig_default.responseType, headers = _resolveConfig_default.headers, _resolveConfig_default_withCredentials = _resolveConfig_default.withCredentials, withCredentials = _resolveConfig_default_withCredentials === void 0 ? "same-origin" : _resolveConfig_default_withCredentials, fetchOptions = _resolveConfig_default.fetchOptions;
                            _fetch = envFetch || fetch;
                            responseType = responseType ? (responseType + "").toLowerCase() : "text";
                            composedSignal = composeSignals_default([
                                signal,
                                cancelToken && cancelToken.toAbortSignal()
                            ], timeout2);
                            request = null;
                            unsubscribe = composedSignal && composedSignal.unsubscribe && function() {
                                composedSignal.unsubscribe();
                            };
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                7,
                                ,
                                8
                            ]);
                            _tmp = onUploadProgress && supportsRequestStream && method !== "get" && method !== "head";
                            if (!_tmp) return [
                                3,
                                3
                            ];
                            return [
                                4,
                                resolveBodyLength(headers, data)
                            ];
                        case 2:
                            _tmp = (requestContentLength = _state.sent()) !== 0;
                            _state.label = 3;
                        case 3:
                            if (_tmp) {
                                _request = new Request(url, {
                                    method: "POST",
                                    body: data,
                                    duplex: "half"
                                });
                                ;
                                if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
                                    headers.setContentType(contentTypeHeader);
                                }
                                if (_request.body) {
                                    _progressEventDecorator = _sliced_to_array(progressEventDecorator(requestContentLength, progressEventReducer(asyncDecorator(onUploadProgress))), 2), onProgress = _progressEventDecorator[0], flush = _progressEventDecorator[1];
                                    data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
                                }
                            }
                            if (!utils_default.isString(withCredentials)) {
                                withCredentials = withCredentials ? "include" : "omit";
                            }
                            isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
                            resolvedOptions = _object_spread_props(_object_spread({}, fetchOptions), {
                                signal: composedSignal,
                                method: method.toUpperCase(),
                                headers: headers.normalize().toJSON(),
                                body: data,
                                duplex: "half",
                                credentials: isCredentialsSupported ? withCredentials : void 0
                            });
                            request = isRequestSupported && new Request(url, resolvedOptions);
                            return [
                                4,
                                isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions)
                            ];
                        case 4:
                            response = _state.sent();
                            isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
                            if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
                                options = {};
                                [
                                    "status",
                                    "statusText",
                                    "headers"
                                ].forEach(function(prop) {
                                    options[prop] = response[prop];
                                });
                                responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
                                _ref = _sliced_to_array(onDownloadProgress && progressEventDecorator(responseContentLength, progressEventReducer(asyncDecorator(onDownloadProgress), true)) || [], 2), onProgress1 = _ref[0], flush1 = _ref[1];
                                response = new Response(trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress1, function() {
                                    flush1 && flush1();
                                    unsubscribe && unsubscribe();
                                }), options);
                            }
                            responseType = responseType || "text";
                            return [
                                4,
                                resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config)
                            ];
                        case 5:
                            responseData = _state.sent();
                            !isStreamResponse && unsubscribe && unsubscribe();
                            return [
                                4,
                                new Promise(function(resolve, reject) {
                                    settle(resolve, reject, {
                                        data: responseData,
                                        headers: AxiosHeaders_default.from(response.headers),
                                        status: response.status,
                                        statusText: response.statusText,
                                        config: config,
                                        request: request
                                    });
                                })
                            ];
                        case 6:
                            return [
                                2,
                                _state.sent()
                            ];
                        case 7:
                            err = _state.sent();
                            unsubscribe && unsubscribe();
                            if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
                                throw Object.assign(new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request, err && err.response), {
                                    cause: err.cause || err
                                });
                            }
                            throw AxiosError_default.from(err, err && err.code, config, request, err && err.response);
                        case 8:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
    };
    var seedCache = /* @__PURE__ */ new Map();
    var getFetch = function getFetch(config) {
        var env = config && config.env || {};
        var fetch2 = env.fetch, Request = env.Request, Response = env.Response;
        var seeds = [
            Request,
            Response,
            fetch2
        ];
        var len = seeds.length, i = len, seed, target, map = seedCache;
        while(i--){
            seed = seeds[i];
            target = map.get(seed);
            target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
            map = target;
        }
        return target;
    };
    var adapter = getFetch();
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/adapters/adapters.js
    var knownAdapters = {
        http: null_default,
        xhr: xhr_default,
        fetch: {
            get: getFetch
        }
    };
    utils_default.forEach(knownAdapters, function(fn, value) {
        if (fn) {
            try {
                Object.defineProperty(fn, "name", {
                    value: value
                });
            } catch (e) {}
            Object.defineProperty(fn, "adapterName", {
                value: value
            });
        }
    });
    var renderReason = function renderReason(reason) {
        return "- ".concat(reason);
    };
    var isResolvedHandle = function isResolvedHandle(adapter2) {
        return utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
    };
    var adapters_default = {
        /**
     * Resolve an adapter from a list of adapter names or functions.
     * @type {Function}
     */ getAdapter: getAdapter,
        /**
     * Exposes all known adapters
     * @type {Object<string, Function|Object>}
     */ adapters: knownAdapters
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/env/data.js
    var VERSION = "1.13.6";
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/validator.js
    var validators = {};
    [
        "object",
        "boolean",
        "number",
        "function",
        "string",
        "symbol"
    ].forEach(function(type2, i) {
        validators[type2] = function validator(thing) {
            return (typeof thing === "undefined" ? "undefined" : _type_of(thing)) === type2 || "a" + (i < 1 ? "n " : " ") + type2;
        };
    });
    var deprecatedWarnings = {};
    validators.transitional = function transitional(validator, version2, message) {
        function formatMessage(opt, desc) {
            return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
        }
        return function(value, opt, opts) {
            if (validator === false) {
                throw new AxiosError_default(formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")), AxiosError_default.ERR_DEPRECATED);
            }
            if (version2 && !deprecatedWarnings[opt]) {
                deprecatedWarnings[opt] = true;
                console.warn(formatMessage(opt, " has been deprecated since v" + version2 + " and will be removed in the near future"));
            }
            return validator ? validator(value, opt, opts) : true;
        };
    };
    validators.spelling = function spelling(correctSpelling) {
        return function(value, opt) {
            console.warn("".concat(opt, " is likely a misspelling of ").concat(correctSpelling));
            return true;
        };
    };
    var validator_default = {
        assertOptions: assertOptions,
        validators: validators
    };
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/core/Axios.js
    var validators2 = validator_default.validators;
    var Axios = /*#__PURE__*/ function() {
        function Axios(instanceConfig) {
            _class_call_check(this, Axios);
            this.defaults = instanceConfig || {};
            this.interceptors = {
                request: new InterceptorManager_default(),
                response: new InterceptorManager_default()
            };
        }
        _create_class(Axios, [
            {
                key: "request",
                value: /**
     * Dispatch a request
     *
     * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
     * @param {?Object} config
     *
     * @returns {Promise} The Promise to be fulfilled
     */ function request(configOrUrl, config) {
                    return _async_to_generator(function() {
                        var err, dummy, stack;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    _state.trys.push([
                                        0,
                                        2,
                                        ,
                                        3
                                    ]);
                                    return [
                                        4,
                                        this._request(configOrUrl, config)
                                    ];
                                case 1:
                                    return [
                                        2,
                                        _state.sent()
                                    ];
                                case 2:
                                    err = _state.sent();
                                    if (_instanceof(err, Error)) {
                                        dummy = {};
                                        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
                                        stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
                                        try {
                                            if (!err.stack) {
                                                err.stack = stack;
                                            } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
                                                err.stack += "\n" + stack;
                                            }
                                        } catch (e) {}
                                    }
                                    throw err;
                                case 3:
                                    return [
                                        2
                                    ];
                            }
                        });
                    }).call(this);
                }
            },
            {
                key: "_request",
                value: function _request(configOrUrl, config) {
                    if (typeof configOrUrl === "string") {
                        config = config || {};
                        config.url = configOrUrl;
                    } else {
                        config = configOrUrl || {};
                    }
                    config = mergeConfig(this.defaults, config);
                    var transitional2 = config.transitional, paramsSerializer = config.paramsSerializer, headers = config.headers;
                    if (transitional2 !== void 0) {
                        validator_default.assertOptions(transitional2, {
                            silentJSONParsing: validators2.transitional(validators2.boolean),
                            forcedJSONParsing: validators2.transitional(validators2.boolean),
                            clarifyTimeoutError: validators2.transitional(validators2.boolean),
                            legacyInterceptorReqResOrdering: validators2.transitional(validators2.boolean)
                        }, false);
                    }
                    if (paramsSerializer != null) {
                        if (utils_default.isFunction(paramsSerializer)) {
                            config.paramsSerializer = {
                                serialize: paramsSerializer
                            };
                        } else {
                            validator_default.assertOptions(paramsSerializer, {
                                encode: validators2.function,
                                serialize: validators2.function
                            }, true);
                        }
                    }
                    if (config.allowAbsoluteUrls !== void 0) {} else if (this.defaults.allowAbsoluteUrls !== void 0) {
                        config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
                    } else {
                        config.allowAbsoluteUrls = true;
                    }
                    validator_default.assertOptions(config, {
                        baseUrl: validators2.spelling("baseURL"),
                        withXsrfToken: validators2.spelling("withXSRFToken")
                    }, true);
                    config.method = (config.method || this.defaults.method || "get").toLowerCase();
                    var contextHeaders = headers && utils_default.merge(headers.common, headers[config.method]);
                    headers && utils_default.forEach([
                        "delete",
                        "get",
                        "head",
                        "post",
                        "put",
                        "patch",
                        "common"
                    ], function(method) {
                        delete headers[method];
                    });
                    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
                    var requestInterceptorChain = [];
                    var synchronousRequestInterceptors = true;
                    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                        if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
                            return;
                        }
                        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
                        var transitional3 = config.transitional || transitional_default;
                        var legacyInterceptorReqResOrdering = transitional3 && transitional3.legacyInterceptorReqResOrdering;
                        if (legacyInterceptorReqResOrdering) {
                            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
                        } else {
                            requestInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
                        }
                    });
                    var responseInterceptorChain = [];
                    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
                    });
                    var promise;
                    var i = 0;
                    var len;
                    if (!synchronousRequestInterceptors) {
                        var _chain, _chain1;
                        var chain = [
                            dispatchRequest.bind(this),
                            void 0
                        ];
                        (_chain = chain).unshift.apply(_chain, _to_consumable_array(requestInterceptorChain));
                        (_chain1 = chain).push.apply(_chain1, _to_consumable_array(responseInterceptorChain));
                        len = chain.length;
                        promise = Promise.resolve(config);
                        while(i < len){
                            promise = promise.then(chain[i++], chain[i++]);
                        }
                        return promise;
                    }
                    len = requestInterceptorChain.length;
                    var newConfig = config;
                    while(i < len){
                        var onFulfilled = requestInterceptorChain[i++];
                        var onRejected = requestInterceptorChain[i++];
                        try {
                            newConfig = onFulfilled(newConfig);
                        } catch (error) {
                            onRejected.call(this, error);
                            break;
                        }
                    }
                    try {
                        promise = dispatchRequest.call(this, newConfig);
                    } catch (error) {
                        return Promise.reject(error);
                    }
                    i = 0;
                    len = responseInterceptorChain.length;
                    while(i < len){
                        promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
                    }
                    return promise;
                }
            },
            {
                key: "getUri",
                value: function getUri(config) {
                    config = mergeConfig(this.defaults, config);
                    var fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
                    return buildURL(fullPath, config.params, config.paramsSerializer);
                }
            }
        ]);
        return Axios;
    }();
    utils_default.forEach([
        "delete",
        "get",
        "head",
        "options"
    ], function forEachMethodNoData(method) {
        Axios.prototype[method] = function(url, config) {
            return this.request(mergeConfig(config || {}, {
                method: method,
                url: url,
                data: (config || {}).data
            }));
        };
    });
    utils_default.forEach([
        "post",
        "put",
        "patch"
    ], function forEachMethodWithData(method) {
        function generateHTTPMethod(isForm) {
            return function httpMethod(url, data, config) {
                return this.request(mergeConfig(config || {}, {
                    method: method,
                    headers: isForm ? {
                        "Content-Type": "multipart/form-data"
                    } : {},
                    url: url,
                    data: data
                }));
            };
        }
        Axios.prototype[method] = generateHTTPMethod();
        Axios.prototype[method + "Form"] = generateHTTPMethod(true);
    });
    var Axios_default = Axios;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/cancel/CancelToken.js
    var CancelToken = /*#__PURE__*/ function() {
        function _CancelToken(executor) {
            _class_call_check(this, _CancelToken);
            if (typeof executor !== "function") {
                throw new TypeError("executor must be a function.");
            }
            var resolvePromise;
            this.promise = new Promise(function promiseExecutor(resolve) {
                resolvePromise = resolve;
            });
            var token = this;
            this.promise.then(function(cancel) {
                if (!token._listeners) return;
                var i = token._listeners.length;
                while(i-- > 0){
                    token._listeners[i](cancel);
                }
                token._listeners = null;
            });
            this.promise.then = function(onfulfilled) {
                var _resolve;
                var promise = new Promise(function(resolve) {
                    token.subscribe(resolve);
                    _resolve = resolve;
                }).then(onfulfilled);
                promise.cancel = function reject() {
                    token.unsubscribe(_resolve);
                };
                return promise;
            };
            executor(function cancel(message, config, request) {
                if (token.reason) {
                    return;
                }
                token.reason = new CanceledError_default(message, config, request);
                resolvePromise(token.reason);
            });
        }
        _create_class(_CancelToken, [
            {
                /**
     * Throws a `CanceledError` if cancellation has been requested.
     */ key: "throwIfRequested",
                value: function throwIfRequested() {
                    if (this.reason) {
                        throw this.reason;
                    }
                }
            },
            {
                /**
     * Subscribe to the cancel signal
     */ key: "subscribe",
                value: function subscribe(listener) {
                    if (this.reason) {
                        listener(this.reason);
                        return;
                    }
                    if (this._listeners) {
                        this._listeners.push(listener);
                    } else {
                        this._listeners = [
                            listener
                        ];
                    }
                }
            },
            {
                /**
     * Unsubscribe from the cancel signal
     */ key: "unsubscribe",
                value: function unsubscribe(listener) {
                    if (!this._listeners) {
                        return;
                    }
                    var index = this._listeners.indexOf(listener);
                    if (index !== -1) {
                        this._listeners.splice(index, 1);
                    }
                }
            },
            {
                key: "toAbortSignal",
                value: function toAbortSignal() {
                    var _this = this;
                    var controller = new AbortController();
                    var abort = function abort(err) {
                        controller.abort(err);
                    };
                    this.subscribe(abort);
                    controller.signal.unsubscribe = function() {
                        return _this.unsubscribe(abort);
                    };
                    return controller.signal;
                }
            }
        ], [
            {
                key: "source",
                value: /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */ function source() {
                    var cancel;
                    var token = new _CancelToken(function executor(c) {
                        cancel = c;
                    });
                    return {
                        token: token,
                        cancel: cancel
                    };
                }
            }
        ]);
        return _CancelToken;
    }();
    var CancelToken_default = CancelToken;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/helpers/HttpStatusCode.js
    var HttpStatusCode = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511,
        WebServerIsDown: 521,
        ConnectionTimedOut: 522,
        OriginIsUnreachable: 523,
        TimeoutOccurred: 524,
        SslHandshakeFailed: 525,
        InvalidSslCertificate: 526
    };
    Object.entries(HttpStatusCode).forEach(function(param) {
        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
        HttpStatusCode[value] = key;
    });
    var HttpStatusCode_default = HttpStatusCode;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/lib/axios.js
    function createInstance(defaultConfig) {
        var context = new Axios_default(defaultConfig);
        var instance = bind(Axios_default.prototype.request, context);
        utils_default.extend(instance, Axios_default.prototype, context, {
            allOwnKeys: true
        });
        utils_default.extend(instance, context, null, {
            allOwnKeys: true
        });
        instance.create = function create2(instanceConfig) {
            return createInstance(mergeConfig(defaultConfig, instanceConfig));
        };
        return instance;
    }
    var axios = createInstance(defaults_default);
    axios.Axios = Axios_default;
    axios.CanceledError = CanceledError_default;
    axios.CancelToken = CancelToken_default;
    axios.isCancel = isCancel;
    axios.VERSION = VERSION;
    axios.toFormData = toFormData_default;
    axios.AxiosError = AxiosError_default;
    axios.Cancel = axios.CanceledError;
    axios.all = function all(promises) {
        return Promise.all(promises);
    };
    axios.spread = spread;
    axios.isAxiosError = isAxiosError;
    axios.mergeConfig = mergeConfig;
    axios.AxiosHeaders = AxiosHeaders_default;
    axios.formToJSON = function(thing) {
        return formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
    };
    axios.getAdapter = adapters_default.getAdapter;
    axios.HttpStatusCode = HttpStatusCode_default;
    axios.default = axios;
    var axios_default = axios;
    // node_modules/.pnpm/axios@1.13.6/node_modules/axios/index.js
    var Axios2 = axios_default.Axios, AxiosError2 = axios_default.AxiosError, CanceledError2 = axios_default.CanceledError, isCancel2 = axios_default.isCancel, CancelToken2 = axios_default.CancelToken, VERSION2 = axios_default.VERSION, all2 = axios_default.all, Cancel = axios_default.Cancel, isAxiosError2 = axios_default.isAxiosError, spread2 = axios_default.spread, toFormData2 = axios_default.toFormData, AxiosHeaders2 = axios_default.AxiosHeaders, HttpStatusCode2 = axios_default.HttpStatusCode, formToJSON = axios_default.formToJSON, getAdapter2 = axios_default.getAdapter, mergeConfig2 = axios_default.mergeConfig;
    // node_modules/.pnpm/d3-dispatch@3.0.1/node_modules/d3-dispatch/src/dispatch.js
    var noop2 = {
        value: function value() {}
    };
    Dispatch.prototype = dispatch.prototype = {
        constructor: Dispatch,
        on: function on(typename, callback) {
            var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
            if (arguments.length < 2) {
                while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
                return;
            }
            if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
            while(++i < n){
                if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
                else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
            }
            return this;
        },
        copy: function copy() {
            var copy = {}, _ = this._;
            for(var t in _)copy[t] = _[t].slice();
            return new Dispatch(copy);
        },
        call: function call(type2, that) {
            if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
            if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
            for(t = this._[type2], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
        },
        apply: function apply(type2, that, args) {
            if (!this._.hasOwnProperty(type2)) throw new Error("unknown type: " + type2);
            for(var t = this._[type2], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
        }
    };
    var dispatch_default = dispatch;
    // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/namespaces.js
    var xhtml = "http://www.w3.org/1999/xhtml";
    var namespaces_default = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChild.js
    var find = Array.prototype.find;
    // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChildren.js
    var filter2 = Array.prototype.filter;
    EnterNode.prototype = {
        constructor: EnterNode,
        appendChild: function appendChild(child) {
            return this._parent.insertBefore(child, this._next);
        },
        insertBefore: function insertBefore(child, next) {
            return this._parent.insertBefore(child, next);
        },
        querySelector: function querySelector(selector) {
            return this._parent.querySelector(selector);
        },
        querySelectorAll: function querySelectorAll(selector) {
            return this._parent.querySelectorAll(selector);
        }
    };
    ClassList.prototype = {
        add: function add(name) {
            var i = this._names.indexOf(name);
            if (i < 0) {
                this._names.push(name);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        remove: function remove(name) {
            var i = this._names.indexOf(name);
            if (i >= 0) {
                this._names.splice(i, 1);
                this._node.setAttribute("class", this._names.join(" "));
            }
        },
        contains: function contains(name) {
            return this._names.indexOf(name) >= 0;
        }
    };
    // node_modules/.pnpm/d3-selection@3.0.0/node_modules/d3-selection/src/selection/index.js
    var root = [
        null
    ];
    Selection.prototype = selection.prototype = _define_property({
        constructor: Selection,
        select: select_default,
        selectAll: selectAll_default,
        selectChild: selectChild_default,
        selectChildren: selectChildren_default,
        filter: filter_default,
        data: data_default,
        enter: enter_default,
        exit: exit_default,
        join: join_default,
        merge: merge_default,
        selection: selection_selection,
        order: order_default,
        sort: sort_default,
        call: call_default,
        nodes: nodes_default,
        node: node_default,
        size: size_default,
        empty: empty_default,
        each: each_default,
        attr: attr_default,
        style: style_default,
        property: property_default,
        classed: classed_default,
        text: text_default,
        html: html_default,
        raise: raise_default,
        lower: lower_default,
        append: append_default,
        insert: insert_default,
        remove: remove_default,
        clone: clone_default,
        datum: datum_default,
        on: on_default,
        dispatch: dispatch_default2
    }, Symbol.iterator, iterator_default);
    var selection_default = selection;
    var darker = 0.7;
    var brighter = 1 / darker;
    var reI = "\\s*([+-]?\\d+)\\s*";
    var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
    var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
    var reHex = /^#([0-9a-f]{3,8})$/;
    var reRgbInteger = new RegExp("^rgb\\(".concat(reI, ",").concat(reI, ",").concat(reI, "\\)$"));
    var reRgbPercent = new RegExp("^rgb\\(".concat(reP, ",").concat(reP, ",").concat(reP, "\\)$"));
    var reRgbaInteger = new RegExp("^rgba\\(".concat(reI, ",").concat(reI, ",").concat(reI, ",").concat(reN, "\\)$"));
    var reRgbaPercent = new RegExp("^rgba\\(".concat(reP, ",").concat(reP, ",").concat(reP, ",").concat(reN, "\\)$"));
    var reHslPercent = new RegExp("^hsl\\(".concat(reN, ",").concat(reP, ",").concat(reP, "\\)$"));
    var reHslaPercent = new RegExp("^hsla\\(".concat(reN, ",").concat(reP, ",").concat(reP, ",").concat(reN, "\\)$"));
    var named = {
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    };
    define_default(Color, color, {
        copy: function copy(channels) {
            return Object.assign(new this.constructor(), this, channels);
        },
        displayable: function displayable() {
            return this.rgb().displayable();
        },
        hex: color_formatHex,
        // Deprecated! Use color.formatHex.
        formatHex: color_formatHex,
        formatHex8: color_formatHex8,
        formatHsl: color_formatHsl,
        formatRgb: color_formatRgb,
        toString: color_formatRgb
    });
    define_default(Rgb, rgb, extend2(Color, {
        brighter: function brighter1(k) {
            k = k == null ? brighter : Math.pow(brighter, k);
            return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        darker: function darker1(k) {
            k = k == null ? darker : Math.pow(darker, k);
            return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
        },
        rgb: function rgb() {
            return this;
        },
        clamp: function clamp() {
            return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
        },
        displayable: function displayable() {
            return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
        },
        hex: rgb_formatHex,
        // Deprecated! Use color.formatHex.
        formatHex: rgb_formatHex,
        formatHex8: rgb_formatHex8,
        formatRgb: rgb_formatRgb,
        toString: rgb_formatRgb
    }));
    define_default(Hsl, hsl, extend2(Color, {
        brighter: function brighter1(k) {
            k = k == null ? brighter : Math.pow(brighter, k);
            return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        darker: function darker1(k) {
            k = k == null ? darker : Math.pow(darker, k);
            return new Hsl(this.h, this.s, this.l * k, this.opacity);
        },
        rgb: function rgb() {
            var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
            return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
        },
        clamp: function clamp() {
            return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
        },
        displayable: function displayable() {
            return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
        },
        formatHsl: function formatHsl() {
            var a = clampa(this.opacity);
            return "".concat(a === 1 ? "hsl(" : "hsla(").concat(clamph(this.h), ", ").concat(clampt(this.s) * 100, "%, ").concat(clampt(this.l) * 100, "%").concat(a === 1 ? ")" : ", ".concat(a, ")"));
        }
    }));
    // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/constant.js
    var constant_default2 = function constant_default2(x) {
        return function() {
            return x;
        };
    };
    // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/rgb.js
    var rgb_default = function rgbGamma(y) {
        var color2 = gamma(y);
        function rgb2(start2, end) {
            var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
            return function(t) {
                start2.r = r(t);
                start2.g = g(t);
                start2.b = b(t);
                start2.opacity = opacity(t);
                return start2 + "";
            };
        }
        rgb2.gamma = rgbGamma;
        return rgb2;
    }(1);
    var rgbBasis = rgbSpline(basis_default);
    var rgbBasisClosed = rgbSpline(basisClosed_default);
    // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/string.js
    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
    var reB = new RegExp(reA.source, "g");
    // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/decompose.js
    var degrees = 180 / Math.PI;
    var identity = {
        translateX: 0,
        translateY: 0,
        rotate: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1
    };
    // node_modules/.pnpm/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/parse.js
    var svgNode;
    var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
    // node_modules/.pnpm/d3-timer@3.0.1/node_modules/d3-timer/src/timer.js
    var frame = 0;
    var timeout = 0;
    var interval = 0;
    var pokeDelay = 1e3;
    var taskHead;
    var taskTail;
    var clockLast = 0;
    var clockNow = 0;
    var clockSkew = 0;
    var clock = (typeof performance === "undefined" ? "undefined" : _type_of(performance)) === "object" && performance.now ? performance : Date;
    var setFrame = (typeof window === "undefined" ? "undefined" : _type_of(window)) === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
        setTimeout(f, 17);
    };
    Timer.prototype = timer.prototype = {
        constructor: Timer,
        restart: function restart(callback, delay, time) {
            if (typeof callback !== "function") throw new TypeError("callback is not a function");
            time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
            if (!this._next && taskTail !== this) {
                if (taskTail) taskTail._next = this;
                else taskHead = this;
                taskTail = this;
            }
            this._call = callback;
            this._time = time;
            sleep();
        },
        stop: function stop() {
            if (this._call) {
                this._call = null;
                this._time = Infinity;
                sleep();
            }
        }
    };
    // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/schedule.js
    var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
    var emptyTween = [];
    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;
    // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/selection.js
    var Selection2 = selection_default.prototype.constructor;
    // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/transition/index.js
    var id = 0;
    var selection_prototype = selection_default.prototype;
    Transition.prototype = transition.prototype = _define_property({
        constructor: Transition,
        select: select_default2,
        selectAll: selectAll_default2,
        selectChild: selection_prototype.selectChild,
        selectChildren: selection_prototype.selectChildren,
        filter: filter_default2,
        merge: merge_default2,
        selection: selection_default2,
        transition: transition_default,
        call: selection_prototype.call,
        nodes: selection_prototype.nodes,
        node: selection_prototype.node,
        size: selection_prototype.size,
        empty: selection_prototype.empty,
        each: selection_prototype.each,
        on: on_default2,
        attr: attr_default2,
        attrTween: attrTween_default,
        style: style_default2,
        styleTween: styleTween_default,
        text: text_default2,
        textTween: textTween_default,
        remove: remove_default2,
        tween: tween_default,
        delay: delay_default,
        duration: duration_default,
        ease: ease_default,
        easeVarying: easeVarying_default,
        end: end_default
    }, Symbol.iterator, selection_prototype[Symbol.iterator]);
    // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/transition.js
    var defaultTiming = {
        time: null,
        // Set on use.
        delay: 0,
        duration: 250,
        ease: cubicInOut
    };
    // node_modules/.pnpm/d3-transition@3.0.1_d3-selection@3.0.0/node_modules/d3-transition/src/selection/index.js
    selection_default.prototype.interrupt = interrupt_default2;
    selection_default.prototype.transition = transition_default2;
    // node_modules/.pnpm/d3-brush@3.0.0/node_modules/d3-brush/src/brush.js
    var abs = Math.abs, max = Math.max, min = Math.min;
    var X = {
        name: "x",
        handles: [
            "w",
            "e"
        ].map(type),
        input: function input(x, e) {
            return x == null ? null : [
                [
                    +x[0],
                    e[0][1]
                ],
                [
                    +x[1],
                    e[1][1]
                ]
            ];
        },
        output: function output(xy) {
            return xy && [
                xy[0][0],
                xy[1][0]
            ];
        }
    };
    var Y = {
        name: "y",
        handles: [
            "n",
            "s"
        ].map(type),
        input: function input(y, e) {
            return y == null ? null : [
                [
                    e[0][0],
                    +y[0]
                ],
                [
                    e[1][0],
                    +y[1]
                ]
            ];
        },
        output: function output(xy) {
            return xy && [
                xy[0][1],
                xy[1][1]
            ];
        }
    };
    var XY = {
        name: "xy",
        handles: [
            "n",
            "w",
            "e",
            "s",
            "nw",
            "ne",
            "sw",
            "se"
        ].map(type),
        input: function input(xy) {
            return xy == null ? null : number2(xy);
        },
        output: function output(xy) {
            return xy;
        }
    };
    Transform.prototype = {
        constructor: Transform,
        scale: function scale(k) {
            return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
        },
        translate: function translate(x, y) {
            return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
        },
        apply: function apply(point) {
            return [
                point[0] * this.k + this.x,
                point[1] * this.k + this.y
            ];
        },
        applyX: function applyX(x) {
            return x * this.k + this.x;
        },
        applyY: function applyY(y) {
            return y * this.k + this.y;
        },
        invert: function invert(location) {
            return [
                (location[0] - this.x) / this.k,
                (location[1] - this.y) / this.k
            ];
        },
        invertX: function invertX(x) {
            return (x - this.x) / this.k;
        },
        invertY: function invertY(y) {
            return (y - this.y) / this.k;
        },
        rescaleX: function rescaleX(x) {
            return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
        },
        rescaleY: function rescaleY(y) {
            return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
        },
        toString: function toString() {
            return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
        }
    };
    var identity2 = new Transform(1, 0, 0);
    transform.prototype = Transform.prototype;
    // data/temp/axios-d3-mixed-unminified-es5.ts
    console.log(axios_default.VERSION, void 0);
})(); //# sourceMappingURL=bundle.js.map
