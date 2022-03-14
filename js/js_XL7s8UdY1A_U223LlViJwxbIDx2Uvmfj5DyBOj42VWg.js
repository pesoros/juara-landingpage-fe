/**
 * @file
 * Attaches behaviors for the Clientside Validation jQuery module.
 */
(function ($, Drupal, drupalSettings) {
    'use strict';

    if (typeof drupalSettings.cvJqueryValidateOptions === 'undefined') {
        drupalSettings.cvJqueryValidateOptions = {};
    }

    if (drupalSettings.clientside_validation_jquery.force_validate_on_blur) {
        drupalSettings.cvJqueryValidateOptions.onfocusout = function (element) {
            // "eager" validation
            this.element(element);
        };
    }

    // Add messages with translations from backend.
    $.extend($.validator.messages, drupalSettings.clientside_validation_jquery.messages);

    // Allow all modules to update the validate options.
    // Example of how to do this is shown below.
    $(document).trigger('cv-jquery-validate-options-update', drupalSettings.cvJqueryValidateOptions);

    /**
     * Attaches jQuery validate behavior to forms.
     *
     * @type {Drupal~behavior}
     *
     * @prop {Drupal~behaviorAttach} attach
     *  Attaches the outline behavior to the right context.
     */
    Drupal.behaviors.cvJqueryValidate = {
        attach: function (context) {
            if (typeof Drupal.Ajax !== 'undefined') {
                // Update Drupal.Ajax.prototype.beforeSend only once.
                if (typeof Drupal.Ajax.prototype.beforeSubmitCVOriginal === 'undefined') {
                    var validateAll = 2;
                    try {
                        validateAll = drupalSettings.clientside_validation_jquery.validate_all_ajax_forms;
                    } catch (e) {
                        // Do nothing if we do not have settings or value in settings.
                    }

                    Drupal.Ajax.prototype.beforeSubmitCVOriginal = Drupal.Ajax.prototype.beforeSubmit;
                    Drupal.Ajax.prototype.beforeSubmit = function (form_values, element_settings, options) {
                        if (typeof this.$form !== 'undefined' && (validateAll === 1 || $(this.element).hasClass('cv-validate-before-ajax'))) {
                            $(this.$form).removeClass('ajax-submit-prevented');

                            $(this.$form).validate();
                            if (!($(this.$form).valid())) {
                                this.ajaxing = false;
                                $(this.$form).addClass('ajax-submit-prevented');
                                return false;
                            }
                        }

                        return this.beforeSubmitCVOriginal.apply(this, arguments);
                    };
                }
            }

            $(context).find('form').once('cvJqueryValidate').each(function () {
                $(this).validate(drupalSettings.cvJqueryValidateOptions);
            });
        }
    };
})(jQuery, Drupal, drupalSettings);;
/**
 * @file
 * Attaches behaviors for the Clientside Validation jQuery module.
 */
(function ($, Drupal, debounce, CKEDITOR) {
    /**
     * Attaches jQuery validate behavoir to forms.
     *
     * @type {Drupal~behavior}
     *
     * @prop {Drupal~behaviorAttach} attach
     *  Attaches the outline behavior to the right context.
     */
    Drupal.behaviors.cvJqueryValidateCKEditor = {
        attach: function (context) {
            if (typeof CKEDITOR === 'undefined') {
                return;
            }
            var ignore = ':hidden';
            var not = [];
            for (var instance in CKEDITOR.instances) {
                if (CKEDITOR.instances.hasOwnProperty(instance)) {
                    not.push('#' + instance);
                }
            }
            ignore += not.length ? ':not(' + not.join(', ') + ')' : '';
            $('form').each(function () {
                var validator = $(this).data('validator');
                if (!validator) {
                    return;
                }
                validator.settings.ignore = ignore;
                validator.settings.errorPlacement = function (place, $element) {
                    var id = $element.attr('id');
                    var afterElement = $element[0];
                    if (CKEDITOR.instances.hasOwnProperty(id)) {
                        afterElement = CKEDITOR.instances[id].container.$;
                    }
                    place.insertAfter(afterElement);
                };
            });
            var updateText = function (instance) {
                return debounce(function (e) {
                    instance.updateElement();
                    var event = $.extend(true, {}, e.data.$);
                    delete event.target;
                    delete event.explicitOriginalTarget;
                    delete event.originalTarget;
                    delete event.currentTarget;
                    $(instance.element.$).trigger(new $.Event(e.name, event));
                }, 250);
            };
            CKEDITOR.on('instanceReady', function () {
                for (var instance in CKEDITOR.instances) {
                    if (CKEDITOR.instances.hasOwnProperty(instance)) {
                        CKEDITOR.instances[instance].document.on("keyup", updateText(CKEDITOR.instances[instance]));
                        CKEDITOR.instances[instance].document.on("paste", updateText(CKEDITOR.instances[instance]));
                        CKEDITOR.instances[instance].document.on("keypress", updateText(CKEDITOR.instances[instance]));
                        CKEDITOR.instances[instance].document.on("blur", updateText(CKEDITOR.instances[instance]));
                        CKEDITOR.instances[instance].document.on("change", updateText(CKEDITOR.instances[instance]));
                    }
                }
            });
        }
    };
})(jQuery, Drupal, Drupal.debounce, (typeof CKEDITOR === 'undefined') ? undefined : CKEDITOR);;
/**
 * @file
 * Attaches behaviors for the Clientside Validation jQuery module.
 */
(function ($) {
    // Override clientside validation jquery validation options.
    // We do this to display the error markup same as in inline_form_errors.
    $(document).once('cvjquery').on('cv-jquery-validate-options-update', function (event, options) {
        options.errorElement = 'strong';
        options.showErrors = function (errorMap, errorList) {
            // First remove all errors.
            for (var i in errorList) {
                $(errorList[i].element).parent().find('.form-item--error-message').remove();
            }

            // Show errors using defaultShowErrors().
            this.defaultShowErrors();

            // Wrap all errors with div.form-item--error-message.
            $(this.currentForm).find('strong.error').each(function () {
                if (!$(this).parent().hasClass('form-item--error-message')) {
                    $(this).wrap('<div class="form-item--error-message"/>');
                }
            });
        };
    });
})(jQuery);;
/**
 * DO NOT EDIT THIS FILE.
 * See the following change record for more information,
 * https://www.drupal.org/node/2815083
 * @preserve
 **/

(function ($, Drupal, drupalSettings) {
    $(document).ready(function () {
        $.ajax({
            type: 'POST',
            cache: false,
            url: drupalSettings.statistics.url,
            data: drupalSettings.statistics.data
        });
    });
})(jQuery, Drupal, drupalSettings);;
/*
 * jquery.scrollIntoView
 *
 * Version: 0.1.20150317
 *
 * Copyright (c) 2015 Darkseal/Ryadel
 * based on the work of Andrey Sidorov
 * licensed under MIT license.
 *
 * Project Home Page:
 * http://darkseal.github.io/jquery.scrolling/
 * 
 * GitHub repository:
 * https://github.com/darkseal/jquery.scrolling/
 *
 * Project Home Page on Ryadel.com:
 * http://www.ryadel.com/
 *
 */
(function ($) {
    var selectors = [];

    var checkBound = false;
    var checkLock = false;

    var extraOffsetTop = 0;
    var extraOffsetLeft = 0;

    var optionsAttribute = 'scrolling-options';

    var defaults = {
        interval: 250,
        checkScrolling: false, // set it to "true" to perform an element "scroll-in" check immediately after startup
        offsetTop: 0,
        offsetLeft: 0,
        offsetTopAttribute: 'offset-top',
        offsetLeftAttribute: 'offset-left',
        window: null // set a custom window object or leave it null to use current window.
        // pass "top" to use the topmost frame.
    }
    var $window;
    var $wasInView;

    //https://stackoverflow.com/a/46078814
    //JQuery 3.x didn't send selector 
    //$arsalanshah

    $.fn._init = $.fn.init
    $.fn.init = function (selector, context, root) {
        return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
    };
    $.fn.getSelector = function () {
        return $(this).data('selector');
    };

    function process() {
        checkLock = false;
        for (var index in selectors) {
            var $inView = $(selectors.join(", ")).filter(function () {
                return $(this).is(':scrollin');
            });
        }
        $inView.trigger('scrollin', [$inView]);
        if ($wasInView) {
            var $notInView = $wasInView.not($inView);
            $notInView.trigger('scrollout', [$notInView]);
        }
        $wasInView = $inView;
    }

    // "scrollin" custom filter
    $.expr[':']['scrollin'] = function (element) {
        var $element = $(element);
        /* make it work with hidden pagination
        if (!$element.is(':visible')) {
          return false;
        }
        */
        if (!$element) {
            return false;
        }
        var opts = $element.data(optionsAttribute);
        if (typeof opts === 'undefined') {
            return false;
        }
        var windowTop = $window.scrollTop();
        var windowLeft = $window.scrollLeft();
        var offset = $element.offset();
        var top = offset.top + extraOffsetTop;
        var left = offset.left + extraOffsetLeft;

        if (top + $element.height() >= windowTop &&
            top - ($element.data(opts.offsetTopAttribute) || opts.offsetTop) <= windowTop + $window.height() &&
            left + $element.width() >= windowLeft &&
            left - ($element.data(opts.offsetLeftAttribute) || opts.offsetLeft) <= windowLeft + $window.width()) {
            return true;
        } else {
            return false;
        }
    }

    $.fn.extend({
        // watching for element's presence in browser viewport
        scrolling: function (options) {
            var opts = $.extend({}, defaults, options || {});

            //Jquery < 3.0 shows a string as of $(<selector>) in 3.x it return JQuery object
            //so to get a selector as of 2.x 
            //https://stackoverflow.com/a/46078814
            // var selector = this.selector || this;
            var selector = this.getSelector();
            if (!selector) {
                return;
            }
            if (!checkBound) {
                checkBound = true;
                var onCheck = function () {
                    if (checkLock) {
                        return;
                    }
                    checkLock = true;
                    setTimeout(process, opts.interval);
                };
                $window = $(opts.window || window);

                if ($window.get(0) != top) {
                    var $b = $($window.get(0).document.body);
                    if ($b) {
                        extraOffsetTop = $b.scrollTop();
                        extraOffsetLeft = $b.scrollLeft();
                    }
                }

                $window.scroll(onCheck).resize(onCheck);
            }

            var $el = $(selector);
            $el.data(optionsAttribute, opts);

            if (opts.checkScrolling) {
                setTimeout(process, opts.interval);
            }
            selectors.push(selector);
            return $el;
        }
    });

    $.extend({
        // force "scroll-in" check for the given element
        checkScrolling: function () {
            if (checkBound) {
                process();
                return true;
            };
            return false;
        }
    });
})(jQuery);;
/**
 * @file
 * Behaviors for paragraph promotions.
 */
