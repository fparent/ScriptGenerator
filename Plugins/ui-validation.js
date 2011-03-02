/// <reference path="jquery/jquery-1.4.1-vsdoc.js" />

/*
Masked Input plugin for jQuery
Copyright (c) 2007-2009 Josh Bush (digitalbush.com)
Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) 
Version: 1.2.2 (03/09/2009 22:39:06)
*/
(function(c) { var a = (c.browser.msie ? "paste" : "input") + ".mask"; var b = (window.orientation != undefined); c.mask = { definitions: { "9": "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]"} }; c.fn.extend({ caret: function(f, d) { if (this.length == 0) { return } if (typeof f == "number") { d = (typeof d == "number") ? d : f; return this.each(function() { if (this.setSelectionRange) { this.focus(); this.setSelectionRange(f, d) } else { if (this.createTextRange) { var g = this.createTextRange(); g.collapse(true); g.moveEnd("character", d); g.moveStart("character", f); g.select() } } }) } else { if (this[0].setSelectionRange) { f = this[0].selectionStart; d = this[0].selectionEnd } else { if (document.selection && document.selection.createRange) { var e = document.selection.createRange(); f = 0 - e.duplicate().moveStart("character", -100000); d = f + e.text.length } } return { begin: f, end: d} } }, unmask: function() { return this.trigger("unmask") }, mask: function(f, j) { if (!f && this.length > 0) { var g = c(this[0]); var i = g.data("tests"); return c.map(g.data("buffer"), function(m, l) { return i[l] ? m : null }).join("") } j = c.extend({ placeholder: "_", completed: null }, j); var e = c.mask.definitions; var i = []; var k = f.length; var h = null; var d = f.length; c.each(f.split(""), function(l, m) { if (m == "?") { d--; k = l } else { if (e[m]) { i.push(new RegExp(e[m])); if (h == null) { h = i.length - 1 } } else { i.push(null) } } }); return this.each(function() { var u = c(this); var p = c.map(f.split(""), function(y, x) { if (y != "?") { return e[y] ? j.placeholder : y } }); var s = false; var w = u.val(); u.data("buffer", p).data("tests", i); function t(x) { while (++x <= d && !i[x]) { } return x } function o(z) { while (!i[z] && --z >= 0) { } for (var y = z; y < d; y++) { if (i[y]) { p[y] = j.placeholder; var x = t(y); if (x < d && i[y].test(p[x])) { p[y] = p[x] } else { break } } } r(); u.caret(Math.max(h, z)) } function l(B) { for (var z = B, A = j.placeholder; z < d; z++) { if (i[z]) { var x = t(z); var y = p[z]; p[z] = A; if (x < d && i[x].test(y)) { A = y } else { break } } } } function q(y) { var z = c(this).caret(); var x = y.keyCode; s = (x < 16 || (x > 16 && x < 32) || (x > 32 && x < 41)); if ((z.begin - z.end) != 0 && (!s || x == 8 || x == 46)) { m(z.begin, z.end) } if (x == 8 || x == 46 || (b && x == 127)) { o(z.begin + (x == 46 ? 0 : -1)); return false } else { if (x == 27) { u.val(w); u.caret(0, n()); return false } } } function v(A) { if (s) { s = false; return (A.keyCode == 8) ? false : null } A = A || window.event; var x = A.charCode || A.keyCode || A.which; var C = c(this).caret(); if (A.ctrlKey || A.altKey || A.metaKey) { return true } else { if ((x >= 32 && x <= 125) || x > 186) { var z = t(C.begin - 1); if (z < d) { var B = String.fromCharCode(x); if (i[z].test(B)) { l(z); p[z] = B; r(); var y = t(z); c(this).caret(y); if (j.completed && y == d) { j.completed.call(u) } } } } } return false } function m(z, x) { for (var y = z; y < x && y < d; y++) { if (i[y]) { p[y] = j.placeholder } } } function r() { return u.val(p.join("")).val() } function n(y) { var D = u.val(); var z = u.attr("title"); if (D == z) { return 0 } var C = -1; for (var x = 0, B = 0; x < d; x++) { if (i[x]) { p[x] = j.placeholder; while (B++ < D.length) { var A = D.charAt(B - 1); if (i[x].test(A)) { p[x] = A; C = x; break } } if (B > D.length) { break } } else { if (p[x] == D[B] && x != k) { B++; C = x } } } if (!y && C + 1 < k) { u.val(""); m(0, d) } else { if (y || C + 1 >= k) { r(); if (!y) { u.val(u.val().substring(0, C + 1)) } } } return (k ? x : h) } if (!u.attr("readonly")) { u.one("unmask", function() { u.unbind(".mask").removeData("buffer").removeData("tests") }).bind("focus.mask", function() { w = u.val(); var x = n(); r(); setTimeout(function() { if (x == f.length) { u.caret(0, x) } else { u.caret(x) } }, 0) }).bind("blur.mask", function() { n(); if (u.val() != w) { u.change() } }).bind("keydown.mask", q).bind("keypress.mask", v).bind(a, function() { setTimeout(function() { u.caret(n(true)) }, 0) }) } n() }) } }) })(jQuery);

