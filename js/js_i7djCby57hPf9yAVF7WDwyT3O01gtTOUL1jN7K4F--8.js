/**
 * @file
 * Behaviors for sitewide dataLayer.
 */

'use strict';
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.jpgDataLayerSitewide = {
    attach(context, settings) {
      // Track (SDK Analytics not loaded).
      if (!window.track) {
        return;
      }

      $('a').once('datalayer-sitewide').on('click', function (e) {
        // Outbound links.
        let href = $(this).attr('href');
        let settings = drupalSettings.siteInfo || {};
        let linkType = false;
        if (href && href.indexOf('http') === 0 &&
          typeof settings.host !== 'undefined' &&
          href.indexOf(settings.host) !== 0) {

          // social
          linkType = $(this).closest('.view-social-networks').length ? 'social' : false;
          // external
          linkType = !linkType && $(this).attr('target') === '_blank' ? 'external' : linkType;

          if (!linkType) {
            return;
          }

          let socialID = '';
          let socialUser = '';
          let content = '';

          if (linkType === 'social') {
            socialID = $(this).text();
            socialUser = (function (value) {
              let i = value.indexOf('?');
              return i === -1 ? value : value.substr(0, i);
            })(href.substring(href.lastIndexOf('/') + 1));
            content = 'channel';
          }
          let interaction = {
            'outboundLink': {
              'type': linkType,
              'socialNetworkID': socialID,
              'socialNetworkUser': socialUser,
              'socialNetworkContent': content,
              'link': href
            }
          };

          track.outboundLinks(interaction);
        }
      });

      // Internal search event.
      // If no results the event Internal search should be triggered.
      var searchInput = $('#edit-search-api-fulltext');
      var emptyResult = $('.view-empty__text');
      let products = $("[jpg-datalayer-product-impression]", context);
      if (searchInput.length && !products.length && emptyResult.length) {
        if (drupalSettings.path.currentQuery !== undefined) {
          // Get origin from path.
          var baseUrl = drupalSettings.path.baseUrl;
          var langCode = drupalSettings.path.currentLanguage;
          var interaction = {};
          interaction.search = {};
          interaction.search.term = searchInput.val();
          // For empty results count = 0.
          interaction.search.resultsNumber = 0;
          interaction.search.origin = baseUrl + langCode + '/';
          // Search results view displays all items, so the count of pages
          // always will be 1.
          interaction.search.pageNumber = '1';
          track.internalSearch(interaction);
        }
      }

      $('.my-account__anchor-link').once('datalayer-sitewide--account').on('click', function (e) {
        var href = $(this).attr("href");
        var sitewide_page = $.extend(true, {}, drupalSettings.siteWide.page);
        switch (href) {
          case '#orders-and-return':
            sitewide_page.contentLevel1 = 'orders';
            break;
          case '#personal-data':
            sitewide_page.contentLevel1 = 'personal-details';
            break;
          case '#my-address':
            sitewide_page.contentLevel1 = 'addresses';
            break;
        }
        if (drupalSettings.siteWide.page.contentLevel1 !== sitewide_page.contentLevel1) {
          track.sitewide(sitewide_page);
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings);;
/*! For license information please see app.js.LICENSE.txt */
! function (e) {
  var t = {};

  function n(i) {
    if (t[i]) return t[i].exports;
    var o = t[i] = {
      i: i,
      l: !1,
      exports: {}
    };
    return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
  }
  n.m = e, n.c = t, n.d = function (e, t, i) {
    n.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: i
    })
  }, n.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, n.t = function (e, t) {
    if (1 & t && (e = n(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var i = Object.create(null);
    if (n.r(i), Object.defineProperty(i, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e)
      for (var o in e) n.d(i, o, function (t) {
        return e[t]
      }.bind(null, o));
    return i
  }, n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    };
    return n.d(t, "a", t), t
  }, n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, n.p = "", n(n.s = 200)
}({
  0: function (e, t, n) {
    "use strict";
    n.d(t, "a", (function () {
      return p
    })), n.d(t, "b", (function () {
      return m
    }));
    var i = !1;
    if ("undefined" != typeof window) {
      var o = {
        get passive() {
          i = !0
        }
      };
      window.addEventListener("testPassive", null, o), window.removeEventListener("testPassive", null, o)
    }
    var s = "undefined" != typeof window && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || "MacIntel" === window.navigator.platform && window.navigator.maxTouchPoints > 1),
      a = [],
      r = !1,
      l = -1,
      c = void 0,
      d = void 0,
      u = function (e) {
        return a.some((function (t) {
          return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
        }))
      },
      h = function (e) {
        var t = e || window.event;
        return !!u(t.target) || (t.touches.length > 1 || (t.preventDefault && t.preventDefault(), !1))
      },
      f = function () {
        void 0 !== d && (document.body.style.paddingRight = d, d = void 0), void 0 !== c && (document.body.style.overflow = c, c = void 0)
      },
      p = function (e, t) {
        if (e) {
          if (!a.some((function (t) {
              return t.targetElement === e
            }))) {
            var n = {
              targetElement: e,
              options: t || {}
            };
            a = [].concat(function (e) {
              if (Array.isArray(e)) {
                for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
                return n
              }
              return Array.from(e)
            }(a), [n]), s ? (e.ontouchstart = function (e) {
              1 === e.targetTouches.length && (l = e.targetTouches[0].clientY)
            }, e.ontouchmove = function (t) {
              1 === t.targetTouches.length && function (e, t) {
                var n = e.targetTouches[0].clientY - l;
                !u(e.target) && (t && 0 === t.scrollTop && n > 0 || function (e) {
                  return !!e && e.scrollHeight - e.scrollTop <= e.clientHeight
                }(t) && n < 0 ? h(e) : e.stopPropagation())
              }(t, e)
            }, r || (document.addEventListener("touchmove", h, i ? {
              passive: !1
            } : void 0), r = !0)) : function (e) {
              if (void 0 === d) {
                var t = !!e && !0 === e.reserveScrollBarGap,
                  n = window.innerWidth - document.documentElement.clientWidth;
                t && n > 0 && (d = document.body.style.paddingRight, document.body.style.paddingRight = n + "px")
              }
              void 0 === c && (c = document.body.style.overflow, document.body.style.overflow = "hidden")
            }(t)
          }
        } else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")
      },
      m = function (e) {
        e ? (a = a.filter((function (t) {
          return t.targetElement !== e
        })), s ? (e.ontouchstart = null, e.ontouchmove = null, r && 0 === a.length && (document.removeEventListener("touchmove", h, i ? {
          passive: !1
        } : void 0), r = !1)) : a.length || f()) : console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")
      }
  },
  1: function (e, t) {
    var n;
    n = function () {
      return this
    }();
    try {
      n = n || new Function("return this")()
    } catch (e) {
      "object" == typeof window && (n = window)
    }
    e.exports = n
  },
  10: function (e, t, n) {
    window,
    e.exports = function () {
      return n = {}, e.m = t = [function (e, t, n) {
        "use strict";

        function i(e, t) {
          t = t || {
            bubbles: !1,
            cancelable: !1,
            detail: void 0
          };
          var n = document.createEvent("CustomEvent");
          return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n
        }
        var o;
        t.__esModule = !0, t.hasClassInTree = function (e, t) {
          function n(e, t) {
            return t && e && e.classList && e.classList.contains(t) ? e : null
          }
          return n(e, t) || function e(t, i) {
            return t && t !== document ? n(t, i) ? t : e(t.parentNode, i) : null
          }(e, t)
        }, t.ensureElementInView = function (e, t) {
          var n = e.scrollTop + e.offsetTop,
            i = n + e.clientHeight,
            o = t.offsetTop,
            s = o + t.clientHeight;
          o < n ? e.scrollTop -= n - o : i < s && (e.scrollTop += s - i)
        }, t.putContent = function (e, t, n) {
          var i = e.offsetHeight,
            o = e.getBoundingClientRect(),
            s = n ? o.top : o.top - i,
            a = n ? o.bottom : o.bottom + i;
          return s <= 0 ? "below" : a >= window.innerHeight ? "above" : n ? t : "below"
        }, t.debounce = function (e, t, n) {
          var i;
          return void 0 === t && (t = 100), void 0 === n && (n = !1),
            function () {
              for (var o = [], s = 0; s < arguments.length; s++) o[s] = arguments[s];
              var a = self,
                r = n && !i;
              clearTimeout(i), i = setTimeout((function () {
                i = null, n || e.apply(a, o)
              }), t), r && e.apply(a, o)
            }
        }, t.isValueInArrayOfObjects = function (e, t, n) {
          if (!Array.isArray(e)) return e[t] === n;
          for (var i = 0, o = e; i < o.length; i++) {
            var s = o[i];
            if (s && s[t] && s[t] === n) return !0
          }
          return !1
        }, t.highlight = function (e, t, n) {
          var i = e,
            o = new RegExp("(" + t.trim() + ")(?![^<]*>[^<>]*</)", "i");
          if (!e.match(o)) return e;
          var s = e.match(o).index,
            a = s + e.match(o)[0].toString().length,
            r = e.substring(s, a);
          return i.replace(o, '<mark class="' + n + '">' + r + "</mark>")
        }, t.kebabCase = function (e) {
          var t = e.replace(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g, (function (e) {
            return "-" + e.toLowerCase()
          }));
          return e[0] === e[0].toUpperCase() ? t.substring(1) : t
        }, "function" != typeof (o = window).CustomEvent && (i.prototype = o.Event.prototype, o.CustomEvent = i)
      }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var i = (o.prototype.newOption = function (e) {
          return {
            id: e.id ? e.id : String(Math.floor(1e8 * Math.random())),
            value: e.value ? e.value : "",
            text: e.text ? e.text : "",
            innerHTML: e.innerHTML ? e.innerHTML : "",
            selected: !!e.selected && e.selected,
            display: void 0 === e.display || e.display,
            disabled: !!e.disabled && e.disabled,
            placeholder: !!e.placeholder && e.placeholder,
            class: e.class ? e.class : void 0,
            data: e.data ? e.data : {},
            mandatory: !!e.mandatory && e.mandatory
          }
        }, o.prototype.add = function (e) {
          this.data.push({
            id: String(Math.floor(1e8 * Math.random())),
            value: e.value,
            text: e.text,
            innerHTML: "",
            selected: !1,
            display: !0,
            disabled: !1,
            placeholder: !1,
            class: void 0,
            mandatory: e.mandatory,
            data: {}
          })
        }, o.prototype.parseSelectData = function () {
          this.data = [];
          for (var e = 0, t = this.main.select.element.childNodes; e < t.length; e++) {
            var n = t[e];
            if ("OPTGROUP" === n.nodeName) {
              for (var i = {
                  label: n.label,
                  options: []
                }, o = 0, s = n.childNodes; o < s.length; o++) {
                var a = s[o];
                if ("OPTION" === a.nodeName) {
                  var r = this.pullOptionData(a);
                  i.options.push(r), r.placeholder && "" !== r.text.trim() && (this.main.config.placeholderText = r.text)
                }
              }
              this.data.push(i)
            } else "OPTION" === n.nodeName && (r = this.pullOptionData(n), this.data.push(r), r.placeholder && "" !== r.text.trim() && (this.main.config.placeholderText = r.text))
          }
        }, o.prototype.pullOptionData = function (e) {
          return {
            id: !!e.dataset && e.dataset.id || String(Math.floor(1e8 * Math.random())),
            value: e.value,
            text: e.text,
            innerHTML: e.innerHTML,
            selected: e.selected,
            disabled: e.disabled,
            placeholder: "true" === e.dataset.placeholder,
            class: e.className,
            style: e.style.cssText,
            data: e.dataset,
            mandatory: !!e.dataset && "true" === e.dataset.mandatory
          }
        }, o.prototype.setSelectedFromSelect = function () {
          if (this.main.config.isMultiple) {
            for (var e = [], t = 0, n = this.main.select.element.options; t < n.length; t++) {
              var i = n[t];
              if (i.selected) {
                var o = this.getObjectFromData(i.value, "value");
                o && o.id && e.push(o.id)
              }
            }
            this.setSelected(e, "id")
          } else {
            var s = this.main.select.element;
            if (-1 !== s.selectedIndex) {
              var a = s.options[s.selectedIndex].value;
              this.setSelected(a, "value")
            }
          }
        }, o.prototype.setSelected = function (e, t) {
          void 0 === t && (t = "id");
          for (var n = 0, i = this.data; n < i.length; n++) {
            var o = i[n];
            if (o.hasOwnProperty("label")) {
              if (o.hasOwnProperty("options")) {
                var s = o.options;
                if (s)
                  for (var a = 0, r = s; a < r.length; a++) {
                    var l = r[a];
                    l.placeholder || (l.selected = this.shouldBeSelected(l, e, t))
                  }
              }
            } else o.selected = this.shouldBeSelected(o, e, t)
          }
        }, o.prototype.shouldBeSelected = function (e, t, n) {
          if (void 0 === n && (n = "id"), Array.isArray(t))
            for (var i = 0, o = t; i < o.length; i++) {
              var s = o[i];
              if (n in e && String(e[n]) === String(s)) return !0
            } else if (n in e && String(e[n]) === String(t)) return !0;
          return !1
        }, o.prototype.getSelected = function () {
          for (var e = {
              text: "",
              placeholder: this.main.config.placeholderText
            }, t = [], n = 0, i = this.data; n < i.length; n++) {
            var o = i[n];
            if (o.hasOwnProperty("label")) {
              if (o.hasOwnProperty("options")) {
                var s = o.options;
                if (s)
                  for (var a = 0, r = s; a < r.length; a++) {
                    var l = r[a];
                    l.selected && (this.main.config.isMultiple ? t.push(l) : e = l)
                  }
              }
            } else o.selected && (this.main.config.isMultiple ? t.push(o) : e = o)
          }
          return this.main.config.isMultiple ? t : e
        }, o.prototype.addToSelected = function (e, t) {
          if (void 0 === t && (t = "id"), this.main.config.isMultiple) {
            var n = [],
              i = this.getSelected();
            if (Array.isArray(i))
              for (var o = 0, s = i; o < s.length; o++) {
                var a = s[o];
                n.push(a[t])
              }
            n.push(e), this.setSelected(n, t)
          }
        }, o.prototype.removeFromSelected = function (e, t) {
          if (void 0 === t && (t = "id"), this.main.config.isMultiple) {
            for (var n = [], i = 0, o = this.getSelected(); i < o.length; i++) {
              var s = o[i];
              String(s[t]) !== String(e) && n.push(s[t])
            }
            this.setSelected(n, t)
          }
        }, o.prototype.onDataChange = function () {
          this.main.onChange && this.isOnChangeEnabled && this.main.onChange(JSON.parse(JSON.stringify(this.getSelected())))
        }, o.prototype.getObjectFromData = function (e, t) {
          void 0 === t && (t = "id");
          for (var n = 0, i = this.data; n < i.length; n++) {
            var o = i[n];
            if (t in o && String(o[t]) === String(e)) return o;
            if (o.hasOwnProperty("options") && o.options)
              for (var s = 0, a = o.options; s < a.length; s++) {
                var r = a[s];
                if (String(r[t]) === String(e)) return r
              }
          }
          return null
        }, o.prototype.search = function (e) {
          if ("" !== (this.searchValue = e).trim()) {
            var t = this.main.config.searchFilter,
              n = this.data.slice(0);
            e = e.trim();
            var i = n.map((function (n) {
              if (n.hasOwnProperty("options")) {
                var i = n,
                  o = [];
                if (i.options && (o = i.options.filter((function (n) {
                    return t(n, e)
                  }))), 0 !== o.length) {
                  var s = Object.assign({}, i);
                  return s.options = o, s
                }
              }
              return n.hasOwnProperty("text") && t(n, e) ? n : null
            }));
            this.filtered = i.filter((function (e) {
              return e
            }))
          } else this.filtered = null
        }, o);

        function o(e) {
          this.contentOpen = !1, this.contentPosition = "below", this.isOnChangeEnabled = !0, this.main = e.main, this.searchValue = "", this.data = [], this.filtered = null, this.parseSelectData(), this.setSelectedFromSelect()
        }

        function s(e) {
          return void 0 !== e.text || (console.error("Data object option must have at least have a text value. Check object: " + JSON.stringify(e)), !1)
        }
        t.Data = i, t.validateData = function (e) {
          if (!e) return console.error("Data must be an array of objects"), !1;
          for (var t = 0, n = 0, i = e; n < i.length; n++) {
            var o = i[n];
            if (o.hasOwnProperty("label")) {
              if (o.hasOwnProperty("options")) {
                var a = o.options;
                if (a)
                  for (var r = 0, l = a; r < l.length; r++) s(l[r]) || t++
              }
            } else s(o) || t++
          }
          return 0 === t
        }, t.validateOption = s
      }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var i = n(3),
          o = n(4),
          s = n(5),
          a = n(1),
          r = n(0),
          l = (c.prototype.validate = function (e) {
            var t = "string" == typeof e.select ? document.querySelector(e.select) : e.select;
            if (!t) throw new Error("Could not find select element");
            if ("SELECT" !== t.tagName) throw new Error("Element isnt of type select");
            return t
          }, c.prototype.selected = function () {
            if (this.config.isMultiple) {
              for (var e = [], t = 0, n = o = this.data.getSelected(); t < n.length; t++) {
                var i = n[t];
                e.push(i.value)
              }
              return e
            }
            var o;
            return (o = this.data.getSelected()) ? o.value : ""
          }, c.prototype.set = function (e, t, n, i) {
            void 0 === t && (t = "value"), void 0 === n && (n = !0), void 0 === i && (i = !0), this.config.isMultiple && !Array.isArray(e) ? this.data.addToSelected(e, t) : this.data.setSelected(e, t), this.select.setValue(), this.data.onDataChange(), this.render(), n && this.close()
          }, c.prototype.setSelected = function (e, t, n, i) {
            void 0 === t && (t = "value"), void 0 === n && (n = !0), void 0 === i && (i = !0), this.set(e, t, n, i)
          }, c.prototype.setData = function (e) {
            if (a.validateData(e)) {
              for (var t = JSON.parse(JSON.stringify(e)), n = this.data.getSelected(), i = 0; i < t.length; i++) t[i].value || t[i].placeholder || (t[i].value = t[i].text);
              if (this.config.isAjax && n)
                if (this.config.isMultiple)
                  for (var o = 0, s = n.reverse(); o < s.length; o++) {
                    var r = s[o];
                    t.unshift(r)
                  } else {
                    for (t.unshift(n), i = 0; i < t.length; i++) t[i].placeholder || t[i].value !== n.value || t[i].text !== n.text || delete t[i];
                    var l = !1;
                    for (i = 0; i < t.length; i++) t[i].placeholder && (l = !0);
                    l || t.unshift({
                      text: "",
                      placeholder: !0
                    })
                  }
              this.select.create(t), this.data.parseSelectData(), this.data.setSelectedFromSelect()
            } else console.error("Validation problem on: #" + this.select.element.id)
          }, c.prototype.addData = function (e) {
            a.validateData([e]) ? (this.data.add(this.data.newOption(e)), this.select.create(this.data.data), this.data.parseSelectData(), this.data.setSelectedFromSelect(), this.render()) : console.error("Validation problem on: #" + this.select.element.id)
          }, c.prototype.open = function () {
            var e = this;
            if (this.config.isEnabled && !this.data.contentOpen) {
              if (this.beforeOpen && this.beforeOpen(), this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.plus.classList.add("ss-cross") : this.slim.singleSelected && (this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-down"), this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-up")), this.slim[this.config.isMultiple ? "multiSelected" : "singleSelected"].container.classList.add("above" === this.data.contentPosition ? this.config.openAbove : this.config.openBelow), this.config.addToBody) {
                var t = this.slim.container.getBoundingClientRect();
                this.slim.content.style.top = t.top + t.height + window.scrollY + "px", this.slim.content.style.left = t.left + window.scrollX + "px", this.slim.content.style.width = t.width + "px"
              }
              if (this.slim.content.classList.add(this.config.open), "up" === this.config.showContent.toLowerCase() || "down" !== this.config.showContent.toLowerCase() && "above" === r.putContent(this.slim.content, this.data.contentPosition, this.data.contentOpen) ? this.moveContentAbove() : this.moveContentBelow(), !this.config.isMultiple) {
                var n = this.data.getSelected();
                if (n) {
                  var i = n.id,
                    o = this.slim.list.querySelector('[data-id="' + i + '"]');
                  o && r.ensureElementInView(this.slim.list, o)
                }
              }
              setTimeout((function () {
                e.data.contentOpen = !0, e.config.searchFocus && e.slim.search.input.focus(), e.afterOpen && e.afterOpen()
              }), this.config.timeoutDelay)
            }
          }, c.prototype.close = function () {
            var e = this;
            this.data.contentOpen && (this.beforeClose && this.beforeClose(), this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openAbove), this.slim.multiSelected.container.classList.remove(this.config.openBelow), this.slim.multiSelected.plus.classList.remove("ss-cross")) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openAbove), this.slim.singleSelected.container.classList.remove(this.config.openBelow), this.slim.singleSelected.arrowIcon.arrow.classList.add("arrow-down"), this.slim.singleSelected.arrowIcon.arrow.classList.remove("arrow-up")), this.slim.content.classList.remove(this.config.open), this.data.contentOpen = !1, this.search(""), setTimeout((function () {
              e.slim.content.removeAttribute("style"), e.data.contentPosition = "below", e.config.isMultiple && e.slim.multiSelected ? (e.slim.multiSelected.container.classList.remove(e.config.openAbove), e.slim.multiSelected.container.classList.remove(e.config.openBelow)) : e.slim.singleSelected && (e.slim.singleSelected.container.classList.remove(e.config.openAbove), e.slim.singleSelected.container.classList.remove(e.config.openBelow)), e.slim.search.input.blur(), e.afterClose && e.afterClose()
            }), this.config.timeoutDelay))
          }, c.prototype.moveContentAbove = function () {
            var e = 0;
            this.config.isMultiple && this.slim.multiSelected ? e = this.slim.multiSelected.container.offsetHeight : this.slim.singleSelected && (e = this.slim.singleSelected.container.offsetHeight);
            var t = e + this.slim.content.offsetHeight - 1;
            this.slim.content.style.margin = "-" + t + "px 0 0 0", this.slim.content.style.height = t - e + 1 + "px", this.slim.content.style.transformOrigin = "center bottom", this.data.contentPosition = "above", this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openBelow), this.slim.multiSelected.container.classList.add(this.config.openAbove)) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openBelow), this.slim.singleSelected.container.classList.add(this.config.openAbove))
          }, c.prototype.moveContentBelow = function () {
            this.data.contentPosition = "below", this.config.isMultiple && this.slim.multiSelected ? (this.slim.multiSelected.container.classList.remove(this.config.openAbove), this.slim.multiSelected.container.classList.add(this.config.openBelow)) : this.slim.singleSelected && (this.slim.singleSelected.container.classList.remove(this.config.openAbove), this.slim.singleSelected.container.classList.add(this.config.openBelow))
          }, c.prototype.enable = function () {
            this.config.isEnabled = !0, this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.container.classList.remove(this.config.disabled) : this.slim.singleSelected && this.slim.singleSelected.container.classList.remove(this.config.disabled), this.select.triggerMutationObserver = !1, this.select.element.disabled = !1, this.slim.search.input.disabled = !1, this.select.triggerMutationObserver = !0
          }, c.prototype.disable = function () {
            this.config.isEnabled = !1, this.config.isMultiple && this.slim.multiSelected ? this.slim.multiSelected.container.classList.add(this.config.disabled) : this.slim.singleSelected && this.slim.singleSelected.container.classList.add(this.config.disabled), this.select.triggerMutationObserver = !1, this.select.element.disabled = !0, this.slim.search.input.disabled = !0, this.select.triggerMutationObserver = !0
          }, c.prototype.search = function (e) {
            if (this.data.searchValue !== e)
              if (this.slim.search.input.value = e, this.config.isAjax) {
                var t = this;
                this.config.isSearching = !0, this.render(), this.ajax && this.ajax(e, (function (n) {
                  t.config.isSearching = !1, Array.isArray(n) ? (n.unshift({
                    text: "",
                    placeholder: !0
                  }), t.setData(n), t.data.search(e), t.render()) : "string" == typeof n ? t.slim.options(n) : t.render()
                }))
              } else this.data.search(e), this.render()
          }, c.prototype.setSearchText = function (e) {
            this.config.searchText = e
          }, c.prototype.render = function () {
            this.config.isMultiple ? this.slim.values() : (this.slim.placeholder(), this.slim.deselect()), this.slim.options()
          }, c.prototype.destroy = function (e) {
            void 0 === e && (e = null);
            var t = e ? document.querySelector("." + e + ".ss-main") : this.slim.container,
              n = e ? document.querySelector("[data-ssid=" + e + "]") : this.select.element;
            if (t && n && (document.removeEventListener("click", this.documentClick), "auto" === this.config.showContent && window.removeEventListener("scroll", this.windowScroll, !1), n.style.display = "", delete n.dataset.ssid, n.slim = null, t.parentElement && t.parentElement.removeChild(t), this.config.addToBody)) {
              var i = e ? document.querySelector("." + e + ".ss-content") : this.slim.content;
              if (!i) return;
              document.body.removeChild(i)
            }
          }, c);

        function c(e) {
          var t = this;
          this.ajax = null, this.addable = null, this.beforeOnChange = null, this.onChange = null, this.beforeOpen = null, this.afterOpen = null, this.beforeClose = null, this.afterClose = null, this.windowScroll = r.debounce((function (e) {
            t.data.contentOpen && ("above" === r.putContent(t.slim.content, t.data.contentPosition, t.data.contentOpen) ? t.moveContentAbove() : t.moveContentBelow())
          })), this.documentClick = function (e) {
            e.target && !r.hasClassInTree(e.target, t.config.id) && t.close()
          };
          var n = this.validate(e);
          n.dataset.ssid && this.destroy(n.dataset.ssid), e.ajax && (this.ajax = e.ajax), e.addable && (this.addable = e.addable), this.config = new i.Config({
            select: n,
            isAjax: !!e.ajax,
            showSearch: e.showSearch,
            searchPlaceholder: e.searchPlaceholder,
            searchText: e.searchText,
            searchingText: e.searchingText,
            searchFocus: e.searchFocus,
            searchHighlight: e.searchHighlight,
            searchFilter: e.searchFilter,
            closeOnSelect: e.closeOnSelect,
            showContent: e.showContent,
            placeholderText: e.placeholder,
            allowDeselect: e.allowDeselect,
            allowDeselectOption: e.allowDeselectOption,
            hideSelectedOption: e.hideSelectedOption,
            deselectLabel: e.deselectLabel,
            isEnabled: e.isEnabled,
            valuesUseText: e.valuesUseText,
            showOptionTooltips: e.showOptionTooltips,
            selectByGroup: e.selectByGroup,
            limit: e.limit,
            timeoutDelay: e.timeoutDelay,
            addToBody: e.addToBody
          }), this.select = new o.Select({
            select: n,
            main: this
          }), this.data = new a.Data({
            main: this
          }), this.slim = new s.Slim({
            main: this
          }), this.select.element.parentNode && this.select.element.parentNode.insertBefore(this.slim.container, this.select.element.nextSibling), e.data ? this.setData(e.data) : this.render(), document.addEventListener("click", this.documentClick), "auto" === this.config.showContent && window.addEventListener("scroll", this.windowScroll, !1), e.beforeOnChange && (this.beforeOnChange = e.beforeOnChange), e.onChange && (this.onChange = e.onChange), e.beforeOpen && (this.beforeOpen = e.beforeOpen), e.afterOpen && (this.afterOpen = e.afterOpen), e.beforeClose && (this.beforeClose = e.beforeClose), e.afterClose && (this.afterClose = e.afterClose), this.config.isEnabled || this.disable()
        }
        t.default = l
      }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var i = (o.prototype.searchFilter = function (e, t) {
          return -1 !== e.text.toLowerCase().indexOf(t.toLowerCase())
        }, o);

        function o(e) {
          this.id = "", this.isMultiple = !1, this.isAjax = !1, this.isSearching = !1, this.showSearch = !0, this.searchFocus = !0, this.searchHighlight = !1, this.closeOnSelect = !0, this.showContent = "auto", this.searchPlaceholder = "Search", this.searchText = "No Results", this.searchingText = "Searching...", this.placeholderText = "Select Value", this.allowDeselect = !1, this.allowDeselectOption = !1, this.hideSelectedOption = !1, this.deselectLabel = "x", this.isEnabled = !0, this.valuesUseText = !1, this.showOptionTooltips = !1, this.selectByGroup = !1, this.limit = 0, this.timeoutDelay = 200, this.addToBody = !1, this.main = "ss-main", this.singleSelected = "ss-single-selected", this.arrow = "ss-arrow", this.multiSelected = "ss-multi-selected", this.add = "ss-add", this.plus = "ss-plus", this.values = "ss-values", this.value = "ss-value", this.valueText = "ss-value-text", this.valueDelete = "ss-value-delete", this.content = "ss-content", this.open = "ss-open", this.openAbove = "ss-open-above", this.openBelow = "ss-open-below", this.search = "ss-search", this.searchHighlighter = "ss-search-highlight", this.addable = "ss-addable", this.list = "ss-list", this.optgroup = "ss-optgroup", this.optgroupLabel = "ss-optgroup-label", this.optgroupLabelSelectable = "ss-optgroup-label-selectable", this.option = "ss-option", this.optionSelected = "ss-option-selected", this.highlighted = "ss-highlighted", this.disabled = "ss-disabled", this.hide = "ss-hide", this.id = "ss-" + Math.floor(1e5 * Math.random()), this.style = e.select.style.cssText, this.class = e.select.className.split(" "), this.isMultiple = e.select.multiple, this.isAjax = e.isAjax, this.showSearch = !1 !== e.showSearch, this.searchFocus = !1 !== e.searchFocus, this.searchHighlight = !0 === e.searchHighlight, this.closeOnSelect = !1 !== e.closeOnSelect, e.showContent && (this.showContent = e.showContent), this.isEnabled = !1 !== e.isEnabled, e.searchPlaceholder && (this.searchPlaceholder = e.searchPlaceholder), e.searchText && (this.searchText = e.searchText), e.searchingText && (this.searchingText = e.searchingText), e.placeholderText && (this.placeholderText = e.placeholderText), this.allowDeselect = !0 === e.allowDeselect, this.allowDeselectOption = !0 === e.allowDeselectOption, this.hideSelectedOption = !0 === e.hideSelectedOption, e.deselectLabel && (this.deselectLabel = e.deselectLabel), e.valuesUseText && (this.valuesUseText = e.valuesUseText), e.showOptionTooltips && (this.showOptionTooltips = e.showOptionTooltips), e.selectByGroup && (this.selectByGroup = e.selectByGroup), e.limit && (this.limit = e.limit), e.searchFilter && (this.searchFilter = e.searchFilter), null != e.timeoutDelay && (this.timeoutDelay = e.timeoutDelay), this.addToBody = !0 === e.addToBody
        }
        t.Config = i
      }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var i = n(0),
          o = (s.prototype.setValue = function () {
            if (this.main.data.getSelected()) {
              if (this.main.config.isMultiple)
                for (var e = this.main.data.getSelected(), t = 0, n = this.element.options; t < n.length; t++) {
                  var i = n[t];
                  i.selected = !1;
                  for (var o = 0, s = e; o < s.length; o++) s[o].value === i.value && (i.selected = !0)
                } else e = this.main.data.getSelected(), this.element.value = e ? e.value : "";
              this.main.data.isOnChangeEnabled = !1, this.element.dispatchEvent(new CustomEvent("change", {
                bubbles: !0
              })), this.main.data.isOnChangeEnabled = !0
            }
          }, s.prototype.addAttributes = function () {
            this.element.tabIndex = -1, this.element.style.display = "none", this.element.dataset.ssid = this.main.config.id
          }, s.prototype.addEventListeners = function () {
            var e = this;
            this.element.addEventListener("change", (function (t) {
              e.main.data.setSelectedFromSelect(), e.main.render()
            }))
          }, s.prototype.addMutationObserver = function () {
            var e = this;
            this.main.config.isAjax || (this.mutationObserver = new MutationObserver((function (t) {
              e.triggerMutationObserver && (e.main.data.parseSelectData(), e.main.data.setSelectedFromSelect(), e.main.render(), t.forEach((function (t) {
                "class" === t.attributeName && e.main.slim.updateContainerDivClass(e.main.slim.container)
              })))
            })), this.observeMutationObserver())
          }, s.prototype.observeMutationObserver = function () {
            this.mutationObserver && this.mutationObserver.observe(this.element, {
              attributes: !0,
              childList: !0,
              characterData: !0
            })
          }, s.prototype.disconnectMutationObserver = function () {
            this.mutationObserver && this.mutationObserver.disconnect()
          }, s.prototype.create = function (e) {
            this.element.innerHTML = "";
            for (var t = 0, n = e; t < n.length; t++) {
              var i = n[t];
              if (i.hasOwnProperty("options")) {
                var o = i,
                  s = document.createElement("optgroup");
                if (s.label = o.label, o.options)
                  for (var a = 0, r = o.options; a < r.length; a++) {
                    var l = r[a];
                    s.appendChild(this.createOption(l))
                  }
                this.element.appendChild(s)
              } else this.element.appendChild(this.createOption(i))
            }
          }, s.prototype.createOption = function (e) {
            var t = document.createElement("option");
            return t.value = "" !== e.value ? e.value : e.text, t.innerHTML = e.innerHTML || e.text, e.selected && (t.selected = e.selected), !1 === e.display && (t.style.display = "none"), e.disabled && (t.disabled = !0), e.placeholder && t.setAttribute("data-placeholder", "true"), e.mandatory && t.setAttribute("data-mandatory", "true"), e.class && e.class.split(" ").forEach((function (e) {
              t.classList.add(e)
            })), e.data && "object" == typeof e.data && Object.keys(e.data).forEach((function (n) {
              t.setAttribute("data-" + i.kebabCase(n), e.data[n])
            })), t
          }, s);

        function s(e) {
          this.triggerMutationObserver = !0, this.element = e.select, this.main = e.main, this.element.disabled && (this.main.config.isEnabled = !1), this.addAttributes(), this.addEventListeners(), this.mutationObserver = null, this.addMutationObserver(), this.element.slim = e.main
        }
        t.Select = o
      }, function (e, t, n) {
        "use strict";
        t.__esModule = !0;
        var i = n(0),
          o = n(1),
          s = (a.prototype.containerDiv = function () {
            var e = document.createElement("div");
            return e.style.cssText = this.main.config.style, this.updateContainerDivClass(e), e
          }, a.prototype.updateContainerDivClass = function (e) {
            this.main.config.class = this.main.select.element.className.split(" "), e.className = "", e.classList.add(this.main.config.id), e.classList.add(this.main.config.main);
            for (var t = 0, n = this.main.config.class; t < n.length; t++) {
              var i = n[t];
              "" !== i.trim() && e.classList.add(i)
            }
          }, a.prototype.singleSelectedDiv = function () {
            var e = this,
              t = document.createElement("div");
            t.classList.add(this.main.config.singleSelected);
            var n = document.createElement("span");
            n.classList.add("placeholder"), t.appendChild(n);
            var i = document.createElement("span");
            i.innerHTML = this.main.config.deselectLabel, i.classList.add("ss-deselect"), i.onclick = function (t) {
              t.stopPropagation(), e.main.config.isEnabled && e.main.set("")
            }, t.appendChild(i);
            var o = document.createElement("span");
            o.classList.add(this.main.config.arrow);
            var s = document.createElement("span");
            return s.classList.add("arrow-down"), o.appendChild(s), t.appendChild(o), t.onclick = function () {
              e.main.config.isEnabled && (e.main.data.contentOpen ? e.main.close() : e.main.open())
            }, {
              container: t,
              placeholder: n,
              deselect: i,
              arrowIcon: {
                container: o,
                arrow: s
              }
            }
          }, a.prototype.placeholder = function () {
            var e = this.main.data.getSelected();
            if (null === e || e && e.placeholder) {
              var t = document.createElement("span");
              t.classList.add(this.main.config.disabled), t.innerHTML = this.main.config.placeholderText, this.singleSelected && (this.singleSelected.placeholder.innerHTML = t.outerHTML)
            } else {
              var n = "";
              e && (n = e.innerHTML && !0 !== this.main.config.valuesUseText ? e.innerHTML : e.text), this.singleSelected && (this.singleSelected.placeholder.innerHTML = e ? n : "")
            }
          }, a.prototype.deselect = function () {
            if (this.singleSelected) {
              if (!this.main.config.allowDeselect) return void this.singleSelected.deselect.classList.add("ss-hide");
              "" === this.main.selected() ? this.singleSelected.deselect.classList.add("ss-hide") : this.singleSelected.deselect.classList.remove("ss-hide")
            }
          }, a.prototype.multiSelectedDiv = function () {
            var e = this,
              t = document.createElement("div");
            t.classList.add(this.main.config.multiSelected);
            var n = document.createElement("div");
            n.classList.add(this.main.config.values), t.appendChild(n);
            var i = document.createElement("div");
            i.classList.add(this.main.config.add);
            var o = document.createElement("span");
            return o.classList.add(this.main.config.plus), o.onclick = function (t) {
              e.main.data.contentOpen && (e.main.close(), t.stopPropagation())
            }, i.appendChild(o), t.appendChild(i), t.onclick = function (t) {
              e.main.config.isEnabled && (t.target.classList.contains(e.main.config.valueDelete) || (e.main.data.contentOpen ? e.main.close() : e.main.open()))
            }, {
              container: t,
              values: n,
              add: i,
              plus: o
            }
          }, a.prototype.values = function () {
            if (this.multiSelected) {
              for (var e, t = this.multiSelected.values.childNodes, n = this.main.data.getSelected(), i = [], o = 0, s = t; o < s.length; o++) {
                var a = s[o];
                e = !0;
                for (var r = 0, l = n; r < l.length; r++) {
                  var c = l[r];
                  String(c.id) === String(a.dataset.id) && (e = !1)
                }
                e && i.push(a)
              }
              for (var d = 0, u = i; d < u.length; d++) {
                var h = u[d];
                h.classList.add("ss-out"), this.multiSelected.values.removeChild(h)
              }
              for (t = this.multiSelected.values.childNodes, c = 0; c < n.length; c++) {
                e = !1;
                for (var f = 0, p = t; f < p.length; f++) a = p[f], String(n[c].id) === String(a.dataset.id) && (e = !0);
                e || (0 !== t.length && HTMLElement.prototype.insertAdjacentElement ? 0 === c ? this.multiSelected.values.insertBefore(this.valueDiv(n[c]), t[c]) : t[c - 1].insertAdjacentElement("afterend", this.valueDiv(n[c])) : this.multiSelected.values.appendChild(this.valueDiv(n[c])))
              }
              if (0 === n.length) {
                var m = document.createElement("span");
                m.classList.add(this.main.config.disabled), m.innerHTML = this.main.config.placeholderText, this.multiSelected.values.innerHTML = m.outerHTML
              }
            }
          }, a.prototype.valueDiv = function (e) {
            var t = this,
              n = document.createElement("div");
            n.classList.add(this.main.config.value), n.dataset.id = e.id;
            var i = document.createElement("span");
            if (i.classList.add(this.main.config.valueText), i.innerHTML = e.innerHTML && !0 !== this.main.config.valuesUseText ? e.innerHTML : e.text, n.appendChild(i), !e.mandatory) {
              var o = document.createElement("span");
              o.classList.add(this.main.config.valueDelete), o.innerHTML = this.main.config.deselectLabel, o.onclick = function (n) {
                n.preventDefault(), n.stopPropagation();
                var i = !1;
                if (t.main.beforeOnChange || (i = !0), t.main.beforeOnChange) {
                  for (var o = t.main.data.getSelected(), s = JSON.parse(JSON.stringify(o)), a = 0; a < s.length; a++) s[a].id === e.id && s.splice(a, 1);
                  !1 !== t.main.beforeOnChange(s) && (i = !0)
                }
                i && (t.main.data.removeFromSelected(e.id, "id"), t.main.render(), t.main.select.setValue(), t.main.data.onDataChange())
              }, n.appendChild(o)
            }
            return n
          }, a.prototype.contentDiv = function () {
            var e = document.createElement("div");
            return e.classList.add(this.main.config.content), e
          }, a.prototype.searchDiv = function () {
            var e = this,
              t = document.createElement("div"),
              n = document.createElement("input"),
              i = document.createElement("div");
            t.classList.add(this.main.config.search);
            var s = {
              container: t,
              input: n
            };
            return this.main.config.showSearch || (t.classList.add(this.main.config.hide), n.readOnly = !0), n.type = "search", n.placeholder = this.main.config.searchPlaceholder, n.tabIndex = 0, n.setAttribute("aria-label", this.main.config.searchPlaceholder), n.setAttribute("autocapitalize", "off"), n.setAttribute("autocomplete", "off"), n.setAttribute("autocorrect", "off"), n.onclick = function (t) {
              setTimeout((function () {
                "" === t.target.value && e.main.search("")
              }), 10)
            }, n.onkeydown = function (t) {
              "ArrowUp" === t.key ? (e.main.open(), e.highlightUp(), t.preventDefault()) : "ArrowDown" === t.key ? (e.main.open(), e.highlightDown(), t.preventDefault()) : "Tab" === t.key ? e.main.data.contentOpen ? e.main.close() : setTimeout((function () {
                e.main.close()
              }), e.main.config.timeoutDelay) : "Enter" === t.key && t.preventDefault()
            }, n.onkeyup = function (t) {
              var o = t.target;
              if ("Enter" === t.key) {
                if (e.main.addable && t.ctrlKey) return i.click(), t.preventDefault(), void t.stopPropagation();
                var s = e.list.querySelector("." + e.main.config.highlighted);
                s && s.click()
              } else "ArrowUp" === t.key || "ArrowDown" === t.key || ("Escape" === t.key ? e.main.close() : e.main.config.showSearch && e.main.data.contentOpen ? e.main.search(o.value) : n.value = "");
              t.preventDefault(), t.stopPropagation()
            }, n.onfocus = function () {
              e.main.open()
            }, t.appendChild(n), this.main.addable && (i.classList.add(this.main.config.addable), i.innerHTML = "+", i.onclick = function (t) {
              if (e.main.addable) {
                t.preventDefault(), t.stopPropagation();
                var n = e.search.input.value;
                if ("" === n.trim()) return void e.search.input.focus();
                var i = e.main.addable(n),
                  s = "";
                if (!i) return;
                "object" == typeof i ? o.validateOption(i) && (e.main.addData(i), s = i.value ? i.value : i.text) : (e.main.addData(e.main.data.newOption({
                  text: i,
                  value: i
                })), s = i), e.main.search(""), setTimeout((function () {
                  e.main.set(s, "value", !1, !1)
                }), 100), e.main.config.closeOnSelect && setTimeout((function () {
                  e.main.close()
                }), 100)
              }
            }, t.appendChild(i), s.addable = i), s
          }, a.prototype.highlightUp = function () {
            var e = this.list.querySelector("." + this.main.config.highlighted),
              t = null;
            if (e)
              for (t = e.previousSibling; null !== t && t.classList.contains(this.main.config.disabled);) t = t.previousSibling;
            else {
              var n = this.list.querySelectorAll("." + this.main.config.option + ":not(." + this.main.config.disabled + ")");
              t = n[n.length - 1]
            }
            if (t && t.classList.contains(this.main.config.optgroupLabel) && (t = null), null === t) {
              var o = e.parentNode;
              if (o.classList.contains(this.main.config.optgroup) && o.previousSibling) {
                var s = o.previousSibling.querySelectorAll("." + this.main.config.option + ":not(." + this.main.config.disabled + ")");
                s.length && (t = s[s.length - 1])
              }
            }
            t && (e && e.classList.remove(this.main.config.highlighted), t.classList.add(this.main.config.highlighted), i.ensureElementInView(this.list, t))
          }, a.prototype.highlightDown = function () {
            var e = this.list.querySelector("." + this.main.config.highlighted),
              t = null;
            if (e)
              for (t = e.nextSibling; null !== t && t.classList.contains(this.main.config.disabled);) t = t.nextSibling;
            else t = this.list.querySelector("." + this.main.config.option + ":not(." + this.main.config.disabled + ")");
            if (null === t && null !== e) {
              var n = e.parentNode;
              n.classList.contains(this.main.config.optgroup) && n.nextSibling && (t = n.nextSibling.querySelector("." + this.main.config.option + ":not(." + this.main.config.disabled + ")"))
            }
            t && (e && e.classList.remove(this.main.config.highlighted), t.classList.add(this.main.config.highlighted), i.ensureElementInView(this.list, t))
          }, a.prototype.listDiv = function () {
            var e = document.createElement("div");
            return e.classList.add(this.main.config.list), e
          }, a.prototype.options = function (e) {
            void 0 === e && (e = "");
            var t, n = this.main.data.filtered || this.main.data.data;
            if ((this.list.innerHTML = "") !== e) return (t = document.createElement("div")).classList.add(this.main.config.option), t.classList.add(this.main.config.disabled), t.innerHTML = e, void this.list.appendChild(t);
            if (this.main.config.isAjax && this.main.config.isSearching) return (t = document.createElement("div")).classList.add(this.main.config.option), t.classList.add(this.main.config.disabled), t.innerHTML = this.main.config.searchingText, void this.list.appendChild(t);
            if (0 === n.length) {
              var i = document.createElement("div");
              return i.classList.add(this.main.config.option), i.classList.add(this.main.config.disabled), i.innerHTML = this.main.config.searchText, void this.list.appendChild(i)
            }
            for (var o = function (e) {
                if (e.hasOwnProperty("label")) {
                  var t = e,
                    n = document.createElement("div");
                  n.classList.add(s.main.config.optgroup);
                  var i = document.createElement("div");
                  i.classList.add(s.main.config.optgroupLabel), s.main.config.selectByGroup && s.main.config.isMultiple && i.classList.add(s.main.config.optgroupLabelSelectable), i.innerHTML = t.label, n.appendChild(i);
                  var o = t.options;
                  if (o) {
                    for (var a = 0, r = o; a < r.length; a++) {
                      var l = r[a];
                      n.appendChild(s.option(l))
                    }
                    if (s.main.config.selectByGroup && s.main.config.isMultiple) {
                      var c = s;
                      i.addEventListener("click", (function (e) {
                        e.preventDefault(), e.stopPropagation();
                        for (var t = 0, i = n.children; t < i.length; t++) {
                          var o = i[t]; - 1 !== o.className.indexOf(c.main.config.option) && o.click()
                        }
                      }))
                    }
                  }
                  s.list.appendChild(n)
                } else s.list.appendChild(s.option(e))
              }, s = this, a = 0, r = n; a < r.length; a++) o(r[a])
          }, a.prototype.option = function (e) {
            if (e.placeholder) {
              var t = document.createElement("div");
              return t.classList.add(this.main.config.option), t.classList.add(this.main.config.hide), t
            }
            var n = document.createElement("div");
            n.classList.add(this.main.config.option), e.class && e.class.split(" ").forEach((function (e) {
              n.classList.add(e)
            })), e.style && (n.style.cssText = e.style);
            var o = this.main.data.getSelected();
            n.dataset.id = e.id, this.main.config.searchHighlight && this.main.slim && e.innerHTML && "" !== this.main.slim.search.input.value.trim() ? n.innerHTML = i.highlight(e.innerHTML, this.main.slim.search.input.value, this.main.config.searchHighlighter) : e.innerHTML && (n.innerHTML = e.innerHTML), this.main.config.showOptionTooltips && n.textContent && n.setAttribute("title", n.textContent);
            var s = this;
            n.addEventListener("click", (function (t) {
              t.preventDefault(), t.stopPropagation();
              var n = this.dataset.id;
              if (!0 === e.selected && s.main.config.allowDeselectOption) {
                var i = !1;
                if (s.main.beforeOnChange && s.main.config.isMultiple || (i = !0), s.main.beforeOnChange && s.main.config.isMultiple) {
                  for (var a = s.main.data.getSelected(), r = JSON.parse(JSON.stringify(a)), l = 0; l < r.length; l++) r[l].id === n && r.splice(l, 1);
                  !1 !== s.main.beforeOnChange(r) && (i = !0)
                }
                i && (s.main.config.isMultiple ? (s.main.data.removeFromSelected(n, "id"), s.main.render(), s.main.select.setValue(), s.main.data.onDataChange()) : s.main.set(""))
              } else {
                if (e.disabled || e.selected) return;
                if (s.main.config.limit && Array.isArray(o) && s.main.config.limit <= o.length) return;
                if (s.main.beforeOnChange) {
                  var c = void 0,
                    d = JSON.parse(JSON.stringify(s.main.data.getObjectFromData(n)));
                  d.selected = !0, s.main.config.isMultiple ? (c = JSON.parse(JSON.stringify(o))).push(d) : c = JSON.parse(JSON.stringify(d)), !1 !== s.main.beforeOnChange(c) && s.main.set(n, "id", s.main.config.closeOnSelect)
                } else s.main.set(n, "id", s.main.config.closeOnSelect)
              }
            }));
            var a = o && i.isValueInArrayOfObjects(o, "id", e.id);
            return (e.disabled || a) && (n.onclick = null, s.main.config.allowDeselectOption || n.classList.add(this.main.config.disabled), s.main.config.hideSelectedOption && n.classList.add(this.main.config.hide)), a ? n.classList.add(this.main.config.optionSelected) : n.classList.remove(this.main.config.optionSelected), n
          }, a);

        function a(e) {
          this.main = e.main, this.container = this.containerDiv(), this.content = this.contentDiv(), this.search = this.searchDiv(), this.list = this.listDiv(), this.options(), this.singleSelected = null, this.multiSelected = null, this.main.config.isMultiple ? (this.multiSelected = this.multiSelectedDiv(), this.multiSelected && this.container.appendChild(this.multiSelected.container)) : (this.singleSelected = this.singleSelectedDiv(), this.container.appendChild(this.singleSelected.container)), this.main.config.addToBody ? (this.content.classList.add(this.main.config.id), document.body.appendChild(this.content)) : this.container.appendChild(this.content), this.content.appendChild(this.search.container), this.content.appendChild(this.list)
        }
        t.Slim = s
      }], e.c = n, e.d = function (t, n, i) {
        e.o(t, n) || Object.defineProperty(t, n, {
          enumerable: !0,
          get: i
        })
      }, e.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
        }), Object.defineProperty(e, "__esModule", {
          value: !0
        })
      }, e.t = function (t, n) {
        if (1 & n && (t = e(t)), 8 & n) return t;
        if (4 & n && "object" == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (e.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: t
          }), 2 & n && "string" != typeof t)
          for (var o in t) e.d(i, o, function (e) {
            return t[e]
          }.bind(null, o));
        return i
      }, e.n = function (t) {
        var n = t && t.__esModule ? function () {
          return t.default
        } : function () {
          return t
        };
        return e.d(n, "a", n), n
      }, e.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }, e.p = "", e(e.s = 2).default;

      function e(i) {
        if (n[i]) return n[i].exports;
        var o = n[i] = {
          i: i,
          l: !1,
          exports: {}
        };
        return t[i].call(o.exports, o, o.exports, e), o.l = !0, o.exports
      }
      var t, n
    }()
  },
  16: function (e, t, n) {
    ! function () {
      "use strict";

      function e(e) {
        var t = !0,
          n = !1,
          i = null,
          o = {
            text: !0,
            search: !0,
            url: !0,
            tel: !0,
            email: !0,
            password: !0,
            number: !0,
            date: !0,
            month: !0,
            week: !0,
            time: !0,
            datetime: !0,
            "datetime-local": !0
          };

        function s(e) {
          return !!(e && e !== document && "HTML" !== e.nodeName && "BODY" !== e.nodeName && "classList" in e && "contains" in e.classList)
        }

        function a(e) {
          var t = e.type,
            n = e.tagName;
          return !("INPUT" !== n || !o[t] || e.readOnly) || "TEXTAREA" === n && !e.readOnly || !!e.isContentEditable
        }

        function r(e) {
          e.classList.contains("focus-visible") || (e.classList.add("focus-visible"), e.setAttribute("data-focus-visible-added", ""))
        }

        function l(e) {
          e.hasAttribute("data-focus-visible-added") && (e.classList.remove("focus-visible"), e.removeAttribute("data-focus-visible-added"))
        }

        function c(n) {
          n.metaKey || n.altKey || n.ctrlKey || (s(e.activeElement) && r(e.activeElement), t = !0)
        }

        function d(e) {
          t = !1
        }

        function u(e) {
          s(e.target) && (t || a(e.target)) && r(e.target)
        }

        function h(e) {
          s(e.target) && (e.target.classList.contains("focus-visible") || e.target.hasAttribute("data-focus-visible-added")) && (n = !0, window.clearTimeout(i), i = window.setTimeout((function () {
            n = !1
          }), 100), l(e.target))
        }

        function f(e) {
          "hidden" === document.visibilityState && (n && (t = !0), p())
        }

        function p() {
          document.addEventListener("mousemove", v), document.addEventListener("mousedown", v), document.addEventListener("mouseup", v), document.addEventListener("pointermove", v), document.addEventListener("pointerdown", v), document.addEventListener("pointerup", v), document.addEventListener("touchmove", v), document.addEventListener("touchstart", v), document.addEventListener("touchend", v)
        }

        function m() {
          document.removeEventListener("mousemove", v), document.removeEventListener("mousedown", v), document.removeEventListener("mouseup", v), document.removeEventListener("pointermove", v), document.removeEventListener("pointerdown", v), document.removeEventListener("pointerup", v), document.removeEventListener("touchmove", v), document.removeEventListener("touchstart", v), document.removeEventListener("touchend", v)
        }

        function v(e) {
          e.target.nodeName && "html" === e.target.nodeName.toLowerCase() || (t = !1, m())
        }
        document.addEventListener("keydown", c, !0), document.addEventListener("mousedown", d, !0), document.addEventListener("pointerdown", d, !0), document.addEventListener("touchstart", d, !0), document.addEventListener("visibilitychange", f, !0), p(), e.addEventListener("focus", u, !0), e.addEventListener("blur", h, !0), e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host ? e.host.setAttribute("data-js-focus-visible", "") : e.nodeType === Node.DOCUMENT_NODE && (document.documentElement.classList.add("js-focus-visible"), document.documentElement.setAttribute("data-js-focus-visible", ""))
      }
      if ("undefined" != typeof window && "undefined" != typeof document) {
        var t;
        window.applyFocusVisiblePolyfill = e;
        try {
          t = new CustomEvent("focus-visible-polyfill-ready")
        } catch (e) {
          (t = document.createEvent("CustomEvent")).initCustomEvent("focus-visible-polyfill-ready", !1, !1, {})
        }
        window.dispatchEvent(t)
      }
      "undefined" != typeof document && e(document)
    }()
  },
  17: function (e, t) {
    Drupal.behaviors.jpgRootVariables = {
      attach: function () {
        var e = document.documentElement;
        e.style.setProperty("--window-height", "".concat(window.innerHeight, "px")), window.addEventListener("scroll", (function () {
          e.style.setProperty("--window-height", "".concat(window.innerHeight, "px"))
        })), window.addEventListener("resize", (function () {
          e.style.setProperty("--window-height", "".concat(window.innerHeight, "px"))
        }))
      }
    }
  },
  18: function (e, t) {
    var n;
    (n = Drupal.behaviors).jpgEntityOffsetBottle = {
      attach: function (e) {
        var t = function (e, t, n) {
            var i = window.matchMedia("(min-width: 1025px)"),
              o = e.offsetHeight,
              s = window.getComputedStyle(t),
              a = s.getPropertyValue("top"),
              r = s.getPropertyValue("bottom"),
              l = t.offsetHeight;
            n.style.paddingTop = null;
            var c = window.getComputedStyle(n).getPropertyValue("padding-top");
            i.matches ? n.style.paddingTop = "".concat(Math.abs(parseInt(r, 10)) + parseInt(c, 10), "px") : n.style.paddingTop = "".concat(-1 * (o - parseInt(a, 10)) + l + parseInt(c, 10), "px")
          },
          n = e.querySelectorAll(".page-enrichment__bottle:not(.js-entity-offset)");
        n.length && Array.prototype.forEach.call(n, (function (e) {
          e.classList.add("js-entity-offset");
          var n = e.classList.contains("bottle") ? e : e.querySelector(".bottle"),
            i = n.querySelector(".bottle__content"),
            o = e.nextElementSibling.classList.contains("page-enrichment__ingredients") ? e.nextElementSibling : "";
          n && i && o && (t(n, i, o), window.addEventListener("resize", (function () {
            t(n, i, o)
          })))
        }))
      }
    }, n.jpgEntityOffsetHomepageBottle = {
      attach: function (e) {
        var t = function (e, t) {
            var n = window.matchMedia("(min-width: 1025px)"),
              i = window.getComputedStyle(t).getPropertyValue("top"),
              o = t.offsetHeight,
              s = e.offsetHeight,
              a = e.getAttribute("data-entity-offset-initial-margin-bottom");
            if (!a) {
              var r = window.getComputedStyle(e).getPropertyValue("margin-bottom");
              a = r, e.setAttribute("data-entity-offset-initial-margin-bottom", r)
            }
            n.matches ? (e.style.marginBottom = "", e.classList.remove("js-entity-offset")) : (e.style.marginBottom = "".concat(o - (s - parseInt(i, 10)) + parseInt(a, 10), "px"), e.classList.add("js-entity-offset"))
          },
          n = e.querySelectorAll(".node--type-homepage.node--view-mode-full .node__content .bottle:not(.js-entity-offset)");
        n.length && Array.prototype.forEach.call(n, (function (e) {
          e.classList.add("js-entity-offset");
          var n = e.querySelector(".bottle__content");
          e && n && (t(e, n), window.addEventListener("resize", (function () {
            t(e, n)
          })))
        }))
      }
    }
  },
  200: function (e, t, n) {
    "use strict";

    function i() {
      return (i = Object.assign || function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
        }
        return e
      }).apply(this, arguments)
    }

    function o(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = {
          mimeType: t.mimeType || null,
          onBeforeSend: t.onBeforeSend || Function.prototype,
          onSuccess: t.onSuccess || Function.prototype,
          onError: t.onError || Function.prototype,
          onComplete: t.onComplete || Function.prototype
        },
        i = Array.isArray(e) ? e : [e],
        o = Array.apply(null, Array(i.length)).map((function (e) {
          return null
        }));

      function s(e) {
        var t = e && "<" === e.trim().charAt(0);
        return e && !t
      }

      function a(e, t) {
        n.onError(e, i[t], t)
      }

      function r(e, t) {
        var s = n.onSuccess(e, i[t], t);
        e = !1 === s ? "" : s || e, o[t] = e, -1 === o.indexOf(null) && n.onComplete(o)
      }
      var l = document.createElement("a");
      i.forEach((function (e, t) {
        if (l.setAttribute("href", e), l.href = String(l.href), Boolean(document.all && !window.atob) && l.host.split(":")[0] !== location.host.split(":")[0]) {
          if (l.protocol === location.protocol) {
            var i = new XDomainRequest;
            i.open("GET", e), i.timeout = 0, i.onprogress = Function.prototype, i.ontimeout = Function.prototype, i.onload = function () {
              s(i.responseText) ? r(i.responseText, t) : a(i, t)
            }, i.onerror = function (e) {
              a(i, t)
            }, setTimeout((function () {
              i.send()
            }), 0)
          } else console.warn("Internet Explorer 9 Cross-Origin (CORS) requests must use the same protocol (".concat(e, ")")), a(null, t)
        } else {
          var o = new XMLHttpRequest;
          o.open("GET", e), n.mimeType && o.overrideMimeType && o.overrideMimeType(n.mimeType), n.onBeforeSend(o, e, t), o.onreadystatechange = function () {
            4 === o.readyState && (o.status < 400 && s(o.responseText) || 0 === o.status && s(o.responseText) ? r(o.responseText, t) : a(o, t))
          }, o.send()
        }
      }))
    }

    function s(e) {
      var t = /\/\*[\s\S]+?\*\//g,
        n = /(?:@import\s*)(?:url\(\s*)?(?:['"])([^'"]*)(?:['"])(?:\s*\))?(?:[^;]*;)/g,
        i = {
          rootElement: e.rootElement || document,
          include: e.include || 'style,link[rel="stylesheet"]',
          exclude: e.exclude || null,
          filter: e.filter || null,
          skipDisabled: !1 !== e.skipDisabled,
          useCSSOM: e.useCSSOM || !1,
          onBeforeSend: e.onBeforeSend || Function.prototype,
          onSuccess: e.onSuccess || Function.prototype,
          onError: e.onError || Function.prototype,
          onComplete: e.onComplete || Function.prototype
        },
        s = Array.apply(null, i.rootElement.querySelectorAll(i.include)).filter((function (e) {
          return t = e, n = i.exclude, !(t.matches || t.matchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector || t.oMatchesSelector).call(t, n);
          var t, n
        })),
        r = Array.apply(null, Array(s.length)).map((function (e) {
          return null
        }));

      function l() {
        if (-1 === r.indexOf(null)) {
          r.reduce((function (e, t, n) {
            return "" === t && e.push(n), e
          }), []).reverse().forEach((function (e) {
            return [s, r].forEach((function (t) {
              return t.splice(e, 1)
            }))
          }));
          var e = r.join("");
          i.onComplete(e, r, s)
        }
      }

      function c(e, t, n, o) {
        var s = i.onSuccess(e, n, o);
        u(e = void 0 !== s && !1 === Boolean(s) ? "" : s || e, n, o, (function (e, o) {
          null === r[t] && (o.forEach((function (e) {
            return i.onError(e.xhr, n, e.url)
          })), !i.filter || i.filter.test(e) ? r[t] = e : r[t] = "", l())
        }))
      }

      function d(e, i) {
        var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
          s = {};
        return s.rules = (e.replace(t, "").match(n) || []).filter((function (e) {
          return -1 === o.indexOf(e)
        })), s.urls = s.rules.map((function (e) {
          return e.replace(n, "$1")
        })), s.absoluteUrls = s.urls.map((function (e) {
          return a(e, i)
        })), s.absoluteRules = s.rules.map((function (e, t) {
          var n = s.urls[t],
            o = a(s.absoluteUrls[t], i);
          return e.replace(n, o)
        })), s
      }

      function u(e, t, n, s) {
        var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : [],
          r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : [],
          l = d(e, n, r);
        l.rules.length ? o(l.absoluteUrls, {
          onBeforeSend: function (e, n, o) {
            i.onBeforeSend(e, t, n)
          },
          onSuccess: function (e, n, o) {
            var s = i.onSuccess(e, t, n),
              a = d(e = !1 === s ? "" : s || e, n, r);
            return a.rules.forEach((function (t, n) {
              e = e.replace(t, a.absoluteRules[n])
            })), e
          },
          onError: function (i, o, c) {
            a.push({
              xhr: i,
              url: o
            }), r.push(l.rules[c]), u(e, t, n, s, a, r)
          },
          onComplete: function (i) {
            i.forEach((function (t, n) {
              e = e.replace(l.rules[n], t)
            })), u(e, t, n, s, a, r)
          }
        }) : s(e, a)
      }
      s.length ? s.forEach((function (e, t) {
        var n = e.getAttribute("href"),
          s = e.getAttribute("rel"),
          d = "link" === e.nodeName.toLowerCase() && n && s && -1 !== s.toLowerCase().indexOf("stylesheet"),
          u = !1 !== i.skipDisabled && e.disabled,
          h = "style" === e.nodeName.toLowerCase();
        if (d && !u) o(n, {
          mimeType: "text/css",
          onBeforeSend: function (t, n, o) {
            i.onBeforeSend(t, e, n)
          },
          onSuccess: function (i, o, s) {
            var r = a(n);
            c(i, t, e, r)
          },
          onError: function (n, o, s) {
            r[t] = "", i.onError(n, e, o), l()
          }
        });
        else if (h && !u) {
          var f = e.textContent;
          i.useCSSOM && (f = Array.apply(null, e.sheet.cssRules).map((function (e) {
            return e.cssText
          })).join("")), c(f, t, e, location.href)
        } else r[t] = "", l()
      })) : i.onComplete("", [])
    }

    function a(e, t) {
      var n = document.implementation.createHTMLDocument(""),
        i = n.createElement("base"),
        o = n.createElement("a");
      return n.head.appendChild(i), n.body.appendChild(o), i.href = t || document.baseURI || (document.querySelector("base") || {}).href || location.href, o.href = e, o.href
    }
    n.r(t);
    var r = l;

    function l(e, t, n) {
      e instanceof RegExp && (e = c(e, n)), t instanceof RegExp && (t = c(t, n));
      var i = d(e, t, n);
      return i && {
        start: i[0],
        end: i[1],
        pre: n.slice(0, i[0]),
        body: n.slice(i[0] + e.length, i[1]),
        post: n.slice(i[1] + t.length)
      }
    }

    function c(e, t) {
      var n = t.match(e);
      return n ? n[0] : null
    }

    function d(e, t, n) {
      var i, o, s, a, r, l = n.indexOf(e),
        c = n.indexOf(t, l + 1),
        d = l;
      if (l >= 0 && c > 0) {
        for (i = [], s = n.length; d >= 0 && !r;) d == l ? (i.push(d), l = n.indexOf(e, d + 1)) : 1 == i.length ? r = [i.pop(), c] : ((o = i.pop()) < s && (s = o, a = c), c = n.indexOf(t, d + 1)), d = l < c && l >= 0 ? l : c;
        i.length && (r = [s, a])
      }
      return r
    }

    function u(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = {
          preserveStatic: !0,
          removeComments: !1
        },
        o = i({}, n, t),
        s = [];

      function a(e) {
        throw new Error("CSS parse error: ".concat(e))
      }

      function l(t) {
        var n = t.exec(e);
        if (n) return e = e.slice(n[0].length), n
      }

      function c() {
        return l(/^{\s*/)
      }

      function d() {
        return l(/^}/)
      }

      function u() {
        l(/^\s*/)
      }

      function h() {
        if (u(), "/" === e[0] && "*" === e[1]) {
          for (var t = 2; e[t] && ("*" !== e[t] || "/" !== e[t + 1]);) t++;
          if (!e[t]) return a("end of comment is missing");
          var n = e.slice(2, t);
          return e = e.slice(t + 2), {
            type: "comment",
            comment: n
          }
        }
      }

      function f() {
        for (var e, t = []; e = h();) t.push(e);
        return o.removeComments ? [] : t
      }

      function p() {
        for (u();
          "}" === e[0];) a("extra closing bracket");
        var t = l(/^(("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^{])+)/);
        if (t) return t[0].trim().replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "").replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, (function (e) {
          return e.replace(/,/g, "â€Œ")
        })).split(/\s*(?![^(]*\)),\s*/).map((function (e) {
          return e.replace(/\u200C/g, ",")
        }))
      }

      function m() {
        if ("@" === e[0]) return _();
        l(/^([;\s]*)+/);
        var t = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
          n = l(/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (n) {
          if (n = n[0].trim(), !l(/^:\s*/)) return a("property missing ':'");
          var i = l(/^((?:\/\*.*?\*\/|'(?:\\'|.)*?'|"(?:\\"|.)*?"|\((\s*'(?:\\'|.)*?'|"(?:\\"|.)*?"|[^)]*?)\s*\)|[^};])+)/),
            o = {
              type: "declaration",
              property: n.replace(t, ""),
              value: i ? i[0].replace(t, "").trim() : ""
            };
          return l(/^[;\s]*/), o
        }
      }

      function v() {
        if (!c()) return a("missing '{'");
        for (var e, t = f(); e = m();) t.push(e), t = t.concat(f());
        return d() ? t : a("missing '}'")
      }

      function g() {
        u();
        for (var e, t = []; e = l(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/);) t.push(e[1]), l(/^,\s*/);
        if (t.length) return {
          type: "keyframe",
          values: t,
          declarations: v()
        }
      }

      function y() {
        var e = l(/^@([-\w]+)?keyframes\s*/);
        if (e) {
          var t = e[1];
          if (!(e = l(/^([-\w]+)\s*/))) return a("@keyframes missing name");
          var n, i = e[1];
          if (!c()) return a("@keyframes missing '{'");
          for (var o = f(); n = g();) o.push(n), o = o.concat(f());
          return d() ? {
            type: "keyframes",
            name: i,
            vendor: t,
            keyframes: o
          } : a("@keyframes missing '}'")
        }
      }

      function b() {
        if (l(/^@page */)) return {
          type: "page",
          selectors: p() || [],
          declarations: v()
        }
      }

      function w() {
        var e = l(/@(top|bottom|left|right)-(left|center|right|top|middle|bottom)-?(corner)?\s*/);
        if (e) return {
          type: "page-margin-box",
          name: "".concat(e[1], "-").concat(e[2]) + (e[3] ? "-".concat(e[3]) : ""),
          declarations: v()
        }
      }

      function S() {
        if (l(/^@font-face\s*/)) return {
          type: "font-face",
          declarations: v()
        }
      }

      function L() {
        var e = l(/^@supports *([^{]+)/);
        if (e) return {
          type: "supports",
          supports: e[1].trim(),
          rules: A()
        }
      }

      function x() {
        if (l(/^@host\s*/)) return {
          type: "host",
          rules: A()
        }
      }

      function E() {
        var e = l(/^@media([^{]+)*/);
        if (e) return {
          type: "media",
          media: (e[1] || "").trim(),
          rules: A()
        }
      }

      function O() {
        var e = l(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (e) return {
          type: "custom-media",
          name: e[1].trim(),
          media: e[2].trim()
        }
      }

      function C() {
        var e = l(/^@([-\w]+)?document *([^{]+)/);
        if (e) return {
          type: "document",
          document: e[2].trim(),
          vendor: e[1] ? e[1].trim() : null,
          rules: A()
        }
      }

      function T() {
        var e = l(/^@(import|charset|namespace)\s*([^;]+);/);
        if (e) return {
          type: e[1],
          name: e[2].trim()
        }
      }

      function _() {
        if (u(), "@" === e[0]) {
          var t = T() || S() || E() || y() || L() || C() || O() || x() || b() || w();
          if (t && !o.preserveStatic) {
            var n = !1;
            if (t.declarations) n = t.declarations.some((function (e) {
              return /var\(/.test(e.value)
            }));
            else n = (t.keyframes || t.rules || []).some((function (e) {
              return (e.declarations || []).some((function (e) {
                return /var\(/.test(e.value)
              }))
            }));
            return n ? t : {}
          }
          return t
        }
      }

      function M() {
        if (!o.preserveStatic) {
          var t = r("{", "}", e);
          if (t) {
            var n = /:(?:root|host)(?![.:#(])/.test(t.pre) && /--\S*\s*:/.test(t.body),
              i = /var\(/.test(t.body);
            if (!n && !i) return e = e.slice(t.end + 1), {}
          }
        }
        var s = p() || [],
          l = o.preserveStatic ? v() : v().filter((function (e) {
            var t = s.some((function (e) {
                return /:(?:root|host)(?![.:#(])/.test(e)
              })) && /^--\S/.test(e.property),
              n = /var\(/.test(e.value);
            return t || n
          }));
        return s.length || a("selector missing"), {
          type: "rule",
          selectors: s,
          declarations: l
        }
      }

      function A(t) {
        if (!t && !c()) return a("missing '{'");
        for (var n, i = f(); e.length && (t || "}" !== e[0]) && (n = _() || M());) n.type && i.push(n), i = i.concat(f());
        return t || d() ? i : a("missing '}'")
      }
      return {
        type: "stylesheet",
        stylesheet: {
          rules: A(!0),
          errors: s
        }
      }
    }

    function h(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = {
          parseHost: !1,
          store: {},
          onWarning: function () {}
        },
        o = i({}, n, t),
        s = new RegExp(":".concat(o.parseHost ? "host" : "root", "$"));
      return "string" == typeof e && (e = u(e, o)), e.stylesheet.rules.forEach((function (e) {
        "rule" === e.type && e.selectors.some((function (e) {
          return s.test(e)
        })) && e.declarations.forEach((function (e, t) {
          var n = e.property,
            i = e.value;
          n && 0 === n.indexOf("--") && (o.store[n] = i)
        }))
      })), o.store
    }

    function f(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
        n = arguments.length > 2 ? arguments[2] : void 0,
        i = {
          charset: function (e) {
            return "@charset " + e.name + ";"
          },
          comment: function (e) {
            return 0 === e.comment.indexOf("__CSSVARSPONYFILL") ? "/*" + e.comment + "*/" : ""
          },
          "custom-media": function (e) {
            return "@custom-media " + e.name + " " + e.media + ";"
          },
          declaration: function (e) {
            return e.property + ":" + e.value + ";"
          },
          document: function (e) {
            return "@" + (e.vendor || "") + "document " + e.document + "{" + o(e.rules) + "}"
          },
          "font-face": function (e) {
            return "@font-face{" + o(e.declarations) + "}"
          },
          host: function (e) {
            return "@host{" + o(e.rules) + "}"
          },
          import: function (e) {
            return "@import " + e.name + ";"
          },
          keyframe: function (e) {
            return e.values.join(",") + "{" + o(e.declarations) + "}"
          },
          keyframes: function (e) {
            return "@" + (e.vendor || "") + "keyframes " + e.name + "{" + o(e.keyframes) + "}"
          },
          media: function (e) {
            return "@media " + e.media + "{" + o(e.rules) + "}"
          },
          namespace: function (e) {
            return "@namespace " + e.name + ";"
          },
          page: function (e) {
            return "@page " + (e.selectors.length ? e.selectors.join(", ") : "") + "{" + o(e.declarations) + "}"
          },
          "page-margin-box": function (e) {
            return "@" + e.name + "{" + o(e.declarations) + "}"
          },
          rule: function (e) {
            var t = e.declarations;
            if (t.length) return e.selectors.join(",") + "{" + o(t) + "}"
          },
          supports: function (e) {
            return "@supports " + e.supports + "{" + o(e.rules) + "}"
          }
        };

      function o(e) {
        for (var o = "", s = 0; s < e.length; s++) {
          var a = e[s];
          n && n(a);
          var r = i[a.type](a);
          r && (o += r, r.length && a.selectors && (o += t))
        }
        return o
      }
      return o(e.stylesheet.rules)
    }

    function p(e, t) {
      e.rules.forEach((function (n) {
        n.rules ? p(n, t) : n.keyframes ? n.keyframes.forEach((function (e) {
          "keyframe" === e.type && t(e.declarations, n)
        })) : n.declarations && t(n.declarations, e)
      }))
    }
    l.range = d;

    function m(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = {
          preserveStatic: !0,
          preserveVars: !1,
          variables: {},
          onWarning: function () {}
        },
        o = i({}, n, t);
      return "string" == typeof e && (e = u(e, o)), p(e.stylesheet, (function (e, t) {
        for (var n = 0; n < e.length; n++) {
          var i = e[n],
            s = i.type,
            a = i.property,
            r = i.value;
          if ("declaration" === s)
            if (o.preserveVars || !a || 0 !== a.indexOf("--")) {
              if (-1 !== r.indexOf("var(")) {
                var l = g(r, o);
                l !== i.value && (l = v(l), o.preserveVars ? (e.splice(n, 0, {
                  type: s,
                  property: a,
                  value: l
                }), n++) : i.value = l)
              }
            } else e.splice(n, 1), n--
        }
      })), f(e)
    }

    function v(e) {
      return (e.match(/calc\(([^)]+)\)/g) || []).forEach((function (t) {
        var n = "calc".concat(t.split("calc").join(""));
        e = e.replace(t, n)
      })), e
    }

    function g(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = arguments.length > 2 ? arguments[2] : void 0;
      if (-1 === e.indexOf("var(")) return e;
      var i = r("(", ")", e);

      function o(e) {
        var i = e.split(",")[0].replace(/[\s\n\t]/g, ""),
          o = (e.match(/(?:\s*,\s*){1}(.*)?/) || [])[1],
          s = Object.prototype.hasOwnProperty.call(t.variables, i) ? String(t.variables[i]) : void 0,
          a = s || (o ? String(o) : void 0),
          r = n || e;
        return s || t.onWarning('variable "'.concat(i, '" is undefined')), a && "undefined" !== a && a.length > 0 ? g(a, t, r) : "var(".concat(r, ")")
      }
      if (i) {
        if ("var" === i.pre.slice(-3)) {
          var s = 0 === i.body.trim().length;
          return s ? (t.onWarning("var() must contain a non-whitespace string"), e) : i.pre.slice(0, -3) + o(i.body) + g(i.post, t)
        }
        return i.pre + "(".concat(g(i.body, t), ")") + g(i.post, t)
      }
      return -1 !== e.indexOf("var(") && t.onWarning('missing closing ")" in the value "'.concat(e, '"')), e
    }
    var y = "undefined" != typeof window,
      b = y && window.CSS && window.CSS.supports && window.CSS.supports("(--a: 0)"),
      w = {
        group: 0,
        job: 0
      },
      S = {
        rootElement: y ? document : null,
        shadowDOM: !1,
        include: "style,link[rel=stylesheet]",
        exclude: "",
        variables: {},
        onlyLegacy: !0,
        preserveStatic: !0,
        preserveVars: !1,
        silent: !1,
        updateDOM: !0,
        updateURLs: !0,
        watch: null,
        onBeforeSend: function () {},
        onError: function () {},
        onWarning: function () {},
        onSuccess: function () {},
        onComplete: function () {},
        onFinally: function () {}
      },
      L = {
        cssComments: /\/\*[\s\S]+?\*\//g,
        cssKeyframes: /@(?:-\w*-)?keyframes/,
        cssMediaQueries: /@media[^{]+\{([\s\S]+?})\s*}/g,
        cssUrls: /url\((?!['"]?(?:data|http|\/\/):)['"]?([^'")]*)['"]?\)/g,
        cssVarDeclRules: /(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^}]*})/g,
        cssVarDecls: /(?:[\s;]*)(-{2}\w[\w-]*)(?:\s*:\s*)([^;]*);/g,
        cssVarFunc: /var\(\s*--[\w-]/,
        cssVars: /(?:(?::(?:root|host)(?![.:#(])[\s,]*[^{]*{\s*[^;]*;*\s*)|(?:var\(\s*))(--[^:)]+)(?:\s*[:)])/
      },
      x = {
        dom: {},
        job: {},
        user: {}
      },
      E = !1,
      O = null,
      C = 0,
      T = null,
      _ = !1;

    function M() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = "cssVars(): ",
        n = i({}, S, e);

      function o(e, i, o, s) {
        !n.silent && window.console && console.error("".concat(t).concat(e, "\n"), i), n.onError(e, i, o, s)
      }

      function a(e) {
        !n.silent && window.console && console.warn("".concat(t).concat(e)), n.onWarning(e)
      }

      function r(e) {
        n.onFinally(Boolean(e), b, H() - n.__benchmark)
      }
      if (y) {
        if (n.watch) return n.watch = S.watch, A(n), void M(n);
        if (!1 === n.watch && O && (O.disconnect(), O = null), !n.__benchmark) {
          if (E === n.rootElement) return void D(e);
          var l = Array.apply(null, n.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])'));
          if (n.__benchmark = H(), n.exclude = [O ? '[data-cssvars]:not([data-cssvars=""])' : '[data-cssvars="out"]', "link[disabled]:not([data-cssvars])", n.exclude].filter((function (e) {
              return e
            })).join(","), n.variables = N(n.variables), l.forEach((function (e) {
              var t = "style" === e.nodeName.toLowerCase() && e.__cssVars.text,
                n = t && e.textContent !== e.__cssVars.text;
              t && n && (e.sheet && (e.sheet.disabled = !1), e.setAttribute("data-cssvars", ""))
            })), !O) {
            var c = Array.apply(null, n.rootElement.querySelectorAll('[data-cssvars="out"]'));
            c.forEach((function (e) {
              var t = e.getAttribute("data-cssvars-group");
              (t ? n.rootElement.querySelector('[data-cssvars="src"][data-cssvars-group="'.concat(t, '"]')) : null) || e.parentNode.removeChild(e)
            })), C && l.length < C && (C = l.length, x.dom = {})
          }
        }
        if ("loading" !== document.readyState)
          if (b && n.onlyLegacy) {
            var d = !1;
            if (n.updateDOM) {
              var p = n.rootElement.host || (n.rootElement === document ? document.documentElement : n.rootElement);
              Object.keys(n.variables).forEach((function (e) {
                var t = n.variables[e];
                d = d || t !== getComputedStyle(p).getPropertyValue(e), p.style.setProperty(e, t)
              }))
            }
            r(d)
          } else !_ && (n.shadowDOM || n.rootElement.shadowRoot || n.rootElement.host) ? s({
            rootElement: S.rootElement,
            include: S.include,
            exclude: n.exclude,
            skipDisabled: !1,
            onSuccess: function (e, t, n) {
              return !((t.sheet || {}).disabled && !t.__cssVars) && ((e = ((e = e.replace(L.cssComments, "").replace(L.cssMediaQueries, "")).match(L.cssVarDeclRules) || []).join("")) || !1)
            },
            onComplete: function (e, t, i) {
              h(e, {
                store: x.dom,
                onWarning: a
              }), _ = !0, M(n)
            }
          }) : (E = n.rootElement, s({
            rootElement: n.rootElement,
            include: n.include,
            exclude: n.exclude,
            skipDisabled: !1,
            onBeforeSend: n.onBeforeSend,
            onError: function (e, t, n) {
              var i = e.responseURL || B(n, location.href),
                s = e.statusText ? "(".concat(e.statusText, ")") : "Unspecified Error" + (0 === e.status ? " (possibly CORS related)" : "");
              o("CSS XHR Error: ".concat(i, " ").concat(e.status, " ").concat(s), t, e, i)
            },
            onSuccess: function (e, t, i) {
              if ((t.sheet || {}).disabled && !t.__cssVars) return !1;
              var o = "link" === t.nodeName.toLowerCase(),
                s = "style" === t.nodeName.toLowerCase() && e !== t.textContent,
                a = n.onSuccess(e, t, i);
              return e = void 0 !== a && !1 === Boolean(a) ? "" : a || e, n.updateURLs && (o || s) && (e = k(e, i)), e
            },
            onComplete: function (e, t) {
              var s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
                l = i({}, x.dom, x.user);
              if (x.job = {}, s.forEach((function (e, i) {
                  var s = t[i];
                  if (e.__cssVars = e.__cssVars || {}, e.__cssVars.text = s, L.cssVars.test(s)) try {
                    var r = u(s, {
                      preserveStatic: n.preserveStatic,
                      removeComments: !0
                    });
                    h(r, {
                      parseHost: Boolean(n.rootElement.host),
                      store: x.dom,
                      onWarning: a
                    }), e.__cssVars.tree = r
                  } catch (t) {
                    o(t.message, e)
                  }
                })), i(x.job, x.dom), n.updateDOM ? (i(x.user, n.variables), i(x.job, x.user)) : (i(x.job, x.user, n.variables), i(l, n.variables)), w.job > 0 && Boolean(Object.keys(x.job).length > Object.keys(l).length || Boolean(Object.keys(l).length && Object.keys(x.job).some((function (e) {
                  return x.job[e] !== l[e]
                }))))) P(n.rootElement), M(n);
              else {
                var c = [],
                  d = [],
                  p = !1;
                if (n.updateDOM && w.job++, s.forEach((function (e, s) {
                    var r = !e.__cssVars.tree;
                    if (e.__cssVars.tree) try {
                      m(e.__cssVars.tree, i({}, n, {
                        variables: x.job,
                        onWarning: a
                      }));
                      var l = f(e.__cssVars.tree);
                      if (n.updateDOM) {
                        var u = t[s],
                          h = L.cssVarFunc.test(u);
                        if (e.getAttribute("data-cssvars") || e.setAttribute("data-cssvars", "src"), l.length && h) {
                          var v = e.getAttribute("data-cssvars-group") || ++w.group,
                            g = l.replace(/\s/g, ""),
                            y = n.rootElement.querySelector('[data-cssvars="out"][data-cssvars-group="'.concat(v, '"]')) || document.createElement("style");
                          p = p || L.cssKeyframes.test(l), n.preserveStatic && e.sheet && (e.sheet.disabled = !0), y.hasAttribute("data-cssvars") || y.setAttribute("data-cssvars", "out"), g === e.textContent.replace(/\s/g, "") ? (r = !0, y && y.parentNode && (e.removeAttribute("data-cssvars-group"), y.parentNode.removeChild(y))) : g !== y.textContent.replace(/\s/g, "") && ([e, y].forEach((function (e) {
                            e.setAttribute("data-cssvars-job", w.job), e.setAttribute("data-cssvars-group", v)
                          })), y.textContent = l, c.push(l), d.push(y), y.parentNode || e.parentNode.insertBefore(y, e.nextSibling))
                        }
                      } else e.textContent.replace(/\s/g, "") !== l && c.push(l)
                    } catch (t) {
                      o(t.message, e)
                    }
                    r && e.setAttribute("data-cssvars", "skip"), e.hasAttribute("data-cssvars-job") || e.setAttribute("data-cssvars-job", w.job)
                  })), C = n.rootElement.querySelectorAll('[data-cssvars]:not([data-cssvars="out"])').length, n.shadowDOM)
                  for (var v, g = [].concat(n.rootElement).concat(Array.apply(null, n.rootElement.querySelectorAll("*"))), y = 0; v = g[y]; ++y)
                    if (v.shadowRoot && v.shadowRoot.querySelector("style")) {
                      var b = i({}, n, {
                        rootElement: v.shadowRoot
                      });
                      M(b)
                    } n.updateDOM && p && j(n.rootElement), E = !1, n.onComplete(c.join(""), d, JSON.parse(JSON.stringify(x.job)), H() - n.__benchmark), r(d.length)
              }
            }
          }));
        else document.addEventListener("DOMContentLoaded", (function t(n) {
          M(e), document.removeEventListener("DOMContentLoaded", t)
        }))
      }
    }

    function A(e) {
      function t(e) {
        var t = n(e) && e.hasAttribute("disabled"),
          i = (e.sheet || {}).disabled;
        return t || i
      }

      function n(e) {
        return "link" === e.nodeName.toLowerCase() && -1 !== (e.getAttribute("rel") || "").indexOf("stylesheet")
      }

      function i(e) {
        return "style" === e.nodeName.toLowerCase()
      }
      window.MutationObserver && (O && (O.disconnect(), O = null), (O = new MutationObserver((function (o) {
        o.some((function (o) {
          return function (i) {
            var o = !1;
            if ("attributes" === i.type && n(i.target) && !t(i.target)) {
              var s = "disabled" === i.attributeName,
                a = "href" === i.attributeName,
                r = "skip" === i.target.getAttribute("data-cssvars"),
                l = "src" === i.target.getAttribute("data-cssvars");
              s ? o = !r && !l : a && (r ? i.target.setAttribute("data-cssvars", "") : l && P(e.rootElement, !0), o = !0)
            }
            return o
          }(o) || function (e) {
            var t = !1;
            if ("childList" === e.type) {
              var n = i(e.target),
                o = "out" === e.target.getAttribute("data-cssvars");
              t = n && !o
            }
            return t
          }(o) || function (e) {
            var o = !1;
            return "childList" === e.type && (o = Array.apply(null, e.addedNodes).some((function (e) {
              var o = 1 === e.nodeType && e.hasAttribute("data-cssvars"),
                s = i(e) && L.cssVars.test(e.textContent);
              return !o && (n(e) || s) && !t(e)
            }))), o
          }(o) || function (t) {
            var n = !1;
            return "childList" === t.type && (n = Array.apply(null, t.removedNodes).some((function (t) {
              var n = 1 === t.nodeType,
                i = n && "out" === t.getAttribute("data-cssvars"),
                o = n && "src" === t.getAttribute("data-cssvars"),
                s = o;
              if (o || i) {
                var a = t.getAttribute("data-cssvars-group"),
                  r = e.rootElement.querySelector('[data-cssvars-group="'.concat(a, '"]'));
                o && P(e.rootElement, !0), r && r.parentNode.removeChild(r)
              }
              return s
            }))), n
          }(o)
        })) && M(e)
      }))).observe(document.documentElement, {
        attributes: !0,
        attributeFilter: ["disabled", "href"],
        childList: !0,
        subtree: !0
      }))
    }

    function D(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100;
      clearTimeout(T), T = setTimeout((function () {
        e.__benchmark = null, M(e)
      }), t)
    }

    function j(e) {
      var t = ["animation-name", "-moz-animation-name", "-webkit-animation-name"].filter((function (e) {
        return getComputedStyle(document.body)[e]
      }))[0];
      if (t) {
        for (var n = e.getElementsByTagName("*"), i = [], o = "__CSSVARSPONYFILL-KEYFRAMES__", s = 0, a = n.length; s < a; s++) {
          var r = n[s];
          "none" !== getComputedStyle(r)[t] && (r.style[t] += o, i.push(r))
        }
        document.body.offsetHeight;
        for (var l = 0, c = i.length; l < c; l++) {
          var d = i[l].style;
          d[t] = d[t].replace(o, "")
        }
      }
    }

    function k(e, t) {
      return (e.replace(L.cssComments, "").match(L.cssUrls) || []).forEach((function (n) {
        var i = n.replace(L.cssUrls, "$1"),
          o = B(i, t);
        e = e.replace(n, n.replace(i, o))
      })), e
    }

    function N() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = /^-{2}/;
      return Object.keys(e).reduce((function (n, i) {
        return n[t.test(i) ? i : "--".concat(i.replace(/^-+/, ""))] = e[i], n
      }), {})
    }

    function B(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : location.href,
        n = document.implementation.createHTMLDocument(""),
        i = n.createElement("base"),
        o = n.createElement("a");
      return n.head.appendChild(i), n.body.appendChild(o), i.href = t, o.href = e, o.href
    }

    function H() {
      return y && (window.performance || {}).now ? window.performance.now() : (new Date).getTime()
    }

    function P(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        n = Array.apply(null, e.querySelectorAll('[data-cssvars="skip"],[data-cssvars="src"]'));
      n.forEach((function (e) {
        return e.setAttribute("data-cssvars", "")
      })), t && (x.dom = {})
    }
    M.reset = function () {
      for (var e in w.job = 0, w.group = 0, E = !1, O && (O.disconnect(), O = null), C = 0, T = null, _ = !1, x) x[e] = {}
    };
    var V = M,
      F = (n(16), n(6)),
      R = n.n(F),
      q = n(7),
      I = n.n(q);
    const Y = ["load", "resize"];

    function U(e, t = !1, n) {
      Y.forEach((i => {
        let o = () => e(n);
        t && "resize" === i && (o = I()((() => e(n)), t, n)), window.addEventListener(i, o)
      }))
    }

    function X(e) {
      return window.matchMedia(e).matches
    }

    function J(e) {
      Object.keys(e).forEach((t => {
        const n = e[t];
        Object.keys(n).forEach((e => {
          X(n[e].toString()) ? document.body.classList.add(`${t}__${e}`) : document.body.classList.remove(`${t}__${e}`)
        }))
      }))
    }
    var W = n(8),
      G = n.n(W);
    var z, $ = n(9),
      K = n.n($),
      Q = (n(17), n(18), n(0));
    (z = Drupal.behaviors).jpgStickyHeader = {
      attach: function (e) {
        var t = e.querySelector(".site-template__header"),
          n = 100,
          i = function (e) {
            t.style.backgroundColor = "rgba(255, 255, 255, ".concat(e, ")")
          };
        t && !t.classList.contains("js-sticky-header") && (document.body.classList && (!document.body.classList || document.body.classList.contains("header-color-black-on-white") || document.body.classList.contains("header-color-white")) || (window.pageYOffset < n ? i(window.pageYOffset / n) : i(1)), window.pageYOffset > 0 && t.classList.add("scrolled"), window.pageYOffset > n && t.classList.add("fully-visible"), window.addEventListener("scroll", (function () {
          window.pageYOffset < 0 && "rgba(255, 255, 255, 0)" !== t.style.backgroundColor && (!document.body.classList || document.body.classList && !document.body.classList.contains("header-color-black-on-white") && !document.body.classList.contains("header-color-white")) && i(0), window.pageYOffset <= n && window.pageYOffset >= 0 && (!document.body.classList || document.body.classList && !document.body.classList.contains("header-color-black-on-white") && !document.body.classList.contains("header-color-white")) && i(window.pageYOffset / n), window.pageYOffset > n && "rgb(255, 255, 255)" !== t.style.backgroundColor && (!document.body.classList || document.body.classList && !document.body.classList.contains("header-color-black-on-white") && !document.body.classList.contains("header-color-white")) && i(1), window.pageYOffset > 0 && !t.classList.contains("scrolled") && t.classList.add("scrolled"), window.pageYOffset <= 0 && t.classList.contains("scrolled") && t.classList.remove("scrolled"), window.pageYOffset > n && !t.classList.contains("fully-visible") && t.classList.add("fully-visible"), window.pageYOffset <= n && t.classList.contains("fully-visible") && t.classList.remove("fully-visible")
        })), t.classList.add("js-sticky-header"))
      }
    }, z.jpgHeaderDropdown = {
      attach: function (e) {
        var t = e.querySelector(".site-template"),
          n = e.querySelector(".site-template__header"),
          i = function (e, t, i) {
            e.appendChild(t), t.classList.add("switched-position"), n.classList.contains("side-nav-visible") && (n.classList.remove("side-nav-visible"), Object(Q.b)(i))
          };
        if (t && n && !n.classList.contains("js-header-dropdown")) {
          n.classList.add("js-header-dropdown");
          var o = n.querySelector(".menu-top__item"),
            s = n.querySelector(".site-template__nav-button--cross"),
            a = n.querySelector(".site-template__nav-button--burger"),
            r = n.querySelector(".site-template__header-dropdown"),
            l = n.querySelector(".site-template__header-dropdown-cols"),
            c = r.querySelector(".site-template__header-dropdown-col--image"),
            d = t.querySelector(".site-template__loading"),
            u = document.createElement("div");
          if (u.className = "site-template__overlay", t.appendChild(u), o && !o.classList.contains("js-header-item-dropdown") && r && l) {
            o.classList.add("js-header-item-dropdown"), o.addEventListener("mouseenter", (function () {
              n.classList.add("dropdown-visible"), Object(Q.a)(r, {
                reserveScrollBarGap: !0
              }), document.body.style.paddingRight && (n.style.paddingRight = document.body.style.paddingRight, r.style.paddingRight = document.body.style.paddingRight, c && (c.style.marginRight = "-".concat(document.body.style.paddingRight)), d && (d.style.width = "calc(100% - ".concat(document.body.style.paddingRight, ")"))), u.classList.add("site-template__overlay--active")
            })), o.addEventListener("mouseleave", (function () {
              n.classList.remove("dropdown-visible"), Object(Q.b)(r), n.style.paddingRight = null, r.style.paddingRight = null, c && (c.style.marginRight = null), d && (d.style.width = null), u.classList.remove("site-template__overlay--active")
            }));
            var h = window.matchMedia("(min-width: 1280px)");
            h.matches && i(o, r, l), h.addEventListener("change", (function (e) {
              e.matches && !r.classList.contains("switched-position") && i(o, r, l), !e.matches && r.classList.contains("switched-position") && function (e, t) {
                n.appendChild(t), t.classList.remove("switched-position")
              }(0, r)
            }))
          }
          r && l && s && a && (a.addEventListener("click", (function () {
            t.classList.contains("side-cart-opened") || (n.classList.add("side-nav-visible"), u.classList.add("site-template__overlay--active"), Object(Q.a)(l))
          })), s.addEventListener("click", (function () {
            t.classList.contains("side-cart-opened") || (n.classList.remove("side-nav-visible"), u.classList.remove("site-template__overlay--active"), Object(Q.b)(l))
          })))
        }
      }
    };
    var Z = n(10),
      ee = n.n(Z);
    Drupal.behaviors.jpgSelect = {
      attach: function (e) {
        ! function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            t = e.className,
            n = void 0 === t ? "select__tag" : t,
            i = e.context,
            o = void 0 === i ? document : i;
          Array.prototype.forEach.call(o.querySelectorAll(".".concat(n, ":not(.js-").concat(n, ")")), (function (e) {
            new ee.a({
              select: e,
              showSearch: !1,
              hideSelectedOption: !0
            }), e.classList.add("js-".concat(n))
          }))
        }({
          context: e
        })
      }
    }, R.a.polyfill(), U(J, !1, K.a), document.addEventListener("DOMContentLoaded", (function () {
      G()()
    })), V({
      watch: !0,
      onComplete: function () {
        var e = window.document.createEvent("UIEvents");
        e.initUIEvent("resize", !0, !1, window, 0), window.dispatchEvent(e)
      }
    })
  },
  6: function (e, t, n) {
    ! function () {
      "use strict";
      e.exports = {
        polyfill: function () {
          var e = window,
            t = document;
          if (!("scrollBehavior" in t.documentElement.style) || !0 === e.__forceSmoothScrollPolyfill__) {
            var n, i = e.HTMLElement || e.Element,
              o = {
                scroll: e.scroll || e.scrollTo,
                scrollBy: e.scrollBy,
                elementScroll: i.prototype.scroll || r,
                scrollIntoView: i.prototype.scrollIntoView
              },
              s = e.performance && e.performance.now ? e.performance.now.bind(e.performance) : Date.now,
              a = (n = e.navigator.userAgent, new RegExp(["MSIE ", "Trident/", "Edge/"].join("|")).test(n) ? 1 : 0);
            e.scroll = e.scrollTo = function () {
              void 0 !== arguments[0] && (!0 !== l(arguments[0]) ? p.call(e, t.body, void 0 !== arguments[0].left ? ~~arguments[0].left : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? ~~arguments[0].top : e.scrollY || e.pageYOffset) : o.scroll.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : e.scrollX || e.pageXOffset, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : e.scrollY || e.pageYOffset))
            }, e.scrollBy = function () {
              void 0 !== arguments[0] && (l(arguments[0]) ? o.scrollBy.call(e, void 0 !== arguments[0].left ? arguments[0].left : "object" != typeof arguments[0] ? arguments[0] : 0, void 0 !== arguments[0].top ? arguments[0].top : void 0 !== arguments[1] ? arguments[1] : 0) : p.call(e, t.body, ~~arguments[0].left + (e.scrollX || e.pageXOffset), ~~arguments[0].top + (e.scrollY || e.pageYOffset)))
            }, i.prototype.scroll = i.prototype.scrollTo = function () {
              if (void 0 !== arguments[0])
                if (!0 !== l(arguments[0])) {
                  var e = arguments[0].left,
                    t = arguments[0].top;
                  p.call(this, this, void 0 === e ? this.scrollLeft : ~~e, void 0 === t ? this.scrollTop : ~~t)
                } else {
                  if ("number" == typeof arguments[0] && void 0 === arguments[1]) throw new SyntaxError("Value could not be converted");
                  o.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left : "object" != typeof arguments[0] ? ~~arguments[0] : this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top : void 0 !== arguments[1] ? ~~arguments[1] : this.scrollTop)
                }
            }, i.prototype.scrollBy = function () {
              void 0 !== arguments[0] && (!0 !== l(arguments[0]) ? this.scroll({
                left: ~~arguments[0].left + this.scrollLeft,
                top: ~~arguments[0].top + this.scrollTop,
                behavior: arguments[0].behavior
              }) : o.elementScroll.call(this, void 0 !== arguments[0].left ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, void 0 !== arguments[0].top ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop))
            }, i.prototype.scrollIntoView = function () {
              if (!0 !== l(arguments[0])) {
                var n = h(this),
                  i = n.getBoundingClientRect(),
                  s = this.getBoundingClientRect();
                n !== t.body ? (p.call(this, n, n.scrollLeft + s.left - i.left, n.scrollTop + s.top - i.top), "fixed" !== e.getComputedStyle(n).position && e.scrollBy({
                  left: i.left,
                  top: i.top,
                  behavior: "smooth"
                })) : e.scrollBy({
                  left: s.left,
                  top: s.top,
                  behavior: "smooth"
                })
              } else o.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0])
            }
          }

          function r(e, t) {
            this.scrollLeft = e, this.scrollTop = t
          }

          function l(e) {
            if (null === e || "object" != typeof e || void 0 === e.behavior || "auto" === e.behavior || "instant" === e.behavior) return !0;
            if ("object" == typeof e && "smooth" === e.behavior) return !1;
            throw new TypeError("behavior member of ScrollOptions " + e.behavior + " is not a valid value for enumeration ScrollBehavior.")
          }

          function c(e, t) {
            return "Y" === t ? e.clientHeight + a < e.scrollHeight : "X" === t ? e.clientWidth + a < e.scrollWidth : void 0
          }

          function d(t, n) {
            var i = e.getComputedStyle(t, null)["overflow" + n];
            return "auto" === i || "scroll" === i
          }

          function u(e) {
            var t = c(e, "Y") && d(e, "Y"),
              n = c(e, "X") && d(e, "X");
            return t || n
          }

          function h(e) {
            for (; e !== t.body && !1 === u(e);) e = e.parentNode || e.host;
            return e
          }

          function f(t) {
            var n, i, o, a, r = (s() - t.startTime) / 468;
            a = r = r > 1 ? 1 : r, n = .5 * (1 - Math.cos(Math.PI * a)), i = t.startX + (t.x - t.startX) * n, o = t.startY + (t.y - t.startY) * n, t.method.call(t.scrollable, i, o), i === t.x && o === t.y || e.requestAnimationFrame(f.bind(e, t))
          }

          function p(n, i, a) {
            var l, c, d, u, h = s();
            n === t.body ? (l = e, c = e.scrollX || e.pageXOffset, d = e.scrollY || e.pageYOffset, u = o.scroll) : (l = n, c = n.scrollLeft, d = n.scrollTop, u = r), f({
              scrollable: l,
              method: u,
              startTime: h,
              startX: c,
              startY: d,
              x: i,
              y: a
            })
          }
        }
      }
    }()
  },
  7: function (e, t, n) {
    (function (t) {
      var n = /^\s+|\s+$/g,
        i = /^[-+]0x[0-9a-f]+$/i,
        o = /^0b[01]+$/i,
        s = /^0o[0-7]+$/i,
        a = parseInt,
        r = "object" == typeof t && t && t.Object === Object && t,
        l = "object" == typeof self && self && self.Object === Object && self,
        c = r || l || Function("return this")(),
        d = Object.prototype.toString,
        u = Math.max,
        h = Math.min,
        f = function () {
          return c.Date.now()
        };

      function p(e) {
        var t = typeof e;
        return !!e && ("object" == t || "function" == t)
      }

      function m(e) {
        if ("number" == typeof e) return e;
        if (function (e) {
            return "symbol" == typeof e || function (e) {
              return !!e && "object" == typeof e
            }(e) && "[object Symbol]" == d.call(e)
          }(e)) return NaN;
        if (p(e)) {
          var t = "function" == typeof e.valueOf ? e.valueOf() : e;
          e = p(t) ? t + "" : t
        }
        if ("string" != typeof e) return 0 === e ? e : +e;
        e = e.replace(n, "");
        var r = o.test(e);
        return r || s.test(e) ? a(e.slice(2), r ? 2 : 8) : i.test(e) ? NaN : +e
      }
      e.exports = function (e, t, n) {
        var i, o, s, a, r, l, c = 0,
          d = !1,
          v = !1,
          g = !0;
        if ("function" != typeof e) throw new TypeError("Expected a function");

        function y(t) {
          var n = i,
            s = o;
          return i = o = void 0, c = t, a = e.apply(s, n)
        }

        function b(e) {
          return c = e, r = setTimeout(S, t), d ? y(e) : a
        }

        function w(e) {
          var n = e - l;
          return void 0 === l || n >= t || n < 0 || v && e - c >= s
        }

        function S() {
          var e = f();
          if (w(e)) return L(e);
          r = setTimeout(S, function (e) {
            var n = t - (e - l);
            return v ? h(n, s - (e - c)) : n
          }(e))
        }

        function L(e) {
          return r = void 0, g && i ? y(e) : (i = o = void 0, a)
        }

        function x() {
          var e = f(),
            n = w(e);
          if (i = arguments, o = this, l = e, n) {
            if (void 0 === r) return b(l);
            if (v) return r = setTimeout(S, t), y(l)
          }
          return void 0 === r && (r = setTimeout(S, t)), a
        }
        return t = m(t) || 0, p(n) && (d = !!n.leading, s = (v = "maxWait" in n) ? u(m(n.maxWait) || 0, t) : s, g = "trailing" in n ? !!n.trailing : g), x.cancel = function () {
          void 0 !== r && clearTimeout(r), c = 0, i = l = o = r = void 0
        }, x.flush = function () {
          return void 0 === r ? a : L(f())
        }, x
      }
    }).call(this, n(1))
  },
  8: function (e, t, n) {
    var i, o;
    o = this, void 0 === (i = function () {
      return o.svg4everybody = function () {
        function e(e, t, n) {
          if (n) {
            var i = document.createDocumentFragment(),
              o = !t.hasAttribute("viewBox") && n.getAttribute("viewBox");
            o && t.setAttribute("viewBox", o);
            for (var s = n.cloneNode(!0); s.childNodes.length;) i.appendChild(s.firstChild);
            e.appendChild(i)
          }
        }

        function t(t) {
          t.onreadystatechange = function () {
            if (4 === t.readyState) {
              var n = t._cachedDocument;
              n || ((n = t._cachedDocument = document.implementation.createHTMLDocument("")).body.innerHTML = t.responseText, t._cachedTarget = {}), t._embeds.splice(0).map((function (i) {
                var o = t._cachedTarget[i.id];
                o || (o = t._cachedTarget[i.id] = n.getElementById(i.id)), e(i.parent, i.svg, o)
              }))
            }
          }, t.onreadystatechange()
        }

        function n(n) {
          function o() {
            for (var n = 0; n < p.length;) {
              var r = p[n],
                l = r.parentNode,
                c = i(l),
                d = r.getAttribute("xlink:href") || r.getAttribute("href");
              if (!d && a.attributeName && (d = r.getAttribute(a.attributeName)), c && d) {
                if (s)
                  if (!a.validate || a.validate(d, c, r)) {
                    l.removeChild(r);
                    var u = d.split("#"),
                      v = u.shift(),
                      g = u.join("#");
                    if (v.length) {
                      var y = h[v];
                      y || ((y = h[v] = new XMLHttpRequest).open("GET", v), y.send(), y._embeds = []), y._embeds.push({
                        parent: l,
                        svg: c,
                        id: g
                      }), t(y)
                    } else e(l, c, document.getElementById(g))
                  } else ++n, ++m
              } else ++n
            }(!p.length || p.length - m > 0) && f(o, 67)
          }
          var s, a = Object(n),
            r = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
            l = /\bAppleWebKit\/(\d+)\b/,
            c = /\bEdge\/12\.(\d+)\b/,
            d = /\bEdge\/.(\d+)\b/,
            u = window.top !== window.self;
          s = "polyfill" in a ? a.polyfill : r.test(navigator.userAgent) || (navigator.userAgent.match(c) || [])[1] < 10547 || (navigator.userAgent.match(l) || [])[1] < 537 || d.test(navigator.userAgent) && u;
          var h = {},
            f = window.requestAnimationFrame || setTimeout,
            p = document.getElementsByTagName("use"),
            m = 0;
          s && o()
        }

        function i(e) {
          for (var t = e;
            "svg" !== t.nodeName.toLowerCase() && (t = t.parentNode););
          return t
        }
        return n
      }()
    }.apply(t, [])) || (e.exports = i)
  },
  9: function (e, t) {
    e.exports = {
      jpg: {
        xs_1x: "all and (min-width: 320px)",
        xs_2x: "all and (min-width: 320px) and (min-resolution: 2dppx)",
        s_1x: "all and (min-width: 480px)",
        s_2x: "all and (min-width: 480px) and (min-resolution: 2dppx)",
        s_max_1x: "all and (max-width: 767px)",
        s_max_2x: "all and (max-width: 767px) and (min-resolution: 2dppx)",
        m_1x: "all and (min-width: 768px)",
        m_2x: "all and (min-width: 768px) and (min-resolution: 2dppx)",
        l_1x: "all and (min-width: 1025px)",
        l_2x: "all and (min-width: 1025px) and (min-resolution: 2dppx)",
        xl_1x: "all and (min-width: 1200px)",
        xl_2x: "all and (min-width: 1200px) and (min-resolution: 2dppx)",
        xl_more_1x: "all and (min-width: 1280px)",
        xl_more_2x: "all and (min-width: 1280px) and (min-resolution: 2dppx)",
        xxl_less_1x: "all and (min-width: 1400px)",
        xxl_less_2x: "all and (min-width: 1400px) and (min-resolution: 2dppx)",
        xxl_1x: "all and (min-width: 1440px)",
        xxl_2x: "all and (min-width: 1440px) and (min-resolution: 2dppx)",
        xxxl_1x: "all and (min-width: 1920px)",
        xxxl_2x: "all and (min-width: 1920px) and (min-resolution: 2dppx)",
        xxxxl_1x: "all and (min-width: 2560px)",
        xxxxl_2x: "all and (min-width: 2560px) and (min-resolution: 2dppx)"
      }
    }
  }
});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal) {
  Drupal.theme.progressBar = function (id) {
    return '<div id="' + id + '" class="progress" aria-live="polite">' + '<div class="progress__label">&nbsp;</div>' + '<div class="progress__track"><div class="progress__bar"></div></div>' + '<div class="progress__percentage"></div>' + '<div class="progress__description">&nbsp;</div>' + '</div>';
  };

  Drupal.ProgressBar = function (id, updateCallback, method, errorCallback) {
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;

    this.element = $(Drupal.theme('progressBar', id));
  };

  $.extend(Drupal.ProgressBar.prototype, {
    setProgress: function setProgress(percentage, message, label) {
      if (percentage >= 0 && percentage <= 100) {
        $(this.element).find('div.progress__bar').css('width', percentage + '%');
        $(this.element).find('div.progress__percentage').html(percentage + '%');
      }
      $('div.progress__description', this.element).html(message);
      $('div.progress__label', this.element).html(label);
      if (this.updateCallback) {
        this.updateCallback(percentage, message, this);
      }
    },
    startMonitoring: function startMonitoring(uri, delay) {
      this.delay = delay;
      this.uri = uri;
      this.sendPing();
    },
    stopMonitoring: function stopMonitoring() {
      clearTimeout(this.timer);

      this.uri = null;
    },
    sendPing: function sendPing() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.uri) {
        var pb = this;

        var uri = this.uri;
        if (uri.indexOf('?') === -1) {
          uri += '?';
        } else {
          uri += '&';
        }
        uri += '_format=json';
        $.ajax({
          type: this.method,
          url: uri,
          data: '',
          dataType: 'json',
          success: function success(progress) {
            if (progress.status === 0) {
              pb.displayError(progress.data);
              return;
            }

            pb.setProgress(progress.percentage, progress.message, progress.label);

            pb.timer = setTimeout(function () {
              pb.sendPing();
            }, pb.delay);
          },
          error: function error(xmlhttp) {
            var e = new Drupal.AjaxError(xmlhttp, pb.uri);
            pb.displayError('<pre>' + e.message + '</pre>');
          }
        });
      }
    },
    displayError: function displayError(string) {
      var error = $('<div class="messages messages--error"></div>').html(string);
      $(this.element).before(error).hide();

      if (this.errorCallback) {
        this.errorCallback(this);
      }
    }
  });
})(jQuery, Drupal);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function (Drupal) {
  Drupal.behaviors.responsiveImageAJAX = {
    attach: function attach() {
      if (window.picturefill) {
        window.picturefill();
      }
    }
  };
})(Drupal);;
! function (e) {
  var t = {};

  function r(a) {
    if (t[a]) return t[a].exports;
    var n = t[a] = {
      i: a,
      l: !1,
      exports: {}
    };
    return e[a].call(n.exports, n, n.exports, r), n.l = !0, n.exports
  }
  r.m = e, r.c = t, r.d = function (e, t, a) {
    r.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: a
    })
  }, r.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, r.t = function (e, t) {
    if (1 & t && (e = r(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var a = Object.create(null);
    if (r.r(a), Object.defineProperty(a, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e)
      for (var n in e) r.d(a, n, function (t) {
        return e[t]
      }.bind(null, n));
    return a
  }, r.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default
    } : function () {
      return e
    };
    return r.d(t, "a", t), t
  }, r.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, r.p = "", r(r.s = 142)
}({
  142: function (e, t) {
    function r(e) {
      return function (e) {
        if (Array.isArray(e)) return a(e)
      }(e) || function (e) {
        if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e)
      }(e) || function (e, t) {
        if (!e) return;
        if ("string" == typeof e) return a(e, t);
        var r = Object.prototype.toString.call(e).slice(8, -1);
        "Object" === r && e.constructor && (r = e.constructor.name);
        if ("Map" === r || "Set" === r) return Array.from(e);
        if ("Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return a(e, t)
      }(e) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
      }()
    }

    function a(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var r = 0, a = new Array(t); r < t; r++) a[r] = e[r];
      return a
    }! function (e, t, a, n) {
      a.behaviors.AJAX = {
        attach: function (t, r) {
          Object.keys(r.ajax || {}).forEach((function (t) {
            return function (t) {
              var n = r.ajax[t];
              void 0 === n.selector && (n.selector = "#".concat(t)), e(n.selector).once("drupal-ajax").each((function () {
                n.element = this, n.base = t, a.ajax(n)
              }))
            }(t)
          })), a.ajax.bindAjaxLinks(document.body), e(".use-ajax-submit").once("ajax").each((function () {
            var t = {};
            t.url = e(this.form).attr("action"), t.setClick = !0, t.event = "click", t.progress = {
              type: "throbber"
            }, t.base = e(this).attr("id"), t.element = this, a.ajax(t)
          }))
        },
        detach: function (e, t, r) {
          "unload" === r && a.ajax.expired().forEach((function (e) {
            a.ajax.instances[e.instanceIndex] = null
          }))
        }
      }, a.AjaxError = function (t, r, n) {
        var o, s, i;
        o = t.status ? "\n".concat(a.t("An AJAX HTTP error occurred."), "\n").concat(a.t("HTTP Result Code: !status", {
          "!status": t.status
        })) : "\n".concat(a.t("An AJAX HTTP request terminated abnormally.")), o += "\n".concat(a.t("Debugging information follows."));
        var c = "\n".concat(a.t("Path: !uri", {
          "!uri": r
        }));
        s = "";
        try {
          s = "\n".concat(a.t("StatusText: !statusText", {
            "!statusText": e.trim(t.statusText)
          }))
        } catch (e) {}
        i = "";
        try {
          i = "\n".concat(a.t("ResponseText: !responseText", {
            "!responseText": e.trim(t.responseText)
          }))
        } catch (e) {}
        i = (i = i.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, "")).replace(/[\n]+\s+/g, "\n");
        var l = 0 === t.status ? "\n".concat(a.t("ReadyState: !readyState", {
          "!readyState": t.readyState
        })) : "";
        n = n ? "\n".concat(a.t("CustomMessage: !customMessage", {
          "!customMessage": n
        })) : "", this.message = o + c + s + n + i + l, this.name = "AjaxError"
      }, a.AjaxError.prototype = new Error, a.AjaxError.prototype.constructor = a.AjaxError, a.ajax = function (e) {
        if (1 !== arguments.length) throw new Error("Drupal.ajax() function must be called with one configuration object only");
        var t = e.base || !1,
          r = e.element || !1;
        delete e.base, delete e.element, e.progress || r || (e.progress = !1);
        var n = new a.Ajax(t, r, e);
        return n.instanceIndex = a.ajax.instances.length, a.ajax.instances.push(n), n
      }, a.ajax.instances = [], a.ajax.expired = function () {
        return a.ajax.instances.filter((function (e) {
          return e && !1 !== e.element && !document.body.contains(e.element)
        }))
      }, a.ajax.bindAjaxLinks = function (t) {
        e(t).find(".use-ajax").once("ajax").each((function (t, r) {
          var n = e(r),
            o = {
              progress: {
                type: "throbber"
              },
              dialogType: n.data("dialog-type"),
              dialog: n.data("dialog-options"),
              dialogRenderer: n.data("dialog-renderer"),
              base: n.attr("id"),
              element: r
            },
            s = n.attr("href");
          s && (o.url = s, o.event = "click"), a.ajax(o)
        }))
      }, a.Ajax = function (t, r, o) {
        var s = {
          event: r ? "mousedown" : null,
          keypress: !0,
          selector: t ? "#".concat(t) : null,
          effect: "none",
          speed: "none",
          method: "replaceWith",
          progress: {
            type: "throbber",
            message: a.t("Please wait...")
          },
          submit: {
            js: !0
          }
        };
        if (e.extend(this, s, o), this.commands = new a.AjaxCommands, this.instanceIndex = !1, this.wrapper && (this.wrapper = "#".concat(this.wrapper)), this.element = r, this.element_settings = o, this.elementSettings = o, this.element && this.element.form && (this.$form = e(this.element.form)), !this.url) {
          var i = e(this.element);
          i.is("a") ? this.url = i.attr("href") : this.element && r.form && (this.url = this.$form.attr("action"))
        }
        var c = this.url;
        this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, "/ajax$1"), n.ajaxTrustedUrl[c] && (n.ajaxTrustedUrl[this.url] = !0);
        var l = this;
        l.options = {
          url: l.url,
          data: l.submit,
          beforeSerialize: function (e, t) {
            return l.beforeSerialize(e, t)
          },
          beforeSubmit: function (e, t, r) {
            return l.ajaxing = !0, l.beforeSubmit(e, t, r)
          },
          beforeSend: function (e, t) {
            return l.ajaxing = !0, l.beforeSend(e, t)
          },
          success: function (t, r, o) {
            if ("string" == typeof t && (t = e.parseJSON(t)), null !== t && !n.ajaxTrustedUrl[l.url] && "1" !== o.getResponseHeader("X-Drupal-Ajax-Token")) {
              var s = a.t("The response failed verification so will not be processed.");
              return l.error(o, l.url, s)
            }
            return l.success(t, r)
          },
          complete: function (e, t) {
            if (l.ajaxing = !1, "error" === t || "parsererror" === t) return l.error(e, l.url)
          },
          dataType: "json",
          jsonp: !1,
          type: "POST"
        }, o.dialog && (l.options.data.dialogOptions = o.dialog), -1 === l.options.url.indexOf("?") ? l.options.url += "?" : l.options.url += "&";
        var u = "drupal_".concat(o.dialogType || "ajax");
        o.dialogRenderer && (u += ".".concat(o.dialogRenderer)), l.options.url += "".concat(a.ajax.WRAPPER_FORMAT, "=").concat(u), e(l.element).on(o.event, (function (e) {
          if (!n.ajaxTrustedUrl[l.url] && !a.url.isLocal(l.url)) throw new Error(a.t("The callback URL is not local and not trusted: !url", {
            "!url": l.url
          }));
          return l.eventResponse(this, e)
        })), o.keypress && e(l.element).on("keypress", (function (e) {
          return l.keypressResponse(this, e)
        })), o.prevent && e(l.element).on(o.prevent, !1)
      }, a.ajax.WRAPPER_FORMAT = "_wrapper_format", a.Ajax.AJAX_REQUEST_PARAMETER = "_drupal_ajax", a.Ajax.prototype.execute = function () {
        if (!this.ajaxing) try {
          return this.beforeSerialize(this.element, this.options), e.ajax(this.options)
        } catch (r) {
          return this.ajaxing = !1, t.alert("An error occurred while attempting to process ".concat(this.options.url, ": ").concat(r.message)), e.Deferred().reject()
        }
      }, a.Ajax.prototype.keypressResponse = function (t, r) {
        (13 === r.which || 32 === r.which && "text" !== t.type && "textarea" !== t.type && "tel" !== t.type && "number" !== t.type) && (r.preventDefault(), r.stopPropagation(), e(t).trigger(this.elementSettings.event))
      }, a.Ajax.prototype.eventResponse = function (r, a) {
        a.preventDefault(), a.stopPropagation();
        var n = this;
        if (!n.ajaxing) try {
          n.$form ? (n.setClick && (r.form.clk = r), n.$form.ajaxSubmit(n.options)) : (n.beforeSerialize(n.element, n.options), e.ajax(n.options))
        } catch (e) {
          n.ajaxing = !1, t.alert("An error occurred while attempting to process ".concat(n.options.url, ": ").concat(e.message))
        }
      }, a.Ajax.prototype.beforeSerialize = function (e, t) {
        if (this.$form && document.body.contains(this.$form.get(0))) {
          var r = this.settings || n;
          a.detachBehaviors(this.$form.get(0), r, "serialize")
        }
        t.data[a.Ajax.AJAX_REQUEST_PARAMETER] = 1;
        var o = n.ajaxPageState;
        t.data["ajax_page_state[theme]"] = o.theme, t.data["ajax_page_state[theme_token]"] = o.theme_token, t.data["ajax_page_state[libraries]"] = o.libraries
      }, a.Ajax.prototype.beforeSubmit = function (e, t, r) {}, a.Ajax.prototype.beforeSend = function (t, r) {
        if (this.$form) {
          r.extraData = r.extraData || {}, r.extraData.ajax_iframe_upload = "1";
          var a = e.fieldValue(this.element);
          null !== a && (r.extraData[this.element.name] = a)
        }
        if (e(this.element).prop("disabled", !0), this.progress && this.progress.type) {
          var n = "setProgressIndicator".concat(this.progress.type.slice(0, 1).toUpperCase()).concat(this.progress.type.slice(1).toLowerCase());
          n in this && "function" == typeof this[n] && this[n].call(this)
        }
      }, a.theme.ajaxProgressThrobber = function (e) {
        var t = "string" == typeof e ? a.theme("ajaxProgressMessage", e) : "";
        return '<div class="ajax-progress ajax-progress-throbber">'.concat('<div class="throbber">&nbsp;</div>').concat(t, "</div>")
      }, a.theme.ajaxProgressIndicatorFullscreen = function () {
        return '<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>'
      }, a.theme.ajaxProgressMessage = function (e) {
        return '<div class="message">'.concat(e, "</div>")
      }, a.theme.ajaxProgressBar = function (t) {
        return e('<div class="ajax-progress ajax-progress-bar"></div>').append(t)
      }, a.Ajax.prototype.setProgressIndicatorBar = function () {
        var t = new a.ProgressBar("ajax-progress-".concat(this.element.id), e.noop, this.progress.method, e.noop);
        this.progress.message && t.setProgress(-1, this.progress.message), this.progress.url && t.startMonitoring(this.progress.url, this.progress.interval || 1500), this.progress.element = e(a.theme("ajaxProgressBar", t.element)), this.progress.object = t, e(this.element).after(this.progress.element)
      }, a.Ajax.prototype.setProgressIndicatorThrobber = function () {
        this.progress.element = e(a.theme("ajaxProgressThrobber", this.progress.message)), e("body").append(this.progress.element)
      }, a.Ajax.prototype.setProgressIndicatorFullscreen = function () {
        this.progress.element = e(a.theme("ajaxProgressIndicatorFullscreen")), e("body").append(this.progress.element)
      }, a.Ajax.prototype.success = function (t, r) {
        var o = this;
        this.progress.element && e(this.progress.element).remove(), this.progress.object && this.progress.object.stopMonitoring(), e(this.element).prop("disabled", !1);
        var s = e(this.element).parents("[data-drupal-selector]").addBack().toArray(),
          i = !1;
        if (Object.keys(t || {}).forEach((function (e) {
            t[e].command && o.commands[t[e].command] && (o.commands[t[e].command](o, t[e], r), "invoke" === t[e].command && "focus" === t[e].method && (i = !0))
          })), !i && this.element && !e(this.element).data("disable-refocus")) {
          for (var c = !1, l = s.length - 1; !c && l >= 0; l--) c = document.querySelector('[data-drupal-selector="'.concat(s[l].getAttribute("data-drupal-selector"), '"]'));
          c && e(c).trigger("focus")
        }
        if (this.$form && document.body.contains(this.$form.get(0))) {
          var u = this.settings || n;
          a.attachBehaviors(this.$form.get(0), u)
        }
        this.settings = null
      }, a.Ajax.prototype.getEffect = function (e) {
        var t = e.effect || this.effect,
          r = e.speed || this.speed,
          a = {};
        return "none" === t ? (a.showEffect = "show", a.hideEffect = "hide", a.showSpeed = "") : "fade" === t ? (a.showEffect = "fadeIn", a.hideEffect = "fadeOut", a.showSpeed = r) : (a.showEffect = "".concat(t, "Toggle"), a.hideEffect = "".concat(t, "Toggle"), a.showSpeed = r), a
      }, a.Ajax.prototype.error = function (t, r, o) {
        if (this.progress.element && e(this.progress.element).remove(), this.progress.object && this.progress.object.stopMonitoring(), e(this.wrapper).show(), e(this.element).prop("disabled", !1), this.$form && document.body.contains(this.$form.get(0))) {
          var s = this.settings || n;
          a.attachBehaviors(this.$form.get(0), s)
        }
        throw new a.AjaxError(t, r, o)
      }, a.theme.ajaxWrapperNewContent = function (e, t, r) {
        return "none" !== (r.effect || t.effect) && e.filter((function (t) {
          return !("#comment" === e[t].nodeName || "#text" === e[t].nodeName && /^(\s|\n|\r)*$/.test(e[t].textContent))
        })).length > 1 ? a.theme("ajaxWrapperMultipleRootElements", e) : e
      }, a.theme.ajaxWrapperMultipleRootElements = function (t) {
        return e("<div></div>").append(t)
      }, a.AjaxCommands = function () {}, a.AjaxCommands.prototype = {
        insert: function (t, r) {
          var o = r.selector ? e(r.selector) : e(t.wrapper),
            s = r.method || t.method,
            i = t.getEffect(r),
            c = r.settings || t.settings || n,
            l = e(e.parseHTML(r.data, document, !0));
          switch (l = a.theme("ajaxWrapperNewContent", l, t, r), s) {
            case "html":
            case "replaceWith":
            case "replaceAll":
            case "empty":
            case "remove":
              a.detachBehaviors(o.get(0), c)
          }
          o[s](l), "show" !== i.showEffect && l.hide();
          var u = l.find(".ajax-new-content");
          u.length ? (u.hide(), l.show(), u[i.showEffect](i.showSpeed)) : "show" !== i.showEffect && l[i.showEffect](i.showSpeed), l.parents("html").length && l.each((function (e, t) {
            t.nodeType === Node.ELEMENT_NODE && a.attachBehaviors(t, c)
          }))
        },
        remove: function (t, r, o) {
          var s = r.settings || t.settings || n;
          e(r.selector).each((function () {
            a.detachBehaviors(this, s)
          })).remove()
        },
        changed: function (t, r, n) {
          var o = e(r.selector);
          o.hasClass("ajax-changed") || (o.addClass("ajax-changed"), r.asterisk && o.find(r.asterisk).append(' <abbr class="ajax-changed" title="'.concat(a.t("Changed"), '">*</abbr> ')))
        },
        alert: function (e, r, a) {
          t.alert(r.text, r.title)
        },
        announce: function (e, t) {
          t.priority ? a.announce(t.text, t.priority) : a.announce(t.text)
        },
        redirect: function (e, r, a) {
          t.location = r.url
        },
        css: function (t, r, a) {
          e(r.selector).css(r.argument)
        },
        settings: function (t, r, o) {
          var s = n.ajax;
          s && a.ajax.expired().forEach((function (e) {
            if (e.selector) {
              var t = e.selector.replace("#", "");
              t in s && delete s[t]
            }
          })), r.merge ? e.extend(!0, n, r.settings) : t.settings = r.settings
        },
        data: function (t, r, a) {
          e(r.selector).data(r.name, r.value)
        },
        invoke: function (t, a, n) {
          var o = e(a.selector);
          o[a.method].apply(o, r(a.args))
        },
        restripe: function (t, r, a) {
          e(r.selector).find("> tbody > tr:visible, > tr:visible").removeClass("odd even").filter(":even").addClass("odd").end().filter(":odd").addClass("even")
        },
        update_build_id: function (t, r, a) {
          e('input[name="form_build_id"][value="'.concat(r.old, '"]')).val(r.new)
        },
        add_css: function (t, r, a) {
          e("head").prepend(r.data)
        },
        message: function (e, t) {
          var r = new a.Message(document.querySelector(t.messageWrapperQuerySelector));
          t.clearPrevious && r.clear(), r.add(t.message, t.messageOptions)
        }
      }
    }(jQuery, window, Drupal, drupalSettings)
  }
});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function (Drupal) {
  Drupal.theme.ajaxProgressBar = function ($element) {
    return $element.addClass('ajax-progress ajax-progress-bar');
  };
})(Drupal);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

