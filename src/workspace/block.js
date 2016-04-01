/*
 *
 */
"use strict";

goog.provide("Entry.Block");

goog.require('Entry.Thread');
goog.require('Entry.Utils');
goog.require('Entry.Model');
goog.require("Entry.BoxModel");
goog.require("Entry.skeleton");

/*
 *
 */
Entry.Block = function(block, thread) {
    Entry.Model(this, false);
    this._schema = null;

    this.setThread(thread);
    this.load(block);
};

Entry.Block.MAGNET_RANGE = 10;
Entry.Block.MAGNET_OFFSET = 0.4;

(function(p) {
    p.schema = {
        id: null,
        x: 0,
        y: 0,
        type: null,
        params: [],
        statements: [],
        view: null,
        thread: null,
        movable: null,
        deletable: true,
        readOnly: null,
        copyable: true,
        events: {}
    };

    p.load = function(block) {
        if (!block.id)
            block.id = Entry.Utils.generateId();

        this.set(block);
        this.getSchema();
    };

    p.changeSchema = function(diff) {
        this.set({params: []});
        this.getSchema();
    };

    p.getSchema = function() {
        var that = this;
        this._schema = Entry.block[this.type];

        if (!this._schema) return;

        if (!this._schemaChangeEvent && this._schema.changeEvent)
            this._schemaChangeEvent = this._schema.changeEvent.attach(
                this, this.changeSchema);

        var events = this._schema.events;
        if (events) {
            for (var key in events) {
                if (!this.events[key]) this.events[key] = [];
                var funcs = events[key];
                for (var i=0; i<funcs.length; i++) {
                    var func = funcs[i];
                    var index = this.events[key].indexOf(func);
                    if (index < 0) this.events[key].push(func);
                }
            }
        }

        if (this._schema.event)
            this.thread.registerEvent(this, this._schema.event);
        var thisParams = this.params;

        var params = this._schema.params;
        for (var i = 0; params && i < params.length; i++) {
            var value = thisParams[i] !== undefined ? thisParams[i] : params[i].value;

            var paramInjected = thisParams[i];

            if (value && (params[i].type === 'Output' || params[i].type === 'Block'))
                value = new Entry.Block(value);

            if (paramInjected) thisParams.splice(i, 1, value);
            else thisParams.push(value);
        }

        var statements = this._schema.statements;
        if (statements) {
            for (var i = 0; i < statements.length; i++) {
                this.statements.splice(
                    i, 1,
                    new Entry.Thread(this.statements[i], that.getCode())
                );
            }
        }
    };

    p.changeType = function(type) {
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
        this.set({type: type});
        this.getSchema();
        if (this.view)
            this.view.changeType(type);
    };

    p.setThread = function(thread) {
        this.set({thread: thread});
    };

    p.getThread = function() {
        return this.thread;
    };

    p.insertAfter = function(blocks) {
        this.thread.insertByBlock(this, blocks);
    };

    p._updatePos = function() {
        if (this.view)
            this.set({
                x: this.view.x,
                y: this.view.y
            });

        //TODO update next pos
    };

    p.createView = function(board, mode) {
        if (!this.view) {
            this.set({view: new Entry.BlockView(
                this,
                board,
                mode)
            });
            this._updatePos();
        }
    };

    p.clone = function(thread) {
        return new Entry.Block(
            this.toJSON(true),
            thread
        );
    };

    p.toJSON = function(isNew) {
        var json = this._toJSON();
        delete json.view;
        delete json.thread;

        if (isNew) delete json.id;

        json.params = json.params.map(function(p) {
            if (p instanceof Entry.Block)
                p = p.toJSON(isNew);
            return p;
        });

        json.statements = json.statements.map(
            function(s) {return s.toJSON(isNew);}
        );

        json.x = this.x;
        json.y = this.y;

        json.movable = this.movable;
        json.deletable = this.deletable;
        json.readOnly = this.readOnly;
        return json;
    };

    p.destroy = function(animate, next) {
        var params = this.params;
        if (params) {
            for (var i=0; i<params.length; i++) {
                var param = params[i];
                if (param instanceof Entry.Block) {
                    param.doNotSplice = true;
                    param.destroy(animate);
                }
            }
        }

        var statements = this.statements;
        if (statements) {
            for (var i=0; i<statements.length; i++) {
                var statement = statements[i];
                statement.destroy(animate);
            }
        }

        var prevBlock = this.getPrevBlock();
        var nextBlock = this.getNextBlock();

        var thread = this.getThread();
        if (this._schema.event)
            thread.unregisterEvent(this, this._schema.event);
        if (nextBlock) {
            if (next) nextBlock.destroy(animate, next);
            else {
                if (!prevBlock) {
                    var parent = this.getThread().view.getParent();
                    if (parent.constructor === Entry.FieldStatement) {
                        nextBlock.view.bindPrev(parent);
                        parent.insertTopBlock(nextBlock);
                    } else if (parent.constructor === Entry.FieldStatement) {
                        nextBlock.replace(parent._valueBlock);
                    } else nextBlock.view._toGlobalCoordinate();
                } else nextBlock.view.bindPrev(prevBlock);
            }
        }
        if (!this.doNotSplice) thread.spliceBlock(this);
        else delete this.doNotSplice;
        if (this.view) this.view.destroy(animate);
        if (this._schemaChangeEvent)
            this._schemaChangeEvent.destroy();
    };

    p.getView = function() {return this.view;};

    p.setMovable = function(movable) {
        if (this.movable == movable) return;
        this.set({movable: movable});
    };

    p.setCopyable = function(copyable) {
        if (this.copyable == copyable) return;
        this.set({copyable: copyable});
    };

    p.isMovable = function() {return this.movable;};

    p.isCopyable = function() {return this.copyable;};

    p.setDeletable = function(deletable) {
        if (this.deletable == deletable) return;
        this.set({deletable: deletable});
    };

    p.isDeletable = function() {return this.deletable;};

    p.isReadOnly = function() {return this.readOnly;};

    p.getCode = function() {return this.thread.getCode();};


    // command func
    p.doAdd = function() {
        var id = this.id;
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('addBlock', data));
        }
        this.getCode().changeEvent.notify();
    };

    p.doMove = function() {
        var id = this.id;
        var moveX = this.view.x - this.x;
        var moveY = this.view.y - this.y;

        this._updatePos();
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['moveX',moveX],
                ['moveY',moveY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('moveBlock', data));
        }
    };

    p.doSeparate = function() {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        this.separate();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('seperateBlock', data));
        }
    };

    p.doInsert = function(targetBlock, isFieldBlock) {
        var id = this.id;
        var targetId = targetBlock.id;
        var positionX = this.x;
        var positionY = this.y;
        if (isFieldBlock)
            this.replace(targetBlock);
        else
            this.insert(targetBlock);
        if (Entry.activityReporter) {
            var data = [
                ['targetBlockId',targetId],
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('insertBlock', data));
        }
    };

    p.doDestroy = function(animate) {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        this.destroy(animate);
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('destroyBlock', data));
        }
        return this;
    };

    p.doDestroyBelow = function(animate) {
        var id = this.id;
        var positionX = this.x;
        var positionY = this.y;

        console.log(
            "destroyBelow",
            id,
            positionX,
            positionY
        );
        this.destroy(animate, true);
        this.getCode().changeEvent.notify();
        if (Entry.activityReporter) {
            var data = [
                ['blockId',id],
                ['positionX',positionX],
                ['positionY',positionY],
                ['code',this.getCode().stringify()]
            ];
            Entry.activityReporter.add(new Entry.Activity('destroyBlock', data));
        }
        return this;
    };

    p.copy = function() {
        var thread = this.getThread();
        var cloned = [];
        if (thread instanceof Entry.Thread) {
            var index = thread.getBlocks().indexOf(this);
            var json = thread.toJSON(true, index);
            for (var i=0; i<json.length; i++) cloned.push(json[i]);
        } else
            cloned.push(this.toJSON(true));

        var pos = this.view.getAbsoluteCoordinate();
        cloned[0].x = pos.x + 15;
        cloned[0].y = pos.y + 15;

        return cloned;
    };

    p.copyToClipboard = function() {Entry.clipboard = this.copy();};

    p.separate = function() {
        this.thread.separate(this);
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.insert = function(targetBlock) {
        var blocks = this.thread.cut(this);
        if (targetBlock instanceof Entry.Thread) {
            targetBlock.insertByBlock(null, blocks);
        } else {
            targetBlock.insertAfter(blocks);
        }
        this._updatePos();
        this.getCode().changeEvent.notify();
    };

    p.replace = function(targetBlock) {
        this.thread.cut(this);
        targetBlock.thread.replace(this);
        this.getCode().changeEvent.notify();
    };

    p.getPrevBlock = function() {
        return this.thread.getPrevBlock(this);
    };

    p.getNextBlock = function() {
        return this.thread.getNextBlock(this) || null;
    };

    p.getLastBlock = function() {
        return this.thread.getLastBlock();
    };

    p.getOutputBlock = function() {
        var params = this._schema.params;
        for (var i = 0; params && i < params.length; i++) {
            var paramDef = params[i];
            if (paramDef.type === "Output")
                return this.params[i];
        }
        return null;
    };

})(Entry.Block.prototype);
