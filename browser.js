// This file was generated by modules-webmake (modules for web) project.
// See: https://github.com/medikoo/modules-webmake

(function (modules) {
	'use strict';

	var resolve, getRequire, wmRequire, notFoundError, findFile
	  , extensions = {".js":[],".json":[],".css":[],".html":[]}
	  , envRequire = typeof require === 'undefined' ? null : require;

	notFoundError = function (path) {
		var error = new Error("Could not find module '" + path + "'");
		error.code = 'MODULE_NOT_FOUND';
		return error;
	};
	findFile = function (scope, name, extName) {
		var i, ext;
		if (typeof scope[name + extName] === 'function') return name + extName;
		for (i = 0; (ext = extensions[extName][i]); ++i) {
			if (typeof scope[name + ext] === 'function') return name + ext;
		}
		return null;
	};
	resolve = function (scope, tree, path, fullPath, state, id) {
		var name, dir, exports, module, fn, found, i, ext;
		path = path.split('/');
		name = path.pop();
		if ((name === '.') || (name === '..')) {
			path.push(name);
			name = '';
		}
		while ((dir = path.shift()) != null) {
			if (!dir || (dir === '.')) continue;
			if (dir === '..') {
				scope = tree.pop();
				id = id.slice(0, id.lastIndexOf('/'));
			} else {
				tree.push(scope);
				scope = scope[dir];
				id += '/' + dir;
			}
			if (!scope) throw notFoundError(fullPath);
		}
		if (name && (typeof scope[name] !== 'function')) {
			found = findFile(scope, name, '.js');
			if (!found) found = findFile(scope, name, '.json');
			if (!found) found = findFile(scope, name, '.css');
			if (!found) found = findFile(scope, name, '.html');
			if (found) {
				name = found;
			} else if ((state !== 2) && (typeof scope[name] === 'object')) {
				tree.push(scope);
				scope = scope[name];
				id += '/' + name;
				name = '';
			}
		}
		if (!name) {
			if ((state !== 1) && scope[':mainpath:']) {
				return resolve(scope, tree, scope[':mainpath:'], fullPath, 1, id);
			}
			return resolve(scope, tree, 'index', fullPath, 2, id);
		}
		fn = scope[name];
		if (!fn) throw notFoundError(fullPath);
		if (fn.hasOwnProperty('module')) return fn.module.exports;
		exports = {};
		fn.module = module = { exports: exports, id: id + '/' + name };
		fn.call(exports, exports, module, getRequire(scope, tree, id));
		return module.exports;
	};
	wmRequire = function (scope, tree, fullPath, id) {
		var name, path = fullPath, t = fullPath.charAt(0), state = 0;
		if (t === '/') {
			path = path.slice(1);
			scope = modules['/'];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = '/';
			tree = [];
		} else if (t !== '.') {
			name = path.split('/', 1)[0];
			scope = modules[name];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = name;
			tree = [];
			path = path.slice(name.length + 1);
			if (!path) {
				path = scope[':mainpath:'];
				if (path) {
					state = 1;
				} else {
					path = 'index';
					state = 2;
				}
			}
		}
		return resolve(scope, tree, path, fullPath, state, id);
	};
	getRequire = function (scope, tree, id) {
		return function (path) {
			return wmRequire(scope, [].concat(tree), path, id);
		};
	};
	return getRequire(modules, [], '');
})({
	"comfort": {
		"comfort.js": function (exports, module, require) {
			var pmv = require('./lib/pmv');
			
			module.exports.Pmv = pmv.Pmv;
		},
		"lib": {
			"pmv.js": function (exports, module, require) {
				var jerzy = require('jerzy');

				Pmv = function(m, w, ta, tr, icl, va, rh) {
					var esat = function(t) {
						if (t < 0) {
							var a = 21.874;
							var b = 7.66;
						} else {
							var a = 17.269;
							var b = 35.86;
						}
						return(611 * Math.exp(a * t / (t + 273.16 - b)) / 100);  
					};
				    var pa = rh * esat(ta);
				    icl = icl * 0.155;
				    m = m * 58.15;
				    w = w * 58.15;
					this.m = m;
					this.w = w;
					if (icl > 0.078) {
						var fcl = 1.05 + 0.645 * icl;
					} else {
						var fcl = 1.00 + 1.290 * icl;
					}

					var tclf = function(tcl) {
						var tcle = 35.7 - 0.028 * (m - w) 
							- icl * (3.96 * 1e-8 * fcl * (Math.pow(tcl + 273, 4) - Math.pow(tr + 273, 4)) 
								+ fcl * Math.max(2.38 * Math.pow(Math.abs(tcl - ta), 0.25), 12.1 * Math.sqrt(va)) * (tcl - ta));
						return(tcl - tcle);
					};
					var tcl = jerzy.Numeric.secant(tclf, -50, 50);

					var hc = Math.max(2.38 * Math.pow(Math.abs(tcl - ta), 0.25), 12.1 * Math.sqrt(va));
					var f = 0.303 * Math.exp(-0.036 * m) + 0.028;
					
					this.diffusion = - 3.05 * 1e-3 * (5733 - 6.99 * (m - w) - pa);
					this.sweat = - 0.42 * (m - w - 58.15);
					this.evaporation = this.diffusion + this.sweat;
					this.vapour = - 1.7 * 1e-5 * m * (5867 - pa);
					this.temperature = - 0.0014 * m * (34 - ta);
					this.respiration = this.temperature + this.vapour;
					this.radiation = - 3.96 * 1e-8 * fcl * (Math.pow(tcl + 273, 4) - Math.pow(tr + 273, 4));
					this.convection = - fcl * hc * (tcl - ta);
					
					this.pmv = f * (m - w + this.evaporation + this.respiration + this.radiation + this.convection);
				};

				module.exports.Pmv = Pmv;
			}
		}
	},
	"jerzy": {
		":mainpath:": "./jerzy.js",
		"jerzy.js": function (exports, module, require) {
			var vector = require('./lib/vector');
			var t = require('./lib/t');
			var misc = require('./lib/misc');
			var distributions = require('./lib/distributions');
			var regression = require('./lib/regression');
			var correlation = require('./lib/correlation');
			var numeric = require('./lib/numeric');
			
			module.exports.Vector = vector.Vector;
			module.exports.Sequence = vector.Sequence;
			module.exports.StudentT = t.StudentT;
			module.exports.Misc = misc.Misc;
			module.exports.Numeric = numeric.Numeric;
			module.exports.Normal = distributions.Normal;
			module.exports.StandardNormal = distributions.StandardNormal;
			module.exports.T = distributions.T;
			module.exports.Regression = regression.Regression;
			module.exports.Correlation = correlation.Correlation;
		},
		"lib": {
			"correlation.js": function (exports, module, require) {
				var distributions = require('./distributions');

				Correlation = function() {};

				/*
				 * Pearson correlation
				 */

				Correlation.pearson = function(x, y) {
					var result = {};
					var n = x.length();
					var mx = x.mean();
					var my = y.mean();
					result.r = x.add(-mx).multiply(y.add(-my)).sum() /
						Math.sqrt(x.add(-mx).pow(2).sum() * y.add(-my).pow(2).sum());
					result.t = result.r * Math.sqrt((n - 2) / (1 - Math.pow(result.r, 2)));
					result.df = n - 2;
					var tdistr = new distributions.T(result.df);
					result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
					return result;
				};

				module.exports.Correlation = Correlation;
			},
			"distributions.js": function (exports, module, require) {
				var vector = require('./vector');
				var misc = require('./misc');
				
				/*
				 * Normal distribution
				 */
				
				Normal = function(mean, variance) {
					this.mean = mean;
					this.variance = variance;
				};
				
				Normal.prototype._de = function(x) {
					return (1 / (Math.sqrt(this.variance) * (Math.sqrt(2 * Math.PI)))) 
						* Math.exp(-(Math.pow(x - this.mean, 2)) / (2 * this.variance))
				};
				
				Normal.prototype.dens = function(arg) {
					if (arg instanceof vector.Vector) {
						result = new vector.Vector([]);
						for (var i = 0; i < arg.length(); ++i) {
							result.push(this._de(arg.elements[i]));
						}
						return result;
					} else {
						return this._de(arg);
					}
				};
				
				/*
				 * Standard Normal distribution
				 */
				
				StandardNormal.prototype = new Normal();
				
				StandardNormal.prototype.constructor = StandardNormal;
				
				function StandardNormal() {
					this.mean = 0;
					this.variance = 1;
				};
				
				/*
				 * T distribution
				 */
				
				T = function(df) {
					this.df = df;
				};
				
				T.prototype._de = function(x) {
					return (misc.Misc.gamma((this.df + 1) / 2) / (Math.sqrt(this.df * Math.PI) * misc.Misc.gamma(this.df / 2))) 
						* Math.pow((1 + Math.pow(x, 2) / this.df), -(this.df + 1) / 2);
				};
				
				T.prototype._di = function(x) {
					if (x < 0) {
						return 0.5 * misc.Misc.rbeta(this.df / (Math.pow(x, 2) + this.df), this.df / 2, 0.5);
					} else {
						return 1 - 0.5 * misc.Misc.rbeta(this.df / (Math.pow(x, 2) + this.df), this.df / 2, 0.5);
					}
				};
				
				T.prototype.dens = function(arg) {
					if (arg instanceof vector.Vector) {
						result = new vector.Vector([]);
						for (var i = 0; i < arg.length(); ++i) {
							result.push(this._de(arg.elements[i]));
						}
						return result;
					} else {
						return this._de(arg);
					}
				};
				
				T.prototype.distr = function(arg) {
					if (arg instanceof vector.Vector) {
						result = new vector.Vector([]);
						for (var i = 0; i < arg.length(); ++i) {
							result.push(this._di(arg.elements[i]));
						}
						return result;
					} else {
						return this._di(arg);
					}
				};
				
				module.exports.Normal = Normal;
				module.exports.StandardNormal = StandardNormal;
				module.exports.T = T;
			},
			"misc.js": function (exports, module, require) {
				var numeric = require('./numeric');

				Misc = function() {};

				/*
				 * gamma function
				 */

				Misc.gamma = function (n) {
					var p = [
						0.99999999999980993, 676.5203681218851, -1259.1392167224028,
						771.32342877765313, -176.61502916214059, 12.507343278686905,
						-0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
					var g = 7;
					if (n < 0.5) {
						return Math.PI / (Math.sin(Math.PI * n) * this.gamma(1 - n));
					}
					n -= 1;
					var a = p[0];
					var t = n + g + 0.5;
					for (var i = 1; i < p.length; i++) {
						a += p[i] / (n + i);
					}
					return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * a;
				};

				/*
				 * beta function
				 */

				Misc.beta = function (x, y) {
					return this.gamma(x) * this.gamma(y) / this.gamma(x + y);
				};

				/*
				 * incomplete beta function
				 */

				Misc.ibeta = function (x, a, b) {
					return numeric.Numeric.adaptiveSimpson(function(y) {
						return Math.pow(y, a - 1) * Math.pow(1 - y, b - 1);
					}, 0, x, 0.000000000001, 10);
				};

				/*
				 * regularized incomplete beta function
				 */


				Misc.rbeta = function (x, a, b) {
					return this.ibeta(x, a, b) / this.beta(a, b);
				};

				/*
				 * factorial
				 */

				Misc.fac = function(n) {
					var result = 1;
					for (var i = 2; i <= n; i++) {
						result = result * i;
					}
					return result;
				}

				module.exports.Misc = Misc;
			},
			"numeric.js": function (exports, module, require) {
				Numeric = function() {};
				
				/*
				 * adaptive Simpson
				 */
				
				Numeric._adaptive = function(f, a, b, eps, s, fa, fb, fc, depth) {
					var c = (a + b) / 2;
					var h = b - a;
					var d = (a + c) / 2;
					var e = (c + b) / 2;
					var fd = f(d);
					var fe = f(e);
					var left = (h / 12) * (fa + 4 * fd + fc);
					var right = (h / 12) * (fc + 4* fe + fb);
					var s2 = left + right;
					if (depth <= 0 || Math.abs(s2 - s) <= 15 * eps) {
						return s2 + (s2 - s) / 15;
					} else {
						return this._adaptive(f, a, c, eps / 2, left, fa, fc, fd, depth - 1)
							+ this._adaptive(f, c, b, eps / 2, right, fc, fb, fe, depth - 1);
					}
				}
				
				Numeric.adaptiveSimpson = function(f, a, b, eps, depth) {
					var c = (a + b) / 2;
					var h = b - a;
					var fa = f(a);
					var fb = f(b);
					var fc = f(c);
					var s = (h / 6) * (fa + 4 * fc + fb);                                                                
					return this._adaptive(f, a, b, eps, s, fa, fb, fc, depth);
				}
				
				/*
				 * root finding: bisection
				 */
				
				Numeric.bisection = function(f, a, b) {
					var tolerance = 0.000000001;
					while (Math.abs(a - b) > tolerance) {
				 		if (f(a) * f((a + b) / 2) < 0) {
				 			b = (a + b) / 2;
				 		} else {
				 			a = (a + b) / 2;
				 		}
				 	}
					return (a + b) / 2;
				}
				
				/*
				 * root finding: secant
				 */
				
				Numeric.secant = function(f, a, b) {
					var tolerance = 0.000000001;
					var q = [a, b];
					while (Math.abs(q[0] - q[1]) > tolerance) {
						q.push((q[0] * f(q[1]) - q[1] * f(q[0])) / (f(q[1]) - f(q[0])));
						q.shift();
					}
					return (q[0] + q[1]) / 2;
				}
				
				module.exports.Numeric = Numeric;
			},
			"regression.js": function (exports, module, require) {
				var distributions = require('./distributions');
				
				Regression = function() {};
				
				/*
				 * simple linear regression
				 */
				
				Regression.linear = function(x, y) {
					var result = {};
					result.n = x.length();
				
					// means
				
					var mx = x.mean();
					var my = y.mean();
				
					// parameters
				
					var rx = x.add(-mx);
					var ry = y.add(-my);
				
					var ssxx = rx.pow(2).sum();
					var ssyy = ry.pow(2).sum();
					var ssxy = rx.multiply(ry).sum();
				
					result.slope = ssxy / ssxx;
					result.intercept = my - result.slope * mx;
				
					// sum of squared residuals
				
					var ssr = y.add(x.multiply(result.slope).add(result.intercept).multiply(-1)).pow(2).sum();
				
					// residual standard error
				
					result.rse = Math.sqrt(ssr / (result.n - 2))
					
					// slope
				
					var tdistr = new distributions.T(result.n - 2);
				
					result.slope_se = result.rse / Math.sqrt(ssxx);
					result.slope_t = result.slope / result.slope_se;
					result.slope_p = 2 * (1 - tdistr.distr(Math.abs(result.slope_t)));
				
					// intercept
				
					result.intercept_se = result.rse / Math.sqrt(ssxx) / Math.sqrt(result.n) * Math.sqrt(x.pow(2).sum());
					result.intercept_t = result.intercept / result.intercept_se;
					result.intercept_p = 2 * (1 - tdistr.distr(Math.abs(result.intercept_t)));
				
					// R-squared
					
					result.rs = Math.pow(ssxy, 2) / (ssxx * ssyy);
				
					return result;
				};
				
				module.exports.Regression = Regression;
			},
			"t.js": function (exports, module, require) {
				var vector = require('./vector');
				var distributions = require('./distributions');
				
				StudentT = function(){};
				
				StudentT.test = function(first, second) {
					if (second instanceof vector.Vector) {
						return this._twosample(first, second);
					} else {
						return this._onesample(first, second);
					}
				};
				
				/*
				 * two-sample Student's t-test
				 */
				
				StudentT._twosample = function(first, second) {
					var result = {};
					result.first = first;
					result.second = second;
					result.se = Math.sqrt((result.first.variance() / result.first.length()) + (result.second.variance() / result.second.length()));
					result.t = (result.first.mean() - result.second.mean()) / result.se;
					result.df = result.first.length() + result.second.length() - 2;
					var tdistr = new distributions.T(result.df);
					result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
					return result;
				};
				
				/*
				 * one-sample Student's t-test
				 */
				
				StudentT._onesample = function(sample, mu) {
					var result = {};
					result.sample = sample;
					result.mu = mu;
					result.se = Math.sqrt(result.sample.variance()) / Math.sqrt(result.sample.length());
					result.t = (result.sample.mean() - result.mu) / result.se;
					result.df = result.sample.length() - 1;
					var tdistr = new distributions.T(result.df);
					result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
					return result;
				};
				
				module.exports.StudentT = StudentT;
			},
			"vector.js": function (exports, module, require) {
				/*
				 * Vector
				 */
				
				Vector = function(elements) {
					this.elements = elements;
				};
				
				Vector.prototype.push = function(value) {
					this.elements.push(value);
				};
				
				Vector.prototype.length = function() {
					return this.elements.length;
				};
				
				Vector.prototype.sum = function() {
					var sum = 0;
					for (var i = 0, n = this.elements.length; i < n; ++i) {
						sum += this.elements[i];
					}
					return sum;
				};
				
				Vector.prototype.add = function(term) {
					var result = new Vector(this.elements.slice(0));
					if (term instanceof Vector) {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] += term.elements[i];
						}
					} else {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] += term;
						}
					}
					return result;
				};
				
				Vector.prototype.multiply = function(factor) {
					var result = new Vector(this.elements.slice(0));
					if (factor instanceof Vector) {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] = result.elements[i] * factor.elements[i];
						}
					} else {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] = result.elements[i] * factor;
						}
					}
					return result;
				};
				
				Vector.prototype.pow = function(p) {
					var result = new Vector(this.elements.slice(0));
					if (p instanceof Vector) {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] = Math.pow(result.elements[i], p.elements[i]);
						}
					} else {
						for (var i = 0, n = result.elements.length; i < n; ++i) {
							result.elements[i] = Math.pow(result.elements[i], p);
						}
					}
					return result;
				};
				
				Vector.prototype.mean = function() {
					var sum = 0;
					for (var i = 0, n = this.elements.length; i < n; ++i) {
						sum += this.elements[i];
					}
					return sum / this.elements.length;
				};
				
				Vector.prototype.sortElements = function() {
					var sorted = this.elements.slice(0);
					for (var i = 0, j, tmp; i < sorted.length; ++i) {
						tmp = sorted[i];
						for (j = i - 1; j >= 0 && sorted[j] > tmp; --j) {
							sorted[j + 1] = sorted[j];
						}
						sorted[j + 1] = tmp;
					}
					return sorted;
				};
				
				Vector.prototype.sort = function() {
					return new Vector(this.sortElements());
				};
				
				Vector.prototype.min = function() {
					return this.sortElements()[0];
				};
				
				Vector.prototype.max = function() {
					return this.sortElements().pop();
				};
				
				Vector.prototype.toString = function() {
					return "[" + this.elements.join(", ") + "]";
				};
				
				Vector.prototype.variance = function() {
					var m = this.mean();
					var sum = 0;
					for (var i = 0, n = this.elements.length; i < n; ++i) {
						sum += Math.pow(this.elements[i] - m, 2);
					}
					return sum / (this.elements.length - 1);
				};
				
				Vector.prototype.sd = function() {
					return Math.sqrt(this.variance());
				};
				
				/*
				 * Sequence
				 */
				
				Sequence.prototype = new Vector();
				
				Sequence.prototype.constructor = Sequence;
				
				function Sequence(min, max, step) {
					this.elements = [];
					for (var i = min; i <= max; i = i + step) {
						this.elements.push(i);
					}
				};
				
				module.exports.Vector = Vector;
				module.exports.Sequence = Sequence;
			}
		}
	}
})("comfort/comfort");