Drupal.debounce = function (func, wait, immediate) {
  var timeout = void 0;
  var result = void 0;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = this;
    var later = function later() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
    }
    return result;
  };
};;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal, debounce) {
  var offsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  function getRawOffset(el, edge) {
    var $el = $(el);
    var documentElement = document.documentElement;
    var displacement = 0;
    var horizontal = edge === 'left' || edge === 'right';

    var placement = $el.offset()[horizontal ? 'left' : 'top'];

    placement -= window['scroll' + (horizontal ? 'X' : 'Y')] || document.documentElement['scroll' + (horizontal ? 'Left' : 'Top')] || 0;

    switch (edge) {
      case 'top':
        displacement = placement + $el.outerHeight();
        break;

      case 'left':
        displacement = placement + $el.outerWidth();
        break;

      case 'bottom':
        displacement = documentElement.clientHeight - placement;
        break;

      case 'right':
        displacement = documentElement.clientWidth - placement;
        break;

      default:
        displacement = 0;
    }
    return displacement;
  }

  function calculateOffset(edge) {
    var edgeOffset = 0;
    var displacingElements = document.querySelectorAll('[data-offset-' + edge + ']');
    var n = displacingElements.length;
    for (var i = 0; i < n; i++) {
      var el = displacingElements[i];

      if (el.style.display === 'none') {
        continue;
      }

      var displacement = parseInt(el.getAttribute('data-offset-' + edge), 10);

      if (isNaN(displacement)) {
        displacement = getRawOffset(el, edge);
      }

      edgeOffset = Math.max(edgeOffset, displacement);
    }

    return edgeOffset;
  }

  function calculateOffsets() {
    return {
      top: calculateOffset('top'),
      right: calculateOffset('right'),
      bottom: calculateOffset('bottom'),
      left: calculateOffset('left')
    };
  }

  function displace(broadcast) {
    offsets = calculateOffsets();
    Drupal.displace.offsets = offsets;
    if (typeof broadcast === 'undefined' || broadcast) {
      $(document).trigger('drupalViewportOffsetChange', offsets);
    }
    return offsets;
  }

  Drupal.behaviors.drupalDisplace = {
    attach: function attach() {
      if (this.displaceProcessed) {
        return;
      }
      this.displaceProcessed = true;

      $(window).on('resize.drupalDisplace', debounce(displace, 200));
    }
  };

  Drupal.displace = displace;
  $.extend(Drupal.displace, {
    offsets: offsets,

    calculateOffset: calculateOffset
  });
})(jQuery, Drupal, Drupal.debounce);;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./form", "./version"], a) : a(jQuery)
}(function (a) {
  return a.ui.formResetMixin = {
    _formResetHandler: function () {
      var b = a(this);
      setTimeout(function () {
        var c = b.data("ui-form-reset-instances");
        a.each(c, function () {
          this.refresh()
        })
      })
    },
    _bindFormResetHandler: function () {
      if (this.form = this.element.form(), this.form.length) {
        var a = this.form.data("ui-form-reset-instances") || [];
        a.length || this.form.on("reset.ui-form-reset", this._formResetHandler), a.push(this), this.form.data("ui-form-reset-instances", a)
      }
    },
    _unbindFormResetHandler: function () {
      if (this.form.length) {
        var b = this.form.data("ui-form-reset-instances");
        b.splice(a.inArray(this, b), 1), b.length ? this.form.data("ui-form-reset-instances", b) : this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")
      }
    }
  }
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "../escape-selector", "../form-reset-mixin", "../labels", "../widget"], a) : a(jQuery)
}(function (a) {
  return a.widget("ui.checkboxradio", [a.ui.formResetMixin, {
    version: "1.12.1",
    options: {
      disabled: null,
      label: null,
      icon: !0,
      classes: {
        "ui-checkboxradio-label": "ui-corner-all",
        "ui-checkboxradio-icon": "ui-corner-all"
      }
    },
    _getCreateOptions: function () {
      var b, c, d = this,
        e = this._super() || {};
      return this._readType(), c = this.element.labels(), this.label = a(c[c.length - 1]), this.label.length || a.error("No label found for checkboxradio widget"), this.originalLabel = "", this.label.contents().not(this.element[0]).each(function () {
        d.originalLabel += 3 === this.nodeType ? a(this).text() : this.outerHTML
      }), this.originalLabel && (e.label = this.originalLabel), b = this.element[0].disabled, null != b && (e.disabled = b), e
    },
    _create: function () {
      var a = this.element[0].checked;
      this._bindFormResetHandler(), null == this.options.disabled && (this.options.disabled = this.element[0].disabled), this._setOption("disabled", this.options.disabled), this._addClass("ui-checkboxradio", "ui-helper-hidden-accessible"), this._addClass(this.label, "ui-checkboxradio-label", "ui-button ui-widget"), "radio" === this.type && this._addClass(this.label, "ui-checkboxradio-radio-label"), this.options.label && this.options.label !== this.originalLabel ? this._updateLabel() : this.originalLabel && (this.options.label = this.originalLabel), this._enhance(), a && (this._addClass(this.label, "ui-checkboxradio-checked", "ui-state-active"), this.icon && this._addClass(this.icon, null, "ui-state-hover")), this._on({
        change: "_toggleClasses",
        focus: function () {
          this._addClass(this.label, null, "ui-state-focus ui-visual-focus")
        },
        blur: function () {
          this._removeClass(this.label, null, "ui-state-focus ui-visual-focus")
        }
      })
    },
    _readType: function () {
      var b = this.element[0].nodeName.toLowerCase();
      this.type = this.element[0].type, "input" === b && /radio|checkbox/.test(this.type) || a.error("Can't create checkboxradio on element.nodeName=" + b + " and element.type=" + this.type)
    },
    _enhance: function () {
      this._updateIcon(this.element[0].checked)
    },
    widget: function () {
      return this.label
    },
    _getRadioGroup: function () {
      var b, c = this.element[0].name,
        d = "input[name='" + a.ui.escapeSelector(c) + "']";
      return c ? (b = this.form.length ? a(this.form[0].elements).filter(d) : a(d).filter(function () {
        return 0 === a(this).form().length
      }), b.not(this.element)) : a([])
    },
    _toggleClasses: function () {
      var b = this.element[0].checked;
      this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", b), this.options.icon && "checkbox" === this.type && this._toggleClass(this.icon, null, "ui-icon-check ui-state-checked", b)._toggleClass(this.icon, null, "ui-icon-blank", !b), "radio" === this.type && this._getRadioGroup().each(function () {
        var b = a(this).checkboxradio("instance");
        b && b._removeClass(b.label, "ui-checkboxradio-checked", "ui-state-active")
      })
    },
    _destroy: function () {
      this._unbindFormResetHandler(), this.icon && (this.icon.remove(), this.iconSpace.remove())
    },
    _setOption: function (a, b) {
      if ("label" !== a || b) return this._super(a, b), "disabled" === a ? (this._toggleClass(this.label, null, "ui-state-disabled", b), void(this.element[0].disabled = b)) : void this.refresh()
    },
    _updateIcon: function (b) {
      var c = "ui-icon ui-icon-background ";
      this.options.icon ? (this.icon || (this.icon = a("<span>"), this.iconSpace = a("<span> </span>"), this._addClass(this.iconSpace, "ui-checkboxradio-icon-space")), "checkbox" === this.type ? (c += b ? "ui-icon-check ui-state-checked" : "ui-icon-blank", this._removeClass(this.icon, null, b ? "ui-icon-blank" : "ui-icon-check")) : c += "ui-icon-blank", this._addClass(this.icon, "ui-checkboxradio-icon", c), b || this._removeClass(this.icon, null, "ui-icon-check ui-state-checked"), this.icon.prependTo(this.label).after(this.iconSpace)) : void 0 !== this.icon && (this.icon.remove(), this.iconSpace.remove(), delete this.icon)
    },
    _updateLabel: function () {
      var a = this.label.contents().not(this.element[0]);
      this.icon && (a = a.not(this.icon[0])), this.iconSpace && (a = a.not(this.iconSpace[0])), a.remove(), this.label.append(this.options.label)
    },
    refresh: function () {
      var a = this.element[0].checked,
        b = this.element[0].disabled;
      this._updateIcon(a), this._toggleClass(this.label, "ui-checkboxradio-checked", "ui-state-active", a), null !== this.options.label && this._updateLabel(), b !== this.options.disabled && this._setOptions({
        disabled: b
      })
    }
  }]), a.ui.checkboxradio
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "../widget"], a) : a(jQuery)
}(function (a) {
  var b = /ui-corner-([a-z]){2,6}/g;
  return a.widget("ui.controlgroup", {
    version: "1.12.1",
    defaultElement: "<div>",
    options: {
      direction: "horizontal",
      disabled: null,
      onlyVisible: !0,
      items: {
        button: "input[type=button], input[type=submit], input[type=reset], button, a",
        controlgroupLabel: ".ui-controlgroup-label",
        checkboxradio: "input[type='checkbox'], input[type='radio']",
        selectmenu: "select",
        spinner: ".ui-spinner-input"
      }
    },
    _create: function () {
      this._enhance()
    },
    _enhance: function () {
      this.element.attr("role", "toolbar"), this.refresh()
    },
    _destroy: function () {
      this._callChildMethod("destroy"), this.childWidgets.removeData("ui-controlgroup-data"), this.element.removeAttr("role"), this.options.items.controlgroupLabel && this.element.find(this.options.items.controlgroupLabel).find(".ui-controlgroup-label-contents").contents().unwrap()
    },
    _initWidgets: function () {
      var b = this,
        c = [];
      a.each(this.options.items, function (d, e) {
        var f, g = {};
        if (e) return "controlgroupLabel" === d ? (f = b.element.find(e), f.each(function () {
          var b = a(this);
          b.children(".ui-controlgroup-label-contents").length || b.contents().wrapAll("<span class='ui-controlgroup-label-contents'></span>")
        }), b._addClass(f, null, "ui-widget ui-widget-content ui-state-default"), void(c = c.concat(f.get()))) : void(a.fn[d] && (g = b["_" + d + "Options"] ? b["_" + d + "Options"]("middle") : {
          classes: {}
        }, b.element.find(e).each(function () {
          var e = a(this),
            f = e[d]("instance"),
            h = a.widget.extend({}, g);
          if ("button" !== d || !e.parent(".ui-spinner").length) {
            f || (f = e[d]()[d]("instance")), f && (h.classes = b._resolveClassesValues(h.classes, f)), e[d](h);
            var i = e[d]("widget");
            a.data(i[0], "ui-controlgroup-data", f ? f : e[d]("instance")), c.push(i[0])
          }
        })))
      }), this.childWidgets = a(a.unique(c)), this._addClass(this.childWidgets, "ui-controlgroup-item")
    },
    _callChildMethod: function (b) {
      this.childWidgets.each(function () {
        var c = a(this),
          d = c.data("ui-controlgroup-data");
        d && d[b] && d[b]()
      })
    },
    _updateCornerClass: function (a, b) {
      var c = "ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-corner-all",
        d = this._buildSimpleOptions(b, "label").classes.label;
      this._removeClass(a, null, c), this._addClass(a, null, d)
    },
    _buildSimpleOptions: function (a, b) {
      var c = "vertical" === this.options.direction,
        d = {
          classes: {}
        };
      return d.classes[b] = {
        middle: "",
        first: "ui-corner-" + (c ? "top" : "left"),
        last: "ui-corner-" + (c ? "bottom" : "right"),
        only: "ui-corner-all"
      } [a], d
    },
    _spinnerOptions: function (a) {
      var b = this._buildSimpleOptions(a, "ui-spinner");
      return b.classes["ui-spinner-up"] = "", b.classes["ui-spinner-down"] = "", b
    },
    _buttonOptions: function (a) {
      return this._buildSimpleOptions(a, "ui-button")
    },
    _checkboxradioOptions: function (a) {
      return this._buildSimpleOptions(a, "ui-checkboxradio-label")
    },
    _selectmenuOptions: function (a) {
      var b = "vertical" === this.options.direction;
      return {
        width: !!b && "auto",
        classes: {
          middle: {
            "ui-selectmenu-button-open": "",
            "ui-selectmenu-button-closed": ""
          },
          first: {
            "ui-selectmenu-button-open": "ui-corner-" + (b ? "top" : "tl"),
            "ui-selectmenu-button-closed": "ui-corner-" + (b ? "top" : "left")
          },
          last: {
            "ui-selectmenu-button-open": b ? "" : "ui-corner-tr",
            "ui-selectmenu-button-closed": "ui-corner-" + (b ? "bottom" : "right")
          },
          only: {
            "ui-selectmenu-button-open": "ui-corner-top",
            "ui-selectmenu-button-closed": "ui-corner-all"
          }
        } [a]
      }
    },
    _resolveClassesValues: function (c, d) {
      var e = {};
      return a.each(c, function (f) {
        var g = d.options.classes[f] || "";
        g = a.trim(g.replace(b, "")), e[f] = (g + " " + c[f]).replace(/\s+/g, " ")
      }), e
    },
    _setOption: function (a, b) {
      return "direction" === a && this._removeClass("ui-controlgroup-" + this.options.direction), this._super(a, b), "disabled" === a ? void this._callChildMethod(b ? "disable" : "enable") : void this.refresh()
    },
    refresh: function () {
      var b, c = this;
      this._addClass("ui-controlgroup ui-controlgroup-" + this.options.direction), "horizontal" === this.options.direction && this._addClass(null, "ui-helper-clearfix"), this._initWidgets(), b = this.childWidgets, this.options.onlyVisible && (b = b.filter(":visible")), b.length && (a.each(["first", "last"], function (a, d) {
        var e = b[d]().data("ui-controlgroup-data");
        if (e && c["_" + e.widgetName + "Options"]) {
          var f = c["_" + e.widgetName + "Options"](1 === b.length ? "only" : d);
          f.classes = c._resolveClassesValues(f.classes, e), e.element[e.widgetName](f)
        } else c._updateCornerClass(b[d](), d)
      }), this._callChildMethod("refresh"))
    }
  })
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./controlgroup", "./checkboxradio", "../keycode", "../widget"], a) : a(jQuery)
}(function (a) {
  return a.widget("ui.button", {
    version: "1.12.1",
    defaultElement: "<button>",
    options: {
      classes: {
        "ui-button": "ui-corner-all"
      },
      disabled: null,
      icon: null,
      iconPosition: "beginning",
      label: null,
      showLabel: !0
    },
    _getCreateOptions: function () {
      var a, b = this._super() || {};
      return this.isInput = this.element.is("input"), a = this.element[0].disabled, null != a && (b.disabled = a), this.originalLabel = this.isInput ? this.element.val() : this.element.html(), this.originalLabel && (b.label = this.originalLabel), b
    },
    _create: function () {
      !this.option.showLabel & !this.options.icon && (this.options.showLabel = !0), null == this.options.disabled && (this.options.disabled = this.element[0].disabled || !1), this.hasTitle = !!this.element.attr("title"), this.options.label && this.options.label !== this.originalLabel && (this.isInput ? this.element.val(this.options.label) : this.element.html(this.options.label)), this._addClass("ui-button", "ui-widget"), this._setOption("disabled", this.options.disabled), this._enhance(), this.element.is("a") && this._on({
        keyup: function (b) {
          b.keyCode === a.ui.keyCode.SPACE && (b.preventDefault(), this.element[0].click ? this.element[0].click() : this.element.trigger("click"))
        }
      })
    },
    _enhance: function () {
      this.element.is("button") || this.element.attr("role", "button"), this.options.icon && (this._updateIcon("icon", this.options.icon), this._updateTooltip())
    },
    _updateTooltip: function () {
      this.title = this.element.attr("title"), this.options.showLabel || this.title || this.element.attr("title", this.options.label)
    },
    _updateIcon: function (b, c) {
      var d = "iconPosition" !== b,
        e = d ? this.options.iconPosition : c,
        f = "top" === e || "bottom" === e;
      this.icon ? d && this._removeClass(this.icon, null, this.options.icon) : (this.icon = a("<span>"), this._addClass(this.icon, "ui-button-icon", "ui-icon"), this.options.showLabel || this._addClass("ui-button-icon-only")), d && this._addClass(this.icon, null, c), this._attachIcon(e), f ? (this._addClass(this.icon, null, "ui-widget-icon-block"), this.iconSpace && this.iconSpace.remove()) : (this.iconSpace || (this.iconSpace = a("<span> </span>"), this._addClass(this.iconSpace, "ui-button-icon-space")), this._removeClass(this.icon, null, "ui-wiget-icon-block"), this._attachIconSpace(e))
    },
    _destroy: function () {
      this.element.removeAttr("role"), this.icon && this.icon.remove(), this.iconSpace && this.iconSpace.remove(), this.hasTitle || this.element.removeAttr("title")
    },
    _attachIconSpace: function (a) {
      this.icon[/^(?:end|bottom)/.test(a) ? "before" : "after"](this.iconSpace)
    },
    _attachIcon: function (a) {
      this.element[/^(?:end|bottom)/.test(a) ? "append" : "prepend"](this.icon)
    },
    _setOptions: function (a) {
      var b = void 0 === a.showLabel ? this.options.showLabel : a.showLabel,
        c = void 0 === a.icon ? this.options.icon : a.icon;
      b || c || (a.showLabel = !0), this._super(a)
    },
    _setOption: function (a, b) {
      "icon" === a && (b ? this._updateIcon(a, b) : this.icon && (this.icon.remove(), this.iconSpace && this.iconSpace.remove())), "iconPosition" === a && this._updateIcon(a, b), "showLabel" === a && (this._toggleClass("ui-button-icon-only", null, !b), this._updateTooltip()), "label" === a && (this.isInput ? this.element.val(b) : (this.element.html(b), this.icon && (this._attachIcon(this.options.iconPosition), this._attachIconSpace(this.options.iconPosition)))), this._super(a, b), "disabled" === a && (this._toggleClass(null, "ui-state-disabled", b), this.element[0].disabled = b, b && this.element.blur())
    },
    refresh: function () {
      var a = this.element.is("input, button") ? this.element[0].disabled : this.element.hasClass("ui-button-disabled");
      a !== this.options.disabled && this._setOptions({
        disabled: a
      }), this._updateTooltip()
    }
  }), a.uiBackCompat !== !1 && (a.widget("ui.button", a.ui.button, {
    options: {
      text: !0,
      icons: {
        primary: null,
        secondary: null
      }
    },
    _create: function () {
      this.options.showLabel && !this.options.text && (this.options.showLabel = this.options.text), !this.options.showLabel && this.options.text && (this.options.text = this.options.showLabel), this.options.icon || !this.options.icons.primary && !this.options.icons.secondary ? this.options.icon && (this.options.icons.primary = this.options.icon) : this.options.icons.primary ? this.options.icon = this.options.icons.primary : (this.options.icon = this.options.icons.secondary, this.options.iconPosition = "end"), this._super()
    },
    _setOption: function (a, b) {
      return "text" === a ? void this._super("showLabel", b) : ("showLabel" === a && (this.options.text = b), "icon" === a && (this.options.icons.primary = b), "icons" === a && (b.primary ? (this._super("icon", b.primary), this._super("iconPosition", "beginning")) : b.secondary && (this._super("icon", b.secondary), this._super("iconPosition", "end"))), void this._superApply(arguments))
    }
  }), a.fn.button = function (b) {
    return function () {
      return !this.length || this.length && "INPUT" !== this[0].tagName || this.length && "INPUT" === this[0].tagName && "checkbox" !== this.attr("type") && "radio" !== this.attr("type") ? b.apply(this, arguments) : (a.ui.checkboxradio || a.error("Checkboxradio widget missing"), 0 === arguments.length ? this.checkboxradio({
        icon: !1
      }) : this.checkboxradio.apply(this, arguments))
    }
  }(a.fn.button), a.fn.buttonset = function () {
    return a.ui.controlgroup || a.error("Controlgroup widget missing"), "option" === arguments[0] && "items" === arguments[1] && arguments[2] ? this.controlgroup.apply(this, [arguments[0], "items.button", arguments[2]]) : "option" === arguments[0] && "items" === arguments[1] ? this.controlgroup.apply(this, [arguments[0], "items.button"]) : ("object" == typeof arguments[0] && arguments[0].items && (arguments[0].items = {
      button: arguments[0].items
    }), this.controlgroup.apply(this, arguments))
  }), a.ui.button
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "../ie", "../version", "../widget"], a) : a(jQuery)
}(function (a) {
  var b = !1;
  return a(document).on("mouseup", function () {
    b = !1
  }), a.widget("ui.mouse", {
    version: "1.12.1",
    options: {
      cancel: "input, textarea, button, select, option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function () {
      var b = this;
      this.element.on("mousedown." + this.widgetName, function (a) {
        return b._mouseDown(a)
      }).on("click." + this.widgetName, function (c) {
        if (!0 === a.data(c.target, b.widgetName + ".preventClickEvent")) return a.removeData(c.target, b.widgetName + ".preventClickEvent"), c.stopImmediatePropagation(), !1
      }), this.started = !1
    },
    _mouseDestroy: function () {
      this.element.off("." + this.widgetName), this._mouseMoveDelegate && this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate)
    },
    _mouseDown: function (c) {
      if (!b) {
        this._mouseMoved = !1, this._mouseStarted && this._mouseUp(c), this._mouseDownEvent = c;
        var d = this,
          e = 1 === c.which,
          f = !("string" != typeof this.options.cancel || !c.target.nodeName) && a(c.target).closest(this.options.cancel).length;
        return !(e && !f && this._mouseCapture(c)) || (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
          d.mouseDelayMet = !0
        }, this.options.delay)), this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = this._mouseStart(c) !== !1, !this._mouseStarted) ? (c.preventDefault(), !0) : (!0 === a.data(c.target, this.widgetName + ".preventClickEvent") && a.removeData(c.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (a) {
          return d._mouseMove(a)
        }, this._mouseUpDelegate = function (a) {
          return d._mouseUp(a)
        }, this.document.on("mousemove." + this.widgetName, this._mouseMoveDelegate).on("mouseup." + this.widgetName, this._mouseUpDelegate), c.preventDefault(), b = !0, !0))
      }
    },
    _mouseMove: function (b) {
      if (this._mouseMoved) {
        if (a.ui.ie && (!document.documentMode || document.documentMode < 9) && !b.button) return this._mouseUp(b);
        if (!b.which)
          if (b.originalEvent.altKey || b.originalEvent.ctrlKey || b.originalEvent.metaKey || b.originalEvent.shiftKey) this.ignoreMissingWhich = !0;
          else if (!this.ignoreMissingWhich) return this._mouseUp(b)
      }
      return (b.which || b.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(b), b.preventDefault()) : (this._mouseDistanceMet(b) && this._mouseDelayMet(b) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, b) !== !1, this._mouseStarted ? this._mouseDrag(b) : this._mouseUp(b)), !this._mouseStarted)
    },
    _mouseUp: function (c) {
      this.document.off("mousemove." + this.widgetName, this._mouseMoveDelegate).off("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, c.target === this._mouseDownEvent.target && a.data(c.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(c)), this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer), this.ignoreMissingWhich = !1, b = !1, c.preventDefault()
    },
    _mouseDistanceMet: function (a) {
      return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
    },
    _mouseDelayMet: function () {
      return this.mouseDelayMet
    },
    _mouseStart: function () {},
    _mouseDrag: function () {},
    _mouseStop: function () {},
    _mouseCapture: function () {
      return !0
    }
  })
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function (a) {
  return a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../data", "../plugin", "../safe-active-element", "../safe-blur", "../scroll-parent", "../version", "../widget"], a) : a(jQuery)
}(function (a) {
  return a.widget("ui.draggable", a.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "drag",
    options: {
      addClasses: !0,
      appendTo: "parent",
      axis: !1,
      connectToSortable: !1,
      containment: !1,
      cursor: "auto",
      cursorAt: !1,
      grid: !1,
      handle: !1,
      helper: "original",
      iframeFix: !1,
      opacity: !1,
      refreshPositions: !1,
      revert: !1,
      revertDuration: 500,
      scope: "default",
      scroll: !0,
      scrollSensitivity: 20,
      scrollSpeed: 20,
      snap: !1,
      snapMode: "both",
      snapTolerance: 20,
      stack: !1,
      zIndex: !1,
      drag: null,
      start: null,
      stop: null
    },
    _create: function () {
      "original" === this.options.helper && this._setPositionRelative(), this.options.addClasses && this._addClass("ui-draggable"), this._setHandleClassName(), this._mouseInit()
    },
    _setOption: function (a, b) {
      this._super(a, b), "handle" === a && (this._removeHandleClassName(), this._setHandleClassName())
    },
    _destroy: function () {
      return (this.helper || this.element).is(".ui-draggable-dragging") ? void(this.destroyOnClear = !0) : (this._removeHandleClassName(), void this._mouseDestroy())
    },
    _mouseCapture: function (b) {
      var c = this.options;
      return !(this.helper || c.disabled || a(b.target).closest(".ui-resizable-handle").length > 0) && (this.handle = this._getHandle(b), !!this.handle && (this._blurActiveElement(b), this._blockFrames(c.iframeFix === !0 ? "iframe" : c.iframeFix), !0))
    },
    _blockFrames: function (b) {
      this.iframeBlocks = this.document.find(b).map(function () {
        var b = a(this);
        return a("<div>").css("position", "absolute").appendTo(b.parent()).outerWidth(b.outerWidth()).outerHeight(b.outerHeight()).offset(b.offset())[0]
      })
    },
    _unblockFrames: function () {
      this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
    },
    _blurActiveElement: function (b) {
      var c = a.ui.safeActiveElement(this.document[0]),
        d = a(b.target);
      d.closest(c).length || a.ui.safeBlur(c)
    },
    _mouseStart: function (b) {
      var c = this.options;
      return this.helper = this._createHelper(b), this._addClass(this.helper, "ui-draggable-dragging"), this._cacheHelperProportions(), a.ui.ddmanager && (a.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
        return "fixed" === a(this).css("position")
      }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(b), this.originalPosition = this.position = this._generatePosition(b, !1), this.originalPageX = b.pageX, this.originalPageY = b.pageY, c.cursorAt && this._adjustOffsetFromHelper(c.cursorAt), this._setContainment(), this._trigger("start", b) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), a.ui.ddmanager && !c.dropBehaviour && a.ui.ddmanager.prepareOffsets(this, b), this._mouseDrag(b, !0), a.ui.ddmanager && a.ui.ddmanager.dragStart(this, b), !0)
    },
    _refreshOffsets: function (a) {
      this.offset = {
        top: this.positionAbs.top - this.margins.top,
        left: this.positionAbs.left - this.margins.left,
        scroll: !1,
        parent: this._getParentOffset(),
        relative: this._getRelativeOffset()
      }, this.offset.click = {
        left: a.pageX - this.offset.left,
        top: a.pageY - this.offset.top
      }
    },
    _mouseDrag: function (b, c) {
      if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(b, !0), this.positionAbs = this._convertPositionTo("absolute"), !c) {
        var d = this._uiHash();
        if (this._trigger("drag", b, d) === !1) return this._mouseUp(new a.Event("mouseup", b)), !1;
        this.position = d.position
      }
      return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", a.ui.ddmanager && a.ui.ddmanager.drag(this, b), !1
    },
    _mouseStop: function (b) {
      var c = this,
        d = !1;
      return a.ui.ddmanager && !this.options.dropBehaviour && (d = a.ui.ddmanager.drop(this, b)), this.dropped && (d = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !d || "valid" === this.options.revert && d || this.options.revert === !0 || a.isFunction(this.options.revert) && this.options.revert.call(this.element, d) ? a(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
        c._trigger("stop", b) !== !1 && c._clear()
      }) : this._trigger("stop", b) !== !1 && this._clear(), !1
    },
    _mouseUp: function (b) {
      return this._unblockFrames(), a.ui.ddmanager && a.ui.ddmanager.dragStop(this, b), this.handleElement.is(b.target) && this.element.trigger("focus"), a.ui.mouse.prototype._mouseUp.call(this, b)
    },
    cancel: function () {
      return this.helper.is(".ui-draggable-dragging") ? this._mouseUp(new a.Event("mouseup", {
        target: this.element[0]
      })) : this._clear(), this
    },
    _getHandle: function (b) {
      return !this.options.handle || !!a(b.target).closest(this.element.find(this.options.handle)).length
    },
    _setHandleClassName: function () {
      this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element, this._addClass(this.handleElement, "ui-draggable-handle")
    },
    _removeHandleClassName: function () {
      this._removeClass(this.handleElement, "ui-draggable-handle")
    },
    _createHelper: function (b) {
      var c = this.options,
        d = a.isFunction(c.helper),
        e = d ? a(c.helper.apply(this.element[0], [b])) : "clone" === c.helper ? this.element.clone().removeAttr("id") : this.element;
      return e.parents("body").length || e.appendTo("parent" === c.appendTo ? this.element[0].parentNode : c.appendTo), d && e[0] === this.element[0] && this._setPositionRelative(), e[0] === this.element[0] || /(fixed|absolute)/.test(e.css("position")) || e.css("position", "absolute"), e
    },
    _setPositionRelative: function () {
      /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
    },
    _adjustOffsetFromHelper: function (b) {
      "string" == typeof b && (b = b.split(" ")), a.isArray(b) && (b = {
        left: +b[0],
        top: +b[1] || 0
      }), "left" in b && (this.offset.click.left = b.left + this.margins.left), "right" in b && (this.offset.click.left = this.helperProportions.width - b.right + this.margins.left), "top" in b && (this.offset.click.top = b.top + this.margins.top), "bottom" in b && (this.offset.click.top = this.helperProportions.height - b.bottom + this.margins.top)
    },
    _isRootNode: function (a) {
      return /(html|body)/i.test(a.tagName) || a === this.document[0]
    },
    _getParentOffset: function () {
      var b = this.offsetParent.offset(),
        c = this.document[0];
      return "absolute" === this.cssPosition && this.scrollParent[0] !== c && a.contains(this.scrollParent[0], this.offsetParent[0]) && (b.left += this.scrollParent.scrollLeft(), b.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (b = {
        top: 0,
        left: 0
      }), {
        top: b.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
        left: b.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
      }
    },
    _getRelativeOffset: function () {
      if ("relative" !== this.cssPosition) return {
        top: 0,
        left: 0
      };
      var a = this.element.position(),
        b = this._isRootNode(this.scrollParent[0]);
      return {
        top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + (b ? 0 : this.scrollParent.scrollTop()),
        left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + (b ? 0 : this.scrollParent.scrollLeft())
      }
    },
    _cacheMargins: function () {
      this.margins = {
        left: parseInt(this.element.css("marginLeft"), 10) || 0,
        top: parseInt(this.element.css("marginTop"), 10) || 0,
        right: parseInt(this.element.css("marginRight"), 10) || 0,
        bottom: parseInt(this.element.css("marginBottom"), 10) || 0
      }
    },
    _cacheHelperProportions: function () {
      this.helperProportions = {
        width: this.helper.outerWidth(),
        height: this.helper.outerHeight()
      }
    },
    _setContainment: function () {
      var b, c, d, e = this.options,
        f = this.document[0];
      return this.relativeContainer = null, e.containment ? "window" === e.containment ? void(this.containment = [a(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, a(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, a(window).scrollLeft() + a(window).width() - this.helperProportions.width - this.margins.left, a(window).scrollTop() + (a(window).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : "document" === e.containment ? void(this.containment = [0, 0, a(f).width() - this.helperProportions.width - this.margins.left, (a(f).height() || f.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]) : e.containment.constructor === Array ? void(this.containment = e.containment) : ("parent" === e.containment && (e.containment = this.helper[0].parentNode), c = a(e.containment), d = c[0], void(d && (b = /(scroll|auto)/.test(c.css("overflow")), this.containment = [(parseInt(c.css("borderLeftWidth"), 10) || 0) + (parseInt(c.css("paddingLeft"), 10) || 0), (parseInt(c.css("borderTopWidth"), 10) || 0) + (parseInt(c.css("paddingTop"), 10) || 0), (b ? Math.max(d.scrollWidth, d.offsetWidth) : d.offsetWidth) - (parseInt(c.css("borderRightWidth"), 10) || 0) - (parseInt(c.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (b ? Math.max(d.scrollHeight, d.offsetHeight) : d.offsetHeight) - (parseInt(c.css("borderBottomWidth"), 10) || 0) - (parseInt(c.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = c))) : void(this.containment = null)
    },
    _convertPositionTo: function (a, b) {
      b || (b = this.position);
      var c = "absolute" === a ? 1 : -1,
        d = this._isRootNode(this.scrollParent[0]);
      return {
        top: b.top + this.offset.relative.top * c + this.offset.parent.top * c - ("fixed" === this.cssPosition ? -this.offset.scroll.top : d ? 0 : this.offset.scroll.top) * c,
        left: b.left + this.offset.relative.left * c + this.offset.parent.left * c - ("fixed" === this.cssPosition ? -this.offset.scroll.left : d ? 0 : this.offset.scroll.left) * c
      }
    },
    _generatePosition: function (a, b) {
      var c, d, e, f, g = this.options,
        h = this._isRootNode(this.scrollParent[0]),
        i = a.pageX,
        j = a.pageY;
      return h && this.offset.scroll || (this.offset.scroll = {
        top: this.scrollParent.scrollTop(),
        left: this.scrollParent.scrollLeft()
      }), b && (this.containment && (this.relativeContainer ? (d = this.relativeContainer.offset(), c = [this.containment[0] + d.left, this.containment[1] + d.top, this.containment[2] + d.left, this.containment[3] + d.top]) : c = this.containment, a.pageX - this.offset.click.left < c[0] && (i = c[0] + this.offset.click.left), a.pageY - this.offset.click.top < c[1] && (j = c[1] + this.offset.click.top), a.pageX - this.offset.click.left > c[2] && (i = c[2] + this.offset.click.left), a.pageY - this.offset.click.top > c[3] && (j = c[3] + this.offset.click.top)), g.grid && (e = g.grid[1] ? this.originalPageY + Math.round((j - this.originalPageY) / g.grid[1]) * g.grid[1] : this.originalPageY, j = c ? e - this.offset.click.top >= c[1] || e - this.offset.click.top > c[3] ? e : e - this.offset.click.top >= c[1] ? e - g.grid[1] : e + g.grid[1] : e, f = g.grid[0] ? this.originalPageX + Math.round((i - this.originalPageX) / g.grid[0]) * g.grid[0] : this.originalPageX, i = c ? f - this.offset.click.left >= c[0] || f - this.offset.click.left > c[2] ? f : f - this.offset.click.left >= c[0] ? f - g.grid[0] : f + g.grid[0] : f), "y" === g.axis && (i = this.originalPageX), "x" === g.axis && (j = this.originalPageY)), {
        top: j - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : h ? 0 : this.offset.scroll.top),
        left: i - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : h ? 0 : this.offset.scroll.left)
      }
    },
    _clear: function () {
      this._removeClass(this.helper, "ui-draggable-dragging"), this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1, this.destroyOnClear && this.destroy()
    },
    _trigger: function (b, c, d) {
      return d = d || this._uiHash(), a.ui.plugin.call(this, b, [c, d, this], !0), /^(drag|start|stop)/.test(b) && (this.positionAbs = this._convertPositionTo("absolute"), d.offset = this.positionAbs), a.Widget.prototype._trigger.call(this, b, c, d)
    },
    plugins: {},
    _uiHash: function () {
      return {
        helper: this.helper,
        position: this.position,
        originalPosition: this.originalPosition,
        offset: this.positionAbs
      }
    }
  }), a.ui.plugin.add("draggable", "connectToSortable", {
    start: function (b, c, d) {
      var e = a.extend({}, c, {
        item: d.element
      });
      d.sortables = [], a(d.options.connectToSortable).each(function () {
        var c = a(this).sortable("instance");
        c && !c.options.disabled && (d.sortables.push(c), c.refreshPositions(), c._trigger("activate", b, e))
      })
    },
    stop: function (b, c, d) {
      var e = a.extend({}, c, {
        item: d.element
      });
      d.cancelHelperRemoval = !1, a.each(d.sortables, function () {
        var a = this;
        a.isOver ? (a.isOver = 0, d.cancelHelperRemoval = !0, a.cancelHelperRemoval = !1, a._storedCSS = {
          position: a.placeholder.css("position"),
          top: a.placeholder.css("top"),
          left: a.placeholder.css("left")
        }, a._mouseStop(b), a.options.helper = a.options._helper) : (a.cancelHelperRemoval = !0, a._trigger("deactivate", b, e))
      })
    },
    drag: function (b, c, d) {
      a.each(d.sortables, function () {
        var e = !1,
          f = this;
        f.positionAbs = d.positionAbs, f.helperProportions = d.helperProportions, f.offset.click = d.offset.click, f._intersectsWith(f.containerCache) && (e = !0, a.each(d.sortables, function () {
          return this.positionAbs = d.positionAbs, this.helperProportions = d.helperProportions, this.offset.click = d.offset.click, this !== f && this._intersectsWith(this.containerCache) && a.contains(f.element[0], this.element[0]) && (e = !1), e
        })), e ? (f.isOver || (f.isOver = 1, d._parent = c.helper.parent(), f.currentItem = c.helper.appendTo(f.element).data("ui-sortable-item", !0), f.options._helper = f.options.helper, f.options.helper = function () {
          return c.helper[0]
        }, b.target = f.currentItem[0], f._mouseCapture(b, !0), f._mouseStart(b, !0, !0), f.offset.click.top = d.offset.click.top, f.offset.click.left = d.offset.click.left, f.offset.parent.left -= d.offset.parent.left - f.offset.parent.left, f.offset.parent.top -= d.offset.parent.top - f.offset.parent.top, d._trigger("toSortable", b), d.dropped = f.element, a.each(d.sortables, function () {
          this.refreshPositions()
        }), d.currentItem = d.element, f.fromOutside = d), f.currentItem && (f._mouseDrag(b), c.position = f.position)) : f.isOver && (f.isOver = 0, f.cancelHelperRemoval = !0, f.options._revert = f.options.revert, f.options.revert = !1, f._trigger("out", b, f._uiHash(f)), f._mouseStop(b, !0), f.options.revert = f.options._revert, f.options.helper = f.options._helper, f.placeholder && f.placeholder.remove(), c.helper.appendTo(d._parent), d._refreshOffsets(b), c.position = d._generatePosition(b, !0), d._trigger("fromSortable", b), d.dropped = !1, a.each(d.sortables, function () {
          this.refreshPositions()
        }))
      })
    }
  }), a.ui.plugin.add("draggable", "cursor", {
    start: function (b, c, d) {
      var e = a("body"),
        f = d.options;
      e.css("cursor") && (f._cursor = e.css("cursor")), e.css("cursor", f.cursor)
    },
    stop: function (b, c, d) {
      var e = d.options;
      e._cursor && a("body").css("cursor", e._cursor)
    }
  }), a.ui.plugin.add("draggable", "opacity", {
    start: function (b, c, d) {
      var e = a(c.helper),
        f = d.options;
      e.css("opacity") && (f._opacity = e.css("opacity")), e.css("opacity", f.opacity)
    },
    stop: function (b, c, d) {
      var e = d.options;
      e._opacity && a(c.helper).css("opacity", e._opacity)
    }
  }), a.ui.plugin.add("draggable", "scroll", {
    start: function (a, b, c) {
      c.scrollParentNotHidden || (c.scrollParentNotHidden = c.helper.scrollParent(!1)), c.scrollParentNotHidden[0] !== c.document[0] && "HTML" !== c.scrollParentNotHidden[0].tagName && (c.overflowOffset = c.scrollParentNotHidden.offset())
    },
    drag: function (b, c, d) {
      var e = d.options,
        f = !1,
        g = d.scrollParentNotHidden[0],
        h = d.document[0];
      g !== h && "HTML" !== g.tagName ? (e.axis && "x" === e.axis || (d.overflowOffset.top + g.offsetHeight - b.pageY < e.scrollSensitivity ? g.scrollTop = f = g.scrollTop + e.scrollSpeed : b.pageY - d.overflowOffset.top < e.scrollSensitivity && (g.scrollTop = f = g.scrollTop - e.scrollSpeed)), e.axis && "y" === e.axis || (d.overflowOffset.left + g.offsetWidth - b.pageX < e.scrollSensitivity ? g.scrollLeft = f = g.scrollLeft + e.scrollSpeed : b.pageX - d.overflowOffset.left < e.scrollSensitivity && (g.scrollLeft = f = g.scrollLeft - e.scrollSpeed))) : (e.axis && "x" === e.axis || (b.pageY - a(h).scrollTop() < e.scrollSensitivity ? f = a(h).scrollTop(a(h).scrollTop() - e.scrollSpeed) : a(window).height() - (b.pageY - a(h).scrollTop()) < e.scrollSensitivity && (f = a(h).scrollTop(a(h).scrollTop() + e.scrollSpeed))), e.axis && "y" === e.axis || (b.pageX - a(h).scrollLeft() < e.scrollSensitivity ? f = a(h).scrollLeft(a(h).scrollLeft() - e.scrollSpeed) : a(window).width() - (b.pageX - a(h).scrollLeft()) < e.scrollSensitivity && (f = a(h).scrollLeft(a(h).scrollLeft() + e.scrollSpeed)))), f !== !1 && a.ui.ddmanager && !e.dropBehaviour && a.ui.ddmanager.prepareOffsets(d, b)
    }
  }), a.ui.plugin.add("draggable", "snap", {
    start: function (b, c, d) {
      var e = d.options;
      d.snapElements = [], a(e.snap.constructor !== String ? e.snap.items || ":data(ui-draggable)" : e.snap).each(function () {
        var b = a(this),
          c = b.offset();
        this !== d.element[0] && d.snapElements.push({
          item: this,
          width: b.outerWidth(),
          height: b.outerHeight(),
          top: c.top,
          left: c.left
        })
      })
    },
    drag: function (b, c, d) {
      var e, f, g, h, i, j, k, l, m, n, o = d.options,
        p = o.snapTolerance,
        q = c.offset.left,
        r = q + d.helperProportions.width,
        s = c.offset.top,
        t = s + d.helperProportions.height;
      for (m = d.snapElements.length - 1; m >= 0; m--) i = d.snapElements[m].left - d.margins.left, j = i + d.snapElements[m].width, k = d.snapElements[m].top - d.margins.top, l = k + d.snapElements[m].height, r < i - p || q > j + p || t < k - p || s > l + p || !a.contains(d.snapElements[m].item.ownerDocument, d.snapElements[m].item) ? (d.snapElements[m].snapping && d.options.snap.release && d.options.snap.release.call(d.element, b, a.extend(d._uiHash(), {
        snapItem: d.snapElements[m].item
      })), d.snapElements[m].snapping = !1) : ("inner" !== o.snapMode && (e = Math.abs(k - t) <= p, f = Math.abs(l - s) <= p, g = Math.abs(i - r) <= p, h = Math.abs(j - q) <= p, e && (c.position.top = d._convertPositionTo("relative", {
        top: k - d.helperProportions.height,
        left: 0
      }).top), f && (c.position.top = d._convertPositionTo("relative", {
        top: l,
        left: 0
      }).top), g && (c.position.left = d._convertPositionTo("relative", {
        top: 0,
        left: i - d.helperProportions.width
      }).left), h && (c.position.left = d._convertPositionTo("relative", {
        top: 0,
        left: j
      }).left)), n = e || f || g || h, "outer" !== o.snapMode && (e = Math.abs(k - s) <= p, f = Math.abs(l - t) <= p, g = Math.abs(i - q) <= p, h = Math.abs(j - r) <= p, e && (c.position.top = d._convertPositionTo("relative", {
        top: k,
        left: 0
      }).top), f && (c.position.top = d._convertPositionTo("relative", {
        top: l - d.helperProportions.height,
        left: 0
      }).top), g && (c.position.left = d._convertPositionTo("relative", {
        top: 0,
        left: i
      }).left), h && (c.position.left = d._convertPositionTo("relative", {
        top: 0,
        left: j - d.helperProportions.width
      }).left)), !d.snapElements[m].snapping && (e || f || g || h || n) && d.options.snap.snap && d.options.snap.snap.call(d.element, b, a.extend(d._uiHash(), {
        snapItem: d.snapElements[m].item
      })), d.snapElements[m].snapping = e || f || g || h || n)
    }
  }), a.ui.plugin.add("draggable", "stack", {
    start: function (b, c, d) {
      var e, f = d.options,
        g = a.makeArray(a(f.stack)).sort(function (b, c) {
          return (parseInt(a(b).css("zIndex"), 10) || 0) - (parseInt(a(c).css("zIndex"), 10) || 0)
        });
      g.length && (e = parseInt(a(g[0]).css("zIndex"), 10) || 0, a(g).each(function (b) {
        a(this).css("zIndex", e + b)
      }), this.css("zIndex", e + g.length))
    }
  }), a.ui.plugin.add("draggable", "zIndex", {
    start: function (b, c, d) {
      var e = a(c.helper),
        f = d.options;
      e.css("zIndex") && (f._zIndex = e.css("zIndex")), e.css("zIndex", f.zIndex)
    },
    stop: function (b, c, d) {
      var e = d.options;
      e._zIndex && a(c.helper).css("zIndex", e._zIndex)
    }
  }), a.ui.draggable
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./version"], a) : a(jQuery)
}(function (a) {
  return function () {
    function b(a, b, c) {
      return [parseFloat(a[0]) * (l.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (l.test(a[1]) ? c / 100 : 1)]
    }

    function c(b, c) {
      return parseInt(a.css(b, c), 10) || 0
    }

    function d(b) {
      var c = b[0];
      return 9 === c.nodeType ? {
        width: b.width(),
        height: b.height(),
        offset: {
          top: 0,
          left: 0
        }
      } : a.isWindow(c) ? {
        width: b.width(),
        height: b.height(),
        offset: {
          top: b.scrollTop(),
          left: b.scrollLeft()
        }
      } : c.preventDefault ? {
        width: 0,
        height: 0,
        offset: {
          top: c.pageY,
          left: c.pageX
        }
      } : {
        width: b.outerWidth(),
        height: b.outerHeight(),
        offset: b.offset()
      }
    }
    var e, f = Math.max,
      g = Math.abs,
      h = /left|center|right/,
      i = /top|center|bottom/,
      j = /[\+\-]\d+(\.[\d]+)?%?/,
      k = /^\w+/,
      l = /%$/,
      m = a.fn.position;
    a.position = {
      scrollbarWidth: function () {
        if (void 0 !== e) return e;
        var b, c, d = a("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
          f = d.children()[0];
        return a("body").append(d), b = f.offsetWidth, d.css("overflow", "scroll"), c = f.offsetWidth, b === c && (c = d[0].clientWidth), d.remove(), e = b - c
      },
      getScrollInfo: function (b) {
        var c = b.isWindow || b.isDocument ? "" : b.element.css("overflow-x"),
          d = b.isWindow || b.isDocument ? "" : b.element.css("overflow-y"),
          e = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth,
          f = "scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight;
        return {
          width: f ? a.position.scrollbarWidth() : 0,
          height: e ? a.position.scrollbarWidth() : 0
        }
      },
      getWithinInfo: function (b) {
        var c = a(b || window),
          d = a.isWindow(c[0]),
          e = !!c[0] && 9 === c[0].nodeType,
          f = !d && !e;
        return {
          element: c,
          isWindow: d,
          isDocument: e,
          offset: f ? a(b).offset() : {
            left: 0,
            top: 0
          },
          scrollLeft: c.scrollLeft(),
          scrollTop: c.scrollTop(),
          width: c.outerWidth(),
          height: c.outerHeight()
        }
      }
    }, a.fn.position = function (e) {
      if (!e || !e.of) return m.apply(this, arguments);
      e = a.extend({}, e);
      var l, n, o, p, q, r, s = a(e.of),
        t = a.position.getWithinInfo(e.within),
        u = a.position.getScrollInfo(t),
        v = (e.collision || "flip").split(" "),
        w = {};
      return r = d(s), s[0].preventDefault && (e.at = "left top"), n = r.width, o = r.height, p = r.offset, q = a.extend({}, p), a.each(["my", "at"], function () {
        var a, b, c = (e[this] || "").split(" ");
        1 === c.length && (c = h.test(c[0]) ? c.concat(["center"]) : i.test(c[0]) ? ["center"].concat(c) : ["center", "center"]), c[0] = h.test(c[0]) ? c[0] : "center", c[1] = i.test(c[1]) ? c[1] : "center", a = j.exec(c[0]), b = j.exec(c[1]), w[this] = [a ? a[0] : 0, b ? b[0] : 0], e[this] = [k.exec(c[0])[0], k.exec(c[1])[0]]
      }), 1 === v.length && (v[1] = v[0]), "right" === e.at[0] ? q.left += n : "center" === e.at[0] && (q.left += n / 2), "bottom" === e.at[1] ? q.top += o : "center" === e.at[1] && (q.top += o / 2), l = b(w.at, n, o), q.left += l[0], q.top += l[1], this.each(function () {
        var d, h, i = a(this),
          j = i.outerWidth(),
          k = i.outerHeight(),
          m = c(this, "marginLeft"),
          r = c(this, "marginTop"),
          x = j + m + c(this, "marginRight") + u.width,
          y = k + r + c(this, "marginBottom") + u.height,
          z = a.extend({}, q),
          A = b(w.my, i.outerWidth(), i.outerHeight());
        "right" === e.my[0] ? z.left -= j : "center" === e.my[0] && (z.left -= j / 2), "bottom" === e.my[1] ? z.top -= k : "center" === e.my[1] && (z.top -= k / 2), z.left += A[0], z.top += A[1], d = {
          marginLeft: m,
          marginTop: r
        }, a.each(["left", "top"], function (b, c) {
          a.ui.position[v[b]] && a.ui.position[v[b]][c](z, {
            targetWidth: n,
            targetHeight: o,
            elemWidth: j,
            elemHeight: k,
            collisionPosition: d,
            collisionWidth: x,
            collisionHeight: y,
            offset: [l[0] + A[0], l[1] + A[1]],
            my: e.my,
            at: e.at,
            within: t,
            elem: i
          })
        }), e.using && (h = function (a) {
          var b = p.left - z.left,
            c = b + n - j,
            d = p.top - z.top,
            h = d + o - k,
            l = {
              target: {
                element: s,
                left: p.left,
                top: p.top,
                width: n,
                height: o
              },
              element: {
                element: i,
                left: z.left,
                top: z.top,
                width: j,
                height: k
              },
              horizontal: c < 0 ? "left" : b > 0 ? "right" : "center",
              vertical: h < 0 ? "top" : d > 0 ? "bottom" : "middle"
            };
          n < j && g(b + c) < n && (l.horizontal = "center"), o < k && g(d + h) < o && (l.vertical = "middle"), f(g(b), g(c)) > f(g(d), g(h)) ? l.important = "horizontal" : l.important = "vertical", e.using.call(this, a, l)
        }), i.offset(a.extend(z, {
          using: h
        }))
      })
    }, a.ui.position = {
      fit: {
        left: function (a, b) {
          var c, d = b.within,
            e = d.isWindow ? d.scrollLeft : d.offset.left,
            g = d.width,
            h = a.left - b.collisionPosition.marginLeft,
            i = e - h,
            j = h + b.collisionWidth - g - e;
          b.collisionWidth > g ? i > 0 && j <= 0 ? (c = a.left + i + b.collisionWidth - g - e, a.left += i - c) : j > 0 && i <= 0 ? a.left = e : i > j ? a.left = e + g - b.collisionWidth : a.left = e : i > 0 ? a.left += i : j > 0 ? a.left -= j : a.left = f(a.left - h, a.left)
        },
        top: function (a, b) {
          var c, d = b.within,
            e = d.isWindow ? d.scrollTop : d.offset.top,
            g = b.within.height,
            h = a.top - b.collisionPosition.marginTop,
            i = e - h,
            j = h + b.collisionHeight - g - e;
          b.collisionHeight > g ? i > 0 && j <= 0 ? (c = a.top + i + b.collisionHeight - g - e, a.top += i - c) : j > 0 && i <= 0 ? a.top = e : i > j ? a.top = e + g - b.collisionHeight : a.top = e : i > 0 ? a.top += i : j > 0 ? a.top -= j : a.top = f(a.top - h, a.top)
        }
      },
      flip: {
        left: function (a, b) {
          var c, d, e = b.within,
            f = e.offset.left + e.scrollLeft,
            h = e.width,
            i = e.isWindow ? e.scrollLeft : e.offset.left,
            j = a.left - b.collisionPosition.marginLeft,
            k = j - i,
            l = j + b.collisionWidth - h - i,
            m = "left" === b.my[0] ? -b.elemWidth : "right" === b.my[0] ? b.elemWidth : 0,
            n = "left" === b.at[0] ? b.targetWidth : "right" === b.at[0] ? -b.targetWidth : 0,
            o = -2 * b.offset[0];
          k < 0 ? (c = a.left + m + n + o + b.collisionWidth - h - f, (c < 0 || c < g(k)) && (a.left += m + n + o)) : l > 0 && (d = a.left - b.collisionPosition.marginLeft + m + n + o - i, (d > 0 || g(d) < l) && (a.left += m + n + o))
        },
        top: function (a, b) {
          var c, d, e = b.within,
            f = e.offset.top + e.scrollTop,
            h = e.height,
            i = e.isWindow ? e.scrollTop : e.offset.top,
            j = a.top - b.collisionPosition.marginTop,
            k = j - i,
            l = j + b.collisionHeight - h - i,
            m = "top" === b.my[1],
            n = m ? -b.elemHeight : "bottom" === b.my[1] ? b.elemHeight : 0,
            o = "top" === b.at[1] ? b.targetHeight : "bottom" === b.at[1] ? -b.targetHeight : 0,
            p = -2 * b.offset[1];
          k < 0 ? (d = a.top + n + o + p + b.collisionHeight - h - f, (d < 0 || d < g(k)) && (a.top += n + o + p)) : l > 0 && (c = a.top - b.collisionPosition.marginTop + n + o + p - i, (c > 0 || g(c) < l) && (a.top += n + o + p))
        }
      },
      flipfit: {
        left: function () {
          a.ui.position.flip.left.apply(this, arguments), a.ui.position.fit.left.apply(this, arguments)
        },
        top: function () {
          a.ui.position.flip.top.apply(this, arguments), a.ui.position.fit.top.apply(this, arguments)
        }
      }
    }
  }(), a.ui.position
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./mouse", "../disable-selection", "../plugin", "../version", "../widget"], a) : a(jQuery)
}(function (a) {
  return a.widget("ui.resizable", a.ui.mouse, {
    version: "1.12.1",
    widgetEventPrefix: "resize",
    options: {
      alsoResize: !1,
      animate: !1,
      animateDuration: "slow",
      animateEasing: "swing",
      aspectRatio: !1,
      autoHide: !1,
      classes: {
        "ui-resizable-se": "ui-icon ui-icon-gripsmall-diagonal-se"
      },
      containment: !1,
      ghost: !1,
      grid: !1,
      handles: "e,s,se",
      helper: !1,
      maxHeight: null,
      maxWidth: null,
      minHeight: 10,
      minWidth: 10,
      zIndex: 90,
      resize: null,
      start: null,
      stop: null
    },
    _num: function (a) {
      return parseFloat(a) || 0
    },
    _isNumber: function (a) {
      return !isNaN(parseFloat(a))
    },
    _hasScroll: function (b, c) {
      if ("hidden" === a(b).css("overflow")) return !1;
      var d = c && "left" === c ? "scrollLeft" : "scrollTop",
        e = !1;
      return b[d] > 0 || (b[d] = 1, e = b[d] > 0, b[d] = 0, e)
    },
    _create: function () {
      var b, c = this.options,
        d = this;
      this._addClass("ui-resizable"), a.extend(this, {
        _aspectRatio: !!c.aspectRatio,
        aspectRatio: c.aspectRatio,
        originalElement: this.element,
        _proportionallyResizeElements: [],
        _helper: c.helper || c.ghost || c.animate ? c.helper || "ui-resizable-helper" : null
      }), this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(a("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
        position: this.element.css("position"),
        width: this.element.outerWidth(),
        height: this.element.outerHeight(),
        top: this.element.css("top"),
        left: this.element.css("left")
      })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, b = {
        marginTop: this.originalElement.css("marginTop"),
        marginRight: this.originalElement.css("marginRight"),
        marginBottom: this.originalElement.css("marginBottom"),
        marginLeft: this.originalElement.css("marginLeft")
      }, this.element.css(b), this.originalElement.css("margin", 0), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
        position: "static",
        zoom: 1,
        display: "block"
      })), this.originalElement.css(b), this._proportionallyResize()), this._setupHandles(), c.autoHide && a(this.element).on("mouseenter", function () {
        c.disabled || (d._removeClass("ui-resizable-autohide"), d._handles.show())
      }).on("mouseleave", function () {
        c.disabled || d.resizing || (d._addClass("ui-resizable-autohide"), d._handles.hide())
      }), this._mouseInit()
    },
    _destroy: function () {
      this._mouseDestroy();
      var b, c = function (b) {
        a(b).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()
      };
      return this.elementIsWrapper && (c(this.element), b = this.element, this.originalElement.css({
        position: b.css("position"),
        width: b.outerWidth(),
        height: b.outerHeight(),
        top: b.css("top"),
        left: b.css("left")
      }).insertAfter(b), b.remove()), this.originalElement.css("resize", this.originalResizeStyle), c(this.originalElement), this
    },
    _setOption: function (a, b) {
      switch (this._super(a, b), a) {
        case "handles":
          this._removeHandles(), this._setupHandles()
      }
    },
    _setupHandles: function () {
      var b, c, d, e, f, g = this.options,
        h = this;
      if (this.handles = g.handles || (a(".ui-resizable-handle", this.element).length ? {
          n: ".ui-resizable-n",
          e: ".ui-resizable-e",
          s: ".ui-resizable-s",
          w: ".ui-resizable-w",
          se: ".ui-resizable-se",
          sw: ".ui-resizable-sw",
          ne: ".ui-resizable-ne",
          nw: ".ui-resizable-nw"
        } : "e,s,se"), this._handles = a(), this.handles.constructor === String)
        for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), d = this.handles.split(","), this.handles = {}, c = 0; c < d.length; c++) b = a.trim(d[c]), e = "ui-resizable-" + b, f = a("<div>"), this._addClass(f, "ui-resizable-handle " + e), f.css({
          zIndex: g.zIndex
        }), this.handles[b] = ".ui-resizable-" + b, this.element.append(f);
      this._renderAxis = function (b) {
        var c, d, e, f;
        b = b || this.element;
        for (c in this.handles) this.handles[c].constructor === String ? this.handles[c] = this.element.children(this.handles[c]).first().show() : (this.handles[c].jquery || this.handles[c].nodeType) && (this.handles[c] = a(this.handles[c]), this._on(this.handles[c], {
          mousedown: h._mouseDown
        })), this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (d = a(this.handles[c], this.element), f = /sw|ne|nw|se|n|s/.test(c) ? d.outerHeight() : d.outerWidth(), e = ["padding", /ne|nw|n/.test(c) ? "Top" : /se|sw|s/.test(c) ? "Bottom" : /^e$/.test(c) ? "Right" : "Left"].join(""), b.css(e, f), this._proportionallyResize()), this._handles = this._handles.add(this.handles[c])
      }, this._renderAxis(this.element), this._handles = this._handles.add(this.element.find(".ui-resizable-handle")), this._handles.disableSelection(), this._handles.on("mouseover", function () {
        h.resizing || (this.className && (f = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), h.axis = f && f[1] ? f[1] : "se")
      }), g.autoHide && (this._handles.hide(), this._addClass("ui-resizable-autohide"))
    },
    _removeHandles: function () {
      this._handles.remove()
    },
    _mouseCapture: function (b) {
      var c, d, e = !1;
      for (c in this.handles) d = a(this.handles[c])[0], (d === b.target || a.contains(d, b.target)) && (e = !0);
      return !this.options.disabled && e
    },
    _mouseStart: function (b) {
      var c, d, e, f = this.options,
        g = this.element;
      return this.resizing = !0, this._renderProxy(), c = this._num(this.helper.css("left")), d = this._num(this.helper.css("top")), f.containment && (c += a(f.containment).scrollLeft() || 0, d += a(f.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
        left: c,
        top: d
      }, this.size = this._helper ? {
        width: this.helper.width(),
        height: this.helper.height()
      } : {
        width: g.width(),
        height: g.height()
      }, this.originalSize = this._helper ? {
        width: g.outerWidth(),
        height: g.outerHeight()
      } : {
        width: g.width(),
        height: g.height()
      }, this.sizeDiff = {
        width: g.outerWidth() - g.width(),
        height: g.outerHeight() - g.height()
      }, this.originalPosition = {
        left: c,
        top: d
      }, this.originalMousePosition = {
        left: b.pageX,
        top: b.pageY
      }, this.aspectRatio = "number" == typeof f.aspectRatio ? f.aspectRatio : this.originalSize.width / this.originalSize.height || 1, e = a(".ui-resizable-" + this.axis).css("cursor"), a("body").css("cursor", "auto" === e ? this.axis + "-resize" : e), this._addClass("ui-resizable-resizing"), this._propagate("start", b), !0
    },
    _mouseDrag: function (b) {
      var c, d, e = this.originalMousePosition,
        f = this.axis,
        g = b.pageX - e.left || 0,
        h = b.pageY - e.top || 0,
        i = this._change[f];
      return this._updatePrevProperties(), !!i && (c = i.apply(this, [b, g, h]), this._updateVirtualBoundaries(b.shiftKey), (this._aspectRatio || b.shiftKey) && (c = this._updateRatio(c, b)), c = this._respectSize(c, b), this._updateCache(c), this._propagate("resize", b), d = this._applyChanges(), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), a.isEmptyObject(d) || (this._updatePrevProperties(), this._trigger("resize", b, this.ui()), this._applyChanges()), !1)
    },
    _mouseStop: function (b) {
      this.resizing = !1;
      var c, d, e, f, g, h, i, j = this.options,
        k = this;
      return this._helper && (c = this._proportionallyResizeElements, d = c.length && /textarea/i.test(c[0].nodeName), e = d && this._hasScroll(c[0], "left") ? 0 : k.sizeDiff.height, f = d ? 0 : k.sizeDiff.width, g = {
        width: k.helper.width() - f,
        height: k.helper.height() - e
      }, h = parseFloat(k.element.css("left")) + (k.position.left - k.originalPosition.left) || null, i = parseFloat(k.element.css("top")) + (k.position.top - k.originalPosition.top) || null, j.animate || this.element.css(a.extend(g, {
        top: i,
        left: h
      })), k.helper.height(k.size.height), k.helper.width(k.size.width), this._helper && !j.animate && this._proportionallyResize()), a("body").css("cursor", "auto"), this._removeClass("ui-resizable-resizing"), this._propagate("stop", b), this._helper && this.helper.remove(), !1
    },
    _updatePrevProperties: function () {
      this.prevPosition = {
        top: this.position.top,
        left: this.position.left
      }, this.prevSize = {
        width: this.size.width,
        height: this.size.height
      }
    },
    _applyChanges: function () {
      var a = {};
      return this.position.top !== this.prevPosition.top && (a.top = this.position.top + "px"), this.position.left !== this.prevPosition.left && (a.left = this.position.left + "px"), this.size.width !== this.prevSize.width && (a.width = this.size.width + "px"), this.size.height !== this.prevSize.height && (a.height = this.size.height + "px"), this.helper.css(a), a
    },
    _updateVirtualBoundaries: function (a) {
      var b, c, d, e, f, g = this.options;
      f = {
        minWidth: this._isNumber(g.minWidth) ? g.minWidth : 0,
        maxWidth: this._isNumber(g.maxWidth) ? g.maxWidth : 1 / 0,
        minHeight: this._isNumber(g.minHeight) ? g.minHeight : 0,
        maxHeight: this._isNumber(g.maxHeight) ? g.maxHeight : 1 / 0
      }, (this._aspectRatio || a) && (b = f.minHeight * this.aspectRatio, d = f.minWidth / this.aspectRatio, c = f.maxHeight * this.aspectRatio, e = f.maxWidth / this.aspectRatio, b > f.minWidth && (f.minWidth = b), d > f.minHeight && (f.minHeight = d), c < f.maxWidth && (f.maxWidth = c), e < f.maxHeight && (f.maxHeight = e)), this._vBoundaries = f
    },
    _updateCache: function (a) {
      this.offset = this.helper.offset(), this._isNumber(a.left) && (this.position.left = a.left), this._isNumber(a.top) && (this.position.top = a.top), this._isNumber(a.height) && (this.size.height = a.height), this._isNumber(a.width) && (this.size.width = a.width)
    },
    _updateRatio: function (a) {
      var b = this.position,
        c = this.size,
        d = this.axis;
      return this._isNumber(a.height) ? a.width = a.height * this.aspectRatio : this._isNumber(a.width) && (a.height = a.width / this.aspectRatio), "sw" === d && (a.left = b.left + (c.width - a.width), a.top = null), "nw" === d && (a.top = b.top + (c.height - a.height), a.left = b.left + (c.width - a.width)), a
    },
    _respectSize: function (a) {
      var b = this._vBoundaries,
        c = this.axis,
        d = this._isNumber(a.width) && b.maxWidth && b.maxWidth < a.width,
        e = this._isNumber(a.height) && b.maxHeight && b.maxHeight < a.height,
        f = this._isNumber(a.width) && b.minWidth && b.minWidth > a.width,
        g = this._isNumber(a.height) && b.minHeight && b.minHeight > a.height,
        h = this.originalPosition.left + this.originalSize.width,
        i = this.originalPosition.top + this.originalSize.height,
        j = /sw|nw|w/.test(c),
        k = /nw|ne|n/.test(c);
      return f && (a.width = b.minWidth), g && (a.height = b.minHeight), d && (a.width = b.maxWidth), e && (a.height = b.maxHeight), f && j && (a.left = h - b.minWidth), d && j && (a.left = h - b.maxWidth), g && k && (a.top = i - b.minHeight), e && k && (a.top = i - b.maxHeight), a.width || a.height || a.left || !a.top ? a.width || a.height || a.top || !a.left || (a.left = null) : a.top = null, a
    },
    _getPaddingPlusBorderDimensions: function (a) {
      for (var b = 0, c = [], d = [a.css("borderTopWidth"), a.css("borderRightWidth"), a.css("borderBottomWidth"), a.css("borderLeftWidth")], e = [a.css("paddingTop"), a.css("paddingRight"), a.css("paddingBottom"), a.css("paddingLeft")]; b < 4; b++) c[b] = parseFloat(d[b]) || 0, c[b] += parseFloat(e[b]) || 0;
      return {
        height: c[0] + c[2],
        width: c[1] + c[3]
      }
    },
    _proportionallyResize: function () {
      if (this._proportionallyResizeElements.length)
        for (var a, b = 0, c = this.helper || this.element; b < this._proportionallyResizeElements.length; b++) a = this._proportionallyResizeElements[b], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(a)), a.css({
          height: c.height() - this.outerDimensions.height || 0,
          width: c.width() - this.outerDimensions.width || 0
        })
    },
    _renderProxy: function () {
      var b = this.element,
        c = this.options;
      this.elementOffset = b.offset(), this._helper ? (this.helper = this.helper || a("<div style='overflow:hidden;'></div>"), this._addClass(this.helper, this._helper), this.helper.css({
        width: this.element.outerWidth(),
        height: this.element.outerHeight(),
        position: "absolute",
        left: this.elementOffset.left + "px",
        top: this.elementOffset.top + "px",
        zIndex: ++c.zIndex
      }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
    },
    _change: {
      e: function (a, b) {
        return {
          width: this.originalSize.width + b
        }
      },
      w: function (a, b) {
        var c = this.originalSize,
          d = this.originalPosition;
        return {
          left: d.left + b,
          width: c.width - b
        }
      },
      n: function (a, b, c) {
        var d = this.originalSize,
          e = this.originalPosition;
        return {
          top: e.top + c,
          height: d.height - c
        }
      },
      s: function (a, b, c) {
        return {
          height: this.originalSize.height + c
        }
      },
      se: function (b, c, d) {
        return a.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [b, c, d]))
      },
      sw: function (b, c, d) {
        return a.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [b, c, d]))
      },
      ne: function (b, c, d) {
        return a.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [b, c, d]))
      },
      nw: function (b, c, d) {
        return a.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [b, c, d]))
      }
    },
    _propagate: function (b, c) {
      a.ui.plugin.call(this, b, [c, this.ui()]), "resize" !== b && this._trigger(b, c, this.ui())
    },
    plugins: {},
    ui: function () {
      return {
        originalElement: this.originalElement,
        element: this.element,
        helper: this.helper,
        position: this.position,
        size: this.size,
        originalSize: this.originalSize,
        originalPosition: this.originalPosition
      }
    }
  }), a.ui.plugin.add("resizable", "animate", {
    stop: function (b) {
      var c = a(this).resizable("instance"),
        d = c.options,
        e = c._proportionallyResizeElements,
        f = e.length && /textarea/i.test(e[0].nodeName),
        g = f && c._hasScroll(e[0], "left") ? 0 : c.sizeDiff.height,
        h = f ? 0 : c.sizeDiff.width,
        i = {
          width: c.size.width - h,
          height: c.size.height - g
        },
        j = parseFloat(c.element.css("left")) + (c.position.left - c.originalPosition.left) || null,
        k = parseFloat(c.element.css("top")) + (c.position.top - c.originalPosition.top) || null;
      c.element.animate(a.extend(i, k && j ? {
        top: k,
        left: j
      } : {}), {
        duration: d.animateDuration,
        easing: d.animateEasing,
        step: function () {
          var d = {
            width: parseFloat(c.element.css("width")),
            height: parseFloat(c.element.css("height")),
            top: parseFloat(c.element.css("top")),
            left: parseFloat(c.element.css("left"))
          };
          e && e.length && a(e[0]).css({
            width: d.width,
            height: d.height
          }), c._updateCache(d), c._propagate("resize", b)
        }
      })
    }
  }), a.ui.plugin.add("resizable", "containment", {
    start: function () {
      var b, c, d, e, f, g, h, i = a(this).resizable("instance"),
        j = i.options,
        k = i.element,
        l = j.containment,
        m = l instanceof a ? l.get(0) : /parent/.test(l) ? k.parent().get(0) : l;
      m && (i.containerElement = a(m), /document/.test(l) || l === document ? (i.containerOffset = {
        left: 0,
        top: 0
      }, i.containerPosition = {
        left: 0,
        top: 0
      }, i.parentData = {
        element: a(document),
        left: 0,
        top: 0,
        width: a(document).width(),
        height: a(document).height() || document.body.parentNode.scrollHeight
      }) : (b = a(m), c = [], a(["Top", "Right", "Left", "Bottom"]).each(function (a, d) {
        c[a] = i._num(b.css("padding" + d))
      }), i.containerOffset = b.offset(), i.containerPosition = b.position(), i.containerSize = {
        height: b.innerHeight() - c[3],
        width: b.innerWidth() - c[1]
      }, d = i.containerOffset, e = i.containerSize.height, f = i.containerSize.width, g = i._hasScroll(m, "left") ? m.scrollWidth : f, h = i._hasScroll(m) ? m.scrollHeight : e, i.parentData = {
        element: m,
        left: d.left,
        top: d.top,
        width: g,
        height: h
      }))
    },
    resize: function (b) {
      var c, d, e, f, g = a(this).resizable("instance"),
        h = g.options,
        i = g.containerOffset,
        j = g.position,
        k = g._aspectRatio || b.shiftKey,
        l = {
          top: 0,
          left: 0
        },
        m = g.containerElement,
        n = !0;
      m[0] !== document && /static/.test(m.css("position")) && (l = i), j.left < (g._helper ? i.left : 0) && (g.size.width = g.size.width + (g._helper ? g.position.left - i.left : g.position.left - l.left), k && (g.size.height = g.size.width / g.aspectRatio, n = !1), g.position.left = h.helper ? i.left : 0), j.top < (g._helper ? i.top : 0) && (g.size.height = g.size.height + (g._helper ? g.position.top - i.top : g.position.top), k && (g.size.width = g.size.height * g.aspectRatio, n = !1), g.position.top = g._helper ? i.top : 0), e = g.containerElement.get(0) === g.element.parent().get(0), f = /relative|absolute/.test(g.containerElement.css("position")), e && f ? (g.offset.left = g.parentData.left + g.position.left, g.offset.top = g.parentData.top + g.position.top) : (g.offset.left = g.element.offset().left, g.offset.top = g.element.offset().top), c = Math.abs(g.sizeDiff.width + (g._helper ? g.offset.left - l.left : g.offset.left - i.left)), d = Math.abs(g.sizeDiff.height + (g._helper ? g.offset.top - l.top : g.offset.top - i.top)), c + g.size.width >= g.parentData.width && (g.size.width = g.parentData.width - c, k && (g.size.height = g.size.width / g.aspectRatio, n = !1)), d + g.size.height >= g.parentData.height && (g.size.height = g.parentData.height - d, k && (g.size.width = g.size.height * g.aspectRatio, n = !1)), n || (g.position.left = g.prevPosition.left, g.position.top = g.prevPosition.top, g.size.width = g.prevSize.width, g.size.height = g.prevSize.height)
    },
    stop: function () {
      var b = a(this).resizable("instance"),
        c = b.options,
        d = b.containerOffset,
        e = b.containerPosition,
        f = b.containerElement,
        g = a(b.helper),
        h = g.offset(),
        i = g.outerWidth() - b.sizeDiff.width,
        j = g.outerHeight() - b.sizeDiff.height;
      b._helper && !c.animate && /relative/.test(f.css("position")) && a(this).css({
        left: h.left - e.left - d.left,
        width: i,
        height: j
      }), b._helper && !c.animate && /static/.test(f.css("position")) && a(this).css({
        left: h.left - e.left - d.left,
        width: i,
        height: j
      })
    }
  }), a.ui.plugin.add("resizable", "alsoResize", {
    start: function () {
      var b = a(this).resizable("instance"),
        c = b.options;
      a(c.alsoResize).each(function () {
        var b = a(this);
        b.data("ui-resizable-alsoresize", {
          width: parseFloat(b.width()),
          height: parseFloat(b.height()),
          left: parseFloat(b.css("left")),
          top: parseFloat(b.css("top"))
        })
      })
    },
    resize: function (b, c) {
      var d = a(this).resizable("instance"),
        e = d.options,
        f = d.originalSize,
        g = d.originalPosition,
        h = {
          height: d.size.height - f.height || 0,
          width: d.size.width - f.width || 0,
          top: d.position.top - g.top || 0,
          left: d.position.left - g.left || 0
        };
      a(e.alsoResize).each(function () {
        var b = a(this),
          d = a(this).data("ui-resizable-alsoresize"),
          e = {},
          f = b.parents(c.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
        a.each(f, function (a, b) {
          var c = (d[b] || 0) + (h[b] || 0);
          c && c >= 0 && (e[b] = c || null)
        }), b.css(e)
      })
    },
    stop: function () {
      a(this).removeData("ui-resizable-alsoresize")
    }
  }), a.ui.plugin.add("resizable", "ghost", {
    start: function () {
      var b = a(this).resizable("instance"),
        c = b.size;
      b.ghost = b.originalElement.clone(), b.ghost.css({
        opacity: .25,
        display: "block",
        position: "relative",
        height: c.height,
        width: c.width,
        margin: 0,
        left: 0,
        top: 0
      }), b._addClass(b.ghost, "ui-resizable-ghost"), a.uiBackCompat !== !1 && "string" == typeof b.options.ghost && b.ghost.addClass(this.options.ghost), b.ghost.appendTo(b.helper)
    },
    resize: function () {
      var b = a(this).resizable("instance");
      b.ghost && b.ghost.css({
        position: "relative",
        height: b.size.height,
        width: b.size.width
      })
    },
    stop: function () {
      var b = a(this).resizable("instance");
      b.ghost && b.helper && b.helper.get(0).removeChild(b.ghost.get(0))
    }
  }), a.ui.plugin.add("resizable", "grid", {
    resize: function () {
      var b, c = a(this).resizable("instance"),
        d = c.options,
        e = c.size,
        f = c.originalSize,
        g = c.originalPosition,
        h = c.axis,
        i = "number" == typeof d.grid ? [d.grid, d.grid] : d.grid,
        j = i[0] || 1,
        k = i[1] || 1,
        l = Math.round((e.width - f.width) / j) * j,
        m = Math.round((e.height - f.height) / k) * k,
        n = f.width + l,
        o = f.height + m,
        p = d.maxWidth && d.maxWidth < n,
        q = d.maxHeight && d.maxHeight < o,
        r = d.minWidth && d.minWidth > n,
        s = d.minHeight && d.minHeight > o;
      d.grid = i, r && (n += j), s && (o += k), p && (n -= j), q && (o -= k), /^(se|s|e)$/.test(h) ? (c.size.width = n, c.size.height = o) : /^(ne)$/.test(h) ? (c.size.width = n, c.size.height = o, c.position.top = g.top - m) : /^(sw)$/.test(h) ? (c.size.width = n, c.size.height = o, c.position.left = g.left - l) : ((o - k <= 0 || n - j <= 0) && (b = c._getPaddingPlusBorderDimensions(this)), o - k > 0 ? (c.size.height = o, c.position.top = g.top - m) : (o = k - b.height, c.size.height = o, c.position.top = g.top + f.height - o), n - j > 0 ? (c.size.width = n, c.position.left = g.left - l) : (n = j - b.width, c.size.width = n, c.position.left = g.left + f.width - n))
    }
  }), a.ui.resizable
});;
/*! jQuery UI - v1.12.1 - 2017-03-31
 * http://jqueryui.com
 * Copyright jQuery Foundation and other contributors; Licensed  */