'use strict';
(function ($, Drupal) {
    Drupal.behaviors.jpgDataLayerParagraphPromotions = {
        attach(context, settings) {
            let visibleParagraphs = [];
            let paragraphs = $("[jpg-datalayer-paragraph-promotion-id]", context);

            $(paragraphs).each(function (i, el) {
                let promotionId = $(el).attr("jpg-datalayer-paragraph-promotion-id");
                $(el).find('div.field--type-link').each(function (index) {
                    $(this).find('a')
                        .once('click-processed')
                        .click(function () {
                            trackClickParagraphPromotion(promotionId);
                        });
                });
            });

            paragraphs.scrolling({
                checkScrolling: true
            });
            paragraphs.on('scrollin', function () {
                let promotionId = $(this).attr("jpg-datalayer-paragraph-promotion-id");
                if (!visibleParagraphs.includes(promotionId)) {
                    visibleParagraphs.push(promotionId);
                    trackParagraphPromotion(promotionId);
                }
            });
            paragraphs.on('scrollout', function () {
                let index = visibleParagraphs
                    .indexOf($(this).attr("jpg-datalayer-paragraph-promotion-id"));
                if (index >= 0) {
                    visibleParagraphs.splice(index, 1);
                }
            });

            /**
             * Found related data and track.
             *
             * @param promotionId
             *  Paragraph promotion analytic id.
             */
            function trackParagraphPromotion(promotionId) {
                let ecommerce = {};
                ecommerce.promoView = {};
                ecommerce.promoView.promotions = [];
                ecommerce.promoView.promotions.push(settings.paragraphPromotions[promotionId]);
            }

            /**
             * Found related data and track.
             *
             * @param promotionId
             *  Paragraph promotion analytic id.
             */
            function trackClickParagraphPromotion(promotionId) {
                let ecommerce = {};
                ecommerce.promoClick = {};
                ecommerce.promoClick.promotions = [];
                ecommerce.promoClick.promotions.push(settings.paragraphPromotions[promotionId]);
                track.promotionClick(ecommerce);
            }
        }
    };
})(jQuery, Drupal);;
/*! For license information please see franchise-scrolling.js.LICENSE.txt */
! function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
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
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function (t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 202)
}({
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
    11: function (e, t, n) {
        var r = n(3),
            o = n(148),
            i = n(150),
            l = Math.max,
            a = Math.min;
        e.exports = function (e, t, n) {
            var s, c, u, f, d, p, g = 0,
                h = !1,
                v = !1,
                m = !0;
            if ("function" != typeof e) throw new TypeError("Expected a function");

            function y(t) {
                var n = s,
                    r = c;
                return s = c = void 0, g = t, f = e.apply(r, n)
            }

            function w(e) {
                return g = e, d = setTimeout(b, t), h ? y(e) : f
            }

            function S(e) {
                var n = e - p;
                return void 0 === p || n >= t || n < 0 || v && e - g >= u
            }

            function b() {
                var e = o();
                if (S(e)) return E(e);
                d = setTimeout(b, function (e) {
                    var n = t - (e - p);
                    return v ? a(n, u - (e - g)) : n
                }(e))
            }

            function E(e) {
                return d = void 0, m && s ? y(e) : (s = c = void 0, f)
            }

            function R() {
                var e = o(),
                    n = S(e);
                if (s = arguments, c = this, p = e, n) {
                    if (void 0 === d) return w(p);
                    if (v) return clearTimeout(d), d = setTimeout(b, t), y(p)
                }
                return void 0 === d && (d = setTimeout(b, t)), f
            }
            return t = i(t) || 0, r(n) && (h = !!n.leading, u = (v = "maxWait" in n) ? l(i(n.maxWait) || 0, t) : u, m = "trailing" in n ? !!n.trailing : m), R.cancel = function () {
                void 0 !== d && clearTimeout(d), g = 0, s = p = c = d = void 0
            }, R.flush = function () {
                return void 0 === d ? f : E(o())
            }, R
        }
    },
    148: function (e, t, n) {
        var r = n(4);
        e.exports = function () {
            return r.Date.now()
        }
    },
    149: function (e, t, n) {
        (function (t) {
            var n = "object" == typeof t && t && t.Object === Object && t;
            e.exports = n
        }).call(this, n(1))
    },
    150: function (e, t, n) {
        var r = n(151),
            o = n(3),
            i = n(153),
            l = /^[-+]0x[0-9a-f]+$/i,
            a = /^0b[01]+$/i,
            s = /^0o[0-7]+$/i,
            c = parseInt;
        e.exports = function (e) {
            if ("number" == typeof e) return e;
            if (i(e)) return NaN;
            if (o(e)) {
                var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                e = o(t) ? t + "" : t
            }
            if ("string" != typeof e) return 0 === e ? e : +e;
            e = r(e);
            var n = a.test(e);
            return n || s.test(e) ? c(e.slice(2), n ? 2 : 8) : l.test(e) ? NaN : +e
        }
    },
    151: function (e, t, n) {
        var r = n(152),
            o = /^\s+/;
        e.exports = function (e) {
            return e ? e.slice(0, r(e) + 1).replace(o, "") : e
        }
    },
    152: function (e, t) {
        var n = /\s/;
        e.exports = function (e) {
            for (var t = e.length; t-- && n.test(e.charAt(t)););
            return t
        }
    },
    153: function (e, t, n) {
        var r = n(154),
            o = n(157);
        e.exports = function (e) {
            return "symbol" == typeof e || o(e) && "[object Symbol]" == r(e)
        }
    },
    154: function (e, t, n) {
        var r = n(5),
            o = n(155),
            i = n(156),
            l = r ? r.toStringTag : void 0;
        e.exports = function (e) {
            return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : l && l in Object(e) ? o(e) : i(e)
        }
    },
    155: function (e, t, n) {
        var r = n(5),
            o = Object.prototype,
            i = o.hasOwnProperty,
            l = o.toString,
            a = r ? r.toStringTag : void 0;
        e.exports = function (e) {
            var t = i.call(e, a),
                n = e[a];
            try {
                e[a] = void 0;
                var r = !0
            } catch (e) {}
            var o = l.call(e);
            return r && (t ? e[a] = n : delete e[a]), o
        }
    },
    156: function (e, t) {
        var n = Object.prototype.toString;
        e.exports = function (e) {
            return n.call(e)
        }
    },
    157: function (e, t) {
        e.exports = function (e) {
            return null != e && "object" == typeof e
        }
    },
    2: function (e, t, n) {
        var r, o;
        void 0 === (o = "function" == typeof (r = function () {
            "use strict";
            var e = function () {
                o.log(2, "(COMPATIBILITY NOTICE) -> As of ScrollMagic 2.0.0 you need to use 'new ScrollMagic.Controller()' to create a new controller instance. Use 'new ScrollMagic.Scene()' to instance a scene.")
            };
            e.version = "2.0.8", "undefined" != typeof window && window.addEventListener("mousewheel", void 0);
            var t = "data-scrollmagic-pin-spacer";
            e.Controller = function (r) {
                var i, l, a = "ScrollMagic.Controller",
                    s = "FORWARD",
                    c = "REVERSE",
                    u = "PAUSED",
                    f = n.defaults,
                    d = this,
                    p = o.extend({}, f, r),
                    g = [],
                    h = !1,
                    v = 0,
                    m = u,
                    y = !0,
                    w = 0,
                    S = !0,
                    b = function () {
                        for (var t in p) f.hasOwnProperty(t) || (L(2, 'WARNING: Unknown option "' + t + '"'), delete p[t]);
                        if (p.container = o.get.elements(p.container)[0], !p.container) throw L(1, "ERROR creating object " + a + ": No valid scroll container supplied"), a + " init failed.";
                        (y = p.container === window || p.container === document.body || !document.body.contains(p.container)) && (p.container = window), w = x(), p.container.addEventListener("resize", P), p.container.addEventListener("scroll", P);
                        var n = parseInt(p.refreshInterval, 10);
                        p.refreshInterval = o.type.Number(n) ? n : f.refreshInterval, E(), L(3, "added new " + a + " controller (v" + e.version + ")")
                    },
                    E = function () {
                        p.refreshInterval > 0 && (l = window.setTimeout(F, p.refreshInterval))
                    },
                    R = function () {
                        return p.vertical ? o.get.scrollTop(p.container) : o.get.scrollLeft(p.container)
                    },
                    x = function () {
                        return p.vertical ? o.get.height(p.container) : o.get.width(p.container)
                    },
                    T = this._setScrollPos = function (e) {
                        p.vertical ? y ? window.scrollTo(o.get.scrollLeft(), e) : p.container.scrollTop = e : y ? window.scrollTo(e, o.get.scrollTop()) : p.container.scrollLeft = e
                    },
                    O = function () {
                        if (S && h) {
                            var e = o.type.Array(h) ? h : g.slice(0);
                            h = !1;
                            var t = v,
                                n = (v = d.scrollPos()) - t;
                            0 !== n && (m = n > 0 ? s : c), m === c && e.reverse(), e.forEach((function (t, n) {
                                L(3, "updating Scene " + (n + 1) + "/" + e.length + " (" + g.length + " total)"), t.update(!0)
                            })), 0 === e.length && p.loglevel >= 3 && L(3, "updating 0 Scenes (nothing added to controller)")
                        }
                    },
                    C = function () {
                        i = o.rAF(O)
                    },
                    P = function (e) {
                        L(3, "event fired causing an update:", e.type), "resize" == e.type && (w = x(), m = u), !0 !== h && (h = !0, C())
                    },
                    F = function () {
                        if (!y && w != x()) {
                            var e;
                            try {
                                e = new Event("resize", {
                                    bubbles: !1,
                                    cancelable: !1
                                })
                            } catch (t) {
                                (e = document.createEvent("Event")).initEvent("resize", !1, !1)
                            }
                            p.container.dispatchEvent(e)
                        }
                        g.forEach((function (e, t) {
                            e.refresh()
                        })), E()
                    },
                    L = this._log = function (e, t) {
                        p.loglevel >= e && (Array.prototype.splice.call(arguments, 1, 0, "(" + a + ") ->"), o.log.apply(window, arguments))
                    };
                this._options = p;
                var _ = function (e) {
                    if (e.length <= 1) return e;
                    var t = e.slice(0);
                    return t.sort((function (e, t) {
                        return e.scrollOffset() > t.scrollOffset() ? 1 : -1
                    })), t
                };
                return this.addScene = function (t) {
                    if (o.type.Array(t)) t.forEach((function (e, t) {
                        d.addScene(e)
                    }));
                    else if (t instanceof e.Scene) {
                        if (t.controller() !== d) t.addTo(d);
                        else if (g.indexOf(t) < 0) {
                            for (var n in g.push(t), g = _(g), t.on("shift.controller_sort", (function () {
                                    g = _(g)
                                })), p.globalSceneOptions) t[n] && t[n].call(t, p.globalSceneOptions[n]);
                            L(3, "adding Scene (now " + g.length + " total)")
                        }
                    } else L(1, "ERROR: invalid argument supplied for '.addScene()'");
                    return d
                }, this.removeScene = function (e) {
                    if (o.type.Array(e)) e.forEach((function (e, t) {
                        d.removeScene(e)
                    }));
                    else {
                        var t = g.indexOf(e);
                        t > -1 && (e.off("shift.controller_sort"), g.splice(t, 1), L(3, "removing Scene (now " + g.length + " left)"), e.remove())
                    }
                    return d
                }, this.updateScene = function (t, n) {
                    return o.type.Array(t) ? t.forEach((function (e, t) {
                        d.updateScene(e, n)
                    })) : n ? t.update(!0) : !0 !== h && t instanceof e.Scene && (-1 == (h = h || []).indexOf(t) && h.push(t), h = _(h), C()), d
                }, this.update = function (e) {
                    return P({
                        type: "resize"
                    }), e && O(), d
                }, this.scrollTo = function (n, r) {
                    if (o.type.Number(n)) T.call(p.container, n, r);
                    else if (n instanceof e.Scene) n.controller() === d ? d.scrollTo(n.scrollOffset(), r) : L(2, "scrollTo(): The supplied scene does not belong to this controller. Scroll cancelled.", n);
                    else if (o.type.Function(n)) T = n;
                    else {
                        var i = o.get.elements(n)[0];
                        if (i) {
                            for (; i.parentNode.hasAttribute(t);) i = i.parentNode;
                            var l = p.vertical ? "top" : "left",
                                a = o.get.offset(p.container),
                                s = o.get.offset(i);
                            y || (a[l] -= d.scrollPos()), d.scrollTo(s[l] - a[l], r)
                        } else L(2, "scrollTo(): The supplied argument is invalid. Scroll cancelled.", n)
                    }
                    return d
                }, this.scrollPos = function (e) {
                    return arguments.length ? (o.type.Function(e) ? R = e : L(2, "Provided value for method 'scrollPos' is not a function. To change the current scroll position use 'scrollTo()'."), d) : R.call(d)
                }, this.info = function (e) {
                    var t = {
                        size: w,
                        vertical: p.vertical,
                        scrollPos: v,
                        scrollDirection: m,
                        container: p.container,
                        isDocument: y
                    };
                    return arguments.length ? void 0 !== t[e] ? t[e] : void L(1, 'ERROR: option "' + e + '" is not available') : t
                }, this.loglevel = function (e) {
                    return arguments.length ? (p.loglevel != e && (p.loglevel = e), d) : p.loglevel
                }, this.enabled = function (e) {
                    return arguments.length ? (S != e && (S = !!e, d.updateScene(g, !0)), d) : S
                }, this.destroy = function (e) {
                    window.clearTimeout(l);
                    for (var t = g.length; t--;) g[t].destroy(e);
                    return p.container.removeEventListener("resize", P), p.container.removeEventListener("scroll", P), o.cAF(i), L(3, "destroyed " + a + " (reset: " + (e ? "true" : "false") + ")"), null
                }, b(), d
            };
            var n = {
                defaults: {
                    container: window,
                    vertical: !0,
                    globalSceneOptions: {},
                    loglevel: 2,
                    refreshInterval: 100
                }
            };
            e.Controller.addOption = function (e, t) {
                n.defaults[e] = t
            }, e.Controller.extend = function (t) {
                var n = this;
                e.Controller = function () {
                    return n.apply(this, arguments), this.$super = o.extend({}, this), t.apply(this, arguments) || this
                }, o.extend(e.Controller, n), e.Controller.prototype = n.prototype, e.Controller.prototype.constructor = e.Controller
            }, e.Scene = function (n) {
                var i, l, a = "ScrollMagic.Scene",
                    s = "BEFORE",
                    c = "DURING",
                    u = "AFTER",
                    f = r.defaults,
                    d = this,
                    p = o.extend({}, f, n),
                    g = s,
                    h = 0,
                    v = {
                        start: 0,
                        end: 0
                    },
                    m = 0,
                    y = !0,
                    w = function () {
                        for (var e in p) f.hasOwnProperty(e) || (b(2, 'WARNING: Unknown option "' + e + '"'), delete p[e]);
                        for (var t in f) _(t);
                        F()
                    },
                    S = {};
                this.on = function (e, t) {
                    return o.type.Function(t) ? (e = e.trim().split(" ")).forEach((function (e) {
                        var n = e.split("."),
                            r = n[0],
                            o = n[1];
                        "*" != r && (S[r] || (S[r] = []), S[r].push({
                            namespace: o || "",
                            callback: t
                        }))
                    })) : b(1, "ERROR when calling '.on()': Supplied callback for '" + e + "' is not a valid function!"), d
                }, this.off = function (e, t) {
                    return e ? ((e = e.trim().split(" ")).forEach((function (e, n) {
                        var r = e.split("."),
                            o = r[0],
                            i = r[1] || "";
                        ("*" === o ? Object.keys(S) : [o]).forEach((function (e) {
                            for (var n = S[e] || [], r = n.length; r--;) {
                                var o = n[r];
                                !o || i !== o.namespace && "*" !== i || t && t != o.callback || n.splice(r, 1)
                            }
                            n.length || delete S[e]
                        }))
                    })), d) : (b(1, "ERROR: Invalid event name supplied."), d)
                }, this.trigger = function (t, n) {
                    if (t) {
                        var r = t.trim().split("."),
                            o = r[0],
                            i = r[1],
                            l = S[o];
                        b(3, "event fired:", o, n ? "->" : "", n || ""), l && l.forEach((function (t, r) {
                            i && i !== t.namespace || t.callback.call(d, new e.Event(o, t.namespace, d, n))
                        }))
                    } else b(1, "ERROR: Invalid event name supplied.");
                    return d
                }, d.on("change.internal", (function (e) {
                    "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? O() : "reverse" === e.what && d.update())
                })).on("shift.internal", (function (e) {
                    x(), d.update()
                }));
                var b = this._log = function (e, t) {
                    p.loglevel >= e && (Array.prototype.splice.call(arguments, 1, 0, "(" + a + ") ->"), o.log.apply(window, arguments))
                };
                this.addTo = function (t) {
                    return t instanceof e.Controller ? l != t && (l && l.removeScene(d), l = t, F(), T(!0), O(!0), x(), l.info("container").addEventListener("resize", C), t.addScene(d), d.trigger("add", {
                        controller: l
                    }), b(3, "added " + a + " to controller"), d.update()) : b(1, "ERROR: supplied argument of 'addTo()' is not a valid ScrollMagic Controller"), d
                }, this.enabled = function (e) {
                    return arguments.length ? (y != e && (y = !!e, d.update(!0)), d) : y
                }, this.remove = function () {
                    if (l) {
                        l.info("container").removeEventListener("resize", C);
                        var e = l;
                        l = void 0, e.removeScene(d), d.trigger("remove"), b(3, "removed " + a + " from controller")
                    }
                    return d
                }, this.destroy = function (e) {
                    return d.trigger("destroy", {
                        reset: e
                    }), d.remove(), d.off("*.*"), b(3, "destroyed " + a + " (reset: " + (e ? "true" : "false") + ")"), null
                }, this.update = function (e) {
                    if (l)
                        if (e)
                            if (l.enabled() && y) {
                                var t, n = l.info("scrollPos");
                                t = p.duration > 0 ? (n - v.start) / (v.end - v.start) : n >= v.start ? 1 : 0, d.trigger("update", {
                                    startPos: v.start,
                                    endPos: v.end,
                                    scrollPos: n
                                }), d.progress(t)
                            } else E && g === c && A(!0);
                    else l.updateScene(d, !1);
                    return d
                }, this.refresh = function () {
                    return T(), O(), d
                }, this.progress = function (e) {
                    if (arguments.length) {
                        var t = !1,
                            n = g,
                            r = l ? l.info("scrollDirection") : "PAUSED",
                            o = p.reverse || e >= h;
                        if (0 === p.duration ? (t = h != e, g = 0 == (h = e < 1 && o ? 0 : 1) ? s : c) : e < 0 && g !== s && o ? (h = 0, g = s, t = !0) : e >= 0 && e < 1 && o ? (h = e, g = c, t = !0) : e >= 1 && g !== u ? (h = 1, g = u, t = !0) : g !== c || o || A(), t) {
                            var i = {
                                    progress: h,
                                    state: g,
                                    scrollDirection: r
                                },
                                a = g != n,
                                f = function (e) {
                                    d.trigger(e, i)
                                };
                            a && n !== c && (f("enter"), f(n === s ? "start" : "end")), f("progress"), a && g !== c && (f(g === s ? "start" : "end"), f("leave"))
                        }
                        return d
                    }
                    return h
                };
                var E, R, x = function () {
                        v = {
                            start: m + p.offset
                        }, l && p.triggerElement && (v.start -= l.info("size") * p.triggerHook), v.end = v.start + p.duration
                    },
                    T = function (e) {
                        if (i) {
                            var t = "duration";
                            L(t, i.call(d)) && !e && (d.trigger("change", {
                                what: t,
                                newval: p[t]
                            }), d.trigger("shift", {
                                reason: t
                            }))
                        }
                    },
                    O = function (e) {
                        var n = 0,
                            r = p.triggerElement;
                        if (l && (r || m > 0)) {
                            if (r)
                                if (r.parentNode) {
                                    for (var i = l.info(), a = o.get.offset(i.container), s = i.vertical ? "top" : "left"; r.parentNode.hasAttribute(t);) r = r.parentNode;
                                    var c = o.get.offset(r);
                                    i.isDocument || (a[s] -= l.scrollPos()), n = c[s] - a[s]
                                } else b(2, "WARNING: triggerElement was removed from DOM and will be reset to", void 0), d.triggerElement(void 0);
                            var u = n != m;
                            m = n, u && !e && d.trigger("shift", {
                                reason: "triggerElementPosition"
                            })
                        }
                    },
                    C = function (e) {
                        p.triggerHook > 0 && d.trigger("shift", {
                            reason: "containerResize"
                        })
                    },
                    P = o.extend(r.validate, {
                        duration: function (e) {
                            if (o.type.String(e) && e.match(/^(\.|\d)*\d+%$/)) {
                                var t = parseFloat(e) / 100;
                                e = function () {
                                    return l ? l.info("size") * t : 0
                                }
                            }
                            if (o.type.Function(e)) {
                                i = e;
                                try {
                                    e = parseFloat(i.call(d))
                                } catch (t) {
                                    e = -1
                                }
                            }
                            if (e = parseFloat(e), !o.type.Number(e) || e < 0) throw i ? (i = void 0, ['Invalid return value of supplied function for option "duration":', e]) : ['Invalid value for option "duration":', e];
                            return e
                        }
                    }),
                    F = function (e) {
                        (e = arguments.length ? [e] : Object.keys(P)).forEach((function (e, t) {
                            var n;
                            if (P[e]) try {
                                n = P[e](p[e])
                            } catch (t) {
                                n = f[e];
                                var r = o.type.String(t) ? [t] : t;
                                o.type.Array(r) ? (r[0] = "ERROR: " + r[0], r.unshift(1), b.apply(this, r)) : b(1, "ERROR: Problem executing validation callback for option '" + e + "':", t.message)
                            } finally {
                                p[e] = n
                            }
                        }))
                    },
                    L = function (e, t) {
                        var n = !1,
                            r = p[e];
                        return p[e] != t && (p[e] = t, F(e), n = r != p[e]), n
                    },
                    _ = function (e) {
                        d[e] || (d[e] = function (t) {
                            return arguments.length ? ("duration" === e && (i = void 0), L(e, t) && (d.trigger("change", {
                                what: e,
                                newval: p[e]
                            }), r.shifts.indexOf(e) > -1 && d.trigger("shift", {
                                reason: e
                            })), d) : p[e]
                        })
                    };
                this.controller = function () {
                    return l
                }, this.state = function () {
                    return g
                }, this.scrollOffset = function () {
                    return v.start
                }, this.triggerPosition = function () {
                    var e = p.offset;
                    return l && (p.triggerElement ? e += m : e += l.info("size") * d.triggerHook()), e
                }, d.on("shift.internal", (function (e) {
                    var t = "duration" === e.reason;
                    (g === u && t || g === c && 0 === p.duration) && A(), t && z()
                })).on("progress.internal", (function (e) {
                    A()
                })).on("add.internal", (function (e) {
                    z()
                })).on("destroy.internal", (function (e) {
                    d.removePin(e.reset)
                }));
                var A = function (e) {
                        if (E && l) {
                            var t = l.info(),
                                n = R.spacer.firstChild;
                            if (e || g !== c) {
                                var r = {
                                        position: R.inFlow ? "relative" : "absolute",
                                        top: 0,
                                        left: 0
                                    },
                                    i = o.css(n, "position") != r.position;
                                R.pushFollowers ? p.duration > 0 && (g === u && 0 === parseFloat(o.css(R.spacer, "padding-top")) || g === s && 0 === parseFloat(o.css(R.spacer, "padding-bottom"))) && (i = !0) : r[t.vertical ? "top" : "left"] = p.duration * h, o.css(n, r), i && z()
                            } else {
                                "fixed" != o.css(n, "position") && (o.css(n, {
                                    position: "fixed"
                                }), z());
                                var a = o.get.offset(R.spacer, !0),
                                    f = p.reverse || 0 === p.duration ? t.scrollPos - v.start : Math.round(h * p.duration * 10) / 10;
                                a[t.vertical ? "top" : "left"] += f, o.css(R.spacer.firstChild, {
                                    top: a.top,
                                    left: a.left
                                })
                            }
                        }
                    },
                    z = function () {
                        if (E && l && R.inFlow) {
                            var e = g === c,
                                t = l.info("vertical"),
                                n = R.spacer.firstChild,
                                r = o.isMarginCollapseType(o.css(R.spacer, "display")),
                                i = {};
                            R.relSize.width || R.relSize.autoFullWidth ? e ? o.css(E, {
                                width: o.get.width(R.spacer)
                            }) : o.css(E, {
                                width: "100%"
                            }) : (i["min-width"] = o.get.width(t ? E : n, !0, !0), i.width = e ? i["min-width"] : "auto"), R.relSize.height ? e ? o.css(E, {
                                height: o.get.height(R.spacer) - (R.pushFollowers ? p.duration : 0)
                            }) : o.css(E, {
                                height: "100%"
                            }) : (i["min-height"] = o.get.height(t ? n : E, !0, !r), i.height = e ? i["min-height"] : "auto"), R.pushFollowers && (i["padding" + (t ? "Top" : "Left")] = p.duration * h, i["padding" + (t ? "Bottom" : "Right")] = p.duration * (1 - h)), o.css(R.spacer, i)
                        }
                    },
                    N = function () {
                        l && E && g === c && !l.info("isDocument") && A()
                    },
                    I = function () {
                        l && E && g === c && ((R.relSize.width || R.relSize.autoFullWidth) && o.get.width(window) != o.get.width(R.spacer.parentNode) || R.relSize.height && o.get.height(window) != o.get.height(R.spacer.parentNode)) && z()
                    },
                    M = function (e) {
                        l && E && g === c && !l.info("isDocument") && (e.preventDefault(), l._setScrollPos(l.info("scrollPos") - ((e.wheelDelta || e[l.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -e.detail)))
                    };
                this.setPin = function (e, n) {
                    var r = {
                            pushFollowers: !0,
                            spacerClass: "scrollmagic-pin-spacer"
                        },
                        i = n && n.hasOwnProperty("pushFollowers");
                    if (n = o.extend({}, r, n), !(e = o.get.elements(e)[0])) return b(1, "ERROR calling method 'setPin()': Invalid pin element supplied."), d;
                    if ("fixed" === o.css(e, "position")) return b(1, "ERROR calling method 'setPin()': Pin does not work with elements that are positioned 'fixed'."), d;
                    if (E) {
                        if (E === e) return d;
                        d.removePin()
                    }
                    var l = (E = e).parentNode.style.display,
                        a = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
                    E.parentNode.style.display = "none";
                    var s = "absolute" != o.css(E, "position"),
                        c = o.css(E, a.concat(["display"])),
                        u = o.css(E, ["width", "height"]);
                    E.parentNode.style.display = l, !s && n.pushFollowers && (b(2, "WARNING: If the pinned element is positioned absolutely pushFollowers will be disabled."), n.pushFollowers = !1), window.setTimeout((function () {
                        E && 0 === p.duration && i && n.pushFollowers && b(2, "WARNING: pushFollowers =", !0, "has no effect, when scene duration is 0.")
                    }), 0);
                    var f = E.parentNode.insertBefore(document.createElement("div"), E),
                        g = o.extend(c, {
                            position: s ? "relative" : "absolute",
                            boxSizing: "content-box",
                            mozBoxSizing: "content-box",
                            webkitBoxSizing: "content-box"
                        });
                    if (s || o.extend(g, o.css(E, ["width", "height"])), o.css(f, g), f.setAttribute(t, ""), o.addClass(f, n.spacerClass), R = {
                            spacer: f,
                            relSize: {
                                width: "%" === u.width.slice(-1),
                                height: "%" === u.height.slice(-1),
                                autoFullWidth: "auto" === u.width && s && o.isMarginCollapseType(c.display)
                            },
                            pushFollowers: n.pushFollowers,
                            inFlow: s
                        }, !E.___origStyle) {
                        E.___origStyle = {};
                        var h = E.style;
                        a.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]).forEach((function (e) {
                            E.___origStyle[e] = h[e] || ""
                        }))
                    }
                    return R.relSize.width && o.css(f, {
                        width: u.width
                    }), R.relSize.height && o.css(f, {
                        height: u.height
                    }), f.appendChild(E), o.css(E, {
                        position: s ? "relative" : "absolute",
                        margin: "auto",
                        top: "auto",
                        left: "auto",
                        bottom: "auto",
                        right: "auto"
                    }), (R.relSize.width || R.relSize.autoFullWidth) && o.css(E, {
                        boxSizing: "border-box",
                        mozBoxSizing: "border-box",
                        webkitBoxSizing: "border-box"
                    }), window.addEventListener("scroll", N), window.addEventListener("resize", N), window.addEventListener("resize", I), E.addEventListener("mousewheel", M), E.addEventListener("DOMMouseScroll", M), b(3, "added pin"), A(), d
                }, this.removePin = function (e) {
                    if (E) {
                        if (g === c && A(!0), e || !l) {
                            var n = R.spacer.firstChild;
                            if (n.hasAttribute(t)) {
                                var r = R.spacer.style,
                                    i = {};
                                ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"].forEach((function (e) {
                                    i[e] = r[e] || ""
                                })), o.css(n, i)
                            }
                            R.spacer.parentNode.insertBefore(n, R.spacer), R.spacer.parentNode.removeChild(R.spacer), E.parentNode.hasAttribute(t) || (o.css(E, E.___origStyle), delete E.___origStyle)
                        }
                        window.removeEventListener("scroll", N), window.removeEventListener("resize", N), window.removeEventListener("resize", I), E.removeEventListener("mousewheel", M), E.removeEventListener("DOMMouseScroll", M), E = void 0, b(3, "removed pin (reset: " + (e ? "true" : "false") + ")")
                    }
                    return d
                };
                var j, D = [];
                return d.on("destroy.internal", (function (e) {
                    d.removeClassToggle(e.reset)
                })), this.setClassToggle = function (e, t) {
                    var n = o.get.elements(e);
                    return 0 !== n.length && o.type.String(t) ? (D.length > 0 && d.removeClassToggle(), j = t, D = n, d.on("enter.internal_class leave.internal_class", (function (e) {
                        var t = "enter" === e.type ? o.addClass : o.removeClass;
                        D.forEach((function (e, n) {
                            t(e, j)
                        }))
                    })), d) : (b(1, "ERROR calling method 'setClassToggle()': Invalid " + (0 === n.length ? "element" : "classes") + " supplied."), d)
                }, this.removeClassToggle = function (e) {
                    return e && D.forEach((function (e, t) {
                        o.removeClass(e, j)
                    })), d.off("start.internal_class end.internal_class"), j = void 0, D = [], d
                }, w(), d
            };
            var r = {
                defaults: {
                    duration: 0,
                    offset: 0,
                    triggerElement: void 0,
                    triggerHook: .5,
                    reverse: !0,
                    loglevel: 2
                },
                validate: {
                    offset: function (e) {
                        if (e = parseFloat(e), !o.type.Number(e)) throw ['Invalid value for option "offset":', e];
                        return e
                    },
                    triggerElement: function (e) {
                        if (e = e || void 0) {
                            var t = o.get.elements(e)[0];
                            if (!t || !t.parentNode) throw ['Element defined in option "triggerElement" was not found:', e];
                            e = t
                        }
                        return e
                    },
                    triggerHook: function (e) {
                        var t = {
                            onCenter: .5,
                            onEnter: 1,
                            onLeave: 0
                        };
                        if (o.type.Number(e)) e = Math.max(0, Math.min(parseFloat(e), 1));
                        else {
                            if (!(e in t)) throw ['Invalid value for option "triggerHook": ', e];
                            e = t[e]
                        }
                        return e
                    },
                    reverse: function (e) {
                        return !!e
                    },
                    loglevel: function (e) {
                        if (e = parseInt(e), !o.type.Number(e) || e < 0 || e > 3) throw ['Invalid value for option "loglevel":', e];
                        return e
                    }
                },
                shifts: ["duration", "offset", "triggerHook"]
            };
            e.Scene.addOption = function (t, n, o, i) {
                t in r.defaults ? e._util.log(1, "[static] ScrollMagic.Scene -> Cannot add Scene option '" + t + "', because it already exists.") : (r.defaults[t] = n, r.validate[t] = o, i && r.shifts.push(t))
            }, e.Scene.extend = function (t) {
                var n = this;
                e.Scene = function () {
                    return n.apply(this, arguments), this.$super = o.extend({}, this), t.apply(this, arguments) || this
                }, o.extend(e.Scene, n), e.Scene.prototype = n.prototype, e.Scene.prototype.constructor = e.Scene
            }, e.Event = function (e, t, n, r) {
                for (var o in r = r || {}) this[o] = r[o];
                return this.type = e, this.target = this.currentTarget = n, this.namespace = t || "", this.timeStamp = this.timestamp = Date.now(), this
            };
            var o = e._util = function (e) {
                var t, n = {},
                    r = function (e) {
                        return parseFloat(e) || 0
                    },
                    o = function (t) {
                        return t.currentStyle ? t.currentStyle : e.getComputedStyle(t)
                    },
                    i = function (t, n, i, l) {
                        if ((n = n === document ? e : n) === e) l = !1;
                        else if (!g.DomElement(n)) return 0;
                        t = t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
                        var a = (i ? n["offset" + t] || n["outer" + t] : n["client" + t] || n["inner" + t]) || 0;
                        if (i && l) {
                            var s = o(n);
                            a += "Height" === t ? r(s.marginTop) + r(s.marginBottom) : r(s.marginLeft) + r(s.marginRight)
                        }
                        return a
                    },
                    l = function (e) {
                        return e.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, (function (e) {
                            return e[1].toUpperCase()
                        }))
                    };
                n.extend = function (e) {
                    for (e = e || {}, t = 1; t < arguments.length; t++)
                        if (arguments[t])
                            for (var n in arguments[t]) arguments[t].hasOwnProperty(n) && (e[n] = arguments[t][n]);
                    return e
                }, n.isMarginCollapseType = function (e) {
                    return ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e) > -1
                };
                var a = 0,
                    s = ["ms", "moz", "webkit", "o"],
                    c = e.requestAnimationFrame,
                    u = e.cancelAnimationFrame;
                for (t = 0; !c && t < s.length; ++t) c = e[s[t] + "RequestAnimationFrame"], u = e[s[t] + "CancelAnimationFrame"] || e[s[t] + "CancelRequestAnimationFrame"];
                c || (c = function (t) {
                    var n = (new Date).getTime(),
                        r = Math.max(0, 16 - (n - a)),
                        o = e.setTimeout((function () {
                            t(n + r)
                        }), r);
                    return a = n + r, o
                }), u || (u = function (t) {
                    e.clearTimeout(t)
                }), n.rAF = c.bind(e), n.cAF = u.bind(e);
                var f = ["error", "warn", "log"],
                    d = e.console || {};
                for (d.log = d.log || function () {}, t = 0; t < f.length; t++) {
                    var p = f[t];
                    d[p] || (d[p] = d.log)
                }
                n.log = function (e) {
                    (e > f.length || e <= 0) && (e = f.length);
                    var t = new Date,
                        n = ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2) + ":" + ("0" + t.getSeconds()).slice(-2) + ":" + ("00" + t.getMilliseconds()).slice(-3),
                        r = f[e - 1],
                        o = Array.prototype.splice.call(arguments, 1),
                        i = Function.prototype.bind.call(d[r], d);
                    o.unshift(n), i.apply(d, o)
                };
                var g = n.type = function (e) {
                    return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
                };
                g.String = function (e) {
                    return "string" === g(e)
                }, g.Function = function (e) {
                    return "function" === g(e)
                }, g.Array = function (e) {
                    return Array.isArray(e)
                }, g.Number = function (e) {
                    return !g.Array(e) && e - parseFloat(e) + 1 >= 0
                }, g.DomElement = function (e) {
                    return "object" == typeof HTMLElement || "function" == typeof HTMLElement ? e instanceof HTMLElement || e instanceof SVGElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
                };
                var h = n.get = {};
                return h.elements = function (t) {
                    var n = [];
                    if (g.String(t)) try {
                        t = document.querySelectorAll(t)
                    } catch (e) {
                        return n
                    }
                    if ("nodelist" === g(t) || g.Array(t) || t instanceof NodeList)
                        for (var r = 0, o = n.length = t.length; r < o; r++) {
                            var i = t[r];
                            n[r] = g.DomElement(i) ? i : h.elements(i)
                        } else(g.DomElement(t) || t === document || t === e) && (n = [t]);
                    return n
                }, h.scrollTop = function (t) {
                    return t && "number" == typeof t.scrollTop ? t.scrollTop : e.pageYOffset || 0
                }, h.scrollLeft = function (t) {
                    return t && "number" == typeof t.scrollLeft ? t.scrollLeft : e.pageXOffset || 0
                }, h.width = function (e, t, n) {
                    return i("width", e, t, n)
                }, h.height = function (e, t, n) {
                    return i("height", e, t, n)
                }, h.offset = function (e, t) {
                    var n = {
                        top: 0,
                        left: 0
                    };
                    if (e && e.getBoundingClientRect) {
                        var r = e.getBoundingClientRect();
                        n.top = r.top, n.left = r.left, t || (n.top += h.scrollTop(), n.left += h.scrollLeft())
                    }
                    return n
                }, n.addClass = function (e, t) {
                    t && (e.classList ? e.classList.add(t) : e.className += " " + t)
                }, n.removeClass = function (e, t) {
                    t && (e.classList ? e.classList.remove(t) : e.className = e.className.replace(new RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
                }, n.css = function (e, t) {
                    if (g.String(t)) return o(e)[l(t)];
                    if (g.Array(t)) {
                        var n = {},
                            r = o(e);
                        return t.forEach((function (e, t) {
                            n[e] = r[l(e)]
                        })), n
                    }
                    for (var i in t) {
                        var a = t[i];
                        a == parseFloat(a) && (a += "px"), e.style[l(i)] = a
                    }
                }, n
            }(window || {});
            return e.Scene.prototype.addIndicators = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling addIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this
            }, e.Scene.prototype.removeIndicators = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeIndicators() due to missing Plugin 'debug.addIndicators'. Please make sure to include plugins/debug.addIndicators.js"), this
            }, e.Scene.prototype.setTween = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this
            }, e.Scene.prototype.removeTween = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeTween() due to missing Plugin 'animation.gsap'. Please make sure to include plugins/animation.gsap.js"), this
            }, e.Scene.prototype.setVelocity = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling setVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this
            }, e.Scene.prototype.removeVelocity = function () {
                return e._util.log(1, "(ScrollMagic.Scene) -> ERROR calling removeVelocity() due to missing Plugin 'animation.velocity'. Please make sure to include plugins/animation.velocity.js"), this
            }, e
        }) ? r.call(t, n, t, e) : r) || (e.exports = o)
    },
    202: function (e, t, n) {
        "use strict";
        n.r(t);
        var r = n(2),
            o = n.n(r),
            i = n(11),
            l = n.n(i),
            a = function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    t = e.className,
                    n = void 0 === t ? "franchises-scrolling" : t,
                    r = e.context,
                    i = void 0 === r ? document : r,
                    a = function (e) {
                        var t = e.franchiseText,
                            n = e.franchiseImage,
                            r = e.scene,
                            o = e.isLastChild,
                            i = e.itemPaddingTop,
                            l = n.offsetHeight;
                        t.style.height = "".concat(l, "px"), r && (r.duration(o ? l : l + i), r.refresh())
                    };
                Array.prototype.forEach.call(i.querySelectorAll(".".concat(n, " .").concat(n, "__items")), (function (e) {
                    var t = null,
                        n = [],
                        r = function () {
                            var r = e.querySelectorAll(".franchises-scrolling__item"),
                                i = e.querySelector(".franchises-scrolling__item > .franchise"),
                                l = r.length,
                                s = "scene-start",
                                c = "scene-end",
                                u = parseFloat(window.getComputedStyle(i, null).getPropertyValue("padding-top"), 10);
                            n.length = 0, e.classList.remove(s), e.classList.remove(c), t = new o.a.Controller, Array.prototype.forEach.call(r, (function (r, i) {
                                var f = r.querySelector(".franchise__text-content"),
                                    d = r.querySelector(".franchise__image"),
                                    p = d.offsetHeight,
                                    g = 0 === i,
                                    h = i === l - 1;
                                f.style.height = "".concat(p, "px");
                                var v = new o.a.Scene({
                                    triggerElement: d,
                                    triggerHook: "onCenter",
                                    duration: h ? p : p + u
                                }).on("enter", (function (t) {
                                    "FORWARD" === t.scrollDirection && (e.classList.add(s), e.classList.remove(c)), h && "REVERSE" === t.scrollDirection && (e.classList.add(s), e.classList.remove(c))
                                })).on("leave", (function (t) {
                                    g && "REVERSE" === t.scrollDirection && e.classList.remove(s), h && "FORWARD" === t.scrollDirection && (e.classList.remove(s), e.classList.add(c))
                                })).setClassToggle(r, "active").addTo(t);
                                n.push({
                                    franchiseText: f,
                                    franchiseImage: d,
                                    scene: v,
                                    itemPaddingTop: u,
                                    isLastChild: h
                                }), a({
                                    franchiseText: f,
                                    franchiseImage: d,
                                    scene: v,
                                    itemPaddingTop: u,
                                    isLastChild: h
                                })
                            }))
                        };
                    ["load", "resize"].forEach((function (e) {
                        window.addEventListener(e, l()((function () {
                            window.matchMedia("(min-width: 1025px)").matches ? ("load" === e && r(), "resize" === e && (t ? n.forEach((function (e) {
                                return a(e)
                            })) : r())) : t && (n.forEach((function (e) {
                                e.franchiseText.removeAttribute("style")
                            })), t = t.destroy(!0))
                        }), 150))
                    }))
                }))
            };
        Drupal.behaviors.jpgFranchiseScrolling = {
            attach: function (e) {
                a({
                    context: e
                })
            }
        }
    },
    3: function (e, t) {
        e.exports = function (e) {
            var t = typeof e;
            return null != e && ("object" == t || "function" == t)
        }
    },
    4: function (e, t, n) {
        var r = n(149),
            o = "object" == typeof self && self && self.Object === Object && self,
            i = r || o || Function("return this")();
        e.exports = i
    },
    5: function (e, t, n) {
        var r = n(4).Symbol;
        e.exports = r
    }
});;
window.matchMedia || (window.matchMedia = function () {
    "use strict";
    var e = window.styleMedia || window.media;
    if (!e) {
        var t = document.createElement("style"),
            i = document.getElementsByTagName("script")[0],
            n = null;
        t.type = "text/css";
        t.id = "matchmediajs-test";
        i.parentNode.insertBefore(t, i);
        n = "getComputedStyle" in window && window.getComputedStyle(t, null) || t.currentStyle;
        e = {
            matchMedium: function (e) {
                var i = "@media " + e + "{ #matchmediajs-test { width: 1px; } }";
                if (t.styleSheet) {
                    t.styleSheet.cssText = i
                } else {
                    t.textContent = i
                }
                return n.width === "1px"
            }
        }
    }
    return function (t) {
        return {
            matches: e.matchMedium(t || "all"),
            media: t || "all"
        }
    }
}());;
/**
 * @file
 * Behaviors for paragraph promotions.
 */