(function($) {
    /*
    Function de validation
    */
    var Validate = {
        email: function(value) {
            /*
            http://en.wikipedia.org/wiki/E-mail_address
                
            The local-part of the e-mail address may use any of these ASCII characters:
            * Uppercase and lowercase English letters (a–z, A–Z)
            * Digits 0 to 9
            * Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
            * Character . (dot, period, full stop) provided that it is not the first or last character, and provided also that it does not appear two or more times consecutively
                
            */
            var pattern = /^(?!\.)(?:[-\w!#$%&'*+/=?^_`{|}~]|(?:\.(?!\.))){0,63}[-\w!#$%&'*+/=?^_`{|}~]@(?:[-\w]+\.)+\w{2,4}$/;
            return pattern.test(value);
            //return true;
        },
        postalCode: function(value) {
            var pattern = /^[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{1}[a-zA-Z]{1}\d{1}$/;
            return pattern.test(value);
        },
        zipCode: function(value) {
            var pattern = /^\d{5}$|^\d{5}-\d{4}$/;
            return pattern.test(value);
        },
        phoneNumber: function(value) {
            var pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})(\s[x]\d{1,4})?$/;
            return pattern.test(value);
        }
    };


    jQuery.fn.fieldOnError = function(isOnError) {

        if (isOnError === undefined)
            isOnError = true;

        this.each(function() {
            if (isOnError) {
                $(this).addClass('error');
                $(this).removeClass('field-validated');
            }
            else {
                $(this).removeClass('error');
                $(this).addClass('field-validated');
            }
        });
    }

    jQuery.fn.validate = function(options) {
        var settings = jQuery.extend({
            name: "ValidateUI",
            submit: false,
            /*jquery link who's gonna postback
            .NET specific*/
            postBackLink: null,
            /*when enter key is stroke, submit/postback the form*/
            submitOnEnter: true,
            //function to execute one the form is validated
            onSuccess: null,
            //function to execute when the form is in error
            onError: null,
            //show image on the right
            showImage: false,
            //put mask on fields
            mask: true,
            //put asterisk next to the label
            asterisk: true,
            //deactivate the form on first load
            formDisabled: true,
            //add tooltip on error
            tooltip: true,
            //default tooltip message
            tooltipMessage: {
                required:'',
                email: 'The email is invalid.',
                phone: 'The phone is invalid.',
                postalcode: 'The postal code is invalid.',
                zip: 'The zip code is invalid.',
                compare: 'The fields are not identical.'
            }
        }, options);


        this.each(function() {
            var $_form = $(this),
                _isPostBack = $(this).hasClass('ispostback');

            //put asterisk next to the label
            if (settings.asterisk) {
                var arrRequired = $_form.find('.required label');

                for (var i = 0; i < arrRequired.length; i++) {
                    var $el = $(arrRequired[i]),
                        $input = null;

                    if ($el.attr('for') != '')
                        $input = $('#' + $el.attr('for'));

                    if ($input == null || ($input != null && !$input.is(':radio')))
                        $el.prepend('<span class="form-asterisk">*</span>');

                }
            }

            if (settings.mask) {
                $('.postalcode input', $_form).mask('a9a9a9', { placeholder: "_" });
                $('.zip input', $_form).mask('99999?-9999', { placeholder: "_" });
                $('.phone input', $_form).mask('(999) 999-9999? x9999', { placeholder: "_" });

                $(":input", $_form).each(function(obj) {
                    if ($(this).attr('mask') != undefined)
                        $(this).mask($(this).attr('mask'));
                });
            }

            if (settings.formDisabled) {
                var arrLi = $_form.find('li');

                for (var i = 0; i < arrLi.length; i++) {
                    $(arrLi[i]).addClass('form-disabled');
                }

                settings.postBackLink.addClass('form-disabled');
            }

            var methods = {
                required: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.required');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var result = true,
                            $input = $el.find(':input'),
                            type = $input.attr('type');


                        switch (type) {
                            case 'checkbox':

                                if (!$input.is(':checked')) result = false;
                                break;

                            case 'radio':

                                if ($el.find(':checked').length == 0) result = false;
                                break;

                            case 'select-one':

                                if ($input.val() == "" || $input.val() == "0") result = false;
                                break;

                            case 'text':

                                if ($input.val() == "" || $input.val() == $input.attr('title')) result = false;
                                break;

                            case 'password':

                                if ($input.val() == "") result = false;
                                break;

                            case 'textarea':

                                if ($input.val() == "") result = false;
                                break;
                        }

                        $el.fieldOnError(!result);

                    }

                }, //end required
                email: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.email');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var $input = $el.find(':input');

                        if ((!$el.hasClass('required') && $input.val() != "") || $el.hasClass('required')) {

                            $el.fieldOnError(!Validate.email($input.val()));
                        }
                        else $el.removeClass('field-validated error');
                    }
                },
                phone: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.phone');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var $input = $el.find(':input');

                        if ((!$el.hasClass('required') && $input.val() != "") || $el.hasClass('required')) {
                            $el.fieldOnError(!Validate.phoneNumber($input.val()));
                        }
                        else $el.removeClass('field-validated error');
                    }

                },
                postalcode: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.postalcode');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var $input = $el.find(':input');

                        if ((!$el.hasClass('required') && $input.val() != "") || $el.hasClass('required')) {
                            $el.fieldOnError(!Validate.postalCode($input.val()));
                        }
                        else $el.removeClass('field-validated error');
                    }
                },
                zip: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.zip');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var $input = $el.find(':input');

                        if ((!$el.hasClass('required') && $input.val() != "") || $el.hasClass('required')) {
                            $el.fieldOnError(!Validate.zipCode($input.val()));
                        }
                        else $el.removeClass('field-validated error');
                    }
                },
                compare: function(elements) {

                    if (elements === undefined)
                        elements = $_form.find('.compare');

                    for (var i = 0; i < elements.length; i++) {

                        var $el = $(elements[i]);

                        var $input = $el.find(':input'),
                            $compareInput = $_form.find('#' + $input.attr('compare'));

                        if ((!$el.hasClass('required') && ($input.val() != "" || $compareInput.val() != "")) || $el.hasClass('required')) {
                            var hasError = ($input.val() != $compareInput.val() || $input.val() == '') ? true : false;

                            $el.fieldOnError(hasError);
                            $compareInput.closest('li').fieldOnError(hasError)
                        }
                        else $el.removeClass('field-validated error');
                    }
                }
            }; //end methods

            //add an image
            if (settings.showImage) {
                for (m in methods) {
                    var elements = $_form.find('.' + m);

                    for (var i = 0; i < elements.length; i++) {
                        var $el = $(elements[i]);

                        if ($el.has('.form-image').length == 0)
                            $el.append('<span class="form-image"></span>');
                    }
                }
            }

            //add tooltip
            if (settings.tooltip) {
                for (m in methods) {
                    var elements = $_form.find('.' + m);

                    for (var i = 0; i < elements.length; i++) {
                        var $el = $(elements[i]);
                        
                        if (settings.tooltipMessage[m] != '')
                            $el.append('<div class="form-tooltip"><div class="form-tt-arrow"></div>' + settings.tooltipMessage[m] + '</div>');
                    }
                }
            }

            //au focus/click "active" le champ
            //au blur, valide le champ
            $(':input', $_form).bind('focus click', function(e) {
                var enter = 13,
                    $li = $(this).closest('li'),
                    $input = $li.find(':input');

                if (e.which != enter) {
                    $li.removeClass('form-disabled');
                }

                //custom for PC
                //if($_form.find('.form-disabled').length == 0) {settings.postBackLink.parent().next().hide();}
            })
            .bind('keyup click blur', function(e) {

                var $li = $(this).closest('li');

                //détermine à quel moment le champ doit être validé (blur/keyup/click)
                //si <li> a la classe 'error' OU si <li> a la classe 'field-validated' et que l'event est différent de blur, valide
                //si l'event est blur, valide
                //si c'est le dernier champ à valider, valide
                if ((($li.hasClass('error') || $li.hasClass('field-validated')) && e.type != 'blur') || e.type == 'blur' || $li.next().length == 0) {

                    var tab = 9,
                        click = 1,
                        key = e.which;

                    if ((key != tab && key != click) || (e.which == click && ($(this).is('select') || $(this).is(':checkbox') || $(this).is(':radio')))) {
                        var $li = $(this).closest('li'),
                            classes = $li.attr('class').split(' ');

                        for (var i = 0; i < classes.length; i++) {
                            var cssClass = classes[i];

                            if (methods[cssClass] != undefined)
                                methods[cssClass]($li);
                        }

                        //check if the form is valid
                        var arrLi = $_form.find('li.required');
                        var formValid = true;
                        for (var i = 0; i < arrLi.length; i++) if (!$(arrLi[i]).hasClass('field-validated')) formValid = false;

                        if (formValid && $_form.find('li.error').length == 0) settings.postBackLink.removeClass('form-disabled');
                        else settings.postBackLink.addClass('form-disabled');
                    }
                }
            });


            //s'il y a des valeurs dans les input OU si c'est un postback, "active" le champ
            var inputs = $(':input', $_form);
            for (var i = 0; i < inputs.length; i++) {

                var $input = $(inputs[i]);

                if (($input.val() != '' && !$input.is(':checkbox')) || ($input.is(':checkbox') && $input.attr('checked')) || _isPostBack) {
                    $input.closest('li').removeClass('form-disabled');
                }
            }

            //au load, focus sur le premier champ
            $(this).find(':input:first').focus();

            //end

            var form = {
                validate: function() {
                    if (settings.postBackLink.hasClass('form-disabled')) return false;

                    var result;

                    //execute each function
                    for (m in methods) methods[m]();

                    $('.error:first :input').focus();

                    //form validé
                    if ($_form.find('.error').length == 0) {
                        if (settings.onSuccess) {
                            result = settings.onSuccess();
                            $_form.data('onSuccessResult', result);
                        }
                        else result = true;
                    }
                    //form avec erreur
                    else {
                        if (settings.onError) settings.onError();

                        result = false;
                    }

                    return result;

                }
            };

            //si c'est un postback, valide le formulaire
            if (_isPostBack) form.validate();

            //TODO : À VALIDER LE SUBMIT
            if (settings.submit) $_form.bind('submit', form.validate);
            else settings.postBackLink.click(form.validate);

            if (settings.submitOnEnter) {
                //add event on enter key
                $('input:text', $_form).keydown(function(e) {
                    var enter = 13;

                    if (e.which == enter) {
                        if (settings.submit) $_form.submit();
                        else {

                            settings.postBackLink.click();

                            var args = $(settings.postBackLink).getDoPostBackArgs();

                            //aucune erreur sur le form
                            if ($_form.find('.error').length == 0) {

                                if (settings.onSuccess && $_form.data('onSuccessResult'))
                                    __doPostBack(args.args0, args.args1);

                            }

                        }
                    }

                });
            }

        });

        return $(this);
    }


    jQuery.fn.getDoPostBackArgs = function() {
        var $link = $(this),
        href = $link.attr('href'),
        temp = "";


        if (href != '' && href.indexOf('doPostBack') != -1) {
            temp = href.split('(')[1];
            temp = temp.split(')')[0];
            temp = temp.split(',');
        }


        return { args0: temp[0].replace(/\'/g, ""), args1: temp[1].replace(/\'/g, "") };
    }
})(jQuery);