! function (a) {
  "function" == typeof define && define.amd ? define(["jquery", "./button", "./draggable", "./mouse", "./resizable", "../focusable", "../keycode", "../position", "../safe-active-element", "../safe-blur", "../tabbable", "../unique-id", "../version", "../widget"], a) : a(jQuery)
}(function (a) {
  return a.widget("ui.dialog", {
    version: "1.12.1",
    options: {
      appendTo: "body",
      autoOpen: !0,
      buttons: [],
      classes: {
        "ui-dialog": "ui-corner-all",
        "ui-dialog-titlebar": "ui-corner-all"
      },
      closeOnEscape: !0,
      closeText: "Close",
      draggable: !0,
      hide: null,
      height: "auto",
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,
      modal: !1,
      position: {
        my: "center",
        at: "center",
        of: window,
        collision: "fit",
        using: function (b) {
          var c = a(this).css(b).offset().top;
          c < 0 && a(this).css("top", b.top - c)
        }
      },
      resizable: !0,
      show: null,
      title: null,
      width: 300,
      beforeClose: null,
      close: null,
      drag: null,
      dragStart: null,
      dragStop: null,
      focus: null,
      open: null,
      resize: null,
      resizeStart: null,
      resizeStop: null
    },
    sizeRelatedOptions: {
      buttons: !0,
      height: !0,
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
      width: !0
    },
    resizableRelatedOptions: {
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0
    },
    _create: function () {
      this.originalCss = {
        display: this.element[0].style.display,
        width: this.element[0].style.width,
        minHeight: this.element[0].style.minHeight,
        maxHeight: this.element[0].style.maxHeight,
        height: this.element[0].style.height
      }, this.originalPosition = {
        parent: this.element.parent(),
        index: this.element.parent().children().index(this.element)
      }, this.originalTitle = this.element.attr("title"), null == this.options.title && null != this.originalTitle && (this.options.title = this.originalTitle), this.options.disabled && (this.options.disabled = !1), this._createWrapper(), this.element.show().removeAttr("title").appendTo(this.uiDialog), this._addClass("ui-dialog-content", "ui-widget-content"), this._createTitlebar(), this._createButtonPane(), this.options.draggable && a.fn.draggable && this._makeDraggable(), this.options.resizable && a.fn.resizable && this._makeResizable(), this._isOpen = !1, this._trackFocus()
    },
    _init: function () {
      this.options.autoOpen && this.open()
    },
    _appendTo: function () {
      var b = this.options.appendTo;
      return b && (b.jquery || b.nodeType) ? a(b) : this.document.find(b || "body").eq(0)
    },
    _destroy: function () {
      var a, b = this.originalPosition;
      this._untrackInstance(), this._destroyOverlay(), this.element.removeUniqueId().css(this.originalCss).detach(), this.uiDialog.remove(), this.originalTitle && this.element.attr("title", this.originalTitle), a = b.parent.children().eq(b.index), a.length && a[0] !== this.element[0] ? a.before(this.element) : b.parent.append(this.element)
    },
    widget: function () {
      return this.uiDialog
    },
    disable: a.noop,
    enable: a.noop,
    close: function (b) {
      var c = this;
      this._isOpen && this._trigger("beforeClose", b) !== !1 && (this._isOpen = !1, this._focusedElement = null, this._destroyOverlay(), this._untrackInstance(), this.opener.filter(":focusable").trigger("focus").length || a.ui.safeBlur(a.ui.safeActiveElement(this.document[0])), this._hide(this.uiDialog, this.options.hide, function () {
        c._trigger("close", b)
      }))
    },
    isOpen: function () {
      return this._isOpen
    },
    moveToTop: function () {
      this._moveToTop()
    },
    _moveToTop: function (b, c) {
      var d = !1,
        e = this.uiDialog.siblings(".ui-front:visible").map(function () {
          return +a(this).css("z-index")
        }).get(),
        f = Math.max.apply(null, e);
      return f >= +this.uiDialog.css("z-index") && (this.uiDialog.css("z-index", f + 1), d = !0), d && !c && this._trigger("focus", b), d
    },
    open: function () {
      var b = this;
      return this._isOpen ? void(this._moveToTop() && this._focusTabbable()) : (this._isOpen = !0, this.opener = a(a.ui.safeActiveElement(this.document[0])), this._size(), this._position(), this._createOverlay(), this._moveToTop(null, !0), this.overlay && this.overlay.css("z-index", this.uiDialog.css("z-index") - 1), this._show(this.uiDialog, this.options.show, function () {
        b._focusTabbable(), b._trigger("focus")
      }), this._makeFocusTarget(), void this._trigger("open"))
    },
    _focusTabbable: function () {
      var a = this._focusedElement;
      a || (a = this.element.find("[autofocus]")), a.length || (a = this.element.find(":tabbable")), a.length || (a = this.uiDialogButtonPane.find(":tabbable")), a.length || (a = this.uiDialogTitlebarClose.filter(":tabbable")), a.length || (a = this.uiDialog), a.eq(0).trigger("focus")
    },
    _keepFocus: function (b) {
      function c() {
        var b = a.ui.safeActiveElement(this.document[0]),
          c = this.uiDialog[0] === b || a.contains(this.uiDialog[0], b);
        c || this._focusTabbable()
      }
      b.preventDefault(), c.call(this), this._delay(c)
    },
    _createWrapper: function () {
      this.uiDialog = a("<div>").hide().attr({
        tabIndex: -1,
        role: "dialog"
      }).appendTo(this._appendTo()), this._addClass(this.uiDialog, "ui-dialog", "ui-widget ui-widget-content ui-front"), this._on(this.uiDialog, {
        keydown: function (b) {
          if (this.options.closeOnEscape && !b.isDefaultPrevented() && b.keyCode && b.keyCode === a.ui.keyCode.ESCAPE) return b.preventDefault(), void this.close(b);
          if (b.keyCode === a.ui.keyCode.TAB && !b.isDefaultPrevented()) {
            var c = this.uiDialog.find(":tabbable"),
              d = c.filter(":first"),
              e = c.filter(":last");
            b.target !== e[0] && b.target !== this.uiDialog[0] || b.shiftKey ? b.target !== d[0] && b.target !== this.uiDialog[0] || !b.shiftKey || (this._delay(function () {
              e.trigger("focus")
            }), b.preventDefault()) : (this._delay(function () {
              d.trigger("focus")
            }), b.preventDefault())
          }
        },
        mousedown: function (a) {
          this._moveToTop(a) && this._focusTabbable()
        }
      }), this.element.find("[aria-describedby]").length || this.uiDialog.attr({
        "aria-describedby": this.element.uniqueId().attr("id")
      })
    },
    _createTitlebar: function () {
      var b;
      this.uiDialogTitlebar = a("<div>"), this._addClass(this.uiDialogTitlebar, "ui-dialog-titlebar", "ui-widget-header ui-helper-clearfix"), this._on(this.uiDialogTitlebar, {
        mousedown: function (b) {
          a(b.target).closest(".ui-dialog-titlebar-close") || this.uiDialog.trigger("focus")
        }
      }), this.uiDialogTitlebarClose = a("<button type='button'></button>").button({
        label: a("<a>").text(this.options.closeText).html(),
        icon: "ui-icon-closethick",
        showLabel: !1
      }).appendTo(this.uiDialogTitlebar), this._addClass(this.uiDialogTitlebarClose, "ui-dialog-titlebar-close"), this._on(this.uiDialogTitlebarClose, {
        click: function (a) {
          a.preventDefault(), this.close(a)
        }
      }), b = a("<span>").uniqueId().prependTo(this.uiDialogTitlebar), this._addClass(b, "ui-dialog-title"), this._title(b), this.uiDialogTitlebar.prependTo(this.uiDialog), this.uiDialog.attr({
        "aria-labelledby": b.attr("id")
      })
    },
    _title: function (a) {
      this.options.title ? a.text(this.options.title) : a.html("&#160;")
    },
    _createButtonPane: function () {
      this.uiDialogButtonPane = a("<div>"), this._addClass(this.uiDialogButtonPane, "ui-dialog-buttonpane", "ui-widget-content ui-helper-clearfix"), this.uiButtonSet = a("<div>").appendTo(this.uiDialogButtonPane), this._addClass(this.uiButtonSet, "ui-dialog-buttonset"), this._createButtons()
    },
    _createButtons: function () {
      var b = this,
        c = this.options.buttons;
      return this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), a.isEmptyObject(c) || a.isArray(c) && !c.length ? void this._removeClass(this.uiDialog, "ui-dialog-buttons") : (a.each(c, function (c, d) {
        var e, f;
        d = a.isFunction(d) ? {
          click: d,
          text: c
        } : d, d = a.extend({
          type: "button"
        }, d), e = d.click, f = {
          icon: d.icon,
          iconPosition: d.iconPosition,
          showLabel: d.showLabel,
          icons: d.icons,
          text: d.text
        }, delete d.click, delete d.icon, delete d.iconPosition, delete d.showLabel, delete d.icons, "boolean" == typeof d.text && delete d.text, a("<button></button>", d).button(f).appendTo(b.uiButtonSet).on("click", function () {
          e.apply(b.element[0], arguments)
        })
      }), this._addClass(this.uiDialog, "ui-dialog-buttons"), void this.uiDialogButtonPane.appendTo(this.uiDialog))
    },
    _makeDraggable: function () {
      function b(a) {
        return {
          position: a.position,
          offset: a.offset
        }
      }
      var c = this,
        d = this.options;
      this.uiDialog.draggable({
        cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
        handle: ".ui-dialog-titlebar",
        containment: "document",
        start: function (d, e) {
          c._addClass(a(this), "ui-dialog-dragging"), c._blockFrames(), c._trigger("dragStart", d, b(e))
        },
        drag: function (a, d) {
          c._trigger("drag", a, b(d))
        },
        stop: function (e, f) {
          var g = f.offset.left - c.document.scrollLeft(),
            h = f.offset.top - c.document.scrollTop();
          d.position = {
            my: "left top",
            at: "left" + (g >= 0 ? "+" : "") + g + " top" + (h >= 0 ? "+" : "") + h,
            of: c.window
          }, c._removeClass(a(this), "ui-dialog-dragging"), c._unblockFrames(), c._trigger("dragStop", e, b(f))
        }
      })
    },
    _makeResizable: function () {
      function b(a) {
        return {
          originalPosition: a.originalPosition,
          originalSize: a.originalSize,
          position: a.position,
          size: a.size
        }
      }
      var c = this,
        d = this.options,
        e = d.resizable,
        f = this.uiDialog.css("position"),
        g = "string" == typeof e ? e : "n,e,s,w,se,sw,ne,nw";
      this.uiDialog.resizable({
        cancel: ".ui-dialog-content",
        containment: "document",
        alsoResize: this.element,
        maxWidth: d.maxWidth,
        maxHeight: d.maxHeight,
        minWidth: d.minWidth,
        minHeight: this._minHeight(),
        handles: g,
        start: function (d, e) {
          c._addClass(a(this), "ui-dialog-resizing"), c._blockFrames(), c._trigger("resizeStart", d, b(e))
        },
        resize: function (a, d) {
          c._trigger("resize", a, b(d))
        },
        stop: function (e, f) {
          var g = c.uiDialog.offset(),
            h = g.left - c.document.scrollLeft(),
            i = g.top - c.document.scrollTop();
          d.height = c.uiDialog.height(), d.width = c.uiDialog.width(), d.position = {
            my: "left top",
            at: "left" + (h >= 0 ? "+" : "") + h + " top" + (i >= 0 ? "+" : "") + i,
            of: c.window
          }, c._removeClass(a(this), "ui-dialog-resizing"), c._unblockFrames(), c._trigger("resizeStop", e, b(f))
        }
      }).css("position", f)
    },
    _trackFocus: function () {
      this._on(this.widget(), {
        focusin: function (b) {
          this._makeFocusTarget(), this._focusedElement = a(b.target)
        }
      })
    },
    _makeFocusTarget: function () {
      this._untrackInstance(), this._trackingInstances().unshift(this)
    },
    _untrackInstance: function () {
      var b = this._trackingInstances(),
        c = a.inArray(this, b);
      c !== -1 && b.splice(c, 1)
    },
    _trackingInstances: function () {
      var a = this.document.data("ui-dialog-instances");
      return a || (a = [], this.document.data("ui-dialog-instances", a)), a
    },
    _minHeight: function () {
      var a = this.options;
      return "auto" === a.height ? a.minHeight : Math.min(a.minHeight, a.height)
    },
    _position: function () {
      var a = this.uiDialog.is(":visible");
      a || this.uiDialog.show(), this.uiDialog.position(this.options.position), a || this.uiDialog.hide()
    },
    _setOptions: function (b) {
      var c = this,
        d = !1,
        e = {};
      a.each(b, function (a, b) {
        c._setOption(a, b), a in c.sizeRelatedOptions && (d = !0), a in c.resizableRelatedOptions && (e[a] = b)
      }), d && (this._size(), this._position()), this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", e)
    },
    _setOption: function (b, c) {
      var d, e, f = this.uiDialog;
      "disabled" !== b && (this._super(b, c), "appendTo" === b && this.uiDialog.appendTo(this._appendTo()), "buttons" === b && this._createButtons(), "closeText" === b && this.uiDialogTitlebarClose.button({
        label: a("<a>").text("" + this.options.closeText).html()
      }), "draggable" === b && (d = f.is(":data(ui-draggable)"), d && !c && f.draggable("destroy"), !d && c && this._makeDraggable()), "position" === b && this._position(), "resizable" === b && (e = f.is(":data(ui-resizable)"), e && !c && f.resizable("destroy"), e && "string" == typeof c && f.resizable("option", "handles", c), e || c === !1 || this._makeResizable()), "title" === b && this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))
    },
    _size: function () {
      var a, b, c, d = this.options;
      this.element.show().css({
        width: "auto",
        minHeight: 0,
        maxHeight: "none",
        height: 0
      }), d.minWidth > d.width && (d.width = d.minWidth), a = this.uiDialog.css({
        height: "auto",
        width: d.width
      }).outerHeight(), b = Math.max(0, d.minHeight - a), c = "number" == typeof d.maxHeight ? Math.max(0, d.maxHeight - a) : "none", "auto" === d.height ? this.element.css({
        minHeight: b,
        maxHeight: c,
        height: "auto"
      }) : this.element.height(Math.max(0, d.height - a)), this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
    },
    _blockFrames: function () {
      this.iframeBlocks = this.document.find("iframe").map(function () {
        var b = a(this);
        return a("<div>").css({
          position: "absolute",
          width: b.outerWidth(),
          height: b.outerHeight()
        }).appendTo(b.parent()).offset(b.offset())[0]
      })
    },
    _unblockFrames: function () {
      this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
    },
    _allowInteraction: function (b) {
      return !!a(b.target).closest(".ui-dialog").length || !!a(b.target).closest(".ui-datepicker").length
    },
    _createOverlay: function () {
      if (this.options.modal) {
        var b = !0;
        this._delay(function () {
          b = !1
        }), this.document.data("ui-dialog-overlays") || this._on(this.document, {
          focusin: function (a) {
            b || this._allowInteraction(a) || (a.preventDefault(), this._trackingInstances()[0]._focusTabbable())
          }
        }), this.overlay = a("<div>").appendTo(this._appendTo()), this._addClass(this.overlay, null, "ui-widget-overlay ui-front"), this._on(this.overlay, {
          mousedown: "_keepFocus"
        }), this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1)
      }
    },
    _destroyOverlay: function () {
      if (this.options.modal && this.overlay) {
        var a = this.document.data("ui-dialog-overlays") - 1;
        a ? this.document.data("ui-dialog-overlays", a) : (this._off(this.document, "focusin"), this.document.removeData("ui-dialog-overlays")), this.overlay.remove(), this.overlay = null
      }
    }
  }), a.uiBackCompat !== !1 && a.widget("ui.dialog", a.ui.dialog, {
    options: {
      dialogClass: ""
    },
    _createWrapper: function () {
      this._super(), this.uiDialog.addClass(this.options.dialogClass)
    },
    _setOption: function (a, b) {
      "dialogClass" === a && this.uiDialog.removeClass(this.options.dialogClass).addClass(b), this._superApply(arguments)
    }
  }), a.ui.dialog
});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal, drupalSettings) {
  drupalSettings.dialog = {
    autoOpen: true,
    dialogClass: '',

    buttonClass: 'button',
    buttonPrimaryClass: 'button--primary',
    close: function close(event) {
      Drupal.dialog(event.target).close();
      Drupal.detachBehaviors(event.target, null, 'unload');
    }
  };

  Drupal.dialog = function (element, options) {
    var undef = void 0;
    var $element = $(element);
    var dialog = {
      open: false,
      returnValue: undef
    };

    function openDialog(settings) {
      settings = $.extend({}, drupalSettings.dialog, options, settings);

      $(window).trigger('dialog:beforecreate', [dialog, $element, settings]);
      $element.dialog(settings);
      dialog.open = true;
      $(window).trigger('dialog:aftercreate', [dialog, $element, settings]);
    }

    function closeDialog(value) {
      $(window).trigger('dialog:beforeclose', [dialog, $element]);
      $element.dialog('close');
      dialog.returnValue = value;
      dialog.open = false;
      $(window).trigger('dialog:afterclose', [dialog, $element]);
    }

    dialog.show = function () {
      openDialog({
        modal: false
      });
    };
    dialog.showModal = function () {
      openDialog({
        modal: true
      });
    };
    dialog.close = closeDialog;

    return dialog;
  };
})(jQuery, Drupal, drupalSettings);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal, drupalSettings, debounce, displace) {
  drupalSettings.dialog = $.extend({
    autoResize: true,
    maxHeight: '95%'
  }, drupalSettings.dialog);

  function resetPosition(options) {
    var offsets = displace.offsets;
    var left = offsets.left - offsets.right;
    var top = offsets.top - offsets.bottom;

    var leftString = (left > 0 ? '+' : '-') + Math.abs(Math.round(left / 2)) + 'px';
    var topString = (top > 0 ? '+' : '-') + Math.abs(Math.round(top / 2)) + 'px';
    options.position = {
      my: 'center' + (left !== 0 ? leftString : '') + ' center' + (top !== 0 ? topString : ''),
      of: window
    };
    return options;
  }

  function resetSize(event) {
    var positionOptions = ['width', 'height', 'minWidth', 'minHeight', 'maxHeight', 'maxWidth', 'position'];
    var adjustedOptions = {};
    var windowHeight = $(window).height();
    var option = void 0;
    var optionValue = void 0;
    var adjustedValue = void 0;
    for (var n = 0; n < positionOptions.length; n++) {
      option = positionOptions[n];
      optionValue = event.data.settings[option];
      if (optionValue) {
        if (typeof optionValue === 'string' && /%$/.test(optionValue) && /height/i.test(option)) {
          windowHeight -= displace.offsets.top + displace.offsets.bottom;
          adjustedValue = parseInt(0.01 * parseInt(optionValue, 10) * windowHeight, 10);

          if (option === 'height' && event.data.$element.parent().outerHeight() < adjustedValue) {
            adjustedValue = 'auto';
          }
          adjustedOptions[option] = adjustedValue;
        }
      }
    }

    if (!event.data.settings.modal) {
      adjustedOptions = resetPosition(adjustedOptions);
    }
    event.data.$element.dialog('option', adjustedOptions).trigger('dialogContentResize');
  }

  $(window).on({
    'dialog:aftercreate': function dialogAftercreate(event, dialog, $element, settings) {
      var autoResize = debounce(resetSize, 20);
      var eventData = {
        settings: settings,
        $element: $element
      };
      if (settings.autoResize === true || settings.autoResize === 'true') {
        $element.dialog('option', {
          resizable: false,
          draggable: false
        }).dialog('widget').css('position', 'fixed');
        $(window).on('resize.dialogResize scroll.dialogResize', eventData, autoResize).trigger('resize.dialogResize');
        $(document).on('drupalViewportOffsetChange.dialogResize', eventData, autoResize);
      }
    },
    'dialog:beforeclose': function dialogBeforeclose(event, dialog, $element) {
      $(window).off('.dialogResize');
      $(document).off('.dialogResize');
    }
  });
})(jQuery, Drupal, drupalSettings, Drupal.debounce, Drupal.displace);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($) {
  $.widget('ui.dialog', $.ui.dialog, {
    options: {
      buttonClass: 'button',
      buttonPrimaryClass: 'button--primary'
    },
    _createButtons: function _createButtons() {
      var opts = this.options;
      var primaryIndex = void 0;
      var index = void 0;
      var il = opts.buttons.length;
      for (index = 0; index < il; index++) {
        if (opts.buttons[index].primary && opts.buttons[index].primary === true) {
          primaryIndex = index;
          delete opts.buttons[index].primary;
          break;
        }
      }
      this._super();
      var $buttons = this.uiButtonSet.children().addClass(opts.buttonClass);
      if (typeof primaryIndex !== 'undefined') {
        $buttons.eq(index).addClass(opts.buttonPrimaryClass);
      }
    }
  });
})(jQuery);;
! function (t) {
  var o = {};

  function e(n) {
    if (o[n]) return o[n].exports;
    var i = o[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return t[n].call(i.exports, i, i.exports, e), i.l = !0, i.exports
  }
  e.m = t, e.c = o, e.d = function (t, o, n) {
    e.o(t, o) || Object.defineProperty(t, o, {
      enumerable: !0,
      get: n
    })
  }, e.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, e.t = function (t, o) {
    if (1 & o && (t = e(t)), 8 & o) return t;
    if (4 & o && "object" == typeof t && t && t.__esModule) return t;
    var n = Object.create(null);
    if (e.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: t
      }), 2 & o && "string" != typeof t)
      for (var i in t) e.d(n, i, function (o) {
        return t[o]
      }.bind(null, i));
    return n
  }, e.n = function (t) {
    var o = t && t.__esModule ? function () {
      return t.default
    } : function () {
      return t
    };
    return e.d(o, "a", o), o
  }, e.o = function (t, o) {
    return Object.prototype.hasOwnProperty.call(t, o)
  }, e.p = "", e(e.s = 144)
}({
  0: function (t, o, e) {
    "use strict";
    e.d(o, "a", (function () {
      return g
    })), e.d(o, "b", (function () {
      return v
    }));
    var n = !1;
    if ("undefined" != typeof window) {
      var i = {
        get passive() {
          n = !0
        }
      };
      window.addEventListener("testPassive", null, i), window.removeEventListener("testPassive", null, i)
    }
    var r = "undefined" != typeof window && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || "MacIntel" === window.navigator.platform && window.navigator.maxTouchPoints > 1),
      a = [],
      l = !1,
      s = -1,
      u = void 0,
      c = void 0,
      d = function (t) {
        return a.some((function (o) {
          return !(!o.options.allowTouchMove || !o.options.allowTouchMove(t))
        }))
      },
      p = function (t) {
        var o = t || window.event;
        return !!d(o.target) || (o.touches.length > 1 || (o.preventDefault && o.preventDefault(), !1))
      },
      f = function () {
        void 0 !== c && (document.body.style.paddingRight = c, c = void 0), void 0 !== u && (document.body.style.overflow = u, u = void 0)
      },
      g = function (t, o) {
        if (t) {
          if (!a.some((function (o) {
              return o.targetElement === t
            }))) {
            var e = {
              targetElement: t,
              options: o || {}
            };
            a = [].concat(function (t) {
              if (Array.isArray(t)) {
                for (var o = 0, e = Array(t.length); o < t.length; o++) e[o] = t[o];
                return e
              }
              return Array.from(t)
            }(a), [e]), r ? (t.ontouchstart = function (t) {
              1 === t.targetTouches.length && (s = t.targetTouches[0].clientY)
            }, t.ontouchmove = function (o) {
              1 === o.targetTouches.length && function (t, o) {
                var e = t.targetTouches[0].clientY - s;
                !d(t.target) && (o && 0 === o.scrollTop && e > 0 || function (t) {
                  return !!t && t.scrollHeight - t.scrollTop <= t.clientHeight
                }(o) && e < 0 ? p(t) : t.stopPropagation())
              }(o, t)
            }, l || (document.addEventListener("touchmove", p, n ? {
              passive: !1
            } : void 0), l = !0)) : function (t) {
              if (void 0 === c) {
                var o = !!t && !0 === t.reserveScrollBarGap,
                  e = window.innerWidth - document.documentElement.clientWidth;
                o && e > 0 && (c = document.body.style.paddingRight, document.body.style.paddingRight = e + "px")
              }
              void 0 === u && (u = document.body.style.overflow, document.body.style.overflow = "hidden")
            }(o)
          }
        } else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")
      },
      v = function (t) {
        t ? (a = a.filter((function (o) {
          return o.targetElement !== t
        })), r ? (t.ontouchstart = null, t.ontouchmove = null, l && 0 === a.length && (document.removeEventListener("touchmove", p, n ? {
          passive: !1
        } : void 0), l = !1)) : a.length || f()) : console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")
      }
  },
  144: function (t, o, e) {
    "use strict";
    e.r(o);
    var n = e(0);

    function i(t) {
      return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
        return typeof t
      } : function (t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
      })(t)
    }! function (t, o) {
      t.behaviors.jpgDialog = {
        attach: function (e, r) {
          function a(t, o) {
            if (t.dialogClass && "string" == typeof t.dialogClass && t.dialogClass.indexOf(o) >= 0) return !0
          }

          function l(t, e, n) {
            var i = n.attr("id");
            t.is(":visible") && o("#".concat(i)).dialog("isOpen") && (t.addClass("jpg-dialog--disappears"), setTimeout((function () {
              t.removeClass("jpg-dialog--disappears"), o("#".concat(i)).dialog("close")
            }), 1e3))
          }
          o(window).once("jpg-dialog").on({
            "dialog:beforecreate": function (t, e, n, i) {
              a(i, "popin-modal") && !window.matchMedia("(min-width: 1200px)").matches && (o.ui.dialog.prototype._focusTabbable = function () {}), a(i, "jpg-dialog") && (i.autoResize = !1, i.resizable = !1, o.ui.dialog.prototype.options.height = null, o.ui.dialog.prototype.options.width = null, o.ui.dialog.prototype.options.minWidth = null, o.ui.dialog.prototype.options.minHeight = null, o.ui.dialog.prototype.options.position = null, o.ui.dialog.prototype.options.resizable = !1, o.ui.dialog.prototype.options.showTitlebar = !1, o.ui.dialog.prototype._position = function () {}, o.ui.dialog.prototype._focusTabbable = function () {})
            },
            "dialog:aftercreate": function (e, s, u, c) {
              if (a(c, "jpg-dialog")) {
                var d = u.parent();
                "undefined" !== i(d.attr("class")) && !1 !== d.attr("class") && o.each(d.attr("class").split(/\s+/), (function (t, o) {
                  o.indexOf("ui-") >= 0 && d.removeClass(o)
                })), d.removeAttr("style"), "undefined" !== i(u.attr("class")) && !1 !== u.attr("class") && o.each(u.attr("class").split(/\s+/), (function (t, o) {
                  o.indexOf("ui-") >= 0 && u.removeClass(o)
                })), u.removeAttr("style"), u.addClass("jpg-dialog__container"), u.wrapInner('<div class="jpg-dialog__content"><div class="jpg-dialog__content-inner"></div></div>');
                var p = '<button type="button" class="jpg-dialog__close-btn button button--circle button--iconic button--fifth">\n                  <span class="visually-hidden">'.concat(t.t("Close popup"), '</span>\n                  <svg class="jpg-dialog__close-icon button__icon" aria-hidden="true">\n                    <use xlink:href="').concat(r.jpgSvgSpritePath, '#svg-cross"></use>\n                  </svg>\n                </button>');
                if (u.prepend(p), d.find(".ui-dialog-title").text().length > 1) {
                  var f = '<div class="jpg-dialog__title">'.concat(d.find(".ui-dialog-title").text(), "</div>");
                  u.prepend(f)
                }
                d.find(".ui-dialog-titlebar").remove(), u.find(".jpg-dialog__close-btn").on("click", (function () {
                  l(d, 0, u)
                })), o(".ui-widget-overlay").on("click", (function () {
                  l(d, 0, u)
                })), d.addClass("jpg-dialog--appears"), setTimeout((function () {
                  d.removeClass("jpg-dialog--appears")
                }), 1e3), Object(n.a)(u[0]);
                var g = window.document.createEvent("UIEvents");
                g.initUIEvent("resize", !0, !1, window, 0), window.dispatchEvent(g)
              }
            },
            "dialog:afterclose": function (t, o, e) {
              e.closest(".jpg-dialog") && Object(n.b)(e[0])
            }
          })
        }
      }
    }(Drupal, jQuery)
  }
});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal) {
  Drupal.behaviors.dialog = {
    attach: function attach(context, settings) {
      var $context = $(context);

      if (!$('#drupal-modal').length) {
        $('<div id="drupal-modal" class="ui-front"></div>').hide().appendTo('body');
      }

      var $dialog = $context.closest('.ui-dialog-content');
      if ($dialog.length) {
        if ($dialog.dialog('option', 'drupalAutoButtons')) {
          $dialog.trigger('dialogButtonsChange');
        }

        $dialog.dialog('widget').trigger('focus');
      }

      var originalClose = settings.dialog.close;

      settings.dialog.close = function (event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        originalClose.apply(settings.dialog, [event].concat(args));
        $(event.target).remove();
      };
    },
    prepareDialogButtons: function prepareDialogButtons($dialog) {
      var buttons = [];
      var $buttons = $dialog.find('.form-actions input[type=submit], .form-actions a.button');
      $buttons.each(function () {
        var $originalButton = $(this).css({
          display: 'none'
        });
        buttons.push({
          text: $originalButton.html() || $originalButton.attr('value'),
          class: $originalButton.attr('class'),
          click: function click(e) {
            if ($originalButton.is('a')) {
              $originalButton[0].click();
            } else {
              $originalButton.trigger('mousedown').trigger('mouseup').trigger('click');
              e.preventDefault();
            }
          }
        });
      });
      return buttons;
    }
  };

  Drupal.AjaxCommands.prototype.openDialog = function (ajax, response, status) {
    if (!response.selector) {
      return false;
    }
    var $dialog = $(response.selector);
    if (!$dialog.length) {
      $dialog = $('<div id="' + response.selector.replace(/^#/, '') + '" class="ui-front"></div>').appendTo('body');
    }

    if (!ajax.wrapper) {
      ajax.wrapper = $dialog.attr('id');
    }

    response.command = 'insert';
    response.method = 'html';
    ajax.commands.insert(ajax, response, status);

    if (!response.dialogOptions.buttons) {
      response.dialogOptions.drupalAutoButtons = true;
      response.dialogOptions.buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
    }

    $dialog.on('dialogButtonsChange', function () {
      var buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
      $dialog.dialog('option', 'buttons', buttons);
    });

    response.dialogOptions = response.dialogOptions || {};
    var dialog = Drupal.dialog($dialog.get(0), response.dialogOptions);
    if (response.dialogOptions.modal) {
      dialog.showModal();
    } else {
      dialog.show();
    }

    $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
  };

  Drupal.AjaxCommands.prototype.closeDialog = function (ajax, response, status) {
    var $dialog = $(response.selector);
    if ($dialog.length) {
      Drupal.dialog($dialog.get(0)).close();
      if (!response.persist) {
        $dialog.remove();
      }
    }

    $dialog.off('dialogButtonsChange');
  };

  Drupal.AjaxCommands.prototype.setDialogOption = function (ajax, response, status) {
    var $dialog = $(response.selector);
    if ($dialog.length) {
      $dialog.dialog('option', response.optionName, response.optionValue);
    }
  };

  $(window).on('dialog:aftercreate', function (e, dialog, $element, settings) {
    $element.on('click.dialog', '.dialog-cancel', function (e) {
      dialog.close('cancel');
      e.preventDefault();
      e.stopPropagation();
    });
  });

  $(window).on('dialog:beforeclose', function (e, dialog, $element) {
    $element.off('.dialog');
  });
})(jQuery, Drupal);;
/**
 * @file
 * Behaviors for menu datalayer.
 */

'use strict';
(function ($, Drupal) {
  Drupal.behaviors.jpgDataLayerMenu = {
    attach(context, settings) {

      $('.js--tracking-menu a')
        .once('jpg-datalayer-menu')
        .on('click', function () {
          if (typeof track !== 'undefined') {
            // Menu container. Some elements are available at this level.
            var $menuContainer = $(this).closest('.js--tracking-menu');
            // Preparing needed variables.
            var position = $menuContainer.data('tracking-position');
            switch (position) {
              case 'header':
                track.menuHeaderLinks();
                break;

              case 'footer':
                track.menuFooterLinks();
                break;
            }
          }
        });

    }
  };
})(jQuery, Drupal);;
/*! js-cookie v3.0.0-rc.0 | MIT */
! function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self, function () {
    var r = e.Cookies,
      n = e.Cookies = t();
    n.noConflict = function () {
      return e.Cookies = r, n
    }
  }())
}(this, function () {
  "use strict";

  function e(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) e[n] = r[n]
    }
    return e
  }
  var t = {
    read: function (e) {
      return e.replace(/%3B/g, ";")
    },
    write: function (e) {
      return e.replace(/;/g, "%3B")
    }
  };
  return function r(n, i) {
    function o(r, o, u) {
      if ("undefined" != typeof document) {
        "number" == typeof (u = e({}, i, u)).expires && (u.expires = new Date(Date.now() + 864e5 * u.expires)), u.expires && (u.expires = u.expires.toUTCString()), r = t.write(r).replace(/=/g, "%3D"), o = n.write(String(o), r);
        var c = "";
        for (var f in u) u[f] && (c += "; " + f, !0 !== u[f] && (c += "=" + u[f].split(";")[0]));
        return document.cookie = r + "=" + o + c
      }
    }
    return Object.create({
      set: o,
      get: function (e) {
        if ("undefined" != typeof document && (!arguments.length || e)) {
          for (var r = document.cookie ? document.cookie.split("; ") : [], i = {}, o = 0; o < r.length; o++) {
            var u = r[o].split("="),
              c = u.slice(1).join("="),
              f = t.read(u[0]).replace(/%3D/g, "=");
            if (i[f] = n.read(c, f), e === f) break
          }
          return e ? i[e] : i
        }
      },
      remove: function (t, r) {
        o(t, "", e({}, r, {
          expires: -1
        }))
      },
      withAttributes: function (t) {
        return r(this.converter, e({}, this.attributes, t))
      },
      withConverter: function (t) {
        return r(e({}, this.converter, t), this.attributes)
      }
    }, {
      attributes: {
        value: Object.freeze(i)
      },
      converter: {
        value: Object.freeze(n)
      }
    })
  }(t, {
    path: "/"
  })
});;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal, cookies) {
  var isFunction = function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  var parseCookieValue = function parseCookieValue(value, parseJson) {
    if (value.indexOf('"') === 0) {
      value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      value = decodeURIComponent(value.replace(/\+/g, ' '));
      return parseJson ? JSON.parse(value) : value;
    } catch (e) {}
  };

  var reader = function reader(cookieValue, cookieName, converter, readUnsanitized, parseJson) {
    var value = readUnsanitized ? cookieValue : parseCookieValue(cookieValue, parseJson);

    if (converter !== undefined && isFunction(converter)) {
      return converter(value, cookieName);
    }

    return value;
  };

  $.cookie = function (key) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    key = key && !$.cookie.raw ? encodeURIComponent(key) : key;
    if (value !== undefined && !isFunction(value)) {
      var attributes = Object.assign({}, $.cookie.defaults, options);

      if (typeof attributes.expires === 'string' && attributes.expires !== '') {
        attributes.expires = new Date(attributes.expires);
      }

      var cookieSetter = cookies.withConverter({
        write: function write(cookieValue) {
          return encodeURIComponent(cookieValue);
        }
      });

      value = $.cookie.json && !$.cookie.raw ? JSON.stringify(value) : String(value);

      return cookieSetter.set(key, value, attributes);
    }

    var userProvidedConverter = value;
    var cookiesShim = cookies.withConverter({
      read: function read(cookieValue, cookieName) {
        return reader(cookieValue, cookieName, userProvidedConverter, $.cookie.raw, $.cookie.json);
      }
    });

    if (key !== undefined) {
      return cookiesShim.get(key);
    }

    var results = cookiesShim.get();
    Object.keys(results).forEach(function (resultKey) {
      if (results[resultKey] === undefined) {
        delete results[resultKey];
      }
    });

    return results;
  };

  $.cookie.defaults = Object.assign({
    path: ''
  }, cookies.defaults);

  $.cookie.json = false;

  $.cookie.raw = false;

  $.removeCookie = function (key, options) {
    cookies.remove(key, Object.assign({}, $.cookie.defaults, options));
    return !cookies.get(key);
  };
})(jQuery, Drupal, window.Cookies);;
/**
 * @file
 * Contains JS-part of functionality for the newsletter block.
 */