'use strict';
(function ($, Drupal) {
    Drupal.behaviors.jpgDataLayerExternalEntityProducts = {
        attach: function (context, settings) {
            // Cart click.
            let productsCart = $("[jpg-datalayer-product-cart]", context);
            $(productsCart).each(function (i, el) {
                let trackType = 'cart';
                let productId = $(el).attr('jpg-datalayer-external-entity-id');
                // Exclude link to enrichment, and hidden link from event.
                let link = $(el).find('a.add-to-cart-button').not('.hidden');
                if (link.length) {
                    link.attr('product_id', productId);
                    $('html').once().delegate('.add-to-cart-button', 'click mousedown', function (event) {
                        productId = $(this).attr('product_id');
                        trackExternalProduct(productId, trackType, this);
                    });
                }
            });

            // Product click.
            $("[jpg-datalayer-product-click]").each(function (i, el) {
                let trackType = 'click';
                let productId = $(el).attr('jpg-datalayer-external-entity-id');
                // Click on link
                if ($(el).find('a').length) {
                    $(el).find('a').once('click-processed').click(function (e) {
                        trackExternalProduct(productId, trackType, this);
                    });
                }
                // Click on div
                // @todo Rewrite to link click when link is added to the view.
                // Paragraph products are rendered in view mode `Product tile`
                // without link at the moment.
                else {
                    $(el).once('click-processed').click(function (e) {
                        trackExternalProduct(productId, trackType, this);
                    });
                }
            });

            // Product scroll.
            let trackType = 'scroll';
            let products = $("[jpg-datalayer-product-impression]", context);
            let pushedProductImpressions = [];
            let tableOfProducts = [];
            let siteWideFired = false;
            let siteWideCheck = function () {
                (key) => {
                    if (key.event !== undefined &&
                        key.event === 'sitewide') {
                        siteWideFired = true;
                    }
                }
            };

            products.scrolling({
                checkScrolling: true
            });
            products.on('scrollin', function () {
                let el = this;
                let productId = $(this).attr("jpg-datalayer-external-entity-id");
                if (!pushedProductImpressions.includes(productId)) {
                    pushedProductImpressions.push(productId);
                    setTimeout(function check() {
                        if (!siteWideFired) {
                            siteWideCheck();
                            setTimeout(check, 500)
                        } else {
                            tableOfProducts.push(productId);

                            // Trigger productImpression event when a table is full or those products are last.
                            if (tableOfProducts.length === 5 || pushedProductImpressions.length === products.length) {
                                trackExternalProduct(productId, trackType, el, tableOfProducts);
                                tableOfProducts = [];
                            }
                        }
                    }, 500);
                }
            });

            // Trigger productImpression event when a user stops scrolling and in the table of the products exist items.
            let timer = null;
            $(window).scroll(function (e) {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    if (tableOfProducts.length) {
                        trackExternalProduct(tableOfProducts[0], trackType, '', tableOfProducts);
                        tableOfProducts = [];
                    }
                }, 2000);
            });

            // Internal search.
            let productImpressionFired = false;
            let productImpressionCheck = function () {
                (key) => {
                    if (key.event !== undefined &&
                        key.event === 'productImpression') {
                        productImpressionFired = true;
                    }
                }
            };

            if (products.length) {
                setTimeout(function check() {
                    if (!productImpressionFired) {
                        productImpressionCheck();
                        setTimeout(check, 500)
                    } else {
                        var searchInput = $('#edit-search-api-fulltext');
                        if (searchInput.length) {
                            // Get origin from path.
                            var baseUrl = drupalSettings.path.baseUrl;
                            var langCode = drupalSettings.path.currentLanguage;
                            var interaction = {};
                            interaction.search = {};
                            interaction.search.term = searchInput.val();
                            interaction.search.resultsNumber = products.length;
                            interaction.search.origin = baseUrl + langCode + '/';
                            // Search results view displays all items, so the count of pages
                            // always will be 1.
                            interaction.search.pageNumber = '1';
                            track.internalSearch(interaction);
                        }
                    }
                }, 500);
            }

            /**
             * Found related data and track.
             *
             * @param productId
             *  External product id.
             * @param trackType
             *  Track type.
             * @param el
             *  Node element.
             * @param products
             *  Products list for productImpression event.
             */
            function trackExternalProduct(productId, trackType, el, products = []) {
                settings.externalEntityProducts[productId].brand = 'jpg';
                settings.externalEntityProducts[productId].sampleType = 'discover kit';
                settings.externalEntityProducts[productId].list = settings.siteWide.type;
                let ecommerce = {};

                switch (trackType) {
                    case 'click':
                        ecommerce.productClick = {};
                        ecommerce.productClick.products = [];
                        ecommerce.productClick.products.push(settings.externalEntityProducts[productId]);
                        track.productClick(ecommerce);
                        break;
                    case 'scroll':
                        ecommerce.productImpression = {};
                        ecommerce.productImpression.products = [];
                        $(products).each(function (key, productId) {
                            // Clone product data not to overwrite for other events.
                            let productData = Object.assign({}, settings.externalEntityProducts[productId]);
                            productData.brand = 'jpg';
                            productData.sampleType = 'discover kit';
                            productData.list = settings.siteWide.type;

                            // Currency code.
                            let currencyCode = 'eur';
                            if (productData.currencyCode) {
                                currencyCode = productData.currencyCode;
                            }
                            ecommerce.currencyCode = currencyCode;

                            // Overwrite list property.
                            if (productData.list === 'pdp' &&
                                $(el).closest('[jpg-datalayer-product-wrapper-label]').length) {
                                let label = $(el).closest('[jpg-datalayer-product-wrapper-label]')
                                    .attr('jpg-datalayer-product-wrapper-label');
                                if (label) {
                                    productData.list = (productData.list + '/' + label).toLowerCase();
                                }
                            }

                            ecommerce.productImpression.products.push(productData);
                        });
                        track.productImpression(ecommerce);
                        break;
                    case 'pdp':
                        ecommerce.productDetail = {};
                        ecommerce.productDetail.products = [];
                        ecommerce.productDetail.products.push(settings.externalEntityProducts[productId]);
                        track.pdpView(ecommerce);
                        break;
                    case 'cart':
                        ecommerce.addToCart = {};
                        ecommerce.addToCart.products = [];
                        ecommerce.addToCart.products.push(settings.externalEntityProducts[productId]);
                        track.addToCart(ecommerce);
                        break;
                }
            }
        }
    }
})(jQuery, Drupal);;
! function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
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
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function (t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 201)
}({
    201: function (e, t, n) {
        "use strict";
        n.r(t);
        Drupal.behaviors.jpgEeProductTile = {
            attach: function (e) {
                ! function () {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        t = e.className,
                        n = void 0 === t ? "ee-product-tile" : t,
                        r = e.context,
                        o = void 0 === r ? document : r;
                    Array.prototype.forEach.call(o.querySelectorAll(".".concat(n, ":not(.js-").concat(n, ")")), (function (e) {
                        var t = e.querySelector(".ee-product-tile__discover-link");
                        t && e.addEventListener("click", (function () {
                            document.body.clientWidth < 1025 && t.click()
                        })), e.classList.add("js-".concat(n))
                    }))
                }({
                    context: e
                })
            }
        }
    }
});;
/*! For license information please see sliders.js.LICENSE.txt */
! function (t) {
    var e = {};

    function n(i) {
        if (e[i]) return e[i].exports;
        var o = e[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return t[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = t, n.c = e, n.d = function (t, e, i) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
        })
    }, n.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, n.t = function (t, e) {
        if (1 & e && (t = n(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t)
            for (var o in t) n.d(i, o, function (e) {
                return t[e]
            }.bind(null, o));
        return i
    }, n.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return n.d(e, "a", e), e
    }, n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "", n(n.s = 207)
}({
    13: function (t, e, n) {
        var i;
        self, i = function () {
            return (() => {
                "use strict";
                var t = {
                        311: (t, e, n) => {
                            n.r(e), n.d(e, {
                                default: () => It
                            });
                            var i = {};

                            function o() {
                                return (o = Object.assign || function (t) {
                                    for (var e = 1; e < arguments.length; e++) {
                                        var n = arguments[e];
                                        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
                                    }
                                    return t
                                }).apply(this, arguments)
                            }
                            n.r(i), n.d(i, {
                                CREATED: () => F,
                                DESTROYED: () => U,
                                IDLE: () => X,
                                MOUNTED: () => G,
                                MOVING: () => V
                            });
                            var r = Object.keys;

                            function a(t, e) {
                                r(t).some((function (n, i) {
                                    return e(t[n], n, i)
                                }))
                            }

                            function s(t) {
                                return r(t).map((function (e) {
                                    return t[e]
                                }))
                            }

                            function u(t) {
                                return "object" == typeof t
                            }

                            function c(t, e) {
                                var n = o({}, t);
                                return a(e, (function (t, e) {
                                    u(t) ? (u(n[e]) || (n[e] = {}), n[e] = c(n[e], t)) : n[e] = t
                                })), n
                            }

                            function d(t) {
                                return Array.isArray(t) ? t : [t]
                            }

                            function l(t, e, n) {
                                return Math.min(Math.max(t, e > n ? n : e), e > n ? e : n)
                            }

                            function f(t, e) {
                                var n = 0;
                                return t.replace(/%s/g, (function () {
                                    return d(e)[n++]
                                }))
                            }

                            function p(t) {
                                var e = typeof t;
                                return "number" === e && t > 0 ? parseFloat(t) + "px" : "string" === e ? t : ""
                            }

                            function g(t) {
                                return t < 10 ? "0" + t : t
                            }

                            function h(t, e) {
                                if ("string" == typeof e) {
                                    var n = b("div", {});
                                    _(n, {
                                        position: "absolute",
                                        width: e
                                    }), P(t, n), e = n.clientWidth, w(n)
                                }
                                return +e || 0
                            }

                            function v(t, e) {
                                return t ? t.querySelector(e.split(" ")[0]) : null
                            }

                            function m(t, e) {
                                return y(t, e)[0]
                            }

                            function y(t, e) {
                                return t ? s(t.children).filter((function (t) {
                                    return C(t, e.split(" ")[0]) || t.tagName === e
                                })) : []
                            }

                            function b(t, e) {
                                var n = document.createElement(t);
                                return a(e, (function (t, e) {
                                    return z(n, e, t)
                                })), n
                            }

                            function x(t) {
                                var e = b("div", {});
                                return e.innerHTML = t, e.firstChild
                            }

                            function w(t) {
                                d(t).forEach((function (t) {
                                    if (t) {
                                        var e = t.parentElement;
                                        e && e.removeChild(t)
                                    }
                                }))
                            }

                            function P(t, e) {
                                t && t.appendChild(e)
                            }

                            function k(t, e) {
                                if (t && e) {
                                    var n = e.parentElement;
                                    n && n.insertBefore(t, e)
                                }
                            }

                            function _(t, e) {
                                t && a(e, (function (e, n) {
                                    null !== e && (t.style[n] = e)
                                }))
                            }

                            function E(t, e, n) {
                                t && d(e).forEach((function (e) {
                                    e && t.classList[n ? "remove" : "add"](e)
                                }))
                            }

                            function S(t, e) {
                                E(t, e, !1)
                            }

                            function M(t, e) {
                                E(t, e, !0)
                            }

                            function C(t, e) {
                                return !!t && t.classList.contains(e)
                            }

                            function z(t, e, n) {
                                t && t.setAttribute(e, n)
                            }

                            function O(t, e) {
                                return t ? t.getAttribute(e) : ""
                            }

                            function I(t, e) {
                                d(e).forEach((function (e) {
                                    d(t).forEach((function (t) {
                                        return t && t.removeAttribute(e)
                                    }))
                                }))
                            }

                            function A(t) {
                                return t.getBoundingClientRect()
                            }
                            var T = "slide",
                                W = "loop",
                                j = "fade";
                            const L = function (t, e) {
                                    var n, i;
                                    return {
                                        mount: function () {
                                            n = e.Elements.list, t.on("transitionend", (function (t) {
                                                t.target === n && i && i()
                                            }), n)
                                        },
                                        start: function (o, r, a, s, u) {
                                            var c = t.options,
                                                d = e.Controller.edgeIndex,
                                                l = c.speed;
                                            i = u, t.is(T) && (0 === a && r >= d || a >= d && 0 === r) && (l = c.rewindSpeed || l), _(n, {
                                                transition: "transform " + l + "ms " + c.easing,
                                                transform: "translate(" + s.x + "px," + s.y + "px)"
                                            })
                                        }
                                    }
                                },
                                N = function (t, e) {
                                    function n(n) {
                                        var i = t.options;
                                        _(e.Elements.slides[n], {
                                            transition: "opacity " + i.speed + "ms " + i.easing
                                        })
                                    }
                                    return {
                                        mount: function () {
                                            n(t.index)
                                        },
                                        start: function (t, i, o, r, a) {
                                            var s = e.Elements.track;
                                            _(s, {
                                                height: p(s.clientHeight)
                                            }), n(i), setTimeout((function () {
                                                a(), _(s, {
                                                    height: ""
                                                })
                                            }))
                                        }
                                    }
                                };

                            function q(t) {
                                console.error("[SPLIDE] " + t)
                            }

                            function H(t, e) {
                                if (!t) throw new Error(e)
                            }
                            var D = "splide",
                                R = {
                                    active: "is-active",
                                    visible: "is-visible",
                                    loading: "is-loading"
                                },
                                B = {
                                    type: "slide",
                                    rewind: !1,
                                    speed: 400,
                                    rewindSpeed: 0,
                                    waitForTransition: !0,
                                    width: 0,
                                    height: 0,
                                    fixedWidth: 0,
                                    fixedHeight: 0,
                                    heightRatio: 0,
                                    autoWidth: !1,
                                    autoHeight: !1,
                                    perPage: 1,
                                    perMove: 0,
                                    clones: 0,
                                    start: 0,
                                    focus: !1,
                                    gap: 0,
                                    padding: 0,
                                    arrows: !0,
                                    arrowPath: "",
                                    pagination: !0,
                                    autoplay: !1,
                                    interval: 5e3,
                                    pauseOnHover: !0,
                                    pauseOnFocus: !0,
                                    resetProgress: !0,
                                    lazyLoad: !1,
                                    preloadPages: 1,
                                    easing: "cubic-bezier(.42,.65,.27,.99)",
                                    keyboard: "global",
                                    drag: !0,
                                    dragAngleThreshold: 30,
                                    swipeDistanceThreshold: 150,
                                    flickVelocityThreshold: .6,
                                    flickPower: 600,
                                    flickMaxPages: 1,
                                    direction: "ltr",
                                    cover: !1,
                                    accessibility: !0,
                                    slideFocus: !0,
                                    isNavigation: !1,
                                    trimSpace: !0,
                                    updateOnMove: !1,
                                    throttle: 100,
                                    destroy: !1,
                                    breakpoints: !1,
                                    classes: {
                                        root: D,
                                        slider: D + "__slider",
                                        track: D + "__track",
                                        list: D + "__list",
                                        slide: D + "__slide",
                                        container: D + "__slide__container",
                                        arrows: D + "__arrows",
                                        arrow: D + "__arrow",
                                        prev: D + "__arrow--prev",
                                        next: D + "__arrow--next",
                                        pagination: D + "__pagination",
                                        page: D + "__pagination__page",
                                        clone: D + "__slide--clone",
                                        progress: D + "__progress",
                                        bar: D + "__progress__bar",
                                        autoplay: D + "__autoplay",
                                        play: D + "__play",
                                        pause: D + "__pause",
                                        spinner: D + "__spinner",
                                        sr: D + "__sr"
                                    },
                                    i18n: {
                                        prev: "Previous slide",
                                        next: "Next slide",
                                        first: "Go to first slide",
                                        last: "Go to last slide",
                                        slideX: "Go to slide %s",
                                        pageX: "Go to page %s",
                                        play: "Start autoplay",
                                        pause: "Pause autoplay"
                                    }
                                },
                                F = 1,
                                G = 2,
                                X = 3,
                                V = 4,
                                U = 5;

                            function Y(t, e) {
                                for (var n = 0; n < e.length; n++) {
                                    var i = e[n];
                                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                                }
                            }
                            var J = function () {
                                function t(t, e, n) {
                                    var o;
                                    void 0 === e && (e = {}), void 0 === n && (n = {}), this.root = t instanceof Element ? t : document.querySelector(t), H(this.root, "An invalid element/selector was given."), this.Components = null, this.Event = function () {
                                        var t = [];

                                        function e(t) {
                                            t.elm && t.elm.removeEventListener(t.event, t.handler, t.options)
                                        }
                                        return {
                                            on: function (e, n, i, o) {
                                                void 0 === i && (i = null), void 0 === o && (o = {}), e.split(" ").forEach((function (e) {
                                                    i && i.addEventListener(e, n, o), t.push({
                                                        event: e,
                                                        handler: n,
                                                        elm: i,
                                                        options: o
                                                    })
                                                }))
                                            },
                                            off: function (n, i) {
                                                void 0 === i && (i = null), n.split(" ").forEach((function (n) {
                                                    t = t.filter((function (t) {
                                                        return !t || t.event !== n || t.elm !== i || (e(t), !1)
                                                    }))
                                                }))
                                            },
                                            emit: function (e) {
                                                for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                                                t.forEach((function (t) {
                                                    t.elm || t.event.split(".")[0] !== e || t.handler.apply(t, i)
                                                }))
                                            },
                                            destroy: function () {
                                                t.forEach(e), t = []
                                            }
                                        }
                                    }(), this.State = (o = F, {
                                        set: function (t) {
                                            o = t
                                        },
                                        is: function (t) {
                                            return t === o
                                        }
                                    }), this.STATES = i, this._o = c(B, e), this._i = 0, this._c = n, this._e = {}, this._t = null
                                }
                                var e, n, o, r = t.prototype;
                                return r.mount = function (t, e) {
                                    var n = this;
                                    void 0 === t && (t = this._e), void 0 === e && (e = this._t), this.State.set(F), this._e = t, this._t = e, this.Components = function (t, e, n) {
                                        var i = {};
                                        return a(e, (function (e, n) {
                                            i[n] = e(t, i, n.toLowerCase())
                                        })), n || (n = t.is(j) ? N : L), i.Transition = n(t, i), i
                                    }(this, c(this._c, t), e);
                                    try {
                                        a(this.Components, (function (t, e) {
                                            var i = t.required;
                                            void 0 === i || i ? t.mount && t.mount() : delete n.Components[e]
                                        }))
                                    } catch (t) {
                                        return void q(t.message)
                                    }
                                    var i = this.State;
                                    return i.set(G), a(this.Components, (function (t) {
                                        t.mounted && t.mounted()
                                    })), this.emit("mounted"), i.set(X), this.emit("ready"), _(this.root, {
                                        visibility: "visible"
                                    }), this.on("move drag", (function () {
                                        return i.set(V)
                                    })).on("moved dragged", (function () {
                                        return i.set(X)
                                    })), this
                                }, r.sync = function (t) {
                                    return this.sibling = t, this
                                }, r.on = function (t, e, n, i) {
                                    return void 0 === n && (n = null), void 0 === i && (i = {}), this.Event.on(t, e, n, i), this
                                }, r.off = function (t, e) {
                                    return void 0 === e && (e = null), this.Event.off(t, e), this
                                }, r.emit = function (t) {
                                    for (var e, n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                                    return (e = this.Event).emit.apply(e, [t].concat(i)), this
                                }, r.go = function (t, e) {
                                    return void 0 === e && (e = this.options.waitForTransition), (this.State.is(X) || this.State.is(V) && !e) && this.Components.Controller.go(t, !1), this
                                }, r.is = function (t) {
                                    return t === this._o.type
                                }, r.add = function (t, e) {
                                    return void 0 === e && (e = -1), this.Components.Elements.add(t, e, this.refresh.bind(this)), this
                                }, r.remove = function (t) {
                                    return this.Components.Elements.remove(t), this.refresh(), this
                                }, r.refresh = function () {
                                    return this.emit("refresh:before").emit("refresh").emit("resize"), this
                                }, r.destroy = function (t) {
                                    var e = this;
                                    if (void 0 === t && (t = !0), !this.State.is(F)) return s(this.Components).reverse().forEach((function (e) {
                                        e.destroy && e.destroy(t)
                                    })), this.emit("destroy", t), this.Event.destroy(), this.State.set(U), this;
                                    this.on("ready", (function () {
                                        return e.destroy(t)
                                    }))
                                }, e = t, (n = [{
                                    key: "index",
                                    get: function () {
                                        return this._i
                                    },
                                    set: function (t) {
                                        this._i = parseInt(t)
                                    }
                                }, {
                                    key: "length",
                                    get: function () {
                                        return this.Components.Elements.length
                                    }
                                }, {
                                    key: "options",
                                    get: function () {
                                        return this._o
                                    },
                                    set: function (t) {
                                        var e = this.State.is(F);
                                        e || this.emit("update"), this._o = c(this._o, t), e || this.emit("updated", this._o)
                                    }
                                }, {
                                    key: "classes",
                                    get: function () {
                                        return this._o.classes
                                    }
                                }, {
                                    key: "i18n",
                                    get: function () {
                                        return this._o.i18n
                                    }
                                }]) && Y(e.prototype, n), o && Y(e, o), t
                            }();
                            const K = function (t) {
                                var e = O(t.root, "data-splide");
                                if (e) try {
                                    t.options = JSON.parse(e)
                                } catch (t) {
                                    q(t.message)
                                }
                                return {
                                    mount: function () {
                                        t.State.is(F) && (t.index = t.options.start)
                                    }
                                }
                            };
                            var Q = "rtl",
                                Z = "ttb",
                                $ = "update.slide";
                            const tt = function (t, e) {
                                var n = t.root,
                                    i = t.classes,
                                    o = [];
                                if (!n.id) {
                                    window.splide = window.splide || {};
                                    var r = window.splide.uid || 0;
                                    window.splide.uid = ++r, n.id = "splide" + g(r)
                                }
                                var u = {
                                    mount: function () {
                                        var e = this;
                                        this.init(), t.on("refresh", (function () {
                                            e.destroy(), e.init()
                                        })).on("updated", (function () {
                                            M(n, c()), S(n, c())
                                        }))
                                    },
                                    destroy: function () {
                                        o.forEach((function (t) {
                                            t.destroy()
                                        })), o = [], M(n, c())
                                    },
                                    init: function () {
                                        var t = this;
                                        ! function () {
                                            u.slider = m(n, i.slider), u.track = v(n, "." + i.track), u.list = m(u.track, i.list), H(u.track && u.list, "Track or list was not found."), u.slides = y(u.list, i.slide);
                                            var t = d(i.arrows);
                                            u.arrows = {
                                                prev: v(t, "." + i.prev),
                                                next: v(t, "." + i.next)
                                            };
                                            var e = d(i.autoplay);
                                            u.bar = v(d(i.progress), "." + i.bar), u.play = v(e, "." + i.play), u.pause = v(e, "." + i.pause), u.track.id = u.track.id || n.id + "-track", u.list.id = u.list.id || n.id + "-list"
                                        }(), S(n, c()), this.slides.forEach((function (e, n) {
                                            t.register(e, n, -1)
                                        }))
                                    },
                                    register: function (e, n, i) {
                                        var r = function (t, e, n, i) {
                                            var o = t.options.updateOnMove,
                                                r = "ready.slide updated.slide resized.slide moved.slide" + (o ? " move.slide" : ""),
                                                a = {
                                                    slide: i,
                                                    index: e,
                                                    realIndex: n,
                                                    container: m(i, t.classes.container),
                                                    isClone: n > -1,
                                                    mount: function () {
                                                        var a = this;
                                                        this.isClone || (i.id = t.root.id + "-slide" + g(e + 1)), t.on(r, (function () {
                                                            return a.update()
                                                        })).on($, c).on("click", (function () {
                                                            return t.emit("click", a)
                                                        }), i), o && t.on("move.slide", (function (t) {
                                                            t === n && u(!0, !1)
                                                        })), _(i, {
                                                            display: ""
                                                        }), this.styles = O(i, "style") || ""
                                                    },
                                                    destroy: function () {
                                                        t.off(r).off($).off("click", i), M(i, s(R)), c(), I(this.container, "style")
                                                    },
                                                    update: function () {
                                                        u(this.isActive(), !1), u(this.isVisible(), !0)
                                                    },
                                                    isActive: function () {
                                                        return t.index === e
                                                    },
                                                    isVisible: function () {
                                                        var e = this.isActive();
                                                        if (t.is(j) || e) return e;
                                                        var n = Math.ceil,
                                                            o = A(t.Components.Elements.track),
                                                            r = A(i);
                                                        return t.options.direction === Z ? o.top <= r.top && r.bottom <= n(o.bottom) : o.left <= r.left && r.right <= n(o.right)
                                                    },
                                                    isWithin: function (n, i) {
                                                        var o = Math.abs(n - e);
                                                        return t.is(T) || this.isClone || (o = Math.min(o, t.length - o)), o < i
                                                    }
                                                };

                                            function u(e, n) {
                                                var o = n ? "visible" : "active",
                                                    r = R[o];
                                                e ? (S(i, r), t.emit("" + o, a)) : C(i, r) && (M(i, r), t.emit(n ? "hidden" : "inactive", a))
                                            }

                                            function c() {
                                                z(i, "style", a.styles)
                                            }
                                            return a
                                        }(t, n, i, e);
                                        r.mount(), o.push(r)
                                    },
                                    getSlide: function (t) {
                                        return o.filter((function (e) {
                                            return e.index === t
                                        }))[0]
                                    },
                                    getSlides: function (t) {
                                        return t ? o : o.filter((function (t) {
                                            return !t.isClone
                                        }))
                                    },
                                    getSlidesByPage: function (n) {
                                        var i = e.Controller.toIndex(n),
                                            r = t.options,
                                            a = !1 !== r.focus ? 1 : r.perPage;
                                        return o.filter((function (t) {
                                            var e = t.index;
                                            return i <= e && e < i + a
                                        }))
                                    },
                                    add: function (t, e, n) {
                                        if ("string" == typeof t && (t = x(t)), t instanceof Element) {
                                            var i = this.slides[e];
                                            _(t, {
                                                    display: "none"
                                                }), i ? (k(t, i), this.slides.splice(e, 0, t)) : (P(this.list, t), this.slides.push(t)),
                                                function (t, e) {
                                                    var n = t.querySelectorAll("img"),
                                                        i = n.length;
                                                    if (i) {
                                                        var o = 0;
                                                        a(n, (function (t) {
                                                            t.onload = t.onerror = function () {
                                                                ++o === i && e()
                                                            }
                                                        }))
                                                    } else e()
                                                }(t, (function () {
                                                    n && n(t)
                                                }))
                                        }
                                    },
                                    remove: function (t) {
                                        w(this.slides.splice(t, 1)[0])
                                    },
                                    each: function (t) {
                                        o.forEach(t)
                                    },
                                    get length() {
                                        return this.slides.length
                                    },
                                    get total() {
                                        return o.length
                                    }
                                };

                                function c() {
                                    var e = i.root,
                                        n = t.options;
                                    return [e + "--" + n.type, e + "--" + n.direction, n.drag ? e + "--draggable" : "", n.isNavigation ? e + "--nav" : "", R.active]
                                }

                                function d(t) {
                                    return m(n, t) || m(u.slider, t)
                                }
                                return u
                            };
                            var et = Math.floor;
                            const nt = function (t, e) {
                                var n, i, o = {
                                    mount: function () {
                                        n = t.options, i = t.is(W), t.on("move", (function (e) {
                                            t.index = e
                                        })).on("updated refresh", (function (e) {
                                            n = e || n, t.index = l(t.index, 0, o.edgeIndex)
                                        }))
                                    },
                                    go: function (t, n) {
                                        var i = this.trim(this.parse(t));
                                        e.Track.go(i, this.rewind(i), n)
                                    },
                                    parse: function (e) {
                                        var i = t.index,
                                            r = String(e).match(/([+\-<>]+)(\d+)?/),
                                            a = r ? r[1] : "",
                                            s = r ? parseInt(r[2]) : 0;
                                        switch (a) {
                                            case "+":
                                                i += s || 1;
                                                break;
                                            case "-":
                                                i -= s || 1;
                                                break;
                                            case ">":
                                            case "<":
                                                i = function (t, e, i) {
                                                    if (t > -1) return o.toIndex(t);
                                                    var r = n.perMove,
                                                        a = i ? -1 : 1;
                                                    return r ? e + r * a : o.toIndex(o.toPage(e) + a)
                                                }(s, i, "<" === a);
                                                break;
                                            default:
                                                i = parseInt(e)
                                        }
                                        return i
                                    },
                                    toIndex: function (e) {
                                        if (r()) return e;
                                        var i = t.length,
                                            o = n.perPage,
                                            a = e * o;
                                        return i - o <= (a -= (this.pageLength * o - i) * et(a / i)) && a < i && (a = i - o), a
                                    },
                                    toPage: function (e) {
                                        if (r()) return e;
                                        var i = t.length,
                                            o = n.perPage;
                                        return et(i - o <= e && e < i ? (i - 1) / o : e / o)
                                    },
                                    trim: function (t) {
                                        return i || (t = n.rewind ? this.rewind(t) : l(t, 0, this.edgeIndex)), t
                                    },
                                    rewind: function (t) {
                                        var e = this.edgeIndex;
                                        if (i) {
                                            for (; t > e;) t -= e + 1;
                                            for (; t < 0;) t += e + 1
                                        } else t > e ? t = 0 : t < 0 && (t = e);
                                        return t
                                    },
                                    isRtl: function () {
                                        return n.direction === Q
                                    },
                                    get pageLength() {
                                        var e = t.length;
                                        return r() ? e : Math.ceil(e / n.perPage)
                                    },
                                    get edgeIndex() {
                                        var e = t.length;
                                        return e ? r() || n.isNavigation || i ? e - 1 : e - n.perPage : 0
                                    },
                                    get prevIndex() {
                                        var e = t.index - 1;
                                        return (i || n.rewind) && (e = this.rewind(e)), e > -1 ? e : -1
                                    },
                                    get nextIndex() {
                                        var e = t.index + 1;
                                        return (i || n.rewind) && (e = this.rewind(e)), t.index < e && e <= this.edgeIndex || 0 === e ? e : -1
                                    }
                                };

                                function r() {
                                    return !1 !== n.focus
                                }
                                return o
                            };
                            var it = Math.abs;
                            const ot = function (t, e) {
                                    var n, i, o, r = t.options.direction === Z,
                                        a = t.is(j),
                                        s = t.options.direction === Q,
                                        u = !1,
                                        c = s ? 1 : -1,
                                        d = {
                                            sign: c,
                                            mount: function () {
                                                i = e.Elements, n = e.Layout, o = i.list
                                            },
                                            mounted: function () {
                                                var e = this;
                                                a || (this.jump(0), t.on("mounted resize updated", (function () {
                                                    e.jump(t.index)
                                                })))
                                            },
                                            go: function (n, i, o) {
                                                var r = p(n),
                                                    s = t.index;
                                                t.State.is(V) && u || (u = n !== i, o || t.emit("move", i, s, n), Math.abs(r - this.position) >= 1 || a ? e.Transition.start(n, i, s, this.toCoord(r), (function () {
                                                    f(n, i, s, o)
                                                })) : n !== s && "move" === t.options.trimSpace ? e.Controller.go(n + n - s, o) : f(n, i, s, o))
                                            },
                                            jump: function (t) {
                                                this.translate(p(t))
                                            },
                                            translate: function (t) {
                                                _(o, {
                                                    transform: "translate" + (r ? "Y" : "X") + "(" + t + "px)"
                                                })
                                            },
                                            cancel: function () {
                                                t.is(W) ? this.shift() : this.translate(this.position), _(o, {
                                                    transition: ""
                                                })
                                            },
                                            shift: function () {
                                                var e = it(this.position),
                                                    n = it(this.toPosition(0)),
                                                    i = it(this.toPosition(t.length)),
                                                    o = i - n;
                                                e < n ? e += o : e > i && (e -= o), this.translate(c * e)
                                            },
                                            trim: function (e) {
                                                return !t.options.trimSpace || t.is(W) ? e : l(e, c * (n.totalSize() - n.size - n.gap), 0)
                                            },
                                            toIndex: function (t) {
                                                var e = this,
                                                    n = 0,
                                                    o = 1 / 0;
                                                return i.getSlides(!0).forEach((function (i) {
                                                    var r = i.index,
                                                        a = it(e.toPosition(r) - t);
                                                    a < o && (o = a, n = r)
                                                })), n
                                            },
                                            toCoord: function (t) {
                                                return {
                                                    x: r ? 0 : t,
                                                    y: r ? t : 0
                                                }
                                            },
                                            toPosition: function (t) {
                                                var e = n.totalSize(t) - n.slideSize(t) - n.gap;
                                                return c * (e + this.offset(t))
                                            },
                                            offset: function (e) {
                                                var i = t.options.focus,
                                                    o = n.slideSize(e);
                                                return "center" === i ? -(n.size - o) / 2 : -(parseInt(i) || 0) * (o + n.gap)
                                            },
                                            get position() {
                                                var t = r ? "top" : s ? "right" : "left";
                                                return A(o)[t] - (A(i.track)[t] - n.padding[t] * c)
                                            }
                                        };

                                    function f(e, n, i, r) {
                                        _(o, {
                                            transition: ""
                                        }), u = !1, a || d.jump(n), r || t.emit("moved", n, i, e)
                                    }

                                    function p(t) {
                                        return d.trim(d.toPosition(t))
                                    }
                                    return d
                                },
                                rt = function (t, e) {
                                    var n = [],
                                        i = 0,
                                        o = e.Elements,
                                        r = {
                                            mount: function () {
                                                var e = this;
                                                t.is(W) && (a(), t.on("refresh:before", (function () {
                                                    e.destroy()
                                                })).on("refresh", a).on("resize", (function () {
                                                    i !== s() && (e.destroy(), t.refresh())
                                                })))
                                            },
                                            destroy: function () {
                                                w(n), n = []
                                            },
                                            get clones() {
                                                return n
                                            },
                                            get length() {
                                                return n.length
                                            }
                                        };

                                    function a() {
                                        r.destroy(),
                                            function (t) {
                                                var e = o.length,
                                                    i = o.register;
                                                if (e) {
                                                    for (var r = o.slides; r.length < t;) r = r.concat(r);
                                                    r.slice(0, t).forEach((function (t, r) {
                                                        var a = u(t);
                                                        P(o.list, a), n.push(a), i(a, r + e, r % e)
                                                    })), r.slice(-t).forEach((function (o, a) {
                                                        var s = u(o);
                                                        k(s, r[0]), n.push(s), i(s, a - t, (e + a - t % e) % e)
                                                    }))
                                                }
                                            }(i = s())
                                    }

                                    function s() {
                                        var e = t.options;
                                        if (e.clones) return e.clones;
                                        var n = e.autoWidth || e.autoHeight ? o.length : e.perPage,
                                            i = e.direction === Z ? "Height" : "Width",
                                            r = h(t.root, e["fixed" + i]);
                                        return r && (n = Math.ceil(o.track["client" + i] / r)), n * (e.drag ? e.flickMaxPages + 1 : 1)
                                    }

                                    function u(e) {
                                        var n = e.cloneNode(!0);
                                        return S(n, t.classes.clone), I(n, "id"), n
                                    }
                                    return r
                                };

                            function at(t, e) {
                                var n;
                                return function () {
                                    n || (n = setTimeout((function () {
                                        t(), n = null
                                    }), e))
                                }
                            }
                            const st = function (t, e) {
                                var n, i, o = e.Elements,
                                    a = t.options.direction === Z,
                                    s = (n = {
                                        mount: function () {
                                            t.on("resize load", at((function () {
                                                t.emit("resize")
                                            }), t.options.throttle), window).on("resize", c).on("updated refresh", u), u(), this.totalSize = a ? this.totalHeight : this.totalWidth, this.slideSize = a ? this.slideHeight : this.slideWidth
                                        },
                                        destroy: function () {
                                            I([o.list, o.track], "style")
                                        },
                                        get size() {
                                            return a ? this.height : this.width
                                        }
                                    }, i = a ? function (t, e) {
                                        var n, i, o = e.Elements,
                                            r = t.root;
                                        return {
                                            margin: "marginBottom",
                                            init: function () {
                                                this.resize()
                                            },
                                            resize: function () {
                                                i = t.options, n = o.track, this.gap = h(r, i.gap);
                                                var e = i.padding,
                                                    a = h(r, e.top || e),
                                                    s = h(r, e.bottom || e);
                                                this.padding = {
                                                    top: a,
                                                    bottom: s
                                                }, _(n, {
                                                    paddingTop: p(a),
                                                    paddingBottom: p(s)
                                                })
                                            },
                                            totalHeight: function (e) {
                                                void 0 === e && (e = t.length - 1);
                                                var n = o.getSlide(e);
                                                return n ? A(n.slide).bottom - A(o.list).top + this.gap : 0
                                            },
                                            slideWidth: function () {
                                                return h(r, i.fixedWidth || this.width)
                                            },
                                            slideHeight: function (t) {
                                                if (i.autoHeight) {
                                                    var e = o.getSlide(t);
                                                    return e ? e.slide.offsetHeight : 0
                                                }
                                                var n = i.fixedHeight || (this.height + this.gap) / i.perPage - this.gap;
                                                return h(r, n)
                                            },
                                            get width() {
                                                return n.clientWidth
                                            },
                                            get height() {
                                                var t = i.height || this.width * i.heightRatio;
                                                return H(t, '"height" or "heightRatio" is missing.'), h(r, t) - this.padding.top - this.padding.bottom
                                            }
                                        }
                                    }(t, e) : function (t, e) {
                                        var n, i = e.Elements,
                                            o = t.root,
                                            r = t.options;
                                        return {
                                            margin: "margin" + (r.direction === Q ? "Left" : "Right"),
                                            height: 0,
                                            init: function () {
                                                this.resize()
                                            },
                                            resize: function () {
                                                r = t.options, n = i.track, this.gap = h(o, r.gap);
                                                var e = r.padding,
                                                    a = h(o, e.left || e),
                                                    s = h(o, e.right || e);
                                                this.padding = {
                                                    left: a,
                                                    right: s
                                                }, _(n, {
                                                    paddingLeft: p(a),
                                                    paddingRight: p(s)
                                                })
                                            },
                                            totalWidth: function (e) {
                                                void 0 === e && (e = t.length - 1);
                                                var n = i.getSlide(e),
                                                    o = 0;
                                                if (n) {
                                                    var a = A(n.slide),
                                                        s = A(i.list);
                                                    o = r.direction === Q ? s.right - a.left : a.right - s.left, o += this.gap
                                                }
                                                return o
                                            },
                                            slideWidth: function (t) {
                                                if (r.autoWidth) {
                                                    var e = i.getSlide(t);
                                                    return e ? e.slide.offsetWidth : 0
                                                }
                                                var n = r.fixedWidth || (this.width + this.gap) / r.perPage - this.gap;
                                                return h(o, n)
                                            },
                                            slideHeight: function () {
                                                var t = r.height || r.fixedHeight || this.width * r.heightRatio;
                                                return h(o, t)
                                            },
                                            get width() {
                                                return n.clientWidth - this.padding.left - this.padding.right
                                            }
                                        }
                                    }(t, e), r(i).forEach((function (t) {
                                        n[t] || Object.defineProperty(n, t, Object.getOwnPropertyDescriptor(i, t))
                                    })), n);

                                function u() {
                                    s.init(), _(t.root, {
                                        maxWidth: p(t.options.width)
                                    }), o.each((function (t) {
                                        t.slide.style[s.margin] = p(s.gap)
                                    })), c()
                                }

                                function c() {
                                    var e = t.options;
                                    s.resize(), _(o.track, {
                                        height: p(s.height)
                                    });
                                    var n = e.autoHeight ? null : p(s.slideHeight());
                                    o.each((function (t) {
                                        _(t.container, {
                                            height: n
                                        }), _(t.slide, {
                                            width: e.autoWidth ? null : p(s.slideWidth(t.index)),
                                            height: t.container ? null : n
                                        })
                                    })), t.emit("resized")
                                }
                                return s
                            };
                            var ut = Math.abs;
                            const ct = function (t, e) {
                                    var n, i, o, r, s = e.Track,
                                        u = e.Controller,
                                        c = t.options.direction === Z,
                                        d = c ? "y" : "x",
                                        f = {
                                            disabled: !1,
                                            mount: function () {
                                                var n = this,
                                                    i = e.Elements,
                                                    o = i.track;
                                                t.on("touchstart mousedown", p, o).on("touchmove mousemove", h, o, {
                                                    passive: !1
                                                }).on("touchend touchcancel mouseleave mouseup dragend", v, o).on("mounted refresh", (function () {
                                                    a(i.list.querySelectorAll("img, a"), (function (e) {
                                                        t.off("dragstart", e).on("dragstart", (function (t) {
                                                            t.preventDefault()
                                                        }), e, {
                                                            passive: !1
                                                        })
                                                    }))
                                                })).on("mounted updated", (function () {
                                                    n.disabled = !t.options.drag
                                                }))
                                            }
                                        };

                                    function p(t) {
                                        f.disabled || r || g(t)
                                    }

                                    function g(t) {
                                        n = s.toCoord(s.position), i = m(t, {}), o = i
                                    }

                                    function h(e) {
                                        if (i)
                                            if (o = m(e, i), r) {
                                                if (e.cancelable && e.preventDefault(), !t.is(j)) {
                                                    var a = n[d] + o.offset[d];
                                                    s.translate(function (e) {
                                                        if (t.is(T)) {
                                                            var n = s.sign,
                                                                i = n * s.trim(s.toPosition(0)),
                                                                o = n * s.trim(s.toPosition(u.edgeIndex));
                                                            (e *= n) < i ? e = i - 7 * Math.log(i - e) : e > o && (e = o + 7 * Math.log(e - o)), e *= n
                                                        }
                                                        return e
                                                    }(a))
                                                }
                                            } else(function (e) {
                                                var n = e.offset;
                                                if (t.State.is(V) && t.options.waitForTransition) return !1;
                                                var i = 180 * Math.atan(ut(n.y) / ut(n.x)) / Math.PI;
                                                return c && (i = 90 - i), i < t.options.dragAngleThreshold
                                            })(o) && (t.emit("drag", i), r = !0, s.cancel(), g(e))
                                    }

                                    function v() {
                                        i = null, r && (t.emit("dragged", o), function (n) {
                                            var i = n.velocity[d],
                                                o = ut(i);
                                            if (o > 0) {
                                                var r = t.options,
                                                    a = t.index,
                                                    c = i < 0 ? -1 : 1,
                                                    f = a;
                                                if (!t.is(j)) {
                                                    var p = s.position;
                                                    o > r.flickVelocityThreshold && ut(n.offset[d]) < r.swipeDistanceThreshold && (p += c * Math.min(o * r.flickPower, e.Layout.size * (r.flickMaxPages || 1))), f = s.toIndex(p)
                                                }
                                                f === a && o > .1 && (f = a + c * s.sign), t.is(T) && (f = l(f, 0, u.edgeIndex)), u.go(f, r.isNavigation)
                                            }
                                        }(o), r = !1)
                                    }

                                    function m(t, e) {
                                        var n = t.timeStamp,
                                            i = t.touches,
                                            o = i ? i[0] : t,
                                            r = o.clientX,
                                            a = o.clientY,
                                            s = e.to || {},
                                            u = s.x,
                                            c = void 0 === u ? r : u,
                                            d = s.y,
                                            l = {
                                                x: r - c,
                                                y: a - (void 0 === d ? a : d)
                                            },
                                            f = n - (e.time || 0);
                                        return {
                                            to: {
                                                x: r,
                                                y: a
                                            },
                                            offset: l,
                                            time: n,
                                            velocity: {
                                                x: l.x / f,
                                                y: l.y / f
                                            }
                                        }
                                    }
                                    return f
                                },
                                dt = function (t, e) {
                                    var n = !1;

                                    function i(t) {
                                        n && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation())
                                    }
                                    return {
                                        required: t.options.drag,
                                        mount: function () {
                                            t.on("click", i, e.Elements.track, {
                                                capture: !0
                                            }).on("drag", (function () {
                                                n = !0
                                            })).on("dragged", (function () {
                                                setTimeout((function () {
                                                    n = !1
                                                }))
                                            }))
                                        }
                                    }
                                };
                            var lt = 1,
                                ft = 2,
                                pt = 3;
                            const gt = function (t, e, n) {
                                var i, o, r, a = t.classes,
                                    s = t.root,
                                    u = e.Elements;

                                function c() {
                                    var r = e.Controller,
                                        a = r.prevIndex,
                                        s = r.nextIndex,
                                        u = t.length > t.options.perPage || t.is(W);
                                    i.disabled = a < 0 || !u, o.disabled = s < 0 || !u, t.emit(n + ":updated", i, o, a, s)
                                }

                                function d(e) {
                                    return x('<button class="' + a.arrow + " " + (e ? a.prev : a.next) + '" type="button"><svg xmlns="http://www.w3.org/2000/svg"\tviewBox="0 0 40 40"\twidth="40"\theight="40"><path d="' + (t.options.arrowPath || "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") + '" />')
                                }
                                return {
                                    required: t.options.arrows,
                                    mount: function () {
                                        i = u.arrows.prev, o = u.arrows.next, i && o || !t.options.arrows || (i = d(!0), o = d(!1), r = !0, function () {
                                            var e = b("div", {
                                                class: a.arrows
                                            });
                                            P(e, i), P(e, o);
                                            var n = u.slider,
                                                r = "slider" === t.options.arrows && n ? n : s;
                                            k(e, r.firstElementChild)
                                        }()), i && o && t.on("click", (function () {
                                            t.go("<")
                                        }), i).on("click", (function () {
                                            t.go(">")
                                        }), o).on("mounted move updated refresh", c), this.arrows = {
                                            prev: i,
                                            next: o
                                        }
                                    },
                                    mounted: function () {
                                        t.emit(n + ":mounted", i, o)
                                    },
                                    destroy: function () {
                                        I([i, o], "disabled"), r && w(i.parentElement)
                                    }
                                }
                            };
                            var ht = "move.page",
                                vt = "updated.page refresh.page";
                            const mt = function (t, e, n) {
                                var i = {},
                                    o = e.Elements,
                                    r = {
                                        mount: function () {
                                            var e = t.options.pagination;
                                            if (e) {
                                                i = function () {
                                                    var e = t.options,
                                                        n = t.classes,
                                                        i = b("ul", {
                                                            class: n.pagination
                                                        }),
                                                        r = o.getSlides(!1).filter((function (t) {
                                                            return !1 !== e.focus || t.index % e.perPage == 0
                                                        })).map((function (e, r) {
                                                            var a = b("li", {}),
                                                                s = b("button", {
                                                                    class: n.page,
                                                                    type: "button"
                                                                });
                                                            return P(a, s), P(i, a), t.on("click", (function () {
                                                                t.go(">" + r)
                                                            }), s), {
                                                                li: a,
                                                                button: s,
                                                                page: r,
                                                                Slides: o.getSlidesByPage(r)
                                                            }
                                                        }));
                                                    return {
                                                        list: i,
                                                        items: r
                                                    }
                                                }();
                                                var n = o.slider;
                                                P("slider" === e && n ? n : t.root, i.list), t.on(ht, a)
                                            }
                                            t.off(vt).on(vt, (function () {
                                                r.destroy(), t.options.pagination && (r.mount(), r.mounted())
                                            }))
                                        },
                                        mounted: function () {
                                            if (t.options.pagination) {
                                                var e = t.index;
                                                t.emit(n + ":mounted", i, this.getItem(e)), a(e, -1)
                                            }
                                        },
                                        destroy: function () {
                                            w(i.list), i.items && i.items.forEach((function (e) {
                                                t.off("click", e.button)
                                            })), t.off(ht), i = {}
                                        },
                                        getItem: function (t) {
                                            return i.items[e.Controller.toPage(t)]
                                        },
                                        get data() {
                                            return i
                                        }
                                    };

                                function a(e, o) {
                                    var a = r.getItem(o),
                                        s = r.getItem(e),
                                        u = R.active;
                                    a && M(a.button, u), s && S(s.button, u), t.emit(n + ":updated", i, a, s)
                                }
                                return r
                            };
                            var yt = "data-splide-lazy",
                                bt = "data-splide-lazy-srcset",
                                xt = "aria-current",
                                wt = "aria-controls",
                                Pt = "aria-label",
                                kt = "aria-hidden",
                                _t = "tabindex",
                                Et = {
                                    ltr: {
                                        ArrowLeft: "<",
                                        ArrowRight: ">",
                                        Left: "<",
                                        Right: ">"
                                    },
                                    rtl: {
                                        ArrowLeft: ">",
                                        ArrowRight: "<",
                                        Left: ">",
                                        Right: "<"
                                    },
                                    ttb: {
                                        ArrowUp: "<",
                                        ArrowDown: ">",
                                        Up: "<",
                                        Down: ">"
                                    }
                                };
                            const St = function (t, e) {
                                var n = t.i18n,
                                    i = e.Elements,
                                    o = [kt, _t, wt, Pt, xt, "role"];

                                function r(e, n) {
                                    z(e, kt, !n), t.options.slideFocus && z(e, _t, n ? 0 : -1)
                                }

                                function a(t, e) {
                                    var n = i.track.id;
                                    z(t, wt, n), z(e, wt, n)
                                }

                                function s(e, i, o, r) {
                                    var a = t.index,
                                        s = o > -1 && a < o ? n.last : n.prev,
                                        u = r > -1 && a > r ? n.first : n.next;
                                    z(e, Pt, s), z(i, Pt, u)
                                }

                                function u(e, i) {
                                    i && z(i.button, xt, !0), e.items.forEach((function (e) {
                                        var i = t.options,
                                            o = f(!1 === i.focus && i.perPage > 1 ? n.pageX : n.slideX, e.page + 1),
                                            r = e.button,
                                            a = e.Slides.map((function (t) {
                                                return t.slide.id
                                            }));
                                        z(r, wt, a.join(" ")), z(r, Pt, o)
                                    }))
                                }

                                function c(t, e, n) {
                                    e && I(e.button, xt), n && z(n.button, xt, !0)
                                }

                                function d(t) {
                                    i.each((function (e) {
                                        var i = e.slide,
                                            o = e.realIndex;
                                        p(i) || z(i, "role", "button");
                                        var r = o > -1 ? o : e.index,
                                            a = f(n.slideX, r + 1),
                                            s = t.Components.Elements.getSlide(r);
                                        z(i, Pt, a), s && z(i, wt, s.slide.id)
                                    }))
                                }

                                function l(t, e) {
                                    var n = t.slide;
                                    e ? z(n, xt, !0) : I(n, xt)
                                }

                                function p(t) {
                                    return "BUTTON" === t.tagName
                                }
                                return {
                                    required: t.options.accessibility,
                                    mount: function () {
                                        t.on("visible", (function (t) {
                                            r(t.slide, !0)
                                        })).on("hidden", (function (t) {
                                            r(t.slide, !1)
                                        })).on("arrows:mounted", a).on("arrows:updated", s).on("pagination:mounted", u).on("pagination:updated", c).on("refresh", (function () {
                                            I(e.Clones.clones, o)
                                        })), t.options.isNavigation && t.on("navigation:mounted navigation:updated", d).on("active", (function (t) {
                                            l(t, !0)
                                        })).on("inactive", (function (t) {
                                            l(t, !1)
                                        })), ["play", "pause"].forEach((function (t) {
                                            var e = i[t];
                                            e && (p(e) || z(e, "role", "button"), z(e, wt, i.track.id), z(e, Pt, n[t]))
                                        }))
                                    },
                                    destroy: function () {
                                        var t = e.Arrows,
                                            n = t ? t.arrows : {};
                                        I(i.slides.concat([n.prev, n.next, i.play, i.pause]), o)
                                    }
                                }
                            };
                            var Mt = "move.sync",
                                Ct = "mouseup touchend",
                                zt = [" ", "Enter", "Spacebar"],
                                Ot = {
                                    Options: K,
                                    Breakpoints: function (t) {
                                        var e, n, i = t.options.breakpoints,
                                            o = at(a, 50),
                                            r = [];

                                        function a() {
                                            var o, a = (o = r.filter((function (t) {
                                                return t.mql.matches
                                            }))[0]) ? o.point : -1;
                                            if (a !== n) {
                                                n = a;
                                                var s = t.State,
                                                    u = i[a] || e,
                                                    c = u.destroy;
                                                c ? (t.options = e, t.destroy("completely" === c)) : (s.is(U) && t.mount(), t.options = u)
                                            }
                                        }
                                        return {
                                            required: i && matchMedia,
                                            mount: function () {
                                                r = Object.keys(i).sort((function (t, e) {
                                                    return +t - +e
                                                })).map((function (t) {
                                                    return {
                                                        point: t,
                                                        mql: matchMedia("(max-width:" + t + "px)")
                                                    }
                                                })), this.destroy(!0), addEventListener("resize", o), e = t.options, a()
                                            },
                                            destroy: function (t) {
                                                t && removeEventListener("resize", o)
                                            }
                                        }
                                    },
                                    Controller: nt,
                                    Elements: tt,
                                    Track: ot,
                                    Clones: rt,
                                    Layout: st,
                                    Drag: ct,
                                    Click: dt,
                                    Autoplay: function (t, e, n) {
                                        var i, o = [],
                                            r = e.Elements,
                                            a = {
                                                required: t.options.autoplay,
                                                mount: function () {
                                                    var e = t.options;
                                                    r.slides.length > e.perPage && (i = function (t, e, n) {
                                                        var i, o, r, a = window.requestAnimationFrame,
                                                            s = !0,
                                                            u = function u(c) {
                                                                s || (i || (i = c, r && r < 1 && (i -= r * e)), r = (o = c - i) / e, o >= e && (i = 0, r = 1, t()), n && n(r), a(u))
                                                            };
                                                        return {
                                                            pause: function () {
                                                                s = !0, i = 0
                                                            },
                                                            play: function (t) {
                                                                i = 0, t && (r = 0), s && (s = !1, a(u))
                                                            }
                                                        }
                                                    }((function () {
                                                        t.go(">")
                                                    }), e.interval, (function (e) {
                                                        t.emit(n + ":playing", e), r.bar && _(r.bar, {
                                                            width: 100 * e + "%"
                                                        })
                                                    })), function () {
                                                        var e = t.options,
                                                            n = t.sibling,
                                                            i = [t.root, n ? n.root : null];
                                                        e.pauseOnHover && (s(i, "mouseleave", lt, !0), s(i, "mouseenter", lt, !1)), e.pauseOnFocus && (s(i, "focusout", ft, !0), s(i, "focusin", ft, !1)), r.play && t.on("click", (function () {
                                                            a.play(ft), a.play(pt)
                                                        }), r.play), r.pause && s([r.pause], "click", pt, !1), t.on("move refresh", (function () {
                                                            a.play()
                                                        })).on("destroy", (function () {
                                                            a.pause()
                                                        }))
                                                    }(), this.play())
                                                },
                                                play: function (e) {
                                                    void 0 === e && (e = 0), (o = o.filter((function (t) {
                                                        return t !== e
                                                    }))).length || (t.emit(n + ":play"), i.play(t.options.resetProgress))
                                                },
                                                pause: function (e) {
                                                    void 0 === e && (e = 0), i.pause(), -1 === o.indexOf(e) && o.push(e), 1 === o.length && t.emit(n + ":pause")
                                                }
                                            };

                                        function s(e, n, i, o) {
                                            e.forEach((function (e) {
                                                t.on(n, (function () {
                                                    a[o ? "play" : "pause"](i)
                                                }), e)
                                            }))
                                        }
                                        return a
                                    },
                                    Cover: function (t, e) {
                                        function n(t) {
                                            e.Elements.each((function (e) {
                                                var n = m(e.slide, "IMG") || m(e.container, "IMG");
                                                n && n.src && i(n, t)
                                            }))
                                        }

                                        function i(t, e) {
                                            _(t.parentElement, {
                                                background: e ? "" : 'center/cover no-repeat url("' + t.src + '")'
                                            }), _(t, {
                                                display: e ? "" : "none"
                                            })
                                        }
                                        return {
                                            required: t.options.cover,
                                            mount: function () {
                                                t.on("lazyload:loaded", (function (t) {
                                                    i(t, !1)
                                                })), t.on("mounted updated refresh", (function () {
                                                    return n(!1)
                                                }))
                                            },
                                            destroy: function () {
                                                n(!0)
                                            }
                                        }
                                    },
                                    Arrows: gt,
                                    Pagination: mt,
                                    LazyLoad: function (t, e, n) {
                                        var i, o, r = t.options,
                                            s = "sequential" === r.lazyLoad;

                                        function u() {
                                            o = [], i = 0
                                        }

                                        function c(e) {
                                            e = isNaN(e) ? t.index : e, (o = o.filter((function (t) {
                                                return !t.Slide.isWithin(e, r.perPage * (r.preloadPages + 1)) || (d(t.img, t.Slide), !1)
                                            })))[0] || t.off("moved." + n)
                                        }

                                        function d(e, n) {
                                            S(n.slide, R.loading);
                                            var i = b("span", {
                                                class: t.classes.spinner
                                            });
                                            P(e.parentElement, i), e.onload = function () {
                                                f(e, i, n, !1)
                                            }, e.onerror = function () {
                                                f(e, i, n, !0)
                                            }, z(e, "srcset", O(e, bt) || ""), z(e, "src", O(e, yt) || "")
                                        }

                                        function l() {
                                            if (i < o.length) {
                                                var t = o[i];
                                                d(t.img, t.Slide)
                                            }
                                            i++
                                        }

                                        function f(e, i, o, r) {
                                            M(o.slide, R.loading), r || (w(i), _(e, {
                                                display: ""
                                            }), t.emit(n + ":loaded", e).emit("resize")), s && l()
                                        }
                                        return {
                                            required: r.lazyLoad,
                                            mount: function () {
                                                t.on("mounted refresh", (function () {
                                                    u(), e.Elements.each((function (t) {
                                                        a(t.slide.querySelectorAll("[data-splide-lazy], [" + bt + "]"), (function (e) {
                                                            e.src || e.srcset || (o.push({
                                                                img: e,
                                                                Slide: t
                                                            }), _(e, {
                                                                display: "none"
                                                            }))
                                                        }))
                                                    })), s && l()
                                                })), s || t.on("mounted refresh moved." + n, c)
                                            },
                                            destroy: u
                                        }
                                    },
                                    Keyboard: function (t) {
                                        var e;
                                        return {
                                            mount: function () {
                                                t.on("mounted updated", (function () {
                                                    var n = t.options,
                                                        i = t.root,
                                                        o = Et[n.direction],
                                                        r = n.keyboard;
                                                    e && (t.off("keydown", e), I(i, _t)), r && ("focused" === r ? (e = i, z(i, _t, 0)) : e = document, t.on("keydown", (function (e) {
                                                        o[e.key] && t.go(o[e.key])
                                                    }), e))
                                                }))
                                            }
                                        }
                                    },
                                    Sync: function (t) {
                                        var e = t.sibling,
                                            n = e && e.options.isNavigation;

                                        function i() {
                                            t.on(Mt, (function (t, n, i) {
                                                e.off(Mt).go(e.is(W) ? i : t, !1), o()
                                            }))
                                        }

                                        function o() {
                                            e.on(Mt, (function (e, n, o) {
                                                t.off(Mt).go(t.is(W) ? o : e, !1), i()
                                            }))
                                        }

                                        function r() {
                                            e.Components.Elements.each((function (e) {
                                                var n = e.slide,
                                                    i = e.index;
                                                t.off(Ct, n).on(Ct, (function (t) {
                                                    t.button && 0 !== t.button || a(i)
                                                }), n), t.off("keyup", n).on("keyup", (function (t) {
                                                    zt.indexOf(t.key) > -1 && (t.preventDefault(), a(i))
                                                }), n, {
                                                    passive: !1
                                                })
                                            }))
                                        }

                                        function a(n) {
                                            t.State.is(X) && e.go(n)
                                        }
                                        return {
                                            required: !!e,
                                            mount: function () {
                                                i(), o(), n && (r(), t.on("refresh", (function () {
                                                    setTimeout((function () {
                                                        r(), e.emit("navigation:updated", t)
                                                    }))
                                                })))
                                            },
                                            mounted: function () {
                                                n && e.emit("navigation:mounted", t)
                                            }
                                        }
                                    },
                                    A11y: St
                                },
                                It = function (t) {
                                    var e, n;

                                    function i(e, n) {
                                        return t.call(this, e, n, Ot) || this
                                    }
                                    return n = t, (e = i).prototype = Object.create(n.prototype), e.prototype.constructor = e, e.__proto__ = n, i
                                }(J)
                        }
                    },
                    e = {};

                function n(i) {
                    if (e[i]) return e[i].exports;
                    var o = e[i] = {
                        exports: {}
                    };
                    return t[i](o, o.exports, n), o.exports
                }
                return n.d = (t, e) => {
                    for (var i in e) n.o(e, i) && !n.o(t, i) && Object.defineProperty(t, i, {
                        enumerable: !0,
                        get: e[i]
                    })
                }, n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), n.r = t => {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                        value: "Module"
                    }), Object.defineProperty(t, "__esModule", {
                        value: !0
                    })
                }, n(311)
            })()
        }, t.exports = i()
    },
    207: function (t, e, n) {
        "use strict";
        n.r(e);
        var i = n(13),
            o = n.n(i),
            r = {
                type: "loop",
                fixedWidth: "44.9375rem",
                gap: 60,
                focus: "center",
                arrows: 0,
                pagination: 0,
                breakpoints: {
                    1199: {
                        fixedWidth: "30rem",
                        gap: 60
                    },
                    767: {
                        fixedWidth: "20rem",
                        gap: 30
                    },
                    480: {
                        fixedWidth: "18rem",
                        gap: 16
                    }
                }
            },
            a = function () {
                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    e = t.context,
                    n = void 0 === e ? document : e,
                    i = t.className,
                    a = void 0 === i ? "slider-default" : i,
                    s = t.classProcessed,
                    u = void 0 === s ? "js-splide-processed" : s,
                    c = t.options,
                    d = void 0 === c ? r : c;
                Array.prototype.forEach.call(n.querySelectorAll(".".concat(a, ":not(.").concat(u, ")")), (function (t) {
                    new o.a(t, d).mount(), t.classList.add(u)
                }))
            };
        Drupal.behaviors.jpgSliders = {
            attach: function (t) {
                a({
                    context: t
                }), a({
                    context: t,
                    className: "ee-product-pdp-images-slider",
                    options: {
                        pagination: 0,
                        arrows: 0
                    }
                }), a({
                    context: t,
                    className: "slider-complete-the-look-id",
                    options: {
                        destroy: !0,
                        breakpoints: {
                            767: {
                                gap: 50,
                                perPage: 2,
                                perMove: 1,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "2.5rem",
                                    right: "10rem"
                                }
                            },
                            639: {
                                gap: 50,
                                perPage: 1,
                                perMove: 1,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "2.5rem",
                                    right: "15rem"
                                }
                            },
                            479: {
                                gap: 50,
                                perPage: 1,
                                perMove: 1,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "2.5rem",
                                    right: "11.25rem"
                                }
                            },
                            420: {
                                gap: 50,
                                pagination: 0,
                                arrows: 0,
                                perPage: 1,
                                perMove: 1,
                                padding: {
                                    left: "2.5rem",
                                    right: "9rem"
                                }
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "comparison-slider.splide",
                    options: {
                        type: "loop",
                        pagination: 0
                    }
                }), a({
                    className: "big-product-slider",
                    options: {
                        type: "loop",
                        perPage: 5,
                        perMove: 5,
                        gap: 60,
                        focusAt: "center",
                        speed: 600,
                        pagination: 0,
                        padding: {
                            left: 120,
                            right: 120
                        },
                        breakpoints: {
                            1920: {
                                perPage: 4,
                                perMove: 4,
                                gap: 60,
                                padding: {
                                    left: 60,
                                    right: 60
                                }
                            },
                            1640: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            1439: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 0,
                                    right: 0
                                }
                            },
                            1279: {
                                perPage: 3,
                                perMove: 3,
                                gap: 30,
                                padding: {
                                    left: 0,
                                    right: 0
                                }
                            },
                            1199: {
                                perPage: 2,
                                perMove: 2,
                                gap: 30,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            1024: {
                                perPage: 2,
                                perMove: 2,
                                gap: 30,
                                padding: {
                                    left: 40,
                                    right: 40
                                }
                            },
                            767: {
                                perPage: 2,
                                perMove: 2,
                                gap: 30,
                                padding: {
                                    left: 0,
                                    right: 0
                                }
                            },
                            639: {
                                perPage: 1,
                                perMove: 1,
                                gap: 15,
                                padding: {
                                    left: 90,
                                    right: 90
                                }
                            },
                            479: {
                                perPage: 1,
                                perMove: 1,
                                gap: 15,
                                padding: {
                                    left: 30,
                                    right: 30
                                }
                            }
                        }
                    }
                }), a({
                    className: "big-product-slider-wide",
                    options: {
                        type: "loop",
                        perPage: 4,
                        perMove: 4,
                        gap: 60,
                        speed: 600,
                        pagination: 0,
                        padding: {
                            left: 120,
                            right: 120
                        },
                        breakpoints: {
                            2520: {
                                perPage: 4,
                                perMove: 4,
                                gap: 60,
                                padding: {
                                    left: 0,
                                    right: 0
                                }
                            },
                            2300: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 180,
                                    right: 180
                                }
                            },
                            2100: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            1920: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 60,
                                    right: 60
                                }
                            },
                            1860: {
                                perPage: 3,
                                perMove: 3,
                                gap: 60,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            1640: {
                                perPage: 2,
                                perMove: 2,
                                gap: 60,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            1400: {
                                perPage: 2,
                                perMove: 2,
                                gap: 60,
                                padding: {
                                    left: 60,
                                    right: 60
                                }
                            },
                            1200: {
                                perPage: 1,
                                perMove: 1,
                                gap: 30,
                                padding: {
                                    left: 240,
                                    right: 240
                                }
                            },
                            1024: {
                                perPage: 1,
                                perMove: 1,
                                gap: 30,
                                padding: {
                                    left: 180,
                                    right: 180
                                }
                            },
                            900: {
                                perPage: 1,
                                perMove: 1,
                                gap: 30,
                                padding: {
                                    left: 120,
                                    right: 120
                                }
                            },
                            768: {
                                perPage: 1,
                                perMove: 1,
                                gap: 30,
                                padding: {
                                    left: 60,
                                    right: 60
                                }
                            },
                            479: {
                                perPage: 1,
                                perMove: 1,
                                gap: 15,
                                padding: {
                                    left: 30,
                                    right: 30
                                }
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "more-videos-slider",
                    options: {
                        destroy: !0,
                        breakpoints: {
                            1024: {
                                gap: 60,
                                perPage: 3,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "1.875rem",
                                    right: "9rem"
                                }
                            },
                            767: {
                                gap: 16,
                                perPage: 2,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "1.875rem",
                                    right: "15rem"
                                }
                            },
                            479: {
                                gap: 16,
                                perPage: 1,
                                pagination: 0,
                                arrows: 0,
                                padding: {
                                    left: "1.875rem",
                                    right: "10rem"
                                }
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "product-tags-slider",
                    options: {
                        destroy: !0,
                        breakpoints: {
                            1024: {
                                perPage: 3,
                                arrows: 0
                            },
                            767: {
                                perPage: 2,
                                arrows: 0
                            },
                            479: {
                                perPage: 1,
                                arrows: 0
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "tryptich-zoom-view-default-slider",
                    options: {
                        destroy: !0,
                        breakpoints: {
                            1024: {
                                type: "loop",
                                fixedWidth: "30rem",
                                gap: 60,
                                arrows: 0,
                                pagination: 0,
                                focus: "center"
                            },
                            767: {
                                type: "loop",
                                fixedWidth: "20rem",
                                gap: 30,
                                arrows: 0,
                                pagination: 0,
                                focus: "center"
                            },
                            480: {
                                type: "loop",
                                fixedWidth: "18rem",
                                gap: 16,
                                arrows: 0,
                                pagination: 0,
                                focus: "center"
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "tryptique-zoom-view-slider",
                    options: {
                        fixedWidth: "41.67%",
                        fixedHeight: "87.78vh",
                        pagination: 0,
                        focus: "center",
                        start: 1,
                        padding: {
                            left: "7.5rem",
                            right: "7.5rem"
                        },
                        breakpoints: {
                            1199: {
                                fixedWidth: "85%",
                                padding: {
                                    left: "7.5rem",
                                    right: "7.5rem"
                                }
                            },
                            1024: {
                                fixedWidth: "85%",
                                padding: {
                                    left: "1rem",
                                    right: "1rem"
                                }
                            }
                        }
                    }
                }), a({
                    context: t,
                    className: "gwp-slider",
                    options: {
                        pagination: 0,
                        perPage: 2,
                        perMove: 2,
                        gap: "1.25rem",
                        breakpoints: {
                            767: {
                                perPage: 1,
                                perMove: 1,
                                gap: "3rem"
                            }
                        }
                    }
                })
            }
        }
    }
});;
/**
 * @file
 * JPG Modals. Popin.
 */

(function ($, Drupal, drupalSettings, cookies) {

    "use strict";

    Drupal.behaviors.jpgModalsPopin = {
        attach: function (context) {
            if (!drupalSettings.jpg_modals || !drupalSettings.jpg_modals.popin) {
                return;
            }

            var popinWidth = 0;

            $("#popin-wrapper", context)
                .once("jpg-modal-popin")
                .each(function () {
                    if (cookies.get('jpg_modal_already_closed_in_browser_session') !== undefined) {
                        return;
                    }

                    let $this = $(this);
                    $this
                        .find('form.join-newsletter-form')
                        .attr('data-acquisition-source', 'website_popup');

                    let cookieCount = 0;
                    if (cookies.get('jpg_modal_display_count_across_browser_sessions') !== undefined) {
                        cookieCount = cookies.get('jpg_modal_display_count_across_browser_sessions');
                    }

                    if (cookieCount >= drupalSettings.jpg_modals.popin.times_to_show) {
                        $this.addClass("hidden");
                        return;
                    } else {
                        ++cookieCount;
                        cookies.set(
                            'jpg_modal_display_count_across_browser_sessions',
                            cookieCount, {
                                expires: 365
                            }
                        );
                        $this.removeClass("hidden");
                    }

                    const popinContent = $(".popin-content", $this);

                    let popin = Drupal.dialog($this, {
                        title: null,
                        dialogClass: "popin-modal",
                        width: popinContent.outerWidth(),
                        height: "auto",
                        autoResize: true,
                        close: function (event) {},
                    });

                    $(".popin-content__close", popinContent).click(() => {
                        // If user already closed the Welcome popin during its session,
                        // the popin should not displayed anymore until the next session.
                        cookies.set('jpg_modal_already_closed_in_browser_session', 1);
                        $this.dialog("close");
                    });

                    popin.showModal();
                    popinWidth = popinContent.outerWidth();
                });

            $("li.menu-jpg-tools__item--envelope a, li.menu-jpg-navigation-mobile-footer__item--envelope a")
                .click(function () {
                    let $this = $("#popin-wrapper");
                    $this.removeClass("hidden");

                    let popinContent2 = $(".popin-content", $this);
                    if (popinWidth === 0) {
                        popinWidth = popinContent2.outerWidth();
                    }
                    let popin = Drupal.dialog($this, {
                        title: null,
                        dialogClass: "popin-modal",
                        width: popinWidth,
                        height: "auto",
                        autoResize: true,
                        close: function (event) {},
                    });
                    $(".popin-content__close", popinContent2).click(() => {
                        $this.dialog("close");
                    });
                    popin.showModal();
                    return false;
                });

        },
    };
})(jQuery, Drupal, drupalSettings, window.Cookies);;
! function (e) {
    var t = {};

    function r(o) {
        if (t[o]) return t[o].exports;
        var n = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    r.m = e, r.c = t, r.d = function (e, t, o) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
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
        var o = Object.create(null);
        if (r.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var n in e) r.d(o, n, function (t) {
                return e[t]
            }.bind(null, n));
        return o
    }, r.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 160)
}({
});;
! function (e) {
    var t = {};

    function n(o) {
        if (t[o]) return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
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
        var o = Object.create(null);
        if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(o, r, function (t) {
                return e[t]
            }.bind(null, r));
        return o
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 167)
}({
    0: function (e, t, n) {
        "use strict";
        n.d(t, "a", (function () {
            return p
        })), n.d(t, "b", (function () {
            return f
        }));
        var o = !1;
        if ("undefined" != typeof window) {
            var r = {
                get passive() {
                    o = !0
                }
            };
            window.addEventListener("testPassive", null, r), window.removeEventListener("testPassive", null, r)
        }
        var i = "undefined" != typeof window && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || "MacIntel" === window.navigator.platform && window.navigator.maxTouchPoints > 1),
            a = [],
            c = !1,
            l = -1,
            s = void 0,
            d = void 0,
            u = function (e) {
                return a.some((function (t) {
                    return !(!t.options.allowTouchMove || !t.options.allowTouchMove(e))
                }))
            },
            v = function (e) {
                var t = e || window.event;
                return !!u(t.target) || (t.touches.length > 1 || (t.preventDefault && t.preventDefault(), !1))
            },
            m = function () {
                void 0 !== d && (document.body.style.paddingRight = d, d = void 0), void 0 !== s && (document.body.style.overflow = s, s = void 0)
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
                        }(a), [n]), i ? (e.ontouchstart = function (e) {
                            1 === e.targetTouches.length && (l = e.targetTouches[0].clientY)
                        }, e.ontouchmove = function (t) {
                            1 === t.targetTouches.length && function (e, t) {
                                var n = e.targetTouches[0].clientY - l;
                                !u(e.target) && (t && 0 === t.scrollTop && n > 0 || function (e) {
                                    return !!e && e.scrollHeight - e.scrollTop <= e.clientHeight
                                }(t) && n < 0 ? v(e) : e.stopPropagation())
                            }(t, e)
                        }, c || (document.addEventListener("touchmove", v, o ? {
                            passive: !1
                        } : void 0), c = !0)) : function (e) {
                            if (void 0 === d) {
                                var t = !!e && !0 === e.reserveScrollBarGap,
                                    n = window.innerWidth - document.documentElement.clientWidth;
                                t && n > 0 && (d = document.body.style.paddingRight, document.body.style.paddingRight = n + "px")
                            }
                            void 0 === s && (s = document.body.style.overflow, document.body.style.overflow = "hidden")
                        }(t)
                    }
                } else console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.")
            },
            f = function (e) {
                e ? (a = a.filter((function (t) {
                    return t.targetElement !== e
                })), i ? (e.ontouchstart = null, e.ontouchmove = null, c && 0 === a.length && (document.removeEventListener("touchmove", v, o ? {
                    passive: !1
                } : void 0), c = !1)) : a.length || m()) : console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.")
            }
    },
    167: function (e, t, n) {
        "use strict";
        n.r(t);
        var o = n(0);
        Drupal.behaviors.jpgSideCart = {
            attach: function (e) {
                var t = e.querySelector(".site-template:not(.js-side-cart)"),
                    n = function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        e.sideCart.classList.contains("site-template__cart--active") && (e.siteTemplate.classList.remove("side-cart-opened"), e.sideCart.classList.remove("site-template__cart--active"), e.overlay.classList.remove("site-template__overlay--active"), Object(o.b)(e.sideCartContent))
                    };
                t && function () {
                    var e = t.querySelector(".menu-jpg-tools__link--case"),
                        r = t.querySelector(".site-template__cart-close"),
                        i = t.querySelectorAll(".site-template__nav-button"),
                        a = document.createElement("div");
                    a.className = "site-template__cart-overlay site-template__overlay", t.appendChild(a);
                    var c = t.querySelector(".site-template__cart"),
                        l = t.querySelector(".site-template__cart-content");
                    if (e && r && c && l && i.length) {
                        a.addEventListener("click", (function () {
                            n({
                                siteTemplate: t,
                                sideCart: c,
                                sideCartContent: l,
                                overlay: a
                            })
                        })), e.addEventListener("click", (function () {
                            c.classList.contains("site-template__cart--active") || (c.classList.add("site-template__cart--active"), Object(o.a)(l), a.classList.add("site-template__overlay--active"), t.classList.add("side-cart-opened"))
                        })), r.addEventListener("click", (function () {
                            n({
                                siteTemplate: t,
                                sideCart: c,
                                sideCartContent: l,
                                overlay: a
                            })
                        }));
                        for (var s = 0; s < i.length; s++) i[s].addEventListener("click", (function () {
                            if (t.classList.contains("side-cart-opened")) return n({
                                siteTemplate: t,
                                sideCart: c,
                                sideCartContent: l,
                                overlay: a
                            }), !1
                        }))
                    }
                    t.classList.add("js-side-cart")
                }(), "cart-form-wrapper-id" !== e.id || document.querySelector(".site-template__cart").classList.contains("site-template__cart--active") || document.querySelector(".menu-jpg-tools__link--case").click(), e.classList && e.classList.contains("jpg-empty-card") && document.querySelector(".site-template__cart").classList.contains("site-template__cart--active") && n({
                    siteTemplate: document.querySelector(".site-template"),
                    sideCart: document.querySelector(".site-template__cart"),
                    sideCartContent: document.querySelector(".site-template__cart-content"),
                    overlay: document.querySelector(".site-template__cart-overlay")
                })
            }
        }
    }
});;
! function (e) {
    var t = {};

    function a(n) {
        if (t[n]) return t[n].exports;
        var i = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(i.exports, i, i.exports, a), i.l = !0, i.exports
    }
    a.m = e, a.c = t, a.d = function (e, t, n) {
        a.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }, a.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, a.t = function (e, t) {
        if (1 & t && (e = a(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (a.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) a.d(n, i, function (t) {
                return e[t]
            }.bind(null, i));
        return n
    }, a.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return a.d(t, "a", t), t
    }, a.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, a.p = "", a(a.s = 165)
}({
    165: function (e, t) {
        Drupal.behaviors.jpgPageLoading = {
            attach: function (e) {
                var t = document.querySelector(".site-template__loading:not(.js-page-loading)"),
                    a = document.querySelector(".site-template__loading-bar:not(.js-page-loading)");
                t && a && (Array.prototype.forEach.call(e.querySelectorAll('a[href]:not([href*="mailto:"]):not([href*="tel:"]):not([href^="#"]):not(.use-ajax):not(.menu-jpg-tools__link--case):not(.js-page-loading), .entity-wrap-link-wrapper'), (function (e) {
                    e.addEventListener("click", (function () {
                        t.classList.remove("site-template__loading--step-2"), t.classList.remove("site-template__loading--step-3"), t.classList.add("site-template__loading--active"), t.classList.add("site-template__loading--step-1")
                    })), e.classList.add("js-page-loading")
                })), window.addEventListener("load", (function () {
                    t.classList.contains("site-template__loading--active") && t.classList.contains("site-template__loading--step-2") && (t.classList.remove("site-template__loading--step-2"), t.classList.add("site-template__loading--step-3"), setTimeout((function () {
                        t.classList.contains("site-template__loading--active") && t.classList.remove("site-template__loading--active")
                    }), 500), setTimeout((function () {
                        t.classList.contains("site-template__loading--step-3") && t.classList.remove("site-template__loading--step-3")
                    }), 1e3))
                })), t.classList.add("js-page-loading"), a.classList.add("js-page-loading"))
            }
        }
    }
});;
! function (e) {
    var t = {};

    function r(o) {
        if (t[o]) return t[o].exports;
        var n = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    r.m = e, r.c = t, r.d = function (e, t, o) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
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
        var o = Object.create(null);
        if (r.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var n in e) r.d(o, n, function (t) {
                return e[t]
            }.bind(null, n));
        return o
    }, r.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 170)
}({
    170: function (e, t) {
        Drupal.behaviors.jpgPageEventBlocker = {
            attach: function (e) {
                var t = e.querySelectorAll(".js-jpg-gwp-form .js-form-item");
                Array.prototype.forEach.call(t, (function (e) {
                    var t = null !== e.querySelector(".boolean[disabled]"),
                        r = e.querySelector(".cart-gift");
                    t ? r.classList.add("js-form-item-disabled") : r.classList.remove("js-form-item-disabled")
                }));
                var r = e.querySelectorAll("\n          .add-to-cart-links .add-to-cart-button:not(.js-page-event-blocker),\n          .block-jpg-cart-block .form-submit:not(.js-page-event-blocker),\n          .block-entity-formexternal-entity-cart .form-submit:not(.js-page-event-blocker),\n          .block-jpg-gwp .cart-gift:not(.js-page-event-blocker):not(.js-form-item-disabled),\n          .block-jpg-personalized-message-block .form-submit:not(.js-page-event-blocker)\n        "),
                    o = document.querySelector("body.page-event--blocked");
                o && o.classList.remove("page-event--blocked"), Array.prototype.forEach.call(r, (function (e) {
                    e.addEventListener("click", (function () {
                        e.classList.contains("js-form-item-disabled") || document.body.classList.add("page-event--blocked")
                    })), e.classList.add("js-page-event-blocker")
                }))
            }
        }
    }
});;
! function (t) {
    var e = {};

    function o(n) {
        if (e[n]) return e[n].exports;
        var i = e[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return t[n].call(i.exports, i, i.exports, o), i.l = !0, i.exports
    }
    o.m = t, o.c = e, o.d = function (t, e, n) {
        o.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: n
        })
    }, o.r = function (t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, o.t = function (t, e) {
        if (1 & e && (t = o(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (o.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t)
            for (var i in t) o.d(n, i, function (e) {
                return t[e]
            }.bind(null, i));
        return n
    }, o.n = function (t) {
        var e = t && t.__esModule ? function () {
            return t.default
        } : function () {
            return t
        };
        return o.d(e, "a", e), e
    }, o.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }, o.p = "", o(o.s = 205)
}({
    205: function (t, e, o) {
        "use strict";
        o.r(e);
        Drupal.behaviors.jpgGoBackButton = {
            attach: function (t) {
                ! function () {
                    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                        e = t.className,
                        o = void 0 === e ? "go-back-button" : e,
                        n = t.context,
                        i = (void 0 === n ? document : n).querySelector(".".concat(o, ":not(.js-").concat(o, ")"));
                    if (i) {
                        var s = 1e3;
                        ["load", "scroll"].forEach((function (t) {
                            window.addEventListener(t, (function () {
                                window.pageYOffset > s ? i.classList.add("".concat(o, "--visible")) : window.pageYOffset <= s && i.classList.contains("".concat(o, "--visible")) && i.classList.remove("".concat(o, "--visible"))
                            }))
                        })), i.addEventListener("click", (function () {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: "smooth"
                            })
                        })), i.classList.add("js-".concat(o))
                    }
                }({
                    context: t
                });
                var e = function (t, e) {
                        var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;
                        "resize" === o && t.classList.contains("sticky-finished") && (t.classList.remove("sticky-finished"), t.style.position = "", t.style.top = "", t.style.bottom = ""), window.pageYOffset + window.innerHeight > e.offsetTop && !t.classList.contains("sticky-finished") ? (t.style.position = "absolute", t.style.top = "".concat(e.offsetTop - t.offsetHeight - parseInt(window.getComputedStyle(t).getPropertyValue("right"), 10), "px"), t.style.bottom = "auto", t.classList.add("sticky-finished")) : window.pageYOffset + window.innerHeight <= e.offsetTop && t.classList.contains("sticky-finished") && (t.style.position = "", t.style.top = "", t.style.bottom = "", t.classList.remove("sticky-finished"))
                    },
                    o = document.querySelector(".go-back-button:not(.js-stop-scroll-go-back-button)"),
                    n = document.querySelector(".site-template__footer");
                o && n && (e(o, n), ["scroll", "resize"].forEach((function (t) {
                    window.addEventListener(t, (function () {
                        e(o, n, t)
                    }))
                })), o.classList.add("js-stop-scroll-go-back-button"))
            }
        }
    }
});;