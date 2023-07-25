"use strict";
(self.webpackChunkdogs = self.webpackChunkdogs || []).push([
	[179],
	{
		942: () => {
			function ge(e) {
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
						if (ge(r))
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
									Nd(o);
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
						if (this.closed) Nd(n);
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
			const Td = Nt.EMPTY;
			function Md(e) {
				return e instanceof Nt || (e && "closed" in e && ge(e.remove) && ge(e.add) && ge(e.unsubscribe));
			}
			function Nd(e) {
				ge(e) ? e() : e.unsubscribe();
			}
			const rr = {
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
			function Pd(e) {
				ds.setTimeout(() => {
					const { onUnhandledError: n } = rr;
					if (!n) throw e;
					n(e);
				});
			}
			function Rd() {}
			const gv = bl("C", void 0, void 0);
			function bl(e, n, t) {
				return { kind: e, value: n, error: t };
			}
			let ir = null;
			function fs(e) {
				if (rr.useDeprecatedSynchronousErrorHandling) {
					const n = !ir;
					if ((n && (ir = { errorThrown: !1, error: null }), e(), n)) {
						const { errorThrown: t, error: r } = ir;
						if (((ir = null), t)) throw r;
					}
				} else e();
			}
			class Tl extends Nt {
				constructor(n) {
					super(),
						(this.isStopped = !1),
						n ? ((this.destination = n), Md(n) && n.add(this)) : (this.destination = Av);
				}
				static create(n, t, r) {
					return new Ui(n, t, r);
				}
				next(n) {
					this.isStopped
						? Nl(
								(function fv(e) {
									return bl("N", e, void 0);
								})(n),
								this,
						  )
						: this._next(n);
				}
				error(n) {
					this.isStopped
						? Nl(
								(function dv(e) {
									return bl("E", void 0, e);
								})(n),
								this,
						  )
						: ((this.isStopped = !0), this._error(n));
				}
				complete() {
					this.isStopped ? Nl(gv, this) : ((this.isStopped = !0), this._complete());
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
			const Iv = Function.prototype.bind;
			function Ml(e, n) {
				return Iv.call(e, n);
			}
			class hv {
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
					if ((super(), ge(n) || !n)) i = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
					else {
						let o;
						this && rr.useDeprecatedNextContext
							? ((o = Object.create(n)),
							  (o.unsubscribe = () => this.unsubscribe()),
							  (i = {
									next: n.next && Ml(n.next, o),
									error: n.error && Ml(n.error, o),
									complete: n.complete && Ml(n.complete, o),
							  }))
							: (i = n);
					}
					this.destination = new hv(i);
				}
			}
			function Cs(e) {
				rr.useDeprecatedSynchronousErrorHandling
					? (function Cv(e) {
							rr.useDeprecatedSynchronousErrorHandling && ir && ((ir.errorThrown = !0), (ir.error = e));
					  })(e)
					: Pd(e);
			}
			function Nl(e, n) {
				const { onStoppedNotification: t } = rr;
				t && ds.setTimeout(() => t(e, n));
			}
			const Av = {
					closed: !0,
					next: Rd,
					error: function pv(e) {
						throw e;
					},
					complete: Rd,
				},
				Pl = ("function" == typeof Symbol && Symbol.observable) || "@@observable";
			function Un(e) {
				return e;
			}
			function xd(e) {
				return 0 === e.length
					? Un
					: 1 === e.length
					? e[0]
					: function (t) {
							return e.reduce((r, i) => i(r), t);
					  };
			}
			let Re = (() => {
				class e {
					constructor(t) {
						t && (this._subscribe = t);
					}
					lift(t) {
						const r = new e();
						return (r.source = this), (r.operator = t), r;
					}
					subscribe(t, r, i) {
						const o = (function _v(e) {
							return (
								(e && e instanceof Tl) ||
								((function yv(e) {
									return e && ge(e.next) && ge(e.error) && ge(e.complete);
								})(e) &&
									Md(e))
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
						return new (r = Od(r))((i, o) => {
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
					[Pl]() {
						return this;
					}
					pipe(...t) {
						return xd(t)(this);
					}
					toPromise(t) {
						return new (t = Od(t))((r, i) => {
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
			function Od(e) {
				var n;
				return null !== (n = e ?? rr.Promise) && void 0 !== n ? n : Promise;
			}
			const vv = Vi(
				(e) =>
					function () {
						e(this), (this.name = "ObjectUnsubscribedError"), (this.message = "object unsubscribed");
					},
			);
			let Pt = (() => {
				class e extends Re {
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
						const r = new Ld(this, this);
						return (r.operator = t), r;
					}
					_throwIfClosed() {
						if (this.closed) throw new vv();
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
							? Td
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
						const t = new Re();
						return (t.source = this), t;
					}
				}
				return (e.create = (n, t) => new Ld(n, t)), e;
			})();
			class Ld extends Pt {
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
						: Td;
				}
			}
			class Rt extends Pt {
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
			function Fd(e) {
				return ge(e?.lift);
			}
			function $e(e) {
				return (n) => {
					if (Fd(n))
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
			function ze(e, n, t, r, i) {
				return new Dv(e, n, t, r, i);
			}
			class Dv extends Tl {
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
			function ae(e, n) {
				return $e((t, r) => {
					let i = 0;
					t.subscribe(
						ze(r, (o) => {
							r.next(e.call(n, o, i++));
						}),
					);
				});
			}
			function jn(e) {
				return this instanceof jn ? ((this.v = e), this) : new jn(e);
			}
			function Bd(e) {
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
			const Ud = (e) => e && "number" == typeof e.length && "function" != typeof e;
			function jd(e) {
				return ge(e?.then);
			}
			function $d(e) {
				return ge(e[Pl]);
			}
			function zd(e) {
				return Symbol.asyncIterator && ge(e?.[Symbol.asyncIterator]);
			}
			function Wd(e) {
				return new TypeError(
					`You provided ${
						null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
					} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
				);
			}
			const Gd = (function Wv() {
				return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
			})();
			function qd(e) {
				return ge(e?.[Gd]);
			}
			function Kd(e) {
				return (function Vd(e, n, t) {
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
					function s(f) {
						r[f] &&
							(i[f] = function (C) {
								return new Promise(function (I, h) {
									o.push([f, C, I, h]) > 1 || a(f, C);
								});
							});
					}
					function a(f, C) {
						try {
							!(function l(f) {
								f.value instanceof jn ? Promise.resolve(f.value.v).then(c, u) : g(o[0][2], f);
							})(r[f](C));
						} catch (I) {
							g(o[0][3], I);
						}
					}
					function c(f) {
						a("next", f);
					}
					function u(f) {
						a("throw", f);
					}
					function g(f, C) {
						f(C), o.shift(), o.length && a(o[0][0], o[0][1]);
					}
				})(this, arguments, function* () {
					const t = e.getReader();
					try {
						for (;;) {
							const { value: r, done: i } = yield jn(t.read());
							if (i) return yield jn(void 0);
							yield yield jn(r);
						}
					} finally {
						t.releaseLock();
					}
				});
			}
			function Zd(e) {
				return ge(e?.getReader);
			}
			function Bt(e) {
				if (e instanceof Re) return e;
				if (null != e) {
					if ($d(e))
						return (function Gv(e) {
							return new Re((n) => {
								const t = e[Pl]();
								if (ge(t.subscribe)) return t.subscribe(n);
								throw new TypeError("Provided object does not correctly implement Symbol.observable");
							});
						})(e);
					if (Ud(e))
						return (function qv(e) {
							return new Re((n) => {
								for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
								n.complete();
							});
						})(e);
					if (jd(e))
						return (function Kv(e) {
							return new Re((n) => {
								e.then(
									(t) => {
										n.closed || (n.next(t), n.complete());
									},
									(t) => n.error(t),
								).then(null, Pd);
							});
						})(e);
					if (zd(e)) return Yd(e);
					if (qd(e))
						return (function Zv(e) {
							return new Re((n) => {
								for (const t of e) if ((n.next(t), n.closed)) return;
								n.complete();
							});
						})(e);
					if (Zd(e))
						return (function Yv(e) {
							return Yd(Kd(e));
						})(e);
				}
				throw Wd(e);
			}
			function Yd(e) {
				return new Re((n) => {
					(function Qv(e, n) {
						var t, r, i, o;
						return (function kd(e, n, t, r) {
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
								for (t = Bd(e); !(r = yield t.next()).done; ) if ((n.next(r.value), n.closed)) return;
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
			function mn(e, n, t, r = 0, i = !1) {
				const o = n.schedule(function () {
					t(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
				}, r);
				if ((e.add(o), !i)) return o;
			}
			function qe(e, n, t = 1 / 0) {
				return ge(n)
					? qe((r, i) => ae((o, s) => n(r, o, i, s))(Bt(e(r, i))), t)
					: ("number" == typeof n && (t = n),
					  $e((r, i) =>
							(function Xv(e, n, t, r, i, o, s, a) {
								const l = [];
								let c = 0,
									u = 0,
									g = !1;
								const f = () => {
										g && !l.length && !c && n.complete();
									},
									C = (h) => (c < r ? I(h) : l.push(h)),
									I = (h) => {
										o && n.next(h), c++;
										let m = !1;
										Bt(t(h, u++)).subscribe(
											ze(
												n,
												(v) => {
													i?.(v), o ? C(v) : n.next(v);
												},
												() => {
													m = !0;
												},
												void 0,
												() => {
													if (m)
														try {
															for (c--; l.length && c < r; ) {
																const v = l.shift();
																s ? mn(n, s, () => I(v)) : I(v);
															}
															f();
														} catch (v) {
															n.error(v);
														}
												},
											),
										);
									};
								return (
									e.subscribe(
										ze(n, C, () => {
											(g = !0), f();
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
				return qe(Un, e);
			}
			const Jt = new Re((e) => e.complete());
			function Fl(e) {
				return e[e.length - 1];
			}
			function ji(e) {
				return (function eD(e) {
					return e && ge(e.schedule);
				})(Fl(e))
					? e.pop()
					: void 0;
			}
			function Qd(e, n = 0) {
				return $e((t, r) => {
					t.subscribe(
						ze(
							r,
							(i) => mn(r, e, () => r.next(i), n),
							() => mn(r, e, () => r.complete(), n),
							(i) => mn(r, e, () => r.error(i), n),
						),
					);
				});
			}
			function Xd(e, n = 0) {
				return $e((t, r) => {
					r.add(e.schedule(() => t.subscribe(r), n));
				});
			}
			function Jd(e, n) {
				if (!e) throw new Error("Iterable cannot be null");
				return new Re((t) => {
					mn(t, n, () => {
						const r = e[Symbol.asyncIterator]();
						mn(
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
			function We(e, n) {
				return n
					? (function lD(e, n) {
							if (null != e) {
								if ($d(e))
									return (function rD(e, n) {
										return Bt(e).pipe(Xd(n), Qd(n));
									})(e, n);
								if (Ud(e))
									return (function oD(e, n) {
										return new Re((t) => {
											let r = 0;
											return n.schedule(function () {
												r === e.length
													? t.complete()
													: (t.next(e[r++]), t.closed || this.schedule());
											});
										});
									})(e, n);
								if (jd(e))
									return (function iD(e, n) {
										return Bt(e).pipe(Xd(n), Qd(n));
									})(e, n);
								if (zd(e)) return Jd(e, n);
								if (qd(e))
									return (function sD(e, n) {
										return new Re((t) => {
											let r;
											return (
												mn(t, n, () => {
													(r = e[Gd]()),
														mn(
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
												() => ge(r?.return) && r.return()
											);
										});
									})(e, n);
								if (Zd(e))
									return (function aD(e, n) {
										return Jd(Kd(e), n);
									})(e, n);
							}
							throw Wd(e);
					  })(e, n)
					: Bt(e);
			}
			function U(...e) {
				return We(e, ji(e));
			}
			function ef(e = {}) {
				const {
					connector: n = () => new Pt(),
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
					const f = () => {
							a?.unsubscribe(), (a = void 0);
						},
						C = () => {
							f(), (s = l = void 0), (u = g = !1);
						},
						I = () => {
							const h = s;
							C(), h?.unsubscribe();
						};
					return $e((h, m) => {
						c++, !g && !u && f();
						const v = (l = l ?? n());
						m.add(() => {
							c--, 0 === c && !g && !u && (a = kl(I, i));
						}),
							v.subscribe(m),
							!s &&
								c > 0 &&
								((s = new Ui({
									next: (A) => v.next(A),
									error: (A) => {
										(g = !0), f(), (a = kl(C, t, A)), v.error(A);
									},
									complete: () => {
										(u = !0), f(), (a = kl(C, r)), v.complete();
									},
								})),
								Bt(h).subscribe(s));
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
				return $e((t, r) => {
					let i = null,
						o = 0,
						s = !1;
					const a = () => s && !i && r.complete();
					t.subscribe(
						ze(
							r,
							(l) => {
								i?.unsubscribe();
								let c = 0;
								const u = o++;
								Bt(e(l, u)).subscribe(
									(i = ze(
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
			function ce(e) {
				for (let n in e) if (e[n] === ce) return n;
				throw Error("Could not find renamed property on target object.");
			}
			function Is(e, n) {
				for (const t in n) n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
			}
			function He(e) {
				if ("string" == typeof e) return e;
				if (Array.isArray(e)) return "[" + e.map(He).join(", ") + "]";
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
			const dD = ce({ __forward_ref__: ce });
			function hs(e) {
				return (
					(e.__forward_ref__ = hs),
					(e.toString = function () {
						return He(this());
					}),
					e
				);
			}
			function $(e) {
				return Vl(e) ? e() : e;
			}
			function Vl(e) {
				return "function" == typeof e && e.hasOwnProperty(dD) && e.__forward_ref__ === hs;
			}
			function Bl(e) {
				return e && !!e.ɵproviders;
			}
			const tf = "https://g.co/ng/security#xss";
			class E extends Error {
				constructor(n, t) {
					super(
						(function ps(e, n) {
							return `NG0${Math.abs(e)}${n ? ": " + n : ""}`;
						})(n, t),
					),
						(this.code = n);
				}
			}
			function z(e) {
				return "string" == typeof e ? e : null == e ? "" : String(e);
			}
			function As(e, n) {
				throw new E(-201, !1);
			}
			function xt(e, n) {
				null == e &&
					(function oe(e, n, t, r) {
						throw new Error(
							`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`),
						);
					})(n, e, null, "!=");
			}
			function F(e) {
				return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
			}
			function nt(e) {
				return { providers: e.providers || [], imports: e.imports || [] };
			}
			function ms(e) {
				return nf(e, ys) || nf(e, sf);
			}
			function nf(e, n) {
				return e.hasOwnProperty(n) ? e[n] : null;
			}
			function rf(e) {
				return e && (e.hasOwnProperty(Ul) || e.hasOwnProperty(yD)) ? e[Ul] : null;
			}
			const ys = ce({ ɵprov: ce }),
				Ul = ce({ ɵinj: ce }),
				sf = ce({ ngInjectableDef: ce }),
				yD = ce({ ngInjectorDef: ce });
			var H = (() => (
				((H = H || {})[(H.Default = 0)] = "Default"),
				(H[(H.Host = 1)] = "Host"),
				(H[(H.Self = 2)] = "Self"),
				(H[(H.SkipSelf = 4)] = "SkipSelf"),
				(H[(H.Optional = 8)] = "Optional"),
				H
			))();
			let jl;
			function ut(e) {
				const n = jl;
				return (jl = e), n;
			}
			function lf(e, n, t) {
				const r = ms(e);
				return r && "root" == r.providedIn
					? void 0 === r.value
						? (r.value = r.factory())
						: r.value
					: t & H.Optional
					? null
					: void 0 !== n
					? n
					: void As(He(e));
			}
			const de = (() =>
					(typeof globalThis < "u" && globalThis) ||
					(typeof global < "u" && global) ||
					(typeof window < "u" && window) ||
					(typeof self < "u" &&
						typeof WorkerGlobalScope < "u" &&
						self instanceof WorkerGlobalScope &&
						self))(),
				$i = {},
				$l = "__NG_DI_FLAG__",
				_s = "ngTempTokenPath",
				vD = /\n/gm,
				cf = "__source";
			let Pr;
			function $n(e) {
				const n = Pr;
				return (Pr = e), n;
			}
			function ED(e, n = H.Default) {
				if (void 0 === Pr) throw new E(-203, !1);
				return null === Pr ? lf(e, void 0, n) : Pr.get(e, n & H.Optional ? null : void 0, n);
			}
			function L(e, n = H.Default) {
				return (
					(function af() {
						return jl;
					})() || ED
				)($(e), n);
			}
			function P(e, n = H.Default) {
				return L(e, vs(n));
			}
			function vs(e) {
				return typeof e > "u" || "number" == typeof e
					? e
					: 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
			}
			function zl(e) {
				const n = [];
				for (let t = 0; t < e.length; t++) {
					const r = $(e[t]);
					if (Array.isArray(r)) {
						if (0 === r.length) throw new E(900, !1);
						let i,
							o = H.Default;
						for (let s = 0; s < r.length; s++) {
							const a = r[s],
								l = SD(a);
							"number" == typeof l ? (-1 === l ? (i = a.token) : (o |= l)) : (i = a);
						}
						n.push(L(i, o));
					} else n.push(L(r));
				}
				return n;
			}
			function zi(e, n) {
				return (e[$l] = n), (e.prototype[$l] = n), e;
			}
			function SD(e) {
				return e[$l];
			}
			function yn(e) {
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
				re = [],
				Ds = ce({ ɵcmp: ce }),
				Wl = ce({ ɵdir: ce }),
				Gl = ce({ ɵpipe: ce }),
				gf = ce({ ɵmod: ce }),
				_n = ce({ ɵfac: ce }),
				Wi = ce({ __NG_ELEMENT_ID__: ce }),
				df = ce({ __NG_ENV_ID__: ce });
			function ff(e, n, t) {
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
						If(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), r++;
					}
				}
				return r;
			}
			function Cf(e) {
				return 3 === e || 4 === e || 6 === e;
			}
			function If(e) {
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
								: 0 === t || hf(e, t, i, null, -1 === t || 2 === t ? n[++r] : null);
						}
					}
				return e;
			}
			function hf(e, n, t, r, i) {
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
			const pf = "ng-template";
			function MD(e, n, t) {
				let r = 0,
					i = !0;
				for (; r < e.length; ) {
					let o = e[r++];
					if ("string" == typeof o && i) {
						const s = e[r++];
						if (t && "class" === o && -1 !== ff(s.toLowerCase(), n, 0)) return !0;
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
			function Af(e) {
				return 4 === e.type && e.value !== pf;
			}
			function ND(e, n, t) {
				return n === (4 !== e.type || t ? e.value : pf);
			}
			function PD(e, n, t) {
				let r = 4;
				const i = e.attrs || [],
					o = (function OD(e) {
						for (let n = 0; n < e.length; n++) if (Cf(e[n])) return n;
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
								const g = RD(8 & r ? "class" : l, i, Af(e), t);
								if (-1 === g) {
									if (jt(r)) return !1;
									s = !0;
									continue;
								}
								if ("" !== c) {
									let f;
									f = g > o ? "" : i[g + 1].toLowerCase();
									const C = 8 & r ? f : null;
									if ((C && -1 !== ff(C, c, 0)) || (2 & r && c !== f)) {
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
			function mf(e, n, t = !1) {
				for (let r = 0; r < n.length; r++) if (PD(e, n[r], t)) return !0;
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
			function yf(e, n) {
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
					else "" !== i && !jt(s) && ((n += yf(o, i)), (i = "")), (r = s), (o = o || !jt(r));
					t++;
				}
				return "" !== i && (n += yf(o, i)), n;
			}
			function Ae(e) {
				return yn(() => {
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
							styles: e.styles || re,
							_: null,
							schemas: e.schemas || null,
							tView: null,
							id: "",
						};
					Df(t);
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
				return se(e) || Ye(e);
			}
			function jD(e) {
				return null !== e;
			}
			function gt(e) {
				return yn(() => ({
					type: e.type,
					bootstrap: e.bootstrap || re,
					declarations: e.declarations || re,
					imports: e.imports || re,
					exports: e.exports || re,
					transitiveCompileScopes: null,
					schemas: e.schemas || null,
					id: e.id || null,
				}));
			}
			function _f(e, n) {
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
			function Ke(e) {
				return yn(() => {
					const n = vf(e);
					return Df(n), n;
				});
			}
			function se(e) {
				return e[Ds] || null;
			}
			function Ye(e) {
				return e[Wl] || null;
			}
			function ft(e) {
				return e[Gl] || null;
			}
			function _t(e, n) {
				const t = e[gf] || null;
				if (!t && !0 === n) throw new Error(`Type ${He(e)} does not have '\u0275mod' property.`);
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
					selectors: e.selectors || re,
					viewQuery: e.viewQuery || null,
					features: e.features || null,
					setInput: null,
					findHostDirectiveDefs: null,
					hostDirectives: null,
					inputs: _f(e.inputs, n),
					outputs: _f(e.outputs),
				};
			}
			function Df(e) {
				e.features?.forEach((n) => n(e));
			}
			function ws(e, n) {
				if (!e) return null;
				const t = n ? ft : UD;
				return () => ("function" == typeof e ? e() : e).map((r) => t(r)).filter(jD);
			}
			const Ve = 0,
				M = 1,
				W = 2,
				me = 3,
				$t = 4,
				qi = 5,
				Qe = 6,
				xr = 7,
				be = 8,
				Or = 9,
				sr = 10,
				G = 11,
				Ki = 12,
				wf = 13,
				Lr = 14,
				Te = 15,
				Zi = 16,
				Fr = 17,
				nn = 18,
				Yi = 19,
				Ef = 20,
				zn = 21,
				vn = 22,
				Es = 23,
				Ss = 24,
				Q = 25,
				Kl = 1,
				Sf = 2,
				rn = 7,
				kr = 9,
				Xe = 11;
			function vt(e) {
				return Array.isArray(e) && "object" == typeof e[Kl];
			}
			function Ct(e) {
				return Array.isArray(e) && !0 === e[Kl];
			}
			function Zl(e) {
				return 0 != (4 & e.flags);
			}
			function ar(e) {
				return e.componentOffset > -1;
			}
			function Ts(e) {
				return 1 == (1 & e.flags);
			}
			function zt(e) {
				return !!e.template;
			}
			function Yl(e) {
				return 0 != (512 & e[W]);
			}
			function lr(e, n) {
				return e.hasOwnProperty(_n) ? e[_n] : null;
			}
			let QD =
					de.WeakRef ??
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
			function Ge(e) {
				const n = on;
				return (on = e), n;
			}
			class Pf {
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
			let Rf = null;
			const Of = () => {};
			class r0 extends Pf {
				constructor(n, t, r) {
					super(),
						(this.watch = n),
						(this.schedule = t),
						(this.dirty = !1),
						(this.cleanupFn = Of),
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
					const n = Ge(this);
					this.trackingVersion++;
					try {
						this.cleanupFn(), (this.cleanupFn = Of), this.watch(this.registerOnCleanup);
					} finally {
						Ge(n);
					}
				}
				cleanup() {
					this.cleanupFn();
				}
			}
			class o0 {
				constructor(n, t, r) {
					(this.previousValue = n), (this.currentValue = t), (this.firstChange = r);
				}
				isFirstChange() {
					return this.firstChange;
				}
			}
			function Dn() {
				return Lf;
			}
			function Lf(e) {
				return e.type.prototype.ngOnChanges && (e.setInput = a0), s0;
			}
			function s0() {
				const e = kf(this),
					n = e?.current;
				if (n) {
					const t = e.previous;
					if (t === tn) e.previous = n;
					else for (let r in n) t[r] = n[r];
					(e.current = null), this.ngOnChanges(n);
				}
			}
			function a0(e, n, t, r) {
				const i = this.declaredInputs[t],
					o =
						kf(e) ||
						(function l0(e, n) {
							return (e[Ff] = n);
						})(e, { previous: tn, current: null }),
					s = o.current || (o.current = {}),
					a = o.previous,
					l = a[i];
				(s[i] = new o0(l && l.currentValue, n, a === tn)), (e[r] = n);
			}
			Dn.ngInherit = !0;
			const Ff = "__ngSimpleChanges__";
			function kf(e) {
				return e[Ff] || null;
			}
			const sn = function (e, n, t) {};
			function Ce(e) {
				for (; Array.isArray(e); ) e = e[Ve];
				return e;
			}
			function Rs(e, n) {
				return Ce(n[e]);
			}
			function It(e, n) {
				return Ce(n[e.index]);
			}
			function Bf(e, n) {
				return e.data[n];
			}
			function Dt(e, n) {
				const t = n[e];
				return vt(t) ? t : t[Ve];
			}
			function Wn(e, n) {
				return null == n ? null : e[n];
			}
			function Uf(e) {
				e[Fr] = 0;
			}
			function I0(e) {
				1024 & e[W] || ((e[W] |= 1024), $f(e, 1));
			}
			function jf(e) {
				1024 & e[W] && ((e[W] &= -1025), $f(e, -1));
			}
			function $f(e, n) {
				let t = e[me];
				if (null === t) return;
				t[qi] += n;
				let r = t;
				for (t = t[me]; null !== t && ((1 === n && 1 === r[qi]) || (-1 === n && 0 === r[qi])); )
					(t[qi] += n), (r = t), (t = t[me]);
			}
			const j = { lFrame: eC(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
			function Gf() {
				return j.bindingsEnabled;
			}
			function Vr() {
				return null !== j.skipHydrationRootTNode;
			}
			function w() {
				return j.lFrame.lView;
			}
			function ee() {
				return j.lFrame.tView;
			}
			function te(e) {
				return (j.lFrame.contextLView = e), e[be];
			}
			function ne(e) {
				return (j.lFrame.contextLView = null), e;
			}
			function Ze() {
				let e = qf();
				for (; null !== e && 64 === e.type; ) e = e.parent;
				return e;
			}
			function qf() {
				return j.lFrame.currentTNode;
			}
			function an(e, n) {
				const t = j.lFrame;
				(t.currentTNode = e), (t.isParent = n);
			}
			function nc() {
				return j.lFrame.isParent;
			}
			function rc() {
				j.lFrame.isParent = !1;
			}
			function rt() {
				const e = j.lFrame;
				let n = e.bindingRootIndex;
				return -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
			}
			function Br() {
				return j.lFrame.bindingIndex++;
			}
			function En(e) {
				const n = j.lFrame,
					t = n.bindingIndex;
				return (n.bindingIndex = n.bindingIndex + e), t;
			}
			function b0(e, n) {
				const t = j.lFrame;
				(t.bindingIndex = t.bindingRootIndex = e), ic(n);
			}
			function ic(e) {
				j.lFrame.currentDirectiveIndex = e;
			}
			function Qf() {
				return j.lFrame.currentQueryIndex;
			}
			function sc(e) {
				j.lFrame.currentQueryIndex = e;
			}
			function M0(e) {
				const n = e[M];
				return 2 === n.type ? n.declTNode : 1 === n.type ? e[Qe] : null;
			}
			function Xf(e, n, t) {
				if (t & H.SkipSelf) {
					let i = n,
						o = e;
					for (
						;
						!((i = i.parent),
						null !== i || t & H.Host || ((i = M0(o)), null === i || ((o = o[Lr]), 10 & i.type)));

					);
					if (null === i) return !1;
					(n = i), (e = o);
				}
				const r = (j.lFrame = Jf());
				return (r.currentTNode = n), (r.lView = e), !0;
			}
			function ac(e) {
				const n = Jf(),
					t = e[M];
				(j.lFrame = n),
					(n.currentTNode = t.firstChild),
					(n.lView = e),
					(n.tView = t),
					(n.contextLView = e),
					(n.bindingIndex = t.bindingStartIndex),
					(n.inI18n = !1);
			}
			function Jf() {
				const e = j.lFrame,
					n = null === e ? null : e.child;
				return null === n ? eC(e) : n;
			}
			function eC(e) {
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
			function tC() {
				const e = j.lFrame;
				return (j.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
			}
			const nC = tC;
			function lc() {
				const e = tC();
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
			function it() {
				return j.lFrame.selectedIndex;
			}
			function cr(e) {
				j.lFrame.selectedIndex = e;
			}
			function ye() {
				const e = j.lFrame;
				return Bf(e.tView, e.selectedIndex);
			}
			function Gn() {
				j.lFrame.currentNamespace = "svg";
			}
			let iC = !0;
			function xs() {
				return iC;
			}
			function qn(e) {
				iC = e;
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
				oC(e, n, 3, t);
			}
			function Fs(e, n, t, r) {
				(3 & e[W]) === t && oC(e, n, t, r);
			}
			function cc(e, n) {
				let t = e[W];
				(3 & t) === n && ((t &= 8191), (t += 1), (e[W] = t));
			}
			function oC(e, n, t, r) {
				const o = r ?? -1,
					s = n.length - 1;
				let a = 0;
				for (let l = void 0 !== r ? 65535 & e[Fr] : 0; l < s; l++)
					if ("number" == typeof n[l + 1]) {
						if (((a = n[l]), null != r && a >= r)) break;
					} else
						n[l] < 0 && (e[Fr] += 65536),
							(a < o || -1 == o) && (F0(e, t, n, l), (e[Fr] = (4294901760 & e[Fr]) + l + 2)),
							l++;
			}
			function sC(e, n) {
				sn(4, e, n);
				const t = Ge(null);
				try {
					n.call(e);
				} finally {
					Ge(t), sn(5, e, n);
				}
			}
			function F0(e, n, t, r) {
				const i = t[r] < 0,
					o = t[r + 1],
					a = e[i ? -t[r] : t[r]];
				i ? e[W] >> 13 < e[Fr] >> 16 && (3 & e[W]) === n && ((e[W] += 8192), sC(a, o)) : sC(a, o);
			}
			const Ur = -1;
			class Ji {
				constructor(n, t, r) {
					(this.factory = n), (this.resolving = !1), (this.canSeeViewProviders = t), (this.injectImpl = r);
				}
			}
			function aC(e) {
				return e !== Ur;
			}
			function ks(e) {
				return 32767 & e;
			}
			function Hs(e, n) {
				let t = (function B0(e) {
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
			const lC = 255,
				cC = 5;
			let U0 = 0;
			const ln = {};
			function Bs(e, n) {
				const t = uC(e, n);
				if (-1 !== t) return t;
				const r = n[M];
				r.firstCreatePass && ((e.injectorIndex = n.length), dc(r.data, e), dc(n, null), dc(r.blueprint, null));
				const i = fc(e, n),
					o = e.injectorIndex;
				if (aC(i)) {
					const s = ks(i),
						a = Hs(i, n),
						l = a[M].data;
					for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
				}
				return (n[o + 8] = i), o;
			}
			function dc(e, n) {
				e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
			}
			function uC(e, n) {
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
					if (((r = pC(i)), null === r)) return Ur;
					if ((t++, (i = i[Lr]), -1 !== r.injectorIndex)) return r.injectorIndex | (t << 16);
				}
				return Ur;
			}
			function Cc(e, n, t) {
				!(function j0(e, n, t) {
					let r;
					"string" == typeof t ? (r = t.charCodeAt(0) || 0) : t.hasOwnProperty(Wi) && (r = t[Wi]),
						null == r && (r = t[Wi] = U0++);
					const i = r & lC;
					n.data[e + (i >> cC)] |= 1 << i;
				})(e, n, t);
			}
			function gC(e, n, t) {
				if (t & H.Optional || void 0 !== e) return e;
				As();
			}
			function dC(e, n, t, r) {
				if ((t & H.Optional && void 0 === r && (r = null), !(t & (H.Self | H.Host)))) {
					const i = e[Or],
						o = ut(void 0);
					try {
						return i ? i.get(n, r, t & H.Optional) : lf(n, r, t & H.Optional);
					} finally {
						ut(o);
					}
				}
				return gC(r, 0, t);
			}
			function fC(e, n, t, r = H.Default, i) {
				if (null !== e) {
					if (2048 & n[W] && !(r & H.Self)) {
						const s = (function q0(e, n, t, r, i) {
							let o = e,
								s = n;
							for (; null !== o && null !== s && 2048 & s[W] && !(512 & s[W]); ) {
								const a = CC(o, s, t, r | H.Self, ln);
								if (a !== ln) return a;
								let l = o.parent;
								if (!l) {
									const c = s[Ef];
									if (c) {
										const u = c.get(t, ln, r);
										if (u !== ln) return u;
									}
									(l = pC(s)), (s = s[Lr]);
								}
								o = l;
							}
							return i;
						})(e, n, t, r, ln);
						if (s !== ln) return s;
					}
					const o = CC(e, n, t, r, ln);
					if (o !== ln) return o;
				}
				return dC(n, t, r, i);
			}
			function CC(e, n, t, r, i) {
				const o = (function W0(e) {
					if ("string" == typeof e) return e.charCodeAt(0) || 0;
					const n = e.hasOwnProperty(Wi) ? e[Wi] : void 0;
					return "number" == typeof n ? (n >= 0 ? n & lC : G0) : n;
				})(t);
				if ("function" == typeof o) {
					if (!Xf(n, e, r)) return r & H.Host ? gC(i, 0, r) : dC(n, t, r, i);
					try {
						const s = o(r);
						if (null != s || r & H.Optional) return s;
						As();
					} finally {
						nC();
					}
				} else if ("number" == typeof o) {
					let s = null,
						a = uC(e, n),
						l = Ur,
						c = r & H.Host ? n[Te][Qe] : null;
					for (
						(-1 === a || r & H.SkipSelf) &&
						((l = -1 === a ? fc(e, n) : n[a + 8]),
						l !== Ur && hC(r, !1) ? ((s = n[M]), (a = ks(l)), (n = Hs(l, n))) : (a = -1));
						-1 !== a;

					) {
						const u = n[M];
						if (IC(o, a, u.data)) {
							const g = z0(a, n, t, s, r, c);
							if (g !== ln) return g;
						}
						(l = n[a + 8]),
							l !== Ur && hC(r, n[M].data[a + 8] === c) && IC(o, a, n)
								? ((s = u), (a = ks(l)), (n = Hs(l, n)))
								: (a = -1);
					}
				}
				return i;
			}
			function z0(e, n, t, r, i, o) {
				const s = n[M],
					a = s.data[e + 8],
					u = Us(a, s, t, null == r ? ar(a) && gc : r != s && 0 != (3 & a.type), i & H.Host && o === a);
				return null !== u ? ur(n, s, u, a) : ln;
			}
			function Us(e, n, t, r, i) {
				const o = e.providerIndexes,
					s = n.data,
					a = 1048575 & o,
					l = e.directiveStart,
					u = o >> 20,
					f = i ? a + u : e.directiveEnd;
				for (let C = r ? a : a + u; C < f; C++) {
					const I = s[C];
					if ((C < l && t === I) || (C >= l && I.type === t)) return C;
				}
				if (i) {
					const C = s[l];
					if (C && zt(C) && C.type === t) return l;
				}
				return null;
			}
			function ur(e, n, t, r) {
				let i = e[t];
				const o = n.data;
				if (
					(function k0(e) {
						return e instanceof Ji;
					})(i)
				) {
					const s = i;
					s.resolving &&
						(function fD(e, n) {
							const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
							throw new E(-200, `Circular dependency in DI detected for ${e}${t}`);
						})(
							(function le(e) {
								return "function" == typeof e
									? e.name || e.toString()
									: "object" == typeof e && null != e && "function" == typeof e.type
									? e.type.name || e.type.toString()
									: z(e);
							})(o[t]),
						);
					const a = Vs(s.canSeeViewProviders);
					s.resolving = !0;
					const l = s.injectImpl ? ut(s.injectImpl) : null;
					Xf(e, r, H.Default);
					try {
						(i = e[t] = s.factory(void 0, o, e, r)),
							n.firstCreatePass &&
								t >= r.directiveStart &&
								(function L0(e, n, t) {
									const { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = n.type.prototype;
									if (r) {
										const s = Lf(n);
										(t.preOrderHooks ??= []).push(e, s), (t.preOrderCheckHooks ??= []).push(e, s);
									}
									i && (t.preOrderHooks ??= []).push(0 - e, i),
										o &&
											((t.preOrderHooks ??= []).push(e, o),
											(t.preOrderCheckHooks ??= []).push(e, o));
								})(t, o[t], n);
					} finally {
						null !== l && ut(l), Vs(a), (s.resolving = !1), nC();
					}
				}
				return i;
			}
			function IC(e, n, t) {
				return !!(t[n + (e >> cC)] & (1 << e));
			}
			function hC(e, n) {
				return !(e & H.Self || (e & H.Host && n));
			}
			class jr {
				constructor(n, t) {
					(this._tNode = n), (this._lView = t);
				}
				get(n, t, r) {
					return fC(this._tNode, this._lView, n, vs(r), t);
				}
			}
			function G0() {
				return new jr(Ze(), w());
			}
			function Sn(e) {
				return yn(() => {
					const n = e.prototype.constructor,
						t = n[_n] || Ic(n),
						r = Object.prototype;
					let i = Object.getPrototypeOf(e.prototype).constructor;
					for (; i && i !== r; ) {
						const o = i[_n] || Ic(i);
						if (o && o !== t) return o;
						i = Object.getPrototypeOf(i);
					}
					return (o) => new o();
				});
			}
			function Ic(e) {
				return Vl(e)
					? () => {
							const n = Ic($(e));
							return n && n();
					  }
					: lr(e);
			}
			function pC(e) {
				const n = e[M],
					t = n.type;
				return 2 === t ? n.declTNode : 1 === t ? e[Qe] : null;
			}
			const zr = "__parameters__";
			function Gr(e, n, t) {
				return yn(() => {
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
			function mC(e, n, t) {
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
						  (function X0(e, n, t, r) {
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
				return (function yC(e, n, t) {
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
			const mw = /^>|^->|<!--|-->|--!>|<!-$/g,
				yw = /(<|>)/,
				_w = "\u200b$1\u200b";
			const vc = new Map();
			let vw = 0;
			const wc = "__ngContext__";
			function Je(e, n) {
				vt(n)
					? ((e[wc] = n[Yi]),
					  (function ww(e) {
							vc.set(e[Yi], e);
					  })(n))
					: (e[wc] = n);
			}
			let Ec;
			function Sc(e, n) {
				return Ec(e, n);
			}
			function so(e) {
				const n = e[me];
				return Ct(n) ? n[me] : n;
			}
			function BC(e) {
				return jC(e[Ki]);
			}
			function UC(e) {
				return jC(e[$t]);
			}
			function jC(e) {
				for (; null !== e && !Ct(e); ) e = e[$t];
				return e;
			}
			function Yr(e, n, t, r, i) {
				if (null != r) {
					let o,
						s = !1;
					Ct(r) ? (o = r) : vt(r) && ((s = !0), (r = r[Ve]));
					const a = Ce(r);
					0 === e && null !== t
						? null == i
							? qC(n, t, a)
							: gr(n, t, a, i || null, !0)
						: 1 === e && null !== t
						? gr(n, t, a, i || null, !0)
						: 2 === e
						? (function ra(e, n, t) {
								const r = ta(e, n);
								r &&
									(function $w(e, n, t, r) {
										e.removeChild(n, t, r);
									})(e, r, n, t);
						  })(n, a, s)
						: 3 === e && n.destroyNode(a),
						null != o &&
							(function Gw(e, n, t, r, i) {
								const o = t[rn];
								o !== Ce(t) && Yr(n, e, r, o, i);
								for (let a = Xe; a < t.length; a++) {
									const l = t[a];
									lo(l[M], l, e, n, r, o);
								}
							})(n, e, o, t, i);
				}
			}
			function bc(e, n) {
				return e.createComment(
					(function RC(e) {
						return e.replace(mw, (n) => n.replace(yw, _w));
					})(n),
				);
			}
			function ea(e, n, t) {
				return e.createElement(n, t);
			}
			function zC(e, n) {
				const t = e[kr],
					r = t.indexOf(n);
				jf(n), t.splice(r, 1);
			}
			function Tc(e, n) {
				if (e.length <= Xe) return;
				const t = Xe + n,
					r = e[t];
				if (r) {
					const i = r[Zi];
					null !== i && i !== e && zC(i, r), n > 0 && (e[t - 1][$t] = r[$t]);
					const o = $s(e, Xe + n);
					!(function Lw(e, n) {
						lo(e, n, n[G], 2, null, null), (n[Ve] = null), (n[Qe] = null);
					})(r[M], r);
					const s = o[nn];
					null !== s && s.detachView(o[M]), (r[me] = null), (r[$t] = null), (r[W] &= -129);
				}
				return r;
			}
			function WC(e, n) {
				if (!(256 & n[W])) {
					const t = n[G];
					n[Es]?.destroy(),
						n[Ss]?.destroy(),
						t.destroyNode && lo(e, n, t, 3, null, null),
						(function Hw(e) {
							let n = e[Ki];
							if (!n) return Mc(e[M], e);
							for (; n; ) {
								let t = null;
								if (vt(n)) t = n[Ki];
								else {
									const r = n[Xe];
									r && (t = r);
								}
								if (!t) {
									for (; n && !n[$t] && n !== e; ) vt(n) && Mc(n[M], n), (n = n[me]);
									null === n && (n = e), vt(n) && Mc(n[M], n), (t = n && n[$t]);
								}
								n = t;
							}
						})(n);
				}
			}
			function Mc(e, n) {
				if (!(256 & n[W])) {
					(n[W] &= -129),
						(n[W] |= 256),
						(function jw(e, n) {
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
						(function Uw(e, n) {
							const t = e.cleanup,
								r = n[xr];
							if (null !== t)
								for (let o = 0; o < t.length - 1; o += 2)
									if ("string" == typeof t[o]) {
										const s = t[o + 3];
										s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
									} else t[o].call(r[t[o + 1]]);
							null !== r && (n[xr] = null);
							const i = n[zn];
							if (null !== i) {
								n[zn] = null;
								for (let o = 0; o < i.length; o++) (0, i[o])();
							}
						})(e, n),
						1 === n[M].type && n[G].destroy();
					const t = n[Zi];
					if (null !== t && Ct(n[me])) {
						t !== n[me] && zC(t, n);
						const r = n[nn];
						null !== r && r.detachView(e);
					}
					!(function Ew(e) {
						vc.delete(e[Yi]);
					})(n);
				}
			}
			function Nc(e, n, t) {
				return (function GC(e, n, t) {
					let r = n;
					for (; null !== r && 40 & r.type; ) r = (n = r).parent;
					if (null === r) return t[Ve];
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
			function qC(e, n, t) {
				e.appendChild(n, t);
			}
			function KC(e, n, t, r, i) {
				null !== r ? gr(e, n, t, r, i) : qC(e, n, t);
			}
			function ta(e, n) {
				return e.parentNode(n);
			}
			function ZC(e, n, t) {
				return QC(e, n, t);
			}
			let Pc,
				Lc,
				oa,
				QC = function YC(e, n, t) {
					return 40 & e.type ? It(e, t) : null;
				};
			function na(e, n, t, r) {
				const i = Nc(e, r, n),
					o = n[G],
					a = ZC(r.parent || n[Qe], r, n);
				if (null != i)
					if (Array.isArray(t)) for (let l = 0; l < t.length; l++) KC(o, i, t[l], a, !1);
					else KC(o, i, t, a, !1);
				void 0 !== Pc && Pc(o, r, n, t, i);
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
							return Ct(i) ? Rc(-1, i) : Ce(i);
						}
					}
					if (32 & t) return Sc(n, e)() || Ce(e[n.index]);
					{
						const r = JC(e, n);
						return null !== r ? (Array.isArray(r) ? r[0] : ao(so(e[Te]), r)) : ao(e, n.next);
					}
				}
				return null;
			}
			function JC(e, n) {
				return null !== n ? e[Te][Qe].projection[n.projection] : null;
			}
			function Rc(e, n) {
				const t = Xe + e + 1;
				if (t < n.length) {
					const r = n[t],
						i = r[M].firstChild;
					if (null !== i) return ao(r, i);
				}
				return n[rn];
			}
			function xc(e, n, t, r, i, o, s) {
				for (; null != t; ) {
					const a = r[t.index],
						l = t.type;
					if ((s && 0 === n && (a && Je(Ce(a), r), (t.flags |= 2)), 32 != (32 & t.flags)))
						if (8 & l) xc(e, n, t.child, r, i, o, !1), Yr(n, e, i, a, o);
						else if (32 & l) {
							const c = Sc(t, r);
							let u;
							for (; (u = c()); ) Yr(n, e, i, u, o);
							Yr(n, e, i, a, o);
						} else 16 & l ? tI(e, n, r, t, i, o) : Yr(n, e, i, a, o);
					t = s ? t.projectionNext : t.next;
				}
			}
			function lo(e, n, t, r, i, o) {
				xc(t, r, e.firstChild, n, i, o, !1);
			}
			function tI(e, n, t, r, i, o) {
				const s = t[Te],
					l = s[Qe].projection[r.projection];
				if (Array.isArray(l)) for (let c = 0; c < l.length; c++) Yr(n, e, i, l[c], o);
				else {
					let c = l;
					const u = s[me];
					Qs(r) && (c.flags |= 128), xc(e, n, c, u, i, o, !0);
				}
			}
			function nI(e, n, t) {
				"" === t ? e.removeAttribute(n, "class") : e.setAttribute(n, "class", t);
			}
			function rI(e, n, t) {
				const { mergedAttrs: r, classes: i, styles: o } = t;
				null !== r && ql(e, n, r),
					null !== i && nI(e, n, i),
					null !== o &&
						(function Kw(e, n, t) {
							e.setAttribute(n, "style", t);
						})(e, n, o);
			}
			function sI(e) {
				return (
					(function Fc() {
						if (void 0 === oa && ((oa = null), de.trustedTypes))
							try {
								oa = de.trustedTypes.createPolicy("angular#unsafe-bypass", {
									createHTML: (e) => e,
									createScript: (e) => e,
									createScriptURL: (e) => e,
								});
							} catch {}
						return oa;
					})()?.createScriptURL(e) || e
				);
			}
			class aI {
				constructor(n) {
					this.changingThisBreaksApplicationSecurity = n;
				}
				toString() {
					return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${tf})`;
				}
			}
			function Kn(e) {
				return e instanceof aI ? e.changingThisBreaksApplicationSecurity : e;
			}
			function uo(e, n) {
				const t = (function iE(e) {
					return (e instanceof aI && e.getTypeName()) || null;
				})(e);
				if (null != t && t !== n) {
					if ("ResourceURL" === t && "URL" === n) return !0;
					throw new Error(`Required a safe ${n}, got a ${t} (see ${tf})`);
				}
				return t === n;
			}
			const lE = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
			var xe = (() => (
				((xe = xe || {})[(xe.NONE = 0)] = "NONE"),
				(xe[(xe.HTML = 1)] = "HTML"),
				(xe[(xe.STYLE = 2)] = "STYLE"),
				(xe[(xe.SCRIPT = 3)] = "SCRIPT"),
				(xe[(xe.URL = 4)] = "URL"),
				(xe[(xe.RESOURCE_URL = 5)] = "RESOURCE_URL"),
				xe
			))();
			function aa(e) {
				const n = fo();
				return n
					? n.sanitize(xe.URL, e) || ""
					: uo(e, "URL")
					? Kn(e)
					: (function kc(e) {
							return (e = String(e)).match(lE) ? e : "unsafe:" + e;
					  })(z(e));
			}
			function CI(e) {
				const n = fo();
				if (n) return sI(n.sanitize(xe.RESOURCE_URL, e) || "");
				if (uo(e, "ResourceURL")) return sI(Kn(e));
				throw new E(904, !1);
			}
			function fo() {
				const e = w();
				return e && e[sr].sanitizer;
			}
			class x {
				constructor(n, t) {
					(this._desc = n),
						(this.ngMetadataName = "InjectionToken"),
						(this.ɵprov = void 0),
						"number" == typeof t
							? (this.__NG_ELEMENT_ID__ = t)
							: void 0 !== t &&
							  (this.ɵprov = F({ token: this, providedIn: t.providedIn || "root", factory: t.factory }));
				}
				get multi() {
					return this;
				}
				toString() {
					return `InjectionToken ${this._desc}`;
				}
			}
			const Co = new x("ENVIRONMENT_INITIALIZER"),
				hI = new x("INJECTOR", -1),
				pI = new x("INJECTOR_DEF_TYPES");
			class AI {
				get(n, t = $i) {
					if (t === $i) {
						const r = new Error(`NullInjectorError: No provider for ${He(n)}!`);
						throw ((r.name = "NullInjectorError"), r);
					}
					return t;
				}
			}
			function _E(...e) {
				return { ɵproviders: mI(0, e), ɵfromNgModule: !0 };
			}
			function mI(e, ...n) {
				const t = [],
					r = new Set();
				let i;
				return (
					no(n, (o) => {
						const s = o;
						jc(s, t, [], r) && ((i ||= []), i.push(s));
					}),
					void 0 !== i && yI(i, t),
					t
				);
			}
			function yI(e, n) {
				for (let t = 0; t < e.length; t++) {
					const { providers: i } = e[t];
					$c(i, (o) => {
						n.push(o);
					});
				}
			}
			function jc(e, n, t, r) {
				if (!(e = $(e))) return !1;
				let i = null,
					o = rf(e);
				const s = !o && se(e);
				if (o || s) {
					if (s && !s.standalone) return !1;
					i = e;
				} else {
					const l = e.ngModule;
					if (((o = rf(l)), !o)) return !1;
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
							void 0 !== c && yI(c, n);
						}
						if (!a) {
							const c = lr(i) || (() => new i());
							n.push(
								{ provide: i, useFactory: c, deps: re },
								{ provide: pI, useValue: i, multi: !0 },
								{ provide: Co, useValue: () => L(i), multi: !0 },
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
			const vE = ce({ provide: String, useValue: ce });
			function zc(e) {
				return null !== e && "object" == typeof e && vE in e;
			}
			function dr(e) {
				return "function" == typeof e;
			}
			const Wc = new x("Set Injector scope."),
				la = {},
				wE = {};
			let Gc;
			function ca() {
				return void 0 === Gc && (Gc = new AI()), Gc;
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
						this.records.set(hI, Xr(void 0, this)),
						i.has("environment") && this.records.set(cn, Xr(void 0, this));
					const o = this.records.get(Wc);
					null != o && "string" == typeof o.value && this.scopes.add(o.value),
						(this.injectorDefTypes = new Set(this.get(pI.multi, re, H.Self)));
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
					const t = $n(this),
						r = ut(void 0);
					try {
						return n();
					} finally {
						$n(t), ut(r);
					}
				}
				get(n, t = $i, r = H.Default) {
					if ((this.assertNotDestroyed(), n.hasOwnProperty(df))) return n[df](this);
					r = vs(r);
					const i = $n(this),
						o = ut(void 0);
					try {
						if (!(r & H.SkipSelf)) {
							let a = this.records.get(n);
							if (void 0 === a) {
								const l =
									(function ME(e) {
										return "function" == typeof e || ("object" == typeof e && e instanceof x);
									})(n) && ms(n);
								(a = l && this.injectableDefInScope(l) ? Xr(Kc(n), la) : null), this.records.set(n, a);
							}
							if (null != a) return this.hydrate(n, a);
						}
						return (r & H.Self ? ca() : this.parent).get(n, (t = r & H.Optional && t === $i ? null : t));
					} catch (s) {
						if ("NullInjectorError" === s.name) {
							if (((s[_s] = s[_s] || []).unshift(He(n)), i)) throw s;
							return (function bD(e, n, t, r) {
								const i = e[_s];
								throw (
									(n[cf] && i.unshift(n[cf]),
									(e.message = (function TD(e, n, t, r = null) {
										e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
										let i = He(n);
										if (Array.isArray(n)) i = n.map(He).join(" -> ");
										else if ("object" == typeof n) {
											let o = [];
											for (let s in n)
												if (n.hasOwnProperty(s)) {
													let a = n[s];
													o.push(
														s + ":" + ("string" == typeof a ? JSON.stringify(a) : He(a)),
													);
												}
											i = `{${o.join(", ")}}`;
										}
										return `${t}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(vD, "\n  ")}`;
									})("\n" + e.message, i, t, r)),
									(e.ngTokenPath = i),
									(e[_s] = null),
									e)
								);
							})(s, n, "R3InjectorError", this.source);
						}
						throw s;
					} finally {
						ut(o), $n(i);
					}
				}
				resolveInjectorInitializers() {
					const n = $n(this),
						t = ut(void 0);
					try {
						const r = this.get(Co.multi, re, H.Self);
						for (const i of r) i();
					} finally {
						$n(n), ut(t);
					}
				}
				toString() {
					const n = [],
						t = this.records;
					for (const r of t.keys()) n.push(He(r));
					return `R3Injector[${n.join(", ")}]`;
				}
				assertNotDestroyed() {
					if (this._destroyed) throw new E(205, !1);
				}
				processProvider(n) {
					let t = dr((n = $(n))) ? n : $(n && n.provide);
					const r = (function SE(e) {
						return zc(e)
							? Xr(void 0, e.useValue)
							: Xr(
									(function DI(e, n, t) {
										let r;
										if (dr(e)) {
											const i = $(e);
											return lr(i) || Kc(i);
										}
										if (zc(e)) r = () => $(e.useValue);
										else if (
											(function vI(e) {
												return !(!e || !e.useFactory);
											})(e)
										)
											r = () => e.useFactory(...zl(e.deps || []));
										else if (
											(function _I(e) {
												return !(!e || !e.useExisting);
											})(e)
										)
											r = () => L($(e.useExisting));
										else {
											const i = $(e && (e.useClass || e.provide));
											if (
												!(function bE(e) {
													return !!e.deps;
												})(e)
											)
												return lr(i) || Kc(i);
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
					const t = $(n.providedIn);
					return "string" == typeof t ? "any" === t || this.scopes.has(t) : this.injectorDefTypes.has(t);
				}
				removeOnDestroy(n) {
					const t = this._onDestroyHooks.indexOf(n);
					-1 !== t && this._onDestroyHooks.splice(t, 1);
				}
			}
			function Kc(e) {
				const n = ms(e),
					t = null !== n ? n.factory : lr(e);
				if (null !== t) return t;
				if (e instanceof x) throw new E(204, !1);
				if (e instanceof Function)
					return (function EE(e) {
						const n = e.length;
						if (n > 0) throw (ro(n, "?"), new E(204, !1));
						const t = (function mD(e) {
							return (e && (e[ys] || e[sf])) || null;
						})(e);
						return null !== t ? () => t.factory(e) : () => new e();
					})(e);
				throw new E(204, !1);
			}
			function Xr(e, n, t = !1) {
				return { factory: e, value: n, multi: t ? [] : void 0 };
			}
			function Zc(e, n) {
				for (const t of e) Array.isArray(t) ? Zc(t, n) : t && Bl(t) ? Zc(t.ɵproviders, n) : n(t);
			}
			const ua = new x("AppId", { providedIn: "root", factory: () => NE }),
				NE = "ng",
				wI = new x("Platform Initializer"),
				Tn = new x("Platform ID", { providedIn: "platform", factory: () => "unknown" }),
				EI = new x("CSP nonce", {
					providedIn: "root",
					factory: () =>
						(function co() {
							if (void 0 !== Lc) return Lc;
							if (typeof document < "u") return document;
							throw new E(210, !1);
						})()
							.body?.querySelector("[ngCspNonce]")
							?.getAttribute("ngCspNonce") || null,
				});
			let bI = (e, n) => null;
			function TI(e, n) {
				return bI(e, n);
			}
			class VE {}
			class PI {}
			class UE {
				resolveComponentFactory(n) {
					throw (function BE(e) {
						const n = Error(`No component factory found for ${He(e)}.`);
						return (n.ngComponent = e), n;
					})(n);
				}
			}
			let Ia = (() => {
				class e {}
				return (e.NULL = new UE()), e;
			})();
			function jE() {
				return Jr(Ze(), w());
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
			class xI {}
			let ei = (() => {
					class e {
						constructor() {
							this.destroyNode = null;
						}
					}
					return (
						(e.__NG_ELEMENT_ID__ = () =>
							(function zE() {
								const e = w(),
									t = Dt(Ze().index, e);
								return (vt(t) ? t : e)[G];
							})()),
						e
					);
				})(),
				WE = (() => {
					class e {}
					return (e.ɵprov = F({ token: e, providedIn: "root", factory: () => null })), e;
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
					e[W] |= 64;
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
			const FI = new x("", { providedIn: "root", factory: () => !1 });
			function Mn(e) {
				return e instanceof Function ? e() : e;
			}
			class UI extends Pf {
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
					const i = Ge(this);
					this.trackingVersion++;
					try {
						n(t, r);
					} finally {
						Ge(i);
					}
				}
				destroy() {
					this.trackingVersion++;
				}
			}
			let Aa = null;
			function jI() {
				return (Aa ??= new UI()), Aa;
			}
			function $I(e, n) {
				return e[n] ?? jI();
			}
			function zI(e, n) {
				const t = jI();
				t.hasReadASignal && ((e[n] = Aa), (t.lView = e), (Aa = new UI()));
			}
			const q = {};
			function y(e) {
				WI(ee(), w(), it() + e, !1);
			}
			function WI(e, n, t, r) {
				if (!r)
					if (3 == (3 & n[W])) {
						const o = e.preOrderCheckHooks;
						null !== o && Ls(n, o, t);
					} else {
						const o = e.preOrderHooks;
						null !== o && Fs(n, o, 0, t);
					}
				cr(t);
			}
			function ZI(e, n = null, t = null, r) {
				const i = YI(e, n, t, r);
				return i.resolveInjectorInitializers(), i;
			}
			function YI(e, n = null, t = null, r, i = new Set()) {
				const o = [t || re, _E(e)];
				return (r = r || ("object" == typeof e ? void 0 : He(e))), new qc(o, n || ca(), r || null, i);
			}
			let Nn = (() => {
				class e {
					static create(t, r) {
						if (Array.isArray(t)) return ZI({ name: "" }, r, t, "");
						{
							const i = t.name ?? "";
							return ZI({ name: i }, t.parent, t.providers, i);
						}
					}
				}
				return (
					(e.THROW_IF_NOT_FOUND = $i),
					(e.NULL = new AI()),
					(e.ɵprov = F({ token: e, providedIn: "any", factory: () => L(hI) })),
					(e.__NG_ELEMENT_ID__ = -1),
					e
				);
			})();
			function b(e, n = H.Default) {
				const t = w();
				return null === t ? L(e, n) : fC(Ze(), t, $(e), n);
			}
			function ma(e, n, t, r, i, o, s, a, l, c, u) {
				const g = n.blueprint.slice();
				return (
					(g[Ve] = i),
					(g[W] = 140 | r),
					(null !== c || (e && 2048 & e[W])) && (g[W] |= 2048),
					Uf(g),
					(g[me] = g[Lr] = e),
					(g[be] = t),
					(g[sr] = s || (e && e[sr])),
					(g[G] = a || (e && e[G])),
					(g[Or] = l || (e && e[Or]) || null),
					(g[Qe] = o),
					(g[Yi] = (function Dw() {
						return vw++;
					})()),
					(g[vn] = u),
					(g[Ef] = c),
					(g[Te] = 2 == n.type ? e[Te] : g),
					g
				);
			}
			function ni(e, n, t, r, i) {
				let o = e.data[n];
				if (null === o)
					(o = (function lu(e, n, t, r, i) {
						const o = qf(),
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
						(function S0() {
							return j.lFrame.inI18n;
						})() && (o.flags |= 32);
				else if (64 & o.type) {
					(o.type = t), (o.value = r), (o.attrs = i);
					const s = (function Xi() {
						const e = j.lFrame,
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
			function XI(e, n, t, r, i) {
				const o = $I(n, Es),
					s = it(),
					a = 2 & r;
				try {
					if ((cr(-1), a && n.length > Q && WI(e, n, Q, !1), sn(a ? 2 : 0, i), a)) o.runInContext(t, r, i);
					else {
						const c = Ge(null);
						try {
							t(r, i);
						} finally {
							Ge(c);
						}
					}
				} finally {
					a && null === n[Es] && zI(n, Es), cr(s), sn(a ? 3 : 1, i);
				}
			}
			function cu(e, n, t) {
				if (Zl(n)) {
					const r = Ge(null);
					try {
						const o = n.directiveEnd;
						for (let s = n.directiveStart; s < o; s++) {
							const a = e.data[s];
							a.contentQueries && a.contentQueries(1, t[s], s);
						}
					} finally {
						Ge(r);
					}
				}
			}
			function uu(e, n, t) {
				Gf() &&
					((function yS(e, n, t, r) {
						const i = t.directiveStart,
							o = t.directiveEnd;
						ar(t) &&
							(function bS(e, n, t) {
								const r = It(n, e),
									i = JI(t);
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
										e[sr].rendererFactory.createRenderer(r, t),
										null,
										null,
										null,
									),
								);
								e[n.index] = a;
							})(n, t, e.data[i + t.componentOffset]),
							e.firstCreatePass || Bs(t, n),
							Je(r, n);
						const s = t.initialInputs;
						for (let a = i; a < o; a++) {
							const l = e.data[a],
								c = ur(n, e, a, t);
							Je(c, n),
								null !== s && TS(0, a - i, c, l, 0, s),
								zt(l) && (Dt(t.index, n)[be] = ur(n, e, a, t));
						}
					})(e, n, t, It(t, n)),
					64 == (64 & t.flags) && ih(e, n, t));
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
			function JI(e) {
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
				const g = Q + r,
					f = g + i,
					C = (function aS(e, n) {
						const t = [];
						for (let r = 0; r < n; r++) t.push(r < e ? null : q);
						return t;
					})(g, f),
					I = "function" == typeof c ? c() : c;
				return (C[M] = {
					type: e,
					blueprint: C,
					template: t,
					queries: null,
					viewQuery: a,
					declTNode: n,
					data: C.slice().fill(null, g),
					bindingStartIndex: g,
					expandoStartIndex: f,
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
					consts: I,
					incompleteFirstPass: !1,
					ssrId: u,
				});
			}
			let eh = (e) => null;
			function th(e, n, t, r) {
				for (let i in e)
					if (e.hasOwnProperty(i)) {
						t = null === t ? {} : t;
						const o = e[i];
						null === r ? nh(t, n, i, o) : r.hasOwnProperty(i) && nh(t, n, r[i], o);
					}
				return t;
			}
			function nh(e, n, t, r) {
				e.hasOwnProperty(t) ? e[t].push(n, r) : (e[t] = [n, r]);
			}
			function Et(e, n, t, r, i, o, s, a) {
				const l = It(n, t);
				let u,
					c = n.inputs;
				!a && null != c && (u = c[r])
					? (pu(e, t, u, r, i),
					  ar(n) &&
							(function hS(e, n) {
								const t = Dt(n, e);
								16 & t[W] || (t[W] |= 64);
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
				if (Gf()) {
					const i = null === r ? null : { "": -1 },
						o = (function vS(e, n) {
							const t = e.directiveRegistry;
							let r = null,
								i = null;
							if (t)
								for (let o = 0; o < t.length; o++) {
									const s = t[o];
									if (mf(n, s.selectors, !1))
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
						null !== s && rh(e, n, t, s, i, a),
						i &&
							(function DS(e, n, t) {
								if (n) {
									const r = (e.localNames = []);
									for (let i = 0; i < n.length; i += 2) {
										const o = t[n[i + 1]];
										if (null == o) throw new E(-301, !1);
										r.push(n[i], o);
									}
								}
							})(t, r, i);
				}
				t.mergedAttrs = Gi(t.mergedAttrs, t.attrs);
			}
			function rh(e, n, t, r, i, o) {
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
							f = t ? t.get(g) : null,
							I = f ? f.outputs : null;
						(l = th(g.inputs, u, l, f ? f.inputs : null)), (c = th(g.outputs, u, c, I));
						const h = null === l || null === s || Af(n) ? null : MS(l, u, s);
						a.push(h);
					}
					null !== l &&
						(l.hasOwnProperty("class") && (n.flags |= 8), l.hasOwnProperty("style") && (n.flags |= 16)),
						(n.initialInputs = a),
						(n.inputs = l),
						(n.outputs = c);
				})(e, t, o);
			}
			function ih(e, n, t) {
				const r = t.directiveStart,
					i = t.directiveEnd,
					o = t.index,
					s = (function T0() {
						return j.lFrame.currentDirectiveIndex;
					})();
				try {
					cr(o);
					for (let a = r; a < i; a++) {
						const l = e.data[a],
							c = n[a];
						ic(a), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && _S(l, c);
					}
				} finally {
					cr(-1), ic(s);
				}
			}
			function _S(e, n) {
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
				const o = i.factory || (i.factory = lr(i.type)),
					s = new Ji(o, zt(i), b);
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
					})(e, n, r, mo(e, t, i.hostVars, q), i);
			}
			function un(e, n, t, r, i, o) {
				const s = It(e, n);
				!(function Iu(e, n, t, r, i, o, s) {
					if (null == o) e.removeAttribute(n, i, t);
					else {
						const a = null == s ? z(o) : s(o, r || "", i);
						e.setAttribute(n, i, a, t);
					}
				})(n[G], s, o, e.value, t, r, i);
			}
			function TS(e, n, t, r, i, o) {
				const s = o[n];
				if (null !== s) for (let a = 0; a < s.length; ) oh(r, t, s[a++], s[a++], s[a++]);
			}
			function oh(e, n, t, r, i) {
				const o = Ge(null);
				try {
					const s = e.inputTransforms;
					null !== s && s.hasOwnProperty(r) && (i = s[r].call(n, i)),
						null !== e.setInput ? e.setInput(n, i, t, r) : (n[r] = i);
				} finally {
					Ge(o);
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
			function sh(e, n, t, r) {
				return [e, !0, !1, n, null, 0, r, t, null, null, null];
			}
			function ah(e, n) {
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
				return e[Ki] ? (e[wf][$t] = n) : (e[Ki] = n), (e[wf] = n), n;
			}
			function hu(e, n, t) {
				sc(0);
				const r = Ge(null);
				try {
					n(e, t);
				} finally {
					Ge(r);
				}
			}
			function lh(e) {
				return e[xr] || (e[xr] = []);
			}
			function ch(e) {
				return e.cleanup || (e.cleanup = []);
			}
			function gh(e, n) {
				const t = e[Or],
					r = t ? t.get(fr, null) : null;
				r && r.handleError(n);
			}
			function pu(e, n, t, r, i) {
				for (let o = 0; o < t.length; ) {
					const s = t[o++],
						a = t[o++];
					oh(e.data[s], n[s], r, a, i);
				}
			}
			function NS(e, n) {
				const t = Dt(n, e),
					r = t[M];
				!(function PS(e, n) {
					for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
				})(r, t);
				const i = t[Ve];
				null !== i && null === t[vn] && (t[vn] = TI(i, t[Or])), Au(r, t, t[be]);
			}
			function Au(e, n, t) {
				ac(n);
				try {
					const r = e.viewQuery;
					null !== r && hu(1, r, t);
					const i = e.template;
					null !== i && XI(e, n, i, 1, t),
						e.firstCreatePass && (e.firstCreatePass = !1),
						e.staticContentQueries && ah(e, n),
						e.staticViewQueries && hu(2, e.viewQuery, t);
					const o = e.components;
					null !== o &&
						(function RS(e, n) {
							for (let t = 0; t < n.length; t++) NS(e, n[t]);
						})(n, o);
				} catch (r) {
					throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
				} finally {
					(n[W] &= -5), lc();
				}
			}
			let dh = (() => {
				class e {
					constructor() {
						(this.all = new Set()), (this.queue = new Map());
					}
					create(t, r, i) {
						const o = typeof Zone > "u" ? null : Zone.current,
							s = new r0(
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
				return (e.ɵprov = F({ token: e, providedIn: "root", factory: () => new e() })), e;
			})();
			function _a(e, n, t) {
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
					if ((null !== o && r.push(Ce(o)), Ct(o))) {
						for (let a = Xe; a < o.length; a++) {
							const l = o[a],
								c = l[M].firstChild;
							null !== c && yo(l[M], l, c, r);
						}
						o[rn] !== o[Ve] && r.push(o[rn]);
					}
					const s = t.type;
					if (8 & s) yo(e, n, t.child, r);
					else if (32 & s) {
						const a = Sc(t, n);
						let l;
						for (; (l = a()); ) r.push(l);
					} else if (16 & s) {
						const a = JC(n, t);
						if (Array.isArray(a)) r.push(...a);
						else {
							const l = so(n[Te]);
							yo(l[M], l, a, r, !0);
						}
					}
					t = i ? t.projectionNext : t.next;
				}
				return r;
			}
			function va(e, n, t, r = !0) {
				const i = n[sr].rendererFactory;
				i.begin && i.begin();
				try {
					fh(e, n, e.template, t);
				} catch (s) {
					throw (r && gh(n, s), s);
				} finally {
					i.end && i.end(), n[sr].effectManager?.flush();
				}
			}
			function fh(e, n, t, r) {
				const i = n[W];
				if (256 != (256 & i)) {
					n[sr].effectManager?.flush(), ac(n);
					try {
						Uf(n),
							(function Zf(e) {
								return (j.lFrame.bindingIndex = e);
							})(e.bindingStartIndex),
							null !== t && XI(e, n, t, 2, r);
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
								for (let n = BC(e); null !== n; n = UC(n)) {
									if (!n[Sf]) continue;
									const t = n[kr];
									for (let r = 0; r < t.length; r++) {
										I0(t[r]);
									}
								}
							})(n),
							Ch(n, 2),
							null !== e.contentQueries && ah(e, n),
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
							const r = $I(n, Ss);
							try {
								for (let i = 0; i < t.length; i++) {
									const o = t[i];
									if (o < 0) cr(~o);
									else {
										const s = o,
											a = t[++i],
											l = t[++i];
										b0(a, s), r.runInContext(l, 2, n[s]);
									}
								}
							} finally {
								null === n[Ss] && zI(n, Ss), cr(-1);
							}
						})(e, n);
						const a = e.components;
						null !== a && hh(n, a, 0);
						const l = e.viewQuery;
						if ((null !== l && hu(2, l, r), s)) {
							const c = e.viewCheckHooks;
							null !== c && Ls(n, c);
						} else {
							const c = e.viewHooks;
							null !== c && Fs(n, c, 2), cc(n, 2);
						}
						!0 === e.firstUpdatePass && (e.firstUpdatePass = !1), (n[W] &= -73), jf(n);
					} finally {
						lc();
					}
				}
			}
			function Ch(e, n) {
				for (let t = BC(e); null !== t; t = UC(t)) for (let r = Xe; r < t.length; r++) Ih(t[r], n);
			}
			function HS(e, n, t) {
				Ih(Dt(n, e), t);
			}
			function Ih(e, n) {
				if (
					!(function f0(e) {
						return 128 == (128 & e[W]);
					})(e)
				)
					return;
				const t = e[M];
				if ((80 & e[W] && 0 === n) || 1024 & e[W] || 2 === n) fh(t, e, t.template, e[be]);
				else if (e[qi] > 0) {
					Ch(e, 1);
					const i = e[M].components;
					null !== i && hh(e, i, 1);
				}
			}
			function hh(e, n, t) {
				for (let r = 0; r < n.length; r++) HS(e, n[r], t);
			}
			class _o {
				get rootNodes() {
					const n = this._lView,
						t = n[M];
					return yo(t, n, t.firstChild, []);
				}
				constructor(n, t) {
					(this._lView = n),
						(this._cdRefInjectingView = t),
						(this._appRef = null),
						(this._attachedToViewContainer = !1);
				}
				get context() {
					return this._lView[be];
				}
				set context(n) {
					this._lView[be] = n;
				}
				get destroyed() {
					return 256 == (256 & this._lView[W]);
				}
				destroy() {
					if (this._appRef) this._appRef.detachView(this);
					else if (this._attachedToViewContainer) {
						const n = this._lView[me];
						if (Ct(n)) {
							const t = n[8],
								r = t ? t.indexOf(this) : -1;
							r > -1 && (Tc(n, r), $s(t, r));
						}
						this._attachedToViewContainer = !1;
					}
					WC(this._lView[M], this._lView);
				}
				onDestroy(n) {
					!(function zf(e, n) {
						if (256 == (256 & e[W])) throw new E(911, !1);
						null === e[zn] && (e[zn] = []), e[zn].push(n);
					})(this._lView, n);
				}
				markForCheck() {
					Ao(this._cdRefInjectingView || this._lView);
				}
				detach() {
					this._lView[W] &= -129;
				}
				reattach() {
					this._lView[W] |= 128;
				}
				detectChanges() {
					va(this._lView[M], this._lView, this.context);
				}
				checkNoChanges() {}
				attachToViewContainerRef() {
					if (this._appRef) throw new E(902, !1);
					this._attachedToViewContainer = !0;
				}
				detachFromAppRef() {
					(this._appRef = null),
						(function kw(e, n) {
							lo(e, n, n[G], 2, null, null);
						})(this._lView[M], this._lView);
				}
				attachToAppRef(n) {
					if (this._attachedToViewContainer) throw new E(902, !1);
					this._appRef = n;
				}
			}
			class VS extends _o {
				constructor(n) {
					super(n), (this._view = n);
				}
				detectChanges() {
					const n = this._view;
					va(n[M], n, n[be], !1);
				}
				checkNoChanges() {}
				get context() {
					return null;
				}
			}
			class ph extends Ia {
				constructor(n) {
					super(), (this.ngModule = n);
				}
				resolveComponentFactory(n) {
					const t = se(n);
					return new vo(t, this.ngModule);
				}
			}
			function Ah(e) {
				const n = [];
				for (let t in e) e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
				return n;
			}
			class US {
				constructor(n, t) {
					(this.injector = n), (this.parentInjector = t);
				}
				get(n, t, r) {
					r = vs(r);
					const i = this.injector.get(n, su, r);
					return i !== su || t === su ? i : this.parentInjector.get(n, t, r);
				}
			}
			class vo extends PI {
				get inputs() {
					const n = this.componentDef,
						t = n.inputTransforms,
						r = Ah(n.inputs);
					if (null !== t) for (const i of r) t.hasOwnProperty(i.propName) && (i.transform = t[i.propName]);
					return r;
				}
				get outputs() {
					return Ah(this.componentDef.outputs);
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
						a = s.get(xI, null);
					if (null === a) throw new E(407, !1);
					const u = { rendererFactory: a, sanitizer: s.get(WE, null), effectManager: s.get(dh, null) },
						g = a.createRenderer(null, this.componentDef),
						f = this.componentDef.selectors[0][0] || "div",
						C = r
							? (function lS(e, n, t, r) {
									const o = r.get(FI, !1) || t === yt.ShadowDom,
										s = e.selectRootElement(n, o);
									return (
										(function cS(e) {
											eh(e);
										})(s),
										s
									);
							  })(g, r, this.componentDef.encapsulation, s)
							: ea(
									g,
									f,
									(function BS(e) {
										const n = e.toLowerCase();
										return "svg" === n ? "svg" : "math" === n ? "math" : null;
									})(f),
							  ),
						m = this.componentDef.signals ? 4608 : this.componentDef.onPush ? 576 : 528,
						v = du(0, null, null, 1, 0, null, null, null, null, null, null),
						A = ma(null, v, null, m, null, null, u, g, s, null, null);
					let S, O;
					ac(A);
					try {
						const k = this.componentDef;
						let pe,
							Sl = null;
						k.findHostDirectiveDefs
							? ((pe = []), (Sl = new Map()), k.findHostDirectiveDefs(k, pe, Sl), pe.push(k))
							: (pe = [k]);
						const i3 = (function $S(e, n) {
								const t = e[M],
									r = Q;
								return (e[r] = n), ni(t, r, 2, "#host", null);
							})(A, C),
							o3 = (function zS(e, n, t, r, i, o, s) {
								const a = i[M];
								!(function WS(e, n, t, r) {
									for (const i of e) n.mergedAttrs = Gi(n.mergedAttrs, i.hostAttrs);
									null !== n.mergedAttrs && (_a(n, n.mergedAttrs, !0), null !== t && rI(r, t, n));
								})(r, e, n, s);
								let l = null;
								null !== n && (l = TI(n, i[Or]));
								const c = o.rendererFactory.createRenderer(n, t);
								let u = 16;
								t.signals ? (u = 4096) : t.onPush && (u = 64);
								const g = ma(i, JI(t), null, u, i[e.index], e, o, c, null, null, l);
								return a.firstCreatePass && Cu(a, e, r.length - 1), ya(i, g), (i[e.index] = g);
							})(i3, C, k, pe, A, u, g);
						(O = Bf(v, Q)),
							C &&
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
										i && ql(e, t, i), o && o.length > 0 && nI(e, t, o.join(" "));
									}
								})(g, k, C, r),
							void 0 !== t &&
								(function KS(e, n, t) {
									const r = (e.projection = []);
									for (let i = 0; i < n.length; i++) {
										const o = t[i];
										r.push(null != o ? Array.from(o) : null);
									}
								})(O, this.ngContentSelectors, t),
							(S = (function GS(e, n, t, r, i, o) {
								const s = Ze(),
									a = i[M],
									l = It(s, i);
								rh(a, i, s, t, null, r);
								for (let u = 0; u < t.length; u++) Je(ur(i, a, s.directiveStart + u, s), i);
								ih(a, i, s), l && Je(l, i);
								const c = ur(i, a, s.directiveStart + s.componentOffset, s);
								if (((e[be] = i[be] = c), null !== o)) for (const u of o) u(c, n);
								return cu(a, s, e), c;
							})(o3, k, pe, Sl, A, [ZS])),
							Au(v, A, null);
					} finally {
						lc();
					}
					return new jS(this.componentType, S, Jr(O, A), A, O);
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
						pu(o[M], o, i, n, t), this.previousInputValues.set(n, t), Ao(Dt(this._tNode.index, o));
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
				const e = Ze();
				Os(w()[M], e);
			}
			function Rn(e) {
				let n = (function mh(e) {
						return Object.getPrototypeOf(e.prototype).constructor;
					})(e.type),
					t = !0;
				const r = [e];
				for (; n; ) {
					let i;
					if (zt(e)) i = n.ɵcmp || n.ɵdir;
					else {
						if (n.ɵcmp) throw new E(903, !1);
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
								a && a.ngInherit && a(e), a === Rn && (t = !1);
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
				return e === tn ? {} : e === re ? [] : e;
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
			function Dh(e) {
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
			function et(e, n, t) {
				return !Object.is(e[n], t) && ((e[n] = t), !0);
			}
			function Cr(e, n, t, r) {
				const i = et(e, n, t);
				return et(e, n + 1, r) || i;
			}
			function ve(e, n, t, r) {
				const i = w();
				return et(i, Br(), n) && (ee(), un(ye(), i, e, n, t, r)), ve;
			}
			function ii(e, n, t, r) {
				return et(e, Br(), t) ? n + z(t) + r : q;
			}
			function _(e, n, t, r, i, o, s, a) {
				const l = w(),
					c = ee(),
					u = e + Q,
					g = c.firstCreatePass
						? (function wb(e, n, t, r, i, o, s, a, l) {
								const c = n.consts,
									u = ni(n, e, 4, s || null, Wn(c, a));
								fu(n, t, u, Wn(c, l)), Os(n, u);
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
				const f = Fh(c, l, g, e);
				xs() && na(c, l, f, g),
					Je(f, l),
					ya(l, (l[u] = sh(f, l, f, g))),
					Ts(g) && uu(c, l, g),
					null != s && gu(l, g, a);
			}
			let Fh = function kh(e, n, t, r) {
				return qn(!0), n[G].createComment("");
			};
			function bo(e) {
				return (function Hr(e, n) {
					return e[n];
				})(
					(function E0() {
						return j.lFrame.contextLView;
					})(),
					Q + e,
				);
			}
			function p(e, n, t) {
				const r = w();
				return et(r, Br(), n) && Et(ee(), ye(), r, e, n, r[G], t, !1), p;
			}
			function Eu(e, n, t, r, i) {
				const s = i ? "class" : "style";
				pu(e, t, n.inputs[s], s, r);
			}
			function N(e, n, t, r) {
				const i = w(),
					o = ee(),
					s = Q + e,
					a = i[G],
					l = o.firstCreatePass
						? (function Tb(e, n, t, r, i, o) {
								const s = n.consts,
									l = ni(n, e, 2, r, Wn(s, i));
								return (
									fu(n, t, l, Wn(s, o)),
									null !== l.attrs && _a(l, l.attrs, !1),
									null !== l.mergedAttrs && _a(l, l.mergedAttrs, !0),
									null !== n.queries && n.queries.elementStart(n, l),
									l
								);
						  })(s, o, i, n, t, r)
						: o.data[s],
					c = Hh(o, i, l, a, n, e);
				i[s] = c;
				const u = Ts(l);
				return (
					an(l, !0),
					rI(a, c, l),
					32 != (32 & l.flags) && xs() && na(o, i, c, l),
					0 ===
						(function p0() {
							return j.lFrame.elementDepthCount;
						})() && Je(c, i),
					(function A0() {
						j.lFrame.elementDepthCount++;
					})(),
					u && (uu(o, i, l), cu(o, l, i)),
					null !== r && gu(i, l),
					N
				);
			}
			function R() {
				let e = Ze();
				nc() ? rc() : ((e = e.parent), an(e, !1));
				const n = e;
				(function y0(e) {
					return j.skipHydrationRootTNode === e;
				})(n) &&
					(function w0() {
						j.skipHydrationRootTNode = null;
					})(),
					(function m0() {
						j.lFrame.elementDepthCount--;
					})();
				const t = ee();
				return (
					t.firstCreatePass && (Os(t, e), Zl(e) && t.queries.elementEnd(e)),
					null != n.classesWithoutHost &&
						(function H0(e) {
							return 0 != (8 & e.flags);
						})(n) &&
						Eu(t, n, w(), n.classesWithoutHost, !0),
					null != n.stylesWithoutHost &&
						(function V0(e) {
							return 0 != (16 & e.flags);
						})(n) &&
						Eu(t, n, w(), n.stylesWithoutHost, !1),
					R
				);
			}
			function K(e, n, t, r) {
				return N(e, n, t, r), R(), K;
			}
			let Hh = (e, n, t, r, i, o) => (
				qn(!0),
				ea(
					r,
					i,
					(function rC() {
						return j.lFrame.currentNamespace;
					})(),
				)
			);
			function De(e, n, t) {
				const r = w(),
					i = ee(),
					o = e + Q,
					s = i.firstCreatePass
						? (function Pb(e, n, t, r, i) {
								const o = n.consts,
									s = Wn(o, r),
									a = ni(n, e, 8, "ng-container", s);
								return (
									null !== s && _a(a, s, !0),
									fu(n, t, a, Wn(o, i)),
									null !== n.queries && n.queries.elementStart(n, a),
									a
								);
						  })(o, i, r, n, t)
						: i.data[o];
				an(s, !0);
				const a = Vh(i, r, s, e);
				return (
					(r[o] = a),
					xs() && na(i, r, a, s),
					Je(a, r),
					Ts(s) && (uu(i, r, s), cu(i, s, r)),
					null != t && gu(r, s),
					De
				);
			}
			function we() {
				let e = Ze();
				const n = ee();
				return (
					nc() ? rc() : ((e = e.parent), an(e, !1)),
					n.firstCreatePass && (Os(n, e), Zl(e) && n.queries.elementEnd(e)),
					we
				);
			}
			function Ee(e, n, t) {
				return De(e, n, t), we(), Ee;
			}
			let Vh = (e, n, t, r) => (qn(!0), bc(n[G], ""));
			function dn() {
				return w();
			}
			function Ma(e) {
				return !!e && "function" == typeof e.then;
			}
			function Bh(e) {
				return !!e && "function" == typeof e.subscribe;
			}
			function ot(e, n, t, r) {
				const i = w(),
					o = ee(),
					s = Ze();
				return (
					(function jh(e, n, t, r, i, o, s) {
						const a = Ts(r),
							c = e.firstCreatePass && ch(e),
							u = n[be],
							g = lh(n);
						let f = !0;
						if (3 & r.type || s) {
							const h = It(r, n),
								m = s ? s(h) : h,
								v = g.length,
								A = s ? (O) => s(Ce(O[r.index])) : r.index;
							let S = null;
							if (
								(!s &&
									a &&
									(S = (function Ob(e, n, t, r) {
										const i = e.cleanup;
										if (null != i)
											for (let o = 0; o < i.length - 1; o += 2) {
												const s = i[o];
												if (s === t && i[o + 1] === r) {
													const a = n[xr],
														l = i[o + 2];
													return a.length > l ? a[l] : null;
												}
												"string" == typeof s && (o += 2);
											}
										return null;
									})(e, n, i, r.index)),
								null !== S)
							)
								((S.__ngLastListenerFn__ || S).__ngNextListenerFn__ = o),
									(S.__ngLastListenerFn__ = o),
									(f = !1);
							else {
								o = zh(r, n, u, o, !1);
								const O = t.listen(m, i, o);
								g.push(o, O), c && c.push(i, A, v, v + 1);
							}
						} else o = zh(r, n, u, o, !1);
						const C = r.outputs;
						let I;
						if (f && null !== C && (I = C[i])) {
							const h = I.length;
							if (h)
								for (let m = 0; m < h; m += 2) {
									const k = n[I[m]][I[m + 1]].subscribe(o),
										pe = g.length;
									g.push(o, k), c && c.push(i, r.index, pe, -(pe + 1));
								}
						}
					})(o, i, i[G], s, e, n, r),
					ot
				);
			}
			function $h(e, n, t, r) {
				try {
					return sn(6, n, t), !1 !== t(r);
				} catch (i) {
					return gh(e, i), !1;
				} finally {
					sn(7, n, t);
				}
			}
			function zh(e, n, t, r, i) {
				return function o(s) {
					if (s === Function) return r;
					Ao(e.componentOffset > -1 ? Dt(e.index, n) : n);
					let l = $h(n, t, r, s),
						c = o.__ngNextListenerFn__;
					for (; c; ) (l = $h(n, t, c, s) && l), (c = c.__ngNextListenerFn__);
					return i && !1 === l && s.preventDefault(), l;
				};
			}
			function D(e = 1) {
				return (function N0(e) {
					return (j.lFrame.contextLView = (function P0(e, n) {
						for (; e > 0; ) (n = n[Lr]), e--;
						return n;
					})(e, j.lFrame.contextLView))[be];
				})(e);
			}
			function Lb(e, n) {
				let t = null;
				const r = (function xD(e) {
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
						if (null === r ? mf(e, o, !0) : FD(r, o)) return i;
					} else t = i;
				}
				return t;
			}
			function Ir(e) {
				const n = w()[Te][Qe];
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
			function xn(e, n = 0, t) {
				const r = w(),
					i = ee(),
					o = ni(i, Q + e, 16, null, t || null);
				null === o.projection && (o.projection = n),
					rc(),
					(!r[vn] || Vr()) &&
						32 != (32 & o.flags) &&
						(function Ww(e, n, t) {
							tI(n[G], 0, n, t, Nc(e, t, n), ZC(t.parent || n[Qe], t, n));
						})(i, r, o);
			}
			function hr(e, n, t) {
				return Su(e, "", n, "", t), hr;
			}
			function Su(e, n, t, r, i) {
				const o = w(),
					s = ii(o, n, t, r);
				return s !== q && Et(ee(), ye(), o, e, s, o[G], i, !1), Su;
			}
			function Na(e, n) {
				return (e << 17) | (n << 2);
			}
			function Zn(e) {
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
			function Jh(e, n, t, r, i) {
				const o = e[t + 1],
					s = null === n;
				let a = r ? Zn(o) : pr(o),
					l = !1;
				for (; 0 !== a && (!1 === l || s); ) {
					const u = e[a + 1];
					Ub(e[a], n) && ((l = !0), (e[a + 1] = r ? Mu(u) : bu(u))), (a = r ? Zn(u) : pr(u));
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
			const Ue = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
			function ep(e) {
				return e.substring(Ue.key, Ue.keyEnd);
			}
			function jb(e) {
				return e.substring(Ue.value, Ue.valueEnd);
			}
			function tp(e, n) {
				const t = Ue.textEnd;
				return t === n
					? -1
					: ((n = Ue.keyEnd =
							(function Wb(e, n, t) {
								for (; n < t && e.charCodeAt(n) > 32; ) n++;
								return n;
							})(e, (Ue.key = n), t)),
					  di(e, n, t));
			}
			function np(e, n) {
				const t = Ue.textEnd;
				let r = (Ue.key = di(e, n, t));
				return t === r
					? -1
					: ((r = Ue.keyEnd =
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
					  (r = ip(e, r, t)),
					  (r = Ue.value = di(e, r, t)),
					  (r = Ue.valueEnd =
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
										? (a = s = op(e, l, s, t))
										: n === s - 4 && 85 === o && 82 === i && 76 === r && 40 === l
										? (a = s = op(e, 41, s, t))
										: l > 32 && (a = s),
										(o = i),
										(i = r),
										(r = -33 & l);
								}
								return a;
							})(e, r, t)),
					  ip(e, r, t));
			}
			function rp(e) {
				(Ue.key = 0), (Ue.keyEnd = 0), (Ue.value = 0), (Ue.valueEnd = 0), (Ue.textEnd = e.length);
			}
			function di(e, n, t) {
				for (; n < t && e.charCodeAt(n) <= 32; ) n++;
				return n;
			}
			function ip(e, n, t, r) {
				return (n = di(e, n, t)) < t && n++, n;
			}
			function op(e, n, t, r) {
				let i = -1,
					o = t;
				for (; o < r; ) {
					const s = e.charCodeAt(o++);
					if (s == n && 92 !== i) return o;
					i = 92 == s && 92 === i ? 0 : s;
				}
				throw new Error();
			}
			function fi(e, n, t) {
				return (
					(function Gt(e, n, t, r) {
						const i = w(),
							o = ee(),
							s = En(2);
						o.firstUpdatePass && lp(o, e, s, r),
							n !== q &&
								et(i, s, n) &&
								up(
									o,
									o.data[it()],
									i,
									i[G],
									e,
									(i[s + 1] = (function n1(e, n) {
										return (
											null == e ||
												"" === e ||
												("string" == typeof n
													? (e += n)
													: "object" == typeof e && (e = He(Kn(e)))),
											e
										);
									})(n, t)),
									r,
									s,
								);
					})(e, n, t, !1),
					fi
				);
			}
			function St(e) {
				qt(cp, Kb, e, !1);
			}
			function Kb(e, n) {
				for (
					let t = (function zb(e) {
						return rp(e), np(e, di(e, 0, Ue.textEnd));
					})(n);
					t >= 0;
					t = np(n, t)
				)
					cp(e, ep(n), jb(n));
			}
			function Me(e) {
				qt(e1, fn, e, !0);
			}
			function fn(e, n) {
				for (
					let t = (function $b(e) {
						return rp(e), tp(e, di(e, 0, Ue.textEnd));
					})(n);
					t >= 0;
					t = tp(n, t)
				)
					wt(e, ep(n), !0);
			}
			function qt(e, n, t, r) {
				const i = ee(),
					o = En(2);
				i.firstUpdatePass && lp(i, null, o, r);
				const s = w();
				if (t !== q && et(s, o, t)) {
					const a = i.data[it()];
					if (dp(a, r) && !ap(i, o)) {
						let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
						null !== l && (t = Hl(l, t || "")), Eu(i, a, s, t, r);
					} else
						!(function t1(e, n, t, r, i, o, s, a) {
							i === q && (i = re);
							let l = 0,
								c = 0,
								u = 0 < i.length ? i[0] : null,
								g = 0 < o.length ? o[0] : null;
							for (; null !== u || null !== g; ) {
								const f = l < i.length ? i[l + 1] : void 0,
									C = c < o.length ? o[c + 1] : void 0;
								let h,
									I = null;
								u === g
									? ((l += 2), (c += 2), f !== C && ((I = g), (h = C)))
									: null === g || (null !== u && u < g)
									? ((l += 2), (I = u))
									: ((c += 2), (I = g), (h = C)),
									null !== I && up(e, n, t, r, I, h, s, a),
									(u = l < i.length ? i[l] : null),
									(g = c < o.length ? o[c] : null);
							}
						})(
							i,
							a,
							s,
							s[G],
							s[o + 1],
							(s[o + 1] = (function Jb(e, n, t) {
								if (null == t || "" === t) return re;
								const r = [],
									i = Kn(t);
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
			function ap(e, n) {
				return n >= e.expandoStartIndex;
			}
			function lp(e, n, t, r) {
				const i = e.data;
				if (null === i[t + 1]) {
					const o = i[it()],
						s = ap(e, t);
					dp(o, r) && null === n && !s && (n = !1),
						(n = (function Zb(e, n, t, r) {
							const i = (function oc(e) {
								const n = j.lFrame.currentDirectiveIndex;
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
											if (0 !== pr(r)) return e[Zn(r)];
										})(e, n, r);
										void 0 !== l &&
											Array.isArray(l) &&
											((l = Nu(null, e, n, l[1], r)),
											(l = To(l, n.attrs, r)),
											(function Qb(e, n, t, r) {
												e[Zn(t ? n.classBindings : n.styleBindings)] = r;
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
								a = Zn(s),
								l = pr(s);
							e[r] = t;
							let u,
								c = !1;
							if (
								(Array.isArray(t) ? ((u = t[1]), (null === u || qr(t, u) > 0) && (c = !0)) : (u = t), i)
							)
								if (0 !== l) {
									const f = Zn(e[a + 1]);
									(e[r + 1] = Na(f, a)),
										0 !== f && (e[f + 1] = Tu(e[f + 1], r)),
										(e[a + 1] = (function kb(e, n) {
											return (131071 & e) | (n << 17);
										})(e[a + 1], r));
								} else (e[r + 1] = Na(a, 0)), 0 !== a && (e[a + 1] = Tu(e[a + 1], r)), (a = r);
							else (e[r + 1] = Na(l, 0)), 0 === a ? (a = r) : (e[l + 1] = Tu(e[l + 1], r)), (l = r);
							c && (e[r + 1] = bu(e[r + 1])),
								Jh(e, u, r, !0),
								Jh(e, u, r, !1),
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
			function cp(e, n, t) {
				wt(e, n, Kn(t));
			}
			function e1(e, n, t) {
				const r = String(n);
				"" !== r && !r.includes(" ") && wt(e, r, t);
			}
			function up(e, n, t, r, i, o, s, a) {
				if (!(3 & n.type)) return;
				const l = e.data,
					c = l[a + 1],
					u = (function Hb(e) {
						return 1 == (1 & e);
					})(c)
						? gp(l, n, t, i, pr(c), s)
						: void 0;
				Pa(u) ||
					(Pa(o) ||
						((function Fb(e) {
							return 2 == (2 & e);
						})(c) &&
							(o = gp(l, null, t, i, a, s))),
					(function qw(e, n, t, r, i) {
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
					})(r, s, Rs(it(), t), i, o));
			}
			function gp(e, n, t, r, i, o) {
				const s = null === n;
				let a;
				for (; i > 0; ) {
					const l = e[i],
						c = Array.isArray(l),
						u = c ? l[1] : l,
						g = null === u;
					let f = t[i + 1];
					f === q && (f = g ? re : void 0);
					let C = g ? pc(f, r) : u === r ? f : void 0;
					if ((c && !Pa(C) && (C = pc(l, r)), Pa(C) && ((a = C), s))) return a;
					const I = e[i + 1];
					i = s ? Zn(I) : pr(I);
				}
				if (null !== n) {
					let l = o ? n.residualClasses : n.residualStyles;
					null != l && (a = pc(l, r));
				}
				return a;
			}
			function Pa(e) {
				return void 0 !== e;
			}
			function dp(e, n) {
				return 0 != (e.flags & (n ? 8 : 16));
			}
			function Ft(e, n = "") {
				const t = w(),
					r = ee(),
					i = e + Q,
					o = r.firstCreatePass ? ni(r, i, 1, n, null) : r.data[i],
					s = fp(r, t, o, n, e);
				(t[i] = s), xs() && na(r, t, s, o), an(o, !1);
			}
			let fp = (e, n, t, r, i) => (
				qn(!0),
				(function Js(e, n) {
					return e.createText(n);
				})(n[G], r)
			);
			function Ci(e) {
				return Ar("", e, ""), Ci;
			}
			function Ar(e, n, t) {
				const r = w(),
					i = ii(r, e, n, t);
				return (
					i !== q &&
						(function Pn(e, n, t) {
							const r = Rs(n, e);
							!(function $C(e, n, t) {
								e.setValue(n, t);
							})(e[G], r, t);
						})(r, it(), i),
					Ar
				);
			}
			const hi = "en-US";
			let Lp = hi;
			class pi {}
			class aA {}
			class ku extends pi {
				constructor(n, t, r) {
					super(),
						(this._parent = t),
						(this._bootstrapComponents = []),
						(this.destroyCbs = []),
						(this.componentFactoryResolver = new ph(this));
					const i = _t(n);
					(this._bootstrapComponents = Mn(i.bootstrap)),
						(this._r3Injector = YI(
							n,
							t,
							[
								{ provide: pi, useValue: this },
								{ provide: Ia, useValue: this.componentFactoryResolver },
								...r,
							],
							He(n),
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
			class Hu extends aA {
				constructor(n) {
					super(), (this.moduleType = n);
				}
				create(n) {
					return new ku(this.moduleType, n, []);
				}
			}
			class lA extends pi {
				constructor(n) {
					super(), (this.componentFactoryResolver = new ph(this)), (this.instance = null);
					const t = new qc(
						[
							...n.providers,
							{ provide: pi, useValue: this },
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
				return new lA({ providers: e, parent: n, debugName: t, runEnvironmentInitializers: !0 }).injector;
			}
			let ST = (() => {
				class e {
					constructor(t) {
						(this._injector = t), (this.cachedInjectors = new Map());
					}
					getOrCreateStandaloneInjector(t) {
						if (!t.standalone) return null;
						if (!this.cachedInjectors.has(t)) {
							const r = mI(0, t.type),
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
				return (e.ɵprov = F({ token: e, providedIn: "environment", factory: () => new e(L(cn)) })), e;
			})();
			function Cn(e) {
				e.getStandaloneInjector = (n) => n.get(ST).getOrCreateStandaloneInjector(e);
			}
			function Oe(e, n, t, r) {
				return (function pA(e, n, t, r, i, o) {
					const s = n + t;
					return et(e, s, i) ? gn(e, s + 1, o ? r.call(o, i) : r(i)) : Oo(e, s + 1);
				})(w(), rt(), e, n, t, r);
			}
			function On(e, n, t, r, i) {
				return (function AA(e, n, t, r, i, o, s) {
					const a = n + t;
					return Cr(e, a, i, o) ? gn(e, a + 2, s ? r.call(s, i, o) : r(i, o)) : Oo(e, a + 2);
				})(w(), rt(), e, n, t, r, i);
			}
			function Uu(e, n, t, r, i, o) {
				return (function mA(e, n, t, r, i, o, s, a) {
					const l = n + t;
					return (function Ea(e, n, t, r, i) {
						const o = Cr(e, n, t, r);
						return et(e, n + 2, i) || o;
					})(e, l, i, o, s)
						? gn(e, l + 3, a ? r.call(a, i, o, s) : r(i, o, s))
						: Oo(e, l + 3);
				})(w(), rt(), e, n, t, r, i, o);
			}
			function hA(e, n, t, r, i, o, s) {
				return (function yA(e, n, t, r, i, o, s, a, l) {
					const c = n + t;
					return (function Lt(e, n, t, r, i, o) {
						const s = Cr(e, n, t, r);
						return Cr(e, n + 2, i, o) || s;
					})(e, c, i, o, s, a)
						? gn(e, c + 4, l ? r.call(l, i, o, s, a) : r(i, o, s, a))
						: Oo(e, c + 4);
				})(w(), rt(), e, n, t, r, i, o, s);
			}
			function Oo(e, n) {
				const t = e[n];
				return t === q ? void 0 : t;
			}
			function ju(e) {
				return (n) => {
					setTimeout(e, void 0, n);
				};
			}
			const ie = class qT extends Pt {
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
					return this._changes || (this._changes = new ie());
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
					(this._changesDetected = !(function Y0(e, n, t) {
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
			let In = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = QT), e;
			})();
			const ZT = In,
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
								4096 & this._declarationLView[W] ? 4096 : 16,
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
						return null !== c && (a[nn] = c.createEmbeddedView(s)), Au(s, a, n), new _o(a);
					}
				};
			function QT() {
				return Fa(Ze(), w());
			}
			function Fa(e, n) {
				return 4 & e.type ? new YT(n, e, Jr(e, n)) : null;
			}
			let Kt = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = iM), e;
			})();
			function iM() {
				return bA(Ze(), w());
			}
			const oM = Kt,
				EA = class extends oM {
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
						if (aC(n)) {
							const t = Hs(n, this._hostLView),
								r = ks(n);
							return new jr(t[M].data[r + 8], t);
						}
						return new jr(null, this._hostLView);
					}
					clear() {
						for (; this.length > 0; ) this.remove(this.length - 1);
					}
					get(n) {
						const t = SA(this._lContainer);
						return (null !== t && t[n]) || null;
					}
					get length() {
						return this._lContainer.length - Xe;
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
							const h = t || {};
							(a = h.index),
								(r = h.injector),
								(i = h.projectableNodes),
								(o = h.environmentInjector || h.ngModuleRef);
						}
						const l = s ? n : new vo(se(n)),
							c = r || this.parentInjector;
						if (!o && null == l.ngModule) {
							const m = (s ? c : this.parentInjector).get(cn, null);
							m && (o = m);
						}
						se(l.componentType ?? {});
						const C = l.create(c, i, null, o);
						return this.insertImpl(C.hostView, a, false), C;
					}
					insert(n, t) {
						return this.insertImpl(n, t, !1);
					}
					insertImpl(n, t, r) {
						const i = n._lView,
							o = i[M];
						if (
							(function C0(e) {
								return Ct(e[me]);
							})(i)
						) {
							const l = this.indexOf(n);
							if (-1 !== l) this.detach(l);
							else {
								const c = i[me],
									u = new EA(c, c[Qe], c[me]);
								u.detach(u.indexOf(n));
							}
						}
						const s = this._adjustIndex(t),
							a = this._lContainer;
						if (
							((function Vw(e, n, t, r) {
								const i = Xe + r,
									o = t.length;
								r > 0 && (t[i - 1][$t] = n),
									r < o - Xe ? ((n[$t] = t[i]), mC(t, Xe + r, n)) : (t.push(n), (n[$t] = null)),
									(n[me] = t);
								const s = n[Zi];
								null !== s &&
									t !== s &&
									(function Bw(e, n) {
										const t = e[kr];
										n[Te] !== n[me][me][Te] && (e[Sf] = !0), null === t ? (e[kr] = [n]) : t.push(n);
									})(s, n);
								const a = n[nn];
								null !== a && a.insertView(e), (n[W] |= 128);
							})(o, i, a, s),
							!r)
						) {
							const l = Rc(s, a),
								c = i[G],
								u = ta(c, a[rn]);
							null !== u &&
								(function Fw(e, n, t, r, i, o) {
									(r[Ve] = i), (r[Qe] = n), lo(e, r, t, 1, i, o);
								})(o, a[Qe], c, i, u, l);
						}
						return n.attachToViewContainerRef(), mC(Wu(a), s, n), n;
					}
					move(n, t) {
						return this.insert(n, t);
					}
					indexOf(n) {
						const t = SA(this._lContainer);
						return null !== t ? t.indexOf(n) : -1;
					}
					remove(n) {
						const t = this._adjustIndex(n, -1),
							r = Tc(this._lContainer, t);
						r && ($s(Wu(this._lContainer), t), WC(r[M], r));
					}
					detach(n) {
						const t = this._adjustIndex(n, -1),
							r = Tc(this._lContainer, t);
						return r && null != $s(Wu(this._lContainer), t) ? new _o(r) : null;
					}
					_adjustIndex(n, t = 0) {
						return n ?? this.length + t;
					}
				};
			function SA(e) {
				return e[8];
			}
			function Wu(e) {
				return e[8] || (e[8] = []);
			}
			function bA(e, n) {
				let t;
				const r = n[e.index];
				return (
					Ct(r) ? (t = r) : ((t = sh(r, n, null, e)), (n[e.index] = t), ya(n, t)),
					TA(t, n, e, r),
					new EA(t, e, n)
				);
			}
			let TA = function MA(e, n, t, r) {
				if (e[rn]) return;
				let i;
				(i =
					8 & t.type
						? Ce(r)
						: (function sM(e, n) {
								const t = e[G],
									r = t.createComment(""),
									i = It(n, e);
								return (
									gr(
										t,
										ta(t, i),
										r,
										(function zw(e, n) {
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
						null !== OA(n, t).matches && this.queries[t].setDirty();
				}
			}
			class NA {
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
						r === In
							? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
							: this.matchTNodeWithReadOption(n, t, Us(t, n, r, !1, !1));
				}
				matchTNodeWithReadOption(n, t, r) {
					if (null !== r) {
						const i = this.metadata.read;
						if (null !== i)
							if (i === Wt || i === Kt || (i === In && 4 & t.type)) this.addMatch(t.index, -2);
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
							return t === Wt ? Jr(n, e) : t === In ? Fa(n, e) : t === Kt ? bA(n, e) : void 0;
					  })(e, n, r)
					: ur(e, e[M], t, n);
			}
			function PA(e, n, t, r) {
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
					const s = PA(e, n, i, t);
					for (let a = 0; a < o.length; a += 2) {
						const l = o[a];
						if (l > 0) r.push(s[a / 2]);
						else {
							const c = o[a + 1],
								u = n[-l];
							for (let g = Xe; g < u.length; g++) {
								const f = u[g];
								f[Zi] === f[me] && Yu(f[M], f, c, r);
							}
							if (null !== u[kr]) {
								const g = u[kr];
								for (let f = 0; f < g.length; f++) {
									const C = g[f];
									Yu(C[M], C, c, r);
								}
							}
						}
					}
				}
				return r;
			}
			function bt(e) {
				const n = w(),
					t = ee(),
					r = Qf();
				sc(r + 1);
				const i = OA(t, r);
				if (
					e.dirty &&
					(function d0(e) {
						return 4 == (4 & e[W]);
					})(n) ===
						(2 == (2 & i.metadata.flags))
				) {
					if (null === i.matches) e.reset([]);
					else {
						const o = i.crossesNgTemplate ? Yu(t, n, r, []) : PA(t, n, i, r);
						e.reset(o, $E), e.notifyOnChanges();
					}
					return !0;
				}
				return !1;
			}
			function Ai(e, n, t) {
				const r = ee();
				r.firstCreatePass && (xA(r, new NA(e, n, t), -1), 2 == (2 & n) && (r.staticViewQueries = !0)),
					RA(r, w(), n);
			}
			function Yn(e, n, t, r) {
				const i = ee();
				if (i.firstCreatePass) {
					const o = Ze();
					xA(i, new NA(n, t, r), o.index),
						(function CM(e, n) {
							const t = e.contentQueries || (e.contentQueries = []);
							n !== (t.length ? t[t.length - 1] : -1) && t.push(e.queries.length - 1, n);
						})(i, e),
						2 == (2 & t) && (i.staticContentQueries = !0);
				}
				RA(i, w(), t);
			}
			function Tt() {
				return (function fM(e, n) {
					return e[nn].queries[n].queryList;
				})(w(), Qf());
			}
			function RA(e, n, t) {
				const r = new $u(4 == (4 & t));
				(function dS(e, n, t, r) {
					const i = lh(n);
					i.push(t), e.firstCreatePass && ch(e).push(r, i.length - 1);
				})(e, n, r, r.destroy),
					null === n[nn] && (n[nn] = new qu()),
					n[nn].queries.push(new Gu(r));
			}
			function xA(e, n, t) {
				null === e.queries && (e.queries = new Ku()), e.queries.track(new Zu(n, t));
			}
			function OA(e, n) {
				return e.queries.getByIndex(n);
			}
			function Fo(e, n) {
				return Fa(e, n);
			}
			const ng = new x("Application Initializer");
			let rg = (() => {
					class e {
						constructor() {
							(this.initialized = !1),
								(this.done = !1),
								(this.donePromise = new Promise((t, r) => {
									(this.resolve = t), (this.reject = r);
								})),
								(this.appInits = P(ng, { optional: !0 }) ?? []);
						}
						runInitializers() {
							if (this.initialized) return;
							const t = [];
							for (const i of this.appInits) {
								const o = i();
								if (Ma(o)) t.push(o);
								else if (Bh(o)) {
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				QA = (() => {
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})();
			const Ln = new x("LocaleId", {
				providedIn: "root",
				factory: () =>
					P(Ln, H.Optional | H.SkipSelf) ||
					(function LM() {
						return (typeof $localize < "u" && $localize.locale) || hi;
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class kM {
				constructor(n, t) {
					(this.ngModuleFactory = n), (this.componentFactories = t);
				}
			}
			let XA = (() => {
				class e {
					compileModuleSync(t) {
						return new Hu(t);
					}
					compileModuleAsync(t) {
						return Promise.resolve(this.compileModuleSync(t));
					}
					compileModuleAndAllComponentsSync(t) {
						const r = this.compileModuleSync(t),
							o = Mn(_t(t).declarations).reduce((s, a) => {
								const l = se(a);
								return l && s.push(new vo(l)), s;
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function tm(...e) {}
			class Ie {
				constructor({
					enableLongStackTrace: n = !1,
					shouldCoalesceEventChangeDetection: t = !1,
					shouldCoalesceRunChangeDetection: r = !1,
				}) {
					if (
						((this.hasPendingMacrotasks = !1),
						(this.hasPendingMicrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new ie(!1)),
						(this.onMicrotaskEmpty = new ie(!1)),
						(this.onStable = new ie(!1)),
						(this.onError = new ie(!1)),
						typeof Zone > "u")
					)
						throw new E(908, !1);
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
							const e = "function" == typeof de.requestAnimationFrame;
							let n = de[e ? "requestAnimationFrame" : "setTimeout"],
								t = de[e ? "cancelAnimationFrame" : "clearTimeout"];
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
										((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(de, () => {
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
										return nm(e), t.invokeTask(i, o, s, a);
									} finally {
										((e.shouldCoalesceEventChangeDetection && "eventTask" === o.type) ||
											e.shouldCoalesceRunChangeDetection) &&
											n(),
											rm(e);
									}
								},
								onInvoke: (t, r, i, o, s, a, l) => {
									try {
										return nm(e), t.invoke(i, o, s, a, l);
									} finally {
										e.shouldCoalesceRunChangeDetection && n(), rm(e);
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
					if (!Ie.isInAngularZone()) throw new E(909, !1);
				}
				static assertNotInAngularZone() {
					if (Ie.isInAngularZone()) throw new E(909, !1);
				}
				run(n, t, r) {
					return this._inner.run(n, t, r);
				}
				runTask(n, t, r, i) {
					const o = this._inner,
						s = o.scheduleEventTask("NgZoneEvent: " + i, n, UM, tm, tm);
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
			function nm(e) {
				e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
			}
			function rm(e) {
				e._nesting--, ig(e);
			}
			class zM {
				constructor() {
					(this.hasPendingMicrotasks = !1),
						(this.hasPendingMacrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new ie()),
						(this.onMicrotaskEmpty = new ie()),
						(this.onStable = new ie()),
						(this.onError = new ie());
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
			const im = new x("", { providedIn: "root", factory: om });
			function om() {
				const e = P(Ie);
				let n = !0;
				return (function cD(...e) {
					const n = ji(e),
						t = (function nD(e, n) {
							return "number" == typeof Fl(e) ? e.pop() : n;
						})(e, 1 / 0),
						r = e;
					return r.length ? (1 === r.length ? Bt(r[0]) : Nr(t)(We(r, n))) : Jt;
				})(
					new Re((i) => {
						(n = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
							e.runOutsideAngular(() => {
								i.next(n), i.complete();
							});
					}),
					new Re((i) => {
						let o;
						e.runOutsideAngular(() => {
							o = e.onStable.subscribe(() => {
								Ie.assertNotInAngularZone(),
									queueMicrotask(() => {
										!n &&
											!e.hasPendingMacrotasks &&
											!e.hasPendingMicrotasks &&
											((n = !0), i.next(!0));
									});
							});
						});
						const s = e.onUnstable.subscribe(() => {
							Ie.assertInAngularZone(),
								n &&
									((n = !1),
									e.runOutsideAngular(() => {
										i.next(!1);
									}));
						});
						return () => {
							o.unsubscribe(), s.unsubscribe();
						};
					}).pipe(ef()),
				);
			}
			const sm = new x(""),
				Va = new x("");
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
											Ie.assertNotInAngularZone(),
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
							return new (t || e)(L(Ie), L(ag), L(Va));
						}),
						(e.ɵprov = F({ token: e, factory: e.ɵfac })),
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})(),
				Qn = null;
			const am = new x("AllowMultipleToken"),
				cg = new x("PlatformDestroyListeners"),
				ug = new x("appBootstrapListener");
			class cm {
				constructor(n, t) {
					(this.name = n), (this.token = t);
				}
			}
			function gm(e, n, t = []) {
				const r = `Platform: ${n}`,
					i = new x(r);
				return (o = []) => {
					let s = gg();
					if (!s || s.injector.get(am, !1)) {
						const a = [...t, ...o, { provide: i, useValue: !0 }];
						e
							? e(a)
							: (function KM(e) {
									if (Qn && !Qn.get(am, !1)) throw new E(400, !1);
									(function lm() {
										!(function t0(e) {
											Rf = e;
										})(() => {
											throw new E(600, !1);
										});
									})(),
										(Qn = e);
									const n = e.get(fm);
									(function um(e) {
										e.get(wI, null)?.forEach((t) => t());
									})(e);
							  })(
									(function dm(e = [], n) {
										return Nn.create({
											name: n,
											providers: [
												{ provide: Wc, useValue: "platform" },
												{ provide: cg, useValue: new Set([() => (Qn = null)]) },
												...e,
											],
										});
									})(a, r),
							  );
					}
					return (function YM(e) {
						const n = gg();
						if (!n) throw new E(401, !1);
						return n;
					})();
				};
			}
			function gg() {
				return Qn?.get(fm) ?? null;
			}
			let fm = (() => {
				class e {
					constructor(t) {
						(this._injector = t),
							(this._modules = []),
							(this._destroyListeners = []),
							(this._destroyed = !1);
					}
					bootstrapModuleFactory(t, r) {
						const i = (function QM(e = "zone.js", n) {
							return "noop" === e ? new zM() : "zone.js" === e ? new Ie(n) : e;
						})(
							r?.ngZone,
							(function Cm(e) {
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
									(function mm(e) {
										return [
											{ provide: Ie, useFactory: e },
											{
												provide: Co,
												multi: !0,
												useFactory: () => {
													const n = P(JM, { optional: !0 });
													return () => n.initialize();
												},
											},
											{ provide: Am, useFactory: XM },
											{ provide: im, useFactory: om },
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
								(function Im(e, n, t) {
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
												(function Fp(e) {
													xt(e, "Expected localeId to be defined"),
														"string" == typeof e &&
															(Lp = e.toLowerCase().replace(/_/g, "-"));
												})(o.injector.get(Ln, hi) || hi),
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
						const i = hm({}, r);
						return (function GM(e, n, t) {
							const r = new Hu(t);
							return Promise.resolve(r);
						})(0, 0, t).then((o) => this.bootstrapModuleFactory(o, i));
					}
					_moduleDoBootstrap(t) {
						const r = t.injector.get(_i);
						if (t._bootstrapComponents.length > 0) t._bootstrapComponents.forEach((i) => r.bootstrap(i));
						else {
							if (!t.instance.ngDoBootstrap) throw new E(-403, !1);
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
						if (this._destroyed) throw new E(404, !1);
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
						return new (t || e)(L(Nn));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "platform" })),
					e
				);
			})();
			function hm(e, n) {
				return Array.isArray(n) ? n.reduce(hm, e) : { ...e, ...n };
			}
			let _i = (() => {
				class e {
					constructor() {
						(this._bootstrapListeners = []),
							(this._runningTick = !1),
							(this._destroyed = !1),
							(this._destroyListeners = []),
							(this._views = []),
							(this.internalErrorHandler = P(Am)),
							(this.zoneIsStable = P(im)),
							(this.componentTypes = []),
							(this.components = []),
							(this.isStable = P(Ha).hasPendingTasks.pipe(
								Ut((t) => (t ? U(!1) : this.zoneIsStable)),
								(function uD(e, n = Un) {
									return (
										(e = e ?? gD),
										$e((t, r) => {
											let i,
												o = !0;
											t.subscribe(
												ze(r, (s) => {
													const a = n(s);
													(o || !e(i, a)) && ((o = !1), (i = a), r.next(s));
												}),
											);
										})
									);
								})(),
								ef(),
							)),
							(this._injector = P(cn));
					}
					get destroyed() {
						return this._destroyed;
					}
					get injector() {
						return this._injector;
					}
					bootstrap(t, r) {
						const i = t instanceof PI;
						if (!this._injector.get(rg).done)
							throw (
								(!i &&
									(function Rr(e) {
										const n = se(e) || Ye(e) || ft(e);
										return null !== n && n.standalone;
									})(t),
								new E(405, !1))
							);
						let s;
						(s = i ? t : this._injector.get(Ia).resolveComponentFactory(t)),
							this.componentTypes.push(s.componentType);
						const a = (function qM(e) {
								return e.isBoundToModule;
							})(s)
								? void 0
								: this._injector.get(pi),
							c = s.create(Nn.NULL, [], r || s.selector, a),
							u = c.location.nativeElement,
							g = c.injector.get(sm, null);
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
						if (this._runningTick) throw new E(101, !1);
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
						if (this._destroyed) throw new E(406, !1);
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function Ba(e, n) {
				const t = e.indexOf(n);
				t > -1 && e.splice(t, 1);
			}
			const Am = new x("", { providedIn: "root", factory: () => P(fr).handleError.bind(void 0) });
			function XM() {
				const e = P(Ie),
					n = P(fr);
				return (t) => e.runOutsideAngular(() => n.handleError(t));
			}
			let JM = (() => {
				class e {
					constructor() {
						(this.zone = P(Ie)), (this.applicationRef = P(_i));
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			let Ho = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = tN), e;
			})();
			function tN(e) {
				return (function nN(e, n, t) {
					if (ar(e) && !t) {
						const r = Dt(e.index, n);
						return new _o(r, r);
					}
					return 47 & e.type ? new _o(n[Te], n) : null;
				})(Ze(), w(), 16 == (16 & e));
			}
			class Dm {
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
						const s = !r || (t && t.currentIndex < Em(r, i, o)) ? t : r,
							a = Em(s, i, o),
							l = s.currentIndex;
						if (s === r) i--, (r = r._nextRemoved);
						else if (((t = t._next), null == s.previousIndex)) i++;
						else {
							o || (o = []);
							const c = a - i,
								u = l - i;
							if (c != u) {
								for (let f = 0; f < c; f++) {
									const C = f < o.length ? o[f] : (o[f] = 0),
										I = C + f;
									u <= I && I < c && (o[f] = C + 1);
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
					if ((null == n && (n = []), !wa(n))) throw new E(900, !1);
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
						null === this._linkedRecords && (this._linkedRecords = new wm()),
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
						null === this._unlinkedRecords && (this._unlinkedRecords = new wm()),
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
			class wm {
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
			function Em(e, n, t) {
				const r = e.previousIndex;
				if (null === r) return r;
				let i = 0;
				return t && r < t.length && (i = t[r]), r + n + i;
			}
			class Sm {
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
						if (!(n instanceof Map || mu(n))) throw new E(900, !1);
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
			function bm() {
				return new $a([new Dm()]);
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
							useFactory: (r) => e.create(t, r || bm()),
							deps: [[e, new Gs(), new Ws()]],
						};
					}
					find(t) {
						const r = this.factories.find((i) => i.supports(t));
						if (null != r) return r;
						throw new E(901, !1);
					}
				}
				return (e.ɵprov = F({ token: e, providedIn: "root", factory: bm })), e;
			})();
			function Tm() {
				return new Vo([new Sm()]);
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
							useFactory: (r) => e.create(t, r || Tm()),
							deps: [[e, new Gs(), new Ws()]],
						};
					}
					find(t) {
						const r = this.factories.find((i) => i.supports(t));
						if (r) return r;
						throw new E(901, !1);
					}
				}
				return (e.ɵprov = F({ token: e, providedIn: "root", factory: Tm })), e;
			})();
			const IN = gm(null, "core", []);
			let hN = (() => {
				class e {
					constructor(t) {}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(L(_i));
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = nt({})),
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
			const lt = new x("DocumentToken");
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
					(e.ɵprov = F({
						token: e,
						factory: function () {
							return P(NN);
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			const MN = new x("Location Initialized");
			let NN = (() => {
				class e extends yg {
					constructor() {
						super(),
							(this._doc = P(lt)),
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
					(e.ɵprov = F({
						token: e,
						factory: function () {
							return new e();
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			function _g(e, n) {
				if (0 == e.length) return n;
				if (0 == n.length) return e;
				let t = 0;
				return (
					e.endsWith("/") && t++,
					n.startsWith("/") && t++,
					2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
				);
			}
			function Lm(e) {
				const n = e.match(/#|\?|$/),
					t = (n && n.index) || e.length;
				return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
			}
			function Fn(e) {
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
					(e.ɵprov = F({
						token: e,
						factory: function () {
							return P(km);
						},
						providedIn: "root",
					})),
					e
				);
			})();
			const Fm = new x("appBaseHref");
			let km = (() => {
					class e extends _r {
						constructor(t, r) {
							super(),
								(this._platformLocation = t),
								(this._removeListenerFns = []),
								(this._baseHref =
									r ?? this._platformLocation.getBaseHrefFromDOM() ?? P(lt).location?.origin ?? "");
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
							return _g(this._baseHref, t);
						}
						path(t = !1) {
							const r = this._platformLocation.pathname + Fn(this._platformLocation.search),
								i = this._platformLocation.hash;
							return i && t ? `${r}${i}` : r;
						}
						pushState(t, r, i, o) {
							const s = this.prepareExternalUrl(i + Fn(o));
							this._platformLocation.pushState(t, r, s);
						}
						replaceState(t, r, i, o) {
							const s = this.prepareExternalUrl(i + Fn(o));
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
							return new (t || e)(L(yg), L(Fm, 8));
						}),
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				PN = (() => {
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
							const r = _g(this._baseHref, t);
							return r.length > 0 ? "#" + r : r;
						}
						pushState(t, r, i, o) {
							let s = this.prepareExternalUrl(i + Fn(o));
							0 == s.length && (s = this._platformLocation.pathname),
								this._platformLocation.pushState(t, r, s);
						}
						replaceState(t, r, i, o) {
							let s = this.prepareExternalUrl(i + Fn(o));
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
							return new (t || e)(L(yg), L(Fm, 8));
						}),
						(e.ɵprov = F({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				vg = (() => {
					class e {
						constructor(t) {
							(this._subject = new ie()),
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
							})(Lm(Hm(r)))),
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
							return this.path() == this.normalize(t + Fn(r));
						}
						normalize(t) {
							return e.stripTrailingSlash(
								(function xN(e, n) {
									if (!e || !n.startsWith(e)) return n;
									const t = n.substring(e.length);
									return "" === t || ["/", ";", "?", "#"].includes(t[0]) ? t : n;
								})(this._basePath, Hm(t)),
							);
						}
						prepareExternalUrl(t) {
							return t && "/" !== t[0] && (t = "/" + t), this._locationStrategy.prepareExternalUrl(t);
						}
						go(t, r = "", i = null) {
							this._locationStrategy.pushState(i, "", t, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(t + Fn(r)), i);
						}
						replaceState(t, r = "", i = null) {
							this._locationStrategy.replaceState(i, "", t, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(t + Fn(r)), i);
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
						(e.normalizeQueryParams = Fn),
						(e.joinWithSlash = _g),
						(e.stripTrailingSlash = Lm),
						(e.ɵfac = function (t) {
							return new (t || e)(L(_r));
						}),
						(e.ɵprov = F({
							token: e,
							factory: function () {
								return (function RN() {
									return new vg(L(_r));
								})();
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function Hm(e) {
				return e.replace(/\/index.html$/, "");
			}
			function qm(e, n) {
				n = encodeURIComponent(n);
				for (const t of e.split(";")) {
					const r = t.indexOf("="),
						[i, o] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
					if (i.trim() === n) return decodeURIComponent(o);
				}
				return null;
			}
			const Rg = /\s+/,
				Km = [];
			let Di = (() => {
				class e {
					constructor(t, r, i, o) {
						(this._iterableDiffers = t),
							(this._keyValueDiffers = r),
							(this._ngEl = i),
							(this._renderer = o),
							(this.initialClasses = Km),
							(this.stateMap = new Map());
					}
					set klass(t) {
						this.initialClasses = null != t ? t.trim().split(Rg) : Km;
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
						return new (t || e)(b($a), b(Vo), b(Wt), b(ei));
					}),
					(e.ɵdir = Ke({
						type: e,
						selectors: [["", "ngClass", ""]],
						inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
						standalone: !0,
					})),
					e
				);
			})();
			class AP {
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
									new AP(i.item, this._ngForOf, -1, -1),
									null === s ? void 0 : s,
								);
							else if (null == s) r.remove(null === o ? void 0 : o);
							else if (null !== o) {
								const a = r.get(o);
								r.move(a, s), Ym(a, i);
							}
						});
						for (let i = 0, o = r.length; i < o; i++) {
							const a = r.get(i).context;
							(a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
						}
						t.forEachIdentityChange((i) => {
							Ym(r.get(i.currentIndex), i);
						});
					}
					static ngTemplateContextGuard(t, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(b(Kt), b(In), b($a));
					}),
					(e.ɵdir = Ke({
						type: e,
						selectors: [["", "ngFor", "", "ngForOf", ""]],
						inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" },
						standalone: !0,
					})),
					e
				);
			})();
			function Ym(e, n) {
				e.context.$implicit = n.item;
			}
			let wi = (() => {
				class e {
					constructor(t, r) {
						(this._viewContainer = t),
							(this._context = new mP()),
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
						Qm("ngIfThen", t), (this._thenTemplateRef = t), (this._thenViewRef = null), this._updateView();
					}
					set ngIfElse(t) {
						Qm("ngIfElse", t), (this._elseTemplateRef = t), (this._elseViewRef = null), this._updateView();
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
						return new (t || e)(b(Kt), b(In));
					}),
					(e.ɵdir = Ke({
						type: e,
						selectors: [["", "ngIf", ""]],
						inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
						standalone: !0,
					})),
					e
				);
			})();
			class mP {
				constructor() {
					(this.$implicit = null), (this.ngIf = null);
				}
			}
			function Qm(e, n) {
				if (n && !n.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${He(n)}'.`);
			}
			let Ei = (() => {
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
							return new (t || e)(b(Wt), b(Vo), b(ei));
						}),
						(e.ɵdir = Ke({
							type: e,
							selectors: [["", "ngStyle", ""]],
							inputs: { ngStyle: "ngStyle" },
							standalone: !0,
						})),
						e
					);
				})(),
				Si = (() => {
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
							return new (t || e)(b(Kt));
						}),
						(e.ɵdir = Ke({
							type: e,
							selectors: [["", "ngTemplateOutlet", ""]],
							inputs: {
								ngTemplateOutletContext: "ngTemplateOutletContext",
								ngTemplateOutlet: "ngTemplateOutlet",
								ngTemplateOutletInjector: "ngTemplateOutletInjector",
							},
							standalone: !0,
							features: [Dn],
						})),
						e
					);
				})(),
				Xn = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = nt({})),
						e
					);
				})();
			const ey = "browser";
			function kg(e) {
				return e === ey;
			}
			function ty(e) {
				return "server" === e;
			}
			let KP = (() => {
				class e {}
				return (e.ɵprov = F({ token: e, providedIn: "root", factory: () => new ZP(L(lt), window) })), e;
			})();
			class ZP {
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
					const t = (function YP(e, n) {
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
						const n = ny(this.window.history) || ny(Object.getPrototypeOf(this.window.history));
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
			function ny(e) {
				return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
			}
			class ry {}
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
						: (function _R(e) {
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
					return qm(document.cookie, n);
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			const Ug = new x("EventManagerPlugins");
			let ly = (() => {
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
						if (((r = this._plugins.find((o) => o.supports(t))), !r)) throw new E(5101, !1);
						return this._eventNameToPlugin.set(t, r), r;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(L(Ug), L(Ie));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class cy {
				constructor(n) {
					this._doc = n;
				}
			}
			const jg = "ng-app-id";
			let uy = (() => {
				class e {
					constructor(t, r, i, o = {}) {
						(this.doc = t),
							(this.appId = r),
							(this.nonce = i),
							(this.platformId = o),
							(this.styleRef = new Map()),
							(this.hostNodes = new Set()),
							(this.styleNodesInDOM = this.collectServerRenderedStyles()),
							(this.platformIsServer = ty(o)),
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
						return new (t || e)(L(lt), L(ua), L(EI, 8), L(Tn));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
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
				bR = new x("RemoveStylesOnCompDestroy", { providedIn: "root", factory: () => !1 });
			function dy(e, n) {
				return n.map((t) => t.replace(zg, e));
			}
			let fy = (() => {
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
							(this.platformIsServer = ty(a)),
							(this.defaultRenderer = new Wg(t, s, l, this.platformIsServer));
					}
					createRenderer(t, r) {
						if (!t || !r) return this.defaultRenderer;
						this.platformIsServer &&
							r.encapsulation === yt.ShadowDom &&
							(r = { ...r, encapsulation: yt.Emulated });
						const i = this.getOrCreateRenderer(t, r);
						return i instanceof Iy ? i.applyToHost(t) : i instanceof Gg && i.applyStyles(), i;
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
									o = new Iy(l, c, r, this.appId, u, s, a, g);
									break;
								case yt.ShadowDom:
									return new PR(l, c, t, r, s, a, this.nonce, g);
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
						return new (t || e)(L(ly), L(uy), L(ua), L(bR), L(lt), L(Tn), L(Ie), L(EI));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
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
					(Cy(n) ? n.content : n).appendChild(t);
				}
				insertBefore(n, t, r) {
					n && (Cy(n) ? n.content : n).insertBefore(t, r);
				}
				removeChild(n, t) {
					n && n.removeChild(t);
				}
				selectRootElement(n, t) {
					let r = "string" == typeof n ? this.doc.querySelector(n) : n;
					if (!r) throw new E(-5104, !1);
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
			function Cy(e) {
				return "TEMPLATE" === e.tagName && void 0 !== e.content;
			}
			class PR extends Wg {
				constructor(n, t, r, i, o, s, a, l) {
					super(n, o, s, l),
						(this.sharedStylesHost = t),
						(this.hostEl = r),
						(this.shadowRoot = r.attachShadow({ mode: "open" })),
						this.sharedStylesHost.addHost(this.shadowRoot);
					const c = dy(i.id, i.styles);
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
						(this.styles = l ? dy(l, r.styles) : r.styles);
				}
				applyStyles() {
					this.sharedStylesHost.addStyles(this.styles);
				}
				destroy() {
					this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
				}
			}
			class Iy extends Gg {
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
				class e extends cy {
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
						return new (t || e)(L(lt));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const hy = ["alt", "control", "meta", "shift"],
				xR = {
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
				class e extends cy {
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
							hy.forEach((c) => {
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
						let i = xR[t.key] || t.key,
							o = "";
						return (
							r.indexOf("code.") > -1 && ((i = t.code), (o = "code.")),
							!(null == i || !i) &&
								((i = i.toLowerCase()),
								" " === i ? (i = "space") : "." === i && (i = "dot"),
								hy.forEach((s) => {
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
						return new (t || e)(L(lt));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const VR = gm(IN, "browser", [
					{ provide: Tn, useValue: ey },
					{
						provide: wI,
						useValue: function FR() {
							Bg.makeCurrent();
						},
						multi: !0,
					},
					{
						provide: lt,
						useFactory: function HR() {
							return (
								(function Xw(e) {
									Lc = e;
								})(document),
								document
							);
						},
						deps: [],
					},
				]),
				BR = new x(""),
				my = [
					{
						provide: Va,
						useClass: class vR {
							addToWindow(n) {
								(de.getAngularTestability = (r, i = !0) => {
									const o = n.findTestabilityInTree(r, i);
									if (null == o) throw new E(5103, !1);
									return o;
								}),
									(de.getAllAngularTestabilities = () => n.getAllTestabilities()),
									(de.getAllAngularRootElements = () => n.getAllRootElements()),
									de.frameworkStabilizers || (de.frameworkStabilizers = []),
									de.frameworkStabilizers.push((r) => {
										const i = de.getAllAngularTestabilities();
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
					{ provide: sm, useClass: sg, deps: [Ie, ag, Va] },
					{ provide: sg, useClass: sg, deps: [Ie, ag, Va] },
				],
				yy = [
					{ provide: Wc, useValue: "root" },
					{
						provide: fr,
						useFactory: function kR() {
							return new fr();
						},
						deps: [],
					},
					{ provide: Ug, useClass: RR, multi: !0, deps: [lt, Ie, Tn] },
					{ provide: Ug, useClass: LR, multi: !0, deps: [lt] },
					fy,
					uy,
					ly,
					{ provide: xI, useExisting: fy },
					{ provide: ry, useClass: DR, deps: [] },
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
							return new (t || e)(L(BR, 12));
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = nt({ providers: [...yy, ...my], imports: [Xn, hN] })),
						e
					);
				})(),
				_y = (() => {
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
							return new (t || e)(L(lt));
						}),
						(e.ɵprov = F({
							token: e,
							factory: function (t) {
								let r = null;
								return (
									(r = t
										? new t()
										: (function $R() {
												return new _y(L(lt));
										  })()),
									r
								);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function bi(e, n) {
				return ge(n) ? qe(e, n, 1) : qe(e, 1);
			}
			function Hn(e, n) {
				return $e((t, r) => {
					let i = 0;
					t.subscribe(ze(r, (o) => e.call(n, o, i++) && r.next(o)));
				});
			}
			function zo(e) {
				return $e((n, t) => {
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
			class hn {
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
						(this.lazyInit instanceof hn ? this.copyFrom(this.lazyInit) : this.lazyInit(),
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
					const t = new hn();
					return (
						(t.lazyInit = this.lazyInit && this.lazyInit instanceof hn ? this.lazyInit : this),
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
					return Ey(n);
				}
				encodeValue(n) {
					return Ey(n);
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
			function Ey(e) {
				return encodeURIComponent(e).replace(YR, (n, t) => QR[t] ?? n);
			}
			function sl(e) {
				return `${e}`;
			}
			class er {
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
					const t = new er({ encoder: this.encoder });
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
			function Sy(e) {
				return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
			}
			function by(e) {
				return typeof Blob < "u" && e instanceof Blob;
			}
			function Ty(e) {
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
						this.headers || (this.headers = new hn()),
						this.context || (this.context = new XR()),
						this.params)
					) {
						const s = this.params.toString();
						if (0 === s.length) this.urlWithParams = t;
						else {
							const a = t.indexOf("?");
							this.urlWithParams = t + (-1 === a ? "?" : a < t.length - 1 ? "&" : "") + s;
						}
					} else (this.params = new er()), (this.urlWithParams = t);
				}
				serializeBody() {
					return null === this.body
						? null
						: Sy(this.body) ||
						  by(this.body) ||
						  Ty(this.body) ||
						  (function ex(e) {
								return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
						  })(this.body) ||
						  "string" == typeof this.body
						? this.body
						: this.body instanceof er
						? this.body.toString()
						: "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body)
						? JSON.stringify(this.body)
						: this.body.toString();
				}
				detectContentTypeHeader() {
					return null === this.body || Ty(this.body)
						? null
						: by(this.body)
						? this.body.type || null
						: Sy(this.body)
						? null
						: "string" == typeof this.body
						? "text/plain"
						: this.body instanceof er
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
							(l = Object.keys(n.setHeaders).reduce((g, f) => g.set(f, n.setHeaders[f]), l)),
						n.setParams && (c = Object.keys(n.setParams).reduce((g, f) => g.set(f, n.setParams[f]), c)),
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
			var ke = (() => (
				((ke = ke || {})[(ke.Sent = 0)] = "Sent"),
				(ke[(ke.UploadProgress = 1)] = "UploadProgress"),
				(ke[(ke.ResponseHeader = 2)] = "ResponseHeader"),
				(ke[(ke.DownloadProgress = 3)] = "DownloadProgress"),
				(ke[(ke.Response = 4)] = "Response"),
				(ke[(ke.User = 5)] = "User"),
				ke
			))();
			class Kg {
				constructor(n, t = 200, r = "OK") {
					(this.headers = n.headers || new hn()),
						(this.status = void 0 !== n.status ? n.status : t),
						(this.statusText = n.statusText || r),
						(this.url = n.url || null),
						(this.ok = this.status >= 200 && this.status < 300);
				}
			}
			class Zg extends Kg {
				constructor(n = {}) {
					super(n), (this.type = ke.ResponseHeader);
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
			class Ti extends Kg {
				constructor(n = {}) {
					super(n), (this.type = ke.Response), (this.body = void 0 !== n.body ? n.body : null);
				}
				clone(n = {}) {
					return new Ti({
						body: void 0 !== n.body ? n.body : this.body,
						headers: n.headers || this.headers,
						status: void 0 !== n.status ? n.status : this.status,
						statusText: n.statusText || this.statusText,
						url: n.url || this.url || void 0,
					});
				}
			}
			class My extends Kg {
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
			let Ny = (() => {
				class e {
					constructor(t) {
						this.handler = t;
					}
					request(t, r, i = {}) {
						let o;
						if (t instanceof Wo) o = t;
						else {
							let l, c;
							(l = i.headers instanceof hn ? i.headers : new hn(i.headers)),
								i.params && (c = i.params instanceof er ? i.params : new er({ fromObject: i.params })),
								(o = new Wo(t, r, void 0 !== i.body ? i.body : null, {
									headers: l,
									context: i.context,
									params: c,
									reportProgress: i.reportProgress,
									responseType: i.responseType || "json",
									withCredentials: i.withCredentials,
								}));
						}
						const s = U(o).pipe(bi((l) => this.handler.handle(l)));
						if (t instanceof Wo || "events" === i.observe) return s;
						const a = s.pipe(Hn((l) => l instanceof Ti));
						switch (i.observe || "body") {
							case "body":
								switch (o.responseType) {
									case "arraybuffer":
										return a.pipe(
											ae((l) => {
												if (null !== l.body && !(l.body instanceof ArrayBuffer))
													throw new Error("Response is not an ArrayBuffer.");
												return l.body;
											}),
										);
									case "blob":
										return a.pipe(
											ae((l) => {
												if (null !== l.body && !(l.body instanceof Blob))
													throw new Error("Response is not a Blob.");
												return l.body;
											}),
										);
									case "text":
										return a.pipe(
											ae((l) => {
												if (null !== l.body && "string" != typeof l.body)
													throw new Error("Response is not a string.");
												return l.body;
											}),
										);
									default:
										return a.pipe(ae((l) => l.body));
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
							params: new er().append(r, "JSONP_CALLBACK"),
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
						return new (t || e)(L(il));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function xy(e, n) {
				return n(e);
			}
			function nx(e, n) {
				return (t, r) => n.intercept(t, { handle: (i) => e(i, r) });
			}
			const ix = new x(""),
				Go = new x(""),
				Oy = new x("");
			function ox() {
				let e = null;
				return (n, t) => {
					null === e && (e = (P(ix, { optional: !0 }) ?? []).reduceRight(nx, xy));
					const r = P(Ha),
						i = r.add();
					return e(n, t).pipe(zo(() => r.remove(i)));
				};
			}
			let Ly = (() => {
				class e extends il {
					constructor(t, r) {
						super(),
							(this.backend = t),
							(this.injector = r),
							(this.chain = null),
							(this.pendingTasks = P(Ha));
					}
					handle(t) {
						if (null === this.chain) {
							const i = Array.from(new Set([...this.injector.get(Go), ...this.injector.get(Oy, [])]));
							this.chain = i.reduceRight(
								(o, s) =>
									(function rx(e, n, t) {
										return (r, i) => t.runInContext(() => n(r, (o) => e(o, i)));
									})(o, s, this.injector),
								xy,
							);
						}
						const r = this.pendingTasks.add();
						return this.chain(t, (i) => this.backend.handle(i)).pipe(zo(() => this.pendingTasks.remove(r)));
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(L(ol), L(cn));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const cx = /^\)\]\}',?\n/;
			let ky = (() => {
				class e {
					constructor(t) {
						this.xhrFactory = t;
					}
					handle(t) {
						if ("JSONP" === t.method) throw new E(-2800, !1);
						const r = this.xhrFactory;
						return (r.ɵloadImpl ? We(r.ɵloadImpl()) : U(null)).pipe(
							Ut(
								() =>
									new Re((o) => {
										const s = r.build();
										if (
											(s.open(t.method, t.urlWithParams),
											t.withCredentials && (s.withCredentials = !0),
											t.headers.forEach((h, m) => s.setRequestHeader(h, m.join(","))),
											t.headers.has("Accept") ||
												s.setRequestHeader("Accept", "application/json, text/plain, */*"),
											!t.headers.has("Content-Type"))
										) {
											const h = t.detectContentTypeHeader();
											null !== h && s.setRequestHeader("Content-Type", h);
										}
										if (t.responseType) {
											const h = t.responseType.toLowerCase();
											s.responseType = "json" !== h ? h : "text";
										}
										const a = t.serializeBody();
										let l = null;
										const c = () => {
												if (null !== l) return l;
												const h = s.statusText || "OK",
													m = new hn(s.getAllResponseHeaders()),
													v =
														(function ux(e) {
															return "responseURL" in e && e.responseURL
																? e.responseURL
																: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
																? e.getResponseHeader("X-Request-URL")
																: null;
														})(s) || t.url;
												return (
													(l = new Zg({
														headers: m,
														status: s.status,
														statusText: h,
														url: v,
													})),
													l
												);
											},
											u = () => {
												let { headers: h, status: m, statusText: v, url: A } = c(),
													S = null;
												204 !== m &&
													(S = typeof s.response > "u" ? s.responseText : s.response),
													0 === m && (m = S ? 200 : 0);
												let O = m >= 200 && m < 300;
												if ("json" === t.responseType && "string" == typeof S) {
													const k = S;
													S = S.replace(cx, "");
													try {
														S = "" !== S ? JSON.parse(S) : null;
													} catch (pe) {
														(S = k), O && ((O = !1), (S = { error: pe, text: S }));
													}
												}
												O
													? (o.next(
															new Ti({
																body: S,
																headers: h,
																status: m,
																statusText: v,
																url: A || void 0,
															}),
													  ),
													  o.complete())
													: o.error(
															new My({
																error: S,
																headers: h,
																status: m,
																statusText: v,
																url: A || void 0,
															}),
													  );
											},
											g = (h) => {
												const { url: m } = c(),
													v = new My({
														error: h,
														status: s.status || 0,
														statusText: s.statusText || "Unknown Error",
														url: m || void 0,
													});
												o.error(v);
											};
										let f = !1;
										const C = (h) => {
												f || (o.next(c()), (f = !0));
												let m = { type: ke.DownloadProgress, loaded: h.loaded };
												h.lengthComputable && (m.total = h.total),
													"text" === t.responseType &&
														s.responseText &&
														(m.partialText = s.responseText),
													o.next(m);
											},
											I = (h) => {
												let m = { type: ke.UploadProgress, loaded: h.loaded };
												h.lengthComputable && (m.total = h.total), o.next(m);
											};
										return (
											s.addEventListener("load", u),
											s.addEventListener("error", g),
											s.addEventListener("timeout", g),
											s.addEventListener("abort", g),
											t.reportProgress &&
												(s.addEventListener("progress", C),
												null !== a && s.upload && s.upload.addEventListener("progress", I)),
											s.send(a),
											o.next({ type: ke.Sent }),
											() => {
												s.removeEventListener("error", g),
													s.removeEventListener("abort", g),
													s.removeEventListener("load", u),
													s.removeEventListener("timeout", g),
													t.reportProgress &&
														(s.removeEventListener("progress", C),
														null !== a &&
															s.upload &&
															s.upload.removeEventListener("progress", I)),
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
						return new (t || e)(L(ry));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const Qg = new x("XSRF_ENABLED"),
				Hy = new x("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => "XSRF-TOKEN" }),
				Vy = new x("XSRF_HEADER_NAME", { providedIn: "root", factory: () => "X-XSRF-TOKEN" });
			class By {}
			let fx = (() => {
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
								(this.lastToken = qm(t, this.cookieName)),
								(this.lastCookieString = t)),
							this.lastToken
						);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(L(lt), L(Tn), L(Hy));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function Cx(e, n) {
				const t = e.url.toLowerCase();
				if (
					!P(Qg) ||
					"GET" === e.method ||
					"HEAD" === e.method ||
					t.startsWith("http://") ||
					t.startsWith("https://")
				)
					return n(e);
				const r = P(By).getToken(),
					i = P(Vy);
				return null != r && !e.headers.has(i) && (e = e.clone({ headers: e.headers.set(i, r) })), n(e);
			}
			var he = (() => (
				((he = he || {})[(he.Interceptors = 0)] = "Interceptors"),
				(he[(he.LegacyInterceptors = 1)] = "LegacyInterceptors"),
				(he[(he.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
				(he[(he.NoXsrfProtection = 3)] = "NoXsrfProtection"),
				(he[(he.JsonpSupport = 4)] = "JsonpSupport"),
				(he[(he.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
				(he[(he.Fetch = 6)] = "Fetch"),
				he
			))();
			function vr(e, n) {
				return { ɵkind: e, ɵproviders: n };
			}
			function Ix(...e) {
				const n = [
					Ny,
					ky,
					Ly,
					{ provide: il, useExisting: Ly },
					{ provide: ol, useExisting: ky },
					{ provide: Go, useValue: Cx, multi: !0 },
					{ provide: Qg, useValue: !0 },
					{ provide: By, useClass: fx },
				];
				for (const t of e) n.push(...t.ɵproviders);
				return (function Uc(e) {
					return { ɵproviders: e };
				})(n);
			}
			const Uy = new x("LEGACY_INTERCEPTOR_FN");
			let px = (() => {
				class e {}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = nt({
						providers: [
							Ix(
								vr(he.LegacyInterceptors, [
									{ provide: Uy, useFactory: ox },
									{ provide: Go, useExisting: Uy, multi: !0 },
								]),
							),
						],
					})),
					e
				);
			})();
			function qo(e) {
				return (qo =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? function (n) {
								return typeof n;
						  }
						: function (n) {
								return n &&
									"function" == typeof Symbol &&
									n.constructor === Symbol &&
									n !== Symbol.prototype
									? "symbol"
									: typeof n;
						  })(e);
			}
			function d(e, n, t) {
				return (
					(n = (function wx(e) {
						var n = (function Dx(e, n) {
							if ("object" !== qo(e) || null === e) return e;
							var t = e[Symbol.toPrimitive];
							if (void 0 !== t) {
								var r = t.call(e, n || "default");
								if ("object" !== qo(r)) return r;
								throw new TypeError("@@toPrimitive must return a primitive value.");
							}
							return ("string" === n ? String : Number)(e);
						})(e, "string");
						return "symbol" === qo(n) ? n : String(n);
					})(n)) in e
						? Object.defineProperty(e, n, { value: t, enumerable: !0, configurable: !0, writable: !0 })
						: (e[n] = t),
					e
				);
			}
			const jy = ["*"];
			let tt = (() => {
					class e {}
					return (
						d(e, "STARTS_WITH", "startsWith"),
						d(e, "CONTAINS", "contains"),
						d(e, "NOT_CONTAINS", "notContains"),
						d(e, "ENDS_WITH", "endsWith"),
						d(e, "EQUALS", "equals"),
						d(e, "NOT_EQUALS", "notEquals"),
						d(e, "IN", "in"),
						d(e, "LESS_THAN", "lt"),
						d(e, "LESS_THAN_OR_EQUAL_TO", "lte"),
						d(e, "GREATER_THAN", "gt"),
						d(e, "GREATER_THAN_OR_EQUAL_TO", "gte"),
						d(e, "BETWEEN", "between"),
						d(e, "IS", "is"),
						d(e, "IS_NOT", "isNot"),
						d(e, "BEFORE", "before"),
						d(e, "AFTER", "after"),
						d(e, "DATE_IS", "dateIs"),
						d(e, "DATE_IS_NOT", "dateIsNot"),
						d(e, "DATE_BEFORE", "dateBefore"),
						d(e, "DATE_AFTER", "dateAfter"),
						e
					);
				})(),
				$y = (() => {
					class e {
						constructor() {
							d(this, "ripple", !1),
								d(this, "overlayOptions", {}),
								d(this, "filterMatchModeOptions", {
									text: [
										tt.STARTS_WITH,
										tt.CONTAINS,
										tt.NOT_CONTAINS,
										tt.ENDS_WITH,
										tt.EQUALS,
										tt.NOT_EQUALS,
									],
									numeric: [
										tt.EQUALS,
										tt.NOT_EQUALS,
										tt.LESS_THAN,
										tt.LESS_THAN_OR_EQUAL_TO,
										tt.GREATER_THAN,
										tt.GREATER_THAN_OR_EQUAL_TO,
									],
									date: [tt.DATE_IS, tt.DATE_IS_NOT, tt.DATE_BEFORE, tt.DATE_AFTER],
								}),
								d(this, "translation", {
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
								d(this, "zIndex", { modal: 1100, overlay: 1e3, menu: 1e3, tooltip: 1100 }),
								d(this, "translationSource", new Pt()),
								d(this, "translationObserver", this.translationSource.asObservable());
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
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275prov", F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				Ex = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-header"]],
								ngContentSelectors: jy,
								decls: 1,
								vars: 0,
								template: function (t, r) {
									1 & t && (Ir(), xn(0));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Sx = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-footer"]],
								ngContentSelectors: jy,
								decls: 1,
								vars: 0,
								template: function (t, r) {
									1 & t && (Ir(), xn(0));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Ko = (() => {
					class e {
						constructor(t) {
							d(this, "template", void 0),
								d(this, "type", void 0),
								d(this, "name", void 0),
								(this.template = t);
						}
						getType() {
							return this.name;
						}
					}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(In));
						}),
						d(
							e,
							"\u0275dir",
							Ke({
								type: e,
								selectors: [["", "pTemplate", ""]],
								inputs: { type: "type", name: ["pTemplate", "name"] },
							}),
						),
						e
					);
				})(),
				Dr = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn] })),
						e
					);
				})(),
				bx = (() => {
					class e {}
					return (
						d(e, "STARTS_WITH", "startsWith"),
						d(e, "CONTAINS", "contains"),
						d(e, "NOT_CONTAINS", "notContains"),
						d(e, "ENDS_WITH", "endsWith"),
						d(e, "EQUALS", "equals"),
						d(e, "NOT_EQUALS", "notEquals"),
						d(e, "NO_FILTER", "noFilter"),
						d(e, "LT", "lt"),
						d(e, "LTE", "lte"),
						d(e, "GT", "gt"),
						d(e, "GTE", "gte"),
						d(e, "IS", "is"),
						d(e, "IS_NOT", "isNot"),
						d(e, "BEFORE", "before"),
						d(e, "AFTER", "after"),
						d(e, "CLEAR", "clear"),
						d(e, "APPLY", "apply"),
						d(e, "MATCH_ALL", "matchAll"),
						d(e, "MATCH_ANY", "matchAny"),
						d(e, "ADD_RULE", "addRule"),
						d(e, "REMOVE_RULE", "removeRule"),
						d(e, "ACCEPT", "accept"),
						d(e, "REJECT", "reject"),
						d(e, "CHOOSE", "choose"),
						d(e, "UPLOAD", "upload"),
						d(e, "CANCEL", "cancel"),
						d(e, "DAY_NAMES", "dayNames"),
						d(e, "DAY_NAMES_SHORT", "dayNamesShort"),
						d(e, "DAY_NAMES_MIN", "dayNamesMin"),
						d(e, "MONTH_NAMES", "monthNames"),
						d(e, "MONTH_NAMES_SHORT", "monthNamesShort"),
						d(e, "FIRST_DAY_OF_WEEK", "firstDayOfWeek"),
						d(e, "TODAY", "today"),
						d(e, "WEEK_HEADER", "weekHeader"),
						d(e, "WEAK", "weak"),
						d(e, "MEDIUM", "medium"),
						d(e, "STRONG", "strong"),
						d(e, "PASSWORD_PROMPT", "passwordPrompt"),
						d(e, "EMPTY_MESSAGE", "emptyMessage"),
						d(e, "EMPTY_FILTER_MESSAGE", "emptyFilterMessage"),
						e
					);
				})(),
				Tx = (() => {
					class e {
						constructor() {
							d(this, "dragStartSource", new Pt()),
								d(this, "dragStopSource", new Pt()),
								d(this, "dragStart$", this.dragStartSource.asObservable()),
								d(this, "dragStop$", this.dragStopSource.asObservable());
						}
						startDrag(t) {
							this.dragStartSource.next(t);
						}
						stopDrag(t) {
							this.dragStopSource.next(t);
						}
					}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275prov", F({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			class Mi {
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
						var f = Object.keys(n);
						if ((s = f.length) !== Object.keys(t).length) return !1;
						for (o = s; 0 != o--; ) if (!Object.prototype.hasOwnProperty.call(t, f[o])) return !1;
						for (o = s; 0 != o--; ) if (!this.equalsByValue(n[(a = f[o])], t[a])) return !1;
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
					return (1 === o ? r : o) * Mi.compare(n, t, i, r);
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
			var zy = 0;
			function Xg() {
				return "pr_id_" + ++zy;
			}
			!(function Mx() {
				let e = [];
				const i = (o) => (o && parseInt(o.style.zIndex, 10)) || 0;
			})();
			const Nx = ["*"];
			let wr = (() => {
					class e {
						constructor() {
							d(this, "label", void 0),
								d(this, "spin", !1),
								d(this, "styleClass", void 0),
								d(this, "role", void 0),
								d(this, "ariaLabel", void 0),
								d(this, "ariaHidden", void 0);
						}
						ngOnInit() {
							this.getAttributes();
						}
						getAttributes() {
							const t = Mi.isEmpty(this.label);
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
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["ng-component"]],
								hostAttrs: [1, "p-element", "p-icon-wrapper"],
								inputs: { label: "label", spin: "spin", styleClass: "styleClass" },
								standalone: !0,
								features: [Cn],
								ngContentSelectors: Nx,
								decls: 1,
								vars: 0,
								template: function (t, r) {
									1 & t && (Ir(), xn(0));
								},
								encapsulation: 2,
								changeDetection: 0,
							}),
						),
						e
					);
				})(),
				Ni = (() => {
					class e extends wr {
						constructor(...t) {
							super(...t), d(this, "pathId", void 0);
						}
						ngOnInit() {
							this.pathId = "url(#" + Xg() + ")";
						}
					}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["SpinnerIcon"]],
								standalone: !0,
								features: [Rn, Cn],
								decls: 6,
								vars: 7,
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
										"M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
										"fill",
										"currentColor",
									],
									[3, "id"],
									["width", "14", "height", "14", "fill", "white"],
								],
								template: function (t, r) {
									1 & t &&
										(Gn(),
										N(0, "svg", 0)(1, "g"),
										K(2, "path", 1),
										R(),
										N(3, "defs")(4, "clipPath", 2),
										K(5, "rect", 3),
										R()()()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role),
											y(1),
											ve("clip-path", r.pathId),
											y(3),
											p("id", r.pathId));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				J = (() => {
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
							const i = (h) => {
									if (h)
										return "relative" === getComputedStyle(h).getPropertyValue("position")
											? h
											: i(h.parentElement);
								},
								o = t.offsetParent
									? { width: t.offsetWidth, height: t.offsetHeight }
									: this.getHiddenElementDimensions(t),
								s = r.offsetHeight,
								a = r.getBoundingClientRect(),
								l = this.getWindowScrollTop(),
								c = this.getWindowScrollLeft(),
								u = this.getViewport(),
								f = i(t)?.getBoundingClientRect() || { top: -1 * l, left: -1 * c };
							let C, I;
							a.top + s + o.height > u.height
								? ((C = a.top - f.top - o.height),
								  (t.style.transformOrigin = "bottom"),
								  a.top + C < 0 && (C = -1 * a.top))
								: ((C = s + a.top - f.top), (t.style.transformOrigin = "top")),
								(I =
									o.width > u.width
										? -1 * (a.left - f.left)
										: a.left - f.left + o.width > u.width
										? -1 * (a.left - f.left + o.width - u.width)
										: a.left - f.left),
								(t.style.top = C + "px"),
								(t.style.left = I + "px");
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
								f = this.getViewport();
							let C, I;
							c.top + a + o > f.height
								? ((C = c.top + u - o), (t.style.transformOrigin = "bottom"), C < 0 && (C = u))
								: ((C = a + c.top + u), (t.style.transformOrigin = "top")),
								(I = c.left + s > f.width ? Math.max(0, c.left + g + l - s) : c.left + g),
								(t.style.top = C + "px"),
								(t.style.left = I + "px");
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
								f = t.clientHeight,
								C = this.getOuterHeight(r);
							u < 0 ? (t.scrollTop = g + u) : u + C > f && (t.scrollTop = g + u - f + C);
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
								if (!(r && r.el && r.el.nativeElement)) throw "Cannot append " + r + " to " + t;
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
						d(e, "zindex", 1e3),
						d(e, "calculatedScrollbarWidth", null),
						d(e, "calculatedScrollbarHeight", null),
						d(e, "browser", void 0),
						e
					);
				})(),
				Wy = (() => {
					class e {
						constructor(t, r, i, o, s, a) {
							d(this, "document", void 0),
								d(this, "platformId", void 0),
								d(this, "renderer", void 0),
								d(this, "el", void 0),
								d(this, "zone", void 0),
								d(this, "config", void 0),
								d(this, "animationListener", void 0),
								d(this, "mouseDownListener", void 0),
								d(this, "timeout", void 0),
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
								});
						}
						onMouseDown(t) {
							let r = this.getInk();
							if (!r || "none" === this.document.defaultView?.getComputedStyle(r, null).display) return;
							if ((J.removeClass(r, "p-ink-active"), !J.getHeight(r) && !J.getWidth(r))) {
								let a = Math.max(
									J.getOuterWidth(this.el.nativeElement),
									J.getOuterHeight(this.el.nativeElement),
								);
								(r.style.height = a + "px"), (r.style.width = a + "px");
							}
							let i = J.getOffset(this.el.nativeElement),
								o = t.pageX - i.left + this.document.body.scrollTop - J.getWidth(r) / 2,
								s = t.pageY - i.top + this.document.body.scrollLeft - J.getHeight(r) / 2;
							this.renderer.setStyle(r, "top", s + "px"),
								this.renderer.setStyle(r, "left", o + "px"),
								J.addClass(r, "p-ink-active"),
								(this.timeout = setTimeout(() => {
									let a = this.getInk();
									a && J.removeClass(a, "p-ink-active");
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
							t && J.removeClass(t, "p-ink-active");
						}
						onAnimationEnd(t) {
							this.timeout && clearTimeout(this.timeout), J.removeClass(t.currentTarget, "p-ink-active");
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
								(this.mouseDownListener && this.mouseDownListener(),
								this.animationListener && this.animationListener(),
								(this.mouseDownListener = null),
								(this.animationListener = null),
								J.removeElement(t));
						}
						ngOnDestroy() {
							this.config && this.config.ripple && this.remove();
						}
					}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(lt), b(Tn), b(ei), b(Wt), b(Ie), b($y, 8));
						}),
						d(
							e,
							"\u0275dir",
							Ke({ type: e, selectors: [["", "pRipple", ""]], hostAttrs: [1, "p-ripple", "p-element"] }),
						),
						e
					);
				})(),
				Gy = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn] })),
						e
					);
				})();
			function Px(e, n) {
				1 & e && Ee(0);
			}
			function Rx(e, n) {
				if ((1 & e && K(0, "span", 8), 2 & e)) {
					const t = D(3);
					Me("p-button-loading-icon" + t.icon), p("ngClass", t.iconClass());
				}
			}
			function xx(e, n) {
				1 & e && K(0, "SpinnerIcon", 9), 2 & e && p("styleClass", D(3).spinnerIconClass())("spin", !0);
			}
			function Ox(e, n) {
				if ((1 & e && (De(0), _(1, Rx, 1, 3, "span", 6), _(2, xx, 1, 2, "SpinnerIcon", 7), we()), 2 & e)) {
					const t = D(2);
					y(1), p("ngIf", t.loadingIcon), y(1), p("ngIf", !t.loadingIcon);
				}
			}
			function Lx(e, n) {}
			function Fx(e, n) {
				1 & e && _(0, Lx, 0, 0, "ng-template");
			}
			function kx(e, n) {
				if ((1 & e && (N(0, "span", 10), _(1, Fx, 1, 0, null, 1), R()), 2 & e)) {
					const t = D(2);
					y(1), p("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function Hx(e, n) {
				if ((1 & e && (De(0), _(1, Ox, 3, 2, "ng-container", 2), _(2, kx, 2, 1, "span", 5), we()), 2 & e)) {
					const t = D();
					y(1), p("ngIf", !t.loadingIconTemplate), y(1), p("ngIf", t.loadingIconTemplate);
				}
			}
			function Vx(e, n) {
				if ((1 & e && K(0, "span", 8), 2 & e)) {
					const t = D(2);
					Me(t.icon), p("ngClass", t.iconClass());
				}
			}
			function Bx(e, n) {}
			function Ux(e, n) {
				1 & e && _(0, Bx, 0, 0, "ng-template", 12), 2 & e && p("ngIf", !D(3).icon);
			}
			function jx(e, n) {
				if ((1 & e && (N(0, "span", 8), _(1, Ux, 1, 1, null, 1), R()), 2 & e)) {
					const t = D(2);
					p("ngClass", t.iconClass()), y(1), p("ngTemplateOutlet", t.iconTemplate);
				}
			}
			function $x(e, n) {
				if ((1 & e && (De(0), _(1, Vx, 1, 3, "span", 6), _(2, jx, 2, 2, "span", 11), we()), 2 & e)) {
					const t = D();
					y(1), p("ngIf", t.icon && !t.iconTemplate), y(1), p("ngIf", !t.icon && t.iconTemplate);
				}
			}
			function zx(e, n) {
				if ((1 & e && (N(0, "span", 13), Ft(1), R()), 2 & e)) {
					const t = D();
					ve("aria-hidden", t.icon && !t.label), y(1), Ci(t.label);
				}
			}
			function Wx(e, n) {
				if ((1 & e && (N(0, "span", 8), Ft(1), R()), 2 & e)) {
					const t = D();
					Me(t.badgeClass), p("ngClass", t.badgeStyleClass()), y(1), Ci(t.badge);
				}
			}
			const Gx = ["*"];
			let qx = (() => {
					class e {
						constructor() {
							d(this, "type", "button"),
								d(this, "iconPos", "left"),
								d(this, "icon", void 0),
								d(this, "badge", void 0),
								d(this, "label", void 0),
								d(this, "disabled", void 0),
								d(this, "loading", !1),
								d(this, "loadingIcon", void 0),
								d(this, "style", void 0),
								d(this, "styleClass", void 0),
								d(this, "badgeClass", void 0),
								d(this, "ariaLabel", void 0),
								d(this, "onClick", new ie()),
								d(this, "onFocus", new ie()),
								d(this, "onBlur", new ie()),
								d(this, "contentTemplate", void 0),
								d(this, "loadingIconTemplate", void 0),
								d(this, "iconTemplate", void 0),
								d(this, "templates", void 0);
						}
						spinnerIconClass() {
							return Object.entries(this.iconClass())
								.filter(([, t]) => !!t)
								.reduce((t, [r]) => t + ` ${r}`, "p-button-loading-icon");
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
						ngAfterContentInit() {
							this.templates?.forEach((t) => {
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
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-button"]],
								contentQueries: function (t, r, i) {
									if ((1 & t && Yn(i, Ko, 4), 2 & t)) {
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
								ngContentSelectors: Gx,
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
										ot("click", function (o) {
											return r.onClick.emit(o);
										})("focus", function (o) {
											return r.onFocus.emit(o);
										})("blur", function (o) {
											return r.onBlur.emit(o);
										}),
										xn(1),
										_(2, Px, 1, 0, "ng-container", 1),
										_(3, Hx, 3, 2, "ng-container", 2),
										_(4, $x, 3, 2, "ng-container", 2),
										_(5, zx, 2, 2, "span", 3),
										_(6, Wx, 2, 4, "span", 4),
										R()),
										2 & t &&
											(Me(r.styleClass),
											p("ngStyle", r.style)("disabled", r.disabled || r.loading)(
												"ngClass",
												r.buttonClass(),
											),
											ve("type", r.type)("aria-label", r.ariaLabel),
											y(2),
											p("ngTemplateOutlet", r.contentTemplate),
											y(1),
											p("ngIf", r.loading),
											y(1),
											p("ngIf", !r.loading),
											y(1),
											p("ngIf", !r.contentTemplate && r.label),
											y(1),
											p("ngIf", !r.contentTemplate && r.badge));
								},
								dependencies: function () {
									return [Di, wi, Si, Ei, Wy, Ni];
								},
								encapsulation: 2,
								changeDetection: 0,
							}),
						),
						e
					);
				})(),
				Kx = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn, Gy, Dr, Ni, Dr] })),
						e
					);
				})();
			function Zx(e, n) {
				1 & e && Ee(0);
			}
			function Yx(e, n) {
				if ((1 & e && (N(0, "div", 8), xn(1, 1), _(2, Zx, 1, 0, "ng-container", 6), R()), 2 & e)) {
					const t = D();
					y(2), p("ngTemplateOutlet", t.headerTemplate);
				}
			}
			function Qx(e, n) {
				1 & e && Ee(0);
			}
			function Xx(e, n) {
				if ((1 & e && (N(0, "div", 9), Ft(1), _(2, Qx, 1, 0, "ng-container", 6), R()), 2 & e)) {
					const t = D();
					y(1), Ar(" ", t.header, " "), y(1), p("ngTemplateOutlet", t.titleTemplate);
				}
			}
			function Jx(e, n) {
				1 & e && Ee(0);
			}
			function eO(e, n) {
				if ((1 & e && (N(0, "div", 10), Ft(1), _(2, Jx, 1, 0, "ng-container", 6), R()), 2 & e)) {
					const t = D();
					y(1), Ar(" ", t.subheader, " "), y(1), p("ngTemplateOutlet", t.subtitleTemplate);
				}
			}
			function tO(e, n) {
				1 & e && Ee(0);
			}
			function nO(e, n) {
				1 & e && Ee(0);
			}
			function rO(e, n) {
				if ((1 & e && (N(0, "div", 11), xn(1, 2), _(2, nO, 1, 0, "ng-container", 6), R()), 2 & e)) {
					const t = D();
					y(2), p("ngTemplateOutlet", t.footerTemplate);
				}
			}
			const iO = ["*", [["p-header"]], [["p-footer"]]],
				oO = ["*", "p-header", "p-footer"];
			let qy = (() => {
					class e {
						constructor(t) {
							d(this, "el", void 0),
								d(this, "header", void 0),
								d(this, "subheader", void 0),
								d(this, "style", void 0),
								d(this, "styleClass", void 0),
								d(this, "headerFacet", void 0),
								d(this, "footerFacet", void 0),
								d(this, "templates", void 0),
								d(this, "headerTemplate", void 0),
								d(this, "titleTemplate", void 0),
								d(this, "subtitleTemplate", void 0),
								d(this, "contentTemplate", void 0),
								d(this, "footerTemplate", void 0),
								(this.el = t);
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
						getBlockableElement() {
							return this.el.nativeElement.children[0];
						}
					}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(Wt));
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-card"]],
								contentQueries: function (t, r, i) {
									if ((1 & t && (Yn(i, Ex, 5), Yn(i, Sx, 5), Yn(i, Ko, 4)), 2 & t)) {
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
								ngContentSelectors: oO,
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
										(Ir(iO),
										N(0, "div", 0),
										_(1, Yx, 3, 1, "div", 1),
										N(2, "div", 2),
										_(3, Xx, 3, 2, "div", 3),
										_(4, eO, 3, 2, "div", 4),
										N(5, "div", 5),
										xn(6),
										_(7, tO, 1, 0, "ng-container", 6),
										R(),
										_(8, rO, 3, 1, "div", 7),
										R()()),
										2 & t &&
											(Me(r.styleClass),
											p("ngClass", "p-card p-component")("ngStyle", r.style),
											y(1),
											p("ngIf", r.headerFacet || r.headerTemplate),
											y(2),
											p("ngIf", r.header || r.titleTemplate),
											y(1),
											p("ngIf", r.subheader || r.subtitleTemplate),
											y(3),
											p("ngTemplateOutlet", r.contentTemplate),
											y(1),
											p("ngIf", r.footerFacet || r.footerTemplate));
								},
								dependencies: [Di, wi, Si, Ei],
								styles: [".p-card-header img{width:100%}\n"],
								encapsulation: 2,
								changeDetection: 0,
							}),
						),
						e
					);
				})(),
				sO = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn, Dr] })),
						e
					);
				})();
			const aO = ["element"],
				lO = ["content"];
			function cO(e, n) {
				1 & e && Ee(0);
			}
			const Jg = function (e, n) {
				return { $implicit: e, options: n };
			};
			function uO(e, n) {
				if ((1 & e && (De(0), _(1, cO, 1, 0, "ng-container", 7), we()), 2 & e)) {
					const t = D(2);
					y(1),
						p("ngTemplateOutlet", t.contentTemplate)(
							"ngTemplateOutletContext",
							On(2, Jg, t.loadedItems, t.getContentOptions()),
						);
				}
			}
			function gO(e, n) {
				1 & e && Ee(0);
			}
			function dO(e, n) {
				if ((1 & e && (De(0), _(1, gO, 1, 0, "ng-container", 7), we()), 2 & e)) {
					const t = n.$implicit,
						r = n.index,
						i = D(3);
					y(1),
						p("ngTemplateOutlet", i.itemTemplate)("ngTemplateOutletContext", On(2, Jg, t, i.getOptions(r)));
				}
			}
			const fO = function (e) {
				return { "p-scroller-loading": e };
			};
			function CO(e, n) {
				if ((1 & e && (N(0, "div", 8, 9), _(2, dO, 2, 5, "ng-container", 10), R()), 2 & e)) {
					const t = D(2);
					p("ngClass", Oe(4, fO, t.d_loading))("ngStyle", t.contentStyle),
						y(2),
						p("ngForOf", t.loadedItems)("ngForTrackBy", t._trackBy || t.index);
				}
			}
			function IO(e, n) {
				1 & e && K(0, "div", 11), 2 & e && p("ngStyle", D(2).spacerStyle);
			}
			function hO(e, n) {
				1 & e && Ee(0);
			}
			const pO = function (e) {
					return { numCols: e };
				},
				Ky = function (e) {
					return { options: e };
				};
			function AO(e, n) {
				if ((1 & e && (De(0), _(1, hO, 1, 0, "ng-container", 7), we()), 2 & e)) {
					const t = n.index,
						r = D(4);
					y(1),
						p("ngTemplateOutlet", r.loaderTemplate)(
							"ngTemplateOutletContext",
							Oe(4, Ky, r.getLoaderOptions(t, r.both && Oe(2, pO, r._numItemsInViewport.cols))),
						);
				}
			}
			function mO(e, n) {
				if ((1 & e && (De(0), _(1, AO, 2, 6, "ng-container", 14), we()), 2 & e)) {
					const t = D(3);
					y(1), p("ngForOf", t.loaderArr);
				}
			}
			function yO(e, n) {
				1 & e && Ee(0);
			}
			const _O = function () {
				return { styleClass: "p-scroller-loading-icon" };
			};
			function vO(e, n) {
				if ((1 & e && (De(0), _(1, yO, 1, 0, "ng-container", 7), we()), 2 & e)) {
					const t = D(4);
					y(1),
						p("ngTemplateOutlet", t.loaderIconTemplate)(
							"ngTemplateOutletContext",
							Oe(
								3,
								Ky,
								(function IA(e, n, t) {
									const r = rt() + e,
										i = w();
									return i[r] === q
										? gn(i, r, t ? n.call(t) : n())
										: (function Do(e, n) {
												return e[n];
										  })(i, r);
								})(2, _O),
							),
						);
				}
			}
			function DO(e, n) {
				1 & e && K(0, "SpinnerIcon", 16), 2 & e && p("styleClass", "p-scroller-loading-icon");
			}
			function wO(e, n) {
				if (
					(1 & e && (_(0, vO, 2, 5, "ng-container", 0), _(1, DO, 1, 1, "ng-template", null, 15, Fo)), 2 & e)
				) {
					const t = bo(2);
					p("ngIf", D(3).loaderIconTemplate)("ngIfElse", t);
				}
			}
			const EO = function (e) {
				return { "p-component-overlay": e };
			};
			function SO(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 12),
						_(1, mO, 2, 1, "ng-container", 0),
						_(2, wO, 3, 2, "ng-template", null, 13, Fo),
						R()),
					2 & e)
				) {
					const t = bo(3),
						r = D(2);
					p("ngClass", Oe(3, EO, !r.loaderTemplate)), y(1), p("ngIf", r.loaderTemplate)("ngIfElse", t);
				}
			}
			const bO = function (e, n, t) {
				return { "p-scroller": !0, "p-scroller-inline": e, "p-both-scroll": n, "p-horizontal-scroll": t };
			};
			function TO(e, n) {
				if (1 & e) {
					const t = dn();
					De(0),
						N(1, "div", 2, 3),
						ot("scroll", function (i) {
							return te(t), ne(D().onContainerScroll(i));
						}),
						_(3, uO, 2, 5, "ng-container", 0),
						_(4, CO, 3, 6, "ng-template", null, 4, Fo),
						_(6, IO, 1, 1, "div", 5),
						_(7, SO, 4, 5, "div", 6),
						R(),
						we();
				}
				if (2 & e) {
					const t = bo(5),
						r = D();
					y(1),
						Me(r._styleClass),
						p("ngStyle", r._style)("ngClass", Uu(10, bO, r.inline, r.both, r.horizontal)),
						ve("id", r._id)("tabindex", r.tabindex),
						y(2),
						p("ngIf", r.contentTemplate)("ngIfElse", t),
						y(3),
						p("ngIf", r._showSpacer),
						y(1),
						p("ngIf", !r.loaderDisabled && r._showLoader && r.d_loading);
				}
			}
			function MO(e, n) {
				1 & e && Ee(0);
			}
			const NO = function (e, n) {
				return { rows: e, columns: n };
			};
			function PO(e, n) {
				if ((1 & e && (De(0), _(1, MO, 1, 0, "ng-container", 7), we()), 2 & e)) {
					const t = D(2);
					y(1),
						p("ngTemplateOutlet", t.contentTemplate)(
							"ngTemplateOutletContext",
							On(5, Jg, t.items, On(2, NO, t._items, t.loadedColumns)),
						);
				}
			}
			function RO(e, n) {
				if ((1 & e && (xn(0), _(1, PO, 2, 8, "ng-container", 17)), 2 & e)) {
					const t = D();
					y(1), p("ngIf", t.contentTemplate);
				}
			}
			const xO = ["*"];
			let OO = (() => {
					class e {
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
						constructor(t, r, i, o, s) {
							d(this, "document", void 0),
								d(this, "platformId", void 0),
								d(this, "renderer", void 0),
								d(this, "cd", void 0),
								d(this, "zone", void 0),
								d(this, "onLazyLoad", new ie()),
								d(this, "onScroll", new ie()),
								d(this, "onScrollIndexChange", new ie()),
								d(this, "elementViewChild", void 0),
								d(this, "contentViewChild", void 0),
								d(this, "templates", void 0),
								d(this, "_id", void 0),
								d(this, "_style", void 0),
								d(this, "_styleClass", void 0),
								d(this, "_tabindex", 0),
								d(this, "_items", void 0),
								d(this, "_itemSize", 0),
								d(this, "_scrollHeight", void 0),
								d(this, "_scrollWidth", void 0),
								d(this, "_orientation", "vertical"),
								d(this, "_step", 0),
								d(this, "_delay", 0),
								d(this, "_resizeDelay", 10),
								d(this, "_appendOnly", !1),
								d(this, "_inline", !1),
								d(this, "_lazy", !1),
								d(this, "_disabled", !1),
								d(this, "_loaderDisabled", !1),
								d(this, "_columns", void 0),
								d(this, "_showSpacer", !0),
								d(this, "_showLoader", !1),
								d(this, "_numToleratedItems", void 0),
								d(this, "_loading", void 0),
								d(this, "_autoSize", !1),
								d(this, "_trackBy", void 0),
								d(this, "_options", void 0),
								d(this, "d_loading", !1),
								d(this, "d_numToleratedItems", void 0),
								d(this, "contentEl", void 0),
								d(this, "contentTemplate", void 0),
								d(this, "itemTemplate", void 0),
								d(this, "loaderTemplate", void 0),
								d(this, "loaderIconTemplate", void 0),
								d(this, "first", 0),
								d(this, "last", 0),
								d(this, "page", 0),
								d(this, "isRangeChanged", !1),
								d(this, "numItemsInViewport", 0),
								d(this, "lastScrollPos", 0),
								d(this, "lazyLoadState", {}),
								d(this, "loaderArr", []),
								d(this, "spacerStyle", {}),
								d(this, "contentStyle", {}),
								d(this, "scrollTimeout", void 0),
								d(this, "resizeTimeout", void 0),
								d(this, "initialized", !1),
								d(this, "windowResizeListener", void 0),
								d(this, "defaultWidth", void 0),
								d(this, "defaultHeight", void 0),
								d(this, "defaultContentWidth", void 0),
								d(this, "defaultContentHeight", void 0),
								(this.document = t),
								(this.platformId = r),
								(this.renderer = i),
								(this.cd = o),
								(this.zone = s);
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
							});
						}
						ngAfterViewChecked() {
							this.initialized || this.viewInit();
						}
						ngOnDestroy() {
							this.unbindResizeListener(), (this.contentEl = null), (this.initialized = !1);
						}
						viewInit() {
							kg(this.platformId) &&
								J.isVisible(this.elementViewChild?.nativeElement) &&
								(this.setInitialState(),
								this.setContentEl(this.contentEl),
								this.init(),
								(this.defaultWidth = J.getWidth(this.elementViewChild?.nativeElement)),
								(this.defaultHeight = J.getHeight(this.elementViewChild?.nativeElement)),
								(this.defaultContentWidth = J.getWidth(this.contentEl)),
								(this.defaultContentHeight = J.getHeight(this.contentEl)),
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
								J.findSingle(this.elementViewChild?.nativeElement, ".p-scroller-content");
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
								a = (u, g, f) => u * g + f,
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
										const [t, r] = [J.getWidth(this.contentEl), J.getHeight(this.contentEl)];
										t !== this.defaultContentWidth &&
											(this.elementViewChild.nativeElement.style.width = ""),
											r !== this.defaultContentHeight &&
												(this.elementViewChild.nativeElement.style.height = "");
										const [i, o] = [
											J.getWidth(this.elementViewChild.nativeElement),
											J.getHeight(this.elementViewChild.nativeElement),
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
								o = (m, v) => (m ? (m > v ? m - v : m) : 0),
								s = (m, v) => Math.floor(m / (v || m)),
								a = (m, v, A, S, O, k) => (m <= O ? O : k ? A - S - O : v + O - 1),
								l = (m, v, A, S, O, k, pe) =>
									m <= k ? 0 : Math.max(0, pe ? (m < v ? A : m - k) : m > v ? A : m - 2 * k),
								c = (m, v, A, S, O, k = !1) => {
									let pe = v + S + 2 * O;
									return m >= O && (pe += O + 1), this.getLast(pe, k);
								},
								u = o(r.scrollTop, i.top),
								g = o(r.scrollLeft, i.left);
							let f = this.both ? { rows: 0, cols: 0 } : 0,
								C = this.last,
								I = !1,
								h = this.lastScrollPos;
							if (this.both) {
								const m = this.lastScrollPos.top <= u,
									v = this.lastScrollPos.left <= g;
								if (!this._appendOnly || (this._appendOnly && (m || v))) {
									const A = { rows: s(u, this._itemSize[0]), cols: s(g, this._itemSize[1]) },
										S = {
											rows: a(
												A.rows,
												this.first.rows,
												this.last.rows,
												this.numItemsInViewport.rows,
												this.d_numToleratedItems[0],
												m,
											),
											cols: a(
												A.cols,
												this.first.cols,
												this.last.cols,
												this.numItemsInViewport.cols,
												this.d_numToleratedItems[1],
												v,
											),
										};
									(f = {
										rows: l(A.rows, S.rows, this.first.rows, 0, 0, this.d_numToleratedItems[0], m),
										cols: l(A.cols, S.cols, this.first.cols, 0, 0, this.d_numToleratedItems[1], v),
									}),
										(C = {
											rows: c(
												A.rows,
												f.rows,
												0,
												this.numItemsInViewport.rows,
												this.d_numToleratedItems[0],
											),
											cols: c(
												A.cols,
												f.cols,
												0,
												this.numItemsInViewport.cols,
												this.d_numToleratedItems[1],
												!0,
											),
										}),
										(I =
											f.rows !== this.first.rows ||
											C.rows !== this.last.rows ||
											f.cols !== this.first.cols ||
											C.cols !== this.last.cols ||
											this.isRangeChanged),
										(h = { top: u, left: g });
								}
							} else {
								const m = this.horizontal ? g : u,
									v = this.lastScrollPos <= m;
								if (!this._appendOnly || (this._appendOnly && v)) {
									const A = s(m, this._itemSize);
									(f = l(
										A,
										a(
											A,
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
										(C = c(A, f, 0, this.numItemsInViewport, this.d_numToleratedItems)),
										(I = f !== this.first || C !== this.last || this.isRangeChanged),
										(h = m);
								}
							}
							return { first: f, last: C, isRangeChanged: I, scrollPos: h };
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
											r = J.isTouchDevice() ? "orientationchange" : "resize";
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
									if (J.isVisible(this.elementViewChild?.nativeElement)) {
										const [t, r] = [
												J.getWidth(this.elementViewChild?.nativeElement),
												J.getHeight(this.elementViewChild?.nativeElement),
											],
											[i, o] = [t !== this.defaultWidth, r !== this.defaultHeight];
										(this.both ? i || o : this.horizontal ? i : this.vertical && o) &&
											this.zone.run(() => {
												(this.d_numToleratedItems = this._numToleratedItems),
													(this.defaultWidth = t),
													(this.defaultHeight = r),
													(this.defaultContentWidth = J.getWidth(this.contentEl)),
													(this.defaultContentHeight = J.getHeight(this.contentEl)),
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
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(lt), b(Tn), b(ei), b(Ho), b(Ie));
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-scroller"]],
								contentQueries: function (t, r, i) {
									if ((1 & t && Yn(i, Ko, 4), 2 & t)) {
										let o;
										bt((o = Tt())) && (r.templates = o);
									}
								},
								viewQuery: function (t, r) {
									if ((1 & t && (Ai(aO, 5), Ai(lO, 5)), 2 & t)) {
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
								features: [Dn],
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
											_(0, TO, 8, 14, "ng-container", 0),
											_(1, RO, 2, 1, "ng-template", null, 1, Fo)),
										2 & t)
									) {
										const i = bo(2);
										p("ngIf", !r._disabled)("ngIfElse", i);
									}
								},
								dependencies: function () {
									return [Di, el, wi, Si, Ei, Ni];
								},
								styles: [
									"p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{scale:2}.p-scroller-inline .p-scroller-content{position:static}\n",
								],
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Zy = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn, Dr, Ni, Dr] })),
						e
					);
				})(),
				Yy = (() => {
					class e extends wr {}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["CheckIcon"]],
								standalone: !0,
								features: [Rn, Cn],
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
									1 & t && (Gn(), N(0, "svg", 0), K(1, "path", 1), R()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Qy = (() => {
					class e extends wr {}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["ChevronDownIcon"]],
								standalone: !0,
								features: [Rn, Cn],
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
									1 & t && (Gn(), N(0, "svg", 0), K(1, "path", 1), R()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Xy = (() => {
					class e extends wr {}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["ChevronRightIcon"]],
								standalone: !0,
								features: [Rn, Cn],
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
									1 & t && (Gn(), N(0, "svg", 0), K(1, "path", 1), R()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				Jy = (() => {
					class e extends wr {}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["MinusIcon"]],
								standalone: !0,
								features: [Rn, Cn],
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
									1 & t && (Gn(), N(0, "svg", 0), K(1, "path", 1), R()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role));
								},
								dependencies: [Xn],
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				e_ = (() => {
					class e extends wr {
						constructor(...t) {
							super(...t), d(this, "pathId", void 0);
						}
						ngOnInit() {
							this.pathId = "url(#" + Xg() + ")";
						}
					}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["PlusIcon"]],
								standalone: !0,
								features: [Rn, Cn],
								decls: 6,
								vars: 7,
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
										"M7.67742 6.32258V0.677419C7.67742 0.497757 7.60605 0.325452 7.47901 0.198411C7.35197 0.0713707 7.17966 0 7 0C6.82034 0 6.64803 0.0713707 6.52099 0.198411C6.39395 0.325452 6.32258 0.497757 6.32258 0.677419V6.32258H0.677419C0.497757 6.32258 0.325452 6.39395 0.198411 6.52099C0.0713707 6.64803 0 6.82034 0 7C0 7.17966 0.0713707 7.35197 0.198411 7.47901C0.325452 7.60605 0.497757 7.67742 0.677419 7.67742H6.32258V13.3226C6.32492 13.5015 6.39704 13.6725 6.52358 13.799C6.65012 13.9255 6.82106 13.9977 7 14C7.17966 14 7.35197 13.9286 7.47901 13.8016C7.60605 13.6745 7.67742 13.5022 7.67742 13.3226V7.67742H13.3226C13.5022 7.67742 13.6745 7.60605 13.8016 7.47901C13.9286 7.35197 14 7.17966 14 7C13.9977 6.82106 13.9255 6.65012 13.799 6.52358C13.6725 6.39704 13.5015 6.32492 13.3226 6.32258H7.67742Z",
										"fill",
										"currentColor",
									],
									[3, "id"],
									["width", "14", "height", "14", "fill", "white"],
								],
								template: function (t, r) {
									1 & t &&
										(Gn(),
										N(0, "svg", 0)(1, "g"),
										K(2, "path", 1),
										R(),
										N(3, "defs")(4, "clipPath", 2),
										K(5, "rect", 3),
										R()()()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role),
											y(1),
											ve("clip-path", r.pathId),
											y(3),
											p("id", r.pathId));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				t_ = (() => {
					class e extends wr {
						constructor(...t) {
							super(...t), d(this, "pathId", void 0);
						}
						ngOnInit() {
							this.pathId = "url(#" + Xg() + ")";
						}
					}
					return (
						d(
							e,
							"\u0275fac",
							(function () {
								let n;
								return function (r) {
									return (n || (n = Sn(e)))(r || e);
								};
							})(),
						),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["SearchIcon"]],
								standalone: !0,
								features: [Rn, Cn],
								decls: 6,
								vars: 7,
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
										"fill-rule",
										"evenodd",
										"clip-rule",
										"evenodd",
										"d",
										"M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
										"fill",
										"currentColor",
									],
									[3, "id"],
									["width", "14", "height", "14", "fill", "white"],
								],
								template: function (t, r) {
									1 & t &&
										(Gn(),
										N(0, "svg", 0)(1, "g"),
										K(2, "path", 1),
										R(),
										N(3, "defs")(4, "clipPath", 2),
										K(5, "rect", 3),
										R()()()),
										2 & t &&
											(Me(r.getClassNames()),
											ve("aria-label", r.ariaLabel)("aria-hidden", r.ariaHidden)("role", r.role),
											y(1),
											ve("clip-path", r.pathId),
											y(3),
											p("id", r.pathId));
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})();
			const n_ = function (e) {
				return { "p-treenode-droppoint-active": e };
			};
			function LO(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 4),
						ot("drop", function (i) {
							return te(t), ne(D(2).onDropPoint(i, -1));
						})("dragover", function (i) {
							return te(t), ne(D(2).onDropPointDragOver(i));
						})("dragenter", function (i) {
							return te(t), ne(D(2).onDropPointDragEnter(i, -1));
						})("dragleave", function (i) {
							return te(t), ne(D(2).onDropPointDragLeave(i));
						}),
						R();
				}
				if (2 & e) {
					const t = D(2);
					p("ngClass", Oe(1, n_, t.draghoverPrev));
				}
			}
			function FO(e, n) {
				1 & e && K(0, "ChevronRightIcon", 14), 2 & e && p("styleClass", "p-tree-toggler-icon");
			}
			function kO(e, n) {
				1 & e && K(0, "ChevronDownIcon", 14), 2 & e && p("styleClass", "p-tree-toggler-icon");
			}
			function HO(e, n) {
				if (
					(1 & e &&
						(De(0), _(1, FO, 1, 1, "ChevronRightIcon", 13), _(2, kO, 1, 1, "ChevronDownIcon", 13), we()),
					2 & e)
				) {
					const t = D(3);
					y(1), p("ngIf", !t.node.expanded), y(1), p("ngIf", t.node.expanded);
				}
			}
			function VO(e, n) {}
			function BO(e, n) {
				1 & e && _(0, VO, 0, 0, "ng-template");
			}
			const ll = function (e) {
				return { $implicit: e };
			};
			function UO(e, n) {
				if ((1 & e && (N(0, "span", 15), _(1, BO, 1, 0, null, 16), R()), 2 & e)) {
					const t = D(3);
					y(1),
						p("ngTemplateOutlet", t.tree.togglerIconTemplate)(
							"ngTemplateOutletContext",
							Oe(2, ll, t.node.expanded),
						);
				}
			}
			function jO(e, n) {
				1 & e && K(0, "CheckIcon", 14), 2 & e && p("styleClass", "p-checkbox-icon");
			}
			function $O(e, n) {
				1 & e && K(0, "MinusIcon", 14), 2 & e && p("styleClass", "p-checkbox-icon");
			}
			function zO(e, n) {
				if ((1 & e && (De(0), _(1, jO, 1, 1, "CheckIcon", 13), _(2, $O, 1, 1, "MinusIcon", 13), we()), 2 & e)) {
					const t = D(4);
					y(1), p("ngIf", t.isSelected()), y(1), p("ngIf", t.node.partialSelected);
				}
			}
			function WO(e, n) {}
			function GO(e, n) {
				1 & e && _(0, WO, 0, 0, "ng-template");
			}
			const qO = function (e) {
					return { "p-checkbox-disabled": e };
				},
				KO = function (e, n) {
					return { "p-highlight": e, "p-indeterminate": n };
				},
				ZO = function (e, n) {
					return { $implicit: e, partialSelected: n };
				};
			function YO(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 17)(1, "div", 18),
						_(2, zO, 3, 2, "ng-container", 8),
						_(3, GO, 1, 0, null, 16),
						R()()),
					2 & e)
				) {
					const t = D(3);
					p("ngClass", Oe(6, qO, !1 === t.node.selectable)),
						ve("aria-checked", t.isSelected()),
						y(1),
						p("ngClass", On(8, KO, t.isSelected(), t.node.partialSelected)),
						y(1),
						p("ngIf", !t.tree.checkboxIconTemplate),
						y(1),
						p("ngTemplateOutlet", t.tree.checkboxIconTemplate)(
							"ngTemplateOutletContext",
							On(11, ZO, t.isSelected(), t.node.partialSelected),
						);
				}
			}
			function QO(e, n) {
				1 & e && K(0, "span"), 2 & e && Me(D(3).getIcon());
			}
			function XO(e, n) {
				if ((1 & e && (N(0, "span"), Ft(1), R()), 2 & e)) {
					const t = D(3);
					y(1), Ci(t.node.label);
				}
			}
			function JO(e, n) {
				1 & e && Ee(0);
			}
			function e2(e, n) {
				if ((1 & e && (N(0, "span"), _(1, JO, 1, 0, "ng-container", 16), R()), 2 & e)) {
					const t = D(3);
					y(1),
						p("ngTemplateOutlet", t.tree.getTemplateForNode(t.node))(
							"ngTemplateOutletContext",
							Oe(2, ll, t.node),
						);
				}
			}
			function t2(e, n) {
				if ((1 & e && K(0, "p-treeNode", 21), 2 & e)) {
					const t = n.$implicit,
						r = n.first,
						i = n.last,
						o = n.index,
						s = D(4);
					p("node", t)("parentNode", s.node)("firstChild", r)("lastChild", i)("index", o)(
						"itemSize",
						s.itemSize,
					)("level", s.level + 1);
				}
			}
			function n2(e, n) {
				if ((1 & e && (N(0, "ul", 19), _(1, t2, 1, 7, "p-treeNode", 20), R()), 2 & e)) {
					const t = D(3);
					fi("display", t.node.expanded ? "block" : "none"),
						y(1),
						p("ngForOf", t.node.children)("ngForTrackBy", t.tree.trackBy);
				}
			}
			const r2 = function (e, n) {
					return ["p-treenode", e, n];
				},
				r_ = function (e) {
					return { height: e };
				},
				i2 = function (e, n, t) {
					return { "p-treenode-selectable": e, "p-treenode-dragover": n, "p-highlight": t };
				};
			function o2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 5)(1, "div", 6),
						ot("click", function (i) {
							return te(t), ne(D(2).onNodeClick(i));
						})("contextmenu", function (i) {
							return te(t), ne(D(2).onNodeRightClick(i));
						})("touchend", function () {
							return te(t), ne(D(2).onNodeTouchEnd());
						})("drop", function (i) {
							return te(t), ne(D(2).onDropNode(i));
						})("dragover", function (i) {
							return te(t), ne(D(2).onDropNodeDragOver(i));
						})("dragenter", function (i) {
							return te(t), ne(D(2).onDropNodeDragEnter(i));
						})("dragleave", function (i) {
							return te(t), ne(D(2).onDropNodeDragLeave(i));
						})("dragstart", function (i) {
							return te(t), ne(D(2).onDragStart(i));
						})("dragend", function (i) {
							return te(t), ne(D(2).onDragStop(i));
						})("keydown", function (i) {
							return te(t), ne(D(2).onKeyDown(i));
						}),
						N(2, "button", 7),
						ot("click", function (i) {
							return te(t), ne(D(2).toggle(i));
						}),
						_(3, HO, 3, 2, "ng-container", 8),
						_(4, UO, 2, 4, "span", 9),
						R(),
						_(5, YO, 4, 14, "div", 10),
						_(6, QO, 1, 2, "span", 3),
						N(7, "span", 11),
						_(8, XO, 2, 1, "span", 8),
						_(9, e2, 2, 4, "span", 8),
						R()(),
						_(10, n2, 2, 4, "ul", 12),
						R();
				}
				if (2 & e) {
					const t = D(2);
					St(t.node.style),
						p("ngClass", On(22, r2, t.node.styleClass || "", t.isLeaf() ? "p-treenode-leaf" : ""))(
							"ngStyle",
							Oe(25, r_, t.itemSize + "px"),
						),
						y(1),
						fi("padding-left", t.level * t.indentation + "rem"),
						p("draggable", t.tree.draggableNodes)(
							"ngClass",
							Uu(
								27,
								i2,
								t.tree.selectionMode && !1 !== t.node.selectable,
								t.draghoverNode,
								t.isSelected(),
							),
						),
						ve("tabindex", 0)("aria-posinset", t.index + 1)("aria-expanded", t.node.expanded)(
							"aria-selected",
							t.isSelected(),
						)("aria-label", t.node.label)("data-id", t.node.key),
						y(1),
						ve("aria-label", t.tree.togglerAriaLabel),
						y(1),
						p("ngIf", !t.tree.togglerIconTemplate),
						y(1),
						p("ngIf", t.tree.togglerIconTemplate),
						y(1),
						p("ngIf", "checkbox" == t.tree.selectionMode),
						y(1),
						p("ngIf", t.node.icon || t.node.expandedIcon || t.node.collapsedIcon),
						y(2),
						p("ngIf", !t.tree.getTemplateForNode(t.node)),
						y(1),
						p("ngIf", t.tree.getTemplateForNode(t.node)),
						y(1),
						p("ngIf", !t.tree.virtualScroll && t.node.children && t.node.expanded);
				}
			}
			function s2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "li", 4),
						ot("drop", function (i) {
							return te(t), ne(D(2).onDropPoint(i, 1));
						})("dragover", function (i) {
							return te(t), ne(D(2).onDropPointDragOver(i));
						})("dragenter", function (i) {
							return te(t), ne(D(2).onDropPointDragEnter(i, 1));
						})("dragleave", function (i) {
							return te(t), ne(D(2).onDropPointDragLeave(i));
						}),
						R();
				}
				if (2 & e) {
					const t = D(2);
					p("ngClass", Oe(1, n_, t.draghoverNext));
				}
			}
			const i_ = function (e) {
				return { "p-treenode-connector-line": e };
			};
			function a2(e, n) {
				if (
					(1 & e &&
						(N(0, "td", 27)(1, "table", 28)(2, "tbody")(3, "tr"),
						K(4, "td", 29),
						R(),
						N(5, "tr"),
						K(6, "td", 29),
						R()()()()),
					2 & e)
				) {
					const t = D(3);
					y(4), p("ngClass", Oe(2, i_, !t.firstChild)), y(2), p("ngClass", Oe(4, i_, !t.lastChild));
				}
			}
			function l2(e, n) {
				if ((1 & e && K(0, "PlusIcon", 32), 2 & e)) {
					const t = D(5);
					p("styleClass", "p-tree-toggler-icon")("ariaLabel", t.tree.togglerAriaLabel);
				}
			}
			function c2(e, n) {
				if ((1 & e && K(0, "MinusIcon", 32), 2 & e)) {
					const t = D(5);
					p("styleClass", "p-tree-toggler-icon")("ariaLabel", t.tree.togglerAriaLabel);
				}
			}
			function u2(e, n) {
				if ((1 & e && (De(0), _(1, l2, 1, 2, "PlusIcon", 31), _(2, c2, 1, 2, "MinusIcon", 31), we()), 2 & e)) {
					const t = D(4);
					y(1), p("ngIf", !t.node.expanded), y(1), p("ngIf", t.node.expanded);
				}
			}
			function g2(e, n) {}
			function d2(e, n) {
				1 & e && _(0, g2, 0, 0, "ng-template");
			}
			function f2(e, n) {
				if ((1 & e && (N(0, "span", 15), _(1, d2, 1, 0, null, 16), R()), 2 & e)) {
					const t = D(4);
					y(1),
						p("ngTemplateOutlet", t.tree.togglerIconTemplate)(
							"ngTemplateOutletContext",
							Oe(2, ll, t.node.expanded),
						);
				}
			}
			function C2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "span", 30),
						ot("click", function (i) {
							return te(t), ne(D(3).toggle(i));
						}),
						_(1, u2, 3, 2, "ng-container", 8),
						_(2, f2, 2, 4, "span", 9),
						R();
				}
				if (2 & e) {
					const t = D(3);
					p("ngClass", "p-tree-toggler"),
						y(1),
						p("ngIf", !t.tree.togglerIconTemplate),
						y(1),
						p("ngIf", t.tree.togglerIconTemplate);
				}
			}
			function I2(e, n) {
				1 & e && K(0, "span"), 2 & e && Me(D(3).getIcon());
			}
			function h2(e, n) {
				if ((1 & e && (N(0, "span"), Ft(1), R()), 2 & e)) {
					const t = D(3);
					y(1), Ci(t.node.label);
				}
			}
			function p2(e, n) {
				1 & e && Ee(0);
			}
			function A2(e, n) {
				if ((1 & e && (N(0, "span"), _(1, p2, 1, 0, "ng-container", 16), R()), 2 & e)) {
					const t = D(3);
					y(1),
						p("ngTemplateOutlet", t.tree.getTemplateForNode(t.node))(
							"ngTemplateOutletContext",
							Oe(2, ll, t.node),
						);
				}
			}
			function m2(e, n) {
				if ((1 & e && K(0, "p-treeNode", 36), 2 & e)) {
					const r = n.first,
						i = n.last;
					p("node", n.$implicit)("firstChild", r)("lastChild", i);
				}
			}
			function y2(e, n) {
				if ((1 & e && (N(0, "td", 33)(1, "div", 34), _(2, m2, 1, 3, "p-treeNode", 35), R()()), 2 & e)) {
					const t = D(3);
					fi("display", t.node.expanded ? "table-cell" : "none"),
						y(2),
						p("ngForOf", t.node.children)("ngForTrackBy", t.tree.trackBy);
				}
			}
			const _2 = function (e) {
					return { "p-treenode-collapsed": e };
				},
				v2 = function (e, n) {
					return { "p-treenode-selectable": e, "p-highlight": n };
				};
			function D2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "table")(1, "tbody")(2, "tr"),
						_(3, a2, 7, 6, "td", 22),
						N(4, "td", 23)(5, "div", 24),
						ot("click", function (i) {
							return te(t), ne(D(2).onNodeClick(i));
						})("contextmenu", function (i) {
							return te(t), ne(D(2).onNodeRightClick(i));
						})("touchend", function () {
							return te(t), ne(D(2).onNodeTouchEnd());
						})("keydown", function (i) {
							return te(t), ne(D(2).onNodeKeydown(i));
						}),
						_(6, C2, 3, 3, "span", 25),
						_(7, I2, 1, 2, "span", 3),
						N(8, "span", 11),
						_(9, h2, 2, 1, "span", 8),
						_(10, A2, 2, 4, "span", 8),
						R()()(),
						_(11, y2, 3, 4, "td", 26),
						R()()();
				}
				if (2 & e) {
					const t = D(2);
					Me(t.node.styleClass),
						y(3),
						p("ngIf", !t.root),
						y(1),
						p("ngClass", Oe(10, _2, !t.node.expanded)),
						y(1),
						p("ngClass", On(12, v2, t.tree.selectionMode, t.isSelected())),
						y(1),
						p("ngIf", !t.isLeaf()),
						y(1),
						p("ngIf", t.node.icon || t.node.expandedIcon || t.node.collapsedIcon),
						y(2),
						p("ngIf", !t.tree.getTemplateForNode(t.node)),
						y(1),
						p("ngIf", t.tree.getTemplateForNode(t.node)),
						y(1),
						p("ngIf", t.node.children && t.node.expanded);
				}
			}
			function w2(e, n) {
				if (
					(1 & e &&
						(_(0, LO, 1, 3, "li", 1),
						_(1, o2, 11, 31, "li", 2),
						_(2, s2, 1, 3, "li", 1),
						_(3, D2, 12, 15, "table", 3)),
					2 & e)
				) {
					const t = D();
					p("ngIf", t.tree.droppableNodes),
						y(1),
						p("ngIf", !t.tree.horizontal),
						y(1),
						p("ngIf", t.tree.droppableNodes && t.lastChild),
						y(1),
						p("ngIf", t.tree.horizontal);
				}
			}
			const E2 = ["filter"],
				S2 = ["scroller"],
				b2 = ["wrapper"];
			function T2(e, n) {
				1 & e && K(0, "i"), 2 & e && Me("p-tree-loading-icon pi-spin " + D(3).loadingIcon);
			}
			function M2(e, n) {
				1 & e && K(0, "SpinnerIcon", 13), 2 & e && p("spin", !0)("styleClass", "p-tree-loading-icon");
			}
			function N2(e, n) {}
			function P2(e, n) {
				1 & e && _(0, N2, 0, 0, "ng-template");
			}
			function R2(e, n) {
				if ((1 & e && (N(0, "span", 14), _(1, P2, 1, 0, null, 4), R()), 2 & e)) {
					const t = D(4);
					y(1), p("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function x2(e, n) {
				if ((1 & e && (De(0), _(1, M2, 1, 2, "SpinnerIcon", 11), _(2, R2, 2, 1, "span", 12), we()), 2 & e)) {
					const t = D(3);
					y(1), p("ngIf", !t.loadingIconTemplate), y(1), p("ngIf", t.loadingIconTemplate);
				}
			}
			function O2(e, n) {
				if (
					(1 & e && (N(0, "div", 9), _(1, T2, 1, 2, "i", 10), _(2, x2, 3, 2, "ng-container", 7), R()), 2 & e)
				) {
					const t = D(2);
					y(1), p("ngIf", t.loadingIcon), y(1), p("ngIf", !t.loadingIcon);
				}
			}
			function L2(e, n) {
				1 & e && Ee(0);
			}
			function F2(e, n) {
				1 & e && K(0, "SearchIcon", 20), 2 & e && p("styleClass", "p-tree-filter-icon");
			}
			function k2(e, n) {}
			function H2(e, n) {
				1 & e && _(0, k2, 0, 0, "ng-template");
			}
			function V2(e, n) {
				if ((1 & e && (N(0, "span", 21), _(1, H2, 1, 0, null, 4), R()), 2 & e)) {
					const t = D(3);
					y(1), p("ngTemplateOutlet", t.filterIconTemplate);
				}
			}
			function B2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "div", 15)(1, "input", 16, 17),
						ot("keydown.enter", function (i) {
							return i.preventDefault();
						})("input", function (i) {
							return te(t), ne(D(2)._filter(i.target.value));
						}),
						R(),
						_(3, F2, 1, 1, "SearchIcon", 18),
						_(4, V2, 2, 1, "span", 19),
						R();
				}
				if (2 & e) {
					const t = D(2);
					y(1),
						ve("placeholder", t.filterPlaceholder),
						y(2),
						p("ngIf", !t.filterIconTemplate),
						y(1),
						p("ngIf", t.filterIconTemplate);
				}
			}
			function U2(e, n) {
				if ((1 & e && K(0, "p-treeNode", 28, 29), 2 & e)) {
					const t = n.$implicit,
						r = n.first,
						i = n.last,
						o = n.index,
						s = D(2).options,
						a = D(3);
					p("level", t.level)("rowNode", t)("node", t.node)("firstChild", r)("lastChild", i)(
						"index",
						a.getIndex(s, o),
					)("itemSize", s.itemSize)("indentation", a.indentation);
				}
			}
			function j2(e, n) {
				if ((1 & e && (N(0, "ul", 26), _(1, U2, 2, 8, "p-treeNode", 27), R()), 2 & e)) {
					const t = D(),
						r = t.options,
						i = t.$implicit,
						o = D(3);
					St(r.contentStyle),
						p("ngClass", r.contentStyleClass),
						ve("aria-label", o.ariaLabel)("aria-labelledby", o.ariaLabelledBy),
						y(1),
						p("ngForOf", i)("ngForTrackBy", o.trackBy);
				}
			}
			function $2(e, n) {
				1 & e && _(0, j2, 2, 7, "ul", 25), 2 & e && p("ngIf", n.$implicit);
			}
			function z2(e, n) {
				1 & e && Ee(0);
			}
			const W2 = function (e) {
				return { options: e };
			};
			function G2(e, n) {
				if ((1 & e && _(0, z2, 1, 0, "ng-container", 31), 2 & e)) {
					const t = n.options;
					p("ngTemplateOutlet", D(4).loaderTemplate)("ngTemplateOutletContext", Oe(2, W2, t));
				}
			}
			function q2(e, n) {
				1 & e && (De(0), _(1, G2, 1, 4, "ng-template", 30), we());
			}
			function K2(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "p-scroller", 22, 23),
						ot("onScroll", function (i) {
							return te(t), ne(D(2).onScroll.emit(i));
						})("onScrollIndexChange", function (i) {
							return te(t), ne(D(2).onScrollIndexChange.emit(i));
						})("onLazyLoad", function (i) {
							return te(t), ne(D(2).onLazyLoad.emit(i));
						}),
						_(2, $2, 1, 1, "ng-template", 24),
						_(3, q2, 2, 0, "ng-container", 7),
						R();
				}
				if (2 & e) {
					const t = D(2);
					St(Oe(9, r_, "flex" !== t.scrollHeight ? t.scrollHeight : void 0)),
						p("items", t.serializedValue)("tabindex", -1)(
							"scrollHeight",
							"flex" !== t.scrollHeight ? void 0 : "100%",
						)("itemSize", t.virtualScrollItemSize || t._virtualNodeHeight)("lazy", t.lazy)(
							"options",
							t.virtualScrollOptions,
						),
						y(3),
						p("ngIf", t.loaderTemplate);
				}
			}
			function Z2(e, n) {
				if ((1 & e && K(0, "p-treeNode", 37), 2 & e)) {
					const r = n.first,
						i = n.last,
						o = n.index;
					p("node", n.$implicit)("firstChild", r)("lastChild", i)("index", o)("level", 0);
				}
			}
			function Y2(e, n) {
				if ((1 & e && (N(0, "ul", 35), _(1, Z2, 1, 5, "p-treeNode", 36), R()), 2 & e)) {
					const t = D(3);
					ve("aria-label", t.ariaLabel)("aria-labelledby", t.ariaLabelledBy),
						y(1),
						p("ngForOf", t.getRootNode())("ngForTrackBy", t.trackBy);
				}
			}
			function Q2(e, n) {
				if ((1 & e && (De(0), N(1, "div", 32, 33), _(3, Y2, 2, 4, "ul", 34), R(), we()), 2 & e)) {
					const t = D(2);
					y(1), fi("max-height", t.scrollHeight), y(2), p("ngIf", t.getRootNode());
				}
			}
			function X2(e, n) {
				if ((1 & e && (De(0), Ft(1), we()), 2 & e)) {
					const t = D(3);
					y(1), Ar(" ", t.emptyMessageLabel, " ");
				}
			}
			function J2(e, n) {
				1 & e && Ee(0, null, 40);
			}
			function eL(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 38), _(1, X2, 2, 1, "ng-container", 39), _(2, J2, 2, 0, "ng-container", 4), R()),
					2 & e)
				) {
					const t = D(2);
					y(1),
						p("ngIf", !t.emptyMessageTemplate)("ngIfElse", t.emptyFilter),
						y(1),
						p("ngTemplateOutlet", t.emptyMessageTemplate);
				}
			}
			function tL(e, n) {
				1 & e && Ee(0);
			}
			const nL = function (e, n, t, r) {
				return {
					"p-tree p-component": !0,
					"p-tree-selectable": e,
					"p-treenode-dragover": n,
					"p-tree-loading": t,
					"p-tree-flex-scrollable": r,
				};
			};
			function rL(e, n) {
				if (1 & e) {
					const t = dn();
					N(0, "div", 2),
						ot("drop", function (i) {
							return te(t), ne(D().onDrop(i));
						})("dragover", function (i) {
							return te(t), ne(D().onDragOver(i));
						})("dragenter", function () {
							return te(t), ne(D().onDragEnter());
						})("dragleave", function (i) {
							return te(t), ne(D().onDragLeave(i));
						}),
						_(1, O2, 3, 2, "div", 3),
						_(2, L2, 1, 0, "ng-container", 4),
						_(3, B2, 5, 3, "div", 5),
						_(4, K2, 4, 11, "p-scroller", 6),
						_(5, Q2, 4, 3, "ng-container", 7),
						_(6, eL, 3, 3, "div", 8),
						_(7, tL, 1, 0, "ng-container", 4),
						R();
				}
				if (2 & e) {
					const t = D();
					Me(t.styleClass),
						p("ngClass", hA(11, nL, t.selectionMode, t.dragHover, t.loading, "flex" === t.scrollHeight))(
							"ngStyle",
							t.style,
						),
						y(1),
						p("ngIf", t.loading),
						y(1),
						p("ngTemplateOutlet", t.headerTemplate),
						y(1),
						p("ngIf", t.filter),
						y(1),
						p("ngIf", t.virtualScroll),
						y(1),
						p("ngIf", !t.virtualScroll),
						y(1),
						p("ngIf", !t.loading && (null == t.getRootNode() || 0 === t.getRootNode().length)),
						y(1),
						p("ngTemplateOutlet", t.footerTemplate);
				}
			}
			function iL(e, n) {
				1 & e && Ee(0);
			}
			function oL(e, n) {
				1 & e && K(0, "i"), 2 & e && Me("p-tree-loading-icon pi-spin " + D(3).loadingIcon);
			}
			function sL(e, n) {
				1 & e && K(0, "SpinnerIcon", 13), 2 & e && p("spin", !0)("styleClass", "p-tree-loading-icon");
			}
			function aL(e, n) {}
			function lL(e, n) {
				1 & e && _(0, aL, 0, 0, "ng-template");
			}
			function cL(e, n) {
				if ((1 & e && (N(0, "span", 14), _(1, lL, 1, 0, null, 4), R()), 2 & e)) {
					const t = D(4);
					y(1), p("ngTemplateOutlet", t.loadingIconTemplate);
				}
			}
			function uL(e, n) {
				if ((1 & e && (De(0), _(1, sL, 1, 2, "SpinnerIcon", 11), _(2, cL, 2, 1, "span", 12), we()), 2 & e)) {
					const t = D(3);
					y(1), p("ngIf", !t.loadingIconTemplate), y(1), p("ngIf", t.loadingIconTemplate);
				}
			}
			function gL(e, n) {
				if (
					(1 & e && (N(0, "div", 43), _(1, oL, 1, 2, "i", 10), _(2, uL, 3, 2, "ng-container", 7), R()), 2 & e)
				) {
					const t = D(2);
					y(1), p("ngIf", t.loadingIcon), y(1), p("ngIf", !t.loadingIcon);
				}
			}
			function dL(e, n) {
				if ((1 & e && (N(0, "table"), K(1, "p-treeNode", 44), R()), 2 & e)) {
					const t = D(2);
					y(1), p("node", t.value[0])("root", !0);
				}
			}
			function fL(e, n) {
				if ((1 & e && (De(0), Ft(1), we()), 2 & e)) {
					const t = D(3);
					y(1), Ar(" ", t.emptyMessageLabel, " ");
				}
			}
			function CL(e, n) {
				1 & e && Ee(0, null, 40);
			}
			function IL(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 38), _(1, fL, 2, 1, "ng-container", 39), _(2, CL, 2, 0, "ng-container", 4), R()),
					2 & e)
				) {
					const t = D(2);
					y(1),
						p("ngIf", !t.emptyMessageTemplate)("ngIfElse", t.emptyFilter),
						y(1),
						p("ngTemplateOutlet", t.emptyMessageTemplate);
				}
			}
			function hL(e, n) {
				1 & e && Ee(0);
			}
			const pL = function (e) {
				return { "p-tree p-tree-horizontal p-component": !0, "p-tree-selectable": e };
			};
			function AL(e, n) {
				if (
					(1 & e &&
						(N(0, "div", 41),
						_(1, iL, 1, 0, "ng-container", 4),
						_(2, gL, 3, 2, "div", 42),
						_(3, dL, 2, 2, "table", 7),
						_(4, IL, 3, 3, "div", 8),
						_(5, hL, 1, 0, "ng-container", 4),
						R()),
					2 & e)
				) {
					const t = D();
					Me(t.styleClass),
						p("ngClass", Oe(9, pL, t.selectionMode))("ngStyle", t.style),
						y(1),
						p("ngTemplateOutlet", t.headerTemplate),
						y(1),
						p("ngIf", t.loading),
						y(1),
						p("ngIf", t.value && t.value[0]),
						y(1),
						p("ngIf", !t.loading && (null == t.getRootNode() || 0 === t.getRootNode().length)),
						y(1),
						p("ngTemplateOutlet", t.footerTemplate);
				}
			}
			let mL = (() => {
					class e {
						constructor(t) {
							d(this, "rowNode", void 0),
								d(this, "node", void 0),
								d(this, "parentNode", void 0),
								d(this, "root", void 0),
								d(this, "index", void 0),
								d(this, "firstChild", void 0),
								d(this, "lastChild", void 0),
								d(this, "level", void 0),
								d(this, "indentation", void 0),
								d(this, "itemSize", void 0),
								d(this, "tree", void 0),
								d(this, "timeout", void 0),
								d(this, "draghoverPrev", void 0),
								d(this, "draghoverNext", void 0),
								d(this, "draghoverNode", void 0),
								(this.tree = t);
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
									: this.node.expanded && this.node.children && this.node.children?.length
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
										subNodes: this.node?.parent ? this.node.parent.children : this.tree.value,
										index: this.index,
										scope: this.tree.draggableScope,
								  }))
								: t.preventDefault();
						}
						onDragStop(t) {
							this.tree.dragDropService.stopDrag({
								node: this.node,
								subNodes: this.node?.parent ? this.node.parent.children : this.tree.value,
								index: this.index,
							});
						}
						onDropNodeDragOver(t) {
							(t.dataTransfer.dropEffect = "move"),
								this.tree.droppableNodes && (t.preventDefault(), t.stopPropagation());
						}
						onDropNode(t) {
							if (this.tree.droppableNodes && !1 !== this.node?.droppable) {
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
								!1 !== this.node?.droppable &&
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
							const r = t.target.parentElement?.parentElement;
							if (
								!(
									"P-TREENODE" !== r?.nodeName ||
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
										!this.node?.expanded && !this.tree.isNodeLeaf(this.node) && this.expand(t),
											t.preventDefault();
										break;
									case 37:
										if (this.node?.expanded) this.collapse(t);
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
							const i = Array.from(t.children).find((o) => J.hasClass(o, "p-treenode")).children[1];
							return i && i.children.length > 0
								? this.findLastVisibleDescendant(i.children[i.children.length - 1])
								: t;
						}
						getParentNodeElement(t) {
							const r = t.parentElement?.parentElement?.parentElement;
							return "P-TREENODE" === r?.tagName ? r : null;
						}
						focusNode(t) {
							this.tree.droppableNodes
								? t.children[1].children[0].focus()
								: t.children[0].children[0].focus();
						}
						focusVirtualNode() {
							this.timeout = setTimeout(() => {
								let t = J.findSingle(document.body, `[data-id="${this.node?.key ?? this.node?.data}"]`);
								J.focus(t);
							}, 1);
						}
					}
					return (
						d(e, "ICON_CLASS", "p-treenode-icon "),
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(hs(() => o_)));
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
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
									[
										1,
										"p-treenode-droppoint",
										3,
										"ngClass",
										"drop",
										"dragover",
										"dragenter",
										"dragleave",
									],
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
									1 & t && _(0, w2, 4, 4, "ng-template", 0), 2 & t && p("ngIf", r.node);
								},
								dependencies: function () {
									return [Di, el, wi, Si, Ei, Wy, Yy, Qy, Xy, Jy, e_, e];
								},
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				o_ = (() => {
					class e {
						get virtualNodeHeight() {
							return this._virtualNodeHeight;
						}
						set virtualNodeHeight(t) {
							(this._virtualNodeHeight = t),
								console.warn(
									"The virtualNodeHeight property is deprecated, use virtualScrollItemSize property instead.",
								);
						}
						constructor(t, r, i, o) {
							d(this, "el", void 0),
								d(this, "dragDropService", void 0),
								d(this, "config", void 0),
								d(this, "cd", void 0),
								d(this, "value", void 0),
								d(this, "selectionMode", void 0),
								d(this, "selection", void 0),
								d(this, "style", void 0),
								d(this, "styleClass", void 0),
								d(this, "contextMenu", void 0),
								d(this, "layout", "vertical"),
								d(this, "draggableScope", void 0),
								d(this, "droppableScope", void 0),
								d(this, "draggableNodes", void 0),
								d(this, "droppableNodes", void 0),
								d(this, "metaKeySelection", !0),
								d(this, "propagateSelectionUp", !0),
								d(this, "propagateSelectionDown", !0),
								d(this, "loading", void 0),
								d(this, "loadingIcon", void 0),
								d(this, "emptyMessage", ""),
								d(this, "ariaLabel", void 0),
								d(this, "togglerAriaLabel", void 0),
								d(this, "ariaLabelledBy", void 0),
								d(this, "validateDrop", void 0),
								d(this, "filter", void 0),
								d(this, "filterBy", "label"),
								d(this, "filterMode", "lenient"),
								d(this, "filterPlaceholder", void 0),
								d(this, "filteredNodes", void 0),
								d(this, "filterLocale", void 0),
								d(this, "scrollHeight", void 0),
								d(this, "lazy", !1),
								d(this, "virtualScroll", void 0),
								d(this, "virtualScrollItemSize", void 0),
								d(this, "virtualScrollOptions", void 0),
								d(this, "indentation", 1.5),
								d(this, "_templateMap", void 0),
								d(this, "trackBy", (s, a) => a),
								d(this, "_virtualNodeHeight", void 0),
								d(this, "selectionChange", new ie()),
								d(this, "onNodeSelect", new ie()),
								d(this, "onNodeUnselect", new ie()),
								d(this, "onNodeExpand", new ie()),
								d(this, "onNodeCollapse", new ie()),
								d(this, "onNodeContextMenuSelect", new ie()),
								d(this, "onNodeDrop", new ie()),
								d(this, "onLazyLoad", new ie()),
								d(this, "onScroll", new ie()),
								d(this, "onScrollIndexChange", new ie()),
								d(this, "onFilter", new ie()),
								d(this, "templates", void 0),
								d(this, "filterViewChild", void 0),
								d(this, "scroller", void 0),
								d(this, "wrapperViewChild", void 0),
								d(this, "serializedValue", void 0),
								d(this, "headerTemplate", void 0),
								d(this, "footerTemplate", void 0),
								d(this, "loaderTemplate", void 0),
								d(this, "emptyMessageTemplate", void 0),
								d(this, "togglerIconTemplate", void 0),
								d(this, "checkboxIconTemplate", void 0),
								d(this, "loadingIconTemplate", void 0),
								d(this, "filterIconTemplate", void 0),
								d(this, "nodeTouched", void 0),
								d(this, "dragNodeTree", void 0),
								d(this, "dragNode", void 0),
								d(this, "dragNodeSubNodes", void 0),
								d(this, "dragNodeIndex", void 0),
								d(this, "dragNodeScope", void 0),
								d(this, "dragHover", void 0),
								d(this, "dragStartSubscription", void 0),
								d(this, "dragStopSubscription", void 0),
								(this.el = t),
								(this.dragDropService = r),
								(this.config = i),
								(this.cd = o);
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
							return this.emptyMessage || this.config.getTranslation(bx.EMPTY_MESSAGE);
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
							if (!J.hasClass(i, "p-tree-toggler") && !J.hasClass(i, "p-tree-toggler-icon")) {
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
									o = Mi.removeAccents(r).toLocaleLowerCase(this.filterLocale),
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
							this.virtualScroll && this.scroller?.scrollToIndex(t);
						}
						scrollTo(t) {
							this.virtualScroll
								? this.scroller?.scrollTo(t)
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
						isFilterMatched(t, r) {
							let { searchFields: i, filterText: o, isStrictMode: s } = r,
								a = !1;
							for (let l of i)
								Mi.removeAccents(String(Mi.resolveFieldData(t, l)))
									.toLocaleLowerCase(this.filterLocale)
									.indexOf(o) > -1 && (a = !0);
							return (
								(!a || (s && !this.isNodeLeaf(t))) &&
									(a =
										this.findFilteredNodes(t, {
											searchFields: i,
											filterText: o,
											isStrictMode: s,
										}) || a),
								a
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
						d(e, "\u0275fac", function (t) {
							return new (t || e)(b(Wt), b(Tx, 8), b($y), b(Ho));
						}),
						d(
							e,
							"\u0275cmp",
							Ae({
								type: e,
								selectors: [["p-tree"]],
								contentQueries: function (t, r, i) {
									if ((1 & t && Yn(i, Ko, 4), 2 & t)) {
										let o;
										bt((o = Tt())) && (r.templates = o);
									}
								},
								viewQuery: function (t, r) {
									if ((1 & t && (Ai(E2, 5), Ai(S2, 5), Ai(b2, 5)), 2 & t)) {
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
								features: [Dn],
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
									1 & t && (_(0, rL, 8, 16, "div", 0), _(1, AL, 6, 11, "div", 1)),
										2 & t && (p("ngIf", !r.horizontal), y(1), p("ngIf", r.horizontal));
								},
								dependencies: function () {
									return [Di, el, wi, Si, Ei, Ko, OO, t_, Ni, mL];
								},
								styles: [
									".p-tree-container{margin:0;padding:0;list-style-type:none;overflow:auto}.p-treenode-children{margin:0;padding:0;list-style-type:none}.p-tree-wrapper{overflow:auto}.p-treenode-selectable{cursor:pointer;-webkit-user-select:none;user-select:none}.p-tree-toggler{cursor:pointer;-webkit-user-select:none;user-select:none;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;position:relative;flex-shrink:0}.p-treenode-leaf>.p-treenode-content .p-tree-toggler{visibility:hidden}.p-treenode-content{display:flex;align-items:center}.p-tree-filter{width:100%}.p-tree-filter-container{position:relative;display:block;width:100%}.p-tree-filter-icon{position:absolute;top:50%;margin-top:-.5rem}.p-tree-loading{position:relative;min-height:4rem}.p-tree .p-tree-loading-overlay{position:absolute;display:flex;align-items:center;justify-content:center;z-index:2}.p-tree-flex-scrollable{display:flex;flex:1;height:100%;flex-direction:column}.p-tree-flex-scrollable .p-tree-wrapper{flex:1}.p-tree .p-treenode-droppoint{height:4px;list-style-type:none}.p-tree .p-treenode-droppoint-active{border:0 none}.p-tree-horizontal{width:auto;padding-left:0;padding-right:0;overflow:auto}.p-tree.p-tree-horizontal table,.p-tree.p-tree-horizontal tr,.p-tree.p-tree-horizontal td{border-collapse:collapse;margin:0;padding:0;vertical-align:middle}.p-tree-horizontal .p-treenode-content{font-weight:400;padding:.4em 1em .4em .2em;display:flex;align-items:center}.p-tree-horizontal .p-treenode-parent .p-treenode-content{font-weight:400;white-space:nowrap}.p-tree.p-tree-horizontal .p-treenode{background:url(data:image/gif;base64,R0lGODlhAQABAIAAALGxsf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6Mzc6MzcgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMC0wMy0xMVQxMDoxNjo0MVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMC0wMy0xMVQxMjo0NDoxOVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9naWY8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PAA6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQABwD/ACwAAAAAAQABAAACAkQBADs=) repeat-x scroll center center transparent;padding:.25rem 2.5rem}.p-tree.p-tree-horizontal .p-treenode.p-treenode-leaf,.p-tree.p-tree-horizontal .p-treenode.p-treenode-collapsed{padding-right:0}.p-tree.p-tree-horizontal .p-treenode-children{padding:0;margin:0}.p-tree.p-tree-horizontal .p-treenode-connector{width:1px}.p-tree.p-tree-horizontal .p-treenode-connector-table{height:100%;width:1px}.p-tree.p-tree-horizontal .p-treenode-connector-line{background:url(data:image/gif;base64,R0lGODlhAQABAIAAALGxsf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6Mzc6MzcgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMC0wMy0xMVQxMDoxNjo0MVo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMC0wMy0xMVQxMjo0NDoxOVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9naWY8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PAA6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQABwD/ACwAAAAAAQABAAACAkQBADs=) repeat-y scroll 0 0 transparent;width:1px}.p-tree.p-tree-horizontal table{height:0}.p-scroller .p-tree-container{overflow:visible}\n",
								],
								encapsulation: 2,
							}),
						),
						e
					);
				})(),
				yL = (() => {
					class e {}
					return (
						d(e, "\u0275fac", function (t) {
							return new (t || e)();
						}),
						d(e, "\u0275mod", gt({ type: e })),
						d(e, "\u0275inj", nt({ imports: [Xn, Dr, Gy, Zy, Yy, Qy, Xy, Jy, t_, Ni, e_, Dr, Zy] })),
						e
					);
				})(),
				ed = (() => {
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
							return new (t || e)(L(Ny));
						}),
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			const { isArray: vL } = Array,
				{ getPrototypeOf: DL, prototype: wL, keys: EL } = Object;
			const { isArray: TL } = Array;
			function td(...e) {
				const n = ji(e),
					t = (function tD(e) {
						return ge(Fl(e)) ? e.pop() : void 0;
					})(e),
					{ args: r, keys: i } = (function SL(e) {
						if (1 === e.length) {
							const n = e[0];
							if (vL(n)) return { args: n, keys: null };
							if (
								(function bL(e) {
									return e && "object" == typeof e && DL(e) === wL;
								})(n)
							) {
								const t = EL(n);
								return { args: t.map((r) => n[r]), keys: t };
							}
						}
						return { args: e, keys: null };
					})(e);
				if (0 === r.length) return We([], n);
				const o = new Re(
					(function RL(e, n, t = Un) {
						return (r) => {
							s_(
								n,
								() => {
									const { length: i } = e,
										o = new Array(i);
									let s = i,
										a = i;
									for (let l = 0; l < i; l++)
										s_(
											n,
											() => {
												const c = We(e[l], n);
												let u = !1;
												c.subscribe(
													ze(
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
									(function PL(e, n) {
										return e.reduce((t, r, i) => ((t[r] = n[i]), t), {});
									})(i, s)
							: Un,
					),
				);
				return t
					? o.pipe(
							(function NL(e) {
								return ae((n) =>
									(function ML(e, n) {
										return TL(n) ? e(...n) : e(n);
									})(e, n),
								);
							})(t),
					  )
					: o;
			}
			function s_(e, n, t) {
				e ? mn(t, e, n) : n();
			}
			const cl = Vi(
				(e) =>
					function () {
						e(this), (this.name = "EmptyError"), (this.message = "no elements in sequence");
					},
			);
			function nd(...e) {
				return (function xL() {
					return Nr(1);
				})()(We(e, ji(e)));
			}
			function a_(e) {
				return new Re((n) => {
					Bt(e()).subscribe(n);
				});
			}
			function Zo(e, n) {
				const t = ge(e) ? e : () => e,
					r = (i) => i.error(t());
				return new Re(n ? (i) => n.schedule(r, 0, i) : r);
			}
			function rd() {
				return $e((e, n) => {
					let t = null;
					e._refCount++;
					const r = ze(n, void 0, void 0, void 0, () => {
						if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (t = null);
						const i = e._connection,
							o = t;
						(t = null), i && (!o || i === o) && i.unsubscribe(), n.unsubscribe();
					});
					e.subscribe(r), r.closed || (t = e.connect());
				});
			}
			class l_ extends Re {
				constructor(n, t) {
					super(),
						(this.source = n),
						(this.subjectFactory = t),
						(this._subject = null),
						(this._refCount = 0),
						(this._connection = null),
						Fd(n) && (this.lift = n.lift);
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
								ze(
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
					return rd()(this);
				}
			}
			function Pi(e) {
				return e <= 0
					? () => Jt
					: $e((n, t) => {
							let r = 0;
							n.subscribe(
								ze(t, (i) => {
									++r <= e && (t.next(i), e <= r && t.complete());
								}),
							);
					  });
			}
			function ul(e) {
				return $e((n, t) => {
					let r = !1;
					n.subscribe(
						ze(
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
			function c_(e = LL) {
				return $e((n, t) => {
					let r = !1;
					n.subscribe(
						ze(
							t,
							(i) => {
								(r = !0), t.next(i);
							},
							() => (r ? t.complete() : t.error(e())),
						),
					);
				});
			}
			function LL() {
				return new cl();
			}
			function Er(e, n) {
				const t = arguments.length >= 2;
				return (r) => r.pipe(e ? Hn((i, o) => e(i, o, r)) : Un, Pi(1), t ? ul(n) : c_(() => new cl()));
			}
			function ct(e, n, t) {
				const r = ge(e) || n || t ? { next: e, error: n, complete: t } : e;
				return r
					? $e((i, o) => {
							var s;
							null === (s = r.subscribe) || void 0 === s || s.call(r);
							let a = !0;
							i.subscribe(
								ze(
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
					: Un;
			}
			function Sr(e) {
				return $e((n, t) => {
					let o,
						r = null,
						i = !1;
					(r = n.subscribe(
						ze(t, void 0, void 0, (s) => {
							(o = Bt(e(s, Sr(e)(n)))), r ? (r.unsubscribe(), (r = null), o.subscribe(t)) : (i = !0);
						}),
					)),
						i && (r.unsubscribe(), (r = null), o.subscribe(t));
				});
			}
			function id(e) {
				return e <= 0
					? () => Jt
					: $e((n, t) => {
							let r = [];
							n.subscribe(
								ze(
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
			const Z = "primary",
				Yo = Symbol("RouteTitle");
			class BL {
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
				return new BL(e);
			}
			function UL(e, n, t) {
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
			function pn(e, n) {
				const t = e ? Object.keys(e) : void 0,
					r = n ? Object.keys(n) : void 0;
				if (!t || !r || t.length != r.length) return !1;
				let i;
				for (let o = 0; o < t.length; o++) if (((i = t[o]), !u_(e[i], n[i]))) return !1;
				return !0;
			}
			function u_(e, n) {
				if (Array.isArray(e) && Array.isArray(n)) {
					if (e.length !== n.length) return !1;
					const t = [...e].sort(),
						r = [...n].sort();
					return t.every((i, o) => r[o] === i);
				}
				return e === n;
			}
			function g_(e) {
				return e.length > 0 ? e[e.length - 1] : null;
			}
			function tr(e) {
				return (function _L(e) {
					return !!e && (e instanceof Re || (ge(e.lift) && ge(e.subscribe)));
				})(e)
					? e
					: Ma(e)
					? We(Promise.resolve(e))
					: U(e);
			}
			const $L = {
					exact: function C_(e, n, t) {
						if (
							!br(e.segments, n.segments) ||
							!gl(e.segments, n.segments, t) ||
							e.numberOfChildren !== n.numberOfChildren
						)
							return !1;
						for (const r in n.children)
							if (!e.children[r] || !C_(e.children[r], n.children[r], t)) return !1;
						return !0;
					},
					subset: I_,
				},
				d_ = {
					exact: function zL(e, n) {
						return pn(e, n);
					},
					subset: function WL(e, n) {
						return (
							Object.keys(n).length <= Object.keys(e).length &&
							Object.keys(n).every((t) => u_(e[t], n[t]))
						);
					},
					ignored: () => !0,
				};
			function f_(e, n, t) {
				return (
					$L[t.paths](e.root, n.root, t.matrixParams) &&
					d_[t.queryParams](e.queryParams, n.queryParams) &&
					!("exact" === t.fragment && e.fragment !== n.fragment)
				);
			}
			function I_(e, n, t) {
				return h_(e, n, n.segments, t);
			}
			function h_(e, n, t, r) {
				if (e.segments.length > t.length) {
					const i = e.segments.slice(0, t.length);
					return !(!br(i, t) || n.hasChildren() || !gl(i, t, r));
				}
				if (e.segments.length === t.length) {
					if (!br(e.segments, t) || !gl(e.segments, t, r)) return !1;
					for (const i in n.children) if (!e.children[i] || !I_(e.children[i], n.children[i], r)) return !1;
					return !0;
				}
				{
					const i = t.slice(0, e.segments.length),
						o = t.slice(e.segments.length);
					return !!(br(e.segments, i) && gl(e.segments, i, r) && e.children[Z]) && h_(e.children[Z], n, o, r);
				}
			}
			function gl(e, n, t) {
				return n.every((r, i) => d_[t](e[i].parameters, r.parameters));
			}
			class xi {
				constructor(n = new ue([], {}), t = {}, r = null) {
					(this.root = n), (this.queryParams = t), (this.fragment = r);
				}
				get queryParamMap() {
					return this._queryParamMap || (this._queryParamMap = Ri(this.queryParams)), this._queryParamMap;
				}
				toString() {
					return KL.serialize(this);
				}
			}
			class ue {
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
					return m_(this);
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
					(e.ɵprov = F({
						token: e,
						factory: function () {
							return new od();
						},
						providedIn: "root",
					})),
					e
				);
			})();
			class od {
				parse(n) {
					const t = new oF(n);
					return new xi(t.parseRootSegment(), t.parseQueryParams(), t.parseFragment());
				}
				serialize(n) {
					const t = `/${Jo(n.root, !0)}`,
						r = (function QL(e) {
							const n = Object.keys(e)
								.map((t) => {
									const r = e[t];
									return Array.isArray(r)
										? r.map((i) => `${fl(t)}=${fl(i)}`).join("&")
										: `${fl(t)}=${fl(r)}`;
								})
								.filter((t) => !!t);
							return n.length ? `?${n.join("&")}` : "";
						})(n.queryParams);
					return `${t}${r}${
						"string" == typeof n.fragment
							? `#${(function ZL(e) {
									return encodeURI(e);
							  })(n.fragment)}`
							: ""
					}`;
				}
			}
			const KL = new od();
			function dl(e) {
				return e.segments.map((n) => m_(n)).join("/");
			}
			function Jo(e, n) {
				if (!e.hasChildren()) return dl(e);
				if (n) {
					const t = e.children[Z] ? Jo(e.children[Z], !1) : "",
						r = [];
					return (
						Object.entries(e.children).forEach(([i, o]) => {
							i !== Z && r.push(`${i}:${Jo(o, !1)}`);
						}),
						r.length > 0 ? `${t}(${r.join("//")})` : t
					);
				}
				{
					const t = (function qL(e, n) {
						let t = [];
						return (
							Object.entries(e.children).forEach(([r, i]) => {
								r === Z && (t = t.concat(n(i, r)));
							}),
							Object.entries(e.children).forEach(([r, i]) => {
								r !== Z && (t = t.concat(n(i, r)));
							}),
							t
						);
					})(e, (r, i) => (i === Z ? [Jo(e.children[Z], !1)] : [`${i}:${Jo(r, !1)}`]));
					return 1 === Object.keys(e.children).length && null != e.children[Z]
						? `${dl(e)}/${t[0]}`
						: `${dl(e)}/(${t.join("//")})`;
				}
			}
			function p_(e) {
				return encodeURIComponent(e)
					.replace(/%40/g, "@")
					.replace(/%3A/gi, ":")
					.replace(/%24/g, "$")
					.replace(/%2C/gi, ",");
			}
			function fl(e) {
				return p_(e).replace(/%3B/gi, ";");
			}
			function sd(e) {
				return p_(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
			}
			function Cl(e) {
				return decodeURIComponent(e);
			}
			function A_(e) {
				return Cl(e.replace(/\+/g, "%20"));
			}
			function m_(e) {
				return `${sd(e.path)}${(function YL(e) {
					return Object.keys(e)
						.map((n) => `;${sd(n)}=${sd(e[n])}`)
						.join("");
				})(e.parameters)}`;
			}
			const XL = /^[^\/()?;#]+/;
			function ad(e) {
				const n = e.match(XL);
				return n ? n[0] : "";
			}
			const JL = /^[^\/()?;=#]+/,
				tF = /^[^=?&#]+/,
				rF = /^[^&#]+/;
			class oF {
				constructor(n) {
					(this.url = n), (this.remaining = n);
				}
				parseRootSegment() {
					return (
						this.consumeOptional("/"),
						"" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#")
							? new ue([], {})
							: new ue([], this.parseChildren())
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
						(n.length > 0 || Object.keys(t).length > 0) && (r[Z] = new ue(n, t)),
						r
					);
				}
				parseSegment() {
					const n = ad(this.remaining);
					if ("" === n && this.peekStartsWith(";")) throw new E(4009, !1);
					return this.capture(n), new Qo(Cl(n), this.parseMatrixParams());
				}
				parseMatrixParams() {
					const n = {};
					for (; this.consumeOptional(";"); ) this.parseParam(n);
					return n;
				}
				parseParam(n) {
					const t = (function eF(e) {
						const n = e.match(JL);
						return n ? n[0] : "";
					})(this.remaining);
					if (!t) return;
					this.capture(t);
					let r = "";
					if (this.consumeOptional("=")) {
						const i = ad(this.remaining);
						i && ((r = i), this.capture(r));
					}
					n[Cl(t)] = Cl(r);
				}
				parseQueryParam(n) {
					const t = (function nF(e) {
						const n = e.match(tF);
						return n ? n[0] : "";
					})(this.remaining);
					if (!t) return;
					this.capture(t);
					let r = "";
					if (this.consumeOptional("=")) {
						const s = (function iF(e) {
							const n = e.match(rF);
							return n ? n[0] : "";
						})(this.remaining);
						s && ((r = s), this.capture(r));
					}
					const i = A_(t),
						o = A_(r);
					if (n.hasOwnProperty(i)) {
						let s = n[i];
						Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o);
					} else n[i] = o;
				}
				parseParens(n) {
					const t = {};
					for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
						const r = ad(this.remaining),
							i = this.remaining[r.length];
						if ("/" !== i && ")" !== i && ";" !== i) throw new E(4010, !1);
						let o;
						r.indexOf(":") > -1
							? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":"))
							: n && (o = Z);
						const s = this.parseChildren();
						(t[o] = 1 === Object.keys(s).length ? s[Z] : new ue([], s)), this.consumeOptional("//");
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
					if (!this.consumeOptional(n)) throw new E(4011, !1);
				}
			}
			function y_(e) {
				return e.segments.length > 0 ? new ue([], { [Z]: e }) : e;
			}
			function __(e) {
				const n = {};
				for (const r of Object.keys(e.children)) {
					const o = __(e.children[r]);
					if (r === Z && 0 === o.segments.length && o.hasChildren())
						for (const [s, a] of Object.entries(o.children)) n[s] = a;
					else (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
				}
				return (function sF(e) {
					if (1 === e.numberOfChildren && e.children[Z]) {
						const n = e.children[Z];
						return new ue(e.segments.concat(n.segments), n.children);
					}
					return e;
				})(new ue(e.segments, n));
			}
			function Tr(e) {
				return e instanceof xi;
			}
			function v_(e) {
				let n;
				const i = y_(
					(function t(o) {
						const s = {};
						for (const l of o.children) {
							const c = t(l);
							s[l.outlet] = c;
						}
						const a = new ue(o.url, s);
						return o === e && (n = a), a;
					})(e.root),
				);
				return n ?? i;
			}
			function D_(e, n, t, r) {
				let i = e;
				for (; i.parent; ) i = i.parent;
				if (0 === n.length) return ld(i, i, i, t, r);
				const o = (function lF(e) {
					if ("string" == typeof e[0] && 1 === e.length && "/" === e[0]) return new E_(!0, 0, e);
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
					return new E_(t, n, r);
				})(n);
				if (o.toRoot()) return ld(i, i, new ue([], {}), t, r);
				const s = (function cF(e, n, t) {
						if (e.isAbsolute) return new hl(n, !0, 0);
						if (!t) return new hl(n, !1, NaN);
						if (null === t.parent) return new hl(t, !0, 0);
						const r = Il(e.commands[0]) ? 0 : 1;
						return (function uF(e, n, t) {
							let r = e,
								i = n,
								o = t;
							for (; o > i; ) {
								if (((o -= i), (r = r.parent), !r)) throw new E(4005, !1);
								i = r.segments.length;
							}
							return new hl(r, !1, i - o);
						})(t, t.segments.length - 1 + r, e.numberOfDoubleDots);
					})(o, i, e),
					a = s.processChildren
						? ts(s.segmentGroup, s.index, o.commands)
						: S_(s.segmentGroup, s.index, o.commands);
				return ld(i, s.segmentGroup, a, t, r);
			}
			function Il(e) {
				return "object" == typeof e && null != e && !e.outlets && !e.segmentPath;
			}
			function es(e) {
				return "object" == typeof e && null != e && e.outlets;
			}
			function ld(e, n, t, r, i) {
				let s,
					o = {};
				r &&
					Object.entries(r).forEach(([l, c]) => {
						o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
					}),
					(s = e === n ? t : w_(e, n, t));
				const a = y_(__(s));
				return new xi(a, o, i);
			}
			function w_(e, n, t) {
				const r = {};
				return (
					Object.entries(e.children).forEach(([i, o]) => {
						r[i] = o === n ? t : w_(o, n, t);
					}),
					new ue(e.segments, r)
				);
			}
			class E_ {
				constructor(n, t, r) {
					if (
						((this.isAbsolute = n),
						(this.numberOfDoubleDots = t),
						(this.commands = r),
						n && r.length > 0 && Il(r[0]))
					)
						throw new E(4003, !1);
					const i = r.find(es);
					if (i && i !== g_(r)) throw new E(4004, !1);
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
			function S_(e, n, t) {
				if ((e || (e = new ue([], {})), 0 === e.segments.length && e.hasChildren())) return ts(e, n, t);
				const r = (function dF(e, n, t) {
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
								if (!T_(l, c, s)) return o;
								r += 2;
							} else {
								if (!T_(l, {}, s)) return o;
								r++;
							}
							i++;
						}
						return { match: !0, pathIndex: i, commandIndex: r };
					})(e, n, t),
					i = t.slice(r.commandIndex);
				if (r.match && r.pathIndex < e.segments.length) {
					const o = new ue(e.segments.slice(0, r.pathIndex), {});
					return (o.children[Z] = new ue(e.segments.slice(r.pathIndex), e.children)), ts(o, 0, i);
				}
				return r.match && 0 === i.length
					? new ue(e.segments, {})
					: r.match && !e.hasChildren()
					? cd(e, n, t)
					: r.match
					? ts(e, 0, i)
					: cd(e, n, t);
			}
			function ts(e, n, t) {
				if (0 === t.length) return new ue(e.segments, {});
				{
					const r = (function gF(e) {
							return es(e[0]) ? e[0].outlets : { [Z]: e };
						})(t),
						i = {};
					if (!r[Z] && e.children[Z] && 1 === e.numberOfChildren && 0 === e.children[Z].segments.length) {
						const o = ts(e.children[Z], n, t);
						return new ue(e.segments, o.children);
					}
					return (
						Object.entries(r).forEach(([o, s]) => {
							"string" == typeof s && (s = [s]), null !== s && (i[o] = S_(e.children[o], n, s));
						}),
						Object.entries(e.children).forEach(([o, s]) => {
							void 0 === r[o] && (i[o] = s);
						}),
						new ue(e.segments, i)
					);
				}
			}
			function cd(e, n, t) {
				const r = e.segments.slice(0, n);
				let i = 0;
				for (; i < t.length; ) {
					const o = t[i];
					if (es(o)) {
						const l = fF(o.outlets);
						return new ue(r, l);
					}
					if (0 === i && Il(t[0])) {
						r.push(new Qo(e.segments[n].path, b_(t[0]))), i++;
						continue;
					}
					const s = es(o) ? o.outlets[Z] : `${o}`,
						a = i < t.length - 1 ? t[i + 1] : null;
					s && a && Il(a) ? (r.push(new Qo(s, b_(a))), (i += 2)) : (r.push(new Qo(s, {})), i++);
				}
				return new ue(r, {});
			}
			function fF(e) {
				const n = {};
				return (
					Object.entries(e).forEach(([t, r]) => {
						"string" == typeof r && (r = [r]), null !== r && (n[t] = cd(new ue([], {}), 0, r));
					}),
					n
				);
			}
			function b_(e) {
				const n = {};
				return Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n;
			}
			function T_(e, n, t) {
				return e == t.path && pn(n, t.parameters);
			}
			const ns = "imperative";
			class An {
				constructor(n, t) {
					(this.id = n), (this.url = t);
				}
			}
			class ud extends An {
				constructor(n, t, r = "imperative", i = null) {
					super(n, t), (this.type = 0), (this.navigationTrigger = r), (this.restoredState = i);
				}
				toString() {
					return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class Mr extends An {
				constructor(n, t, r) {
					super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
				}
				toString() {
					return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
				}
			}
			class pl extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.reason = r), (this.code = i), (this.type = 2);
				}
				toString() {
					return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class rs extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.reason = r), (this.code = i), (this.type = 16);
				}
			}
			class gd extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.error = r), (this.target = i), (this.type = 3);
				}
				toString() {
					return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
				}
			}
			class CF extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 4);
				}
				toString() {
					return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class IF extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 7);
				}
				toString() {
					return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class hF extends An {
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
			class pF extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 5);
				}
				toString() {
					return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class AF extends An {
				constructor(n, t, r, i) {
					super(n, t), (this.urlAfterRedirects = r), (this.state = i), (this.type = 6);
				}
				toString() {
					return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class mF {
				constructor(n) {
					(this.route = n), (this.type = 9);
				}
				toString() {
					return `RouteConfigLoadStart(path: ${this.route.path})`;
				}
			}
			class yF {
				constructor(n) {
					(this.route = n), (this.type = 10);
				}
				toString() {
					return `RouteConfigLoadEnd(path: ${this.route.path})`;
				}
			}
			class _F {
				constructor(n) {
					(this.snapshot = n), (this.type = 11);
				}
				toString() {
					return `ChildActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class vF {
				constructor(n) {
					(this.snapshot = n), (this.type = 12);
				}
				toString() {
					return `ChildActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class DF {
				constructor(n) {
					(this.snapshot = n), (this.type = 13);
				}
				toString() {
					return `ActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class wF {
				constructor(n) {
					(this.snapshot = n), (this.type = 14);
				}
				toString() {
					return `ActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class M_ {
				constructor(n, t, r) {
					(this.routerEvent = n), (this.position = t), (this.anchor = r), (this.type = 15);
				}
				toString() {
					return `Scroll(anchor: '${this.anchor}', position: '${
						this.position ? `${this.position[0]}, ${this.position[1]}` : null
					}')`;
				}
			}
			class EF {
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
						return r || ((r = new EF()), this.contexts.set(t, r)), r;
					}
					getContext(t) {
						return this.contexts.get(t) || null;
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class N_ {
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
					const t = dd(n, this._root);
					return t ? t.children.map((r) => r.value) : [];
				}
				firstChild(n) {
					const t = dd(n, this._root);
					return t && t.children.length > 0 ? t.children[0].value : null;
				}
				siblings(n) {
					const t = fd(n, this._root);
					return t.length < 2 ? [] : t[t.length - 2].children.map((i) => i.value).filter((i) => i !== n);
				}
				pathFromRoot(n) {
					return fd(n, this._root).map((t) => t.value);
				}
			}
			function dd(e, n) {
				if (e === n.value) return n;
				for (const t of n.children) {
					const r = dd(e, t);
					if (r) return r;
				}
				return null;
			}
			function fd(e, n) {
				if (e === n.value) return [n];
				for (const t of n.children) {
					const r = fd(e, t);
					if (r.length) return r.unshift(n), r;
				}
				return [];
			}
			class Vn {
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
			class P_ extends N_ {
				constructor(n, t) {
					super(n), (this.snapshot = t), Cd(this, n);
				}
				toString() {
					return this.snapshot.toString();
				}
			}
			function R_(e, n) {
				const t = (function SF(e, n) {
						const s = new Al([], {}, {}, "", {}, Z, n, null, {});
						return new O_("", new Vn(s, []));
					})(0, n),
					r = new Rt([new Qo("", {})]),
					i = new Rt({}),
					o = new Rt({}),
					s = new Rt({}),
					a = new Rt(""),
					l = new nr(r, i, s, a, o, Z, n, t.root);
				return (l.snapshot = t.root), new P_(new Vn(l, []), t);
			}
			class nr {
				constructor(n, t, r, i, o, s, a, l) {
					(this.urlSubject = n),
						(this.paramsSubject = t),
						(this.queryParamsSubject = r),
						(this.fragmentSubject = i),
						(this.dataSubject = o),
						(this.outlet = s),
						(this.component = a),
						(this._futureSnapshot = l),
						(this.title = this.dataSubject?.pipe(ae((c) => c[Yo])) ?? U(void 0)),
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
					return this._paramMap || (this._paramMap = this.params.pipe(ae((n) => Ri(n)))), this._paramMap;
				}
				get queryParamMap() {
					return (
						this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(ae((n) => Ri(n)))),
						this._queryParamMap
					);
				}
				toString() {
					return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
				}
			}
			function x_(e, n = "emptyOnly") {
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
				return (function bF(e) {
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
			class O_ extends N_ {
				constructor(n, t) {
					super(t), (this.url = n), Cd(this, t);
				}
				toString() {
					return L_(this._root);
				}
			}
			function Cd(e, n) {
				(n.value._routerState = e), n.children.forEach((t) => Cd(e, t));
			}
			function L_(e) {
				const n = e.children.length > 0 ? ` { ${e.children.map(L_).join(", ")} } ` : "";
				return `${e.value}${n}`;
			}
			function Id(e) {
				if (e.snapshot) {
					const n = e.snapshot,
						t = e._futureSnapshot;
					(e.snapshot = t),
						pn(n.queryParams, t.queryParams) || e.queryParamsSubject.next(t.queryParams),
						n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
						pn(n.params, t.params) || e.paramsSubject.next(t.params),
						(function jL(e, n) {
							if (e.length !== n.length) return !1;
							for (let t = 0; t < e.length; ++t) if (!pn(e[t], n[t])) return !1;
							return !0;
						})(n.url, t.url) || e.urlSubject.next(t.url),
						pn(n.data, t.data) || e.dataSubject.next(t.data);
				} else (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data);
			}
			function hd(e, n) {
				const t =
					pn(e.params, n.params) &&
					(function GL(e, n) {
						return br(e, n) && e.every((t, r) => pn(t.parameters, n[r].parameters));
					})(e.url, n.url);
				return t && !(!e.parent != !n.parent) && (!e.parent || hd(e.parent, n.parent));
			}
			let pd = (() => {
				class e {
					constructor() {
						(this.activated = null),
							(this._activatedRoute = null),
							(this.name = Z),
							(this.activateEvents = new ie()),
							(this.deactivateEvents = new ie()),
							(this.attachEvents = new ie()),
							(this.detachEvents = new ie()),
							(this.parentContexts = P(is)),
							(this.location = P(Kt)),
							(this.changeDetector = P(Ho)),
							(this.environmentInjector = P(cn)),
							(this.inputBinder = P(ml, { optional: !0 })),
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
						if (!this.activated) throw new E(4012, !1);
						return this.activated.instance;
					}
					get activatedRoute() {
						if (!this.activated) throw new E(4012, !1);
						return this._activatedRoute;
					}
					get activatedRouteData() {
						return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
					}
					detach() {
						if (!this.activated) throw new E(4012, !1);
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
						if (this.isActivated) throw new E(4013, !1);
						this._activatedRoute = t;
						const i = this.location,
							s = t.snapshot.component,
							a = this.parentContexts.getOrCreateContext(this.name).children,
							l = new TF(t, a, i.injector);
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
					(e.ɵdir = Ke({
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
						features: [Dn],
					})),
					e
				);
			})();
			class TF {
				constructor(n, t, r) {
					(this.route = n), (this.childContexts = t), (this.parent = r);
				}
				get(n, t) {
					return n === nr ? this.route : n === is ? this.childContexts : this.parent.get(n, t);
				}
			}
			const ml = new x("");
			let F_ = (() => {
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
							i = td([r.queryParams, r.params, r.data])
								.pipe(
									Ut(
										([o, s, a], l) => (
											(a = { ...o, ...s, ...a }), 0 === l ? U(a) : Promise.resolve(a)
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
										const n = se(e);
										if (!n) return null;
										const t = new vo(n);
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function os(e, n, t) {
				if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
					const r = t.value;
					r._futureSnapshot = n.value;
					const i = (function NF(e, n, t) {
						return n.children.map((r) => {
							for (const i of t.children)
								if (e.shouldReuseRoute(r.value, i.value.snapshot)) return os(e, r, i);
							return os(e, r);
						});
					})(e, n, t);
					return new Vn(r, i);
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
					const r = (function PF(e) {
							return new nr(
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
					return new Vn(r, i);
				}
			}
			const Ad = "ngNavigationCancelingError";
			function k_(e, n) {
				const { redirectTo: t, navigationBehaviorOptions: r } = Tr(n)
						? { redirectTo: n, navigationBehaviorOptions: void 0 }
						: n,
					i = H_(!1, 0, n);
				return (i.url = t), (i.navigationBehaviorOptions = r), i;
			}
			function H_(e, n, t) {
				const r = new Error("NavigationCancelingError: " + (e || ""));
				return (r[Ad] = !0), (r.cancellationCode = n), t && (r.url = t), r;
			}
			function V_(e) {
				return B_(e) && Tr(e.url);
			}
			function B_(e) {
				return e && e[Ad];
			}
			let U_ = (() => {
				class e {}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵcmp = Ae({
						type: e,
						selectors: [["ng-component"]],
						standalone: !0,
						features: [Cn],
						decls: 1,
						vars: 0,
						template: function (t, r) {
							1 & t && K(0, "router-outlet");
						},
						dependencies: [pd],
						encapsulation: 2,
					})),
					e
				);
			})();
			function md(e) {
				const n = e.children && e.children.map(md),
					t = n ? { ...e, children: n } : { ...e };
				return (
					!t.component &&
						!t.loadComponent &&
						(n || t.loadChildren) &&
						t.outlet &&
						t.outlet !== Z &&
						(t.component = U_),
					t
				);
			}
			function Xt(e) {
				return e.outlet || Z;
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
			class HF {
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
					this.deactivateChildRoutes(t, r, n), Id(this.futureState.root), this.activateChildRoutes(t, r, n);
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
						this.activateRoutes(o, i[o.value.outlet], r), this.forwardEvent(new wF(o.value.snapshot));
					}),
						n.children.length && this.forwardEvent(new vF(n.value.snapshot));
				}
				activateRoutes(n, t, r) {
					const i = n.value,
						o = t ? t.value : null;
					if ((Id(i), i === o))
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
								Id(a.route.value),
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
			class j_ {
				constructor(n) {
					(this.path = n), (this.route = this.path[this.path.length - 1]);
				}
			}
			class yl {
				constructor(n, t) {
					(this.component = n), (this.route = t);
				}
			}
			function VF(e, n, t) {
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
						(function UF(e, n, t, r, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
							const o = e.value,
								s = n ? n.value : null,
								a = t ? t.getContext(e.value.outlet) : null;
							if (s && o.routeConfig === s.routeConfig) {
								const l = (function jF(e, n, t) {
									if ("function" == typeof t) return t(e, n);
									switch (t) {
										case "pathParamsChange":
											return !br(e.url, n.url);
										case "pathParamsOrQueryParamsChange":
											return !br(e.url, n.url) || !pn(e.queryParams, n.queryParams);
										case "always":
											return !0;
										case "paramsOrQueryParamsChange":
											return !hd(e, n) || !pn(e.queryParams, n.queryParams);
										default:
											return !hd(e, n);
									}
								})(s, o, o.routeConfig.runGuardsAndResolvers);
								l
									? i.canActivateChecks.push(new j_(r))
									: ((o.data = s.data), (o._resolvedData = s._resolvedData)),
									as(e, n, o.component ? (a ? a.children : null) : t, r, i),
									l &&
										a &&
										a.outlet &&
										a.outlet.isActivated &&
										i.canDeactivateChecks.push(new yl(a.outlet.component, s));
							} else
								s && ls(n, a, i),
									i.canActivateChecks.push(new j_(r)),
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
			function $_(e) {
				return e instanceof cl || "EmptyError" === e?.name;
			}
			const _l = Symbol("INITIAL_VALUE");
			function Fi() {
				return Ut((e) =>
					td(
						e.map((n) =>
							n.pipe(
								Pi(1),
								(function OL(...e) {
									const n = ji(e);
									return $e((t, r) => {
										(n ? nd(e, t, n) : nd(e, t)).subscribe(r);
									});
								})(_l),
							),
						),
					).pipe(
						ae((n) => {
							for (const t of n)
								if (!0 !== t) {
									if (t === _l) return _l;
									if (!1 === t || t instanceof xi) return t;
								}
							return !0;
						}),
						Hn((n) => n !== _l),
						Pi(1),
					),
				);
			}
			function z_(e) {
				return (function mv(...e) {
					return xd(e);
				})(
					ct((n) => {
						if (Tr(n)) throw k_(0, n);
					}),
					ae((n) => !0 === n),
				);
			}
			class vl {
				constructor(n) {
					this.segmentGroup = n || null;
				}
			}
			class W_ {
				constructor(n) {
					this.urlTree = n;
				}
			}
			function ki(e) {
				return Zo(new vl(e));
			}
			function G_(e) {
				return Zo(new W_(e));
			}
			class lk {
				constructor(n, t) {
					(this.urlSerializer = n), (this.urlTree = t);
				}
				noMatchError(n) {
					return new E(4002, !1);
				}
				lineralizeSegments(n, t) {
					let r = [],
						i = t.root;
					for (;;) {
						if (((r = r.concat(i.segments)), 0 === i.numberOfChildren)) return U(r);
						if (i.numberOfChildren > 1 || !i.children[Z]) return Zo(new E(4e3, !1));
						i = i.children[Z];
					}
				}
				applyRedirectCommands(n, t, r) {
					return this.applyRedirectCreateUrlTree(t, this.urlSerializer.parse(t), n, r);
				}
				applyRedirectCreateUrlTree(n, t, r, i) {
					const o = this.createSegmentGroup(n, t.root, r, i);
					return new xi(o, this.createQueryParams(t.queryParams, this.urlTree.queryParams), t.fragment);
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
						new ue(o, s)
					);
				}
				createSegments(n, t, r, i) {
					return t.map((o) =>
						o.path.startsWith(":") ? this.findPosParam(n, o, i) : this.findOrReturn(o, r),
					);
				}
				findPosParam(n, t, r) {
					const i = r[t.path.substring(1)];
					if (!i) throw new E(4001, !1);
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
			const yd = {
				matched: !1,
				consumedSegments: [],
				remainingSegments: [],
				parameters: {},
				positionalParamSegments: {},
			};
			function ck(e, n, t, r, i) {
				const o = _d(e, n, t);
				return o.matched
					? ((r = (function RF(e, n) {
							return (
								e.providers && !e._injector && (e._injector = Vu(e.providers, n, `Route: ${e.path}`)),
								e._injector ?? n
							);
					  })(n, r)),
					  (function ok(e, n, t, r) {
							const i = n.canMatch;
							return i && 0 !== i.length
								? U(
										i.map((s) => {
											const a = Li(s, e);
											return tr(
												(function KF(e) {
													return e && cs(e.canMatch);
												})(a)
													? a.canMatch(n, t)
													: e.runInContext(() => a(n, t)),
											);
										}),
								  ).pipe(Fi(), z_())
								: U(!0);
					  })(r, n, t).pipe(ae((s) => (!0 === s ? o : { ...yd }))))
					: U(o);
			}
			function _d(e, n, t) {
				if ("" === n.path)
					return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
						? { ...yd }
						: {
								matched: !0,
								consumedSegments: [],
								remainingSegments: t,
								parameters: {},
								positionalParamSegments: {},
						  };
				const i = (n.matcher || UL)(t, e, n);
				if (!i) return { ...yd };
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
			function q_(e, n, t, r) {
				return t.length > 0 &&
					(function dk(e, n, t) {
						return t.some((r) => Dl(e, n, r) && Xt(r) !== Z);
					})(e, t, r)
					? { segmentGroup: new ue(n, gk(r, new ue(t, e.children))), slicedSegments: [] }
					: 0 === t.length &&
					  (function fk(e, n, t) {
							return t.some((r) => Dl(e, n, r));
					  })(e, t, r)
					? { segmentGroup: new ue(e.segments, uk(e, 0, t, r, e.children)), slicedSegments: t }
					: { segmentGroup: new ue(e.segments, e.children), slicedSegments: t };
			}
			function uk(e, n, t, r, i) {
				const o = {};
				for (const s of r)
					if (Dl(e, t, s) && !i[Xt(s)]) {
						const a = new ue([], {});
						o[Xt(s)] = a;
					}
				return { ...i, ...o };
			}
			function gk(e, n) {
				const t = {};
				t[Z] = n;
				for (const r of e)
					if ("" === r.path && Xt(r) !== Z) {
						const i = new ue([], {});
						t[Xt(r)] = i;
					}
				return t;
			}
			function Dl(e, n, t) {
				return (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) && "" === t.path;
			}
			class pk {
				constructor(n, t, r, i, o, s, a) {
					(this.injector = n),
						(this.configLoader = t),
						(this.rootComponentType = r),
						(this.config = i),
						(this.urlTree = o),
						(this.paramsInheritanceStrategy = s),
						(this.urlSerializer = a),
						(this.allowRedirects = !0),
						(this.applyRedirects = new lk(this.urlSerializer, this.urlTree));
				}
				noMatchError(n) {
					return new E(4002, !1);
				}
				recognize() {
					const n = q_(this.urlTree.root, [], [], this.config).segmentGroup;
					return this.processSegmentGroup(this.injector, this.config, n, Z).pipe(
						Sr((t) => {
							if (t instanceof W_)
								return (this.allowRedirects = !1), (this.urlTree = t.urlTree), this.match(t.urlTree);
							throw t instanceof vl ? this.noMatchError(t) : t;
						}),
						ae((t) => {
							const r = new Al(
									[],
									Object.freeze({}),
									Object.freeze({ ...this.urlTree.queryParams }),
									this.urlTree.fragment,
									{},
									Z,
									this.rootComponentType,
									null,
									{},
								),
								i = new Vn(r, t),
								o = new O_("", i),
								s = (function aF(e, n, t = null, r = null) {
									return D_(v_(e), n, t, r);
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
					return this.processSegmentGroup(this.injector, this.config, n.root, Z).pipe(
						Sr((r) => {
							throw r instanceof vl ? this.noMatchError(r) : r;
						}),
					);
				}
				inheritParamsAndData(n) {
					const t = n.value,
						r = x_(t, this.paramsInheritanceStrategy);
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
					return We(i).pipe(
						bi((o) => {
							const s = r.children[o],
								a = (function FF(e, n) {
									const t = e.filter((r) => Xt(r) === n);
									return t.push(...e.filter((r) => Xt(r) !== n)), t;
								})(t, o);
							return this.processSegmentGroup(n, a, s, o);
						}),
						(function kL(e, n) {
							return $e(
								(function FL(e, n, t, r, i) {
									return (o, s) => {
										let a = t,
											l = n,
											c = 0;
										o.subscribe(
											ze(
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
						(function HL(e, n) {
							const t = arguments.length >= 2;
							return (r) =>
								r.pipe(e ? Hn((i, o) => e(i, o, r)) : Un, id(1), t ? ul(n) : c_(() => new cl()));
						})(),
						qe((o) => {
							if (null === o) return ki(r);
							const s = K_(o);
							return (
								(function Ak(e) {
									e.sort((n, t) =>
										n.value.outlet === Z
											? -1
											: t.value.outlet === Z
											? 1
											: n.value.outlet.localeCompare(t.value.outlet),
									);
								})(s),
								U(s)
							);
						}),
					);
				}
				processSegment(n, t, r, i, o, s) {
					return We(t).pipe(
						bi((a) =>
							this.processSegmentAgainstRoute(a._injector ?? n, t, a, r, i, o, s).pipe(
								Sr((l) => {
									if (l instanceof vl) return U(null);
									throw l;
								}),
							),
						),
						Er((a) => !!a),
						Sr((a) => {
							if ($_(a))
								return (function Ik(e, n, t) {
									return 0 === n.length && !e.children[t];
								})(r, i, o)
									? U([])
									: ki(r);
							throw a;
						}),
					);
				}
				processSegmentAgainstRoute(n, t, r, i, o, s, a) {
					return (function Ck(e, n, t, r) {
						return !!(Xt(e) === r || (r !== Z && Dl(n, t, e))) && ("**" === e.path || _d(n, e, t).matched);
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
						? G_(o)
						: this.applyRedirects.lineralizeSegments(r, o).pipe(
								qe((s) => {
									const a = new ue(s, {});
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
					} = _d(t, i, o);
					if (!a) return ki(t);
					const g = this.applyRedirects.applyRedirectCommands(l, i.redirectTo, u);
					return i.redirectTo.startsWith("/")
						? G_(g)
						: this.applyRedirects
								.lineralizeSegments(i, g)
								.pipe(qe((f) => this.processSegment(n, r, t, f.concat(c), s, !1)));
				}
				matchSegmentAgainstRoute(n, t, r, i, o, s) {
					let a;
					if ("**" === r.path) {
						const l = i.length > 0 ? g_(i).parameters : {};
						(a = U({
							snapshot: new Al(
								i,
								l,
								Object.freeze({ ...this.urlTree.queryParams }),
								this.urlTree.fragment,
								Z_(r),
								Xt(r),
								r.component ?? r._loadedComponent ?? null,
								r,
								Y_(r),
							),
							consumedSegments: [],
							remainingSegments: [],
						})),
							(t.children = {});
					} else
						a = ck(t, r, i, n).pipe(
							ae(({ matched: l, consumedSegments: c, remainingSegments: u, parameters: g }) =>
								l
									? {
											snapshot: new Al(
												c,
												g,
												Object.freeze({ ...this.urlTree.queryParams }),
												this.urlTree.fragment,
												Z_(r),
												Xt(r),
												r.component ?? r._loadedComponent ?? null,
												r,
												Y_(r),
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
												{ snapshot: g, consumedSegments: f, remainingSegments: C } = l,
												{ segmentGroup: I, slicedSegments: h } = q_(t, f, C, c);
											if (0 === h.length && I.hasChildren())
												return this.processChildren(u, c, I).pipe(
													ae((v) => (null === v ? null : [new Vn(g, v)])),
												);
											if (0 === c.length && 0 === h.length) return U([new Vn(g, [])]);
											const m = Xt(r) === o;
											return this.processSegment(u, c, I, h, m ? Z : o, !0).pipe(
												ae((v) => [new Vn(g, v)]),
											);
										}),
								  ),
						),
					);
				}
				getChildConfig(n, t, r) {
					return t.children
						? U({ routes: t.children, injector: n })
						: t.loadChildren
						? void 0 !== t._loadedRoutes
							? U({ routes: t._loadedRoutes, injector: t._loadedInjector })
							: (function ik(e, n, t, r) {
									const i = n.canLoad;
									return void 0 === i || 0 === i.length
										? U(!0)
										: U(
												i.map((s) => {
													const a = Li(s, e);
													return tr(
														(function zF(e) {
															return e && cs(e.canLoad);
														})(a)
															? a.canLoad(n, t)
															: e.runInContext(() => a(n, t)),
													);
												}),
										  ).pipe(Fi(), z_());
							  })(n, t, r).pipe(
									qe((i) =>
										i
											? this.configLoader.loadChildren(n, t).pipe(
													ct((o) => {
														(t._loadedRoutes = o.routes), (t._loadedInjector = o.injector);
													}),
											  )
											: (function ak(e) {
													return Zo(H_(!1, 3));
											  })(),
									),
							  )
						: U({ routes: [], injector: n });
				}
			}
			function mk(e) {
				const n = e.value.routeConfig;
				return n && "" === n.path;
			}
			function K_(e) {
				const n = [],
					t = new Set();
				for (const r of e) {
					if (!mk(r)) {
						n.push(r);
						continue;
					}
					const i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
					void 0 !== i ? (i.children.push(...r.children), t.add(i)) : n.push(r);
				}
				for (const r of t) {
					const i = K_(r.children);
					n.push(new Vn(r.value, i));
				}
				return n.filter((r) => !t.has(r));
			}
			function Z_(e) {
				return e.data || {};
			}
			function Y_(e) {
				return e.resolve || {};
			}
			function Q_(e) {
				return "string" == typeof e.title || null === e.title;
			}
			function vd(e) {
				return Ut((n) => {
					const t = e(n);
					return t ? We(t).pipe(ae(() => n)) : U(n);
				});
			}
			const Hi = new x("ROUTES");
			let Dd = (() => {
				class e {
					constructor() {
						(this.componentLoaders = new WeakMap()),
							(this.childrenLoaders = new WeakMap()),
							(this.compiler = P(XA));
					}
					loadComponent(t) {
						if (this.componentLoaders.get(t)) return this.componentLoaders.get(t);
						if (t._loadedComponent) return U(t._loadedComponent);
						this.onLoadStartListener && this.onLoadStartListener(t);
						const r = tr(t.loadComponent()).pipe(
								ae(X_),
								ct((o) => {
									this.onLoadEndListener && this.onLoadEndListener(t), (t._loadedComponent = o);
								}),
								zo(() => {
									this.componentLoaders.delete(t);
								}),
							),
							i = new l_(r, () => new Pt()).pipe(rd());
						return this.componentLoaders.set(t, i), i;
					}
					loadChildren(t, r) {
						if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
						if (r._loadedRoutes) return U({ routes: r._loadedRoutes, injector: r._loadedInjector });
						this.onLoadStartListener && this.onLoadStartListener(r);
						const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
								ae((a) => {
									this.onLoadEndListener && this.onLoadEndListener(r);
									let l, c;
									return (
										Array.isArray(a)
											? (c = a)
											: ((l = a.create(t).injector),
											  (c = l.get(Hi, [], H.Self | H.Optional).flat())),
										{ routes: c.map(md), injector: l }
									);
								}),
								zo(() => {
									this.childrenLoaders.delete(r);
								}),
							),
							s = new l_(o, () => new Pt()).pipe(rd());
						return this.childrenLoaders.set(r, s), s;
					}
					loadModuleFactoryOrRoutes(t) {
						return tr(t()).pipe(
							ae(X_),
							qe((r) =>
								r instanceof aA || Array.isArray(r) ? U(r) : We(this.compiler.compileModuleAsync(r)),
							),
						);
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)();
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function X_(e) {
				return (function Sk(e) {
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
							(this.events = new Pt()),
							(this.configLoader = P(Dd)),
							(this.environmentInjector = P(cn)),
							(this.urlSerializer = P(Xo)),
							(this.rootContexts = P(is)),
							(this.inputBindingEnabled = null !== P(ml, { optional: !0 })),
							(this.navigationId = 0),
							(this.afterPreactivation = () => U(void 0)),
							(this.rootComponentType = null),
							(this.configLoader.onLoadEndListener = (i) => this.events.next(new yF(i))),
							(this.configLoader.onLoadStartListener = (i) => this.events.next(new mF(i)));
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
								Hn((r) => 0 !== r.id),
								ae((r) => ({ ...r, extractedUrl: t.urlHandlingStrategy.extract(r.rawUrl) })),
								Ut((r) => {
									let i = !1,
										o = !1;
									return U(r).pipe(
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
													J_(s.source) && (t.browserUrlTree = s.extractedUrl),
													U(s).pipe(
														Ut((u) => {
															const g = this.transitions?.getValue();
															return (
																this.events.next(
																	new ud(
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
														(function yk(e, n, t, r, i, o) {
															return qe((s) =>
																(function hk(e, n, t, r, i, o, s = "emptyOnly") {
																	return new pk(e, n, t, r, i, s, o).recognize();
																})(e, n, t, r, s.extractedUrl, i, o).pipe(
																	ae(({ state: a, tree: l }) => ({
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
																	const f = t.urlHandlingStrategy.merge(
																		u.urlAfterRedirects,
																		u.rawUrl,
																	);
																	t.setBrowserUrl(f, u);
																}
																t.browserUrlTree = u.urlAfterRedirects;
															}
															const g = new CF(
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
														source: f,
														restoredState: C,
														extras: I,
													} = s,
													h = new ud(u, this.urlSerializer.serialize(g), f, C);
												this.events.next(h);
												const m = R_(0, this.rootComponentType).snapshot;
												return U(
													(r = {
														...s,
														targetSnapshot: m,
														urlAfterRedirects: g,
														extras: { ...I, skipLocationChange: !1, replaceUrl: !1 },
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
											const a = new IF(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
											);
											this.events.next(a);
										}),
										ae(
											(s) =>
												(r = {
													...s,
													guards: VF(s.targetSnapshot, s.currentSnapshot, this.rootContexts),
												}),
										),
										(function YF(e, n) {
											return qe((t) => {
												const {
													targetSnapshot: r,
													currentSnapshot: i,
													guards: { canActivateChecks: o, canDeactivateChecks: s },
												} = t;
												return 0 === s.length && 0 === o.length
													? U({ ...t, guardsResult: !0 })
													: (function QF(e, n, t, r) {
															return We(e).pipe(
																qe((i) =>
																	(function rk(e, n, t, r, i) {
																		const o =
																			n && n.routeConfig
																				? n.routeConfig.canDeactivate
																				: null;
																		return o && 0 !== o.length
																			? U(
																					o.map((a) => {
																						const l = ss(n) ?? i,
																							c = Li(a, l);
																						return tr(
																							(function qF(e) {
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
																			: U(!0);
																	})(i.component, i.route, t, n, r),
																),
																Er((i) => !0 !== i, !0),
															);
													  })(s, r, i, e).pipe(
															qe((a) =>
																a &&
																(function $F(e) {
																	return "boolean" == typeof e;
																})(a)
																	? (function XF(e, n, t, r) {
																			return We(n).pipe(
																				bi((i) =>
																					nd(
																						(function ek(e, n) {
																							return (
																								null !== e &&
																									n &&
																									n(new _F(e)),
																								U(!0)
																							);
																						})(i.route.parent, r),
																						(function JF(e, n) {
																							return (
																								null !== e &&
																									n &&
																									n(new DF(e)),
																								U(!0)
																							);
																						})(i.route, r),
																						(function nk(e, n, t) {
																							const r = n[n.length - 1],
																								o = n
																									.slice(
																										0,
																										n.length - 1,
																									)
																									.reverse()
																									.map((s) =>
																										(function BF(
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
																										a_(() =>
																											U(
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
																														return tr(
																															(function GF(
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
																							return U(o).pipe(Fi());
																						})(e, i.path, t),
																						(function tk(e, n, t) {
																							const r = n.routeConfig
																								? n.routeConfig
																										.canActivate
																								: null;
																							if (!r || 0 === r.length)
																								return U(!0);
																							const i = r.map((o) =>
																								a_(() => {
																									const s =
																											ss(n) ?? t,
																										a = Li(o, s);
																									return tr(
																										(function WF(
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
																							return U(i).pipe(Fi());
																						})(e, i.route, t),
																					),
																				),
																				Er((i) => !0 !== i, !0),
																			);
																	  })(r, o, e, n)
																	: U(a),
															),
															ae((a) => ({ ...t, guardsResult: a })),
													  );
											});
										})(this.environmentInjector, (s) => this.events.next(s)),
										ct((s) => {
											if (((r.guardsResult = s.guardsResult), Tr(s.guardsResult)))
												throw k_(0, s.guardsResult);
											const a = new hF(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
												!!s.guardsResult,
											);
											this.events.next(a);
										}),
										Hn(
											(s) =>
												!!s.guardsResult ||
												(t.restoreHistory(s), this.cancelNavigationTransition(s, "", 3), !1),
										),
										vd((s) => {
											if (s.guards.canActivateChecks.length)
												return U(s).pipe(
													ct((a) => {
														const l = new pF(
															a.id,
															this.urlSerializer.serialize(a.extractedUrl),
															this.urlSerializer.serialize(a.urlAfterRedirects),
															a.targetSnapshot,
														);
														this.events.next(l);
													}),
													Ut((a) => {
														let l = !1;
														return U(a).pipe(
															(function _k(e, n) {
																return qe((t) => {
																	const {
																		targetSnapshot: r,
																		guards: { canActivateChecks: i },
																	} = t;
																	if (!i.length) return U(t);
																	let o = 0;
																	return We(i).pipe(
																		bi((s) =>
																			(function vk(e, n, t, r) {
																				const i = e.routeConfig,
																					o = e._resolve;
																				return (
																					void 0 !== i?.title &&
																						!Q_(i) &&
																						(o[Yo] = i.title),
																					(function Dk(e, n, t, r) {
																						const i = (function wk(e) {
																							return [
																								...Object.keys(e),
																								...Object.getOwnPropertySymbols(
																									e,
																								),
																							];
																						})(e);
																						if (0 === i.length)
																							return U({});
																						const o = {};
																						return We(i).pipe(
																							qe((s) =>
																								(function Ek(
																									e,
																									n,
																									t,
																									r,
																								) {
																									const i =
																											ss(n) ?? r,
																										o = Li(e, i);
																									return tr(
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
																							id(1),
																							(function VL(e) {
																								return ae(() => e);
																							})(o),
																							Sr((s) =>
																								$_(s) ? Jt : Zo(s),
																							),
																						);
																					})(o, e, n, r).pipe(
																						ae(
																							(s) => (
																								(e._resolvedData = s),
																								(e.data = x_(
																									e,
																									t,
																								).resolve),
																								i &&
																									Q_(i) &&
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
																		id(1),
																		qe((s) => (o === i.length ? U(t) : Jt)),
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
														const l = new AF(
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
															ae(() => {}),
														),
													);
												for (const u of l.children) c.push(...a(u));
												return c;
											};
											return td(a(s.targetSnapshot.root)).pipe(ul(), Pi(1));
										}),
										vd(() => this.afterPreactivation()),
										ae((s) => {
											const a = (function MF(e, n, t) {
												const r = os(e, n._root, t ? t._root : void 0);
												return new P_(r, n);
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
											ae(
												(i) => (
													new HF(n, i.targetRouterState, i.currentRouterState, t, r).activate(
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
										Pi(1),
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
											if (((o = !0), B_(s))) {
												V_(s) || ((t.navigated = !0), t.restoreHistory(r, !0));
												const a = new pl(
													r.id,
													this.urlSerializer.serialize(r.extractedUrl),
													s.message,
													s.cancellationCode,
												);
												if ((this.events.next(a), V_(s))) {
													const l = t.urlHandlingStrategy.merge(s.url, t.rawUrlTree),
														c = {
															skipLocationChange: r.extras.skipLocationChange,
															replaceUrl: "eager" === t.urlUpdateStrategy || J_(r.source),
														};
													t.scheduleNavigation(l, ns, null, c, {
														resolve: r.resolve,
														reject: r.reject,
														promise: r.promise,
													});
												} else r.resolve(!1);
											} else {
												t.restoreHistory(r, !0);
												const a = new gd(
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
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function J_(e) {
				return e !== ns;
			}
			let ev = (() => {
					class e {
						buildTitle(t) {
							let r,
								i = t.root;
							for (; void 0 !== i; )
								(r = this.getResolvedTitleForRoute(i) ?? r),
									(i = i.children.find((o) => o.outlet === Z));
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
						(e.ɵprov = F({
							token: e,
							factory: function () {
								return P(bk);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				bk = (() => {
					class e extends ev {
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
							return new (t || e)(L(_y));
						}),
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				Tk = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = F({
							token: e,
							factory: function () {
								return P(Nk);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			class Mk {
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
			let Nk = (() => {
				class e extends Mk {}
				return (
					(e.ɵfac = (function () {
						let n;
						return function (r) {
							return (n || (n = Sn(e)))(r || e);
						};
					})()),
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const El = new x("", { providedIn: "root", factory: () => ({}) });
			let Pk = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵprov = F({
							token: e,
							factory: function () {
								return P(Rk);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				Rk = (() => {
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			var Mt = (() => (
				((Mt = Mt || {})[(Mt.COMPLETE = 0)] = "COMPLETE"),
				(Mt[(Mt.FAILED = 1)] = "FAILED"),
				(Mt[(Mt.REDIRECTING = 2)] = "REDIRECTING"),
				Mt
			))();
			function tv(e, n) {
				e.events
					.pipe(
						Hn((t) => t instanceof Mr || t instanceof pl || t instanceof gd || t instanceof rs),
						ae((t) =>
							t instanceof Mr || t instanceof rs
								? Mt.COMPLETE
								: t instanceof pl && (0 === t.code || 1 === t.code)
								? Mt.REDIRECTING
								: Mt.FAILED,
						),
						Hn((t) => t !== Mt.REDIRECTING),
						Pi(1),
					)
					.subscribe(() => {
						n();
					});
			}
			function xk(e) {
				throw e;
			}
			function Ok(e, n, t) {
				return n.parse("/");
			}
			const Lk = { paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact" },
				Fk = { paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset" };
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
								(this.console = P(QA)),
								(this.isNgZoneEnabled = !1),
								(this.options = P(El, { optional: !0 }) || {}),
								(this.pendingTasks = P(Ha)),
								(this.errorHandler = this.options.errorHandler || xk),
								(this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || Ok),
								(this.navigated = !1),
								(this.lastSuccessfulId = -1),
								(this.urlHandlingStrategy = P(Pk)),
								(this.routeReuseStrategy = P(Tk)),
								(this.titleStrategy = P(ev)),
								(this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore"),
								(this.paramsInheritanceStrategy =
									this.options.paramsInheritanceStrategy || "emptyOnly"),
								(this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred"),
								(this.canceledNavigationResolution =
									this.options.canceledNavigationResolution || "replace"),
								(this.config = P(Hi, { optional: !0 })?.flat() ?? []),
								(this.navigationTransitions = P(wl)),
								(this.urlSerializer = P(Xo)),
								(this.location = P(vg)),
								(this.componentInputBindingEnabled = !!P(ml, { optional: !0 })),
								(this.isNgZoneEnabled = P(Ie) instanceof Ie && Ie.isInAngularZone()),
								this.resetConfig(this.config),
								(this.currentUrlTree = new xi()),
								(this.rawUrlTree = this.currentUrlTree),
								(this.browserUrlTree = this.currentUrlTree),
								(this.routerState = R_(0, null)),
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
							(this.config = t.map(md)), (this.navigated = !1), (this.lastSuccessfulId = -1);
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
								g = v_(i ? i.snapshot : this.routerState.snapshot.root);
							} catch {
								("string" != typeof t[0] || !t[0].startsWith("/")) && (t = []),
									(g = this.currentUrlTree.root);
							}
							return D_(g, t, u, c ?? null);
						}
						navigateByUrl(t, r = { skipLocationChange: !1 }) {
							const i = Tr(t) ? t : this.parseUrl(t),
								o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
							return this.scheduleNavigation(o, ns, null, r);
						}
						navigate(t, r = { skipLocationChange: !1 }) {
							return (
								(function kk(e) {
									for (let n = 0; n < e.length; n++) if (null == e[n]) throw new E(4008, !1);
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
							if (((i = !0 === r ? { ...Lk } : !1 === r ? { ...Fk } : r), Tr(t)))
								return f_(this.currentUrlTree, t, i);
							const o = this.parseUrl(t);
							return f_(this.currentUrlTree, o, i);
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
								: (c = new Promise((g, f) => {
										(a = g), (l = f);
								  }));
							const u = this.pendingTasks.add();
							return (
								tv(this, () => {
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
						(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
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
								(this.onChanges = new Pt()),
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
									: (function II(e, n, t) {
											return (function yE(e, n) {
												return ("src" === n &&
													("embed" === e ||
														"frame" === e ||
														"iframe" === e ||
														"media" === e ||
														"script" === e)) ||
													("href" === n && ("base" === e || "link" === e))
													? CI
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
								b(Vt),
								b(nr),
								(function js(e) {
									return (function $0(e, n) {
										if ("class" === n) return e.classes;
										if ("style" === n) return e.styles;
										const t = e.attrs;
										if (t) {
											const r = t.length;
											let i = 0;
											for (; i < r; ) {
												const o = t[i];
												if (Cf(o)) break;
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
									})(Ze(), e);
								})("tabindex"),
								b(ei),
								b(Wt),
								b(_r),
							);
						}),
						(e.ɵdir = Ke({
							type: e,
							selectors: [["", "routerLink", ""]],
							hostVars: 1,
							hostBindings: function (t, r) {
								1 & t &&
									ot("click", function (o) {
										return r.onClick(o.button, o.ctrlKey, o.shiftKey, o.altKey, o.metaKey);
									}),
									2 & t && ve("target", r.target);
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
							features: [Dh, Dn],
						})),
						e
					);
				})(),
				wd = (() => {
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
								(this.isActiveChange = new ie()),
								(this.routerEventsSubscription = t.events.subscribe((a) => {
									a instanceof Mr && this.update();
								}));
						}
						ngAfterContentInit() {
							U(this.links.changes, U(null))
								.pipe(Nr())
								.subscribe((t) => {
									this.update(), this.subscribeToEachLinkOnChanges();
								});
						}
						subscribeToEachLinkOnChanges() {
							this.linkInputChangesSubscription?.unsubscribe();
							const t = [...this.links.toArray(), this.link].filter((r) => !!r).map((r) => r.onChanges);
							this.linkInputChangesSubscription = We(t)
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
							const r = (function Hk(e) {
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
							return new (t || e)(b(Vt), b(Wt), b(ei), b(Ho), b(us, 8));
						}),
						(e.ɵdir = Ke({
							type: e,
							selectors: [["", "routerLinkActive", ""]],
							contentQueries: function (t, r, i) {
								if ((1 & t && Yn(i, us, 5), 2 & t)) {
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
							features: [Dn],
						})),
						e
					);
				})();
			class nv {}
			let Vk = (() => {
				class e {
					constructor(t, r, i, o, s) {
						(this.router = t), (this.injector = i), (this.preloadingStrategy = o), (this.loader = s);
					}
					setUpPreloading() {
						this.subscription = this.router.events
							.pipe(
								Hn((t) => t instanceof Mr),
								bi(() => this.preload()),
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
						return We(i).pipe(Nr());
					}
					preloadConfig(t, r) {
						return this.preloadingStrategy.preload(r, () => {
							let i;
							i = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(t, r) : U(null);
							const o = i.pipe(
								qe((s) =>
									null === s
										? U(void 0)
										: ((r._loadedRoutes = s.routes),
										  (r._loadedInjector = s.injector),
										  this.processRoutes(s.injector ?? t, s.routes)),
								),
							);
							return r.loadComponent && !r._loadedComponent
								? We([o, this.loader.loadComponent(r)]).pipe(Nr())
								: o;
						});
					}
				}
				return (
					(e.ɵfac = function (t) {
						return new (t || e)(L(Vt), L(XA), L(cn), L(nv), L(Dd));
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const Ed = new x("");
			let rv = (() => {
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
							t instanceof ud
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
							t instanceof M_ &&
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
										new M_(
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
						!(function QI() {
							throw new Error("invalid");
						})();
					}),
					(e.ɵprov = F({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function Bn(e, n) {
				return { ɵkind: e, ɵproviders: n };
			}
			function ov() {
				const e = P(Nn);
				return (n) => {
					const t = e.get(_i);
					if (n !== t.components[0]) return;
					const r = e.get(Vt),
						i = e.get(sv);
					1 === e.get(Sd) && r.initialNavigation(),
						e.get(av, null, H.Optional)?.setUpPreloading(),
						e.get(Ed, null, H.Optional)?.init(),
						r.resetRootComponentType(t.componentTypes[0]),
						i.closed || (i.next(), i.complete(), i.unsubscribe());
				};
			}
			const sv = new x("", { factory: () => new Pt() }),
				Sd = new x("", { providedIn: "root", factory: () => 1 }),
				av = new x("");
			function $k(e) {
				return Bn(0, [
					{ provide: av, useExisting: Vk },
					{ provide: nv, useExisting: e },
				]);
			}
			const lv = new x("ROUTER_FORROOT_GUARD"),
				Wk = [
					vg,
					{ provide: Xo, useClass: od },
					Vt,
					is,
					{
						provide: nr,
						useFactory: function iv(e) {
							return e.routerState.root;
						},
						deps: [Vt],
					},
					Dd,
					[],
				];
			function Gk() {
				return new cm("Router", Vt);
			}
			let cv = (() => {
				class e {
					constructor(t) {}
					static forRoot(t, r) {
						return {
							ngModule: e,
							providers: [
								Wk,
								[],
								{ provide: Hi, multi: !0, useValue: t },
								{ provide: lv, useFactory: Yk, deps: [[Vt, new Ws(), new Gs()]] },
								{ provide: El, useValue: r || {} },
								r?.useHash ? { provide: _r, useClass: PN } : { provide: _r, useClass: km },
								{
									provide: Ed,
									useFactory: () => {
										const e = P(KP),
											n = P(Ie),
											t = P(El),
											r = P(wl),
											i = P(Xo);
										return t.scrollOffset && e.setOffset(t.scrollOffset), new rv(i, r, e, n, t);
									},
								},
								r?.preloadingStrategy ? $k(r.preloadingStrategy).ɵproviders : [],
								{ provide: cm, multi: !0, useFactory: Gk },
								r?.initialNavigation ? Qk(r) : [],
								r?.bindToComponentInputs
									? Bn(8, [F_, { provide: ml, useExisting: F_ }]).ɵproviders
									: [],
								[
									{ provide: uv, useFactory: ov },
									{ provide: ug, multi: !0, useExisting: uv },
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
						return new (t || e)(L(lv, 8));
					}),
					(e.ɵmod = gt({ type: e })),
					(e.ɵinj = nt({})),
					e
				);
			})();
			function Yk(e) {
				return "guarded";
			}
			function Qk(e) {
				return [
					"disabled" === e.initialNavigation
						? Bn(3, [
								{
									provide: ng,
									multi: !0,
									useFactory: () => {
										const n = P(Vt);
										return () => {
											n.setUpLocationChangeListener();
										};
									},
								},
								{ provide: Sd, useValue: 2 },
						  ]).ɵproviders
						: [],
					"enabledBlocking" === e.initialNavigation
						? Bn(2, [
								{ provide: Sd, useValue: 0 },
								{
									provide: ng,
									multi: !0,
									deps: [Nn],
									useFactory: (n) => {
										const t = n.get(MN, Promise.resolve());
										return () =>
											t.then(
												() =>
													new Promise((r) => {
														const i = n.get(Vt),
															o = n.get(sv);
														tv(i, () => {
															r(!0);
														}),
															(n.get(wl).afterPreactivation = () => (
																r(!0), o.closed ? U(void 0) : o
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
			const uv = new x("");
			let Jk = (() => {
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
							return Object.keys(t.message).map((r) => ({
								label: r,
								children: t.message[r].map((i) => ({ label: i })),
							}));
						}
						onNodeSelect(t) {
							(this.routerLink = "/dogs/breed/"),
								t.node.parent && (this.routerLink += t.node.parent.label + "/"),
								(this.routerLink += t.node.label);
						}
					}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)(b(ed));
						}),
						(e.ɵcmp = Ae({
							type: e,
							selectors: [["app-dog-list"]],
							decls: 3,
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
									(N(0, "h1"),
									Ft(1, "Dogs (breeds) list"),
									R(),
									N(2, "p-tree", 0),
									ot("onNodeSelect", function (o) {
										return r.onNodeSelect(o);
									}),
									R()),
									2 & t && (y(2), hr("routerLink", r.routerLink), p("value", r.breedTree));
							},
							dependencies: [us, wd, o_],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center;color:#09f}"],
						})),
						e
					);
				})(),
				bd = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = Ae({
							type: e,
							selectors: [["app-all-dogs-button"]],
							decls: 3,
							vars: 0,
							consts: [
								["routerLink", "/dogs", "routerLinkActive", "active", "ariaCurrentWhenActive", "page"],
							],
							template: function (t, r) {
								1 & t && (N(0, "a", 0)(1, "p-button"), Ft(2, "All dogs"), R()());
							},
							dependencies: [us, wd, qx],
						})),
						e
					);
				})();
			const e3 = [
				{ path: "", redirectTo: "dogs", pathMatch: "full" },
				{ path: "dogs", component: Jk },
				{
					path: "dogs/breed/:breedName",
					component: (() => {
						class e {
							constructor(t, r) {
								(this.apiService = t),
									(this.activatedRoute = r),
									(this.breedName = ""),
									(this.imageURL = ""),
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
										this.imageURL = t.message[0];
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
						}
						return (
							(e.ɵfac = function (t) {
								return new (t || e)(b(ed), b(nr));
							}),
							(e.ɵcmp = Ae({
								type: e,
								selectors: [["app-breed"]],
								decls: 4,
								vars: 2,
								consts: [
									[3, "header"],
									[3, "src"],
								],
								template: function (t, r) {
									1 & t &&
										(N(0, "p-card", 0), K(1, "img", 1)(2, "br")(3, "app-all-dogs-button"), R()),
										2 & t && (hr("header", r.breedName), y(1), hr("src", r.imageURL, aa));
								},
								dependencies: [qy, bd],
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
								return new (t || e)(b(ed), b(nr));
							}),
							(e.ɵcmp = Ae({
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
										(N(0, "p-card", 0), K(1, "img", 1)(2, "br")(3, "app-all-dogs-button"), R()),
										2 & t && (hr("header", r.subBreedName), y(1), hr("src", r.imageURL, aa));
								},
								dependencies: [qy, bd],
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
							(e.ɵcmp = Ae({
								type: e,
								selectors: [["app-error"]],
								decls: 3,
								vars: 0,
								template: function (t, r) {
									1 & t && (N(0, "h1"), Ft(1, "404 Not found"), R(), K(2, "app-all-dogs-button"));
								},
								dependencies: [bd],
								styles: ["h1[_ngcontent-%COMP%]{font-size:30px}"],
							})),
							e
						);
					})(),
				},
				{ path: "**", redirectTo: "/error" },
			];
			let t3 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e })),
						(e.ɵinj = nt({ imports: [cv.forRoot(e3), cv] })),
						e
					);
				})(),
				n3 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵcmp = Ae({
							type: e,
							selectors: [["app-root"]],
							decls: 1,
							vars: 0,
							template: function (t, r) {
								1 & t && K(0, "router-outlet");
							},
							dependencies: [pd],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center}"],
						})),
						e
					);
				})(),
				r3 = (() => {
					class e {}
					return (
						(e.ɵfac = function (t) {
							return new (t || e)();
						}),
						(e.ɵmod = gt({ type: e, bootstrap: [n3] })),
						(e.ɵinj = nt({ imports: [UR, t3, px, Kx, sO, yL] })),
						e
					);
				})();
			VR()
				.bootstrapModule(r3)
				.catch((e) => console.error(e));
		},
	},
	(ge) => {
		ge((ge.s = 942));
	},
]);