(function ($, Drupal, drupalSettings, cookies) {

  'use strict';

  Drupal.behaviors.jpgNewsletterForm = {
    attach: function (context) {
      let params = {};
      params.callback = function (response) {
        if (typeof track !== "undefined") {
          if (response.success) {
            $('.join-newsletter-form').html('<p>' + Drupal.t('Success') + '</p>');
            track.subscriptionSuccess();
          } else {
            track.subscriptionError();
          }
        }
      };

      // Can be a few forms because of the welcome popin modal.
      $('[id^="join-newsletter-form"]', context)
        .once('jpg-newsletter')
        .each(function () {
          let form = this;
          $(this).submit(function (event) {
            event.preventDefault();
            // Do not submit if error and not checked.
            if ($('input.error', form).length || !$('[name=legal]:checked', form).length) {
              return;
            }

            // Build account info.
            let data = {};
            let profile = {};
            let subscriptions = {};
            let acquisitionSource = $(this).data('acquisition-source');
            profile.email = $(this).find('[name=ciam_email]').val();
            profile.languages = $(this).find('[name=ciam_language]').val();
            profile.country = $(this).find('[name=ciam_country]').val();
            data.terms = true;
            data.subscribe = true;
            data.acquisitionSource = acquisitionSource ? acquisitionSource : 'website_footer';

            subscriptions.subscriptionInterestFragrance = {};
            subscriptions.subscriptionInterestFragrance.email = {};
            subscriptions.subscriptionInterestFragrance.email.isSubscribed = true;
            let user = {
              data: data,
              profile: profile,
              subscriptions: subscriptions
            };

            params.data = {
              user: user
            };

            /* Method to be called on form submit */
            if (typeof ciam != "undefined") {
              ciam.createLiteAccount(params);
              // If user submit the Welcome popin during its session,
              // the popin should not displayed anymore until the next session.
              cookies.set(
                'jpg_modal_anon_count',
                drupalSettings.jpg_modals.popin.times_to_show);
              cookies.set(
                'jpg_modal_already_closed_in_browser_session',
                1);
              let popin = $('#popin-wrapper');
              if (popin.hasClass("ui-dialog-content") &&
                popin.dialog("isOpen")) {
                popin.dialog("close");
              }
            }
          })
        });
    }
  }
})(jQuery, Drupal, drupalSettings, window.Cookies);;