/*
 *
 */
"use strict";

goog.provide("Entry.Board");

goog.require("Entry.Dom");
goog.require("Entry.Model");
goog.require("Entry.Utils");
goog.require("Entry.FieldBlock");
goog.require("Entry.Scroller");
goog.require("Entry.SVG");

/*
 *
 * @param {object} dom which to inject playground
 */
Entry.Board = function(option) {
    var dom = option.dom;
    if (typeof dom === "string")
        dom = $('#' + dom);
    else
        dom = $(dom);

    if (dom.prop("tagName") !== "DIV")
        return console.error("Dom is not div element");

    Entry.Model(this, false);

    this.view = dom;
    this._svgId = 'play' + new Date().getTime();

    this.workspace = option.workspace;

    this.wrapper = Entry.Dom('div', {
        parent: dom,
        class: 'entryBoardWrapper'
    });

    this.svgDom = Entry.Dom(
        $('<svg id="' + this._svgId + '" class="entryBoard" width="100%" height="100%"' +
          'version="1.1" xmlns="http://www.w3.org/2000/svg"></svg>'),
        { parent: this.wrapper }
    );

    this.visible = true;
    var that = this;
    this.svg = Entry.SVG(this._svgId);
    $(window).scroll(function() {
        that.updateOffset();
    });

    this._blockViews = [];
    this._magnetMap = null;

    this.svgGroup = this.svg.elem("g");

    this.svgThreadGroup = this.svgGroup.elem("g");
    this.svgThreadGroup.board = this;

    this.svgBlockGroup = this.svgGroup.elem("g");
    this.svgBlockGroup.board = this;

    if (option.isOverlay) {
        this.wrapper.addClass("entryOverlayBoard");
        this.generateButtons();
    }


    Entry.ANIMATION_DURATION = 200;
    Entry.BOARD_PADDING = 100;

    this.updateOffset();

    this.changeEvent = new Entry.Event(this);
    this.scroller = new Entry.Scroller(this, true, true);

    Entry.Utils.disableContextmenu(this.svgDom);

    this._addControl();
    if (Entry.documentMousedown)
        Entry.documentMousedown.attach(this, this.setSelectedBlock);
    if (Entry.keyPressed)
        Entry.keyPressed.attach(this, this._keyboardControl);
    if (Entry.windowResized)
        Entry.windowResized.attach(this, this.updateOffset);

    this.observe(this, "generateCodeMagnetMap", ["dragBlock"], false);
};

