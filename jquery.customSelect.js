/*!
 * jquery.customSelect() - v0.6.1
 * https://github.com/Tyres91/jquery.customSelect
 * 2015-10-21
 *
 * Copyright 2015 Rocky Ory
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

(function ($) {
  'use strict';

  /** @namespace $.fn */
  $.fn.extend(
    {
      customSelect: function (options) {
        // filter out <= IE6
        if (typeof document.body.style.maxHeight === 'undefined') {
          return this;
        }

        var defaults = {
            customClass: 'customSelect',
            mapClass: true,
            mapStyle: true,
            onChange: function () {},
            onRender: function () {},
            onKeyUp: function () {},
            onMouseDown: function () {},
            onMouseUp: function () {},
            onFocus: function () {},
            onBlur: function () {},
            onMouseEnter: function () {},
            onMouseLeave: function () {}
          };

          if(options == 'destroy'){
            this.removeClass('hasCustomSelect').attr('style', '');
            this.next().remove();
            return this;
          }

          var options = $.extend( {}, defaults, options );

          var prefix = options.customClass,
          changed = function ($select, customSelectSpan) {
            var currentSelected = $select.find(':selected'),
              customSelectSpanInner = customSelectSpan.children(':first'),
              html = currentSelected.html() || '&nbsp;';

            customSelectSpanInner.html(html);

            if (currentSelected.attr('disabled')) {
              customSelectSpan.addClass(getClass('DisabledOption'));
            } else {
              customSelectSpan.removeClass(getClass('DisabledOption'));
            }

            setTimeout(
              function () {
                customSelectSpan.removeClass(getClass('Open'));
                $(document).off('mouseup.customSelect');
              }, 60
            );
          },
          getClass = function (suffix) {
            return prefix + suffix;
          };


        return this.each(
          function () {
            var $select = $(this),
              customSelectInnerSpan = $('<span />').addClass(getClass('Inner')),
              customSelectSpan = $('<span />');

            $select.after(customSelectSpan.append(customSelectInnerSpan));

            customSelectSpan.addClass(prefix);

            if (options.mapClass) {
              customSelectSpan.addClass($select.attr('class'));
            }
            if (options.mapStyle) {
              customSelectSpan.attr('style', $select.attr('style'));
            }

            $select
              .addClass('hasCustomSelect')
              .on(
              'render.customSelect', function () {
                changed($select, customSelectSpan);
                $select.css('width', '');
                var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                  (parseInt(customSelectSpan.outerWidth(), 10) -
                  parseInt(customSelectSpan.width(), 10));

                // Set to inline-block before calculating outerHeight
                customSelectSpan.css(
                  {
                    display: 'inline-block'
                  }
                );

                var selectBoxHeight = customSelectSpan.outerHeight();

                if ($select.attr('disabled')) {
                  customSelectSpan.addClass(getClass('Disabled'));
                } else {
                  customSelectSpan.removeClass(getClass('Disabled'));
                }

                customSelectInnerSpan.css(
                  {
                    width: selectBoxWidth,
                    display: 'inline-block'
                  }
                );

                $select.css(
                  {
                    '-webkit-appearance': 'menulist-button',
                    width: customSelectSpan.outerWidth(),
                    position: 'absolute',
                    opacity: 0,
                    height: selectBoxHeight,
                    fontSize: customSelectSpan.css('font-size')
                  }
                );
                options.onRender();
              }
            )
              .on(
              'change.customSelect', function () {
                customSelectSpan.addClass(getClass('Changed'));
                options.onChange();
                changed($select, customSelectSpan);
              }
            )
              .on(
              'keyup.customSelect', function (e) {
                if (!customSelectSpan.hasClass(getClass('Open'))) {
                  $select.trigger('blur.customSelect');
                  $select.trigger('focus.customSelect');
                } else {
                  if (e.which == 13 || e.which == 27) {
                    changed($select, customSelectSpan);
                  }
                }
                options.onKeyUp();
              }
            )
              .on(
              'mousedown.customSelect', function () {
                customSelectSpan.removeClass(getClass('Changed'));
                options.onMouseDown();
              }
            )
              .on(
              'mouseup.customSelect', function (e) {

                if (!customSelectSpan.hasClass(getClass('Open'))) {
                  // if FF and there are other selects open, just apply focus
                  if ($('.' + getClass('Open')).not(customSelectSpan).length > 0 && typeof InstallTrigger !== 'undefined') {
                    $select.trigger('focus.customSelect');
                  } else {
                    customSelectSpan.addClass(getClass('Open'));
                    e.stopPropagation();
                    $(document).one(
                      'mouseup.customSelect', function (e) {
                        if (e.target != $select.get(0) && $.inArray(e.target, $select.find('*').get()) < 0) {
                          $select.trigger('blur.customSelect');
                        } else {
                          changed($select, customSelectSpan);
                        }
                      }
                    );
                  }
                }
                options.onMouseUp();
              }
            )
              .on(
              'focus.customSelect', function () {
                customSelectSpan.removeClass(getClass('Changed')).addClass(getClass('Focus'));
                options.onFocus();
              }
            )
              .on(
              'blur.customSelect', function () {
                customSelectSpan.removeClass(getClass('Focus') + ' ' + getClass('Open'));
                options.onBlur();
              }
            )
              .on(
              'mouseenter.customSelect', function () {
                customSelectSpan.addClass(getClass('Hover'));
                options.onMouseEnter();
              }
            )
              .on(
              'mouseleave.customSelect', function () {
                customSelectSpan.removeClass(getClass('Hover'));
                options.onMouseLeave();
              }
            )
              .trigger('render.customSelect');
          }
        );
      },

    }
  );
})(jQuery);