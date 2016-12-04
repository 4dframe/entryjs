/*
 *
 */
"use strict";

goog.provide("Entry.TextCodingUtil");

goog.require("Entry.Queue");

Entry.TextCodingUtil = {};

(function(tu) {
    this._funcParams;
    this._funcParamQ;
    this._currentObject;

    tu.init = function() {
        this._funcParams = [];
    };

    tu.initQueue = function() {
        var queue = new Entry.Queue();
        this._funcParamQ = queue;

        var fNameQueue = new Entry.Queue();
        this._funcNameQ = fNameQueue;
        //console.log("initQueue this._funcParamQ", this._funcParamQ);
    };

    tu.clearQueue = function() {
        this._funcParamQ.clear();
        this._funcNameQ.clear();
    };

	tu.indent = function(textCode) {
        //console.log("indent textCode", textCode);
        var result = "\t";
        var indentedCodeArr = textCode.split("\n");
        indentedCodeArr.pop();
        result += indentedCodeArr.join("\n\t");
        result = "\t" + result.trim();//.concat('\n');
        //console.log("indent result", result);

        return result;
    };

    tu.isNumeric = function(value) {
        //console.log("isNumeric value", Math.abs(value));
        value = String(Math.abs(value));
        if(value.match(/^-?\d+$|^-\d+$/) || value.match(/^-?\d+\.\d+$/)) {
            return true;
        }

        return false;
    };

    tu.isBinaryOperator = function(value) {
        if(value == "==" || value == ">" || value == "<" || value == ">="|| value == "<=" ||
            value == "+" || value == "-" || value == "*" || value == "/") {
            return true;
        }

        return false;
    };

    tu.binaryOperatorConvert = function(operator) {
        //console.log("binaryOperatorConvert", operator);
        var result;
        switch(operator) {
            case '==': {
                result = "EQUAL";
                break;
            }
            case '>': {
                result = "GREATER";
                break;
            }
            case '<': {
                result = "LESS";
                break;
            }
            case '>=': {
                result = "GREATER_OR_EQUAL";
                break;
            }
            case '<=': {
                result = "LESS_OR_EQUAL";
                break;
            }
            case '+': {
                result = "PLUS";
                break;
            }
            case '-': {
                result = "MINUS";
                break;
            }
            case '*': {
                result = "MULTIFLY";
                break;
            }
            case '/': {
                result = "DIVIDE";
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    };

    tu.logicalExpressionConvert = function(operator) {
        //console.log("logicalExpressionConvert", operator);
        var result;
        switch(operator) {
            case '&&': {
                result = null;
                break;
            }
            case '||': {
                result = null;
                break;
            }
            default: {
                result = operator;
            }
        }
        return result;
    };

    tu.dropdownDynmaicNameToIdConvertor = function(name, menuName) {
        if(!name)
            return name;

        var result;

        if(menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            //console.log("dropdownDynamicValueConvertor entryVariables", entryVariables);
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.name_ == name) {
                    result = entryVariable.id_;
                    break;
                }

            }
        }
        else if(menuName == "lists") {
            var entryLists = Entry.variableContainer.lists_;
            console.log("dropdownDynamicValueConvertor entryLists", entryLists);
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.name_ == name) {
                    result = entryList.id_;
                    break;
                }

            }
        }
        else if(menuName == "messages") {
            var entryMessages = Entry.variableContainer.messages_;
            //console.log("dropdownDynamicValueConvertor entryLists", entryLists);
            for(var e in entryMessages) {
                var entryList = entryMessages[e];
                if(entryList.name == name) {
                    result = entryList.id;
                    break;
                }

            }
        }
        else if(menuName == "pictures") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var pictures = object.pictures;
                for(var p in pictures) {
                    var picture = pictures[p];
                    if(picture.name == name) {
                        result = picture.id;
                        return result;
                    }
                }
            }
        }
        else if(menuName == "sounds") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var sounds = object.sounds;
                for(var p in sounds) {
                    var sound = sounds[p];
                    if(sound.name == name) {
                        result = sound.id;
                        return result;
                    }
                }
            }
        }

        if(!result) {
            result = "None";
        }

        return result;
    };

    tu.dropdownDynamicValueConvertor = function(value, param) {
        var options = param.options;
        //console.log("dropdownDynamicValueConvertor value", value, "options", options);
        var found = false;
        var result = null;
        for(var index in options) {
            var option = options[index];
            if(option[1] == "null") {
                /*var item = {};
                var None = {};
                item.None = None;
                result = item.None;*/

                result = "None";

                found = true;
                return result;
            }

            if(value == "mouse" || value == "wall" || value == "wall_up" ||
               value == "wall_down" || value == "wall_right" || value == "wall_left") {
                found = true;
                return value;
            }

            //console.log("dropdownDynamicValueConvertor check value", value, "option", option);

            if(value == option[1]) {
                console.log("dropdownDynamicValueConvertor value", value, option[1]);
                result = option[0];
                found = true;
                return result;
            }
        }

        result = value;

        if(!found && param.menuName == "variables") {
            var entryVariables = Entry.variableContainer.variables_;
            //console.log("dropdownDynamicValueConvertor entryVariables", entryVariables);
            for(var e in entryVariables) {
                var entryVariable = entryVariables[e];
                if(entryVariable.id_ == value) {
                    result = entryVariable.name_;
                    break;
                }

            }
        }
        else if(!found && param.menuName == "lists") {
            var entryLists = Entry.variableContainer.lists;
            //console.log("dropdownDynamicValueConvertor entryLists", entryLists);
            for(var e in entryLists) {
                var entryList = entryLists[e];
                if(entryList.id_ == value) {
                    result = entryList.name_;
                    break;
                }

            }
        }
        else if(!found && param.menuName == "messages") {
            var entryMessages = Entry.variableContainer.messages_;
            //console.log("dropdownDynamicValueConvertor entryLists", entryLists);
            for(var e in entryMessages) {
                var entryList = entryMessages[e];
                if(entryList.id == value) {
                    result = entryList.name;
                    break;
                }

            }
        }
        else if(!found && param.menuName == "pictures") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var pictures = object.pictures;
                for(var p in pictures) {
                    var picture = pictures[p];
                    if(picture.id == value) {
                        result = picture.name;
                        return result;
                    }
                }
            }
        }
        else if(!found && param.menuName == "sounds") {
            var objects = Entry.container.getAllObjects();
            for(var o in objects) {
                var object = objects[o];
                var sounds = object.sounds;
                for(var p in sounds) {
                    var sound = sounds[p];
                    if(sound.id == value) {
                        result = sound.name;
                        return result;
                    }
                }
            }
        }

        console.log("dropdownDynamicValueConvertor result", result);

        return result;

    };

    tu.binaryOperatorValueConvertor = function(operator) {
        var result;
        switch(operator) {
            case '\"EQUAL\"': {
                //console.log("EQUAL");
                result = "==";
                break;
            }
            case '\"GREATER\"': {
                result = ">";
                break;
            }
            case '\"LESS\"': {
                result = "<";
                break;
            }
            case '\"GREATER_OR_EQUAL\"': {
                result = ">=";
                break;
            }
            case '\"LESS_OR_EQUAL\"': {
                result = "<=";
                break;
            }
            case '\"그리고\"': {
                result = "&&";
                break;
            }
            case '\"또는\"': {
                result = "||";
                break;
            }
            case '\"PLUS\"': {
                result = "+";
                break;
            }
            case '\"MINUS\"': {
                result = "-";
                break;
            }
            case '\"MULTI\"': {
                result = "*";
                break;
            }
            case '\"DIVIDE\"': {
                result = "/";
                break;
            }
            default: {
                result = operator;
            }
        }

        //console.log("binaryOperatorValueConvertor result", result);
        return result;
    };

    tu.variableListFilter = function(block, index, param) {
        console.log("paramFilter block index param", block.data.type, index, param);

        if(param == "None")
            return result = param;

        var result = param;
        var type = block.data.type;
        if(type == "change_variable" || type == "set_variable" || type == "get_variable" ) {
            if(index == 1) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
        } else if(type == "length_of_list" || type == "is_included_in_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
        } else if(type == "value_of_index_from_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
            else if(index == 4) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "remove_value_from_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
            else if(index == 1) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "insert_value_to_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
            else if(index == 3) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "change_value_list_index") {
            if(index == 1) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
            else if(index == 2) {
                if(this.isNumeric(param))
                    result = param - 1;
            }
        } else if(type == "add_value_to_list") {
            if(index == 2) {
                //console.log("paramFilter", eval(param));
                result = eval(param);
            }
        }

        return result;
    };

    tu.variableListSpaceMessage = function() {
        console.log("variableListSpaceMessage");
        var error = {};
        error.title = "파이썬변환(Converting) 오류";
        error.message = "공백(띄어쓰기)이 포함된 변수 또는 리스트는 변환할 수 없습니다.";
        error.line = this._blockCount;
        console.log("send error", error);
        throw error;
    };

    tu.isGlobalVariableExisted = function(name) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === null && entryVariable.name_ == name) {
                return true;
            }

        }

        return false;
    };

    tu.updateGlobalVariable = function(name, value) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === null && entryVariable.name_ == name) {
                variable = {
                    x: entryVariable.x_,
                    y: entryVariable.y_,
                    id: entryVariable.id_,
                    visible: entryVariable.visible_,
                    value: value,
                    name: name,
                    isCloud: entryVariable.isClud_,
                };

                entryVariable.syncModel_(variable);
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createGlobalVariable = function(name, value) {
        if(this.isGlobalVariableExisted(name))
            return;

        var variable = {
            name: name,
            value: value,
            variableType: 'variable'
        };

        //console.log("TextCodingUtil variable", variable);

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    tu.isLocalVariableExisted = function(name, object) {
        console.log("isLocalVariableExisted name object", name, object);
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            console.log("TextCodingUtil isLocalVariableExisted", entryVariable);
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                return true;
            }

        }

        return false;
    };

    tu.updateLocalVariable = function(name, value, object) {
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            //console.log("TextCodingUtil updateGlobalVariable", entryVariable);
            if(entryVariable.object_ === object.id && entryVariable.name_ == name) {
                var variable = {
                    x: entryVariable.x_,
                    y: entryVariable.y_,
                    id: entryVariable.id_,
                    visible: entryVariable.visible_,
                    value: value,
                    name: name,
                    isCloud: entryVariable.isClud_,
                };

                entryVariable.syncModel_(variable);
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createLocalVariable = function(name, value, object) {
        if(this.isLocalVariableExisted(name, object))
            return;

        var variable = {
            name: name,
            value: value,
            object: object.id,
            variableType: 'variable'
        };

        //console.log("TextCodingUtil variable name", name);

        Entry.variableContainer.addVariable(variable);
        Entry.variableContainer.updateList();
    };

    tu.isLocalVariable = function(variableId) {
        //console.log("TextCodingUtil isLocalVariable", variableId);
        var object = Entry.playground.object;
        var entryVariables = Entry.variableContainer.variables_;
        for(var e in entryVariables) {
            var entryVariable = entryVariables[e];
            if(entryVariable.object_ == object.id && entryVariable.id_ == variableId) {
                return true;
            }
        }

        return false;

    };

    tu.isGlobalListExisted = function(name) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === null && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    };

    tu.updateGlobalList = function(name, array) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === null && entryList.name_ == name) {
                list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isClud_,
                        width: entryList.width_,
                        height: entryList.height_,
                        array: array,
                    };

                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createGlobalList = function(name, array) {
        if(this.isGlobalListExisted(name))
            return;

        var list = {
            name: name,
            array: array,
            variableType: 'list'
        };

        //console.log("TextCodingUtil list", list);

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    tu.isLocalListExisted = function(name, object) {
        //console.log("TextCodingUtil isLocalListExisted", name, object);
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === object.id && entryList.name_ == name) {
                return true;
            }
        }

        return false;
    };

    tu.updateLocalList = function(name, array, object) {
        var entryLists = Entry.variableContainer.lists_;
        for(var i in entryLists) {
            var entryList = entryLists[i];
            //console.log("TextCodingUtil entryList", entryList);
            if(entryList.object_ === object.id && entryList.name_ == name) {
                var list = {
                        x: entryList.x_,
                        y: entryList.y_,
                        id: entryList.id_,
                        visible: entryList.visible_,
                        name: name,
                        isCloud: entryList.isClud_,
                        width: entryList.width_,
                        height: entryList.height_,
                        array: array,
                    };

                entryList.syncModel_(list);
                entryList.updateView();
                Entry.variableContainer.updateList();

                break;
            }
        }
    };

    tu.createLocalList = function(name, array, object) {
        if(this.isLocalListExisted(name, object))
            return;

        var list = {
            name: name,
            array: array,
            object: object.id,
            variableType: 'list'
        };

        //console.log("TextCodingUtil list", list);

        Entry.variableContainer.addList(list);
        Entry.variableContainer.updateList();
    };

    tu.isLocalList = function(listId) {
        //console.log("TextCodingUtil listId", listId);
        var object = Entry.playground.object;
        var entryLists = Entry.variableContainer.lists_;
        for(var e in entryLists) {
            var entryList = entryLists[e];
            if(entryList.object_ == object.id && entryList.id_ == listId) {
                return true;
            }
        }

        return false;

    };

    tu.createMessage = function(name) {
        var messages = Entry.variableContainer.messages_;
        var exist = Entry.isExist(name, 'name', messages);
        if(exist)
            return;
        var message = {
            name: name
        };

        Entry.variableContainer.addMessage(message);
        Entry.variableContainer.updateList();
    };

    tu.isLocalType = function(block, id) {
        if(block.data.type == "get_variable" ||
            block.data.type == "set_variable" ||
            block.data.type == "change_variable" ) {

            if(this.isLocalVariable(id))
                return true;

        } else if(block.data.type == "value_of_index_from_list" ||
            block.data.type == "add_value_to_list" ||
            block.data.type == "remove_value_from_list" ||
            block.data.type == "insert_value_to_list" ||
            block.data.type == "change_value_list_index" ||
            block.data.type == "length_of_list" ||
            block.data.type == "is_included_in_list") {

            if(this.isLocalList(id))
                return true;
        }
    };

    tu.isEventBlock = function(block) {
        var blockType = block.data.type;
        if( blockType == "when_run_button_click" ||
            blockType == "when_some_key_pressed" ||
            blockType == "mouse_clicked" ||
            blockType == "mouse_click_cancled" ||
            blockType == "when_object_click" ||
            blockType == "when_object_click_canceled" ||
            blockType == "when_message_cast" ||
            blockType == "when_scene_start" ||
            blockType == "when_clone_start") {
            return true;
        }

        return false;
    };

    tu.isEntryEventBlockWithParam = function(block) {
        var blockType = block.data.type;
        if( blockType == "when_some_key_pressed" ||
            blockType == "when_message_cast")
            return true;

        return false;
    };

    tu.isEventBlockByType = function(blockType) {
        if( blockType == "when_run_button_click" ||
            blockType == "when_some_key_pressed" ||
            blockType == "mouse_clicked" ||
            blockType == "mouse_click_cancled" ||
            blockType == "when_object_click" ||
            blockType == "when_object_click_canceled" ||
            blockType == "when_message_cast" ||
            blockType == "when_scene_start" ||
            blockType == "when_clone_start") {
            return true;
        }

        return false;
    };

    tu.makeDefinition = function(block) {
        var blockType = block.data.type;
        var syntax = Entry.block[blockType].syntax.py[0];

        var paramReg = /(%.)/mi;
        var tokens = syntax.split(paramReg);

        var result = '';
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (paramReg.test(token)) {
                result += 'event';
            } else {
                result += token;
            }
        }

        return result;
    };

    tu.isNoPrintBlock = function(block) {
        var blockType = block.data.type;

        return false;
    };

    tu.entryEventFilter = function(text) {
        var textArr = text.split("\"");
        if(textArr[1])
            textArr[1] = textArr[1].replace(/ /g, "_space_");

        text = textArr.join("\"");
        text = text.replace(/\"/g, "");
        text = text.replace("None", "none");

        console.log("entryEventFilter text", text);
        return text;
    }

    tu.entryEventFuncFilter = function(threads) {
        var result;
        var eventFound = false;
        var threadArr = threads.split('\n');

        for(var i in threadArr) {
                var thread = threadArr[i];
                var trimedThread = threadArr[i].trim();
                console.log("trimedThread check", trimedThread);
                var colonIndex = trimedThread.indexOf(":");
                var preText = "";

                if(colonIndex > 0) {
                    preText = trimedThread.substring(0, colonIndex+1);
                }

                console.log("preText", preText);

                preText = preText.split("(");
                preText = preText[0];

                /*if( preText == "def entry_event_start():" ||
                    preText == "def entry_event_mouse_down():" ||
                    preText == "def entry_event_mouse_up():" ||
                    preText == "def entry_event_object_down():" ||
                    preText == "def entry_event_object_up():" ||
                    preText == "def entry_event_scene_start():" ||
                    preText == "def entry_event_clone_create():" ) {

                    //var tokens = [];
                    //tokens = funcPart.split("def");
                    //funcPart = tokens[1].substring(0, tokens[1].length-1).trim();

                    thread = thread.replace(/def /, "");
                    var colonIndex = thread.indexOf(":");
                    var funcPart = "";
                    var restPart = "";

                    if(colonIndex > 0) {
                        funcPart = thread.substring(0, colonIndex+1);
                        restPart = thread.substring(colonIndex+1, thread.length);
                    }

                    if(restPart) {
                        var newThread = funcPart.concat("\n").concat(restPart.trim());
                    }
                    else {
                        var newThread = funcPart;
                    }

                    console.log("newThread funcPart", newThread);
                    threadArr[i] = newThread;
                    eventFound = true;
                }
                else */if(preText == "def when_press_key" || preText == "def when_get_signal") {
                    thread = thread.replace(/def /, "");
                    var colonIndex = thread.indexOf(":");
                    var funcPart = "";
                    var restPart = "";

                    if(colonIndex > 0) {
                        funcPart = thread.substring(0, colonIndex);
                        restPart = thread.substring(colonIndex+1, thread.length);
                    }

                    if(restPart) {
                        var newThread = funcPart.concat("\n").concat(restPart.trim());
                    }
                    else {
                        var newThread = funcPart;
                    }

                    console.log("newThread funcPart", newThread);
                    threadArr[i] = newThread;
                    eventFound = true;
                }
                else {
                    if(eventFound) {
                        var newThread = threadArr[i];
                        newThread = newThread.replace(/\t/g, "    ");
                        newThread = newThread.replace(/    /, "");
                        threadArr[i] = newThread;
                    }
                }
        }

        console.log("newEventFunction result", threadArr);

        result = threadArr.join('\n');
        return result;
    };

    tu.eventBlockSyntaxFilter = function(name) {
        var result;
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {

            name = "def " + name;
            result = name;
            return name;
        }

        return result;

    };


    tu.isEntryEventFunc = function(name) {
        if( name == "def when_start" ||
            name == "def when_press_key" ||
            name == "def when_click_mouse_on" ||
            name == "def when_click_mouse_off" ||
            name == "def when_click_object_on" ||
            name == "def when_click_object_off" ||
            name == "def when_get_signal" ||
            name == "def when_start_scene" ||
            name == "def when_make_clone") {

            return true;
        }

        return false;

    };

    /////////////////////////////////////////////////////
    //Important 
    ////////////////////////////////////////////////////
    tu.isEntryEventFuncByFullText = function(text) {
        var index = text.indexOf("(");
        var name = text.substring(0, index);
        console.log("isEntryEventFuncByFullText name", name);

        if( name == "def when_start" ||
            name == "def when_press_key" ||
            name == "def when_click_mouse_on" ||
            name == "def when_click_mouse_off" ||
            name == "def when_click_object_on" ||
            name == "def when_click_object_off" ||
            name == "def when_get_signal" ||
            name == "def when_start_scene" ||
            name == "def when_make_clone") {

            return true;
        }
        else if(name == "def entry_event_start" ||
            name == "def entry_event_key" ||
            name == "def entry_event_mouse_down" ||
            name == "def entry_event_mouse_up" ||
            name == "def entry_event_object_down" ||
            name == "def entry_event_object_up" ||
            name == "def entry_event_signal" ||
            name == "def entry_event_scene_start" ||
            name == "def entry_event_clone_create") { 


            return true;
        }

        return false;

    };

    
    tu.eventBlockSyntaxFilter = function(name) {
        var result;
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {

            name = "def " + name;
            result = name;
            return name;
        }
        else if(name == "entry_event_start" ||
            name == "entry_event_key" ||
            name == "entry_event_mouse_down" ||
            name == "entry_event_mouse_up" ||
            name == "entry_event_object_down" ||
            name == "entry_event_object_up" ||
            name == "entry_event_signal" ||
            name == "entry_event_scene_start" ||
            name == "entry_event_clone_create") { 

            name = "def " + name;
            result = name;
            return name;
        }

        return result;

    };

    tu.isEntryEventFuncName = function(name) {
        console.log("isEntryEventFuncName name", name);
        if( name == "when_start" ||
            name == "when_press_key" ||
            name == "when_click_mouse_on" ||
            name == "when_click_mouse_off" ||
            name == "when_click_object_on" ||
            name == "when_click_object_off" ||
            name == "when_get_signal" ||
            name == "when_start_scene" ||
            name == "when_make_clone") {


            return true;
        }
        else if(name == "entry_event_start" ||
            name == "entry_event_key" ||
            name == "entry_event_mouse_down" ||
            name == "entry_event_mouse_up" ||
            name == "entry_event_object_down" ||
            name == "entry_event_object_up" ||
            name == "entry_event_signal" ||
            name == "entry_event_scene_start" ||
            name == "entry_event_clone_create") { 


            return true;
        }

        console.log("isEntryEventFuncName result is NOT");
        return false;
    };
    /////////////////////////////////////////////////////
    //Important 
    ////////////////////////////////////////////////////

    tu.isEntryEventFuncNameWithParam = function(name) {
        console.log("isEntryEventFuncNameWithParam name", name);
        var lastIndex = name.lastIndexOf("_");

        if(lastIndex > 0) {
            var preText = name.substring(0, lastIndex);
            console.log("isEntryEventFuncNameWithParam preText", preText);
            if( preText == "when_press_key" ||
                preText == "when_get_signal") {
                return true;
            }
        }

        return false;
    };

    tu.searchFuncDefParam = function(block) {
        //console.log("searchFuncDefParam block", block);
        if(block.data.type == "function_field_label") {
            var name = block.data.params[0];
            this._funcNameQ.enqueue(name);
            //console.log("searchFuncDefParam name enqueue", name);

        }

        if(block && block.data && block.data.params && block.data.params[1]){
            if(block.data.type == "function_field_string" || block.data.type == "function_field_boolean") {
                var param = block.data.params[0].data.type;
                this._funcParamQ.enqueue(param);
            }

            var result = this.searchFuncDefParam(block.data.params[1]);
            return result;
        }
        else {
            return block;
        }
    };

    tu.isEntryEventFuncTypeWithParam = function(block) {
        if(block.type == "when_some_key_pressed" ||
            block.type == "when_message_cast")
            return true;

        return false;
    };

    tu.isEntryEventDesignatedParamName = function(paramName) {
        var result = false;

        if(paramName == "key") {
            result = true;
        }
        else if(paramName == "signal") {
            result = true;
        }

        return result;
    };

    tu.gatherFuncDefParam = function(block) {
        if(block && block.data) {
            if(block.data.params[0]) {
                if(block.data.params[0].data) {
                    var param = block.data.params[0].data.type;
                    if(block.data.type == "function_field_string" || block.data.type == "function_field_boolean") {
                        this._funcParamQ.enqueue(param);

                    }
                } else if(block.data.type == "function_field_label") {
                    var name = block.data.params[0];
                    this._funcNameQ.enqueue(name);
                }
            }
            if(block.data.params[1]){
                var result = this.searchFuncDefParam(block.data.params[1]);

                if(result.data.params[0].data) {
                    var param = result.data.params[0].data.type;

                    if(result.data.type == "function_field_string" || result.data.type == "function_field_boolean") {
                        this._funcParamQ.enqueue(param);
                    }
                }

                if(result.data.params[1]) {
                    if(result.data.params[1].data.params[0].data) {
                        var param = result.data.params[1].data.params[0].data.type;

                        if(result.data.params[1].data.type == "function_field_string" || result.data.params[1].data.type == "function_field_boolean") {
                            this._funcParamQ.enqueue(param);
                        }
                    }
                }
            }
        }

        return result;

    };

    tu.getLastParam = function(funcBlock) {
        if(funcBlock && funcBlock.data && funcBlock.data.params[1]) {
            var result = this.getLastParam(funcBlock.data.params[1]);
        }
        else {
            return funcBlock;
        }

        return result;
    };

    tu.isFuncContentsMatch = function(blockFuncContents, textFuncStatements, paramMap, paramInfo) {
        console.log("blockFuncContents, textFuncStatements, paramMap", blockFuncContents, textFuncStatements, paramMap);
        var matchFlag = true;

        if(textFuncStatements.length != blockFuncContents.length) {
            matchFlag = false;
            return matchFlag;
        }

        for(var i = 0; i < blockFuncContents.length; i++) {
            if(!matchFlag)
                break;
            matchFlag = false;
            var blockFuncContent = blockFuncContents[i];
            var textFuncStatement = textFuncStatements[i];

            if(blockFuncContent && !textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            if(!blockFuncContent && textFuncStatement) {
                matchFlag = false;
                return matchFlag;
            }

            console.log("function");

            if(textFuncStatement.type == blockFuncContent.data.type) { //Type Check
                matchFlag = true;

                var textFuncStatementParams = textFuncStatement.params;
                var blockFuncContentParams = blockFuncContent.data.params;
                var cleansingParams = [];
                if(textFuncStatementParams == undefined || textFuncStatementParams == null)
                    textFuncStatementParams = [];
                if(blockFuncContentParams == undefined || blockFuncContentParams == null)
                    blockFuncContentParams = [];

                blockFuncContentParams.map(function(blockFuncContentParam, index) {
                    if(blockFuncContentParam)
                        cleansingParams.push(blockFuncContentParam);
                });
                blockFuncContentParams = cleansingParams;

                if(textFuncStatementParams.length == blockFuncContentParams.length) { //Statement Param Length Comparison
                    matchFlag = true;
                    for(var j = 0; j < textFuncStatementParams.length; j++) {
                        if(!matchFlag)
                            break;
                        matchFlag = false;
                        console.log("blockFuncContentParams", blockFuncContentParams);
                        console.log("textFuncStatementParams", textFuncStatementParams);
                        console.log("paramMap", paramMap);
                        console.log("paramInfo", paramInfo);
                        console.log("textFuncStatementParams[j]", textFuncStatementParams[j]);
                        console.log("blockFuncContentParams[j]", blockFuncContentParams[j]);

                        if(typeof textFuncStatementParams[j] !== "object") {
                            if(textFuncStatementParams[j] == blockFuncContentParams[j]) {
                                matchFlag = true;
                            }
                            else {
                                matchFlag = false;
                            }
                        }
                        else if(textFuncStatementParams[j].name) {
                            var paramKey = textFuncStatementParams[j].name;
                            var paramBlockType = paramInfo[paramKey];

                            if(paramBlockType) {
                                if(blockFuncContentParams[j].data.type == paramBlockType)
                                    matchFlag = true;
                            }
                            else {
                                if(textFuncStatementParams[j].params[0] == blockFuncContentParams[j].data.params[0])
                                    matchFlag = true;
                            }
                        }
                        else if(textFuncStatementParams[j].type == "True" || textFuncStatementParams[j].type == "False") {
                            if(blockFuncContentParams[j].data) {
                                if(textFuncStatementParams[j].type == blockFuncContentParams[j].data.type) {
                                     matchFlag = true;
                                }
                            }
                            else if(textFuncStatementParams[j].type == blockFuncContentParams[j].type) {
                                matchFlag = true;
                            }
                        }
                        else if(textFuncStatementParams[j].type && textFuncStatementParams[j].params) {
                            matchFlag = this.isFuncContentsParamsMatch(blockFuncContentParams[j], textFuncStatementParams[j], paramMap, paramInfo);
                        }
                    }

                    if(matchFlag && textFuncStatement.statements && textFuncStatement.statements.length != 0) {
                        matchFlag = this.isFuncContentsMatch(blockFuncContent.data.statements[0]._data, textFuncStatement.statements[0], paramMap, paramInfo);
                    }
                }
                else {
                    matchFlag = false;
                    break;
                }
            }
            else {
                matchFlag = false;
                break;
            }
        }

        return matchFlag;
    };

    tu.isFuncContentsParamsMatch = function(blockFuncContentParam, textFuncStatementParam, paramMap, paramInfo) {
        console.log("blockFuncContentParam", blockFuncContentParam);
        console.log("textFuncStatementParam", textFuncStatementParam);

        var matchFlag = false;

        var tfspType = textFuncStatementParam.type;
        var bfcpType = blockFuncContentParam.data.type;

        if(tfspType == "text") {
            tfspType = "literal";
        }
        else if(tfspType == "number") {
            tfspType = "literal";
        }
        else {
            if(textFuncStatementParam.isParamFromFunc)
                tfspType = paramInfo[tfspType];
        }


        if(bfcpType == "text") {
            bfcpType = "literal";
        }
        else if(bfcpType == "number") {
            bfcpType = "literal";
        }

        console.log("tfspType", tfspType, "bfcpType", bfcpType);

        if(tfspType == bfcpType) {
            var textSubParams = textFuncStatementParam.params;
            //var blockSubParamsUncleansed = blockFuncContentParam.data.params;
            var blockSubParams = blockFuncContentParam.data.params;

            /*for(var b in blockSubParamsUncleansed) {
                var blockSubParamUncleansed = blockSubParamsUncleansed[b];
                if(blockSubParamUncleansed)
                    blockSubParams.push(blockSubParamUncleansed);
            }*/

            console.log("textSubParams", textSubParams);
            console.log("blockSubParams", blockSubParams);
            if(!textSubParams && !blockSubParams) {
                matchFlag = true;
            }
            else if(textSubParams.length == blockSubParams.length) {
                matchFlag = true;
                for(var t in textSubParams) {
                    if(!matchFlag)
                        break;
                    matchFlag = false;
                    var textSubParam = textSubParams[t];
                    var blockSubParam = blockSubParams[t];
                    console.log("textSubParam", textSubParam);
                    console.log("blockSubParam", blockSubParam);
                    if(!textSubParam && !blockSubParam) {
                        matchFlag = true;
                    }
                    else if(typeof textSubParam !== "object") {
                        if(textSubParam == blockSubParam) {
                            matchFlag = true;
                        }
                    }
                    else if(textSubParam.name) {
                        console.log("paramInfo", paramInfo);
                        var paramKey = textSubParam.name;
                        var paramBlockType = paramInfo[paramKey];
                        console.log("blockSubParam.data.type", blockSubParam.data.type, "paramBlockType", paramBlockType);
                        if(paramBlockType) {
                            if(blockSubParam.data.type == paramBlockType)
                                matchFlag = true;
                        } else {
                            if(textSubParam.params[0] == blockSubParam.data.params[0])
                                matchFlag = true;
                        }
                    }
                    else if(textSubParam.type == "True" || textSubParam.type == "False") {
                        if(blockSubParam.data) {
                            if(textSubParam.type == blockSubParam.data.type) {
                                 matchFlag = true;
                            }
                        }
                        else if(textSubParam.type == blockSubParam.type) {
                            matchFlag = true;
                        }
                    }
                    else if(textSubParam.type && textSubParam.params) {
                        matchFlag = this.isFuncContentsParamsMatch(blockSubParam, textSubParam, paramMap, paramInfo);
                    }
                }
            }
            else {
                matchFlag = false;
            }
        }
        else {
                matchFlag = false;
        }

        console.log("isFuncContentsParamsMatch result matchFlag", matchFlag);

        return matchFlag;
    };

    tu.isParamBlock = function(block) {
        var type = block.type;
        if(type == "ai_boolean_distance" ||
            type == "ai_distance_value" ||
            type == "ai_boolean_object" ||
            type == "ai_boolean_and") {
            return true;
        } else {
            return false;
        }
    };

    tu.hasBlockInfo = function(data, blockInfo) {
        var result = false;
        for(var key in blockInfo) {
            var info = blockInfo[key];
            if(key == data.type) {
                for(var j in info) {
                    var loc = info[j];
                    if(loc.start == data.start && loc.end == data.end) {
                       result = true;
                       break;
                    }
                }
            }
        }

        return result;
    };

    tu.makeParamBlock = function(targetBlock, paramInfo) {
        console.log("targetBlock", targetBlock);
        var params = targetBlock.params;
        console.log("makeParamBlock params", params);


        for(var p in params) {
            var param = params[p];
            console.log("makeParamBlock param", param);
            if(!param)
                continue;

            if(typeof param != "object")
                continue;

            if(param.type && param.params) {
                this.makeParamBlock(param, paramInfo);
            }
            else if(param.name) {
                var paramKey = param.name;
                var paramBlockType = paramInfo[paramKey];
                console.log("paramBlockType2", paramBlockType);
                if(paramBlockType) {
                    var paramBlock = {};
                    paramBlock.type = paramBlockType;
                    paramBlock.params = [];

                    params[p] = paramBlock;
                }
            }
        }

        if(targetBlock.statements && targetBlock.statements[0]) {
            var statements = targetBlock.statements[0];
            for(var s in statements) {
                var statement = statements[s];
                this.makeParamBlock(statement, paramInfo);
            }
        }

        if(targetBlock.statements && targetBlock.statements[1]) {
            var statements = targetBlock.statements[1];
            for(var s in statements) {
                var statement = statements[s];
                this.makeParamBlock(statement, paramInfo);
            }
        }

    };

    tu.updateBlockInfo = function(data, blockInfo) {
        var infoArr = blockInfo[data.type];
        if(infoArr && Array.isArray(infoArr) && infoArr.legnth != 0) {
            for(var i in infoArr) {
                var info = infoArr[i];
                if(info.start == data.start && info.end == data.end) {
                    break;
                }
                else {
                    var loc = {};
                    loc.start = data.start;
                    loc.end = data.end;

                    infoArr.push(loc);
                }
            }
        } else {
            blockInfo[data.type] = [];

            var loc = {};
            loc.start = data.start;
            loc.end = data.end;

            blockInfo[data.type].push(loc);
        }
    };

    tu.assembleRepeatWhileTrueBlock = function(block, syntax) {
        console.log("assembleRepeatWhileTrueBlock >>", "block", block.data.type, "syntax", syntax);
        var result = '';
        if(block.data.type == "repeat_while_true") {
            var blockArr = syntax.split(" ");
            var lastIndex = blockArr.length-1;
            var option = blockArr[lastIndex];
            console.log("option", option, "option.length", option.length);

            if(option == 'until') {
                var condition = "not";
                blockArr.splice(1, 0, condition);
                lastIndex += 1;
                blockArr.splice(lastIndex, 1);
                result = blockArr.join(" ");
            }
            else if(option == 'while') {
                blockArr.splice(lastIndex, 1);
                result = blockArr.join(" ");
            }
            else {
                result = syntax;
            }
        }
        else {
            result = syntax;
        }

        console.log("assembleRepeatWhileTrueBlock result", result);

        return result;
    };

    tu.isJudgementBlock = function(blockType) {
        if(blockType == "is_clicked" ||
            blockType == "is_press_some_key" ||
            blockType == "reach_something" ||
            blockType == "boolean_basic_operator" ||
            blockType == "boolean_and" ||
            blockType == "boolean_or" ||
            blockType == "boolean_not") {

            return true;
        }

        return false;
    };

    tu.isCalculationBlock = function(blockType) {
        if(blockType == "calc_basic" ||
            blockType == "calc_rand" ||
            blockType == "coordinate_mouse" ||
            blockType == "coordinate_object" ||
            blockType == "get_sound_volume" ||
            blockType == "quotient_and_mod" ||
            blockType == "calc_operation" ||
            blockType == "get_project_timer_value" ||
            blockType == "get_date" ||
            blockType == "distance_something" ||
            blockType == "get_sound_duration" ||
            blockType == "length_of_string" ||
            blockType == "combine_something" ||
            blockType == "char_at" ||
            blockType == "substring" ||
            blockType == "index_of_string" ||
            blockType == "replace_string" ||
            blockType == "change_string_case") {

            return true;
        }

        return false;
    };

    tu.isVariableDeclarationBlock = function(blockType) {
         if(blockType == "set_variable")
            return true;

        return false;
    };

    tu.isHWParamBlock = function(blockType) {
        if(blockType == "hamster_hand_found" ||
            blockType == "hamster_value" ||
            blockType == "arduino_get_port_number" ||
            blockType == "arduino_get_number_sensor_value" ||
            blockType == "arduino_get_digital_value" ||
            blockType == "arduino_convert_scale" ||
            blockType == "arduino_ext_get_analog_value" ||
            blockType == "arduino_ext_get_analog_value_map" ||
            blockType == "arduino_ext_get_ultrasonic_value" ||
            blockType == "arduino_ext_get_digital" ||
            blockType == "arduino_ext_tone_list" ||
            blockType == "arduino_ext_octave_list") {

            return true;
        }

        return false;
    };

    tu.isMaterialBlock = function(blockType) {
        if(blockType == "get_canvas_input_value" ||
            blockType == "get_variable" ||
            blockType == "value_of_index_from_list" ||
            blockType == "length_of_list" ||
            blockType == "is_included_in_list") {

            return true;
        }

        return false;
    };

    tu.jsAdjustSyntax = function(block, syntax) {
        var result = '';
        if(block.data.type == 'ai_boolean_distance') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            secondParam = this.bTojBinaryOperatorConvertor(secondParam);
            var thirdParam = tokens[2];

            result = firstParam + ' ' + secondParam + ' ' + thirdParam;

        } else if(block.data.type == 'ai_boolean_object') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');
            var secondParam = tokens[1];
            var thirdParam = tokens[2];

            result = firstParam + ' ' + secondParam + ' ' + thirdParam;
        } else if(block.data.type == 'ai_distance_value') {
            var tokens = syntax.split(' ');
            var firstParam = tokens[0].split('_');
            var value = firstParam[1];
            firstParam[1] = firstParam[1].substring(1, firstParam[1].length-1);
            firstParam[1] = firstParam[1].toLowerCase();
            firstParam = firstParam.join('_');

            result = firstParam;
        } else {
            result = syntax;
        }

        return result;
    };

    tu.bTojBinaryOperatorConvertor = function(operator) {
        var result;
        switch(operator) {
            case '\'BIGGER\'': result = ">"; break;
            case '\'BIGGER_EQUAL\'': result = ">="; break;
            case '\'EQUAL\'': result = "=="; break;
            case '\'SMALLER\'': result = "<"; break;
            case '\'SMALLER_EQUAL\'': result = "<="; break;
        }

        return result;
    };

    tu.jTobBinaryOperatorConvertor = function(operator) {
        var result;
        switch(operator) {
            case '>': result = "BIGGER"; break;
            case '>=': result = "BIGGER_EQUAL"; break;
            case '==': result = "EQUAL"; break;
            case '<': result = "SMALLER"; break;
            case '<=': result = "SMALLER_EQUAL"; break;
        }

        return result;
    };

    tu.radarVariableConvertor = function(variable) {
        var items = variable.split('_');
        var result = items[1].toUpperCase();

        return result;
    };

    tu.tTobDropdownValueConvertor = function(value) {
        var result;
        if(value == "stone") {
            result = "OBSTACLE";
        } else if(value == "wall") {
            result = value.toUpperCase();
        } else if(value == "item") {
            result = value.toUpperCase();
        } else {
            result = value;
        }

        return result;
    };

    tu.canConvertTextModeForOverlayMode = function(convertingMode) {
        var message;
        var oldMode = Entry.getMainWS().oldMode;

        if(oldMode == Entry.Workspace.MODE_OVERLAYBOARD && convertingMode == Entry.Workspace.MODE_VIMBOARD) {
            message = Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_EDITOR];
            return message;
        }

        return message;
    };

    tu.isNamesIncludeSpace = function() {
        var vc = Entry.variableContainer;
        if(!vc)
            return;
        //inspect variables
        var targets = vc.variables_ || [];
        for (var i=0; i<targets.length; i++) {
            if (test(targets[i].name_)) {
                console.log("vari here"); 
                return Lang.TextCoding[Entry.TextCodingError.ALERT_VARIABLE_EMPTY_TEXT];
            }
        }

        //inspect lists
        targets = vc.lists_ || [];
        for (i=0; i<targets.length; i++) {
            if (test(targets[i].name_))
                return Lang.TextCoding[Entry.TextCodingError.ALERT_LIST_EMPTY_TEXT];
        }

        //this doesn't need for now
        //inspect messages
        /*targets = vc.messages_ || [];
        for (i=0; i<targets.length; i++) {
            if (test(targets[i].name_))
                return "메시지 이름이 공백 포함";
        }*/

        //inspect functions
        targets = vc.functions_ || {};
        for (i in targets) {
            var target = targets[i];
            console.log("function space", target);

            var funcThread = target.content._data[0];
            var funcBlock = funcThread._data[0];
            if(funcBlock.data.type == "function_create") {
                if(funcBlock.params.length == 2) {
                    var paramBlock = funcBlock.params[0];
                    if(paramBlock.data.type == "function_field_label") {
                        var paramBlockParams = paramBlock.data.params; 
                        if(paramBlockParams.length == 2) {
                            if(paramBlockParams[1] == undefined) {
                                var name = paramBlockParams[0];
                                if (test(name))
                                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_EMPTY_TEXT];
                            }
                            else {
                                if(paramBlockParams[1].data.type == "function_field_label") {
                                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_FIELD_MULTI];
                                }
                            }
                        }
                        else {
                            return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
                        }
                    }
                    else {
                        return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
                    }
                } else {
                    return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
                }
            } else {
                return Lang.TextCoding[Entry.TextCodingError.ALERT_FUNCTION_NAME_DISORDER];
            }
        }

        return false;
        function test(name) {
            return / /.test(name);
        }
    };

    tu.addFuncParam = function(param) {
        this._funcParams.push(param);
    };

    tu.clearFuncParam = function() {
        this._funcParams = [];
    };

    tu.isFuncParam = function(paramName) {
        var result = false;
        console.log("isFuncParam", this._funcParams);

        var funcParams = this._funcParams;

        if(funcParams.length == 0)
            return false;

        for(var p in funcParams) {
            var funcParam = funcParams[p];
            if(funcParam == paramName) {
                result = true;
                break;
            }
        }

        return result;
    };

    tu.makeExpressionStatementForEntryEvent = function(calleName, arg) {
        var expressionStatement = {};

        var type = "ExpressionStatement";
        var expression = {};

        expression.type = "CallExpression";

        var callee = {};
        callee.name = calleName;
        callee.type = "Identifier";
        expression.callee = callee;

        var arguments = [];
        var argument = {};
        argument.type = "Literal";
        argument.value = arg;
        arguments.push(argument);
        expression.arguments = arguments;

        expressionStatement.expression = expression;
        expressionStatement.type = type;

        return expressionStatement;
    };

    tu.setMathParams = function(propertyName, params) {
        var optionParam;

        if(propertyName == "pow") {
            optionParam = "square";
            params[3] = optionParam;
        }
        else if(propertyName == "sqrt") {
            optionParam = "root";
            params[3] = optionParam;
        }
        else if(propertyName == "sin") {
            optionParam = "sin";
            params[3] = optionParam;
        }
        else if(propertyName == "cos") {
            optionParam = "cos";
            params[3] = optionParam;
        }
        else if(propertyName == "tan") {
            optionParam = "tan";
            params[3] = optionParam;
        }
        else if(propertyName == "asin") {
            optionParam = "asin_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "acos") {
            optionParam = "acos_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "atan") {
            optionParam = "atan_radian";
            params[3] = optionParam;
        }
        else if(propertyName == "log") {
            optionParam = "ln";
            params[3] = optionParam;
        }
        else if(propertyName == "log10") {
            optionParam = "log";
            params[3] = optionParam;
        }
        else if(propertyName == "floor") {
            optionParam = "floor";
            params[3] = optionParam;
        }
        else if(propertyName == "ceil") {
            optionParam = "ceil";
            params[3] = optionParam;
        }
        else if(propertyName == "round") {
            optionParam = "round";
            params[3] = optionParam;
        }
        else if(propertyName == "factorial") {
            optionParam = "factorial";
            params[3] = optionParam;
        }
        else if(propertyName == "fabs") {
            optionParam = "abs";
            params[3] = optionParam;
        }

        return optionParam;
    };

    tu.isMathExpression = function(text) {
        var textTokens = text.split("(");
        var textName = textTokens[0];

        console.log("isMathExpression textName", textName);
        if(textName == "Entry.math_operation")
            return true;

        return false;
    };

    tu.makeMathExpression = function(text) {
        console.log("makeMathExpression text", text);
        var result = text;
        var textTokens = text.split("(");
        var paramsParts = textTokens[1];
        var paramsTokens = paramsParts.split(",");
        var mathValue = paramsTokens[0];
        var mathOption = paramsTokens[1];

        mathOption = mathOption.substring(2, mathOption.length-2).trim();

        console.log("makeMathExpression mathOption", mathOption);

        if(mathOption == "square") {
            mathProperty = "pow";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "root") {
            mathProperty = "sqrt";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "sin") {
            mathProperty = "sin";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "cos") {
            mathProperty = "cos";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "tan") {
            mathProperty = "tan";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "asin_radian") {
            mathProperty = "asin";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "acos_radian") {
            mathProperty = "acos";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "atan_radian") {
            mathProperty = "atan";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "ln") {
            mathProperty = "log";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "log") {
            mathProperty = "log10";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "floor") {
            mathProperty = "floor";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "ceil") {
            mathProperty = "ceil";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "round") {
            mathProperty = "round";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "factorial") {
            mathProperty = "factorial";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }
        else if(mathOption == "abs") {
            mathProperty = "fabs";
            var mathText = "math" + "." + mathProperty;
            result = mathText + "(" + mathValue + ")";
        }

        console.log("makeMathExpression result", result);

        return result;
    };

    tu.generateVariablesDeclaration = function() {
        var result = "";
        var currentObject = Entry.playground.object;
        var vc = Entry.variableContainer;
        if(!vc)
            return;
        //inspect variables
        var targets = vc.variables_ || [];
        for (var i=targets.length-1; i>=0; i--) { 
            var v = targets[i];
            var name = v.name_;
            var value = v.value_;
            if(v.object_) {
                if(v.object_ == currentObject.id) {
                    name = "self." + name; 
                }
                else
                    continue;
            }

            if(typeof value === "string")
                value = '"()"'.replace('()', value);
            
            result += name + " = " + value + "\n";
        }

        return result;
    };

    tu.generateListsDeclaration = function() {
        var result = "";
        var currentObject = Entry.playground.object;
        var vc = Entry.variableContainer;
        if(!vc)
            return;

        //inspect lists
        targets = vc.lists_ || [];
        for (var i=targets.length-1; i>=0; i--) {
            var l = targets[i];
            var name = l.name_;
            if(l.object_) {
                if(l.object_ == currentObject.id) {
                    name = "self." + name;
                }
                else
                    continue;
            }
            var value = "";
            var lArray = l.array_;

            for(var va in lArray) {
                var vItem = lArray[va];
                var data = vItem.data;
                var pData = parseInt(data);
                if(!isNaN(pData))
                    data = pData;
                if(typeof data === "string")
                    data = "\"" + data + "\"";
                value += data;
                if(va != lArray.length-1)
                    value += ", ";
            }

            result += name + " = [" + value + "]" + "\n";
        }

        return result;
    };

    tu.isVariableNumber = function(id, type) {
        console.log("isVariableNumber", id, type);
        var currentObject = Entry.playground.object;
        var entryVariables = Entry.variableContainer.variables_;
        for(var i in entryVariables) {
            var entryVariable = entryVariables[i];
            if(type == "global") {
                if(entryVariable.object_ === null && entryVariable.id_ == id) {
                    if(!isNaN(entryVariable.value_))
                        return true;
                }
            }
            else if(type == "local") {
                if(entryVariable.object_ === currentObject.id && entryVariable.id_ == id) {
                    if(!isNaN(entryVariable.value_))
                        return true;
                }
            }

        }

        return false;
    };
})(Entry.TextCodingUtil);