(function(p) {
    p.schema = {
        code: null,
        dragBlock: null,
        magnetedBlockView: null,
        selectedBlockView: null
    };

    p.changeCode = function(code) {
        if (this.codeListener)
            this.code.changeEvent.detach(this.codeListener);
        this.set({code: code});
        var that = this;
        this.codeListener = this.code.changeEvent.attach(
            this,
            function() {that.changeEvent.notify();}
        );
        code.createView(this);
        this.generateCodeMagnetMap(code);

    };

    p.bindCodeView = function(codeView) {
        this.svgBlockGroup.remove();
        this.svgThreadGroup.remove();
        this.svgBlockGroup = codeView.svgBlockGroup;
        this.svgThreadGroup = codeView.svgThreadGroup;
        this.svgGroup.appendChild(this.svgThreadGroup);
        this.svgGroup.appendChild(this.svgBlockGroup);
    };

    p.setMagnetedBlock = function(block) {
        if (this.magnetedBlockView) {
            if (this.magnetedBlockView === block)
                return;
            else
                this.magnetedBlockView.set({magneting: false});
        }
        this.set({magnetedBlockView: block});
        if (block) {
            block.set({magneting: true});
            block.dominate();
            this.dragBlock.dominate();
        }
    };

    p.getCode = function() {
        return this.code;
    };

    p.findById = function(id) {
        var code = this.code;
        var threads = code.getThreads();
        for (var i=0,len=threads.length; i<len; i++) {
            var thread = threads[i];
            if (!thread) continue;

            var blocks = thread.getBlocks();
            for (var j=0,len=blocks.length; j<len; j++) {
                if (blocks[j] && blocks[j].id == id) {
                    return blocks[j];
                }
            }
        }
    };

    p._addControl = function() {
        var dom = this.svgDom;
        var that = this;
        dom.mousedown(function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.bind('touchstart', function() {
            that.onMouseDown.apply(that, arguments);
        });
        dom.on('mousewheel', function(){
            that.mouseWheel.apply(that, arguments);
        });
    };

    p.onMouseDown = function(e) {
        if (this.workspace.getMode() == Entry.Workspace.MODE_VIMBOARD)
            return;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        var mouseEvent;
        if (e.button === 0 || (e.originalEvent && e.originalEvent.touches)) {
            if (e.originalEvent && e.originalEvent.touches)
                 mouseEvent = e.originalEvent.touches[0];
            else mouseEvent = e;
            if (Entry.documentMousedown)
                Entry.documentMousedown.notify(mouseEvent);
            var doc = $(document);
            doc.bind('mousemove.entryBoard', onMouseMove);
            doc.bind('mouseup.entryBoard', onMouseUp);
            doc.bind('touchmove.entryBoard', onMouseMove);
            doc.bind('touchend.entryBoard', onMouseUp);
            this.dragInstance = new Entry.DragInstance({
                startX: mouseEvent.pageX,
                startY: mouseEvent.pageY,
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY
            });
        } else if (Entry.Utils.isRightButton(e)) {
            if (!this.visible) return;
            var that = this;

            var options = [];

            var paste = {
                text: '붙여넣기',
                enable: !!Entry.clipboard,
                callback: function(){
                    that.code.createThread(Entry.clipboard)
                        .getFirstBlock().copyToClipboard();
                }
            };

            var align = {
                text: '블록 정리하기',
                callback: function(){
                    that.alignThreads();
                }
            };

            options.push(paste);
            options.push(align);

            Entry.ContextMenu.show(options);
        }

        var board = this;
        function onMouseMove(e) {
            var mouseEvent;
            if (e.stopPropagation) e.stopPropagation();
            if (e.preventDefault) e.preventDefault();

            if (e.originalEvent && e.originalEvent.touches)
                mouseEvent = e.originalEvent.touches[0];
            else mouseEvent = e;

            var dragInstance = board.dragInstance;
            board.scroller.scroll(
                mouseEvent.pageX - dragInstance.offsetX,
                mouseEvent.pageY - dragInstance.offsetY
            );
            dragInstance.set({
                offsetX: mouseEvent.pageX,
                offsetY: mouseEvent.pageY
            });
        }

        function onMouseUp(e) {
            $(document).unbind('.entryBoard');
            delete board.dragInstance;
        }
    };

    p.mouseWheel = function(e) {
        e = e.originalEvent;

        this.scroller.scroll(
            e.wheelDeltaX || -e.deltaX,
            e.wheelDeltaY || -e.deltaY
        );
    };

    p.setSelectedBlock = function(blockView) {
        var old = this.selectedBlockView;

        if (old) old.removeSelected();

        if (blockView instanceof Entry.BlockView) {
            blockView.addSelected();
        } else blockView = null;

        this.set({selectedBlockView:blockView});
    };

    p._keyboardControl = function(event) {
        var selected = this.selectedBlockView;
        if (!selected) return;

        if (event.keyCode == 46) {
            if (selected.block.doDestroy(false))
                this.set({selectedBlockView:null});
        }
    };

    p.hide = function() {
        this.wrapper.addClass('entryRemove');
        this.visible = false;
    };

    p.show = function() {
        this.wrapper.removeClass('entryRemove');
        this.visible = true;
    };

    p.alignThreads = function() {
        var domHeight = this.svgDom.height();
        var threads = this.code.getThreads();

        var verticalGap = 15;
        var acculmulatedTop = 15;
        var columWidth = 0;
        var limitTopPosition = domHeight - 30;
        var left = 50;

        for (var i =0; i < threads.length; i++) {
            var block = threads[i].getFirstBlock();
            var blockView = block.view;
            var bBox = blockView.svgGroup.getBBox();
            var top = acculmulatedTop + verticalGap;
            if (top > limitTopPosition) {
                left = left + columWidth + 10;
                columWidth = 0;
                acculmulatedTop = 15;
            }
            columWidth = Math.max(columWidth, bBox.width);
            top = acculmulatedTop + verticalGap;
            blockView._moveTo(left, top, false);
            acculmulatedTop = acculmulatedTop + bBox.height + verticalGap;
        }
        this.scroller.resizeScrollBar();
    };

    p.clear = function() {
        var node = this.svgBlockGroup;
        while (node.firstChild)
            node.removeChild(node.firstChild);
    };

    p.updateOffset = function () {
        this.offset = this.svg.getBoundingClientRect();
        var w = $(window),
            scrollTop = w.scrollTop(),
            scrollLeft = w.scrollLeft(),
            offset = this.offset;

        this.relativeOffset = {
            top: offset.top - scrollTop,
            left: offset.left - scrollLeft
        };

        if (this.btnWrapper) {
            this.btnWrapper.attr({
                "transform": "translate(" +
                    (offset.width / 2 - 65) + "," +
                    (offset.height - 200) +")"
            });
        }
    };

    p.generateButtons = function() {
        var that = this;
        var btnWrapper = this.svgGroup.elem("g");
        this.btnWrapper = btnWrapper;

        var saveText = btnWrapper.elem('text', {
            x: 27, y: 33, class: 'entryFunctionButtonText'
        });
        saveText.innerHTML = Lang.Buttons.save;

        var cancelText = btnWrapper.elem('text', {
            x: 102.5, y: 33, class: 'entryFunctionButtonText'
        });
        cancelText.innerHTML = Lang.Buttons.cancel;

        var saveButton = btnWrapper.elem('circle', {
            cx: 27.5, cy: 27.5, r: 27.5, class: 'entryFunctionButton'
        });

        var cancelButton = btnWrapper.elem('circle', {
            cx: 102.5, cy: 27.5, r: 27.5, class: 'entryFunctionButton'
        });

        saveButton.onclick = function(e) { that.save(); };
        saveText.onclick = function(e) { that.save(); };

        cancelButton.onclick = function(e) { that.cancelEdit(); };
        cancelText.onclick = function(e) { that.cancelEdit(); };
    };

    p.cancelEdit = function() {
        this.workspace.setMode(Entry.Workspace.MODE_BOARD, "cancelEdit");
    };

    p.save = function() {
        this.workspace.setMode(Entry.Workspace.MODE_BOARD, "save");
    };

    p.generateCodeMagnetMap = function() {
        var code = this.code;
        if (!code || !this.dragBlock) return;

        var targetType = this.dragBlock._targetType;

        var metaData = this._getCodeBlocks(code, targetType);
        metaData.sort(function(a, b) {return a.point - b.point;});

        metaData.unshift({
            point: - Number.MAX_VALUE,
            blocks: []
        });
        for (var i = 1; i < metaData.length; i++) {
            var pointData = metaData[i];
            var includeData = pointData;
            var block = pointData.startBlock;
            if (block) {
                var limit = pointData.endPoint,
                    index = i;
                while (limit > includeData.point) {
                    includeData.blocks.push(block);
                    index++;
                    includeData = metaData[index];
                    if (!includeData)
                        break;
                }
                delete pointData.startBlock;
            }
            pointData.endPoint = Number.MAX_VALUE;
            metaData[i - 1].endPoint = pointData.point;
        }

        this._magnetMap = metaData;
    };

    p._getCodeBlocks = function(code, targetType) {
        var threads = code.getThreads();
        var blocks = [];
        var zIndex = 0;
        var func;
        switch (targetType) {
            case "nextMagnet":
                func = this._getNextMagnets;
                break;
            case "stringMagnet":
                func = this._getFieldMagnets;
                break;
            case "booleanMagnet":
                func = this._getFieldMagnets;
                break;
            case "paramMagnet":
                func = this._getOutputMagnets;
                break;
            default:
                return [];
        }
        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            blocks = blocks.concat(func.call(this, thread, zIndex, null, targetType));
            zIndex++;
        }
        return blocks;
    };

    p._getNextMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            blockView.zIndex = zIndex;
            if (blockView.dragInstance)
                break;
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next)
                endPoint += blockView.magnet.next.y;
            metaData.push({
                point: cursorY,
                endPoint: endPoint,
                startBlock: block,
                blocks: []
            });
            metaData.push({
                point: endPoint,
                blocks: []
            });
            blockView.absX = cursorX;
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statement.zIndex = zIndex;
                    statement.absX = cursorX + statement.x;
                    metaData.push({
                        point: statement.y + cursorY - 30,
                        endPoint: statement.y + cursorY + statement.height,
                        startBlock: statement,
                        blocks: []
                    });
                    metaData.push({
                        point: statement.y + cursorY + statement.height,
                        blocks: []
                    });
                    zIndex += 0.01;
                    statementBlocks = statementBlocks.concat(
                        this._getNextMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getFieldMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        var that = this;
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            if (blockView.dragInstance)
                break;
            blockView.zIndex = zIndex;
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next)
                endPoint += blockView.magnet.next.y;
            metaData = metaData.concat(
                this._getFieldBlockMetaData(blockView, cursorX, cursorY, zIndex, targetType)
            );
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statementBlocks = statementBlocks.concat(
                        this._getFieldMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getFieldBlockMetaData = function(blockView, cursorX, cursorY, zIndex, targetType) {
        var contents = blockView._contents;
        var metaData = [];
        cursorX += blockView.contentPos.x;
        cursorY += blockView.contentPos.y;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            if (!(content instanceof Entry.FieldBlock))
                continue;
            if (content.acceptType !== targetType)
                continue;
            var contentBlock = content._valueBlock;
            if (contentBlock.view.dragInstance)
                continue;
            var startX = cursorX + content.box.x;
            var startY = cursorY + content.box.y + blockView.height * -0.5;
            var endY = cursorY + content.box.y + content.box.height;
            metaData.push({
                point: startY,
                endPoint: endY,
                startBlock: contentBlock,
                blocks: []
            });
            metaData.push({
                point: endY,
                blocks: []
            });
            var contentBlockView = contentBlock.view;
            contentBlockView.absX = startX;
            contentBlockView.zIndex = zIndex;
            metaData = metaData.concat(
                this._getFieldBlockMetaData(contentBlockView,
                                          startX + contentBlockView.contentPos.x,
                                          startY + contentBlockView.contentPos.y,
                                          zIndex + 0.01,
                                          targetType)
            );
        }
        return metaData;
    };

    p._getOutputMagnets = function(thread, zIndex, offset, targetType) {
        var blocks = thread.getBlocks();
        var statementBlocks = [];
        var metaData = [];
        var that = this;
        if (!offset) offset = {x: 0, y: 0};
        var cursorX = offset.x;
        var cursorY = offset.y;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            var blockView = block.view;
            if (blockView.dragInstance)
                break;
            blockView.zIndex = zIndex;
            cursorY += blockView.y;
            cursorX += blockView.x;
            var endPoint = cursorY + 1;
            if (blockView.magnet.next)
                endPoint += blockView.magnet.next.y;
            metaData = metaData.concat(
                this._getOutputMetaData(blockView, cursorX, cursorY, zIndex, targetType)
            );
            if (block.statements)
                zIndex += 0.01;
                for (var j = 0; j < block.statements.length; j++) {
                    var thread = block.statements[j];
                    var statement = block.view._statements[j];
                    statementBlocks = statementBlocks.concat(
                        this._getOutputMagnets(thread, zIndex, {
                            x: statement.x + cursorX,
                            y: statement.y + cursorY
                        }, targetType)
                    );
                }
            if (blockView.magnet.next) {
                cursorY += blockView.magnet.next.y;
                cursorX += blockView.magnet.next.x;
            }
        }
        return statementBlocks.concat(metaData);
    };

    p._getOutputMetaData = function(blockView, cursorX, cursorY, zIndex, targetType) {
        var contents = blockView._contents;
        var metaData = [];
        cursorX += blockView.contentPos.x;
        cursorY += blockView.contentPos.y;
        for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            var startX = cursorX + content.box.x;
            var startY = cursorY - 24;
            var endY = cursorY;
            if (content instanceof Entry.FieldBlock) {
                var contentBlock = content._valueBlock;
                if (contentBlock) {
                    metaData = metaData.concat(
                        this._getOutputMetaData(contentBlock.view,
                                                  startX,
                                                  cursorY + content.box.y,
                                                  zIndex + 0.01,
                                                  targetType)
                    );
                }
                continue;
            }
            if (!(content instanceof Entry.FieldOutput))
                continue;
            if (content.acceptType !== targetType)
                continue;
            metaData.push({
                point: startY,
                endPoint: endY,
                startBlock: content,
                blocks: []
            });
            metaData.push({
                point: endY,
                blocks: []
            });
            content.absX = startX;
            content.zIndex = zIndex;
            content.width = 20;
            var contentBlock = content._valueBlock;
            if (!contentBlock)
                continue;
            if (contentBlock.view.dragInstance)
                continue;
            var contentBlockView = contentBlock.view;
            metaData = metaData.concat(
                this._getOutputMetaData(contentBlockView,
                                          cursorX + content.box.x,
                                          cursorY + content.box.y,
                                          zIndex + 0.01,
                                          targetType)
            );
        }
        return metaData;
    };


    p.getNearestMagnet = function(x, y, targetType) {
        var targetArray = this._magnetMap;
        if (!targetArray || targetArray.length ===0) return;

        var minIndex = 0,
            maxIndex = targetArray.length - 1,
            index,
            pointData,
            result = null,
            searchValue = targetType === "nextMagnet" ? y - 15 : y;
        while (minIndex <= maxIndex) {
            index = (minIndex + maxIndex) / 2 | 0;
            pointData = targetArray[index];

            if (searchValue < pointData.point) {
                maxIndex = index - 1;
            } else if (searchValue > pointData.endPoint) {
                minIndex = index + 1;
            } else {
                var blocks = pointData.blocks;
                for (var i = 0; i < blocks.length; i++) {
                    var blockView = blocks[i].view;
                    if (blockView.absX - 20 < x && x < blockView.absX + blockView.width) {
                        var resultBlock = pointData.blocks[i];
                        if (!result || result.view.zIndex < resultBlock.view.zIndex)
                            result = pointData.blocks[i];
                    }
                }
                return result;
            }
        }
        return null;
    };

    p.dominate = function(thread) {
        var block = thread.getFirstBlock();
        this.svgBlockGroup
            .appendChild(block.view.svgGroup);
        this.code.dominate(block.thread);
    };

})(Entry.Board.prototype);
