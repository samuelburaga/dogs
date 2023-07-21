"use strict";
(self.webpackChunkdogs = self.webpackChunkdogs || []).push([
	[179],
	{
		56: () => {
			function J(e) {
				return "function" == typeof e;
			}
			function to(e) {
				const n = e((r) => {
					Error.call(r), (r.stack = new Error().stack);
				});
				return (n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n;
			}
			const wi = to(
				(e) =>
					function (n) {
						e(this),
							(this.message = n
								? `${n.length} errors occurred during unsubscription:\n${n
										.map((r, o) => `${o + 1}) ${r.toString()}`)
										.join("\n  ")}`
								: ""),
							(this.name = "UnsubscriptionError"),
							(this.errors = n);
					},
			);
			function no(e, t) {
				if (e) {
					const n = e.indexOf(t);
					0 <= n && e.splice(n, 1);
				}
			}
			class at {
				constructor(t) {
					(this.initialTeardown = t), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
				}
				unsubscribe() {
					let t;
					if (!this.closed) {
						this.closed = !0;
						const { _parentage: n } = this;
						if (n)
							if (((this._parentage = null), Array.isArray(n))) for (const i of n) i.remove(this);
							else n.remove(this);
						const { initialTeardown: r } = this;
						if (J(r))
							try {
								r();
							} catch (i) {
								t = i instanceof wi ? i.errors : [i];
							}
						const { _finalizers: o } = this;
						if (o) {
							this._finalizers = null;
							for (const i of o)
								try {
									zd(i);
								} catch (s) {
									(t = t ?? []), s instanceof wi ? (t = [...t, ...s.errors]) : t.push(s);
								}
						}
						if (t) throw new wi(t);
					}
				}
				add(t) {
					var n;
					if (t && t !== this)
						if (this.closed) zd(t);
						else {
							if (t instanceof at) {
								if (t.closed || t._hasParent(this)) return;
								t._addParent(this);
							}
							(this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t);
						}
				}
				_hasParent(t) {
					const { _parentage: n } = this;
					return n === t || (Array.isArray(n) && n.includes(t));
				}
				_addParent(t) {
					const { _parentage: n } = this;
					this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
				}
				_removeParent(t) {
					const { _parentage: n } = this;
					n === t ? (this._parentage = null) : Array.isArray(n) && no(n, t);
				}
				remove(t) {
					const { _finalizers: n } = this;
					n && no(n, t), t instanceof at && t._removeParent(this);
				}
			}
			at.EMPTY = (() => {
				const e = new at();
				return (e.closed = !0), e;
			})();
			const Bd = at.EMPTY;
			function Ud(e) {
				return e instanceof at || (e && "closed" in e && J(e.remove) && J(e.add) && J(e.unsubscribe));
			}
			function zd(e) {
				J(e) ? e() : e.unsubscribe();
			}
			const An = {
					onUnhandledError: null,
					onStoppedNotification: null,
					Promise: void 0,
					useDeprecatedSynchronousErrorHandling: !1,
					useDeprecatedNextContext: !1,
				},
				Ei = {
					setTimeout(e, t, ...n) {
						const { delegate: r } = Ei;
						return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
					},
					clearTimeout(e) {
						const { delegate: t } = Ei;
						return (t?.clearTimeout || clearTimeout)(e);
					},
					delegate: void 0,
				};
			function Gd(e) {
				Ei.setTimeout(() => {
					const { onUnhandledError: t } = An;
					if (!t) throw e;
					t(e);
				});
			}
			function qd() {}
			const mw = La("C", void 0, void 0);
			function La(e, t, n) {
				return { kind: e, value: t, error: n };
			}
			let Rn = null;
			function _i(e) {
				if (An.useDeprecatedSynchronousErrorHandling) {
					const t = !Rn;
					if ((t && (Rn = { errorThrown: !1, error: null }), e(), t)) {
						const { errorThrown: n, error: r } = Rn;
						if (((Rn = null), n)) throw r;
					}
				} else e();
			}
			class ja extends at {
				constructor(t) {
					super(),
						(this.isStopped = !1),
						t ? ((this.destination = t), Ud(t) && t.add(this)) : (this.destination = _w);
				}
				static create(t, n, r) {
					return new ro(t, n, r);
				}
				next(t) {
					this.isStopped
						? Va(
								(function vw(e) {
									return La("N", e, void 0);
								})(t),
								this,
						  )
						: this._next(t);
				}
				error(t) {
					this.isStopped
						? Va(
								(function yw(e) {
									return La("E", void 0, e);
								})(t),
								this,
						  )
						: ((this.isStopped = !0), this._error(t));
				}
				complete() {
					this.isStopped ? Va(mw, this) : ((this.isStopped = !0), this._complete());
				}
				unsubscribe() {
					this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
				}
				_next(t) {
					this.destination.next(t);
				}
				_error(t) {
					try {
						this.destination.error(t);
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
			const Cw = Function.prototype.bind;
			function Ha(e, t) {
				return Cw.call(e, t);
			}
			class ww {
				constructor(t) {
					this.partialObserver = t;
				}
				next(t) {
					const { partialObserver: n } = this;
					if (n.next)
						try {
							n.next(t);
						} catch (r) {
							bi(r);
						}
				}
				error(t) {
					const { partialObserver: n } = this;
					if (n.error)
						try {
							n.error(t);
						} catch (r) {
							bi(r);
						}
					else bi(t);
				}
				complete() {
					const { partialObserver: t } = this;
					if (t.complete)
						try {
							t.complete();
						} catch (n) {
							bi(n);
						}
				}
			}
			class ro extends ja {
				constructor(t, n, r) {
					let o;
					if ((super(), J(t) || !t)) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
					else {
						let i;
						this && An.useDeprecatedNextContext
							? ((i = Object.create(t)),
							  (i.unsubscribe = () => this.unsubscribe()),
							  (o = {
									next: t.next && Ha(t.next, i),
									error: t.error && Ha(t.error, i),
									complete: t.complete && Ha(t.complete, i),
							  }))
							: (o = t);
					}
					this.destination = new ww(o);
				}
			}
			function bi(e) {
				An.useDeprecatedSynchronousErrorHandling
					? (function Dw(e) {
							An.useDeprecatedSynchronousErrorHandling && Rn && ((Rn.errorThrown = !0), (Rn.error = e));
					  })(e)
					: Gd(e);
			}
			function Va(e, t) {
				const { onStoppedNotification: n } = An;
				n && Ei.setTimeout(() => n(e, t));
			}
			const _w = {
					closed: !0,
					next: qd,
					error: function Ew(e) {
						throw e;
					},
					complete: qd,
				},
				$a = ("function" == typeof Symbol && Symbol.observable) || "@@observable";
			function hn(e) {
				return e;
			}
			function Wd(e) {
				return 0 === e.length
					? hn
					: 1 === e.length
					? e[0]
					: function (n) {
							return e.reduce((r, o) => o(r), n);
					  };
			}
			let he = (() => {
				class e {
					constructor(n) {
						n && (this._subscribe = n);
					}
					lift(n) {
						const r = new e();
						return (r.source = this), (r.operator = n), r;
					}
					subscribe(n, r, o) {
						const i = (function Iw(e) {
							return (
								(e && e instanceof ja) ||
								((function Sw(e) {
									return e && J(e.next) && J(e.error) && J(e.complete);
								})(e) &&
									Ud(e))
							);
						})(n)
							? n
							: new ro(n, r, o);
						return (
							_i(() => {
								const { operator: s, source: a } = this;
								i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
							}),
							i
						);
					}
					_trySubscribe(n) {
						try {
							return this._subscribe(n);
						} catch (r) {
							n.error(r);
						}
					}
					forEach(n, r) {
						return new (r = Zd(r))((o, i) => {
							const s = new ro({
								next: (a) => {
									try {
										n(a);
									} catch (u) {
										i(u), s.unsubscribe();
									}
								},
								error: i,
								complete: o,
							});
							this.subscribe(s);
						});
					}
					_subscribe(n) {
						var r;
						return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n);
					}
					[$a]() {
						return this;
					}
					pipe(...n) {
						return Wd(n)(this);
					}
					toPromise(n) {
						return new (n = Zd(n))((r, o) => {
							let i;
							this.subscribe(
								(s) => (i = s),
								(s) => o(s),
								() => r(i),
							);
						});
					}
				}
				return (e.create = (t) => new e(t)), e;
			})();
			function Zd(e) {
				var t;
				return null !== (t = e ?? An.Promise) && void 0 !== t ? t : Promise;
			}
			const Mw = to(
				(e) =>
					function () {
						e(this), (this.name = "ObjectUnsubscribedError"), (this.message = "object unsubscribed");
					},
			);
			let Gt = (() => {
				class e extends he {
					constructor() {
						super(),
							(this.closed = !1),
							(this.currentObservers = null),
							(this.observers = []),
							(this.isStopped = !1),
							(this.hasError = !1),
							(this.thrownError = null);
					}
					lift(n) {
						const r = new Yd(this, this);
						return (r.operator = n), r;
					}
					_throwIfClosed() {
						if (this.closed) throw new Mw();
					}
					next(n) {
						_i(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.currentObservers || (this.currentObservers = Array.from(this.observers));
								for (const r of this.currentObservers) r.next(n);
							}
						});
					}
					error(n) {
						_i(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								(this.hasError = this.isStopped = !0), (this.thrownError = n);
								const { observers: r } = this;
								for (; r.length; ) r.shift().error(n);
							}
						});
					}
					complete() {
						_i(() => {
							if ((this._throwIfClosed(), !this.isStopped)) {
								this.isStopped = !0;
								const { observers: n } = this;
								for (; n.length; ) n.shift().complete();
							}
						});
					}
					unsubscribe() {
						(this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
					}
					get observed() {
						var n;
						return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0;
					}
					_trySubscribe(n) {
						return this._throwIfClosed(), super._trySubscribe(n);
					}
					_subscribe(n) {
						return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
					}
					_innerSubscribe(n) {
						const { hasError: r, isStopped: o, observers: i } = this;
						return r || o
							? Bd
							: ((this.currentObservers = null),
							  i.push(n),
							  new at(() => {
									(this.currentObservers = null), no(i, n);
							  }));
					}
					_checkFinalizedStatuses(n) {
						const { hasError: r, thrownError: o, isStopped: i } = this;
						r ? n.error(o) : i && n.complete();
					}
					asObservable() {
						const n = new he();
						return (n.source = this), n;
					}
				}
				return (e.create = (t, n) => new Yd(t, n)), e;
			})();
			class Yd extends Gt {
				constructor(t, n) {
					super(), (this.destination = t), (this.source = n);
				}
				next(t) {
					var n, r;
					null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) ||
						void 0 === r ||
						r.call(n, t);
				}
				error(t) {
					var n, r;
					null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) ||
						void 0 === r ||
						r.call(n, t);
				}
				complete() {
					var t, n;
					null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) ||
						void 0 === n ||
						n.call(t);
				}
				_subscribe(t) {
					var n, r;
					return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) &&
						void 0 !== r
						? r
						: Bd;
				}
			}
			class ut extends Gt {
				constructor(t) {
					super(), (this._value = t);
				}
				get value() {
					return this.getValue();
				}
				_subscribe(t) {
					const n = super._subscribe(t);
					return !n.closed && t.next(this._value), n;
				}
				getValue() {
					const { hasError: t, thrownError: n, _value: r } = this;
					if (t) throw n;
					return this._throwIfClosed(), r;
				}
				next(t) {
					super.next((this._value = t));
				}
			}
			function Qd(e) {
				return J(e?.lift);
			}
			function be(e) {
				return (t) => {
					if (Qd(t))
						return t.lift(function (n) {
							try {
								return e(n, this);
							} catch (r) {
								this.error(r);
							}
						});
					throw new TypeError("Unable to lift unknown Observable type");
				};
			}
			function Se(e, t, n, r, o) {
				return new Tw(e, t, n, r, o);
			}
			class Tw extends ja {
				constructor(t, n, r, o, i, s) {
					super(t),
						(this.onFinalize = i),
						(this.shouldUnsubscribe = s),
						(this._next = n
							? function (a) {
									try {
										n(a);
									} catch (u) {
										t.error(u);
									}
							  }
							: super._next),
						(this._error = o
							? function (a) {
									try {
										o(a);
									} catch (u) {
										t.error(u);
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
										t.error(a);
									} finally {
										this.unsubscribe();
									}
							  }
							: super._complete);
				}
				unsubscribe() {
					var t;
					if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
						const { closed: n } = this;
						super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this));
					}
				}
			}
			function Y(e, t) {
				return be((n, r) => {
					let o = 0;
					n.subscribe(
						Se(r, (i) => {
							r.next(e.call(t, i, o++));
						}),
					);
				});
			}
			function pn(e) {
				return this instanceof pn ? ((this.v = e), this) : new pn(e);
			}
			function ef(e) {
				if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
				var n,
					t = e[Symbol.asyncIterator];
				return t
					? t.call(e)
					: ((e = (function Ga(e) {
							var t = "function" == typeof Symbol && Symbol.iterator,
								n = t && e[t],
								r = 0;
							if (n) return n.call(e);
							if (e && "number" == typeof e.length)
								return {
									next: function () {
										return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
									},
								};
							throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
					  })(e)),
					  (n = {}),
					  r("next"),
					  r("throw"),
					  r("return"),
					  (n[Symbol.asyncIterator] = function () {
							return this;
					  }),
					  n);
				function r(i) {
					n[i] =
						e[i] &&
						function (s) {
							return new Promise(function (a, u) {
								!(function o(i, s, a, u) {
									Promise.resolve(u).then(function (c) {
										i({ value: c, done: a });
									}, s);
								})(a, u, (s = e[i](s)).done, s.value);
							});
						};
				}
			}
			"function" == typeof SuppressedError && SuppressedError;
			const tf = (e) => e && "number" == typeof e.length && "function" != typeof e;
			function nf(e) {
				return J(e?.then);
			}
			function rf(e) {
				return J(e[$a]);
			}
			function sf(e) {
				return Symbol.asyncIterator && J(e?.[Symbol.asyncIterator]);
			}
			function af(e) {
				return new TypeError(
					`You provided ${
						null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
					} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
				);
			}
			const uf = (function Qw() {
				return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator";
			})();
			function cf(e) {
				return J(e?.[uf]);
			}
			function lf(e) {
				return (function Jd(e, t, n) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var o,
						r = n.apply(e, t || []),
						i = [];
					return (
						(o = {}),
						s("next"),
						s("throw"),
						s("return"),
						(o[Symbol.asyncIterator] = function () {
							return this;
						}),
						o
					);
					function s(f) {
						r[f] &&
							(o[f] = function (h) {
								return new Promise(function (p, g) {
									i.push([f, h, p, g]) > 1 || a(f, h);
								});
							});
					}
					function a(f, h) {
						try {
							!(function u(f) {
								f.value instanceof pn ? Promise.resolve(f.value.v).then(c, l) : d(i[0][2], f);
							})(r[f](h));
						} catch (p) {
							d(i[0][3], p);
						}
					}
					function c(f) {
						a("next", f);
					}
					function l(f) {
						a("throw", f);
					}
					function d(f, h) {
						f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
					}
				})(this, arguments, function* () {
					const n = e.getReader();
					try {
						for (;;) {
							const { value: r, done: o } = yield pn(n.read());
							if (o) return yield pn(void 0);
							yield yield pn(r);
						}
					} finally {
						n.releaseLock();
					}
				});
			}
			function df(e) {
				return J(e?.getReader);
			}
			function gt(e) {
				if (e instanceof he) return e;
				if (null != e) {
					if (rf(e))
						return (function Kw(e) {
							return new he((t) => {
								const n = e[$a]();
								if (J(n.subscribe)) return n.subscribe(t);
								throw new TypeError("Provided object does not correctly implement Symbol.observable");
							});
						})(e);
					if (tf(e))
						return (function Xw(e) {
							return new he((t) => {
								for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
								t.complete();
							});
						})(e);
					if (nf(e))
						return (function Jw(e) {
							return new he((t) => {
								e.then(
									(n) => {
										t.closed || (t.next(n), t.complete());
									},
									(n) => t.error(n),
								).then(null, Gd);
							});
						})(e);
					if (sf(e)) return ff(e);
					if (cf(e))
						return (function eE(e) {
							return new he((t) => {
								for (const n of e) if ((t.next(n), t.closed)) return;
								t.complete();
							});
						})(e);
					if (df(e))
						return (function tE(e) {
							return ff(lf(e));
						})(e);
				}
				throw af(e);
			}
			function ff(e) {
				return new he((t) => {
					(function nE(e, t) {
						var n, r, o, i;
						return (function Kd(e, t, n, r) {
							return new (n || (n = Promise))(function (i, s) {
								function a(l) {
									try {
										c(r.next(l));
									} catch (d) {
										s(d);
									}
								}
								function u(l) {
									try {
										c(r.throw(l));
									} catch (d) {
										s(d);
									}
								}
								function c(l) {
									l.done
										? i(l.value)
										: (function o(i) {
												return i instanceof n
													? i
													: new n(function (s) {
															s(i);
													  });
										  })(l.value).then(a, u);
								}
								c((r = r.apply(e, t || [])).next());
							});
						})(this, void 0, void 0, function* () {
							try {
								for (n = ef(e); !(r = yield n.next()).done; ) if ((t.next(r.value), t.closed)) return;
							} catch (s) {
								o = { error: s };
							} finally {
								try {
									r && !r.done && (i = n.return) && (yield i.call(n));
								} finally {
									if (o) throw o.error;
								}
							}
							t.complete();
						});
					})(e, t).catch((n) => t.error(n));
				});
			}
			function qt(e, t, n, r = 0, o = !1) {
				const i = t.schedule(function () {
					n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
				}, r);
				if ((e.add(i), !o)) return i;
			}
			function Te(e, t, n = 1 / 0) {
				return J(t)
					? Te((r, o) => Y((i, s) => t(r, i, o, s))(gt(e(r, o))), n)
					: ("number" == typeof t && (n = t),
					  be((r, o) =>
							(function rE(e, t, n, r, o, i, s, a) {
								const u = [];
								let c = 0,
									l = 0,
									d = !1;
								const f = () => {
										d && !u.length && !c && t.complete();
									},
									h = (g) => (c < r ? p(g) : u.push(g)),
									p = (g) => {
										i && t.next(g), c++;
										let y = !1;
										gt(n(g, l++)).subscribe(
											Se(
												t,
												(D) => {
													o?.(D), i ? h(D) : t.next(D);
												},
												() => {
													y = !0;
												},
												void 0,
												() => {
													if (y)
														try {
															for (c--; u.length && c < r; ) {
																const D = u.shift();
																s ? qt(t, s, () => p(D)) : p(D);
															}
															f();
														} catch (D) {
															t.error(D);
														}
												},
											),
										);
									};
								return (
									e.subscribe(
										Se(t, h, () => {
											(d = !0), f();
										}),
									),
									() => {
										a?.();
									}
								);
							})(r, o, e, n),
					  ));
			}
			function Jn(e = 1 / 0) {
				return Te(hn, e);
			}
			const Tt = new he((e) => e.complete());
			function qa(e) {
				return e[e.length - 1];
			}
			function oo(e) {
				return (function iE(e) {
					return e && J(e.schedule);
				})(qa(e))
					? e.pop()
					: void 0;
			}
			function hf(e, t = 0) {
				return be((n, r) => {
					n.subscribe(
						Se(
							r,
							(o) => qt(r, e, () => r.next(o), t),
							() => qt(r, e, () => r.complete(), t),
							(o) => qt(r, e, () => r.error(o), t),
						),
					);
				});
			}
			function pf(e, t = 0) {
				return be((n, r) => {
					r.add(e.schedule(() => n.subscribe(r), t));
				});
			}
			function gf(e, t) {
				if (!e) throw new Error("Iterable cannot be null");
				return new he((n) => {
					qt(n, t, () => {
						const r = e[Symbol.asyncIterator]();
						qt(
							n,
							t,
							() => {
								r.next().then((o) => {
									o.done ? n.complete() : n.next(o.value);
								});
							},
							0,
							!0,
						);
					});
				});
			}
			function Ie(e, t) {
				return t
					? (function hE(e, t) {
							if (null != e) {
								if (rf(e))
									return (function uE(e, t) {
										return gt(e).pipe(pf(t), hf(t));
									})(e, t);
								if (tf(e))
									return (function lE(e, t) {
										return new he((n) => {
											let r = 0;
											return t.schedule(function () {
												r === e.length
													? n.complete()
													: (n.next(e[r++]), n.closed || this.schedule());
											});
										});
									})(e, t);
								if (nf(e))
									return (function cE(e, t) {
										return gt(e).pipe(pf(t), hf(t));
									})(e, t);
								if (sf(e)) return gf(e, t);
								if (cf(e))
									return (function dE(e, t) {
										return new he((n) => {
											let r;
											return (
												qt(n, t, () => {
													(r = e[uf]()),
														qt(
															n,
															t,
															() => {
																let o, i;
																try {
																	({ value: o, done: i } = r.next());
																} catch (s) {
																	return void n.error(s);
																}
																i ? n.complete() : n.next(o);
															},
															0,
															!0,
														);
												}),
												() => J(r?.return) && r.return()
											);
										});
									})(e, t);
								if (df(e))
									return (function fE(e, t) {
										return gf(lf(e), t);
									})(e, t);
							}
							throw af(e);
					  })(e, t)
					: gt(e);
			}
			function O(...e) {
				return Ie(e, oo(e));
			}
			function mf(e = {}) {
				const {
					connector: t = () => new Gt(),
					resetOnError: n = !0,
					resetOnComplete: r = !0,
					resetOnRefCountZero: o = !0,
				} = e;
				return (i) => {
					let s,
						a,
						u,
						c = 0,
						l = !1,
						d = !1;
					const f = () => {
							a?.unsubscribe(), (a = void 0);
						},
						h = () => {
							f(), (s = u = void 0), (l = d = !1);
						},
						p = () => {
							const g = s;
							h(), g?.unsubscribe();
						};
					return be((g, y) => {
						c++, !d && !l && f();
						const D = (u = u ?? t());
						y.add(() => {
							c--, 0 === c && !d && !l && (a = Wa(p, o));
						}),
							D.subscribe(y),
							!s &&
								c > 0 &&
								((s = new ro({
									next: (m) => D.next(m),
									error: (m) => {
										(d = !0), f(), (a = Wa(h, n, m)), D.error(m);
									},
									complete: () => {
										(l = !0), f(), (a = Wa(h, r)), D.complete();
									},
								})),
								gt(g).subscribe(s));
					})(i);
				};
			}
			function Wa(e, t, ...n) {
				if (!0 === t) return void e();
				if (!1 === t) return;
				const r = new ro({
					next: () => {
						r.unsubscribe(), e();
					},
				});
				return gt(t(...n)).subscribe(r);
			}
			function mt(e, t) {
				return be((n, r) => {
					let o = null,
						i = 0,
						s = !1;
					const a = () => s && !o && r.complete();
					n.subscribe(
						Se(
							r,
							(u) => {
								o?.unsubscribe();
								let c = 0;
								const l = i++;
								gt(e(u, l)).subscribe(
									(o = Se(
										r,
										(d) => r.next(t ? t(u, d, l, c++) : d),
										() => {
											(o = null), a();
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
			function mE(e, t) {
				return e === t;
			}
			function K(e) {
				for (let t in e) if (e[t] === K) return t;
				throw Error("Could not find renamed property on target object.");
			}
			function ve(e) {
				if ("string" == typeof e) return e;
				if (Array.isArray(e)) return "[" + e.map(ve).join(", ") + "]";
				if (null == e) return "" + e;
				if (e.overriddenName) return `${e.overriddenName}`;
				if (e.name) return `${e.name}`;
				const t = e.toString();
				if (null == t) return "" + t;
				const n = t.indexOf("\n");
				return -1 === n ? t : t.substring(0, n);
			}
			function Za(e, t) {
				return null == e || "" === e ? (null === t ? "" : t) : null == t || "" === t ? e : e + " " + t;
			}
			const yE = K({ __forward_ref__: K });
			function Ya(e) {
				return (
					(e.__forward_ref__ = Ya),
					(e.toString = function () {
						return ve(this());
					}),
					e
				);
			}
			function F(e) {
				return Qa(e) ? e() : e;
			}
			function Qa(e) {
				return "function" == typeof e && e.hasOwnProperty(yE) && e.__forward_ref__ === Ya;
			}
			function Ka(e) {
				return e && !!e.ɵproviders;
			}
			const yf = "https://g.co/ng/security#xss";
			class C extends Error {
				constructor(t, n) {
					super(
						(function Ii(e, t) {
							return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
						})(t, n),
					),
						(this.code = t);
				}
			}
			function L(e) {
				return "string" == typeof e ? e : null == e ? "" : String(e);
			}
			function Mi(e, t) {
				throw new C(-201, !1);
			}
			function ct(e, t) {
				null == e &&
					(function W(e, t, n, r) {
						throw new Error(
							`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`),
						);
					})(t, e, null, "!=");
			}
			function T(e) {
				return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
			}
			function Wt(e) {
				return { providers: e.providers || [], imports: e.imports || [] };
			}
			function Ti(e) {
				return vf(e, Ai) || vf(e, Cf);
			}
			function vf(e, t) {
				return e.hasOwnProperty(t) ? e[t] : null;
			}
			function Df(e) {
				return e && (e.hasOwnProperty(Xa) || e.hasOwnProperty(SE)) ? e[Xa] : null;
			}
			const Ai = K({ ɵprov: K }),
				Xa = K({ ɵinj: K }),
				Cf = K({ ngInjectableDef: K }),
				SE = K({ ngInjectorDef: K });
			var A = (() => (
				((A = A || {})[(A.Default = 0)] = "Default"),
				(A[(A.Host = 1)] = "Host"),
				(A[(A.Self = 2)] = "Self"),
				(A[(A.SkipSelf = 4)] = "SkipSelf"),
				(A[(A.Optional = 8)] = "Optional"),
				A
			))();
			let Ja;
			function Be(e) {
				const t = Ja;
				return (Ja = e), t;
			}
			function Ef(e, t, n) {
				const r = Ti(e);
				return r && "root" == r.providedIn
					? void 0 === r.value
						? (r.value = r.factory())
						: r.value
					: n & A.Optional
					? null
					: void 0 !== t
					? t
					: void Mi(ve(e));
			}
			const ee = (() =>
					(typeof globalThis < "u" && globalThis) ||
					(typeof global < "u" && global) ||
					(typeof window < "u" && window) ||
					(typeof self < "u" &&
						typeof WorkerGlobalScope < "u" &&
						self instanceof WorkerGlobalScope &&
						self))(),
				io = {},
				eu = "__NG_DI_FLAG__",
				Ri = "ngTempTokenPath",
				ME = /\n/gm,
				_f = "__source";
			let er;
			function gn(e) {
				const t = er;
				return (er = e), t;
			}
			function RE(e, t = A.Default) {
				if (void 0 === er) throw new C(-203, !1);
				return null === er ? Ef(e, void 0, t) : er.get(e, t & A.Optional ? null : void 0, t);
			}
			function I(e, t = A.Default) {
				return (
					(function wf() {
						return Ja;
					})() || RE
				)(F(e), t);
			}
			function b(e, t = A.Default) {
				return I(e, Ni(t));
			}
			function Ni(e) {
				return typeof e > "u" || "number" == typeof e
					? e
					: 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
			}
			function tu(e) {
				const t = [];
				for (let n = 0; n < e.length; n++) {
					const r = F(e[n]);
					if (Array.isArray(r)) {
						if (0 === r.length) throw new C(900, !1);
						let o,
							i = A.Default;
						for (let s = 0; s < r.length; s++) {
							const a = r[s],
								u = NE(a);
							"number" == typeof u ? (-1 === u ? (o = a.token) : (i |= u)) : (o = a);
						}
						t.push(I(o, i));
					} else t.push(I(r));
				}
				return t;
			}
			function so(e, t) {
				return (e[eu] = t), (e.prototype[eu] = t), e;
			}
			function NE(e) {
				return e[eu];
			}
			function Zt(e) {
				return { toString: e }.toString();
			}
			var At = (() => (((At = At || {})[(At.OnPush = 0)] = "OnPush"), (At[(At.Default = 1)] = "Default"), At))(),
				Je = (() => {
					return (
						((e = Je || (Je = {}))[(e.Emulated = 0)] = "Emulated"),
						(e[(e.None = 2)] = "None"),
						(e[(e.ShadowDom = 3)] = "ShadowDom"),
						Je
					);
					var e;
				})();
			const Rt = {},
				q = [],
				xi = K({ ɵcmp: K }),
				nu = K({ ɵdir: K }),
				ru = K({ ɵpipe: K }),
				Sf = K({ ɵmod: K }),
				Yt = K({ ɵfac: K }),
				ao = K({ __NG_ELEMENT_ID__: K }),
				If = K({ __NG_ENV_ID__: K });
			function Mf(e, t, n) {
				let r = e.length;
				for (;;) {
					const o = e.indexOf(t, n);
					if (-1 === o) return o;
					if (0 === o || e.charCodeAt(o - 1) <= 32) {
						const i = t.length;
						if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
					}
					n = o + 1;
				}
			}
			function ou(e, t, n) {
				let r = 0;
				for (; r < n.length; ) {
					const o = n[r];
					if ("number" == typeof o) {
						if (0 !== o) break;
						r++;
						const i = n[r++],
							s = n[r++],
							a = n[r++];
						e.setAttribute(t, s, a, i);
					} else {
						const i = o,
							s = n[++r];
						Af(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
					}
				}
				return r;
			}
			function Tf(e) {
				return 3 === e || 4 === e || 6 === e;
			}
			function Af(e) {
				return 64 === e.charCodeAt(0);
			}
			function uo(e, t) {
				if (null !== t && 0 !== t.length)
					if (null === e || 0 === e.length) e = t.slice();
					else {
						let n = -1;
						for (let r = 0; r < t.length; r++) {
							const o = t[r];
							"number" == typeof o
								? (n = o)
								: 0 === n || Rf(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
						}
					}
				return e;
			}
			function Rf(e, t, n, r, o) {
				let i = 0,
					s = e.length;
				if (-1 === t) s = -1;
				else
					for (; i < e.length; ) {
						const a = e[i++];
						if ("number" == typeof a) {
							if (a === t) {
								s = -1;
								break;
							}
							if (a > t) {
								s = i - 1;
								break;
							}
						}
					}
				for (; i < e.length; ) {
					const a = e[i];
					if ("number" == typeof a) break;
					if (a === n) {
						if (null === r) return void (null !== o && (e[i + 1] = o));
						if (r === e[i + 1]) return void (e[i + 2] = o);
					}
					i++, null !== r && i++, null !== o && i++;
				}
				-1 !== s && (e.splice(s, 0, t), (i = s + 1)),
					e.splice(i++, 0, n),
					null !== r && e.splice(i++, 0, r),
					null !== o && e.splice(i++, 0, o);
			}
			const Nf = "ng-template";
			function PE(e, t, n) {
				let r = 0,
					o = !0;
				for (; r < e.length; ) {
					let i = e[r++];
					if ("string" == typeof i && o) {
						const s = e[r++];
						if (n && "class" === i && -1 !== Mf(s.toLowerCase(), t, 0)) return !0;
					} else {
						if (1 === i) {
							for (; r < e.length && "string" == typeof (i = e[r++]); )
								if (i.toLowerCase() === t) return !0;
							return !1;
						}
						"number" == typeof i && (o = !1);
					}
				}
				return !1;
			}
			function xf(e) {
				return 4 === e.type && e.value !== Nf;
			}
			function FE(e, t, n) {
				return t === (4 !== e.type || n ? e.value : Nf);
			}
			function kE(e, t, n) {
				let r = 4;
				const o = e.attrs || [],
					i = (function HE(e) {
						for (let t = 0; t < e.length; t++) if (Tf(e[t])) return t;
						return e.length;
					})(o);
				let s = !1;
				for (let a = 0; a < t.length; a++) {
					const u = t[a];
					if ("number" != typeof u) {
						if (!s)
							if (4 & r) {
								if (((r = 2 | (1 & r)), ("" !== u && !FE(e, u, n)) || ("" === u && 1 === t.length))) {
									if (yt(r)) return !1;
									s = !0;
								}
							} else {
								const c = 8 & r ? u : t[++a];
								if (8 & r && null !== e.attrs) {
									if (!PE(e.attrs, c, n)) {
										if (yt(r)) return !1;
										s = !0;
									}
									continue;
								}
								const d = LE(8 & r ? "class" : u, o, xf(e), n);
								if (-1 === d) {
									if (yt(r)) return !1;
									s = !0;
									continue;
								}
								if ("" !== c) {
									let f;
									f = d > i ? "" : o[d + 1].toLowerCase();
									const h = 8 & r ? f : null;
									if ((h && -1 !== Mf(h, c, 0)) || (2 & r && c !== f)) {
										if (yt(r)) return !1;
										s = !0;
									}
								}
							}
					} else {
						if (!s && !yt(r) && !yt(u)) return !1;
						if (s && yt(u)) continue;
						(s = !1), (r = u | (1 & r));
					}
				}
				return yt(r) || s;
			}
			function yt(e) {
				return 0 == (1 & e);
			}
			function LE(e, t, n, r) {
				if (null === t) return -1;
				let o = 0;
				if (r || !n) {
					let i = !1;
					for (; o < t.length; ) {
						const s = t[o];
						if (s === e) return o;
						if (3 === s || 6 === s) i = !0;
						else {
							if (1 === s || 2 === s) {
								let a = t[++o];
								for (; "string" == typeof a; ) a = t[++o];
								continue;
							}
							if (4 === s) break;
							if (0 === s) {
								o += 4;
								continue;
							}
						}
						o += i ? 1 : 2;
					}
					return -1;
				}
				return (function VE(e, t) {
					let n = e.indexOf(4);
					if (n > -1)
						for (n++; n < e.length; ) {
							const r = e[n];
							if ("number" == typeof r) return -1;
							if (r === t) return n;
							n++;
						}
					return -1;
				})(t, e);
			}
			function Of(e, t, n = !1) {
				for (let r = 0; r < t.length; r++) if (kE(e, t[r], n)) return !0;
				return !1;
			}
			function Pf(e, t) {
				return e ? ":not(" + t.trim() + ")" : t;
			}
			function BE(e) {
				let t = e[0],
					n = 1,
					r = 2,
					o = "",
					i = !1;
				for (; n < e.length; ) {
					let s = e[n];
					if ("string" == typeof s)
						if (2 & r) {
							const a = e[++n];
							o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
						} else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
					else "" !== o && !yt(s) && ((t += Pf(i, o)), (o = "")), (r = s), (i = i || !yt(r));
					n++;
				}
				return "" !== o && (t += Pf(i, o)), t;
			}
			function mn(e) {
				return Zt(() => {
					const t = kf(e),
						n = {
							...t,
							decls: e.decls,
							vars: e.vars,
							template: e.template,
							consts: e.consts || null,
							ngContentSelectors: e.ngContentSelectors,
							onPush: e.changeDetection === At.OnPush,
							directiveDefs: null,
							pipeDefs: null,
							dependencies: (t.standalone && e.dependencies) || null,
							getStandaloneInjector: null,
							signals: e.signals ?? !1,
							data: e.data || {},
							encapsulation: e.encapsulation || Je.Emulated,
							styles: e.styles || q,
							_: null,
							schemas: e.schemas || null,
							tView: null,
							id: "",
						};
					Lf(n);
					const r = e.dependencies;
					return (
						(n.directiveDefs = Oi(r, !1)),
						(n.pipeDefs = Oi(r, !0)),
						(n.id = (function QE(e) {
							let t = 0;
							const n = [
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
							for (const o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
							return (t += 2147483648), "c" + t;
						})(n)),
						n
					);
				});
			}
			function qE(e) {
				return Z(e) || Re(e);
			}
			function WE(e) {
				return null !== e;
			}
			function yn(e) {
				return Zt(() => ({
					type: e.type,
					bootstrap: e.bootstrap || q,
					declarations: e.declarations || q,
					imports: e.imports || q,
					exports: e.exports || q,
					transitiveCompileScopes: null,
					schemas: e.schemas || null,
					id: e.id || null,
				}));
			}
			function Ff(e, t) {
				if (null == e) return Rt;
				const n = {};
				for (const r in e)
					if (e.hasOwnProperty(r)) {
						let o = e[r],
							i = o;
						Array.isArray(o) && ((i = o[1]), (o = o[0])), (n[o] = r), t && (t[o] = i);
					}
				return n;
			}
			function Fe(e) {
				return Zt(() => {
					const t = kf(e);
					return Lf(t), t;
				});
			}
			function Z(e) {
				return e[xi] || null;
			}
			function Re(e) {
				return e[nu] || null;
			}
			function ze(e) {
				return e[ru] || null;
			}
			function et(e, t) {
				const n = e[Sf] || null;
				if (!n && !0 === t) throw new Error(`Type ${ve(e)} does not have '\u0275mod' property.`);
				return n;
			}
			function kf(e) {
				const t = {};
				return {
					type: e.type,
					providersResolver: null,
					factory: null,
					hostBindings: e.hostBindings || null,
					hostVars: e.hostVars || 0,
					hostAttrs: e.hostAttrs || null,
					contentQueries: e.contentQueries || null,
					declaredInputs: t,
					inputTransforms: null,
					inputConfig: e.inputs || Rt,
					exportAs: e.exportAs || null,
					standalone: !0 === e.standalone,
					signals: !0 === e.signals,
					selectors: e.selectors || q,
					viewQuery: e.viewQuery || null,
					features: e.features || null,
					setInput: null,
					findHostDirectiveDefs: null,
					hostDirectives: null,
					inputs: Ff(e.inputs, t),
					outputs: Ff(e.outputs),
				};
			}
			function Lf(e) {
				e.features?.forEach((t) => t(e));
			}
			function Oi(e, t) {
				if (!e) return null;
				const n = t ? ze : qE;
				return () => ("function" == typeof e ? e() : e).map((r) => n(r)).filter(WE);
			}
			const De = 0,
				E = 1,
				j = 2,
				oe = 3,
				vt = 4,
				co = 5,
				Ne = 6,
				nr = 7,
				ce = 8,
				rr = 9,
				xn = 10,
				H = 11,
				lo = 12,
				jf = 13,
				or = 14,
				le = 15,
				fo = 16,
				ir = 17,
				Nt = 18,
				ho = 19,
				Hf = 20,
				vn = 21,
				Qt = 22,
				Pi = 23,
				Fi = 24,
				U = 25,
				iu = 1,
				Vf = 2,
				xt = 7,
				sr = 9,
				xe = 11;
			function tt(e) {
				return Array.isArray(e) && "object" == typeof e[iu];
			}
			function Ge(e) {
				return Array.isArray(e) && !0 === e[iu];
			}
			function su(e) {
				return 0 != (4 & e.flags);
			}
			function On(e) {
				return e.componentOffset > -1;
			}
			function Li(e) {
				return 1 == (1 & e.flags);
			}
			function Dt(e) {
				return !!e.template;
			}
			function au(e) {
				return 0 != (512 & e[j]);
			}
			function Pn(e, t) {
				return e.hasOwnProperty(Yt) ? e[Yt] : null;
			}
			let n_ =
					ee.WeakRef ??
					class t_ {
						constructor(t) {
							this.ref = t;
						}
						deref() {
							return this.ref;
						}
					},
				o_ = 0,
				Ot = null,
				ji = !1;
			function Me(e) {
				const t = Ot;
				return (Ot = e), t;
			}
			class Gf {
				constructor() {
					(this.id = o_++),
						(this.ref = (function r_(e) {
							return new n_(e);
						})(this)),
						(this.producers = new Map()),
						(this.consumers = new Map()),
						(this.trackingVersion = 0),
						(this.valueVersion = 0);
				}
				consumerPollProducersForChange() {
					for (const [t, n] of this.producers) {
						const r = n.producerNode.deref();
						if (null != r && n.atTrackingVersion === this.trackingVersion) {
							if (r.producerPollStatus(n.seenValueVersion)) return !0;
						} else this.producers.delete(t), r?.consumers.delete(this.id);
					}
					return !1;
				}
				producerMayHaveChanged() {
					const t = ji;
					ji = !0;
					try {
						for (const [n, r] of this.consumers) {
							const o = r.consumerNode.deref();
							null != o && o.trackingVersion === r.atTrackingVersion
								? o.onConsumerDependencyMayHaveChanged()
								: (this.consumers.delete(n), o?.producers.delete(this.id));
						}
					} finally {
						ji = t;
					}
				}
				producerAccessed() {
					if (ji) throw new Error("");
					if (null === Ot) return;
					let t = Ot.producers.get(this.id);
					void 0 === t
						? ((t = {
								consumerNode: Ot.ref,
								producerNode: this.ref,
								seenValueVersion: this.valueVersion,
								atTrackingVersion: Ot.trackingVersion,
						  }),
						  Ot.producers.set(this.id, t),
						  this.consumers.set(Ot.id, t))
						: ((t.seenValueVersion = this.valueVersion), (t.atTrackingVersion = Ot.trackingVersion));
				}
				get hasProducers() {
					return this.producers.size > 0;
				}
				get producerUpdatesAllowed() {
					return !1 !== Ot?.consumerAllowSignalWrites;
				}
				producerPollStatus(t) {
					return this.valueVersion !== t || (this.onProducerUpdateValueVersion(), this.valueVersion !== t);
				}
			}
			let qf = null;
			const Zf = () => {};
			class u_ extends Gf {
				constructor(t, n, r) {
					super(),
						(this.watch = t),
						(this.schedule = n),
						(this.dirty = !1),
						(this.cleanupFn = Zf),
						(this.registerOnCleanup = (o) => {
							this.cleanupFn = o;
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
					const t = Me(this);
					this.trackingVersion++;
					try {
						this.cleanupFn(), (this.cleanupFn = Zf), this.watch(this.registerOnCleanup);
					} finally {
						Me(t);
					}
				}
				cleanup() {
					this.cleanupFn();
				}
			}
			class c_ {
				constructor(t, n, r) {
					(this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
				}
				isFirstChange() {
					return this.firstChange;
				}
			}
			function Fn() {
				return Yf;
			}
			function Yf(e) {
				return e.type.prototype.ngOnChanges && (e.setInput = d_), l_;
			}
			function l_() {
				const e = Kf(this),
					t = e?.current;
				if (t) {
					const n = e.previous;
					if (n === Rt) e.previous = t;
					else for (let r in t) n[r] = t[r];
					(e.current = null), this.ngOnChanges(t);
				}
			}
			function d_(e, t, n, r) {
				const o = this.declaredInputs[n],
					i =
						Kf(e) ||
						(function f_(e, t) {
							return (e[Qf] = t);
						})(e, { previous: Rt, current: null }),
					s = i.current || (i.current = {}),
					a = i.previous,
					u = a[o];
				(s[o] = new c_(u && u.currentValue, t, a === Rt)), (e[r] = t);
			}
			Fn.ngInherit = !0;
			const Qf = "__ngSimpleChanges__";
			function Kf(e) {
				return e[Qf] || null;
			}
			const Pt = function (e, t, n) {};
			function ne(e) {
				for (; Array.isArray(e); ) e = e[De];
				return e;
			}
			function qe(e, t) {
				return ne(t[e.index]);
			}
			function eh(e, t) {
				return e.data[t];
			}
			function nt(e, t) {
				const n = t[e];
				return tt(n) ? n : n[De];
			}
			function Dn(e, t) {
				return null == t ? null : e[t];
			}
			function th(e) {
				e[ir] = 0;
			}
			function D_(e) {
				1024 & e[j] || ((e[j] |= 1024), rh(e, 1));
			}
			function nh(e) {
				1024 & e[j] && ((e[j] &= -1025), rh(e, -1));
			}
			function rh(e, t) {
				let n = e[oe];
				if (null === n) return;
				n[co] += t;
				let r = n;
				for (n = n[oe]; null !== n && ((1 === t && 1 === r[co]) || (-1 === t && 0 === r[co])); )
					(n[co] += t), (r = n), (n = n[oe]);
			}
			const P = { lFrame: ph(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
			function sh() {
				return P.bindingsEnabled;
			}
			function v() {
				return P.lFrame.lView;
			}
			function G() {
				return P.lFrame.tView;
			}
			function Ae() {
				let e = ah();
				for (; null !== e && 64 === e.type; ) e = e.parent;
				return e;
			}
			function ah() {
				return P.lFrame.currentTNode;
			}
			function Ft(e, t) {
				const n = P.lFrame;
				(n.currentTNode = e), (n.isParent = t);
			}
			function hu() {
				return P.lFrame.isParent;
			}
			function ke() {
				const e = P.lFrame;
				let t = e.bindingRootIndex;
				return -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
			}
			function cr() {
				return P.lFrame.bindingIndex++;
			}
			function O_(e, t) {
				const n = P.lFrame;
				(n.bindingIndex = n.bindingRootIndex = e), gu(t);
			}
			function gu(e) {
				P.lFrame.currentDirectiveIndex = e;
			}
			function dh() {
				return P.lFrame.currentQueryIndex;
			}
			function yu(e) {
				P.lFrame.currentQueryIndex = e;
			}
			function F_(e) {
				const t = e[E];
				return 2 === t.type ? t.declTNode : 1 === t.type ? e[Ne] : null;
			}
			function fh(e, t, n) {
				if (n & A.SkipSelf) {
					let o = t,
						i = e;
					for (
						;
						!((o = o.parent),
						null !== o || n & A.Host || ((o = F_(i)), null === o || ((i = i[or]), 10 & o.type)));

					);
					if (null === o) return !1;
					(t = o), (e = i);
				}
				const r = (P.lFrame = hh());
				return (r.currentTNode = t), (r.lView = e), !0;
			}
			function vu(e) {
				const t = hh(),
					n = e[E];
				(P.lFrame = t),
					(t.currentTNode = n.firstChild),
					(t.lView = e),
					(t.tView = n),
					(t.contextLView = e),
					(t.bindingIndex = n.bindingStartIndex),
					(t.inI18n = !1);
			}
			function hh() {
				const e = P.lFrame,
					t = null === e ? null : e.child;
				return null === t ? ph(e) : t;
			}
			function ph(e) {
				const t = {
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
				return null !== e && (e.child = t), t;
			}
			function gh() {
				const e = P.lFrame;
				return (P.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
			}
			const mh = gh;
			function Du() {
				const e = gh();
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
			function Le() {
				return P.lFrame.selectedIndex;
			}
			function kn(e) {
				P.lFrame.selectedIndex = e;
			}
			function ie() {
				const e = P.lFrame;
				return eh(e.tView, e.selectedIndex);
			}
			let vh = !0;
			function Bi() {
				return vh;
			}
			function Cn(e) {
				vh = e;
			}
			function Ui(e, t) {
				for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
					const i = e.data[n].type.prototype,
						{
							ngAfterContentInit: s,
							ngAfterContentChecked: a,
							ngAfterViewInit: u,
							ngAfterViewChecked: c,
							ngOnDestroy: l,
						} = i;
					s && (e.contentHooks ??= []).push(-n, s),
						a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)),
						u && (e.viewHooks ??= []).push(-n, u),
						c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
						null != l && (e.destroyHooks ??= []).push(n, l);
				}
			}
			function zi(e, t, n) {
				Dh(e, t, 3, n);
			}
			function Gi(e, t, n, r) {
				(3 & e[j]) === n && Dh(e, t, n, r);
			}
			function Cu(e, t) {
				let n = e[j];
				(3 & n) === t && ((n &= 8191), (n += 1), (e[j] = n));
			}
			function Dh(e, t, n, r) {
				const i = r ?? -1,
					s = t.length - 1;
				let a = 0;
				for (let u = void 0 !== r ? 65535 & e[ir] : 0; u < s; u++)
					if ("number" == typeof t[u + 1]) {
						if (((a = t[u]), null != r && a >= r)) break;
					} else
						t[u] < 0 && (e[ir] += 65536),
							(a < i || -1 == i) && (U_(e, n, t, u), (e[ir] = (4294901760 & e[ir]) + u + 2)),
							u++;
			}
			function Ch(e, t) {
				Pt(4, e, t);
				const n = Me(null);
				try {
					t.call(e);
				} finally {
					Me(n), Pt(5, e, t);
				}
			}
			function U_(e, t, n, r) {
				const o = n[r] < 0,
					i = n[r + 1],
					a = e[o ? -n[r] : n[r]];
				o ? e[j] >> 13 < e[ir] >> 16 && (3 & e[j]) === t && ((e[j] += 8192), Ch(a, i)) : Ch(a, i);
			}
			const lr = -1;
			class mo {
				constructor(t, n, r) {
					(this.factory = t), (this.resolving = !1), (this.canSeeViewProviders = n), (this.injectImpl = r);
				}
			}
			function wh(e) {
				return e !== lr;
			}
			function qi(e) {
				return 32767 & e;
			}
			function Wi(e, t) {
				let n = (function W_(e) {
						return e >> 16;
					})(e),
					r = t;
				for (; n > 0; ) (r = r[or]), n--;
				return r;
			}
			let Eu = !0;
			function Zi(e) {
				const t = Eu;
				return (Eu = e), t;
			}
			const Eh = 255,
				_h = 5;
			let Z_ = 0;
			const kt = {};
			function Yi(e, t) {
				const n = bh(e, t);
				if (-1 !== n) return n;
				const r = t[E];
				r.firstCreatePass && ((e.injectorIndex = t.length), _u(r.data, e), _u(t, null), _u(r.blueprint, null));
				const o = bu(e, t),
					i = e.injectorIndex;
				if (wh(o)) {
					const s = qi(o),
						a = Wi(o, t),
						u = a[E].data;
					for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c];
				}
				return (t[i + 8] = o), i;
			}
			function _u(e, t) {
				e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
			}
			function bh(e, t) {
				return -1 === e.injectorIndex ||
					(e.parent && e.parent.injectorIndex === e.injectorIndex) ||
					null === t[e.injectorIndex + 8]
					? -1
					: e.injectorIndex;
			}
			function bu(e, t) {
				if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
				let n = 0,
					r = null,
					o = t;
				for (; null !== o; ) {
					if (((r = xh(o)), null === r)) return lr;
					if ((n++, (o = o[or]), -1 !== r.injectorIndex)) return r.injectorIndex | (n << 16);
				}
				return lr;
			}
			function Su(e, t, n) {
				!(function Y_(e, t, n) {
					let r;
					"string" == typeof n ? (r = n.charCodeAt(0) || 0) : n.hasOwnProperty(ao) && (r = n[ao]),
						null == r && (r = n[ao] = Z_++);
					const o = r & Eh;
					t.data[e + (o >> _h)] |= 1 << o;
				})(e, t, n);
			}
			function Sh(e, t, n) {
				if (n & A.Optional || void 0 !== e) return e;
				Mi();
			}
			function Ih(e, t, n, r) {
				if ((n & A.Optional && void 0 === r && (r = null), !(n & (A.Self | A.Host)))) {
					const o = e[rr],
						i = Be(void 0);
					try {
						return o ? o.get(t, r, n & A.Optional) : Ef(t, r, n & A.Optional);
					} finally {
						Be(i);
					}
				}
				return Sh(r, 0, n);
			}
			function Mh(e, t, n, r = A.Default, o) {
				if (null !== e) {
					if (2048 & t[j] && !(r & A.Self)) {
						const s = (function eb(e, t, n, r, o) {
							let i = e,
								s = t;
							for (; null !== i && null !== s && 2048 & s[j] && !(512 & s[j]); ) {
								const a = Th(i, s, n, r | A.Self, kt);
								if (a !== kt) return a;
								let u = i.parent;
								if (!u) {
									const c = s[Hf];
									if (c) {
										const l = c.get(n, kt, r);
										if (l !== kt) return l;
									}
									(u = xh(s)), (s = s[or]);
								}
								i = u;
							}
							return o;
						})(e, t, n, r, kt);
						if (s !== kt) return s;
					}
					const i = Th(e, t, n, r, kt);
					if (i !== kt) return i;
				}
				return Ih(t, n, r, o);
			}
			function Th(e, t, n, r, o) {
				const i = (function X_(e) {
					if ("string" == typeof e) return e.charCodeAt(0) || 0;
					const t = e.hasOwnProperty(ao) ? e[ao] : void 0;
					return "number" == typeof t ? (t >= 0 ? t & Eh : J_) : t;
				})(n);
				if ("function" == typeof i) {
					if (!fh(t, e, r)) return r & A.Host ? Sh(o, 0, r) : Ih(t, n, r, o);
					try {
						const s = i(r);
						if (null != s || r & A.Optional) return s;
						Mi();
					} finally {
						mh();
					}
				} else if ("number" == typeof i) {
					let s = null,
						a = bh(e, t),
						u = lr,
						c = r & A.Host ? t[le][Ne] : null;
					for (
						(-1 === a || r & A.SkipSelf) &&
						((u = -1 === a ? bu(e, t) : t[a + 8]),
						u !== lr && Rh(r, !1) ? ((s = t[E]), (a = qi(u)), (t = Wi(u, t))) : (a = -1));
						-1 !== a;

					) {
						const l = t[E];
						if (Ah(i, a, l.data)) {
							const d = K_(a, t, n, s, r, c);
							if (d !== kt) return d;
						}
						(u = t[a + 8]),
							u !== lr && Rh(r, t[E].data[a + 8] === c) && Ah(i, a, t)
								? ((s = l), (a = qi(u)), (t = Wi(u, t)))
								: (a = -1);
					}
				}
				return o;
			}
			function K_(e, t, n, r, o, i) {
				const s = t[E],
					a = s.data[e + 8],
					l = Qi(a, s, n, null == r ? On(a) && Eu : r != s && 0 != (3 & a.type), o & A.Host && i === a);
				return null !== l ? Ln(t, s, l, a) : kt;
			}
			function Qi(e, t, n, r, o) {
				const i = e.providerIndexes,
					s = t.data,
					a = 1048575 & i,
					u = e.directiveStart,
					l = i >> 20,
					f = o ? a + l : e.directiveEnd;
				for (let h = r ? a : a + l; h < f; h++) {
					const p = s[h];
					if ((h < u && n === p) || (h >= u && p.type === n)) return h;
				}
				if (o) {
					const h = s[u];
					if (h && Dt(h) && h.type === n) return u;
				}
				return null;
			}
			function Ln(e, t, n, r) {
				let o = e[n];
				const i = t.data;
				if (
					(function z_(e) {
						return e instanceof mo;
					})(o)
				) {
					const s = o;
					s.resolving &&
						(function vE(e, t) {
							const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
							throw new C(-200, `Circular dependency in DI detected for ${e}${n}`);
						})(
							(function Q(e) {
								return "function" == typeof e
									? e.name || e.toString()
									: "object" == typeof e && null != e && "function" == typeof e.type
									? e.type.name || e.type.toString()
									: L(e);
							})(i[n]),
						);
					const a = Zi(s.canSeeViewProviders);
					s.resolving = !0;
					const u = s.injectImpl ? Be(s.injectImpl) : null;
					fh(e, r, A.Default);
					try {
						(o = e[n] = s.factory(void 0, i, e, r)),
							t.firstCreatePass &&
								n >= r.directiveStart &&
								(function B_(e, t, n) {
									const { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
									if (r) {
										const s = Yf(t);
										(n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
									}
									o && (n.preOrderHooks ??= []).push(0 - e, o),
										i &&
											((n.preOrderHooks ??= []).push(e, i),
											(n.preOrderCheckHooks ??= []).push(e, i));
								})(n, i[n], t);
					} finally {
						null !== u && Be(u), Zi(a), (s.resolving = !1), mh();
					}
				}
				return o;
			}
			function Ah(e, t, n) {
				return !!(n[t + (e >> _h)] & (1 << e));
			}
			function Rh(e, t) {
				return !(e & A.Self || (e & A.Host && t));
			}
			class dr {
				constructor(t, n) {
					(this._tNode = t), (this._lView = n);
				}
				get(t, n, r) {
					return Mh(this._tNode, this._lView, t, Ni(r), n);
				}
			}
			function J_() {
				return new dr(Ae(), v());
			}
			function Iu(e) {
				return Qa(e)
					? () => {
							const t = Iu(F(e));
							return t && t();
					  }
					: Pn(e);
			}
			function xh(e) {
				const t = e[E],
					n = t.type;
				return 2 === n ? t.declTNode : 1 === n ? e[Ne] : null;
			}
			const hr = "__parameters__";
			function gr(e, t, n) {
				return Zt(() => {
					const r = (function Mu(e) {
						return function (...n) {
							if (e) {
								const r = e(...n);
								for (const o in r) this[o] = r[o];
							}
						};
					})(t);
					function o(...i) {
						if (this instanceof o) return r.apply(this, i), this;
						const s = new o(...i);
						return (a.annotation = s), a;
						function a(u, c, l) {
							const d = u.hasOwnProperty(hr) ? u[hr] : Object.defineProperty(u, hr, { value: [] })[hr];
							for (; d.length <= l; ) d.push(null);
							return (d[l] = d[l] || []).push(s), u;
						}
					}
					return (
						n && (o.prototype = Object.create(n.prototype)),
						(o.prototype.ngMetadataName = e),
						(o.annotationCls = o),
						o
					);
				});
			}
			function Do(e, t) {
				e.forEach((n) => (Array.isArray(n) ? Do(n, t) : t(n)));
			}
			function Ph(e, t, n) {
				t >= e.length ? e.push(n) : e.splice(t, 0, n);
			}
			function Xi(e, t) {
				return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
			}
			const es = so(gr("Optional"), 8),
				ts = so(gr("SkipSelf"), 4);
			function ss(e) {
				return 128 == (128 & e.flags);
			}
			var We = (() => (
				((We = We || {})[(We.Important = 1)] = "Important"), (We[(We.DashCase = 2)] = "DashCase"), We
			))();
			const Ou = new Map();
			let Ab = 0;
			const Fu = "__ngContext__";
			function Oe(e, t) {
				tt(t)
					? ((e[Fu] = t[ho]),
					  (function Nb(e) {
							Ou.set(e[ho], e);
					  })(t))
					: (e[Fu] = t);
			}
			let ku;
			function Lu(e, t) {
				return ku(e, t);
			}
			function _o(e) {
				const t = e[oe];
				return Ge(t) ? t[oe] : t;
			}
			function tp(e) {
				return rp(e[lo]);
			}
			function np(e) {
				return rp(e[vt]);
			}
			function rp(e) {
				for (; null !== e && !Ge(e); ) e = e[vt];
				return e;
			}
			function Dr(e, t, n, r, o) {
				if (null != r) {
					let i,
						s = !1;
					Ge(r) ? (i = r) : tt(r) && ((s = !0), (r = r[De]));
					const a = ne(r);
					0 === e && null !== n
						? null == o
							? up(t, n, a)
							: jn(t, n, a, o || null, !0)
						: 1 === e && null !== n
						? jn(t, n, a, o || null, !0)
						: 2 === e
						? (function fs(e, t, n) {
								const r = ls(e, t);
								r &&
									(function Qb(e, t, n, r) {
										e.removeChild(t, n, r);
									})(e, r, t, n);
						  })(t, a, s)
						: 3 === e && t.destroyNode(a),
						null != i &&
							(function Jb(e, t, n, r, o) {
								const i = n[xt];
								i !== ne(n) && Dr(t, e, r, i, o);
								for (let a = xe; a < n.length; a++) {
									const u = n[a];
									So(u[E], u, e, t, r, i);
								}
							})(t, e, i, n, o);
				}
			}
			function cs(e, t, n) {
				return e.createElement(t, n);
			}
			function ip(e, t) {
				const n = e[sr],
					r = n.indexOf(t);
				nh(t), n.splice(r, 1);
			}
			function Hu(e, t) {
				if (e.length <= xe) return;
				const n = xe + t,
					r = e[n];
				if (r) {
					const o = r[fo];
					null !== o && o !== e && ip(o, r), t > 0 && (e[n - 1][vt] = r[vt]);
					const i = Xi(e, xe + t);
					!(function Bb(e, t) {
						So(e, t, t[H], 2, null, null), (t[De] = null), (t[Ne] = null);
					})(r[E], r);
					const s = i[Nt];
					null !== s && s.detachView(i[E]), (r[oe] = null), (r[vt] = null), (r[j] &= -129);
				}
				return r;
			}
			function sp(e, t) {
				if (!(256 & t[j])) {
					const n = t[H];
					t[Pi]?.destroy(),
						t[Fi]?.destroy(),
						n.destroyNode && So(e, t, n, 3, null, null),
						(function Gb(e) {
							let t = e[lo];
							if (!t) return Vu(e[E], e);
							for (; t; ) {
								let n = null;
								if (tt(t)) n = t[lo];
								else {
									const r = t[xe];
									r && (n = r);
								}
								if (!n) {
									for (; t && !t[vt] && t !== e; ) tt(t) && Vu(t[E], t), (t = t[oe]);
									null === t && (t = e), tt(t) && Vu(t[E], t), (n = t && t[vt]);
								}
								t = n;
							}
						})(t);
				}
			}
			function Vu(e, t) {
				if (!(256 & t[j])) {
					(t[j] &= -129),
						(t[j] |= 256),
						(function Yb(e, t) {
							let n;
							if (null != e && null != (n = e.destroyHooks))
								for (let r = 0; r < n.length; r += 2) {
									const o = t[n[r]];
									if (!(o instanceof mo)) {
										const i = n[r + 1];
										if (Array.isArray(i))
											for (let s = 0; s < i.length; s += 2) {
												const a = o[i[s]],
													u = i[s + 1];
												Pt(4, a, u);
												try {
													u.call(a);
												} finally {
													Pt(5, a, u);
												}
											}
										else {
											Pt(4, o, i);
											try {
												i.call(o);
											} finally {
												Pt(5, o, i);
											}
										}
									}
								}
						})(e, t),
						(function Zb(e, t) {
							const n = e.cleanup,
								r = t[nr];
							if (null !== n)
								for (let i = 0; i < n.length - 1; i += 2)
									if ("string" == typeof n[i]) {
										const s = n[i + 3];
										s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
									} else n[i].call(r[n[i + 1]]);
							null !== r && (t[nr] = null);
							const o = t[vn];
							if (null !== o) {
								t[vn] = null;
								for (let i = 0; i < o.length; i++) (0, o[i])();
							}
						})(e, t),
						1 === t[E].type && t[H].destroy();
					const n = t[fo];
					if (null !== n && Ge(t[oe])) {
						n !== t[oe] && ip(n, t);
						const r = t[Nt];
						null !== r && r.detachView(e);
					}
					!(function xb(e) {
						Ou.delete(e[ho]);
					})(t);
				}
			}
			function $u(e, t, n) {
				return (function ap(e, t, n) {
					let r = t;
					for (; null !== r && 40 & r.type; ) r = (t = r).parent;
					if (null === r) return n[De];
					{
						const { componentOffset: o } = r;
						if (o > -1) {
							const { encapsulation: i } = e.data[r.directiveStart + o];
							if (i === Je.None || i === Je.Emulated) return null;
						}
						return qe(r, n);
					}
				})(e, t.parent, n);
			}
			function jn(e, t, n, r, o) {
				e.insertBefore(t, n, r, o);
			}
			function up(e, t, n) {
				e.appendChild(t, n);
			}
			function cp(e, t, n, r, o) {
				null !== r ? jn(e, t, n, r, o) : up(e, t, n);
			}
			function ls(e, t) {
				return e.parentNode(t);
			}
			let Bu,
				qu,
				ps,
				fp = function dp(e, t, n) {
					return 40 & e.type ? qe(e, n) : null;
				};
			function ds(e, t, n, r) {
				const o = $u(e, r, t),
					i = t[H],
					a = (function lp(e, t, n) {
						return fp(e, t, n);
					})(r.parent || t[Ne], r, t);
				if (null != o)
					if (Array.isArray(n)) for (let u = 0; u < n.length; u++) cp(i, o, n[u], a, !1);
					else cp(i, o, n, a, !1);
				void 0 !== Bu && Bu(i, r, t, n, o);
			}
			function bo(e, t) {
				if (null !== t) {
					const n = t.type;
					if (3 & n) return qe(t, e);
					if (4 & n) return Uu(-1, e[t.index]);
					if (8 & n) {
						const r = t.child;
						if (null !== r) return bo(e, r);
						{
							const o = e[t.index];
							return Ge(o) ? Uu(-1, o) : ne(o);
						}
					}
					if (32 & n) return Lu(t, e)() || ne(e[t.index]);
					{
						const r = pp(e, t);
						return null !== r ? (Array.isArray(r) ? r[0] : bo(_o(e[le]), r)) : bo(e, t.next);
					}
				}
				return null;
			}
			function pp(e, t) {
				return null !== t ? e[le][Ne].projection[t.projection] : null;
			}
			function Uu(e, t) {
				const n = xe + e + 1;
				if (n < t.length) {
					const r = t[n],
						o = r[E].firstChild;
					if (null !== o) return bo(r, o);
				}
				return t[xt];
			}
			function zu(e, t, n, r, o, i, s) {
				for (; null != n; ) {
					const a = r[n.index],
						u = n.type;
					if ((s && 0 === t && (a && Oe(ne(a), r), (n.flags |= 2)), 32 != (32 & n.flags)))
						if (8 & u) zu(e, t, n.child, r, o, i, !1), Dr(t, e, o, a, i);
						else if (32 & u) {
							const c = Lu(n, r);
							let l;
							for (; (l = c()); ) Dr(t, e, o, l, i);
							Dr(t, e, o, a, i);
						} else 16 & u ? mp(e, t, r, n, o, i) : Dr(t, e, o, a, i);
					n = s ? n.projectionNext : n.next;
				}
			}
			function So(e, t, n, r, o, i) {
				zu(n, r, e.firstChild, t, o, i, !1);
			}
			function mp(e, t, n, r, o, i) {
				const s = n[le],
					u = s[Ne].projection[r.projection];
				if (Array.isArray(u)) for (let c = 0; c < u.length; c++) Dr(t, e, o, u[c], i);
				else {
					let c = u;
					const l = s[oe];
					ss(r) && (c.flags |= 128), zu(e, t, c, l, o, i, !0);
				}
			}
			function yp(e, t, n) {
				"" === n ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
			}
			function vp(e, t, n) {
				const { mergedAttrs: r, classes: o, styles: i } = n;
				null !== r && ou(e, t, r),
					null !== o && yp(e, t, o),
					null !== i &&
						(function tS(e, t, n) {
							e.setAttribute(t, "style", n);
						})(e, t, i);
			}
			function wp(e) {
				return (
					(function Wu() {
						if (void 0 === ps && ((ps = null), ee.trustedTypes))
							try {
								ps = ee.trustedTypes.createPolicy("angular#unsafe-bypass", {
									createHTML: (e) => e,
									createScript: (e) => e,
									createScriptURL: (e) => e,
								});
							} catch {}
						return ps;
					})()?.createScriptURL(e) || e
				);
			}
			class Ep {
				constructor(t) {
					this.changingThisBreaksApplicationSecurity = t;
				}
				toString() {
					return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${yf})`;
				}
			}
			function wn(e) {
				return e instanceof Ep ? e.changingThisBreaksApplicationSecurity : e;
			}
			function Mo(e, t) {
				const n = (function dS(e) {
					return (e instanceof Ep && e.getTypeName()) || null;
				})(e);
				if (null != n && n !== t) {
					if ("ResourceURL" === n && "URL" === t) return !0;
					throw new Error(`Required a safe ${t}, got a ${n} (see ${yf})`);
				}
				return n === t;
			}
			const gS = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
			var pe = (() => (
				((pe = pe || {})[(pe.NONE = 0)] = "NONE"),
				(pe[(pe.HTML = 1)] = "HTML"),
				(pe[(pe.STYLE = 2)] = "STYLE"),
				(pe[(pe.SCRIPT = 3)] = "SCRIPT"),
				(pe[(pe.URL = 4)] = "URL"),
				(pe[(pe.RESOURCE_URL = 5)] = "RESOURCE_URL"),
				pe
			))();
			function ms(e) {
				const t = Ao();
				return t
					? t.sanitize(pe.URL, e) || ""
					: Mo(e, "URL")
					? wn(e)
					: (function Zu(e) {
							return (e = String(e)).match(gS) ? e : "unsafe:" + e;
					  })(L(e));
			}
			function Ap(e) {
				const t = Ao();
				if (t) return wp(t.sanitize(pe.RESOURCE_URL, e) || "");
				if (Mo(e, "ResourceURL")) return wp(wn(e));
				throw new C(904, !1);
			}
			function Ao() {
				const e = v();
				return e && e[xn].sanitizer;
			}
			class S {
				constructor(t, n) {
					(this._desc = t),
						(this.ngMetadataName = "InjectionToken"),
						(this.ɵprov = void 0),
						"number" == typeof n
							? (this.__NG_ELEMENT_ID__ = n)
							: void 0 !== n &&
							  (this.ɵprov = T({ token: this, providedIn: n.providedIn || "root", factory: n.factory }));
				}
				get multi() {
					return this;
				}
				toString() {
					return `InjectionToken ${this._desc}`;
				}
			}
			const Ro = new S("ENVIRONMENT_INITIALIZER"),
				Np = new S("INJECTOR", -1),
				xp = new S("INJECTOR_DEF_TYPES");
			class Op {
				get(t, n = io) {
					if (n === io) {
						const r = new Error(`NullInjectorError: No provider for ${ve(t)}!`);
						throw ((r.name = "NullInjectorError"), r);
					}
					return n;
				}
			}
			function TS(...e) {
				return { ɵproviders: Pp(0, e), ɵfromNgModule: !0 };
			}
			function Pp(e, ...t) {
				const n = [],
					r = new Set();
				let o;
				return (
					Do(t, (i) => {
						const s = i;
						Ju(s, n, [], r) && ((o ||= []), o.push(s));
					}),
					void 0 !== o && Fp(o, n),
					n
				);
			}
			function Fp(e, t) {
				for (let n = 0; n < e.length; n++) {
					const { providers: o } = e[n];
					ec(o, (i) => {
						t.push(i);
					});
				}
			}
			function Ju(e, t, n, r) {
				if (!(e = F(e))) return !1;
				let o = null,
					i = Df(e);
				const s = !i && Z(e);
				if (i || s) {
					if (s && !s.standalone) return !1;
					o = e;
				} else {
					const u = e.ngModule;
					if (((i = Df(u)), !i)) return !1;
					o = u;
				}
				const a = r.has(o);
				if (s) {
					if (a) return !1;
					if ((r.add(o), s.dependencies)) {
						const u = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
						for (const c of u) Ju(c, t, n, r);
					}
				} else {
					if (!i) return !1;
					{
						if (null != i.imports && !a) {
							let c;
							r.add(o);
							try {
								Do(i.imports, (l) => {
									Ju(l, t, n, r) && ((c ||= []), c.push(l));
								});
							} finally {
							}
							void 0 !== c && Fp(c, t);
						}
						if (!a) {
							const c = Pn(o) || (() => new o());
							t.push(
								{ provide: o, useFactory: c, deps: q },
								{ provide: xp, useValue: o, multi: !0 },
								{ provide: Ro, useValue: () => I(o), multi: !0 },
							);
						}
						const u = i.providers;
						null == u ||
							a ||
							ec(u, (l) => {
								t.push(l);
							});
					}
				}
				return o !== e && void 0 !== e.providers;
			}
			function ec(e, t) {
				for (let n of e) Ka(n) && (n = n.ɵproviders), Array.isArray(n) ? ec(n, t) : t(n);
			}
			const AS = K({ provide: String, useValue: K });
			function tc(e) {
				return null !== e && "object" == typeof e && AS in e;
			}
			function Hn(e) {
				return "function" == typeof e;
			}
			const nc = new S("Set Injector scope."),
				ys = {},
				NS = {};
			let rc;
			function vs() {
				return void 0 === rc && (rc = new Op()), rc;
			}
			class Lt {}
			class oc extends Lt {
				get destroyed() {
					return this._destroyed;
				}
				constructor(t, n, r, o) {
					super(),
						(this.parent = n),
						(this.source = r),
						(this.scopes = o),
						(this.records = new Map()),
						(this._ngOnDestroyHooks = new Set()),
						(this._onDestroyHooks = []),
						(this._destroyed = !1),
						sc(t, (s) => this.processProvider(s)),
						this.records.set(Np, wr(void 0, this)),
						o.has("environment") && this.records.set(Lt, wr(void 0, this));
					const i = this.records.get(nc);
					null != i && "string" == typeof i.value && this.scopes.add(i.value),
						(this.injectorDefTypes = new Set(this.get(xp.multi, q, A.Self)));
				}
				destroy() {
					this.assertNotDestroyed(), (this._destroyed = !0);
					try {
						for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
						const t = this._onDestroyHooks;
						this._onDestroyHooks = [];
						for (const n of t) n();
					} finally {
						this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear();
					}
				}
				onDestroy(t) {
					return this.assertNotDestroyed(), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t);
				}
				runInContext(t) {
					this.assertNotDestroyed();
					const n = gn(this),
						r = Be(void 0);
					try {
						return t();
					} finally {
						gn(n), Be(r);
					}
				}
				get(t, n = io, r = A.Default) {
					if ((this.assertNotDestroyed(), t.hasOwnProperty(If))) return t[If](this);
					r = Ni(r);
					const o = gn(this),
						i = Be(void 0);
					try {
						if (!(r & A.SkipSelf)) {
							let a = this.records.get(t);
							if (void 0 === a) {
								const u =
									(function kS(e) {
										return "function" == typeof e || ("object" == typeof e && e instanceof S);
									})(t) && Ti(t);
								(a = u && this.injectableDefInScope(u) ? wr(ic(t), ys) : null), this.records.set(t, a);
							}
							if (null != a) return this.hydrate(t, a);
						}
						return (r & A.Self ? vs() : this.parent).get(t, (n = r & A.Optional && n === io ? null : n));
					} catch (s) {
						if ("NullInjectorError" === s.name) {
							if (((s[Ri] = s[Ri] || []).unshift(ve(t)), o)) throw s;
							return (function xE(e, t, n, r) {
								const o = e[Ri];
								throw (
									(t[_f] && o.unshift(t[_f]),
									(e.message = (function OE(e, t, n, r = null) {
										e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
										let o = ve(t);
										if (Array.isArray(t)) o = t.map(ve).join(" -> ");
										else if ("object" == typeof t) {
											let i = [];
											for (let s in t)
												if (t.hasOwnProperty(s)) {
													let a = t[s];
													i.push(
														s + ":" + ("string" == typeof a ? JSON.stringify(a) : ve(a)),
													);
												}
											o = `{${i.join(", ")}}`;
										}
										return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(ME, "\n  ")}`;
									})("\n" + e.message, o, n, r)),
									(e.ngTokenPath = o),
									(e[Ri] = null),
									e)
								);
							})(s, t, "R3InjectorError", this.source);
						}
						throw s;
					} finally {
						Be(i), gn(o);
					}
				}
				resolveInjectorInitializers() {
					const t = gn(this),
						n = Be(void 0);
					try {
						const r = this.get(Ro.multi, q, A.Self);
						for (const o of r) o();
					} finally {
						gn(t), Be(n);
					}
				}
				toString() {
					const t = [],
						n = this.records;
					for (const r of n.keys()) t.push(ve(r));
					return `R3Injector[${t.join(", ")}]`;
				}
				assertNotDestroyed() {
					if (this._destroyed) throw new C(205, !1);
				}
				processProvider(t) {
					let n = Hn((t = F(t))) ? t : F(t && t.provide);
					const r = (function OS(e) {
						return tc(e)
							? wr(void 0, e.useValue)
							: wr(
									(function jp(e, t, n) {
										let r;
										if (Hn(e)) {
											const o = F(e);
											return Pn(o) || ic(o);
										}
										if (tc(e)) r = () => F(e.useValue);
										else if (
											(function Lp(e) {
												return !(!e || !e.useFactory);
											})(e)
										)
											r = () => e.useFactory(...tu(e.deps || []));
										else if (
											(function kp(e) {
												return !(!e || !e.useExisting);
											})(e)
										)
											r = () => I(F(e.useExisting));
										else {
											const o = F(e && (e.useClass || e.provide));
											if (
												!(function PS(e) {
													return !!e.deps;
												})(e)
											)
												return Pn(o) || ic(o);
											r = () => new o(...tu(e.deps));
										}
										return r;
									})(e),
									ys,
							  );
					})(t);
					if (Hn(t) || !0 !== t.multi) this.records.get(n);
					else {
						let o = this.records.get(n);
						o || ((o = wr(void 0, ys, !0)), (o.factory = () => tu(o.multi)), this.records.set(n, o)),
							(n = t),
							o.multi.push(t);
					}
					this.records.set(n, r);
				}
				hydrate(t, n) {
					return (
						n.value === ys && ((n.value = NS), (n.value = n.factory())),
						"object" == typeof n.value &&
							n.value &&
							(function FS(e) {
								return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy;
							})(n.value) &&
							this._ngOnDestroyHooks.add(n.value),
						n.value
					);
				}
				injectableDefInScope(t) {
					if (!t.providedIn) return !1;
					const n = F(t.providedIn);
					return "string" == typeof n ? "any" === n || this.scopes.has(n) : this.injectorDefTypes.has(n);
				}
				removeOnDestroy(t) {
					const n = this._onDestroyHooks.indexOf(t);
					-1 !== n && this._onDestroyHooks.splice(n, 1);
				}
			}
			function ic(e) {
				const t = Ti(e),
					n = null !== t ? t.factory : Pn(e);
				if (null !== n) return n;
				if (e instanceof S) throw new C(204, !1);
				if (e instanceof Function)
					return (function xS(e) {
						const t = e.length;
						if (t > 0)
							throw (
								((function Co(e, t) {
									const n = [];
									for (let r = 0; r < e; r++) n.push(t);
									return n;
								})(t, "?"),
								new C(204, !1))
							);
						const n = (function bE(e) {
							return (e && (e[Ai] || e[Cf])) || null;
						})(e);
						return null !== n ? () => n.factory(e) : () => new e();
					})(e);
				throw new C(204, !1);
			}
			function wr(e, t, n = !1) {
				return { factory: e, value: t, multi: n ? [] : void 0 };
			}
			function sc(e, t) {
				for (const n of e) Array.isArray(n) ? sc(n, t) : n && Ka(n) ? sc(n.ɵproviders, t) : t(n);
			}
			const Ds = new S("AppId", { providedIn: "root", factory: () => LS }),
				LS = "ng",
				Hp = new S("Platform Initializer"),
				Vn = new S("Platform ID", { providedIn: "platform", factory: () => "unknown" }),
				Vp = new S("CSP nonce", {
					providedIn: "root",
					factory: () =>
						(function Io() {
							if (void 0 !== qu) return qu;
							if (typeof document < "u") return document;
							throw new C(210, !1);
						})()
							.body?.querySelector("[ngCspNonce]")
							?.getAttribute("ngCspNonce") || null,
				});
			let Bp = (e, t) => null;
			function Up(e, t) {
				return Bp(e, t);
			}
			class qS {}
			class qp {}
			class ZS {
				resolveComponentFactory(t) {
					throw (function WS(e) {
						const t = Error(`No component factory found for ${ve(e)}.`);
						return (t.ngComponent = e), t;
					})(t);
				}
			}
			let bs = (() => {
				class e {}
				return (e.NULL = new ZS()), e;
			})();
			function YS() {
				return Er(Ae(), v());
			}
			function Er(e, t) {
				return new En(qe(e, t));
			}
			let En = (() => {
				class e {
					constructor(n) {
						this.nativeElement = n;
					}
				}
				return (e.__NG_ELEMENT_ID__ = YS), e;
			})();
			function QS(e) {
				return e instanceof En ? e.nativeElement : e;
			}
			class Zp {}
			let Ss = (() => {
					class e {
						constructor() {
							this.destroyNode = null;
						}
					}
					return (
						(e.__NG_ELEMENT_ID__ = () =>
							(function KS() {
								const e = v(),
									n = nt(Ae().index, e);
								return (tt(n) ? n : e)[H];
							})()),
						e
					);
				})(),
				XS = (() => {
					class e {}
					return (e.ɵprov = T({ token: e, providedIn: "root", factory: () => null })), e;
				})();
			class Is {
				constructor(t) {
					(this.full = t),
						(this.major = t.split(".")[0]),
						(this.minor = t.split(".")[1]),
						(this.patch = t.split(".").slice(2).join("."));
				}
			}
			const JS = new Is("16.1.5"),
				yc = {};
			function Po(e) {
				for (; e; ) {
					e[j] |= 64;
					const t = _o(e);
					if (au(e) && !t) return e;
					e = t;
				}
				return null;
			}
			function vc(e) {
				return e.ngOriginalError;
			}
			class $n {
				constructor() {
					this._console = console;
				}
				handleError(t) {
					const n = this._findOriginalError(t);
					this._console.error("ERROR", t), n && this._console.error("ORIGINAL ERROR", n);
				}
				_findOriginalError(t) {
					let n = t && vc(t);
					for (; n && vc(n); ) n = vc(n);
					return n || null;
				}
			}
			const Kp = new S("", { providedIn: "root", factory: () => !1 });
			function en(e) {
				return e instanceof Function ? e() : e;
			}
			class ng extends Gf {
				constructor() {
					super(...arguments), (this.consumerAllowSignalWrites = !1), (this._lView = null);
				}
				set lView(t) {
					this._lView = t;
				}
				onConsumerDependencyMayHaveChanged() {
					Po(this._lView);
				}
				onProducerUpdateValueVersion() {}
				get hasReadASignal() {
					return this.hasProducers;
				}
				runInContext(t, n, r) {
					const o = Me(this);
					this.trackingVersion++;
					try {
						t(n, r);
					} finally {
						Me(o);
					}
				}
				destroy() {
					this.trackingVersion++;
				}
			}
			let Ts = null;
			function rg() {
				return (Ts ??= new ng()), Ts;
			}
			function og(e, t) {
				return e[t] ?? rg();
			}
			function ig(e, t) {
				const n = rg();
				n.hasReadASignal && ((e[t] = Ts), (n.lView = e), (Ts = new ng()));
			}
			const V = {};
			function Ct(e) {
				sg(G(), v(), Le() + e, !1);
			}
			function sg(e, t, n, r) {
				if (!r)
					if (3 == (3 & t[j])) {
						const i = e.preOrderCheckHooks;
						null !== i && zi(t, i, n);
					} else {
						const i = e.preOrderHooks;
						null !== i && Gi(t, i, 0, n);
					}
				kn(n);
			}
			function lg(e, t = null, n = null, r) {
				const o = dg(e, t, n, r);
				return o.resolveInjectorInitializers(), o;
			}
			function dg(e, t = null, n = null, r, o = new Set()) {
				const i = [n || q, TS(e)];
				return (r = r || ("object" == typeof e ? void 0 : ve(e))), new oc(i, t || vs(), r || null, o);
			}
			let tn = (() => {
				class e {
					static create(n, r) {
						if (Array.isArray(n)) return lg({ name: "" }, r, n, "");
						{
							const o = n.name ?? "";
							return lg({ name: o }, n.parent, n.providers, o);
						}
					}
				}
				return (
					(e.THROW_IF_NOT_FOUND = io),
					(e.NULL = new Op()),
					(e.ɵprov = T({ token: e, providedIn: "any", factory: () => I(Np) })),
					(e.__NG_ELEMENT_ID__ = -1),
					e
				);
			})();
			function M(e, t = A.Default) {
				const n = v();
				return null === n ? I(e, t) : Mh(Ae(), n, F(e), t);
			}
			function As(e, t, n, r, o, i, s, a, u, c, l) {
				const d = t.blueprint.slice();
				return (
					(d[De] = o),
					(d[j] = 140 | r),
					(null !== c || (e && 2048 & e[j])) && (d[j] |= 2048),
					th(d),
					(d[oe] = d[or] = e),
					(d[ce] = n),
					(d[xn] = s || (e && e[xn])),
					(d[H] = a || (e && e[H])),
					(d[rr] = u || (e && e[rr]) || null),
					(d[Ne] = i),
					(d[ho] = (function Rb() {
						return Ab++;
					})()),
					(d[Qt] = l),
					(d[Hf] = c),
					(d[le] = 2 == t.type ? e[le] : d),
					d
				);
			}
			function br(e, t, n, r, o) {
				let i = e.data[t];
				if (null === i)
					(i = (function Dc(e, t, n, r, o) {
						const i = ah(),
							s = hu(),
							u = (e.data[t] = (function CI(e, t, n, r, o, i) {
								let s = t ? t.injectorIndex : -1,
									a = 0;
								return (
									(function ur() {
										return null !== P.skipHydrationRootTNode;
									})() && (a |= 128),
									{
										type: n,
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
										value: o,
										attrs: i,
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
										parent: t,
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
							})(0, s ? i : i && i.parent, n, t, r, o));
						return (
							null === e.firstChild && (e.firstChild = u),
							null !== i &&
								(s
									? null == i.child && null !== u.parent && (i.child = u)
									: null === i.next && ((i.next = u), (u.prev = i))),
							u
						);
					})(e, t, n, r, o)),
						(function x_() {
							return P.lFrame.inI18n;
						})() && (i.flags |= 32);
				else if (64 & i.type) {
					(i.type = n), (i.value = r), (i.attrs = o);
					const s = (function go() {
						const e = P.lFrame,
							t = e.currentTNode;
						return e.isParent ? t : t.parent;
					})();
					i.injectorIndex = null === s ? -1 : s.injectorIndex;
				}
				return Ft(i, !0), i;
			}
			function Fo(e, t, n, r) {
				if (0 === n) return -1;
				const o = t.length;
				for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
				return o;
			}
			function hg(e, t, n, r, o) {
				const i = og(t, Pi),
					s = Le(),
					a = 2 & r;
				try {
					if ((kn(-1), a && t.length > U && sg(e, t, U, !1), Pt(a ? 2 : 0, o), a)) i.runInContext(n, r, o);
					else {
						const c = Me(null);
						try {
							n(r, o);
						} finally {
							Me(c);
						}
					}
				} finally {
					a && null === t[Pi] && ig(t, Pi), kn(s), Pt(a ? 3 : 1, o);
				}
			}
			function Cc(e, t, n) {
				if (su(t)) {
					const r = Me(null);
					try {
						const i = t.directiveEnd;
						for (let s = t.directiveStart; s < i; s++) {
							const a = e.data[s];
							a.contentQueries && a.contentQueries(1, n[s], s);
						}
					} finally {
						Me(r);
					}
				}
			}
			function wc(e, t, n) {
				sh() &&
					((function MI(e, t, n, r) {
						const o = n.directiveStart,
							i = n.directiveEnd;
						On(n) &&
							(function PI(e, t, n) {
								const r = qe(t, e),
									o = pg(n);
								let s = 16;
								n.signals ? (s = 4096) : n.onPush && (s = 64);
								const a = Rs(
									e,
									As(
										e,
										o,
										null,
										s,
										r,
										t,
										null,
										e[xn].rendererFactory.createRenderer(r, n),
										null,
										null,
										null,
									),
								);
								e[t.index] = a;
							})(t, n, e.data[o + n.componentOffset]),
							e.firstCreatePass || Yi(n, t),
							Oe(r, t);
						const s = n.initialInputs;
						for (let a = o; a < i; a++) {
							const u = e.data[a],
								c = Ln(t, e, a, n);
							Oe(c, t),
								null !== s && FI(0, a - o, c, u, 0, s),
								Dt(u) && (nt(n.index, t)[ce] = Ln(t, e, a, n));
						}
					})(e, t, n, qe(n, t)),
					64 == (64 & n.flags) && Dg(e, t, n));
			}
			function Ec(e, t, n = qe) {
				const r = t.localNames;
				if (null !== r) {
					let o = t.index + 1;
					for (let i = 0; i < r.length; i += 2) {
						const s = r[i + 1],
							a = -1 === s ? n(t, e) : e[s];
						e[o++] = a;
					}
				}
			}
			function pg(e) {
				const t = e.tView;
				return null === t || t.incompleteFirstPass
					? (e.tView = _c(
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
					: t;
			}
			function _c(e, t, n, r, o, i, s, a, u, c, l) {
				const d = U + r,
					f = d + o,
					h = (function pI(e, t) {
						const n = [];
						for (let r = 0; r < t; r++) n.push(r < e ? null : V);
						return n;
					})(d, f),
					p = "function" == typeof c ? c() : c;
				return (h[E] = {
					type: e,
					blueprint: h,
					template: n,
					queries: null,
					viewQuery: a,
					declTNode: t,
					data: h.slice().fill(null, d),
					bindingStartIndex: d,
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
					directiveRegistry: "function" == typeof i ? i() : i,
					pipeRegistry: "function" == typeof s ? s() : s,
					firstChild: null,
					schemas: u,
					consts: p,
					incompleteFirstPass: !1,
					ssrId: l,
				});
			}
			let gg = (e) => null;
			function mg(e, t, n, r) {
				for (let o in e)
					if (e.hasOwnProperty(o)) {
						n = null === n ? {} : n;
						const i = e[o];
						null === r ? yg(n, t, o, i) : r.hasOwnProperty(o) && yg(n, t, r[o], i);
					}
				return n;
			}
			function yg(e, t, n, r) {
				e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
			}
			function ot(e, t, n, r, o, i, s, a) {
				const u = qe(t, n);
				let l,
					c = t.inputs;
				!a && null != c && (l = c[r])
					? (Tc(e, n, l, r, o),
					  On(t) &&
							(function _I(e, t) {
								const n = nt(t, e);
								16 & n[j] || (n[j] |= 64);
							})(n, t.index))
					: 3 & t.type &&
					  ((r = (function EI(e) {
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
					  (o = null != s ? s(o, t.value || "", r) : o),
					  i.setProperty(u, r, o));
			}
			function bc(e, t, n, r) {
				if (sh()) {
					const o = null === r ? null : { "": -1 },
						i = (function AI(e, t) {
							const n = e.directiveRegistry;
							let r = null,
								o = null;
							if (n)
								for (let i = 0; i < n.length; i++) {
									const s = n[i];
									if (Of(t, s.selectors, !1))
										if ((r || (r = []), Dt(s)))
											if (null !== s.findHostDirectiveDefs) {
												const a = [];
												(o = o || new Map()),
													s.findHostDirectiveDefs(s, a, o),
													r.unshift(...a, s),
													Sc(e, t, a.length);
											} else r.unshift(s), Sc(e, t, 0);
										else (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
								}
							return null === r ? null : [r, o];
						})(e, n);
					let s, a;
					null === i ? (s = a = null) : ([s, a] = i),
						null !== s && vg(e, t, n, s, o, a),
						o &&
							(function RI(e, t, n) {
								if (t) {
									const r = (e.localNames = []);
									for (let o = 0; o < t.length; o += 2) {
										const i = n[t[o + 1]];
										if (null == i) throw new C(-301, !1);
										r.push(t[o], i);
									}
								}
							})(n, r, o);
				}
				n.mergedAttrs = uo(n.mergedAttrs, n.attrs);
			}
			function vg(e, t, n, r, o, i) {
				for (let c = 0; c < r.length; c++) Su(Yi(n, t), e, r[c].type);
				!(function xI(e, t, n) {
					(e.flags |= 1), (e.directiveStart = t), (e.directiveEnd = t + n), (e.providerIndexes = t);
				})(n, e.data.length, r.length);
				for (let c = 0; c < r.length; c++) {
					const l = r[c];
					l.providersResolver && l.providersResolver(l);
				}
				let s = !1,
					a = !1,
					u = Fo(e, t, r.length, null);
				for (let c = 0; c < r.length; c++) {
					const l = r[c];
					(n.mergedAttrs = uo(n.mergedAttrs, l.hostAttrs)),
						OI(e, n, t, u, l),
						NI(u, l, o),
						null !== l.contentQueries && (n.flags |= 4),
						(null !== l.hostBindings || null !== l.hostAttrs || 0 !== l.hostVars) && (n.flags |= 64);
					const d = l.type.prototype;
					!s &&
						(d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
						((e.preOrderHooks ??= []).push(n.index), (s = !0)),
						!a && (d.ngOnChanges || d.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
						u++;
				}
				!(function wI(e, t, n) {
					const o = t.directiveEnd,
						i = e.data,
						s = t.attrs,
						a = [];
					let u = null,
						c = null;
					for (let l = t.directiveStart; l < o; l++) {
						const d = i[l],
							f = n ? n.get(d) : null,
							p = f ? f.outputs : null;
						(u = mg(d.inputs, l, u, f ? f.inputs : null)), (c = mg(d.outputs, l, c, p));
						const g = null === u || null === s || xf(t) ? null : kI(u, l, s);
						a.push(g);
					}
					null !== u &&
						(u.hasOwnProperty("class") && (t.flags |= 8), u.hasOwnProperty("style") && (t.flags |= 16)),
						(t.initialInputs = a),
						(t.inputs = u),
						(t.outputs = c);
				})(e, n, i);
			}
			function Dg(e, t, n) {
				const r = n.directiveStart,
					o = n.directiveEnd,
					i = n.index,
					s = (function P_() {
						return P.lFrame.currentDirectiveIndex;
					})();
				try {
					kn(i);
					for (let a = r; a < o; a++) {
						const u = e.data[a],
							c = t[a];
						gu(a), (null !== u.hostBindings || 0 !== u.hostVars || null !== u.hostAttrs) && TI(u, c);
					}
				} finally {
					kn(-1), gu(s);
				}
			}
			function TI(e, t) {
				null !== e.hostBindings && e.hostBindings(1, t);
			}
			function Sc(e, t, n) {
				(t.componentOffset = n), (e.components ??= []).push(t.index);
			}
			function NI(e, t, n) {
				if (n) {
					if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
					Dt(t) && (n[""] = e);
				}
			}
			function OI(e, t, n, r, o) {
				e.data[r] = o;
				const i = o.factory || (o.factory = Pn(o.type)),
					s = new mo(i, Dt(o), M);
				(e.blueprint[r] = s),
					(n[r] = s),
					(function SI(e, t, n, r, o) {
						const i = o.hostBindings;
						if (i) {
							let s = e.hostBindingOpCodes;
							null === s && (s = e.hostBindingOpCodes = []);
							const a = ~t.index;
							(function II(e) {
								let t = e.length;
								for (; t > 0; ) {
									const n = e[--t];
									if ("number" == typeof n && n < 0) return n;
								}
								return 0;
							})(s) != a && s.push(a),
								s.push(n, r, i);
						}
					})(e, t, r, Fo(e, n, o.hostVars, V), o);
			}
			function jt(e, t, n, r, o, i) {
				const s = qe(e, t);
				!(function Ic(e, t, n, r, o, i, s) {
					if (null == i) e.removeAttribute(t, o, n);
					else {
						const a = null == s ? L(i) : s(i, r || "", o);
						e.setAttribute(t, o, a, n);
					}
				})(t[H], s, i, e.value, n, r, o);
			}
			function FI(e, t, n, r, o, i) {
				const s = i[t];
				if (null !== s) for (let a = 0; a < s.length; ) Cg(r, n, s[a++], s[a++], s[a++]);
			}
			function Cg(e, t, n, r, o) {
				const i = Me(null);
				try {
					const s = e.inputTransforms;
					null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)),
						null !== e.setInput ? e.setInput(t, o, n, r) : (t[r] = o);
				} finally {
					Me(i);
				}
			}
			function kI(e, t, n) {
				let r = null,
					o = 0;
				for (; o < n.length; ) {
					const i = n[o];
					if (0 !== i)
						if (5 !== i) {
							if ("number" == typeof i) break;
							if (e.hasOwnProperty(i)) {
								null === r && (r = []);
								const s = e[i];
								for (let a = 0; a < s.length; a += 2)
									if (s[a] === t) {
										r.push(i, s[a + 1], n[o + 1]);
										break;
									}
							}
							o += 2;
						} else o += 2;
					else o += 4;
				}
				return r;
			}
			function wg(e, t, n, r) {
				return [e, !0, !1, t, null, 0, r, n, null, null, null];
			}
			function Eg(e, t) {
				const n = e.contentQueries;
				if (null !== n)
					for (let r = 0; r < n.length; r += 2) {
						const i = n[r + 1];
						if (-1 !== i) {
							const s = e.data[i];
							yu(n[r]), s.contentQueries(2, t[i], i);
						}
					}
			}
			function Rs(e, t) {
				return e[lo] ? (e[jf][vt] = t) : (e[lo] = t), (e[jf] = t), t;
			}
			function Mc(e, t, n) {
				yu(0);
				const r = Me(null);
				try {
					t(e, n);
				} finally {
					Me(r);
				}
			}
			function _g(e) {
				return e[nr] || (e[nr] = []);
			}
			function bg(e) {
				return e.cleanup || (e.cleanup = []);
			}
			function Ig(e, t) {
				const n = e[rr],
					r = n ? n.get($n, null) : null;
				r && r.handleError(t);
			}
			function Tc(e, t, n, r, o) {
				for (let i = 0; i < n.length; ) {
					const s = n[i++],
						a = n[i++];
					Cg(e.data[s], t[s], r, a, o);
				}
			}
			function nn(e, t, n) {
				const r = (function $i(e, t) {
					return ne(t[e]);
				})(t, e);
				!(function op(e, t, n) {
					e.setValue(t, n);
				})(e[H], r, n);
			}
			function LI(e, t) {
				const n = nt(t, e),
					r = n[E];
				!(function jI(e, t) {
					for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
				})(r, n);
				const o = n[De];
				null !== o && null === n[Qt] && (n[Qt] = Up(o, n[rr])), Ac(r, n, n[ce]);
			}
			function Ac(e, t, n) {
				vu(t);
				try {
					const r = e.viewQuery;
					null !== r && Mc(1, r, n);
					const o = e.template;
					null !== o && hg(e, t, o, 1, n),
						e.firstCreatePass && (e.firstCreatePass = !1),
						e.staticContentQueries && Eg(e, t),
						e.staticViewQueries && Mc(2, e.viewQuery, n);
					const i = e.components;
					null !== i &&
						(function HI(e, t) {
							for (let n = 0; n < t.length; n++) LI(e, t[n]);
						})(t, i);
				} catch (r) {
					throw (e.firstCreatePass && ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)), r);
				} finally {
					(t[j] &= -5), Du();
				}
			}
			let Mg = (() => {
				class e {
					constructor() {
						(this.all = new Set()), (this.queue = new Map());
					}
					create(n, r, o) {
						const i = typeof Zone > "u" ? null : Zone.current,
							s = new u_(
								n,
								(c) => {
									this.all.has(c) && this.queue.set(c, i);
								},
								o,
							);
						let a;
						this.all.add(s), s.notify();
						const u = () => {
							s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
						};
						return (a = r?.onDestroy(u)), { destroy: u };
					}
					flush() {
						if (0 !== this.queue.size)
							for (const [n, r] of this.queue) this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
					}
					get isQueueEmpty() {
						return 0 === this.queue.size;
					}
				}
				return (e.ɵprov = T({ token: e, providedIn: "root", factory: () => new e() })), e;
			})();
			function Ns(e, t, n) {
				let r = n ? e.styles : null,
					o = n ? e.classes : null,
					i = 0;
				if (null !== t)
					for (let s = 0; s < t.length; s++) {
						const a = t[s];
						"number" == typeof a
							? (i = a)
							: 1 == i
							? (o = Za(o, a))
							: 2 == i && (r = Za(r, a + ": " + t[++s] + ";"));
					}
				n ? (e.styles = r) : (e.stylesWithoutHost = r), n ? (e.classes = o) : (e.classesWithoutHost = o);
			}
			function ko(e, t, n, r, o = !1) {
				for (; null !== n; ) {
					const i = t[n.index];
					if ((null !== i && r.push(ne(i)), Ge(i))) {
						for (let a = xe; a < i.length; a++) {
							const u = i[a],
								c = u[E].firstChild;
							null !== c && ko(u[E], u, c, r);
						}
						i[xt] !== i[De] && r.push(i[xt]);
					}
					const s = n.type;
					if (8 & s) ko(e, t, n.child, r);
					else if (32 & s) {
						const a = Lu(n, t);
						let u;
						for (; (u = a()); ) r.push(u);
					} else if (16 & s) {
						const a = pp(t, n);
						if (Array.isArray(a)) r.push(...a);
						else {
							const u = _o(t[le]);
							ko(u[E], u, a, r, !0);
						}
					}
					n = o ? n.projectionNext : n.next;
				}
				return r;
			}
			function xs(e, t, n, r = !0) {
				const o = t[xn].rendererFactory;
				o.begin && o.begin();
				try {
					Tg(e, t, e.template, n);
				} catch (s) {
					throw (r && Ig(t, s), s);
				} finally {
					o.end && o.end(), t[xn].effectManager?.flush();
				}
			}
			function Tg(e, t, n, r) {
				const o = t[j];
				if (256 != (256 & o)) {
					t[xn].effectManager?.flush(), vu(t);
					try {
						th(t),
							(function ch(e) {
								return (P.lFrame.bindingIndex = e);
							})(e.bindingStartIndex),
							null !== n && hg(e, t, n, 2, r);
						const s = 3 == (3 & o);
						if (s) {
							const c = e.preOrderCheckHooks;
							null !== c && zi(t, c, null);
						} else {
							const c = e.preOrderHooks;
							null !== c && Gi(t, c, 0, null), Cu(t, 0);
						}
						if (
							((function zI(e) {
								for (let t = tp(e); null !== t; t = np(t)) {
									if (!t[Vf]) continue;
									const n = t[sr];
									for (let r = 0; r < n.length; r++) {
										D_(n[r]);
									}
								}
							})(t),
							Ag(t, 2),
							null !== e.contentQueries && Eg(e, t),
							s)
						) {
							const c = e.contentCheckHooks;
							null !== c && zi(t, c);
						} else {
							const c = e.contentHooks;
							null !== c && Gi(t, c, 1), Cu(t, 1);
						}
						!(function hI(e, t) {
							const n = e.hostBindingOpCodes;
							if (null === n) return;
							const r = og(t, Fi);
							try {
								for (let o = 0; o < n.length; o++) {
									const i = n[o];
									if (i < 0) kn(~i);
									else {
										const s = i,
											a = n[++o],
											u = n[++o];
										O_(a, s), r.runInContext(u, 2, t[s]);
									}
								}
							} finally {
								null === t[Fi] && ig(t, Fi), kn(-1);
							}
						})(e, t);
						const a = e.components;
						null !== a && Ng(t, a, 0);
						const u = e.viewQuery;
						if ((null !== u && Mc(2, u, r), s)) {
							const c = e.viewCheckHooks;
							null !== c && zi(t, c);
						} else {
							const c = e.viewHooks;
							null !== c && Gi(t, c, 2), Cu(t, 2);
						}
						!0 === e.firstUpdatePass && (e.firstUpdatePass = !1), (t[j] &= -73), nh(t);
					} finally {
						Du();
					}
				}
			}
			function Ag(e, t) {
				for (let n = tp(e); null !== n; n = np(n)) for (let r = xe; r < n.length; r++) Rg(n[r], t);
			}
			function GI(e, t, n) {
				Rg(nt(t, e), n);
			}
			function Rg(e, t) {
				if (
					!(function y_(e) {
						return 128 == (128 & e[j]);
					})(e)
				)
					return;
				const n = e[E];
				if ((80 & e[j] && 0 === t) || 1024 & e[j] || 2 === t) Tg(n, e, n.template, e[ce]);
				else if (e[co] > 0) {
					Ag(e, 1);
					const o = e[E].components;
					null !== o && Ng(e, o, 1);
				}
			}
			function Ng(e, t, n) {
				for (let r = 0; r < t.length; r++) GI(e, t[r], n);
			}
			class Lo {
				get rootNodes() {
					const t = this._lView,
						n = t[E];
					return ko(n, t, n.firstChild, []);
				}
				constructor(t, n) {
					(this._lView = t),
						(this._cdRefInjectingView = n),
						(this._appRef = null),
						(this._attachedToViewContainer = !1);
				}
				get context() {
					return this._lView[ce];
				}
				set context(t) {
					this._lView[ce] = t;
				}
				get destroyed() {
					return 256 == (256 & this._lView[j]);
				}
				destroy() {
					if (this._appRef) this._appRef.detachView(this);
					else if (this._attachedToViewContainer) {
						const t = this._lView[oe];
						if (Ge(t)) {
							const n = t[8],
								r = n ? n.indexOf(this) : -1;
							r > -1 && (Hu(t, r), Xi(n, r));
						}
						this._attachedToViewContainer = !1;
					}
					sp(this._lView[E], this._lView);
				}
				onDestroy(t) {
					!(function oh(e, t) {
						if (256 == (256 & e[j])) throw new C(911, !1);
						null === e[vn] && (e[vn] = []), e[vn].push(t);
					})(this._lView, t);
				}
				markForCheck() {
					Po(this._cdRefInjectingView || this._lView);
				}
				detach() {
					this._lView[j] &= -129;
				}
				reattach() {
					this._lView[j] |= 128;
				}
				detectChanges() {
					xs(this._lView[E], this._lView, this.context);
				}
				checkNoChanges() {}
				attachToViewContainerRef() {
					if (this._appRef) throw new C(902, !1);
					this._attachedToViewContainer = !0;
				}
				detachFromAppRef() {
					(this._appRef = null),
						(function zb(e, t) {
							So(e, t, t[H], 2, null, null);
						})(this._lView[E], this._lView);
				}
				attachToAppRef(t) {
					if (this._attachedToViewContainer) throw new C(902, !1);
					this._appRef = t;
				}
			}
			class qI extends Lo {
				constructor(t) {
					super(t), (this._view = t);
				}
				detectChanges() {
					const t = this._view;
					xs(t[E], t, t[ce], !1);
				}
				checkNoChanges() {}
				get context() {
					return null;
				}
			}
			class xg extends bs {
				constructor(t) {
					super(), (this.ngModule = t);
				}
				resolveComponentFactory(t) {
					const n = Z(t);
					return new jo(n, this.ngModule);
				}
			}
			function Og(e) {
				const t = [];
				for (let n in e) e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
				return t;
			}
			class ZI {
				constructor(t, n) {
					(this.injector = t), (this.parentInjector = n);
				}
				get(t, n, r) {
					r = Ni(r);
					const o = this.injector.get(t, yc, r);
					return o !== yc || n === yc ? o : this.parentInjector.get(t, n, r);
				}
			}
			class jo extends qp {
				get inputs() {
					const t = this.componentDef,
						n = t.inputTransforms,
						r = Og(t.inputs);
					if (null !== n) for (const o of r) n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
					return r;
				}
				get outputs() {
					return Og(this.componentDef.outputs);
				}
				constructor(t, n) {
					super(),
						(this.componentDef = t),
						(this.ngModule = n),
						(this.componentType = t.type),
						(this.selector = (function UE(e) {
							return e.map(BE).join(",");
						})(t.selectors)),
						(this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : []),
						(this.isBoundToModule = !!n);
				}
				create(t, n, r, o) {
					let i = (o = o || this.ngModule) instanceof Lt ? o : o?.injector;
					i &&
						null !== this.componentDef.getStandaloneInjector &&
						(i = this.componentDef.getStandaloneInjector(i) || i);
					const s = i ? new ZI(t, i) : t,
						a = s.get(Zp, null);
					if (null === a) throw new C(407, !1);
					const l = { rendererFactory: a, sanitizer: s.get(XS, null), effectManager: s.get(Mg, null) },
						d = a.createRenderer(null, this.componentDef),
						f = this.componentDef.selectors[0][0] || "div",
						h = r
							? (function gI(e, t, n, r) {
									const i = r.get(Kp, !1) || n === Je.ShadowDom,
										s = e.selectRootElement(t, i);
									return (
										(function mI(e) {
											gg(e);
										})(s),
										s
									);
							  })(d, r, this.componentDef.encapsulation, s)
							: cs(
									d,
									f,
									(function WI(e) {
										const t = e.toLowerCase();
										return "svg" === t ? "svg" : "math" === t ? "math" : null;
									})(f),
							  ),
						y = this.componentDef.signals ? 4608 : this.componentDef.onPush ? 576 : 528,
						D = _c(0, null, null, 1, 0, null, null, null, null, null, null),
						m = As(null, D, null, y, null, null, l, d, s, null, null);
					let _, N;
					vu(m);
					try {
						const k = this.componentDef;
						let _e,
							ka = null;
						k.findHostDirectiveDefs
							? ((_e = []), (ka = new Map()), k.findHostDirectiveDefs(k, _e, ka), _e.push(k))
							: (_e = [k]);
						const R1 = (function QI(e, t) {
								const n = e[E],
									r = U;
								return (e[r] = t), br(n, r, 2, "#host", null);
							})(m, h),
							N1 = (function KI(e, t, n, r, o, i, s) {
								const a = o[E];
								!(function XI(e, t, n, r) {
									for (const o of e) t.mergedAttrs = uo(t.mergedAttrs, o.hostAttrs);
									null !== t.mergedAttrs && (Ns(t, t.mergedAttrs, !0), null !== n && vp(r, n, t));
								})(r, e, t, s);
								let u = null;
								null !== t && (u = Up(t, o[rr]));
								const c = i.rendererFactory.createRenderer(t, n);
								let l = 16;
								n.signals ? (l = 4096) : n.onPush && (l = 64);
								const d = As(o, pg(n), null, l, o[e.index], e, i, c, null, null, u);
								return a.firstCreatePass && Sc(a, e, r.length - 1), Rs(o, d), (o[e.index] = d);
							})(R1, h, k, _e, m, l, d);
						(N = eh(D, U)),
							h &&
								(function eM(e, t, n, r) {
									if (r) ou(e, n, ["ng-version", JS.full]);
									else {
										const { attrs: o, classes: i } = (function zE(e) {
											const t = [],
												n = [];
											let r = 1,
												o = 2;
											for (; r < e.length; ) {
												let i = e[r];
												if ("string" == typeof i)
													2 === o ? "" !== i && t.push(i, e[++r]) : 8 === o && n.push(i);
												else {
													if (!yt(o)) break;
													o = i;
												}
												r++;
											}
											return { attrs: t, classes: n };
										})(t.selectors[0]);
										o && ou(e, n, o), i && i.length > 0 && yp(e, n, i.join(" "));
									}
								})(d, k, h, r),
							void 0 !== n &&
								(function tM(e, t, n) {
									const r = (e.projection = []);
									for (let o = 0; o < t.length; o++) {
										const i = n[o];
										r.push(null != i ? Array.from(i) : null);
									}
								})(N, this.ngContentSelectors, n),
							(_ = (function JI(e, t, n, r, o, i) {
								const s = Ae(),
									a = o[E],
									u = qe(s, o);
								vg(a, o, s, n, null, r);
								for (let l = 0; l < n.length; l++) Oe(Ln(o, a, s.directiveStart + l, s), o);
								Dg(a, o, s), u && Oe(u, o);
								const c = Ln(o, a, s.directiveStart + s.componentOffset, s);
								if (((e[ce] = o[ce] = c), null !== i)) for (const l of i) l(c, t);
								return Cc(a, s, e), c;
							})(N1, k, _e, ka, m, [nM])),
							Ac(D, m, null);
					} finally {
						Du();
					}
					return new YI(this.componentType, _, Er(N, m), m, N);
				}
			}
			class YI extends qS {
				constructor(t, n, r, o, i) {
					super(),
						(this.location = r),
						(this._rootLView = o),
						(this._tNode = i),
						(this.previousInputValues = null),
						(this.instance = n),
						(this.hostView = this.changeDetectorRef = new qI(o)),
						(this.componentType = t);
				}
				setInput(t, n) {
					const r = this._tNode.inputs;
					let o;
					if (null !== r && (o = r[t])) {
						if (
							((this.previousInputValues ??= new Map()),
							this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n))
						)
							return;
						const i = this._rootLView;
						Tc(i[E], i, o, t, n), this.previousInputValues.set(t, n), Po(nt(this._tNode.index, i));
					}
				}
				get injector() {
					return new dr(this._tNode, this._rootLView);
				}
				destroy() {
					this.hostView.destroy();
				}
				onDestroy(t) {
					this.hostView.onDestroy(t);
				}
			}
			function nM() {
				const e = Ae();
				Ui(v()[E], e);
			}
			function Hg(e) {
				const t = e.inputConfig,
					n = {};
				for (const r in t)
					if (t.hasOwnProperty(r)) {
						const o = t[r];
						Array.isArray(o) && o[2] && (n[r] = o[2]);
					}
				e.inputTransforms = n;
			}
			function Ps(e) {
				return (
					!!(function Rc(e) {
						return null !== e && ("function" == typeof e || "object" == typeof e);
					})(e) &&
					(Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
				);
			}
			function Ht(e, t, n) {
				return (e[t] = n);
			}
			function Pe(e, t, n) {
				return !Object.is(e[t], n) && ((e[t] = n), !0);
			}
			function Nc(e, t, n, r) {
				const o = v();
				return Pe(o, cr(), t) && (G(), jt(ie(), o, e, t, n, r)), Nc;
			}
			function Ir(e, t, n, r) {
				return Pe(e, cr(), n) ? t + L(n) + r : V;
			}
			function Lc(e, t, n, r, o, i, s, a) {
				const u = v(),
					c = G(),
					l = e + U,
					d = c.firstCreatePass
						? (function NM(e, t, n, r, o, i, s, a, u) {
								const c = t.consts,
									l = br(t, e, 4, s || null, Dn(c, a));
								bc(t, n, l, Dn(c, u)), Ui(t, l);
								const d = (l.tView = _c(
									2,
									l,
									r,
									o,
									i,
									t.directiveRegistry,
									t.pipeRegistry,
									null,
									t.schemas,
									c,
									null,
								));
								return (
									null !== t.queries &&
										(t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
									l
								);
						  })(l, c, u, t, n, r, o, i, s)
						: c.data[l];
				Ft(d, !1);
				const f = Xg(c, u, d, e);
				Bi() && ds(c, u, f, d),
					Oe(f, u),
					Rs(u, (u[l] = wg(f, u, f, d))),
					Li(d) && wc(c, u, d),
					null != s && Ec(u, d, a);
			}
			let Xg = function Jg(e, t, n, r) {
				return Cn(!0), t[H].createComment("");
			};
			function Pr(e, t, n) {
				const r = v();
				return Pe(r, cr(), t) && ot(G(), ie(), r, e, t, r[H], n, !1), Pr;
			}
			function jc(e, t, n, r, o) {
				const s = o ? "class" : "style";
				Tc(e, n, t.inputs[s], s, r);
			}
			function Ye(e, t, n, r) {
				const o = v(),
					i = G(),
					s = U + e,
					a = o[H],
					u = i.firstCreatePass
						? (function kM(e, t, n, r, o, i) {
								const s = t.consts,
									u = br(t, e, 2, r, Dn(s, o));
								return (
									bc(t, n, u, Dn(s, i)),
									null !== u.attrs && Ns(u, u.attrs, !1),
									null !== u.mergedAttrs && Ns(u, u.mergedAttrs, !0),
									null !== t.queries && t.queries.elementStart(t, u),
									u
								);
						  })(s, i, o, t, n, r)
						: i.data[s],
					c = em(i, o, u, a, t, e);
				o[s] = c;
				const l = Li(u);
				return (
					Ft(u, !0),
					vp(a, c, u),
					32 != (32 & u.flags) && Bi() && ds(i, o, c, u),
					0 ===
						(function w_() {
							return P.lFrame.elementDepthCount;
						})() && Oe(c, o),
					(function E_() {
						P.lFrame.elementDepthCount++;
					})(),
					l && (wc(i, o, u), Cc(i, u, o)),
					null !== r && Ec(o, u),
					Ye
				);
			}
			function Qe() {
				let e = Ae();
				hu()
					? (function pu() {
							P.lFrame.isParent = !1;
					  })()
					: ((e = e.parent), Ft(e, !1));
				const t = e;
				(function b_(e) {
					return P.skipHydrationRootTNode === e;
				})(t) &&
					(function T_() {
						P.skipHydrationRootTNode = null;
					})(),
					(function __() {
						P.lFrame.elementDepthCount--;
					})();
				const n = G();
				return (
					n.firstCreatePass && (Ui(n, e), su(e) && n.queries.elementEnd(e)),
					null != t.classesWithoutHost &&
						(function G_(e) {
							return 0 != (8 & e.flags);
						})(t) &&
						jc(n, t, v(), t.classesWithoutHost, !0),
					null != t.stylesWithoutHost &&
						(function q_(e) {
							return 0 != (16 & e.flags);
						})(t) &&
						jc(n, t, v(), t.stylesWithoutHost, !1),
					Qe
				);
			}
			function rn(e, t, n, r) {
				return Ye(e, t, n, r), Qe(), rn;
			}
			let em = (e, t, n, r, o, i) => (
				Cn(!0),
				cs(
					r,
					o,
					(function yh() {
						return P.lFrame.currentNamespace;
					})(),
				)
			);
			function Hs(e) {
				return !!e && "function" == typeof e.then;
			}
			function rm(e) {
				return !!e && "function" == typeof e.subscribe;
			}
			function $c(e, t, n, r) {
				const o = v(),
					i = G(),
					s = Ae();
				return (
					(function im(e, t, n, r, o, i, s) {
						const a = Li(r),
							c = e.firstCreatePass && bg(e),
							l = t[ce],
							d = _g(t);
						let f = !0;
						if (3 & r.type || s) {
							const g = qe(r, t),
								y = s ? s(g) : g,
								D = d.length,
								m = s ? (N) => s(ne(N[r.index])) : r.index;
							let _ = null;
							if (
								(!s &&
									a &&
									(_ = (function UM(e, t, n, r) {
										const o = e.cleanup;
										if (null != o)
											for (let i = 0; i < o.length - 1; i += 2) {
												const s = o[i];
												if (s === n && o[i + 1] === r) {
													const a = t[nr],
														u = o[i + 2];
													return a.length > u ? a[u] : null;
												}
												"string" == typeof s && (i += 2);
											}
										return null;
									})(e, t, o, r.index)),
								null !== _)
							)
								((_.__ngLastListenerFn__ || _).__ngNextListenerFn__ = i),
									(_.__ngLastListenerFn__ = i),
									(f = !1);
							else {
								i = am(r, t, l, i, !1);
								const N = n.listen(y, o, i);
								d.push(i, N), c && c.push(o, m, D, D + 1);
							}
						} else i = am(r, t, l, i, !1);
						const h = r.outputs;
						let p;
						if (f && null !== h && (p = h[o])) {
							const g = p.length;
							if (g)
								for (let y = 0; y < g; y += 2) {
									const k = t[p[y]][p[y + 1]].subscribe(i),
										_e = d.length;
									d.push(i, k), c && c.push(o, r.index, _e, -(_e + 1));
								}
						}
					})(i, o, o[H], s, e, t, r),
					$c
				);
			}
			function sm(e, t, n, r) {
				try {
					return Pt(6, t, n), !1 !== n(r);
				} catch (o) {
					return Ig(e, o), !1;
				} finally {
					Pt(7, t, n);
				}
			}
			function am(e, t, n, r, o) {
				return function i(s) {
					if (s === Function) return r;
					Po(e.componentOffset > -1 ? nt(e.index, t) : t);
					let u = sm(t, n, r, s),
						c = i.__ngNextListenerFn__;
					for (; c; ) (u = sm(t, n, c, s) && u), (c = c.__ngNextListenerFn__);
					return o && !1 === u && s.preventDefault(), u;
				};
			}
			function um(e = 1) {
				return (function k_(e) {
					return (P.lFrame.contextLView = (function L_(e, t) {
						for (; e > 0; ) (t = t[or]), e--;
						return t;
					})(e, P.lFrame.contextLView))[ce];
				})(e);
			}
			function Vs(e, t, n) {
				return Bc(e, "", t, "", n), Vs;
			}
			function Bc(e, t, n, r, o) {
				const i = v(),
					s = Ir(i, t, n, r);
				return s !== V && ot(G(), ie(), i, e, s, i[H], o, !1), Bc;
			}
			function on(e, t = "") {
				const n = v(),
					r = G(),
					o = e + U,
					i = r.firstCreatePass ? br(r, o, 1, t, null) : r.data[o],
					s = xm(r, n, i, t, e);
				(n[o] = s), Bi() && ds(r, n, s, i), Ft(i, !1);
			}
			let xm = (e, t, n, r, o) => (
				Cn(!0),
				(function us(e, t) {
					return e.createText(t);
				})(t[H], r)
			);
			function kr(e) {
				return Wc("", e, ""), kr;
			}
			function Wc(e, t, n) {
				const r = v(),
					o = Ir(r, e, t, n);
				return o !== V && nn(r, Le(), o), Wc;
			}
			const jr = "en-US";
			let ey = jr;
			class Hr {}
			class Iy {}
			class el extends Hr {
				constructor(t, n, r) {
					super(),
						(this._parent = n),
						(this._bootstrapComponents = []),
						(this.destroyCbs = []),
						(this.componentFactoryResolver = new xg(this));
					const o = et(t);
					(this._bootstrapComponents = en(o.bootstrap)),
						(this._r3Injector = dg(
							t,
							n,
							[
								{ provide: Hr, useValue: this },
								{ provide: bs, useValue: this.componentFactoryResolver },
								...r,
							],
							ve(t),
							new Set(["environment"]),
						)),
						this._r3Injector.resolveInjectorInitializers(),
						(this.instance = this._r3Injector.get(t));
				}
				get injector() {
					return this._r3Injector;
				}
				destroy() {
					const t = this._r3Injector;
					!t.destroyed && t.destroy(), this.destroyCbs.forEach((n) => n()), (this.destroyCbs = null);
				}
				onDestroy(t) {
					this.destroyCbs.push(t);
				}
			}
			class tl extends Iy {
				constructor(t) {
					super(), (this.moduleType = t);
				}
				create(t) {
					return new el(this.moduleType, t, []);
				}
			}
			class My extends Hr {
				constructor(t) {
					super(), (this.componentFactoryResolver = new xg(this)), (this.instance = null);
					const n = new oc(
						[
							...t.providers,
							{ provide: Hr, useValue: this },
							{ provide: bs, useValue: this.componentFactoryResolver },
						],
						t.parent || vs(),
						t.debugName,
						new Set(["environment"]),
					);
					(this.injector = n), t.runEnvironmentInitializers && n.resolveInjectorInitializers();
				}
				destroy() {
					this.injector.destroy();
				}
				onDestroy(t) {
					this.injector.onDestroy(t);
				}
			}
			function nl(e, t, n = null) {
				return new My({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0 }).injector;
			}
			let HT = (() => {
				class e {
					constructor(n) {
						(this._injector = n), (this.cachedInjectors = new Map());
					}
					getOrCreateStandaloneInjector(n) {
						if (!n.standalone) return null;
						if (!this.cachedInjectors.has(n)) {
							const r = Pp(0, n.type),
								o = r.length > 0 ? nl([r], this._injector, `Standalone[${n.type.name}]`) : null;
							this.cachedInjectors.set(n, o);
						}
						return this.cachedInjectors.get(n);
					}
					ngOnDestroy() {
						try {
							for (const n of this.cachedInjectors.values()) null !== n && n.destroy();
						} finally {
							this.cachedInjectors.clear();
						}
					}
				}
				return (e.ɵprov = T({ token: e, providedIn: "environment", factory: () => new e(I(Lt)) })), e;
			})();
			function Ty(e) {
				e.getStandaloneInjector = (t) => t.get(HT).getOrCreateStandaloneInjector(e);
			}
			function Fy(e, t, n, r) {
				return (function Ly(e, t, n, r, o, i) {
					const s = t + n;
					return Pe(e, s, o) ? Ht(e, s + 1, i ? r.call(i, o) : r(o)) : Yo(e, s + 1);
				})(v(), ke(), e, t, n, r);
			}
			function ky(e, t, n, r, o) {
				return (function jy(e, t, n, r, o, i, s) {
					const a = t + n;
					return (function Bn(e, t, n, r) {
						const o = Pe(e, t, n);
						return Pe(e, t + 1, r) || o;
					})(e, a, o, i)
						? Ht(e, a + 2, s ? r.call(s, o, i) : r(o, i))
						: Yo(e, a + 2);
				})(v(), ke(), e, t, n, r, o);
			}
			function Yo(e, t) {
				const n = e[t];
				return n === V ? void 0 : n;
			}
			function ol(e) {
				return (t) => {
					setTimeout(e, void 0, t);
				};
			}
			const He = class cA extends Gt {
				constructor(t = !1) {
					super(), (this.__isAsync = t);
				}
				emit(t) {
					super.next(t);
				}
				subscribe(t, n, r) {
					let o = t,
						i = n || (() => null),
						s = r;
					if (t && "object" == typeof t) {
						const u = t;
						(o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u));
					}
					this.__isAsync && ((i = ol(i)), o && (o = ol(o)), s && (s = ol(s)));
					const a = super.subscribe({ next: o, error: i, complete: s });
					return t instanceof at && t.add(a), a;
				}
			};
			function lA() {
				return this._results[Symbol.iterator]();
			}
			class il {
				get changes() {
					return this._changes || (this._changes = new He());
				}
				constructor(t = !1) {
					(this._emitDistinctChangesOnly = t),
						(this.dirty = !0),
						(this._results = []),
						(this._changesDetected = !1),
						(this._changes = null),
						(this.length = 0),
						(this.first = void 0),
						(this.last = void 0);
					const n = il.prototype;
					n[Symbol.iterator] || (n[Symbol.iterator] = lA);
				}
				get(t) {
					return this._results[t];
				}
				map(t) {
					return this._results.map(t);
				}
				filter(t) {
					return this._results.filter(t);
				}
				find(t) {
					return this._results.find(t);
				}
				reduce(t, n) {
					return this._results.reduce(t, n);
				}
				forEach(t) {
					this._results.forEach(t);
				}
				some(t) {
					return this._results.some(t);
				}
				toArray() {
					return this._results.slice();
				}
				toString() {
					return this._results.toString();
				}
				reset(t, n) {
					const r = this;
					r.dirty = !1;
					const o = (function lt(e) {
						return e.flat(Number.POSITIVE_INFINITY);
					})(t);
					(this._changesDetected = !(function rb(e, t, n) {
						if (e.length !== t.length) return !1;
						for (let r = 0; r < e.length; r++) {
							let o = e[r],
								i = t[r];
							if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
						}
						return !0;
					})(r._results, o, n)) &&
						((r._results = o), (r.length = o.length), (r.last = o[this.length - 1]), (r.first = o[0]));
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
			let sn = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = hA), e;
			})();
			const dA = sn,
				fA = class extends dA {
					constructor(t, n, r) {
						super(), (this._declarationLView = t), (this._declarationTContainer = n), (this.elementRef = r);
					}
					get ssrId() {
						return this._declarationTContainer.tView?.ssrId || null;
					}
					createEmbeddedView(t, n) {
						return this.createEmbeddedViewImpl(t, n, null);
					}
					createEmbeddedViewImpl(t, n, r) {
						const s = this._declarationTContainer.tView,
							a = As(
								this._declarationLView,
								s,
								t,
								4096 & this._declarationLView[j] ? 4096 : 16,
								null,
								s.declTNode,
								null,
								null,
								null,
								n || null,
								r || null,
							);
						a[fo] = this._declarationLView[this._declarationTContainer.index];
						const c = this._declarationLView[Nt];
						return null !== c && (a[Nt] = c.createEmbeddedView(s)), Ac(s, a, t), new Lo(a);
					}
				};
			function hA() {
				return Ws(Ae(), v());
			}
			function Ws(e, t) {
				return 4 & e.type ? new fA(t, e, Er(e, t)) : null;
			}
			let _t = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = CA), e;
			})();
			function CA() {
				return Wy(Ae(), v());
			}
			const wA = _t,
				Gy = class extends wA {
					constructor(t, n, r) {
						super(), (this._lContainer = t), (this._hostTNode = n), (this._hostLView = r);
					}
					get element() {
						return Er(this._hostTNode, this._hostLView);
					}
					get injector() {
						return new dr(this._hostTNode, this._hostLView);
					}
					get parentInjector() {
						const t = bu(this._hostTNode, this._hostLView);
						if (wh(t)) {
							const n = Wi(t, this._hostLView),
								r = qi(t);
							return new dr(n[E].data[r + 8], n);
						}
						return new dr(null, this._hostLView);
					}
					clear() {
						for (; this.length > 0; ) this.remove(this.length - 1);
					}
					get(t) {
						const n = qy(this._lContainer);
						return (null !== n && n[t]) || null;
					}
					get length() {
						return this._lContainer.length - xe;
					}
					createEmbeddedView(t, n, r) {
						let o, i;
						"number" == typeof r ? (o = r) : null != r && ((o = r.index), (i = r.injector));
						const a = t.createEmbeddedViewImpl(n || {}, i, null);
						return this.insertImpl(a, o, false), a;
					}
					createComponent(t, n, r, o, i) {
						const s =
							t &&
							!(function vo(e) {
								return "function" == typeof e;
							})(t);
						let a;
						if (s) a = n;
						else {
							const g = n || {};
							(a = g.index),
								(r = g.injector),
								(o = g.projectableNodes),
								(i = g.environmentInjector || g.ngModuleRef);
						}
						const u = s ? t : new jo(Z(t)),
							c = r || this.parentInjector;
						if (!i && null == u.ngModule) {
							const y = (s ? c : this.parentInjector).get(Lt, null);
							y && (i = y);
						}
						Z(u.componentType ?? {});
						const h = u.create(c, o, null, i);
						return this.insertImpl(h.hostView, a, false), h;
					}
					insert(t, n) {
						return this.insertImpl(t, n, !1);
					}
					insertImpl(t, n, r) {
						const o = t._lView,
							i = o[E];
						if (
							(function v_(e) {
								return Ge(e[oe]);
							})(o)
						) {
							const u = this.indexOf(t);
							if (-1 !== u) this.detach(u);
							else {
								const c = o[oe],
									l = new Gy(c, c[Ne], c[oe]);
								l.detach(l.indexOf(t));
							}
						}
						const s = this._adjustIndex(n),
							a = this._lContainer;
						if (
							((function qb(e, t, n, r) {
								const o = xe + r,
									i = n.length;
								r > 0 && (n[o - 1][vt] = t),
									r < i - xe ? ((t[vt] = n[o]), Ph(n, xe + r, t)) : (n.push(t), (t[vt] = null)),
									(t[oe] = n);
								const s = t[fo];
								null !== s &&
									n !== s &&
									(function Wb(e, t) {
										const n = e[sr];
										t[le] !== t[oe][oe][le] && (e[Vf] = !0), null === n ? (e[sr] = [t]) : n.push(t);
									})(s, t);
								const a = t[Nt];
								null !== a && a.insertView(e), (t[j] |= 128);
							})(i, o, a, s),
							!r)
						) {
							const u = Uu(s, a),
								c = o[H],
								l = ls(c, a[xt]);
							null !== l &&
								(function Ub(e, t, n, r, o, i) {
									(r[De] = o), (r[Ne] = t), So(e, r, n, 1, o, i);
								})(i, a[Ne], c, o, l, u);
						}
						return t.attachToViewContainerRef(), Ph(al(a), s, t), t;
					}
					move(t, n) {
						return this.insert(t, n);
					}
					indexOf(t) {
						const n = qy(this._lContainer);
						return null !== n ? n.indexOf(t) : -1;
					}
					remove(t) {
						const n = this._adjustIndex(t, -1),
							r = Hu(this._lContainer, n);
						r && (Xi(al(this._lContainer), n), sp(r[E], r));
					}
					detach(t) {
						const n = this._adjustIndex(t, -1),
							r = Hu(this._lContainer, n);
						return r && null != Xi(al(this._lContainer), n) ? new Lo(r) : null;
					}
					_adjustIndex(t, n = 0) {
						return t ?? this.length + n;
					}
				};
			function qy(e) {
				return e[8];
			}
			function al(e) {
				return e[8] || (e[8] = []);
			}
			function Wy(e, t) {
				let n;
				const r = t[e.index];
				return (
					Ge(r) ? (n = r) : ((n = wg(r, t, null, e)), (t[e.index] = n), Rs(t, n)),
					Zy(n, t, e, r),
					new Gy(n, e, t)
				);
			}
			let Zy = function Yy(e, t, n, r) {
				if (e[xt]) return;
				let o;
				(o =
					8 & n.type
						? ne(r)
						: (function EA(e, t) {
								const n = e[H],
									r = n.createComment(""),
									o = qe(t, e);
								return (
									jn(
										n,
										ls(n, o),
										r,
										(function Kb(e, t) {
											return e.nextSibling(t);
										})(n, o),
										!1,
									),
									r
								);
						  })(t, n)),
					(e[xt] = o);
			};
			class ul {
				constructor(t) {
					(this.queryList = t), (this.matches = null);
				}
				clone() {
					return new ul(this.queryList);
				}
				setDirty() {
					this.queryList.setDirty();
				}
			}
			class cl {
				constructor(t = []) {
					this.queries = t;
				}
				createEmbeddedView(t) {
					const n = t.queries;
					if (null !== n) {
						const r = null !== t.contentQueries ? t.contentQueries[0] : n.length,
							o = [];
						for (let i = 0; i < r; i++) {
							const s = n.getByIndex(i);
							o.push(this.queries[s.indexInDeclarationView].clone());
						}
						return new cl(o);
					}
					return null;
				}
				insertView(t) {
					this.dirtyQueriesWithMatches(t);
				}
				detachView(t) {
					this.dirtyQueriesWithMatches(t);
				}
				dirtyQueriesWithMatches(t) {
					for (let n = 0; n < this.queries.length; n++)
						null !== rv(t, n).matches && this.queries[n].setDirty();
				}
			}
			class Qy {
				constructor(t, n, r = null) {
					(this.predicate = t), (this.flags = n), (this.read = r);
				}
			}
			class ll {
				constructor(t = []) {
					this.queries = t;
				}
				elementStart(t, n) {
					for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n);
				}
				elementEnd(t) {
					for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t);
				}
				embeddedTView(t) {
					let n = null;
					for (let r = 0; r < this.length; r++) {
						const o = null !== n ? n.length : 0,
							i = this.getByIndex(r).embeddedTView(t, o);
						i && ((i.indexInDeclarationView = r), null !== n ? n.push(i) : (n = [i]));
					}
					return null !== n ? new ll(n) : null;
				}
				template(t, n) {
					for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n);
				}
				getByIndex(t) {
					return this.queries[t];
				}
				get length() {
					return this.queries.length;
				}
				track(t) {
					this.queries.push(t);
				}
			}
			class dl {
				constructor(t, n = -1) {
					(this.metadata = t),
						(this.matches = null),
						(this.indexInDeclarationView = -1),
						(this.crossesNgTemplate = !1),
						(this._appliesToNextNode = !0),
						(this._declarationNodeIndex = n);
				}
				elementStart(t, n) {
					this.isApplyingToNode(n) && this.matchTNode(t, n);
				}
				elementEnd(t) {
					this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
				}
				template(t, n) {
					this.elementStart(t, n);
				}
				embeddedTView(t, n) {
					return this.isApplyingToNode(t)
						? ((this.crossesNgTemplate = !0), this.addMatch(-t.index, n), new dl(this.metadata))
						: null;
				}
				isApplyingToNode(t) {
					if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
						const n = this._declarationNodeIndex;
						let r = t.parent;
						for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
						return n === (null !== r ? r.index : -1);
					}
					return this._appliesToNextNode;
				}
				matchTNode(t, n) {
					const r = this.metadata.predicate;
					if (Array.isArray(r))
						for (let o = 0; o < r.length; o++) {
							const i = r[o];
							this.matchTNodeWithReadOption(t, n, SA(n, i)),
								this.matchTNodeWithReadOption(t, n, Qi(n, t, i, !1, !1));
						}
					else
						r === sn
							? 4 & n.type && this.matchTNodeWithReadOption(t, n, -1)
							: this.matchTNodeWithReadOption(t, n, Qi(n, t, r, !1, !1));
				}
				matchTNodeWithReadOption(t, n, r) {
					if (null !== r) {
						const o = this.metadata.read;
						if (null !== o)
							if (o === En || o === _t || (o === sn && 4 & n.type)) this.addMatch(n.index, -2);
							else {
								const i = Qi(n, t, o, !1, !1);
								null !== i && this.addMatch(n.index, i);
							}
						else this.addMatch(n.index, r);
					}
				}
				addMatch(t, n) {
					null === this.matches ? (this.matches = [t, n]) : this.matches.push(t, n);
				}
			}
			function SA(e, t) {
				const n = e.localNames;
				if (null !== n) for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
				return null;
			}
			function MA(e, t, n, r) {
				return -1 === n
					? (function IA(e, t) {
							return 11 & e.type ? Er(e, t) : 4 & e.type ? Ws(e, t) : null;
					  })(t, e)
					: -2 === n
					? (function TA(e, t, n) {
							return n === En ? Er(t, e) : n === sn ? Ws(t, e) : n === _t ? Wy(t, e) : void 0;
					  })(e, t, r)
					: Ln(e, e[E], n, t);
			}
			function Ky(e, t, n, r) {
				const o = t[Nt].queries[r];
				if (null === o.matches) {
					const i = e.data,
						s = n.matches,
						a = [];
					for (let u = 0; u < s.length; u += 2) {
						const c = s[u];
						a.push(c < 0 ? null : MA(t, i[c], s[u + 1], n.metadata.read));
					}
					o.matches = a;
				}
				return o.matches;
			}
			function fl(e, t, n, r) {
				const o = e.queries.getByIndex(n),
					i = o.matches;
				if (null !== i) {
					const s = Ky(e, t, o, n);
					for (let a = 0; a < i.length; a += 2) {
						const u = i[a];
						if (u > 0) r.push(s[a / 2]);
						else {
							const c = i[a + 1],
								l = t[-u];
							for (let d = xe; d < l.length; d++) {
								const f = l[d];
								f[fo] === f[oe] && fl(f[E], f, c, r);
							}
							if (null !== l[sr]) {
								const d = l[sr];
								for (let f = 0; f < d.length; f++) {
									const h = d[f];
									fl(h[E], h, c, r);
								}
							}
						}
					}
				}
				return r;
			}
			function Xy(e) {
				const t = v(),
					n = G(),
					r = dh();
				yu(r + 1);
				const o = rv(n, r);
				if (
					e.dirty &&
					(function m_(e) {
						return 4 == (4 & e[j]);
					})(t) ===
						(2 == (2 & o.metadata.flags))
				) {
					if (null === o.matches) e.reset([]);
					else {
						const i = o.crossesNgTemplate ? fl(n, t, r, []) : Ky(n, t, o, r);
						e.reset(i, QS), e.notifyOnChanges();
					}
					return !0;
				}
				return !1;
			}
			function Jy(e, t, n, r) {
				const o = G();
				if (o.firstCreatePass) {
					const i = Ae();
					(function nv(e, t, n) {
						null === e.queries && (e.queries = new ll()), e.queries.track(new dl(t, n));
					})(o, new Qy(t, n, r), i.index),
						(function NA(e, t) {
							const n = e.contentQueries || (e.contentQueries = []);
							t !== (n.length ? n[n.length - 1] : -1) && n.push(e.queries.length - 1, t);
						})(o, e),
						2 == (2 & n) && (o.staticContentQueries = !0);
				}
				!(function tv(e, t, n) {
					const r = new il(4 == (4 & n));
					(function DI(e, t, n, r) {
						const o = _g(t);
						o.push(n), e.firstCreatePass && bg(e).push(r, o.length - 1);
					})(e, t, r, r.destroy),
						null === t[Nt] && (t[Nt] = new cl()),
						t[Nt].queries.push(new ul(r));
				})(o, v(), n);
			}
			function rv(e, t) {
				return e.queries.getByIndex(t);
			}
			const vl = new S("Application Initializer");
			let Dl = (() => {
					class e {
						constructor() {
							(this.initialized = !1),
								(this.done = !1),
								(this.donePromise = new Promise((n, r) => {
									(this.resolve = n), (this.reject = r);
								})),
								(this.appInits = b(vl, { optional: !0 }) ?? []);
						}
						runInitializers() {
							if (this.initialized) return;
							const n = [];
							for (const o of this.appInits) {
								const i = o();
								if (Hs(i)) n.push(i);
								else if (rm(i)) {
									const s = new Promise((a, u) => {
										i.subscribe({ complete: a, error: u });
									});
									n.push(s);
								}
							}
							const r = () => {
								(this.done = !0), this.resolve();
							};
							Promise.all(n)
								.then(() => {
									r();
								})
								.catch((o) => {
									this.reject(o);
								}),
								0 === n.length && r(),
								(this.initialized = !0);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				Cv = (() => {
					class e {
						log(n) {
							console.log(n);
						}
						warn(n) {
							console.warn(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})();
			const an = new S("LocaleId", {
				providedIn: "root",
				factory: () =>
					b(an, A.Optional | A.SkipSelf) ||
					(function JA() {
						return (typeof $localize < "u" && $localize.locale) || jr;
					})(),
			});
			let Ys = (() => {
				class e {
					constructor() {
						(this.taskId = 0), (this.pendingTasks = new Set()), (this.hasPendingTasks = new ut(!1));
					}
					add() {
						this.hasPendingTasks.next(!0);
						const n = this.taskId++;
						return this.pendingTasks.add(n), n;
					}
					remove(n) {
						this.pendingTasks.delete(n), 0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
					}
					ngOnDestroy() {
						this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class tR {
				constructor(t, n) {
					(this.ngModuleFactory = t), (this.componentFactories = n);
				}
			}
			let wv = (() => {
				class e {
					compileModuleSync(n) {
						return new tl(n);
					}
					compileModuleAsync(n) {
						return Promise.resolve(this.compileModuleSync(n));
					}
					compileModuleAndAllComponentsSync(n) {
						const r = this.compileModuleSync(n),
							i = en(et(n).declarations).reduce((s, a) => {
								const u = Z(a);
								return u && s.push(new jo(u)), s;
							}, []);
						return new tR(r, i);
					}
					compileModuleAndAllComponentsAsync(n) {
						return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
					}
					clearCache() {}
					clearCacheFor(n) {}
					getModuleId(n) {}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function bv(...e) {}
			class se {
				constructor({
					enableLongStackTrace: t = !1,
					shouldCoalesceEventChangeDetection: n = !1,
					shouldCoalesceRunChangeDetection: r = !1,
				}) {
					if (
						((this.hasPendingMacrotasks = !1),
						(this.hasPendingMicrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new He(!1)),
						(this.onMicrotaskEmpty = new He(!1)),
						(this.onStable = new He(!1)),
						(this.onError = new He(!1)),
						typeof Zone > "u")
					)
						throw new C(908, !1);
					Zone.assertZonePatched();
					const o = this;
					(o._nesting = 0),
						(o._outer = o._inner = Zone.current),
						Zone.TaskTrackingZoneSpec && (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
						t && Zone.longStackTraceZoneSpec && (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
						(o.shouldCoalesceEventChangeDetection = !r && n),
						(o.shouldCoalesceRunChangeDetection = r),
						(o.lastRequestAnimationFrameId = -1),
						(o.nativeRequestAnimationFrame = (function oR() {
							const e = "function" == typeof ee.requestAnimationFrame;
							let t = ee[e ? "requestAnimationFrame" : "setTimeout"],
								n = ee[e ? "cancelAnimationFrame" : "clearTimeout"];
							if (typeof Zone < "u" && t && n) {
								const r = t[Zone.__symbol__("OriginalDelegate")];
								r && (t = r);
								const o = n[Zone.__symbol__("OriginalDelegate")];
								o && (n = o);
							}
							return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n };
						})().nativeRequestAnimationFrame),
						(function aR(e) {
							const t = () => {
								!(function sR(e) {
									e.isCheckStableRunning ||
										-1 !== e.lastRequestAnimationFrameId ||
										((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(ee, () => {
											e.fakeTopEventTask ||
												(e.fakeTopEventTask = Zone.root.scheduleEventTask(
													"fakeTopEventTask",
													() => {
														(e.lastRequestAnimationFrameId = -1),
															wl(e),
															(e.isCheckStableRunning = !0),
															Cl(e),
															(e.isCheckStableRunning = !1);
													},
													void 0,
													() => {},
													() => {},
												)),
												e.fakeTopEventTask.invoke();
										})),
										wl(e));
								})(e);
							};
							e._inner = e._inner.fork({
								name: "angular",
								properties: { isAngularZone: !0 },
								onInvokeTask: (n, r, o, i, s, a) => {
									try {
										return Sv(e), n.invokeTask(o, i, s, a);
									} finally {
										((e.shouldCoalesceEventChangeDetection && "eventTask" === i.type) ||
											e.shouldCoalesceRunChangeDetection) &&
											t(),
											Iv(e);
									}
								},
								onInvoke: (n, r, o, i, s, a, u) => {
									try {
										return Sv(e), n.invoke(o, i, s, a, u);
									} finally {
										e.shouldCoalesceRunChangeDetection && t(), Iv(e);
									}
								},
								onHasTask: (n, r, o, i) => {
									n.hasTask(o, i),
										r === o &&
											("microTask" == i.change
												? ((e._hasPendingMicrotasks = i.microTask), wl(e), Cl(e))
												: "macroTask" == i.change && (e.hasPendingMacrotasks = i.macroTask));
								},
								onHandleError: (n, r, o, i) => (
									n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
								),
							});
						})(o);
				}
				static isInAngularZone() {
					return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
				}
				static assertInAngularZone() {
					if (!se.isInAngularZone()) throw new C(909, !1);
				}
				static assertNotInAngularZone() {
					if (se.isInAngularZone()) throw new C(909, !1);
				}
				run(t, n, r) {
					return this._inner.run(t, n, r);
				}
				runTask(t, n, r, o) {
					const i = this._inner,
						s = i.scheduleEventTask("NgZoneEvent: " + o, t, iR, bv, bv);
					try {
						return i.runTask(s, n, r);
					} finally {
						i.cancelTask(s);
					}
				}
				runGuarded(t, n, r) {
					return this._inner.runGuarded(t, n, r);
				}
				runOutsideAngular(t) {
					return this._outer.run(t);
				}
			}
			const iR = {};
			function Cl(e) {
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
			function wl(e) {
				e.hasPendingMicrotasks = !!(
					e._hasPendingMicrotasks ||
					((e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) &&
						-1 !== e.lastRequestAnimationFrameId)
				);
			}
			function Sv(e) {
				e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
			}
			function Iv(e) {
				e._nesting--, Cl(e);
			}
			class uR {
				constructor() {
					(this.hasPendingMicrotasks = !1),
						(this.hasPendingMacrotasks = !1),
						(this.isStable = !0),
						(this.onUnstable = new He()),
						(this.onMicrotaskEmpty = new He()),
						(this.onStable = new He()),
						(this.onError = new He());
				}
				run(t, n, r) {
					return t.apply(n, r);
				}
				runGuarded(t, n, r) {
					return t.apply(n, r);
				}
				runOutsideAngular(t) {
					return t();
				}
				runTask(t, n, r, o) {
					return t.apply(n, r);
				}
			}
			const Mv = new S("", { providedIn: "root", factory: Tv });
			function Tv() {
				const e = b(se);
				let t = !0;
				return (function pE(...e) {
					const t = oo(e),
						n = (function aE(e, t) {
							return "number" == typeof qa(e) ? e.pop() : t;
						})(e, 1 / 0),
						r = e;
					return r.length ? (1 === r.length ? gt(r[0]) : Jn(n)(Ie(r, t))) : Tt;
				})(
					new he((o) => {
						(t = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
							e.runOutsideAngular(() => {
								o.next(t), o.complete();
							});
					}),
					new he((o) => {
						let i;
						e.runOutsideAngular(() => {
							i = e.onStable.subscribe(() => {
								se.assertNotInAngularZone(),
									queueMicrotask(() => {
										!t &&
											!e.hasPendingMacrotasks &&
											!e.hasPendingMicrotasks &&
											((t = !0), o.next(!0));
									});
							});
						});
						const s = e.onUnstable.subscribe(() => {
							se.assertInAngularZone(),
								t &&
									((t = !1),
									e.runOutsideAngular(() => {
										o.next(!1);
									}));
						});
						return () => {
							i.unsubscribe(), s.unsubscribe();
						};
					}).pipe(mf()),
				);
			}
			const Av = new S(""),
				Qs = new S("");
			let bl,
				El = (() => {
					class e {
						constructor(n, r, o) {
							(this._ngZone = n),
								(this.registry = r),
								(this._pendingCount = 0),
								(this._isZoneStable = !0),
								(this._didWork = !1),
								(this._callbacks = []),
								(this.taskTrackingZone = null),
								bl ||
									((function cR(e) {
										bl = e;
									})(o),
									o.addToWindow(r)),
								this._watchAngularEvents(),
								n.run(() => {
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
											se.assertNotInAngularZone(),
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
										let n = this._callbacks.pop();
										clearTimeout(n.timeoutId), n.doneCb(this._didWork);
									}
									this._didWork = !1;
								});
							else {
								let n = this.getPendingTasks();
								(this._callbacks = this._callbacks.filter(
									(r) => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1),
								)),
									(this._didWork = !0);
							}
						}
						getPendingTasks() {
							return this.taskTrackingZone
								? this.taskTrackingZone.macroTasks.map((n) => ({
										source: n.source,
										creationLocation: n.creationLocation,
										data: n.data,
								  }))
								: [];
						}
						addCallback(n, r, o) {
							let i = -1;
							r &&
								r > 0 &&
								(i = setTimeout(() => {
									(this._callbacks = this._callbacks.filter((s) => s.timeoutId !== i)),
										n(this._didWork, this.getPendingTasks());
								}, r)),
								this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
						}
						whenStable(n, r, o) {
							if (o && !this.taskTrackingZone)
								throw new Error(
									'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
								);
							this.addCallback(n, r, o), this._runCallbacksIfReady();
						}
						getPendingRequestCount() {
							return this._pendingCount;
						}
						registerApplication(n) {
							this.registry.registerApplication(n, this);
						}
						unregisterApplication(n) {
							this.registry.unregisterApplication(n);
						}
						findProviders(n, r, o) {
							return [];
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(se), I(_l), I(Qs));
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				_l = (() => {
					class e {
						constructor() {
							this._applications = new Map();
						}
						registerApplication(n, r) {
							this._applications.set(n, r);
						}
						unregisterApplication(n) {
							this._applications.delete(n);
						}
						unregisterAllApplications() {
							this._applications.clear();
						}
						getTestability(n) {
							return this._applications.get(n) || null;
						}
						getAllTestabilities() {
							return Array.from(this._applications.values());
						}
						getAllRootElements() {
							return Array.from(this._applications.keys());
						}
						findTestabilityInTree(n, r = !0) {
							return bl?.findTestabilityInTree(this, n, r) ?? null;
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "platform" })),
						e
					);
				})(),
				bn = null;
			const Rv = new S("AllowMultipleToken"),
				Sl = new S("PlatformDestroyListeners"),
				Il = new S("appBootstrapListener");
			class xv {
				constructor(t, n) {
					(this.name = t), (this.token = n);
				}
			}
			function Pv(e, t, n = []) {
				const r = `Platform: ${t}`,
					o = new S(r);
				return (i = []) => {
					let s = Ml();
					if (!s || s.injector.get(Rv, !1)) {
						const a = [...n, ...i, { provide: o, useValue: !0 }];
						e
							? e(a)
							: (function fR(e) {
									if (bn && !bn.get(Rv, !1)) throw new C(400, !1);
									(function Nv() {
										!(function s_(e) {
											qf = e;
										})(() => {
											throw new C(600, !1);
										});
									})(),
										(bn = e);
									const t = e.get(kv);
									(function Ov(e) {
										e.get(Hp, null)?.forEach((n) => n());
									})(e);
							  })(
									(function Fv(e = [], t) {
										return tn.create({
											name: t,
											providers: [
												{ provide: nc, useValue: "platform" },
												{ provide: Sl, useValue: new Set([() => (bn = null)]) },
												...e,
											],
										});
									})(a, r),
							  );
					}
					return (function pR(e) {
						const t = Ml();
						if (!t) throw new C(401, !1);
						return t;
					})();
				};
			}
			function Ml() {
				return bn?.get(kv) ?? null;
			}
			let kv = (() => {
				class e {
					constructor(n) {
						(this._injector = n),
							(this._modules = []),
							(this._destroyListeners = []),
							(this._destroyed = !1);
					}
					bootstrapModuleFactory(n, r) {
						const o = (function gR(e = "zone.js", t) {
							return "noop" === e ? new uR() : "zone.js" === e ? new se(t) : e;
						})(
							r?.ngZone,
							(function Lv(e) {
								return {
									enableLongStackTrace: !1,
									shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
									shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
								};
							})({ eventCoalescing: r?.ngZoneEventCoalescing, runCoalescing: r?.ngZoneRunCoalescing }),
						);
						return o.run(() => {
							const i = (function jT(e, t, n) {
									return new el(e, t, n);
								})(
									n.moduleType,
									this.injector,
									(function Bv(e) {
										return [
											{ provide: se, useFactory: e },
											{
												provide: Ro,
												multi: !0,
												useFactory: () => {
													const t = b(yR, { optional: !0 });
													return () => t.initialize();
												},
											},
											{ provide: $v, useFactory: mR },
											{ provide: Mv, useFactory: Tv },
										];
									})(() => o),
								),
								s = i.injector.get($n, null);
							return (
								o.runOutsideAngular(() => {
									const a = o.onError.subscribe({
										next: (u) => {
											s.handleError(u);
										},
									});
									i.onDestroy(() => {
										Ks(this._modules, i), a.unsubscribe();
									});
								}),
								(function jv(e, t, n) {
									try {
										const r = n();
										return Hs(r)
											? r.catch((o) => {
													throw (t.runOutsideAngular(() => e.handleError(o)), o);
											  })
											: r;
									} catch (r) {
										throw (t.runOutsideAngular(() => e.handleError(r)), r);
									}
								})(s, o, () => {
									const a = i.injector.get(Dl);
									return (
										a.runInitializers(),
										a.donePromise.then(
											() => (
												(function ty(e) {
													ct(e, "Expected localeId to be defined"),
														"string" == typeof e &&
															(ey = e.toLowerCase().replace(/_/g, "-"));
												})(i.injector.get(an, jr) || jr),
												this._moduleDoBootstrap(i),
												i
											),
										)
									);
								})
							);
						});
					}
					bootstrapModule(n, r = []) {
						const o = Hv({}, r);
						return (function lR(e, t, n) {
							const r = new tl(n);
							return Promise.resolve(r);
						})(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
					}
					_moduleDoBootstrap(n) {
						const r = n.injector.get(Br);
						if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach((o) => r.bootstrap(o));
						else {
							if (!n.instance.ngDoBootstrap) throw new C(-403, !1);
							n.instance.ngDoBootstrap(r);
						}
						this._modules.push(n);
					}
					onDestroy(n) {
						this._destroyListeners.push(n);
					}
					get injector() {
						return this._injector;
					}
					destroy() {
						if (this._destroyed) throw new C(404, !1);
						this._modules.slice().forEach((r) => r.destroy()), this._destroyListeners.forEach((r) => r());
						const n = this._injector.get(Sl, null);
						n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
					}
					get destroyed() {
						return this._destroyed;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(tn));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "platform" })),
					e
				);
			})();
			function Hv(e, t) {
				return Array.isArray(t) ? t.reduce(Hv, e) : { ...e, ...t };
			}
			let Br = (() => {
				class e {
					constructor() {
						(this._bootstrapListeners = []),
							(this._runningTick = !1),
							(this._destroyed = !1),
							(this._destroyListeners = []),
							(this._views = []),
							(this.internalErrorHandler = b($v)),
							(this.zoneIsStable = b(Mv)),
							(this.componentTypes = []),
							(this.components = []),
							(this.isStable = b(Ys).hasPendingTasks.pipe(
								mt((n) => (n ? O(!1) : this.zoneIsStable)),
								(function gE(e, t = hn) {
									return (
										(e = e ?? mE),
										be((n, r) => {
											let o,
												i = !0;
											n.subscribe(
												Se(r, (s) => {
													const a = t(s);
													(i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
												}),
											);
										})
									);
								})(),
								mf(),
							)),
							(this._injector = b(Lt));
					}
					get destroyed() {
						return this._destroyed;
					}
					get injector() {
						return this._injector;
					}
					bootstrap(n, r) {
						const o = n instanceof qp;
						if (!this._injector.get(Dl).done)
							throw (
								(!o &&
									(function tr(e) {
										const t = Z(e) || Re(e) || ze(e);
										return null !== t && t.standalone;
									})(n),
								new C(405, !1))
							);
						let s;
						(s = o ? n : this._injector.get(bs).resolveComponentFactory(n)),
							this.componentTypes.push(s.componentType);
						const a = (function dR(e) {
								return e.isBoundToModule;
							})(s)
								? void 0
								: this._injector.get(Hr),
							c = s.create(tn.NULL, [], r || s.selector, a),
							l = c.location.nativeElement,
							d = c.injector.get(Av, null);
						return (
							d?.registerApplication(l),
							c.onDestroy(() => {
								this.detachView(c.hostView), Ks(this.components, c), d?.unregisterApplication(l);
							}),
							this._loadComponent(c),
							c
						);
					}
					tick() {
						if (this._runningTick) throw new C(101, !1);
						try {
							this._runningTick = !0;
							for (let n of this._views) n.detectChanges();
						} catch (n) {
							this.internalErrorHandler(n);
						} finally {
							this._runningTick = !1;
						}
					}
					attachView(n) {
						const r = n;
						this._views.push(r), r.attachToAppRef(this);
					}
					detachView(n) {
						const r = n;
						Ks(this._views, r), r.detachFromAppRef();
					}
					_loadComponent(n) {
						this.attachView(n.hostView), this.tick(), this.components.push(n);
						const r = this._injector.get(Il, []);
						r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
					}
					ngOnDestroy() {
						if (!this._destroyed)
							try {
								this._destroyListeners.forEach((n) => n()),
									this._views.slice().forEach((n) => n.destroy());
							} finally {
								(this._destroyed = !0),
									(this._views = []),
									(this._bootstrapListeners = []),
									(this._destroyListeners = []);
							}
					}
					onDestroy(n) {
						return this._destroyListeners.push(n), () => Ks(this._destroyListeners, n);
					}
					destroy() {
						if (this._destroyed) throw new C(406, !1);
						const n = this._injector;
						n.destroy && !n.destroyed && n.destroy();
					}
					get viewCount() {
						return this._views.length;
					}
					warnIfDestroyed() {}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function Ks(e, t) {
				const n = e.indexOf(t);
				n > -1 && e.splice(n, 1);
			}
			const $v = new S("", { providedIn: "root", factory: () => b($n).handleError.bind(void 0) });
			function mR() {
				const e = b(se),
					t = b($n);
				return (n) => e.runOutsideAngular(() => t.handleError(n));
			}
			let yR = (() => {
				class e {
					constructor() {
						(this.zone = b(se)), (this.applicationRef = b(Br));
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
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			let Tl = (() => {
				class e {}
				return (e.__NG_ELEMENT_ID__ = DR), e;
			})();
			function DR(e) {
				return (function CR(e, t, n) {
					if (On(e) && !n) {
						const r = nt(e.index, t);
						return new Lo(r, r);
					}
					return 47 & e.type ? new Lo(t[le], t) : null;
				})(Ae(), v(), 16 == (16 & e));
			}
			class qv {
				constructor() {}
				supports(t) {
					return Ps(t);
				}
				create(t) {
					return new IR(t);
				}
			}
			const SR = (e, t) => t;
			class IR {
				constructor(t) {
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
						(this._trackByFn = t || SR);
				}
				forEachItem(t) {
					let n;
					for (n = this._itHead; null !== n; n = n._next) t(n);
				}
				forEachOperation(t) {
					let n = this._itHead,
						r = this._removalsHead,
						o = 0,
						i = null;
					for (; n || r; ) {
						const s = !r || (n && n.currentIndex < Zv(r, o, i)) ? n : r,
							a = Zv(s, o, i),
							u = s.currentIndex;
						if (s === r) o--, (r = r._nextRemoved);
						else if (((n = n._next), null == s.previousIndex)) o++;
						else {
							i || (i = []);
							const c = a - o,
								l = u - o;
							if (c != l) {
								for (let f = 0; f < c; f++) {
									const h = f < i.length ? i[f] : (i[f] = 0),
										p = h + f;
									l <= p && p < c && (i[f] = h + 1);
								}
								i[s.previousIndex] = l - c;
							}
						}
						a !== u && t(s, a, u);
					}
				}
				forEachPreviousItem(t) {
					let n;
					for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
				}
				forEachAddedItem(t) {
					let n;
					for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
				}
				forEachMovedItem(t) {
					let n;
					for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
				}
				forEachRemovedItem(t) {
					let n;
					for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
				}
				forEachIdentityChange(t) {
					let n;
					for (n = this._identityChangesHead; null !== n; n = n._nextIdentityChange) t(n);
				}
				diff(t) {
					if ((null == t && (t = []), !Ps(t))) throw new C(900, !1);
					return this.check(t) ? this : null;
				}
				onDestroy() {}
				check(t) {
					this._reset();
					let o,
						i,
						s,
						n = this._itHead,
						r = !1;
					if (Array.isArray(t)) {
						this.length = t.length;
						for (let a = 0; a < this.length; a++)
							(i = t[a]),
								(s = this._trackByFn(a, i)),
								null !== n && Object.is(n.trackById, s)
									? (r && (n = this._verifyReinsertion(n, i, s, a)),
									  Object.is(n.item, i) || this._addIdentityChange(n, i))
									: ((n = this._mismatch(n, i, s, a)), (r = !0)),
								(n = n._next);
					} else
						(o = 0),
							(function hM(e, t) {
								if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
								else {
									const n = e[Symbol.iterator]();
									let r;
									for (; !(r = n.next()).done; ) t(r.value);
								}
							})(t, (a) => {
								(s = this._trackByFn(o, a)),
									null !== n && Object.is(n.trackById, s)
										? (r && (n = this._verifyReinsertion(n, a, s, o)),
										  Object.is(n.item, a) || this._addIdentityChange(n, a))
										: ((n = this._mismatch(n, a, s, o)), (r = !0)),
									(n = n._next),
									o++;
							}),
							(this.length = o);
					return this._truncate(n), (this.collection = t), this.isDirty;
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
						let t;
						for (t = this._previousItHead = this._itHead; null !== t; t = t._next)
							t._nextPrevious = t._next;
						for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
						for (
							this._additionsHead = this._additionsTail = null, t = this._movesHead;
							null !== t;
							t = t._nextMoved
						)
							t.previousIndex = t.currentIndex;
						(this._movesHead = this._movesTail = null),
							(this._removalsHead = this._removalsTail = null),
							(this._identityChangesHead = this._identityChangesTail = null);
					}
				}
				_mismatch(t, n, r, o) {
					let i;
					return (
						null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
						null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null))
							? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o))
							: null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, o))
							? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o))
							: (t = this._addAfter(new MR(n, r), i, o)),
						t
					);
				}
				_verifyReinsertion(t, n, r, o) {
					let i = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
					return (
						null !== i
							? (t = this._reinsertAfter(i, t._prev, o))
							: t.currentIndex != o && ((t.currentIndex = o), this._addToMoves(t, o)),
						t
					);
				}
				_truncate(t) {
					for (; null !== t; ) {
						const n = t._next;
						this._addToRemovals(this._unlink(t)), (t = n);
					}
					null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
						null !== this._additionsTail && (this._additionsTail._nextAdded = null),
						null !== this._movesTail && (this._movesTail._nextMoved = null),
						null !== this._itTail && (this._itTail._next = null),
						null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
						null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null);
				}
				_reinsertAfter(t, n, r) {
					null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
					const o = t._prevRemoved,
						i = t._nextRemoved;
					return (
						null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
						null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
						this._insertAfter(t, n, r),
						this._addToMoves(t, r),
						t
					);
				}
				_moveAfter(t, n, r) {
					return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t;
				}
				_addAfter(t, n, r) {
					return (
						this._insertAfter(t, n, r),
						(this._additionsTail =
							null === this._additionsTail
								? (this._additionsHead = t)
								: (this._additionsTail._nextAdded = t)),
						t
					);
				}
				_insertAfter(t, n, r) {
					const o = null === n ? this._itHead : n._next;
					return (
						(t._next = o),
						(t._prev = n),
						null === o ? (this._itTail = t) : (o._prev = t),
						null === n ? (this._itHead = t) : (n._next = t),
						null === this._linkedRecords && (this._linkedRecords = new Wv()),
						this._linkedRecords.put(t),
						(t.currentIndex = r),
						t
					);
				}
				_remove(t) {
					return this._addToRemovals(this._unlink(t));
				}
				_unlink(t) {
					null !== this._linkedRecords && this._linkedRecords.remove(t);
					const n = t._prev,
						r = t._next;
					return (
						null === n ? (this._itHead = r) : (n._next = r),
						null === r ? (this._itTail = n) : (r._prev = n),
						t
					);
				}
				_addToMoves(t, n) {
					return (
						t.previousIndex === n ||
							(this._movesTail =
								null === this._movesTail ? (this._movesHead = t) : (this._movesTail._nextMoved = t)),
						t
					);
				}
				_addToRemovals(t) {
					return (
						null === this._unlinkedRecords && (this._unlinkedRecords = new Wv()),
						this._unlinkedRecords.put(t),
						(t.currentIndex = null),
						(t._nextRemoved = null),
						null === this._removalsTail
							? ((this._removalsTail = this._removalsHead = t), (t._prevRemoved = null))
							: ((t._prevRemoved = this._removalsTail),
							  (this._removalsTail = this._removalsTail._nextRemoved = t)),
						t
					);
				}
				_addIdentityChange(t, n) {
					return (
						(t.item = n),
						(this._identityChangesTail =
							null === this._identityChangesTail
								? (this._identityChangesHead = t)
								: (this._identityChangesTail._nextIdentityChange = t)),
						t
					);
				}
			}
			class MR {
				constructor(t, n) {
					(this.item = t),
						(this.trackById = n),
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
			class TR {
				constructor() {
					(this._head = null), (this._tail = null);
				}
				add(t) {
					null === this._head
						? ((this._head = this._tail = t), (t._nextDup = null), (t._prevDup = null))
						: ((this._tail._nextDup = t), (t._prevDup = this._tail), (t._nextDup = null), (this._tail = t));
				}
				get(t, n) {
					let r;
					for (r = this._head; null !== r; r = r._nextDup)
						if ((null === n || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
					return null;
				}
				remove(t) {
					const n = t._prevDup,
						r = t._nextDup;
					return (
						null === n ? (this._head = r) : (n._nextDup = r),
						null === r ? (this._tail = n) : (r._prevDup = n),
						null === this._head
					);
				}
			}
			class Wv {
				constructor() {
					this.map = new Map();
				}
				put(t) {
					const n = t.trackById;
					let r = this.map.get(n);
					r || ((r = new TR()), this.map.set(n, r)), r.add(t);
				}
				get(t, n) {
					const o = this.map.get(t);
					return o ? o.get(t, n) : null;
				}
				remove(t) {
					const n = t.trackById;
					return this.map.get(n).remove(t) && this.map.delete(n), t;
				}
				get isEmpty() {
					return 0 === this.map.size;
				}
				clear() {
					this.map.clear();
				}
			}
			function Zv(e, t, n) {
				const r = e.previousIndex;
				if (null === r) return r;
				let o = 0;
				return n && r < n.length && (o = n[r]), r + t + o;
			}
			function Qv() {
				return new ea([new qv()]);
			}
			let ea = (() => {
				class e {
					constructor(n) {
						this.factories = n;
					}
					static create(n, r) {
						if (null != r) {
							const o = r.factories.slice();
							n = n.concat(o);
						}
						return new e(n);
					}
					static extend(n) {
						return {
							provide: e,
							useFactory: (r) => e.create(n, r || Qv()),
							deps: [[e, new ts(), new es()]],
						};
					}
					find(n) {
						const r = this.factories.find((o) => o.supports(n));
						if (null != r) return r;
						throw new C(901, !1);
					}
				}
				return (e.ɵprov = T({ token: e, providedIn: "root", factory: Qv })), e;
			})();
			const OR = Pv(null, "core", []);
			let PR = (() => {
				class e {
					constructor(n) {}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(Br));
					}),
					(e.ɵmod = yn({ type: e })),
					(e.ɵinj = Wt({})),
					e
				);
			})();
			function Fl(e) {
				return "boolean" == typeof e ? e : null != e && "false" !== e;
			}
			let kl = null;
			function Ur() {
				return kl;
			}
			class qR {}
			const it = new S("DocumentToken");
			let Ll = (() => {
				class e {
					historyGo(n) {
						throw new Error("Not implemented");
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({
						token: e,
						factory: function () {
							return b(ZR);
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			const WR = new S("Location Initialized");
			let ZR = (() => {
				class e extends Ll {
					constructor() {
						super(),
							(this._doc = b(it)),
							(this._location = window.location),
							(this._history = window.history);
					}
					getBaseHrefFromDOM() {
						return Ur().getBaseHref(this._doc);
					}
					onPopState(n) {
						const r = Ur().getGlobalEventTarget(this._doc, "window");
						return r.addEventListener("popstate", n, !1), () => r.removeEventListener("popstate", n);
					}
					onHashChange(n) {
						const r = Ur().getGlobalEventTarget(this._doc, "window");
						return r.addEventListener("hashchange", n, !1), () => r.removeEventListener("hashchange", n);
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
					set pathname(n) {
						this._location.pathname = n;
					}
					pushState(n, r, o) {
						this._history.pushState(n, r, o);
					}
					replaceState(n, r, o) {
						this._history.replaceState(n, r, o);
					}
					forward() {
						this._history.forward();
					}
					back() {
						this._history.back();
					}
					historyGo(n = 0) {
						this._history.go(n);
					}
					getState() {
						return this._history.state;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({
						token: e,
						factory: function () {
							return new e();
						},
						providedIn: "platform",
					})),
					e
				);
			})();
			function jl(e, t) {
				if (0 == e.length) return t;
				if (0 == t.length) return e;
				let n = 0;
				return (
					e.endsWith("/") && n++,
					t.startsWith("/") && n++,
					2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
				);
			}
			function oD(e) {
				const t = e.match(/#|\?|$/),
					n = (t && t.index) || e.length;
				return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
			}
			function un(e) {
				return e && "?" !== e[0] ? "?" + e : e;
			}
			let qn = (() => {
				class e {
					historyGo(n) {
						throw new Error("Not implemented");
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({
						token: e,
						factory: function () {
							return b(sD);
						},
						providedIn: "root",
					})),
					e
				);
			})();
			const iD = new S("appBaseHref");
			let sD = (() => {
					class e extends qn {
						constructor(n, r) {
							super(),
								(this._platformLocation = n),
								(this._removeListenerFns = []),
								(this._baseHref =
									r ?? this._platformLocation.getBaseHrefFromDOM() ?? b(it).location?.origin ?? "");
						}
						ngOnDestroy() {
							for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
						}
						onPopState(n) {
							this._removeListenerFns.push(
								this._platformLocation.onPopState(n),
								this._platformLocation.onHashChange(n),
							);
						}
						getBaseHref() {
							return this._baseHref;
						}
						prepareExternalUrl(n) {
							return jl(this._baseHref, n);
						}
						path(n = !1) {
							const r = this._platformLocation.pathname + un(this._platformLocation.search),
								o = this._platformLocation.hash;
							return o && n ? `${r}${o}` : r;
						}
						pushState(n, r, o, i) {
							const s = this.prepareExternalUrl(o + un(i));
							this._platformLocation.pushState(n, r, s);
						}
						replaceState(n, r, o, i) {
							const s = this.prepareExternalUrl(o + un(i));
							this._platformLocation.replaceState(n, r, s);
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
						historyGo(n = 0) {
							this._platformLocation.historyGo?.(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(Ll), I(iD, 8));
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				YR = (() => {
					class e extends qn {
						constructor(n, r) {
							super(),
								(this._platformLocation = n),
								(this._baseHref = ""),
								(this._removeListenerFns = []),
								null != r && (this._baseHref = r);
						}
						ngOnDestroy() {
							for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
						}
						onPopState(n) {
							this._removeListenerFns.push(
								this._platformLocation.onPopState(n),
								this._platformLocation.onHashChange(n),
							);
						}
						getBaseHref() {
							return this._baseHref;
						}
						path(n = !1) {
							let r = this._platformLocation.hash;
							return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
						}
						prepareExternalUrl(n) {
							const r = jl(this._baseHref, n);
							return r.length > 0 ? "#" + r : r;
						}
						pushState(n, r, o, i) {
							let s = this.prepareExternalUrl(o + un(i));
							0 == s.length && (s = this._platformLocation.pathname),
								this._platformLocation.pushState(n, r, s);
						}
						replaceState(n, r, o, i) {
							let s = this.prepareExternalUrl(o + un(i));
							0 == s.length && (s = this._platformLocation.pathname),
								this._platformLocation.replaceState(n, r, s);
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
						historyGo(n = 0) {
							this._platformLocation.historyGo?.(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(Ll), I(iD, 8));
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac })),
						e
					);
				})(),
				Hl = (() => {
					class e {
						constructor(n) {
							(this._subject = new He()),
								(this._urlChangeListeners = []),
								(this._urlChangeSubscription = null),
								(this._locationStrategy = n);
							const r = this._locationStrategy.getBaseHref();
							(this._basePath = (function XR(e) {
								if (new RegExp("^(https?:)?//").test(e)) {
									const [, n] = e.split(/\/\/[^\/]+/);
									return n;
								}
								return e;
							})(oD(aD(r)))),
								this._locationStrategy.onPopState((o) => {
									this._subject.emit({ url: this.path(!0), pop: !0, state: o.state, type: o.type });
								});
						}
						ngOnDestroy() {
							this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
						}
						path(n = !1) {
							return this.normalize(this._locationStrategy.path(n));
						}
						getState() {
							return this._locationStrategy.getState();
						}
						isCurrentPathEqualTo(n, r = "") {
							return this.path() == this.normalize(n + un(r));
						}
						normalize(n) {
							return e.stripTrailingSlash(
								(function KR(e, t) {
									if (!e || !t.startsWith(e)) return t;
									const n = t.substring(e.length);
									return "" === n || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
								})(this._basePath, aD(n)),
							);
						}
						prepareExternalUrl(n) {
							return n && "/" !== n[0] && (n = "/" + n), this._locationStrategy.prepareExternalUrl(n);
						}
						go(n, r = "", o = null) {
							this._locationStrategy.pushState(o, "", n, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(n + un(r)), o);
						}
						replaceState(n, r = "", o = null) {
							this._locationStrategy.replaceState(o, "", n, r),
								this._notifyUrlChangeListeners(this.prepareExternalUrl(n + un(r)), o);
						}
						forward() {
							this._locationStrategy.forward();
						}
						back() {
							this._locationStrategy.back();
						}
						historyGo(n = 0) {
							this._locationStrategy.historyGo?.(n);
						}
						onUrlChange(n) {
							return (
								this._urlChangeListeners.push(n),
								this._urlChangeSubscription ||
									(this._urlChangeSubscription = this.subscribe((r) => {
										this._notifyUrlChangeListeners(r.url, r.state);
									})),
								() => {
									const r = this._urlChangeListeners.indexOf(n);
									this._urlChangeListeners.splice(r, 1),
										0 === this._urlChangeListeners.length &&
											(this._urlChangeSubscription?.unsubscribe(),
											(this._urlChangeSubscription = null));
								}
							);
						}
						_notifyUrlChangeListeners(n = "", r) {
							this._urlChangeListeners.forEach((o) => o(n, r));
						}
						subscribe(n, r, o) {
							return this._subject.subscribe({ next: n, error: r, complete: o });
						}
					}
					return (
						(e.normalizeQueryParams = un),
						(e.joinWithSlash = jl),
						(e.stripTrailingSlash = oD),
						(e.ɵfac = function (n) {
							return new (n || e)(I(qn));
						}),
						(e.ɵprov = T({
							token: e,
							factory: function () {
								return (function QR() {
									return new Hl(I(qn));
								})();
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function aD(e) {
				return e.replace(/\/index.html$/, "");
			}
			function mD(e, t) {
				t = encodeURIComponent(t);
				for (const n of e.split(";")) {
					const r = n.indexOf("="),
						[o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
					if (o.trim() === t) return decodeURIComponent(i);
				}
				return null;
			}
			class LN {
				constructor(t, n, r, o) {
					(this.$implicit = t), (this.ngForOf = n), (this.index = r), (this.count = o);
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
			let Ql = (() => {
				class e {
					set ngForOf(n) {
						(this._ngForOf = n), (this._ngForOfDirty = !0);
					}
					set ngForTrackBy(n) {
						this._trackByFn = n;
					}
					get ngForTrackBy() {
						return this._trackByFn;
					}
					constructor(n, r, o) {
						(this._viewContainer = n),
							(this._template = r),
							(this._differs = o),
							(this._ngForOf = null),
							(this._ngForOfDirty = !0),
							(this._differ = null);
					}
					set ngForTemplate(n) {
						n && (this._template = n);
					}
					ngDoCheck() {
						if (this._ngForOfDirty) {
							this._ngForOfDirty = !1;
							const n = this._ngForOf;
							!this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy));
						}
						if (this._differ) {
							const n = this._differ.diff(this._ngForOf);
							n && this._applyChanges(n);
						}
					}
					_applyChanges(n) {
						const r = this._viewContainer;
						n.forEachOperation((o, i, s) => {
							if (null == o.previousIndex)
								r.createEmbeddedView(
									this._template,
									new LN(o.item, this._ngForOf, -1, -1),
									null === s ? void 0 : s,
								);
							else if (null == s) r.remove(null === i ? void 0 : i);
							else if (null !== i) {
								const a = r.get(i);
								r.move(a, s), DD(a, o);
							}
						});
						for (let o = 0, i = r.length; o < i; o++) {
							const a = r.get(o).context;
							(a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
						}
						n.forEachIdentityChange((o) => {
							DD(r.get(o.currentIndex), o);
						});
					}
					static ngTemplateContextGuard(n, r) {
						return !0;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(M(_t), M(sn), M(ea));
					}),
					(e.ɵdir = Fe({
						type: e,
						selectors: [["", "ngFor", "", "ngForOf", ""]],
						inputs: { ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate" },
						standalone: !0,
					})),
					e
				);
			})();
			function DD(e, t) {
				e.context.$implicit = t.item;
			}
			let lx = (() => {
				class e {}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵmod = yn({ type: e })),
					(e.ɵinj = Wt({})),
					e
				);
			})();
			function bD(e) {
				return "server" === e;
			}
			let px = (() => {
				class e {}
				return (e.ɵprov = T({ token: e, providedIn: "root", factory: () => new gx(I(it), window) })), e;
			})();
			class gx {
				constructor(t, n) {
					(this.document = t), (this.window = n), (this.offset = () => [0, 0]);
				}
				setOffset(t) {
					this.offset = Array.isArray(t) ? () => t : t;
				}
				getScrollPosition() {
					return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0];
				}
				scrollToPosition(t) {
					this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
				}
				scrollToAnchor(t) {
					if (!this.supportsScrolling()) return;
					const n = (function mx(e, t) {
						const n = e.getElementById(t) || e.getElementsByName(t)[0];
						if (n) return n;
						if (
							"function" == typeof e.createTreeWalker &&
							e.body &&
							"function" == typeof e.body.attachShadow
						) {
							const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
							let o = r.currentNode;
							for (; o; ) {
								const i = o.shadowRoot;
								if (i) {
									const s = i.getElementById(t) || i.querySelector(`[name="${t}"]`);
									if (s) return s;
								}
								o = r.nextNode();
							}
						}
						return null;
					})(this.document, t);
					n && (this.scrollToElement(n), n.focus());
				}
				setHistoryScrollRestoration(t) {
					if (this.supportScrollRestoration()) {
						const n = this.window.history;
						n && n.scrollRestoration && (n.scrollRestoration = t);
					}
				}
				scrollToElement(t) {
					const n = t.getBoundingClientRect(),
						r = n.left + this.window.pageXOffset,
						o = n.top + this.window.pageYOffset,
						i = this.offset();
					this.window.scrollTo(r - i[0], o - i[1]);
				}
				supportScrollRestoration() {
					try {
						if (!this.supportsScrolling()) return !1;
						const t = SD(this.window.history) || SD(Object.getPrototypeOf(this.window.history));
						return !(!t || (!t.writable && !t.set));
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
			function SD(e) {
				return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
			}
			class ID {}
			class Hx extends qR {
				constructor() {
					super(...arguments), (this.supportsDOMEvents = !0);
				}
			}
			class rd extends Hx {
				static makeCurrent() {
					!(function GR(e) {
						kl || (kl = e);
					})(new rd());
				}
				onAndCancel(t, n, r) {
					return (
						t.addEventListener(n, r),
						() => {
							t.removeEventListener(n, r);
						}
					);
				}
				dispatchEvent(t, n) {
					t.dispatchEvent(n);
				}
				remove(t) {
					t.parentNode && t.parentNode.removeChild(t);
				}
				createElement(t, n) {
					return (n = n || this.getDefaultDocument()).createElement(t);
				}
				createHtmlDocument() {
					return document.implementation.createHTMLDocument("fakeTitle");
				}
				getDefaultDocument() {
					return document;
				}
				isElementNode(t) {
					return t.nodeType === Node.ELEMENT_NODE;
				}
				isShadowRoot(t) {
					return t instanceof DocumentFragment;
				}
				getGlobalEventTarget(t, n) {
					return "window" === n ? window : "document" === n ? t : "body" === n ? t.body : null;
				}
				getBaseHref(t) {
					const n = (function Vx() {
						return (ni = ni || document.querySelector("base")), ni ? ni.getAttribute("href") : null;
					})();
					return null == n
						? null
						: (function $x(e) {
								(ha = ha || document.createElement("a")), ha.setAttribute("href", e);
								const t = ha.pathname;
								return "/" === t.charAt(0) ? t : `/${t}`;
						  })(n);
				}
				resetBaseElement() {
					ni = null;
				}
				getUserAgent() {
					return window.navigator.userAgent;
				}
				getCookie(t) {
					return mD(document.cookie, t);
				}
			}
			let ha,
				ni = null,
				Ux = (() => {
					class e {
						build() {
							return new XMLHttpRequest();
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac })),
						e
					);
				})();
			const od = new S("EventManagerPlugins");
			let ND = (() => {
				class e {
					constructor(n, r) {
						(this._zone = r),
							(this._eventNameToPlugin = new Map()),
							n.forEach((o) => {
								o.manager = this;
							}),
							(this._plugins = n.slice().reverse());
					}
					addEventListener(n, r, o) {
						return this._findPluginFor(r).addEventListener(n, r, o);
					}
					getZone() {
						return this._zone;
					}
					_findPluginFor(n) {
						let r = this._eventNameToPlugin.get(n);
						if (r) return r;
						if (((r = this._plugins.find((i) => i.supports(n))), !r)) throw new C(5101, !1);
						return this._eventNameToPlugin.set(n, r), r;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(od), I(se));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class xD {
				constructor(t) {
					this._doc = t;
				}
			}
			const id = "ng-app-id";
			let OD = (() => {
				class e {
					constructor(n, r, o, i = {}) {
						(this.doc = n),
							(this.appId = r),
							(this.nonce = o),
							(this.platformId = i),
							(this.styleRef = new Map()),
							(this.hostNodes = new Set()),
							(this.styleNodesInDOM = this.collectServerRenderedStyles()),
							(this.platformIsServer = bD(i)),
							this.resetHostNodes();
					}
					addStyles(n) {
						for (const r of n) 1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
					}
					removeStyles(n) {
						for (const r of n) this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
					}
					ngOnDestroy() {
						const n = this.styleNodesInDOM;
						n && (n.forEach((r) => r.remove()), n.clear());
						for (const r of this.getAllStyles()) this.onStyleRemoved(r);
						this.resetHostNodes();
					}
					addHost(n) {
						this.hostNodes.add(n);
						for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
					}
					removeHost(n) {
						this.hostNodes.delete(n);
					}
					getAllStyles() {
						return this.styleRef.keys();
					}
					onStyleAdded(n) {
						for (const r of this.hostNodes) this.addStyleToHost(r, n);
					}
					onStyleRemoved(n) {
						const r = this.styleRef;
						r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
					}
					collectServerRenderedStyles() {
						const n = this.doc.head?.querySelectorAll(`style[${id}="${this.appId}"]`);
						if (n?.length) {
							const r = new Map();
							return (
								n.forEach((o) => {
									null != o.textContent && r.set(o.textContent, o);
								}),
								r
							);
						}
						return null;
					}
					changeUsageCount(n, r) {
						const o = this.styleRef;
						if (o.has(n)) {
							const i = o.get(n);
							return (i.usage += r), i.usage;
						}
						return o.set(n, { usage: r, elements: [] }), r;
					}
					getStyleElement(n, r) {
						const o = this.styleNodesInDOM,
							i = o?.get(r);
						if (i?.parentNode === n) return o.delete(r), i.removeAttribute(id), i;
						{
							const s = this.doc.createElement("style");
							return (
								this.nonce && s.setAttribute("nonce", this.nonce),
								(s.textContent = r),
								this.platformIsServer && s.setAttribute(id, this.appId),
								s
							);
						}
					}
					addStyleToHost(n, r) {
						const o = this.getStyleElement(n, r);
						n.appendChild(o);
						const i = this.styleRef,
							s = i.get(r)?.elements;
						s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
					}
					resetHostNodes() {
						const n = this.hostNodes;
						n.clear(), n.add(this.doc.head);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(it), I(Ds), I(Vp, 8), I(Vn));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const sd = {
					svg: "http://www.w3.org/2000/svg",
					xhtml: "http://www.w3.org/1999/xhtml",
					xlink: "http://www.w3.org/1999/xlink",
					xml: "http://www.w3.org/XML/1998/namespace",
					xmlns: "http://www.w3.org/2000/xmlns/",
					math: "http://www.w3.org/1998/MathML/",
				},
				ad = /%COMP%/g,
				Wx = new S("RemoveStylesOnCompDestroy", { providedIn: "root", factory: () => !1 });
			function FD(e, t) {
				return t.map((n) => n.replace(ad, e));
			}
			let kD = (() => {
				class e {
					constructor(n, r, o, i, s, a, u, c = null) {
						(this.eventManager = n),
							(this.sharedStylesHost = r),
							(this.appId = o),
							(this.removeStylesOnCompDestroy = i),
							(this.doc = s),
							(this.platformId = a),
							(this.ngZone = u),
							(this.nonce = c),
							(this.rendererByCompId = new Map()),
							(this.platformIsServer = bD(a)),
							(this.defaultRenderer = new ud(n, s, u, this.platformIsServer));
					}
					createRenderer(n, r) {
						if (!n || !r) return this.defaultRenderer;
						this.platformIsServer &&
							r.encapsulation === Je.ShadowDom &&
							(r = { ...r, encapsulation: Je.Emulated });
						const o = this.getOrCreateRenderer(n, r);
						return o instanceof jD ? o.applyToHost(n) : o instanceof cd && o.applyStyles(), o;
					}
					getOrCreateRenderer(n, r) {
						const o = this.rendererByCompId;
						let i = o.get(r.id);
						if (!i) {
							const s = this.doc,
								a = this.ngZone,
								u = this.eventManager,
								c = this.sharedStylesHost,
								l = this.removeStylesOnCompDestroy,
								d = this.platformIsServer;
							switch (r.encapsulation) {
								case Je.Emulated:
									i = new jD(u, c, r, this.appId, l, s, a, d);
									break;
								case Je.ShadowDom:
									return new Kx(u, c, n, r, s, a, this.nonce, d);
								default:
									i = new cd(u, c, r, l, s, a, d);
							}
							o.set(r.id, i);
						}
						return i;
					}
					ngOnDestroy() {
						this.rendererByCompId.clear();
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(ND), I(OD), I(Ds), I(Wx), I(it), I(Vn), I(se), I(Vp));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			class ud {
				constructor(t, n, r, o) {
					(this.eventManager = t),
						(this.doc = n),
						(this.ngZone = r),
						(this.platformIsServer = o),
						(this.data = Object.create(null)),
						(this.destroyNode = null);
				}
				destroy() {}
				createElement(t, n) {
					return n ? this.doc.createElementNS(sd[n] || n, t) : this.doc.createElement(t);
				}
				createComment(t) {
					return this.doc.createComment(t);
				}
				createText(t) {
					return this.doc.createTextNode(t);
				}
				appendChild(t, n) {
					(LD(t) ? t.content : t).appendChild(n);
				}
				insertBefore(t, n, r) {
					t && (LD(t) ? t.content : t).insertBefore(n, r);
				}
				removeChild(t, n) {
					t && t.removeChild(n);
				}
				selectRootElement(t, n) {
					let r = "string" == typeof t ? this.doc.querySelector(t) : t;
					if (!r) throw new C(-5104, !1);
					return n || (r.textContent = ""), r;
				}
				parentNode(t) {
					return t.parentNode;
				}
				nextSibling(t) {
					return t.nextSibling;
				}
				setAttribute(t, n, r, o) {
					if (o) {
						n = o + ":" + n;
						const i = sd[o];
						i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
					} else t.setAttribute(n, r);
				}
				removeAttribute(t, n, r) {
					if (r) {
						const o = sd[r];
						o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
					} else t.removeAttribute(n);
				}
				addClass(t, n) {
					t.classList.add(n);
				}
				removeClass(t, n) {
					t.classList.remove(n);
				}
				setStyle(t, n, r, o) {
					o & (We.DashCase | We.Important)
						? t.style.setProperty(n, r, o & We.Important ? "important" : "")
						: (t.style[n] = r);
				}
				removeStyle(t, n, r) {
					r & We.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
				}
				setProperty(t, n, r) {
					t[n] = r;
				}
				setValue(t, n) {
					t.nodeValue = n;
				}
				listen(t, n, r) {
					if ("string" == typeof t && !(t = Ur().getGlobalEventTarget(this.doc, t)))
						throw new Error(`Unsupported event target ${t} for event ${n}`);
					return this.eventManager.addEventListener(t, n, this.decoratePreventDefault(r));
				}
				decoratePreventDefault(t) {
					return (n) => {
						if ("__ngUnwrap__" === n) return t;
						!1 === (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) &&
							n.preventDefault();
					};
				}
			}
			function LD(e) {
				return "TEMPLATE" === e.tagName && void 0 !== e.content;
			}
			class Kx extends ud {
				constructor(t, n, r, o, i, s, a, u) {
					super(t, i, s, u),
						(this.sharedStylesHost = n),
						(this.hostEl = r),
						(this.shadowRoot = r.attachShadow({ mode: "open" })),
						this.sharedStylesHost.addHost(this.shadowRoot);
					const c = FD(o.id, o.styles);
					for (const l of c) {
						const d = document.createElement("style");
						a && d.setAttribute("nonce", a), (d.textContent = l), this.shadowRoot.appendChild(d);
					}
				}
				nodeOrShadowRoot(t) {
					return t === this.hostEl ? this.shadowRoot : t;
				}
				appendChild(t, n) {
					return super.appendChild(this.nodeOrShadowRoot(t), n);
				}
				insertBefore(t, n, r) {
					return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
				}
				removeChild(t, n) {
					return super.removeChild(this.nodeOrShadowRoot(t), n);
				}
				parentNode(t) {
					return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
				}
				destroy() {
					this.sharedStylesHost.removeHost(this.shadowRoot);
				}
			}
			class cd extends ud {
				constructor(t, n, r, o, i, s, a, u) {
					super(t, i, s, a),
						(this.sharedStylesHost = n),
						(this.removeStylesOnCompDestroy = o),
						(this.styles = u ? FD(u, r.styles) : r.styles);
				}
				applyStyles() {
					this.sharedStylesHost.addStyles(this.styles);
				}
				destroy() {
					this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
				}
			}
			class jD extends cd {
				constructor(t, n, r, o, i, s, a, u) {
					const c = o + "-" + r.id;
					super(t, n, r, i, s, a, u, c),
						(this.contentAttr = (function Zx(e) {
							return "_ngcontent-%COMP%".replace(ad, e);
						})(c)),
						(this.hostAttr = (function Yx(e) {
							return "_nghost-%COMP%".replace(ad, e);
						})(c));
				}
				applyToHost(t) {
					this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
				}
				createElement(t, n) {
					const r = super.createElement(t, n);
					return super.setAttribute(r, this.contentAttr, ""), r;
				}
			}
			let Xx = (() => {
				class e extends xD {
					constructor(n) {
						super(n);
					}
					supports(n) {
						return !0;
					}
					addEventListener(n, r, o) {
						return n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o);
					}
					removeEventListener(n, r, o) {
						return n.removeEventListener(r, o);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(it));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const HD = ["alt", "control", "meta", "shift"],
				Jx = {
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
				eO = {
					alt: (e) => e.altKey,
					control: (e) => e.ctrlKey,
					meta: (e) => e.metaKey,
					shift: (e) => e.shiftKey,
				};
			let tO = (() => {
				class e extends xD {
					constructor(n) {
						super(n);
					}
					supports(n) {
						return null != e.parseEventName(n);
					}
					addEventListener(n, r, o) {
						const i = e.parseEventName(r),
							s = e.eventCallback(i.fullKey, o, this.manager.getZone());
						return this.manager.getZone().runOutsideAngular(() => Ur().onAndCancel(n, i.domEventName, s));
					}
					static parseEventName(n) {
						const r = n.toLowerCase().split("."),
							o = r.shift();
						if (0 === r.length || ("keydown" !== o && "keyup" !== o)) return null;
						const i = e._normalizeKey(r.pop());
						let s = "",
							a = r.indexOf("code");
						if (
							(a > -1 && (r.splice(a, 1), (s = "code.")),
							HD.forEach((c) => {
								const l = r.indexOf(c);
								l > -1 && (r.splice(l, 1), (s += c + "."));
							}),
							(s += i),
							0 != r.length || 0 === i.length)
						)
							return null;
						const u = {};
						return (u.domEventName = o), (u.fullKey = s), u;
					}
					static matchEventFullKeyCode(n, r) {
						let o = Jx[n.key] || n.key,
							i = "";
						return (
							r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
							!(null == o || !o) &&
								((o = o.toLowerCase()),
								" " === o ? (o = "space") : "." === o && (o = "dot"),
								HD.forEach((s) => {
									s !== o && (0, eO[s])(n) && (i += s + ".");
								}),
								(i += o),
								i === r)
						);
					}
					static eventCallback(n, r, o) {
						return (i) => {
							e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
						};
					}
					static _normalizeKey(n) {
						return "esc" === n ? "escape" : n;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(it));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const iO = Pv(OR, "browser", [
					{ provide: Vn, useValue: "browser" },
					{
						provide: Hp,
						useValue: function nO() {
							rd.makeCurrent();
						},
						multi: !0,
					},
					{
						provide: it,
						useFactory: function oO() {
							return (
								(function iS(e) {
									qu = e;
								})(document),
								document
							);
						},
						deps: [],
					},
				]),
				sO = new S(""),
				BD = [
					{
						provide: Qs,
						useClass: class Bx {
							addToWindow(t) {
								(ee.getAngularTestability = (r, o = !0) => {
									const i = t.findTestabilityInTree(r, o);
									if (null == i) throw new C(5103, !1);
									return i;
								}),
									(ee.getAllAngularTestabilities = () => t.getAllTestabilities()),
									(ee.getAllAngularRootElements = () => t.getAllRootElements()),
									ee.frameworkStabilizers || (ee.frameworkStabilizers = []),
									ee.frameworkStabilizers.push((r) => {
										const o = ee.getAllAngularTestabilities();
										let i = o.length,
											s = !1;
										const a = function (u) {
											(s = s || u), i--, 0 == i && r(s);
										};
										o.forEach((u) => {
											u.whenStable(a);
										});
									});
							}
							findTestabilityInTree(t, n, r) {
								return null == n
									? null
									: t.getTestability(n) ??
											(r
												? Ur().isShadowRoot(n)
													? this.findTestabilityInTree(t, n.host, !0)
													: this.findTestabilityInTree(t, n.parentElement, !0)
												: null);
							}
						},
						deps: [],
					},
					{ provide: Av, useClass: El, deps: [se, _l, Qs] },
					{ provide: El, useClass: El, deps: [se, _l, Qs] },
				],
				UD = [
					{ provide: nc, useValue: "root" },
					{
						provide: $n,
						useFactory: function rO() {
							return new $n();
						},
						deps: [],
					},
					{ provide: od, useClass: Xx, multi: !0, deps: [it, se, Vn] },
					{ provide: od, useClass: tO, multi: !0, deps: [it] },
					kD,
					OD,
					ND,
					{ provide: Zp, useExisting: kD },
					{ provide: ID, useClass: Ux, deps: [] },
					[],
				];
			let aO = (() => {
					class e {
						constructor(n) {}
						static withServerTransition(n) {
							return { ngModule: e, providers: [{ provide: Ds, useValue: n.appId }] };
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(sO, 12));
						}),
						(e.ɵmod = yn({ type: e })),
						(e.ɵinj = Wt({ providers: [...UD, ...BD], imports: [lx, PR] })),
						e
					);
				})(),
				zD = (() => {
					class e {
						constructor(n) {
							this._doc = n;
						}
						getTitle() {
							return this._doc.title;
						}
						setTitle(n) {
							this._doc.title = n || "";
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(it));
						}),
						(e.ɵprov = T({
							token: e,
							factory: function (n) {
								let r = null;
								return (
									(r = n
										? new n()
										: (function cO() {
												return new zD(I(it));
										  })()),
									r
								);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			function zr(e, t) {
				return J(t) ? Te(e, t, 1) : Te(e, 1);
			}
			function ln(e, t) {
				return be((n, r) => {
					let o = 0;
					n.subscribe(Se(r, (i) => e.call(t, i, o++) && r.next(i)));
				});
			}
			function ri(e) {
				return be((t, n) => {
					try {
						t.subscribe(n);
					} finally {
						n.add(e);
					}
				});
			}
			typeof window < "u" && window;
			class pa {}
			class ga {}
			class Bt {
				constructor(t) {
					(this.normalizedNames = new Map()),
						(this.lazyUpdate = null),
						t
							? "string" == typeof t
								? (this.lazyInit = () => {
										(this.headers = new Map()),
											t.split("\n").forEach((n) => {
												const r = n.indexOf(":");
												if (r > 0) {
													const o = n.slice(0, r),
														i = o.toLowerCase(),
														s = n.slice(r + 1).trim();
													this.maybeSetNormalizedName(o, i),
														this.headers.has(i)
															? this.headers.get(i).push(s)
															: this.headers.set(i, [s]);
												}
											});
								  })
								: typeof Headers < "u" && t instanceof Headers
								? ((this.headers = new Map()),
								  t.forEach((n, r) => {
										this.setHeaderEntries(r, n);
								  }))
								: (this.lazyInit = () => {
										(this.headers = new Map()),
											Object.entries(t).forEach(([n, r]) => {
												this.setHeaderEntries(n, r);
											});
								  })
							: (this.headers = new Map());
				}
				has(t) {
					return this.init(), this.headers.has(t.toLowerCase());
				}
				get(t) {
					this.init();
					const n = this.headers.get(t.toLowerCase());
					return n && n.length > 0 ? n[0] : null;
				}
				keys() {
					return this.init(), Array.from(this.normalizedNames.values());
				}
				getAll(t) {
					return this.init(), this.headers.get(t.toLowerCase()) || null;
				}
				append(t, n) {
					return this.clone({ name: t, value: n, op: "a" });
				}
				set(t, n) {
					return this.clone({ name: t, value: n, op: "s" });
				}
				delete(t, n) {
					return this.clone({ name: t, value: n, op: "d" });
				}
				maybeSetNormalizedName(t, n) {
					this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
				}
				init() {
					this.lazyInit &&
						(this.lazyInit instanceof Bt ? this.copyFrom(this.lazyInit) : this.lazyInit(),
						(this.lazyInit = null),
						this.lazyUpdate &&
							(this.lazyUpdate.forEach((t) => this.applyUpdate(t)), (this.lazyUpdate = null)));
				}
				copyFrom(t) {
					t.init(),
						Array.from(t.headers.keys()).forEach((n) => {
							this.headers.set(n, t.headers.get(n)),
								this.normalizedNames.set(n, t.normalizedNames.get(n));
						});
				}
				clone(t) {
					const n = new Bt();
					return (
						(n.lazyInit = this.lazyInit && this.lazyInit instanceof Bt ? this.lazyInit : this),
						(n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
						n
					);
				}
				applyUpdate(t) {
					const n = t.name.toLowerCase();
					switch (t.op) {
						case "a":
						case "s":
							let r = t.value;
							if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
							this.maybeSetNormalizedName(t.name, n);
							const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
							o.push(...r), this.headers.set(n, o);
							break;
						case "d":
							const i = t.value;
							if (i) {
								let s = this.headers.get(n);
								if (!s) return;
								(s = s.filter((a) => -1 === i.indexOf(a))),
									0 === s.length
										? (this.headers.delete(n), this.normalizedNames.delete(n))
										: this.headers.set(n, s);
							} else this.headers.delete(n), this.normalizedNames.delete(n);
					}
				}
				setHeaderEntries(t, n) {
					const r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
						o = t.toLowerCase();
					this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
				}
				forEach(t) {
					this.init(),
						Array.from(this.normalizedNames.keys()).forEach((n) =>
							t(this.normalizedNames.get(n), this.headers.get(n)),
						);
				}
			}
			class pO {
				encodeKey(t) {
					return ZD(t);
				}
				encodeValue(t) {
					return ZD(t);
				}
				decodeKey(t) {
					return decodeURIComponent(t);
				}
				decodeValue(t) {
					return decodeURIComponent(t);
				}
			}
			const mO = /%(\d[a-f0-9])/gi,
				yO = { 40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/" };
			function ZD(e) {
				return encodeURIComponent(e).replace(mO, (t, n) => yO[n] ?? t);
			}
			function ma(e) {
				return `${e}`;
			}
			class In {
				constructor(t = {}) {
					if (
						((this.updates = null),
						(this.cloneFrom = null),
						(this.encoder = t.encoder || new pO()),
						t.fromString)
					) {
						if (t.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
						this.map = (function gO(e, t) {
							const n = new Map();
							return (
								e.length > 0 &&
									e
										.replace(/^\?/, "")
										.split("&")
										.forEach((o) => {
											const i = o.indexOf("="),
												[s, a] =
													-1 == i
														? [t.decodeKey(o), ""]
														: [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
												u = n.get(s) || [];
											u.push(a), n.set(s, u);
										}),
								n
							);
						})(t.fromString, this.encoder);
					} else
						t.fromObject
							? ((this.map = new Map()),
							  Object.keys(t.fromObject).forEach((n) => {
									const r = t.fromObject[n],
										o = Array.isArray(r) ? r.map(ma) : [ma(r)];
									this.map.set(n, o);
							  }))
							: (this.map = null);
				}
				has(t) {
					return this.init(), this.map.has(t);
				}
				get(t) {
					this.init();
					const n = this.map.get(t);
					return n ? n[0] : null;
				}
				getAll(t) {
					return this.init(), this.map.get(t) || null;
				}
				keys() {
					return this.init(), Array.from(this.map.keys());
				}
				append(t, n) {
					return this.clone({ param: t, value: n, op: "a" });
				}
				appendAll(t) {
					const n = [];
					return (
						Object.keys(t).forEach((r) => {
							const o = t[r];
							Array.isArray(o)
								? o.forEach((i) => {
										n.push({ param: r, value: i, op: "a" });
								  })
								: n.push({ param: r, value: o, op: "a" });
						}),
						this.clone(n)
					);
				}
				set(t, n) {
					return this.clone({ param: t, value: n, op: "s" });
				}
				delete(t, n) {
					return this.clone({ param: t, value: n, op: "d" });
				}
				toString() {
					return (
						this.init(),
						this.keys()
							.map((t) => {
								const n = this.encoder.encodeKey(t);
								return this.map
									.get(t)
									.map((r) => n + "=" + this.encoder.encodeValue(r))
									.join("&");
							})
							.filter((t) => "" !== t)
							.join("&")
					);
				}
				clone(t) {
					const n = new In({ encoder: this.encoder });
					return (n.cloneFrom = this.cloneFrom || this), (n.updates = (this.updates || []).concat(t)), n;
				}
				init() {
					null === this.map && (this.map = new Map()),
						null !== this.cloneFrom &&
							(this.cloneFrom.init(),
							this.cloneFrom.keys().forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
							this.updates.forEach((t) => {
								switch (t.op) {
									case "a":
									case "s":
										const n = ("a" === t.op ? this.map.get(t.param) : void 0) || [];
										n.push(ma(t.value)), this.map.set(t.param, n);
										break;
									case "d":
										if (void 0 === t.value) {
											this.map.delete(t.param);
											break;
										}
										{
											let r = this.map.get(t.param) || [];
											const o = r.indexOf(ma(t.value));
											-1 !== o && r.splice(o, 1),
												r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param);
										}
								}
							}),
							(this.cloneFrom = this.updates = null));
				}
			}
			class vO {
				constructor() {
					this.map = new Map();
				}
				set(t, n) {
					return this.map.set(t, n), this;
				}
				get(t) {
					return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t);
				}
				delete(t) {
					return this.map.delete(t), this;
				}
				has(t) {
					return this.map.has(t);
				}
				keys() {
					return this.map.keys();
				}
			}
			function YD(e) {
				return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
			}
			function QD(e) {
				return typeof Blob < "u" && e instanceof Blob;
			}
			function KD(e) {
				return typeof FormData < "u" && e instanceof FormData;
			}
			class oi {
				constructor(t, n, r, o) {
					let i;
					if (
						((this.url = n),
						(this.body = null),
						(this.reportProgress = !1),
						(this.withCredentials = !1),
						(this.responseType = "json"),
						(this.method = t.toUpperCase()),
						(function DO(e) {
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
						})(this.method) || o
							? ((this.body = void 0 !== r ? r : null), (i = o))
							: (i = r),
						i &&
							((this.reportProgress = !!i.reportProgress),
							(this.withCredentials = !!i.withCredentials),
							i.responseType && (this.responseType = i.responseType),
							i.headers && (this.headers = i.headers),
							i.context && (this.context = i.context),
							i.params && (this.params = i.params)),
						this.headers || (this.headers = new Bt()),
						this.context || (this.context = new vO()),
						this.params)
					) {
						const s = this.params.toString();
						if (0 === s.length) this.urlWithParams = n;
						else {
							const a = n.indexOf("?");
							this.urlWithParams = n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
						}
					} else (this.params = new In()), (this.urlWithParams = n);
				}
				serializeBody() {
					return null === this.body
						? null
						: YD(this.body) ||
						  QD(this.body) ||
						  KD(this.body) ||
						  (function CO(e) {
								return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
						  })(this.body) ||
						  "string" == typeof this.body
						? this.body
						: this.body instanceof In
						? this.body.toString()
						: "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body)
						? JSON.stringify(this.body)
						: this.body.toString();
				}
				detectContentTypeHeader() {
					return null === this.body || KD(this.body)
						? null
						: QD(this.body)
						? this.body.type || null
						: YD(this.body)
						? null
						: "string" == typeof this.body
						? "text/plain"
						: this.body instanceof In
						? "application/x-www-form-urlencoded;charset=UTF-8"
						: "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body
						? "application/json"
						: null;
				}
				clone(t = {}) {
					const n = t.method || this.method,
						r = t.url || this.url,
						o = t.responseType || this.responseType,
						i = void 0 !== t.body ? t.body : this.body,
						s = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
						a = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
					let u = t.headers || this.headers,
						c = t.params || this.params;
					const l = t.context ?? this.context;
					return (
						void 0 !== t.setHeaders &&
							(u = Object.keys(t.setHeaders).reduce((d, f) => d.set(f, t.setHeaders[f]), u)),
						t.setParams && (c = Object.keys(t.setParams).reduce((d, f) => d.set(f, t.setParams[f]), c)),
						new oi(n, r, i, {
							params: c,
							headers: u,
							context: l,
							reportProgress: a,
							responseType: o,
							withCredentials: s,
						})
					);
				}
			}
			var ye = (() => (
				((ye = ye || {})[(ye.Sent = 0)] = "Sent"),
				(ye[(ye.UploadProgress = 1)] = "UploadProgress"),
				(ye[(ye.ResponseHeader = 2)] = "ResponseHeader"),
				(ye[(ye.DownloadProgress = 3)] = "DownloadProgress"),
				(ye[(ye.Response = 4)] = "Response"),
				(ye[(ye.User = 5)] = "User"),
				ye
			))();
			class dd {
				constructor(t, n = 200, r = "OK") {
					(this.headers = t.headers || new Bt()),
						(this.status = void 0 !== t.status ? t.status : n),
						(this.statusText = t.statusText || r),
						(this.url = t.url || null),
						(this.ok = this.status >= 200 && this.status < 300);
				}
			}
			class fd extends dd {
				constructor(t = {}) {
					super(t), (this.type = ye.ResponseHeader);
				}
				clone(t = {}) {
					return new fd({
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class Gr extends dd {
				constructor(t = {}) {
					super(t), (this.type = ye.Response), (this.body = void 0 !== t.body ? t.body : null);
				}
				clone(t = {}) {
					return new Gr({
						body: void 0 !== t.body ? t.body : this.body,
						headers: t.headers || this.headers,
						status: void 0 !== t.status ? t.status : this.status,
						statusText: t.statusText || this.statusText,
						url: t.url || this.url || void 0,
					});
				}
			}
			class XD extends dd {
				constructor(t) {
					super(t, 0, "Unknown Error"),
						(this.name = "HttpErrorResponse"),
						(this.ok = !1),
						(this.message =
							this.status >= 200 && this.status < 300
								? `Http failure during parsing for ${t.url || "(unknown url)"}`
								: `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`),
						(this.error = t.error || null);
				}
			}
			function hd(e, t) {
				return {
					body: t,
					headers: e.headers,
					context: e.context,
					observe: e.observe,
					params: e.params,
					reportProgress: e.reportProgress,
					responseType: e.responseType,
					withCredentials: e.withCredentials,
				};
			}
			let JD = (() => {
				class e {
					constructor(n) {
						this.handler = n;
					}
					request(n, r, o = {}) {
						let i;
						if (n instanceof oi) i = n;
						else {
							let u, c;
							(u = o.headers instanceof Bt ? o.headers : new Bt(o.headers)),
								o.params && (c = o.params instanceof In ? o.params : new In({ fromObject: o.params })),
								(i = new oi(n, r, void 0 !== o.body ? o.body : null, {
									headers: u,
									context: o.context,
									params: c,
									reportProgress: o.reportProgress,
									responseType: o.responseType || "json",
									withCredentials: o.withCredentials,
								}));
						}
						const s = O(i).pipe(zr((u) => this.handler.handle(u)));
						if (n instanceof oi || "events" === o.observe) return s;
						const a = s.pipe(ln((u) => u instanceof Gr));
						switch (o.observe || "body") {
							case "body":
								switch (i.responseType) {
									case "arraybuffer":
										return a.pipe(
											Y((u) => {
												if (null !== u.body && !(u.body instanceof ArrayBuffer))
													throw new Error("Response is not an ArrayBuffer.");
												return u.body;
											}),
										);
									case "blob":
										return a.pipe(
											Y((u) => {
												if (null !== u.body && !(u.body instanceof Blob))
													throw new Error("Response is not a Blob.");
												return u.body;
											}),
										);
									case "text":
										return a.pipe(
											Y((u) => {
												if (null !== u.body && "string" != typeof u.body)
													throw new Error("Response is not a string.");
												return u.body;
											}),
										);
									default:
										return a.pipe(Y((u) => u.body));
								}
							case "response":
								return a;
							default:
								throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
						}
					}
					delete(n, r = {}) {
						return this.request("DELETE", n, r);
					}
					get(n, r = {}) {
						return this.request("GET", n, r);
					}
					head(n, r = {}) {
						return this.request("HEAD", n, r);
					}
					jsonp(n, r) {
						return this.request("JSONP", n, {
							params: new In().append(r, "JSONP_CALLBACK"),
							observe: "body",
							responseType: "json",
						});
					}
					options(n, r = {}) {
						return this.request("OPTIONS", n, r);
					}
					patch(n, r, o = {}) {
						return this.request("PATCH", n, hd(o, r));
					}
					post(n, r, o = {}) {
						return this.request("POST", n, hd(o, r));
					}
					put(n, r, o = {}) {
						return this.request("PUT", n, hd(o, r));
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(pa));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function nC(e, t) {
				return t(e);
			}
			function EO(e, t) {
				return (n, r) => t.intercept(n, { handle: (o) => e(o, r) });
			}
			const bO = new S(""),
				ii = new S(""),
				rC = new S("");
			function SO() {
				let e = null;
				return (t, n) => {
					null === e && (e = (b(bO, { optional: !0 }) ?? []).reduceRight(EO, nC));
					const r = b(Ys),
						o = r.add();
					return e(t, n).pipe(ri(() => r.remove(o)));
				};
			}
			let oC = (() => {
				class e extends pa {
					constructor(n, r) {
						super(),
							(this.backend = n),
							(this.injector = r),
							(this.chain = null),
							(this.pendingTasks = b(Ys));
					}
					handle(n) {
						if (null === this.chain) {
							const o = Array.from(new Set([...this.injector.get(ii), ...this.injector.get(rC, [])]));
							this.chain = o.reduceRight(
								(i, s) =>
									(function _O(e, t, n) {
										return (r, o) => n.runInContext(() => t(r, (i) => e(i, o)));
									})(i, s, this.injector),
								nC,
							);
						}
						const r = this.pendingTasks.add();
						return this.chain(n, (o) => this.backend.handle(o)).pipe(ri(() => this.pendingTasks.remove(r)));
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(ga), I(Lt));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const AO = /^\)\]\}',?\n/;
			let sC = (() => {
				class e {
					constructor(n) {
						this.xhrFactory = n;
					}
					handle(n) {
						if ("JSONP" === n.method) throw new C(-2800, !1);
						const r = this.xhrFactory;
						return (r.ɵloadImpl ? Ie(r.ɵloadImpl()) : O(null)).pipe(
							mt(
								() =>
									new he((i) => {
										const s = r.build();
										if (
											(s.open(n.method, n.urlWithParams),
											n.withCredentials && (s.withCredentials = !0),
											n.headers.forEach((g, y) => s.setRequestHeader(g, y.join(","))),
											n.headers.has("Accept") ||
												s.setRequestHeader("Accept", "application/json, text/plain, */*"),
											!n.headers.has("Content-Type"))
										) {
											const g = n.detectContentTypeHeader();
											null !== g && s.setRequestHeader("Content-Type", g);
										}
										if (n.responseType) {
											const g = n.responseType.toLowerCase();
											s.responseType = "json" !== g ? g : "text";
										}
										const a = n.serializeBody();
										let u = null;
										const c = () => {
												if (null !== u) return u;
												const g = s.statusText || "OK",
													y = new Bt(s.getAllResponseHeaders()),
													D =
														(function RO(e) {
															return "responseURL" in e && e.responseURL
																? e.responseURL
																: /^X-Request-URL:/m.test(e.getAllResponseHeaders())
																? e.getResponseHeader("X-Request-URL")
																: null;
														})(s) || n.url;
												return (
													(u = new fd({
														headers: y,
														status: s.status,
														statusText: g,
														url: D,
													})),
													u
												);
											},
											l = () => {
												let { headers: g, status: y, statusText: D, url: m } = c(),
													_ = null;
												204 !== y &&
													(_ = typeof s.response > "u" ? s.responseText : s.response),
													0 === y && (y = _ ? 200 : 0);
												let N = y >= 200 && y < 300;
												if ("json" === n.responseType && "string" == typeof _) {
													const k = _;
													_ = _.replace(AO, "");
													try {
														_ = "" !== _ ? JSON.parse(_) : null;
													} catch (_e) {
														(_ = k), N && ((N = !1), (_ = { error: _e, text: _ }));
													}
												}
												N
													? (i.next(
															new Gr({
																body: _,
																headers: g,
																status: y,
																statusText: D,
																url: m || void 0,
															}),
													  ),
													  i.complete())
													: i.error(
															new XD({
																error: _,
																headers: g,
																status: y,
																statusText: D,
																url: m || void 0,
															}),
													  );
											},
											d = (g) => {
												const { url: y } = c(),
													D = new XD({
														error: g,
														status: s.status || 0,
														statusText: s.statusText || "Unknown Error",
														url: y || void 0,
													});
												i.error(D);
											};
										let f = !1;
										const h = (g) => {
												f || (i.next(c()), (f = !0));
												let y = { type: ye.DownloadProgress, loaded: g.loaded };
												g.lengthComputable && (y.total = g.total),
													"text" === n.responseType &&
														s.responseText &&
														(y.partialText = s.responseText),
													i.next(y);
											},
											p = (g) => {
												let y = { type: ye.UploadProgress, loaded: g.loaded };
												g.lengthComputable && (y.total = g.total), i.next(y);
											};
										return (
											s.addEventListener("load", l),
											s.addEventListener("error", d),
											s.addEventListener("timeout", d),
											s.addEventListener("abort", d),
											n.reportProgress &&
												(s.addEventListener("progress", h),
												null !== a && s.upload && s.upload.addEventListener("progress", p)),
											s.send(a),
											i.next({ type: ye.Sent }),
											() => {
												s.removeEventListener("error", d),
													s.removeEventListener("abort", d),
													s.removeEventListener("load", l),
													s.removeEventListener("timeout", d),
													n.reportProgress &&
														(s.removeEventListener("progress", h),
														null !== a &&
															s.upload &&
															s.upload.removeEventListener("progress", p)),
													s.readyState !== s.DONE && s.abort();
											}
										);
									}),
							),
						);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(ID));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			const pd = new S("XSRF_ENABLED"),
				aC = new S("XSRF_COOKIE_NAME", { providedIn: "root", factory: () => "XSRF-TOKEN" }),
				uC = new S("XSRF_HEADER_NAME", { providedIn: "root", factory: () => "X-XSRF-TOKEN" });
			class cC {}
			let OO = (() => {
				class e {
					constructor(n, r, o) {
						(this.doc = n),
							(this.platform = r),
							(this.cookieName = o),
							(this.lastCookieString = ""),
							(this.lastToken = null),
							(this.parseCount = 0);
					}
					getToken() {
						if ("server" === this.platform) return null;
						const n = this.doc.cookie || "";
						return (
							n !== this.lastCookieString &&
								(this.parseCount++,
								(this.lastToken = mD(n, this.cookieName)),
								(this.lastCookieString = n)),
							this.lastToken
						);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(it), I(Vn), I(aC));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function PO(e, t) {
				const n = e.url.toLowerCase();
				if (
					!b(pd) ||
					"GET" === e.method ||
					"HEAD" === e.method ||
					n.startsWith("http://") ||
					n.startsWith("https://")
				)
					return t(e);
				const r = b(cC).getToken(),
					o = b(uC);
				return null != r && !e.headers.has(o) && (e = e.clone({ headers: e.headers.set(o, r) })), t(e);
			}
			var re = (() => (
				((re = re || {})[(re.Interceptors = 0)] = "Interceptors"),
				(re[(re.LegacyInterceptors = 1)] = "LegacyInterceptors"),
				(re[(re.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
				(re[(re.NoXsrfProtection = 3)] = "NoXsrfProtection"),
				(re[(re.JsonpSupport = 4)] = "JsonpSupport"),
				(re[(re.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
				(re[(re.Fetch = 6)] = "Fetch"),
				re
			))();
			function Wn(e, t) {
				return { ɵkind: e, ɵproviders: t };
			}
			function FO(...e) {
				const t = [
					JD,
					sC,
					oC,
					{ provide: pa, useExisting: oC },
					{ provide: ga, useExisting: sC },
					{ provide: ii, useValue: PO, multi: !0 },
					{ provide: pd, useValue: !0 },
					{ provide: cC, useClass: OO },
				];
				for (const n of e) t.push(...n.ɵproviders);
				return (function Xu(e) {
					return { ɵproviders: e };
				})(t);
			}
			const lC = new S("LEGACY_INTERCEPTOR_FN");
			let LO = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = yn({ type: e })),
						(e.ɵinj = Wt({
							providers: [
								FO(
									Wn(re.LegacyInterceptors, [
										{ provide: lC, useFactory: SO },
										{ provide: ii, useExisting: lC, multi: !0 },
									]),
								),
							],
						})),
						e
					);
				})(),
				gd = (() => {
					class e {
						constructor(n) {
							this.http = n;
						}
						getAllDogs() {
							return this.http.get("https://dog.ceo/api/breeds/list/all");
						}
						getBreedImages(n) {
							return this.http.get("https://dog.ceo/api/breed/" + n + "/images");
						}
						getSubBreedList(n) {
							return this.http.get("https://dog.ceo/api/breed/" + n + "/list");
						}
						getSubBreedImages(n, r) {
							return this.http.get("https://dog.ceo/api/breed/" + n + "/" + r + "/images");
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(JD));
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			const { isArray: zO } = Array,
				{ getPrototypeOf: GO, prototype: qO, keys: WO } = Object;
			const { isArray: QO } = Array;
			function md(...e) {
				const t = oo(e),
					n = (function sE(e) {
						return J(qa(e)) ? e.pop() : void 0;
					})(e),
					{ args: r, keys: o } = (function ZO(e) {
						if (1 === e.length) {
							const t = e[0];
							if (zO(t)) return { args: t, keys: null };
							if (
								(function YO(e) {
									return e && "object" == typeof e && GO(e) === qO;
								})(t)
							) {
								const n = WO(t);
								return { args: n.map((r) => t[r]), keys: n };
							}
						}
						return { args: e, keys: null };
					})(e);
				if (0 === r.length) return Ie([], t);
				const i = new he(
					(function eP(e, t, n = hn) {
						return (r) => {
							dC(
								t,
								() => {
									const { length: o } = e,
										i = new Array(o);
									let s = o,
										a = o;
									for (let u = 0; u < o; u++)
										dC(
											t,
											() => {
												const c = Ie(e[u], t);
												let l = !1;
												c.subscribe(
													Se(
														r,
														(d) => {
															(i[u] = d), l || ((l = !0), a--), a || r.next(n(i.slice()));
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
						t,
						o
							? (s) =>
									(function JO(e, t) {
										return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
									})(o, s)
							: hn,
					),
				);
				return n
					? i.pipe(
							(function XO(e) {
								return Y((t) =>
									(function KO(e, t) {
										return QO(t) ? e(...t) : e(t);
									})(e, t),
								);
							})(n),
					  )
					: i;
			}
			function dC(e, t, n) {
				e ? qt(n, e, t) : t();
			}
			const va = to(
				(e) =>
					function () {
						e(this), (this.name = "EmptyError"), (this.message = "no elements in sequence");
					},
			);
			function yd(...e) {
				return (function tP() {
					return Jn(1);
				})()(Ie(e, oo(e)));
			}
			function fC(e) {
				return new he((t) => {
					gt(e()).subscribe(t);
				});
			}
			function si(e, t) {
				const n = J(e) ? e : () => e,
					r = (o) => o.error(n());
				return new he(t ? (o) => t.schedule(r, 0, o) : r);
			}
			function vd() {
				return be((e, t) => {
					let n = null;
					e._refCount++;
					const r = Se(t, void 0, void 0, void 0, () => {
						if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (n = null);
						const o = e._connection,
							i = n;
						(n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
					});
					e.subscribe(r), r.closed || (n = e.connect());
				});
			}
			class hC extends he {
				constructor(t, n) {
					super(),
						(this.source = t),
						(this.subjectFactory = n),
						(this._subject = null),
						(this._refCount = 0),
						(this._connection = null),
						Qd(t) && (this.lift = t.lift);
				}
				_subscribe(t) {
					return this.getSubject().subscribe(t);
				}
				getSubject() {
					const t = this._subject;
					return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject;
				}
				_teardown() {
					this._refCount = 0;
					const { _connection: t } = this;
					(this._subject = this._connection = null), t?.unsubscribe();
				}
				connect() {
					let t = this._connection;
					if (!t) {
						t = this._connection = new at();
						const n = this.getSubject();
						t.add(
							this.source.subscribe(
								Se(
									n,
									void 0,
									() => {
										this._teardown(), n.complete();
									},
									(r) => {
										this._teardown(), n.error(r);
									},
									() => this._teardown(),
								),
							),
						),
							t.closed && ((this._connection = null), (t = at.EMPTY));
					}
					return t;
				}
				refCount() {
					return vd()(this);
				}
			}
			function qr(e) {
				return e <= 0
					? () => Tt
					: be((t, n) => {
							let r = 0;
							t.subscribe(
								Se(n, (o) => {
									++r <= e && (n.next(o), e <= r && n.complete());
								}),
							);
					  });
			}
			function Da(e) {
				return be((t, n) => {
					let r = !1;
					t.subscribe(
						Se(
							n,
							(o) => {
								(r = !0), n.next(o);
							},
							() => {
								r || n.next(e), n.complete();
							},
						),
					);
				});
			}
			function pC(e = rP) {
				return be((t, n) => {
					let r = !1;
					t.subscribe(
						Se(
							n,
							(o) => {
								(r = !0), n.next(o);
							},
							() => (r ? n.complete() : n.error(e())),
						),
					);
				});
			}
			function rP() {
				return new va();
			}
			function Zn(e, t) {
				const n = arguments.length >= 2;
				return (r) => r.pipe(e ? ln((o, i) => e(o, i, r)) : hn, qr(1), n ? Da(t) : pC(() => new va()));
			}
			function $e(e, t, n) {
				const r = J(e) || t || n ? { next: e, error: t, complete: n } : e;
				return r
					? be((o, i) => {
							var s;
							null === (s = r.subscribe) || void 0 === s || s.call(r);
							let a = !0;
							o.subscribe(
								Se(
									i,
									(u) => {
										var c;
										null === (c = r.next) || void 0 === c || c.call(r, u), i.next(u);
									},
									() => {
										var u;
										(a = !1), null === (u = r.complete) || void 0 === u || u.call(r), i.complete();
									},
									(u) => {
										var c;
										(a = !1), null === (c = r.error) || void 0 === c || c.call(r, u), i.error(u);
									},
									() => {
										var u, c;
										a && (null === (u = r.unsubscribe) || void 0 === u || u.call(r)),
											null === (c = r.finalize) || void 0 === c || c.call(r);
									},
								),
							);
					  })
					: hn;
			}
			function Yn(e) {
				return be((t, n) => {
					let i,
						r = null,
						o = !1;
					(r = t.subscribe(
						Se(n, void 0, void 0, (s) => {
							(i = gt(e(s, Yn(e)(t)))), r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
						}),
					)),
						o && (r.unsubscribe(), (r = null), i.subscribe(n));
				});
			}
			function Dd(e) {
				return e <= 0
					? () => Tt
					: be((t, n) => {
							let r = [];
							t.subscribe(
								Se(
									n,
									(o) => {
										r.push(o), e < r.length && r.shift();
									},
									() => {
										for (const o of r) n.next(o);
										n.complete();
									},
									void 0,
									() => {
										r = null;
									},
								),
							);
					  });
			}
			const $ = "primary",
				ai = Symbol("RouteTitle");
			class uP {
				constructor(t) {
					this.params = t || {};
				}
				has(t) {
					return Object.prototype.hasOwnProperty.call(this.params, t);
				}
				get(t) {
					if (this.has(t)) {
						const n = this.params[t];
						return Array.isArray(n) ? n[0] : n;
					}
					return null;
				}
				getAll(t) {
					if (this.has(t)) {
						const n = this.params[t];
						return Array.isArray(n) ? n : [n];
					}
					return [];
				}
				get keys() {
					return Object.keys(this.params);
				}
			}
			function Wr(e) {
				return new uP(e);
			}
			function cP(e, t, n) {
				const r = n.path.split("/");
				if (r.length > e.length || ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length)))
					return null;
				const o = {};
				for (let i = 0; i < r.length; i++) {
					const s = r[i],
						a = e[i];
					if (s.startsWith(":")) o[s.substring(1)] = a;
					else if (s !== a.path) return null;
				}
				return { consumed: e.slice(0, r.length), posParams: o };
			}
			function Ut(e, t) {
				const n = e ? Object.keys(e) : void 0,
					r = t ? Object.keys(t) : void 0;
				if (!n || !r || n.length != r.length) return !1;
				let o;
				for (let i = 0; i < n.length; i++) if (((o = n[i]), !gC(e[o], t[o]))) return !1;
				return !0;
			}
			function gC(e, t) {
				if (Array.isArray(e) && Array.isArray(t)) {
					if (e.length !== t.length) return !1;
					const n = [...e].sort(),
						r = [...t].sort();
					return n.every((o, i) => r[i] === o);
				}
				return e === t;
			}
			function mC(e) {
				return e.length > 0 ? e[e.length - 1] : null;
			}
			function Mn(e) {
				return (function UO(e) {
					return !!e && (e instanceof he || (J(e.lift) && J(e.subscribe)));
				})(e)
					? e
					: Hs(e)
					? Ie(Promise.resolve(e))
					: O(e);
			}
			const dP = {
					exact: function DC(e, t, n) {
						if (
							!Qn(e.segments, t.segments) ||
							!Ca(e.segments, t.segments, n) ||
							e.numberOfChildren !== t.numberOfChildren
						)
							return !1;
						for (const r in t.children)
							if (!e.children[r] || !DC(e.children[r], t.children[r], n)) return !1;
						return !0;
					},
					subset: CC,
				},
				yC = {
					exact: function fP(e, t) {
						return Ut(e, t);
					},
					subset: function hP(e, t) {
						return (
							Object.keys(t).length <= Object.keys(e).length &&
							Object.keys(t).every((n) => gC(e[n], t[n]))
						);
					},
					ignored: () => !0,
				};
			function vC(e, t, n) {
				return (
					dP[n.paths](e.root, t.root, n.matrixParams) &&
					yC[n.queryParams](e.queryParams, t.queryParams) &&
					!("exact" === n.fragment && e.fragment !== t.fragment)
				);
			}
			function CC(e, t, n) {
				return wC(e, t, t.segments, n);
			}
			function wC(e, t, n, r) {
				if (e.segments.length > n.length) {
					const o = e.segments.slice(0, n.length);
					return !(!Qn(o, n) || t.hasChildren() || !Ca(o, n, r));
				}
				if (e.segments.length === n.length) {
					if (!Qn(e.segments, n) || !Ca(e.segments, n, r)) return !1;
					for (const o in t.children) if (!e.children[o] || !CC(e.children[o], t.children[o], r)) return !1;
					return !0;
				}
				{
					const o = n.slice(0, e.segments.length),
						i = n.slice(e.segments.length);
					return !!(Qn(e.segments, o) && Ca(e.segments, o, r) && e.children[$]) && wC(e.children[$], t, i, r);
				}
			}
			function Ca(e, t, n) {
				return t.every((r, o) => yC[n](e[o].parameters, r.parameters));
			}
			class Zr {
				constructor(t = new X([], {}), n = {}, r = null) {
					(this.root = t), (this.queryParams = n), (this.fragment = r);
				}
				get queryParamMap() {
					return this._queryParamMap || (this._queryParamMap = Wr(this.queryParams)), this._queryParamMap;
				}
				toString() {
					return mP.serialize(this);
				}
			}
			class X {
				constructor(t, n) {
					(this.segments = t),
						(this.children = n),
						(this.parent = null),
						Object.values(n).forEach((r) => (r.parent = this));
				}
				hasChildren() {
					return this.numberOfChildren > 0;
				}
				get numberOfChildren() {
					return Object.keys(this.children).length;
				}
				toString() {
					return wa(this);
				}
			}
			class ui {
				constructor(t, n) {
					(this.path = t), (this.parameters = n);
				}
				get parameterMap() {
					return this._parameterMap || (this._parameterMap = Wr(this.parameters)), this._parameterMap;
				}
				toString() {
					return bC(this);
				}
			}
			function Qn(e, t) {
				return e.length === t.length && e.every((n, r) => n.path === t[r].path);
			}
			let ci = (() => {
				class e {}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({
						token: e,
						factory: function () {
							return new Cd();
						},
						providedIn: "root",
					})),
					e
				);
			})();
			class Cd {
				parse(t) {
					const n = new MP(t);
					return new Zr(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment());
				}
				serialize(t) {
					const n = `/${li(t.root, !0)}`,
						r = (function DP(e) {
							const t = Object.keys(e)
								.map((n) => {
									const r = e[n];
									return Array.isArray(r)
										? r.map((o) => `${Ea(n)}=${Ea(o)}`).join("&")
										: `${Ea(n)}=${Ea(r)}`;
								})
								.filter((n) => !!n);
							return t.length ? `?${t.join("&")}` : "";
						})(t.queryParams);
					return `${n}${r}${
						"string" == typeof t.fragment
							? `#${(function yP(e) {
									return encodeURI(e);
							  })(t.fragment)}`
							: ""
					}`;
				}
			}
			const mP = new Cd();
			function wa(e) {
				return e.segments.map((t) => bC(t)).join("/");
			}
			function li(e, t) {
				if (!e.hasChildren()) return wa(e);
				if (t) {
					const n = e.children[$] ? li(e.children[$], !1) : "",
						r = [];
					return (
						Object.entries(e.children).forEach(([o, i]) => {
							o !== $ && r.push(`${o}:${li(i, !1)}`);
						}),
						r.length > 0 ? `${n}(${r.join("//")})` : n
					);
				}
				{
					const n = (function gP(e, t) {
						let n = [];
						return (
							Object.entries(e.children).forEach(([r, o]) => {
								r === $ && (n = n.concat(t(o, r)));
							}),
							Object.entries(e.children).forEach(([r, o]) => {
								r !== $ && (n = n.concat(t(o, r)));
							}),
							n
						);
					})(e, (r, o) => (o === $ ? [li(e.children[$], !1)] : [`${o}:${li(r, !1)}`]));
					return 1 === Object.keys(e.children).length && null != e.children[$]
						? `${wa(e)}/${n[0]}`
						: `${wa(e)}/(${n.join("//")})`;
				}
			}
			function EC(e) {
				return encodeURIComponent(e)
					.replace(/%40/g, "@")
					.replace(/%3A/gi, ":")
					.replace(/%24/g, "$")
					.replace(/%2C/gi, ",");
			}
			function Ea(e) {
				return EC(e).replace(/%3B/gi, ";");
			}
			function wd(e) {
				return EC(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
			}
			function _a(e) {
				return decodeURIComponent(e);
			}
			function _C(e) {
				return _a(e.replace(/\+/g, "%20"));
			}
			function bC(e) {
				return `${wd(e.path)}${(function vP(e) {
					return Object.keys(e)
						.map((t) => `;${wd(t)}=${wd(e[t])}`)
						.join("");
				})(e.parameters)}`;
			}
			const CP = /^[^\/()?;#]+/;
			function Ed(e) {
				const t = e.match(CP);
				return t ? t[0] : "";
			}
			const wP = /^[^\/()?;=#]+/,
				_P = /^[^=?&#]+/,
				SP = /^[^&#]+/;
			class MP {
				constructor(t) {
					(this.url = t), (this.remaining = t);
				}
				parseRootSegment() {
					return (
						this.consumeOptional("/"),
						"" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#")
							? new X([], {})
							: new X([], this.parseChildren())
					);
				}
				parseQueryParams() {
					const t = {};
					if (this.consumeOptional("?"))
						do {
							this.parseQueryParam(t);
						} while (this.consumeOptional("&"));
					return t;
				}
				parseFragment() {
					return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
				}
				parseChildren() {
					if ("" === this.remaining) return {};
					this.consumeOptional("/");
					const t = [];
					for (
						this.peekStartsWith("(") || t.push(this.parseSegment());
						this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");

					)
						this.capture("/"), t.push(this.parseSegment());
					let n = {};
					this.peekStartsWith("/(") && (this.capture("/"), (n = this.parseParens(!0)));
					let r = {};
					return (
						this.peekStartsWith("(") && (r = this.parseParens(!1)),
						(t.length > 0 || Object.keys(n).length > 0) && (r[$] = new X(t, n)),
						r
					);
				}
				parseSegment() {
					const t = Ed(this.remaining);
					if ("" === t && this.peekStartsWith(";")) throw new C(4009, !1);
					return this.capture(t), new ui(_a(t), this.parseMatrixParams());
				}
				parseMatrixParams() {
					const t = {};
					for (; this.consumeOptional(";"); ) this.parseParam(t);
					return t;
				}
				parseParam(t) {
					const n = (function EP(e) {
						const t = e.match(wP);
						return t ? t[0] : "";
					})(this.remaining);
					if (!n) return;
					this.capture(n);
					let r = "";
					if (this.consumeOptional("=")) {
						const o = Ed(this.remaining);
						o && ((r = o), this.capture(r));
					}
					t[_a(n)] = _a(r);
				}
				parseQueryParam(t) {
					const n = (function bP(e) {
						const t = e.match(_P);
						return t ? t[0] : "";
					})(this.remaining);
					if (!n) return;
					this.capture(n);
					let r = "";
					if (this.consumeOptional("=")) {
						const s = (function IP(e) {
							const t = e.match(SP);
							return t ? t[0] : "";
						})(this.remaining);
						s && ((r = s), this.capture(r));
					}
					const o = _C(n),
						i = _C(r);
					if (t.hasOwnProperty(o)) {
						let s = t[o];
						Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
					} else t[o] = i;
				}
				parseParens(t) {
					const n = {};
					for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
						const r = Ed(this.remaining),
							o = this.remaining[r.length];
						if ("/" !== o && ")" !== o && ";" !== o) throw new C(4010, !1);
						let i;
						r.indexOf(":") > -1
							? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
							: t && (i = $);
						const s = this.parseChildren();
						(n[i] = 1 === Object.keys(s).length ? s[$] : new X([], s)), this.consumeOptional("//");
					}
					return n;
				}
				peekStartsWith(t) {
					return this.remaining.startsWith(t);
				}
				consumeOptional(t) {
					return !!this.peekStartsWith(t) && ((this.remaining = this.remaining.substring(t.length)), !0);
				}
				capture(t) {
					if (!this.consumeOptional(t)) throw new C(4011, !1);
				}
			}
			function SC(e) {
				return e.segments.length > 0 ? new X([], { [$]: e }) : e;
			}
			function IC(e) {
				const t = {};
				for (const r of Object.keys(e.children)) {
					const i = IC(e.children[r]);
					if (r === $ && 0 === i.segments.length && i.hasChildren())
						for (const [s, a] of Object.entries(i.children)) t[s] = a;
					else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
				}
				return (function TP(e) {
					if (1 === e.numberOfChildren && e.children[$]) {
						const t = e.children[$];
						return new X(e.segments.concat(t.segments), t.children);
					}
					return e;
				})(new X(e.segments, t));
			}
			function Kn(e) {
				return e instanceof Zr;
			}
			function MC(e) {
				let t;
				const o = SC(
					(function n(i) {
						const s = {};
						for (const u of i.children) {
							const c = n(u);
							s[u.outlet] = c;
						}
						const a = new X(i.url, s);
						return i === e && (t = a), a;
					})(e.root),
				);
				return t ?? o;
			}
			function TC(e, t, n, r) {
				let o = e;
				for (; o.parent; ) o = o.parent;
				if (0 === t.length) return _d(o, o, o, n, r);
				const i = (function RP(e) {
					if ("string" == typeof e[0] && 1 === e.length && "/" === e[0]) return new RC(!0, 0, e);
					let t = 0,
						n = !1;
					const r = e.reduce((o, i, s) => {
						if ("object" == typeof i && null != i) {
							if (i.outlets) {
								const a = {};
								return (
									Object.entries(i.outlets).forEach(([u, c]) => {
										a[u] = "string" == typeof c ? c.split("/") : c;
									}),
									[...o, { outlets: a }]
								);
							}
							if (i.segmentPath) return [...o, i.segmentPath];
						}
						return "string" != typeof i
							? [...o, i]
							: 0 === s
							? (i.split("/").forEach((a, u) => {
									(0 == u && "." === a) ||
										(0 == u && "" === a ? (n = !0) : ".." === a ? t++ : "" != a && o.push(a));
							  }),
							  o)
							: [...o, i];
					}, []);
					return new RC(n, t, r);
				})(t);
				if (i.toRoot()) return _d(o, o, new X([], {}), n, r);
				const s = (function NP(e, t, n) {
						if (e.isAbsolute) return new Sa(t, !0, 0);
						if (!n) return new Sa(t, !1, NaN);
						if (null === n.parent) return new Sa(n, !0, 0);
						const r = ba(e.commands[0]) ? 0 : 1;
						return (function xP(e, t, n) {
							let r = e,
								o = t,
								i = n;
							for (; i > o; ) {
								if (((i -= o), (r = r.parent), !r)) throw new C(4005, !1);
								o = r.segments.length;
							}
							return new Sa(r, !1, o - i);
						})(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
					})(i, o, e),
					a = s.processChildren
						? fi(s.segmentGroup, s.index, i.commands)
						: NC(s.segmentGroup, s.index, i.commands);
				return _d(o, s.segmentGroup, a, n, r);
			}
			function ba(e) {
				return "object" == typeof e && null != e && !e.outlets && !e.segmentPath;
			}
			function di(e) {
				return "object" == typeof e && null != e && e.outlets;
			}
			function _d(e, t, n, r, o) {
				let s,
					i = {};
				r &&
					Object.entries(r).forEach(([u, c]) => {
						i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
					}),
					(s = e === t ? n : AC(e, t, n));
				const a = SC(IC(s));
				return new Zr(a, i, o);
			}
			function AC(e, t, n) {
				const r = {};
				return (
					Object.entries(e.children).forEach(([o, i]) => {
						r[o] = i === t ? n : AC(i, t, n);
					}),
					new X(e.segments, r)
				);
			}
			class RC {
				constructor(t, n, r) {
					if (
						((this.isAbsolute = t),
						(this.numberOfDoubleDots = n),
						(this.commands = r),
						t && r.length > 0 && ba(r[0]))
					)
						throw new C(4003, !1);
					const o = r.find(di);
					if (o && o !== mC(r)) throw new C(4004, !1);
				}
				toRoot() {
					return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0];
				}
			}
			class Sa {
				constructor(t, n, r) {
					(this.segmentGroup = t), (this.processChildren = n), (this.index = r);
				}
			}
			function NC(e, t, n) {
				if ((e || (e = new X([], {})), 0 === e.segments.length && e.hasChildren())) return fi(e, t, n);
				const r = (function PP(e, t, n) {
						let r = 0,
							o = t;
						const i = { match: !1, pathIndex: 0, commandIndex: 0 };
						for (; o < e.segments.length; ) {
							if (r >= n.length) return i;
							const s = e.segments[o],
								a = n[r];
							if (di(a)) break;
							const u = `${a}`,
								c = r < n.length - 1 ? n[r + 1] : null;
							if (o > 0 && void 0 === u) break;
							if (u && c && "object" == typeof c && void 0 === c.outlets) {
								if (!OC(u, c, s)) return i;
								r += 2;
							} else {
								if (!OC(u, {}, s)) return i;
								r++;
							}
							o++;
						}
						return { match: !0, pathIndex: o, commandIndex: r };
					})(e, t, n),
					o = n.slice(r.commandIndex);
				if (r.match && r.pathIndex < e.segments.length) {
					const i = new X(e.segments.slice(0, r.pathIndex), {});
					return (i.children[$] = new X(e.segments.slice(r.pathIndex), e.children)), fi(i, 0, o);
				}
				return r.match && 0 === o.length
					? new X(e.segments, {})
					: r.match && !e.hasChildren()
					? bd(e, t, n)
					: r.match
					? fi(e, 0, o)
					: bd(e, t, n);
			}
			function fi(e, t, n) {
				if (0 === n.length) return new X(e.segments, {});
				{
					const r = (function OP(e) {
							return di(e[0]) ? e[0].outlets : { [$]: e };
						})(n),
						o = {};
					if (!r[$] && e.children[$] && 1 === e.numberOfChildren && 0 === e.children[$].segments.length) {
						const i = fi(e.children[$], t, n);
						return new X(e.segments, i.children);
					}
					return (
						Object.entries(r).forEach(([i, s]) => {
							"string" == typeof s && (s = [s]), null !== s && (o[i] = NC(e.children[i], t, s));
						}),
						Object.entries(e.children).forEach(([i, s]) => {
							void 0 === r[i] && (o[i] = s);
						}),
						new X(e.segments, o)
					);
				}
			}
			function bd(e, t, n) {
				const r = e.segments.slice(0, t);
				let o = 0;
				for (; o < n.length; ) {
					const i = n[o];
					if (di(i)) {
						const u = FP(i.outlets);
						return new X(r, u);
					}
					if (0 === o && ba(n[0])) {
						r.push(new ui(e.segments[t].path, xC(n[0]))), o++;
						continue;
					}
					const s = di(i) ? i.outlets[$] : `${i}`,
						a = o < n.length - 1 ? n[o + 1] : null;
					s && a && ba(a) ? (r.push(new ui(s, xC(a))), (o += 2)) : (r.push(new ui(s, {})), o++);
				}
				return new X(r, {});
			}
			function FP(e) {
				const t = {};
				return (
					Object.entries(e).forEach(([n, r]) => {
						"string" == typeof r && (r = [r]), null !== r && (t[n] = bd(new X([], {}), 0, r));
					}),
					t
				);
			}
			function xC(e) {
				const t = {};
				return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
			}
			function OC(e, t, n) {
				return e == n.path && Ut(t, n.parameters);
			}
			const hi = "imperative";
			class zt {
				constructor(t, n) {
					(this.id = t), (this.url = n);
				}
			}
			class Sd extends zt {
				constructor(t, n, r = "imperative", o = null) {
					super(t, n), (this.type = 0), (this.navigationTrigger = r), (this.restoredState = o);
				}
				toString() {
					return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class Xn extends zt {
				constructor(t, n, r) {
					super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
				}
				toString() {
					return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
				}
			}
			class Ia extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
				}
				toString() {
					return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
				}
			}
			class pi extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.reason = r), (this.code = o), (this.type = 16);
				}
			}
			class Id extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.error = r), (this.target = o), (this.type = 3);
				}
				toString() {
					return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
				}
			}
			class kP extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.type = 4);
				}
				toString() {
					return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class LP extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.type = 7);
				}
				toString() {
					return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class jP extends zt {
				constructor(t, n, r, o, i) {
					super(t, n),
						(this.urlAfterRedirects = r),
						(this.state = o),
						(this.shouldActivate = i),
						(this.type = 8);
				}
				toString() {
					return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
				}
			}
			class HP extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.type = 5);
				}
				toString() {
					return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class VP extends zt {
				constructor(t, n, r, o) {
					super(t, n), (this.urlAfterRedirects = r), (this.state = o), (this.type = 6);
				}
				toString() {
					return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
				}
			}
			class $P {
				constructor(t) {
					(this.route = t), (this.type = 9);
				}
				toString() {
					return `RouteConfigLoadStart(path: ${this.route.path})`;
				}
			}
			class BP {
				constructor(t) {
					(this.route = t), (this.type = 10);
				}
				toString() {
					return `RouteConfigLoadEnd(path: ${this.route.path})`;
				}
			}
			class UP {
				constructor(t) {
					(this.snapshot = t), (this.type = 11);
				}
				toString() {
					return `ChildActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class zP {
				constructor(t) {
					(this.snapshot = t), (this.type = 12);
				}
				toString() {
					return `ChildActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class GP {
				constructor(t) {
					(this.snapshot = t), (this.type = 13);
				}
				toString() {
					return `ActivationStart(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class qP {
				constructor(t) {
					(this.snapshot = t), (this.type = 14);
				}
				toString() {
					return `ActivationEnd(path: '${
						(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
					}')`;
				}
			}
			class PC {
				constructor(t, n, r) {
					(this.routerEvent = t), (this.position = n), (this.anchor = r), (this.type = 15);
				}
				toString() {
					return `Scroll(anchor: '${this.anchor}', position: '${
						this.position ? `${this.position[0]}, ${this.position[1]}` : null
					}')`;
				}
			}
			class WP {
				constructor() {
					(this.outlet = null),
						(this.route = null),
						(this.injector = null),
						(this.children = new gi()),
						(this.attachRef = null);
				}
			}
			let gi = (() => {
				class e {
					constructor() {
						this.contexts = new Map();
					}
					onChildOutletCreated(n, r) {
						const o = this.getOrCreateContext(n);
						(o.outlet = r), this.contexts.set(n, o);
					}
					onChildOutletDestroyed(n) {
						const r = this.getContext(n);
						r && ((r.outlet = null), (r.attachRef = null));
					}
					onOutletDeactivated() {
						const n = this.contexts;
						return (this.contexts = new Map()), n;
					}
					onOutletReAttached(n) {
						this.contexts = n;
					}
					getOrCreateContext(n) {
						let r = this.getContext(n);
						return r || ((r = new WP()), this.contexts.set(n, r)), r;
					}
					getContext(n) {
						return this.contexts.get(n) || null;
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			class FC {
				constructor(t) {
					this._root = t;
				}
				get root() {
					return this._root.value;
				}
				parent(t) {
					const n = this.pathFromRoot(t);
					return n.length > 1 ? n[n.length - 2] : null;
				}
				children(t) {
					const n = Md(t, this._root);
					return n ? n.children.map((r) => r.value) : [];
				}
				firstChild(t) {
					const n = Md(t, this._root);
					return n && n.children.length > 0 ? n.children[0].value : null;
				}
				siblings(t) {
					const n = Td(t, this._root);
					return n.length < 2 ? [] : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
				}
				pathFromRoot(t) {
					return Td(t, this._root).map((n) => n.value);
				}
			}
			function Md(e, t) {
				if (e === t.value) return t;
				for (const n of t.children) {
					const r = Md(e, n);
					if (r) return r;
				}
				return null;
			}
			function Td(e, t) {
				if (e === t.value) return [t];
				for (const n of t.children) {
					const r = Td(e, n);
					if (r.length) return r.unshift(t), r;
				}
				return [];
			}
			class dn {
				constructor(t, n) {
					(this.value = t), (this.children = n);
				}
				toString() {
					return `TreeNode(${this.value})`;
				}
			}
			function Yr(e) {
				const t = {};
				return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
			}
			class kC extends FC {
				constructor(t, n) {
					super(t), (this.snapshot = n), Ad(this, t);
				}
				toString() {
					return this.snapshot.toString();
				}
			}
			function LC(e, t) {
				const n = (function ZP(e, t) {
						const s = new Ma([], {}, {}, "", {}, $, t, null, {});
						return new HC("", new dn(s, []));
					})(0, t),
					r = new ut([new ui("", {})]),
					o = new ut({}),
					i = new ut({}),
					s = new ut({}),
					a = new ut(""),
					u = new Tn(r, o, s, a, i, $, t, n.root);
				return (u.snapshot = n.root), new kC(new dn(u, []), n);
			}
			class Tn {
				constructor(t, n, r, o, i, s, a, u) {
					(this.urlSubject = t),
						(this.paramsSubject = n),
						(this.queryParamsSubject = r),
						(this.fragmentSubject = o),
						(this.dataSubject = i),
						(this.outlet = s),
						(this.component = a),
						(this._futureSnapshot = u),
						(this.title = this.dataSubject?.pipe(Y((c) => c[ai])) ?? O(void 0)),
						(this.url = t),
						(this.params = n),
						(this.queryParams = r),
						(this.fragment = o),
						(this.data = i);
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
					return this._paramMap || (this._paramMap = this.params.pipe(Y((t) => Wr(t)))), this._paramMap;
				}
				get queryParamMap() {
					return (
						this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(Y((t) => Wr(t)))),
						this._queryParamMap
					);
				}
				toString() {
					return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
				}
			}
			function jC(e, t = "emptyOnly") {
				const n = e.pathFromRoot;
				let r = 0;
				if ("always" !== t)
					for (r = n.length - 1; r >= 1; ) {
						const o = n[r],
							i = n[r - 1];
						if (o.routeConfig && "" === o.routeConfig.path) r--;
						else {
							if (i.component) break;
							r--;
						}
					}
				return (function YP(e) {
					return e.reduce(
						(t, n) => ({
							params: { ...t.params, ...n.params },
							data: { ...t.data, ...n.data },
							resolve: { ...n.data, ...t.resolve, ...n.routeConfig?.data, ...n._resolvedData },
						}),
						{ params: {}, data: {}, resolve: {} },
					);
				})(n.slice(r));
			}
			class Ma {
				get title() {
					return this.data?.[ai];
				}
				constructor(t, n, r, o, i, s, a, u, c) {
					(this.url = t),
						(this.params = n),
						(this.queryParams = r),
						(this.fragment = o),
						(this.data = i),
						(this.outlet = s),
						(this.component = a),
						(this.routeConfig = u),
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
					return this._paramMap || (this._paramMap = Wr(this.params)), this._paramMap;
				}
				get queryParamMap() {
					return this._queryParamMap || (this._queryParamMap = Wr(this.queryParams)), this._queryParamMap;
				}
				toString() {
					return `Route(url:'${this.url.map((r) => r.toString()).join("/")}', path:'${
						this.routeConfig ? this.routeConfig.path : ""
					}')`;
				}
			}
			class HC extends FC {
				constructor(t, n) {
					super(n), (this.url = t), Ad(this, n);
				}
				toString() {
					return VC(this._root);
				}
			}
			function Ad(e, t) {
				(t.value._routerState = e), t.children.forEach((n) => Ad(e, n));
			}
			function VC(e) {
				const t = e.children.length > 0 ? ` { ${e.children.map(VC).join(", ")} } ` : "";
				return `${e.value}${t}`;
			}
			function Rd(e) {
				if (e.snapshot) {
					const t = e.snapshot,
						n = e._futureSnapshot;
					(e.snapshot = n),
						Ut(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams),
						t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
						Ut(t.params, n.params) || e.paramsSubject.next(n.params),
						(function lP(e, t) {
							if (e.length !== t.length) return !1;
							for (let n = 0; n < e.length; ++n) if (!Ut(e[n], t[n])) return !1;
							return !0;
						})(t.url, n.url) || e.urlSubject.next(n.url),
						Ut(t.data, n.data) || e.dataSubject.next(n.data);
				} else (e.snapshot = e._futureSnapshot), e.dataSubject.next(e._futureSnapshot.data);
			}
			function Nd(e, t) {
				const n =
					Ut(e.params, t.params) &&
					(function pP(e, t) {
						return Qn(e, t) && e.every((n, r) => Ut(n.parameters, t[r].parameters));
					})(e.url, t.url);
				return n && !(!e.parent != !t.parent) && (!e.parent || Nd(e.parent, t.parent));
			}
			let xd = (() => {
				class e {
					constructor() {
						(this.activated = null),
							(this._activatedRoute = null),
							(this.name = $),
							(this.activateEvents = new He()),
							(this.deactivateEvents = new He()),
							(this.attachEvents = new He()),
							(this.detachEvents = new He()),
							(this.parentContexts = b(gi)),
							(this.location = b(_t)),
							(this.changeDetector = b(Tl)),
							(this.environmentInjector = b(Lt)),
							(this.inputBinder = b(Ta, { optional: !0 })),
							(this.supportsBindingToComponentInputs = !0);
					}
					get activatedComponentRef() {
						return this.activated;
					}
					ngOnChanges(n) {
						if (n.name) {
							const { firstChange: r, previousValue: o } = n.name;
							if (r) return;
							this.isTrackedInParentContexts(o) &&
								(this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
								this.initializeOutletWithName();
						}
					}
					ngOnDestroy() {
						this.isTrackedInParentContexts(this.name) &&
							this.parentContexts.onChildOutletDestroyed(this.name),
							this.inputBinder?.unsubscribeFromRouteData(this);
					}
					isTrackedInParentContexts(n) {
						return this.parentContexts.getContext(n)?.outlet === this;
					}
					ngOnInit() {
						this.initializeOutletWithName();
					}
					initializeOutletWithName() {
						if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
						const n = this.parentContexts.getContext(this.name);
						n?.route &&
							(n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector));
					}
					get isActivated() {
						return !!this.activated;
					}
					get component() {
						if (!this.activated) throw new C(4012, !1);
						return this.activated.instance;
					}
					get activatedRoute() {
						if (!this.activated) throw new C(4012, !1);
						return this._activatedRoute;
					}
					get activatedRouteData() {
						return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
					}
					detach() {
						if (!this.activated) throw new C(4012, !1);
						this.location.detach();
						const n = this.activated;
						return (
							(this.activated = null),
							(this._activatedRoute = null),
							this.detachEvents.emit(n.instance),
							n
						);
					}
					attach(n, r) {
						(this.activated = n),
							(this._activatedRoute = r),
							this.location.insert(n.hostView),
							this.inputBinder?.bindActivatedRouteToOutletComponent(this),
							this.attachEvents.emit(n.instance);
					}
					deactivate() {
						if (this.activated) {
							const n = this.component;
							this.activated.destroy(),
								(this.activated = null),
								(this._activatedRoute = null),
								this.deactivateEvents.emit(n);
						}
					}
					activateWith(n, r) {
						if (this.isActivated) throw new C(4013, !1);
						this._activatedRoute = n;
						const o = this.location,
							s = n.snapshot.component,
							a = this.parentContexts.getOrCreateContext(this.name).children,
							u = new QP(n, a, o.injector);
						(this.activated = o.createComponent(s, {
							index: o.length,
							injector: u,
							environmentInjector: r ?? this.environmentInjector,
						})),
							this.changeDetector.markForCheck(),
							this.inputBinder?.bindActivatedRouteToOutletComponent(this),
							this.activateEvents.emit(this.activated.instance);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵdir = Fe({
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
						features: [Fn],
					})),
					e
				);
			})();
			class QP {
				constructor(t, n, r) {
					(this.route = t), (this.childContexts = n), (this.parent = r);
				}
				get(t, n) {
					return t === Tn ? this.route : t === gi ? this.childContexts : this.parent.get(t, n);
				}
			}
			const Ta = new S("");
			let $C = (() => {
				class e {
					constructor() {
						this.outletDataSubscriptions = new Map();
					}
					bindActivatedRouteToOutletComponent(n) {
						this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
					}
					unsubscribeFromRouteData(n) {
						this.outletDataSubscriptions.get(n)?.unsubscribe(), this.outletDataSubscriptions.delete(n);
					}
					subscribeToRouteData(n) {
						const { activatedRoute: r } = n,
							o = md([r.queryParams, r.params, r.data])
								.pipe(
									mt(
										([i, s, a], u) => (
											(a = { ...i, ...s, ...a }), 0 === u ? O(a) : Promise.resolve(a)
										),
									),
								)
								.subscribe((i) => {
									if (
										!n.isActivated ||
										!n.activatedComponentRef ||
										n.activatedRoute !== r ||
										null === r.component
									)
										return void this.unsubscribeFromRouteData(n);
									const s = (function zR(e) {
										const t = Z(e);
										if (!t) return null;
										const n = new jo(t);
										return {
											get selector() {
												return n.selector;
											},
											get type() {
												return n.componentType;
											},
											get inputs() {
												return n.inputs;
											},
											get outputs() {
												return n.outputs;
											},
											get ngContentSelectors() {
												return n.ngContentSelectors;
											},
											get isStandalone() {
												return t.standalone;
											},
											get isSignal() {
												return t.signals;
											},
										};
									})(r.component);
									if (s)
										for (const { templateName: a } of s.inputs)
											n.activatedComponentRef.setInput(a, i[a]);
									else this.unsubscribeFromRouteData(n);
								});
						this.outletDataSubscriptions.set(n, o);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function mi(e, t, n) {
				if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
					const r = n.value;
					r._futureSnapshot = t.value;
					const o = (function XP(e, t, n) {
						return t.children.map((r) => {
							for (const o of n.children)
								if (e.shouldReuseRoute(r.value, o.value.snapshot)) return mi(e, r, o);
							return mi(e, r);
						});
					})(e, t, n);
					return new dn(r, o);
				}
				{
					if (e.shouldAttach(t.value)) {
						const i = e.retrieve(t.value);
						if (null !== i) {
							const s = i.route;
							return (
								(s.value._futureSnapshot = t.value), (s.children = t.children.map((a) => mi(e, a))), s
							);
						}
					}
					const r = (function JP(e) {
							return new Tn(
								new ut(e.url),
								new ut(e.params),
								new ut(e.queryParams),
								new ut(e.fragment),
								new ut(e.data),
								e.outlet,
								e.component,
								e,
							);
						})(t.value),
						o = t.children.map((i) => mi(e, i));
					return new dn(r, o);
				}
			}
			const Od = "ngNavigationCancelingError";
			function BC(e, t) {
				const { redirectTo: n, navigationBehaviorOptions: r } = Kn(t)
						? { redirectTo: t, navigationBehaviorOptions: void 0 }
						: t,
					o = UC(!1, 0, t);
				return (o.url = n), (o.navigationBehaviorOptions = r), o;
			}
			function UC(e, t, n) {
				const r = new Error("NavigationCancelingError: " + (e || ""));
				return (r[Od] = !0), (r.cancellationCode = t), n && (r.url = n), r;
			}
			function zC(e) {
				return GC(e) && Kn(e.url);
			}
			function GC(e) {
				return e && e[Od];
			}
			let qC = (() => {
				class e {}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵcmp = mn({
						type: e,
						selectors: [["ng-component"]],
						standalone: !0,
						features: [Ty],
						decls: 1,
						vars: 0,
						template: function (n, r) {
							1 & n && rn(0, "router-outlet");
						},
						dependencies: [xd],
						encapsulation: 2,
					})),
					e
				);
			})();
			function Pd(e) {
				const t = e.children && e.children.map(Pd),
					n = t ? { ...e, children: t } : { ...e };
				return (
					!n.component &&
						!n.loadComponent &&
						(t || n.loadChildren) &&
						n.outlet &&
						n.outlet !== $ &&
						(n.component = qC),
					n
				);
			}
			function Mt(e) {
				return e.outlet || $;
			}
			function yi(e) {
				if (!e) return null;
				if (e.routeConfig?._injector) return e.routeConfig._injector;
				for (let t = e.parent; t; t = t.parent) {
					const n = t.routeConfig;
					if (n?._loadedInjector) return n._loadedInjector;
					if (n?._injector) return n._injector;
				}
				return null;
			}
			class sF {
				constructor(t, n, r, o, i) {
					(this.routeReuseStrategy = t),
						(this.futureState = n),
						(this.currState = r),
						(this.forwardEvent = o),
						(this.inputBindingEnabled = i);
				}
				activate(t) {
					const n = this.futureState._root,
						r = this.currState ? this.currState._root : null;
					this.deactivateChildRoutes(n, r, t), Rd(this.futureState.root), this.activateChildRoutes(n, r, t);
				}
				deactivateChildRoutes(t, n, r) {
					const o = Yr(n);
					t.children.forEach((i) => {
						const s = i.value.outlet;
						this.deactivateRoutes(i, o[s], r), delete o[s];
					}),
						Object.values(o).forEach((i) => {
							this.deactivateRouteAndItsChildren(i, r);
						});
				}
				deactivateRoutes(t, n, r) {
					const o = t.value,
						i = n ? n.value : null;
					if (o === i)
						if (o.component) {
							const s = r.getContext(o.outlet);
							s && this.deactivateChildRoutes(t, n, s.children);
						} else this.deactivateChildRoutes(t, n, r);
					else i && this.deactivateRouteAndItsChildren(n, r);
				}
				deactivateRouteAndItsChildren(t, n) {
					t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot)
						? this.detachAndStoreRouteSubtree(t, n)
						: this.deactivateRouteAndOutlet(t, n);
				}
				detachAndStoreRouteSubtree(t, n) {
					const r = n.getContext(t.value.outlet),
						o = r && t.value.component ? r.children : n,
						i = Yr(t);
					for (const s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
					if (r && r.outlet) {
						const s = r.outlet.detach(),
							a = r.children.onOutletDeactivated();
						this.routeReuseStrategy.store(t.value.snapshot, { componentRef: s, route: t, contexts: a });
					}
				}
				deactivateRouteAndOutlet(t, n) {
					const r = n.getContext(t.value.outlet),
						o = r && t.value.component ? r.children : n,
						i = Yr(t);
					for (const s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
					r &&
						(r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
						(r.attachRef = null),
						(r.route = null));
				}
				activateChildRoutes(t, n, r) {
					const o = Yr(n);
					t.children.forEach((i) => {
						this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new qP(i.value.snapshot));
					}),
						t.children.length && this.forwardEvent(new zP(t.value.snapshot));
				}
				activateRoutes(t, n, r) {
					const o = t.value,
						i = n ? n.value : null;
					if ((Rd(o), o === i))
						if (o.component) {
							const s = r.getOrCreateContext(o.outlet);
							this.activateChildRoutes(t, n, s.children);
						} else this.activateChildRoutes(t, n, r);
					else if (o.component) {
						const s = r.getOrCreateContext(o.outlet);
						if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
							const a = this.routeReuseStrategy.retrieve(o.snapshot);
							this.routeReuseStrategy.store(o.snapshot, null),
								s.children.onOutletReAttached(a.contexts),
								(s.attachRef = a.componentRef),
								(s.route = a.route.value),
								s.outlet && s.outlet.attach(a.componentRef, a.route.value),
								Rd(a.route.value),
								this.activateChildRoutes(t, null, s.children);
						} else {
							const a = yi(o.snapshot);
							(s.attachRef = null),
								(s.route = o),
								(s.injector = a),
								s.outlet && s.outlet.activateWith(o, s.injector),
								this.activateChildRoutes(t, null, s.children);
						}
					} else this.activateChildRoutes(t, null, r);
				}
			}
			class WC {
				constructor(t) {
					(this.path = t), (this.route = this.path[this.path.length - 1]);
				}
			}
			class Aa {
				constructor(t, n) {
					(this.component = t), (this.route = n);
				}
			}
			function aF(e, t, n) {
				const r = e._root;
				return vi(r, t ? t._root : null, n, [r.value]);
			}
			function Qr(e, t) {
				const n = Symbol(),
					r = t.get(e, n);
				return r === n
					? "function" != typeof e ||
					  (function _E(e) {
							return null !== Ti(e);
					  })(e)
						? t.get(e)
						: e
					: r;
			}
			function vi(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
				const i = Yr(t);
				return (
					e.children.forEach((s) => {
						(function cF(e, t, n, r, o = { canDeactivateChecks: [], canActivateChecks: [] }) {
							const i = e.value,
								s = t ? t.value : null,
								a = n ? n.getContext(e.value.outlet) : null;
							if (s && i.routeConfig === s.routeConfig) {
								const u = (function lF(e, t, n) {
									if ("function" == typeof n) return n(e, t);
									switch (n) {
										case "pathParamsChange":
											return !Qn(e.url, t.url);
										case "pathParamsOrQueryParamsChange":
											return !Qn(e.url, t.url) || !Ut(e.queryParams, t.queryParams);
										case "always":
											return !0;
										case "paramsOrQueryParamsChange":
											return !Nd(e, t) || !Ut(e.queryParams, t.queryParams);
										default:
											return !Nd(e, t);
									}
								})(s, i, i.routeConfig.runGuardsAndResolvers);
								u
									? o.canActivateChecks.push(new WC(r))
									: ((i.data = s.data), (i._resolvedData = s._resolvedData)),
									vi(e, t, i.component ? (a ? a.children : null) : n, r, o),
									u &&
										a &&
										a.outlet &&
										a.outlet.isActivated &&
										o.canDeactivateChecks.push(new Aa(a.outlet.component, s));
							} else
								s && Di(t, a, o),
									o.canActivateChecks.push(new WC(r)),
									vi(e, null, i.component ? (a ? a.children : null) : n, r, o);
						})(s, i[s.value.outlet], n, r.concat([s.value]), o),
							delete i[s.value.outlet];
					}),
					Object.entries(i).forEach(([s, a]) => Di(a, n.getContext(s), o)),
					o
				);
			}
			function Di(e, t, n) {
				const r = Yr(e),
					o = e.value;
				Object.entries(r).forEach(([i, s]) => {
					Di(s, o.component ? (t ? t.children.getContext(i) : null) : t, n);
				}),
					n.canDeactivateChecks.push(
						new Aa(o.component && t && t.outlet && t.outlet.isActivated ? t.outlet.component : null, o),
					);
			}
			function Ci(e) {
				return "function" == typeof e;
			}
			function ZC(e) {
				return e instanceof va || "EmptyError" === e?.name;
			}
			const Ra = Symbol("INITIAL_VALUE");
			function Kr() {
				return mt((e) =>
					md(
						e.map((t) =>
							t.pipe(
								qr(1),
								(function nP(...e) {
									const t = oo(e);
									return be((n, r) => {
										(t ? yd(e, n, t) : yd(e, n)).subscribe(r);
									});
								})(Ra),
							),
						),
					).pipe(
						Y((t) => {
							for (const n of t)
								if (!0 !== n) {
									if (n === Ra) return Ra;
									if (!1 === n || n instanceof Zr) return n;
								}
							return !0;
						}),
						ln((t) => t !== Ra),
						qr(1),
					),
				);
			}
			function YC(e) {
				return (function bw(...e) {
					return Wd(e);
				})(
					$e((t) => {
						if (Kn(t)) throw BC(0, t);
					}),
					Y((t) => !0 === t),
				);
			}
			class Na {
				constructor(t) {
					this.segmentGroup = t || null;
				}
			}
			class QC {
				constructor(t) {
					this.urlTree = t;
				}
			}
			function Xr(e) {
				return si(new Na(e));
			}
			function KC(e) {
				return si(new QC(e));
			}
			class RF {
				constructor(t, n) {
					(this.urlSerializer = t), (this.urlTree = n);
				}
				noMatchError(t) {
					return new C(4002, !1);
				}
				lineralizeSegments(t, n) {
					let r = [],
						o = n.root;
					for (;;) {
						if (((r = r.concat(o.segments)), 0 === o.numberOfChildren)) return O(r);
						if (o.numberOfChildren > 1 || !o.children[$]) return si(new C(4e3, !1));
						o = o.children[$];
					}
				}
				applyRedirectCommands(t, n, r) {
					return this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), t, r);
				}
				applyRedirectCreateUrlTree(t, n, r, o) {
					const i = this.createSegmentGroup(t, n.root, r, o);
					return new Zr(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment);
				}
				createQueryParams(t, n) {
					const r = {};
					return (
						Object.entries(t).forEach(([o, i]) => {
							if ("string" == typeof i && i.startsWith(":")) {
								const a = i.substring(1);
								r[o] = n[a];
							} else r[o] = i;
						}),
						r
					);
				}
				createSegmentGroup(t, n, r, o) {
					const i = this.createSegments(t, n.segments, r, o);
					let s = {};
					return (
						Object.entries(n.children).forEach(([a, u]) => {
							s[a] = this.createSegmentGroup(t, u, r, o);
						}),
						new X(i, s)
					);
				}
				createSegments(t, n, r, o) {
					return n.map((i) =>
						i.path.startsWith(":") ? this.findPosParam(t, i, o) : this.findOrReturn(i, r),
					);
				}
				findPosParam(t, n, r) {
					const o = r[n.path.substring(1)];
					if (!o) throw new C(4001, !1);
					return o;
				}
				findOrReturn(t, n) {
					let r = 0;
					for (const o of n) {
						if (o.path === t.path) return n.splice(r), o;
						r++;
					}
					return t;
				}
			}
			const Fd = {
				matched: !1,
				consumedSegments: [],
				remainingSegments: [],
				parameters: {},
				positionalParamSegments: {},
			};
			function NF(e, t, n, r, o) {
				const i = kd(e, t, n);
				return i.matched
					? ((r = (function eF(e, t) {
							return (
								e.providers && !e._injector && (e._injector = nl(e.providers, t, `Route: ${e.path}`)),
								e._injector ?? t
							);
					  })(t, r)),
					  (function MF(e, t, n, r) {
							const o = t.canMatch;
							return o && 0 !== o.length
								? O(
										o.map((s) => {
											const a = Qr(s, e);
											return Mn(
												(function mF(e) {
													return e && Ci(e.canMatch);
												})(a)
													? a.canMatch(t, n)
													: e.runInContext(() => a(t, n)),
											);
										}),
								  ).pipe(Kr(), YC())
								: O(!0);
					  })(r, t, n).pipe(Y((s) => (!0 === s ? i : { ...Fd }))))
					: O(i);
			}
			function kd(e, t, n) {
				if ("" === t.path)
					return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
						? { ...Fd }
						: {
								matched: !0,
								consumedSegments: [],
								remainingSegments: n,
								parameters: {},
								positionalParamSegments: {},
						  };
				const o = (t.matcher || cP)(n, e, t);
				if (!o) return { ...Fd };
				const i = {};
				Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
					i[a] = u.path;
				});
				const s = o.consumed.length > 0 ? { ...i, ...o.consumed[o.consumed.length - 1].parameters } : i;
				return {
					matched: !0,
					consumedSegments: o.consumed,
					remainingSegments: n.slice(o.consumed.length),
					parameters: s,
					positionalParamSegments: o.posParams ?? {},
				};
			}
			function XC(e, t, n, r) {
				return n.length > 0 &&
					(function PF(e, t, n) {
						return n.some((r) => xa(e, t, r) && Mt(r) !== $);
					})(e, n, r)
					? { segmentGroup: new X(t, OF(r, new X(n, e.children))), slicedSegments: [] }
					: 0 === n.length &&
					  (function FF(e, t, n) {
							return n.some((r) => xa(e, t, r));
					  })(e, n, r)
					? { segmentGroup: new X(e.segments, xF(e, 0, n, r, e.children)), slicedSegments: n }
					: { segmentGroup: new X(e.segments, e.children), slicedSegments: n };
			}
			function xF(e, t, n, r, o) {
				const i = {};
				for (const s of r)
					if (xa(e, n, s) && !o[Mt(s)]) {
						const a = new X([], {});
						i[Mt(s)] = a;
					}
				return { ...o, ...i };
			}
			function OF(e, t) {
				const n = {};
				n[$] = t;
				for (const r of e)
					if ("" === r.path && Mt(r) !== $) {
						const o = new X([], {});
						n[Mt(r)] = o;
					}
				return n;
			}
			function xa(e, t, n) {
				return (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) && "" === n.path;
			}
			class HF {
				constructor(t, n, r, o, i, s, a) {
					(this.injector = t),
						(this.configLoader = n),
						(this.rootComponentType = r),
						(this.config = o),
						(this.urlTree = i),
						(this.paramsInheritanceStrategy = s),
						(this.urlSerializer = a),
						(this.allowRedirects = !0),
						(this.applyRedirects = new RF(this.urlSerializer, this.urlTree));
				}
				noMatchError(t) {
					return new C(4002, !1);
				}
				recognize() {
					const t = XC(this.urlTree.root, [], [], this.config).segmentGroup;
					return this.processSegmentGroup(this.injector, this.config, t, $).pipe(
						Yn((n) => {
							if (n instanceof QC)
								return (this.allowRedirects = !1), (this.urlTree = n.urlTree), this.match(n.urlTree);
							throw n instanceof Na ? this.noMatchError(n) : n;
						}),
						Y((n) => {
							const r = new Ma(
									[],
									Object.freeze({}),
									Object.freeze({ ...this.urlTree.queryParams }),
									this.urlTree.fragment,
									{},
									$,
									this.rootComponentType,
									null,
									{},
								),
								o = new dn(r, n),
								i = new HC("", o),
								s = (function AP(e, t, n = null, r = null) {
									return TC(MC(e), t, n, r);
								})(r, [], this.urlTree.queryParams, this.urlTree.fragment);
							return (
								(s.queryParams = this.urlTree.queryParams),
								(i.url = this.urlSerializer.serialize(s)),
								this.inheritParamsAndData(i._root),
								{ state: i, tree: s }
							);
						}),
					);
				}
				match(t) {
					return this.processSegmentGroup(this.injector, this.config, t.root, $).pipe(
						Yn((r) => {
							throw r instanceof Na ? this.noMatchError(r) : r;
						}),
					);
				}
				inheritParamsAndData(t) {
					const n = t.value,
						r = jC(n, this.paramsInheritanceStrategy);
					(n.params = Object.freeze(r.params)),
						(n.data = Object.freeze(r.data)),
						t.children.forEach((o) => this.inheritParamsAndData(o));
				}
				processSegmentGroup(t, n, r, o) {
					return 0 === r.segments.length && r.hasChildren()
						? this.processChildren(t, n, r)
						: this.processSegment(t, n, r, r.segments, o, !0);
				}
				processChildren(t, n, r) {
					const o = [];
					for (const i of Object.keys(r.children)) "primary" === i ? o.unshift(i) : o.push(i);
					return Ie(o).pipe(
						zr((i) => {
							const s = r.children[i],
								a = (function oF(e, t) {
									const n = e.filter((r) => Mt(r) === t);
									return n.push(...e.filter((r) => Mt(r) !== t)), n;
								})(n, i);
							return this.processSegmentGroup(t, a, s, i);
						}),
						(function iP(e, t) {
							return be(
								(function oP(e, t, n, r, o) {
									return (i, s) => {
										let a = n,
											u = t,
											c = 0;
										i.subscribe(
											Se(
												s,
												(l) => {
													const d = c++;
													(u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
												},
												o &&
													(() => {
														a && s.next(u), s.complete();
													}),
											),
										);
									};
								})(e, t, arguments.length >= 2, !0),
							);
						})((i, s) => (i.push(...s), i)),
						Da(null),
						(function sP(e, t) {
							const n = arguments.length >= 2;
							return (r) =>
								r.pipe(e ? ln((o, i) => e(o, i, r)) : hn, Dd(1), n ? Da(t) : pC(() => new va()));
						})(),
						Te((i) => {
							if (null === i) return Xr(r);
							const s = JC(i);
							return (
								(function VF(e) {
									e.sort((t, n) =>
										t.value.outlet === $
											? -1
											: n.value.outlet === $
											? 1
											: t.value.outlet.localeCompare(n.value.outlet),
									);
								})(s),
								O(s)
							);
						}),
					);
				}
				processSegment(t, n, r, o, i, s) {
					return Ie(n).pipe(
						zr((a) =>
							this.processSegmentAgainstRoute(a._injector ?? t, n, a, r, o, i, s).pipe(
								Yn((u) => {
									if (u instanceof Na) return O(null);
									throw u;
								}),
							),
						),
						Zn((a) => !!a),
						Yn((a) => {
							if (ZC(a))
								return (function LF(e, t, n) {
									return 0 === t.length && !e.children[n];
								})(r, o, i)
									? O([])
									: Xr(r);
							throw a;
						}),
					);
				}
				processSegmentAgainstRoute(t, n, r, o, i, s, a) {
					return (function kF(e, t, n, r) {
						return !!(Mt(e) === r || (r !== $ && xa(t, n, e))) && ("**" === e.path || kd(t, e, n).matched);
					})(r, o, i, s)
						? void 0 === r.redirectTo
							? this.matchSegmentAgainstRoute(t, o, r, i, s, a)
							: a && this.allowRedirects
							? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s)
							: Xr(o)
						: Xr(o);
				}
				expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
					return "**" === o.path
						? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
						: this.expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s);
				}
				expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
					const i = this.applyRedirects.applyRedirectCommands([], r.redirectTo, {});
					return r.redirectTo.startsWith("/")
						? KC(i)
						: this.applyRedirects.lineralizeSegments(r, i).pipe(
								Te((s) => {
									const a = new X(s, {});
									return this.processSegment(t, n, a, s, o, !1);
								}),
						  );
				}
				expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
					const {
						matched: a,
						consumedSegments: u,
						remainingSegments: c,
						positionalParamSegments: l,
					} = kd(n, o, i);
					if (!a) return Xr(n);
					const d = this.applyRedirects.applyRedirectCommands(u, o.redirectTo, l);
					return o.redirectTo.startsWith("/")
						? KC(d)
						: this.applyRedirects
								.lineralizeSegments(o, d)
								.pipe(Te((f) => this.processSegment(t, r, n, f.concat(c), s, !1)));
				}
				matchSegmentAgainstRoute(t, n, r, o, i, s) {
					let a;
					if ("**" === r.path) {
						const u = o.length > 0 ? mC(o).parameters : {};
						(a = O({
							snapshot: new Ma(
								o,
								u,
								Object.freeze({ ...this.urlTree.queryParams }),
								this.urlTree.fragment,
								ew(r),
								Mt(r),
								r.component ?? r._loadedComponent ?? null,
								r,
								tw(r),
							),
							consumedSegments: [],
							remainingSegments: [],
						})),
							(n.children = {});
					} else
						a = NF(n, r, o, t).pipe(
							Y(({ matched: u, consumedSegments: c, remainingSegments: l, parameters: d }) =>
								u
									? {
											snapshot: new Ma(
												c,
												d,
												Object.freeze({ ...this.urlTree.queryParams }),
												this.urlTree.fragment,
												ew(r),
												Mt(r),
												r.component ?? r._loadedComponent ?? null,
												r,
												tw(r),
											),
											consumedSegments: c,
											remainingSegments: l,
									  }
									: null,
							),
						);
					return a.pipe(
						mt((u) =>
							null === u
								? Xr(n)
								: this.getChildConfig((t = r._injector ?? t), r, o).pipe(
										mt(({ routes: c }) => {
											const l = r._loadedInjector ?? t,
												{ snapshot: d, consumedSegments: f, remainingSegments: h } = u,
												{ segmentGroup: p, slicedSegments: g } = XC(n, f, h, c);
											if (0 === g.length && p.hasChildren())
												return this.processChildren(l, c, p).pipe(
													Y((D) => (null === D ? null : [new dn(d, D)])),
												);
											if (0 === c.length && 0 === g.length) return O([new dn(d, [])]);
											const y = Mt(r) === i;
											return this.processSegment(l, c, p, g, y ? $ : i, !0).pipe(
												Y((D) => [new dn(d, D)]),
											);
										}),
								  ),
						),
					);
				}
				getChildConfig(t, n, r) {
					return n.children
						? O({ routes: n.children, injector: t })
						: n.loadChildren
						? void 0 !== n._loadedRoutes
							? O({ routes: n._loadedRoutes, injector: n._loadedInjector })
							: (function IF(e, t, n, r) {
									const o = t.canLoad;
									return void 0 === o || 0 === o.length
										? O(!0)
										: O(
												o.map((s) => {
													const a = Qr(s, e);
													return Mn(
														(function fF(e) {
															return e && Ci(e.canLoad);
														})(a)
															? a.canLoad(t, n)
															: e.runInContext(() => a(t, n)),
													);
												}),
										  ).pipe(Kr(), YC());
							  })(t, n, r).pipe(
									Te((o) =>
										o
											? this.configLoader.loadChildren(t, n).pipe(
													$e((i) => {
														(n._loadedRoutes = i.routes), (n._loadedInjector = i.injector);
													}),
											  )
											: (function AF(e) {
													return si(UC(!1, 3));
											  })(),
									),
							  )
						: O({ routes: [], injector: t });
				}
			}
			function $F(e) {
				const t = e.value.routeConfig;
				return t && "" === t.path;
			}
			function JC(e) {
				const t = [],
					n = new Set();
				for (const r of e) {
					if (!$F(r)) {
						t.push(r);
						continue;
					}
					const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
					void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
				}
				for (const r of n) {
					const o = JC(r.children);
					t.push(new dn(r.value, o));
				}
				return t.filter((r) => !n.has(r));
			}
			function ew(e) {
				return e.data || {};
			}
			function tw(e) {
				return e.resolve || {};
			}
			function nw(e) {
				return "string" == typeof e.title || null === e.title;
			}
			function Ld(e) {
				return mt((t) => {
					const n = e(t);
					return n ? Ie(n).pipe(Y(() => t)) : O(t);
				});
			}
			const Jr = new S("ROUTES");
			let jd = (() => {
				class e {
					constructor() {
						(this.componentLoaders = new WeakMap()),
							(this.childrenLoaders = new WeakMap()),
							(this.compiler = b(wv));
					}
					loadComponent(n) {
						if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
						if (n._loadedComponent) return O(n._loadedComponent);
						this.onLoadStartListener && this.onLoadStartListener(n);
						const r = Mn(n.loadComponent()).pipe(
								Y(rw),
								$e((i) => {
									this.onLoadEndListener && this.onLoadEndListener(n), (n._loadedComponent = i);
								}),
								ri(() => {
									this.componentLoaders.delete(n);
								}),
							),
							o = new hC(r, () => new Gt()).pipe(vd());
						return this.componentLoaders.set(n, o), o;
					}
					loadChildren(n, r) {
						if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
						if (r._loadedRoutes) return O({ routes: r._loadedRoutes, injector: r._loadedInjector });
						this.onLoadStartListener && this.onLoadStartListener(r);
						const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
								Y((a) => {
									this.onLoadEndListener && this.onLoadEndListener(r);
									let u, c;
									return (
										Array.isArray(a)
											? (c = a)
											: ((u = a.create(n).injector),
											  (c = u.get(Jr, [], A.Self | A.Optional).flat())),
										{ routes: c.map(Pd), injector: u }
									);
								}),
								ri(() => {
									this.childrenLoaders.delete(r);
								}),
							),
							s = new hC(i, () => new Gt()).pipe(vd());
						return this.childrenLoaders.set(r, s), s;
					}
					loadModuleFactoryOrRoutes(n) {
						return Mn(n()).pipe(
							Y(rw),
							Te((r) =>
								r instanceof Iy || Array.isArray(r) ? O(r) : Ie(this.compiler.compileModuleAsync(r)),
							),
						);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function rw(e) {
				return (function ZF(e) {
					return e && "object" == typeof e && "default" in e;
				})(e)
					? e.default
					: e;
			}
			let Oa = (() => {
				class e {
					get hasRequestedNavigation() {
						return 0 !== this.navigationId;
					}
					constructor() {
						(this.currentNavigation = null),
							(this.lastSuccessfulNavigation = null),
							(this.events = new Gt()),
							(this.configLoader = b(jd)),
							(this.environmentInjector = b(Lt)),
							(this.urlSerializer = b(ci)),
							(this.rootContexts = b(gi)),
							(this.inputBindingEnabled = null !== b(Ta, { optional: !0 })),
							(this.navigationId = 0),
							(this.afterPreactivation = () => O(void 0)),
							(this.rootComponentType = null),
							(this.configLoader.onLoadEndListener = (o) => this.events.next(new BP(o))),
							(this.configLoader.onLoadStartListener = (o) => this.events.next(new $P(o)));
					}
					complete() {
						this.transitions?.complete();
					}
					handleNavigationRequest(n) {
						const r = ++this.navigationId;
						this.transitions?.next({ ...this.transitions.value, ...n, id: r });
					}
					setupNavigations(n) {
						return (
							(this.transitions = new ut({
								id: 0,
								currentUrlTree: n.currentUrlTree,
								currentRawUrl: n.currentUrlTree,
								extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
								urlAfterRedirects: n.urlHandlingStrategy.extract(n.currentUrlTree),
								rawUrl: n.currentUrlTree,
								extras: {},
								resolve: null,
								reject: null,
								promise: Promise.resolve(!0),
								source: hi,
								restoredState: null,
								currentSnapshot: n.routerState.snapshot,
								targetSnapshot: null,
								currentRouterState: n.routerState,
								targetRouterState: null,
								guards: { canActivateChecks: [], canDeactivateChecks: [] },
								guardsResult: null,
							})),
							this.transitions.pipe(
								ln((r) => 0 !== r.id),
								Y((r) => ({ ...r, extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl) })),
								mt((r) => {
									let o = !1,
										i = !1;
									return O(r).pipe(
										$e((s) => {
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
										mt((s) => {
											const a = n.browserUrlTree.toString(),
												u =
													!n.navigated ||
													s.extractedUrl.toString() !== a ||
													a !== n.currentUrlTree.toString();
											if (
												!u &&
												"reload" !== (s.extras.onSameUrlNavigation ?? n.onSameUrlNavigation)
											) {
												const l = "";
												return (
													this.events.next(new pi(s.id, n.serializeUrl(r.rawUrl), l, 0)),
													(n.rawUrlTree = s.rawUrl),
													s.resolve(null),
													Tt
												);
											}
											if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
												return (
													ow(s.source) && (n.browserUrlTree = s.extractedUrl),
													O(s).pipe(
														mt((l) => {
															const d = this.transitions?.getValue();
															return (
																this.events.next(
																	new Sd(
																		l.id,
																		this.urlSerializer.serialize(l.extractedUrl),
																		l.source,
																		l.restoredState,
																	),
																),
																d !== this.transitions?.getValue()
																	? Tt
																	: Promise.resolve(l)
															);
														}),
														(function BF(e, t, n, r, o, i) {
															return Te((s) =>
																(function jF(e, t, n, r, o, i, s = "emptyOnly") {
																	return new HF(e, t, n, r, o, s, i).recognize();
																})(e, t, n, r, s.extractedUrl, o, i).pipe(
																	Y(({ state: a, tree: u }) => ({
																		...s,
																		targetSnapshot: a,
																		urlAfterRedirects: u,
																	})),
																),
															);
														})(
															this.environmentInjector,
															this.configLoader,
															this.rootComponentType,
															n.config,
															this.urlSerializer,
															n.paramsInheritanceStrategy,
														),
														$e((l) => {
															if (
																((r.targetSnapshot = l.targetSnapshot),
																(r.urlAfterRedirects = l.urlAfterRedirects),
																(this.currentNavigation = {
																	...this.currentNavigation,
																	finalUrl: l.urlAfterRedirects,
																}),
																"eager" === n.urlUpdateStrategy)
															) {
																if (!l.extras.skipLocationChange) {
																	const f = n.urlHandlingStrategy.merge(
																		l.urlAfterRedirects,
																		l.rawUrl,
																	);
																	n.setBrowserUrl(f, l);
																}
																n.browserUrlTree = l.urlAfterRedirects;
															}
															const d = new kP(
																l.id,
																this.urlSerializer.serialize(l.extractedUrl),
																this.urlSerializer.serialize(l.urlAfterRedirects),
																l.targetSnapshot,
															);
															this.events.next(d);
														}),
													)
												);
											if (u && n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)) {
												const {
														id: l,
														extractedUrl: d,
														source: f,
														restoredState: h,
														extras: p,
													} = s,
													g = new Sd(l, this.urlSerializer.serialize(d), f, h);
												this.events.next(g);
												const y = LC(0, this.rootComponentType).snapshot;
												return O(
													(r = {
														...s,
														targetSnapshot: y,
														urlAfterRedirects: d,
														extras: { ...p, skipLocationChange: !1, replaceUrl: !1 },
													}),
												);
											}
											{
												const l = "";
												return (
													this.events.next(
														new pi(s.id, n.serializeUrl(r.extractedUrl), l, 1),
													),
													(n.rawUrlTree = s.rawUrl),
													s.resolve(null),
													Tt
												);
											}
										}),
										$e((s) => {
											const a = new LP(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
											);
											this.events.next(a);
										}),
										Y(
											(s) =>
												(r = {
													...s,
													guards: aF(s.targetSnapshot, s.currentSnapshot, this.rootContexts),
												}),
										),
										(function vF(e, t) {
											return Te((n) => {
												const {
													targetSnapshot: r,
													currentSnapshot: o,
													guards: { canActivateChecks: i, canDeactivateChecks: s },
												} = n;
												return 0 === s.length && 0 === i.length
													? O({ ...n, guardsResult: !0 })
													: (function DF(e, t, n, r) {
															return Ie(e).pipe(
																Te((o) =>
																	(function SF(e, t, n, r, o) {
																		const i =
																			t && t.routeConfig
																				? t.routeConfig.canDeactivate
																				: null;
																		return i && 0 !== i.length
																			? O(
																					i.map((a) => {
																						const u = yi(t) ?? o,
																							c = Qr(a, u);
																						return Mn(
																							(function gF(e) {
																								return (
																									e &&
																									Ci(e.canDeactivate)
																								);
																							})(c)
																								? c.canDeactivate(
																										e,
																										t,
																										n,
																										r,
																								  )
																								: u.runInContext(() =>
																										c(e, t, n, r),
																								  ),
																						).pipe(Zn());
																					}),
																			  ).pipe(Kr())
																			: O(!0);
																	})(o.component, o.route, n, t, r),
																),
																Zn((o) => !0 !== o, !0),
															);
													  })(s, r, o, e).pipe(
															Te((a) =>
																a &&
																(function dF(e) {
																	return "boolean" == typeof e;
																})(a)
																	? (function CF(e, t, n, r) {
																			return Ie(t).pipe(
																				zr((o) =>
																					yd(
																						(function EF(e, t) {
																							return (
																								null !== e &&
																									t &&
																									t(new UP(e)),
																								O(!0)
																							);
																						})(o.route.parent, r),
																						(function wF(e, t) {
																							return (
																								null !== e &&
																									t &&
																									t(new GP(e)),
																								O(!0)
																							);
																						})(o.route, r),
																						(function bF(e, t, n) {
																							const r = t[t.length - 1],
																								i = t
																									.slice(
																										0,
																										t.length - 1,
																									)
																									.reverse()
																									.map((s) =>
																										(function uF(
																											e,
																										) {
																											const t =
																												e.routeConfig
																													? e
																															.routeConfig
																															.canActivateChild
																													: null;
																											return t &&
																												0 !==
																													t.length
																												? {
																														node: e,
																														guards: t,
																												  }
																												: null;
																										})(s),
																									)
																									.filter(
																										(s) =>
																											null !== s,
																									)
																									.map((s) =>
																										fC(() =>
																											O(
																												s.guards.map(
																													(
																														u,
																													) => {
																														const c =
																																yi(
																																	s.node,
																																) ??
																																n,
																															l =
																																Qr(
																																	u,
																																	c,
																																);
																														return Mn(
																															(function pF(
																																e,
																															) {
																																return (
																																	e &&
																																	Ci(
																																		e.canActivateChild,
																																	)
																																);
																															})(
																																l,
																															)
																																? l.canActivateChild(
																																		r,
																																		e,
																																  )
																																: c.runInContext(
																																		() =>
																																			l(
																																				r,
																																				e,
																																			),
																																  ),
																														).pipe(
																															Zn(),
																														);
																													},
																												),
																											).pipe(
																												Kr(),
																											),
																										),
																									);
																							return O(i).pipe(Kr());
																						})(e, o.path, n),
																						(function _F(e, t, n) {
																							const r = t.routeConfig
																								? t.routeConfig
																										.canActivate
																								: null;
																							if (!r || 0 === r.length)
																								return O(!0);
																							const o = r.map((i) =>
																								fC(() => {
																									const s =
																											yi(t) ?? n,
																										a = Qr(i, s);
																									return Mn(
																										(function hF(
																											e,
																										) {
																											return (
																												e &&
																												Ci(
																													e.canActivate,
																												)
																											);
																										})(a)
																											? a.canActivate(
																													t,
																													e,
																											  )
																											: s.runInContext(
																													() =>
																														a(
																															t,
																															e,
																														),
																											  ),
																									).pipe(Zn());
																								}),
																							);
																							return O(o).pipe(Kr());
																						})(e, o.route, n),
																					),
																				),
																				Zn((o) => !0 !== o, !0),
																			);
																	  })(r, i, e, t)
																	: O(a),
															),
															Y((a) => ({ ...n, guardsResult: a })),
													  );
											});
										})(this.environmentInjector, (s) => this.events.next(s)),
										$e((s) => {
											if (((r.guardsResult = s.guardsResult), Kn(s.guardsResult)))
												throw BC(0, s.guardsResult);
											const a = new jP(
												s.id,
												this.urlSerializer.serialize(s.extractedUrl),
												this.urlSerializer.serialize(s.urlAfterRedirects),
												s.targetSnapshot,
												!!s.guardsResult,
											);
											this.events.next(a);
										}),
										ln(
											(s) =>
												!!s.guardsResult ||
												(n.restoreHistory(s), this.cancelNavigationTransition(s, "", 3), !1),
										),
										Ld((s) => {
											if (s.guards.canActivateChecks.length)
												return O(s).pipe(
													$e((a) => {
														const u = new HP(
															a.id,
															this.urlSerializer.serialize(a.extractedUrl),
															this.urlSerializer.serialize(a.urlAfterRedirects),
															a.targetSnapshot,
														);
														this.events.next(u);
													}),
													mt((a) => {
														let u = !1;
														return O(a).pipe(
															(function UF(e, t) {
																return Te((n) => {
																	const {
																		targetSnapshot: r,
																		guards: { canActivateChecks: o },
																	} = n;
																	if (!o.length) return O(n);
																	let i = 0;
																	return Ie(o).pipe(
																		zr((s) =>
																			(function zF(e, t, n, r) {
																				const o = e.routeConfig,
																					i = e._resolve;
																				return (
																					void 0 !== o?.title &&
																						!nw(o) &&
																						(i[ai] = o.title),
																					(function GF(e, t, n, r) {
																						const o = (function qF(e) {
																							return [
																								...Object.keys(e),
																								...Object.getOwnPropertySymbols(
																									e,
																								),
																							];
																						})(e);
																						if (0 === o.length)
																							return O({});
																						const i = {};
																						return Ie(o).pipe(
																							Te((s) =>
																								(function WF(
																									e,
																									t,
																									n,
																									r,
																								) {
																									const o =
																											yi(t) ?? r,
																										i = Qr(e, o);
																									return Mn(
																										i.resolve
																											? i.resolve(
																													t,
																													n,
																											  )
																											: o.runInContext(
																													() =>
																														i(
																															t,
																															n,
																														),
																											  ),
																									);
																								})(e[s], t, n, r).pipe(
																									Zn(),
																									$e((a) => {
																										i[s] = a;
																									}),
																								),
																							),
																							Dd(1),
																							(function aP(e) {
																								return Y(() => e);
																							})(i),
																							Yn((s) =>
																								ZC(s) ? Tt : si(s),
																							),
																						);
																					})(i, e, t, r).pipe(
																						Y(
																							(s) => (
																								(e._resolvedData = s),
																								(e.data = jC(
																									e,
																									n,
																								).resolve),
																								o &&
																									nw(o) &&
																									(e.data[ai] =
																										o.title),
																								null
																							),
																						),
																					)
																				);
																			})(s.route, r, e, t),
																		),
																		$e(() => i++),
																		Dd(1),
																		Te((s) => (i === o.length ? O(n) : Tt)),
																	);
																});
															})(n.paramsInheritanceStrategy, this.environmentInjector),
															$e({
																next: () => (u = !0),
																complete: () => {
																	u ||
																		(n.restoreHistory(a),
																		this.cancelNavigationTransition(a, "", 2));
																},
															}),
														);
													}),
													$e((a) => {
														const u = new VP(
															a.id,
															this.urlSerializer.serialize(a.extractedUrl),
															this.urlSerializer.serialize(a.urlAfterRedirects),
															a.targetSnapshot,
														);
														this.events.next(u);
													}),
												);
										}),
										Ld((s) => {
											const a = (u) => {
												const c = [];
												u.routeConfig?.loadComponent &&
													!u.routeConfig._loadedComponent &&
													c.push(
														this.configLoader.loadComponent(u.routeConfig).pipe(
															$e((l) => {
																u.component = l;
															}),
															Y(() => {}),
														),
													);
												for (const l of u.children) c.push(...a(l));
												return c;
											};
											return md(a(s.targetSnapshot.root)).pipe(Da(), qr(1));
										}),
										Ld(() => this.afterPreactivation()),
										Y((s) => {
											const a = (function KP(e, t, n) {
												const r = mi(e, t._root, n ? n._root : void 0);
												return new kC(r, t);
											})(n.routeReuseStrategy, s.targetSnapshot, s.currentRouterState);
											return (r = { ...s, targetRouterState: a });
										}),
										$e((s) => {
											(n.currentUrlTree = s.urlAfterRedirects),
												(n.rawUrlTree = n.urlHandlingStrategy.merge(
													s.urlAfterRedirects,
													s.rawUrl,
												)),
												(n.routerState = s.targetRouterState),
												"deferred" === n.urlUpdateStrategy &&
													(s.extras.skipLocationChange || n.setBrowserUrl(n.rawUrlTree, s),
													(n.browserUrlTree = s.urlAfterRedirects));
										}),
										((e, t, n, r) =>
											Y(
												(o) => (
													new sF(t, o.targetRouterState, o.currentRouterState, n, r).activate(
														e,
													),
													o
												),
											))(
											this.rootContexts,
											n.routeReuseStrategy,
											(s) => this.events.next(s),
											this.inputBindingEnabled,
										),
										qr(1),
										$e({
											next: (s) => {
												(o = !0),
													(this.lastSuccessfulNavigation = this.currentNavigation),
													(n.navigated = !0),
													this.events.next(
														new Xn(
															s.id,
															this.urlSerializer.serialize(s.extractedUrl),
															this.urlSerializer.serialize(n.currentUrlTree),
														),
													),
													n.titleStrategy?.updateTitle(s.targetRouterState.snapshot),
													s.resolve(!0);
											},
											complete: () => {
												o = !0;
											},
										}),
										ri(() => {
											o || i || this.cancelNavigationTransition(r, "", 1),
												this.currentNavigation?.id === r.id && (this.currentNavigation = null);
										}),
										Yn((s) => {
											if (((i = !0), GC(s))) {
												zC(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
												const a = new Ia(
													r.id,
													this.urlSerializer.serialize(r.extractedUrl),
													s.message,
													s.cancellationCode,
												);
												if ((this.events.next(a), zC(s))) {
													const u = n.urlHandlingStrategy.merge(s.url, n.rawUrlTree),
														c = {
															skipLocationChange: r.extras.skipLocationChange,
															replaceUrl: "eager" === n.urlUpdateStrategy || ow(r.source),
														};
													n.scheduleNavigation(u, hi, null, c, {
														resolve: r.resolve,
														reject: r.reject,
														promise: r.promise,
													});
												} else r.resolve(!1);
											} else {
												n.restoreHistory(r, !0);
												const a = new Id(
													r.id,
													this.urlSerializer.serialize(r.extractedUrl),
													s,
													r.targetSnapshot ?? void 0,
												);
												this.events.next(a);
												try {
													r.resolve(n.errorHandler(s));
												} catch (u) {
													r.reject(u);
												}
											}
											return Tt;
										}),
									);
								}),
							)
						);
					}
					cancelNavigationTransition(n, r, o) {
						const i = new Ia(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
						this.events.next(i), n.resolve(!1);
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			function ow(e) {
				return e !== hi;
			}
			let iw = (() => {
					class e {
						buildTitle(n) {
							let r,
								o = n.root;
							for (; void 0 !== o; )
								(r = this.getResolvedTitleForRoute(o) ?? r),
									(o = o.children.find((i) => i.outlet === $));
							return r;
						}
						getResolvedTitleForRoute(n) {
							return n.data[ai];
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({
							token: e,
							factory: function () {
								return b(YF);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				YF = (() => {
					class e extends iw {
						constructor(n) {
							super(), (this.title = n);
						}
						updateTitle(n) {
							const r = this.buildTitle(n);
							void 0 !== r && this.title.setTitle(r);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(I(zD));
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				QF = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({
							token: e,
							factory: function () {
								return b(XF);
							},
							providedIn: "root",
						})),
						e
					);
				})();
			class KF {
				shouldDetach(t) {
					return !1;
				}
				store(t, n) {}
				shouldAttach(t) {
					return !1;
				}
				retrieve(t) {
					return null;
				}
				shouldReuseRoute(t, n) {
					return t.routeConfig === n.routeConfig;
				}
			}
			let XF = (() => {
				class e extends KF {}
				return (
					(e.ɵfac = (function () {
						let t;
						return function (r) {
							return (
								t ||
								(t = (function Nh(e) {
									return Zt(() => {
										const t = e.prototype.constructor,
											n = t[Yt] || Iu(t),
											r = Object.prototype;
										let o = Object.getPrototypeOf(e.prototype).constructor;
										for (; o && o !== r; ) {
											const i = o[Yt] || Iu(o);
											if (i && i !== n) return i;
											o = Object.getPrototypeOf(o);
										}
										return (i) => new i();
									});
								})(e))
							)(r || e);
						};
					})()),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const Pa = new S("", { providedIn: "root", factory: () => ({}) });
			let JF = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({
							token: e,
							factory: function () {
								return b(e1);
							},
							providedIn: "root",
						})),
						e
					);
				})(),
				e1 = (() => {
					class e {
						shouldProcessUrl(n) {
							return !0;
						}
						extract(n) {
							return n;
						}
						merge(n, r) {
							return n;
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})();
			var st = (() => (
				((st = st || {})[(st.COMPLETE = 0)] = "COMPLETE"),
				(st[(st.FAILED = 1)] = "FAILED"),
				(st[(st.REDIRECTING = 2)] = "REDIRECTING"),
				st
			))();
			function sw(e, t) {
				e.events
					.pipe(
						ln((n) => n instanceof Xn || n instanceof Ia || n instanceof Id || n instanceof pi),
						Y((n) =>
							n instanceof Xn || n instanceof pi
								? st.COMPLETE
								: n instanceof Ia && (0 === n.code || 1 === n.code)
								? st.REDIRECTING
								: st.FAILED,
						),
						ln((n) => n !== st.REDIRECTING),
						qr(1),
					)
					.subscribe(() => {
						t();
					});
			}
			function t1(e) {
				throw e;
			}
			function n1(e, t, n) {
				return t.parse("/");
			}
			const r1 = { paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact" },
				o1 = { paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset" };
			let pt = (() => {
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
								(this.console = b(Cv)),
								(this.isNgZoneEnabled = !1),
								(this.options = b(Pa, { optional: !0 }) || {}),
								(this.pendingTasks = b(Ys)),
								(this.errorHandler = this.options.errorHandler || t1),
								(this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || n1),
								(this.navigated = !1),
								(this.lastSuccessfulId = -1),
								(this.urlHandlingStrategy = b(JF)),
								(this.routeReuseStrategy = b(QF)),
								(this.titleStrategy = b(iw)),
								(this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore"),
								(this.paramsInheritanceStrategy =
									this.options.paramsInheritanceStrategy || "emptyOnly"),
								(this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred"),
								(this.canceledNavigationResolution =
									this.options.canceledNavigationResolution || "replace"),
								(this.config = b(Jr, { optional: !0 })?.flat() ?? []),
								(this.navigationTransitions = b(Oa)),
								(this.urlSerializer = b(ci)),
								(this.location = b(Hl)),
								(this.componentInputBindingEnabled = !!b(Ta, { optional: !0 })),
								(this.isNgZoneEnabled = b(se) instanceof se && se.isInAngularZone()),
								this.resetConfig(this.config),
								(this.currentUrlTree = new Zr()),
								(this.rawUrlTree = this.currentUrlTree),
								(this.browserUrlTree = this.currentUrlTree),
								(this.routerState = LC(0, null)),
								this.navigationTransitions.setupNavigations(this).subscribe(
									(n) => {
										(this.lastSuccessfulId = n.id), (this.currentPageId = this.browserPageId ?? 0);
									},
									(n) => {
										this.console.warn(`Unhandled Navigation Error: ${n}`);
									},
								);
						}
						resetRootComponentType(n) {
							(this.routerState.root.component = n), (this.navigationTransitions.rootComponentType = n);
						}
						initialNavigation() {
							if (
								(this.setUpLocationChangeListener(), !this.navigationTransitions.hasRequestedNavigation)
							) {
								const n = this.location.getState();
								this.navigateToSyncWithBrowser(this.location.path(!0), hi, n);
							}
						}
						setUpLocationChangeListener() {
							this.locationSubscription ||
								(this.locationSubscription = this.location.subscribe((n) => {
									const r = "popstate" === n.type ? "popstate" : "hashchange";
									"popstate" === r &&
										setTimeout(() => {
											this.navigateToSyncWithBrowser(n.url, r, n.state);
										}, 0);
								}));
						}
						navigateToSyncWithBrowser(n, r, o) {
							const i = { replaceUrl: !0 },
								s = o?.navigationId ? o : null;
							if (o) {
								const u = { ...o };
								delete u.navigationId,
									delete u.ɵrouterPageId,
									0 !== Object.keys(u).length && (i.state = u);
							}
							const a = this.parseUrl(n);
							this.scheduleNavigation(a, r, s, i);
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
						resetConfig(n) {
							(this.config = n.map(Pd)), (this.navigated = !1), (this.lastSuccessfulId = -1);
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
						createUrlTree(n, r = {}) {
							const {
									relativeTo: o,
									queryParams: i,
									fragment: s,
									queryParamsHandling: a,
									preserveFragment: u,
								} = r,
								c = u ? this.currentUrlTree.fragment : s;
							let d,
								l = null;
							switch (a) {
								case "merge":
									l = { ...this.currentUrlTree.queryParams, ...i };
									break;
								case "preserve":
									l = this.currentUrlTree.queryParams;
									break;
								default:
									l = i || null;
							}
							null !== l && (l = this.removeEmptyProps(l));
							try {
								d = MC(o ? o.snapshot : this.routerState.snapshot.root);
							} catch {
								("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
									(d = this.currentUrlTree.root);
							}
							return TC(d, n, l, c ?? null);
						}
						navigateByUrl(n, r = { skipLocationChange: !1 }) {
							const o = Kn(n) ? n : this.parseUrl(n),
								i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
							return this.scheduleNavigation(i, hi, null, r);
						}
						navigate(n, r = { skipLocationChange: !1 }) {
							return (
								(function i1(e) {
									for (let t = 0; t < e.length; t++) if (null == e[t]) throw new C(4008, !1);
								})(n),
								this.navigateByUrl(this.createUrlTree(n, r), r)
							);
						}
						serializeUrl(n) {
							return this.urlSerializer.serialize(n);
						}
						parseUrl(n) {
							let r;
							try {
								r = this.urlSerializer.parse(n);
							} catch (o) {
								r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
							}
							return r;
						}
						isActive(n, r) {
							let o;
							if (((o = !0 === r ? { ...r1 } : !1 === r ? { ...o1 } : r), Kn(n)))
								return vC(this.currentUrlTree, n, o);
							const i = this.parseUrl(n);
							return vC(this.currentUrlTree, i, o);
						}
						removeEmptyProps(n) {
							return Object.keys(n).reduce((r, o) => {
								const i = n[o];
								return null != i && (r[o] = i), r;
							}, {});
						}
						scheduleNavigation(n, r, o, i, s) {
							if (this.disposed) return Promise.resolve(!1);
							let a, u, c;
							s
								? ((a = s.resolve), (u = s.reject), (c = s.promise))
								: (c = new Promise((d, f) => {
										(a = d), (u = f);
								  }));
							const l = this.pendingTasks.add();
							return (
								sw(this, () => {
									queueMicrotask(() => this.pendingTasks.remove(l));
								}),
								this.navigationTransitions.handleNavigationRequest({
									source: r,
									restoredState: o,
									currentUrlTree: this.currentUrlTree,
									currentRawUrl: this.currentUrlTree,
									rawUrl: n,
									extras: i,
									resolve: a,
									reject: u,
									promise: c,
									currentSnapshot: this.routerState.snapshot,
									currentRouterState: this.routerState,
								}),
								c.catch((d) => Promise.reject(d))
							);
						}
						setBrowserUrl(n, r) {
							const o = this.urlSerializer.serialize(n);
							if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
								const s = {
									...r.extras.state,
									...this.generateNgRouterState(r.id, this.browserPageId),
								};
								this.location.replaceState(o, "", s);
							} else {
								const i = {
									...r.extras.state,
									...this.generateNgRouterState(r.id, (this.browserPageId ?? 0) + 1),
								};
								this.location.go(o, "", i);
							}
						}
						restoreHistory(n, r = !1) {
							if ("computed" === this.canceledNavigationResolution) {
								const i = this.currentPageId - (this.browserPageId ?? this.currentPageId);
								0 !== i
									? this.location.historyGo(i)
									: this.currentUrlTree === this.getCurrentNavigation()?.finalUrl &&
									  0 === i &&
									  (this.resetState(n),
									  (this.browserUrlTree = n.currentUrlTree),
									  this.resetUrlToCurrentUrlTree());
							} else
								"replace" === this.canceledNavigationResolution &&
									(r && this.resetState(n), this.resetUrlToCurrentUrlTree());
						}
						resetState(n) {
							(this.routerState = n.currentRouterState),
								(this.currentUrlTree = n.currentUrlTree),
								(this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.rawUrl));
						}
						resetUrlToCurrentUrlTree() {
							this.location.replaceState(
								this.urlSerializer.serialize(this.rawUrlTree),
								"",
								this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
							);
						}
						generateNgRouterState(n, r) {
							return "computed" === this.canceledNavigationResolution
								? { navigationId: n, ɵrouterPageId: r }
								: { navigationId: n };
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
						e
					);
				})(),
				eo = (() => {
					class e {
						constructor(n, r, o, i, s, a) {
							(this.router = n),
								(this.route = r),
								(this.tabIndexAttribute = o),
								(this.renderer = i),
								(this.el = s),
								(this.locationStrategy = a),
								(this.href = null),
								(this.commands = null),
								(this.onChanges = new Gt()),
								(this.preserveFragment = !1),
								(this.skipLocationChange = !1),
								(this.replaceUrl = !1);
							const u = s.nativeElement.tagName?.toLowerCase();
							(this.isAnchorElement = "a" === u || "area" === u),
								this.isAnchorElement
									? (this.subscription = n.events.subscribe((c) => {
											c instanceof Xn && this.updateHref();
									  }))
									: this.setTabIndexIfNotOnNativeEl("0");
						}
						setTabIndexIfNotOnNativeEl(n) {
							null != this.tabIndexAttribute ||
								this.isAnchorElement ||
								this.applyAttributeValue("tabindex", n);
						}
						ngOnChanges(n) {
							this.isAnchorElement && this.updateHref(), this.onChanges.next(this);
						}
						set routerLink(n) {
							null != n
								? ((this.commands = Array.isArray(n) ? n : [n]), this.setTabIndexIfNotOnNativeEl("0"))
								: ((this.commands = null), this.setTabIndexIfNotOnNativeEl(null));
						}
						onClick(n, r, o, i, s) {
							return (
								!!(
									null === this.urlTree ||
									(this.isAnchorElement &&
										(0 !== n ||
											r ||
											o ||
											i ||
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
							const n =
								null === this.href
									? null
									: (function Rp(e, t, n) {
											return (function MS(e, t) {
												return ("src" === t &&
													("embed" === e ||
														"frame" === e ||
														"iframe" === e ||
														"media" === e ||
														"script" === e)) ||
													("href" === t && ("base" === e || "link" === e))
													? Ap
													: ms;
											})(
												t,
												n,
											)(e);
									  })(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
							this.applyAttributeValue("href", n);
						}
						applyAttributeValue(n, r) {
							const o = this.renderer,
								i = this.el.nativeElement;
							null !== r ? o.setAttribute(i, n, r) : o.removeAttribute(i, n);
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
						(e.ɵfac = function (n) {
							return new (n || e)(
								M(pt),
								M(Tn),
								(function Ki(e) {
									return (function Q_(e, t) {
										if ("class" === t) return e.classes;
										if ("style" === t) return e.styles;
										const n = e.attrs;
										if (n) {
											const r = n.length;
											let o = 0;
											for (; o < r; ) {
												const i = n[o];
												if (Tf(i)) break;
												if (0 === i) o += 2;
												else if ("number" == typeof i)
													for (o++; o < r && "string" == typeof n[o]; ) o++;
												else {
													if (i === t) return n[o + 1];
													o += 2;
												}
											}
										}
										return null;
									})(Ae(), e);
								})("tabindex"),
								M(Ss),
								M(En),
								M(qn),
							);
						}),
						(e.ɵdir = Fe({
							type: e,
							selectors: [["", "routerLink", ""]],
							hostVars: 1,
							hostBindings: function (n, r) {
								1 & n &&
									$c("click", function (i) {
										return r.onClick(i.button, i.ctrlKey, i.shiftKey, i.altKey, i.metaKey);
									}),
									2 & n && Nc("target", r.target);
							},
							inputs: {
								target: "target",
								queryParams: "queryParams",
								fragment: "fragment",
								queryParamsHandling: "queryParamsHandling",
								state: "state",
								relativeTo: "relativeTo",
								preserveFragment: ["preserveFragment", "preserveFragment", Fl],
								skipLocationChange: ["skipLocationChange", "skipLocationChange", Fl],
								replaceUrl: ["replaceUrl", "replaceUrl", Fl],
								routerLink: "routerLink",
							},
							standalone: !0,
							features: [Hg, Fn],
						})),
						e
					);
				})(),
				Fa = (() => {
					class e {
						get isActive() {
							return this._isActive;
						}
						constructor(n, r, o, i, s) {
							(this.router = n),
								(this.element = r),
								(this.renderer = o),
								(this.cdr = i),
								(this.link = s),
								(this.classes = []),
								(this._isActive = !1),
								(this.routerLinkActiveOptions = { exact: !1 }),
								(this.isActiveChange = new He()),
								(this.routerEventsSubscription = n.events.subscribe((a) => {
									a instanceof Xn && this.update();
								}));
						}
						ngAfterContentInit() {
							O(this.links.changes, O(null))
								.pipe(Jn())
								.subscribe((n) => {
									this.update(), this.subscribeToEachLinkOnChanges();
								});
						}
						subscribeToEachLinkOnChanges() {
							this.linkInputChangesSubscription?.unsubscribe();
							const n = [...this.links.toArray(), this.link].filter((r) => !!r).map((r) => r.onChanges);
							this.linkInputChangesSubscription = Ie(n)
								.pipe(Jn())
								.subscribe((r) => {
									this._isActive !== this.isLinkActive(this.router)(r) && this.update();
								});
						}
						set routerLinkActive(n) {
							const r = Array.isArray(n) ? n : n.split(" ");
							this.classes = r.filter((o) => !!o);
						}
						ngOnChanges(n) {
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
									const n = this.hasActiveLinks();
									this._isActive !== n &&
										((this._isActive = n),
										this.cdr.markForCheck(),
										this.classes.forEach((r) => {
											n
												? this.renderer.addClass(this.element.nativeElement, r)
												: this.renderer.removeClass(this.element.nativeElement, r);
										}),
										n && void 0 !== this.ariaCurrentWhenActive
											? this.renderer.setAttribute(
													this.element.nativeElement,
													"aria-current",
													this.ariaCurrentWhenActive.toString(),
											  )
											: this.renderer.removeAttribute(this.element.nativeElement, "aria-current"),
										this.isActiveChange.emit(n));
								});
						}
						isLinkActive(n) {
							const r = (function s1(e) {
								return !!e.paths;
							})(this.routerLinkActiveOptions)
								? this.routerLinkActiveOptions
								: this.routerLinkActiveOptions.exact || !1;
							return (o) => !!o.urlTree && n.isActive(o.urlTree, r);
						}
						hasActiveLinks() {
							const n = this.isLinkActive(this.router);
							return (this.link && n(this.link)) || this.links.some(n);
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(M(pt), M(En), M(Ss), M(Tl), M(eo, 8));
						}),
						(e.ɵdir = Fe({
							type: e,
							selectors: [["", "routerLinkActive", ""]],
							contentQueries: function (n, r, o) {
								if ((1 & n && Jy(o, eo, 5), 2 & n)) {
									let i;
									Xy(
										(i = (function ev() {
											return (function RA(e, t) {
												return e[Nt].queries[t].queryList;
											})(v(), dh());
										})()),
									) && (r.links = i);
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
							features: [Fn],
						})),
						e
					);
				})();
			class aw {}
			let a1 = (() => {
				class e {
					constructor(n, r, o, i, s) {
						(this.router = n), (this.injector = o), (this.preloadingStrategy = i), (this.loader = s);
					}
					setUpPreloading() {
						this.subscription = this.router.events
							.pipe(
								ln((n) => n instanceof Xn),
								zr(() => this.preload()),
							)
							.subscribe(() => {});
					}
					preload() {
						return this.processRoutes(this.injector, this.router.config);
					}
					ngOnDestroy() {
						this.subscription && this.subscription.unsubscribe();
					}
					processRoutes(n, r) {
						const o = [];
						for (const i of r) {
							i.providers && !i._injector && (i._injector = nl(i.providers, n, `Route: ${i.path}`));
							const s = i._injector ?? n,
								a = i._loadedInjector ?? s;
							((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
								(i.loadComponent && !i._loadedComponent)) &&
								o.push(this.preloadConfig(s, i)),
								(i.children || i._loadedRoutes) &&
									o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
						}
						return Ie(o).pipe(Jn());
					}
					preloadConfig(n, r) {
						return this.preloadingStrategy.preload(r, () => {
							let o;
							o = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(n, r) : O(null);
							const i = o.pipe(
								Te((s) =>
									null === s
										? O(void 0)
										: ((r._loadedRoutes = s.routes),
										  (r._loadedInjector = s.injector),
										  this.processRoutes(s.injector ?? n, s.routes)),
								),
							);
							return r.loadComponent && !r._loadedComponent
								? Ie([i, this.loader.loadComponent(r)]).pipe(Jn())
								: i;
						});
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(pt), I(wv), I(Lt), I(aw), I(jd));
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac, providedIn: "root" })),
					e
				);
			})();
			const Hd = new S("");
			let uw = (() => {
				class e {
					constructor(n, r, o, i, s = {}) {
						(this.urlSerializer = n),
							(this.transitions = r),
							(this.viewportScroller = o),
							(this.zone = i),
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
						return this.transitions.events.subscribe((n) => {
							n instanceof Sd
								? ((this.store[this.lastId] = this.viewportScroller.getScrollPosition()),
								  (this.lastSource = n.navigationTrigger),
								  (this.restoredId = n.restoredState ? n.restoredState.navigationId : 0))
								: n instanceof Xn
								? ((this.lastId = n.id),
								  this.scheduleScrollEvent(n, this.urlSerializer.parse(n.urlAfterRedirects).fragment))
								: n instanceof pi &&
								  0 === n.code &&
								  ((this.lastSource = void 0),
								  (this.restoredId = 0),
								  this.scheduleScrollEvent(n, this.urlSerializer.parse(n.url).fragment));
						});
					}
					consumeScrollEvents() {
						return this.transitions.events.subscribe((n) => {
							n instanceof PC &&
								(n.position
									? "top" === this.options.scrollPositionRestoration
										? this.viewportScroller.scrollToPosition([0, 0])
										: "enabled" === this.options.scrollPositionRestoration &&
										  this.viewportScroller.scrollToPosition(n.position)
									: n.anchor && "enabled" === this.options.anchorScrolling
									? this.viewportScroller.scrollToAnchor(n.anchor)
									: "disabled" !== this.options.scrollPositionRestoration &&
									  this.viewportScroller.scrollToPosition([0, 0]));
						});
					}
					scheduleScrollEvent(n, r) {
						this.zone.runOutsideAngular(() => {
							setTimeout(() => {
								this.zone.run(() => {
									this.transitions.events.next(
										new PC(
											n,
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
					(e.ɵfac = function (n) {
						!(function fg() {
							throw new Error("invalid");
						})();
					}),
					(e.ɵprov = T({ token: e, factory: e.ɵfac })),
					e
				);
			})();
			function fn(e, t) {
				return { ɵkind: e, ɵproviders: t };
			}
			function lw() {
				const e = b(tn);
				return (t) => {
					const n = e.get(Br);
					if (t !== n.components[0]) return;
					const r = e.get(pt),
						o = e.get(dw);
					1 === e.get(Vd) && r.initialNavigation(),
						e.get(fw, null, A.Optional)?.setUpPreloading(),
						e.get(Hd, null, A.Optional)?.init(),
						r.resetRootComponentType(n.componentTypes[0]),
						o.closed || (o.next(), o.complete(), o.unsubscribe());
				};
			}
			const dw = new S("", { factory: () => new Gt() }),
				Vd = new S("", { providedIn: "root", factory: () => 1 }),
				fw = new S("");
			function d1(e) {
				return fn(0, [
					{ provide: fw, useExisting: a1 },
					{ provide: aw, useExisting: e },
				]);
			}
			const hw = new S("ROUTER_FORROOT_GUARD"),
				h1 = [
					Hl,
					{ provide: ci, useClass: Cd },
					pt,
					gi,
					{
						provide: Tn,
						useFactory: function cw(e) {
							return e.routerState.root;
						},
						deps: [pt],
					},
					jd,
					[],
				];
			function p1() {
				return new xv("Router", pt);
			}
			let pw = (() => {
				class e {
					constructor(n) {}
					static forRoot(n, r) {
						return {
							ngModule: e,
							providers: [
								h1,
								[],
								{ provide: Jr, multi: !0, useValue: n },
								{ provide: hw, useFactory: v1, deps: [[pt, new es(), new ts()]] },
								{ provide: Pa, useValue: r || {} },
								r?.useHash ? { provide: qn, useClass: YR } : { provide: qn, useClass: sD },
								{
									provide: Hd,
									useFactory: () => {
										const e = b(px),
											t = b(se),
											n = b(Pa),
											r = b(Oa),
											o = b(ci);
										return n.scrollOffset && e.setOffset(n.scrollOffset), new uw(o, r, e, t, n);
									},
								},
								r?.preloadingStrategy ? d1(r.preloadingStrategy).ɵproviders : [],
								{ provide: xv, multi: !0, useFactory: p1 },
								r?.initialNavigation ? D1(r) : [],
								r?.bindToComponentInputs
									? fn(8, [$C, { provide: Ta, useExisting: $C }]).ɵproviders
									: [],
								[
									{ provide: gw, useFactory: lw },
									{ provide: Il, multi: !0, useExisting: gw },
								],
							],
						};
					}
					static forChild(n) {
						return { ngModule: e, providers: [{ provide: Jr, multi: !0, useValue: n }] };
					}
				}
				return (
					(e.ɵfac = function (n) {
						return new (n || e)(I(hw, 8));
					}),
					(e.ɵmod = yn({ type: e })),
					(e.ɵinj = Wt({})),
					e
				);
			})();
			function v1(e) {
				return "guarded";
			}
			function D1(e) {
				return [
					"disabled" === e.initialNavigation
						? fn(3, [
								{
									provide: vl,
									multi: !0,
									useFactory: () => {
										const t = b(pt);
										return () => {
											t.setUpLocationChangeListener();
										};
									},
								},
								{ provide: Vd, useValue: 2 },
						  ]).ɵproviders
						: [],
					"enabledBlocking" === e.initialNavigation
						? fn(2, [
								{ provide: Vd, useValue: 0 },
								{
									provide: vl,
									multi: !0,
									deps: [tn],
									useFactory: (t) => {
										const n = t.get(WR, Promise.resolve());
										return () =>
											n.then(
												() =>
													new Promise((r) => {
														const o = t.get(pt),
															i = t.get(dw);
														sw(o, () => {
															r(!0);
														}),
															(t.get(Oa).afterPreactivation = () => (
																r(!0), i.closed ? O(void 0) : i
															)),
															o.initialNavigation();
													}),
											);
									},
								},
						  ]).ɵproviders
						: [],
				];
			}
			const gw = new S(""),
				w1 = function (e) {
					return ["/dogs/breed", e];
				};
			function E1(e, t) {
				if ((1 & e && (Ye(0, "li")(1, "a", 1), on(2), Qe()()), 2 & e)) {
					const n = t.$implicit;
					Ct(1), Pr("routerLink", Fy(2, w1, n)), Ct(1), kr(n);
				}
			}
			let _1 = (() => {
					class e {
						constructor(n) {
							(this.apiService = n), (this.breedList = []);
						}
						ngOnInit() {
							this.prepareAllDogs();
						}
						prepareAllDogs() {
							this.apiService.getAllDogs().subscribe({
								next: (n) => {
									this.breedList = Object.keys(n.message);
								},
								error: (n) => {
									console.error("Error fetching dogs list:", n);
								},
							});
						}
					}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)(M(gd));
						}),
						(e.ɵcmp = mn({
							type: e,
							selectors: [["app-dog-list"]],
							decls: 4,
							vars: 1,
							consts: [
								[4, "ngFor", "ngForOf"],
								["routerLinkActive", "active", "ariaCurrentWhenActive", "page", 3, "routerLink"],
							],
							template: function (n, r) {
								1 & n &&
									(Ye(0, "ul")(1, "h1"),
									on(2, "Dogs (breeds) list"),
									Qe(),
									Lc(3, E1, 3, 4, "li", 0),
									Qe()),
									2 & n && (Ct(3), Pr("ngForOf", r.breedList));
							},
							dependencies: [Ql, eo, Fa],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center;color:#e0005e}"],
						})),
						e
					);
				})(),
				$d = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = mn({
							type: e,
							selectors: [["app-all-dogs-button"]],
							decls: 3,
							vars: 0,
							consts: [
								["routerLink", "/dogs", "routerLinkActive", "active", "ariaCurrentWhenActive", "page"],
							],
							template: function (n, r) {
								1 & n && (Ye(0, "a", 0)(1, "button"), on(2, "All Dogs"), Qe()());
							},
							dependencies: [eo, Fa],
							styles: [
								"button[_ngcontent-%COMP%]{width:100px;height:50px;color:#fff;font-size:20px;background-color:#00f}",
							],
						})),
						e
					);
				})();
			const b1 = function (e, t) {
				return ["/dogs/breed/", e, t];
			};
			function S1(e, t) {
				if ((1 & e && (Ye(0, "li")(1, "a", 3), on(2), Qe()()), 2 & e)) {
					const n = t.$implicit,
						r = um();
					Ct(1), Pr("routerLink", ky(2, b1, r.breedName, n)), Ct(1), kr(n);
				}
			}
			const I1 = [
				{ path: "", redirectTo: "dogs", pathMatch: "full" },
				{ path: "dogs", component: _1 },
				{
					path: "dogs/breed/:breedName",
					component: (() => {
						class e {
							constructor(n, r) {
								(this.apiService = n),
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
								this.activatedRoute.paramMap.subscribe((n) => {
									this.breedName = n.get("breedName");
								}),
									this.prepareBreed(),
									this.prepareSubBreedList();
							}
							prepareBreed() {
								this.apiService.getBreedImages(this.breedName).subscribe({
									next: (n) => {
										this.imageURL = n.message[0];
									},
									error: (n) => {
										console.error("Error fetching dogs:", n),
											(this.breedName = this.breedName + " breed doesn't exist!"),
											(this.isVisible = !1);
									},
								});
							}
							prepareSubBreedList() {
								this.apiService.getSubBreedList(this.breedName).subscribe({
									next: (n) => {
										this.subBreedList = n.message;
									},
									error: (n) => {
										console.error("Error fetching dog sub-breed:", n);
									},
								});
							}
						}
						return (
							(e.ɵfac = function (n) {
								return new (n || e)(M(gd), M(Tn));
							}),
							(e.ɵcmp = mn({
								type: e,
								selectors: [["app-breed"]],
								decls: 9,
								vars: 3,
								consts: [
									[3, "src"],
									["hidden", "isVisible"],
									[4, "ngFor", "ngForOf"],
									["routerLinkActive", "active", "ariaCurrentWhenActive", "page", 3, "routerLink"],
								],
								template: function (n, r) {
									1 & n &&
										(Ye(0, "div"),
										rn(1, "app-all-dogs-button"),
										Ye(2, "h1"),
										on(3),
										Qe(),
										rn(4, "img", 0),
										Ye(5, "h2", 1),
										on(6, "Sub breeds:"),
										Qe(),
										Ye(7, "ul"),
										Lc(8, S1, 3, 5, "li", 2),
										Qe()()),
										2 & n &&
											(Ct(3),
											kr(r.breedName),
											Ct(1),
											Vs("src", r.imageURL, ms),
											Ct(4),
											Pr("ngForOf", r.subBreedList));
								},
								dependencies: [Ql, eo, Fa, $d],
								styles: ["h1[_ngcontent-%COMP%]{color:#e0005e}"],
							})),
							e
						);
					})(),
				},
				{
					path: "dogs/breed/:breedName/:subBreedName",
					component: (() => {
						class e {
							constructor(n, r) {
								(this.apiService = n),
									(this.activatedRoute = r),
									(this.breedName = ""),
									(this.subBreedName = ""),
									(this.imageURL = "");
							}
							ngOnInit() {
								this.prepareNamesFromURL(), this.prepareSubBreed();
							}
							prepareNamesFromURL() {
								this.activatedRoute.paramMap.subscribe((n) => {
									(this.breedName = n.get("breedName")), (this.subBreedName = n.get("subBreedName"));
								});
							}
							prepareSubBreed() {
								this.apiService.getSubBreedImages(this.breedName, this.subBreedName).subscribe({
									next: (n) => {
										this.imageURL = n.message[1];
									},
									error: (n) => {
										console.error("Error fetching dogs:", n),
											(this.subBreedName = this.subBreedName + " sub breed doesn't exist!");
									},
								});
							}
						}
						return (
							(e.ɵfac = function (n) {
								return new (n || e)(M(gd), M(Tn));
							}),
							(e.ɵcmp = mn({
								type: e,
								selectors: [["app-sub-breed"]],
								decls: 5,
								vars: 2,
								consts: [[3, "src"]],
								template: function (n, r) {
									1 & n &&
										(Ye(0, "div"),
										rn(1, "app-all-dogs-button"),
										Ye(2, "h1"),
										on(3),
										Qe(),
										rn(4, "img", 0),
										Qe()),
										2 & n && (Ct(3), kr(r.subBreedName), Ct(1), Vs("src", r.imageURL, ms));
								},
								dependencies: [$d],
								styles: ["h1[_ngcontent-%COMP%]{color:#e0005e}"],
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
							(e.ɵfac = function (n) {
								return new (n || e)();
							}),
							(e.ɵcmp = mn({
								type: e,
								selectors: [["app-error"]],
								decls: 3,
								vars: 0,
								template: function (n, r) {
									1 & n && (Ye(0, "h1"), on(1, "404 Not found"), Qe(), rn(2, "app-all-dogs-button"));
								},
								dependencies: [$d],
								styles: ["h1[_ngcontent-%COMP%]{font-size:30px}"],
							})),
							e
						);
					})(),
				},
				{ path: "**", redirectTo: "/error" },
			];
			let M1 = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = yn({ type: e })),
						(e.ɵinj = Wt({ imports: [pw.forRoot(I1), pw] })),
						e
					);
				})(),
				T1 = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵcmp = mn({
							type: e,
							selectors: [["app-root"]],
							decls: 1,
							vars: 0,
							template: function (n, r) {
								1 & n && rn(0, "router-outlet");
							},
							dependencies: [xd],
							styles: ["h1[_ngcontent-%COMP%]{text-align:center}"],
						})),
						e
					);
				})(),
				A1 = (() => {
					class e {}
					return (
						(e.ɵfac = function (n) {
							return new (n || e)();
						}),
						(e.ɵmod = yn({ type: e, bootstrap: [T1] })),
						(e.ɵinj = Wt({ imports: [aO, M1, LO] })),
						e
					);
				})();
			iO()
				.bootstrapModule(A1)
				.catch((e) => console.error(e));
		},
	},
	(J) => {
		J((J.s = 56));
	},
]);
