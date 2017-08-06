/**
 * JavaScript Library
 * Author: Alexandr Drozd
 * Copyright: Evaax.
 *
 */
 
(function(_d, _w, _n){
	
	'use strict';
	
	_n.getUserMedia = _n.getUserMedia || _n.webkitGetUserMedia || _n.mozGetUserMedia || _n.msGetUserMedia;
	_w.URL = _w.URL || _w.webkitURL || _w.mozURL || _w.msURL;
	
	/**
	* Методы для работы с массивами
	*/
	var Eva = function(a,b,c){
		[].push.apply(this, $.type(a, 'string') ? (
				(c = a.match(/^<(\w+)\/?>$/)) ? [_d.createElement(c[1])] : /(<([^>]+)>)/i.test(a) ? $.parseHTML(a) : _d.querySelectorAll(a)
			) : a.length >= 0 && a !== _w ? a : typeof a === 'object' ? [a] : []
		);
		if(c && $.type(b, 'object')){
			for(let k in b){
				if($.type(this[k], 'function'))
					this[k](b[k]);
				else
					this.attr(k, b[k]);
			}
		}
	}, InsertCb = function(a,b,c){
		var j = '';
		a.replace(/<script(.*?)>([\s\S]*?)<\/script>/gmi, function(a,b,c){
			j += c;
		});
		setTimeout(function(){
			if($.type(c, 'function'))
				c.apply(b, [h]);
				if(j){
					var s = _d.createElement('script');
					s.text = j;
					_d.head.appendChild(s).parentNode.removeChild(s);	
				}
		}, 0);
	};

	_w.$ = function(a, b){
		return $.type(a, 'object') && a.eva ? a : /^f/.test(typeof a) ? (
			/c/.test(_d.readyState) ? a.apply(_d, [$]) : _w.addEventListener('load', a, false)
		) : new Eva(a, b);
	};
	
	$.fn = Eva.prototype = {
		eva: 'v 5.0',
		
		/**
		* Обработчики событий
		*/
		
		// Добавление в DOM
		ready: function(a){
			if(/^f/.test(typeof a)){
				if(/c/.test(this.readyState))
					a.apply(this, [$]);
				else
					this.bind('DOMContentLoaded', a);
			}
			return this;
		},
		visible: function(c){
			var a, e, k = {
				hidden: 'visibilitychange',
				webkitHidden: 'webkitvisibilitychange',
				mozHidden: 'mozvisibilitychange',
				msHidden: 'msvisibilitychange'
			};
			for (a in k) {
				if (a in _d) {
					e = k[a];
					break;
				}
			}
			if(c) this.bind(e, function(){
				c(/^v/.test(_d.visibilityState));
			});
			return !_d[a];
		},
		scroll: function(a,b){
			return this.bind('scroll', a, b);
		},
        resize: function(a){
            return this.bind('resize', a);
        },
        focus: function(a){
			return a ? this.bind('focus', a) : this[0].focus();
        },
        blur: function(a) {
			return a ? this.bind('blur', a) : this.emit('blur');
        },
        emit: function(a, b){
			return this.each(function(){
				this.dispatchEvent(new Event(a, (b || {
					bubbles: true,
					cancelable: true
				})));
			});
        },
		click: function(a){
            return a ? this.bind('click', a) : this.each(function(){
				this.click();
			});
		},
        change: function(cb){
            return this.bind('change', cb);
        },
		bind: function (a, b, c){
			if(!b) return this;
			var t = a.split(/\s+/);
			for(let i = 0; i < t.length; i++){
				this.each(function(g, e){
					if(!e.events) e.events = {};
					if(!e.events[t[i]])
						e.events[t[i]] = [];
					if(c) $(e).unbind(t[i]);
					if(!b.name || !$.inArr(b, e.events[t[i]])){
						if(!e.events[t[i]]) e.events[t[i]] = [];
						e.events[t[i]].push(b);
					}
					e.addEventListener(t[i], b, false);
				});
			}
			return this;
		},
		unbind: function(act, b){
			function remove(t, a, e){
				if(!e) return this;
				for(let i = 0; i < e.length; i++){
					if(!b || (b && e[i] === b)){
						t.removeEventListener(a, e[i], false);
					}
				}
				if(!b) delete t.events[a];
			}
			function each(a){
				this.each(function(){
					var e = this.events || {};
					if(!a){
						for(let n in e)
							remove(this, n, e[n]);	
					} else
						remove(this, a, e[a]);
				});
			}
			if(arguments.length){
				var t = act.split(/\s+/);
				for(let i = 0; i < t.length; i++)
					each.apply(this, [t[i]]);
			} else
				each.apply(this);
			return this;
		},
		
		/**
		* Манипуляции с атрибутами
		*/
        attr: function(a, b){
			if(typeof a === 'object'){
				for(let i in a) this.attr(i, a[i]);
				return this;
			} else if(arguments.length > 1){
				return this.each(function(){
					this.setAttribute(a, b);
				});
			} else
				return this.length ? this[0].getAttribute(a) : this;
        },
		removeAttr: function(a){
			if(typeof a === 'object'){
				for(let i in a) this.removeAttr(i, a[i]);
				return this;
			} else {
				return this.each(function(){
					this.removeAttribute(a);
				});	
			}
		},
		replaceAttr: function(a, b){
			return this.each(function(i, e){
				var v = e.getAttribute(a);
				if(v != null) e.setAttribute(b, v);
				e.removeAttribute(a);
			});
		},
		hasAttr: function(a){
			return this[0].hasAttribute(a);
		},
		
		/**
		* Манипуляции с стилями
		*/
		hide: function(a){
			return this.each(function(){
				this.style.display = 'none';
			});
		},
		show: function(a){
			return this.each(function(){
				this.style.display = 'block';
			});
		},
		css: function(a, b){
			if($.type(a, 'object')){
				for(let p in a){
					this.each(function(){
						this.style[p] = a[p];
					});
				}
				return this;
			} else {
				return b === []._ ? this[0].style[a] || getComputedStyle(this[0])[a] : this.each(function(){
					return this.style[a] = b;
				});
			}
		},
		
		/**
		* Анимации
		*/
		fadeIn: function(a, b){
			return this.each(function(i, e){
				e.style.display = 'block';
				e.style.opacity = '0';
				setTimeout(function(){
					$(e).animate({
						opacity: '1'
					}, a, function(e){
						if(b) b.apply(e);
					});
				}, 50);	
			});
		},
		fadeOut: function(a, b){
			return this.each(function(){
				this.style.opacity = '1';
				$(this).animate({
					opacity: '0'
				}, a, function(e){
					if(b) b.apply(e);
					e.style.display = 'none';
				});	
			});
		},
		animate: function(a, b, c){
			if (b == 'slow' || b == 'fast') b = 200;
			return this.each(function(i, e){
				this.style.transition = (b || 400)+'ms';
				(function(j){
					while(true){
						if(j.style.transition.length > 0){
							$(j).css(a);
							setTimeout(function(){
								j.style.transition = '';
								if(c) c(j, b);
							}, (b-10 || 400));
							break;
						}
					}
				})(e);
			});
		},
		
		/**
		* Манипуляции с классами
		*/
		addClass: function(a){
			return this.each(function(){
				this.classList.add(a);
			});
		},
		removeClass: function(a, b){
			return this.each(function(){
				this.classList.remove(a);
			});
		},
		replaceClass: function(a, b){
			return this.each(function(){
				$(this).removeClass(a).addClass(b);
			});
		},
		toggleClass: function(a){
			var t = a.split(/\s+/);
			for(let i = 0; i < t.length; i++){
				this.each(function(){
					if($(this).hasClass(t[i]))
						$(this).removeClass(t[i]);
					else
						$(this).addClass(t[i]);
				});
			}
			return this;
		},
		hasClass: function(a){
			return this[0].classList.contains(a);
		},
		
		/**
		* Вставить в DOM и получить
		*/
		text: function(a){
			var text = '';
			this.each(function(){
				if(a === []._)
					text += this.textContent;
				else
					this.textContent = a;
			});
			return text || this;
		},
        val: function(a){
			if(arguments.length){
				return this.each(function(){
					this.value = a;
				});
			} else {
				return this.length ? (
					this[0].value ? this[0].value : this.attr('value') || ''
				) : this;
			}
        },
		getVal: function(a, b){
			if(!a || typeof a == 'function'){
				b = a;
				a = this;
			}
			var r = '';
			for(let i = 0; a[i]; i++){
				if(a[i].nodeType === 3 || a[i].nodeType === 4)
					r += a[i].nodeValue + "\n";
				else if (a[i].nodeType !== 8){
					var p = b ? b(a[i]) : false;
					r += p ? p : $.fn.getVal(a[i].childNodes, b);
				}
			}
			return r;
		},
		autosize: function(){
			return this.each(function(){
				this.addEventListener('keyup keydown', function() {
					this.style.overflow = 'hidden';
					this.style.height = 0;
					this.style.height = this.scrollHeight+'px';
				}, false);
			});
		},
		empty: function(){
			return this.each(function(){
				while(this.firstChild) this.removeChild(this.firstChild);
			});
		},
		insertAdjacent: function(a, b){
			return this.each(function(i,e){
				if(b.nodeType || b.eva){
					e.insertAdjacentElement(a, $(b).clone(true)[0]);
				} else {
					InsertCb(b, e);
					e.insertAdjacentHTML(a, b);
				}
			});
		},
		append: function(a){
			return this.insertAdjacent('beforeEnd', a);
		},
		prepend: function(a){
			return this.insertAdjacent('afterBegin', a);
		},
		before: function(a){
			return this.insertAdjacent('beforeBegin', a);
		},
		after: function(a){
			return this.insertAdjacent('afterEnd', a);
		},
		html: function(a, b){
			return a === []._ ? this[0].innerHTML : this.each(function(i, e){
				if(typeof a == 'object'){
					e.innerHTML = '';
					e.appendChild(a.eva ? a[0] : a);
				} else {
					console.log('yes');
					InsertCb(a, e);
					e.innerHTML = a;
				}
			});
		},
		
		/**
		* Кординаты и размеры элементов
		*/
        position: function(){
            return this.length ? {
                top: this[0].offsetTop,
                left: this[0].offsetLeft
            } : '';
        },
		offset: function(){
			var e = _d.documentElement,
				b = this[0].getBoundingClientRect(),
				t = b.top+_w.pageYOffset-e.clientTop,
				l = b.left+_w.pageXOffset-e.clientLeft;
			return {
				top: t,
				left: l,
				width: b.width,
				height: b.height
			};
		},
        height: function(h){
			var b = _d.body;
			return arguments.length ? this.css('height', h) : (
				this.length ? (
					this[0] === _w ? _w.innerHeight : (
						this[0] === _d ? Math.max(
							b.scrollHeight,
							_d.documentElement.scrollHeight,
							b.offsetHeight,
							_d.documentElement.offsetHeight,
							b.clientHeight,
							_d.documentElement.clientHeight
						) : this[0].offsetHeight
					)
				) : this
			);
        },
        width: function(w){
			var b = _d.body;
            return arguments.length ? this.css('width', arguments[0]) : (
				this[0] === _w ? _w.innerWidth : (
					this[0] === _d ? Math.max(
						_d.documentElement.clientWidth,
						b.scrollWidth,
						_d.documentElement.scrollWidth,
						b.offsetWidth,
						_d.documentElement.offsetWidth
					) : (
						this.length ? this[0].offsetWidth : this
					)
				)
			);
        },
		
		/**
		* Скроллбар
		*/
		scrollTop: function(a, b, c){
			return a == []._ && this.length ? (
				this[0].scrollTop || _w.pageYOffset
			) : this.each(function(i, e){
				$.animate({
					start: $(e).scrollTop(),
					end: a,
					duration: b || 0,
					complete: c,
					draw: function(t, v){
						if(e == _w || e == _d)
							_w.scrollTo(0, Math.round(v));
						else
							e.scrollTop = Math.round(v);
					}
				});
			});
		},
		scrollIntoView: function(p){
			if(this.length) this[0].scrollIntoView(p);
			return this;
		},
        scrollheight: function(){
            if (!this.length) return false;
            return this[0].scrollHeight;
        },
        scrollWidth: function(){
            if (!this.length) return false;
            return this[0].scrollWidth;
        },
		
		/**
		* Проверки элементов
		*/
		is: function(a){
			if(this[0] === _d || a === _d || this[0] === _w || a === _w)
				return this[0] === a ? true : false;
			return (
				this[0].matches ||
				this[0].matchesSelector || 
				this[0].msMatchesSelector ||
				this[0].mozMatchesSelector || 
				this[0].webkitMatchesSelector ||
				this[0].oMatchesSelector
			).call(this[0], a);
		},
        isVisible: function(){
			return (
				this.css('display') === 'none' || 
				this.css('visibility') === 'hidden' || 
				this.css('opacity') === '0'
			) ? false : true;
        },
		
		/**
		* Получение элементов
		*/
		prev: function(){
			return this[0].previousElementSibling ? $(this[0].previousElementSibling) : this;
		},
		next: function(){
			return this[0].nextElementSibling ? $(this[0].nextElementSibling) : this;
		},
		first: function(){
			return this.length ? $(this[0]) : this;
		},
		last: function(){
			return this.length ? $(this[this.length-1]) : this;
		},
		get: function(a){
			return this[a] ? $(this[a]) : this;
		},
		filter: function(s){
			var arr = [];
			if(typeof s === 'string') {
				for(let i = 0; i < this.length; i++){
					if($(this[i]).is(s))
						arr.push(this[i]);
				}
			} else if(typeof s === 'function'){
				for(let i = 0; i < this.length; i++){
					if(s.call(this, i, this[i]) === true)
						arr.push(this[i]);
				}
			}
			return $(arr);
		},
		find: function(s){
			var arr = [], q, then = this;
			this.each(function(){
				q = Array.prototype.slice.call(this.querySelectorAll(s),'');
				if(q.length)
					arr = arr.concat(q);
			});
			return $(arr);
		},
		parent: function(s){
			if(s && this.length){
				var a = this[0], res;
				 while(a){
					 if($(a).is(s) && a !== this[0])
						 return a;
					 a = a.parentNode;
				 }
			}
			return this.length > 0 ? $(this[0].parentNode) : $([]);
		},
        parents: function(s){
            var a = this[0], res = [];
            while(a){
				if(a !== this[0]){
					if(s){
						if($(a).is(s))
							res.push(a);
					} else
						res.push(a);
				}
				a = a.parentNode;
            }
            return res.length ? $(res) : $([]);
        },
        children: function(s){
			var res = [];
            if (this.length) {
                if(!s){
                    var e = this[0].firstChild, el = [e];
                    while(e){
                        e = e.nextSibling;
                        if(e && e.nodeType == 1)
							el.push(e);
                    }
                    res = el;
				} else {
					res = this[0].querySelectorAll ? this[0].querySelectorAll(s) : [];
				}
            }
            return $(res);
        },
		
		/**
		* Копирование удаление, и перемещение
		*/
		clone: function(a,b){
			var res = [];
			this.each(function(i,e){
				var c = this.cloneNode(true);
				if(a && e.events){
					for(let k in e.events){
						for(let i = 0; i < e.events[k].length; i++){
							c.addEventListener(k, e.events[k][i], false);
						}
					}
				}
				res.push(c);
			});
			return $(res);
		},
		remove: function(){
			return this.each(function(){
				if(this.parentNode)
					this.parentNode.removeChild(this);
			});
		},
		replaceWith: function(a, b){
			return this.each(function(){
				pasteCb(this, a, b);
				this.outerHTML = a;
			});
		},
		appendTo: function(s){
			var e = this;
			$(s).each(function(){
				this.appendChild(e[0]);
			});
			return e;
		},
		prependTo: function(s){
			var e = this;
			$(s).each(function(){
				this.insertBefore(e[0], this.firstChild);
			});
			return e;
		},
		lazy: function(a, b){
			var _t = this, w = b || _w;
			function check(){
				for (let i = 0; i < _t.length; i++) {
					if(_t[i] && $(_t[i]).offset().top < ($(_w).height()+$(_w).scrollTop()+350)){
						a.apply(_t[i]);
						_t.splice(i, 1);
						i--;
					}
				}
				return _t.length;
			};
			function init(){
				return check() < 1 ? $(w).unbind('scroll resize', init) : false;
			}
			init();
			$(w).bind('scroll resize', init);
		},
		each: function (a, b){
			for(let i = 0; i < this.length; i++){
				if(a.apply(this[i], [i, this[i]]) === false) break;
			}
			return this
		},
		indexOf: function(a){
			return [].indexOf.call(this, a);
		},
		draggable: function(){
			var _t = this, w = $(_w);
			_t.bind('mousedown', function(e){
				if(e.pageX && e.pageY){
					var o = _t.position(),
						x = parseInt(o.left || 0)-e.pageX,
						y = parseInt(o.top || 0)-e.pageY;
					w.bind('mousemove', function(e){
						_t.css({
							left: x+e.pageX,
							top: y+e.pageY,
						});
					});	
				}
			});
			w.bind('mouseup', function(){
				w.unbind("mousemove");
			});
		},
		splice: function(a, b){
			[].splice.call(this, a, b);
			return this;
		}
	};
	
	$.each = function(o, f){
		if($.type(o, 'object')){
			for(let i in o){
				if(f.call(o[i], i, o[i]) === false) break;	
			}
		} else 
			$.fn.each.apply(o, [f]);
		return o;
	};
	
	$.type = function(a, b){
		var t = Object.prototype.toString.call(a).toLowerCase();
		return b ? (t === '[object '+b+']') : t;
	};
	
	$.parseHTML = function(a){
		var r = _d.createRange();
		r.selectNode(_d.body);
		return [r.createContextualFragment(a).firstChild];
	};
	
	$.extend = function(){
		var a = arguments, l = a.length, b = a[0] || {};
		for(let i = 1; i < l; i++){
			var o = a[i];
			if(!o) continue;
			for(let k in o){
				if(o.hasOwnProperty(k)){
					if(typeof o[k] === 'object') $.extend(b[k], o[k]);
					else b[k] = o[k];
				}
			}
		}
		return b;
	};
	$.inArr = function(a, b){
		return b.indexOf(a) >= 0;
	};
	$.getUserMedia = function(a,b,c){
        return _n.getUserMedia ? _n.getUserMedia(a, b, c) : false;
	};
})(document, window, navigator);
