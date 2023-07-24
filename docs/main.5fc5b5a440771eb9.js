"use strict";
(self.webpackChunkdogs = self.webpackChunkdogs || []).push([
	[179],
	{
		613: () => {
			function ue(e) {
				return "function" == typeof e;
			}
			function Vi(e) {
				const t = e((r) => {
					Error.call(r), (r.stack = new Error().stack);
				});
				return (t.prototype = Object.create(Error.prototype)), (t.prototype.constructor = t), t;
			}
			const gs = Vi(
				(e) =>
					function (t) {
						e(this),
							(this.message = t
								? `${t.length} errors occurred during unsubscription:\n${t
										.map((r, i) => `${i + 1}) ${r.toString()}`)
										.join("\n  ")}`
								: ""),
							(this.name = "UnsubscriptionError"),
							(this.errors = t);
					},
			);
			function Bi(e, n) {
				if (e) {
					const t = e.indexOf(n);
					0 <= t && e.splice(t, 1);
				}
			}
			class Nt {
				constructor(n) {
					(this.initialTeardown = n), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
				}
				unsubscribe() {
					let n;
					if (!this.closed) {
						this.closed = !0;
						const { _parentage: t } = this;
						if (t)
							if (((this._parentage = null), Array.isArray(t))) for (const o of t) o.remove(this);
							else t.remove(this);
						const { initialTeardown: r } = this;
						if (ue(r))
							try {
								r();
							} catch (o) {
								n = o instanceof gs ? o.errors : [o];
							}
						const { _finalizers: i } = this;
						if (i) {
							this._finalizers = null;
							for (const o of i)
								try {
									Md(o);
								} catch (s) {
									(n = n ?? []), s instanceof gs ? (n = [...n, ...s.errors]) : n.push(s);
								}
						}
						if (n) throw new gs(n);
					}
				}
				add(n) {
					var t;
					if (n && n !== this)
						if (this.closed) Md(n);
						else {
							if (n instanceof Nt) {
								if (n.closed || n._hasParent(this)) return;
								n._addParent(this);
							}
							(this._finalizers = null !== (t = this._finalizers) && void 0 !== t ? t : []).push(n);
						}
				}
				_hasParent(n) {
					const { _parentage: t } = this;
					return t === n || (Array.isArray(t) && t.includes(n));
				}
				_addParent(n) {
					const { _parentage: t } = this;
					this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
				}
				_removeParent(n) {
					const { _parentage: t } = this;
					t === n ? (this._parentage = null) : Array.isArray(t) && Bi(t, n);
				}
				remove(n) {
					const { _finalizers: t } = this;
					t && Bi(t, n), n instanceof Nt && n._removeParent(this);
				}
			}
			Nt.EMPTY = (() => {
				const e = new Nt();
				return (e.closed = !0), e;
			})();
			const bd = Nt.EMPTY;
			function Td(e) {
				return e instanceof Nt || (e && "closed" in e && ue(e.remove) && ue(e.add) && ue(e.unsubscribe));
			}
			function Md(e) {
				ue(e) ? e() : e.unsubscribe();
			}
			const nr = {
					onUnhandledError: null,
					onStoppedNotification: null,
					Promise: void 0,
					useDeprecatedSynchronousErrorHandling: !1,
					useDeprecatedNextContext: !1,
				},
				ds = {
					setTimeout(e, n, ...t) {
						const { delegate: r } = ds;
						return r?.setTimeout ? r.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
					},
					clearTimeout(e) {
						const { delegate: n } = ds;
						return (n?.clearTimeout || clearTimeout)(e);
					},
					delegate: void 0,
				};
			function Nd(e) {
				ds.setTimeout(() => {
					const { onUnhandledError: n } = nr;
					if (!n) throw e;
					n(e);
				});
			}
			function xd() {}
			const g_ = bl("C", void 0, void 0);
			function bl(e, n, t) {
				return { kind: e, value: n, error: t };
			}
			let rr = null;
			function fs(e) {
				if (nr.useDeprecatedSynchronousErrorHandling) {
					const n = !rr;
					if ((n && (rr = { errorThrown: !1, error: null }), e(), n)) {
						const { errorThrown: t, error: r } = rr;
						if (((rr = null), t)) throw r;
					}
				} else e();
			}
			class Tl extends Nt {
				constructor(n) {
					super(),
						(this.isStopped = !1),
						n ? ((this.destination = n), Td(n) && n.add(this)) : (this.destination = A_);
				}
				static create(n, t, r) {
					return new Ui(n, t, r);
				}
				next(n) {
					this.isStopped
						? Nl(
								(function f_(e) {
									return bl("N", e, void 0);
								})(n),
								this,
						  )
						: this._next(n);
				}
				error(n) {
					this.isStopped
						? Nl(
								(function d_(e) {
									return bl("E", void 0, e);
								})(n),
								this,
						  )
						: ((this.isStopped = !0), this._error(n));
				}
				complete() {
					this.isStopped ? Nl(g_, this) : ((this.isStopped = !0), this._complete());
				}
				unsubscribe() {
					this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
				}
				_next(n) {
					this.destination.next(n);
				}
				_error(n) {
					try {
						this.destination.error(n);
					} finally {
						this.unsubscribe();
					}
				}
				_complete() {
					try {
						this.destination.complete();
					} finally {
						this.unsubscribe();
					}
				}
			}
			const I_ = Function.prototype.bind;
			function Ml(e, n) {
				return I_.call(e, n);
			}
			class h_ {
				constructor(n) {
					this.partialObserver = n;
				}
				next(n) {
					const { partialObserver: t } = this;
					if (t.next)
						try {
							t.next(n);
						} catch (r) {
							Cs(r);
						}
				}
				error(n) {
					const { partialObserver: t } = this;
					if (t.error)
						try {
							t.error(n);
						} catch (r) {
							Cs(r);
						}
					else Cs(n);
				}
				complete() {
					const { partialObserver: n } = this;
					if (n.complete)
						try {
							n.complete();
						} catch (t) {
							Cs(t);
						}
				}
			}
			class Ui extends Tl {
				constructor(n, t, r) {
					let i;
					if ((super(), ue(n) || !n)) i = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
					else {
						let o;
						this && nr.useDeprecatedNextContext
							? ((o = Object.create(n)),
							  (o.unsubscribe = () => this.unsubscribe()),
							  (i = {
									next: n.next && Ml(n.next, o),
									error: n.error && Ml(n.error, o),
									complete: n.complete && Ml(n.complete, o),
							  }))
							: (i = n);
					}
					this.destination = new h_(i);
				}
			}
			function Cs(e) {
				nr.useDeprecatedSynchronousErrorHandling
					? (function C_(e) {
							nr.useDeprecatedSynchronousErrorHandling && rr && ((rr.errorThrown = !0), (rr.error = e));
					  })(e)
					: Nd(e);
			}
			function Nl(e, n) {
				const { onStoppedNotification: t } = nr;
				t && ds.setTimeout(() => t(e, n));
			}
			const A_ = {
					closed: !0,
					next: xd,
					error: function p_(e) {
						throw e;
					},
					complete: xd,
				},
				xl = ("function" == typeof Symbol && Symbol.observable) || "@@observable";
			function Vn(e) {
				return e;
			}
			function Rd(e) {
				return 0 === e.length
					? Vn
					: 1 === e.length
					? e[0]
					: function (t) {
							return e.reduce((r, i) => i(r), t);
					  };
			}
			let Me = (() => {
				class e {
					constructor(t) {
						t && (this._subscribe = t);
					}
					lift(t) {
						const r = new e();
						return (r.source = this), (r.operator = t), r;
					}
					subscribe(t, r, i) {
						const o = (function v_(e) {
							return (
								(e && e instanceof Tl) ||
								((function y_(e) {
									return e && ue(e.next) && ue(e.error) && ue(e.complete);
								})(e) &&
									Td(e))
							);
						})(t)
							? t
							: new Ui(t, r, i);
						return (
							fs(() => {
								const { operator: s, source: a } = this;
								o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
							}),
							o
						);
					}
					_trySubscribe(t) {
						try {
							return this._subscribe(t);
						} catch (r) {
							t.error(r);
						}
					}
					forEach(t, r) {
						return new (r = Pd(r))((i, o) => {
							const s = new Ui({
								next: (a) => {
									try {
										t(a);
									} catch (l) {
										o(l), s.unsubscribe();
									}
								},
								error: o,
								complete: i,
							});
							this.subscribe(s);
						});
					}
					_subscribe(t) {
						var r;
						return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(t);
					}
					[xl]() {
						return this;
					}
					pipe(...t) {
						return Rd(t)(this);
					}
					toPromise(t) {
						return new (t = Pd(t))((r, i) => {
							let o;
							this.subscribe(
								(s) => (o = s),
								(s) => i(s),
								() => r(o),
							);
						});
					}
				}
				return (e.create = (n) => new e(n)), e;
			})();
			function Pd(e) {
				var n;
				return null !== (n = e ?? nr.Promise) && void 0 !== n ? n : Promise;
			}
			const __ = Vi(
				(e) =>
					function () {
						e(this), (this.name = "ObjectUnsubscribedError"), (this.message = "object unsubscribed");
					},
			);
			let xt = (() => {
				class e extends Me {
					constructor() {
						super(),
							(this.closed = !1),
							(this.currentObservers = null),
							(this.observers = []),
							(this.isStopped = !1),
							(this.hasError = !1),
							(this.thrownError = null);
					}
					lift(t) {
						const r = new Od(this, this);
						return (r.operator = t), r;
					}
					_throwIfClosed() {
						if (this.closed) throw new __();
					}
					next(t) {
						fs(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.currentObservers || (this.currentObservers = Array.from(this.observers));
								for (const r of this.currentObservers) r.next(t);
							}
						});
					}
					error(t) {
						fs(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								(this.hasError = this.isStopped = !0), (this.thrownError = t);
								const { observers: r } = this;
								for (; r.length; ) r.shift().error(t);
							}
						});
					}
					complete() {
						fs(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.isStopped = !0;
								const { observers: t } = this;
								for (; t.length; ) t.shift().complete();
							}
						});
					}
					unsubscribe() {
						(this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
					}
					get observed() {
						var t;
						return (null === (t = this.observers) || void 0 === t ? void 0 : t.length) > 0;
					}
					_trySubscribe(t) {
						return this._throwIfClosed(), super._trySubscribe(t);
					}
					_subscribe(t) {
						return this._throwIfClosed(), this._checkFinalizedStatuses(t), this._innerSubscribe(t);
					}
					_innerSubscribe(t) {
						const { hasError: r, isStopped: i, observers: o } = this;
						return r || i
							? bd
							: ((this.currentObservers = null),
							  o.push(t),
							  new Nt(() => {
									(this.currentObservers = null), Bi(o, t);
							  }));
					}
					_checkFinalizedStatuses(t) {
						const { hasError: r, thrownError: i, isStopped: o } = this;
						r ? t.error(i) : o && t.complete();
					}
					asObservable() {
						const t = new Me();
						return (t.source = this), t;
					}
				}
				return (e.create = (n, t) => new Od(n, t)), e;
			})();
			class Od extends xt {
				constructor(n, t) {
					super(), (this.destination = n), (this.source = t);
				}
				next(n) {
					var t, r;
					null === (r = null === (t = this.destination) || void 0 === t ? void 0 : t.next) ||
						void 0 === r ||
						r.call(t, n);
				}
				error(n) {
					var t, r;
					null === (r = null === (t = this.destination) || void 0 === t ? void 0 : t.error) ||
						void 0 === r ||
						r.call(t, n);
				}
				complete() {
					var n, t;
					null === (t = null === (n = this.destination) || void 0 === n ? void 0 : n.complete) ||
						void 0 === t ||
						t.call(n);
				}
				_subscribe(n) {
					var t, r;
					return null !== (r = null === (t = this.source) || void 0 === t ? void 0 : t.subscribe(n)) &&
						void 0 !== r
						? r
						: bd;
				}
			}
			class Rt extends xt {
				constructor(n) {
					super(), (this._value = n);
				}
				get value() {
					return this.getValue();
				}
				_subscribe(n) {
					const t = super._subscribe(n);
					return !t.closed && n.next(this._value), t;
				}
				getValue() {
					const { hasError: n, thrownError: t, _value: r } = this;
					if (n) throw t;
					return this._throwIfClosed(), r;
				}
				next(n) {
					super.next((this._value = n));
				}
			}
			function Ld(e) {
				return ue(e?.lift);
			}
			function Ue(e) {
				return (n) => {
					if (Ld(n))
						return n.lift(function (t) {
							try {
								return e(t, this);
							} catch (r) {
								this.error(r);
							}
						});
					throw new TypeError("Unable to lift unknown Observable type");
				};
			}
			function je(e, n, t, r, i) {
				return new D_(e, n, t, r, i);
			}
			class D_ extends Tl {
				constructor(n, t, r, i, o, s) {
					super(n),
						(this.onFinalize = o),
						(this.shouldUnsubscribe = s),
						(this._next = t
							? function (a) {
									try {
										t(a);
									} catch (l) {
										n.error(l);
									}
							  }
							: super._next),
						(this._error = i
							? function (a) {
									try {
										i(a);
									} catch (l) {
										n.error(l);
									} finally {
										this.unsubscribe();
									}
							  }
							: super._error),
						(this._complete = r
							? function () {
									try {
										r();
									} catch (a) {
										n.error(a);
									} finally {
										this.unsubscribe();
									}
							  }
							: super._complete);
				}
				unsubscribe() {
					var n;
					if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
						const { closed: t } = this;
						super.unsubscribe(), !t && (null === (n = this.onFinalize) || void 0 === n || n.call(this));
					}
				}
			}
			function se(e, n) {
				return Ue((t, r) => {
					let i = 0;
					t.subscribe(
						je(r, (o) => {
							r.next(e.call(n, o, i++));
						}),
					);
				});
			}
			function Bn(e) {
				return this instanceof Bn ? ((this.v = e), this) : new Bn(e);
			}
			function Vd(e) {
				if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
				var t,
					n = e[Symbol.asyncIterator];
				return n
					? n.call(e)
					: ((e = (function Ll(e) {
							var n = "function" == typeof Symbol && Symbol.iterator,
								t = n && e[n],
								r = 0;
							if (t) return t.call(e);
							if (e && "number" == typeof e.length)
								return {
									next: function () {
										return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
									},
								};
							throw new TypeError(n ? "Object is not iterable." : "Symbol.iterator is not defined.");
					  })(e)),
					  (t = {}),
					  r("next"),
					  r("throw"),
					  r("return"),
					  (t[Symbol.asyncIterator] = function () {
							return this;
					  }),
					  t);
				function r(o) {
					t[o] =
						e[o] &&
						function (s) {
							return new Promise(function (a, l) {
								!(function i(o, s, a, l) {
									Promise.resolve(l).then(function (c) {
										o({ value: c, done: a });
									}, s);
								})(a, l, (s = e[o](s)).done, s.value);
							});
						};
				}
			}
			"function" == typeof SuppressedError && SuppressedError;
			const Bd = (e) => e && "number" == typeof e.length && "function" != typeof e;
			function Ud(e) {
				return ue(e?.then);
			}
			function jd(e) {
				return ue(e[xl]);
			}
			function $d(e) {
				return Symbol.asyncIterator && ue(e?.[Symbol.asyncIterator]);
			}
			function zd(e) {
				return new TypeError(
					`You provided ${
						null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
					} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
				);
			}
			const Wd = (function W_() {
				return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
			})();
			function Gd(e) {
				return ue(e?.[Wd]);
			}
			function qd(e) {
				return (function Hd(e, n, t) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var i,
						r = t.apply(e, n || []),
						o = [];
					return (
						(i = {}),
						s("next"),
						s("throw"),
						s("return"),
						(i[Symbol.asyncIterator] = function () {
							return this;
						}),
						i
					);
					function s(d) {
						r[d] &&
							(i[d] = function (f) {
								return new Promise(function (C, I) {
									o.push([d, f, C, I]) > 1 || a(d, f);
								});
							});
					}
					function a(d, f) {
						try {
							!(function l(d) {
								d.value instanceof Bn ? Promise.resolve(d.value.v).then(c, u) : g(o[0][2], d);
							})(r[d](f));
						} catch (C) {
							g(o[0][3], C);
						}
					}
					function c(d) {
						a("next", d);
					}
					function u(d) {
						a("throw", d);
					}
					function g(d, f) {
						d(f), o.shift(), o.length && a(o[0][0], o[0][1]);
					}
				})(this, arguments, function* () {
					const t = e.getReader();
					try {
						for (;;) {
							const { value: r, done: i } = yield Bn(t.read());
							if (i) return yield Bn(void 0);
							yield yield Bn(r);
						}
					} finally {
						t.releaseLock();
					}
				});
			}
			function Kd(e) {
				return ue(e?.getReader);
			}
			function Bt(e) {
				if (e instanceof Me) return e;
				if (null != e) {
					if (jd(e))
						return (function G_(e) {
							return new Me((n) => {
								const t = e[xl]();
								if (ue(t.subscribe)) return t.subscribe(n);
								throw new TypeError("Provided object does not correctly implement Symbol.observable");
							});
						})(e);
					if (Bd(e))
						return (function q_(e) {
							return new Me((n) => {
								for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
								n.complete();
							});
						})(e);
					if (Ud(e))
						return (function K_(e) {
							return new Me((n) => {
								e.then(
									(t) => {
										n.closed || (n.next(t), n.complete());
									},
									(t) => n.error(t),
								).then(null, Nd);
							});
						})(e);
					if ($d(e)) return Zd(e);
					if (Gd(e))
						return (function Z_(e) {
							return new Me((n) => {
								for (const t of e) if ((n.next(t), n.closed)) return;
								n.complete();
							});
						})(e);
					if (Kd(e))
						return (function Y_(e) {
							return Zd(qd(e));
						})(e);
				}
				throw zd(e);
			}
			function Zd(e) {
				return new Me((n) => {
					(function Q_(e, n) {
						var t, r, i, o;
						return (function Fd(e, n, t, r) {
							return new (t || (t = Promise))(function (o, s) {
								function a(u) {
									try {
										c(r.next(u));
									} catch (g) {
										s(g);
									}
								}
								function l(u) {
									try {
										c(r.throw(u));
									} catch (g) {
										s(g);
									}
								}
								function c(u) {
									u.done
										? o(u.value)
										: (function i(o) {
												return o instanceof t
													? o
													: new t(function (s) {
															s(o);
													  });
										  })(u.value).then(a, l);
								}
								c((r = r.apply(e, n || [])).next());
							});
						})(this, void 0, void 0, function* () {
							try {
								for (t = Vd(e); !(r = yield t.next()).done; ) if ((n.next(r.value), n.closed)) return;
							} catch (s) {
								i = { error: s };
							} finally {
								try {
									r && !r.done && (o = t.return) && (yield o.call(t));
								} finally {
									if (i) throw i.error;
								}
							}
							n.complete();
						});
					})(e, n).catch((t) => n.error(t));
				});
			}
			function An(e, n, t, r = 0, i = !1) {
				const o = n.schedule(function () {
					t(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
				}, r);
				if ((e.add(o), !i)) return o;
			}
			function Ge(e, n, t = 1 / 0) {
				return ue(n)
					? Ge((r, i) => se((o, s) => n(r, o, i, s))(Bt(e(r, i))), t)
					: ("number" == typeof n && (t = n),
					  Ue((r, i) =>
							(function X_(e, n, t, r, i, o, s, a) {
								const l = [];
								let c = 0,
									u = 0,
									g = !1;
								const d = () => {
										g && !l.length && !c && n.complete();
									},
									f = (I) => (c < r ? C(I) : l.push(I)),
									C = (I) => {
										o && n.next(I), c++;
										let p = !1;
										Bt(t(I, u++)).subscribe(
											je(
												n,
												(v) => {
													i?.(v), o ? f(v) : n.next(v);
												},
												() => {
													p = !0;
												},
												void 0,
												() => {
													if (p)
														try {
															for (c--; l.length && c < r; ) {
																const v = l.shift();
																s ? An(n, s, () => C(v)) : C(v);
															}
															d();
														} catch (v) {
															n.error(v);
														}
												},
											),
										);
									};
								return (
									e.subscribe(
										je(n, f, () => {
											(g = !0), d();
										}),
									),
									() => {
										a?.();
									}
								);
							})(r, i, e, t),
					  ));
			}
			function Nr(e = 1 / 0) {
				return Ge(Vn, e);
			}
			const Jt = new Me((e) => e.complete());
			function Fl(e) {
				return e[e.length - 1];
			}
			function ji(e) {
				return (function eD(e) {
					return e && ue(e.schedule);
				})(Fl(e))
					? e.pop()
					: void 0;
			}
			function Yd(e, n = 0) {
				return Ue((t, r) => {
					t.subscribe(
						je(
							r,
							(i) => An(r, e, () => r.next(i), n),
							() => An(r, e, () => r.complete(), n),
							(i) => An(r, e, () => r.error(i), n),
						),
					);
				});
			}
			function Qd(e, n = 0) {
				return Ue((t, r) => {
					r.add(e.schedule(() => t.subscribe(r), n));
				});
			}
			function Xd(e, n) {
				if (!e) throw new Error("Iterable cannot be null");
				return new Me((t) => {
					An(t, n, () => {
						const r = e[Symbol.asyncIterator]();
						An(
							t,
							n,
							() => {
								r.next().then((i) => {
									i.done ? t.complete() : t.next(i.value);
								});
							},
							0,
							!0,
						);
					});
				});
			}
			function $e(e, n) {
				return n
					? (function lD(e, n) {
							if (null != e) {
								if (jd(e))
									return (function rD(e, n) {
										return Bt(e).pipe(Qd(n), Yd(n));
									})(e, n);
								if (Bd(e))
									return (function oD(e, n) {
										return new Me((t) => {
											let r = 0;
											return n.schedule(function () {
												r === e.length
													? t.complete()
													: (t.next(e[r++]), t.closed || this.schedule());
											});
										});
									})(e, n);
								if (Ud(e))
									return (function iD(e, n) {
										return Bt(e).pipe(Qd(n), Yd(n));
									})(e, n);
								if ($d(e)) return Xd(e, n);
								if (Gd(e))
									return (function sD(e, n) {
										return new Me((t) => {
											let r;
											return (
												An(t, n, () => {
													(r = e[Wd]()),
														An(
															t,
															n,
															() => {
																let i, o;
																try {
																	({ value: i, done: o } = r.next());
																} catch (s) {
																	return void t.error(s);
																}
																o ? t.complete() : t.next(i);
															},
															0,
															!0,
														);
												}),
												() => ue(r?.return) && r.return()
											);
										});
									})(e, n);
								if (Kd(e))
									return (function aD(e, n) {
										return Xd(qd(e), n);
									})(e, n);
							}
							throw zd(e);
					  })(e, n)
					: Bt(e);
			}
			function B(...e) {
				return $e(e, ji(e));
			}
			function Jd(e = {}) {
				const {
					connector: n = () => new xt(),
					resetOnError: t = !0,
					resetOnComplete: r = !0,
					resetOnRefCountZero: i = !0,
				} = e;
				return (o) => {
					let s,
						a,
						l,
						c = 0,
						u = !1,
						g = !1;
					const d = () => {
							a?.unsubscribe(), (a = void 0);
						},
						f = () => {
							d(), (s = l = void 0), (u = g = !1);
						},
						C = () => {
							const I = s;
							f(), I?.unsubscribe();
						};
					return Ue((I, p) => {
						c++, !g && !u && d();
						const v = (l = l ?? n());
						p.add(() => {
							c--, 0 === c && !g && !u && (a = kl(C, i));
						}),
							v.subscribe(p),
							!s &&
								c > 0 &&
								((s = new Ui({
									next: (h) => v.next(h),
									error: (h) => {
										(g = !0), d(), (a = kl(f, t, h)), v.error(h);
									},
									complete: () => {
										(u = !0), d(), (a = kl(f, r)), v.complete();
									},
								})),
								Bt(I).subscribe(s));
					})(o);
				};
			}
			function kl(e, n, ...t) {
				if (!0 === n) return void e();
				if (!1 === n) return;
				const r = new Ui({
					next: () => {
						r.unsubscribe(), e();
					},
				});
				return Bt(n(...t)).subscribe(r);
			}
			function Ut(e, n) {
				return Ue((t, r) => {
					let i = null,
						o = 0,
						s = !1;
					const a = () => s && !i && r.complete();
					t.subscribe(
						je(
							r,
							(l) => {
								i?.unsubscribe();
								let c = 0;
								const u = o++;
								Bt(e(l, u)).subscribe(
									(i = je(
										r,
										(g) => r.next(n ? n(l, g, u, c++) : g),
										() => {
											(i = null), a();
										},
									)),
								);
							},
							() => {
								(s = !0), a();
							},
						),
					);
				});
			}
			function gD(e, n) {
				return e === n;
			}
			function le(e) {
				for (let n in e) if (e[n] === le) return n;
				throw Error("Could not find renamed property on target object.");
			}
			function Is(e, n) {
				for (const t in n) n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
			}
			function Fe(e) {
				if ("string" == typeof e) return e;
				if (Array.isArray(e)) return "[" + e.map(Fe).join(", ") + "]";
				if (null == e) return "" + e;
				if (e.overriddenName) return `${e.overriddenName}`;
				if (e.name) return `${e.name}`;
				const n = e.toString();
				if (null == n) return "" + n;
				const t = n.indexOf("\n");
				return -1 === t ? n : n.substring(0, t);
			}
			function Hl(e, n) {
				return null == e || "" === e ? (null === n ? "" : n) : null == n || "" === n ? e : e + " " + n;
			}
			const dD = le({ __forward_ref__: le });
			function hs(e) {
				return (
					(e.__forward_ref__ = hs),
					(e.toString = function () {
						return Fe(this());
					}),
					e
				);
			}
			function j(e) {
				return Vl(e) ? e() : e;
			}
			function Vl(e) {
				return "function" == typeof e && e.hasOwnProperty(dD) && e.__forward_ref__ === hs;
			}
			function Bl(e) {
				return e && !!e.ɵproviders;
			}
			const ef = "https://g.co/ng/security#xss";
			class w extends Error {
				constructor(n, t) {
					super(
						(function ps(e, n) {
							return `NG0${Math.abs(e)}${n ? ": " + n : ""}`;
						})(n, t),
					),
						(this.code = n);
				}
			}
			function $(e) {
				return "string" == typeof e ? e : null == e ? "" : String(e);
			}
			function As(e, n) {
				throw new w(-201, !1);
			}
			function Pt(e, n) {
				null == e &&
					(function ie(e, n, t, r) {
						throw new Error(
							`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`),
						);
					})(n, e, null, "!=");
			}
			function L(e) {
				return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
			}
			function tt(e) {
				return { providers: e.providers || [], imports: e.imports || [] };
			}
			function ms(e) {
				return tf(e, ys) || tf(e, rf);
			}
			function tf(e, n) {
				return e.hasOwnProperty(n) ? e[n] : null;
			}
			function nf(e) {
				return e && (e.hasOwnProperty(Ul) || e.hasOwnProperty(yD)) ? e[Ul] : null;
			}
			const ys = le({ ɵprov: le }),
				Ul = le({ ɵinj: le }),
				rf = le({ ngInjectableDef: le }),
				yD = le({ ngInjectorDef: le });
			var k = (() => (
				((k = k || {})[(k.Default = 0)] = "Default"),
				(k[(k.Host = 1)] = "Host"),
				(k[(k.Self = 2)] = "Self"),
				(k[(k.SkipSelf = 4)] = "SkipSelf"),
				(k[(k.Optional = 8)] = "Optional"),
				k
			))();
			let jl;
			function ut(e) {
				const n = jl;
				return (jl = e), n;
			}
			function af(e, n, t) {
				const r = ms(e);
				return r && "root" == r.providedIn
					? void 0 === r.value
						? (r.value = r.factory())
						: r.value
					: t & k.Optional
					? null
					: void 0 !== n
					? n
					: void As(Fe(e));
			}
			const ge = (() =>
					(typeof globalThis < "u" && globalThis) ||
					(typeof global < "u" && global) ||
					(typeof window < "u" && window) ||
					(typeof self < "u" &&
						typeof WorkerGlobalScope < "u" &&
						self instanceof WorkerGlobalScope &&
						self))(),
				$i = {},
				$l = "__NG_DI_FLAG__",
				vs = "ngTempTokenPath",
				_D = /\n/gm,
				lf = "__source";
			let xr;
			function Un(e) {
				const n = xr;
				return (xr = e), n;
			}
			function ED(e, n = k.Default) {
				if (void 0 === xr) throw new w(-203, !1);
				return null === xr ? af(e, void 0, n) : xr.get(e, n & k.Optional ? null : void 0, n);
			}
			function O(e, n = k.Default) {
				return (
					(function sf() {
						return jl;
					})() || ED
				)(j(e), n);
			}
			function M(e, n = k.Default) {
				return O(e, _s(n));
			}
			function _s(e) {
				return typeof e > "u" || "number" == typeof e
					? e
					: 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
			}
			function zl(e) {
				const n = [];
				for (let t = 0; t < e.length; t++) {
					const r = j(e[t]);
					if (Array.isArray(r)) {
						if (0 === r.length) throw new w(900, !1);
						let i,
							o = k.Default;
						for (let s = 0; s < r.length; s++) {
							const a = r[s],
								l = SD(a);
							"number" == typeof l ? (-1 === l ? (i = a.token) : (o |= l)) : (i = a);
						}
						n.push(O(i, o));
					} else n.push(O(r));
				}
				return n;
			}
			function zi(e, n) {
				return (e[$l] = n), (e.prototype[$l] = n), e;
			}
			function SD(e) {
				return e[$l];
			}
			function mn(e) {
				return { toString: e }.toString();
			}
			var en = (() => (((en = en || {})[(en.OnPush = 0)] = "OnPush"), (en[(en.Default = 1)] = "Default"), en))(),
				yt = (() => {
					return (
						((e = yt || (yt = {}))[(e.Emulated = 0)] = "Emulated"),
						(e[(e.None = 2)] = "None"),
						(e[(e.ShadowDom = 3)] = "ShadowDom"),
						yt
					);
					var e;
				})();
			const tn = {},
				ne = [],
				Ds = le({ ɵcmp: le }),
				Wl = le({ ɵdir: le }),
				Gl = le({ ɵpipe: le }),
				uf = le({ ɵmod: le }),
				yn = le({ ɵfac: le }),
				Wi = le({ __NG_ELEMENT_ID__: le }),
				gf = le({ __NG_ENV_ID__: le });
			function df(e, n, t) {
				let r = e.length;
				for (;;) {
					const i = e.indexOf(n, t);
					if (-1 === i) return i;
					if (0 === i || e.charCodeAt(i - 1) <= 32) {
						const o = n.length;
						if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
					}
					t = i + 1;
				}
			}
			function ql(e, n, t) {
				let r = 0;
				for (; r < t.length; ) {
					const i = t[r];
					if ("number" == typeof i) {
						if (0 !== i) break;
						r++;
						const o = t[r++],
							s = t[r++],
							a = t[r++];
						e.setAttribute(n, s, a, o);
					} else {
						const o = i,
							s = t[++r];
						Cf(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), r++;
					}
				}
				return r;
			}
			function ff(e) {
				return 3 === e || 4 === e || 6 === e;
			}
			function Cf(e) {
				return 64 === e.charCodeAt(0);
			}
			function Gi(e, n) {
				if (null !== n && 0 !== n.length)
					if (null === e || 0 === e.length) e = n.slice();
					else {
						let t = -1;
						for (let r = 0; r < n.length; r++) {
							const i = n[r];
							"number" == typeof i
								? (t = i)
								: 0 === t || If(e, t, i, null, -1 === t || 2 === t ? n[++r] : null);
						}
					}
				return e;
			}
			function If(e, n, t, r, i) {
				let o = 0,
					s = e.length;
				if (-1 === n) s = -1;
				else
					for (; o < e.length; ) {
						const a = e[o++];
						if ("number" == typeof a) {
							if (a === n) {
								s = -1;
								break;
							}
							if (a > n) {
								s = o - 1;
								break;
							}
						}
					}
				for (; o < e.length; ) {
					const a = e[o];
					if ("number" == typeof a) break;
					if (a === t) {
						if (null === r) return void (null !== i && (e[o + 1] = i));
						if (r === e[o + 1]) return void (e[o + 2] = i);
					}
					o++, null !== r && o++, null !== i && o++;
				}
				-1 !== s && (e.splice(s, 0, n), (o = s + 1)),
					e.splice(o++, 0, t),
					null !== r && e.splice(o++, 0, r),
					null !== i && e.splice(o++, 0, i);
			}
			const hf = "ng-template";
			function MD(e, n, t) {
				let r = 0,
					i = !0;
				for (; r < e.length; ) {
					let o = e[r++];
					if ("string" == typeof o && i) {
						const s = e[r++];
						if (t && "class" === o && -1 !== df(s.toLowerCase(), n, 0)) return !0;
					} else {
						if (1 === o) {
							for (; r < e.length && "string" == typeof (o = e[r++]); )
								if (o.toLowerCase() === n) return !0;
							return !1;
						}
						"number" == typeof o && (i = !1);
					}
				}
				return !1;
			}
			function pf(e) {
				return 4 === e.type && e.value !== hf;
			}
			function ND(e, n, t) {
				return n === (4 !== e.type || t ? e.value : hf);
			}
			function xD(e, n, t) {
				let r = 4;
				const i = e.attrs || [],
					o = (function OD(e) {
						for (let n = 0; n < e.length; n++) if (ff(e[n])) return n;
						return e.length;
					})(i);
				let s = !1;
				for (let a = 0; a < n.length; a++) {
					const l = n[a];
					if ("number" != typeof l) {
						if (!s)
							if (4 & r) {
								if (((r = 2 | (1 & r)), ("" !== l && !ND(e, l, t)) || ("" === l && 1 === n.length))) {
									if (jt(r)) return !1;
									s = !0;
								}
							} else {
								const c = 8 & r ? l : n[++a];
								if (8 & r && null !== e.attrs) {
									if (!MD(e.attrs, c, t)) {
										if (jt(r)) return !1;
										s = !0;
									}
									continue;
								}
								const g = RD(8 & r ? "class" : l, i, pf(e), t);
								if (-1 === g) {
									if (jt(r)) return !1;
									s = !0;
									continue;
								}
								if ("" !== c) {
									let d;
									d = g > o ? "" : i[g + 1].toLowerCase();
									const f = 8 & r ? d : null;
									if ((f && -1 !== df(f, c, 0)) || (2 & r && c !== d)) {
										if (jt(r)) return !1;
										s = !0;
									}
								}
							}
					} else {
						if (!s && !jt(r) && !jt(l)) return !1;
						if (s && jt(l)) continue;
						(s = !1), (r = l | (1 & r));
					}
				}
				return jt(r) || s;
			}
			function jt(e) {
				return 0 == (1 & e);
			}
			function RD(e, n, t, r) {
				if (null === n) return -1;
				let i = 0;
				if (r || !t) {
					let o = !1;
					for (; i < n.length; ) {
						const s = n[i];
						if (s === e) return i;
						if (3 === s || 6 === s) o = !0;
						else {
							if (1 === s || 2 === s) {
								let a = n[++i];
								for (; "string" == typeof a; ) a = n[++i];
								continue;
							}
							if (4 === s) break;
							if (0 === s) {
								i += 4;
								continue;
							}
						}
						i += o ? 1 : 2;
					}
					return -1;
				}
				return (function LD(e, n) {
					let t = e.indexOf(4);
					if (t > -1)
						for (t++; t < e.length; ) {
							const r = e[t];
							if ("number" == typeof r) return -1;
							if (r === n) return t;
							t++;
						}
					return -1;
				})(n, e);
			}
			function Af(e, n, t = !1) {
				for (let r = 0; r < n.length; r++) if (xD(e, n[r], t)) return !0;
				return !1;
			}
			function FD(e, n) {
				e: for (let t = 0; t < n.length; t++) {
					const r = n[t];
					if (e.length === r.length) {
						for (let i = 0; i < e.length; i++) if (e[i] !== r[i]) continue e;
						return !0;
					}
				}
				return !1;
			}
			function mf(e, n) {
				return e ? ":not(" + n.trim() + ")" : n;
			}
			function kD(e) {
				let n = e[0],
					t = 1,
					r = 2,
					i = "",
					o = !1;
				for (; t < e.length; ) {
					let s = e[t];
					if ("string" == typeof s)
						if (2 & r) {
							const a = e[++t];
							i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
						} else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
					else "" !== i && !jt(s) && ((n += mf(o, i)), (i = "")), (r = s), (o = o || !jt(r));
					t++;
				}
				return "" !== i && (n += mf(o, i)), n;
			}
			function ye(e) {
				return mn(() => {
					const n = vf(e),
						t = {
							...n,
							decls: e.decls,
							vars: e.vars,
							template: e.template,
							consts: e.consts || null,
							ngContentSelectors: e.ngContentSelectors,
							onPush: e.changeDetection === en.OnPush,
							directiveDefs: null,
							pipeDefs: null,
							dependencies: (n.standalone && e.dependencies) || null,
							getStandaloneInjector: null,
							signals: e.signals ?? !1,
							data: e.data || {},
							encapsulation: e.encapsulation || yt.Emulated,
							styles: e.styles || ne,
							_: null,
							schemas: e.schemas || null,
							tView: null,
							id: "",
						};
					_f(t);
					const r = e.dependencies;
					return (
						(t.directiveDefs = ws(r, !1)),
						(t.pipeDefs = ws(r, !0)),
						(t.id = (function WD(e) {
							let n = 0;
							const t = [
								e.selectors,
								e.ngContentSelectors,
								e.hostVars,
								e.hostAttrs,
								e.consts,
								e.vars,
								e.decls,
								e.encapsulation,
								e.standalone,
								e.signals,
								e.exportAs,
								JSON.stringify(e.inputs),
								JSON.stringify(e.outputs),
								Object.getOwnPropertyNames(e.type.prototype),
								!!e.contentQueries,
								!!e.viewQuery,
							].join("|");
							for (const i of t) n = (Math.imul(31, n) + i.charCodeAt(0)) << 0;
							return (n += 2147483648), "c" + n;
						})(t)),
						t
					);
				});
			}
			function UD(e) {
				return oe(e) || Ze(e);
			}
			function jD(e) {
				return null !== e;
			}
			function gt(e) {
				return mn(() => ({
					type: e.type,
					bootstrap: e.bootstrap || ne,
					declarations: e.declarations || ne,
					imports: e.imports || ne,
					exports: e.exports || ne,
					transitiveCompileScopes: null,
					schemas: e.schemas || null,
					id: e.id || null,
				}));
			}
			function yf(e, n) {
				if (null == e) return tn;
				const t = {};
				for (const r in e)
					if (e.hasOwnProperty(r)) {
						let i = e[r],
							o = i;
						Array.isArray(i) && ((o = i[1]), (i = i[0])), (t[i] = r), n && (n[i] = o);
					}
				return t;
			}
			function qe(e) {
				return mn(() => {
					const n = vf(e);
					return _f(n), n;
				});
			}
			function oe(e) {
				return e[Ds] || null;
			}
			function Ze(e) {
				return e[Wl] || null;
			}
			function ft(e) {
				return e[Gl] || null;
			}
			function vt(e, n) {
				const t = e[uf] || null;
				if (!t && !0 === n) throw new Error(`Type ${Fe(e)} does not have '\u0275mod' property.`);
				return t;
			}
			function vf(e) {
				const n = {};
				return {
					type: e.type,
					providersResolver: null,
					factory: null,
					hostBindings: e.hostBindings || null,
					hostVars: e.hostVars || 0,
					hostAttrs: e.hostAttrs || null,
					contentQueries: e.contentQueries || null,
					declaredInputs: n,
					inputTransforms: null,
					inputConfig: e.inputs || tn,
					exportAs: e.exportAs || null,
					standalone: !0 === e.standalone,
					signals: !0 === e.signals,
					selectors: e.selectors || ne,
					viewQuery: e.viewQuery || null,
					features: e.features || null,
					setInput: null,
					findHostDirectiveDefs: null,
					hostDirectives: null,
					inputs: yf(e.inputs, n),
					outputs: yf(e.outputs),
				};
			}
			function _f(e) {
				e.features?.forEach((n) => n(e));
			}
			function ws(e, n) {
				if (!e) return null;
				const t = n ? ft : UD;
				return () => ("function" == typeof e ? e() : e).map((r) => t(r)).filter(jD);
			}
			const ke = 0,
				T = 1,
				z = 2,
				pe = 3,
				$t = 4,
				qi = 5,
				Ye = 6,
				Pr = 7,
				Ee = 8,
				Or = 9,
				or = 10,
				W = 11,
				Ki = 12,
				Df = 13,
				Lr = 14,
				Se = 15,
				Zi = 16,
				Fr = 17,
				nn = 18,
				Yi = 19,
				wf = 20,
				jn = 21,
				vn = 22,
				Es = 23,
				Ss = 24,
				Y = 25,
				Kl = 1,
				Ef = 2,
				rn = 7,
				kr = 9,
				Qe = 11;
			function _t(e) {
				return Array.isArray(e) && "object" == typeof e[Kl];
			}
			function Ct(e) {
				return Array.isArray(e) && !0 === e[Kl];
			}
			function Zl(e) {
				return 0 != (4 & e.flags);
			}
			function sr(e) {
				return e.componentOffset > -1;
			}
			function Ts(e) {
				return 1 == (1 & e.flags);
			}
			function zt(e) {
				return !!e.template;
			}
			function Yl(e) {
				return 0 != (512 & e[z]);
			}
			function ar(e, n) {
				return e.hasOwnProperty(yn) ? e[yn] : null;
			}
			let QD =
					ge.WeakRef ??
					class YD {
						constructor(n) {
							this.ref = n;
						}
						deref() {
							return this.ref;
						}
					},
				JD = 0,
				on = null,
				Ms = !1;
			function ze(e) {
				const n = on;
				return (on = e), n;
			}
			class Nf {
				constructor() {
					(this.id = JD++),
						(this.ref = (function XD(e) {
							return new QD(e);
						})(this)),
						(this.producers = new Map()),
						(this.consumers = new Map()),
						(this.trackingVersion = 0),
						(this.valueVersion = 0);
				}
				consumerPollProducersForChange() {
					for (const [n, t] of this.producers) {
						const r = t.producerNode.deref();
						if (null != r && t.atTrackingVersion === this.trackingVersion) {
							if (r.producerPollStatus(t.seenValueVersion)) return !0;
						} else this.producers.delete(n), r?.consumers.delete(this.id);
					}
					return !1;
				}
				producerMayHaveChanged() {
					const n = Ms;
					Ms = !0;
					try {
						for (const [t, r] of this.consumers) {
							const i = r.consumerNode.deref();
							null != i && i.trackingVersion === r.atTrackingVersion
								? i.onConsumerDependencyMayHaveChanged()
								: (this.consumers.delete(t), i?.producers.delete(this.id));
						}
					} finally {
						Ms = n;
					}
				}
				producerAccessed() {
					if (Ms) throw new Error("");
					if (null === on) return;
					let n = on.producers.get(this.id);
					void 0 === n
						? ((n = {
								consumerNode: on.ref,
								producerNode: this.ref,
								seenValueVersion: this.valueVersion,
								atTrackingVersion: on.trackingVersion,
						  }),
						  on.producers.set(this.id, n),
						  this.consumers.set(on.id, n))
						: ((n.seenValueVersion = this.valueVersion), (n.atTrackingVersion = on.trackingVersion));
				}
				get hasProducers() {
					return this.producers.size > 0;
				}
				get producerUpdatesAllowed() {
					return !1 !== on?.consumerAllowSignalWrites;
				}
				producerPollStatus(n) {
					return this.valueVersion !== n || (this.onProducerUpdateValueVersion(), this.valueVersion !== n);
				}
			}
			let xf = null;
			const Pf = () => {};
			class rw extends Nf {
				constructor(n, t, r) {
					super(),
						(this.watch = n),
						(this.schedule = t),
						(this.dirty = !1),
						(this.cleanupFn = Pf),
						(this.registerOnCleanup = (i) => {
							this.cleanupFn = i;
						}),
						(this.consumerAllowSignalWrites = r);
				}
				notify() {
					this.dirty || this.schedule(this), (this.dirty = !0);
				}
				onConsumerDependencyMayHaveChanged() {
					this.notify();
				}
				onProducerUpdateValueVersion() {}
				run() {
					if (((this.dirty = !1), 0 !== this.trackingVersion && !this.consumerPollProducersForChange()))
						return;
					const n = ze(this);
					this.trackingVersion++;
					try {
						this.cleanupFn(), (this.cleanupFn = Pf), this.watch(this.registerOnCleanup);
					} finally {
						ze(n);
					}
				}
				cleanup() {
					this.cleanupFn();
				}
			}
			class iw {
				constructor(n, t, r) {
					(this.previousValue = n), (this.currentValue = t), (this.firstChange = r);
				}
				isFirstChange() {
					return this.firstChange;
				}
			}
			function _n() {
				return Of;
			}
			function Of(e) {
				return e.type.prototype.ngOnChanges && (e.setInput = sw), ow;
			}
			function ow() {
				const e = Ff(this),
					n = e?.current;
				if (n) {
					const t = e.previous;
					if (t === tn) e.previous = n;
					else for (let r in n) t[r] = n[r];
					(e.current = null), this.ngOnChanges(n);
				}
			}
			function sw(e, n, t, r) {
				const i = this.declaredInputs[t],
					o =
						Ff(e) ||
						(function aw(e, n) {
							return (e[Lf] = n);
						})(e, { previous: tn, current: null }),
					s = o.current || (o.current = {}),
					a = o.previous,
					l = a[i];
				(s[i] = new iw(l && l.currentValue, n, a === tn)), (e[r] = n);
			}
			_n.ngInherit = !0;
			const Lf = "__ngSimpleChanges__";
			function Ff(e) {
				return e[Lf] || null;
			}
			const sn = function (e, n, t) {};
			function fe(e) {
				for (; Array.isArray(e); ) e = e[ke];
				return e;
			}
			function Rs(e, n) {
				return fe(n[e]);
			}
			function It(e, n) {
				return fe(n[e.index]);
			}
			function Vf(e, n) {
				return e.data[n];
			}
			function Dt(e, n) {
				const t = n[e];
				return _t(t) ? t : t[ke];
			}
			function $n(e, n) {
				return null == n ? null : e[n];
			}
			function Bf(e) {
				e[Fr] = 0;
			}
			function Cw(e) {
				1024 & e[z] || ((e[z] |= 1024), jf(e, 1));
			}
			function Uf(e) {
				1024 & e[z] && ((e[z] &= -1025), jf(e, -1));
			}
			function jf(e, n) {
				let t = e[pe];
				if (null === t) return;
				t[qi] += n;
				let r = t;
				for (t = t[pe]; null !== t && ((1 === n && 1 === r[qi]) || (-1 === n && 0 === r[qi])); )
					(t[qi] += n), (r = t), (t = t[pe]);
			}
			const U = { lFrame: Jf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
			function Wf() {
				return U.bindingsEnabled;
			}
			function Vr() {
				return null !== U.skipHydrationRootTNode;
			}
			function D() {
				return U.lFrame.lView;
			}
			function J() {
				return U.lFrame.tView;
			}
			function ee(e) {
				return (U.lFrame.contextLView = e), e[Ee];
			}
			function te(e) {
				return (U.lFrame.contextLView = null), e;
			}
			function Ke() {
				let e = Gf();
				for (; null !== e && 64 === e.type; ) e = e.parent;
				return e;
			}
			function Gf() {
				return U.lFrame.currentTNode;
			}
			function an(e, n) {
				const t = U.lFrame;
				(t.currentTNode = e), (t.isParent = n);
			}
			function nc() {
				return U.lFrame.isParent;
			}
			function rc() {
				U.lFrame.isParent = !1;
			}
			function nt() {
				const e = U.lFrame;
				let n = e.bindingRootIndex;
				return -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
			}
			function Br() {
				return U.lFrame.bindingIndex++;
			}
			function wn(e) {
				const n = U.lFrame,
					t = n.bindingIndex;
				return (n.bindingIndex = n.bindingIndex + e), t;
			}
			function Sw(e, n) {
				const t = U.lFrame;
				(t.bindingIndex = t.bindingRootIndex = e), ic(n);
			}
			function ic(e) {
				U.lFrame.currentDirectiveIndex = e;
			}
			function Yf() {
				return U.lFrame.currentQueryIndex;
			}
			function sc(e) {
				U.lFrame.currentQueryIndex = e;
			}
			function Tw(e) {
				const n = e[T];
				return 2 === n.type ? n.declTNode : 1 === n.type ? e[Ye] : null;
			}
			function Qf(e, n, t) {
				if (t & k.SkipSelf) {
					let i = n,
						o = e;
					for (
						;
						!((i = i.parent),
						null !== i || t & k.Host || ((i = Tw(o)), null === i || ((o = o[Lr]), 10 & i.type)));

					);
					if (null === i) return !1;
					(n = i), (e = o);
				}
				const r = (U.lFrame = Xf());
				return (r.currentTNode = n), (r.lView = e), !0;
			}
			function ac(e) {
				const n = Xf(),
					t = e[T];
				(U.lFrame = n),
					(n.currentTNode = t.firstChild),
					(n.lView = e),
					(n.tView = t),
					(n.contextLView = e),
					(n.bindingIndex = t.bindingStartIndex),
					(n.inI18n = !1);
			}
			function Xf() {
				const e = U.lFrame,
					n = null === e ? null : e.child;
				return null === n ? Jf(e) : n;
			}
			function Jf(e) {
				const n = {
					currentTNode: null,
					isParent: !0,
					lView: null,
					tView: null,
					selectedIndex: -1,
					contextLView: null,
					elementDepthCount: 0,
					currentNamespace: null,
					currentDirectiveIndex: -1,
					bindingRootIndex: -1,
					bindingIndex: -1,
					currentQueryIndex: 0,
					parent: e,
					child: null,
					inI18n: !1,
				};
				return null !== e && (e.child = n), n;
			}
			function eC() {
				const e = U.lFrame;
				return (U.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
			}
			const tC = eC;
			function lc() {
				const e = eC();
				(e.isParent = !0),
					(e.tView = null),
					(e.selectedIndex = -1),
					(e.contextLView = null),
					(e.elementDepthCount = 0),
					(e.currentDirectiveIndex = -1),
					(e.currentNamespace = null),
					(e.bindingRootIndex = -1),
					(e.bindingIndex = -1),
					(e.currentQueryIndex = 0);
			}
			function rt() {
				return U.lFrame.selectedIndex;
			}
			function lr(e) {
				U.lFrame.selectedIndex = e;
			}
			function Ae() {
				const e = U.lFrame;
				return Vf(e.tView, e.selectedIndex);
			}
			function cr() {
				U.lFrame.currentNamespace = "svg";
			}
			let rC = !0;
			function Ps() {
				return rC;
			}
			function zn(e) {
				rC = e;
			}
			function Os(e, n) {
				for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
					const o = e.data[t].type.prototype,
						{
							ngAfterContentInit: s,
							ngAfterContentChecked: a,
							ngAfterViewInit: l,
							ngAfterViewChecked: c,
							ngOnDestroy: u,
						} = o;
					s && (e.contentHooks ??= []).push(-t, s),
						a && ((e.contentHooks ??= []).push(t, a), (e.contentCheckHooks ??= []).push(t, a)),
						l && (e.viewHooks ??= []).push(-t, l),
						c && ((e.viewHooks ??= []).push(t, c), (e.viewCheckHooks ??= []).push(t, c)),
						null != u && (e.destroyHooks ??= []).push(t, u);
				}
			}
			function Ls(e, n, t) {
				iC(e, n, 3, t);
			}
			function Fs(e, n, t, r) {
				(3 & e[z]) === t && iC(e, n, t, r);
			}
			function cc(e, n) {
				let t = e[z];
				(3 & t) === n && ((t &= 8191), (t += 1), (e[z] = t));
			}
			function iC(e, n, t, r) {
				const o = r ?? -1,
					s = n.length - 1;
				let a = 0;
				for (let l = void 0 !== r ? 65535 & e[Fr] : 0; l < s; l++)
					if ("number" == typeof n[l + 1]) {
						if (((a = n[l]), null != r && a >= r)) break;
					} else
						n[l] < 0 && (e[Fr] += 65536),
							(a < o || -1 == o) && (Lw(e, t, n, l), (e[Fr] = (4294901760 & e[Fr]) + l + 2)),
							l++;
			}
			function oC(e, n) {
				sn(4, e, n);
				const t = ze(null);
				try {
					n.call(e);
				} finally {
					ze(t), sn(5, e, n);
				}
			}
			function Lw(e, n, t, r) {
				const i = t[r] < 0,
					o = t[r + 1],
					a = e[i ? -t[r] : t[r]];
				i ? e[z] >> 13 < e[Fr] >> 16 && (3 & e[z]) === n && ((e[z] += 8192), oC(a, o)) : oC(a, o);
			}
			const Ur = -1;
			class Ji {
				constructor(n, t, r) {
					(this.factory = n), (this.resolving = !1), (this.canSeeViewProviders = t), (this.injectImpl = r);
				}
			}
			function sC(e) {
				return e !== Ur;
			}
			function ks(e) {
				return 32767 & e;
			}
			function Hs(e, n) {
				let t = (function Vw(e) {
						return e >> 16;
					})(e),
					r = n;
				for (; t > 0; ) (r = r[Lr]), t--;
				return r;
			}
			let gc = !0;
			function Vs(e) {
				const n = gc;
				return (gc = e), n;
			}
			const aC = 255,
				lC = 5;
			let Bw = 0;
			const ln = {};
			function Bs(e, n) {
				const t = cC(e, n);
				if (-1 !== t) return t;
				const r = n[T];
				r.firstCreatePass && ((e.injectorIndex = n.length), dc(r.data, e), dc(n, null), dc(r.blueprint, null));
				const i = fc(e, n),
					o = e.injectorIndex;
				if (sC(i)) {
					const s = ks(i),
						a = Hs(i, n),
						l = a[T].data;
					for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
				}
				return (n[o + 8] = i), o;
			}
			function dc(e, n) {
				e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
			}
			function cC(e, n) {
				return -1 === e.injectorIndex ||
					(e.parent && e.parent.injectorIndex === e.injectorIndex) ||
					null === n[e.injectorIndex + 8]
					? -1
					: e.injectorIndex;
			}
			function fc(e, n) {
				if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
				let t = 0,
					r = null,
					i = n;
				for (; null !== i; ) {
					if (((r = hC(i)), null === r)) return Ur;
					if ((t++, (i = i[Lr]), -1 !== r.injectorIndex)) return r.injectorIndex | (t << 16);
				}
				return Ur;
			}
			function Cc(e, n, t) {
				!(function Uw(e, n, t) {
					let r;
					"string" == typeof t ? (r = t.charCodeAt(0) || 0) : t.hasOwnProperty(Wi) && (r = t[Wi]),
						null == r && (r = t[Wi] = Bw++);
					const i = r & aC;
					n.data[e + (i >> lC)] |= 1 << i;
				})(e, n, t);
			}
			function uC(e, n, t) {
				if (t & k.Optional || void 0 !== e) return e;
				As();
			}
			function gC(e, n, t, r) {
				if ((t & k.Optional && void 0 === r && (r = null), !(t & (k.Self | k.Host)))) {
					const i = e[Or],
						o = ut(void 0);
					try {
						return i ? i.get(n, r, t & k.Optional) : af(n, r, t & k.Optional);
					} finally {
						ut(o);
					}
				}
				return uC(r, 0, t);
			}
			function dC(e, n, t, r = k.Default, i) {
				if (null !== e) {
					if (2048 & n[z] && !(r & k.Self)) {
						const s = (function Gw(e, n, t, r, i) {
							let o = e,
								s = n;
							for (; null !== o && null !== s && 2048 & s[z] && !(512 & s[z]); ) {
								const a = fC(o, s, t, r | k.Self, ln);
								if (a !== ln) return a;
								let l = o.parent;
								if (!l) {
									const c = s[wf];
									if (c) {
										const u = c.get(t, ln, r);
										if (u !== ln) return u;
									}
									(l = hC(s)), (s = s[Lr]);
								}
								o = l;
							}
							return i;
						})(e, n, t, r, ln);
						if (s !== ln) return s;
					}
					const o = fC(e, n, t, r, ln);
					if (o !== ln) return o;
				}
				return gC(n, t, r, i);
			}
			function fC(e, n, t, r, i) {
				const o = (function zw(e) {
					if ("string" == typeof e) return e.charCodeAt(0) || 0;
					const n = e.hasOwnProperty(Wi) ? e[Wi] : void 0;
					return "number" == typeof n ? (n >= 0 ? n & aC : Ww) : n;
				})(t);
				if ("function" == typeof o) {
					if (!Qf(n, e, r)) return r & k.Host ? uC(i, 0, r) : gC(n, t, r, i);
					try {
						const s = o(r);
						if (null != s || r & k.Optional) return s;
						As();
					} finally {
						tC();
					}
				} else if ("number" == typeof o) {
					let s = null,
						a = cC(e, n),
						l = Ur,
						c = r & k.Host ? n[Se][Ye] : null;
					for (
						(-1 === a || r & k.SkipSelf) &&
						((l = -1 === a ? fc(e, n) : n[a + 8]),
						l !== Ur && IC(r, !1) ? ((s = n[T]), (a = ks(l)), (n = Hs(l, n))) : (a = -1));
						-1 !== a;

					) {
						const u = n[T];
						if (CC(o, a, u.data)) {
							const g = $w(a, n, t, s, r, c);
							if (g !== ln) return g;
						}
						(l = n[a + 8]),
							l !== Ur && IC(r, n[T].data[a + 8] === c) && CC(o, a, n)
								? ((s = u), (a = ks(l)), (n = Hs(l, n)))
								: (a = -1);
					}
				}
				return i;
			}
			function $w(e, n, t, r, i, o) {
				const s = n[T],
					a = s.data[e + 8],
					u = Us(a, s, t, null == r ? sr(a) && gc : r != s && 0 != (3 & a.type), i & k.Host && o === a);
				return null !== u ? ur(n, s, u, a) : ln;
			}
			function Us(e, n, t, r, i) {
				const o = e.providerIndexes,
					s = n.data,
					a = 1048575 & o,
					l = e.directiveStart,
					u = o >> 20,
					d = i ? a + u : e.directiveEnd;
				for (let f = r ? a : a + u; f < d; f++) {
					const C = s[f];
					if ((f < l && t === C) || (f >= l && C.type === t)) return f;
				}
				if (i) {
					const f = s[l];
					if (f && zt(f) && f.type === t) return l;
				}
				return null;
			}
			function ur(e, n, t, r) {
				let i = e[t];
				const o = n.data;
				if (
					(function Fw(e) {
						return e instanceof Ji;
					})(i)
				) {
					const s = i;
					s.resolving &&
						(function fD(e, n) {
							const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
							throw new w(-200, `Circular dependency in DI detected for ${e}${t}`);
						})(
							(function ae(e) {
								return "function" == typeof e
									? e.name || e.toString()
									: "object" == typeof e && null != e && "function" == typeof e.type
									? e.type.name || e.type.toString()
									: $(e);
							})(o[t]),
						);
					const a = Vs(s.canSeeViewProviders);
					s.resolving = !0;
					const l = s.injectImpl ? ut(s.injectImpl) : null;
					Qf(e, r, k.Default);
					try {
						(i = e[t] = s.factory(void 0, o, e, r)),
							n.firstCreatePass &&
								t >= r.directiveStart &&
								(function Ow(e, n, t) {
									const { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = n.type.prototype;
									if (r) {
										const s = Of(n);
										(t.preOrderHooks ??= []).push(e, s), (t.preOrderCheckHooks ??= []).push(e, s);
									}
									i && (t.preOrderHooks ??= []).push(0 - e, i),
										o &&
											((t.preOrderHooks ??= []).push(e, o),
											(t.preOrderCheckHooks ??= []).push(e, o));
								})(t, o[t], n);
					} finally {
						null !== l && ut(l), Vs(a), (s.resolving = !1), tC();
					}
				}
				return i;
			}
			function CC(e, n, t) {
				return !!(t[n + (e >> lC)] & (1 << e));
			}
			function IC(e, n) {
				return !(e & k.Self || (e & k.Host && n));
			}
			class jr {
				constructor(n, t) {
					(this._tNode = n), (this._lView = t);
				}
				get(n, t, r) {
					return dC(this._tNode, this._lView, n, _s(r), t);
				}
			}
			function Ww() {
				return new jr(Ke(), D());
			}
			function Wn(e) {
				return mn(() => {
					const n = e.prototype.constructor,
						t = n[yn] || Ic(n),
						r = Object.prototype;
					let i = Object.getPrototypeOf(e.prototype).constructor;
					for (; i && i !== r; ) {
						const o = i[yn] || Ic(i);
						if (o && o !== t) return o;
						i = Object.getPrototypeOf(i);
					}
					return (o) => new o();
				});
			}
			function Ic(e) {
				return Vl(e)
					? () => {
							const n = Ic(j(e));
							return n && n();
					  }
					: ar(e);
			}
			function hC(e) {
				const n = e[T],
					t = n.type;
				return 2 === t ? n.declTNode : 1 === t ? e[Ye] : null;
			}
			const zr = "__parameters__";
			function Gr(e, n, t) {
				return mn(() => {
					const r = (function hc(e) {
						return function (...t) {
							if (e) {
								const r = e(...t);
								for (const i in r) this[i] = r[i];
							}
						};
					})(n);
					function i(...o) {
						if (this instanceof i) return r.apply(this, o), this;
						const s = new i(...o);
						return (a.annotation = s), a;
						function a(l, c, u) {
							const g = l.hasOwnProperty(zr) ? l[zr] : Object.defineProperty(l, zr, { value: [] })[zr];
							for (; g.length <= u; ) g.push(null);
							return (g[u] = g[u] || []).push(s), l;
						}
					}
					return (
						t && (i.prototype = Object.create(t.prototype)),
						(i.prototype.ngMetadataName = e),
						(i.annotationCls = i),
						i
					);
				});
			}
			function no(e, n) {
				e.forEach((t) => (Array.isArray(t) ? no(t, n) : n(t)));
			}
			function AC(e, n, t) {
				n >= e.length ? e.push(t) : e.splice(n, 0, t);
			}
			function $s(e, n) {
				return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
			}
			function ro(e, n) {
				const t = [];
				for (let r = 0; r < e; r++) t.push(n);
				return t;
			}
			function wt(e, n, t) {
				let r = qr(e, n);
				return (
					r >= 0
						? (e[1 | r] = t)
						: ((r = ~r),
						  (function Qw(e, n, t, r) {
								let i = e.length;
								if (i == n) e.push(t, r);
								else if (1 === i) e.push(r, e[0]), (e[0] = t);
								else {
									for (i--, e.push(e[i - 1], e[i]); i > n; ) (e[i] = e[i - 2]), i--;
									(e[n] = t), (e[n + 1] = r);
								}
						  })(e, r, n, t)),
					r
				);
			}
			function pc(e, n) {
				const t = qr(e, n);
				if (t >= 0) return e[1 | t];
			}
			function qr(e, n) {
				return (function mC(e, n, t) {
					let r = 0,
						i = e.length >> t;
					for (; i !== r; ) {
						const o = r + ((i - r) >> 1),
							s = e[o << t];
						if (n === s) return o << t;
						s > n ? (i = o) : (r = o + 1);
					}
					return ~(i << t);
				})(e, n, 1);
			}
			const Ws = zi(Gr("Optional"), 8),
				Gs = zi(Gr("SkipSelf"), 4);
			function Qs(e) {
				return 128 == (128 & e.flags);
			}
			var ht = (() => (
				((ht = ht || {})[(ht.Important = 1)] = "Important"), (ht[(ht.DashCase = 2)] = "DashCase"), ht
			))();
			const m0 = /^>|^->|<!--|-->|--!>|<!-$/g,
				y0 = /(<|>)/,
				v0 = "\u200b$1\u200b";
			const _c = new Map();
			let _0 = 0;
			const wc = "__ngContext__";
			function Xe(e, n) {
				_t(n)
					? ((e[wc] = n[Yi]),
					  (function w0(e) {
							_c.set(e[Yi], e);
					  })(n))
					: (e[wc] = n);
			}
			let Ec;
			function Sc(e, n) {
				return Ec(e, n);
			}
			function so(e) {
				const n = e[pe];
				return Ct(n) ? n[pe] : n;
			}
			function VC(e) {
				return UC(e[Ki]);
			}
			function BC(e) {
				return UC(e[$t]);
			}
			function UC(e) {
				for (; null !== e && !Ct(e); ) e = e[$t];
				return e;
			}
			function Yr(e, n, t, r, i) {
				if (null != r) {
					let o,
						s = !1;
					Ct(r) ? (o = r) : _t(r) && ((s = !0), (r = r[ke]));
					const a = fe(r);
					0 === e && null !== t
						? null == i
							? GC(n, t, a)
							: gr(n, t, a, i || null, !0)
						: 1 === e && null !== t
						? gr(n, t, a, i || null, !0)
						: 2 === e
						? (function ra(e, n, t) {
								const r = ta(e, n);
								r &&
									(function $0(e, n, t, r) {
										e.removeChild(n, t, r);
									})(e, r, n, t);
						  })(n, a, s)
						: 3 === e && n.destroyNode(a),
						null != o &&
							(function G0(e, n, t, r, i) {
								const o = t[rn];
								o !== fe(t) && Yr(n, e, r, o, i);
								for (let a = Qe; a < t.length; a++) {
									const l = t[a];
									lo(l[T], l, e, n, r, o);
								}
							})(n, e, o, t, i);
				}
			}
			function bc(e, n) {
				return e.createComment(
					(function xC(e) {
						return e.replace(m0, (n) => n.replace(y0, v0));
					})(n),
				);
			}
			function ea(e, n, t) {
				return e.createElement(n, t);
			}
			function $C(e, n) {
				const t = e[kr],
					r = t.indexOf(n);
				Uf(n), t.splice(r, 1);
			}
			function Tc(e, n) {
				if (e.length <= Qe) return;
				const t = Qe + n,
					r = e[t];
				if (r) {
					const i = r[Zi];
					null !== i && i !== e && $C(i, r), n > 0 && (e[t - 1][$t] = r[$t]);
					const o = $s(e, Qe + n);
					!(function L0(e, n) {
						lo(e, n, n[W], 2, null, null), (n[ke] = null), (n[Ye] = null);
					})(r[T], r);
					const s = o[nn];
					null !== s && s.detachView(o[T]), (r[pe] = null), (r[$t] = null), (r[z] &= -129);
				}
				return r;
			}
			function zC(e, n) {
				if (!(256 & n[z])) {
					const t = n[W];
					n[Es]?.destroy(),
						n[Ss]?.destroy(),
						t.destroyNode && lo(e, n, t, 3, null, null),
						(function H0(e) {
							let n = e[Ki];
							if (!n) return Mc(e[T], e);
							for (; n; ) {
								let t = null;
								if (_t(n)) t = n[Ki];
								else {
									const r = n[Qe];
									r && (t = r);
								}
								if (!t) {
									for (; n && !n[$t] && n !== e; ) _t(n) && Mc(n[T], n), (n = n[pe]);
									null === n && (n = e), _t(n) && Mc(n[T], n), (t = n && n[$t]);
								}
								n = t;
							}
						})(n);
				}
			}
			function Mc(e, n) {
				if (!(256 & n[z])) {
					(n[z] &= -129),
						(n[z] |= 256),
						(function j0(e, n) {
							let t;
							if (null != e && null != (t = e.destroyHooks))
								for (let r = 0; r < t.length; r += 2) {
									const i = n[t[r]];
									if (!(i instanceof Ji)) {
										const o = t[r + 1];
										if (Array.isArray(o))
											for (let s = 0; s < o.length; s += 2) {
												const a = i[o[s]],
													l = o[s + 1];
												sn(4, a, l);
												try {
													l.call(a);
												} finally {
													sn(5, a, l);
												}
											}
										else {
											sn(4, i, o);
											try {
												o.call(i);
											} finally {
												sn(5, i, o);
											}
										}
									}
								}
						})(e, n),
						(function U0(e, n) {
							const t = e.cleanup,
								r = n[Pr];
							if (null !== t)
								for (let o = 0; o < t.length - 1; o += 2)
									if ("string" == typeof t[o]) {
										const s = t[o + 3];
										s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
									} else t[o].call(r[t[o + 1]]);
							null !== r && (n[Pr] = null);
							const i = n[jn];
							if (null !== i) {
								n[jn] = null;
								for (let o = 0; o < i.length; o++) (0, i[o])();
							}
						})(e, n),
						1 === n[T].type && n[W].destroy();
					const t = n[Zi];
					if (null !== t && Ct(n[pe])) {
						t !== n[pe] && $C(t, n);
						const r = n[nn];
						null !== r && r.detachView(e);
					}
					!(function E0(e) {
						_c.delete(e[Yi]);
					})(n);
				}
			}
			function Nc(e, n, t) {
				return (function WC(e, n, t) {
					let r = n;
					for (; null !== r && 40 & r.type; ) r = (n = r).parent;
					if (null === r) return t[ke];
					{
						const { componentOffset: i } = r;
						if (i > -1) {
							const { encapsulation: o } = e.data[r.directiveStart + i];
							if (o === yt.None || o === yt.Emulated) return null;
						}
						return It(r, t);
					}
				})(e, n.parent, t);
			}
			function gr(e, n, t, r, i) {
				e.insertBefore(n, t, r, i);
			}
			function GC(e, n, t) {
				e.appendChild(n, t);
			}
			function qC(e, n, t, r, i) {
				null !== r ? gr(e, n, t, r, i) : GC(e, n, t);
			}
			function ta(e, n) {
				return e.parentNode(n);
			}
			function KC(e, n, t) {
				return YC(e, n, t);
			}
			let xc,
				Lc,
				oa,
				YC = function ZC(e, n, t) {
					return 40 & e.type ? It(e, t) : null;
				};
			function na(e, n, t, r) {
				const i = Nc(e, r, n),
					o = n[W],
					a = KC(r.parent || n[Ye], r, n);
				if (null != i)
					if (Array.isArray(t)) for (let l = 0; l < t.length; l++) qC(o, i, t[l], a, !1);
					else qC(o, i, t, a, !1);
				void 0 !== xc && xc(o, r, n, t, i);
			}
			function ao(e, n) {
				if (null !== n) {
					const t = n.type;
					if (3 & t) return It(n, e);
					if (4 & t) return Rc(-1, e[n.index]);
					if (8 & t) {
						const r = n.child;
						if (null !== r) return ao(e, r);
						{
							const i = e[n.index];
							return Ct(i) ? Rc(-1, i) : fe(i);
						}
					}
					if (32 & t) return Sc(n, e)() || fe(e[n.index]);
					{
						const r = XC(e, n);
						return null !== r ? (Array.isArray(r) ? r[0] : ao(so(e[Se]), r)) : ao(e, n.next);
					}
				}
				return null;
			}
			function XC(e, n) {
				return null !== n ? e[Se][Ye].projection[n.projection] : null;
			}
			function Rc(e, n) {
				const t = Qe + e + 1;
				if (t < n.length) {
					const r = n[t],
						i = r[T].firstChild;
					if (null !== i) return ao(r, i);
				}
				return n[rn];
			}
			function Pc(e, n, t, r, i, o, s) {
				for (; null != t; ) {
					const a = r[t.index],
						l = t.type;
					if ((s && 0 === n && (a && Xe(fe(a), r), (t.flags |= 2)), 32 != (32 & t.flags)))
						if (8 & l) Pc(e, n, t.child, r, i, o, !1), Yr(n, e, i, a, o);
						else if (32 & l) {
							const c = Sc(t, r);
							let u;
							for (; (u = c()); ) Yr(n, e, i, u, o);
							Yr(n, e, i, a, o);
						} else 16 & l ? eI(e, n, r, t, i, o) : Yr(n, e, i, a, o);
					t = s ? t.projectionNext : t.next;
				}
			}
			function lo(e, n, t, r, i, o) {
				Pc(t, r, e.firstChild, n, i, o, !1);
			}
			function eI(e, n, t, r, i, o) {
				const s = t[Se],
					l = s[Ye].projection[r.projection];
				if (Array.isArray(l)) for (let c = 0; c < l.length; c++) Yr(n, e, i, l[c], o);
				else {
					let c = l;
					const u = s[pe];
					Qs(r) && (c.flags |= 128), Pc(e, n, c, u, i, o, !0);
				}
			}
			function tI(e, n, t) {
				"" === t ? e.removeAttribute(n, "class") : e.setAttribute(n, "class", t);
			}
			function nI(e, n, t) {
				const { mergedAttrs: r, classes: i, styles: o } = t;
				null !== r && ql(e, n, r),
					null !== i && tI(e, n, i),
					null !== o &&
						(function K0(e, n, t) {
							e.setAttribute(n, "style", t);
						})(e, n, o);
			}
			function oI(e) {
				return (
					(function Fc() {
						if (void 0 === oa && ((oa = null), ge.trustedTypes))
							try {
								oa = ge.trustedTypes.createPolicy("angular#unsafe-bypass", {
									createHTML: (e) => e,
									createScript: (e) => e,
									createScriptURL: (e) => e,
								});
							} catch {}
						return oa;
					})()?.createScriptURL(e) || e
				);
			}
			class sI {
				constructor(n) {
					this.changingThisBreaksApplicationSecurity = n;
				}
				toString() {
					return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ef})`;
				}
			}
			function Gn(e) {
				return e instanceof sI ? e.changingThisBreaksApplicationSecurity : e;
			}
			function uo(e, n) {
				const t = (function iE(e) {
					return (e instanceof sI && e.getTypeName()) || null;
				})(e);
				if (null != t && t !== n) {
					if ("ResourceURL" === t && "URL" === n) return !0;
					throw new Error(`Required a safe ${n}, got a ${t} (see ${ef})`);
				}
				return t === n;
			}
			const lE = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
			var Ne = (() => (
				((Ne = Ne || {})[(Ne.NONE = 0)] = "NONE"),
				(Ne[(Ne.HTML = 1)] = "HTML"),
				(Ne[(Ne.STYLE = 2)] = "STYLE"),
				(Ne[(Ne.SCRIPT = 3)] = "SCRIPT"),
				(Ne[(Ne.URL = 4)] = "URL"),
				(Ne[(Ne.RESOURCE_URL = 5)] = "RESOURCE_URL"),
				Ne
			))();
			function aa(e) {
				const n = fo();
				return n
					? n.sanitize(Ne.URL, e) || ""
					: uo(e, "URL")
					? Gn(e)
					: (function kc(e) {
							return (e = String(e)).match(lE) ? e : "unsafe:" + e;
					  })($(e));
			}
			function fI(e) {
				const n = fo();
				if (n) return oI(n.sanitize(Ne.RESOURCE_URL, e) || "");
				if (uo(e, "ResourceURL")) return oI(Gn(e));
				throw new w(904, !1);
			}
			function fo() {
				const e = D();
				return e && e[or].sanitizer;
			}
			class R {
				constructor(n, t) {
					(this._desc = n),
						(this.ngMetadataName = "InjectionToken"),
						(this.ɵprov = void 0),
						"number" == typeof t
							? (this.__NG_ELEMENT_ID__ = t)
							: void 0 !== t &&
							  (this.ɵprov = L({ token: this, providedIn: t.providedIn || "root", factory: t.factory }));
				}
				get multi() {
					return this;
				}
				toString() {
					return `InjectionToken ${this._desc}`;
				}
			}
			const Co = new R("ENVIRONMENT_INITIALIZER"),
				II = new R("INJECTOR", -1),
				hI = new R("INJECTOR_DEF_TYPES");
			class pI {
				get(n, t = $i) {
					if (t === $i) {
						const r = new Error(`NullInjectorError: No provider for ${Fe(n)}!`);
						throw ((r.name = "NullInjectorError"), r);
					}
					return t;
				}
			}
			function vE(...e) {
				return { ɵproviders: AI(0, e), ɵfromNgModule: !0 };
			}
			function AI(e, ...n) {
				const t = [],
					r = new Set();
				let i;
				return (
					no(n, (o) => {
						const s = o;
						jc(s, t, [], r) && ((i ||= []), i.push(s));
					}),
					void 0 !== i && mI(i, t),
					t
				);
			}
			function mI(e, n) {
				for (let t = 0; t < e.length; t++) {
					const { providers: i } = e[t];
					$c(i, (o) => {
						n.push(o);
					});
				}
			}
			function jc(e, n, t, r) {
				if (!(e = j(e))) return !1;
				let i = null,
					o = nf(e);
				const s = !o && oe(e);
				if (o || s) {
					if (s && !s.standalone) return !1;
					i = e;
				} else {
					const l = e.ngModule;
					if (((o = nf(l)), !o)) return !1;
					i = l;
				}
				const a = r.has(i);
				if (s) {
					if (a) return !1;
					if ((r.add(i), s.dependencies)) {
						const l = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
						for (const c of l) jc(c, n, t, r);
					}
				} else {
					if (!o) return !1;
					{
						if (null != o.imports && !a) {
							let c;
							r.add(i);
							try {
								no(o.imports, (u) => {
									jc(u, n, t, r) && ((c ||= []), c.push(u));
								});
							} finally {
							}
							void 0 !== c && mI(c, n);
						}
						if (!a) {
							const c = ar(i) || (() => new i());
							n.push(
								{ provide: i, useFactory: c, deps: ne },
								{ provide: hI, useValue: i, multi: !0 },
								{ provide: Co, useValue: () => O(i), multi: !0 },
							);
						}
						const l = o.providers;
						null == l ||
							a ||
							$c(l, (u) => {
								n.push(u);
							});
					}
				}
				return i !== e && void 0 !== e.providers;
			}
			function $c(e, n) {
				for (let t of e) Bl(t) && (t = t.ɵproviders), Array.isArray(t) ? $c(t, n) : n(t);
			}
			const _E = le({ provide: String, useValue: le });
			function zc(e) {
				return null !== e && "object" == typeof e && _E in e;
			}
			function dr(e) {
				return "function" == typeof e;
			}
			const Wc = new R("Set Injector scope."),
				la = {},
				wE = {};
			let Gc;
			function ca() {
				return void 0 === Gc && (Gc = new pI()), Gc;
			}
			class cn {}
			class qc extends cn {
				get destroyed() {
					return this._destroyed;
				}
				constructor(n, t, r, i) {
					super(),
						(this.parent = t),
						(this.source = r),
						(this.scopes = i),
						(this.records = new Map()),
						(this._ngOnDestroyHooks = new Set()),
						(this._onDestroyHooks = []),
						(this._destroyed = !1),
						Zc(n, (s) => this.processProvider(s)),
						this.records.set(II, Xr(void 0, this)),
						i.has("environment") && this.records.set(cn, Xr(void 0, this));
					const o = this.records.get(Wc);
					null != o && "string" == typeof o.value && this.scopes.add(o.value),
						(this.injectorDefTypes = new Set(this.get(hI.multi, ne, k.Self)));
				}
				destroy() {
					this.assertNotDestroyed(), (this._destroyed = !0);
					try {
						for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
						const n = this._onDestroyHooks;
						this._onDestroyHooks = [];
						for (const t of n) t();
					} finally {
						this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear();
					}
				}
				onDestroy(n) {
					return this.assertNotDestroyed(), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n);
				}
				runInContext(n) {
					this.assertNotDestroyed();
					const t = Un(this),
						r = ut(void 0);
					try {
						return n();
					} finally {
						Un(t), ut(r);
					}
				}
				get(n, t = $i, r = k.Default) {
					if ((this.assertNotDestroyed(), n.hasOwnProperty(gf))) return n[gf](this);
					r = _s(r);
					const i = Un(this),
						o = ut(void 0);
					try {
						if (!(r & k.SkipSelf)) {
							let a = this.records.get(n);
							if (void 0 === a) {
								const l =
									(function ME(e) {
										return "function" == typeof e || ("object" == typeof e && e instanceof R);
									})(n) && ms(n);
								(a = l && this.injectableDefInScope(l) ? Xr(Kc(n), la) : null), this.records.set(n, a);
							}
							if (null != a) return this.hydrate(n, a);
						}
						return (r & k.Self ? ca() : this.parent).get(n, (t = r & k.Optional && t === $i ? null : t));
					} catch (s) {
						if ("NullInjectorError" === s.name) {
							if (((s[vs] = s[vs] || []).unshift(Fe(n)), i)) throw s;
							return (function bD(e, n, t, r) {
								const i = e[vs];
								throw (
									(n[lf] && i.unshift(n[lf]),
									(e.message = (function TD(e, n, t, r = null) {
										e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
										let i = Fe(n);
										if (Array.isArray(n)) i = n.map(Fe).join(" -> ");
										else if ("object" == typeof n) {
											let o = [];
											for (let s in n)
												if (n.hasOwnProperty(s)) {
													let a = n[s];
													o.push(
														s + ":" + ("string" == typeof a ? JSON.stringify(a) : Fe(a)),
													);
												}
											i = `{${o.join(", ")}}`;
										}
										return `${t}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(_D, "\n  ")}`;
									})("\n" + e.message, i, t, r)),
									(e.ngTokenPath = i),
									(e[vs] = null),
									e)
								);
							})(s, n, "R3InjectorError", this.source);
						}
						throw s;
					} finally {
						ut(o), Un(i);
					}
				}
				resolveInjectorInitializers() {
					const n = Un(this),
						t = ut(void 0);
					try {
						const r = this.get(Co.multi, ne, k.Self);
						for (const i of r) i();
					} finally {
						Un(n), ut(t);
					}
				}
				toString() {
					const n = [],
						t = this.records;
					for (const r of t.keys()) n.push(Fe(r));
					return `R3Injector[${n.join(", ")}]`;
				}
				assertNotDestroyed() {
					if (this._destroyed) throw new w(205, !1);
				}
				processProvider(n) {
					let t = dr((n = j(n))) ? n : j(n && n.provide);
					const r = (function SE(e) {
						return zc(e)
							? Xr(void 0, e.useValue)
							: Xr(
									(function _I(e, n, t) {
										let r;
										if (dr(e)) {
											const i = j(e);
											return ar(i) || Kc(i);
										}
										if (zc(e)) r = () => j(e.useValue);
										else if (
											(function vI(e) {
												return !(!e || !e.useFactory);
											})(e)
										)
											r = () => e.useFactory(...zl(e.deps || []));
										else if (
											(function yI(e) {
												return !(!e || !e.useExisting);
											})(e)
										)
											r = () => O(j(e.useExisting));
										else {
											const i = j(e && (e.useClass || e.provide));
											if (
												!(function bE(e) {
													return !!e.deps;
												})(e)
											)
												return ar(i) || Kc(i);
											r = () => new i(...zl(e.deps));
										}
										return r;
									})(e),
									la,
							  );
					})(n);
					if (dr(n) || !0 !== n.multi) this.records.get(t);
					else {
						let i = this.records.get(t);
						i || ((i = Xr(void 0, la, !0)), (i.factory = () => zl(i.multi)), this.records.set(t, i)),
							(t = n),
							i.multi.push(n);
					}
					this.records.set(t, r);
				}
				hydrate(n, t) {
					return (
						t.value === la && ((t.value = wE), (t.value = t.factory())),
						"object" == typeof t.value &&
							t.value &&
							(function TE(e) {
								return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy;
							})(t.value) &&
							this._ngOnDestroyHooks.add(t.value),
						t.value
					);
				}
				injectableDefInScope(n) {
					if (!n.providedIn) return !1;
					const t = j(n.providedIn);
					return "string" == typeof t ? "any" === t || this.scopes.has(t) : this.injectorDefTypes.has(t);
				}
				removeOnDestroy(n) {
					const t = this._onDestroyHooks.indexOf(n);
					-1 !== t && this._onDestroyHooks.splice(t, 1);
				}
			}
			function Kc(e) {
				const n = ms(e),
					t = null !== n ? n.factory : ar(e);
				if (null !== t) return t;
				if (e instanceof R) throw new w(204, !1);
				if (e instanceof Function)
					return (function EE(e) {
						const n = e.length;
						if (n > 0) throw (ro(n, "?"), new w(204, !1));
						const t = (function mD(e) {
							return (e && (e[ys] || e[rf])) || null;
						})(e);
						return null !== t ? () => t.factory(e) : () => new e();
					})(e);
				throw new w(204, !1);
			}
			function Xr(e, n, t = !1) {
				return { factory: e, value: n, multi: t ? [] : void 0 };
			}
			function Zc(e, n) {
				for (const t of e) Array.isArray(t) ? Zc(t, n) : t && Bl(t) ? Zc(t.ɵproviders, n) : n(t);
			}
			const ua = new R("AppId", { providedIn: "root", factory: () => NE }),
				NE = "ng",
				DI = new R("Platform Initializer"),
				Sn = new R("Platform ID", { providedIn: "platform", factory: () => "unknown" }),
				wI = new R("CSP nonce", {
					providedIn: "root",
					factory: () =>
						(function co() {
							if (void 0 !== Lc) return Lc;
							if (typeof document < "u") return document;
							throw new w(210, !1);
						})()
							.body?.querySelector("[ngCspNonce]")
							?.getAttribute("ngCspNonce") || null,
				});
			let SI = (e, n) => null;
			function bI(e, n) {
				return SI(e, n);
			}
			class VE {}
			class NI {}
			class UE {
				resolveComponentFactory(n) {
					throw (function BE(e) {
						const n = Error(`No component factory found for ${Fe(e)}.`);
						return (n.ngComponent = e), n;
					})(n);
				}
			}
			let Ia = (() => {
				class e {}
				return (e.NULL = new UE()), e;
			})();
			function jE() {
				return Jr(Ke(), D());
			}
			function Jr(e, n) {
				return new Wt(It(e, n));
			}
			let Wt = (() => {
				class e {
					constructor(t) {
						this.nativeElement = t;
					}
				}
				return (e.__NG_ELEMENT_ID__ = jE), e;
			})();
			function $E(e) {
				return e instanceof Wt ? e.nativeElement : e;
			}
			class RI {}
			let ei = (() => {
					class e {
						constructor() {
							this.destroyNode = null;
						}
					}
					return (
						(e.__NG_ELEMENT_ID__ = () =>
							(function zE() {
								const e = D(),
									t = Dt(Ke().index, e);
								return (_t(t) ? t : e)[W];
							})()),
						e
					);
				})(),
				WE = (() => {
					class e {}
					return (e.ɵprov = L({ token: e, providedIn: "root", factory: () => null })), e;
				})();
			class ha {
				constructor(n) {
					(this.full = n),
						(this.major = n.split(".")[0]),
						(this.minor = n.split(".")[1]),
						(this.patch = n.split(".").slice(2).join("."));
				}
			}
			const GE = new ha("16.1.5"),
				su = {};
			function Ao(e) {
				for (; e; ) {
					e[z] |= 64;
					const n = so(e);
					if (Yl(e) && !n) return e;
					e = n;
				}
				return null;
			}
			function au(e) {
				return e.ngOriginalError;
			}
			class fr {
				constructor() {
					this._console = console;
				}
				handleError(n) {
					const t = this._findOriginalError(n);
					this._console.error("ERROR", n), t && this._console.error("ORIGINAL ERROR", t);
				}
				_findOriginalError(n) {
					let t = n && au(n);
					for (; t && au(t); ) t = au(t);
					return t || null;
				}
			}
			const LI = new R("", { providedIn: "root", factory: () => !1 });
			function bn(e) {
				return e instanceof Function ? e() : e;
			}
			class BI extends Nf {
				constructor() {
					super(...arguments), (this.consumerAllowSignalWrites = !1), (this._lView = null);
				}
				set lView(n) {
					this._lView = n;
				}
				onConsumerDependencyMayHaveChanged() {
					Ao(this._lView);
				}
				onProducerUpdateValueVersion() {}
				get hasReadASignal() {
					return this.hasProducers;
				}
				runInContext(n, t, r) {
					const i = ze(this);
					this.trackingVersion++;
					try {
						n(t, r);
					} finally {
						ze(i);
					}
				}
				destroy() {
					this.trackingVersion++;
				}
			}
			let Aa = null;
			function UI() {
				return (Aa ??= new BI()), Aa;
			}
			function jI(e, n) {
				return e[n] ?? UI();
			}
			function $I(e, n) {
				const t = UI();
				t.hasReadASignal && ((e[n] = Aa), (t.lView = e), (Aa = new BI()));
			}
			const G = {};
			function m(e) {
				zI(J(), D(), rt() + e, !1);
			}
			function zI(e, n, t, r) {
				if (!r)
					if (3 == (3 & n[z])) {
						const o = e.preOrderCheckHooks;
						null !== o && Ls(n, o, t);
					} else {
						const o = e.preOrderHooks;
						null !== o && Fs(n, o, 0, t);
					}
				lr(t);
			}
			function KI(e, n = null, t = null, r) {
				const i = ZI(e, n, t, r);
				return i.resolveInjectorInitializers(), i;
			}
			function ZI(e, n = null, t = null, r, i = new Set()) {
				const o = [t || ne, vE(e)];
				return (r = r || ("object" == typeof e ? void 0 : Fe(e))), new qc(o, n || ca(), r || null, i);
			}
			let Tn = (() => {
				class e {
					static create(t, r) {
						if (Array.isArray(t)) return KI({ name: "" }, r, t, "");
						{
							const i = t.name ?? "";
							return KI({ name: i }, t.parent, t.providers, i);
						}
					}
				}
				return (
					(e.THROW_IF_NOT_FOUND = $i),
					(e.NULL = new pI()),
					(e.ɵprov = L({ token: e, providedIn: "any", factory: () => O(II) })),
					(e.__NG_ELEMENT_ID__ = -1),
					e
				);
			})();
			function S(e, n = k.Default) {
				const t = D();
				return null === t ? O(e, n) : dC(Ke(), t, j(e), n);
			}
			function ma(e, n, t, r, i, o, s, a, l, c, u) {
				const g = n.blueprint.slice();
				return (
					(g[ke] = i),
					(g[z] = 140 | r),
					(null !== c || (e && 2048 & e[z])) && (g[z] |= 2048),
					Bf(g),
					(g[pe] = g[Lr] = e),
					(g[Ee] = t),
					(g[or] = s || (e && e[or])),
					(g[W] = a || (e && e[W])),
					(g[Or] = l || (e && e[Or]) || null),
					(g[Ye] = o),
					(g[Yi] = (function D0() {
						return _0++;
					})()),
					(g[vn] = u),
					(g[wf] = c),
					(g[Se] = 2 == n.type ? e[Se] : g),
					g
				);
			}
			function ni(e, n, t, r, i) {
				let o = e.data[n];
				if (null === o)
					(o = (function lu(e, n, t, r, i) {
						const o = Gf(),
							s = nc(),
							l = (e.data[n] = (function fS(e, n, t, r, i, o) {
								let s = n ? n.injectorIndex : -1,
									a = 0;
								return (
									Vr() && (a |= 128),
									{
										type: t,
										index: r,
										insertBeforeIndex: null,
										injectorIndex: s,
										directiveStart: -1,
										directiveEnd: -1,
										directiveStylingLast: -1,
										componentOffset: -1,
										propertyBindings: null,
										flags: a,
										providerIndexes: 0,
										value: i,
										attrs: o,
										mergedAttrs: null,
										localNames: null,
										initialInputs: void 0,
										inputs: null,
										outputs: null,
										tView: null,
										next: null,
										prev: null,
										projectionNext: null,
										child: null,
										parent: n,
										projection: null,
										styles: null,
										stylesWithoutHost: null,
										residualStyles: void 0,
										classes: null,
										classesWithoutHost: null,
										residualClasses: void 0,
										classBindings: 0,
										styleBindings: 0,
									}
								);
							})(0, s ? o : o && o.parent, t, n, r, i));
						return (
							null === e.firstChild && (e.firstChild = l),
							null !== o &&
								(s
									? null == o.child && null !== l.parent && (o.child = l)
									: null === o.next && ((o.next = l), (l.prev = o))),
							l
						);
					})(e, n, t, r, i)),
						(function Ew() {
							return U.lFrame.inI18n;
						})() && (o.flags |= 32);
				else if (64 & o.type) {
					(o.type = t), (o.value = r), (o.attrs = i);
					const s = (function Xi() {
						const e = U.lFrame,
							n = e.currentTNode;
						return e.isParent ? n : n.parent;
					})();
					o.injectorIndex = null === s ? -1 : s.injectorIndex;
				}
				return an(o, !0), o;
			}
			function mo(e, n, t, r) {
				if (0 === t) return -1;
				const i = n.length;
				for (let o = 0; o < t; o++) n.push(r), e.blueprint.push(r), e.data.push(null);
				return i;
			}
			function QI(e, n, t, r, i) {
				const o = jI(n, Es),
					s = rt(),
					a = 2 & r;
				try {
					if ((lr(-1), a && n.length > Y && zI(e, n, Y, !1), sn(a ? 2 : 0, i), a)) o.runInContext(t, r, i);
					else {
						const c = ze(null);
						try {
							t(r, i);
						} finally {
							ze(c);
						}
					}
				} finally {
					a && null === n[Es] && $I(n, Es), lr(s), sn(a ? 3 : 1, i);
				}
			}
			function cu(e, n, t) {
				if (Zl(n)) {
					const r = ze(null);
					try {
						const o = n.directiveEnd;
						for (let s = n.directiveStart; s < o; s++) {
							const a = e.data[s];
							a.contentQueries && a.contentQueries(1, t[s], s);
						}
					} finally {
						ze(r);
					}
				}
			}
			function uu(e, n, t) {
				Wf() &&
					((function yS(e, n, t, r) {
						const i = t.directiveStart,
							o = t.directiveEnd;
						sr(t) &&
							(function bS(e, n, t) {
								const r = It(n, e),
									i = XI(t);
								let s = 16;
								t.signals ? (s = 4096) : t.onPush && (s = 64);
								const a = ya(
									e,
									ma(
										e,
										i,
										null,
										s,
										r,
										n,
										null,
										e[or].rendererFactory.createRenderer(r, t),
										null,
										null,
										null,
									),
								);
								e[n.index] = a;
							})(n, t, e.data[i + t.componentOffset]),
							e.firstCreatePass || Bs(t, n),
							Xe(r, n);
						const s = t.initialInputs;
						for (let a = i; a < o; a++) {
							const l = e.data[a],
								c = ur(n, e, a, t);
							Xe(c, n),
								null !== s && TS(0, a - i, c, l, 0, s),
								zt(l) && (Dt(t.index, n)[Ee] = ur(n, e, a, t));
						}
					})(e, n, t, It(t, n)),
					64 == (64 & t.flags) && rh(e, n, t));
			}
			function gu(e, n, t = It) {
				const r = n.localNames;
				if (null !== r) {
					let i = n.index + 1;
					for (let o = 0; o < r.length; o += 2) {
						const s = r[o + 1],
							a = -1 === s ? t(n, e) : e[s];
						e[i++] = a;
					}
				}
			}
			function XI(e) {
				const n = e.tView;
				return null === n || n.incompleteFirstPass
					? (e.tView = du(
							1,
							null,
							e.template,
							e.decls,
							e.vars,
							e.directiveDefs,
							e.pipeDefs,
							e.viewQuery,
							e.schemas,
							e.consts,
							e.id,
					  ))
					: n;
			}
			function du(e, n, t, r, i, o, s, a, l, c, u) {
				const g = Y + r,
					d = g + i,
					f = (function aS(e, n) {
						const t = [];
						for (let r = 0; r < n; r++) t.push(r < e ? null : G);
						return t;
					})(g, d),
					C = "function" == typeof c ? c() : c;
				return (f[T] = {
					type: e,
					blueprint: f,
					template: t,
					queries: null,
					viewQuery: a,
					declTNode: n,
					data: f.slice().fill(null, g),
					bindingStartIndex: g,
					expandoStartIndex: d,
					hostBindingOpCodes: null,
					firstCreatePass: !0,
					firstUpdatePass: !0,
					staticViewQueries: !1,
					staticContentQueries: !1,
					preOrderHooks: null,
					preOrderCheckHooks: null,
					contentHooks: null,
					contentCheckHooks: null,
					viewHooks: null,
					viewCheckHooks: null,
					destroyHooks: null,
					cleanup: null,
					contentQueries: null,
					components: null,
					directiveRegistry: "function" == typeof o ? o() : o,
					pipeRegistry: "function" == typeof s ? s() : s,
					firstChild: null,
					schemas: l,
					consts: C,
					incompleteFirstPass: !1,
					ssrId: u,
				});
			}
			let JI = (e) => null;
			function eh(e, n, t, r) {
				for (let i in e)
					if (e.hasOwnProperty(i)) {
						t = null === t ? {} : t;
						const o = e[i];
						null === r ? th(t, n, i, o) : r.hasOwnProperty(i) && th(t, n, r[i], o);
					}
				return t;
			}
			function th(e, n, t, r) {
				e.hasOwnProperty(t) ? e[t].push(n, r) : (e[t] = [n, r]);
			}
			function Et(e, n, t, r, i, o, s, a) {
				const l = It(n, t);
				let u,
					c = n.inputs;
				!a && null != c && (u = c[r])
					? (pu(e, t, u, r, i),
					  sr(n) &&
							(function hS(e, n) {
								const t = Dt(n, e);
								16 & t[z] || (t[z] |= 64);
							})(t, n.index))
					: 3 & n.type &&
					  ((r = (function IS(e) {
							return "class" === e
								? "className"
								: "for" === e
								? "htmlFor"
								: "formaction" === e
								? "formAction"
								: "innerHtml" === e
								? "innerHTML"
								: "readonly" === e
								? "readOnly"
								: "tabindex" === e
								? "tabIndex"
								: e;
					  })(r)),
					  (i = null != s ? s(i, n.value || "", r) : i),
					  o.setProperty(l, r, i));
			}
			function fu(e, n, t, r) {
				if (Wf()) {
					const i = null === r ? null : { "": -1 },
						o = (function _S(e, n) {
							const t = e.directiveRegistry;
							let r = null,
								i = null;
							if (t)
								for (let o = 0; o < t.length; o++) {
									const s = t[o];
									if (Af(n, s.selectors, !1))
										if ((r || (r = []), zt(s)))
											if (null !== s.findHostDirectiveDefs) {
												const a = [];
												(i = i || new Map()),
													s.findHostDirectiveDefs(s, a, i),
													r.unshift(...a, s),
													Cu(e, n, a.length);
											} else r.unshift(s), Cu(e, n, 0);
										else (i = i || new Map()), s.findHostDirectiveDefs?.(s, r, i), r.push(s);
								}
							return null === r ? null : [r, i];
						})(e, t);
					let s, a;
					null === o ? (s = a = null) : ([s, a] = o),
						null !== s && nh(e, n, t, s, i, a),
						i &&
							(function DS(e, n, t) {
								if (n) {
									const r = (e.localNames = []);
									for (let i = 0; i < n.length; i += 2) {
										const o = t[n[i + 1]];
										if (null == o) throw new w(-301, !1);
										r.push(n[i], o);
									}
								}
							})(t, r, i);
				}
				t.mergedAttrs = Gi(t.mergedAttrs, t.attrs);
			}
			function nh(e, n, t, r, i, o) {
				for (let c = 0; c < r.length; c++) Cc(Bs(t, n), e, r[c].type);
				!(function ES(e, n, t) {
					(e.flags |= 1), (e.directiveStart = n), (e.directiveEnd = n + t), (e.providerIndexes = n);
				})(t, e.data.length, r.length);
				for (let c = 0; c < r.length; c++) {
					const u = r[c];
					u.providersResolver && u.providersResolver(u);
				}
				let s = !1,
					a = !1,
					l = mo(e, n, r.length, null);
				for (let c = 0; c < r.length; c++) {
					const u = r[c];
					(t.mergedAttrs = Gi(t.mergedAttrs, u.hostAttrs)),
						SS(e, t, n, l, u),
						wS(l, u, i),
						null !== u.contentQueries && (t.flags |= 4),
						(null !== u.hostBindings || null !== u.hostAttrs || 0 !== u.hostVars) && (t.flags |= 64);
					const g = u.type.prototype;
					!s &&
						(g.ngOnChanges || g.ngOnInit || g.ngDoCheck) &&
						((e.preOrderHooks ??= []).push(t.index), (s = !0)),
						!a && (g.ngOnChanges || g.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(t.index), (a = !0)),
						l++;
				}
				!(function CS(e, n, t) {
					const i = n.directiveEnd,
						o = e.data,
						s = n.attrs,
						a = [];
					let l = null,
						c = null;
					for (let u = n.directiveStart; u < i; u++) {
						const g = o[u],
							d = t ? t.get(g) : null,
							C = d ? d.outputs : null;
						(l = eh(g.inputs, u, l, d ? d.inputs : null)), (c = eh(g.outputs, u, c, C));
						const I = null === l || null === s || pf(n) ? null : MS(l, u, s);
						a.push(I);
					}
					null !== l &&
						(l.hasOwnProperty("class") && (n.flags |= 8), l.hasOwnProperty("style") && (n.flags |= 16)),
						(n.initialInputs = a),
						(n.inputs = l),
						(n.outputs = c);
				})(e, t, o);
			}
			function rh(e, n, t) {
				const r = t.directiveStart,
					i = t.directiveEnd,
					o = t.index,
					s = (function bw() {
						return U.lFrame.currentDirectiveIndex;
					})();
				try {
					lr(o);
					for (let a = r; a < i; a++) {
						const l = e.data[a],
							c = n[a];
						ic(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && vS(l, c);
					}
				} finally {
					lr(-1), ic(s);
				}
			}
			function vS(e, n) {
				null !== e.hostBindings && e.hostBindings(1, n);
			}
			function Cu(e, n, t) {
				(n.componentOffset = t), (e.components ??= []).push(n.index);
			}
			function wS(e, n, t) {
				if (t) {
					if (n.exportAs) for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
					zt(n) && (t[""] = e);
				}
			}
			function SS(e, n, t, r, i) {
				e.data[r] = i;
				const o = i.factory || (i.factory = ar(i.type)),
					s = new Ji(o, zt(i), S);
				(e.blueprint[r] = s),
					(t[r] = s),
					(function AS(e, n, t, r, i) {
						const o = i.hostBindings;
						if (o) {
							let s = e.hostBindingOpCodes;
							null === s && (s = e.hostBindingOpCodes = []);
							const a = ~n.index;
							(function mS(e) {
								let n = e.length;
								for (; n > 0; ) {
									const t = e[--n];
									if ("number" == typeof t && t < 0) return t;
								}
								return 0;
							})(s) != a && s.push(a),
								s.push(t, r, o);
						}
					})(e, n, r, mo(e, t, i.hostVars, G), i);
			}
			function un(e, n, t, r, i, o) {
				const s = It(e, n);
				!(function Iu(e, n, t, r, i, o, s) {
					if (null == o) e.removeAttribute(n, i, t);
					else {
						const a = null == s ? $(o) : s(o, r || "", i);
						e.setAttribute(n, i, a, t);
					}
				})(n[W], s, o, e.value, t, r, i);
			}
			function TS(e, n, t, r, i, o) {
				const s = o[n];
				if (null !== s) for (let a = 0; a < s.length; ) ih(r, t, s[a++], s[a++], s[a++]);
			}
			function ih(e, n, t, r, i) {
				const o = ze(null);
				try {
					const s = e.inputTransforms;
					null !== s && s.hasOwnProperty(r) && (i = s[r].call(n, i)),
						null !== e.setInput ? e.setInput(n, i, t, r) : (n[r] = i);
				} finally {
					ze(o);
				}
			}
			function MS(e, n, t) {
				let r = null,
					i = 0;
				for (; i < t.length; ) {
					const o = t[i];
					if (0 !== o)
						if (5 !== o) {
							if ("number" == typeof o) break;
							if (e.hasOwnProperty(o)) {
								null === r && (r = []);
								const s = e[o];
								for (let a = 0; a < s.length; a += 2)
									if (s[a] === n) {
										r.push(o, s[a + 1], t[i + 1]);
										break;
									}
							}
							i += 2;
						} else i += 2;
					else i += 4;
				}
				return r;
			}
			function oh(e, n, t, r) {
				return [e, !0, !1, n, null, 0, r, t, null, null, null];
			}
			function sh(e, n) {
				const t = e.contentQueries;
				if (null !== t)
					for (let r = 0; r < t.length; r += 2) {
						const o = t[r + 1];
						if (-1 !== o) {
							const s = e.data[o];
							sc(t[r]), s.contentQueries(2, n[o], o);
						}
					}
			}
			function ya(e, n) {
				return e[Ki] ? (e[Df][$t] = n) : (e[Ki] = n), (e[Df] = n), n;
			}
			function hu(e, n, t) {
				sc(0);
				const r = ze(null);
				try {
					n(e, t);
				} finally {
					ze(r);
				}
			}
			function ah(e) {
				return e[Pr] || (e[Pr] = []);
			}
			function lh(e) {
				return e.cleanup || (e.cleanup = []);
			}
			function uh(e, n) {
				const t = e[Or],
					r = t ? t.get(fr, null) : null;
				r && r.handleError(n);
			}
			function pu(e, n, t, r, i) {
				for (let o = 0; o < t.length; ) {
					const s = t[o++],
						a = t[o++];
					ih(e.data[s], n[s], r, a, i);
				}
			}
			function NS(e, n) {
				const t = Dt(n, e),
					r = t[T];
				!(function xS(e, n) {
					for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
				})(r, t);
				const i = t[ke];
				null !== i && null === t[vn] && (t[vn] = bI(i, t[Or])), Au(r, t, t[Ee]);
			}
			function Au(e, n, t) {
				ac(n);
				try {
					const r = e.viewQuery;
					null !== r && hu(1, r, t);
					const i = e.template;
					null !== i && QI(e, n, i, 1, t),
						e.firstCreatePass && (e.firstCreatePass = !1),
						e.staticContentQueries && sh(e, n),
						e.staticViewQueries && hu(2, e.viewQuery, t);
					const o = e.components;
					null !== o &&
						(function RS(e, n) {
							for (let t = 0; t < n.length; t++) NS(e, n[t]);
						})(n, o);
				} catch (r) {
					throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
				} finally {
					(n[z] &= -5), lc();
				}
			}
			let gh = (() => {
				class e {
					constructor() {
						(this.all = new Set()), (this.queue = new Map());
					}
					create(t, r, i) {
						const o = typeof Zone > "u" ? null : Zone.current,
							s = new rw(
								t,
								(c) => {
									this.all.has(c) && this.queue.set(c, o);
								},
								i,
							);
						let a;
						this.all.add(s), s.notify();
						const l = () => {
							s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
						};
						return (a = r?.onDestroy(l)), { destroy: l };
					}
					flush() {
						if (0 !== this.queue.size)
							for (const [t, r] of this.queue) this.queue.delete(t), r ? r.run(() => t.run()) : t.run();
					}
					get isQueueEmpty() {
						return 0 === this.queue.size;
					}
				}
				return (e.ɵprov = L({ token: e, providedIn: "root", factory: () => new e() })), e;
			})();
			function va(e, n, t) {
				let r = t ? e.styles : null,
					i = t ? e.classes : null,
					o = 0;
				if (null !== n)
					for (let s = 0; s < n.length; s++) {
						const a = n[s];
						"number" == typeof a
							? (o = a)
							: 1 == o
							? (i = Hl(i, a))
							: 2 == o && (r = Hl(r, a + ": " + n[++s] + ";"));
					}
				t ? (e.styles = r) : (e.stylesWithoutHost = r), t ? (e.classes = i) : (e.classesWithoutHost = i);
			}
			function yo(e, n, t, r, i = !1) {
				for (; null !== t; ) {
					const o = n[t.index];
					if ((null !== o && r.push(fe(o)), Ct(o))) {
						for (let a = Qe; a < o.length; a++) {
							const l = o[a],
								c = l[T].firstChild;
							null !== c && yo(l[T], l, c, r);
						}
						o[rn] !== o[ke] && r.push(o[rn]);
					}
					const s = t.type;
					if (8 & s) yo(e, n, t.child, r);
					else if (32 & s) {
						const a = Sc(t, n);
						let l;
						for (; (l = a()); ) r.push(l);
					} else if (16 & s) {
						const a = XC(n, t);
						if (Array.isArray(a)) r.push(...a);
						else {
							const l = so(n[Se]);
							yo(l[T], l, a, r, !0);
						}
					}
					t = i ? t.projectionNext : t.next;
				}
				return r;
			}
			function _a(e, n, t, r = !0) {
				const i = n[or].rendererFactory;
				i.begin && i.begin();
				try {
					dh(e, n, e.template, t);
				} catch (s) {
					throw (r && uh(n, s), s);
				} finally {
					i.end && i.end(), n[or].effectManager?.flush();
				}
			}
			function dh(e, n, t, r) {
				const i = n[z];
				if (256 != (256 & i)) {
					n[or].effectManager?.flush(), ac(n);
					try {
						Bf(n),
							(function Kf(e) {
								return (U.lFrame.bindingIndex = e);
							})(e.bindingStartIndex),
							null !== t && QI(e, n, t, 2, r);
						const s = 3 == (3 & i);
						if (s) {
							const c = e.preOrderCheckHooks;
							null !== c && Ls(n, c, null);
						} else {
							const c = e.preOrderHooks;
							null !== c && Fs(n, c, 0, null), cc(n, 0);
						}
						if (
							((function kS(e) {
								for (let n = VC(e); null !== n; n = BC(n)) {
									if (!n[Ef]) continue;
									const t = n[kr];
									for (let r = 0; r < t.length; r++) {
										Cw(t[r]);
									}
								}
							})(n),
							fh(n, 2),
							null !== e.contentQueries && sh(e, n),
							s)
						) {
							const c = e.contentCheckHooks;
							null !== c && Ls(n, c);
						} else {
							const c = e.contentHooks;
							null !== c && Fs(n, c, 1), cc(n, 1);
						}
						!(function sS(e, n) {
							const t = e.hostBindingOpCodes;
							if (null === t) return;
							const r = jI(n, Ss);
							try {
								for (let i = 0; i < t.length; i++) {
									const o = t[i];
									if (o < 0) lr(~o);
									else {
										const s = o,
											a = t[++i],
											l = t[++i];
										Sw(a, s), r.runInContext(l, 2, n[s]);
									}
								}
							} finally {
								null === n[Ss] && $I(n, Ss), lr(-1);
							}
						})(e, n);
						const a = e.components;
						null !== a && Ih(n, a, 0);
						const l = e.viewQuery;
						if ((null !== l && hu(2, l, r), s)) {
							const c = e.viewCheckHooks;
							null !== c && Ls(n, c);
						} else {
							const c = e.viewHooks;
							null !== c && Fs(n, c, 2), cc(n, 2);
						}
						!0 === e.firstUpdatePass && (e.firstUpdatePass = !1), (n[z] &= -73), Uf(n);
					} finally {
						lc();
					}
				}
			}
			function fh(e, n) {
				for (let t = VC(e); null !== t; t = BC(t)) for (let r = Qe; r < t.length; r++) Ch(t[r], n);
			}
			function HS(e, n, t) {
				Ch(Dt(n, e), t);
			}
			function Ch(e, n) {
				if (
					!(function dw(e) {
						return 128 == (128 & e[z]);
					})(e)
				)
					return;
				const t = e[T];
				if ((80 & e[z] && 0 === n) || 1024 & e[z] || 2 === n) dh(t, e, t.template, e[Ee]);
				else if (e[qi] > 0) {
					fh(e, 1);
					const i = e[T].components;
					null !== i && Ih(e, i, 1);
				}
			}
			function Ih(e, n, t) {
				for (let r = 0; r < n.length; r++) HS(e, n[r], t);
			}
			class vo {
				get rootNodes() {
					const n = this._lView,
						t = n[T];
					return yo(t, n, t.firstChild, []);
				}
				constructor(n, t) {
					(this._lView = n),
						(this._cdRefInjectingView = t),
						(this._appRef = null),
						(this._attachedToViewContainer = !1);
				}
				get context() {
					return this._lView[Ee];
				}
				set context(n) {
					this._lView[Ee] = n;
				}
				get destroyed() {
					return 256 == (256 & this._lView[z]);
				}
				destroy() {
					if (this._appRef) this._appRef.detachView(this);
					else if (this._attachedToViewContainer) {
						const n = this._lView[pe];
						if (Ct(n)) {
							const t = n[8],
								r = t ? t.indexOf(this) : -1;
							r > -1 && (Tc(n, r), $s(t, r));
						}
						this._attachedToViewContainer = !1;
					}
					zC(this._lView[T], this._lView);
				}
				onDestroy(n) {
					!(function $f(e, n) {
						if (256 == (256 & e[z])) throw new w(911, !1);
						null === e[jn] && (e[jn] = []), e[jn].push(n);
					})(this._lView, n);
				}
				markForCheck() {
					Ao(this._cdRefInjectingView || this._lView);
				}
				detach() {
					this._lView[z] &= -129;
				}
				reattach() {
					this._lView[z] |= 128;
				}
				detectChanges() {
					_a(this._lView[T], this._lView, this.context);
				}
				checkNoChanges() {}
				attachToViewContainerRef() {
					if (this._appRef) throw new w(902, !1);
					this._attachedToViewContainer = !0;
				}
				detachFromAppRef() {
					(this._appRef = null),
						(function k0(e, n) {
							lo(e, n, n[W], 2, null, null);
						})(this._lView[T], this._lView);
				}
				attachToAppRef(n) {
					if (this._attachedToViewContainer) throw new w(902, !1);
					this._appRef = n;
				}
			}
			class VS extends vo {
				constructor(n) {
					super(n), (this._view = n);
				}
				detectChanges() {
					const n = this._view;
					_a(n[T], n, n[Ee], !1);
				}
				checkNoChanges() {}
				get context() {
					return null;
				}
			}
			class hh extends Ia {
				constructor(n) {
					super(), (this.ngModule = n);
				}
				resolveComponentFactory(n) {
					const t = oe(n);
					return new _o(t, this.ngModule);
				}
			}
			function ph(e) {
				const n = [];
				for (let t in e) e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
				return n;
			}
			class US {
				constructor(n, t) {
					(this.injector = n), (this.parentInjector = t);
				}
				get(n, t, r) {
					r = _s(r);
					const i = this.injector.get(n, su, r);
					return i !== su || t === su ? i : this.parentInjector.get(n, t, r);
				}
			}
			class _o extends NI {
				get inputs() {
					const n = this.componentDef,
						t = n.inputTransforms,
						r = ph(n.inputs);
					if (null !== t) for (const i of r) t.hasOwnProperty(i.propName) && (i.transform = t[i.propName]);
					return r;
				}
				get outputs() {
					return ph(this.componentDef.outputs);
				}
				constructor(n, t) {
					super(),
						(this.componentDef = n),
						(this.ngModule = t),
						(this.componentType = n.type),
						(this.selector = (function HD(e) {
							return e.map(kD).join(",");
						})(n.selectors)),
						(this.ngContentSelectors = n.ngContentSelectors ? n.ngContentSelectors : []),
						(this.isBoundToModule = !!t);
				}
				create(n, t, r, i) {
					let o = (i = i || this.ngModule) instanceof cn ? i : i?.injector;
					o &&
						null !== this.componentDef.getStandaloneInjector &&
						(o = this.componentDef.getStandaloneInjector(o) || o);
					const s = o ? new US(n, o) : n,
						a = s.get(RI, null);
					if (null === a) throw new w(407, !1);
					const u = { rendererFactory: a, sanitizer: s.get(WE, null), effectManager: s.get(gh, null) },
						g = a.createRenderer(null, this.componentDef),
						d = this.componentDef.selectors[0][0] || "div",
						f = r
							? (function lS(e, n, t, r) {
									const o = r.get(LI, !1) || t === yt.ShadowDom,
										s = e.selectRootElement(n, o);
									return (
										(function cS(e) {
											JI(e);
										})(s),
										s
									);
							  })(g, r, this.componentDef.encapsulation, s)
							: ea(
									g,
									d,
									(function BS(e) {
										const n = e.toLowerCase();
										return "svg" === n ? "svg" : "math" === n ? "math" : null;
									})(d),
							  ),
						p = this.componentDef.signals ? 4608 : this.componentDef.onPush ? 576 : 528,
						v = du(0, null, null, 1, 0, null, null, null, null, null, null),
						h = ma(null, v, null, p, null, null, u, g, s, null, null);
					let E, P;
					ac(h);
					try {
						const F = this.componentDef;
						let he,
							Sl = null;
						F.findHostDirectiveDefs
							? ((he = []), (Sl = new Map()), F.findHostDirectiveDefs(F, he, Sl), he.push(F))
							: (he = [F]);
						const n3 = (function $S(e, n) {
								const t = e[T],
									r = Y;
								return (e[r] = n), ni(t, r, 2, "#host", null);
							})(h, f),
							r3 = (function zS(e, n, t, r, i, o, s) {
								const a = i[T];
								!(function WS(e, n, t, r) {
									for (const i of e) n.mergedAttrs = Gi(n.mergedAttrs, i.hostAttrs);
									null !== n.mergedAttrs && (va(n, n.mergedAttrs, !0), null !== t && nI(r, t, n));
								})(r, e, n, s);
								let l = null;
								null !== n && (l = bI(n, i[Or]));
								const c = o.rendererFactory.createRenderer(n, t);
								let u = 16;
								t.signals ? (u = 4096) : t.onPush && (u = 64);
								const g = ma(i, XI(t), null, u, i[e.index], e, o, c, null, null, l);
								return a.firstCreatePass && Cu(a, e, r.length - 1), ya(i, g), (i[e.index] = g);
							})(n3, f, F, he, h, u, g);
						(P = Vf(v, Y)),
							f &&
								(function qS(e, n, t, r) {
									if (r) ql(e, t, ["ng-version", GE.full]);
									else {
										const { attrs: i, classes: o } = (function VD(e) {
											const n = [],
												t = [];
											let r = 1,
												i = 2;
											for (; r < e.length; ) {
												let o = e[r];
												if ("string" == typeof o)
													2 === i ? "" !== o && n.push(o, e[++r]) : 8 === i && t.push(o);
												else {
													if (!jt(i)) break;
													i = o;
												}
												r++;
											}
											return { attrs: n, classes: t };
										})(n.selectors[0]);
										i && ql(e, t, i), o && o.length > 0 && tI(e, t, o.join(" "));
									}
								})(g, F, f, r),
							void 0 !== t &&
								(function KS(e, n, t) {
									const r = (e.projection = []);
									for (let i = 0; i < n.length; i++) {
										const o = t[i];
										r.push(null != o ? Array.from(o) : null);
									}
								})(P, this.ngContentSelectors, t),
							(E = (function GS(e, n, t, r, i, o) {
								const s = Ke(),
									a = i[T],
									l = It(s, i);
								nh(a, i, s, t, null, r);
								for (let u = 0; u < t.length; u++) Xe(ur(i, a, s.directiveStart + u, s), i);
								rh(a, i, s), l && Xe(l, i);
								const c = ur(i, a, s.directiveStart + s.componentOffset, s);
								if (((e[Ee] = i[Ee] = c), null !== o)) for (const u of o) u(c, n);
								return cu(a, s, e), c;
							})(r3, F, he, Sl, h, [ZS])),
							Au(v, h, null);
					} finally {
						lc();
					}
					return new jS(this.componentType, E, Jr(P, h), h, P);
				}
			}
			class jS extends VE {
				constructor(n, t, r, i, o) {
					super(),
						(this.location = r),
						(this._rootLView = i),
						(this._tNode = o),
						(this.previousInputValues = null),
						(this.instance = t),
						(this.hostView = this.changeDetectorRef = new VS(i)),
						(this.componentType = n);
				}
				setInput(n, t) {
					const r = this._tNode.inputs;
					let i;
					if (null !== r && (i = r[n])) {
						if (
							((this.previousInputValues ??= new Map()),
							this.previousInputValues.has(n) && Object.is(this.previousInputValues.get(n), t))
						)
							return;
						const o = this._rootLView;
						pu(o[T], o, i, n, t), this.previousInputValues.set(n, t), Ao(Dt(this._tNode.index, o));
					}
				}
				get injector() {
					return new jr(this._tNode, this._rootLView);
				}
				destroy() {
					this.hostView.destroy();
				}
				onDestroy(n) {
					this.hostView.onDestroy(n);
				}
			}
			function ZS() {
				const e = Ke();
				Os(D()[T], e);
			}
			function qn(e) {
				let n = (function Ah(e) {
						return Object.getPrototypeOf(e.prototype).constructor;
					})(e.type),
					t = !0;
				const r = [e];
				for (; n; ) {
					let i;
					if (zt(e)) i = n.ɵcmp || n.ɵdir;
					else {
						if (n.ɵcmp) throw new w(903, !1);
						i = n.ɵdir;
					}
					if (i) {
						if (t) {
							r.push(i);
							const s = e;
							(s.inputs = Da(e.inputs)),
								(s.inputTransforms = Da(e.inputTransforms)),
								(s.declaredInputs = Da(e.declaredInputs)),
								(s.outputs = Da(e.outputs));
							const a = i.hostBindings;
							a && JS(e, a);
							const l = i.viewQuery,
								c = i.contentQueries;
							if (
								(l && QS(e, l),
								c && XS(e, c),
								Is(e.inputs, i.inputs),
								Is(e.declaredInputs, i.declaredInputs),
								Is(e.outputs, i.outputs),
								null !== i.inputTransforms &&
									(null === s.inputTransforms && (s.inputTransforms = {}),
									Is(s.inputTransforms, i.inputTransforms)),
								zt(i) && i.data.animation)
							) {
								const u = e.data;
								u.animation = (u.animation || []).concat(i.data.animation);
							}
						}
						const o = i.features;
						if (o)
							for (let s = 0; s < o.length; s++) {
								const a = o[s];
								a && a.ngInherit && a(e), a === qn && (t = !1);
							}
					}
					n = Object.getPrototypeOf(n);
				}
				!(function YS(e) {
					let n = 0,
						t = null;
					for (let r = e.length - 1; r >= 0; r--) {
						const i = e[r];
						(i.hostVars = n += i.hostVars), (i.hostAttrs = Gi(i.hostAttrs, (t = Gi(t, i.hostAttrs))));
					}
				})(r);
			}
			function Da(e) {
				return e === tn ? {} : e === ne ? [] : e;
			}
			function QS(e, n) {
				const t = e.viewQuery;
				e.viewQuery = t
					? (r, i) => {
							n(r, i), t(r, i);
					  }
					: n;
			}
			function XS(e, n) {
				const t = e.contentQueries;
				e.contentQueries = t
					? (r, i, o) => {
							n(r, i, o), t(r, i, o);
					  }
					: n;
			}
			function JS(e, n) {
				const t = e.hostBindings;
				e.hostBindings = t
					? (r, i) => {
							n(r, i), t(r, i);
					  }
					: n;
			}
			function _h(e) {
				const n = e.inputConfig,
					t = {};
				for (const r in n)
					if (n.hasOwnProperty(r)) {
						const i = n[r];
						Array.isArray(i) && i[2] && (t[r] = i[2]);
					}
				e.inputTransforms = t;
			}
			function wa(e) {
				return !!mu(e) && (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e));
			}
			function mu(e) {
				return null !== e && ("function" == typeof e || "object" == typeof e);
			}
			function gn(e, n, t) {
				return (e[n] = t);
			}
			function Je(e, n, t) {
				return !Object.is(e[n], t) && ((e[n] = t), !0);
			}
			function Cr(e, n, t, r) {
				const i = Je(e, n, t);
				return Je(e, n + 1, r) || i;
			}
			function We(e, n, t, r) {
				const i = D();
				return Je(i, Br(), n) && (J(), un(Ae(), i, e, n, t, r)), We;
			}
			function ii(e, n, t, r) {
				return Je(e, Br(), t) ? n + $(t) + r : G;
			}
			function y(e, n, t, r, i, o, s, a) {
				const l = D(),
					c = J(),
					u = e + Y,
					g = c.firstCreatePass
						? (function wb(e, n, t, r, i, o, s, a, l) {
								const c = n.consts,
									u = ni(n, e, 4, s || null, $n(c, a));
								fu(n, t, u, $n(c, l)), Os(n, u);
								const g = (u.tView = du(
									2,
									u,
									r,
									i,
									o,
									n.directiveRegistry,
									n.pipeRegistry,
									null,
									n.schemas,
									c,
									null,
								));
								return (
									null !== n.queries &&
										(n.queries.template(n, u), (g.queries = n.queries.embeddedTView(u))),
									u
								);
						  })(u, c, l, n, t, r, i, o, s)
						: c.data[u];
				an(g, !1);
				const d = Lh(c, l, g, e);
				Ps() && na(c, l, d, g),
					Xe(d, l),
					ya(l, (l[u] = oh(d, l, d, g))),
					Ts(g) && uu(c, l, g),
					null != s && gu(l, g, a);
			}
			let Lh = function Fh(e, n, t, r) {
				return zn(!0), n[W].createComment("");
			};
			function bo(e) {
				return (function Hr(e, n) {
					return e[n];
				})(
					(function ww() {
						return U.lFrame.contextLView;
					})(),
					Y + e,
				);
			}
			function A(e, n, t) {
				const r = D();
				return Je(r, Br(), n) && Et(J(), Ae(), r, e, n, r[W], t, !1), A;
			}
			function Eu(e, n, t, r, i) {
				const s = i ? "class" : "style";
				pu(e, t, n.inputs[s], s, r);
			}
			function N(e, n, t, r) {
				const i = D(),
					o = J(),
					s = Y + e,
					a = i[W],
					l = o.firstCreatePass
						? (function Tb(e, n, t, r, i, o) {
								const s = n.consts,
									l = ni(n, e, 2, r, $n(s, i));
								return (
									fu(n, t, l, $n(s, o)),
									null !== l.attrs && va(l, l.attrs, !1),
									null !== l.mergedAttrs && va(l, l.mergedAttrs, !0),
									null !== n.queries && n.queries.elementStart(n, l),
									l
								);
						  })(s, o, i, n, t, r)
						: o.data[s],
					c = kh(o, i, l, a, n, e);
				i[s] = c;
				const u = Ts(l);
				return (
					an(l, !0),
					nI(a, c, l),
					32 != (32 & l.flags) && Ps() && na(o, i, c, l),
					0 ===
						(function hw() {
							return U.lFrame.elementDepthCount;
						})() && Xe(c, i),
					(function pw() {
						U.lFrame.elementDepthCount++;
					})(),
					u && (uu(o, i, l), cu(o, l, i)),
					null !== r && gu(i, l),
					N
				);
			}
			function x() {
				let e = Ke();
				nc() ? rc() : ((e = e.parent), an(e, !1));
				const n = e;
				(function mw(e) {
					return U.skipHydrationRootTNode === e;
				})(n) &&
					(function Dw() {
						U.skipHydrationRootTNode = null;
					})(),
					(function Aw() {
						U.lFrame.elementDepthCount--;
					})();
				const t = J();
				return (
					t.firstCreatePass && (Os(t, e), Zl(e) && t.queries.elementEnd(e)),
					null != n.classesWithoutHost &&
						(function kw(e) {
							return 0 != (8 & e.flags);
						})(n) &&
						Eu(t, n, D(), n.classesWithoutHost, !0),
					null != n.stylesWithoutHost &&
						(function Hw(e) {
							return 0 != (16 & e.flags);
						})(n) &&
						Eu(t, n, D(), n.stylesWithoutHost, !1),
					x
				);
			}
			function K(e, n, t, r) {
				return N(e, n, t, r), x(), K;
			}
			let kh = (e, n, t, r, i, o) => (
				zn(!0),
				ea(
					r,
					i,
					(function nC() {
						return U.lFrame.currentNamespace;
					})(),
				)
			);
			function ve(e, n, t) {
				const r = D(),
					i = J(),
					o = e + Y,
					s = i.firstCreatePass
						? (function xb(e, n, t, r, i) {
								const o = n.consts,
									s = $n(o, r),
									a = ni(n, e, 8, "ng-container", s);
								return (
									null !== s && va(a, s, !0),
									fu(n, t, a, $n(o, i)),
									null !== n.queries && n.queries.elementStart(n, a),
									a
								);
						  })(o, i, r, n, t)
						: i.data[o];
				an(s, !0);
				const a = Hh(i, r, s, e);
				return (
					(r[o] = a),
					Ps() && na(i, r, a, s),
					Xe(a, r),
					Ts(s) && (uu(i, r, s), cu(i, s, r)),
					null != t && gu(r, s),
					ve
				);
			}
			function _e() {
				let e = Ke();
				const n = J();
				return (
					nc() ? rc() : ((e = e.parent), an(e, !1)),
					n.firstCreatePass && (Os(n, e), Zl(e) && n.queries.elementEnd(e)),
					_e
				);
			}
			function De(e, n, t) {
				return ve(e, n, t), _e(), De;
			}
			let Hh = (e, n, t, r) => (zn(!0), bc(n[W], ""));
			function dn() {
				return D();
			}
			function Ma(e) {
				return !!e && "function" == typeof e.then;
			}
			function Vh(e) {
				return !!e && "function" == typeof e.subscribe;
			}
			function it(e, n, t, r) {
				const i = D(),
					o = J(),
					s = Ke();
				return (
					(function Uh(e, n, t, r, i, o, s) {
						const a = Ts(r),
							c = e.firstCreatePass && lh(e),
							u = n[Ee],
							g = ah(n);
						let d = !0;
						if (3 & r.type || s) {
							const I = It(r, n),
								p = s ? s(I) : I,
								v = g.length,
								h = s ? (P) => s(fe(P[r.index])) : r.index;
							let E = null;
							if (
								(!s &&
									a &&
									(E = (function Ob(e, n, t, r) {
										const i = e.cleanup;
										if (null != i)
											for (let o = 0; o < i.length - 1; o += 2) {
												const s = i[o];
												if (s === t && i[o + 1] === r) {
													const a = n[Pr],
														l = i[o + 2];
													return a.length > l ? a[l] : null;
												}
												"string" == typeof s && (o += 2);
											}
										return null;
									})(e, n, i, r.index)),
								null !== E)
							)
								((E.__ngLastListenerFn__ || E).__ngNextListenerFn__ = o),
									(E.__ngLastListenerFn__ = o),
									(d = !1);
							else {
								o = $h(r, n, u, o, !1);
								const P = t.listen(p, i, o);
								g.push(o, P), c && c.push(i, h, v, v + 1);
							}
						} else o = $h(r, n, u, o, !1);
						const f = r.outputs;
						let C;
						if (d && null !== f && (C = f[i])) {
							const I = C.length;
							if (I)
								for (let p = 0; p < I; p += 2) {
									const F = n[C[p]][C[p + 1]].subscribe(o),
										he = g.length;
									g.push(o, F), c && c.push(i, r.index, he, -(he + 1));
								}
						}
					})(o, i, i[W], s, e, n, r),
					it
				);
			}
			function jh(e, n, t, r) {
				try {
					return sn(6, n, t), !1 !== t(r);
				} catch (i) {
					return uh(e, i), !1;
				} finally {
					sn(7, n, t);
				}
			}
			function $h(e, n, t, r, i) {
				return function o(s) {
					if (s === Function) return r;
					Ao(e.componentOffset > -1 ? Dt(e.index, n) : n);
					let l = jh(n, t, r, s),
						c = o.__ngNextListenerFn__;
					for (; c; ) (l = jh(n, t, c, s) && l), (c = c.__ngNextListenerFn__);
					return i && !1 === l && s.preventDefault(), l;
				};
			}
			function _(e = 1) {
				return (function Mw(e) {
					return (U.lFrame.contextLView = (function Nw(e, n) {
						for (; e > 0; ) (n = n[Lr]), e--;
						return n;
					})(e, U.lFrame.contextLView))[Ee];
				})(e);
			}
			function Lb(e, n) {
				let t = null;
				const r = (function PD(e) {
					const n = e.attrs;
					if (null != n) {
						const t = n.indexOf(5);
						if (!(1 & t)) return n[t + 1];
					}
					return null;
				})(e);
				for (let i = 0; i < n.length; i++) {
					const o = n[i];
					if ("*" !== o) {
						if (null === r ? Af(e, o, !0) : FD(r, o)) return i;
					} else t = i;
				}
				return t;
			}
			function Ir(e) {
				const n = D()[Se][Ye];
				if (!n.projection) {
					const r = (n.projection = ro(e ? e.length : 1, null)),
						i = r.slice();
					let o = n.child;
					for (; null !== o; ) {
						const s = e ? Lb(o, e) : 0;
						null !== s && (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o)), (o = o.next);
					}
				}
			}
			function Nn(e, n = 0, t) {
				const r = D(),
					i = J(),
					o = ni(i, Y + e, 16, null, t || null);
				null === o.projection && (o.projection = n),
					rc(),
					(!r[vn] || Vr()) &&
						32 != (32 & o.flags) &&
						(function W0(e, n, t) {
							eI(n[W], 0, n, t, Nc(e, t, n), KC(t.parent || n[Ye], t, n));
						})(i, r, o);
			}
			function hr(e, n, t) {
				return Su(e, "", n, "", t), hr;
			}
			function Su(e, n, t, r, i) {
				const o = D(),
					s = ii(o, n, t, r);
				return s !== G && Et(J(), Ae(), o, e, s, o[W], i, !1), Su;
			}
			function Na(e, n) {
				return (e << 17) | (n << 2);
			}
			function Kn(e) {
				return (e >> 17) & 32767;
			}
			function bu(e) {
				return 2 | e;
			}
			function pr(e) {
				return (131068 & e) >> 2;
			}
			function Tu(e, n) {
				return (-131069 & e) | (n << 2);
			}
			function Mu(e) {
				return 1 | e;
			}
			function Xh(e, n, t, r, i) {
				const o = e[t + 1],
					s = null === n;
				let a = r ? Kn(o) : pr(o),
					l = !1;
				for (; 0 !== a && (!1 === l || s); ) {
					const u = e[a + 1];
					Ub(e[a], n) && ((l = !0), (e[a + 1] = r ? Mu(u) : bu(u))), (a = r ? Kn(u) : pr(u));
				}
				l && (e[t + 1] = r ? bu(o) : Mu(o));
			}
			function Ub(e, n) {
				return (
					null === e ||
					null == n ||
					(Array.isArray(e) ? e[1] : e) === n ||
					(!(!Array.isArray(e) || "string" != typeof n) && qr(e, n) >= 0)
				);
			}
			const Ve = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
			function Jh(e) {
				return e.substring(Ve.key, Ve.keyEnd);
			}
			function jb(e) {
				return e.substring(Ve.value, Ve.valueEnd);
			}
			function ep(e, n) {
				const t = Ve.textEnd;
				return t === n
					? -1
					: ((n = Ve.keyEnd =
							(function Wb(e, n, t) {
								for (; n < t && e.charCodeAt(n) > 32; ) n++;
								return n;
							})(e, (Ve.key = n), t)),
					  di(e, n, t));
			}
			function tp(e, n) {
				const t = Ve.textEnd;
				let r = (Ve.key = di(e, n, t));
				return t === r
					? -1
					: ((r = Ve.keyEnd =
							(function Gb(e, n, t) {
								let r;
								for (
									;
									n < t &&
									(45 === (r = e.charCodeAt(n)) ||
										95 === r ||
										((-33 & r) >= 65 && (-33 & r) <= 90) ||
										(r >= 48 && r <= 57));

								)
									n++;
								return n;
							})(e, r, t)),
					  (r = rp(e, r, t)),
					  (r = Ve.value = di(e, r, t)),
					  (r = Ve.valueEnd =
							(function qb(e, n, t) {
								let r = -1,
									i = -1,
									o = -1,
									s = n,
									a = s;
								for (; s < t; ) {
									const l = e.charCodeAt(s++);
									if (59 === l) return a;
									34 === l || 39 === l
										? (a = s = ip(e, l, s, t))
										: n === s - 4 && 85 === o && 82 === i && 76 === r && 40 === l
										? (a = s = ip(e, 41, s, t))
										: l > 32 && (a = s),
										(o = i),
										(i = r),
										(r = -33 & l);
								}
								return a;
							})(e, r, t)),
					  rp(e, r, t));
			}
			function np(e) {
				(Ve.key = 0), (Ve.keyEnd = 0), (Ve.value = 0), (Ve.valueEnd = 0), (Ve.textEnd = e.length);
			}
			function di(e, n, t) {
				for (; n < t && e.charCodeAt(n) <= 32; ) n++;
				return n;
			}
			function rp(e, n, t, r) {
				return (n = di(e, n, t)) < t && n++, n;
			}
			function ip(e, n, t, r) {
				let i = -1,
					o = t;
				for (; o < r; ) {
					const s = e.charCodeAt(o++);
					if (s == n && 92 !== i) return o;
					i = 92 == s && 92 === i ? 0 : s;
				}
				throw new Error();
			}
			function Ar(e, n, t) {
				return (
					(function Gt(e, n, t, r) {
						const i = D(),
							o = J(),
							s = wn(2);
						o.firstUpdatePass && ap(o, e, s, r),
							n !== G &&
								Je(i, s, n) &&
								cp(
									o,
									o.data[rt()],
									i,
									i[W],
									e,
									(i[s + 1] = (function n1(e, n) {
										return (
											null == e ||
												"" === e ||
												("string" == typeof n
													? (e += n)
													: "object" == typeof e && (e = Fe(Gn(e)))),
											e
										);
									})(n, t)),
									r,
									s,
								);
					})(e, n, t, !1),
					Ar
				);
			}
			function St(e) {
				qt(lp, Kb, e, !1);
			}
			function Kb(e, n) {
				for (
					let t = (function zb(e) {
						return np(e), tp(e, di(e, 0, Ve.textEnd));
					})(n);
					t >= 0;
					t = tp(n, t)
				)
					lp(e, Jh(n), jb(n));
			}
			function xe(e) {
				qt(e1, fn, e, !0);
			}
			function fn(e, n) {
				for (
					let t = (function $b(e) {
						return np(e), ep(e, di(e, 0, Ve.textEnd));
					})(n);
					t >= 0;
					t = ep(n, t)
				)
					wt(e, Jh(n), !0);
			}
			function qt(e, n, t, r) {
				const i = J(),
					o = wn(2);
				i.firstUpdatePass && ap(i, null, o, r);
				const s = D();
				if (t !== G && Je(s, o, t)) {
					const a = i.data[rt()];
					if (gp(a, r) && !sp(i, o)) {
						let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
						null !== l && (t = Hl(l, t || "")), Eu(i, a, s, t, r);
					} else
						!(function t1(e, n, t, r, i, o, s, a) {
							i === G && (i = ne);
							let l = 0,
								c = 0,
								u = 0 < i.length ? i[0] : null,
								g = 0 < o.length ? o[0] : null;
							for (; null !== u || null !== g; ) {
								const d = l < i.length ? i[l + 1] : void 0,
									f = c < o.length ? o[c + 1] : void 0;
								let I,
									C = null;
								u === g
									? ((l += 2), (c += 2), d !== f && ((C = g), (I = f)))
									: null === g || (null !== u && u < g)
									? ((l += 2), (C = u))
									: ((c += 2), (C = g), (I = f)),
									null !== C && cp(e, n, t, r, C, I, s, a),
									(u = l < i.length ? i[l] : null),
									(g = c < o.length ? o[c] : null);
							}
						})(
							i,
							a,
							s,
							s[W],
							s[o + 1],
							(s[o + 1] = (function Jb(e, n, t) {
								if (null == t || "" === t) return ne;
								const r = [],
									i = Gn(t);
								if (Array.isArray(i)) for (let o = 0; o < i.length; o++) e(r, i[o], !0);
								else if ("object" == typeof i) for (const o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
								else "string" == typeof i && n(r, i);
								return r;
							})(e, n, t)),
							r,
							o,
						);
				}
			}
			function sp(e, n) {
				return n >= e.expandoStartIndex;
			}
			function ap(e, n, t, r) {
				const i = e.data;
				if (null === i[t + 1]) {
					const o = i[rt()],
						s = sp(e, t);
					gp(o, r) && null === n && !s && (n = !1),
						(n = (function Zb(e, n, t, r) {
							const i = (function oc(e) {
								const n = U.lFrame.currentDirectiveIndex;
								return -1 === n ? null : e[n];
							})(e);
							let o = r ? n.residualClasses : n.residualStyles;
							if (null === i)
								0 === (r ? n.classBindings : n.styleBindings) &&
									((t = To((t = Nu(null, e, n, t, r)), n.attrs, r)), (o = null));
							else {
								const s = n.directiveStylingLast;
								if (-1 === s || e[s] !== i)
									if (((t = Nu(i, e, n, t, r)), null === o)) {
										let l = (function Yb(e, n, t) {
											const r = t ? n.classBindings : n.styleBindings;
											if (0 !== pr(r)) return e[Kn(r)];
										})(e, n, r);
										void 0 !== l &&
											Array.isArray(l) &&
											((l = Nu(null, e, n, l[1], r)),
											(l = To(l, n.attrs, r)),
											(function Qb(e, n, t, r) {
												e[Kn(t ? n.classBindings : n.styleBindings)] = r;
											})(e, n, r, l));
									} else
										o = (function Xb(e, n, t) {
											let r;
											const i = n.directiveEnd;
											for (let o = 1 + n.directiveStylingLast; o < i; o++)
												r = To(r, e[o].hostAttrs, t);
											return To(r, n.attrs, t);
										})(e, n, r);
							}
							return void 0 !== o && (r ? (n.residualClasses = o) : (n.residualStyles = o)), t;
						})(i, o, n, r)),
						(function Vb(e, n, t, r, i, o) {
							let s = o ? n.classBindings : n.styleBindings,
								a = Kn(s),
								l = pr(s);
							e[r] = t;
							let u,
								c = !1;
							if (
								(Array.isArray(t) ? ((u = t[1]), (null === u || qr(t, u) > 0) && (c = !0)) : (u = t), i)
							)
								if (0 !== l) {
									const d = Kn(e[a + 1]);
									(e[r + 1] = Na(d, a)),
										0 !== d && (e[d + 1] = Tu(e[d + 1], r)),
										(e[a + 1] = (function kb(e, n) {
											return (131071 & e) | (n << 17);
										})(e[a + 1], r));
								} else (e[r + 1] = Na(a, 0)), 0 !== a && (e[a + 1] = Tu(e[a + 1], r)), (a = r);
							else (e[r + 1] = Na(l, 0)), 0 === a ? (a = r) : (e[l + 1] = Tu(e[l + 1], r)), (l = r);
							c && (e[r + 1] = bu(e[r + 1])),
								Xh(e, u, r, !0),
								Xh(e, u, r, !1),
								(function Bb(e, n, t, r, i) {
									const o = i ? e.residualClasses : e.residualStyles;
									null != o && "string" == typeof n && qr(o, n) >= 0 && (t[r + 1] = Mu(t[r + 1]));
								})(n, u, e, r, o),
								(s = Na(a, l)),
								o ? (n.classBindings = s) : (n.styleBindings = s);
						})(i, o, n, t, s, r);
				}
			}
			function Nu(e, n, t, r, i) {
				let o = null;
				const s = t.directiveEnd;
				let a = t.directiveStylingLast;
				for (
					-1 === a ? (a = t.directiveStart) : a++;
					a < s && ((o = n[a]), (r = To(r, o.hostAttrs, i)), o !== e);

				)
					a++;
				return null !== e && (t.directiveStylingLast = a), r;
			}
			function To(e, n, t) {
				const r = t ? 1 : 2;
				let i = -1;
				if (null !== n)
					for (let o = 0; o < n.length; o++) {
						const s = n[o];
						"number" == typeof s
							? (i = s)
							: i === r &&
							  (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]), wt(e, s, !!t || n[++o]));
					}
				return void 0 === e ? null : e;
			}
			function lp(e, n, t) {
				wt(e, n, Gn(t));
			}
			function e1(e, n, t) {
				const r = String(n);
				"" !== r && !r.includes(" ") && wt(e, r, t);
			}
			function cp(e, n, t, r, i, o, s, a) {
				if (!(3 & n.type)) return;
				const l = e.data,
					c = l[a + 1],
					u = (function Hb(e) {
						return 1 == (1 & e);
					})(c)
						? up(l, n, t, i, pr(c), s)
						: void 0;
				xa(u) ||
					(xa(o) ||
						((function Fb(e) {
							return 2 == (2 & e);
						})(c) &&
							(o = up(l, null, t, i, a, s))),
					(function q0(e, n, t, r, i) {
						if (n) i ? e.addClass(t, r) : e.removeClass(t, r);
						else {
							let o = -1 === r.indexOf("-") ? void 0 : ht.DashCase;
							null == i
								? e.removeStyle(t, r, o)
								: ("string" == typeof i &&
										i.endsWith("!important") &&
										((i = i.slice(0, -10)), (o |= ht.Important)),
								  e.setStyle(t, r, i, o));
						}
					})(r, s, Rs(rt(), t), i, o));
			}
			function up(e, n, t, r, i, o) {
				const s = null === n;
				let a;
				for (; i > 0; ) {
					const l = e[i],
						c = Array.isArray(l),
						u = c ? l[1] : l,
						g = null === u;
					let d = t[i + 1];
					d === G && (d = g ? ne : void 0);
					let f = g ? pc(d, r) : u === r ? d : void 0;
					if ((c && !xa(f) && (f = pc(l, r)), xa(f) && ((a = f), s))) return a;
					const C = e[i + 1];
					i = s ? Kn(C) : pr(C);
				}
				if (null !== n) {
					let l = o ? n.residualClasses : n.residualStyles;
					null != l && (a = pc(l, r));
				}
				return a;
			}
			function xa(e) {
				return void 0 !== e;
			}
			function gp(e, n) {
				return 0 != (e.flags & (n ? 8 : 16));
			}
			function Ft(e, n = "") {
				const t = D(),
					r = J(),
					i = e + Y,
					o = r.firstCreatePass ? ni(r, i, 1, n, null) : r.data[i],
					s = dp(r, t, o, n, e);
				(t[i] = s), Ps() && na(r, t, s, o), an(o, !1);
			}
			let dp = (e, n, t, r, i) => (
				zn(!0),
				(function Js(e, n) {
					return e.createText(n);
				})(n[W], r)
			);
			function fi(e) {
				return mr("", e, ""), fi;
			}
			function mr(e, n, t) {
				const r = D(),
					i = ii(r, e, n, t);
				return (
					i !== G &&
						(function Mn(e, n, t) {
							const r = Rs(n, e);
							!(function jC(e, n, t) {
								e.setValue(n, t);
							})(e[W], r, t);
						})(r, rt(), i),
					mr
				);
			}
			const Ii = "en-US";
			let Op = Ii;
			class hi {}
			class sA {}
			class ku extends hi {
				constructor(n, t, r) {
					super(),
						(this._parent = t),
						(this._bootstrapComponents = []),
						(this.destroyCbs = []),
						(this.componentFactoryResolver = new hh(this));
					const i = vt(n);
					(this._bootstrapComponents = bn(i.bootstrap)),
						(this._r3Injector = ZI(
							n,
							t,
							[
								{ provide: hi, useValue: this },
								{ provide: Ia, useValue: this.componentFactoryResolver },
								...r,
							],
							Fe(n),
							new Set(["environment"]),
						)),
						this._r3Injector.resolveInjectorInitializers(),
						(this.instance = this._r3Injector.get(n));
				}
				get injector() {
					return this._r3Injector;
				}
				destroy() {
					const n = this._r3Injector;
					!n.destroyed && n.destroy(), this.destroyCbs.forEach((t) => t()), (this.destroyCbs = null);
				}
				onDestroy(n) {
					this.destroyCbs.push(n);
				}
			}
			class Hu extends sA {
				constructor(n) {
					super(), (this.moduleType = n);
				}
				create(n) {
					return new ku(this.moduleType, n, []);
				}
			}
			class aA extends hi {
				constructor(n) {
					super(), (this.componentFactoryResolver = new hh(this)), (this.instance = null);
					const t = new qc(
						[
							...n.providers,
							{ provide: hi, useValue: this },
							{ provide: Ia, useValue: this.componentFactoryResolver },
						],
						n.parent || ca(),
						n.debugName,
						new Set(["environment"]),
					);
					(this.injector = t), n.runEnvironmentInitializers && t.resolveInjectorInitializers();
				}
				destroy() {
					this.injector.destroy();
				}
				onDestroy(n) {
					this.injector.onDestroy(n);
				}
			}
			function Vu(e, n, t = null) {
				return new aA({ providers: e, parent: n, debugName: t, runEnvironmentInitializers: !0 }).injector;
			}
			let ST = (() => {
				class e {
					constructor(t) {
						(this._injector = t), (this.cachedInjectors = new Map());
					}
					getOrCreateStandaloneInjector(t) {
						if (!t.standalone) return null;
						if (!this.cachedInjectors.has(t)) {
							const r = AI(0, t.type),
								i = r.length > 0 ? Vu([r], this._injector, `Standalone[${t.type.name}]`) : null;
							this.cachedInjectors.set(t, i);
						}
						return this.cachedInjectors.get(t);
					}
					ngOnDestroy() {
						try {
							for (const t of this.cachedInjectors.values()) null !== t && t.destroy();
						} finally {
							this.cachedInjectors.clear();
						}
					}
				}
				return (e.ɵprov = L({ token: e, providedIn: "environment", factory: () => new e(O(cn)) })), e;
			})();
			function xn(e) {
				e.getStandaloneInjector = (n) => n.get(ST).getOrCreateStandaloneInjector(e);
			}
			function Re(e, n, t, r) {
				return (function hA(e, n, t, r, i, o) {
					const s = n + t;
					return Je(e, s, i) ? gn(e, s + 1, o ? r.call(o, i) : r(i)) : Oo(e, s + 1);
				})(D(), nt(), e, n, t, r);
			}
			function Rn(e, n, t, r, i) {
				return (function pA(e, n, t, r, i, o, s) {
					const a = n + t;
					return Cr(e, a, i, o) ? gn(e, a + 2, s ? r.call(s, i, o) : r(i, o)) : Oo(e, a + 2);
				})(D(), nt(), e, n, t, r, i);
			}
			function Uu(e, n, t, r, i, o) {
				return (function AA(e, n, t, r, i, o, s, a) {
					const l = n + t;
					return (function Ea(e, n, t, r, i) {
						const o = Cr(e, n, t, r);
						return Je(e, n + 2, i) || o;
					})(e, l, i, o, s)
						? gn(e, l + 3, a ? r.call(a, i, o, s) : r(i, o, s))
						: Oo(e, l + 3);
				})(D(), nt(), e, n, t, r, i, o);
			}
			function IA(e, n, t, r, i, o, s) {
				return (function mA(e, n, t, r, i, o, s, a, l) {
					const c = n + t;
					return (function Lt(e, n, t, r, i, o) {
						const s = Cr(e, n, t, r);
						return Cr(e, n + 2, i, o) || s;
					})(e, c, i, o, s, a)
						? gn(e, c + 4, l ? r.call(l, i, o, s, a) : r(i, o, s, a))
						: Oo(e, c + 4);
				})(D(), nt(), e, n, t, r, i, o, s);
			}
			function Oo(e, n) {
				const t = e[n];
				return t === G ? void 0 : t;
			}
			function ju(e) {
				return (n) => {
					setTimeout(e, void 0, n);
				};
			}
			const re = class qT extends xt {
				constructor(n = !1) {
					super(), (this.__isAsync = n);
				}
				emit(n) {
					super.next(n);
				}
				subscribe(n, t, r) {
					let i = n,
						o = t || (() => null),
						s = r;
					if (n && "object" == typeof n) {
						const l = n;
						(i = l.next?.bind(l)), (o = l.error?.bind(l)), (s = l.complete?.bind(l));
					}
					this.__isAsync && ((o = ju(o)), i && (i = ju(i)), s && (s = ju(s)));
					const a = super.subscribe({ next: i, error: o, complete: s });
					return n instanceof Nt && n.add(a), a;
				}
			};
			function KT() {
				return this._results[Symbol.iterator]();
			}
			class $u {
				get changes() {
					return this._changes || (this._changes = new re());
				}
				constructor(n = !1) {
					(this._emitDistinctChangesOnly = n),
						(this.dirty = !0),
						(this._results = []),
						(this._changesDetected = !1),
						(this._changes = null),
						(this.length = 0),
						(this.first = void 0),
						(this.last = void 0);
					const t = $u.prototype;
					t[Symbol.iterator] || (t[Symbol.iterator] = KT);
				}
				get(n) {
					return this._results[n];
				}
				map(n) {
					return this._results.map(n);
				}
				filter(n) {
					return this._results.filter(n);
				}
				find(n) {
					return this._results.find(n);
				}
				reduce(n, t) {
					return this._results.reduce(n, t);
				}
				forEach(n) {
					this._results.forEach(n);
				}
				some(n) {
					return this._results.some(n);
				}
				toArray() {
					return this._results.slice();
				}
				toString() {
					return this._results.toString();
				}
				reset(n, t) {
					const r = this;
					r.dirty = !1;
					const i = (function Ot(e) {
						return e.flat(Number.POSITIVE_INFINITY);
					})(n);
					(this._changesDetected = !(function Zw(e, n, t) {
						if (e.length !== n.length) return !1;
						for (let r = 0; r < e.length; r++) {
							let i = e[r],
								o = n[r];
							if ((t && ((i = t(i)), (o = t(o))), o !== i)) return !1;
						}
						return !0;
					})(r._results, i, t)) &&
						((r._results = i), (r.length = i.length), (r.last = i[this.length - 1]), (r.first = i[0]));
				}
				notifyOnChanges() {
					this._changes &&
						(this._changesDetected || !this._emitDistinctChangesOnly) &&
						this._changes.emit(this);
				}
				setDirty() {
					this.dirty = !0;
				}
				destroy() {
					this.changes.complete(), this.changes.unsubscribe();
				}
			}
			let Cn = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = QT), e;
			})();
			const ZT = Cn,
				YT = class extends ZT {
					constructor(n, t, r) {
						super(), (this._declarationLView = n), (this._declarationTContainer = t), (this.elementRef = r);
					}
					get ssrId() {
						return this._declarationTContainer.tView?.ssrId || null;
					}
					createEmbeddedView(n, t) {
						return this.createEmbeddedViewImpl(n, t, null);
					}
					createEmbeddedViewImpl(n, t, r) {
						const s = this._declarationTContainer.tView,
							a = ma(
								this._declarationLView,
								s,
								n,
								4096 & this._declarationLView[z] ? 4096 : 16,
								null,
								s.declTNode,
								null,
								null,
								null,
								t || null,
								r || null,
							);
						a[Zi] = this._declarationLView[this._declarationTContainer.index];
						const c = this._declarationLView[nn];
						return null !== c && (a[nn] = c.createEmbeddedView(s)), Au(s, a, n), new vo(a);
					}
				};
			function QT() {
				return Fa(Ke(), D());
			}
			function Fa(e, n) {
				return 4 & e.type ? new YT(n, e, Jr(e, n)) : null;
			}
			let Kt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = iM), e;
			})();
			function iM() {
				return SA(Ke(), D());
			}
			const oM = Kt,
				wA = class extends oM {
					constructor(n, t, r) {
						super(), (this._lContainer = n), (this._hostTNode = t), (this._hostLView = r);
					}
					get element() {
						return Jr(this._hostTNode, this._hostLView);
					}
					get injector() {
						return new jr(this._hostTNode, this._hostLView);
					}
					get parentInjector() {
						const n = fc(this._hostTNode, this._hostLView);
						if (sC(n)) {
							const t = Hs(n, this._hostLView),
								r = ks(n);
							return new jr(t[T].data[r + 8], t);
						}
						return new jr(null, this._hostLView);
					}
					clear() {
						for (; this.length > 0; ) this.remove(this.length - 1);
					}
					get(n) {
						const t = EA(this._lContainer);
						return (null !== t && t[n]) || null;
					}
					get length() {
						return this._lContainer.length - Qe;
					}
					createEmbeddedView(n, t, r) {
						let i, o;
						"number" == typeof r ? (i = r) : null != r && ((i = r.index), (o = r.injector));
						const a = n.createEmbeddedViewImpl(t || {}, o, null);
						return this.insertImpl(a, i, false), a;
					}
					createComponent(n, t, r, i, o) {
						const s =
							n &&
							!(function to(e) {
								return "function" == typeof e;
							})(n);
						let a;
						if (s) a = t;
						else {
							const I = t || {};
							(a = I.index),
								(r = I.injector),
								(i = I.projectableNodes),
								(o = I.environmentInjector || I.ngModuleRef);
						}
						const l = s ? n : new _o(oe(n)),
							c = r || this.parentInjector;
						if (!o && null == l.ngModule) {
							const p = (s ? c : this.parentInjector).get(cn, null);
							p && (o = p);
						}
						oe(l.componentType ?? {});
						const f = l.create(c, i, null, o);
						return this.insertImpl(f.hostView, a, false), f;
					}
					insert(n, t) {
						return this.insertImpl(n, t, !1);
					}
					insertImpl(n, t, r) {
						const i = n._lView,
							o = i[T];
						if (
							(function fw(e) {
								return Ct(e[pe]);
							})(i)
						) {
							const l = this.indexOf(n);
							if (-1 !== l) this.detach(l);
							else {
								const c = i[pe],
									u = new wA(c, c[Ye], c[pe]);
								u.detach(u.indexOf(n));
							}
						}
						const s = this._adjustIndex(t),
							a = this._lContainer;
						if (
							((function V0(e, n, t, r) {
								const i = Qe + r,
									o = t.length;
								r > 0 && (t[i - 1][$t] = n),
									r < o - Qe ? ((n[$t] = t[i]), AC(t, Qe + r, n)) : (t.push(n), (n[$t] = null)),
									(n[pe] = t);
								const s = n[Zi];
								null !== s &&
									t !== s &&
									(function B0(e, n) {
										const t = e[kr];
										n[Se] !== n[pe][pe][Se] && (e[Ef] = !0), null === t ? (e[kr] = [n]) : t.push(n);
									})(s, n);
								const a = n[nn];
								null !== a && a.insertView(e), (n[z] |= 128);
							})(o, i, a, s),
							!r)
						) {
							const l = Rc(s, a),
								c = i[W],
								u = ta(c, a[rn]);
							null !== u &&
								(function F0(e, n, t, r, i, o) {
									(r[ke] = i), (r[Ye] = n), lo(e, r, t, 1, i, o);
								})(o, a[Ye], c, i, u, l);
						}
						return n.attachToViewContainerRef(), AC(Wu(a), s, n), n;
					}
					move(n, t) {
						return this.insert(n, t);
					}
					indexOf(n) {
						const t = EA(this._lContainer);
						return null !== t ? t.indexOf(n) : -1;
					}
					remove(n) {
						const t = this._adjustIndex(n, -1),
							r = Tc(this._lContainer, t);
						r && ($s(Wu(this._lContainer), t), zC(r[T], r));
					}
					detach(n) {
						const t = this._adjustIndex(n, -1),
							r = Tc(this._lContainer, t);
						return r && null != $s(Wu(this._lContainer), t) ? new vo(r) : null;
					}
					_adjustIndex(n, t = 0) {
						return n ?? this.length + t;
					}
				};
			function EA(e) {
				return e[8];
			}
			function Wu(e) {
				return e[8] || (e[8] = []);
			}
			function SA(e, n) {
				let t;
				const r = n[e.index];
				return (
					Ct(r) ? (t = r) : ((t = oh(r, n, null, e)), (n[e.index] = t), ya(n, t)),
					bA(t, n, e, r),
					new wA(t, e, n)
				);
			}
			let bA = function TA(e, n, t, r) {
				if (e[rn]) return;
				let i;
				(i =
					8 & t.type
						? fe(r)
						: (function sM(e, n) {
								const t = e[W],
									r = t.createComment(""),
									i = It(n, e);
								return (
									gr(
										t,
										ta(t, i),
										r,
										(function z0(e, n) {
											return e.nextSibling(n);
										})(t, i),
										!1,
									),
									r
								);
						  })(n, t)),
					(e[rn] = i);
			};
			class Gu {
				constructor(n) {
					(this.queryList = n), (this.matches = null);
				}
				clone() {
					return new Gu(this.queryList);
				}
				setDirty() {
					this.queryList.setDirty();
				}
			}
			class qu {
				constructor(n = []) {
					this.queries = n;
				}
				createEmbeddedView(n) {
					const t = n.queries;
					if (null !== t) {
						const r = null !== n.contentQueries ? n.contentQueries[0] : t.length,
							i = [];
						for (let o = 0; o < r; o++) {
							const s = t.getByIndex(o);
							i.push(this.queries[s.indexInDeclarationView].clone());
						}
						return new qu(i);
					}
					return null;
				}
				insertView(n) {
					this.dirtyQueriesWithMatches(n);
				}
				detachView(n) {
					this.dirtyQueriesWithMatches(n);
				}
				dirtyQueriesWithMatches(n) {
					for (let t = 0; t < this.queries.length; t++)
						null !== PA(n, t).matches && this.queries[t].setDirty();
				}
			}
			class MA {
				constructor(n, t, r = null) {
					(this.predicate = n), (this.flags = t), (this.read = r);
				}
			}
			class Ku {
				constructor(n = []) {
					this.queries = n;
				}
				elementStart(n, t) {
					for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(n, t);
				}
				elementEnd(n) {
					for (let t = 0; t < this.queries.length; t++) this.queries[t].elementEnd(n);
				}
				embeddedTView(n) {
					let t = null;
					for (let r = 0; r < this.length; r++) {
						const i = null !== t ? t.length : 0,
							o = this.getByIndex(r).embeddedTView(n, i);
						o && ((o.indexInDeclarationView = r), null !== t ? t.push(o) : (t = [o]));
					}
					return null !== t ? new Ku(t) : null;
				}
				template(n, t) {
					for (let r = 0; r < this.queries.length; r++) this.queries[r].template(n, t);
				}
				getByIndex(n) {
					return this.queries[n];
				}
				get length() {
					return this.queries.length;
				}
				track(n) {
					this.queries.push(n);
				}
			}
			class Zu {
				constructor(n, t = -1) {
					(this.metadata = n),
						(this.matches = null),
						(this.indexInDeclarationView = -1),
						(this.crossesNgTemplate = !1),
						(this._appliesToNextNode = !0),
						(this._declarationNodeIndex = t);
				}
				elementStart(n, t) {
					this.isApplyingToNode(t) && this.matchTNode(n, t);
				}
				elementEnd(n) {
					this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
				}
				template(n, t) {
					this.elementStart(n, t);
				}
				embeddedTView(n, t) {
					return this.isApplyingToNode(n)
						? ((this.crossesNgTemplate = !0), this.addMatch(-n.index, t), new Zu(this.metadata))
						: null;
				}
				isApplyingToNode(n) {
					if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
						const t = this._declarationNodeIndex;
						let r = n.parent;
						for (; null !== r && 8 & r.type && r.index !== t; ) r = r.parent;
						return t === (null !== r ? r.index : -1);
					}
					return this._appliesToNextNode;
				}
				matchTNode(n, t) {
					const r = this.metadata.predicate;
					if (Array.isArray(r))
						for (let i = 0; i < r.length; i++) {
							const o = r[i];
							this.matchTNodeWithReadOption(n, t, cM(t, o)),
								this.matchTNodeWithReadOption(n, t, Us(t, n, o, !1, !1));
						}
					else
						r === Cn
							? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
							: this.matchTNodeWithReadOption(n, t, Us(t, n, r, !1, !1));
				}
				matchTNodeWithReadOption(n, t, r) {
					if (null !== r) {
						const i = this.metadata.read;
						if (null !== i)
							if (i === Wt || i === Kt || (i === Cn && 4 & t.type)) this.addMatch(t.index, -2);
							else {
								const o = Us(t, n, i, !1, !1);
								null !== o && this.addMatch(t.index, o);
							}
						else this.addMatch(t.index, r);
					}
				}
				addMatch(n, t) {
					null === this.matches ? (this.matches = [n, t]) : this.matches.push(n, t);
				}
			}
			function cM(e, n) {
				const t = e.localNames;
				if (null !== t) for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
				return null;
			}
			function gM(e, n, t, r) {
				return -1 === t
					? (function uM(e, n) {
							return 11 & e.type ? Jr(e, n) : 4 & e.type ? Fa(e, n) : null;
					  })(n, e)
					: -2 === t
					? (function dM(e, n, t) {
							return t === Wt ? Jr(n, e) : t === Cn ? Fa(n, e) : t === Kt ? SA(n, e) : void 0;
					  })(e, n, r)
					: ur(e, e[T], t, n);
			}
			function NA(e, n, t, r) {
				const i = n[nn].queries[r];
				if (null === i.matches) {
					const o = e.data,
						s = t.matches,
						a = [];
					for (let l = 0; l < s.length; l += 2) {
						const c = s[l];
						a.push(c < 0 ? null : gM(n, o[c], s[l + 1], t.metadata.read));
					}
					i.matches = a;
				}
				return i.matches;
			}
			function Yu(e, n, t, r) {
				const i = e.queries.getByIndex(t),
					o = i.matches;
				if (null !== o) {
					const s = NA(e, n, i, t);
					for (let a = 0; a < o.length; a += 2) {
						const l = o[a];
						if (l > 0) r.push(s[a / 2]);
						else {
							const c = o[a + 1],
								u = n[-l];
							for (let g = Qe; g < u.length; g++) {
								const d = u[g];
								d[Zi] === d[pe] && Yu(d[T], d, c, r);
							}
							if (null !== u[kr]) {
								const g = u[kr];
								for (let d = 0; d < g.length; d++) {
									const f = g[d];
									Yu(f[T], f, c, r);
								}
							}
						}
					}
				}
				return r;
			}
			function bt(e) {
				const n = D(),
					t = J(),
					r = Yf();
				sc(r + 1);
				const i = PA(t, r);
				if (
					e.dirty &&
					(function gw(e) {
						return 4 == (4 & e[z]);
					})(n) ===
						(2 == (2 & i.metadata.flags))
				) {
					if (null === i.matches) e.reset([]);
					else {
						const o = i.crossesNgTemplate ? Yu(t, n, r, []) : NA(t, n, i, r);
						e.reset(o, $E), e.notifyOnChanges();
					}
					return !0;
				}
				return !1;
			}
			function pi(e, n, t) {
				const r = J();
				r.firstCreatePass && (RA(r, new MA(e, n, t), -1), 2 == (2 & n) && (r.staticViewQueries = !0)),
					xA(r, D(), n);
			}
			function Zn(e, n, t, r) {
				const i = J();
				if (i.firstCreatePass) {
					const o = Ke();
					RA(i, new MA(n, t, r), o.index),
						(function CM(e, n) {
							const t = e.contentQueries || (e.contentQueries = []);
							n !== (t.length ? t[t.length - 1] : -1) && t.push(e.queries.length - 1, n);
						})(i, e),
						2 == (2 & t) && (i.staticContentQueries = !0);
				}
				xA(i, D(), t);
			}
			function Tt() {
				return (function fM(e, n) {
					return e[nn].queries[n].queryList;
				})(D(), Yf());
			}
			function xA(e, n, t) {
				const r = new $u(4 == (4 & t));
				(function dS(e, n, t, r) {
					const i = ah(n);
					i.push(t), e.firstCreatePass && lh(e).push(r, i.length - 1);
				})(e, n, r, r.destroy),
					null === n[nn] && (n[nn] = new qu()),
					n[nn].queries.push(new Gu(r));
			}
			function RA(e, n, t) {
				null === e.queries && (e.queries = new Ku()), e.queries.track(new Zu(n, t));
			}
			function PA(e, n) {
				return e.queries.getByIndex(n);
			}
			function Fo(e, n) {
				return Fa(e, n);
			}
			const ng = new R("Application Initializer");
			let rg = (() => {
					class e {
						constructor() {
							(this.initialized = !1),
								(this.done = !1),
								(this.donePromise = new Promise((t, r) => {
									(this.resolve = t), (this.reject = r);
								})),
								(this.appInits = M(ng, { optional: !0 }) ?? []);
						}
						runInitializers() {
							if (this.initialized) return;
							const t = [];
							for (const i of this.appInits) {
								const o = i();
								if (Ma(o)) t.push(o);
								else if (Vh(o)) {
									const s = new Promise((a, l) => {
										o.subscribe({ complete: a, error: l });
									});
									t.push(s);
								}
							}
							const r = () => {
								(this.done = !0), this.resolve();
							};
							Promise.all(t)
								.then(() => {
									r();
								})
								.catch((i) => {
									this.reject(i);
								}),
								0 === t.length && r(),
								(this.initialized = !0);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				YA = (() => {
					class e {
						log(t) {
							console.log(t);
						}
						warn(t) {
							console.warn(t);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})();
			const Pn = new R("LocaleId", {
				providedIn: "root",
				factory: () =>
					M(Pn, k.Optional | k.SkipSelf) ||
					(function LM() {
						return (typeof $localize < "u" && $localize.locale) || Ii;
					})(),
			});
			let Ha = (() => {
				class e {
					constructor() {
						(this.taskId = 0), (this.pendingTasks = new Set()), (this.hasPendingTasks = new Rt(!1));
					}
					add() {
						this.hasPendingTasks.next(!0);
						const t = this.taskId++;
						return this.pendingTasks.add(t), t;
					}
					remove(t) {
						this.pendingTasks.delete(t), 0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
					}
					ngOnDestroy() {
						this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class kM {
				constructor(n, t) {
					(this.ngModuleFactory = n), (this.componentFactories = t);
				}
			}
			let QA = (() => {
				class e {
					compileModuleSync(t) {
						return new Hu(t);
					}
					compileModuleAsync(t) {
						return Promise.resolve(this.compileModuleSync(t));
					}
					compileModuleAndAllComponentsSync(t) {
						const r = this.compileModuleSync(t),
							o = bn(vt(t).declarations).reduce((s, a) => {
								const l = oe(a);
								return l && s.push(new _o(l)), s;
							}, []);
						return new kM(r, o);
					}
					compileModuleAndAllComponentsAsync(t) {
						return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
					}
					clearCache() {}
					clearCacheFor(t) {}
					getModuleId(t) {}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function em(...e) {}
			class Ce {
				constructor({
					enableLongStackTrace: n = !1,
					shouldCoalesceEventChangeDetection: t = !1,
					shouldCoalesceRunChangeDetection: r = !1,
				}) {
					if (
						((this.hasPendingMacrotasks = !1),
						(this.hasPendingMicrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new re(!1)),
						(this.onMicrotaskEmpty = new re(!1)),
						(this.onStable = new re(!1)),
						(this.onError = new re(!1)),
						typeof Zone > "u")
					)
						throw new w(908, !1);
					Zone.assertZonePatched();
					const i = this;
					(i._nesting = 0),
						(i._outer = i._inner = Zone.current),
						Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
						n && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
						(i.shouldCoalesceEventChangeDetection = !r && t),
						(i.shouldCoalesceRunChangeDetection = r),
						(i.lastRequestAnimationFrameId = -1),
						(i.nativeRequestAnimationFrame = (function BM() {
							const e = "function" == typeof ge.requestAnimationFrame;
							let n = ge[e ? "requestAnimationFrame" : "setTimeout"],
								t = ge[e ? "cancelAnimationFrame" : "clearTimeout"];
							if (typeof Zone < "u" && n && t) {
								const r = n[Zone.__symbol__("OriginalDelegate")];
								r && (n = r);
								const i = t[Zone.__symbol__("OriginalDelegate")];
								i && (t = i);
							}
							return { nativeRequestAnimationFrame: n, nativeCancelAnimationFrame: t };
						})().nativeRequestAnimationFrame),
						(function $M(e) {
							const n = () => {
								!(function jM(e) {
									e.isCheckStableRunning ||
										-1 !== e.lastRequestAnimationFrameId ||
										((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(ge, () => {
											e.fakeTopEventTask ||
												(e.fakeTopEventTask = Zone.root.scheduleEventTask(
													"fakeTopEventTask",
													() => {
														(e.lastRequestAnimationFrameId = -1),
															og(e),
															(e.isCheckStableRunning = !0),
															ig(e),
															(e.isCheckStableRunning = !1);
													},
													void 0,
													() => {},
													() => {},
												)),
												e.fakeTopEventTask.invoke();
										})),
										og(e));
								})(e);
							};
							e._inner = e._inner.fork({
								name: "angular",
								properties: { isAngularZone: !0 },
								onInvokeTask: (t, r, i, o, s, a) => {
									try {
										return tm(e), t.invokeTask(i, o, s, a);
									} finally {
										((e.shouldCoalesceEventChangeDetection && "eventTask" === o.type) ||
											e.shouldCoalesceRunChangeDetection) &&
											n(),
											nm(e);
									}
								},
								onInvoke: (t, r, i, o, s, a, l) => {
									try {
										return tm(e), t.invoke(i, o, s, a, l);
									} finally {
										e.shouldCoalesceRunChangeDetection && n(), nm(e);
									}
								},
								onHasTask: (t, r, i, o) => {
									t.hasTask(i, o),
										r === i &&
											("microTask" == o.change
												? ((e._hasPendingMicrotasks = o.microTask), og(e), ig(e))
												: "macroTask" == o.change && (e.hasPendingMacrotasks = o.macroTask));
								},
								onHandleError: (t, r, i, o) => (
									t.handleError(i, o), e.runOutsideAngular(() => e.onError.emit(o)), !1
								),
							});
						})(i);
				}
				static isInAngularZone() {
					return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
				}
				static assertInAngularZone() {
					if (!Ce.isInAngularZone()) throw new w(909, !1);
				}
				static assertNotInAngularZone() {
					if (Ce.isInAngularZone()) throw new w(909, !1);
				}
				run(n, t, r) {
					return this._inner.run(n, t, r);
				}
				runTask(n, t, r, i) {
					const o = this._inner,
						s = o.scheduleEventTask("NgZoneEvent: " + i, n, UM, em, em);
					try {
						return o.runTask(s, t, r);
					} finally {
						o.cancelTask(s);
					}
				}
				runGuarded(n, t, r) {
					return this._inner.runGuarded(n, t, r);
				}
				runOutsideAngular(n) {
					return this._outer.run(n);
				}
			}
			const UM = {};
			function ig(e) {
				if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
					try {
						e._nesting++, e.onMicrotaskEmpty.emit(null);
					} finally {
						if ((e._nesting--, !e.hasPendingMicrotasks))
							try {
								e.runOutsideAngular(() => e.onStable.emit(null));
							} finally {
								e.isStable = !0;
							}
					}
			}
			function og(e) {
				e.hasPendingMicrotasks = !!(
					e._hasPendingMicrotasks ||
					((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
						-1 !== e.lastRequestAnimationFrameId)
				);
			}
			function tm(e) {
				e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
			}
			function nm(e) {
				e._nesting--, ig(e);
			}
			class zM {
				constructor() {
					(this.hasPendingMicrotasks = !1),
						(this.hasPendingMacrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new re()),
						(this.onMicrotaskEmpty = new re()),
						(this.onStable = new re()),
						(this.onError = new re());
				}
				run(n, t, r) {
					return n.apply(t, r);
				}
				runGuarded(n, t, r) {
					return n.apply(t, r);
				}
				runOutsideAngular(n) {
					return n();
				}
				runTask(n, t, r, i) {
					return n.apply(t, r);
				}
			}
			const rm = new R("", { providedIn: "root", factory: im });
			function im() {
				const e = M(Ce);
				let n = !0;
				return (function cD(...e) {
					const n = ji(e),
						t = (function nD(e, n) {
							return "number" == typeof Fl(e) ? e.pop() : n;
						})(e, 1 / 0),
						r = e;
					return r.length ? (1 === r.length ? Bt(r[0]) : Nr(t)($e(r, n))) : Jt;
				})(
					new Me((i) => {
						(n = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
							e.runOutsideAngular(() => {
								i.next(n), i.complete();
							});
					}),
					new Me((i) => {
						let o;
						e.runOutsideAngular(() => {
							o = e.onStable.subscribe(() => {
								Ce.assertNotInAngularZone(),
									queueMicrotask(() => {
										!n &&
											!e.hasPendingMacrotasks &&
											!e.hasPendingMicrotasks &&
											((n = !0), i.next(!0));
									});
							});
						});
						const s = e.onUnstable.subscribe(() => {
							Ce.assertInAngularZone(),
								n &&
									((n = !1),
									e.runOutsideAngular(() => {
										i.next(!1);
									}));
						});
						return () => {
							o.unsubscribe(), s.unsubscribe();
						};
					}).pipe(Jd()),
				);
			}
			const om = new R(""),
				Va = new R("");
			let lg,
				sg = (() => {
					class e {
						constructor(t, r, i) {
							(this._ngZone = t),
								(this.registry = r),
								(this._pendingCount = 0),
								(this._isZoneStable = !0),
								(this._didWork = !1),
								(this._callbacks = []),
								(this.taskTrackingZone = null),
								lg ||
									((function WM(e) {
										lg = e;
									})(i),
									i.addToWindow(r)),
								this._watchAngularEvents(),
								t.run(() => {
									this.taskTrackingZone =
										typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
								});
						}
						_watchAngularEvents() {
							this._ngZone.onUnstable.subscribe({
								next: () => {
									(this._didWork = !0), (this._isZoneStable = !1);
								},
							}),
								this._ngZone.runOutsideAngular(() => {
									this._ngZone.onStable.subscribe({
										next: () => {
											Ce.assertNotInAngularZone(),
												queueMicrotask(() => {
													(this._isZoneStable = !0), this._runCallbacksIfReady();
												});
										},
									});
								});
						}
						increasePendingRequestCount() {
							return (this._pendingCount += 1), (this._didWork = !0), this._pendingCount;
						}
						decreasePendingRequestCount() {
							if (((this._pendingCount -= 1), this._pendingCount < 0))
								throw new Error("pending async requests below zero");
							return this._runCallbacksIfReady(), this._pendingCount;
						}
						isStable() {
							return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks;
						}
						_runCallbacksIfReady() {
							if (this.isStable())
								queueMicrotask(() => {
									for (; 0 !== this._callbacks.length; ) {
										let t = this._callbacks.pop();
										clearTimeout(t.timeoutId), t.doneCb(this._didWork);
									}
									this._didWork = !1;
								});
							else {
								let t = this.getPendingTasks();
								(this._callbacks = this._callbacks.filter(
									(r) => !r.updateCb || !r.updateCb(t) || (clearTimeout(r.timeoutId), !1),
								)),
									(this._didWork = !0);
							}
						}
						getPendingTasks() {
							return this.taskTrackingZone
								? this.taskTrackingZone.macroTasks.map((t) => ({
										source: t.source,
										creationLocation: t.creationLocation,
										data: t.data,
								  }))
								: [];
						}
						addCallback(t, r, i) {
							let o = -1;
							r &&
								r > 0 &&
								(o = setTimeout(() => {
									(this._callbacks = this._callbacks.filter((s) => s.timeoutId !== o)),
										t(this._didWork, this.getPendingTasks());
								}, r)),
								this._callbacks.push({ doneCb: t, timeoutId: o, updateCb: i });
						}
						whenStable(t, r, i) {
							if (i && !this.taskTrackingZone)
								throw new Error(
									'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
								);
							this.addCallback(t, r, i), this._runCallbacksIfReady();
						}
						getPendingRequestCount() {
							return this._pendingCount;
						}
						registerApplication(t) {
							this.registry.registerApplication(t, this);
						}
						unregisterApplication(t) {
							this.registry.unregisterApplication(t);
						}
						findProviders(t, r, i) {
							return [];
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(Ce), O(ag), O(Va));
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				ag = (() => {
					class e {
						constructor() {
							this._applications = new Map();
						}
						registerApplication(t, r) {
							this._applications.set(t, r);
						}
						unregisterApplication(t) {
							this._applications.delete(t);
						}
						unregisterAllApplications() {
							this._applications.clear();
						}
						getTestability(t) {
							return this._applications.get(t) || null;
						}
						getAllTestabilities() {
							return Array.from(this._applications.values());
						}
						getAllRootElements() {
							return Array.from(this._applications.keys());
						}
						findTestabilityInTree(t, r = !0) {
							return lg?.findTestabilityInTree(this, t, r) ?? null;
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})(),
				Yn = null;
			const sm = new R("AllowMultipleToken"),
				cg = new R("PlatformDestroyListeners"),
				ug = new R("appBootstrapListener");
			class lm {
				constructor(n, t) {
					(this.name = n), (this.token = t);
				}
			}
			function um(e, n, t = []) {
				const r = `Platform: ${n}`,
					i = new R(r);
				return (o = []) => {
					let s = gg();
					if (!s || s.injector.get(sm, !1)) {
						const a = [...t, ...o, { provide: i, useValue: !0 }];
						e
							? e(a)
							: (function KM(e) {
									if (Yn && !Yn.get(sm, !1)) throw new w(400, !1);
									(function am() {
										!(function tw(e) {
											xf = e;
										})(() => {
											throw new w(600, !1);
										});
									})(),
										(Yn = e);
									const n = e.get(dm);
									(function cm(e) {
										e.get(DI, null)?.forEach((t) => t());
									})(e);
							  })(
									(function gm(e = [], n) {
										return Tn.create({
											name: n,
											providers: [
												{ provide: Wc, useValue: "platform" },
												{ provide: cg, useValue: new Set([() => (Yn = null)]) },
												...e,
											],
										});
									})(a, r),
							  );
					}
					return (function YM(e) {
						const n = gg();
						if (!n) throw new w(401, !1);
						return n;
					})();
				};
			}
			function gg() {
				return Yn?.get(dm) ?? null;
			}
			let dm = (() => {
				class e {
					constructor(t) {
						(this._injector = t),
							(this._modules = []),
							(this._destroyListeners = []),
							(this._destroyed = !1);
					}
					bootstrapModuleFactory(t, r) {
						const i = (function QM(e = "zone.js", n) {
							return "noop" === e ? new zM() : "zone.js" === e ? new Ce(n) : e;
						})(
							r?.ngZone,
							(function fm(e) {
								return {
									enableLongStackTrace: !1,
									shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
									shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
								};
							})({ eventCoalescing: r?.ngZoneEventCoalescing, runCoalescing: r?.ngZoneRunCoalescing }),
						);
						return i.run(() => {
							const o = (function ET(e, n, t) {
									return new ku(e, n, t);
								})(
									t.moduleType,
									this.injector,
									(function Am(e) {
										return [
											{ provide: Ce, useFactory: e },
											{
												provide: Co,
												multi: !0,
												useFactory: () => {
													const n = M(JM, { optional: !0 });
													return () => n.initialize();
												},
											},
											{ provide: pm, useFactory: XM },
											{ provide: rm, useFactory: im },
										];
									})(() => i),
								),
								s = o.injector.get(fr, null);
							return (
								i.runOutsideAngular(() => {
									const a = i.onError.subscribe({
										next: (l) => {
											s.handleError(l);
										},
									});
									o.onDestroy(() => {
										Ba(this._modules, o), a.unsubscribe();
									});
								}),
								(function Cm(e, n, t) {
									try {
										const r = t();
										return Ma(r)
											? r.catch((i) => {
													throw (n.runOutsideAngular(() => e.handleError(i)), i);
											  })
											: r;
									} catch (r) {
										throw (n.runOutsideAngular(() => e.handleError(r)), r);
									}
								})(s, i, () => {
									const a = o.injector.get(rg);
									return (
										a.runInitializers(),
										a.donePromise.then(
											() => (
												(function Lp(e) {
													Pt(e, "Expected localeId to be defined"),
														"string" == typeof e &&
															(Op = e.toLowerCase().replace(/_/g, "-"));
												})(o.injector.get(Pn, Ii) || Ii),
												this._moduleDoBootstrap(o),
												o
											),
										)
									);
								})
							);
						});
					}
					bootstrapModule(t, r = []) {
						const i = Im({}, r);
						return (function GM(e, n, t) {
							const r = new Hu(t);
							return Promise.resolve(r);
						})(0, 0, t).then((o) => this.bootstrapModuleFactory(o, i));
					}
					_moduleDoBootstrap(t) {
						const r = t.injector.get(yi);
						if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach((i) => r.bootstrap(i));
						else {
							if (!t.instance.ngDoBootstrap) throw new w(-403, !1);
							t.instance.ngDoBootstrap(r);
						}
						this._modules.push(t);
					}
					onDestroy(t) {
						this._destroyListeners.push(t);
					}
					get injector() {
						return this._injector;
					}
					destroy() {
						if (this._destroyed) throw new w(404, !1);
						this._modules.slice().forEach((r) => r.destroy()), this._destroyListeners.forEach((r) => r());
						const t = this._injector.get(cg, null);
						t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
					}
					get destroyed() {
						return this._destroyed;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(Tn));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "platform" })),
					e
				);
			})();
			function Im(e, n) {
				return Array.isArray(n) ? n.reduce(Im, e) : { ...e, ...n };
			}
			let yi = (() => {
				class e {
					constructor() {
						(this._bootstrapListeners = []),
							(this._runningTick = !1),
							(this._destroyed = !1),
							(this._destroyListeners = []),
							(this._views = []),
							(this.internalErrorHandler = M(pm)),
							(this.zoneIsStable = M(rm)),
							(this.componentTypes = []),
							(this.components = []),
							(this.isStable = M(Ha).hasPendingTasks.pipe(
								Ut((t) => (t ? B(!1) : this.zoneIsStable)),
								(function uD(e, n = Vn) {
									return (
										(e = e ?? gD),
										Ue((t, r) => {
											let i,
												o = !0;
											t.subscribe(
												je(r, (s) => {
													const a = n(s);
													(o || !e(i, a)) && ((o = !1), (i = a), r.next(s));
												}),
											);
										})
									);
								})(),
								Jd(),
							)),
							(this._injector = M(cn));
					}
					get destroyed() {
						return this._destroyed;
					}
					get injector() {
						return this._injector;
					}
					bootstrap(t, r) {
						const i = t instanceof NI;
						if (!this._injector.get(rg).done)
							throw (
								(!i &&
									(function Rr(e) {
										const n = oe(e) || Ze(e) || ft(e);
										return null !== n && n.standalone;
									})(t),
								new w(405, !1))
							);
						let s;
						(s = i ? t : this._injector.get(Ia).resolveComponentFactory(t)),
							this.componentTypes.push(s.componentType);
						const a = (function qM(e) {
								return e.isBoundToModule;
							})(s)
								? void 0
								: this._injector.get(hi),
							c = s.create(Tn.NULL, [], r || s.selector, a),
							u = c.location.nativeElement,
							g = c.injector.get(om, null);
						return (
							g?.registerApplication(u),
							c.onDestroy(() => {
								this.detachView(c.hostView), Ba(this.components, c), g?.unregisterApplication(u);
							}),
							this._loadComponent(c),
							c
						);
					}
					tick() {
						if (this._runningTick) throw new w(101, !1);
						try {
							this._runningTick = !0;
							for (let t of this._views) t.detectChanges();
						} catch (t) {
							this.internalErrorHandler(t);
						} finally {
							this._runningTick = !1;
						}
					}
					attachView(t) {
						const r = t;
						this._views.push(r), r.attachToAppRef(this);
					}
					detachView(t) {
						const r = t;
						Ba(this._views, r), r.detachFromAppRef();
					}
					_loadComponent(t) {
						this.attachView(t.hostView), this.tick(), this.components.push(t);
						const r = this._injector.get(ug, []);
						r.push(...this._bootstrapListeners), r.forEach((i) => i(t));
					}
					ngOnDestroy() {
						if (!this._destroyed)
							try {
								this._destroyListeners.forEach((t) => t()),
									this._views.slice().forEach((t) => t.destroy());
							} finally {
								(this._destroyed = !0),
									(this._views = []),
									(this._bootstrapListeners = []),
									(this._destroyListeners = []);
							}
					}
					onDestroy(t) {
						return this._destroyListeners.push(t), () => Ba(this._destroyListeners, t);
					}
					destroy() {
						if (this._destroyed) throw new w(406, !1);
						const t = this._injector;
						t.destroy && !t.destroyed && t.destroy();
					}
					get viewCount() {
						return this._views.length;
					}
					warnIfDestroyed() {}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function Ba(e, n) {
				const t = e.indexOf(n);
				t > -1 && e.splice(t, 1);
			}
			const pm = new R("", { providedIn: "root", factory: () => M(fr).handleError.bind(void 0) });
			function XM() {
				const e = M(Ce),
					n = M(fr);
				return (t) => e.runOutsideAngular(() => n.handleError(t));
			}
			let JM = (() => {
				class e {
					constructor() {
						(this.zone = M(Ce)), (this.applicationRef = M(yi));
					}
					initialize() {
						this._onMicrotaskEmptySubscription ||
							(this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
								next: () => {
									this.zone.run(() => {
										this.applicationRef.tick();
									});
								},
							}));
					}
					ngOnDestroy() {
						this._onMicrotaskEmptySubscription?.unsubscribe();
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			let Ho = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = tN), e;
			})();
			function tN(e) {
				return (function nN(e, n, t) {
					if (sr(e) && !t) {
						const r = Dt(e.index, n);
						return new vo(r, r);
					}
					return 47 & e.type ? new vo(n[Se], n) : null;
				})(Ke(), D(), 16 == (16 & e));
			}
			class _m {
				constructor() {}
				supports(n) {
					return wa(n);
				}
				create(n) {
					return new lN(n);
				}
			}
			const aN = (e, n) => n;
			class lN {
				constructor(n) {
					(this.length = 0),
						(this._linkedRecords = null),
						(this._unlinkedRecords = null),
						(this._previousItHead = null),
						(this._itHead = null),
						(this._itTail = null),
						(this._additionsHead = null),
						(this._additionsTail = null),
						(this._movesHead = null),
						(this._movesTail = null),
						(this._removalsHead = null),
						(this._removalsTail = null),
						(this._identityChangesHead = null),
						(this._identityChangesTail = null),
						(this._trackByFn = n || aN);
				}
				forEachItem(n) {
					let t;
					for (t = this._itHead; null !== t; t = t._next) n(t);
				}
				forEachOperation(n) {
					let t = this._itHead,
						r = this._removalsHead,
						i = 0,
						o = null;
					for (; t || r; ) {
						const s = !r || (t && t.currentIndex < wm(r, i, o)) ? t : r,
							a = wm(s, i, o),
							l = s.currentIndex;
						if (s === r) i--, (r = r._nextRemoved);
						else if (((t = t._next), null == s.previousIndex)) i++;
						else {
							o || (o = []);
							const c = a - i,
								u = l - i;
							if (c != u) {
								for (let d = 0; d < c; d++) {
									const f = d < o.length ? o[d] : (o[d] = 0),
										C = f + d;
									u <= C && C < c && (o[d] = f + 1);
								}
								o[s.previousIndex] = u - c;
							}
						}
						a !== l && n(s, a, l);
					}
				}
				forEachPreviousItem(n) {
					let t;
					for (t = this._previousItHead; null !== t; t = t._nextPrevious) n(t);
				}
				forEachAddedItem(n) {
					let t;
					for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
				}
				forEachMovedItem(n) {
					let t;
					for (t = this._movesHead; null !== t; t = t._nextMoved) n(t);
				}
				forEachRemovedItem(n) {
					let t;
					for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
				}
				forEachIdentityChange(n) {
					let t;
					for (t = this._identityChangesHead; null !== t; t = t._nextIdentityChange) n(t);
				}
				diff(n) {
					if ((null == n && (n = []), !wa(n))) throw new w(900, !1);
					return this.check(n) ? this : null;
				}
				onDestroy() {}
				check(n) {
					this._reset();
					let i,
						o,
						s,
						t = this._itHead,
						r = !1;
					if (Array.isArray(n)) {
						this.length = n.length;
						for (let a = 0; a < this.length; a++)
							(o = n[a]),
								(s = this._trackByFn(a, o)),
								null !== t && Object.is(t.trackById, s)
									? (r && (t = this._verifyReinsertion(t, o, s, a)),
									  Object.is(t.item, o) || this._addIdentityChange(t, o))
									: ((t = this._mismatch(t, o, s, a)), (r = !0)),
								(t = t._next);
					} else
						(i = 0),
							(function sb(e, n) {
								if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
								else {
									const t = e[Symbol.iterator]();
									let r;
									for (; !(r = t.next()).done; ) n(r.value);
								}
							})(n, (a) => {
								(s = this._trackByFn(i, a)),
									null !== t && Object.is(t.trackById, s)
										? (r && (t = this._verifyReinsertion(t, a, s, i)),
										  Object.is(t.item, a) || this._addIdentityChange(t, a))
										: ((t = this._mismatch(t, a, s, i)), (r = !0)),
									(t = t._next),
									i++;
							}),
							(this.length = i);
					return this._truncate(t), (this.collection = n), this.isDirty;
				}
				get isDirty() {
					return (
						null !== this._additionsHead ||
						null !== this._movesHead ||
						null !== this._removalsHead ||
						null !== this._identityChangesHead
					);
				}
				_reset() {
					if (this.isDirty) {
						let n;
						for (n = this._previousItHead = this._itHead; null !== n; n = n._next)
							n._nextPrevious = n._next;
						for (n = this._additionsHead; null !== n; n = n._nextAdded) n.previousIndex = n.currentIndex;
						for (
							this._additionsHead = this._additionsTail = null, n = this._movesHead;
							null !== n;
							n = n._nextMoved
						)
							n.previousIndex = n.currentIndex;
						(this._movesHead = this._movesTail = null),
							(this._removalsHead = this._removalsTail = null),
							(this._identityChangesHead = this._identityChangesTail = null);
					}
				}
				_mismatch(n, t, r, i) {
					let o;
					return (
						null === n ? (o = this._itTail) : ((o = n._prev), this._remove(n)),
						null !== (n = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
							? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._reinsertAfter(n, o, i))
							: null !== (n = null === this._linkedRecords ? null : this._linkedRecords.get(r, i))
							? (Object.is(n.item, t) || this._addIdentityChange(n, t), this._moveAfter(n, o, i))
							: (n = this._addAfter(new cN(t, r), o, i)),
						n
					);
				}
				_verifyReinsertion(n, t, r, i) {
					let o = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
					return (
						null !== o
							? (n = this._reinsertAfter(o, n._prev, i))
							: n.currentIndex != i && ((n.currentIndex = i), this._addToMoves(n, i)),
						n
					);
				}
				_truncate(n) {
					for (; null !== n; ) {
						const t = n._next;
						this._addToRemovals(this._unlink(n)), (n = t);
					}
					null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
						null !== this._additionsTail && (this._additionsTail._nextAdded = null),
						null !== this._movesTail && (this._movesTail._nextMoved = null),
						null !== this._itTail && (this._itTail._next = null),
						null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
						null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
				}
				_reinsertAfter(n, t, r) {
					null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
					const i = n._prevRemoved,
						o = n._nextRemoved;
					return (
						null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
						null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
						this._insertAfter(n, t, r),
						this._addToMoves(n, r),
						n
					);
				}
				_moveAfter(n, t, r) {
					return this._unlink(n), this._insertAfter(n, t, r), this._addToMoves(n, r), n;
				}
				_addAfter(n, t, r) {
					return (
						this._insertAfter(n, t, r),
						(this._additionsTail =
							null === this._additionsTail
								? (this._additionsHead = n)
								: (this._additionsTail._nextAdded = n)),
						n
					);
				}
				_insertAfter(n, t, r) {
					const i = null === t ? this._itHead : t._next;
					return (
						(n._next = i),
						(n._prev = t),
						null === i ? (this._itTail = n) : (i._prev = n),
						null === t ? (this._itHead = n) : (t._next = n),
						null === this._linkedRecords && (this._linkedRecords = new Dm()),
						this._linkedRecords.put(n),
						(n.currentIndex = r),
						n
					);
				}
				_remove(n) {
					return this._addToRemovals(this._unlink(n));
				}
				_unlink(n) {
					null !== this._linkedRecords && this._linkedRecords.remove(n);
					const t = n._prev,
						r = n._next;
					return (
						null === t ? (this._itHead = r) : (t._next = r),
						null === r ? (this._itTail = t) : (r._prev = t),
						n
					);
				}
				_addToMoves(n, t) {
					return (
						n.previousIndex === t ||
							(this._movesTail =
								null === this._movesTail ? (this._movesHead = n) : (this._movesTail._nextMoved = n)),
						n
					);
				}
				_addToRemovals(n) {
					return (
						null === this._unlinkedRecords && (this._unlinkedRecords = new Dm()),
						this._unlinkedRecords.put(n),
						(n.currentIndex = null),
						(n._nextRemoved = null),
						null === this._removalsTail
							? ((this._removalsTail = this._removalsHead = n), (n._prevRemoved = null))
							: ((n._prevRemoved = this._removalsTail),
							  (this._removalsTail = this._removalsTail._nextRemoved = n)),
						n
					);
				}
				_addIdentityChange(n, t) {
					return (
						(n.item = t),
						(this._identityChangesTail =
							null === this._identityChangesTail
								? (this._identityChangesHead = n)
								: (this._identityChangesTail._nextIdentityChange = n)),
						n
					);
				}
			}
			class cN {
				constructor(n, t) {
					(this.item = n),
						(this.trackById = t),
						(this.currentIndex = null),
						(this.previousIndex = null),
						(this._nextPrevious = null),
						(this._prev = null),
						(this._next = null),
						(this._prevDup = null),
						(this._nextDup = null),
						(this._prevRemoved = null),
						(this._nextRemoved = null),
						(this._nextAdded = null),
						(this._nextMoved = null),
						(this._nextIdentityChange = null);
				}
			}
			class uN {
				constructor() {
					(this._head = null), (this._tail = null);
				}
				add(n) {
					null === this._head
						? ((this._head = this._tail = n), (n._nextDup = null), (n._prevDup = null))
						: ((this._tail._nextDup = n), (n._prevDup = this._tail), (n._nextDup = null), (this._tail = n));
				}
				get(n, t) {
					let r;
					for (r = this._head; null !== r; r = r._nextDup)
						if ((null === t || t <= r.currentIndex) && Object.is(r.trackById, n)) return r;
					return null;
				}
				remove(n) {
					const t = n._prevDup,
						r = n._nextDup;
					return (
						null === t ? (this._head = r) : (t._nextDup = r),
						null === r ? (this._tail = t) : (r._prevDup = t),
						null === this._head
					);
				}
			}
			class Dm {
				constructor() {
					this.map = new Map();
				}
				put(n) {
					const t = n.trackById;
					let r = this.map.get(t);
					r || ((r = new uN()), this.map.set(t, r)), r.add(n);
				}
				get(n, t) {
					const i = this.map.get(n);
					return i ? i.get(n, t) : null;
				}
				remove(n) {
					const t = n.trackById;
					return this.map.get(t).remove(n) && this.map.delete(t), n;
				}
				get isEmpty() {
					return 0 === this.map.size;
				}
				clear() {
					this.map.clear();
				}
			}
			function wm(e, n, t) {
				const r = e.previousIndex;
				if (null === r) return r;
				let i = 0;
				return t && r < t.length && (i = t[r]), r + n + i;
			}
			class Em {
				constructor() {}
				supports(n) {
					return n instanceof Map || mu(n);
				}
				create() {
					return new gN();
				}
			}
			class gN {
				constructor() {
					(this._records = new Map()),
						(this._mapHead = null),
						(this._appendAfter = null),
						(this._previousMapHead = null),
						(this._changesHead = null),
						(this._changesTail = null),
						(this._additionsHead = null),
						(this._additionsTail = null),
						(this._removalsHead = null),
						(this._removalsTail = null);
				}
				get isDirty() {
					return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead;
				}
				forEachItem(n) {
					let t;
					for (t = this._mapHead; null !== t; t = t._next) n(t);
				}
				forEachPreviousItem(n) {
					let t;
					for (t = this._previousMapHead; null !== t; t = t._nextPrevious) n(t);
				}
				forEachChangedItem(n) {
					let t;
					for (t = this._changesHead; null !== t; t = t._nextChanged) n(t);
				}
				forEachAddedItem(n) {
					let t;
					for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
				}
				forEachRemovedItem(n) {
					let t;
					for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
				}
				diff(n) {
					if (n) {
						if (!(n instanceof Map || mu(n))) throw new w(900, !1);
					} else n = new Map();
					return this.check(n) ? this : null;
				}
				onDestroy() {}
				check(n) {
					this._reset();
					let t = this._mapHead;
					if (
						((this._appendAfter = null),
						this._forEach(n, (r, i) => {
							if (t && t.key === i) this._maybeAddToChanges(t, r), (this._appendAfter = t), (t = t._next);
							else {
								const o = this._getOrCreateRecordForKey(i, r);
								t = this._insertBeforeOrAppend(t, o);
							}
						}),
						t)
					) {
						t._prev && (t._prev._next = null), (this._removalsHead = t);
						for (let r = t; null !== r; r = r._nextRemoved)
							r === this._mapHead && (this._mapHead = null),
								this._records.delete(r.key),
								(r._nextRemoved = r._next),
								(r.previousValue = r.currentValue),
								(r.currentValue = null),
								(r._prev = null),
								(r._next = null);
					}
					return (
						this._changesTail && (this._changesTail._nextChanged = null),
						this._additionsTail && (this._additionsTail._nextAdded = null),
						this.isDirty
					);
				}
				_insertBeforeOrAppend(n, t) {
					if (n) {
						const r = n._prev;
						return (
							(t._next = n),
							(t._prev = r),
							(n._prev = t),
							r && (r._next = t),
							n === this._mapHead && (this._mapHead = t),
							(this._appendAfter = n),
							n
						);
					}
					return (
						this._appendAfter
							? ((this._appendAfter._next = t), (t._prev = this._appendAfter))
							: (this._mapHead = t),
						(this._appendAfter = t),
						null
					);
				}
				_getOrCreateRecordForKey(n, t) {
					if (this._records.has(n)) {
						const i = this._records.get(n);
						this._maybeAddToChanges(i, t);
						const o = i._prev,
							s = i._next;
						return o && (o._next = s), s && (s._prev = o), (i._next = null), (i._prev = null), i;
					}
					const r = new dN(n);
					return this._records.set(n, r), (r.currentValue = t), this._addToAdditions(r), r;
				}
				_reset() {
					if (this.isDirty) {
						let n;
						for (this._previousMapHead = this._mapHead, n = this._previousMapHead; null !== n; n = n._next)
							n._nextPrevious = n._next;
						for (n = this._changesHead; null !== n; n = n._nextChanged) n.previousValue = n.currentValue;
						for (n = this._additionsHead; null != n; n = n._nextAdded) n.previousValue = n.currentValue;
						(this._changesHead = this._changesTail = null),
							(this._additionsHead = this._additionsTail = null),
							(this._removalsHead = null);
					}
				}
				_maybeAddToChanges(n, t) {
					Object.is(t, n.currentValue) ||
						((n.previousValue = n.currentValue), (n.currentValue = t), this._addToChanges(n));
				}
				_addToAdditions(n) {
					null === this._additionsHead
						? (this._additionsHead = this._additionsTail = n)
						: ((this._additionsTail._nextAdded = n), (this._additionsTail = n));
				}
				_addToChanges(n) {
					null === this._changesHead
						? (this._changesHead = this._changesTail = n)
						: ((this._changesTail._nextChanged = n), (this._changesTail = n));
				}
				_forEach(n, t) {
					n instanceof Map ? n.forEach(t) : Object.keys(n).forEach((r) => t(n[r], r));
				}
			}
			class dN {
				constructor(n) {
					(this.key = n),
						(this.previousValue = null),
						(this.currentValue = null),
						(this._nextPrevious = null),
						(this._next = null),
						(this._prev = null),
						(this._nextAdded = null),
						(this._nextRemoved = null),
						(this._nextChanged = null);
				}
			}
			function Sm() {
				return new $a([new _m()]);
			}
			let $a = (() => {
				class e {
					constructor(t) {
						this.factories = t;
					}
					static create(t, r) {
						if (null != r) {
							const i = r.factories.slice();
							t = t.concat(i);
						}
						return new e(t);
					}
					static extend(t) {
						return {
							provide: e,
							useFactory: (r) => e.create(t, r || Sm()),
							deps: [[e, new Gs(), new Ws()]],
						};
					}
					find(t) {
						const r = this.factories.find((i) => i.supports(t));
						if (null != r) return r;
						throw new w(901, !1);
					}
				}
				return (e.ɵprov = L({ token: e, providedIn: "root", factory: Sm })), e;
			})();
			function bm() {
				return new Vo([new Em()]);
			}
			let Vo = (() => {
				class e {
					constructor(t) {
						this.factories = t;
					}
					static create(t, r) {
						if (r) {
							const i = r.factories.slice();
							t = t.concat(i);
						}
						return new e(t);
					}
					static extend(t) {
						return {
							provide: e,
							useFactory: (r) => e.create(t, r || bm()),
							deps: [[e, new Gs(), new Ws()]],
						};
					}
					find(t) {
						const r = this.factories.find((i) => i.supports(t));
						if (r) return r;
						throw new w(901, !1);
					}
				}
				return (e.ɵprov = L({ token: e, providedIn: "root", factory: bm })), e;
			})();
			const IN = um(null, "core", []);
			let hN = (() => {
				class e {
					constructor(t) {}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(yi));
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = tt({})),
					e
				);
			})();
			function Ag(e) {
				return "boolean" == typeof e ? e : null != e && "false" !== e;
			}
			let mg = null;
			function vi() {
				return mg;
			}
			class TN {}
			const at = new R("DocumentToken");
			let yg = (() => {
				class e {
					historyGo(t) {
						throw new Error("Not implemented");
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({
						token: e,
						factory: function () {
							return M(NN);
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			const MN = new R("Location Initialized");
			let NN = (() => {
				class e extends yg {
					constructor() {
						super(),
							(this._doc = M(at)),
							(this._location = window.location),
							(this._history = window.history);
					}
					getBaseHrefFromDOM() {
						return vi().getBaseHref(this._doc);
					}
					onPopState(t) {
						const r = vi().getGlobalEventTarget(this._doc, "window");
						return r.addEventListener("popstate", t, !1), () => r.removeEventListener("popstate", t);
					}
					onHashChange(t) {
						const r = vi().getGlobalEventTarget(this._doc, "window");
						return r.addEventListener("hashchange", t, !1), () => r.removeEventListener("hashchange", t);
					}
					get href() {
						return this._location.href;
					}
					get protocol() {
						return this._location.protocol;
					}
					get hostname() {
						return this._location.hostname;
					}
					get port() {
						return this._location.port;
					}
					get pathname() {
						return this._location.pathname;
					}
					get search() {
						return this._location.search;
					}
					get hash() {
						return this._location.hash;
					}
					set pathname(t) {
						this._location.pathname = t;
					}
					pushState(t, r, i) {
						this._history.pushState(t, r, i);
					}
					replaceState(t, r, i) {
						this._history.replaceState(t, r, i);
					}
					forward() {
						this._history.forward();
					}
					back() {
						this._history.back();
					}
					historyGo(t = 0) {
						this._history.go(t);
					}
					getState() {
						return this._history.state;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({
						token: e,
						factory: function () {
							return new e();
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			function vg(e, n) {
				if (0 == e.length) return n;
				if (0 == n.length) return e;
				let t = 0;
				return (
					e.endsWith("/") && t++,
					n.startsWith("/") && t++,
					2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
				);
			}
			function Om(e) {
				const n = e.match(/#|\?|$/),
					t = (n && n.index) || e.length;
				return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
			}
			function On(e) {
				return e && "?" !== e[0] ? "?" + e : e;
			}
			let _r = (() => {
				class e {
					historyGo(t) {
						throw new Error("Not implemented");
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({
						token: e,
						factory: function () {
							return M(Fm);
						},
						providedIn: "root",
					})),
					e
				);
			})();
			const Lm = new R("appBaseHref");
			let Fm = (() => {
					class e extends _r {
						constructor(t, r) {
							super(),
								(this._platformLocation = t),
								(this._removeListenerFns = []),
								(this._baseHref =
									r ?? this._platformLocation.getBaseHrefFromDOM() ?? M(at).location?.origin ?? "");
						}
						ngOnDestroy() {
							for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
						}
						onPopState(t) {
							this._removeListenerFns.push(
								this._platformLocation.onPopState(t),
								this._platformLocation.onHashChange(t),
							);
						}
						getBaseHref() {
							return this._baseHref;
						}
						prepareExternalUrl(t) {
							return vg(this._baseHref, t);
						}
						path(t = !1) {
							const r = this._platformLocation.pathname + On(this._platformLocation.search),
								i = this._platformLocation.hash;
							return i && t ? `${r}${i}` : r;
						}
						pushState(t, r, i, o) {
							const s = this.prepareExternalUrl(i + On(o));
							this._platformLocation.pushState(t, r, s);
						}
						replaceState(t, r, i, o) {
							const s = this.prepareExternalUrl(i + On(o));
							this._platformLocation.replaceState(t, r, s);
						}
						forward() {
							this._platformLocation.forward();
						}
						back() {
							this._platformLocation.back();
						}
						getState() {
							return this._platformLocation.getState();
						}
						historyGo(t = 0) {
							this._platformLocation.historyGo?.(t);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(yg), O(Lm, 8));
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				xN = (() => {
					class e extends _r {
						constructor(t, r) {
							super(),
								(this._platformLocation = t),
								(this._baseHref = ""),
								(this._removeListenerFns = []),
								null != r && (this._baseHref = r);
						}
						ngOnDestroy() {
							for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
						}
						onPopState(t) {
							this._removeListenerFns.push(
								this._platformLocation.onPopState(t),
								this._platformLocation.onHashChange(t),
							);
						}
						getBaseHref() {
							return this._baseHref;
						}
						path(t = !1) {
							let r = this._platformLocation.hash;
							return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
						}
						prepareExternalUrl(t) {
							const r = vg(this._baseHref, t);
							return r.length > 0 ? "#" + r : r;
						}
						pushState(t, r, i, o) {
							let s = this.prepareExternalUrl(i + On(o));
							0 == s.length && (s = this._platformLocation.pathname),
								this._platformLocation.pushState(t, r, s);
						}
						replaceState(t, r, i, o) {
							let s = this.prepareExternalUrl(i + On(o));
							0 == s.length && (s = this._platformLocation.pathname),
								this._platformLocation.replaceState(t, r, s);
						}
						forward() {
							this._platformLocation.forward();
						}
						back() {
							this._platformLocation.back();
						}
						getState() {
							return this._platformLocation.getState();
						}
						historyGo(t = 0) {
							this._platformLocation.historyGo?.(t);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(yg), O(Lm, 8));
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				_g = (() => {
					class e {
						constructor(t) {
							(this._subject = new re()),
								(this._urlChangeListeners = []),
								(this._urlChangeSubscription = null),
								(this._locationStrategy = t);
							const r = this._locationStrategy.getBaseHref();
							(this._basePath = (function ON(e) {
								if (new RegExp("^(https?:)?//").test(e)) {
									const [, t] = e.split(/\/\/[^\/]+/);
									return t;
								}
								return e;
							})(Om(km(r)))),
								this._locationStrategy.onPopState((i) => {
									this._subject.emit({ url: this.path(!0), pop: !0, state: i.state, type: i.type });
								});
						}
						ngOnDestroy() {
							this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
						}
						path(t = !1) {
							return this.normalize(this._locationStrategy.path(t));
						}
						getState() {
							return this._locationStrategy.getState();
						}
						isCurrentPathEqualTo(t, r = "") {
							return this.path() == this.normalize(t + On(r));
						}
						normalize(t) {
							return e.stripTrailingSlash(
								(function PN(e, n) {
									if (!e || !n.startsWith(e)) return n;
									const t = n.substring(e.length);
									return "" === t || ["/", ";", "?", "#"].includes(t[0]) ? t : n;
								})(this._basePath, km(t)),
							);
						}
						prepareExternalUrl(t) {
							return t && "/" !== t[0] && (t = "/" + t), this._locationStrategy.prepareExternalUrl(t);
						}
						go(t, r = "", i = null) {
							this._locationStrategy.pushState(i, "", t, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(t + On(r)), i);
						}
						replaceState(t, r = "", i = null) {
							this._locationStrategy.replaceState(i, "", t, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(t + On(r)), i);
						}
						forward() {
							this._locationStrategy.forward();
						}
						back() {
							this._locationStrategy.back();
						}
						historyGo(t = 0) {
							this._locationStrategy.historyGo?.(t);
						}
						onUrlChange(t) {
							return (
								this._urlChangeListeners.push(t),
								this._urlChangeSubscription ||
									(this._urlChangeSubscription = this.subscribe((r) => {
										this._notifyUrlChangeListeners(r.url, r.state);
									})),
								() => {
									const r = this._urlChangeListeners.indexOf(t);
									this._urlChangeListeners.splice(r, 1),
										0 === this._urlChangeListeners.length &&
											(this._urlChangeSubscription?.unsubscribe(),
											(this._urlChangeSubscription = null));
								}
							);
						}
						_notifyUrlChangeListeners(t = "", r) {
							this._urlChangeListeners.forEach((i) => i(t, r));
						}
						subscribe(t, r, i) {
							return this._subject.subscribe({ next: t, error: r, complete: i });
						}
					}
					return (
						(e.normalizeQueryParams = On),
						(e.joinWithSlash = vg),
						(e.stripTrailingSlash = Om),
						(e.ɵfac = function (t) {
							return new (t || e)(O(_r));
						}),
						(e.ɵprov = L({
							token: e,
							factory: function () {
								return (function RN() {
									return new _g(O(_r));
								})();
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function km(e) {
				return e.replace(/\/index.html$/, "");
			}
			function Gm(e, n) {
				n = encodeURIComponent(n);
				for (const t of e.split(";")) {
					const r = t.indexOf("="),
						[i, o] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
					if (i.trim() === n) return decodeURIComponent(o);
				}
				return null;
			}
			const Rg = /\s+/,
				qm = [];
			let _i = (() => {
				class e {
					constructor(t, r, i, o) {
						(this._iterableDiffers = t),
							(this._keyValueDiffers = r),
							(this._ngEl = i),
							(this._renderer = o),
							(this.initialClasses = qm),
							(this.stateMap = new Map());
					}
					set klass(t) {
						this.initialClasses = null != t ? t.trim().split(Rg) : qm;
					}
					set ngClass(t) {
						this.rawClass = "string" == typeof t ? t.trim().split(Rg) : t;
					}
					ngDoCheck() {
						for (const r of this.initialClasses) this._updateState(r, !0);
						const t = this.rawClass;
						if (Array.isArray(t) || t instanceof Set) for (const r of t) this._updateState(r, !0);
						else if (null != t) for (const r of Object.keys(t)) this._updateState(r, !!t[r]);
						this._applyStateDiff();
					}
					_updateState(t, r) {
						const i = this.stateMap.get(t);
						void 0 !== i
							? (i.enabled !== r && ((i.changed = !0), (i.enabled = r)), (i.touched = !0))
							: this.stateMap.set(t, { enabled: r, changed: !0, touched: !0 });
					}
					_applyStateDiff() {
						for (const t of this.stateMap) {
							const r = t[0],
								i = t[1];
							i.changed
								? (this._toggleClass(r, i.enabled), (i.changed = !1))
								: i.touched || (i.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)),
								(i.touched = !1);
						}
					}
					_toggleClass(t, r) {
						(t = t.trim()).length > 0 &&
							t.split(Rg).forEach((i) => {
								r
									? this._renderer.addClass(this._ngEl.nativeElement, i)
									: this._renderer.removeClass(this._ngEl.nativeElement, i);
							});
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(S($a), S(Vo), S(Wt), S(ei));
					}),
					(e.ɵdir = qe({
						type: e,
						selectors: [["", "ngClass", ""]],
						inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
						standalone: !0,
					})),
					e
				);
			})();
			class Ax {
				constructor(n, t, r, i) {
					(this.$implicit = n), (this.ngForOf = t), (this.index = r), (this.count = i);
				}
				get first() {
					return 0 === this.index;
				}
				get last() {
					return this.index === this.count - 1;
				}
				get even() {
					return this.index % 2 == 0;
				}
				get odd() {
					return !this.even;
				}
			}
			let el = (() => {
				class e {
					set ngForOf(t) {
						(this._ngForOf = t), (this._ngForOfDirty = !0);
					}
					set ngForTrackBy(t) {
						this._trackByFn = t;
					}
					get ngForTrackBy() {
						return this._trackByFn;
					}
					constructor(t, r, i) {
						(this._viewContainer = t),
							(this._template = r),
							(this._differs = i),
							(this._ngForOf = null),
							(this._ngForOfDirty = !0),
							(this._differ = null);
					}
					set ngForTemplate(t) {
						t && (this._template = t);
					}
					ngDoCheck() {
						if (this._ngForOfDirty) {
							this._ngForOfDirty = !1;
							const t = this._ngForOf;
							!this._differ && t && (this._differ = this._differs.find(t).create(this.ngForTrackBy));
						}
						if (this._differ) {
							const t = this._differ.diff(this._ngForOf);
							t && this._applyChanges(t);
						}
					}
					_applyChanges(t) {
						const r = this._viewContainer;
						t.forEachOperation((i, o, s) => {
							if (null == i.previousIndex)
								r.createEmbeddedView(
									this._template,
									new Ax(i.item, this._ngForOf, -1, -1),
									null === s ? void 0 : s,
								);
							else if (null == s) r.remove(null === o ? void 0 : o);
							else if (null !== o) {
								const a = r.get(o);
								r.move(a, s), Zm(a, i);
							}
						});
						for (let i = 0, o = r.length; i < o; i++) {
							const a = r.get(i).context;
							(a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
						}
						t.forEachIdentityChange((i) => {
							Zm(r.get(i.currentIndex), i);
						});
					}
					static ngTemplateContextGuard(t, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(S(Kt), S(Cn), S($a));
					}),
					(e.ɵdir = qe({
						type: e,
						selectors: [["", "ngFor", "", "ngForOf", ""]],
						inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" },
						standalone: !0,
					})),
					e
				);
			})();
			function Zm(e, n) {
				e.context.$implicit = n.item;
			}
			let Di = (() => {
				class e {
					constructor(t, r) {
						(this._viewContainer = t),
							(this._context = new mx()),
							(this._thenTemplateRef = null),
							(this._elseTemplateRef = null),
							(this._thenViewRef = null),
							(this._elseViewRef = null),
							(this._thenTemplateRef = r);
					}
					set ngIf(t) {
						(this._context.$implicit = this._context.ngIf = t), this._updateView();
					}
					set ngIfThen(t) {
						Ym("ngIfThen", t), (this._thenTemplateRef = t), (this._thenViewRef = null), this._updateView();
					}
					set ngIfElse(t) {
						Ym("ngIfElse", t), (this._elseTemplateRef = t), (this._elseViewRef = null), this._updateView();
					}
					_updateView() {
						this._context.$implicit
							? this._thenViewRef ||
							  (this._viewContainer.clear(),
							  (this._elseViewRef = null),
							  this._thenTemplateRef &&
									(this._thenViewRef = this._viewContainer.createEmbeddedView(
										this._thenTemplateRef,
										this._context,
									)))
							: this._elseViewRef ||
							  (this._viewContainer.clear(),
							  (this._thenViewRef = null),
							  this._elseTemplateRef &&
									(this._elseViewRef = this._viewContainer.createEmbeddedView(
										this._elseTemplateRef,
										this._context,
									)));
					}
					static ngTemplateContextGuard(t, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(S(Kt), S(Cn));
					}),
					(e.ɵdir = qe({
						type: e,
						selectors: [["", "ngIf", ""]],
						inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
						standalone: !0,
					})),
					e
				);
			})();
			class mx {
				constructor() {
					(this.$implicit = null), (this.ngIf = null);
				}
			}
			function Ym(e, n) {
				if (n && !n.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${Fe(n)}'.`);
			}
			let wi = (() => {
					class e {
						constructor(t, r, i) {
							(this._ngEl = t),
								(this._differs = r),
								(this._renderer = i),
								(this._ngStyle = null),
								(this._differ = null);
						}
						set ngStyle(t) {
							(this._ngStyle = t), !this._differ && t && (this._differ = this._differs.find(t).create());
						}
						ngDoCheck() {
							if (this._differ) {
								const t = this._differ.diff(this._ngStyle);
								t && this._applyChanges(t);
							}
						}
						_setStyle(t, r) {
							const [i, o] = t.split("."),
								s = -1 === i.indexOf("-") ? void 0 : ht.DashCase;
							null != r
								? this._renderer.setStyle(this._ngEl.nativeElement, i, o ? `${r}${o}` : r, s)
								: this._renderer.removeStyle(this._ngEl.nativeElement, i, s);
						}
						_applyChanges(t) {
							t.forEachRemovedItem((r) => this._setStyle(r.key, null)),
								t.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
								t.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue));
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Wt), S(Vo), S(ei));
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "ngStyle", ""]],
							inputs: { ngStyle: "ngStyle" },
							standalone: !0,
						})),
						e
					);
				})(),
				Ei = (() => {
					class e {
						constructor(t) {
							(this._viewContainerRef = t),
								(this._viewRef = null),
								(this.ngTemplateOutletContext = null),
								(this.ngTemplateOutlet = null),
								(this.ngTemplateOutletInjector = null);
						}
						ngOnChanges(t) {
							if (t.ngTemplateOutlet || t.ngTemplateOutletInjector) {
								const r = this._viewContainerRef;
								if ((this._viewRef && r.remove(r.indexOf(this._viewRef)), this.ngTemplateOutlet)) {
									const {
										ngTemplateOutlet: i,
										ngTemplateOutletContext: o,
										ngTemplateOutletInjector: s,
									} = this;
									this._viewRef = r.createEmbeddedView(i, o, s ? { injector: s } : void 0);
								} else this._viewRef = null;
							} else
								this._viewRef &&
									t.ngTemplateOutletContext &&
									this.ngTemplateOutletContext &&
									(this._viewRef.context = this.ngTemplateOutletContext);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Kt));
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "ngTemplateOutlet", ""]],
							inputs: {
								ngTemplateOutletContext: "ngTemplateOutletContext",
								ngTemplateOutlet: "ngTemplateOutlet",
								ngTemplateOutletInjector: "ngTemplateOutletInjector",
							},
							standalone: !0,
							features: [_n],
						})),
						e
					);
				})(),
				Qn = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({})),
						e
					);
				})();
			const Jm = "browser";
			function kg(e) {
				return e === Jm;
			}
			function ey(e) {
				return "server" === e;
			}
			let Kx = (() => {
				class e {}
				return (e.ɵprov = L({ token: e, providedIn: "root", factory: () => new Zx(O(at), window) })), e;
			})();
			class Zx {
				constructor(n, t) {
					(this.document = n), (this.window = t), (this.offset = () => [0, 0]);
				}
				setOffset(n) {
					this.offset = Array.isArray(n) ? () => n : n;
				}
				getScrollPosition() {
					return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0];
				}
				scrollToPosition(n) {
					this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
				}
				scrollToAnchor(n) {
					if (!this.supportsScrolling()) return;
					const t = (function Yx(e, n) {
						const t = e.getElementById(n) || e.getElementsByName(n)[0];
						if (t) return t;
						if (
							"function" == typeof e.createTreeWalker &&
							e.body &&
							"function" == typeof e.body.attachShadow
						) {
							const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
							let i = r.currentNode;
							for (; i; ) {
								const o = i.shadowRoot;
								if (o) {
									const s = o.getElementById(n) || o.querySelector(`[name="${n}"]`);
									if (s) return s;
								}
								i = r.nextNode();
							}
						}
						return null;
					})(this.document, n);
					t && (this.scrollToElement(t), t.focus());
				}
				setHistoryScrollRestoration(n) {
					if (this.supportScrollRestoration()) {
						const t = this.window.history;
						t && t.scrollRestoration && (t.scrollRestoration = n);
					}
				}
				scrollToElement(n) {
					const t = n.getBoundingClientRect(),
						r = t.left + this.window.pageXOffset,
						i = t.top + this.window.pageYOffset,
						o = this.offset();
					this.window.scrollTo(r - o[0], i - o[1]);
				}
				supportScrollRestoration() {
					try {
						if (!this.supportsScrolling()) return !1;
						const n = ty(this.window.history) || ty(Object.getPrototypeOf(this.window.history));
						return !(!n || (!n.writable && !n.set));
					} catch {
						return !1;
					}
				}
				supportsScrolling() {
					try {
						return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window;
					} catch {
						return !1;
					}
				}
			}
			function ty(e) {
				return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
			}
			class ny {}
			class mR extends TN {
				constructor() {
					super(...arguments), (this.supportsDOMEvents = !0);
				}
			}
			class Bg extends mR {
				static makeCurrent() {
					!(function bN(e) {
						mg || (mg = e);
					})(new Bg());
				}
				onAndCancel(n, t, r) {
					return (
						n.addEventListener(t, r),
						() => {
							n.removeEventListener(t, r);
						}
					);
				}
				dispatchEvent(n, t) {
					n.dispatchEvent(t);
				}
				remove(n) {
					n.parentNode && n.parentNode.removeChild(n);
				}
				createElement(n, t) {
					return (t = t || this.getDefaultDocument()).createElement(n);
				}
				createHtmlDocument() {
					return document.implementation.createHTMLDocument("fakeTitle");
				}
				getDefaultDocument() {
					return document;
				}
				isElementNode(n) {
					return n.nodeType === Node.ELEMENT_NODE;
				}
				isShadowRoot(n) {
					return n instanceof DocumentFragment;
				}
				getGlobalEventTarget(n, t) {
					return "window" === t ? window : "document" === t ? n : "body" === t ? n.body : null;
				}
				getBaseHref(n) {
					const t = (function yR() {
						return ($o = $o || document.querySelector("base")), $o ? $o.getAttribute("href") : null;
					})();
					return null == t
						? null
						: (function vR(e) {
								(rl = rl || document.createElement("a")), rl.setAttribute("href", e);
								const n = rl.pathname;
								return "/" === n.charAt(0) ? n : `/${n}`;
						  })(t);
				}
				resetBaseElement() {
					$o = null;
				}
				getUserAgent() {
					return window.navigator.userAgent;
				}
				getCookie(n) {
					return Gm(document.cookie, n);
				}
			}
			let rl,
				$o = null,
				DR = (() => {
					class e {
						build() {
							return new XMLHttpRequest();
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			const Ug = new R("EventManagerPlugins");
			let ay = (() => {
				class e {
					constructor(t, r) {
						(this._zone = r),
							(this._eventNameToPlugin = new Map()),
							t.forEach((i) => {
								i.manager = this;
							}),
							(this._plugins = t.slice().reverse());
					}
					addEventListener(t, r, i) {
						return this._findPluginFor(r).addEventListener(t, r, i);
					}
					getZone() {
						return this._zone;
					}
					_findPluginFor(t) {
						let r = this._eventNameToPlugin.get(t);
						if (r) return r;
						if (((r = this._plugins.find((o) => o.supports(t))), !r)) throw new w(5101, !1);
						return this._eventNameToPlugin.set(t, r), r;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(Ug), O(Ce));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class ly {
				constructor(n) {
					this._doc = n;
				}
			}
			const jg = "ng-app-id";
			let cy = (() => {
				class e {
					constructor(t, r, i, o = {}) {
						(this.doc = t),
							(this.appId = r),
							(this.nonce = i),
							(this.platformId = o),
							(this.styleRef = new Map()),
							(this.hostNodes = new Set()),
							(this.styleNodesInDOM = this.collectServerRenderedStyles()),
							(this.platformIsServer = ey(o)),
							this.resetHostNodes();
					}
					addStyles(t) {
						for (const r of t) 1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
					}
					removeStyles(t) {
						for (const r of t) this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
					}
					ngOnDestroy() {
						const t = this.styleNodesInDOM;
						t && (t.forEach((r) => r.remove()), t.clear());
						for (const r of this.getAllStyles()) this.onStyleRemoved(r);
						this.resetHostNodes();
					}
					addHost(t) {
						this.hostNodes.add(t);
						for (const r of this.getAllStyles()) this.addStyleToHost(t, r);
					}
					removeHost(t) {
						this.hostNodes.delete(t);
					}
					getAllStyles() {
						return this.styleRef.keys();
					}
					onStyleAdded(t) {
						for (const r of this.hostNodes) this.addStyleToHost(r, t);
					}
					onStyleRemoved(t) {
						const r = this.styleRef;
						r.get(t)?.elements?.forEach((i) => i.remove()), r.delete(t);
					}
					collectServerRenderedStyles() {
						const t = this.doc.head?.querySelectorAll(`style[${jg}="${this.appId}"]`);
						if (t?.length) {
							const r = new Map();
							return (
								t.forEach((i) => {
									null != i.textContent && r.set(i.textContent, i);
								}),
								r
							);
						}
						return null;
					}
					changeUsageCount(t, r) {
						const i = this.styleRef;
						if (i.has(t)) {
							const o = i.get(t);
							return (o.usage += r), o.usage;
						}
						return i.set(t, { usage: r, elements: [] }), r;
					}
					getStyleElement(t, r) {
						const i = this.styleNodesInDOM,
							o = i?.get(r);
						if (o?.parentNode === t) return i.delete(r), o.removeAttribute(jg), o;
						{
							const s = this.doc.createElement("style");
							return (
								this.nonce && s.setAttribute("nonce", this.nonce),
								(s.textContent = r),
								this.platformIsServer && s.setAttribute(jg, this.appId),
								s
							);
						}
					}
					addStyleToHost(t, r) {
						const i = this.getStyleElement(t, r);
						t.appendChild(i);
						const o = this.styleRef,
							s = o.get(r)?.elements;
						s ? s.push(i) : o.set(r, { elements: [i], usage: 1 });
					}
					resetHostNodes() {
						const t = this.hostNodes;
						t.clear(), t.add(this.doc.head);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(at), O(ua), O(wI, 8), O(Sn));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const $g = {
					svg: "http://www.w3.org/2000/svg",
					xhtml: "http://www.w3.org/1999/xhtml",
					xlink: "http://www.w3.org/1999/xlink",
					xml: "http://www.w3.org/XML/1998/namespace",
					xmlns: "http://www.w3.org/2000/xmlns/",
					math: "http://www.w3.org/1998/MathML/",
				},
				zg = /%COMP%/g,
				bR = new R("RemoveStylesOnCompDestroy", { providedIn: "root", factory: () => !1 });
			function gy(e, n) {
				return n.map((t) => t.replace(zg, e));
			}
			let dy = (() => {
				class e {
					constructor(t, r, i, o, s, a, l, c = null) {
						(this.eventManager = t),
							(this.sharedStylesHost = r),
							(this.appId = i),
							(this.removeStylesOnCompDestroy = o),
							(this.doc = s),
							(this.platformId = a),
							(this.ngZone = l),
							(this.nonce = c),
							(this.rendererByCompId = new Map()),
							(this.platformIsServer = ey(a)),
							(this.defaultRenderer = new Wg(t, s, l, this.platformIsServer));
					}
					createRenderer(t, r) {
						if (!t || !r) return this.defaultRenderer;
						this.platformIsServer &&
							r.encapsulation === yt.ShadowDom &&
							(r = { ...r, encapsulation: yt.Emulated });
						const i = this.getOrCreateRenderer(t, r);
						return i instanceof Cy ? i.applyToHost(t) : i instanceof Gg && i.applyStyles(), i;
					}
					getOrCreateRenderer(t, r) {
						const i = this.rendererByCompId;
						let o = i.get(r.id);
						if (!o) {
							const s = this.doc,
								a = this.ngZone,
								l = this.eventManager,
								c = this.sharedStylesHost,
								u = this.removeStylesOnCompDestroy,
								g = this.platformIsServer;
							switch (r.encapsulation) {
								case yt.Emulated:
									o = new Cy(l, c, r, this.appId, u, s, a, g);
									break;
								case yt.ShadowDom:
									return new xR(l, c, t, r, s, a, this.nonce, g);
								default:
									o = new Gg(l, c, r, u, s, a, g);
							}
							i.set(r.id, o);
						}
						return o;
					}
					ngOnDestroy() {
						this.rendererByCompId.clear();
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(ay), O(cy), O(ua), O(bR), O(at), O(Sn), O(Ce), O(wI));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class Wg {
				constructor(n, t, r, i) {
					(this.eventManager = n),
						(this.doc = t),
						(this.ngZone = r),
						(this.platformIsServer = i),
						(this.data = Object.create(null)),
						(this.destroyNode = null);
				}
				destroy() {}
				createElement(n, t) {
					return t ? this.doc.createElementNS($g[t] || t, n) : this.doc.createElement(n);
				}
				createComment(n) {
					return this.doc.createComment(n);
				}
				createText(n) {
					return this.doc.createTextNode(n);
				}
				appendChild(n, t) {
					(fy(n) ? n.content : n).appendChild(t);
				}
				insertBefore(n, t, r) {
					n && (fy(n) ? n.content : n).insertBefore(t, r);
				}
				removeChild(n, t) {
					n && n.removeChild(t);
				}
				selectRootElement(n, t) {
					let r = "string" == typeof n ? this.doc.querySelector(n) : n;
					if (!r) throw new w(-5104, !1);
					return t || (r.textContent = ""), r;
				}
				parentNode(n) {
					return n.parentNode;
				}
				nextSibling(n) {
					return n.nextSibling;
				}
				setAttribute(n, t, r, i) {
					if (i) {
						t = i + ":" + t;
						const o = $g[i];
						o ? n.setAttributeNS(o, t, r) : n.setAttribute(t, r);
					} else n.setAttribute(t, r);
				}
				removeAttribute(n, t, r) {
					if (r) {
						const i = $g[r];
						i ? n.removeAttributeNS(i, t) : n.removeAttribute(`${r}:${t}`);
					} else n.removeAttribute(t);
				}
				addClass(n, t) {
					n.classList.add(t);
				}
				removeClass(n, t) {
					n.classList.remove(t);
				}
				setStyle(n, t, r, i) {
					i & (ht.DashCase | ht.Important)
						? n.style.setProperty(t, r, i & ht.Important ? "important" : "")
						: (n.style[t] = r);
				}
				removeStyle(n, t, r) {
					r & ht.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
				}
				setProperty(n, t, r) {
					n[t] = r;
				}
				setValue(n, t) {
					n.nodeValue = t;
				}
				listen(n, t, r) {
					if ("string" == typeof n && !(n = vi().getGlobalEventTarget(this.doc, n)))
						throw new Error(`Unsupported event target ${n} for event ${t}`);
					return this.eventManager.addEventListener(n, t, this.decoratePreventDefault(r));
				}
				decoratePreventDefault(n) {
					return (t) => {
						if ("__ngUnwrap__" === t) return n;
						!1 === (this.platformIsServer ? this.ngZone.runGuarded(() => n(t)) : n(t)) &&
							t.preventDefault();
					};
				}
			}
			function fy(e) {
				return "TEMPLATE" === e.tagName && void 0 !== e.content;
			}
			class xR extends Wg {
				constructor(n, t, r, i, o, s, a, l) {
					super(n, o, s, l),
						(this.sharedStylesHost = t),
						(this.hostEl = r),
						(this.shadowRoot = r.attachShadow({ mode: "open" })),
						this.sharedStylesHost.addHost(this.shadowRoot);
					const c = gy(i.id, i.styles);
					for (const u of c) {
						const g = document.createElement("style");
						a && g.setAttribute("nonce", a), (g.textContent = u), this.shadowRoot.appendChild(g);
					}
				}
				nodeOrShadowRoot(n) {
					return n === this.hostEl ? this.shadowRoot : n;
				}
				appendChild(n, t) {
					return super.appendChild(this.nodeOrShadowRoot(n), t);
				}
				insertBefore(n, t, r) {
					return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
				}
				removeChild(n, t) {
					return super.removeChild(this.nodeOrShadowRoot(n), t);
				}
				parentNode(n) {
					return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
				}
				destroy() {
					this.sharedStylesHost.removeHost(this.shadowRoot);
				}
			}
			class Gg extends Wg {
				constructor(n, t, r, i, o, s, a, l) {
					super(n, o, s, a),
						(this.sharedStylesHost = t),
						(this.removeStylesOnCompDestroy = i),
						(this.styles = l ? gy(l, r.styles) : r.styles);
				}
				applyStyles() {
					this.sharedStylesHost.addStyles(this.styles);
				}
				destroy() {
					this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
				}
			}
			class Cy extends Gg {
				constructor(n, t, r, i, o, s, a, l) {
					const c = i + "-" + r.id;
					super(n, t, r, o, s, a, l, c),
						(this.contentAttr = (function TR(e) {
							return "_ngcontent-%COMP%".replace(zg, e);
						})(c)),
						(this.hostAttr = (function MR(e) {
							return "_nghost-%COMP%".replace(zg, e);
						})(c));
				}
				applyToHost(n) {
					this.applyStyles(), this.setAttribute(n, this.hostAttr, "");
				}
				createElement(n, t) {
					const r = super.createElement(n, t);
					return super.setAttribute(r, this.contentAttr, ""), r;
				}
			}
			let RR = (() => {
				class e extends ly {
					constructor(t) {
						super(t);
					}
					supports(t) {
						return !0;
					}
					addEventListener(t, r, i) {
						return t.addEventListener(r, i, !1), () => this.removeEventListener(t, r, i);
					}
					removeEventListener(t, r, i) {
						return t.removeEventListener(r, i);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(at));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Iy = ["alt", "control", "meta", "shift"],
				PR = {
					"\b": "Backspace",
					"\t": "Tab",
					"\x7f": "Delete",
					"\x1b": "Escape",
					Del: "Delete",
					Esc: "Escape",
					Left: "ArrowLeft",
					Right: "ArrowRight",
					Up: "ArrowUp",
					Down: "ArrowDown",
					Menu: "ContextMenu",
					Scroll: "ScrollLock",
					Win: "OS",
				},
				OR = {
					alt: (e) => e.altKey,
					control: (e) => e.ctrlKey,
					meta: (e) => e.metaKey,
					shift: (e) => e.shiftKey,
				};
			let LR = (() => {
				class e extends ly {
					constructor(t) {
						super(t);
					}
					supports(t) {
						return null != e.parseEventName(t);
					}
					addEventListener(t, r, i) {
						const o = e.parseEventName(r),
							s = e.eventCallback(o.fullKey, i, this.manager.getZone());
						return this.manager.getZone().runOutsideAngular(() => vi().onAndCancel(t, o.domEventName, s));
					}
					static parseEventName(t) {
						const r = t.toLowerCase().split("."),
							i = r.shift();
						if (0 === r.length || ("keydown" !== i && "keyup" !== i)) return null;
						const o = e._normalizeKey(r.pop());
						let s = "",
							a = r.indexOf("code");
						if (
							(a > -1 && (r.splice(a, 1), (s = "code.")),
							Iy.forEach((c) => {
								const u = r.indexOf(c);
								u > -1 && (r.splice(u, 1), (s += c + "."));
							}),
							(s += o),
							0 != r.length || 0 === o.length)
						)
							return null;
						const l = {};
						return (l.domEventName = i), (l.fullKey = s), l;
					}
					static matchEventFullKeyCode(t, r) {
						let i = PR[t.key] || t.key,
							o = "";
						return (
							r.indexOf("code.") > -1 && ((i = t.code), (o = "code.")),
							!(null == i || !i) &&
								((i = i.toLowerCase()),
								" " === i ? (i = "space") : "." === i && (i = "dot"),
								Iy.forEach((s) => {
									s !== i && (0, OR[s])(t) && (o += s + ".");
								}),
								(o += i),
								o === r)
						);
					}
					static eventCallback(t, r, i) {
						return (o) => {
							e.matchEventFullKeyCode(o, t) && i.runGuarded(() => r(o));
						};
					}
					static _normalizeKey(t) {
						return "esc" === t ? "escape" : t;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(at));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const py = [
					{ provide: Sn, useValue: Jm },
					{
						provide: DI,
						useValue: function FR() {
							Bg.makeCurrent();
						},
						multi: !0,
					},
					{
						provide: at,
						useFactory: function HR() {
							return (
								(function X0(e) {
									Lc = e;
								})(document),
								document
							);
						},
						deps: [],
					},
				],
				VR = um(IN, "browser", py),
				BR = new R(""),
				Ay = [
					{
						provide: Va,
						useClass: class _R {
							addToWindow(n) {
								(ge.getAngularTestability = (r, i = !0) => {
									const o = n.findTestabilityInTree(r, i);
									if (null == o) throw new w(5103, !1);
									return o;
								}),
									(ge.getAllAngularTestabilities = () => n.getAllTestabilities()),
									(ge.getAllAngularRootElements = () => n.getAllRootElements()),
									ge.frameworkStabilizers || (ge.frameworkStabilizers = []),
									ge.frameworkStabilizers.push((r) => {
										const i = ge.getAllAngularTestabilities();
										let o = i.length,
											s = !1;
										const a = function (l) {
											(s = s || l), o--, 0 == o && r(s);
										};
										i.forEach((l) => {
											l.whenStable(a);
										});
									});
							}
							findTestabilityInTree(n, t, r) {
								return null == t
									? null
									: n.getTestability(t) ??
											(r
												? vi().isShadowRoot(t)
													? this.findTestabilityInTree(n, t.host, !0)
													: this.findTestabilityInTree(n, t.parentElement, !0)
												: null);
							}
						},
						deps: [],
					},
					{ provide: om, useClass: sg, deps: [Ce, ag, Va] },
					{ provide: sg, useClass: sg, deps: [Ce, ag, Va] },
				],
				my = [
					{ provide: Wc, useValue: "root" },
					{
						provide: fr,
						useFactory: function kR() {
							return new fr();
						},
						deps: [],
					},
					{ provide: Ug, useClass: RR, multi: !0, deps: [at, Ce, Sn] },
					{ provide: Ug, useClass: LR, multi: !0, deps: [at] },
					dy,
					cy,
					ay,
					{ provide: RI, useExisting: dy },
					{ provide: ny, useClass: DR, deps: [] },
					[],
				];
			let UR = (() => {
					class e {
						constructor(t) {}
						static withServerTransition(t) {
							return { ngModule: e, providers: [{ provide: ua, useValue: t.appId }] };
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(BR, 12));
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ providers: [...my, ...Ay], imports: [Qn, hN] })),
						e
					);
				})(),
				yy = (() => {
					class e {
						constructor(t) {
							this._doc = t;
						}
						getTitle() {
							return this._doc.title;
						}
						setTitle(t) {
							this._doc.title = t || "";
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(at));
						}),
						(e.ɵprov = L({
							token: e,
							factory: function (t) {
								let r = null;
								return (
									(r = t
										? new t()
										: (function $R() {
												return new yy(O(at));
										  })()),
									r
								);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function Si(e, n) {
				return ue(n) ? Ge(e, n, 1) : Ge(e, 1);
			}
			function Fn(e, n) {
				return Ue((t, r) => {
					let i = 0;
					t.subscribe(je(r, (o) => e.call(n, o, i++) && r.next(o)));
				});
			}
			function zo(e) {
				return Ue((n, t) => {
					try {
						n.subscribe(t);
					} finally {
						t.add(e);
					}
				});
			}
			typeof window < "u" && window;
			class il {}
			class ol {}
			class In {
				constructor(n) {
					(this.normalizedNames = new Map()),
						(this.lazyUpdate = null),
						n
							? "string" == typeof n
								? (this.lazyInit = () => {
										(this.headers = new Map()),
											n.split("\n").forEach((t) => {
												const r = t.indexOf(":");
												if (r > 0) {
													const i = t.slice(0, r),
														o = i.toLowerCase(),
														s = t.slice(r + 1).trim();
													this.maybeSetNormalizedName(i, o),
														this.headers.has(o)
															? this.headers.get(o).push(s)
															: this.headers.set(o, [s]);
												}
											});
								  })
								: typeof Headers < "u" && n instanceof Headers
								? ((this.headers = new Map()),
								  n.forEach((t, r) => {
										this.setHeaderEntries(r, t);
								  }))
								: (this.lazyInit = () => {
										(this.headers = new Map()),
											Object.entries(n).forEach(([t, r]) => {
												this.setHeaderEntries(t, r);
											});
								  })
							: (this.headers = new Map());
				}
				has(n) {
					return this.init(), this.headers.has(n.toLowerCase());
				}
				get(n) {
					this.init();
					const t = this.headers.get(n.toLowerCase());
					return t && t.length > 0 ? t[0] : null;
				}
				keys() {
					return this.init(), Array.from(this.normalizedNames.values());
				}
				getAll(n) {
					return this.init(), this.headers.get(n.toLowerCase()) || null;
				}
				append(n, t) {
					return this.clone({ name: n, value: t, op: "a" });
				}
				set(n, t) {
					return this.clone({ name: n, value: t, op: "s" });
				}
				delete(n, t) {
					return this.clone({ name: n, value: t, op: "d" });
				}
				maybeSetNormalizedName(n, t) {
					this.normalizedNames.has(t) || this.normalizedNames.set(t, n);
				}
				init() {
					this.lazyInit &&
						(this.lazyInit instanceof In ? this.copyFrom(this.lazyInit) : this.lazyInit(),
						(this.lazyInit = null),
						this.lazyUpdate &&
							(this.lazyUpdate.forEach((n) => this.applyUpdate(n)), (this.lazyUpdate = null)));
				}
				copyFrom(n) {
					n.init(),
						Array.from(n.headers.keys()).forEach((t) => {
							this.headers.set(t, n.headers.get(t)),
								this.normalizedNames.set(t, n.normalizedNames.get(t));
						});
				}
				clone(n) {
					const t = new In();
					return (
						(t.lazyInit = this.lazyInit && this.lazyInit instanceof In ? this.lazyInit : this),
						(t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
						t
					);
				}
				applyUpdate(n) {
					const t = n.name.toLowerCase();
					switch (n.op) {
						case "a":
						case "s":
							let r = n.value;
							if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
							this.maybeSetNormalizedName(n.name, t);
							const i = ("a" === n.op ? this.headers.get(t) : void 0) || [];
							i.push(...r), this.headers.set(t, i);
							break;
						case "d":
							const o = n.value;
							if (o) {
								let s = this.headers.get(t);
								if (!s) return;
								(s = s.filter((a) => -1 === o.indexOf(a))),
									0 === s.length
										? (this.headers.delete(t), this.normalizedNames.delete(t))
										: this.headers.set(t, s);
							} else this.headers.delete(t), this.normalizedNames.delete(t);
					}
				}
				setHeaderEntries(n, t) {
					const r = (Array.isArray(t) ? t : [t]).map((o) => o.toString()),
						i = n.toLowerCase();
					this.headers.set(i, r), this.maybeSetNormalizedName(n, i);
				}
				forEach(n) {
					this.init(),
						Array.from(this.normalizedNames.keys()).forEach((t) =>
							n(this.normalizedNames.get(t), this.headers.get(t)),
						);
				}
			}
			class KR {
				encodeKey(n) {
					return wy(n);
				}
				encodeValue(n) {
					return wy(n);
				}
				decodeKey(n) {
					return decodeURIComponent(n);
				}
				decodeValue(n) {
					return decodeURIComponent(n);
				}
			}
			const YR = /%(\d[a-f0-9])/gi,
				QR = { 40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/" };
			function wy(e) {
				return encodeURIComponent(e).replace(YR, (n, t) => QR[t] ?? n);
			}
			function sl(e) {
				return `${e}`;
			}
			class Jn {
				constructor(n = {}) {
					if (
						((this.updates = null),
						(this.cloneFrom = null),
						(this.encoder = n.encoder || new KR()),
						n.fromString)
					) {
						if (n.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
						this.map = (function ZR(e, n) {
							const t = new Map();
							return (
								e.length > 0 &&
									e
										.replace(/^\?/, "")
										.split("&")
										.forEach((i) => {
											const o = i.indexOf("="),
												[s, a] =
													-1 == o
														? [n.decodeKey(i), ""]
														: [n.decodeKey(i.slice(0, o)), n.decodeValue(i.slice(o + 1))],
												l = t.get(s) || [];
											l.push(a), t.set(s, l);
										}),
								t
							);
						})(n.fromString, this.encoder);
					} else
						n.fromObject
							? ((this.map = new Map()),
							  Object.keys(n.fromObject).forEach((t) => {
									const r = n.fromObject[t],
										i = Array.isArray(r) ? r.map(sl) : [sl(r)];
									this.map.set(t, i);
							  }))
							: (this.map = null);
				}
				has(n) {
					return this.init(), this.map.has(n);
				}
				get(n) {
					this.init();
					const t = this.map.get(n);
					return t ? t[0] : null;
				}
				getAll(n) {
					return this.init(), this.map.get(n) || null;
				}
				keys() {
					return this.init(), Array.from(this.map.keys());
				}
				append(n, t) {
					return this.clone({ param: n, value: t, op: "a" });
				}
				appendAll(n) {
					const t = [];
					return (
						Object.keys(n).forEach((r) => {
							const i = n[r];
							Array.isArray(i)
								? i.forEach((o) => {
										t.push({ param: r, value: o, op: "a" });
								  })
								: t.push({ param: r, value: i, op: "a" });
						}),
						this.clone(t)
					);
				}
				set(n, t) {
					return this.clone({ param: n, value: t, op: "s" });
				}
				delete(n, t) {
					return this.clone({ param: n, value: t, op: "d" });
				}
				toString() {
					return (
						this.init(),
						this.keys()
							.map((n) => {
								const t = this.encoder.encodeKey(n);
								return this.map
									.get(n)
									.map((r) => t + "=" + this.encoder.encodeValue(r))
									.join("&");
							})
							.filter((n) => "" !== n)
							.join("&")
					);
				}
				clone(n) {
					const t = new Jn({ encoder: this.encoder });
					return (t.cloneFrom = this.cloneFrom || this), (t.updates = (this.updates || []).concat(n)), t;
				}
				init() {
					null === this.map && (this.map = new Map()),
						null !== this.cloneFrom &&
							(this.cloneFrom.init(),
							this.cloneFrom.keys().forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
							this.updates.forEach((n) => {
								switch (n.op) {
									case "a":
									case "s":
										const t = ("a" === n.op ? this.map.get(n.param) : void 0) || [];
										t.push(sl(n.value)), this.map.set(n.param, t);
										break;
									case "d":
										if (void 0 === n.value) {
											this.map.delete(n.param);
											break;
										}
										{
											let r = this.map.get(n.param) || [];
											const i = r.indexOf(sl(n.value));
											-1 !== i && r.splice(i, 1),
												r.length > 0 ? this.map.set(n.param, r) : this.map.delete(n.param);
										}
								}
							}),
							(this.cloneFrom = this.updates = null));
				}
			}
			class XR {
				constructor() {
					this.map = new Map();
				}
				set(n, t) {
					return this.map.set(n, t), this;
				}
				get(n) {
					return this.map.has(n) || this.map.set(n, n.defaultValue()), this.map.get(n);
				}
				delete(n) {
					return this.map.delete(n), this;
				}
				has(n) {
					return this.map.has(n);
				}
				keys() {
					return this.map.keys();
				}
			}
			function Ey(e) {
				return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
			}
			function Sy(e) {
				return typeof Blob < "u" && e instanceof Blob;
			}
			function by(e) {
				return typeof FormData < "u" && e instanceof FormData;
			}
			class Wo {
				constructor(n, t, r, i) {
					let o;
					if (
						((this.url = t),
						(this.body = null),
						(this.reportProgress = !1),
						(this.withCredentials = !1),
						(this.responseType = "json"),
						(this.method = n.toUpperCase()),
						(function JR(e) {
							switch (e) {
								case "DELETE":
								case "GET":
								case "HEAD":
								case "OPTIONS":
								case "JSONP":
									return !1;
								default:
									return !0;
							}
						})(this.method) || i
							? ((this.body = void 0 !== r ? r : null), (o = i))
							: (o = r),
						o &&
							((this.reportProgress = !!o.reportProgress),
							(this.withCredentials = !!o.withCredentials),
							o.responseType && (this.responseType = o.responseType),
							o.headers && (this.headers = o.headers),
							o.context && (this.context = o.context),
							o.params && (this.params = o.params)),
						this.headers || (this.headers = new In()),
						this.context || (this.context = new XR()),
						this.params)
					) {
						const s = this.params.toString();
						if (0 === s.length) this.urlWithParams = t;
						else {
							const a = t.indexOf("?");
							this.urlWithParams = t + (-1 === a ? "?" : a < t.length - 1 ? "&" : "") + s;
						}
					} else (this.params = new Jn()), (this.urlWithParams = t);
				}
				serializeBody() {
					return null === this.body
						? null
						: Ey(this.body) ||
						  Sy(this.body) ||
						  by(this.body) ||
						  (function eP(e) {
								return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
						  })(this.body) ||
						  "string" == typeof this.body
						? this.body
						: this.body instanceof Jn
						? this.body.toString()
						: "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body)
						? JSON.stringify(this.body)
						: this.body.toString();
				}
				detectContentTypeHeader() {
					return null === this.body || by(this.body)
						? null
						: Sy(this.body)
						? this.body.type || null
						: Ey(this.body)
						? null
						: "string" == typeof this.body
						? "text/plain"
						: this.body instanceof Jn
						? "application/x-www-form-urlencoded;charset=UTF-8"
						: "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body
						? "application/json"
						: null;
				}
				clone(n = {}) {
					const t = n.method || this.method,
						r = n.url || this.url,
						i = n.responseType || this.responseType,
						o = void 0 !== n.body ? n.body : this.body,
						s = void 0 !== n.withCredentials ? n.withCredentials : this.withCredentials,
						a = void 0 !== n.reportProgress ? n.reportProgress : this.reportProgress;
					let l = n.headers || this.headers,
						c = n.params || this.params;
					const u = n.context ?? this.context;
					return (
						void 0 !== n.setHeaders &&
							(l = Object.keys(n.setHeaders).reduce((g, d) => g.set(d, n.setHeaders[d]), l)),
						n.setParams && (c = Object.keys(n.setParams).reduce((g, d) => g.set(d, n.setParams[d]), c)),
						new Wo(t, r, o, {
							params: c,
							headers: l,
							context: u,
							reportProgress: a,
							responseType: i,
							withCredentials: s,
						})
					);
				}
			}
			var Le = (() => (
				((Le = Le || {})[(Le.Sent = 0)] = "Sent"),
				(Le[(Le.UploadProgress = 1)] = "UploadProgress"),
				(Le[(Le.ResponseHeader = 2)] = "ResponseHeader"),
				(Le[(Le.DownloadProgress = 3)] = "DownloadProgress"),
				(Le[(Le.Response = 4)] = "Response"),
				(Le[(Le.User = 5)] = "User"),
				Le
			))();
			class Kg {
				constructor(n, t = 200, r = "OK") {
					(this.headers = n.headers || new In()),
						(this.status = void 0 !== n.status ? n.status : t),
						(this.statusText = n.statusText || r),
						(this.url = n.url || null),
						(this.ok = this.status >= 200 && this.status < 300);
				}
			}
			class Zg extends Kg {
				constructor(n = {}) {
					super(n), (this.type = Le.ResponseHeader);
				}
				clone(n = {}) {
					return new Zg({
						headers: n.headers || this.headers,
						status: void 0 !== n.status ? n.status : this.status,
						statusText: n.statusText || this.statusText,
						url: n.url || this.url || void 0,
					});
				}
			}
			class bi extends Kg {
				constructor(n = {}) {
					super(n), (this.type = Le.Response), (this.body = void 0 !== n.body ? n.body : null);
				}
				clone(n = {}) {
					return new bi({
						body: void 0 !== n.body ? n.body : this.body,
						headers: n.headers || this.headers,
						status: void 0 !== n.status ? n.status : this.status,
						statusText: n.statusText || this.statusText,
						url: n.url || this.url || void 0,
					});
				}
			}
			class Ty extends Kg {
				constructor(n) {
					super(n, 0, "Unknown Error"),
						(this.name = "HttpErrorResponse"),
						(this.ok = !1),
						(this.message =
							this.status >= 200 && this.status < 300
								? `Http failure during parsing for ${n.url || "(unknown url)"}`
								: `Http failure response for ${n.url || "(unknown url)"}: ${n.status} ${n.statusText}`),
						(this.error = n.error || null);
				}
			}
			function Yg(e, n) {
				return {
					body: n,
					headers: e.headers,
					context: e.context,
					observe: e.observe,
					params: e.params,
					reportProgress: e.reportProgress,
					responseType: e.responseType,
					withCredentials: e.withCredentials,
				};
			}
			let My = (() => {
				class e {
					constructor(t) {
						this.handler = t;
					}
					request(t, r, i = {}) {
						let o;
						if (t instanceof Wo) o = t;
						else {
							let l, c;
							(l = i.headers instanceof In ? i.headers : new In(i.headers)),
								i.params && (c = i.params instanceof Jn ? i.params : new Jn({ fromObject: i.params })),
								(o = new Wo(t, r, void 0 !== i.body ? i.body : null, {
									headers: l,
									context: i.context,
									params: c,
									reportProgress: i.reportProgress,
									responseType: i.responseType || "json",
									withCredentials: i.withCredentials,
								}));
						}
						const s = B(o).pipe(Si((l) => this.handler.handle(l)));
						if (t instanceof Wo || "events" === i.observe) return s;
						const a = s.pipe(Fn((l) => l instanceof bi));
						switch (i.observe || "body") {
							case "body":
								switch (o.responseType) {
									case "arraybuffer":
										return a.pipe(
											se((l) => {
												if (null !== l.body && !(l.body instanceof ArrayBuffer))
													throw new Error("Response is not an ArrayBuffer.");
												return l.body;
											}),
										);
									case "blob":
										return a.pipe(
											se((l) => {
												if (null !== l.body && !(l.body instanceof Blob))
													throw new Error("Response is not a Blob.");
												return l.body;
											}),
										);
									case "text":
										return a.pipe(
											se((l) => {
												if (null !== l.body && "string" != typeof l.body)
													throw new Error("Response is not a string.");
												return l.body;
											}),
										);
									default:
										return a.pipe(se((l) => l.body));
								}
							case "response":
								return a;
							default:
								throw new Error(`Unreachable: unhandled observe type ${i.observe}}`);
						}
					}
					delete(t, r = {}) {
						return this.request("DELETE", t, r);
					}
					get(t, r = {}) {
						return this.request("GET", t, r);
					}
					head(t, r = {}) {
						return this.request("HEAD", t, r);
					}
					jsonp(t, r) {
						return this.request("JSONP", t, {
							params: new Jn().append(r, "JSONP_CALLBACK"),
							observe: "body",
							responseType: "json",
						});
					}
					options(t, r = {}) {
						return this.request("OPTIONS", t, r);
					}
					patch(t, r, i = {}) {
						return this.request("PATCH", t, Yg(i, r));
					}
					post(t, r, i = {}) {
						return this.request("POST", t, Yg(i, r));
					}
					put(t, r, i = {}) {
						return this.request("PUT", t, Yg(i, r));
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(il));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function Ry(e, n) {
				return n(e);
			}
			function nP(e, n) {
				return (t, r) => n.intercept(t, { handle: (i) => e(i, r) });
			}
			const iP = new R(""),
				Go = new R(""),
				Py = new R("");
			function oP() {
				let e = null;
				return (n, t) => {
					null === e && (e = (M(iP, { optional: !0 }) ?? []).reduceRight(nP, Ry));
					const r = M(Ha),
						i = r.add();
					return e(n, t).pipe(zo(() => r.remove(i)));
				};
			}
			let Oy = (() => {
				class e extends il {
					constructor(t, r) {
						super(),
							(this.backend = t),
							(this.injector = r),
							(this.chain = null),
							(this.pendingTasks = M(Ha));
					}
					handle(t) {
						if (null === this.chain) {
							const i = Array.from(new Set([...this.injector.get(Go), ...this.injector.get(Py, [])]));
							this.chain = i.reduceRight(
								(o, s) =>
									(function rP(e, n, t) {
										return (r, i) => t.runInContext(() => n(r, (o) => e(o, i)));
									})(o, s, this.injector),
								Ry,
							);
						}
						const r = this.pendingTasks.add();
						return this.chain(t, (i) => this.backend.handle(i)).pipe(zo(() => this.pendingTasks.remove(r)));
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(ol), O(cn));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const cP = /^\)\]\}',?\n/;
			let Fy = (() => {
				class e {
					constructor(t) {
						this.xhrFactory = t;
					}
					handle(t) {
						if ("JSONP" === t.method) throw new w(-2800, !1);
						const r = this.xhrFactory;
						return (r.ɵloadImpl ? $e(r.ɵloadImpl()) : B(null)).pipe(
							Ut(
								() =>
									new Me((o) => {
										const s = r.build();
										if (
											(s.open(t.method, t.urlWithParams),
											t.withCredentials && (s.withCredentials = !0),
											t.headers.forEach((I, p) => s.setRequestHeader(I, p.join(","))),
											t.headers.has("Accept") ||
												s.setRequestHeader("Accept", "application/json, text/plain, */*"),
											!t.headers.has("Content-Type"))
										) {
											const I = t.detectContentTypeHeader();
											null !== I && s.setRequestHeader("Content-Type", I);
										}
										if (t.responseType) {
											const I = t.responseType.toLowerCase();
											s.responseType = "json" !== I ? I : "text";
										}
										const a = t.serializeBody();
										let l = null;
										const c = () => {
												if (null !== l) return l;
												const I = s.statusText || "OK",
													p = new In(s.getAllResponseHeaders()),
													v =
														(function uP(e) {
															return "responseURL" in e && e.responseURL
																? e.responseURL
																: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
																? e.getResponseHeader("X-Request-URL")
																: null;
														})(s) || t.url;
												return (
													(l = new Zg({
														headers: p,
														status: s.status,
														statusText: I,
														url: v,
													})),
													l
												);
											},
											u = () => {
												let { headers: I, status: p, statusText: v, url: h } = c(),
													E = null;
												204 !== p &&
													(E = typeof s.response > "u" ? s.responseText : s.response),
													0 === p && (p = E ? 200 : 0);
												let P = p >= 200 && p < 300;
												if ("json" === t.responseType && "string" == typeof E) {
													const F = E;
													E = E.replace(cP, "");
													try {
														E = "" !== E ? JSON.parse(E) : null;
													} catch (he) {
														(E = F), P && ((P = !1), (E = { error: he, text: E }));
													}
												}
												P
													? (o.next(
															new bi({
																body: E,
																headers: I,
																status: p,
																statusText: v,
																url: h || void 0,
															}),
													  ),
													  o.complete())
													: o.error(
															new Ty({
																error: E,
																headers: I,
																status: p,
																statusText: v,
																url: h || void 0,
															}),
													  );
											},
											g = (I) => {
												const { url: p } = c(),
													v = new Ty({
														error: I,
														status: s.status || 0,
														statusText: s.statusText || "Unknown Error",
														url: p || void 0,
													});
												o.error(v);
											};
										let d = !1;
										const f = (I) => {
												d || (o.next(c()), (d = !0));
												let p = { type: Le.DownloadProgress, loaded: I.loaded };
												I.lengthComputable && (p.total = I.total),
													"text" === t.responseType &&
														s.responseText &&
														(p.partialText = s.responseText),
													o.next(p);
											},
											C = (I) => {
												let p = { type: Le.UploadProgress, loaded: I.loaded };
												I.lengthComputable && (p.total = I.total), o.next(p);
											};
										return (
											s.addEventListener("load", u),
											s.addEventListener("error", g),
											s.addEventListener("timeout", g),
											s.addEventListener("abort", g),
											t.reportProgress &&
												(s.addEventListener("progress", f),
												null !== a && s.upload && s.upload.addEventListener("progress", C)),
											s.send(a),
											o.next({ type: Le.Sent }),
											() => {
												s.removeEventListener("error", g),
													s.removeEventListener("abort", g),
													s.removeEventListener("load", u),
													s.removeEventListener("timeout", g),
													t.reportProgress &&
														(s.removeEventListener("progress", f),
														null !== a &&
															s.upload &&
															s.upload.removeEventListener("progress", C)),
													s.readyState !== s.DONE && s.abort();
											}
										);
									}),
							),
						);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(ny));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Qg = new R("XSRF_ENABLED"),
				ky = new R("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => "XSRF-TOKEN" }),
				Hy = new R("XSRF_HEADER_NAME", { providedIn: "root", factory: () => "X-XSRF-TOKEN" });
			class Vy {}
			let fP = (() => {
				class e {
					constructor(t, r, i) {
						(this.doc = t),
							(this.platform = r),
							(this.cookieName = i),
							(this.lastCookieString = ""),
							(this.lastToken = null),
							(this.parseCount = 0);
					}
					getToken() {
						if ("server" === this.platform) return null;
						const t = this.doc.cookie || "";
						return (
							t !== this.lastCookieString &&
								(this.parseCount++,
								(this.lastToken = Gm(t, this.cookieName)),
								(this.lastCookieString = t)),
							this.lastToken
						);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(at), O(Sn), O(ky));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function CP(e, n) {
				const t = e.url.toLowerCase();
				if (
					!M(Qg) ||
					"GET" === e.method ||
					"HEAD" === e.method ||
					t.startsWith("http://") ||
					t.startsWith("https://")
				)
					return n(e);
				const r = M(Vy).getToken(),
					i = M(Hy);
				return null != r && !e.headers.has(i) && (e = e.clone({ headers: e.headers.set(i, r) })), n(e);
			}
			var Ie = (() => (
				((Ie = Ie || {})[(Ie.Interceptors = 0)] = "Interceptors"),
				(Ie[(Ie.LegacyInterceptors = 1)] = "LegacyInterceptors"),
				(Ie[(Ie.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
				(Ie[(Ie.NoXsrfProtection = 3)] = "NoXsrfProtection"),
				(Ie[(Ie.JsonpSupport = 4)] = "JsonpSupport"),
				(Ie[(Ie.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
				(Ie[(Ie.Fetch = 6)] = "Fetch"),
				Ie
			))();
			function Dr(e, n) {
				return { ɵkind: e, ɵproviders: n };
			}
			function IP(...e) {
				const n = [
					My,
					Fy,
					Oy,
					{ provide: il, useExisting: Oy },
					{ provide: ol, useExisting: Fy },
					{ provide: Go, useValue: CP, multi: !0 },
					{ provide: Qg, useValue: !0 },
					{ provide: Vy, useClass: fP },
				];
				for (const t of e) n.push(...t.ɵproviders);
				return (function Uc(e) {
					return { ɵproviders: e };
				})(n);
			}
			const By = new R("LEGACY_INTERCEPTOR_FN");
			let pP = (() => {
				class e {}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = tt({
						providers: [
							IP(
								Dr(Ie.LegacyInterceptors, [
									{ provide: By, useFactory: oP },
									{ provide: Go, useExisting: By, multi: !0 },
								]),
							),
						],
					})),
					e
				);
			})();
			function Uy(e, n, t, r, i, o, s) {
				try {
					var a = e[o](s),
						l = a.value;
				} catch (c) {
					return void t(c);
				}
				a.done ? n(l) : Promise.resolve(l).then(r, i);
			}
			function jy(e) {
				return function () {
					var n = this,
						t = arguments;
					return new Promise(function (r, i) {
						var o = e.apply(n, t);
						function s(l) {
							Uy(o, r, i, s, a, "next", l);
						}
						function a(l) {
							Uy(o, r, i, s, a, "throw", l);
						}
						s(void 0);
					});
				};
			}
			const $y = ["*"];
			let et = (() => {
				class e {}
				return (
					(e.STARTS_WITH = "startsWith"),
					(e.CONTAINS = "contains"),
					(e.NOT_CONTAINS = "notContains"),
					(e.ENDS_WITH = "endsWith"),
					(e.EQUALS = "equals"),
					(e.NOT_EQUALS = "notEquals"),
					(e.IN = "in"),
					(e.LESS_THAN = "lt"),
					(e.LESS_THAN_OR_EQUAL_TO = "lte"),
					(e.GREATER_THAN = "gt"),
					(e.GREATER_THAN_OR_EQUAL_TO = "gte"),
					(e.BETWEEN = "between"),
					(e.IS = "is"),
					(e.IS_NOT = "isNot"),
					(e.BEFORE = "before"),
					(e.AFTER = "after"),
					(e.DATE_IS = "dateIs"),
					(e.DATE_IS_NOT = "dateIsNot"),
					(e.DATE_BEFORE = "dateBefore"),
					(e.DATE_AFTER = "dateAfter"),
					e
				);
			})();
			const lt = {
					licenseKey: void 0,
					passKey: void 0,
					valid: !1,
					verified: !1,
					verify: function (e, n) {
						([lt.licenseKey, lt.passKey] = [e, n]), (lt.valid = lt.verified = !1);
					},
					check:
						((e = jy(function* () {
							if (!lt.verified) {
								const n = !!(typeof window < "u" && window.document && window.document.createElement);
								lt.verified = n;
								let t = !1;
								try {
									const i = (yield lt.aesGcmDecrypt(lt.licenseKey, lt.passKey)).split("_"),
										o = new Date(parseInt(i[2]));
									t = !(
										8 !== i.length ||
										2 !== i[0].length ||
										isNaN(parseInt(i[1])) ||
										"PRIMENG" !== i[3] ||
										("BASIC" === i[5] && o <= new Date()) ||
										"15" !== i[6] ||
										6 !== i[7].length
									);
								} catch {
									t = !1;
								}
								if (!t && n) {
									const r = document.createElement("a");
									r.setAttribute("href", "https://primeng.org/lts"),
										r.setAttribute(
											"style",
											"background-color: red !important; color: white !important; cursor: pointer !important; font-size: 14px !important; font-weight: bold !important; position: fixed !important; z-index: 9999999999 !important; top: 0 !important; left: 0 !important; display: inline !important; width: 100% !important; padding: 1rem !important; opacity: 1 !important; pointer-events: auto !important; visibility: visible !important;",
										);
									const i = document.createElement("marquee");
									let o, s;
									i.setAttribute("behavior", "alternate"),
										(i.innerText =
											"You are using an LTS version of PrimeNG with an invalid license, you may either switch back to a non-LTS version or purchase a license at PrimeStore."),
										r.appendChild(i),
										document.body.appendChild(r);
									const a = () => {
										o.disconnect(), s.disconnect(), r && r.remove(), (lt.verified = !1), lt.check();
									};
									(o = new MutationObserver(() => a())),
										o.observe(r, { attributes: !0, childList: !0 }),
										(s = new MutationObserver((l) =>
											l.forEach(
												(c) =>
													c.removedNodes.length > 0 &&
													c.removedNodes.forEach((u) => u.isSameNode(r) && a()),
											),
										)),
										s.observe(document.body, { childList: !0 });
								}
								lt.valid = t;
							}
							return lt.valid;
						})),
						function () {
							return e.apply(this, arguments);
						}),
					aesGcmDecrypt: (function () {
						var e = jy(function* (n, t) {
							const r = new TextEncoder().encode(t),
								i = yield crypto.subtle.digest("SHA-256", r),
								o = atob(n).slice(0, 12),
								a = { name: "AES-GCM", iv: new Uint8Array(Array.from(o).map((g) => g.charCodeAt(0))) },
								l = yield crypto.subtle.importKey("raw", i, a, !1, ["decrypt"]),
								c = atob(n).slice(12),
								u = new Uint8Array(Array.from(c).map((g) => g.charCodeAt(0)));
							try {
								const g = yield crypto.subtle.decrypt(a, l, u);
								return new TextDecoder().decode(g);
							} catch {
								throw new Error("Decrypt failed");
							}
						});
						return function (t, r) {
							return e.apply(this, arguments);
						};
					})(),
				},
				qo = Object.freeze({ verify: lt.verify, check: lt.check });
			var e;
			let zy = (() => {
					class e {
						constructor() {
							(this.ripple = !1),
								(this.overlayOptions = {}),
								(this.filterMatchModeOptions = {
									text: [
										et.STARTS_WITH,
										et.CONTAINS,
										et.NOT_CONTAINS,
										et.ENDS_WITH,
										et.EQUALS,
										et.NOT_EQUALS,
									],
									numeric: [
										et.EQUALS,
										et.NOT_EQUALS,
										et.LESS_THAN,
										et.LESS_THAN_OR_EQUAL_TO,
										et.GREATER_THAN,
										et.GREATER_THAN_OR_EQUAL_TO,
									],
									date: [et.DATE_IS, et.DATE_IS_NOT, et.DATE_BEFORE, et.DATE_AFTER],
								}),
								(this.translation = {
									startsWith: "Starts with",
									contains: "Contains",
									notContains: "Not contains",
									endsWith: "Ends with",
									equals: "Equals",
									notEquals: "Not equals",
									noFilter: "No Filter",
									lt: "Less than",
									lte: "Less than or equal to",
									gt: "Greater than",
									gte: "Greater than or equal to",
									is: "Is",
									isNot: "Is not",
									before: "Before",
									after: "After",
									dateIs: "Date is",
									dateIsNot: "Date is not",
									dateBefore: "Date is before",
									dateAfter: "Date is after",
									clear: "Clear",
									apply: "Apply",
									matchAll: "Match All",
									matchAny: "Match Any",
									addRule: "Add Rule",
									removeRule: "Remove Rule",
									accept: "Yes",
									reject: "No",
									choose: "Choose",
									upload: "Upload",
									cancel: "Cancel",
									dayNames: [
										"Sunday",
										"Monday",
										"Tuesday",
										"Wednesday",
										"Thursday",
										"Friday",
										"Saturday",
									],
									dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
									dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
									monthNames: [
										"January",
										"February",
										"March",
										"April",
										"May",
										"June",
										"July",
										"August",
										"September",
										"October",
										"November",
										"December",
									],
									monthNamesShort: [
										"Jan",
										"Feb",
										"Mar",
										"Apr",
										"May",
										"Jun",
										"Jul",
										"Aug",
										"Sep",
										"Oct",
										"Nov",
										"Dec",
									],
									dateFormat: "mm/dd/yy",
									firstDayOfWeek: 0,
									today: "Today",
									weekHeader: "Wk",
									weak: "Weak",
									medium: "Medium",
									strong: "Strong",
									passwordPrompt: "Enter a password",
									emptyMessage: "No results found",
									emptyFilterMessage: "No results found",
								}),
								(this.zIndex = { modal: 1100, overlay: 1e3, menu: 1e3, tooltip: 1100 }),
								(this.translationSource = new xt()),
								(this.translationObserver = this.translationSource.asObservable());
						}
						getTranslation(t) {
							return this.translation[t];
						}
						setTranslation(t) {
							(this.translation = { ...this.translation, ...t }),
								this.translationSource.next(this.translation);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				DP = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-header"]],
							ngContentSelectors: $y,
							decls: 1,
							vars: 0,
							template: function (t, r) {
								1 & t && (Ir(), Nn(0));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				wP = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-footer"]],
							ngContentSelectors: $y,
							decls: 1,
							vars: 0,
							template: function (t, r) {
								1 & t && (Ir(), Nn(0));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				Ko = (() => {
					class e {
						constructor(t) {
							this.template = t;
						}
						getType() {
							return this.name;
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Cn));
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "pTemplate", ""]],
							inputs: { type: "type", name: ["pTemplate", "name"] },
						})),
						e
					);
				})(),
				wr = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn] })),
						e
					);
				})(),
				EP = (() => {
					class e {}
					return (
						(e.STARTS_WITH = "startsWith"),
						(e.CONTAINS = "contains"),
						(e.NOT_CONTAINS = "notContains"),
						(e.ENDS_WITH = "endsWith"),
						(e.EQUALS = "equals"),
						(e.NOT_EQUALS = "notEquals"),
						(e.NO_FILTER = "noFilter"),
						(e.LT = "lt"),
						(e.LTE = "lte"),
						(e.GT = "gt"),
						(e.GTE = "gte"),
						(e.IS = "is"),
						(e.IS_NOT = "isNot"),
						(e.BEFORE = "before"),
						(e.AFTER = "after"),
						(e.CLEAR = "clear"),
						(e.APPLY = "apply"),
						(e.MATCH_ALL = "matchAll"),
						(e.MATCH_ANY = "matchAny"),
						(e.ADD_RULE = "addRule"),
						(e.REMOVE_RULE = "removeRule"),
						(e.ACCEPT = "accept"),
						(e.REJECT = "reject"),
						(e.CHOOSE = "choose"),
						(e.UPLOAD = "upload"),
						(e.CANCEL = "cancel"),
						(e.DAY_NAMES = "dayNames"),
						(e.DAY_NAMES_SHORT = "dayNamesShort"),
						(e.DAY_NAMES_MIN = "dayNamesMin"),
						(e.MONTH_NAMES = "monthNames"),
						(e.MONTH_NAMES_SHORT = "monthNamesShort"),
						(e.FIRST_DAY_OF_WEEK = "firstDayOfWeek"),
						(e.TODAY = "today"),
						(e.WEEK_HEADER = "weekHeader"),
						(e.WEAK = "weak"),
						(e.MEDIUM = "medium"),
						(e.STRONG = "strong"),
						(e.PASSWORD_PROMPT = "passwordPrompt"),
						(e.EMPTY_MESSAGE = "emptyMessage"),
						(e.EMPTY_FILTER_MESSAGE = "emptyFilterMessage"),
						e
					);
				})(),
				SP = (() => {
					class e {
						constructor() {
							(this.dragStartSource = new xt()),
								(this.dragStopSource = new xt()),
								(this.dragStart$ = this.dragStartSource.asObservable()),
								(this.dragStop$ = this.dragStopSource.asObservable());
						}
						startDrag(t) {
							this.dragStartSource.next(t);
						}
						stopDrag(t) {
							this.dragStopSource.next(t);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			class Ti {
				static equals(n, t, r) {
					return r ? this.resolveFieldData(n, r) === this.resolveFieldData(t, r) : this.equalsByValue(n, t);
				}
				static equalsByValue(n, t) {
					if (n === t) return !0;
					if (n && t && "object" == typeof n && "object" == typeof t) {
						var o,
							s,
							a,
							r = Array.isArray(n),
							i = Array.isArray(t);
						if (r && i) {
							if ((s = n.length) != t.length) return !1;
							for (o = s; 0 != o--; ) if (!this.equalsByValue(n[o], t[o])) return !1;
							return !0;
						}
						if (r != i) return !1;
						var l = this.isDate(n),
							c = this.isDate(t);
						if (l != c) return !1;
						if (l && c) return n.getTime() == t.getTime();
						var u = n instanceof RegExp,
							g = t instanceof RegExp;
						if (u != g) return !1;
						if (u && g) return n.toString() == t.toString();
						var d = Object.keys(n);
						if ((s = d.length) !== Object.keys(t).length) return !1;
						for (o = s; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(t, d[o])) return !1;
						for (o = s; 0 != o--; ) if (!this.equalsByValue(n[(a = d[o])], t[a])) return !1;
						return !0;
					}
					return n != n && t != t;
				}
				static resolveFieldData(n, t) {
					if (n && t) {
						if (this.isFunction(t)) return t(n);
						if (-1 == t.indexOf(".")) return n[t];
						{
							let r = t.split("."),
								i = n;
							for (let o = 0, s = r.length; o < s; ++o) {
								if (null == i) return null;
								i = i[r[o]];
							}
							return i;
						}
					}
					return null;
				}
				static isFunction(n) {
					return !!(n && n.constructor && n.call && n.apply);
				}
				static reorderArray(n, t, r) {
					n &&
						t !== r &&
						(r >= n.length && ((r %= n.length), (t %= n.length)), n.splice(r, 0, n.splice(t, 1)[0]));
				}
				static insertIntoOrderedArray(n, t, r, i) {
					if (r.length > 0) {
						let o = !1;
						for (let s = 0; s < r.length; s++)
							if (this.findIndexInList(r[s], i) > t) {
								r.splice(s, 0, n), (o = !0);
								break;
							}
						o || r.push(n);
					} else r.push(n);
				}
				static findIndexInList(n, t) {
					let r = -1;
					if (t)
						for (let i = 0; i < t.length; i++)
							if (t[i] == n) {
								r = i;
								break;
							}
					return r;
				}
				static contains(n, t) {
					if (null != n && t && t.length) for (let r of t) if (this.equals(n, r)) return !0;
					return !1;
				}
				static removeAccents(n) {
					return (
						n &&
							n.search(/[\xC0-\xFF]/g) > -1 &&
							(n = n
								.replace(/[\xC0-\xC5]/g, "A")
								.replace(/[\xC6]/g, "AE")
								.replace(/[\xC7]/g, "C")
								.replace(/[\xC8-\xCB]/g, "E")
								.replace(/[\xCC-\xCF]/g, "I")
								.replace(/[\xD0]/g, "D")
								.replace(/[\xD1]/g, "N")
								.replace(/[\xD2-\xD6\xD8]/g, "O")
								.replace(/[\xD9-\xDC]/g, "U")
								.replace(/[\xDD]/g, "Y")
								.replace(/[\xDE]/g, "P")
								.replace(/[\xE0-\xE5]/g, "a")
								.replace(/[\xE6]/g, "ae")
								.replace(/[\xE7]/g, "c")
								.replace(/[\xE8-\xEB]/g, "e")
								.replace(/[\xEC-\xEF]/g, "i")
								.replace(/[\xF1]/g, "n")
								.replace(/[\xF2-\xF6\xF8]/g, "o")
								.replace(/[\xF9-\xFC]/g, "u")
								.replace(/[\xFE]/g, "p")
								.replace(/[\xFD\xFF]/g, "y")),
						n
					);
				}
				static isDate(n) {
					return "[object Date]" === Object.prototype.toString.call(n);
				}
				static isEmpty(n) {
					return (
						null == n ||
						"" === n ||
						(Array.isArray(n) && 0 === n.length) ||
						(!this.isDate(n) && "object" == typeof n && 0 === Object.keys(n).length)
					);
				}
				static isNotEmpty(n) {
					return !this.isEmpty(n);
				}
				static compare(n, t, r, i = 1) {
					let o = -1;
					const s = this.isEmpty(n),
						a = this.isEmpty(t);
					return (
						(o =
							s && a
								? 0
								: s
								? i
								: a
								? -i
								: "string" == typeof n && "string" == typeof t
								? n.localeCompare(t, r, { numeric: !0 })
								: n < t
								? -1
								: n > t
								? 1
								: 0),
						o
					);
				}
				static sort(n, t, r = 1, i, o = 1) {
					return (1 === o ? r : o) * Ti.compare(n, t, i, r);
				}
				static merge(n, t) {
					if (null != n || null != t)
						return (null != n && "object" != typeof n) || (null != t && "object" != typeof t)
							? (null != n && "string" != typeof n) || (null != t && "string" != typeof t)
								? t || n
								: [n || "", t || ""].join(" ")
							: { ...(n || {}), ...(t || {}) };
				}
			}
			!(function bP() {
				let e = [];
				const i = (o) => (o && parseInt(o.style.zIndex, 10)) || 0;
			})();
			const TP = ["*"];
			let Mi = (() => {
					class e {
						constructor() {
							this.spin = !1;
						}
						ngOnInit() {
							this.getAttributes();
						}
						getAttributes() {
							const t = Ti.isEmpty(this.label);
							(this.role = t ? void 0 : "img"),
								(this.ariaLabel = t ? void 0 : this.label),
								(this.ariaHidden = t);
						}
						getClassNames() {
							return `p-icon ${this.styleClass ? this.styleClass + " " : ""}${
								this.spin ? "p-icon-spin" : ""
							}`;
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["ng-component"]],
							hostAttrs: [1, "p-element", "p-icon-wrapper"],
							inputs: { label: "label", spin: "spin", styleClass: "styleClass" },
							standalone: !0,
							features: [xn],
							ngContentSelectors: TP,
							decls: 1,
							vars: 0,
							template: function (t, r) {
								1 & t && (Ir(), Nn(0));
							},
							encapsulation: 2,
							changeDetection: 0,
						})),
						e
					);
				})(),
				Ni = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["SpinnerIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 6,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								["clip-path", "url(#clip0_417_21408)"],
								[
									"d",
									"M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
									"fill",
									"currentColor",
								],
								["id", "clip0_417_21408"],
								["width", "14", "height", "14", "fill", "white"],
							],
							template: function (t, r) {
								1 & t &&
									(cr(),
									N(0, "svg", 0)(1, "g", 1),
									K(2, "path", 2),
									x(),
									N(3, "defs")(4, "clipPath", 3),
									K(5, "rect", 4),
									x()()()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				X = (() => {
					class e {
						static addClass(t, r) {
							t && r && (t.classList ? t.classList.add(r) : (t.className += " " + r));
						}
						static addMultipleClasses(t, r) {
							if (t && r)
								if (t.classList) {
									let i = r.trim().split(" ");
									for (let o = 0; o < i.length; o++) t.classList.add(i[o]);
								} else {
									let i = r.split(" ");
									for (let o = 0; o < i.length; o++) t.className += " " + i[o];
								}
						}
						static removeClass(t, r) {
							t &&
								r &&
								(t.classList
									? t.classList.remove(r)
									: (t.className = t.className.replace(
											new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"),
											" ",
									  )));
						}
						static hasClass(t, r) {
							return (
								!(!t || !r) &&
								(t.classList
									? t.classList.contains(r)
									: new RegExp("(^| )" + r + "( |$)", "gi").test(t.className))
							);
						}
						static siblings(t) {
							return Array.prototype.filter.call(t.parentNode.children, function (r) {
								return r !== t;
							});
						}
						static find(t, r) {
							return Array.from(t.querySelectorAll(r));
						}
						static findSingle(t, r) {
							return t ? t.querySelector(r) : null;
						}
						static index(t) {
							let r = t.parentNode.childNodes,
								i = 0;
							for (var o = 0; o < r.length; o++) {
								if (r[o] == t) return i;
								1 == r[o].nodeType && i++;
							}
							return -1;
						}
						static indexWithinGroup(t, r) {
							let i = t.parentNode ? t.parentNode.childNodes : [],
								o = 0;
							for (var s = 0; s < i.length; s++) {
								if (i[s] == t) return o;
								i[s].attributes && i[s].attributes[r] && 1 == i[s].nodeType && o++;
							}
							return -1;
						}
						static appendOverlay(t, r, i = "self") {
							"self" !== i && t && r && this.appendChild(t, r);
						}
						static alignOverlay(t, r, i = "self", o = !0) {
							t &&
								r &&
								(o && (t.style.minWidth = `${e.getOuterWidth(r)}px`),
								"self" === i ? this.relativePosition(t, r) : this.absolutePosition(t, r));
						}
						static relativePosition(t, r) {
							const i = (I) => {
									if (I)
										return "relative" === getComputedStyle(I).getPropertyValue("position")
											? I
											: i(I.parentElement);
								},
								o = t.offsetParent
									? { width: t.offsetWidth, height: t.offsetHeight }
									: this.getHiddenElementDimensions(t),
								s = r.offsetHeight,
								a = r.getBoundingClientRect(),
								l = this.getWindowScrollTop(),
								c = this.getWindowScrollLeft(),
								u = this.getViewport(),
								d = i(t)?.getBoundingClientRect() || { top: -1 * l, left: -1 * c };
							let f, C;
							a.top + s + o.height > u.height
								? ((f = a.top - d.top - o.height),
								  (t.style.transformOrigin = "bottom"),
								  a.top + f < 0 && (f = -1 * a.top))
								: ((f = s + a.top - d.top), (t.style.transformOrigin = "top")),
								(C =
									o.width > u.width
										? -1 * (a.left - d.left)
										: a.left - d.left + o.width > u.width
										? -1 * (a.left - d.left + o.width - u.width)
										: a.left - d.left),
								(t.style.top = f + "px"),
								(t.style.left = C + "px");
						}
						static absolutePosition(t, r) {
							const i = t.offsetParent
									? { width: t.offsetWidth, height: t.offsetHeight }
									: this.getHiddenElementDimensions(t),
								o = i.height,
								s = i.width,
								a = r.offsetHeight,
								l = r.offsetWidth,
								c = r.getBoundingClientRect(),
								u = this.getWindowScrollTop(),
								g = this.getWindowScrollLeft(),
								d = this.getViewport();
							let f, C;
							c.top + a + o > d.height
								? ((f = c.top + u - o), (t.style.transformOrigin = "bottom"), f < 0 && (f = u))
								: ((f = a + c.top + u), (t.style.transformOrigin = "top")),
								(C = c.left + s > d.width ? Math.max(0, c.left + g + l - s) : c.left + g),
								(t.style.top = f + "px"),
								(t.style.left = C + "px");
						}
						static getParents(t, r = []) {
							return null === t.parentNode ? r : this.getParents(t.parentNode, r.concat([t.parentNode]));
						}
						static getScrollableParents(t) {
							let r = [];
							if (t) {
								let i = this.getParents(t);
								const o = /(auto|scroll)/,
									s = (a) => {
										let l = window.getComputedStyle(a, null);
										return (
											o.test(l.getPropertyValue("overflow")) ||
											o.test(l.getPropertyValue("overflowX")) ||
											o.test(l.getPropertyValue("overflowY"))
										);
									};
								for (let a of i) {
									let l = 1 === a.nodeType && a.dataset.scrollselectors;
									if (l) {
										let c = l.split(",");
										for (let u of c) {
											let g = this.findSingle(a, u);
											g && s(g) && r.push(g);
										}
									}
									9 !== a.nodeType && s(a) && r.push(a);
								}
							}
							return r;
						}
						static getHiddenElementOuterHeight(t) {
							(t.style.visibility = "hidden"), (t.style.display = "block");
							let r = t.offsetHeight;
							return (t.style.display = "none"), (t.style.visibility = "visible"), r;
						}
						static getHiddenElementOuterWidth(t) {
							(t.style.visibility = "hidden"), (t.style.display = "block");
							let r = t.offsetWidth;
							return (t.style.display = "none"), (t.style.visibility = "visible"), r;
						}
						static getHiddenElementDimensions(t) {
							let r = {};
							return (
								(t.style.visibility = "hidden"),
								(t.style.display = "block"),
								(r.width = t.offsetWidth),
								(r.height = t.offsetHeight),
								(t.style.display = "none"),
								(t.style.visibility = "visible"),
								r
							);
						}
						static scrollInView(t, r) {
							let i = getComputedStyle(t).getPropertyValue("borderTopWidth"),
								o = i ? parseFloat(i) : 0,
								s = getComputedStyle(t).getPropertyValue("paddingTop"),
								a = s ? parseFloat(s) : 0,
								l = t.getBoundingClientRect(),
								u =
									r.getBoundingClientRect().top +
									document.body.scrollTop -
									(l.top + document.body.scrollTop) -
									o -
									a,
								g = t.scrollTop,
								d = t.clientHeight,
								f = this.getOuterHeight(r);
							u < 0 ? (t.scrollTop = g + u) : u + f > d && (t.scrollTop = g + u - d + f);
						}
						static fadeIn(t, r) {
							t.style.opacity = 0;
							let i = +new Date(),
								o = 0,
								s = function () {
									(o = +t.style.opacity.replace(",", ".") + (new Date().getTime() - i) / r),
										(t.style.opacity = o),
										(i = +new Date()),
										+o < 1 &&
											((window.requestAnimationFrame && requestAnimationFrame(s)) ||
												setTimeout(s, 16));
								};
							s();
						}
						static fadeOut(t, r) {
							var i = 1,
								a = 50 / r;
							let l = setInterval(() => {
								(i -= a) <= 0 && ((i = 0), clearInterval(l)), (t.style.opacity = i);
							}, 50);
						}
						static getWindowScrollTop() {
							let t = document.documentElement;
							return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
						}
						static getWindowScrollLeft() {
							let t = document.documentElement;
							return (window.pageXOffset || t.scrollLeft) - (t.clientLeft || 0);
						}
						static matches(t, r) {
							var i = Element.prototype;
							return (
								i.matches ||
								i.webkitMatchesSelector ||
								i.mozMatchesSelector ||
								i.msMatchesSelector ||
								function (s) {
									return -1 !== [].indexOf.call(document.querySelectorAll(s), this);
								}
							).call(t, r);
						}
						static getOuterWidth(t, r) {
							let i = t.offsetWidth;
							if (r) {
								let o = getComputedStyle(t);
								i += parseFloat(o.marginLeft) + parseFloat(o.marginRight);
							}
							return i;
						}
						static getHorizontalPadding(t) {
							let r = getComputedStyle(t);
							return parseFloat(r.paddingLeft) + parseFloat(r.paddingRight);
						}
						static getHorizontalMargin(t) {
							let r = getComputedStyle(t);
							return parseFloat(r.marginLeft) + parseFloat(r.marginRight);
						}
						static innerWidth(t) {
							let r = t.offsetWidth,
								i = getComputedStyle(t);
							return (r += parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)), r;
						}
						static width(t) {
							let r = t.offsetWidth,
								i = getComputedStyle(t);
							return (r -= parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)), r;
						}
						static getInnerHeight(t) {
							let r = t.offsetHeight,
								i = getComputedStyle(t);
							return (r += parseFloat(i.paddingTop) + parseFloat(i.paddingBottom)), r;
						}
						static getOuterHeight(t, r) {
							let i = t.offsetHeight;
							if (r) {
								let o = getComputedStyle(t);
								i += parseFloat(o.marginTop) + parseFloat(o.marginBottom);
							}
							return i;
						}
						static getHeight(t) {
							let r = t.offsetHeight,
								i = getComputedStyle(t);
							return (
								(r -=
									parseFloat(i.paddingTop) +
									parseFloat(i.paddingBottom) +
									parseFloat(i.borderTopWidth) +
									parseFloat(i.borderBottomWidth)),
								r
							);
						}
						static getWidth(t) {
							let r = t.offsetWidth,
								i = getComputedStyle(t);
							return (
								(r -=
									parseFloat(i.paddingLeft) +
									parseFloat(i.paddingRight) +
									parseFloat(i.borderLeftWidth) +
									parseFloat(i.borderRightWidth)),
								r
							);
						}
						static getViewport() {
							let t = window,
								r = document,
								i = r.documentElement,
								o = r.getElementsByTagName("body")[0];
							return {
								width: t.innerWidth || i.clientWidth || o.clientWidth,
								height: t.innerHeight || i.clientHeight || o.clientHeight,
							};
						}
						static getOffset(t) {
							var r = t.getBoundingClientRect();
							return {
								top:
									r.top +
									(window.pageYOffset ||
										document.documentElement.scrollTop ||
										document.body.scrollTop ||
										0),
								left:
									r.left +
									(window.pageXOffset ||
										document.documentElement.scrollLeft ||
										document.body.scrollLeft ||
										0),
							};
						}
						static replaceElementWith(t, r) {
							let i = t.parentNode;
							if (!i) throw "Can't replace element";
							return i.replaceChild(r, t);
						}
						static getUserAgent() {
							if (navigator && this.isClient()) return navigator.userAgent;
						}
						static isIE() {
							var t = window.navigator.userAgent;
							return (
								t.indexOf("MSIE ") > 0 ||
								(t.indexOf("Trident/") > 0 ? (t.indexOf("rv:"), !0) : t.indexOf("Edge/") > 0)
							);
						}
						static isIOS() {
							return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
						}
						static isAndroid() {
							return /(android)/i.test(navigator.userAgent);
						}
						static isTouchDevice() {
							return "ontouchstart" in window || navigator.maxTouchPoints > 0;
						}
						static appendChild(t, r) {
							if (this.isElement(r)) r.appendChild(t);
							else {
								if (!r.el || !r.el.nativeElement) throw "Cannot append " + r + " to " + t;
								r.el.nativeElement.appendChild(t);
							}
						}
						static removeChild(t, r) {
							if (this.isElement(r)) r.removeChild(t);
							else {
								if (!r.el || !r.el.nativeElement) throw "Cannot remove " + t + " from " + r;
								r.el.nativeElement.removeChild(t);
							}
						}
						static removeElement(t) {
							"remove" in Element.prototype ? t.remove() : t.parentNode.removeChild(t);
						}
						static isElement(t) {
							return "object" == typeof HTMLElement
								? t instanceof HTMLElement
								: t &&
										"object" == typeof t &&
										null !== t &&
										1 === t.nodeType &&
										"string" == typeof t.nodeName;
						}
						static calculateScrollbarWidth(t) {
							if (t) {
								let r = getComputedStyle(t);
								return (
									t.offsetWidth -
									t.clientWidth -
									parseFloat(r.borderLeftWidth) -
									parseFloat(r.borderRightWidth)
								);
							}
							{
								if (null !== this.calculatedScrollbarWidth) return this.calculatedScrollbarWidth;
								let r = document.createElement("div");
								(r.className = "p-scrollbar-measure"), document.body.appendChild(r);
								let i = r.offsetWidth - r.clientWidth;
								return document.body.removeChild(r), (this.calculatedScrollbarWidth = i), i;
							}
						}
						static calculateScrollbarHeight() {
							if (null !== this.calculatedScrollbarHeight) return this.calculatedScrollbarHeight;
							let t = document.createElement("div");
							(t.className = "p-scrollbar-measure"), document.body.appendChild(t);
							let r = t.offsetHeight - t.clientHeight;
							return document.body.removeChild(t), (this.calculatedScrollbarWidth = r), r;
						}
						static invokeElementMethod(t, r, i) {
							t[r].apply(t, i);
						}
						static clearSelection() {
							if (window.getSelection)
								window.getSelection().empty
									? window.getSelection().empty()
									: window.getSelection().removeAllRanges &&
									  window.getSelection().rangeCount > 0 &&
									  window.getSelection().getRangeAt(0).getClientRects().length > 0 &&
									  window.getSelection().removeAllRanges();
							else if (document.selection && document.selection.empty)
								try {
									document.selection.empty();
								} catch {}
						}
						static getBrowser() {
							if (!this.browser) {
								let t = this.resolveUserAgent();
								(this.browser = {}),
									t.browser && ((this.browser[t.browser] = !0), (this.browser.version = t.version)),
									this.browser.chrome
										? (this.browser.webkit = !0)
										: this.browser.webkit && (this.browser.safari = !0);
							}
							return this.browser;
						}
						static resolveUserAgent() {
							let t = navigator.userAgent.toLowerCase(),
								r =
									/(chrome)[ \/]([\w.]+)/.exec(t) ||
									/(webkit)[ \/]([\w.]+)/.exec(t) ||
									/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) ||
									/(msie) ([\w.]+)/.exec(t) ||
									(t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)) ||
									[];
							return { browser: r[1] || "", version: r[2] || "0" };
						}
						static isInteger(t) {
							return Number.isInteger
								? Number.isInteger(t)
								: "number" == typeof t && isFinite(t) && Math.floor(t) === t;
						}
						static isHidden(t) {
							return !t || null === t.offsetParent;
						}
						static isVisible(t) {
							return t && null != t.offsetParent;
						}
						static isExist(t) {
							return null !== t && typeof t < "u" && t.nodeName && t.parentNode;
						}
						static focus(t, r) {
							t && document.activeElement !== t && t.focus(r);
						}
						static getFocusableElements(t) {
							let r = e.find(
									t,
									'button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),\n                [href]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]):not(.p-disabled)',
								),
								i = [];
							for (let o of r)
								(o.offsetWidth || o.offsetHeight || o.getClientRects().length) && i.push(o);
							return i;
						}
						static getNextFocusableElement(t, r = !1) {
							const i = e.getFocusableElements(t);
							let o = 0;
							if (i && i.length > 0) {
								const s = i.indexOf(i[0].ownerDocument.activeElement);
								r
									? (o = -1 == s || 0 === s ? i.length - 1 : s - 1)
									: -1 != s && s !== i.length - 1 && (o = s + 1);
							}
							return i[o];
						}
						static generateZIndex() {
							return (this.zindex = this.zindex || 999), ++this.zindex;
						}
						static getSelection() {
							return window.getSelection
								? window.getSelection().toString()
								: document.getSelection
								? document.getSelection().toString()
								: document.selection
								? document.selection.createRange().text
								: null;
						}
						static getTargetElement(t, r) {
							if (!t) return null;
							switch (t) {
								case "document":
									return document;
								case "window":
									return window;
								case "@next":
									return r?.nextElementSibling;
								case "@prev":
									return r?.previousElementSibling;
								case "@parent":
									return r?.parentElement;
								case "@grandparent":
									return r?.parentElement.parentElement;
								default:
									const i = typeof t;
									if ("string" === i) return document.querySelector(t);
									if ("object" === i && t.hasOwnProperty("nativeElement"))
										return this.isExist(t.nativeElement) ? t.nativeElement : void 0;
									const s = (a = t) && a.constructor && a.call && a.apply ? t() : t;
									return (s && 9 === s.nodeType) || this.isExist(s) ? s : null;
							}
							var a;
						}
						static isClient() {
							return !!(typeof window < "u" && window.document && window.document.createElement);
						}
					}
					return (
						(e.zindex = 1e3), (e.calculatedScrollbarWidth = null), (e.calculatedScrollbarHeight = null), e
					);
				})(),
				Gy = (() => {
					class e {
						constructor(t, r, i, o, s, a) {
							(this.document = t),
								(this.platformId = r),
								(this.renderer = i),
								(this.el = o),
								(this.zone = s),
								(this.config = a);
						}
						ngAfterViewInit() {
							kg(this.platformId) &&
								this.config &&
								this.config.ripple &&
								this.zone.runOutsideAngular(() => {
									this.create(),
										(this.mouseDownListener = this.renderer.listen(
											this.el.nativeElement,
											"mousedown",
											this.onMouseDown.bind(this),
										));
								}),
								qo.check();
						}
						onMouseDown(t) {
							let r = this.getInk();
							if (!r || "none" === this.document.defaultView.getComputedStyle(r, null).display) return;
							if ((X.removeClass(r, "p-ink-active"), !X.getHeight(r) && !X.getWidth(r))) {
								let a = Math.max(
									X.getOuterWidth(this.el.nativeElement),
									X.getOuterHeight(this.el.nativeElement),
								);
								(r.style.height = a + "px"), (r.style.width = a + "px");
							}
							let i = X.getOffset(this.el.nativeElement),
								o = t.pageX - i.left + this.document.body.scrollTop - X.getWidth(r) / 2,
								s = t.pageY - i.top + this.document.body.scrollLeft - X.getHeight(r) / 2;
							this.renderer.setStyle(r, "top", s + "px"),
								this.renderer.setStyle(r, "left", o + "px"),
								X.addClass(r, "p-ink-active"),
								(this.timeout = setTimeout(() => {
									let a = this.getInk();
									a && X.removeClass(a, "p-ink-active");
								}, 401));
						}
						getInk() {
							const t = this.el.nativeElement.children;
							for (let r = 0; r < t.length; r++)
								if ("string" == typeof t[r].className && -1 !== t[r].className.indexOf("p-ink"))
									return t[r];
							return null;
						}
						resetInk() {
							let t = this.getInk();
							t && X.removeClass(t, "p-ink-active");
						}
						onAnimationEnd(t) {
							this.timeout && clearTimeout(this.timeout), X.removeClass(t.currentTarget, "p-ink-active");
						}
						create() {
							let t = this.renderer.createElement("span");
							this.renderer.addClass(t, "p-ink"),
								this.renderer.appendChild(this.el.nativeElement, t),
								this.animationListener ||
									(this.animationListener = this.renderer.listen(
										t,
										"animationend",
										this.onAnimationEnd.bind(this),
									));
						}
						remove() {
							let t = this.getInk();
							t &&
								(this.mouseDownListener(),
								this.animationListener(),
								(this.mouseDownListener = null),
								(this.animationListener = null),
								X.removeElement(t));
						}
						ngOnDestroy() {
							this.config && this.config.ripple && this.remove();
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(at), S(Sn), S(ei), S(Wt), S(Ce), S(zy, 8));
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "pRipple", ""]],
							hostAttrs: [1, "p-ripple", "p-element"],
						})),
						e
					);
				})(),
				qy = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn] })),
						e
					);
				})();
			function MP(e, n) {
				1 & e && De(0);
			}
			function NP(e, n) {
				if ((1 & e && K(0, "span", 8), 2 & e)) {
					const t = _(3);
					xe("p-button-loading-icon " + t.loadingIcon), A("ngClass", t.iconClass());
				}
			}
			function xP(e, n) {
				1 & e && K(0, "SpinnerIcon", 9),
					2 & e && A("styleClass", _(3).iconClass() + " p-button-loading-icon")("spin", !0);
			}
			function RP(e, n) {
				if ((1 & e && (ve(0), y(1, NP, 1, 3, "span", 6), y(2, xP, 1, 2, "SpinnerIcon", 7), _e()), 2 & e)) {
					const t = _(2);
					m(1), A("ngIf", t.loadingIcon), m(1), A("ngIf", !t.loadingIcon);
				}
			}
			function PP(e, n) {}
			function OP(e, n) {
				1 & e && y(0, PP, 0, 0, "ng-template");
			}
			function LP(e, n) {
				if ((1 & e && (N(0, "span", 10), y(1, OP, 1, 0, null, 1), x()), 2 & e)) {
					const t = _(2);
					m(1), A("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function FP(e, n) {
				if ((1 & e && (ve(0), y(1, RP, 3, 2, "ng-container", 2), y(2, LP, 2, 1, "span", 5), _e()), 2 & e)) {
					const t = _();
					m(1), A("ngIf", !t.loadingIconTemplate), m(1), A("ngIf", t.loadingIconTemplate);
				}
			}
			function kP(e, n) {
				if ((1 & e && K(0, "span", 8), 2 & e)) {
					const t = _(2);
					xe(t.icon), A("ngClass", t.iconClass());
				}
			}
			function HP(e, n) {}
			function VP(e, n) {
				1 & e && y(0, HP, 0, 0, "ng-template", 12), 2 & e && A("ngIf", !_(3).icon);
			}
			function BP(e, n) {
				if ((1 & e && (N(0, "span", 8), y(1, VP, 1, 1, null, 1), x()), 2 & e)) {
					const t = _(2);
					A("ngClass", t.iconClass()), m(1), A("ngTemplateOutlet", t.iconTemplate);
				}
			}
			function UP(e, n) {
				if ((1 & e && (ve(0), y(1, kP, 1, 3, "span", 6), y(2, BP, 2, 2, "span", 11), _e()), 2 & e)) {
					const t = _();
					m(1), A("ngIf", t.icon && !t.iconTemplate), m(1), A("ngIf", !t.icon && t.iconTemplate);
				}
			}
			function jP(e, n) {
				if ((1 & e && (N(0, "span", 13), Ft(1), x()), 2 & e)) {
					const t = _();
					We("aria-hidden", t.icon && !t.label), m(1), fi(t.label);
				}
			}
			function $P(e, n) {
				if ((1 & e && (N(0, "span", 8), Ft(1), x()), 2 & e)) {
					const t = _();
					xe(t.badgeClass), A("ngClass", t.badgeStyleClass()), m(1), fi(t.badge);
				}
			}
			const zP = ["*"];
			let WP = (() => {
					class e {
						constructor() {
							(this.type = "button"),
								(this.iconPos = "left"),
								(this.loading = !1),
								(this.onClick = new re()),
								(this.onFocus = new re()),
								(this.onBlur = new re());
						}
						iconClass() {
							return {
								"p-button-icon": !0,
								"p-button-icon-left": "left" === this.iconPos && this.label,
								"p-button-icon-right": "right" === this.iconPos && this.label,
								"p-button-icon-top": "top" === this.iconPos && this.label,
								"p-button-icon-bottom": "bottom" === this.iconPos && this.label,
							};
						}
						buttonClass() {
							return {
								"p-button p-component": !0,
								"p-button-icon-only": this.icon && !this.label,
								"p-button-vertical":
									("top" === this.iconPos || "bottom" === this.iconPos) && this.label,
								"p-disabled": this.disabled || this.loading,
								"p-button-loading": this.loading,
								"p-button-loading-label-only": this.loading && !this.icon && this.label,
							};
						}
						ngAfterViewInit() {
							qo.check();
						}
						ngAfterContentInit() {
							this.templates.forEach((t) => {
								switch (t.getType()) {
									case "content":
									default:
										this.contentTemplate = t.template;
										break;
									case "icon":
										this.iconTemplate = t.template;
										break;
									case "loadingicon":
										this.loadingIconTemplate = t.template;
								}
							});
						}
						badgeStyleClass() {
							return {
								"p-badge p-component": !0,
								"p-badge-no-gutter": this.badge && 1 === String(this.badge).length,
							};
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-button"]],
							contentQueries: function (t, r, i) {
								if ((1 & t && Zn(i, Ko, 4), 2 & t)) {
									let o;
									bt((o = Tt())) && (r.templates = o);
								}
							},
							hostAttrs: [1, "p-element"],
							inputs: {
								type: "type",
								iconPos: "iconPos",
								icon: "icon",
								badge: "badge",
								label: "label",
								disabled: "disabled",
								loading: "loading",
								loadingIcon: "loadingIcon",
								style: "style",
								styleClass: "styleClass",
								badgeClass: "badgeClass",
								ariaLabel: "ariaLabel",
							},
							outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" },
							ngContentSelectors: zP,
							decls: 7,
							vars: 12,
							consts: [
								["pRipple", "", 3, "ngStyle", "disabled", "ngClass", "click", "focus", "blur"],
								[4, "ngTemplateOutlet"],
								[4, "ngIf"],
								["class", "p-button-label", 4, "ngIf"],
								[3, "ngClass", "class", 4, "ngIf"],
								["class", "p-button-loading-icon", 4, "ngIf"],
								[3, "class", "ngClass", 4, "ngIf"],
								[3, "styleClass", "spin", 4, "ngIf"],
								[3, "ngClass"],
								[3, "styleClass", "spin"],
								[1, "p-button-loading-icon"],
								[3, "ngClass", 4, "ngIf"],
								[3, "ngIf"],
								[1, "p-button-label"],
							],
							template: function (t, r) {
								1 & t &&
									(Ir(),
									N(0, "button", 0),
									it("click", function (o) {
										return r.onClick.emit(o);
									})("focus", function (o) {
										return r.onFocus.emit(o);
									})("blur", function (o) {
										return r.onBlur.emit(o);
									}),
									Nn(1),
									y(2, MP, 1, 0, "ng-container", 1),
									y(3, FP, 3, 2, "ng-container", 2),
									y(4, UP, 3, 2, "ng-container", 2),
									y(5, jP, 2, 2, "span", 3),
									y(6, $P, 2, 4, "span", 4),
									x()),
									2 & t &&
										(xe(r.styleClass),
										A("ngStyle", r.style)("disabled", r.disabled || r.loading)(
											"ngClass",
											r.buttonClass(),
										),
										We("type", r.type)("aria-label", r.ariaLabel),
										m(2),
										A("ngTemplateOutlet", r.contentTemplate),
										m(1),
										A("ngIf", r.loading),
										m(1),
										A("ngIf", !r.loading),
										m(1),
										A("ngIf", !r.contentTemplate && r.label),
										m(1),
										A("ngIf", !r.contentTemplate && r.badge));
							},
							dependencies: function () {
								return [_i, Di, Ei, wi, Gy, Ni];
							},
							encapsulation: 2,
							changeDetection: 0,
						})),
						e
					);
				})(),
				GP = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn, qy, wr, Ni, wr] })),
						e
					);
				})();
			function qP(e, n) {
				1 & e && De(0);
			}
			function KP(e, n) {
				if ((1 & e && (N(0, "div", 8), Nn(1, 1), y(2, qP, 1, 0, "ng-container", 6), x()), 2 & e)) {
					const t = _();
					m(2), A("ngTemplateOutlet", t.headerTemplate);
				}
			}
			function ZP(e, n) {
				1 & e && De(0);
			}
			function YP(e, n) {
				if ((1 & e && (N(0, "div", 9), Ft(1), y(2, ZP, 1, 0, "ng-container", 6), x()), 2 & e)) {
					const t = _();
					m(1), mr(" ", t.header, " "), m(1), A("ngTemplateOutlet", t.titleTemplate);
				}
			}
			function QP(e, n) {
				1 & e && De(0);
			}
			function XP(e, n) {
				if ((1 & e && (N(0, "div", 10), Ft(1), y(2, QP, 1, 0, "ng-container", 6), x()), 2 & e)) {
					const t = _();
					m(1), mr(" ", t.subheader, " "), m(1), A("ngTemplateOutlet", t.subtitleTemplate);
				}
			}
			function JP(e, n) {
				1 & e && De(0);
			}
			function eO(e, n) {
				1 & e && De(0);
			}
			function tO(e, n) {
				if ((1 & e && (N(0, "div", 11), Nn(1, 2), y(2, eO, 1, 0, "ng-container", 6), x()), 2 & e)) {
					const t = _();
					m(2), A("ngTemplateOutlet", t.footerTemplate);
				}
			}
			const nO = ["*", [["p-header"]], [["p-footer"]]],
				rO = ["*", "p-header", "p-footer"];
			let Ky = (() => {
					class e {
						constructor(t) {
							this.el = t;
						}
						ngAfterContentInit() {
							this.templates.forEach((t) => {
								switch (t.getType()) {
									case "header":
										this.headerTemplate = t.template;
										break;
									case "title":
										this.titleTemplate = t.template;
										break;
									case "subtitle":
										this.subtitleTemplate = t.template;
										break;
									case "content":
									default:
										this.contentTemplate = t.template;
										break;
									case "footer":
										this.footerTemplate = t.template;
								}
							});
						}
						ngAfterViewInit() {
							qo.check();
						}
						getBlockableElement() {
							return this.el.nativeElement.children[0];
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Wt));
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-card"]],
							contentQueries: function (t, r, i) {
								if ((1 & t && (Zn(i, DP, 5), Zn(i, wP, 5), Zn(i, Ko, 4)), 2 & t)) {
									let o;
									bt((o = Tt())) && (r.headerFacet = o.first),
										bt((o = Tt())) && (r.footerFacet = o.first),
										bt((o = Tt())) && (r.templates = o);
								}
							},
							hostAttrs: [1, "p-element"],
							inputs: {
								header: "header",
								subheader: "subheader",
								style: "style",
								styleClass: "styleClass",
							},
							ngContentSelectors: rO,
							decls: 9,
							vars: 9,
							consts: [
								[3, "ngClass", "ngStyle"],
								["class", "p-card-header", 4, "ngIf"],
								[1, "p-card-body"],
								["class", "p-card-title", 4, "ngIf"],
								["class", "p-card-subtitle", 4, "ngIf"],
								[1, "p-card-content"],
								[4, "ngTemplateOutlet"],
								["class", "p-card-footer", 4, "ngIf"],
								[1, "p-card-header"],
								[1, "p-card-title"],
								[1, "p-card-subtitle"],
								[1, "p-card-footer"],
							],
							template: function (t, r) {
								1 & t &&
									(Ir(nO),
									N(0, "div", 0),
									y(1, KP, 3, 1, "div", 1),
									N(2, "div", 2),
									y(3, YP, 3, 2, "div", 3),
									y(4, XP, 3, 2, "div", 4),
									N(5, "div", 5),
									Nn(6),
									y(7, JP, 1, 0, "ng-container", 6),
									x(),
									y(8, tO, 3, 1, "div", 7),
									x()()),
									2 & t &&
										(xe(r.styleClass),
										A("ngClass", "p-card p-component")("ngStyle", r.style),
										m(1),
										A("ngIf", r.headerFacet || r.headerTemplate),
										m(2),
										A("ngIf", r.header || r.titleTemplate),
										m(1),
										A("ngIf", r.subheader || r.subtitleTemplate),
										m(3),
										A("ngTemplateOutlet", r.contentTemplate),
										m(1),
										A("ngIf", r.footerFacet || r.footerTemplate));
							},
							dependencies: [_i, Di, Ei, wi],
							styles: [".p-card-header img{width:100%}\n"],
							encapsulation: 2,
							changeDetection: 0,
						})),
						e
					);
				})(),
				iO = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn, wr] })),
						e
					);
				})(),
				Zy = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["CheckIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 2,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								[
									"d",
									"M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
									"fill",
									"currentColor",
								],
							],
							template: function (t, r) {
								1 & t && (cr(), N(0, "svg", 0), K(1, "path", 1), x()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				Yy = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["ChevronDownIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 2,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								[
									"d",
									"M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
									"fill",
									"currentColor",
								],
							],
							template: function (t, r) {
								1 & t && (cr(), N(0, "svg", 0), K(1, "path", 1), x()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				Qy = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["ChevronRightIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 2,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								[
									"d",
									"M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
									"fill",
									"currentColor",
								],
							],
							template: function (t, r) {
								1 & t && (cr(), N(0, "svg", 0), K(1, "path", 1), x()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				Xy = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["MinusIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 2,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								[
									"d",
									"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",
									"fill",
									"currentColor",
								],
							],
							template: function (t, r) {
								1 & t && (cr(), N(0, "svg", 0), K(1, "path", 1), x()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							dependencies: [Qn],
							encapsulation: 2,
						})),
						e
					);
				})(),
				Jy = (() => {
					class e extends Mi {}
					return (
						(e.ɵfac = (function () {
							let n;
							return function (r) {
								return (n || (n = Wn(e)))(r || e);
							};
						})()),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["SearchIcon"]],
							standalone: !0,
							features: [qn, xn],
							decls: 6,
							vars: 5,
							consts: [
								[
									"width",
									"14",
									"height",
									"14",
									"viewBox",
									"0 0 14 14",
									"fill",
									"none",
									"xmlns",
									"http://www.w3.org/2000/svg",
								],
								["clip-path", "url(#clip0_238_9909)"],
								[
									"fill-rule",
									"evenodd",
									"clip-rule",
									"evenodd",
									"d",
									"M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
									"fill",
									"currentColor",
								],
								["id", "clip0_238_9909"],
								["width", "14", "height", "14", "fill", "white"],
							],
							template: function (t, r) {
								1 & t &&
									(cr(),
									N(0, "svg", 0)(1, "g", 1),
									K(2, "path", 2),
									x(),
									N(3, "defs")(4, "clipPath", 3),
									K(5, "rect", 4),
									x()()()),
									2 & t &&
										(xe(r.getClassNames()),
										We("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
							},
							encapsulation: 2,
						})),
						e
					);
				})();
			const oO = ["element"],
				sO = ["content"];
			function aO(e, n) {
				1 & e && De(0);
			}
			const Xg = function (e, n) {
				return { $implicit: e, options: n };
			};
			function lO(e, n) {
				if ((1 & e && (ve(0), y(1, aO, 1, 0, "ng-container", 7), _e()), 2 & e)) {
					const t = _(2);
					m(1),
						A("ngTemplateOutlet", t.contentTemplate)(
							"ngTemplateOutletContext",
							Rn(2, Xg, t.loadedItems, t.getContentOptions()),
						);
				}
			}
			function cO(e, n) {
				1 & e && De(0);
			}
			function uO(e, n) {
				if ((1 & e && (ve(0), y(1, cO, 1, 0, "ng-container", 7), _e()), 2 & e)) {
					const t = n.$implicit,
						r = n.index,
						i = _(3);
					m(1),
						A("ngTemplateOutlet", i.itemTemplate)("ngTemplateOutletContext", Rn(2, Xg, t, i.getOptions(r)));
				}
			}
			const gO = function (e) {
				return { "p-scroller-loading": e };
			};
			function dO(e, n) {
				if ((1 & e && (N(0, "div", 8, 9), y(2, uO, 2, 5, "ng-container", 10), x()), 2 & e)) {
					const t = _(2);
					A("ngClass", Re(4, gO, t.d_loading))("ngStyle", t.contentStyle),
						m(2),
						A("ngForOf", t.loadedItems)("ngForTrackBy", t._trackBy || t.index);
				}
			}
			function fO(e, n) {
				1 & e && K(0, "div", 11), 2 & e && A("ngStyle", _(2).spacerStyle);
			}
			function CO(e, n) {
				1 & e && De(0);
			}
			const IO = function (e) {
					return { numCols: e };
				},
				ev = function (e) {
					return { options: e };
				};
			function hO(e, n) {
				if ((1 & e && (ve(0), y(1, CO, 1, 0, "ng-container", 7), _e()), 2 & e)) {
					const t = n.index,
						r = _(4);
					m(1),
						A("ngTemplateOutlet", r.loaderTemplate)(
							"ngTemplateOutletContext",
							Re(4, ev, r.getLoaderOptions(t, r.both && Re(2, IO, r._numItemsInViewport.cols))),
						);
				}
			}
			function pO(e, n) {
				if ((1 & e && (ve(0), y(1, hO, 2, 6, "ng-container", 14), _e()), 2 & e)) {
					const t = _(3);
					m(1), A("ngForOf", t.loaderArr);
				}
			}
			function AO(e, n) {
				1 & e && De(0);
			}
			const mO = function () {
				return { styleClass: "p-scroller-loading-icon" };
			};
			function yO(e, n) {
				if ((1 & e && (ve(0), y(1, AO, 1, 0, "ng-container", 7), _e()), 2 & e)) {
					const t = _(4);
					m(1),
						A("ngTemplateOutlet", t.loaderIconTemplate)(
							"ngTemplateOutletContext",
							Re(
								3,
								ev,
								(function CA(e, n, t) {
									const r = nt() + e,
										i = D();
									return i[r] === G
										? gn(i, r, t ? n.call(t) : n())
										: (function Do(e, n) {
												return e[n];
										  })(i, r);
								})(2, mO),
							),
						);
				}
			}
			function vO(e, n) {
				1 & e && K(0, "SpinnerIcon", 16), 2 & e && A("styleClass", "p-scroller-loading-icon");
			}
			function _O(e, n) {
				if (
					(1 & e && (y(0, yO, 2, 5, "ng-container", 0), y(1, vO, 1, 1, "ng-template", null, 15, Fo)), 2 & e)
				) {
					const t = bo(2);
					A("ngIf", _(3).loaderIconTemplate)("ngIfElse", t);
				}
			}
			const DO = function (e) {
				return { "p-component-overlay": e };
			};
			function wO(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 12),
						y(1, pO, 2, 1, "ng-container", 0),
						y(2, _O, 3, 2, "ng-template", null, 13, Fo),
						x()),
					2 & e)
				) {
					const t = bo(3),
						r = _(2);
					A("ngClass", Re(3, DO, !r.loaderTemplate)), m(1), A("ngIf", r.loaderTemplate)("ngIfElse", t);
				}
			}
			const EO = function (e, n, t) {
				return { "p-scroller": !0, "p-scroller-inline": e, "p-both-scroll": n, "p-horizontal-scroll": t };
			};
			function SO(e, n) {
				if (1 & e) {
					const t = dn();
					ve(0),
						N(1, "div", 2, 3),
						it("scroll", function (i) {
							return ee(t), te(_().onContainerScroll(i));
						}),
						y(3, lO, 2, 5, "ng-container", 0),
						y(4, dO, 3, 6, "ng-template", null, 4, Fo),
						y(6, fO, 1, 1, "div", 5),
						y(7, wO, 4, 5, "div", 6),
						x(),
						_e();
				}
				if (2 & e) {
					const t = bo(5),
						r = _();
					m(1),
						xe(r._styleClass),
						A("ngStyle", r._style)("ngClass", Uu(10, EO, r.inline, r.both, r.horizontal)),
						We("id", r._id)("tabindex", r.tabindex),
						m(2),
						A("ngIf", r.contentTemplate)("ngIfElse", t),
						m(3),
						A("ngIf", r._showSpacer),
						m(1),
						A("ngIf", !r.loaderDisabled && r._showLoader && r.d_loading);
				}
			}
			function bO(e, n) {
				1 & e && De(0);
			}
			const TO = function (e, n) {
				return { rows: e, columns: n };
			};
			function MO(e, n) {
				if ((1 & e && (ve(0), y(1, bO, 1, 0, "ng-container", 7), _e()), 2 & e)) {
					const t = _(2);
					m(1),
						A("ngTemplateOutlet", t.contentTemplate)(
							"ngTemplateOutletContext",
							Rn(5, Xg, t.items, Rn(2, TO, t._items, t.loadedColumns)),
						);
				}
			}
			function NO(e, n) {
				if ((1 & e && (Nn(0), y(1, MO, 2, 8, "ng-container", 17)), 2 & e)) {
					const t = _();
					m(1), A("ngIf", t.contentTemplate);
				}
			}
			const xO = ["*"];
			let RO = (() => {
					class e {
						constructor(t, r, i, o, s) {
							(this.document = t),
								(this.platformId = r),
								(this.renderer = i),
								(this.cd = o),
								(this.zone = s),
								(this.onLazyLoad = new re()),
								(this.onScroll = new re()),
								(this.onScrollIndexChange = new re()),
								(this._tabindex = 0),
								(this._itemSize = 0),
								(this._orientation = "vertical"),
								(this._step = 0),
								(this._delay = 0),
								(this._resizeDelay = 10),
								(this._appendOnly = !1),
								(this._inline = !1),
								(this._lazy = !1),
								(this._disabled = !1),
								(this._loaderDisabled = !1),
								(this._showSpacer = !0),
								(this._showLoader = !1),
								(this._autoSize = !1),
								(this.d_loading = !1),
								(this.first = 0),
								(this.last = 0),
								(this.page = 0),
								(this.isRangeChanged = !1),
								(this.numItemsInViewport = 0),
								(this.lastScrollPos = 0),
								(this.lazyLoadState = {}),
								(this.loaderArr = []),
								(this.spacerStyle = {}),
								(this.contentStyle = {}),
								(this.initialized = !1);
						}
						get id() {
							return this._id;
						}
						set id(t) {
							this._id = t;
						}
						get style() {
							return this._style;
						}
						set style(t) {
							this._style = t;
						}
						get styleClass() {
							return this._styleClass;
						}
						set styleClass(t) {
							this._styleClass = t;
						}
						get tabindex() {
							return this._tabindex;
						}
						set tabindex(t) {
							this._tabindex = t;
						}
						get items() {
							return this._items;
						}
						set items(t) {
							this._items = t;
						}
						get itemSize() {
							return this._itemSize;
						}
						set itemSize(t) {
							this._itemSize = t;
						}
						get scrollHeight() {
							return this._scrollHeight;
						}
						set scrollHeight(t) {
							this._scrollHeight = t;
						}
						get scrollWidth() {
							return this._scrollWidth;
						}
						set scrollWidth(t) {
							this._scrollWidth = t;
						}
						get orientation() {
							return this._orientation;
						}
						set orientation(t) {
							this._orientation = t;
						}
						get step() {
							return this._step;
						}
						set step(t) {
							this._step = t;
						}
						get delay() {
							return this._delay;
						}
						set delay(t) {
							this._delay = t;
						}
						get resizeDelay() {
							return this._resizeDelay;
						}
						set resizeDelay(t) {
							this._resizeDelay = t;
						}
						get appendOnly() {
							return this._appendOnly;
						}
						set appendOnly(t) {
							this._appendOnly = t;
						}
						get inline() {
							return this._inline;
						}
						set inline(t) {
							this._inline = t;
						}
						get lazy() {
							return this._lazy;
						}
						set lazy(t) {
							this._lazy = t;
						}
						get disabled() {
							return this._disabled;
						}
						set disabled(t) {
							this._disabled = t;
						}
						get loaderDisabled() {
							return this._loaderDisabled;
						}
						set loaderDisabled(t) {
							this._loaderDisabled = t;
						}
						get columns() {
							return this._columns;
						}
						set columns(t) {
							this._columns = t;
						}
						get showSpacer() {
							return this._showSpacer;
						}
						set showSpacer(t) {
							this._showSpacer = t;
						}
						get showLoader() {
							return this._showLoader;
						}
						set showLoader(t) {
							this._showLoader = t;
						}
						get numToleratedItems() {
							return this._numToleratedItems;
						}
						set numToleratedItems(t) {
							this._numToleratedItems = t;
						}
						get loading() {
							return this._loading;
						}
						set loading(t) {
							this._loading = t;
						}
						get autoSize() {
							return this._autoSize;
						}
						set autoSize(t) {
							this._autoSize = t;
						}
						get trackBy() {
							return this._trackBy;
						}
						set trackBy(t) {
							this._trackBy = t;
						}
						get options() {
							return this._options;
						}
						set options(t) {
							(this._options = t),
								t &&
									"object" == typeof t &&
									Object.entries(t).forEach(([r, i]) => this[`_${r}`] !== i && (this[`_${r}`] = i));
						}
						get vertical() {
							return "vertical" === this._orientation;
						}
						get horizontal() {
							return "horizontal" === this._orientation;
						}
						get both() {
							return "both" === this._orientation;
						}
						get loadedItems() {
							return this._items && !this.d_loading
								? this.both
									? this._items
											.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows)
											.map((t) =>
												this._columns
													? t
													: t.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols),
											)
									: this.horizontal && this._columns
									? this._items
									: this._items.slice(this._appendOnly ? 0 : this.first, this.last)
								: [];
						}
						get loadedRows() {
							return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
						}
						get loadedColumns() {
							return this._columns && (this.both || this.horizontal)
								? this.d_loading && this._loaderDisabled
									? this.both
										? this.loaderArr[0]
										: this.loaderArr
									: this._columns.slice(
											this.both ? this.first.cols : this.first,
											this.both ? this.last.cols : this.last,
									  )
								: this._columns;
						}
						get isPageChanged() {
							return !this._step || this.page !== this.getPageByFirst();
						}
						ngOnInit() {
							this.setInitialState();
						}
						ngOnChanges(t) {
							let r = !1;
							if (t.loading) {
								const { previousValue: i, currentValue: o } = t.loading;
								this.lazy && i !== o && o !== this.d_loading && ((this.d_loading = o), (r = !0));
							}
							if (
								(t.orientation && (this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0),
								t.numToleratedItems)
							) {
								const { previousValue: i, currentValue: o } = t.numToleratedItems;
								i !== o && o !== this.d_numToleratedItems && (this.d_numToleratedItems = o);
							}
							if (t.options) {
								const { previousValue: i, currentValue: o } = t.options;
								this.lazy &&
									i?.loading !== o?.loading &&
									o?.loading !== this.d_loading &&
									((this.d_loading = o.loading), (r = !0)),
									i?.numToleratedItems !== o?.numToleratedItems &&
										o?.numToleratedItems !== this.d_numToleratedItems &&
										(this.d_numToleratedItems = o.numToleratedItems);
							}
							this.initialized &&
								!r &&
								(t.items?.previousValue?.length !== t.items?.currentValue?.length ||
									t.itemSize ||
									t.scrollHeight ||
									t.scrollWidth) &&
								(this.init(), this.calculateAutoSize());
						}
						ngAfterContentInit() {
							this.templates.forEach((t) => {
								switch (t.getType()) {
									case "content":
										this.contentTemplate = t.template;
										break;
									case "item":
									default:
										this.itemTemplate = t.template;
										break;
									case "loader":
										this.loaderTemplate = t.template;
										break;
									case "loadericon":
										this.loaderIconTemplate = t.template;
								}
							});
						}
						ngAfterViewInit() {
							Promise.resolve().then(() => {
								this.viewInit();
							}),
								qo.check();
						}
						ngAfterViewChecked() {
							this.initialized || this.viewInit();
						}
						ngOnDestroy() {
							this.unbindResizeListener(), (this.contentEl = null), (this.initialized = !1);
						}
						viewInit() {
							kg(this.platformId) &&
								X.isVisible(this.elementViewChild?.nativeElement) &&
								(this.setInitialState(),
								this.setContentEl(this.contentEl),
								this.init(),
								(this.defaultWidth = X.getWidth(this.elementViewChild.nativeElement)),
								(this.defaultHeight = X.getHeight(this.elementViewChild.nativeElement)),
								(this.defaultContentWidth = X.getWidth(this.contentEl)),
								(this.defaultContentHeight = X.getHeight(this.contentEl)),
								(this.initialized = !0));
						}
						init() {
							this._disabled ||
								(this.setSize(),
								this.calculateOptions(),
								this.setSpacerSize(),
								this.bindResizeListener(),
								this.cd.detectChanges());
						}
						setContentEl(t) {
							this.contentEl =
								t ||
								this.contentViewChild?.nativeElement ||
								X.findSingle(this.elementViewChild?.nativeElement, ".p-scroller-content");
						}
						setInitialState() {
							(this.first = this.both ? { rows: 0, cols: 0 } : 0),
								(this.last = this.both ? { rows: 0, cols: 0 } : 0),
								(this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0),
								(this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0),
								(this.d_loading = this._loading || !1),
								(this.d_numToleratedItems = this._numToleratedItems),
								(this.loaderArr = []),
								(this.spacerStyle = {}),
								(this.contentStyle = {});
						}
						getElementRef() {
							return this.elementViewChild;
						}
						getPageByFirst() {
							return Math.floor((this.first + 4 * this.d_numToleratedItems) / (this._step || 1));
						}
						scrollTo(t) {
							(this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0),
								this.elementViewChild?.nativeElement?.scrollTo(t);
						}
						scrollToIndex(t, r = "auto") {
							const { numToleratedItems: i } = this.calculateNumItems(),
								o = this.getContentPosition(),
								s = (u = 0, g) => (u <= g ? 0 : u),
								a = (u, g, d) => u * g + d,
								l = (u = 0, g = 0) => this.scrollTo({ left: u, top: g, behavior: r });
							let c = 0;
							this.both
								? ((c = { rows: s(t[0], i[0]), cols: s(t[1], i[1]) }),
								  l(a(c.cols, this._itemSize[1], o.left), a(c.rows, this._itemSize[0], o.top)))
								: ((c = s(t, i)),
								  this.horizontal
										? l(a(c, this._itemSize, o.left), 0)
										: l(0, a(c, this._itemSize, o.top))),
								(this.isRangeChanged = this.first !== c),
								(this.first = c);
						}
						scrollInView(t, r, i = "auto") {
							if (r) {
								const { first: o, viewport: s } = this.getRenderedRange(),
									a = (u = 0, g = 0) => this.scrollTo({ left: u, top: g, behavior: i }),
									c = "to-end" === r;
								if ("to-start" === r) {
									if (this.both)
										s.first.rows - o.rows > t[0]
											? a(
													s.first.cols * this._itemSize[1],
													(s.first.rows - 1) * this._itemSize[0],
											  )
											: s.first.cols - o.cols > t[1] &&
											  a(
													(s.first.cols - 1) * this._itemSize[1],
													s.first.rows * this._itemSize[0],
											  );
									else if (s.first - o > t) {
										const u = (s.first - 1) * this._itemSize;
										this.horizontal ? a(u, 0) : a(0, u);
									}
								} else if (c)
									if (this.both)
										s.last.rows - o.rows <= t[0] + 1
											? a(
													s.first.cols * this._itemSize[1],
													(s.first.rows + 1) * this._itemSize[0],
											  )
											: s.last.cols - o.cols <= t[1] + 1 &&
											  a(
													(s.first.cols + 1) * this._itemSize[1],
													s.first.rows * this._itemSize[0],
											  );
									else if (s.last - o <= t + 1) {
										const u = (s.first + 1) * this._itemSize;
										this.horizontal ? a(u, 0) : a(0, u);
									}
							} else this.scrollToIndex(t, i);
						}
						getRenderedRange() {
							const t = (o, s) => Math.floor(o / (s || o));
							let r = this.first,
								i = 0;
							if (this.elementViewChild?.nativeElement) {
								const { scrollTop: o, scrollLeft: s } = this.elementViewChild.nativeElement;
								this.both
									? ((r = { rows: t(o, this._itemSize[0]), cols: t(s, this._itemSize[1]) }),
									  (i = {
											rows: r.rows + this.numItemsInViewport.rows,
											cols: r.cols + this.numItemsInViewport.cols,
									  }))
									: ((r = t(this.horizontal ? s : o, this._itemSize)),
									  (i = r + this.numItemsInViewport));
							}
							return { first: this.first, last: this.last, viewport: { first: r, last: i } };
						}
						calculateNumItems() {
							const t = this.getContentPosition(),
								r =
									(this.elementViewChild?.nativeElement
										? this.elementViewChild.nativeElement.offsetWidth - t.left
										: 0) || 0,
								i =
									(this.elementViewChild?.nativeElement
										? this.elementViewChild.nativeElement.offsetHeight - t.top
										: 0) || 0,
								o = (c, u) => Math.ceil(c / (u || c)),
								s = (c) => Math.ceil(c / 2),
								a = this.both
									? { rows: o(i, this._itemSize[0]), cols: o(r, this._itemSize[1]) }
									: o(this.horizontal ? r : i, this._itemSize);
							return {
								numItemsInViewport: a,
								numToleratedItems:
									this.d_numToleratedItems || (this.both ? [s(a.rows), s(a.cols)] : s(a)),
							};
						}
						calculateOptions() {
							const { numItemsInViewport: t, numToleratedItems: r } = this.calculateNumItems(),
								i = (a, l, c, u = !1) => this.getLast(a + l + (a < c ? 2 : 3) * c, u),
								o = this.first,
								s = this.both
									? {
											rows: i(this.first.rows, t.rows, r[0]),
											cols: i(this.first.cols, t.cols, r[1], !0),
									  }
									: i(this.first, t, r);
							(this.last = s),
								(this.numItemsInViewport = t),
								(this.d_numToleratedItems = r),
								this.showLoader &&
									(this.loaderArr = this.both
										? Array.from({ length: t.rows }).map(() => Array.from({ length: t.cols }))
										: Array.from({ length: t })),
								this._lazy &&
									Promise.resolve().then(() => {
										(this.lazyLoadState = {
											first: this._step ? (this.both ? { rows: 0, cols: o.cols } : 0) : o,
											last: Math.min(this._step ? this._step : this.last, this.items.length),
										}),
											this.handleEvents("onLazyLoad", this.lazyLoadState);
									});
						}
						calculateAutoSize() {
							this._autoSize &&
								!this.d_loading &&
								Promise.resolve().then(() => {
									if (this.contentEl) {
										(this.contentEl.style.minHeight = this.contentEl.style.minWidth = "auto"),
											(this.contentEl.style.position = "relative"),
											(this.elementViewChild.nativeElement.style.contain = "none");
										const [t, r] = [X.getWidth(this.contentEl), X.getHeight(this.contentEl)];
										t !== this.defaultContentWidth &&
											(this.elementViewChild.nativeElement.style.width = ""),
											r !== this.defaultContentHeight &&
												(this.elementViewChild.nativeElement.style.height = "");
										const [i, o] = [
											X.getWidth(this.elementViewChild.nativeElement),
											X.getHeight(this.elementViewChild.nativeElement),
										];
										(this.both || this.horizontal) &&
											(this.elementViewChild.nativeElement.style.width =
												i < this.defaultWidth
													? i + "px"
													: this._scrollWidth || this.defaultWidth + "px"),
											(this.both || this.vertical) &&
												(this.elementViewChild.nativeElement.style.height =
													o < this.defaultHeight
														? o + "px"
														: this._scrollHeight || this.defaultHeight + "px"),
											(this.contentEl.style.minHeight = this.contentEl.style.minWidth = ""),
											(this.contentEl.style.position = ""),
											(this.elementViewChild.nativeElement.style.contain = "");
									}
								});
						}
						getLast(t = 0, r = !1) {
							return this._items
								? Math.min(r ? (this._columns || this._items[0]).length : this._items.length, t)
								: 0;
						}
						getContentPosition() {
							if (this.contentEl) {
								const t = getComputedStyle(this.contentEl),
									r = parseFloat(t.paddingLeft) + Math.max(parseFloat(t.left) || 0, 0),
									i = parseFloat(t.paddingRight) + Math.max(parseFloat(t.right) || 0, 0),
									o = parseFloat(t.paddingTop) + Math.max(parseFloat(t.top) || 0, 0),
									s = parseFloat(t.paddingBottom) + Math.max(parseFloat(t.bottom) || 0, 0);
								return { left: r, right: i, top: o, bottom: s, x: r + i, y: o + s };
							}
							return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
						}
						setSize() {
							if (this.elementViewChild?.nativeElement) {
								const t = this.elementViewChild.nativeElement.parentElement.parentElement,
									r =
										this._scrollWidth ||
										`${this.elementViewChild.nativeElement.offsetWidth || t.offsetWidth}px`,
									i =
										this._scrollHeight ||
										`${this.elementViewChild.nativeElement.offsetHeight || t.offsetHeight}px`,
									o = (s, a) => (this.elementViewChild.nativeElement.style[s] = a);
								this.both || this.horizontal ? (o("height", i), o("width", r)) : o("height", i);
							}
						}
						setSpacerSize() {
							if (this._items) {
								const t = this.getContentPosition(),
									r = (i, o, s, a = 0) =>
										(this.spacerStyle = {
											...this.spacerStyle,
											[`${i}`]: (o || []).length * s + a + "px",
										});
								this.both
									? (r("height", this._items, this._itemSize[0], t.y),
									  r("width", this._columns || this._items[1], this._itemSize[1], t.x))
									: this.horizontal
									? r("width", this._columns || this._items, this._itemSize, t.x)
									: r("height", this._items, this._itemSize, t.y);
							}
						}
						setContentPosition(t) {
							if (this.contentEl && !this._appendOnly) {
								const r = t ? t.first : this.first,
									i = (s, a) => s * a,
									o = (s = 0, a = 0) =>
										(this.contentStyle = {
											...this.contentStyle,
											transform: `translate3d(${s}px, ${a}px, 0)`,
										});
								if (this.both) o(i(r.cols, this._itemSize[1]), i(r.rows, this._itemSize[0]));
								else {
									const s = i(r, this._itemSize);
									this.horizontal ? o(s, 0) : o(0, s);
								}
							}
						}
						onScrollPositionChange(t) {
							const r = t.target,
								i = this.getContentPosition(),
								o = (p, v) => (p ? (p > v ? p - v : p) : 0),
								s = (p, v) => Math.floor(p / (v || p)),
								a = (p, v, h, E, P, F) => (p <= P ? P : F ? h - E - P : v + P - 1),
								l = (p, v, h, E, P, F, he) =>
									p <= F ? 0 : Math.max(0, he ? (p < v ? h : p - F) : p > v ? h : p - 2 * F),
								c = (p, v, h, E, P, F = !1) => {
									let he = v + E + 2 * P;
									return p >= P && (he += P + 1), this.getLast(he, F);
								},
								u = o(r.scrollTop, i.top),
								g = o(r.scrollLeft, i.left);
							let d = this.both ? { rows: 0, cols: 0 } : 0,
								f = this.last,
								C = !1,
								I = this.lastScrollPos;
							if (this.both) {
								const p = this.lastScrollPos.top <= u,
									v = this.lastScrollPos.left <= g;
								if (!this._appendOnly || (this._appendOnly && (p || v))) {
									const h = { rows: s(u, this._itemSize[0]), cols: s(g, this._itemSize[1]) },
										E = {
											rows: a(
												h.rows,
												this.first.rows,
												this.last.rows,
												this.numItemsInViewport.rows,
												this.d_numToleratedItems[0],
												p,
											),
											cols: a(
												h.cols,
												this.first.cols,
												this.last.cols,
												this.numItemsInViewport.cols,
												this.d_numToleratedItems[1],
												v,
											),
										};
									(d = {
										rows: l(h.rows, E.rows, this.first.rows, 0, 0, this.d_numToleratedItems[0], p),
										cols: l(h.cols, E.cols, this.first.cols, 0, 0, this.d_numToleratedItems[1], v),
									}),
										(f = {
											rows: c(
												h.rows,
												d.rows,
												0,
												this.numItemsInViewport.rows,
												this.d_numToleratedItems[0],
											),
											cols: c(
												h.cols,
												d.cols,
												0,
												this.numItemsInViewport.cols,
												this.d_numToleratedItems[1],
												!0,
											),
										}),
										(C =
											d.rows !== this.first.rows ||
											f.rows !== this.last.rows ||
											d.cols !== this.first.cols ||
											f.cols !== this.last.cols ||
											this.isRangeChanged),
										(I = { top: u, left: g });
								}
							} else {
								const p = this.horizontal ? g : u,
									v = this.lastScrollPos <= p;
								if (!this._appendOnly || (this._appendOnly && v)) {
									const h = s(p, this._itemSize);
									(d = l(
										h,
										a(
											h,
											this.first,
											this.last,
											this.numItemsInViewport,
											this.d_numToleratedItems,
											v,
										),
										this.first,
										0,
										0,
										this.d_numToleratedItems,
										v,
									)),
										(f = c(h, d, 0, this.numItemsInViewport, this.d_numToleratedItems)),
										(C = d !== this.first || f !== this.last || this.isRangeChanged),
										(I = p);
								}
							}
							return { first: d, last: f, isRangeChanged: C, scrollPos: I };
						}
						onScrollChange(t) {
							const {
								first: r,
								last: i,
								isRangeChanged: o,
								scrollPos: s,
							} = this.onScrollPositionChange(t);
							if (o) {
								const a = { first: r, last: i };
								if (
									(this.setContentPosition(a),
									(this.first = r),
									(this.last = i),
									(this.lastScrollPos = s),
									this.handleEvents("onScrollIndexChange", a),
									this._lazy && this.isPageChanged)
								) {
									const l = {
										first: this._step
											? Math.min(
													this.getPageByFirst() * this._step,
													this.items.length - this._step,
											  )
											: r,
										last: Math.min(
											this._step ? (this.getPageByFirst() + 1) * this._step : i,
											this.items.length,
										),
									};
									(this.lazyLoadState.first !== l.first || this.lazyLoadState.last !== l.last) &&
										this.handleEvents("onLazyLoad", l),
										(this.lazyLoadState = l);
								}
							}
						}
						onContainerScroll(t) {
							if (
								(this.handleEvents("onScroll", { originalEvent: t }), this._delay && this.isPageChanged)
							) {
								if (
									(this.scrollTimeout && clearTimeout(this.scrollTimeout),
									!this.d_loading && this.showLoader)
								) {
									const { isRangeChanged: r } = this.onScrollPositionChange(t);
									(r || (this._step && this.isPageChanged)) &&
										((this.d_loading = !0), this.cd.detectChanges());
								}
								this.scrollTimeout = setTimeout(() => {
									this.onScrollChange(t),
										this.d_loading &&
											this.showLoader &&
											(!this._lazy || void 0 === this._loading) &&
											((this.d_loading = !1),
											(this.page = this.getPageByFirst()),
											this.cd.detectChanges());
								}, this._delay);
							} else !this.d_loading && this.onScrollChange(t);
						}
						bindResizeListener() {
							kg(this.platformId) &&
								(this.windowResizeListener ||
									this.zone.runOutsideAngular(() => {
										const t = this.document.defaultView,
											r = X.isTouchDevice() ? "orientationchange" : "resize";
										this.windowResizeListener = this.renderer.listen(
											t,
											r,
											this.onWindowResize.bind(this),
										);
									}));
						}
						unbindResizeListener() {
							this.windowResizeListener &&
								(this.windowResizeListener(), (this.windowResizeListener = null));
						}
						onWindowResize() {
							this.resizeTimeout && clearTimeout(this.resizeTimeout),
								(this.resizeTimeout = setTimeout(() => {
									if (X.isVisible(this.elementViewChild?.nativeElement)) {
										const [t, r] = [
												X.getWidth(this.elementViewChild.nativeElement),
												X.getHeight(this.elementViewChild.nativeElement),
											],
											[i, o] = [t !== this.defaultWidth, r !== this.defaultHeight];
										(this.both ? i || o : this.horizontal ? i : this.vertical && o) &&
											this.zone.run(() => {
												(this.d_numToleratedItems = this._numToleratedItems),
													(this.defaultWidth = t),
													(this.defaultHeight = r),
													(this.defaultContentWidth = X.getWidth(this.contentEl)),
													(this.defaultContentHeight = X.getHeight(this.contentEl)),
													this.init();
											});
									}
								}, this._resizeDelay));
						}
						handleEvents(t, r) {
							return this.options && this.options[t] ? this.options[t](r) : this[t].emit(r);
						}
						getContentOptions() {
							return {
								contentStyleClass: "p-scroller-content " + (this.d_loading ? "p-scroller-loading" : ""),
								items: this.loadedItems,
								getItemOptions: (t) => this.getOptions(t),
								loading: this.d_loading,
								getLoaderOptions: (t, r) => this.getLoaderOptions(t, r),
								itemSize: this._itemSize,
								rows: this.loadedRows,
								columns: this.loadedColumns,
								spacerStyle: this.spacerStyle,
								contentStyle: this.contentStyle,
								vertical: this.vertical,
								horizontal: this.horizontal,
								both: this.both,
							};
						}
						getOptions(t) {
							const r = (this._items || []).length,
								i = this.both ? this.first.rows + t : this.first + t;
							return {
								index: i,
								count: r,
								first: 0 === i,
								last: i === r - 1,
								even: i % 2 == 0,
								odd: i % 2 != 0,
							};
						}
						getLoaderOptions(t, r) {
							const i = this.loaderArr.length;
							return {
								index: t,
								count: i,
								first: 0 === t,
								last: t === i - 1,
								even: t % 2 == 0,
								odd: t % 2 != 0,
								...r,
							};
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(at), S(Sn), S(ei), S(Ho), S(Ce));
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-scroller"]],
							contentQueries: function (t, r, i) {
								if ((1 & t && Zn(i, Ko, 4), 2 & t)) {
									let o;
									bt((o = Tt())) && (r.templates = o);
								}
							},
							viewQuery: function (t, r) {
								if ((1 & t && (pi(oO, 5), pi(sO, 5)), 2 & t)) {
									let i;
									bt((i = Tt())) && (r.elementViewChild = i.first),
										bt((i = Tt())) && (r.contentViewChild = i.first);
								}
							},
							hostAttrs: [1, "p-scroller-viewport", "p-element"],
							inputs: {
								id: "id",
								style: "style",
								styleClass: "styleClass",
								tabindex: "tabindex",
								items: "items",
								itemSize: "itemSize",
								scrollHeight: "scrollHeight",
								scrollWidth: "scrollWidth",
								orientation: "orientation",
								step: "step",
								delay: "delay",
								resizeDelay: "resizeDelay",
								appendOnly: "appendOnly",
								inline: "inline",
								lazy: "lazy",
								disabled: "disabled",
								loaderDisabled: "loaderDisabled",
								columns: "columns",
								showSpacer: "showSpacer",
								showLoader: "showLoader",
								numToleratedItems: "numToleratedItems",
								loading: "loading",
								autoSize: "autoSize",
								trackBy: "trackBy",
								options: "options",
							},
							outputs: {
								onLazyLoad: "onLazyLoad",
								onScroll: "onScroll",
								onScrollIndexChange: "onScrollIndexChange",
							},
							features: [_n],
							ngContentSelectors: xO,
							decls: 3,
							vars: 2,
							consts: [
								[4, "ngIf", "ngIfElse"],
								["disabledContainer", ""],
								[3, "ngStyle", "ngClass", "scroll"],
								["element", ""],
								["buildInContent", ""],
								["class", "p-scroller-spacer", 3, "ngStyle", 4, "ngIf"],
								["class", "p-scroller-loader", 3, "ngClass", 4, "ngIf"],
								[4, "ngTemplateOutlet", "ngTemplateOutletContext"],
								[1, "p-scroller-content", 3, "ngClass", "ngStyle"],
								["content", ""],
								[4, "ngFor", "ngForOf", "ngForTrackBy"],
								[1, "p-scroller-spacer", 3, "ngStyle"],
								[1, "p-scroller-loader", 3, "ngClass"],
								["buildInLoader", ""],
								[4, "ngFor", "ngForOf"],
								["buildInLoaderIcon", ""],
								[3, "styleClass"],
								[4, "ngIf"],
							],
							template: function (t, r) {
								if (
									(1 & t &&
										(Ir(),
										y(0, SO, 8, 14, "ng-container", 0),
										y(1, NO, 2, 1, "ng-template", null, 1, Fo)),
									2 & t)
								) {
									const i = bo(2);
									A("ngIf", !r._disabled)("ngIfElse", i);
								}
							},
							dependencies: function () {
								return [_i, el, Di, Ei, wi, Ni];
							},
							styles: [
								"p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{scale:2}.p-scroller-inline .p-scroller-content{position:static}\n",
							],
							encapsulation: 2,
						})),
						e
					);
				})(),
				tv = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn, wr, Ni, wr] })),
						e
					);
				})();
			const nv = function (e) {
				return { "p-treenode-droppoint-active": e };
			};
			function PO(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 4),
						it("drop", function (i) {
							return ee(t), te(_(2).onDropPoint(i, -1));
						})("dragover", function (i) {
							return ee(t), te(_(2).onDropPointDragOver(i));
						})("dragenter", function (i) {
							return ee(t), te(_(2).onDropPointDragEnter(i, -1));
						})("dragleave", function (i) {
							return ee(t), te(_(2).onDropPointDragLeave(i));
						}),
						x();
				}
				if (2 & e) {
					const t = _(2);
					A("ngClass", Re(1, nv, t.draghoverPrev));
				}
			}
			function OO(e, n) {
				1 & e && K(0, "ChevronRightIcon", 14), 2 & e && A("styleClass", "p-tree-toggler-icon");
			}
			function LO(e, n) {
				1 & e && K(0, "ChevronDownIcon", 14), 2 & e && A("styleClass", "p-tree-toggler-icon");
			}
			function FO(e, n) {
				if (
					(1 & e &&
						(ve(0), y(1, OO, 1, 1, "ChevronRightIcon", 13), y(2, LO, 1, 1, "ChevronDownIcon", 13), _e()),
					2 & e)
				) {
					const t = _(3);
					m(1), A("ngIf", !t.node.expanded), m(1), A("ngIf", t.node.expanded);
				}
			}
			function kO(e, n) {}
			function HO(e, n) {
				1 & e && y(0, kO, 0, 0, "ng-template");
			}
			const ll = function (e) {
				return { $implicit: e };
			};
			function VO(e, n) {
				if ((1 & e && (N(0, "span", 15), y(1, HO, 1, 0, null, 16), x()), 2 & e)) {
					const t = _(3);
					m(1),
						A("ngTemplateOutlet", t.tree.togglerIconTemplate)(
							"ngTemplateOutletContext",
							Re(2, ll, t.node.expanded),
						);
				}
			}
			function BO(e, n) {
				1 & e && K(0, "CheckIcon", 14), 2 & e && A("styleClass", "p-checkbox-icon");
			}
			function UO(e, n) {
				1 & e && K(0, "MinusIcon", 14), 2 & e && A("styleClass", "p-checkbox-icon");
			}
			function jO(e, n) {
				if ((1 & e && (ve(0), y(1, BO, 1, 1, "CheckIcon", 13), y(2, UO, 1, 1, "MinusIcon", 13), _e()), 2 & e)) {
					const t = _(4);
					m(1), A("ngIf", t.isSelected()), m(1), A("ngIf", t.node.partialSelected);
				}
			}
			function $O(e, n) {}
			function zO(e, n) {
				1 & e && y(0, $O, 0, 0, "ng-template");
			}
			const WO = function (e) {
					return { "p-checkbox-disabled": e };
				},
				GO = function (e, n) {
					return { "p-highlight": e, "p-indeterminate": n };
				},
				qO = function (e, n) {
					return { $implicit: e, partialSelected: n };
				};
			function KO(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 17)(1, "div", 18),
						y(2, jO, 3, 2, "ng-container", 8),
						y(3, zO, 1, 0, null, 16),
						x()()),
					2 & e)
				) {
					const t = _(3);
					A("ngClass", Re(6, WO, !1 === t.node.selectable)),
						We("aria-checked", t.isSelected()),
						m(1),
						A("ngClass", Rn(8, GO, t.isSelected(), t.node.partialSelected)),
						m(1),
						A("ngIf", !t.tree.checkboxIconTemplate),
						m(1),
						A("ngTemplateOutlet", t.tree.checkboxIconTemplate)(
							"ngTemplateOutletContext",
							Rn(11, qO, t.isSelected(), t.node.partialSelected),
						);
				}
			}
			function ZO(e, n) {
				1 & e && K(0, "span"), 2 & e && xe(_(3).getIcon());
			}
			function YO(e, n) {
				if ((1 & e && (N(0, "span"), Ft(1), x()), 2 & e)) {
					const t = _(3);
					m(1), fi(t.node.label);
				}
			}
			function QO(e, n) {
				1 & e && De(0);
			}
			function XO(e, n) {
				if ((1 & e && (N(0, "span"), y(1, QO, 1, 0, "ng-container", 16), x()), 2 & e)) {
					const t = _(3);
					m(1),
						A("ngTemplateOutlet", t.tree.getTemplateForNode(t.node))(
							"ngTemplateOutletContext",
							Re(2, ll, t.node),
						);
				}
			}
			function JO(e, n) {
				if ((1 & e && K(0, "p-treeNode", 21), 2 & e)) {
					const t = n.$implicit,
						r = n.first,
						i = n.last,
						o = n.index,
						s = _(4);
					A("node", t)("parentNode", s.node)("firstChild", r)("lastChild", i)("index", o)(
						"itemSize",
						s.itemSize,
					)("level", s.level + 1);
				}
			}
			function eL(e, n) {
				if ((1 & e && (N(0, "ul", 19), y(1, JO, 1, 7, "p-treeNode", 20), x()), 2 & e)) {
					const t = _(3);
					Ar("display", t.node.expanded ? "block" : "none"),
						m(1),
						A("ngForOf", t.node.children)("ngForTrackBy", t.tree.trackBy);
				}
			}
			const tL = function (e, n) {
					return ["p-treenode", e, n];
				},
				rv = function (e) {
					return { height: e };
				},
				nL = function (e, n, t) {
					return { "p-treenode-selectable": e, "p-treenode-dragover": n, "p-highlight": t };
				};
			function rL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 5)(1, "div", 6),
						it("click", function (i) {
							return ee(t), te(_(2).onNodeClick(i));
						})("contextmenu", function (i) {
							return ee(t), te(_(2).onNodeRightClick(i));
						})("touchend", function () {
							return ee(t), te(_(2).onNodeTouchEnd());
						})("drop", function (i) {
							return ee(t), te(_(2).onDropNode(i));
						})("dragover", function (i) {
							return ee(t), te(_(2).onDropNodeDragOver(i));
						})("dragenter", function (i) {
							return ee(t), te(_(2).onDropNodeDragEnter(i));
						})("dragleave", function (i) {
							return ee(t), te(_(2).onDropNodeDragLeave(i));
						})("dragstart", function (i) {
							return ee(t), te(_(2).onDragStart(i));
						})("dragend", function (i) {
							return ee(t), te(_(2).onDragStop(i));
						})("keydown", function (i) {
							return ee(t), te(_(2).onKeyDown(i));
						}),
						N(2, "button", 7),
						it("click", function (i) {
							return ee(t), te(_(2).toggle(i));
						}),
						y(3, FO, 3, 2, "ng-container", 8),
						y(4, VO, 2, 4, "span", 9),
						x(),
						y(5, KO, 4, 14, "div", 10),
						y(6, ZO, 1, 2, "span", 3),
						N(7, "span", 11),
						y(8, YO, 2, 1, "span", 8),
						y(9, XO, 2, 4, "span", 8),
						x()(),
						y(10, eL, 2, 4, "ul", 12),
						x();
				}
				if (2 & e) {
					const t = _(2);
					St(t.node.style),
						A("ngClass", Rn(22, tL, t.node.styleClass || "", t.isLeaf() ? "p-treenode-leaf" : ""))(
							"ngStyle",
							Re(25, rv, t.itemSize + "px"),
						),
						m(1),
						Ar("padding-left", t.level * t.indentation + "rem"),
						A("draggable", t.tree.draggableNodes)(
							"ngClass",
							Uu(
								27,
								nL,
								t.tree.selectionMode && !1 !== t.node.selectable,
								t.draghoverNode,
								t.isSelected(),
							),
						),
						We("tabindex", 0)("aria-posinset", t.index + 1)("aria-expanded", t.node.expanded)(
							"aria-selected",
							t.isSelected(),
						)("aria-label", t.node.label)("data-id", t.node.key),
						m(1),
						We("aria-label", t.tree.togglerAriaLabel),
						m(1),
						A("ngIf", !t.tree.togglerIconTemplate),
						m(1),
						A("ngIf", t.tree.togglerIconTemplate),
						m(1),
						A("ngIf", "checkbox" == t.tree.selectionMode),
						m(1),
						A("ngIf", t.node.icon || t.node.expandedIcon || t.node.collapsedIcon),
						m(2),
						A("ngIf", !t.tree.getTemplateForNode(t.node)),
						m(1),
						A("ngIf", t.tree.getTemplateForNode(t.node)),
						m(1),
						A("ngIf", !t.tree.virtualScroll && t.node.children && t.node.expanded);
				}
			}
			function iL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 4),
						it("drop", function (i) {
							return ee(t), te(_(2).onDropPoint(i, 1));
						})("dragover", function (i) {
							return ee(t), te(_(2).onDropPointDragOver(i));
						})("dragenter", function (i) {
							return ee(t), te(_(2).onDropPointDragEnter(i, 1));
						})("dragleave", function (i) {
							return ee(t), te(_(2).onDropPointDragLeave(i));
						}),
						x();
				}
				if (2 & e) {
					const t = _(2);
					A("ngClass", Re(1, nv, t.draghoverNext));
				}
			}
			const iv = function (e) {
				return { "p-treenode-connector-line": e };
			};
			function oL(e, n) {
				if (
					(1 & e &&
						(N(0, "td", 27)(1, "table", 28)(2, "tbody")(3, "tr"),
						K(4, "td", 29),
						x(),
						N(5, "tr"),
						K(6, "td", 29),
						x()()()()),
					2 & e)
				) {
					const t = _(3);
					m(4), A("ngClass", Re(2, iv, !t.firstChild)), m(2), A("ngClass", Re(4, iv, !t.lastChild));
				}
			}
			function sL(e, n) {
				if ((1 & e && K(0, "PlusIcon", 32), 2 & e)) {
					const t = _(5);
					A("styleClass", "p-tree-toggler-icon")("ariaLabel", t.tree.togglerAriaLabel);
				}
			}
			function aL(e, n) {
				if ((1 & e && K(0, "MinusIcon", 32), 2 & e)) {
					const t = _(5);
					A("styleClass", "p-tree-toggler-icon")("ariaLabel", t.tree.togglerAriaLabel);
				}
			}
			function lL(e, n) {
				if ((1 & e && (ve(0), y(1, sL, 1, 2, "PlusIcon", 31), y(2, aL, 1, 2, "MinusIcon", 31), _e()), 2 & e)) {
					const t = _(4);
					m(1), A("ngIf", !t.node.expanded), m(1), A("ngIf", t.node.expanded);
				}
			}
			function cL(e, n) {}
			function uL(e, n) {
				1 & e && y(0, cL, 0, 0, "ng-template");
			}
			function gL(e, n) {
				if ((1 & e && (N(0, "span", 15), y(1, uL, 1, 0, null, 16), x()), 2 & e)) {
					const t = _(4);
					m(1),
						A("ngTemplateOutlet", t.tree.togglerIconTemplate)(
							"ngTemplateOutletContext",
							Re(2, ll, t.node.expanded),
						);
				}
			}
			function dL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "span", 30),
						it("click", function (i) {
							return ee(t), te(_(3).toggle(i));
						}),
						y(1, lL, 3, 2, "ng-container", 8),
						y(2, gL, 2, 4, "span", 9),
						x();
				}
				if (2 & e) {
					const t = _(3);
					A("ngClass", "p-tree-toggler"),
						m(1),
						A("ngIf", !t.tree.togglerIconTemplate),
						m(1),
						A("ngIf", t.tree.togglerIconTemplate);
				}
			}
			function fL(e, n) {
				1 & e && K(0, "span"), 2 & e && xe(_(3).getIcon());
			}
			function CL(e, n) {
				if ((1 & e && (N(0, "span"), Ft(1), x()), 2 & e)) {
					const t = _(3);
					m(1), fi(t.node.label);
				}
			}
			function IL(e, n) {
				1 & e && De(0);
			}
			function hL(e, n) {
				if ((1 & e && (N(0, "span"), y(1, IL, 1, 0, "ng-container", 16), x()), 2 & e)) {
					const t = _(3);
					m(1),
						A("ngTemplateOutlet", t.tree.getTemplateForNode(t.node))(
							"ngTemplateOutletContext",
							Re(2, ll, t.node),
						);
				}
			}
			function pL(e, n) {
				if ((1 & e && K(0, "p-treeNode", 36), 2 & e)) {
					const r = n.first,
						i = n.last;
					A("node", n.$implicit)("firstChild", r)("lastChild", i);
				}
			}
			function AL(e, n) {
				if ((1 & e && (N(0, "td", 33)(1, "div", 34), y(2, pL, 1, 3, "p-treeNode", 35), x()()), 2 & e)) {
					const t = _(3);
					Ar("display", t.node.expanded ? "table-cell" : "none"),
						m(2),
						A("ngForOf", t.node.children)("ngForTrackBy", t.tree.trackBy);
				}
			}
			const mL = function (e) {
					return { "p-treenode-collapsed": e };
				},
				yL = function (e, n) {
					return { "p-treenode-selectable": e, "p-highlight": n };
				};
			function vL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "table")(1, "tbody")(2, "tr"),
						y(3, oL, 7, 6, "td", 22),
						N(4, "td", 23)(5, "div", 24),
						it("click", function (i) {
							return ee(t), te(_(2).onNodeClick(i));
						})("contextmenu", function (i) {
							return ee(t), te(_(2).onNodeRightClick(i));
						})("touchend", function () {
							return ee(t), te(_(2).onNodeTouchEnd());
						})("keydown", function (i) {
							return ee(t), te(_(2).onNodeKeydown(i));
						}),
						y(6, dL, 3, 3, "span", 25),
						y(7, fL, 1, 2, "span", 3),
						N(8, "span", 11),
						y(9, CL, 2, 1, "span", 8),
						y(10, hL, 2, 4, "span", 8),
						x()()(),
						y(11, AL, 3, 4, "td", 26),
						x()()();
				}
				if (2 & e) {
					const t = _(2);
					xe(t.node.styleClass),
						m(3),
						A("ngIf", !t.root),
						m(1),
						A("ngClass", Re(10, mL, !t.node.expanded)),
						m(1),
						A("ngClass", Rn(12, yL, t.tree.selectionMode, t.isSelected())),
						m(1),
						A("ngIf", !t.isLeaf()),
						m(1),
						A("ngIf", t.node.icon || t.node.expandedIcon || t.node.collapsedIcon),
						m(2),
						A("ngIf", !t.tree.getTemplateForNode(t.node)),
						m(1),
						A("ngIf", t.tree.getTemplateForNode(t.node)),
						m(1),
						A("ngIf", t.node.children && t.node.expanded);
				}
			}
			function _L(e, n) {
				if (
					(1 & e &&
						(y(0, PO, 1, 3, "li", 1),
						y(1, rL, 11, 31, "li", 2),
						y(2, iL, 1, 3, "li", 1),
						y(3, vL, 12, 15, "table", 3)),
					2 & e)
				) {
					const t = _();
					A("ngIf", t.tree.droppableNodes),
						m(1),
						A("ngIf", !t.tree.horizontal),
						m(1),
						A("ngIf", t.tree.droppableNodes && t.lastChild),
						m(1),
						A("ngIf", t.tree.horizontal);
				}
			}
			const DL = ["filter"],
				wL = ["scroller"],
				EL = ["wrapper"];
			function SL(e, n) {
				1 & e && K(0, "i"), 2 & e && xe("p-tree-loading-icon pi-spin " + _(3).loadingIcon);
			}
			function bL(e, n) {
				1 & e && K(0, "SpinnerIcon", 13), 2 & e && A("spin", !0)("styleClass", "p-tree-loading-icon");
			}
			function TL(e, n) {}
			function ML(e, n) {
				1 & e && y(0, TL, 0, 0, "ng-template");
			}
			function NL(e, n) {
				if ((1 & e && (N(0, "span", 14), y(1, ML, 1, 0, null, 4), x()), 2 & e)) {
					const t = _(4);
					m(1), A("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function xL(e, n) {
				if ((1 & e && (ve(0), y(1, bL, 1, 2, "SpinnerIcon", 11), y(2, NL, 2, 1, "span", 12), _e()), 2 & e)) {
					const t = _(3);
					m(1), A("ngIf", !t.loadingIconTemplate), m(1), A("ngIf", t.loadingIconTemplate);
				}
			}
			function RL(e, n) {
				if (
					(1 & e && (N(0, "div", 9), y(1, SL, 1, 2, "i", 10), y(2, xL, 3, 2, "ng-container", 7), x()), 2 & e)
				) {
					const t = _(2);
					m(1), A("ngIf", t.loadingIcon), m(1), A("ngIf", !t.loadingIcon);
				}
			}
			function PL(e, n) {
				1 & e && De(0);
			}
			function OL(e, n) {
				1 & e && K(0, "SearchIcon", 20), 2 & e && A("styleClass", "p-tree-filter-icon");
			}
			function LL(e, n) {}
			function FL(e, n) {
				1 & e && y(0, LL, 0, 0, "ng-template");
			}
			function kL(e, n) {
				if ((1 & e && (N(0, "span", 21), y(1, FL, 1, 0, null, 4), x()), 2 & e)) {
					const t = _(3);
					m(1), A("ngTemplateOutlet", t.filterIconTemplate);
				}
			}
			function HL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "div", 15)(1, "input", 16, 17),
						it("keydown.enter", function (i) {
							return i.preventDefault();
						})("input", function (i) {
							return ee(t), te(_(2)._filter(i.target.value));
						}),
						x(),
						y(3, OL, 1, 1, "SearchIcon", 18),
						y(4, kL, 2, 1, "span", 19),
						x();
				}
				if (2 & e) {
					const t = _(2);
					m(1),
						We("placeholder", t.filterPlaceholder),
						m(2),
						A("ngIf", !t.filterIconTemplate),
						m(1),
						A("ngIf", t.filterIconTemplate);
				}
			}
			function VL(e, n) {
				if ((1 & e && K(0, "p-treeNode", 28, 29), 2 & e)) {
					const t = n.$implicit,
						r = n.first,
						i = n.last,
						o = n.index,
						s = _(2).options,
						a = _(3);
					A("level", t.level)("rowNode", t)("node", t.node)("firstChild", r)("lastChild", i)(
						"index",
						a.getIndex(s, o),
					)("itemSize", s.itemSize)("indentation", a.indentation);
				}
			}
			function BL(e, n) {
				if ((1 & e && (N(0, "ul", 26), y(1, VL, 2, 8, "p-treeNode", 27), x()), 2 & e)) {
					const t = _(),
						r = t.options,
						i = t.$implicit,
						o = _(3);
					St(r.contentStyle),
						A("ngClass", r.contentStyleClass),
						We("aria-label", o.ariaLabel)("aria-labelledby", o.ariaLabelledBy),
						m(1),
						A("ngForOf", i)("ngForTrackBy", o.trackBy);
				}
			}
			function UL(e, n) {
				1 & e && y(0, BL, 2, 7, "ul", 25), 2 & e && A("ngIf", n.$implicit);
			}
			function jL(e, n) {
				1 & e && De(0);
			}
			const $L = function (e) {
				return { options: e };
			};
			function zL(e, n) {
				if ((1 & e && y(0, jL, 1, 0, "ng-container", 31), 2 & e)) {
					const t = n.options;
					A("ngTemplateOutlet", _(4).loaderTemplate)("ngTemplateOutletContext", Re(2, $L, t));
				}
			}
			function WL(e, n) {
				1 & e && (ve(0), y(1, zL, 1, 4, "ng-template", 30), _e());
			}
			function GL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "p-scroller", 22, 23),
						it("onScroll", function (i) {
							return ee(t), te(_(2).onScroll.emit(i));
						})("onScrollIndexChange", function (i) {
							return ee(t), te(_(2).onScrollIndexChange.emit(i));
						})("onLazyLoad", function (i) {
							return ee(t), te(_(2).onLazyLoad.emit(i));
						}),
						y(2, UL, 1, 1, "ng-template", 24),
						y(3, WL, 2, 0, "ng-container", 7),
						x();
				}
				if (2 & e) {
					const t = _(2);
					St(Re(9, rv, "flex" !== t.scrollHeight ? t.scrollHeight : void 0)),
						A("items", t.serializedValue)("tabindex", -1)(
							"scrollHeight",
							"flex" !== t.scrollHeight ? void 0 : "100%",
						)("itemSize", t.virtualScrollItemSize || t._virtualNodeHeight)("lazy", t.lazy)(
							"options",
							t.virtualScrollOptions,
						),
						m(3),
						A("ngIf", t.loaderTemplate);
				}
			}
			function qL(e, n) {
				if ((1 & e && K(0, "p-treeNode", 37), 2 & e)) {
					const r = n.first,
						i = n.last,
						o = n.index;
					A("node", n.$implicit)("firstChild", r)("lastChild", i)("index", o)("level", 0);
				}
			}
			function KL(e, n) {
				if ((1 & e && (N(0, "ul", 35), y(1, qL, 1, 5, "p-treeNode", 36), x()), 2 & e)) {
					const t = _(3);
					We("aria-label", t.ariaLabel)("aria-labelledby", t.ariaLabelledBy),
						m(1),
						A("ngForOf", t.getRootNode())("ngForTrackBy", t.trackBy);
				}
			}
			function ZL(e, n) {
				if ((1 & e && (ve(0), N(1, "div", 32, 33), y(3, KL, 2, 4, "ul", 34), x(), _e()), 2 & e)) {
					const t = _(2);
					m(1), Ar("max-height", t.scrollHeight), m(2), A("ngIf", t.getRootNode());
				}
			}
			function YL(e, n) {
				if ((1 & e && (ve(0), Ft(1), _e()), 2 & e)) {
					const t = _(3);
					m(1), mr(" ", t.emptyMessageLabel, " ");
				}
			}
			function QL(e, n) {
				1 & e && De(0, null, 40);
			}
			function XL(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 38), y(1, YL, 2, 1, "ng-container", 39), y(2, QL, 2, 0, "ng-container", 4), x()),
					2 & e)
				) {
					const t = _(2);
					m(1),
						A("ngIf", !t.emptyMessageTemplate)("ngIfElse", t.emptyFilter),
						m(1),
						A("ngTemplateOutlet", t.emptyMessageTemplate);
				}
			}
			function JL(e, n) {
				1 & e && De(0);
			}
			const e2 = function (e, n, t, r) {
				return {
					"p-tree p-component": !0,
					"p-tree-selectable": e,
					"p-treenode-dragover": n,
					"p-tree-loading": t,
					"p-tree-flex-scrollable": r,
				};
			};
			function t2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "div", 2),
						it("drop", function (i) {
							return ee(t), te(_().onDrop(i));
						})("dragover", function (i) {
							return ee(t), te(_().onDragOver(i));
						})("dragenter", function () {
							return ee(t), te(_().onDragEnter());
						})("dragleave", function (i) {
							return ee(t), te(_().onDragLeave(i));
						}),
						y(1, RL, 3, 2, "div", 3),
						y(2, PL, 1, 0, "ng-container", 4),
						y(3, HL, 5, 3, "div", 5),
						y(4, GL, 4, 11, "p-scroller", 6),
						y(5, ZL, 4, 3, "ng-container", 7),
						y(6, XL, 3, 3, "div", 8),
						y(7, JL, 1, 0, "ng-container", 4),
						x();
				}
				if (2 & e) {
					const t = _();
					xe(t.styleClass),
						A("ngClass", IA(11, e2, t.selectionMode, t.dragHover, t.loading, "flex" === t.scrollHeight))(
							"ngStyle",
							t.style,
						),
						m(1),
						A("ngIf", t.loading),
						m(1),
						A("ngTemplateOutlet", t.headerTemplate),
						m(1),
						A("ngIf", t.filter),
						m(1),
						A("ngIf", t.virtualScroll),
						m(1),
						A("ngIf", !t.virtualScroll),
						m(1),
						A("ngIf", !t.loading && (null == t.getRootNode() || 0 === t.getRootNode().length)),
						m(1),
						A("ngTemplateOutlet", t.footerTemplate);
				}
			}
			function n2(e, n) {
				1 & e && De(0);
			}
			function r2(e, n) {
				1 & e && K(0, "i"), 2 & e && xe("p-tree-loading-icon pi-spin " + _(3).loadingIcon);
			}
			function i2(e, n) {
				1 & e && K(0, "SpinnerIcon", 13), 2 & e && A("spin", !0)("styleClass", "p-tree-loading-icon");
			}
			function o2(e, n) {}
			function s2(e, n) {
				1 & e && y(0, o2, 0, 0, "ng-template");
			}
			function a2(e, n) {
				if ((1 & e && (N(0, "span", 14), y(1, s2, 1, 0, null, 4), x()), 2 & e)) {
					const t = _(4);
					m(1), A("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function l2(e, n) {
				if ((1 & e && (ve(0), y(1, i2, 1, 2, "SpinnerIcon", 11), y(2, a2, 2, 1, "span", 12), _e()), 2 & e)) {
					const t = _(3);
					m(1), A("ngIf", !t.loadingIconTemplate), m(1), A("ngIf", t.loadingIconTemplate);
				}
			}
			function c2(e, n) {
				if (
					(1 & e && (N(0, "div", 43), y(1, r2, 1, 2, "i", 10), y(2, l2, 3, 2, "ng-container", 7), x()), 2 & e)
				) {
					const t = _(2);
					m(1), A("ngIf", t.loadingIcon), m(1), A("ngIf", !t.loadingIcon);
				}
			}
			function u2(e, n) {
				if ((1 & e && (N(0, "table"), K(1, "p-treeNode", 44), x()), 2 & e)) {
					const t = _(2);
					m(1), A("node", t.value[0])("root", !0);
				}
			}
			function g2(e, n) {
				if ((1 & e && (ve(0), Ft(1), _e()), 2 & e)) {
					const t = _(3);
					m(1), mr(" ", t.emptyMessageLabel, " ");
				}
			}
			function d2(e, n) {
				1 & e && De(0, null, 40);
			}
			function f2(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 38), y(1, g2, 2, 1, "ng-container", 39), y(2, d2, 2, 0, "ng-container", 4), x()),
					2 & e)
				) {
					const t = _(2);
					m(1),
						A("ngIf", !t.emptyMessageTemplate)("ngIfElse", t.emptyFilter),
						m(1),
						A("ngTemplateOutlet", t.emptyMessageTemplate);
				}
			}
			function C2(e, n) {
				1 & e && De(0);
			}
			const I2 = function (e) {
				return { "p-tree p-tree-horizontal p-component": !0, "p-tree-selectable": e };
			};
			function h2(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 41),
						y(1, n2, 1, 0, "ng-container", 4),
						y(2, c2, 3, 2, "div", 42),
						y(3, u2, 2, 2, "table", 7),
						y(4, f2, 3, 3, "div", 8),
						y(5, C2, 1, 0, "ng-container", 4),
						x()),
					2 & e)
				) {
					const t = _();
					xe(t.styleClass),
						A("ngClass", Re(9, I2, t.selectionMode))("ngStyle", t.style),
						m(1),
						A("ngTemplateOutlet", t.headerTemplate),
						m(1),
						A("ngIf", t.loading),
						m(1),
						A("ngIf", t.value && t.value[0]),
						m(1),
						A("ngIf", !t.loading && (null == t.getRootNode() || 0 === t.getRootNode().length)),
						m(1),
						A("ngTemplateOutlet", t.footerTemplate);
				}
			}
			let p2 = (() => {
					class e {
						constructor(t) {
							this.tree = t;
						}
						ngOnInit() {
							(this.node.parent = this.parentNode),
								this.parentNode &&
									this.tree.syncNodeOption(
										this.node,
										this.tree.value,
										"parent",
										this.tree.getNodeWithKey(this.parentNode.key, this.tree.value),
									);
						}
						getIcon() {
							let t;
							return (
								(t = this.node.icon
									? this.node.icon
									: this.node.expanded && this.node.children && this.node.children.length
									? this.node.expandedIcon
									: this.node.collapsedIcon),
								e.ICON_CLASS + " " + t
							);
						}
						isLeaf() {
							return this.tree.isNodeLeaf(this.node);
						}
						toggle(t) {
							this.node.expanded ? this.collapse(t) : this.expand(t), t.stopPropagation();
						}
						expand(t) {
							(this.node.expanded = !0),
								this.tree.virtualScroll && (this.tree.updateSerializedValue(), this.focusVirtualNode()),
								this.tree.onNodeExpand.emit({ originalEvent: t, node: this.node });
						}
						collapse(t) {
							(this.node.expanded = !1),
								this.tree.virtualScroll && (this.tree.updateSerializedValue(), this.focusVirtualNode()),
								this.tree.onNodeCollapse.emit({ originalEvent: t, node: this.node });
						}
						onNodeClick(t) {
							this.tree.onNodeClick(t, this.node);
						}
						onNodeKeydown(t) {
							13 === t.which && this.tree.onNodeClick(t, this.node);
						}
						onNodeTouchEnd() {
							this.tree.onNodeTouchEnd();
						}
						onNodeRightClick(t) {
							this.tree.onNodeRightClick(t, this.node);
						}
						isSelected() {
							return this.tree.isSelected(this.node);
						}
						onDropPoint(t, r) {
							t.preventDefault();
							let i = this.tree.dragNode,
								a =
									this.tree.dragNodeTree !== this.tree ||
									1 === r ||
									this.tree.dragNodeIndex !== this.index - 1;
							if (this.tree.allowDrop(i, this.node, this.tree.dragNodeScope) && a) {
								let l = { ...this.createDropPointEventMetadata(r) };
								this.tree.validateDrop
									? this.tree.onNodeDrop.emit({
											originalEvent: t,
											dragNode: i,
											dropNode: this.node,
											index: this.index,
											accept: () => {
												this.processPointDrop(l);
											},
									  })
									: (this.processPointDrop(l),
									  this.tree.onNodeDrop.emit({
											originalEvent: t,
											dragNode: i,
											dropNode: this.node,
											index: this.index,
									  }));
							}
							(this.draghoverPrev = !1), (this.draghoverNext = !1);
						}
						processPointDrop(t) {
							let r = t.dropNode.parent ? t.dropNode.parent.children : this.tree.value;
							t.dragNodeSubNodes.splice(t.dragNodeIndex, 1);
							let i = this.index;
							t.position < 0
								? ((i =
										t.dragNodeSubNodes === r
											? t.dragNodeIndex > t.index
												? t.index
												: t.index - 1
											: t.index),
								  r.splice(i, 0, t.dragNode))
								: ((i = r.length), r.push(t.dragNode)),
								this.tree.dragDropService.stopDrag({
									node: t.dragNode,
									subNodes: t.dropNode.parent ? t.dropNode.parent.children : this.tree.value,
									index: t.dragNodeIndex,
								});
						}
						createDropPointEventMetadata(t) {
							return {
								dragNode: this.tree.dragNode,
								dragNodeIndex: this.tree.dragNodeIndex,
								dragNodeSubNodes: this.tree.dragNodeSubNodes,
								dropNode: this.node,
								index: this.index,
								position: t,
							};
						}
						onDropPointDragOver(t) {
							(t.dataTransfer.dropEffect = "move"), t.preventDefault();
						}
						onDropPointDragEnter(t, r) {
							this.tree.allowDrop(this.tree.dragNode, this.node, this.tree.dragNodeScope) &&
								(r < 0 ? (this.draghoverPrev = !0) : (this.draghoverNext = !0));
						}
						onDropPointDragLeave(t) {
							(this.draghoverPrev = !1), (this.draghoverNext = !1);
						}
						onDragStart(t) {
							this.tree.draggableNodes && !1 !== this.node.draggable
								? (t.dataTransfer.setData("text", "data"),
								  this.tree.dragDropService.startDrag({
										tree: this,
										node: this.node,
										subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
										index: this.index,
										scope: this.tree.draggableScope,
								  }))
								: t.preventDefault();
						}
						onDragStop(t) {
							this.tree.dragDropService.stopDrag({
								node: this.node,
								subNodes: this.node.parent ? this.node.parent.children : this.tree.value,
								index: this.index,
							});
						}
						onDropNodeDragOver(t) {
							(t.dataTransfer.dropEffect = "move"),
								this.tree.droppableNodes && (t.preventDefault(), t.stopPropagation());
						}
						onDropNode(t) {
							if (this.tree.droppableNodes && !1 !== this.node.droppable) {
								let r = this.tree.dragNode;
								if (this.tree.allowDrop(r, this.node, this.tree.dragNodeScope)) {
									let i = { ...this.createDropNodeEventMetadata() };
									this.tree.validateDrop
										? this.tree.onNodeDrop.emit({
												originalEvent: t,
												dragNode: r,
												dropNode: this.node,
												index: this.index,
												accept: () => {
													this.processNodeDrop(i);
												},
										  })
										: (this.processNodeDrop(i),
										  this.tree.onNodeDrop.emit({
												originalEvent: t,
												dragNode: r,
												dropNode: this.node,
												index: this.index,
										  }));
								}
							}
							t.preventDefault(), t.stopPropagation(), (this.draghoverNode = !1);
						}
						createDropNodeEventMetadata() {
							return {
								dragNode: this.tree.dragNode,
								dragNodeIndex: this.tree.dragNodeIndex,
								dragNodeSubNodes: this.tree.dragNodeSubNodes,
								dropNode: this.node,
							};
						}
						processNodeDrop(t) {
							let r = t.dragNodeIndex;
							t.dragNodeSubNodes.splice(r, 1),
								t.dropNode.children
									? t.dropNode.children.push(t.dragNode)
									: (t.dropNode.children = [t.dragNode]),
								this.tree.dragDropService.stopDrag({
									node: t.dragNode,
									subNodes: t.dropNode.parent ? t.dropNode.parent.children : this.tree.value,
									index: r,
								});
						}
						onDropNodeDragEnter(t) {
							this.tree.droppableNodes &&
								!1 !== this.node.droppable &&
								this.tree.allowDrop(this.tree.dragNode, this.node, this.tree.dragNodeScope) &&
								(this.draghoverNode = !0);
						}
						onDropNodeDragLeave(t) {
							if (this.tree.droppableNodes) {
								let r = t.currentTarget.getBoundingClientRect();
								(t.x > r.left + r.width ||
									t.x < r.left ||
									t.y >= Math.floor(r.top + r.height) ||
									t.y < r.top) &&
									(this.draghoverNode = !1);
							}
						}
						onKeyDown(t) {
							const r = t.target.parentElement.parentElement;
							if (
								!(
									"P-TREENODE" !== r.nodeName ||
									(this.tree.contextMenu &&
										"block" ===
											this.tree.contextMenu.containerViewChild.nativeElement.style.display)
								)
							)
								switch (t.which) {
									case 40:
										const i = this.tree.droppableNodes
											? r.children[1].children[1]
											: r.children[0].children[1];
										if (i && i.children.length > 0) this.focusNode(i.children[0]);
										else {
											const o = r.nextElementSibling;
											if (o) this.focusNode(o);
											else {
												let s = this.findNextSiblingOfAncestor(r);
												s && this.focusNode(s);
											}
										}
										t.preventDefault();
										break;
									case 38:
										if (r.previousElementSibling)
											this.focusNode(this.findLastVisibleDescendant(r.previousElementSibling));
										else {
											let o = this.getParentNodeElement(r);
											o && this.focusNode(o);
										}
										t.preventDefault();
										break;
									case 39:
										!this.node.expanded && !this.tree.isNodeLeaf(this.node) && this.expand(t),
											t.preventDefault();
										break;
									case 37:
										if (this.node.expanded) this.collapse(t);
										else {
											let o = this.getParentNodeElement(r);
											o && this.focusNode(o);
										}
										t.preventDefault();
										break;
									case 13:
										this.tree.onNodeClick(t, this.node), t.preventDefault();
								}
						}
						findNextSiblingOfAncestor(t) {
							let r = this.getParentNodeElement(t);
							return r
								? r.nextElementSibling
									? r.nextElementSibling
									: this.findNextSiblingOfAncestor(r)
								: null;
						}
						findLastVisibleDescendant(t) {
							const i = Array.from(t.children).find((o) => X.hasClass(o, "p-treenode")).children[1];
							return i && i.children.length > 0
								? this.findLastVisibleDescendant(i.children[i.children.length - 1])
								: t;
						}
						getParentNodeElement(t) {
							const r = t.parentElement.parentElement.parentElement;
							return "P-TREENODE" === r.tagName ? r : null;
						}
						focusNode(t) {
							this.tree.droppableNodes
								? t.children[1].children[0].focus()
								: t.children[0].children[0].focus();
						}
						focusVirtualNode() {
							this.timeout = setTimeout(() => {
								let t = X.findSingle(document.body, `[data-id="${this.node.key ?? this.node.data}"]`);
								X.focus(t);
							}, 1);
						}
					}
					return (
						(e.ICON_CLASS = "p-treenode-icon "),
						(e.ɵfac = function (t) {
							return new (t || e)(S(hs(() => ov)));
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-treeNode"]],
							hostAttrs: [1, "p-element"],
							inputs: {
								rowNode: "rowNode",
								node: "node",
								parentNode: "parentNode",
								root: "root",
								index: "index",
								firstChild: "firstChild",
								lastChild: "lastChild",
								level: "level",
								indentation: "indentation",
								itemSize: "itemSize",
							},
							decls: 1,
							vars: 1,
							consts: [
								[3, "ngIf"],
								[
									"class",
									"p-treenode-droppoint",
									3,
									"ngClass",
									"drop",
									"dragover",
									"dragenter",
									"dragleave",
									4,
									"ngIf",
								],
								[3, "ngClass", "ngStyle", "style", 4, "ngIf"],
								[3, "class", 4, "ngIf"],
								[1, "p-treenode-droppoint", 3, "ngClass", "drop", "dragover", "dragenter", "dragleave"],
								[3, "ngClass", "ngStyle"],
								[
									"role",
									"treeitem",
									1,
									"p-treenode-content",
									3,
									"draggable",
									"ngClass",
									"click",
									"contextmenu",
									"touchend",
									"drop",
									"dragover",
									"dragenter",
									"dragleave",
									"dragstart",
									"dragend",
									"keydown",
								],
								[
									"type",
									"button",
									"pRipple",
									"",
									"tabindex",
									"-1",
									1,
									"p-tree-toggler",
									"p-link",
									3,
									"click",
								],
								[4, "ngIf"],
								["class", "p-tree-toggler-icon", 4, "ngIf"],
								["class", "p-checkbox p-component", 3, "ngClass", 4, "ngIf"],
								[1, "p-treenode-label"],
								[
									"class",
									"p-treenode-children",
									"style",
									"display: none;",
									"role",
									"group",
									3,
									"display",
									4,
									"ngIf",
								],
								[3, "styleClass", 4, "ngIf"],
								[3, "styleClass"],
								[1, "p-tree-toggler-icon"],
								[4, "ngTemplateOutlet", "ngTemplateOutletContext"],
								[1, "p-checkbox", "p-component", 3, "ngClass"],
								[1, "p-checkbox-box", 3, "ngClass"],
								["role", "group", 1, "p-treenode-children", 2, "display", "none"],
								[
									3,
									"node",
									"parentNode",
									"firstChild",
									"lastChild",
									"index",
									"itemSize",
									"level",
									4,
									"ngFor",
									"ngForOf",
									"ngForTrackBy",
								],
								[3, "node", "parentNode", "firstChild", "lastChild", "index", "itemSize", "level"],
								["class", "p-treenode-connector", 4, "ngIf"],
								[1, "p-treenode", 3, "ngClass"],
								[
									"tabindex",
									"0",
									1,
									"p-treenode-content",
									3,
									"ngClass",
									"click",
									"contextmenu",
									"touchend",
									"keydown",
								],
								[3, "ngClass", "click", 4, "ngIf"],
								["class", "p-treenode-children-container", 3, "display", 4, "ngIf"],
								[1, "p-treenode-connector"],
								[1, "p-treenode-connector-table"],
								[3, "ngClass"],
								[3, "ngClass", "click"],
								[3, "styleClass", "ariaLabel", 4, "ngIf"],
								[3, "styleClass", "ariaLabel"],
								[1, "p-treenode-children-container"],
								[1, "p-treenode-children"],
								[3, "node", "firstChild", "lastChild", 4, "ngFor", "ngForOf", "ngForTrackBy"],
								[3, "node", "firstChild", "lastChild"],
							],
							template: function (t, r) {
								1 & t && y(0, _L, 4, 4, "ng-template", 0), 2 & t && A("ngIf", r.node);
							},
							dependencies: function () {
								return [_i, el, Di, Ei, wi, Gy, Zy, Yy, Qy, Xy, e];
							},
							encapsulation: 2,
						})),
						e
					);
				})(),
				ov = (() => {
					class e {
						constructor(t, r, i, o) {
							(this.el = t),
								(this.dragDropService = r),
								(this.config = i),
								(this.cd = o),
								(this.layout = "vertical"),
								(this.metaKeySelection = !0),
								(this.propagateSelectionUp = !0),
								(this.propagateSelectionDown = !0),
								(this.emptyMessage = ""),
								(this.filterBy = "label"),
								(this.filterMode = "lenient"),
								(this.lazy = !1),
								(this.indentation = 1.5),
								(this.trackBy = (s, a) => a),
								(this.selectionChange = new re()),
								(this.onNodeSelect = new re()),
								(this.onNodeUnselect = new re()),
								(this.onNodeExpand = new re()),
								(this.onNodeCollapse = new re()),
								(this.onNodeContextMenuSelect = new re()),
								(this.onNodeDrop = new re()),
								(this.onLazyLoad = new re()),
								(this.onScroll = new re()),
								(this.onScrollIndexChange = new re()),
								(this.onFilter = new re());
						}
						get virtualNodeHeight() {
							return this._virtualNodeHeight;
						}
						set virtualNodeHeight(t) {
							(this._virtualNodeHeight = t),
								console.warn(
									"The virtualNodeHeight property is deprecated, use virtualScrollItemSize property instead.",
								);
						}
						ngOnInit() {
							this.droppableNodes &&
								((this.dragStartSubscription = this.dragDropService.dragStart$.subscribe((t) => {
									(this.dragNodeTree = t.tree),
										(this.dragNode = t.node),
										(this.dragNodeSubNodes = t.subNodes),
										(this.dragNodeIndex = t.index),
										(this.dragNodeScope = t.scope);
								})),
								(this.dragStopSubscription = this.dragDropService.dragStop$.subscribe((t) => {
									(this.dragNodeTree = null),
										(this.dragNode = null),
										(this.dragNodeSubNodes = null),
										(this.dragNodeIndex = null),
										(this.dragNodeScope = null),
										(this.dragHover = !1);
								})));
						}
						ngOnChanges(t) {
							t.value && this.updateSerializedValue();
						}
						get horizontal() {
							return "horizontal" == this.layout;
						}
						get emptyMessageLabel() {
							return this.emptyMessage || this.config.getTranslation(EP.EMPTY_MESSAGE);
						}
						ngAfterContentInit() {
							this.templates.length && (this._templateMap = {}),
								this.templates.forEach((t) => {
									switch (t.getType()) {
										case "header":
											this.headerTemplate = t.template;
											break;
										case "empty":
											this.emptyMessageTemplate = t.template;
											break;
										case "footer":
											this.footerTemplate = t.template;
											break;
										case "loader":
											this.loaderTemplate = t.template;
											break;
										case "togglericon":
											this.togglerIconTemplate = t.template;
											break;
										case "checkboxicon":
											this.checkboxIconTemplate = t.template;
											break;
										case "loadingicon":
											this.loadingIconTemplate = t.template;
											break;
										case "filtericon":
											this.filterIconTemplate = t.template;
											break;
										default:
											this._templateMap[t.name] = t.template;
									}
								});
						}
						ngAfterViewInit() {
							qo.check();
						}
						updateSerializedValue() {
							(this.serializedValue = []), this.serializeNodes(null, this.getRootNode(), 0, !0);
						}
						serializeNodes(t, r, i, o) {
							if (r && r.length)
								for (let s of r) {
									s.parent = t;
									const a = { node: s, parent: t, level: i, visible: o && (!t || t.expanded) };
									this.serializedValue.push(a),
										a.visible && s.expanded && this.serializeNodes(s, s.children, i + 1, a.visible);
								}
						}
						onNodeClick(t, r) {
							let i = t.target;
							if (!X.hasClass(i, "p-tree-toggler") && !X.hasClass(i, "p-tree-toggler-icon")) {
								if (this.selectionMode) {
									if (
										!1 === r.selectable ||
										(this.hasFilteredNodes() && !(r = this.getNodeWithKey(r.key, this.value)))
									)
										return;
									let o = this.findIndexInSelection(r),
										s = o >= 0;
									if (this.isCheckboxSelectionMode())
										s
											? (this.propagateSelectionDown
													? this.propagateDown(r, !1)
													: (this.selection = this.selection.filter((a, l) => l != o)),
											  this.propagateSelectionUp && r.parent && this.propagateUp(r.parent, !1),
											  this.selectionChange.emit(this.selection),
											  this.onNodeUnselect.emit({ originalEvent: t, node: r }))
											: (this.propagateSelectionDown
													? this.propagateDown(r, !0)
													: (this.selection = [...(this.selection || []), r]),
											  this.propagateSelectionUp && r.parent && this.propagateUp(r.parent, !0),
											  this.selectionChange.emit(this.selection),
											  this.onNodeSelect.emit({ originalEvent: t, node: r }));
									else if (!this.nodeTouched && this.metaKeySelection) {
										let l = t.metaKey || t.ctrlKey;
										s && l
											? (this.isSingleSelectionMode()
													? this.selectionChange.emit(null)
													: ((this.selection = this.selection.filter((c, u) => u != o)),
													  this.selectionChange.emit(this.selection)),
											  this.onNodeUnselect.emit({ originalEvent: t, node: r }))
											: (this.isSingleSelectionMode()
													? this.selectionChange.emit(r)
													: this.isMultipleSelectionMode() &&
													  ((this.selection = (l && this.selection) || []),
													  (this.selection = [...this.selection, r]),
													  this.selectionChange.emit(this.selection)),
											  this.onNodeSelect.emit({ originalEvent: t, node: r }));
									} else
										this.isSingleSelectionMode()
											? s
												? ((this.selection = null),
												  this.onNodeUnselect.emit({ originalEvent: t, node: r }))
												: ((this.selection = r),
												  this.onNodeSelect.emit({ originalEvent: t, node: r }))
											: s
											? ((this.selection = this.selection.filter((l, c) => c != o)),
											  this.onNodeUnselect.emit({ originalEvent: t, node: r }))
											: ((this.selection = [...(this.selection || []), r]),
											  this.onNodeSelect.emit({ originalEvent: t, node: r })),
											this.selectionChange.emit(this.selection);
								}
								this.nodeTouched = !1;
							}
						}
						onNodeTouchEnd() {
							this.nodeTouched = !0;
						}
						onNodeRightClick(t, r) {
							if (this.contextMenu) {
								let i = t.target;
								if (i.className && 0 === i.className.indexOf("p-tree-toggler")) return;
								this.findIndexInSelection(r) >= 0 ||
									(this.isSingleSelectionMode()
										? this.selectionChange.emit(r)
										: this.selectionChange.emit([r])),
									this.contextMenu.show(t),
									this.onNodeContextMenuSelect.emit({ originalEvent: t, node: r });
							}
						}
						findIndexInSelection(t) {
							let r = -1;
							if (this.selectionMode && this.selection)
								if (this.isSingleSelectionMode())
									r =
										(this.selection.key && this.selection.key === t.key) || this.selection == t
											? 0
											: -1;
								else
									for (let i = 0; i < this.selection.length; i++) {
										let o = this.selection[i];
										if ((o.key && o.key === t.key) || o == t) {
											r = i;
											break;
										}
									}
							return r;
						}
						syncNodeOption(t, r, i, o) {
							const s = this.hasFilteredNodes() ? this.getNodeWithKey(t.key, r) : null;
							s && (s[i] = o || t[i]);
						}
						hasFilteredNodes() {
							return this.filter && this.filteredNodes && this.filteredNodes.length;
						}
						getNodeWithKey(t, r) {
							for (let i of r) {
								if (i.key === t) return i;
								if (i.children) {
									let o = this.getNodeWithKey(t, i.children);
									if (o) return o;
								}
							}
						}
						propagateUp(t, r) {
							if (t.children && t.children.length) {
								let o = 0,
									s = !1;
								for (let a of t.children) this.isSelected(a) ? o++ : a.partialSelected && (s = !0);
								if (r && o == t.children.length)
									(this.selection = [...(this.selection || []), t]), (t.partialSelected = !1);
								else {
									if (!r) {
										let a = this.findIndexInSelection(t);
										a >= 0 && (this.selection = this.selection.filter((l, c) => c != a));
									}
									t.partialSelected = !!(s || (o > 0 && o != t.children.length));
								}
								this.syncNodeOption(t, this.filteredNodes, "partialSelected");
							}
							let i = t.parent;
							i && this.propagateUp(i, r);
						}
						propagateDown(t, r) {
							let i = this.findIndexInSelection(t);
							if (
								(r && -1 == i
									? (this.selection = [...(this.selection || []), t])
									: !r && i > -1 && (this.selection = this.selection.filter((o, s) => s != i)),
								(t.partialSelected = !1),
								this.syncNodeOption(t, this.filteredNodes, "partialSelected"),
								t.children && t.children.length)
							)
								for (let o of t.children) this.propagateDown(o, r);
						}
						isSelected(t) {
							return -1 != this.findIndexInSelection(t);
						}
						isSingleSelectionMode() {
							return this.selectionMode && "single" == this.selectionMode;
						}
						isMultipleSelectionMode() {
							return this.selectionMode && "multiple" == this.selectionMode;
						}
						isCheckboxSelectionMode() {
							return this.selectionMode && "checkbox" == this.selectionMode;
						}
						isNodeLeaf(t) {
							return 0 != t.leaf && !(t.children && t.children.length);
						}
						getRootNode() {
							return this.filteredNodes ? this.filteredNodes : this.value;
						}
						getTemplateForNode(t) {
							return this._templateMap
								? t.type
									? this._templateMap[t.type]
									: this._templateMap.default
								: null;
						}
						onDragOver(t) {
							this.droppableNodes &&
								(!this.value || 0 === this.value.length) &&
								((t.dataTransfer.dropEffect = "move"), t.preventDefault());
						}
						onDrop(t) {
							if (this.droppableNodes && (!this.value || 0 === this.value.length)) {
								t.preventDefault();
								let r = this.dragNode;
								if (this.allowDrop(r, null, this.dragNodeScope)) {
									let i = this.dragNodeIndex;
									(this.value = this.value || []),
										this.validateDrop
											? this.onNodeDrop.emit({
													originalEvent: t,
													dragNode: r,
													dropNode: null,
													index: i,
													accept: () => {
														this.processTreeDrop(r, i);
													},
											  })
											: (this.onNodeDrop.emit({
													originalEvent: t,
													dragNode: r,
													dropNode: null,
													index: i,
											  }),
											  this.processTreeDrop(r, i));
								}
							}
						}
						processTreeDrop(t, r) {
							this.dragNodeSubNodes.splice(r, 1),
								this.value.push(t),
								this.dragDropService.stopDrag({ node: t });
						}
						onDragEnter() {
							this.droppableNodes &&
								this.allowDrop(this.dragNode, null, this.dragNodeScope) &&
								(this.dragHover = !0);
						}
						onDragLeave(t) {
							if (this.droppableNodes) {
								let r = t.currentTarget.getBoundingClientRect();
								(t.x > r.left + r.width || t.x < r.left || t.y > r.top + r.height || t.y < r.top) &&
									(this.dragHover = !1);
							}
						}
						allowDrop(t, r, i) {
							if (t) {
								if (this.isValidDragScope(i)) {
									let o = !0;
									if (r)
										if (t === r) o = !1;
										else {
											let s = r.parent;
											for (; null != s; ) {
												if (s === t) {
													o = !1;
													break;
												}
												s = s.parent;
											}
										}
									return o;
								}
								return !1;
							}
							return !1;
						}
						isValidDragScope(t) {
							let r = this.droppableScope;
							if (r) {
								if ("string" == typeof r) {
									if ("string" == typeof t) return r === t;
									if (Array.isArray(t)) return -1 != t.indexOf(r);
								} else if (Array.isArray(r)) {
									if ("string" == typeof t) return -1 != r.indexOf(t);
									if (Array.isArray(t)) for (let i of r) for (let o of t) if (i === o) return !0;
								}
								return !1;
							}
							return !0;
						}
						_filter(t) {
							let r = t;
							if ("" === r) this.filteredNodes = null;
							else {
								this.filteredNodes = [];
								const i = this.filterBy.split(","),
									o = Ti.removeAccents(r).toLocaleLowerCase(this.filterLocale),
									s = "strict" === this.filterMode;
								for (let a of this.value) {
									let l = { ...a },
										c = { searchFields: i, filterText: o, isStrictMode: s };
									((s && (this.findFilteredNodes(l, c) || this.isFilterMatched(l, c))) ||
										(!s && (this.isFilterMatched(l, c) || this.findFilteredNodes(l, c)))) &&
										this.filteredNodes.push(l);
								}
							}
							this.updateSerializedValue(),
								this.onFilter.emit({ filter: r, filteredValue: this.filteredNodes });
						}
						resetFilter() {
							(this.filteredNodes = null),
								this.filterViewChild &&
									this.filterViewChild.nativeElement &&
									(this.filterViewChild.nativeElement.value = "");
						}
						scrollToVirtualIndex(t) {
							this.virtualScroll && this.scroller.scrollToIndex(t);
						}
						scrollTo(t) {
							this.virtualScroll
								? this.scroller.scrollTo(t)
								: this.wrapperViewChild &&
								  this.wrapperViewChild.nativeElement &&
								  (this.wrapperViewChild.nativeElement.scrollTo
										? this.wrapperViewChild.nativeElement.scrollTo(t)
										: ((this.wrapperViewChild.nativeElement.scrollLeft = t.left),
										  (this.wrapperViewChild.nativeElement.scrollTop = t.top)));
						}
						findFilteredNodes(t, r) {
							if (t) {
								let i = !1;
								if (t.children) {
									let o = [...t.children];
									t.children = [];
									for (let s of o) {
										let a = { ...s };
										this.isFilterMatched(a, r) && ((i = !0), t.children.push(a));
									}
								}
								if (i) return (t.expanded = !0), !0;
							}
						}
						isFilterMatched(t, { searchFields: r, filterText: i, isStrictMode: o }) {
							let s = !1;
							for (let a of r)
								Ti.removeAccents(String(Ti.resolveFieldData(t, a)))
									.toLocaleLowerCase(this.filterLocale)
									.indexOf(i) > -1 && (s = !0);
							return (
								(!s || (o && !this.isNodeLeaf(t))) &&
									(s =
										this.findFilteredNodes(t, {
											searchFields: r,
											filterText: i,
											isStrictMode: o,
										}) || s),
								s
							);
						}
						getIndex(t, r) {
							const i = t.getItemOptions;
							return i ? i(r).index : r;
						}
						getBlockableElement() {
							return this.el.nativeElement.children[0];
						}
						ngOnDestroy() {
							this.dragStartSubscription && this.dragStartSubscription.unsubscribe(),
								this.dragStopSubscription && this.dragStopSubscription.unsubscribe();
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Wt), S(SP, 8), S(zy), S(Ho));
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["p-tree"]],
							contentQueries: function (t, r, i) {
								if ((1 & t && Zn(i, Ko, 4), 2 & t)) {
									let o;
									bt((o = Tt())) && (r.templates = o);
								}
							},
							viewQuery: function (t, r) {
								if ((1 & t && (pi(DL, 5), pi(wL, 5), pi(EL, 5)), 2 & t)) {
									let i;
									bt((i = Tt())) && (r.filterViewChild = i.first),
										bt((i = Tt())) && (r.scroller = i.first),
										bt((i = Tt())) && (r.wrapperViewChild = i.first);
								}
							},
							hostAttrs: [1, "p-element"],
							inputs: {
								value: "value",
								selectionMode: "selectionMode",
								selection: "selection",
								style: "style",
								styleClass: "styleClass",
								contextMenu: "contextMenu",
								layout: "layout",
								draggableScope: "draggableScope",
								droppableScope: "droppableScope",
								draggableNodes: "draggableNodes",
								droppableNodes: "droppableNodes",
								metaKeySelection: "metaKeySelection",
								propagateSelectionUp: "propagateSelectionUp",
								propagateSelectionDown: "propagateSelectionDown",
								loading: "loading",
								loadingIcon: "loadingIcon",
								emptyMessage: "emptyMessage",
								ariaLabel: "ariaLabel",
								togglerAriaLabel: "togglerAriaLabel",
								ariaLabelledBy: "ariaLabelledBy",
								validateDrop: "validateDrop",
								filter: "filter",
								filterBy: "filterBy",
								filterMode: "filterMode",
								filterPlaceholder: "filterPlaceholder",
								filteredNodes: "filteredNodes",
								filterLocale: "filterLocale",
								scrollHeight: "scrollHeight",
								lazy: "lazy",
								virtualScroll: "virtualScroll",
								virtualScrollItemSize: "virtualScrollItemSize",
								virtualScrollOptions: "virtualScrollOptions",
								indentation: "indentation",
								_templateMap: "_templateMap",
								trackBy: "trackBy",
								virtualNodeHeight: "virtualNodeHeight",
							},
							outputs: {
								selectionChange: "selectionChange",
								onNodeSelect: "onNodeSelect",
								onNodeUnselect: "onNodeUnselect",
								onNodeExpand: "onNodeExpand",
								onNodeCollapse: "onNodeCollapse",
								onNodeContextMenuSelect: "onNodeContextMenuSelect",
								onNodeDrop: "onNodeDrop",
								onLazyLoad: "onLazyLoad",
								onScroll: "onScroll",
								onScrollIndexChange: "onScrollIndexChange",
								onFilter: "onFilter",
							},
							features: [_n],
							decls: 2,
							vars: 2,
							consts: [
								[
									3,
									"ngClass",
									"ngStyle",
									"class",
									"drop",
									"dragover",
									"dragenter",
									"dragleave",
									4,
									"ngIf",
								],
								[3, "ngClass", "ngStyle", "class", 4, "ngIf"],
								[3, "ngClass", "ngStyle", "drop", "dragover", "dragenter", "dragleave"],
								["class", "p-tree-loading-overlay p-component-overlay", 4, "ngIf"],
								[4, "ngTemplateOutlet"],
								["class", "p-tree-filter-container", 4, "ngIf"],
								[
									"styleClass",
									"p-tree-wrapper",
									3,
									"items",
									"tabindex",
									"style",
									"scrollHeight",
									"itemSize",
									"lazy",
									"options",
									"onScroll",
									"onScrollIndexChange",
									"onLazyLoad",
									4,
									"ngIf",
								],
								[4, "ngIf"],
								["class", "p-tree-empty-message", 4, "ngIf"],
								[1, "p-tree-loading-overlay", "p-component-overlay"],
								[3, "class", 4, "ngIf"],
								[3, "spin", "styleClass", 4, "ngIf"],
								["class", "p-tree-loading-icon", 4, "ngIf"],
								[3, "spin", "styleClass"],
								[1, "p-tree-loading-icon"],
								[1, "p-tree-filter-container"],
								[
									"type",
									"text",
									"autocomplete",
									"off",
									1,
									"p-tree-filter",
									"p-inputtext",
									"p-component",
									3,
									"keydown.enter",
									"input",
								],
								["filter", ""],
								[3, "styleClass", 4, "ngIf"],
								["class", "p-tree-filter-icon", 4, "ngIf"],
								[3, "styleClass"],
								[1, "p-tree-filter-icon"],
								[
									"styleClass",
									"p-tree-wrapper",
									3,
									"items",
									"tabindex",
									"scrollHeight",
									"itemSize",
									"lazy",
									"options",
									"onScroll",
									"onScrollIndexChange",
									"onLazyLoad",
								],
								["scroller", ""],
								["pTemplate", "content"],
								["class", "p-tree-container", "role", "tree", 3, "ngClass", "style", 4, "ngIf"],
								["role", "tree", 1, "p-tree-container", 3, "ngClass"],
								[
									3,
									"level",
									"rowNode",
									"node",
									"firstChild",
									"lastChild",
									"index",
									"itemSize",
									"indentation",
									4,
									"ngFor",
									"ngForOf",
									"ngForTrackBy",
								],
								[
									3,
									"level",
									"rowNode",
									"node",
									"firstChild",
									"lastChild",
									"index",
									"itemSize",
									"indentation",
								],
								["treeNode", ""],
								["pTemplate", "loader"],
								[4, "ngTemplateOutlet", "ngTemplateOutletContext"],
								[1, "p-tree-wrapper"],
								["wrapper", ""],
								["class", "p-tree-container", "role", "tree", 4, "ngIf"],
								["role", "tree", 1, "p-tree-container"],
								[
									3,
									"node",
									"firstChild",
									"lastChild",
									"index",
									"level",
									4,
									"ngFor",
									"ngForOf",
									"ngForTrackBy",
								],
								[3, "node", "firstChild", "lastChild", "index", "level"],
								[1, "p-tree-empty-message"],
								[4, "ngIf", "ngIfElse"],
								["emptyFilter", ""],
								[3, "ngClass", "ngStyle"],
								["class", "p-tree-loading-mask p-component-overlay", 4, "ngIf"],
								[1, "p-tree-loading-mask", "p-component-overlay"],
								[3, "node", "root"],
							],
							template: function (t, r) {
								1 & t && (y(0, t2, 8, 16, "div", 0), y(1, h2, 6, 11, "div", 1)),
									2 & t && (A("ngIf", !r.horizontal), m(1), A("ngIf", r.horizontal));
							},
							dependencies: function () {
								return [_i, el, Di, Ei, wi, Ko, RO, Jy, Ni, p2];
							},
							styles: [
								".p-tree-container{margin:0;padding:0;list-style-type:none;overflow:auto}.p-treenode-children{margin:0;padding:0;list-style-type:none}.p-tree-wrapper{overflow:auto}.p-treenode-selectable{cursor:pointer;-webkit-user-select:none;user-select:none}.p-tree-toggler{cursor:pointer;-webkit-user-select:none;user-select:none;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative;flex-shrink:0}.p-treenode-leaf>.p-treenode-content .p-tree-toggler{visibility:hidden}.p-treenode-content{display:flex;align-items:center}.p-tree-filter{width:100%}.p-tree-filter-container{position:relative;display:block;width:100%}.p-tree-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-tree-loading{position:relative;min-height:4rem}.p-tree .p-tree-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-tree-flex-scrollable{display:flex;flex:1;height:100%;flex-direction:column}.p-tree-flex-scrollable .p-tree-wrapper{flex:1}.p-tree .p-treenode-droppoint{height:4px;list-style-type:none}.p-tree .p-treenode-droppoint-active{border:0 none}.p-tree-horizontal{width:auto;padding-left:0;padding-right:0;overflow:auto}.p-tree.p-tree-horizontal table,.p-tree.p-tree-horizontal tr,.p-tree.p-tree-horizontal td{border-collapse:collapse;margin:0;padding:0;vertical-align:middle}.p-tree-horizontal .p-treenode-content{font-weight:400;padding:.4em 1em .4em .2em;display:flex;align-items:center}.p-tree-horizontal .p-treenode-parent .p-treenode-content{font-weight:400;white-space:nowrap}.p-tree.p-tree-horizontal .p-treenode{background:url(data:image/gif;base64,R0lGODlhAQABAIAAALGxsf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6Mzc6MzcgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMC0wMy0xMVQxMDoxNjo0MVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMC0wMy0xMVQxMjo0NDoxOVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9naWY8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PAA6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQABwD/ACwAAAAAAQABAAACAkQBADs=) repeat-x scroll center center transparent;padding:.25rem 2.5rem}.p-tree.p-tree-horizontal .p-treenode.p-treenode-leaf,.p-tree.p-tree-horizontal .p-treenode.p-treenode-collapsed{padding-right:0}.p-tree.p-tree-horizontal .p-treenode-children{padding:0;margin:0}.p-tree.p-tree-horizontal .p-treenode-connector{width:1px}.p-tree.p-tree-horizontal .p-treenode-connector-table{height:100%;width:1px}.p-tree.p-tree-horizontal .p-treenode-connector-line{background:url(data:image/gif;base64,R0lGODlhAQABAIAAALGxsf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6Mzc6MzcgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMC0wMy0xMVQxMDoxNjo0MVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMC0wMy0xMVQxMjo0NDoxOVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9naWY8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PAA6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQABwD/ACwAAAAAAQABAAACAkQBADs=) repeat-y scroll 0 0 transparent;width:1px}.p-tree.p-tree-horizontal table{height:0}.p-scroller .p-tree-container{overflow:visible}\n",
							],
							encapsulation: 2,
						})),
						e
					);
				})(),
				A2 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [Qn, wr, qy, tv, Zy, Yy, Qy, Xy, Jy, Ni, wr, tv] })),
						e
					);
				})(),
				Jg = (() => {
					class e {
						constructor(t) {
							this.http = t;
						}
						getAllDogs() {
							return this.http.get("https://dog.ceo/api/breeds/list/all");
						}
						getBreedImages(t) {
							return this.http.get("https://dog.ceo/api/breed/" + t + "/images");
						}
						getSubBreedList(t) {
							return this.http.get("https://dog.ceo/api/breed/" + t + "/list");
						}
						getSubBreedImages(t, r) {
							return this.http.get("https://dog.ceo/api/breed/" + t + "/" + r + "/images");
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(My));
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			const { isArray: y2 } = Array,
				{ getPrototypeOf: v2, prototype: _2, keys: D2 } = Object;
			const { isArray: S2 } = Array;
			function ed(...e) {
				const n = ji(e),
					t = (function tD(e) {
						return ue(Fl(e)) ? e.pop() : void 0;
					})(e),
					{ args: r, keys: i } = (function w2(e) {
						if (1 === e.length) {
							const n = e[0];
							if (y2(n)) return { args: n, keys: null };
							if (
								(function E2(e) {
									return e && "object" == typeof e && v2(e) === _2;
								})(n)
							) {
								const t = D2(n);
								return { args: t.map((r) => n[r]), keys: t };
							}
						}
						return { args: e, keys: null };
					})(e);
				if (0 === r.length) return $e([], n);
				const o = new Me(
					(function N2(e, n, t = Vn) {
						return (r) => {
							sv(
								n,
								() => {
									const { length: i } = e,
										o = new Array(i);
									let s = i,
										a = i;
									for (let l = 0; l < i; l++)
										sv(
											n,
											() => {
												const c = $e(e[l], n);
												let u = !1;
												c.subscribe(
													je(
														r,
														(g) => {
															(o[l] = g), u || ((u = !0), a--), a || r.next(t(o.slice()));
														},
														() => {
															--s || r.complete();
														},
													),
												);
											},
											r,
										);
								},
								r,
							);
						};
					})(
						r,
						n,
						i
							? (s) =>
									(function M2(e, n) {
										return e.reduce((t, r, i) => ((t[r] = n[i]), t), {});
									})(i, s)
							: Vn,
					),
				);
				return t
					? o.pipe(
							(function T2(e) {
								return se((n) =>
									(function b2(e, n) {
										return S2(n) ? e(...n) : e(n);
									})(e, n),
								);
							})(t),
					  )
					: o;
			}
			function sv(e, n, t) {
				e ? An(t, e, n) : n();
			}
			const cl = Vi(
				(e) =>
					function () {
						e(this), (this.name = "EmptyError"), (this.message = "no elements in sequence");
					},
			);
			function td(...e) {
				return (function x2() {
					return Nr(1);
				})()($e(e, ji(e)));
			}
			function av(e) {
				return new Me((n) => {
					Bt(e()).subscribe(n);
				});
			}
			function Zo(e, n) {
				const t = ue(e) ? e : () => e,
					r = (i) => i.error(t());
				return new Me(n ? (i) => n.schedule(r, 0, i) : r);
			}
			function nd() {
				return Ue((e, n) => {
					let t = null;
					e._refCount++;
					const r = je(n, void 0, void 0, void 0, () => {
						if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (t = null);
						const i = e._connection,
							o = t;
						(t = null), i && (!o || i === o) && i.unsubscribe(), n.unsubscribe();
					});
					e.subscribe(r), r.closed || (t = e.connect());
				});
			}
			class lv extends Me {
				constructor(n, t) {
					super(),
						(this.source = n),
						(this.subjectFactory = t),
						(this._subject = null),
						(this._refCount = 0),
						(this._connection = null),
						Ld(n) && (this.lift = n.lift);
				}
				_subscribe(n) {
					return this.getSubject().subscribe(n);
				}
				getSubject() {
					const n = this._subject;
					return (!n || n.isStopped) && (this._subject = this.subjectFactory()), this._subject;
				}
				_teardown() {
					this._refCount = 0;
					const { _connection: n } = this;
					(this._subject = this._connection = null), n?.unsubscribe();
				}
				connect() {
					let n = this._connection;
					if (!n) {
						n = this._connection = new Nt();
						const t = this.getSubject();
						n.add(
							this.source.subscribe(
								je(
									t,
									void 0,
									() => {
										this._teardown(), t.complete();
									},
									(r) => {
										this._teardown(), t.error(r);
									},
									() => this._teardown(),
								),
							),
						),
							n.closed && ((this._connection = null), (n = Nt.EMPTY));
					}
					return n;
				}
				refCount() {
					return nd()(this);
				}
			}
			function xi(e) {
				return e <= 0
					? () => Jt
					: Ue((n, t) => {
							let r = 0;
							n.subscribe(
								je(t, (i) => {
									++r <= e && (t.next(i), e <= r && t.complete());
								}),
							);
					  });
			}
			function ul(e) {
				return Ue((n, t) => {
					let r = !1;
					n.subscribe(
						je(
							t,
							(i) => {
								(r = !0), t.next(i);
							},
							() => {
								r || t.next(e), t.complete();
							},
						),
					);
				});
			}
			function cv(e = P2) {
				return Ue((n, t) => {
					let r = !1;
					n.subscribe(
						je(
							t,
							(i) => {
								(r = !0), t.next(i);
							},
							() => (r ? t.complete() : t.error(e())),
						),
					);
				});
			}
			function P2() {
				return new cl();
			}
			function Er(e, n) {
				const t = arguments.length >= 2;
				return (r) => r.pipe(e ? Fn((i, o) => e(i, o, r)) : Vn, xi(1), t ? ul(n) : cv(() => new cl()));
			}
			function ct(e, n, t) {
				const r = ue(e) || n || t ? { next: e, error: n, complete: t } : e;
				return r
					? Ue((i, o) => {
							var s;
							null === (s = r.subscribe) || void 0 === s || s.call(r);
							let a = !0;
							i.subscribe(
								je(
									o,
									(l) => {
										var c;
										null === (c = r.next) || void 0 === c || c.call(r, l), o.next(l);
									},
									() => {
										var l;
										(a = !1), null === (l = r.complete) || void 0 === l || l.call(r), o.complete();
									},
									(l) => {
										var c;
										(a = !1), null === (c = r.error) || void 0 === c || c.call(r, l), o.error(l);
									},
									() => {
										var l, c;
										a && (null === (l = r.unsubscribe) || void 0 === l || l.call(r)),
											null === (c = r.finalize) || void 0 === c || c.call(r);
									},
								),
							);
					  })
					: Vn;
			}
			function Sr(e) {
				return Ue((n, t) => {
					let o,
						r = null,
						i = !1;
					(r = n.subscribe(
						je(t, void 0, void 0, (s) => {
							(o = Bt(e(s, Sr(e)(n)))), r ? (r.unsubscribe(), (r = null), o.subscribe(t)) : (i = !0);
						}),
					)),
						i && (r.unsubscribe(), (r = null), o.subscribe(t));
				});
			}
			function rd(e) {
				return e <= 0
					? () => Jt
					: Ue((n, t) => {
							let r = [];
							n.subscribe(
								je(
									t,
									(i) => {
										r.push(i), e < r.length && r.shift();
									},
									() => {
										for (const i of r) t.next(i);
										t.complete();
									},
									void 0,
									() => {
										r = null;
									},
								),
							);
					  });
			}
			const q = "primary",
				Yo = Symbol("RouteTitle");
			class H2 {
				constructor(n) {
					this.params = n || {};
				}
				has(n) {
					return Object.prototype.hasOwnProperty.call(this.params, n);
				}
				get(n) {
					if (this.has(n)) {
						const t = this.params[n];
						return Array.isArray(t) ? t[0] : t;
					}
					return null;
				}
				getAll(n) {
					if (this.has(n)) {
						const t = this.params[n];
						return Array.isArray(t) ? t : [t];
					}
					return [];
				}
				get keys() {
					return Object.keys(this.params);
				}
			}
			function Ri(e) {
				return new H2(e);
			}
			function V2(e, n, t) {
				const r = t.path.split("/");
				if (r.length > e.length || ("full" === t.pathMatch && (n.hasChildren() || r.length < e.length)))
					return null;
				const i = {};
				for (let o = 0; o < r.length; o++) {
					const s = r[o],
						a = e[o];
					if (s.startsWith(":")) i[s.substring(1)] = a;
					else if (s !== a.path) return null;
				}
				return { consumed: e.slice(0, r.length), posParams: i };
			}
			function hn(e, n) {
				const t = e ? Object.keys(e) : void 0,
					r = n ? Object.keys(n) : void 0;
				if (!t || !r || t.length != r.length) return !1;
				let i;
				for (let o = 0; o < t.length; o++) if (((i = t[o]), !uv(e[i], n[i]))) return !1;
				return !0;
			}
			function uv(e, n) {
				if (Array.isArray(e) && Array.isArray(n)) {
					if (e.length !== n.length) return !1;
					const t = [...e].sort(),
						r = [...n].sort();
					return t.every((i, o) => r[o] === i);
				}
				return e === n;
			}
			function gv(e) {
				return e.length > 0 ? e[e.length - 1] : null;
			}
			function er(e) {
				return (function m2(e) {
					return !!e && (e instanceof Me || (ue(e.lift) && ue(e.subscribe)));
				})(e)
					? e
					: Ma(e)
					? $e(Promise.resolve(e))
					: B(e);
			}
			const U2 = {
					exact: function Cv(e, n, t) {
						if (
							!br(e.segments, n.segments) ||
							!gl(e.segments, n.segments, t) ||
							e.numberOfChildren !== n.numberOfChildren
						)
							return !1;
						for (const r in n.children)
							if (!e.children[r] || !Cv(e.children[r], n.children[r], t)) return !1;
						return !0;
					},
					subset: Iv,
				},
				dv = {
					exact: function j2(e, n) {
						return hn(e, n);
					},
					subset: function $2(e, n) {
						return (
							Object.keys(n).length <= Object.keys(e).length &&
							Object.keys(n).every((t) => uv(e[t], n[t]))
						);
					},
					ignored: () => !0,
				};
			function fv(e, n, t) {
				return (
					U2[t.paths](e.root, n.root, t.matrixParams) &&
					dv[t.queryParams](e.queryParams, n.queryParams) &&
					!("exact" === t.fragment && e.fragment !== n.fragment)
				);
			}
			function Iv(e, n, t) {
				return hv(e, n, n.segments, t);
			}
			function hv(e, n, t, r) {
				if (e.segments.length > t.length) {
					const i = e.segments.slice(0, t.length);
					return !(!br(i, t) || n.hasChildren() || !gl(i, t, r));
				}
				if (e.segments.length === t.length) {
					if (!br(e.segments, t) || !gl(e.segments, t, r)) return !1;
					for (const i in n.children) if (!e.children[i] || !Iv(e.children[i], n.children[i], r)) return !1;
					return !0;
				}
				{
					const i = t.slice(0, e.segments.length),
						o = t.slice(e.segments.length);
					return !!(br(e.segments, i) && gl(e.segments, i, r) && e.children[q]) && hv(e.children[q], n, o, r);
				}
			}
			function gl(e, n, t) {
				return n.every((r, i) => dv[t](e[i].parameters, r.parameters));
			}
			class Pi {
				constructor(n = new ce([], {}), t = {}, r = null) {
					(this.root = n), (this.queryParams = t), (this.fragment = r);
				}
				get queryParamMap() {
					return this._queryParamMap || (this._queryParamMap = Ri(this.queryParams)), this._queryParamMap;
				}
				toString() {
					return G2.serialize(this);
				}
			}
			class ce {
				constructor(n, t) {
					(this.segments = n),
						(this.children = t),
						(this.parent = null),
						Object.values(t).forEach((r) => (r.parent = this));
				}
				hasChildren() {
					return this.numberOfChildren > 0;
				}
				get numberOfChildren() {
					return Object.keys(this.children).length;
				}
				toString() {
					return dl(this);
				}
			}
			class Qo {
				constructor(n, t) {
					(this.path = n), (this.parameters = t);
				}
				get parameterMap() {
					return this._parameterMap || (this._parameterMap = Ri(this.parameters)), this._parameterMap;
				}
				toString() {
					return mv(this);
				}
			}
			function br(e, n) {
				return e.length === n.length && e.every((t, r) => t.path === n[r].path);
			}
			let Xo = (() => {
				class e {}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({
						token: e,
						factory: function () {
							return new id();
						},
						providedIn: "root",
					})),
					e
				);
			})();
			class id {
				parse(n) {
					const t = new rF(n);
					return new Pi(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
				}
				serialize(n) {
					const t = `/${Jo(n.root, !0)}`,
						r = (function Z2(e) {
							const n = Object.keys(e)
								.map((t) => {
									const r = e[t];
									return Array.isArray(r)
										? r.map((i) => `${fl(t)}=${fl(i)}`).join("&")
										: `${fl(t)}=${fl(r)}`;
								})
								.filter((t) => !!t);
							return n.length ? `?${n.join("&")}` : "";
						})(n.queryParams),
						i =
							"string" == typeof n.fragment
								? `#${(function q2(e) {
										return encodeURI(e);
								  })(n.fragment)}`
								: "";
					return `${t}${r}${i}`;
				}
			}
			const G2 = new id();
			function dl(e) {
				return e.segments.map((n) => mv(n)).join("/");
			}
			function Jo(e, n) {
				if (!e.hasChildren()) return dl(e);
				if (n) {
					const t = e.children[q] ? Jo(e.children[q], !1) : "",
						r = [];
					return (
						Object.entries(e.children).forEach(([i, o]) => {
							i !== q && r.push(`${i}:${Jo(o, !1)}`);
						}),
						r.length > 0 ? `${t}(${r.join("//")})` : t
					);
				}
				{
					const t = (function W2(e, n) {
						let t = [];
						return (
							Object.entries(e.children).forEach(([r, i]) => {
								r === q && (t = t.concat(n(i, r)));
							}),
							Object.entries(e.children).forEach(([r, i]) => {
								r !== q && (t = t.concat(n(i, r)));
							}),
							t
						);
					})(e, (r, i) => (i === q ? [Jo(e.children[q], !1)] : [`${i}:${Jo(r, !1)}`]));
					return 1 === Object.keys(e.children).length && null != e.children[q]
						? `${dl(e)}/${t[0]}`
						: `${dl(e)}/(${t.join("//")})`;
				}
			}
			function pv(e) {
				return encodeURIComponent(e)
					.replace(/%40/g, "@")
					.replace(/%3A/gi, ":")
					.replace(/%24/g, "$")
					.replace(/%2C/gi, ",");
			}
			function fl(e) {
				return pv(e).replace(/%3B/gi, ";");
			}
			function od(e) {
				return pv(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
			}
			function Cl(e) {
				return decodeURIComponent(e);
			}
			function Av(e) {
				return Cl(e.replace(/\+/g, "%20"));
			}
			function mv(e) {
				return `${od(e.path)}${(function K2(e) {
					return Object.keys(e)
						.map((n) => `;${od(n)}=${od(e[n])}`)
						.join("");
				})(e.parameters)}`;
			}
			const Y2 = /^[^\/()?;#]+/;
			function sd(e) {
				const n = e.match(Y2);
				return n ? n[0] : "";
			}
			const Q2 = /^[^\/()?;=#]+/,
				J2 = /^[^=?&#]+/,
				tF = /^[^&#]+/;
			class rF {
				constructor(n) {
					(this.url = n), (this.remaining = n);
				}
				parseRootSegment() {
					return (
						this.consumeOptional("/"),
						"" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#")
							? new ce([], {})
							: new ce([], this.parseChildren())
					);
				}
				parseQueryParams() {
					const n = {};
					if (this.consumeOptional("?"))
						do {
							this.parseQueryParam(n);
						} while (this.consumeOptional("&"));
					return n;
				}
				parseFragment() {
					return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
				}
				parseChildren() {
					if ("" === this.remaining) return {};
					this.consumeOptional("/");
					const n = [];
					for (
						this.peekStartsWith("(") || n.push(this.parseSegment());
						this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");

					)
						this.capture("/"), n.push(this.parseSegment());
					let t = {};
					this.peekStartsWith("/(") && (this.capture("/"), (t = this.parseParens(!0)));
					let r = {};
					return (
						this.peekStartsWith("(") && (r = this.parseParens(!1)),
						(n.length > 0 || Object.keys(t).length > 0) && (r[q] = new ce(n, t)),
						r
					);
				}
				parseSegment() {
					const n = sd(this.remaining);
					if ("" === n && this.peekStartsWith(";")) throw new w(4009, !1);
					return this.capture(n), new Qo(Cl(n), this.parseMatrixParams());
				}
				parseMatrixParams() {
					const n = {};
					for (; this.consumeOptional(";"); ) this.parseParam(n);
					return n;
				}
				parseParam(n) {
					const t = (function X2(e) {
						const n = e.match(Q2);
						return n ? n[0] : "";
					})(this.remaining);
					if (!t) return;
					this.capture(t);
					let r = "";
					if (this.consumeOptional("=")) {
						const i = sd(this.remaining);
						i && ((r = i), this.capture(r));
					}
					n[Cl(t)] = Cl(r);
				}
				parseQueryParam(n) {
					const t = (function eF(e) {
						const n = e.match(J2);
						return n ? n[0] : "";
					})(this.remaining);
					if (!t) return;
					this.capture(t);
					let r = "";
					if (this.consumeOptional("=")) {
						const s = (function nF(e) {
							const n = e.match(tF);
							return n ? n[0] : "";
						})(this.remaining);
						s && ((r = s), this.capture(r));
					}
					const i = Av(t),
						o = Av(r);
					if (n.hasOwnProperty(i)) {
						let s = n[i];
						Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o);
					} else n[i] = o;
				}
				parseParens(n) {
					const t = {};
					for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
						const r = sd(this.remaining),
							i = this.remaining[r.length];
						if ("/" !== i && ")" !== i && ";" !== i) throw new w(4010, !1);
						let o;
						r.indexOf(":") > -1
							? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":"))
							: n && (o = q);
						const s = this.parseChildren();
						(t[o] = 1 === Object.keys(s).length ? s[q] : new ce([], s)), this.consumeOptional("//");
					}
					return t;
				}
				peekStartsWith(n) {
					return this.remaining.startsWith(n);
				}
				consumeOptional(n) {
					return !!this.peekStartsWith(n) && ((this.remaining = this.remaining.substring(n.length)), !0);
				}
				capture(n) {
					if (!this.consumeOptional(n)) throw new w(4011, !1);
				}
			}
			function yv(e) {
				return e.segments.length > 0 ? new ce([], { [q]: e }) : e;
			}
			function vv(e) {
				const n = {};
				for (const r of Object.keys(e.children)) {
					const o = vv(e.children[r]);
					if (r === q && 0 === o.segments.length && o.hasChildren())
						for (const [s, a] of Object.entries(o.children)) n[s] = a;
					else (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
				}
				return (function iF(e) {
					if (1 === e.numberOfChildren && e.children[q]) {
						const n = e.children[q];
						return new ce(e.segments.concat(n.segments), n.children);
					}
					return e;
				})(new ce(e.segments, n));
			}
			function Tr(e) {
				return e instanceof Pi;
			}
			function _v(e) {
				let n;
				const i = yv(
					(function t(o) {
						const s = {};
						for (const l of o.children) {
							const c = t(l);
							s[l.outlet] = c;
						}
						const a = new ce(o.url, s);
						return o === e && (n = a), a;
					})(e.root),
				);
				return n ?? i;
			}
			function Dv(e, n, t, r) {
				let i = e;
				for (; i.parent; ) i = i.parent;
				if (0 === n.length) return ad(i, i, i, t, r);
				const o = (function sF(e) {
					if ("string" == typeof e[0] && 1 === e.length && "/" === e[0]) return new Ev(!0, 0, e);
					let n = 0,
						t = !1;
					const r = e.reduce((i, o, s) => {
						if ("object" == typeof o && null != o) {
							if (o.outlets) {
								const a = {};
								return (
									Object.entries(o.outlets).forEach(([l, c]) => {
										a[l] = "string" == typeof c ? c.split("/") : c;
									}),
									[...i, { outlets: a }]
								);
							}
							if (o.segmentPath) return [...i, o.segmentPath];
						}
						return "string" != typeof o
							? [...i, o]
							: 0 === s
							? (o.split("/").forEach((a, l) => {
									(0 == l && "." === a) ||
										(0 == l && "" === a ? (t = !0) : ".." === a ? n++ : "" != a && i.push(a));
							  }),
							  i)
							: [...i, o];
					}, []);
					return new Ev(t, n, r);
				})(n);
				if (o.toRoot()) return ad(i, i, new ce([], {}), t, r);
				const s = (function aF(e, n, t) {
						if (e.isAbsolute) return new hl(n, !0, 0);
						if (!t) return new hl(n, !1, NaN);
						if (null === t.parent) return new hl(t, !0, 0);
						const r = Il(e.commands[0]) ? 0 : 1;
						return (function lF(e, n, t) {
							let r = e,
								i = n,
								o = t;
							for (; o > i; ) {
								if (((o -= i), (r = r.parent), !r)) throw new w(4005, !1);
								i = r.segments.length;
							}
							return new hl(r, !1, i - o);
						})(t, t.segments.length - 1 + r, e.numberOfDoubleDots);
					})(o, i, e),
					a = s.processChildren
						? ts(s.segmentGroup, s.index, o.commands)
						: Sv(s.segmentGroup, s.index, o.commands);
				return ad(i, s.segmentGroup, a, t, r);
			}
			function Il(e) {
				return "object" == typeof e && null != e && !e.outlets && !e.segmentPath;
			}
			function es(e) {
				return "object" == typeof e && null != e && e.outlets;
			}
			function ad(e, n, t, r, i) {
				let s,
					o = {};
				r &&
					Object.entries(r).forEach(([l, c]) => {
						o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
					}),
					(s = e === n ? t : wv(e, n, t));
				const a = yv(vv(s));
				return new Pi(a, o, i);
			}
			function wv(e, n, t) {
				const r = {};
				return (
					Object.entries(e.children).forEach(([i, o]) => {
						r[i] = o === n ? t : wv(o, n, t);
					}),
					new ce(e.segments, r)
				);
			}
			class Ev {
				constructor(n, t, r) {
					if (
						((this.isAbsolute = n),
						(this.numberOfDoubleDots = t),
						(this.commands = r),
						n && r.length > 0 && Il(r[0]))
					)
						throw new w(4003, !1);
					const i = r.find(es);
					if (i && i !== gv(r)) throw new w(4004, !1);
				}
				toRoot() {
					return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0];
				}
			}
			class hl {
				constructor(n, t, r) {
					(this.segmentGroup = n), (this.processChildren = t), (this.index = r);
				}
			}
			function Sv(e, n, t) {
				if ((e || (e = new ce([], {})), 0 === e.segments.length && e.hasChildren())) return ts(e, n, t);
				const r = (function uF(e, n, t) {
						let r = 0,
							i = n;
						const o = { match: !1, pathIndex: 0, commandIndex: 0 };
						for (; i < e.segments.length; ) {
							if (r >= t.length) return o;
							const s = e.segments[i],
								a = t[r];
							if (es(a)) break;
							const l = `${a}`,
								c = r < t.length - 1 ? t[r + 1] : null;
							if (i > 0 && void 0 === l) break;
							if (l && c && "object" == typeof c && void 0 === c.outlets) {
								if (!Tv(l, c, s)) return o;
								r += 2;
							} else {
								if (!Tv(l, {}, s)) return o;
								r++;
							}
							i++;
						}
						return { match: !0, pathIndex: i, commandIndex: r };
					})(e, n, t),
					i = t.slice(r.commandIndex);
				if (r.match && r.pathIndex < e.segments.length) {
					const o = new ce(e.segments.slice(0, r.pathIndex), {});
					return (o.children[q] = new ce(e.segments.slice(r.pathIndex), e.children)), ts(o, 0, i);
				}
				return r.match && 0 === i.length
					? new ce(e.segments, {})
					: r.match && !e.hasChildren()
					? ld(e, n, t)
					: r.match
					? ts(e, 0, i)
					: ld(e, n, t);
			}
			function ts(e, n, t) {
				if (0 === t.length) return new ce(e.segments, {});
				{
					const r = (function cF(e) {
							return es(e[0]) ? e[0].outlets : { [q]: e };
						})(t),
						i = {};
					if (!r[q] && e.children[q] && 1 === e.numberOfChildren && 0 === e.children[q].segments.length) {
						const o = ts(e.children[q], n, t);
						return new ce(e.segments, o.children);
					}
					return (
						Object.entries(r).forEach(([o, s]) => {
							"string" == typeof s && (s = [s]), null !== s && (i[o] = Sv(e.children[o], n, s));
						}),
						Object.entries(e.children).forEach(([o, s]) => {
							void 0 === r[o] && (i[o] = s);
						}),
						new ce(e.segments, i)
					);
				}
			}
			function ld(e, n, t) {
				const r = e.segments.slice(0, n);
				let i = 0;
				for (; i < t.length; ) {
					const o = t[i];
					if (es(o)) {
						const l = gF(o.outlets);
						return new ce(r, l);
					}
					if (0 === i && Il(t[0])) {
						r.push(new Qo(e.segments[n].path, bv(t[0]))), i++;
						continue;
					}
					const s = es(o) ? o.outlets[q] : `${o}`,
						a = i < t.length - 1 ? t[i + 1] : null;
					s && a && Il(a) ? (r.push(new Qo(s, bv(a))), (i += 2)) : (r.push(new Qo(s, {})), i++);
				}
				return new ce(r, {});
			}
			function gF(e) {
				const n = {};
				return (
					Object.entries(e).forEach(([t, r]) => {
						"string" == typeof r && (r = [r]), null !== r && (n[t] = ld(new ce([], {}), 0, r));
					}),
					n
				);
			}
			function bv(e) {
				const n = {};
				return Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n;
			}
			function Tv(e, n, t) {
				return e == t.path && hn(n, t.parameters);
			}
			const ns = "imperative";
			class pn {
				constructor(n, t) {
					(this.id = n), (this.url = t);
				}
			}
			class cd extends pn {
				constructor(n, t, r = "imperative", i = null) {
					super(n, t), (this.type = 0), (this.navigationTrigger = r), (this.restoredState = i);
				}
				toString() {
					return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class Mr extends pn {
				constructor(n, t, r) {
					super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
				}
				toString() {
					return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
				}
			}
			class pl extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.reason = r), (this.code = i), (this.type = 2);
				}
				toString() {
					return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class rs extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.reason = r), (this.code = i), (this.type = 16);
				}
			}
			class ud extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.error = r), (this.target = i), (this.type = 3);
				}
				toString() {
					return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
				}
			}
			class dF extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 4);
				}
				toString() {
					return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class fF extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 7);
				}
				toString() {
					return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class CF extends pn {
				constructor(n, t, r, i, o) {
					super(n, t),
						(this.urlAfterRedirects = r),
						(this.state = i),
						(this.shouldActivate = o),
						(this.type = 8);
				}
				toString() {
					return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
				}
			}
			class IF extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 5);
				}
				toString() {
					return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class hF extends pn {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 6);
				}
				toString() {
					return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class pF {
				constructor(n) {
					(this.route = n), (this.type = 9);
				}
				toString() {
					return `RouteConfigLoadStart(path: ${this.route.path})`;
				}
			}
			class AF {
				constructor(n) {
					(this.route = n), (this.type = 10);
				}
				toString() {
					return `RouteConfigLoadEnd(path: ${this.route.path})`;
				}
			}
			class mF {
				constructor(n) {
					(this.snapshot = n), (this.type = 11);
				}
				toString() {
					return `ChildActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class yF {
				constructor(n) {
					(this.snapshot = n), (this.type = 12);
				}
				toString() {
					return `ChildActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class vF {
				constructor(n) {
					(this.snapshot = n), (this.type = 13);
				}
				toString() {
					return `ActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class _F {
				constructor(n) {
					(this.snapshot = n), (this.type = 14);
				}
				toString() {
					return `ActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class Mv {
				constructor(n, t, r) {
					(this.routerEvent = n), (this.position = t), (this.anchor = r), (this.type = 15);
				}
				toString() {
					return `Scroll(anchor: '${this.anchor}', position: '${
						this.position ? `${this.position[0]}, ${this.position[1]}` : null
					}')`;
				}
			}
			class DF {
				constructor() {
					(this.outlet = null),
						(this.route = null),
						(this.injector = null),
						(this.children = new is()),
						(this.attachRef = null);
				}
			}
			let is = (() => {
				class e {
					constructor() {
						this.contexts = new Map();
					}
					onChildOutletCreated(t, r) {
						const i = this.getOrCreateContext(t);
						(i.outlet = r), this.contexts.set(t, i);
					}
					onChildOutletDestroyed(t) {
						const r = this.getContext(t);
						r && ((r.outlet = null), (r.attachRef = null));
					}
					onOutletDeactivated() {
						const t = this.contexts;
						return (this.contexts = new Map()), t;
					}
					onOutletReAttached(t) {
						this.contexts = t;
					}
					getOrCreateContext(t) {
						let r = this.getContext(t);
						return r || ((r = new DF()), this.contexts.set(t, r)), r;
					}
					getContext(t) {
						return this.contexts.get(t) || null;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class Nv {
				constructor(n) {
					this._root = n;
				}
				get root() {
					return this._root.value;
				}
				parent(n) {
					const t = this.pathFromRoot(n);
					return t.length > 1 ? t[t.length - 2] : null;
				}
				children(n) {
					const t = gd(n, this._root);
					return t ? t.children.map((r) => r.value) : [];
				}
				firstChild(n) {
					const t = gd(n, this._root);
					return t && t.children.length > 0 ? t.children[0].value : null;
				}
				siblings(n) {
					const t = dd(n, this._root);
					return t.length < 2 ? [] : t[t.length - 2].children.map((i) => i.value).filter((i) => i !== n);
				}
				pathFromRoot(n) {
					return dd(n, this._root).map((t) => t.value);
				}
			}
			function gd(e, n) {
				if (e === n.value) return n;
				for (const t of n.children) {
					const r = gd(e, t);
					if (r) return r;
				}
				return null;
			}
			function dd(e, n) {
				if (e === n.value) return [n];
				for (const t of n.children) {
					const r = dd(e, t);
					if (r.length) return r.unshift(n), r;
				}
				return [];
			}
			class kn {
				constructor(n, t) {
					(this.value = n), (this.children = t);
				}
				toString() {
					return `TreeNode(${this.value})`;
				}
			}
			function Oi(e) {
				const n = {};
				return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
			}
			class xv extends Nv {
				constructor(n, t) {
					super(n), (this.snapshot = t), fd(this, n);
				}
				toString() {
					return this.snapshot.toString();
				}
			}
			function Rv(e, n) {
				const t = (function wF(e, n) {
						const s = new Al([], {}, {}, "", {}, q, n, null, {});
						return new Ov("", new kn(s, []));
					})(0, n),
					r = new Rt([new Qo("", {})]),
					i = new Rt({}),
					o = new Rt({}),
					s = new Rt({}),
					a = new Rt(""),
					l = new tr(r, i, s, a, o, q, n, t.root);
				return (l.snapshot = t.root), new xv(new kn(l, []), t);
			}
			class tr {
				constructor(n, t, r, i, o, s, a, l) {
					(this.urlSubject = n),
						(this.paramsSubject = t),
						(this.queryParamsSubject = r),
						(this.fragmentSubject = i),
						(this.dataSubject = o),
						(this.outlet = s),
						(this.component = a),
						(this._futureSnapshot = l),
						(this.title = this.dataSubject?.pipe(se((c) => c[Yo])) ?? B(void 0)),
						(this.url = n),
						(this.params = t),
						(this.queryParams = r),
						(this.fragment = i),
						(this.data = o);
				}
				get routeConfig() {
					return this._futureSnapshot.routeConfig;
				}
				get root() {
					return this._routerState.root;
				}
				get parent() {
					return this._routerState.parent(this);
				}
				get firstChild() {
					return this._routerState.firstChild(this);
				}
				get children() {
					return this._routerState.children(this);
				}
				get pathFromRoot() {
					return this._routerState.pathFromRoot(this);
				}
				get paramMap() {
					return this._paramMap || (this._paramMap = this.params.pipe(se((n) => Ri(n)))), this._paramMap;
				}
				get queryParamMap() {
					return (
						this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(se((n) => Ri(n)))),
						this._queryParamMap
					);
				}
				toString() {
					return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
				}
			}
			function Pv(e, n = "emptyOnly") {
				const t = e.pathFromRoot;
				let r = 0;
				if ("always" !== n)
					for (r = t.length - 1; r >= 1; ) {
						const i = t[r],
							o = t[r - 1];
						if (i.routeConfig && "" === i.routeConfig.path) r--;
						else {
							if (o.component) break;
							r--;
						}
					}
				return (function EF(e) {
					return e.reduce(
						(n, t) => ({
							params: { ...n.params, ...t.params },
							data: { ...n.data, ...t.data },
							resolve: { ...t.data, ...n.resolve, ...t.routeConfig?.data, ...t._resolvedData },
						}),
						{ params: {}, data: {}, resolve: {} },
					);
				})(t.slice(r));
			}
			class Al {
				get title() {
					return this.data?.[Yo];
				}
				constructor(n, t, r, i, o, s, a, l, c) {
					(this.url = n),
						(this.params = t),
						(this.queryParams = r),
						(this.fragment = i),
						(this.data = o),
						(this.outlet = s),
						(this.component = a),
						(this.routeConfig = l),
						(this._resolve = c);
				}
				get root() {
					return this._routerState.root;
				}
				get parent() {
					return this._routerState.parent(this);
				}
				get firstChild() {
					return this._routerState.firstChild(this);
				}
				get children() {
					return this._routerState.children(this);
				}
				get pathFromRoot() {
					return this._routerState.pathFromRoot(this);
				}
				get paramMap() {
					return this._paramMap || (this._paramMap = Ri(this.params)), this._paramMap;
				}
				get queryParamMap() {
					return this._queryParamMap || (this._queryParamMap = Ri(this.queryParams)), this._queryParamMap;
				}
				toString() {
					return `Route(url:'${this.url.map((r) => r.toString()).join("/")}', path:'${
						this.routeConfig ? this.routeConfig.path : ""
					}')`;
				}
			}
			class Ov extends Nv {
				constructor(n, t) {
					super(t), (this.url = n), fd(this, t);
				}
				toString() {
					return Lv(this._root);
				}
			}
			function fd(e, n) {
				(n.value._routerState = e), n.children.forEach((t) => fd(e, t));
			}
			function Lv(e) {
				const n = e.children.length > 0 ? ` { ${e.children.map(Lv).join(", ")} } ` : "";
				return `${e.value}${n}`;
			}
			function Cd(e) {
				if (e.snapshot) {
					const n = e.snapshot,
						t = e._futureSnapshot;
					(e.snapshot = t),
						hn(n.queryParams, t.queryParams) || e.queryParamsSubject.next(t.queryParams),
						n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
						hn(n.params, t.params) || e.paramsSubject.next(t.params),
						(function B2(e, n) {
							if (e.length !== n.length) return !1;
							for (let t = 0; t < e.length; ++t) if (!hn(e[t], n[t])) return !1;
							return !0;
						})(n.url, t.url) || e.urlSubject.next(t.url),
						hn(n.data, t.data) || e.dataSubject.next(t.data);
				} else (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data);
			}
			function Id(e, n) {
				const t =
					hn(e.params, n.params) &&
					(function z2(e, n) {
						return br(e, n) && e.every((t, r) => hn(t.parameters, n[r].parameters));
					})(e.url, n.url);
				return t && !(!e.parent != !n.parent) && (!e.parent || Id(e.parent, n.parent));
			}
			let hd = (() => {
				class e {
					constructor() {
						(this.activated = null),
							(this._activatedRoute = null),
							(this.name = q),
							(this.activateEvents = new re()),
							(this.deactivateEvents = new re()),
							(this.attachEvents = new re()),
							(this.detachEvents = new re()),
							(this.parentContexts = M(is)),
							(this.location = M(Kt)),
							(this.changeDetector = M(Ho)),
							(this.environmentInjector = M(cn)),
							(this.inputBinder = M(ml, { optional: !0 })),
							(this.supportsBindingToComponentInputs = !0);
					}
					get activatedComponentRef() {
						return this.activated;
					}
					ngOnChanges(t) {
						if (t.name) {
							const { firstChange: r, previousValue: i } = t.name;
							if (r) return;
							this.isTrackedInParentContexts(i) &&
								(this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
								this.initializeOutletWithName();
						}
					}
					ngOnDestroy() {
						this.isTrackedInParentContexts(this.name) &&
							this.parentContexts.onChildOutletDestroyed(this.name),
							this.inputBinder?.unsubscribeFromRouteData(this);
					}
					isTrackedInParentContexts(t) {
						return this.parentContexts.getContext(t)?.outlet === this;
					}
					ngOnInit() {
						this.initializeOutletWithName();
					}
					initializeOutletWithName() {
						if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
						const t = this.parentContexts.getContext(this.name);
						t?.route &&
							(t.attachRef ? this.attach(t.attachRef, t.route) : this.activateWith(t.route, t.injector));
					}
					get isActivated() {
						return !!this.activated;
					}
					get component() {
						if (!this.activated) throw new w(4012, !1);
						return this.activated.instance;
					}
					get activatedRoute() {
						if (!this.activated) throw new w(4012, !1);
						return this._activatedRoute;
					}
					get activatedRouteData() {
						return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
					}
					detach() {
						if (!this.activated) throw new w(4012, !1);
						this.location.detach();
						const t = this.activated;
						return (
							(this.activated = null),
							(this._activatedRoute = null),
							this.detachEvents.emit(t.instance),
							t
						);
					}
					attach(t, r) {
						(this.activated = t),
							(this._activatedRoute = r),
							this.location.insert(t.hostView),
							this.inputBinder?.bindActivatedRouteToOutletComponent(this),
							this.attachEvents.emit(t.instance);
					}
					deactivate() {
						if (this.activated) {
							const t = this.component;
							this.activated.destroy(),
								(this.activated = null),
								(this._activatedRoute = null),
								this.deactivateEvents.emit(t);
						}
					}
					activateWith(t, r) {
						if (this.isActivated) throw new w(4013, !1);
						this._activatedRoute = t;
						const i = this.location,
							s = t.snapshot.component,
							a = this.parentContexts.getOrCreateContext(this.name).children,
							l = new SF(t, a, i.injector);
						(this.activated = i.createComponent(s, {
							index: i.length,
							injector: l,
							environmentInjector: r ?? this.environmentInjector,
						})),
							this.changeDetector.markForCheck(),
							this.inputBinder?.bindActivatedRouteToOutletComponent(this),
							this.activateEvents.emit(this.activated.instance);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵdir = qe({
						type: e,
						selectors: [["router-outlet"]],
						inputs: { name: "name" },
						outputs: {
							activateEvents: "activate",
							deactivateEvents: "deactivate",
							attachEvents: "attach",
							detachEvents: "detach",
						},
						exportAs: ["outlet"],
						standalone: !0,
						features: [_n],
					})),
					e
				);
			})();
			class SF {
				constructor(n, t, r) {
					(this.route = n), (this.childContexts = t), (this.parent = r);
				}
				get(n, t) {
					return n === tr ? this.route : n === is ? this.childContexts : this.parent.get(n, t);
				}
			}
			const ml = new R("");
			let Fv = (() => {
				class e {
					constructor() {
						this.outletDataSubscriptions = new Map();
					}
					bindActivatedRouteToOutletComponent(t) {
						this.unsubscribeFromRouteData(t), this.subscribeToRouteData(t);
					}
					unsubscribeFromRouteData(t) {
						this.outletDataSubscriptions.get(t)?.unsubscribe(), this.outletDataSubscriptions.delete(t);
					}
					subscribeToRouteData(t) {
						const { activatedRoute: r } = t,
							i = ed([r.queryParams, r.params, r.data])
								.pipe(
									Ut(
										([o, s, a], l) => (
											(a = { ...o, ...s, ...a }), 0 === l ? B(a) : Promise.resolve(a)
										),
									),
								)
								.subscribe((o) => {
									if (
										!t.isActivated ||
										!t.activatedComponentRef ||
										t.activatedRoute !== r ||
										null === r.component
									)
										return void this.unsubscribeFromRouteData(t);
									const s = (function SN(e) {
										const n = oe(e);
										if (!n) return null;
										const t = new _o(n);
										return {
											get selector() {
												return t.selector;
											},
											get type() {
												return t.componentType;
											},
											get inputs() {
												return t.inputs;
											},
											get outputs() {
												return t.outputs;
											},
											get ngContentSelectors() {
												return t.ngContentSelectors;
											},
											get isStandalone() {
												return n.standalone;
											},
											get isSignal() {
												return n.signals;
											},
										};
									})(r.component);
									if (s)
										for (const { templateName: a } of s.inputs)
											t.activatedComponentRef.setInput(a, o[a]);
									else this.unsubscribeFromRouteData(t);
								});
						this.outletDataSubscriptions.set(t, i);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function os(e, n, t) {
				if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
					const r = t.value;
					r._futureSnapshot = n.value;
					const i = (function TF(e, n, t) {
						return n.children.map((r) => {
							for (const i of t.children)
								if (e.shouldReuseRoute(r.value, i.value.snapshot)) return os(e, r, i);
							return os(e, r);
						});
					})(e, n, t);
					return new kn(r, i);
				}
				{
					if (e.shouldAttach(n.value)) {
						const o = e.retrieve(n.value);
						if (null !== o) {
							const s = o.route;
							return (
								(s.value._futureSnapshot = n.value), (s.children = n.children.map((a) => os(e, a))), s
							);
						}
					}
					const r = (function MF(e) {
							return new tr(
								new Rt(e.url),
								new Rt(e.params),
								new Rt(e.queryParams),
								new Rt(e.fragment),
								new Rt(e.data),
								e.outlet,
								e.component,
								e,
							);
						})(n.value),
						i = n.children.map((o) => os(e, o));
					return new kn(r, i);
				}
			}
			const pd = "ngNavigationCancelingError";
			function kv(e, n) {
				const { redirectTo: t, navigationBehaviorOptions: r } = Tr(n)
						? { redirectTo: n, navigationBehaviorOptions: void 0 }
						: n,
					i = Hv(!1, 0, n);
				return (i.url = t), (i.navigationBehaviorOptions = r), i;
			}
			function Hv(e, n, t) {
				const r = new Error("NavigationCancelingError: " + (e || ""));
				return (r[pd] = !0), (r.cancellationCode = n), t && (r.url = t), r;
			}
			function Vv(e) {
				return Bv(e) && Tr(e.url);
			}
			function Bv(e) {
				return e && e[pd];
			}
			let Uv = (() => {
				class e {}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵcmp = ye({
						type: e,
						selectors: [["ng-component"]],
						standalone: !0,
						features: [xn],
						decls: 1,
						vars: 0,
						template: function (t, r) {
							1 & t && K(0, "router-outlet");
						},
						dependencies: [hd],
						encapsulation: 2,
					})),
					e
				);
			})();
			function Ad(e) {
				const n = e.children && e.children.map(Ad),
					t = n ? { ...e, children: n } : { ...e };
				return (
					!t.component &&
						!t.loadComponent &&
						(n || t.loadChildren) &&
						t.outlet &&
						t.outlet !== q &&
						(t.component = Uv),
					t
				);
			}
			function Xt(e) {
				return e.outlet || q;
			}
			function ss(e) {
				if (!e) return null;
				if (e.routeConfig?._injector) return e.routeConfig._injector;
				for (let n = e.parent; n; n = n.parent) {
					const t = n.routeConfig;
					if (t?._loadedInjector) return t._loadedInjector;
					if (t?._injector) return t._injector;
				}
				return null;
			}
			class FF {
				constructor(n, t, r, i, o) {
					(this.routeReuseStrategy = n),
						(this.futureState = t),
						(this.currState = r),
						(this.forwardEvent = i),
						(this.inputBindingEnabled = o);
				}
				activate(n) {
					const t = this.futureState._root,
						r = this.currState ? this.currState._root : null;
					this.deactivateChildRoutes(t, r, n), Cd(this.futureState.root), this.activateChildRoutes(t, r, n);
				}
				deactivateChildRoutes(n, t, r) {
					const i = Oi(t);
					n.children.forEach((o) => {
						const s = o.value.outlet;
						this.deactivateRoutes(o, i[s], r), delete i[s];
					}),
						Object.values(i).forEach((o) => {
							this.deactivateRouteAndItsChildren(o, r);
						});
				}
				deactivateRoutes(n, t, r) {
					const i = n.value,
						o = t ? t.value : null;
					if (i === o)
						if (i.component) {
							const s = r.getContext(i.outlet);
							s && this.deactivateChildRoutes(n, t, s.children);
						} else this.deactivateChildRoutes(n, t, r);
					else o && this.deactivateRouteAndItsChildren(t, r);
				}
				deactivateRouteAndItsChildren(n, t) {
					n.value.component && this.routeReuseStrategy.shouldDetach(n.value.snapshot)
						? this.detachAndStoreRouteSubtree(n, t)
						: this.deactivateRouteAndOutlet(n, t);
				}
				detachAndStoreRouteSubtree(n, t) {
					const r = t.getContext(n.value.outlet),
						i = r && n.value.component ? r.children : t,
						o = Oi(n);
					for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
					if (r && r.outlet) {
						const s = r.outlet.detach(),
							a = r.children.onOutletDeactivated();
						this.routeReuseStrategy.store(n.value.snapshot, { componentRef: s, route: n, contexts: a });
					}
				}
				deactivateRouteAndOutlet(n, t) {
					const r = t.getContext(n.value.outlet),
						i = r && n.value.component ? r.children : t,
						o = Oi(n);
					for (const s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
					r &&
						(r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
						(r.attachRef = null),
						(r.route = null));
				}
				activateChildRoutes(n, t, r) {
					const i = Oi(t);
					n.children.forEach((o) => {
						this.activateRoutes(o, i[o.value.outlet], r), this.forwardEvent(new _F(o.value.snapshot));
					}),
						n.children.length && this.forwardEvent(new yF(n.value.snapshot));
				}
				activateRoutes(n, t, r) {
					const i = n.value,
						o = t ? t.value : null;
					if ((Cd(i), i === o))
						if (i.component) {
							const s = r.getOrCreateContext(i.outlet);
							this.activateChildRoutes(n, t, s.children);
						} else this.activateChildRoutes(n, t, r);
					else if (i.component) {
						const s = r.getOrCreateContext(i.outlet);
						if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
							const a = this.routeReuseStrategy.retrieve(i.snapshot);
							this.routeReuseStrategy.store(i.snapshot, null),
								s.children.onOutletReAttached(a.contexts),
								(s.attachRef = a.componentRef),
								(s.route = a.route.value),
								s.outlet && s.outlet.attach(a.componentRef, a.route.value),
								Cd(a.route.value),
								this.activateChildRoutes(n, null, s.children);
						} else {
							const a = ss(i.snapshot);
							(s.attachRef = null),
								(s.route = i),
								(s.injector = a),
								s.outlet && s.outlet.activateWith(i, s.injector),
								this.activateChildRoutes(n, null, s.children);
						}
					} else this.activateChildRoutes(n, null, r);
				}
			}
			class jv {
				constructor(n) {
					(this.path = n), (this.route = this.path[this.path.length - 1]);
				}
			}
			class yl {
				constructor(n, t) {
					(this.component = n), (this.route = t);
				}
			}
			function kF(e, n, t) {
				const r = e._root;
				return as(r, n ? n._root : null, t, [r.value]);
			}
			function Li(e, n) {
				const t = Symbol(),
					r = n.get(e, t);
				return r === t
					? "function" != typeof e ||
					  (function AD(e) {
							return null !== ms(e);
					  })(e)
						? n.get(e)
						: e
					: r;
			}
			function as(e, n, t, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
				const o = Oi(n);
				return (
					e.children.forEach((s) => {
						(function VF(e, n, t, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
							const o = e.value,
								s = n ? n.value : null,
								a = t ? t.getContext(e.value.outlet) : null;
							if (s && o.routeConfig === s.routeConfig) {
								const l = (function BF(e, n, t) {
									if ("function" == typeof t) return t(e, n);
									switch (t) {
										case "pathParamsChange":
											return !br(e.url, n.url);
										case "pathParamsOrQueryParamsChange":
											return !br(e.url, n.url) || !hn(e.queryParams, n.queryParams);
										case "always":
											return !0;
										case "paramsOrQueryParamsChange":
											return !Id(e, n) || !hn(e.queryParams, n.queryParams);
										default:
											return !Id(e, n);
									}
								})(s, o, o.routeConfig.runGuardsAndResolvers);
								l
									? i.canActivateChecks.push(new jv(r))
									: ((o.data = s.data), (o._resolvedData = s._resolvedData)),
									as(e, n, o.component ? (a ? a.children : null) : t, r, i),
									l &&
										a &&
										a.outlet &&
										a.outlet.isActivated &&
										i.canDeactivateChecks.push(new yl(a.outlet.component, s));
							} else
								s && ls(n, a, i),
									i.canActivateChecks.push(new jv(r)),
									as(e, null, o.component ? (a ? a.children : null) : t, r, i);
						})(s, o[s.value.outlet], t, r.concat([s.value]), i),
							delete o[s.value.outlet];
					}),
					Object.entries(o).forEach(([s, a]) => ls(a, t.getContext(s), i)),
					i
				);
			}
			function ls(e, n, t) {
				const r = Oi(e),
					i = e.value;
				Object.entries(r).forEach(([o, s]) => {
					ls(s, i.component ? (n ? n.children.getContext(o) : null) : n, t);
				}),
					t.canDeactivateChecks.push(
						new yl(i.component && n && n.outlet && n.outlet.isActivated ? n.outlet.component : null, i),
					);
			}
			function cs(e) {
				return "function" == typeof e;
			}
			function $v(e) {
				return e instanceof cl || "EmptyError" === e?.name;
			}
			const vl = Symbol("INITIAL_VALUE");
			function Fi() {
				return Ut((e) =>
					ed(
						e.map((n) =>
							n.pipe(
								xi(1),
								(function R2(...e) {
									const n = ji(e);
									return Ue((t, r) => {
										(n ? td(e, t, n) : td(e, t)).subscribe(r);
									});
								})(vl),
							),
						),
					).pipe(
						se((n) => {
							for (const t of n)
								if (!0 !== t) {
									if (t === vl) return vl;
									if (!1 === t || t instanceof Pi) return t;
								}
							return !0;
						}),
						Fn((n) => n !== vl),
						xi(1),
					),
				);
			}
			function zv(e) {
				return (function m_(...e) {
					return Rd(e);
				})(
					ct((n) => {
						if (Tr(n)) throw kv(0, n);
					}),
					se((n) => !0 === n),
				);
			}
			class _l {
				constructor(n) {
					this.segmentGroup = n || null;
				}
			}
			class Wv {
				constructor(n) {
					this.urlTree = n;
				}
			}
			function ki(e) {
				return Zo(new _l(e));
			}
			function Gv(e) {
				return Zo(new Wv(e));
			}
			class sk {
				constructor(n, t) {
					(this.urlSerializer = n), (this.urlTree = t);
				}
				noMatchError(n) {
					return new w(4002, !1);
				}
				lineralizeSegments(n, t) {
					let r = [],
						i = t.root;
					for (;;) {
						if (((r = r.concat(i.segments)), 0 === i.numberOfChildren)) return B(r);
						if (i.numberOfChildren > 1 || !i.children[q]) return Zo(new w(4e3, !1));
						i = i.children[q];
					}
				}
				applyRedirectCommands(n, t, r) {
					return this.applyRedirectCreateUrlTree(t, this.urlSerializer.parse(t), n, r);
				}
				applyRedirectCreateUrlTree(n, t, r, i) {
					const o = this.createSegmentGroup(n, t.root, r, i);
					return new Pi(o, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
				}
				createQueryParams(n, t) {
					const r = {};
					return (
						Object.entries(n).forEach(([i, o]) => {
							if ("string" == typeof o && o.startsWith(":")) {
								const a = o.substring(1);
								r[i] = t[a];
							} else r[i] = o;
						}),
						r
					);
				}
				createSegmentGroup(n, t, r, i) {
					const o = this.createSegments(n, t.segments, r, i);
					let s = {};
					return (
						Object.entries(t.children).forEach(([a, l]) => {
							s[a] = this.createSegmentGroup(n, l, r, i);
						}),
						new ce(o, s)
					);
				}
				createSegments(n, t, r, i) {
					return t.map((o) =>
						o.path.startsWith(":") ? this.findPosParam(n, o, i) : this.findOrReturn(o, r),
					);
				}
				findPosParam(n, t, r) {
					const i = r[t.path.substring(1)];
					if (!i) throw new w(4001, !1);
					return i;
				}
				findOrReturn(n, t) {
					let r = 0;
					for (const i of t) {
						if (i.path === n.path) return t.splice(r), i;
						r++;
					}
					return n;
				}
			}
			const md = {
				matched: !1,
				consumedSegments: [],
				remainingSegments: [],
				parameters: {},
				positionalParamSegments: {},
			};
			function ak(e, n, t, r, i) {
				const o = yd(e, n, t);
				return o.matched
					? ((r = (function NF(e, n) {
							return (
								e.providers && !e._injector && (e._injector = Vu(e.providers, n, `Route: ${e.path}`)),
								e._injector ?? n
							);
					  })(n, r)),
					  (function rk(e, n, t, r) {
							const i = n.canMatch;
							return i && 0 !== i.length
								? B(
										i.map((s) => {
											const a = Li(s, e);
											return er(
												(function GF(e) {
													return e && cs(e.canMatch);
												})(a)
													? a.canMatch(n, t)
													: e.runInContext(() => a(n, t)),
											);
										}),
								  ).pipe(Fi(), zv())
								: B(!0);
					  })(r, n, t).pipe(se((s) => (!0 === s ? o : { ...md }))))
					: B(o);
			}
			function yd(e, n, t) {
				if ("" === n.path)
					return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
						? { ...md }
						: {
								matched: !0,
								consumedSegments: [],
								remainingSegments: t,
								parameters: {},
								positionalParamSegments: {},
						  };
				const i = (n.matcher || V2)(t, e, n);
				if (!i) return { ...md };
				const o = {};
				Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
					o[a] = l.path;
				});
				const s = i.consumed.length > 0 ? { ...o, ...i.consumed[i.consumed.length - 1].parameters } : o;
				return {
					matched: !0,
					consumedSegments: i.consumed,
					remainingSegments: t.slice(i.consumed.length),
					parameters: s,
					positionalParamSegments: i.posParams ?? {},
				};
			}
			function qv(e, n, t, r) {
				return t.length > 0 &&
					(function uk(e, n, t) {
						return t.some((r) => Dl(e, n, r) && Xt(r) !== q);
					})(e, t, r)
					? { segmentGroup: new ce(n, ck(r, new ce(t, e.children))), slicedSegments: [] }
					: 0 === t.length &&
					  (function gk(e, n, t) {
							return t.some((r) => Dl(e, n, r));
					  })(e, t, r)
					? { segmentGroup: new ce(e.segments, lk(e, 0, t, r, e.children)), slicedSegments: t }
					: { segmentGroup: new ce(e.segments, e.children), slicedSegments: t };
			}
			function lk(e, n, t, r, i) {
				const o = {};
				for (const s of r)
					if (Dl(e, t, s) && !i[Xt(s)]) {
						const a = new ce([], {});
						o[Xt(s)] = a;
					}
				return { ...i, ...o };
			}
			function ck(e, n) {
				const t = {};
				t[q] = n;
				for (const r of e)
					if ("" === r.path && Xt(r) !== q) {
						const i = new ce([], {});
						t[Xt(r)] = i;
					}
				return t;
			}
			function Dl(e, n, t) {
				return (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) && "" === t.path;
			}
			class Ik {
				constructor(n, t, r, i, o, s, a) {
					(this.injector = n),
						(this.configLoader = t),
						(this.rootComponentType = r),
						(this.config = i),
						(this.urlTree = o),
						(this.paramsInheritanceStrategy = s),
						(this.urlSerializer = a),
						(this.allowRedirects = !0),
						(this.applyRedirects = new sk(this.urlSerializer, this.urlTree));
				}
				noMatchError(n) {
					return new w(4002, !1);
				}
				recognize() {
					const n = qv(this.urlTree.root, [], [], this.config).segmentGroup;
					return this.processSegmentGroup(this.injector, this.config, n, q).pipe(
						Sr((t) => {
							if (t instanceof Wv)
								return (this.allowRedirects = !1), (this.urlTree = t.urlTree), this.match(t.urlTree);
							throw t instanceof _l ? this.noMatchError(t) : t;
						}),
						se((t) => {
							const r = new Al(
									[],
									Object.freeze({}),
									Object.freeze({ ...this.urlTree.queryParams }),
									this.urlTree.fragment,
									{},
									q,
									this.rootComponentType,
									null,
									{},
								),
								i = new kn(r, t),
								o = new Ov("", i),
								s = (function oF(e, n, t = null, r = null) {
									return Dv(_v(e), n, t, r);
								})(r, [], this.urlTree.queryParams, this.urlTree.fragment);
							return (
								(s.queryParams = this.urlTree.queryParams),
								(o.url = this.urlSerializer.serialize(s)),
								this.inheritParamsAndData(o._root),
								{ state: o, tree: s }
							);
						}),
					);
				}
				match(n) {
					return this.processSegmentGroup(this.injector, this.config, n.root, q).pipe(
						Sr((r) => {
							throw r instanceof _l ? this.noMatchError(r) : r;
						}),
					);
				}
				inheritParamsAndData(n) {
					const t = n.value,
						r = Pv(t, this.paramsInheritanceStrategy);
					(t.params = Object.freeze(r.params)),
						(t.data = Object.freeze(r.data)),
						n.children.forEach((i) => this.inheritParamsAndData(i));
				}
				processSegmentGroup(n, t, r, i) {
					return 0 === r.segments.length && r.hasChildren()
						? this.processChildren(n, t, r)
						: this.processSegment(n, t, r, r.segments, i, !0);
				}
				processChildren(n, t, r) {
					const i = [];
					for (const o of Object.keys(r.children)) "primary" === o ? i.unshift(o) : i.push(o);
					return $e(i).pipe(
						Si((o) => {
							const s = r.children[o],
								a = (function OF(e, n) {
									const t = e.filter((r) => Xt(r) === n);
									return t.push(...e.filter((r) => Xt(r) !== n)), t;
								})(t, o);
							return this.processSegmentGroup(n, a, s, o);
						}),
						(function L2(e, n) {
							return Ue(
								(function O2(e, n, t, r, i) {
									return (o, s) => {
										let a = t,
											l = n,
											c = 0;
										o.subscribe(
											je(
												s,
												(u) => {
													const g = c++;
													(l = a ? e(l, u, g) : ((a = !0), u)), r && s.next(l);
												},
												i &&
													(() => {
														a && s.next(l), s.complete();
													}),
											),
										);
									};
								})(e, n, arguments.length >= 2, !0),
							);
						})((o, s) => (o.push(...s), o)),
						ul(null),
						(function F2(e, n) {
							const t = arguments.length >= 2;
							return (r) =>
								r.pipe(e ? Fn((i, o) => e(i, o, r)) : Vn, rd(1), t ? ul(n) : cv(() => new cl()));
						})(),
						Ge((o) => {
							if (null === o) return ki(r);
							const s = Kv(o);
							return (
								(function hk(e) {
									e.sort((n, t) =>
										n.value.outlet === q
											? -1
											: t.value.outlet === q
											? 1
											: n.value.outlet.localeCompare(t.value.outlet),
									);
								})(s),
								B(s)
							);
						}),
					);
				}
				processSegment(n, t, r, i, o, s) {
					return $e(t).pipe(
						Si((a) =>
							this.processSegmentAgainstRoute(a._injector ?? n, t, a, r, i, o, s).pipe(
								Sr((l) => {
									if (l instanceof _l) return B(null);
									throw l;
								}),
							),
						),
						Er((a) => !!a),
						Sr((a) => {
							if ($v(a))
								return (function fk(e, n, t) {
									return 0 === n.length && !e.children[t];
								})(r, i, o)
									? B([])
									: ki(r);
							throw a;
						}),
					);
				}
				processSegmentAgainstRoute(n, t, r, i, o, s, a) {
					return (function dk(e, n, t, r) {
						return !!(Xt(e) === r || (r !== q && Dl(n, t, e))) && ("**" === e.path || yd(n, e, t).matched);
					})(r, i, o, s)
						? void 0 === r.redirectTo
							? this.matchSegmentAgainstRoute(n, i, r, o, s, a)
							: a && this.allowRedirects
							? this.expandSegmentAgainstRouteUsingRedirect(n, i, t, r, o, s)
							: ki(i)
						: ki(i);
				}
				expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
					return "**" === i.path
						? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, r, i, s)
						: this.expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s);
				}
				expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, r, i) {
					const o = this.applyRedirects.applyRedirectCommands([], r.redirectTo, {});
					return r.redirectTo.startsWith("/")
						? Gv(o)
						: this.applyRedirects.lineralizeSegments(r, o).pipe(
								Ge((s) => {
									const a = new ce(s, {});
									return this.processSegment(n, t, a, s, i, !1);
								}),
						  );
				}
				expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s) {
					const {
						matched: a,
						consumedSegments: l,
						remainingSegments: c,
						positionalParamSegments: u,
					} = yd(t, i, o);
					if (!a) return ki(t);
					const g = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, u);
					return i.redirectTo.startsWith("/")
						? Gv(g)
						: this.applyRedirects
								.lineralizeSegments(i, g)
								.pipe(Ge((d) => this.processSegment(n, r, t, d.concat(c), s, !1)));
				}
				matchSegmentAgainstRoute(n, t, r, i, o, s) {
					let a;
					if ("**" === r.path) {
						const l = i.length > 0 ? gv(i).parameters : {};
						(a = B({
							snapshot: new Al(
								i,
								l,
								Object.freeze({ ...this.urlTree.queryParams }),
								this.urlTree.fragment,
								Zv(r),
								Xt(r),
								r.component ?? r._loadedComponent ?? null,
								r,
								Yv(r),
							),
							consumedSegments: [],
							remainingSegments: [],
						})),
							(t.children = {});
					} else
						a = ak(t, r, i, n).pipe(
							se(({ matched: l, consumedSegments: c, remainingSegments: u, parameters: g }) =>
								l
									? {
											snapshot: new Al(
												c,
												g,
												Object.freeze({ ...this.urlTree.queryParams }),
												this.urlTree.fragment,
												Zv(r),
												Xt(r),
												r.component ?? r._loadedComponent ?? null,
												r,
												Yv(r),
											),
											consumedSegments: c,
											remainingSegments: u,
									  }
									: null,
							),
						);
					return a.pipe(
						Ut((l) =>
							null === l
								? ki(t)
								: this.getChildConfig((n = r._injector ?? n), r, i).pipe(
										Ut(({ routes: c }) => {
											const u = r._loadedInjector ?? n,
												{ snapshot: g, consumedSegments: d, remainingSegments: f } = l,
												{ segmentGroup: C, slicedSegments: I } = qv(t, d, f, c);
											if (0 === I.length && C.hasChildren())
												return this.processChildren(u, c, C).pipe(
													se((v) => (null === v ? null : [new kn(g, v)])),
												);
											if (0 === c.length && 0 === I.length) return B([new kn(g, [])]);
											const p = Xt(r) === o;
											return this.processSegment(u, c, C, I, p ? q : o, !0).pipe(
												se((v) => [new kn(g, v)]),
											);
										}),
								  ),
						),
					);
				}
				getChildConfig(n, t, r) {
					return t.children
						? B({ routes: t.children, injector: n })
						: t.loadChildren
						? void 0 !== t._loadedRoutes
							? B({ routes: t._loadedRoutes, injector: t._loadedInjector })
							: (function nk(e, n, t, r) {
									const i = n.canLoad;
									return void 0 === i || 0 === i.length
										? B(!0)
										: B(
												i.map((s) => {
													const a = Li(s, e);
													return er(
														(function jF(e) {
															return e && cs(e.canLoad);
														})(a)
															? a.canLoad(n, t)
															: e.runInContext(() => a(n, t)),
													);
												}),
										  ).pipe(Fi(), zv());
							  })(n, t, r).pipe(
									Ge((i) =>
										i
											? this.configLoader.loadChildren(n, t).pipe(
													ct((o) => {
														(t._loadedRoutes = o.routes), (t._loadedInjector = o.injector);
													}),
											  )
											: (function ok(e) {
													return Zo(Hv(!1, 3));
											  })(),
									),
							  )
						: B({ routes: [], injector: n });
				}
			}
			function pk(e) {
				const n = e.value.routeConfig;
				return n && "" === n.path;
			}
			function Kv(e) {
				const n = [],
					t = new Set();
				for (const r of e) {
					if (!pk(r)) {
						n.push(r);
						continue;
					}
					const i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
					void 0 !== i ? (i.children.push(...r.children), t.add(i)) : n.push(r);
				}
				for (const r of t) {
					const i = Kv(r.children);
					n.push(new kn(r.value, i));
				}
				return n.filter((r) => !t.has(r));
			}
			function Zv(e) {
				return e.data || {};
			}
			function Yv(e) {
				return e.resolve || {};
			}
			function Qv(e) {
				return "string" == typeof e.title || null === e.title;
			}
			function vd(e) {
				return Ut((n) => {
					const t = e(n);
					return t ? $e(t).pipe(se(() => n)) : B(n);
				});
			}
			const Hi = new R("ROUTES");
			let _d = (() => {
				class e {
					constructor() {
						(this.componentLoaders = new WeakMap()),
							(this.childrenLoaders = new WeakMap()),
							(this.compiler = M(QA));
					}
					loadComponent(t) {
						if (this.componentLoaders.get(t)) return this.componentLoaders.get(t);
						if (t._loadedComponent) return B(t._loadedComponent);
						this.onLoadStartListener && this.onLoadStartListener(t);
						const r = er(t.loadComponent()).pipe(
								se(Xv),
								ct((o) => {
									this.onLoadEndListener && this.onLoadEndListener(t), (t._loadedComponent = o);
								}),
								zo(() => {
									this.componentLoaders.delete(t);
								}),
							),
							i = new lv(r, () => new xt()).pipe(nd());
						return this.componentLoaders.set(t, i), i;
					}
					loadChildren(t, r) {
						if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
						if (r._loadedRoutes) return B({ routes: r._loadedRoutes, injector: r._loadedInjector });
						this.onLoadStartListener && this.onLoadStartListener(r);
						const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
								se((a) => {
									this.onLoadEndListener && this.onLoadEndListener(r);
									let l, c;
									return (
										Array.isArray(a)
											? (c = a)
											: ((l = a.create(t).injector),
											  (c = l.get(Hi, [], k.Self | k.Optional).flat())),
										{ routes: c.map(Ad), injector: l }
									);
								}),
								zo(() => {
									this.childrenLoaders.delete(r);
								}),
							),
							s = new lv(o, () => new xt()).pipe(nd());
						return this.childrenLoaders.set(r, s), s;
					}
					loadModuleFactoryOrRoutes(t) {
						return er(t()).pipe(
							se(Xv),
							Ge((r) =>
								r instanceof sA || Array.isArray(r) ? B(r) : $e(this.compiler.compileModuleAsync(r)),
							),
						);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function Xv(e) {
				return (function wk(e) {
					return e && "object" == typeof e && "default" in e;
				})(e)
					? e.default
					: e;
			}
			let wl = (() => {
				class e {
					get hasRequestedNavigation() {
						return 0 !== this.navigationId;
					}
					constructor() {
						(this.currentNavigation = null),
							(this.lastSuccessfulNavigation = null),
							(this.events = new xt()),
							(this.configLoader = M(_d)),
							(this.environmentInjector = M(cn)),
							(this.urlSerializer = M(Xo)),
							(this.rootContexts = M(is)),
							(this.inputBindingEnabled = null !== M(ml, { optional: !0 })),
							(this.navigationId = 0),
							(this.afterPreactivation = () => B(void 0)),
							(this.rootComponentType = null),
							(this.configLoader.onLoadEndListener = (i) => this.events.next(new AF(i))),
							(this.configLoader.onLoadStartListener = (i) => this.events.next(new pF(i)));
					}
					complete() {
						this.transitions?.complete();
					}
					handleNavigationRequest(t) {
						const r = ++this.navigationId;
						this.transitions?.next({ ...this.transitions.value, ...t, id: r });
					}
					setupNavigations(t) {
						return (
							(this.transitions = new Rt({
								id: 0,
								currentUrlTree: t.currentUrlTree,
								currentRawUrl: t.currentUrlTree,
								extractedUrl: t.urlHandlingStrategy.extract(t.currentUrlTree),
								urlAfterRedirects: t.urlHandlingStrategy.extract(t.currentUrlTree),
								rawUrl: t.currentUrlTree,
								extras: {},
								resolve: null,
								reject: null,
								promise: Promise.resolve(!0),
								source: ns,
								restoredState: null,
								currentSnapshot: t.routerState.snapshot,
								targetSnapshot: null,
								currentRouterState: t.routerState,
								targetRouterState: null,
								guards: { canActivateChecks: [], canDeactivateChecks: [] },
								guardsResult: null,
							})),
							this.transitions.pipe(
								Fn((r) => 0 !== r.id),
								se((r) => ({ ...r, extractedUrl: t.urlHandlingStrategy.extract(r.rawUrl) })),
								Ut((r) => {
									let i = !1,
										o = !1;
									return B(r).pipe(
										ct((s) => {
											this.currentNavigation = {
												id: s.id,
												initialUrl: s.rawUrl,
												extractedUrl: s.extractedUrl,
												trigger: s.source,
												extras: s.extras,
												previousNavigation: this.lastSuccessfulNavigation
													? { ...this.lastSuccessfulNavigation, previousNavigation: null }
													: null,
											};
										}),
										Ut((s) => {
											const a = t.browserUrlTree.toString(),
												l =
													!t.navigated ||
													s.extractedUrl.toString() !== a ||
													a !== t.currentUrlTree.toString();
											if (
												!l &&
												"reload" !== (s.extras.onSameUrlNavigation ?? t.onSameUrlNavigation)
											) {
												const u = "";
												return (
													this.events.next(new rs(s.id, t.serializeUrl(r.rawUrl), u, 0)),
													(t.rawUrlTree = s.rawUrl),
													s.resolve(null),
													Jt
												);
											}
											if (t.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
												return (
													Jv(s.source) && (t.browserUrlTree = s.extractedUrl),
													B(s).pipe(
														Ut((u) => {
															const g = this.transitions?.getValue();
															return (
																this.events.next(
																	new cd(
																		u.id,
																		this.urlSerializer.serialize(u.extractedUrl),
																		u.source,
																		u.restoredState,
																	),
																),
																g !== this.transitions?.getValue()
																	? Jt
																	: Promise.resolve(u)
															);
														}),
														(function Ak(e, n, t, r, i, o) {
															return Ge((s) =>
																(function Ck(e, n, t, r, i, o, s = "emptyOnly") {
																	return new Ik(e, n, t, r, i, s, o).recognize();
																})(e, n, t, r, s.extractedUrl, i, o).pipe(
																	se(({ state: a, tree: l }) => ({
																		...s,
																		targetSnapshot: a,
																		urlAfterRedirects: l,
																	})),
																),
															);
														})(
															this.environmentInjector,
															this.configLoader,
															this.rootComponentType,
															t.config,
															this.urlSerializer,
															t.paramsInheritanceStrategy,
														),
														ct((u) => {
															if (
																((r.targetSnapshot = u.targetSnapshot),
																(r.urlAfterRedirects = u.urlAfterRedirects),
																(this.currentNavigation = {
																	...this.currentNavigation,
																	finalUrl: u.urlAfterRedirects,
																}),
																"eager" === t.urlUpdateStrategy)
															) {
																if (!u.extras.skipLocationChange) {
																	const d = t.urlHandlingStrategy.merge(
																		u.urlAfterRedirects,
																		u.rawUrl,
																	);
																	t.setBrowserUrl(d, u);
																}
																t.browserUrlTree = u.urlAfterRedirects;
															}
															const g = new dF(
																u.id,
																this.urlSerializer.serialize(u.extractedUrl),
																this.urlSerializer.serialize(u.urlAfterRedirects),
																u.targetSnapshot,
															);
															this.events.next(g);
														}),
													)
												);
											if (l && t.urlHandlingStrategy.shouldProcessUrl(t.rawUrlTree)) {
												const {
														id: u,
														extractedUrl: g,
														source: d,
														restoredState: f,
														extras: C,
													} = s,
													I = new cd(u, this.urlSerializer.serialize(g), d, f);
												this.events.next(I);
												const p = Rv(0, this.rootComponentType).snapshot;
												return B(
													(r = {
														...s,
														targetSnapshot: p,
														urlAfterRedirects: g,
														extras: { ...C, skipLocationChange: !1, replaceUrl: !1 },
													}),
												);
											}
											{
												const u = "";
												return (
													this.events.next(
														new rs(s.id, t.serializeUrl(r.extractedUrl), u, 1),
													),
													(t.rawUrlTree = s.rawUrl),
													s.resolve(null),
													Jt
												);
											}
										}),
										ct((s) => {
											const a = new fF(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
											);
											this.events.next(a);
										}),
										se(
											(s) =>
												(r = {
													...s,
													guards: kF(s.targetSnapshot, s.currentSnapshot, this.rootContexts),
												}),
										),
										(function KF(e, n) {
											return Ge((t) => {
												const {
													targetSnapshot: r,
													currentSnapshot: i,
													guards: { canActivateChecks: o, canDeactivateChecks: s },
												} = t;
												return 0 === s.length && 0 === o.length
													? B({ ...t, guardsResult: !0 })
													: (function ZF(e, n, t, r) {
															return $e(e).pipe(
																Ge((i) =>
																	(function tk(e, n, t, r, i) {
																		const o =
																			n && n.routeConfig
																				? n.routeConfig.canDeactivate
																				: null;
																		return o && 0 !== o.length
																			? B(
																					o.map((a) => {
																						const l = ss(n) ?? i,
																							c = Li(a, l);
																						return er(
																							(function WF(e) {
																								return (
																									e &&
																									cs(e.canDeactivate)
																								);
																							})(c)
																								? c.canDeactivate(
																										e,
																										n,
																										t,
																										r,
																								  )
																								: l.runInContext(() =>
																										c(e, n, t, r),
																								  ),
																						).pipe(Er());
																					}),
																			  ).pipe(Fi())
																			: B(!0);
																	})(i.component, i.route, t, n, r),
																),
																Er((i) => !0 !== i, !0),
															);
													  })(s, r, i, e).pipe(
															Ge((a) =>
																a &&
																(function UF(e) {
																	return "boolean" == typeof e;
																})(a)
																	? (function YF(e, n, t, r) {
																			return $e(n).pipe(
																				Si((i) =>
																					td(
																						(function XF(e, n) {
																							return (
																								null !== e &&
																									n &&
																									n(new mF(e)),
																								B(!0)
																							);
																						})(i.route.parent, r),
																						(function QF(e, n) {
																							return (
																								null !== e &&
																									n &&
																									n(new vF(e)),
																								B(!0)
																							);
																						})(i.route, r),
																						(function ek(e, n, t) {
																							const r = n[n.length - 1],
																								o = n
																									.slice(
																										0,
																										n.length - 1,
																									)
																									.reverse()
																									.map((s) =>
																										(function HF(
																											e,
																										) {
																											const n =
																												e.routeConfig
																													? e
																															.routeConfig
																															.canActivateChild
																													: null;
																											return n &&
																												0 !==
																													n.length
																												? {
																														node: e,
																														guards: n,
																												  }
																												: null;
																										})(s),
																									)
																									.filter(
																										(s) =>
																											null !== s,
																									)
																									.map((s) =>
																										av(() =>
																											B(
																												s.guards.map(
																													(
																														l,
																													) => {
																														const c =
																																ss(
																																	s.node,
																																) ??
																																t,
																															u =
																																Li(
																																	l,
																																	c,
																																);
																														return er(
																															(function zF(
																																e,
																															) {
																																return (
																																	e &&
																																	cs(
																																		e.canActivateChild,
																																	)
																																);
																															})(
																																u,
																															)
																																? u.canActivateChild(
																																		r,
																																		e,
																																  )
																																: c.runInContext(
																																		() =>
																																			u(
																																				r,
																																				e,
																																			),
																																  ),
																														).pipe(
																															Er(),
																														);
																													},
																												),
																											).pipe(
																												Fi(),
																											),
																										),
																									);
																							return B(o).pipe(Fi());
																						})(e, i.path, t),
																						(function JF(e, n, t) {
																							const r = n.routeConfig
																								? n.routeConfig
																										.canActivate
																								: null;
																							if (!r || 0 === r.length)
																								return B(!0);
																							const i = r.map((o) =>
																								av(() => {
																									const s =
																											ss(n) ?? t,
																										a = Li(o, s);
																									return er(
																										(function $F(
																											e,
																										) {
																											return (
																												e &&
																												cs(
																													e.canActivate,
																												)
																											);
																										})(a)
																											? a.canActivate(
																													n,
																													e,
																											  )
																											: s.runInContext(
																													() =>
																														a(
																															n,
																															e,
																														),
																											  ),
																									).pipe(Er());
																								}),
																							);
																							return B(i).pipe(Fi());
																						})(e, i.route, t),
																					),
																				),
																				Er((i) => !0 !== i, !0),
																			);
																	  })(r, o, e, n)
																	: B(a),
															),
															se((a) => ({ ...t, guardsResult: a })),
													  );
											});
										})(this.environmentInjector, (s) => this.events.next(s)),
										ct((s) => {
											if (((r.guardsResult = s.guardsResult), Tr(s.guardsResult)))
												throw kv(0, s.guardsResult);
											const a = new CF(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
												!!s.guardsResult,
											);
											this.events.next(a);
										}),
										Fn(
											(s) =>
												!!s.guardsResult ||
												(t.restoreHistory(s), this.cancelNavigationTransition(s, "", 3), !1),
										),
										vd((s) => {
											if (s.guards.canActivateChecks.length)
												return B(s).pipe(
													ct((a) => {
														const l = new IF(
															a.id,
															this.urlSerializer.serialize(a.extractedUrl),
															this.urlSerializer.serialize(a.urlAfterRedirects),
															a.targetSnapshot,
														);
														this.events.next(l);
													}),
													Ut((a) => {
														let l = !1;
														return B(a).pipe(
															(function mk(e, n) {
																return Ge((t) => {
																	const {
																		targetSnapshot: r,
																		guards: { canActivateChecks: i },
																	} = t;
																	if (!i.length) return B(t);
																	let o = 0;
																	return $e(i).pipe(
																		Si((s) =>
																			(function yk(e, n, t, r) {
																				const i = e.routeConfig,
																					o = e._resolve;
																				return (
																					void 0 !== i?.title &&
																						!Qv(i) &&
																						(o[Yo] = i.title),
																					(function vk(e, n, t, r) {
																						const i = (function _k(e) {
																							return [
																								...Object.keys(e),
																								...Object.getOwnPropertySymbols(
																									e,
																								),
																							];
																						})(e);
																						if (0 === i.length)
																							return B({});
																						const o = {};
																						return $e(i).pipe(
																							Ge((s) =>
																								(function Dk(
																									e,
																									n,
																									t,
																									r,
																								) {
																									const i =
																											ss(n) ?? r,
																										o = Li(e, i);
																									return er(
																										o.resolve
																											? o.resolve(
																													n,
																													t,
																											  )
																											: i.runInContext(
																													() =>
																														o(
																															n,
																															t,
																														),
																											  ),
																									);
																								})(e[s], n, t, r).pipe(
																									Er(),
																									ct((a) => {
																										o[s] = a;
																									}),
																								),
																							),
																							rd(1),
																							(function k2(e) {
																								return se(() => e);
																							})(o),
																							Sr((s) =>
																								$v(s) ? Jt : Zo(s),
																							),
																						);
																					})(o, e, n, r).pipe(
																						se(
																							(s) => (
																								(e._resolvedData = s),
																								(e.data = Pv(
																									e,
																									t,
																								).resolve),
																								i &&
																									Qv(i) &&
																									(e.data[Yo] =
																										i.title),
																								null
																							),
																						),
																					)
																				);
																			})(s.route, r, e, n),
																		),
																		ct(() => o++),
																		rd(1),
																		Ge((s) => (o === i.length ? B(t) : Jt)),
																	);
																});
															})(t.paramsInheritanceStrategy, this.environmentInjector),
															ct({
																next: () => (l = !0),
																complete: () => {
																	l ||
																		(t.restoreHistory(a),
																		this.cancelNavigationTransition(a, "", 2));
																},
															}),
														);
													}),
													ct((a) => {
														const l = new hF(
															a.id,
															this.urlSerializer.serialize(a.extractedUrl),
															this.urlSerializer.serialize(a.urlAfterRedirects),
															a.targetSnapshot,
														);
														this.events.next(l);
													}),
												);
										}),
										vd((s) => {
											const a = (l) => {
												const c = [];
												l.routeConfig?.loadComponent &&
													!l.routeConfig._loadedComponent &&
													c.push(
														this.configLoader.loadComponent(l.routeConfig).pipe(
															ct((u) => {
																l.component = u;
															}),
															se(() => {}),
														),
													);
												for (const u of l.children) c.push(...a(u));
												return c;
											};
											return ed(a(s.targetSnapshot.root)).pipe(ul(), xi(1));
										}),
										vd(() => this.afterPreactivation()),
										se((s) => {
											const a = (function bF(e, n, t) {
												const r = os(e, n._root, t ? t._root : void 0);
												return new xv(r, n);
											})(t.routeReuseStrategy, s.targetSnapshot, s.currentRouterState);
											return (r = { ...s, targetRouterState: a });
										}),
										ct((s) => {
											(t.currentUrlTree = s.urlAfterRedirects),
												(t.rawUrlTree = t.urlHandlingStrategy.merge(
													s.urlAfterRedirects,
													s.rawUrl,
												)),
												(t.routerState = s.targetRouterState),
												"deferred" === t.urlUpdateStrategy &&
													(s.extras.skipLocationChange || t.setBrowserUrl(t.rawUrlTree, s),
													(t.browserUrlTree = s.urlAfterRedirects));
										}),
										((e, n, t, r) =>
											se(
												(i) => (
													new FF(n, i.targetRouterState, i.currentRouterState, t, r).activate(
														e,
													),
													i
												),
											))(
											this.rootContexts,
											t.routeReuseStrategy,
											(s) => this.events.next(s),
											this.inputBindingEnabled,
										),
										xi(1),
										ct({
											next: (s) => {
												(i = !0),
													(this.lastSuccessfulNavigation = this.currentNavigation),
													(t.navigated = !0),
													this.events.next(
														new Mr(
															s.id,
															this.urlSerializer.serialize(s.extractedUrl),
															this.urlSerializer.serialize(t.currentUrlTree),
														),
													),
													t.titleStrategy?.updateTitle(s.targetRouterState.snapshot),
													s.resolve(!0);
											},
											complete: () => {
												i = !0;
											},
										}),
										zo(() => {
											i || o || this.cancelNavigationTransition(r, "", 1),
												this.currentNavigation?.id === r.id && (this.currentNavigation = null);
										}),
										Sr((s) => {
											if (((o = !0), Bv(s))) {
												Vv(s) || ((t.navigated = !0), t.restoreHistory(r, !0));
												const a = new pl(
													r.id,
													this.urlSerializer.serialize(r.extractedUrl),
													s.message,
													s.cancellationCode,
												);
												if ((this.events.next(a), Vv(s))) {
													const l = t.urlHandlingStrategy.merge(s.url, t.rawUrlTree),
														c = {
															skipLocationChange: r.extras.skipLocationChange,
															replaceUrl: "eager" === t.urlUpdateStrategy || Jv(r.source),
														};
													t.scheduleNavigation(l, ns, null, c, {
														resolve: r.resolve,
														reject: r.reject,
														promise: r.promise,
													});
												} else r.resolve(!1);
											} else {
												t.restoreHistory(r, !0);
												const a = new ud(
													r.id,
													this.urlSerializer.serialize(r.extractedUrl),
													s,
													r.targetSnapshot ?? void 0,
												);
												this.events.next(a);
												try {
													r.resolve(t.errorHandler(s));
												} catch (l) {
													r.reject(l);
												}
											}
											return Jt;
										}),
									);
								}),
							)
						);
					}
					cancelNavigationTransition(t, r, i) {
						const o = new pl(t.id, this.urlSerializer.serialize(t.extractedUrl), r, i);
						this.events.next(o), t.resolve(!1);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function Jv(e) {
				return e !== ns;
			}
			let e_ = (() => {
					class e {
						buildTitle(t) {
							let r,
								i = t.root;
							for (; void 0 !== i; )
								(r = this.getResolvedTitleForRoute(i) ?? r),
									(i = i.children.find((o) => o.outlet === q));
							return r;
						}
						getResolvedTitleForRoute(t) {
							return t.data[Yo];
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({
							token: e,
							factory: function () {
								return M(Ek);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				Ek = (() => {
					class e extends e_ {
						constructor(t) {
							super(), (this.title = t);
						}
						updateTitle(t) {
							const r = this.buildTitle(t);
							void 0 !== r && this.title.setTitle(r);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(O(yy));
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				Sk = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({
							token: e,
							factory: function () {
								return M(Tk);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			class bk {
				shouldDetach(n) {
					return !1;
				}
				store(n, t) {}
				shouldAttach(n) {
					return !1;
				}
				retrieve(n) {
					return null;
				}
				shouldReuseRoute(n, t) {
					return n.routeConfig === t.routeConfig;
				}
			}
			let Tk = (() => {
				class e extends bk {}
				return (
					(e.ɵfac = (function () {
						let n;
						return function (r) {
							return (n || (n = Wn(e)))(r || e);
						};
					})()),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const El = new R("", { providedIn: "root", factory: () => ({}) });
			let Mk = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({
							token: e,
							factory: function () {
								return M(Nk);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				Nk = (() => {
					class e {
						shouldProcessUrl(t) {
							return !0;
						}
						extract(t) {
							return t;
						}
						merge(t, r) {
							return t;
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			var Mt = (() => (
				((Mt = Mt || {})[(Mt.COMPLETE = 0)] = "COMPLETE"),
				(Mt[(Mt.FAILED = 1)] = "FAILED"),
				(Mt[(Mt.REDIRECTING = 2)] = "REDIRECTING"),
				Mt
			))();
			function t_(e, n) {
				e.events
					.pipe(
						Fn((t) => t instanceof Mr || t instanceof pl || t instanceof ud || t instanceof rs),
						se((t) =>
							t instanceof Mr || t instanceof rs
								? Mt.COMPLETE
								: t instanceof pl && (0 === t.code || 1 === t.code)
								? Mt.REDIRECTING
								: Mt.FAILED,
						),
						Fn((t) => t !== Mt.REDIRECTING),
						xi(1),
					)
					.subscribe(() => {
						n();
					});
			}
			function xk(e) {
				throw e;
			}
			function Rk(e, n, t) {
				return n.parse("/");
			}
			const Pk = { paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact" },
				Ok = { paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset" };
			let Vt = (() => {
					class e {
						get navigationId() {
							return this.navigationTransitions.navigationId;
						}
						get browserPageId() {
							if ("computed" === this.canceledNavigationResolution)
								return this.location.getState()?.ɵrouterPageId;
						}
						get events() {
							return this.navigationTransitions.events;
						}
						constructor() {
							(this.disposed = !1),
								(this.currentPageId = 0),
								(this.console = M(YA)),
								(this.isNgZoneEnabled = !1),
								(this.options = M(El, { optional: !0 }) || {}),
								(this.pendingTasks = M(Ha)),
								(this.errorHandler = this.options.errorHandler || xk),
								(this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || Rk),
								(this.navigated = !1),
								(this.lastSuccessfulId = -1),
								(this.urlHandlingStrategy = M(Mk)),
								(this.routeReuseStrategy = M(Sk)),
								(this.titleStrategy = M(e_)),
								(this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore"),
								(this.paramsInheritanceStrategy =
									this.options.paramsInheritanceStrategy || "emptyOnly"),
								(this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred"),
								(this.canceledNavigationResolution =
									this.options.canceledNavigationResolution || "replace"),
								(this.config = M(Hi, { optional: !0 })?.flat() ?? []),
								(this.navigationTransitions = M(wl)),
								(this.urlSerializer = M(Xo)),
								(this.location = M(_g)),
								(this.componentInputBindingEnabled = !!M(ml, { optional: !0 })),
								(this.isNgZoneEnabled = M(Ce) instanceof Ce && Ce.isInAngularZone()),
								this.resetConfig(this.config),
								(this.currentUrlTree = new Pi()),
								(this.rawUrlTree = this.currentUrlTree),
								(this.browserUrlTree = this.currentUrlTree),
								(this.routerState = Rv(0, null)),
								this.navigationTransitions.setupNavigations(this).subscribe(
									(t) => {
										(this.lastSuccessfulId = t.id), (this.currentPageId = this.browserPageId ?? 0);
									},
									(t) => {
										this.console.warn(`Unhandled Navigation Error: ${t}`);
									},
								);
						}
						resetRootComponentType(t) {
							(this.routerState.root.component = t), (this.navigationTransitions.rootComponentType = t);
						}
						initialNavigation() {
							if (
								(this.setUpLocationChangeListener(), !this.navigationTransitions.hasRequestedNavigation)
							) {
								const t = this.location.getState();
								this.navigateToSyncWithBrowser(this.location.path(!0), ns, t);
							}
						}
						setUpLocationChangeListener() {
							this.locationSubscription ||
								(this.locationSubscription = this.location.subscribe((t) => {
									const r = "popstate" === t.type ? "popstate" : "hashchange";
									"popstate" === r &&
										setTimeout(() => {
											this.navigateToSyncWithBrowser(t.url, r, t.state);
										}, 0);
								}));
						}
						navigateToSyncWithBrowser(t, r, i) {
							const o = { replaceUrl: !0 },
								s = i?.navigationId ? i : null;
							if (i) {
								const l = { ...i };
								delete l.navigationId,
									delete l.ɵrouterPageId,
									0 !== Object.keys(l).length && (o.state = l);
							}
							const a = this.parseUrl(t);
							this.scheduleNavigation(a, r, s, o);
						}
						get url() {
							return this.serializeUrl(this.currentUrlTree);
						}
						getCurrentNavigation() {
							return this.navigationTransitions.currentNavigation;
						}
						get lastSuccessfulNavigation() {
							return this.navigationTransitions.lastSuccessfulNavigation;
						}
						resetConfig(t) {
							(this.config = t.map(Ad)), (this.navigated = !1), (this.lastSuccessfulId = -1);
						}
						ngOnDestroy() {
							this.dispose();
						}
						dispose() {
							this.navigationTransitions.complete(),
								this.locationSubscription &&
									(this.locationSubscription.unsubscribe(), (this.locationSubscription = void 0)),
								(this.disposed = !0);
						}
						createUrlTree(t, r = {}) {
							const {
									relativeTo: i,
									queryParams: o,
									fragment: s,
									queryParamsHandling: a,
									preserveFragment: l,
								} = r,
								c = l ? this.currentUrlTree.fragment : s;
							let g,
								u = null;
							switch (a) {
								case "merge":
									u = { ...this.currentUrlTree.queryParams, ...o };
									break;
								case "preserve":
									u = this.currentUrlTree.queryParams;
									break;
								default:
									u = o || null;
							}
							null !== u && (u = this.removeEmptyProps(u));
							try {
								g = _v(i ? i.snapshot : this.routerState.snapshot.root);
							} catch {
								("string" != typeof t[0] || !t[0].startsWith("/")) && (t = []),
									(g = this.currentUrlTree.root);
							}
							return Dv(g, t, u, c ?? null);
						}
						navigateByUrl(t, r = { skipLocationChange: !1 }) {
							const i = Tr(t) ? t : this.parseUrl(t),
								o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
							return this.scheduleNavigation(o, ns, null, r);
						}
						navigate(t, r = { skipLocationChange: !1 }) {
							return (
								(function Lk(e) {
									for (let n = 0; n < e.length; n++) if (null == e[n]) throw new w(4008, !1);
								})(t),
								this.navigateByUrl(this.createUrlTree(t, r), r)
							);
						}
						serializeUrl(t) {
							return this.urlSerializer.serialize(t);
						}
						parseUrl(t) {
							let r;
							try {
								r = this.urlSerializer.parse(t);
							} catch (i) {
								r = this.malformedUriErrorHandler(i, this.urlSerializer, t);
							}
							return r;
						}
						isActive(t, r) {
							let i;
							if (((i = !0 === r ? { ...Pk } : !1 === r ? { ...Ok } : r), Tr(t)))
								return fv(this.currentUrlTree, t, i);
							const o = this.parseUrl(t);
							return fv(this.currentUrlTree, o, i);
						}
						removeEmptyProps(t) {
							return Object.keys(t).reduce((r, i) => {
								const o = t[i];
								return null != o && (r[i] = o), r;
							}, {});
						}
						scheduleNavigation(t, r, i, o, s) {
							if (this.disposed) return Promise.resolve(!1);
							let a, l, c;
							s
								? ((a = s.resolve), (l = s.reject), (c = s.promise))
								: (c = new Promise((g, d) => {
										(a = g), (l = d);
								  }));
							const u = this.pendingTasks.add();
							return (
								t_(this, () => {
									queueMicrotask(() => this.pendingTasks.remove(u));
								}),
								this.navigationTransitions.handleNavigationRequest({
									source: r,
									restoredState: i,
									currentUrlTree: this.currentUrlTree,
									currentRawUrl: this.currentUrlTree,
									rawUrl: t,
									extras: o,
									resolve: a,
									reject: l,
									promise: c,
									currentSnapshot: this.routerState.snapshot,
									currentRouterState: this.routerState,
								}),
								c.catch((g) => Promise.reject(g))
							);
						}
						setBrowserUrl(t, r) {
							const i = this.urlSerializer.serialize(t);
							if (this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl) {
								const s = {
									...r.extras.state,
									...this.generateNgRouterState(r.id, this.browserPageId),
								};
								this.location.replaceState(i, "", s);
							} else {
								const o = {
									...r.extras.state,
									...this.generateNgRouterState(r.id, (this.browserPageId ?? 0) + 1),
								};
								this.location.go(i, "", o);
							}
						}
						restoreHistory(t, r = !1) {
							if ("computed" === this.canceledNavigationResolution) {
								const o = this.currentPageId - (this.browserPageId ?? this.currentPageId);
								0 !== o
									? this.location.historyGo(o)
									: this.currentUrlTree === this.getCurrentNavigation()?.finalUrl &&
									  0 === o &&
									  (this.resetState(t),
									  (this.browserUrlTree = t.currentUrlTree),
									  this.resetUrlToCurrentUrlTree());
							} else
								"replace" === this.canceledNavigationResolution &&
									(r && this.resetState(t), this.resetUrlToCurrentUrlTree());
						}
						resetState(t) {
							(this.routerState = t.currentRouterState),
								(this.currentUrlTree = t.currentUrlTree),
								(this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, t.rawUrl));
						}
						resetUrlToCurrentUrlTree() {
							this.location.replaceState(
								this.urlSerializer.serialize(this.rawUrlTree),
								"",
								this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
							);
						}
						generateNgRouterState(t, r) {
							return "computed" === this.canceledNavigationResolution
								? { navigationId: t, ɵrouterPageId: r }
								: { navigationId: t };
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				us = (() => {
					class e {
						constructor(t, r, i, o, s, a) {
							(this.router = t),
								(this.route = r),
								(this.tabIndexAttribute = i),
								(this.renderer = o),
								(this.el = s),
								(this.locationStrategy = a),
								(this.href = null),
								(this.commands = null),
								(this.onChanges = new xt()),
								(this.preserveFragment = !1),
								(this.skipLocationChange = !1),
								(this.replaceUrl = !1);
							const l = s.nativeElement.tagName?.toLowerCase();
							(this.isAnchorElement = "a" === l || "area" === l),
								this.isAnchorElement
									? (this.subscription = t.events.subscribe((c) => {
											c instanceof Mr && this.updateHref();
									  }))
									: this.setTabIndexIfNotOnNativeEl("0");
						}
						setTabIndexIfNotOnNativeEl(t) {
							null != this.tabIndexAttribute ||
								this.isAnchorElement ||
								this.applyAttributeValue("tabindex", t);
						}
						ngOnChanges(t) {
							this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
						}
						set routerLink(t) {
							null != t
								? ((this.commands = Array.isArray(t) ? t : [t]), this.setTabIndexIfNotOnNativeEl("0"))
								: ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
						}
						onClick(t, r, i, o, s) {
							return (
								!!(
									null === this.urlTree ||
									(this.isAnchorElement &&
										(0 !== t ||
											r ||
											i ||
											o ||
											s ||
											("string" == typeof this.target && "_self" != this.target)))
								) ||
								(this.router.navigateByUrl(this.urlTree, {
									skipLocationChange: this.skipLocationChange,
									replaceUrl: this.replaceUrl,
									state: this.state,
								}),
								!this.isAnchorElement)
							);
						}
						ngOnDestroy() {
							this.subscription?.unsubscribe();
						}
						updateHref() {
							this.href =
								null !== this.urlTree && this.locationStrategy
									? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(this.urlTree))
									: null;
							const t =
								null === this.href
									? null
									: (function CI(e, n, t) {
											return (function yE(e, n) {
												return ("src" === n &&
													("embed" === e ||
														"frame" === e ||
														"iframe" === e ||
														"media" === e ||
														"script" === e)) ||
													("href" === n && ("base" === e || "link" === e))
													? fI
													: aa;
											})(
												n,
												t,
											)(e);
									  })(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
							this.applyAttributeValue("href", t);
						}
						applyAttributeValue(t, r) {
							const i = this.renderer,
								o = this.el.nativeElement;
							null !== r ? i.setAttribute(o, t, r) : i.removeAttribute(o, t);
						}
						get urlTree() {
							return null === this.commands
								? null
								: this.router.createUrlTree(this.commands, {
										relativeTo: void 0 !== this.relativeTo ? this.relativeTo : this.route,
										queryParams: this.queryParams,
										fragment: this.fragment,
										queryParamsHandling: this.queryParamsHandling,
										preserveFragment: this.preserveFragment,
								  });
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(
								S(Vt),
								S(tr),
								(function js(e) {
									return (function jw(e, n) {
										if ("class" === n) return e.classes;
										if ("style" === n) return e.styles;
										const t = e.attrs;
										if (t) {
											const r = t.length;
											let i = 0;
											for (; i < r; ) {
												const o = t[i];
												if (ff(o)) break;
												if (0 === o) i += 2;
												else if ("number" == typeof o)
													for (i++; i < r && "string" == typeof t[i]; ) i++;
												else {
													if (o === n) return t[i + 1];
													i += 2;
												}
											}
										}
										return null;
									})(Ke(), e);
								})("tabindex"),
								S(ei),
								S(Wt),
								S(_r),
							);
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "routerLink", ""]],
							hostVars: 1,
							hostBindings: function (t, r) {
								1 & t &&
									it("click", function (o) {
										return r.onClick(o.button, o.ctrlKey, o.shiftKey, o.altKey, o.metaKey);
									}),
									2 & t && We("target", r.target);
							},
							inputs: {
								target: "target",
								queryParams: "queryParams",
								fragment: "fragment",
								queryParamsHandling: "queryParamsHandling",
								state: "state",
								relativeTo: "relativeTo",
								preserveFragment: ["preserveFragment", "preserveFragment", Ag],
								skipLocationChange: ["skipLocationChange", "skipLocationChange", Ag],
								replaceUrl: ["replaceUrl", "replaceUrl", Ag],
								routerLink: "routerLink",
							},
							standalone: !0,
							features: [_h, _n],
						})),
						e
					);
				})(),
				Dd = (() => {
					class e {
						get isActive() {
							return this._isActive;
						}
						constructor(t, r, i, o, s) {
							(this.router = t),
								(this.element = r),
								(this.renderer = i),
								(this.cdr = o),
								(this.link = s),
								(this.classes = []),
								(this._isActive = !1),
								(this.routerLinkActiveOptions = { exact: !1 }),
								(this.isActiveChange = new re()),
								(this.routerEventsSubscription = t.events.subscribe((a) => {
									a instanceof Mr && this.update();
								}));
						}
						ngAfterContentInit() {
							B(this.links.changes, B(null))
								.pipe(Nr())
								.subscribe((t) => {
									this.update(), this.subscribeToEachLinkOnChanges();
								});
						}
						subscribeToEachLinkOnChanges() {
							this.linkInputChangesSubscription?.unsubscribe();
							const t = [...this.links.toArray(), this.link].filter((r) => !!r).map((r) => r.onChanges);
							this.linkInputChangesSubscription = $e(t)
								.pipe(Nr())
								.subscribe((r) => {
									this._isActive !== this.isLinkActive(this.router)(r) && this.update();
								});
						}
						set routerLinkActive(t) {
							const r = Array.isArray(t) ? t : t.split(" ");
							this.classes = r.filter((i) => !!i);
						}
						ngOnChanges(t) {
							this.update();
						}
						ngOnDestroy() {
							this.routerEventsSubscription.unsubscribe(),
								this.linkInputChangesSubscription?.unsubscribe();
						}
						update() {
							!this.links ||
								!this.router.navigated ||
								queueMicrotask(() => {
									const t = this.hasActiveLinks();
									this._isActive !== t &&
										((this._isActive = t),
										this.cdr.markForCheck(),
										this.classes.forEach((r) => {
											t
												? this.renderer.addClass(this.element.nativeElement, r)
												: this.renderer.removeClass(this.element.nativeElement, r);
										}),
										t && void 0 !== this.ariaCurrentWhenActive
											? this.renderer.setAttribute(
													this.element.nativeElement,
													"aria-current",
													this.ariaCurrentWhenActive.toString(),
											  )
											: this.renderer.removeAttribute(this.element.nativeElement, "aria-current"),
										this.isActiveChange.emit(t));
								});
						}
						isLinkActive(t) {
							const r = (function Fk(e) {
								return !!e.paths;
							})(this.routerLinkActiveOptions)
								? this.routerLinkActiveOptions
								: this.routerLinkActiveOptions.exact || !1;
							return (i) => !!i.urlTree && t.isActive(i.urlTree, r);
						}
						hasActiveLinks() {
							const t = this.isLinkActive(this.router);
							return (this.link && t(this.link)) || this.links.some(t);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Vt), S(Wt), S(ei), S(Ho), S(us, 8));
						}),
						(e.ɵdir = qe({
							type: e,
							selectors: [["", "routerLinkActive", ""]],
							contentQueries: function (t, r, i) {
								if ((1 & t && Zn(i, us, 5), 2 & t)) {
									let o;
									bt((o = Tt())) && (r.links = o);
								}
							},
							inputs: {
								routerLinkActiveOptions: "routerLinkActiveOptions",
								ariaCurrentWhenActive: "ariaCurrentWhenActive",
								routerLinkActive: "routerLinkActive",
							},
							outputs: { isActiveChange: "isActiveChange" },
							exportAs: ["routerLinkActive"],
							standalone: !0,
							features: [_n],
						})),
						e
					);
				})();
			class n_ {}
			let kk = (() => {
				class e {
					constructor(t, r, i, o, s) {
						(this.router = t), (this.injector = i), (this.preloadingStrategy = o), (this.loader = s);
					}
					setUpPreloading() {
						this.subscription = this.router.events
							.pipe(
								Fn((t) => t instanceof Mr),
								Si(() => this.preload()),
							)
							.subscribe(() => {});
					}
					preload() {
						return this.processRoutes(this.injector, this.router.config);
					}
					ngOnDestroy() {
						this.subscription && this.subscription.unsubscribe();
					}
					processRoutes(t, r) {
						const i = [];
						for (const o of r) {
							o.providers && !o._injector && (o._injector = Vu(o.providers, t, `Route: ${o.path}`));
							const s = o._injector ?? t,
								a = o._loadedInjector ?? s;
							((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
								(o.loadComponent && !o._loadedComponent)) &&
								i.push(this.preloadConfig(s, o)),
								(o.children || o._loadedRoutes) &&
									i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
						}
						return $e(i).pipe(Nr());
					}
					preloadConfig(t, r) {
						return this.preloadingStrategy.preload(r, () => {
							let i;
							i = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(t, r) : B(null);
							const o = i.pipe(
								Ge((s) =>
									null === s
										? B(void 0)
										: ((r._loadedRoutes = s.routes),
										  (r._loadedInjector = s.injector),
										  this.processRoutes(s.injector ?? t, s.routes)),
								),
							);
							return r.loadComponent && !r._loadedComponent
								? $e([o, this.loader.loadComponent(r)]).pipe(Nr())
								: o;
						});
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(Vt), O(QA), O(cn), O(n_), O(_d));
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const wd = new R("");
			let r_ = (() => {
				class e {
					constructor(t, r, i, o, s = {}) {
						(this.urlSerializer = t),
							(this.transitions = r),
							(this.viewportScroller = i),
							(this.zone = o),
							(this.options = s),
							(this.lastId = 0),
							(this.lastSource = "imperative"),
							(this.restoredId = 0),
							(this.store = {}),
							(s.scrollPositionRestoration = s.scrollPositionRestoration || "disabled"),
							(s.anchorScrolling = s.anchorScrolling || "disabled");
					}
					init() {
						"disabled" !== this.options.scrollPositionRestoration &&
							this.viewportScroller.setHistoryScrollRestoration("manual"),
							(this.routerEventsSubscription = this.createScrollEvents()),
							(this.scrollEventsSubscription = this.consumeScrollEvents());
					}
					createScrollEvents() {
						return this.transitions.events.subscribe((t) => {
							t instanceof cd
								? ((this.store[this.lastId] = this.viewportScroller.getScrollPosition()),
								  (this.lastSource = t.navigationTrigger),
								  (this.restoredId = t.restoredState ? t.restoredState.navigationId : 0))
								: t instanceof Mr
								? ((this.lastId = t.id),
								  this.scheduleScrollEvent(t, this.urlSerializer.parse(t.urlAfterRedirects).fragment))
								: t instanceof rs &&
								  0 === t.code &&
								  ((this.lastSource = void 0),
								  (this.restoredId = 0),
								  this.scheduleScrollEvent(t, this.urlSerializer.parse(t.url).fragment));
						});
					}
					consumeScrollEvents() {
						return this.transitions.events.subscribe((t) => {
							t instanceof Mv &&
								(t.position
									? "top" === this.options.scrollPositionRestoration
										? this.viewportScroller.scrollToPosition([0, 0])
										: "enabled" === this.options.scrollPositionRestoration &&
										  this.viewportScroller.scrollToPosition(t.position)
									: t.anchor && "enabled" === this.options.anchorScrolling
									? this.viewportScroller.scrollToAnchor(t.anchor)
									: "disabled" !== this.options.scrollPositionRestoration &&
									  this.viewportScroller.scrollToPosition([0, 0]));
						});
					}
					scheduleScrollEvent(t, r) {
						this.zone.runOutsideAngular(() => {
							setTimeout(() => {
								this.zone.run(() => {
									this.transitions.events.next(
										new Mv(
											t,
											"popstate" === this.lastSource ? this.store[this.restoredId] : null,
											r,
										),
									);
								});
							}, 0);
						});
					}
					ngOnDestroy() {
						this.routerEventsSubscription?.unsubscribe(), this.scrollEventsSubscription?.unsubscribe();
					}
				}
				return (
					(e.ɵfac = function (t) {
						!(function YI() {
							throw new Error("invalid");
						})();
					}),
					(e.ɵprov = L({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function Hn(e, n) {
				return { ɵkind: e, ɵproviders: n };
			}
			function o_() {
				const e = M(Tn);
				return (n) => {
					const t = e.get(yi);
					if (n !== t.components[0]) return;
					const r = e.get(Vt),
						i = e.get(s_);
					1 === e.get(Ed) && r.initialNavigation(),
						e.get(a_, null, k.Optional)?.setUpPreloading(),
						e.get(wd, null, k.Optional)?.init(),
						r.resetRootComponentType(t.componentTypes[0]),
						i.closed || (i.next(), i.complete(), i.unsubscribe());
				};
			}
			const s_ = new R("", { factory: () => new xt() }),
				Ed = new R("", { providedIn: "root", factory: () => 1 }),
				a_ = new R("");
			function Uk(e) {
				return Hn(0, [
					{ provide: a_, useExisting: kk },
					{ provide: n_, useExisting: e },
				]);
			}
			const l_ = new R("ROUTER_FORROOT_GUARD"),
				$k = [
					_g,
					{ provide: Xo, useClass: id },
					Vt,
					is,
					{
						provide: tr,
						useFactory: function i_(e) {
							return e.routerState.root;
						},
						deps: [Vt],
					},
					_d,
					[],
				];
			function zk() {
				return new lm("Router", Vt);
			}
			let c_ = (() => {
				class e {
					constructor(t) {}
					static forRoot(t, r) {
						return {
							ngModule: e,
							providers: [
								$k,
								[],
								{ provide: Hi, multi: !0, useValue: t },
								{ provide: l_, useFactory: Kk, deps: [[Vt, new Ws(), new Gs()]] },
								{ provide: El, useValue: r || {} },
								r?.useHash ? { provide: _r, useClass: xN } : { provide: _r, useClass: Fm },
								{
									provide: wd,
									useFactory: () => {
										const e = M(Kx),
											n = M(Ce),
											t = M(El),
											r = M(wl),
											i = M(Xo);
										return t.scrollOffset && e.setOffset(t.scrollOffset), new r_(i, r, e, n, t);
									},
								},
								r?.preloadingStrategy ? Uk(r.preloadingStrategy).ɵproviders : [],
								{ provide: lm, multi: !0, useFactory: zk },
								r?.initialNavigation ? Zk(r) : [],
								r?.bindToComponentInputs
									? Hn(8, [Fv, { provide: ml, useExisting: Fv }]).ɵproviders
									: [],
								[
									{ provide: u_, useFactory: o_ },
									{ provide: ug, multi: !0, useExisting: u_ },
								],
							],
						};
					}
					static forChild(t) {
						return { ngModule: e, providers: [{ provide: Hi, multi: !0, useValue: t }] };
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(O(l_, 8));
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = tt({})),
					e
				);
			})();
			function Kk(e) {
				return "guarded";
			}
			function Zk(e) {
				return [
					"disabled" === e.initialNavigation
						? Hn(3, [
								{
									provide: ng,
									multi: !0,
									useFactory: () => {
										const n = M(Vt);
										return () => {
											n.setUpLocationChangeListener();
										};
									},
								},
								{ provide: Ed, useValue: 2 },
						  ]).ɵproviders
						: [],
					"enabledBlocking" === e.initialNavigation
						? Hn(2, [
								{ provide: Ed, useValue: 0 },
								{
									provide: ng,
									multi: !0,
									deps: [Tn],
									useFactory: (n) => {
										const t = n.get(MN, Promise.resolve());
										return () =>
											t.then(
												() =>
													new Promise((r) => {
														const i = n.get(Vt),
															o = n.get(s_);
														t_(i, () => {
															r(!0);
														}),
															(n.get(wl).afterPreactivation = () => (
																r(!0), o.closed ? B(void 0) : o
															)),
															i.initialNavigation();
													}),
											);
									},
								},
						  ]).ɵproviders
						: [],
				];
			}
			const u_ = new R("");
			let Qk = (() => {
					class e {
						constructor(t) {
							(this.apiService = t), (this.breedTree = []), (this.routerLink = "");
						}
						ngOnInit() {
							this.prepareAllDogs();
						}
						prepareAllDogs() {
							this.apiService.getAllDogs().subscribe({
								next: (t) => {
									this.breedTree = this.convertListToTree(t);
								},
								error: (t) => {
									console.error("Error fetching dogs list:", t);
								},
							});
						}
						convertListToTree(t) {
							let r = [];
							for (let i in t.message)
								if (t.message[i].length > 0) {
									let o = { label: i, children: [] };
									t.message[i].forEach((s) => {
										o.children.push({ label: s });
									}),
										r.push(o);
								} else {
									let o = { label: "" };
									(o.label = i), r.push(o);
								}
							return r;
						}
						onNodeSelect(t) {
							this.routerLink =
								void 0 === t.node.parent
									? "/dogs/breed/" + t.node.label
									: "/dogs/breed/" + t.node.parent.label + "/" + t.node.label;
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(S(Jg));
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["app-dog-list"]],
							decls: 5,
							vars: 2,
							consts: [
								[
									"selectionMode",
									"single",
									"routerLinkActive",
									"active",
									"ariaCurrentWhenActive",
									"page",
									1,
									"tree",
									3,
									"value",
									"routerLink",
									"onNodeSelect",
								],
							],
							template: function (t, r) {
								1 & t &&
									(K(0, "br")(1, "br"),
									N(2, "h1"),
									Ft(3, "Dogs (breeds) list"),
									x(),
									N(4, "p-tree", 0),
									it("onNodeSelect", function (o) {
										return r.onNodeSelect(o);
									}),
									x()),
									2 & t && (m(4), hr("routerLink", r.routerLink), A("value", r.breedTree));
							},
							dependencies: [us, Dd, ov],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center;color:#09f}"],
						})),
						e
					);
				})(),
				Sd = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["app-all-dogs-button"]],
							decls: 3,
							vars: 0,
							consts: [
								["routerLink", "/dogs", "routerLinkActive", "active", "ariaCurrentWhenActive", "page"],
							],
							template: function (t, r) {
								1 & t && (N(0, "a", 0)(1, "p-button"), Ft(2, "All dogs"), x()());
							},
							dependencies: [us, Dd, WP],
						})),
						e
					);
				})();
			const Xk = [
				{ path: "", redirectTo: "dogs", pathMatch: "full" },
				{ path: "dogs", component: Qk },
				{
					path: "dogs/breed/:breedName",
					component: (() => {
						class e {
							constructor(t, r) {
								(this.apiService = t),
									(this.activatedRoute = r),
									(this.breedName = ""),
									(this.imageURL = ""),
									(this.cardWidth = 0),
									(this.cardHeight = 0),
									(this.subBreedList = []),
									(this.isVisible = !0);
							}
							ngOnInit() {
								this.prepareNamesFromURL();
							}
							prepareNamesFromURL() {
								this.activatedRoute.paramMap.subscribe((t) => {
									this.breedName = t.get("breedName");
								}),
									this.prepareBreed(),
									this.prepareSubBreedList();
							}
							prepareBreed() {
								this.apiService.getBreedImages(this.breedName).subscribe({
									next: (t) => {
										(this.imageURL = t.message[0]), this.getImageSize();
									},
									error: (t) => {
										console.error("Error fetching dogs:", t),
											(this.breedName = this.breedName + " breed doesn't exist!"),
											(this.isVisible = !1);
									},
								});
							}
							prepareSubBreedList() {
								this.apiService.getSubBreedList(this.breedName).subscribe({
									next: (t) => {
										this.subBreedList = t.message;
									},
									error: (t) => {
										console.error("Error fetching dog sub-breed:", t);
									},
								});
							}
							getImageSize() {
								let t = new Image();
								(t.src = this.imageURL),
									(t.onload = () => {
										(this.cardWidth = t.width + 100),
											(this.cardHeight = t.height + 100),
											console.log(
												`The image is ${t.width} pixels wide and ${t.height} pixels tall.`,
											);
									});
							}
						}
						return (
							(e.ɵfac = function (t) {
								return new (t || e)(S(Jg), S(tr));
							}),
							(e.ɵcmp = ye({
								type: e,
								selectors: [["app-breed"]],
								decls: 4,
								vars: 6,
								consts: [
									[3, "header"],
									[3, "src"],
								],
								template: function (t, r) {
									1 & t &&
										(N(0, "p-card", 0), K(1, "img", 1)(2, "br")(3, "app-all-dogs-button"), x()),
										2 & t &&
											(Ar("width", r.cardWidth, "px")("height", r.cardHeight, "px"),
											hr("header", r.breedName),
											m(1),
											hr("src", r.imageURL, aa));
								},
								dependencies: [Ky, Sd],
							})),
							e
						);
					})(),
				},
				{
					path: "dogs/breed/:breedName/:subBreedName",
					component: (() => {
						class e {
							constructor(t, r) {
								(this.apiService = t),
									(this.activatedRoute = r),
									(this.breedName = ""),
									(this.subBreedName = ""),
									(this.imageURL = "");
							}
							ngOnInit() {
								this.prepareNamesFromURL(), this.prepareSubBreed();
							}
							prepareNamesFromURL() {
								this.activatedRoute.paramMap.subscribe((t) => {
									(this.breedName = t.get("breedName")), (this.subBreedName = t.get("subBreedName"));
								});
							}
							prepareSubBreed() {
								this.apiService.getSubBreedImages(this.breedName, this.subBreedName).subscribe({
									next: (t) => {
										this.imageURL = t.message[1];
									},
									error: (t) => {
										console.error("Error fetching dogs:", t),
											(this.subBreedName = this.subBreedName + " sub breed doesn't exist!");
									},
								});
							}
						}
						return (
							(e.ɵfac = function (t) {
								return new (t || e)(S(Jg), S(tr));
							}),
							(e.ɵcmp = ye({
								type: e,
								selectors: [["app-sub-breed"]],
								decls: 4,
								vars: 2,
								consts: [
									[3, "header"],
									[3, "src"],
								],
								template: function (t, r) {
									1 & t &&
										(N(0, "p-card", 0), K(1, "img", 1)(2, "br")(3, "app-all-dogs-button"), x()),
										2 & t && (hr("header", r.subBreedName), m(1), hr("src", r.imageURL, aa));
								},
								dependencies: [Ky, Sd],
							})),
							e
						);
					})(),
				},
				{
					path: "error",
					component: (() => {
						class e {}
						return (
							(e.ɵfac = function (t) {
								return new (t || e)();
							}),
							(e.ɵcmp = ye({
								type: e,
								selectors: [["app-error"]],
								decls: 3,
								vars: 0,
								template: function (t, r) {
									1 & t && (N(0, "h1"), Ft(1, "404 Not found"), x(), K(2, "app-all-dogs-button"));
								},
								dependencies: [Sd],
								styles: ["h1[_ngcontent-%COMP%]{font-size:30px}"],
							})),
							e
						);
					})(),
				},
				{ path: "**", redirectTo: "/error" },
			];
			let Jk = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = tt({ imports: [c_.forRoot(Xk), c_] })),
						e
					);
				})(),
				e3 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = ye({
							type: e,
							selectors: [["app-root"]],
							decls: 1,
							vars: 0,
							template: function (t, r) {
								1 & t && K(0, "router-outlet");
							},
							dependencies: [hd],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center}"],
						})),
						e
					);
				})(),
				t3 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e, bootstrap: [e3] })),
						(e.ɵinj = tt({ imports: [UR, Jk, pP, GP, iO, A2] })),
						e
					);
				})();
			VR()
				.bootstrapModule(t3)
				.catch((e) => console.error(e));
		},
	},
	(ue) => {
		ue((ue.s = 613));
	},
]);
