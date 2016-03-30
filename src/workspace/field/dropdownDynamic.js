/*
 */
"use strict";

goog.provide("Entry.FieldDropdownDynamic");

goog.require("Entry.FieldDropdown");
/*
 *
 */
Entry.FieldDropdownDynamic = function(content, blockView, index) {
    this._block = blockView.block;
    this._blockView = blockView;

    var box = new Entry.BoxModel();
    this.box = box;

    this.svgGroup = null;

    this._contents = content;
    this._index = index;
    var options = [];
    if (Entry.container)
        options = Entry.container.getDropdownList(this._contents.menuName);

    this._contents.options = options;
    var value = this.getValue() ||
        options.length !== 0 ? options[0][1] : null;
    this.setValue(value);

    this._CONTENT_HEIGHT =
        content.dropdownHeight || blockView.getSkeleton().dropdownHeight || 16;

    this._FONT_SIZE =
        content.fontSize || blockView.getSkeleton().fontSize || 12;

    this._ROUND = content.roundValue || 0;
    this.renderStart(blockView);
};

Entry.Utils.inherit(Entry.FieldDropdown, Entry.FieldDropdownDynamic);

(function(p) {
    p.constructor = Entry.FieldDropDownDynamic;

    p.renderOptions = function() {
        var that = this;
        this.destroyOption();

        var blockView = this._block.view;

        this.documentDownEvent = Entry.documentMousedown.attach(
            this, function() {
                Entry.documentMousedown.detach(this.documentDownEvent);
                that.optionGroup.remove();
            }
        );

        this.optionGroup = Entry.Dom('ul', {
            class:'entry-widget-dropdown',
            parent: $('body')
        });

        var options = Entry.container.getDropdownList(this._contents.menuName);

        var OPTION_X_PADDING = 30;
        var maxWidth = 0;

        var CONTENT_HEIGHT = this._CONTENT_HEIGHT + 4;

        for (var i=0, len=options.length; i<len; i++) {
            var option = options[i];
            var text = option[0];
            var value = option[1];
            var element = Entry.Dom('li', {
                class: 'rect',
                parent: this.optionGroup
            });

            var str = '';
            if (this.getValue() == value) str += '\u2713  ';

            element.text(str += text);


            (function(elem, value) {
                //prevent propagation to document
                elem.mousedown(function(e) {
                    e.stopPropagation();
                });

                elem.mouseup(function(e){
                    e.stopPropagation();
                    that.applyValue(value);
                    that.destroyOption();
                    that._selectBlockView();
                });
            })(element, value);
        }


        var pos = this.getAbsolutePosFromDocument();
        pos.x += this.box.width/2 - this.optionGroup.width()/2;
        pos.y += this.box.height/2;

        this.optionGroup.css({left: pos.x, top: pos.y});
    };

})(Entry.FieldDropdownDynamic.prototype);
