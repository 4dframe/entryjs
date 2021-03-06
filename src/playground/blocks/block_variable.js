export default {
    getBlocks() {
        return {
            variableAddButton: {
                skeleton: 'basic_button',
                color: '#eee',
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.variable_create,
                        color: '#333',
                        align: 'center',
                    },
                ],
                def: {
                    type: 'variableAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.variableContainer.openVariableAddPanel(
                                'variable'
                            );
                        },
                    ],
                },
                syntax: { js: [], py: [''] },
            },
            listAddButton: {
                skeleton: 'basic_button',
                color: '#eee',
                params: [
                    {
                        type: 'Text',
                        text: Lang.Workspace.create_list_block,
                        color: '#333',
                        align: 'center',
                    },
                ],
                def: {
                    type: 'listAddButton',
                },
                events: {
                    mousedown: [
                        function() {
                            Entry.variableContainer.openVariableAddPanel(
                                'list'
                            );
                        },
                    ],
                },
            },
            ask_and_wait: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            if (Entry.container)
                                Entry.container.showProjectAnswer();
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container)
                                Entry.container.hideProjectAnswer(
                                    block,
                                    notIncludeSelf
                                );
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: [Lang.Blocks.block_hi],
                        },
                        null,
                    ],
                    type: 'ask_and_wait',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'ask_and_wait',
                },
                paramsKeyMap: {
                    VALUE: 0,
                },
                class: 'ask',
                isNotFor: [],
                func: function(sprite, script) {
                    var inputModel = Entry.container.inputValue,
                        inputView = Entry.stage.inputField,
                        /*message = script.getValue("VALUE", script);
        
                    if (!message)
                        throw new Error('message can not be empty');
        
                    if (inputModel.sprite == sprite &&
                        inputView && !inputView._isHidden) {
                            return script;
                        } else if (inputModel.sprite != sprite && script.isInit) {
                            if(sprite.dialog)
                                sprite.dialog.remove();
                            delete script.isInit;
                            return script.callReturn();
                        } else if (inputModel.complete &&
                                   inputModel.sprite == sprite &&
                                   inputView._isHidden && script.isInit) {
                                       if(sprite.dialog)
                                           sprite.dialog.remove();
                                       delete inputModel.complete;
                                       delete script.isInit;
                                       return script.callReturn();
                                   } else {
                                       message = Entry.convertToRoundedDecimals(message, 3);
                                       new Entry.Dialog(sprite, message, 'speak');
                                       Entry.stage.showInputField();
                                       inputModel.script = script;
                                       inputModel.sprite = sprite;
                                       script.isInit = true;
                                       return script;
                                   }*/

                        message = script.getValue('VALUE', script);

                    if (!message) throw new Error('message can not be empty');

                    if (
                        inputModel.sprite == sprite &&
                        inputView &&
                        !inputView._isHidden
                    ) {
                        return script;
                    } else if (inputModel.sprite != sprite && script.isInit) {
                        if (sprite.dialog) sprite.dialog.remove();
                        delete script.isInit;
                        return script.callReturn();
                    } else if (
                        inputModel.complete &&
                        inputModel.sprite == sprite &&
                        inputView._isHidden &&
                        script.isInit
                    ) {
                        if (sprite.dialog) sprite.dialog.remove();
                        delete inputModel.complete;
                        delete script.isInit;
                        return script.callReturn();
                    } else {
                        message = Entry.convertToRoundedDecimals(message, 3);
                        Entry.stage.showInputField();
                        new Entry.Dialog(sprite, message, 'ask');
                        inputModel.script = script;
                        inputModel.sprite = sprite;
                        inputModel.complete = false;
                        script.isInit = true;
                        return script;
                    }
                },
                syntax: { js: [], py: ['Entry.input(%1)'] },
            },
            get_canvas_input_value: {
                color: '#E457DC',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_get_canvas_input_value,
                        color: '#fff',
                    },
                ],
                events: {
                    viewAdd: [
                        function() {
                            if (Entry.container)
                                Entry.container.showProjectAnswer();
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container)
                                Entry.container.hideProjectAnswer(
                                    block,
                                    notIncludeSelf
                                );
                        },
                    ],
                },
                def: {
                    params: [null],
                    type: 'get_canvas_input_value',
                },
                class: 'ask',
                isNotFor: [],
                func: function(sprite, script) {
                    return Entry.container.getInputValue();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            template: '%1',
                            syntax: 'Entry.answer()',
                            blockType: 'param',
                            textParams: [
                                {
                                    type: 'Text',
                                    text: 'Entry.answer()',
                                    color: '#fff',
                                },
                            ],
                        },
                    ],
                },
            },
            set_visible_answer: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Dropdown',
                        options: [
                            [Lang.Blocks.CALC_timer_visible_show, 'SHOW'],
                            [Lang.Blocks.CALC_timer_visible_hide, 'HIDE'],
                        ],
                        value: 'SHOW',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    viewAdd: [
                        function(block) {
                            if (Entry.container)
                                Entry.container.showProjectAnswer();
                        },
                    ],
                    viewDestroy: [
                        function(block, notIncludeSelf) {
                            if (Entry.container)
                                Entry.container.hideProjectAnswer(
                                    block,
                                    notIncludeSelf
                                );
                        },
                    ],
                },
                def: {
                    params: ['HIDE', null],
                    type: 'set_visible_answer',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'set_visible_answer',
                },
                paramsKeyMap: {
                    BOOL: 0,
                },
                class: 'ask',
                isNotFor: [],
                func: function(sprite, script) {
                    var bool = script.getField('BOOL', script);
                    if (bool == 'HIDE')
                        Entry.container.inputValue.setVisible(false);
                    else Entry.container.inputValue.setVisible(true);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.answer_view(%1)',
                            textParams: [
                                {
                                    type: 'Dropdown',
                                    options: [
                                        [
                                            Lang.Blocks.CALC_timer_visible_show,
                                            'SHOW',
                                        ],
                                        [
                                            Lang.Blocks.CALC_timer_visible_hide,
                                            'HIDE',
                                        ],
                                    ],
                                    value: 'SHOW',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnStringValueLowerCase,
                                    codeMap:
                                        'Entry.CodeMap.Entry.set_visible_answer[0]',
                                },
                            ],
                        },
                    ],
                },
            },
            get_variable: {
                color: '#E457DC',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_get_variable_1,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null],
                    type: 'get_variable',
                },
                pyHelpDef: {
                    params: ['A&value'],
                    type: 'get_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func: function(sprite, script) {
                    var variableId = script.getField('VARIABLE', script);
                    var variable = Entry.variableContainer.getVariable(
                        variableId,
                        sprite
                    );
                    return variable.getValue();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1',
                            passTest: true,
                            keyOption: 'get_variable',
                            blockType: 'param',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            change_variable: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'change_variable',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'change_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                    VALUE: 1,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func: function(sprite, script) {
                    var variableId = script.getField('VARIABLE', script);
                    var value = script.getValue('VALUE', script);
                    var fixed = 0;

                    if (value == false && typeof value == 'boolean')
                        throw new Error('Type is not correct');

                    var variable = Entry.variableContainer.getVariable(
                        variableId,
                        sprite
                    );
                    var variableValue = variable.getValue();
                    var sumValue;
                    if (Entry.Utils.isNumber(value) && variable.isNumber()) {
                        value = Entry.parseNumber(value);
                        variableValue = Entry.parseNumber(variableValue);
                        fixed = Entry.getMaxFloatPoint([
                            value,
                            variable.getValue(),
                        ]);
                        sumValue = new BigNumber(value)
                            .plus(variableValue)
                            .toNumber()
                            .toFixed(fixed);
                    } else {
                        sumValue = '' + variableValue + value;
                    }

                    variable.setValue(sumValue);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1 += %2',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                        {
                            syntax: '%1 = %1 + %2',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            set_variable: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'set_variable',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'set_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                    VALUE: 1,
                },
                class: 'variable',
                isNotFor: ['variableNotExist'],
                func: function(sprite, script) {
                    var variableId = script.getField('VARIABLE', script);
                    var value = script.getValue('VALUE', script);
                    var variable = Entry.variableContainer.getVariable(
                        variableId,
                        sprite
                    );
                    variable.setValue(value);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1 = %2',
                            passTest: true,
                            blockType: 'variable',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            show_variable: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'show_variable',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'show_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable_visibility',
                isNotFor: ['variableNotExist'],
                func: function(sprite, script) {
                    var variableId = script.getField('VARIABLE', script);
                    var variable = Entry.variableContainer.getVariable(
                        variableId,
                        sprite
                    );
                    variable.setVisible(true);
                    variable.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.show_variable(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            hide_variable: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'variables',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'hide_variable',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'hide_variable',
                },
                paramsKeyMap: {
                    VARIABLE: 0,
                },
                class: 'variable_visibility',
                isNotFor: ['variableNotExist'],
                func: function(sprite, script) {
                    var variableId = script.getField('VARIABLE', script);
                    var variable = Entry.variableContainer.getVariable(
                        variableId,
                        sprite
                    );
                    variable.setVisible(false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.hide_variable(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'variables',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            value_of_index_from_list: {
                color: '#E457DC',
                fontColor: '#fff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_2,
                        color: 'white',
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_value_of_index_from_list_3,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        null,
                        null,
                        {
                            type: 'number',
                            params: ['1'],
                        },
                    ],
                    type: 'value_of_index_from_list',
                },
                pyHelpDef: {
                    params: [
                        null,
                        'A&value',
                        null,
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                    ],
                    type: 'value_of_index_from_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                    INDEX: 3,
                },
                class: 'list_element',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var index = script.getValue('INDEX', script);
                    var list = Entry.variableContainer.getList(listId, sprite);
                    index = Entry.getListRealIndex(index, list);

                    if (
                        !list.array_ ||
                        !Entry.Utils.isNumber(index) ||
                        index > list.array_.length
                    )
                        throw new Error('can not insert value to array');

                    return list.array_[index - 1].data;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2[%4]',
                            passTest: true,
                            blockType: 'param',
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                undefined,
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                            ],
                        },
                    ],
                },
            },
            add_value_to_list: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                        null,
                    ],
                    type: 'add_value_to_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        'A&value',
                        null,
                    ],
                    type: 'add_value_to_list',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var value = script.getValue('VALUE', script);
                    var list = Entry.variableContainer.getList(listId, sprite);

                    if (!list.array_) list.array_ = [];
                    list.array_.push({ data: value });
                    list.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            passTest: true,
                            syntax: '%2.append(%1)',
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            remove_value_from_list: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'number',
                            params: ['1'],
                        },
                        null,
                        null,
                    ],
                    type: 'remove_value_from_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'number',
                            params: ['B&value'],
                        },
                        'A&value',
                        null,
                    ],
                    type: 'remove_value_from_list',
                },
                paramsKeyMap: {
                    VALUE: 0,
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var value = script.getValue('VALUE', script);
                    var list = Entry.variableContainer.getList(listId, sprite);

                    if (
                        !list.array_ ||
                        !Entry.Utils.isNumber(value) ||
                        value > list.array_.length
                    )
                        throw new Error('can not remove value from array');

                    list.array_.splice(value - 1, 1);

                    list.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2.pop(%1)',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            insert_value_to_list: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        null,
                    ],
                    type: 'insert_value_to_list',
                },
                pyHelpDef: {
                    params: [
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        null,
                    ],
                    type: 'insert_value_to_list',
                },
                paramsKeyMap: {
                    DATA: 0,
                    LIST: 1,
                    INDEX: 2,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var data = script.getValue('DATA', script);
                    var index = script.getValue('INDEX', script);
                    var list = Entry.variableContainer.getList(listId, sprite);

                    if (
                        !list.array_ ||
                        !Entry.Utils.isNumber(index) ||
                        index == 0 ||
                        index > list.array_.length + 1
                    )
                        throw new Error('can not insert value to array');

                    list.array_.splice(index - 1, 0, { data: data });
                    list.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%2.insert(%3, %1)',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                            ],
                        },
                    ],
                },
            },
            change_value_list_index: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Block',
                        isListIndex: true,
                        accept: 'string',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        {
                            type: 'text',
                            params: ['1'],
                        },
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'change_value_list_index',
                },
                pyHelpDef: {
                    params: [
                        'A&value',
                        {
                            type: 'text',
                            params: ['B&value'],
                        },
                        {
                            type: 'text',
                            params: ['C&value'],
                        },
                        null,
                    ],
                    type: 'change_value_list_index',
                },
                paramsKeyMap: {
                    LIST: 0,
                    INDEX: 1,
                    DATA: 2,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var data = script.getValue('DATA', script);
                    var index = script.getValue('INDEX', script);
                    var list = Entry.variableContainer.getList(listId, sprite);

                    if (
                        !list.array_ ||
                        !Entry.Utils.isNumber(index) ||
                        index > list.array_.length
                    )
                        throw new Error('can not insert value to array');

                    list.array_[index - 1].data = data;
                    list.updateView();
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%1[%2] = %3',
                            passTest: true,
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                    paramType: 'index',
                                },
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            length_of_list: {
                color: '#E457DC',
                fontColor: '#fff',
                skeleton: 'basic_string_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_length_of_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_length_of_list_2,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null, null, null],
                    type: 'length_of_list',
                },
                pyHelpDef: {
                    params: [null, 'A&value', null],
                    type: 'length_of_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var list = Entry.variableContainer.getList(listId, sprite);

                    return list.array_.length;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'len(%2)',
                            blockType: 'param',
                            passTest: true,
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            is_included_in_list: {
                color: '#E457DC',
                fontColor: '#fff',
                skeleton: 'basic_boolean_field',
                statements: [],
                params: [
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_1,
                        color: 'white',
                    },
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_2,
                        color: 'white',
                    },
                    {
                        type: 'Block',
                        accept: 'string',
                    },
                    {
                        type: 'Text',
                        text: Lang.Blocks.VARIABLE_is_included_in_list_3,
                        color: 'white',
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [
                        null,
                        null,
                        null,
                        {
                            type: 'text',
                            params: ['10'],
                        },
                        null,
                    ],
                    type: 'is_included_in_list',
                },
                pyHelpDef: {
                    params: [
                        null,
                        'B&value',
                        null,
                        {
                            type: 'text',
                            params: ['A&value'],
                        },
                        null,
                    ],
                    type: 'is_included_in_list',
                },
                paramsKeyMap: {
                    LIST: 1,
                    DATA: 3,
                },
                class: 'list',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var data = script.getStringValue('DATA', script);
                    var list = Entry.variableContainer.getList(listId, sprite);
                    if (!list) return false;
                    var arr = list.array_;

                    for (var i = 0, len = arr.length; i < len; i++) {
                        if (arr[i].data.toString() == data.toString())
                            return true;
                    }
                    return false;
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: '%4 in %2',
                            blockType: 'param',
                            passTest: true,
                            textParams: [
                                undefined,
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters
                                            .returnRawStringKey,
                                },
                                undefined,
                                {
                                    type: 'Block',
                                    accept: 'string',
                                },
                            ],
                        },
                    ],
                },
            },
            show_list: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'show_list',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'show_list',
                },
                paramsKeyMap: {
                    LIST: 0,
                },
                class: 'list_visibility',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var list = Entry.variableContainer.getList(listId);

                    list.setVisible(true);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.show_list(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
            hide_list: {
                color: '#E457DC',
                skeleton: 'basic',
                statements: [],
                params: [
                    {
                        type: 'DropdownDynamic',
                        value: null,
                        menuName: 'lists',
                        fontSize: 11,
                        arrowColor: EntryStatic.ARROW_COLOR_VARIABLE,
                    },
                    {
                        type: 'Indicator',
                        img: 'block_icon/variable_03.png',
                        size: 12,
                    },
                ],
                events: {
                    dataAdd: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.addRef('_variableRefs', block);
                        },
                    ],
                    dataDestroy: [
                        function(block) {
                            var vc = Entry.variableContainer;
                            if (vc) vc.removeRef('_variableRefs', block);
                        },
                    ],
                },
                def: {
                    params: [null, null],
                    type: 'hide_list',
                },
                pyHelpDef: {
                    params: ['A&value', null],
                    type: 'hide_list',
                },
                paramsKeyMap: {
                    LIST: 0,
                },
                class: 'list_visibility',
                isNotFor: ['listNotExist'],
                func: function(sprite, script) {
                    var listId = script.getField('LIST', script);
                    var list = Entry.variableContainer.getList(listId);

                    list.setVisible(false);
                    return script.callReturn();
                },
                syntax: {
                    js: [],
                    py: [
                        {
                            syntax: 'Entry.hide_list(%1)',
                            textParams: [
                                {
                                    type: 'DropdownDynamic',
                                    value: null,
                                    menuName: 'lists',
                                    fontSize: 11,
                                    arrowColor:
                                        EntryStatic.ARROW_COLOR_VARIABLE,
                                    converter:
                                        Entry.block.converters.returnStringKey,
                                },
                            ],
                        },
                    ],
                },
            },
        };
    }
}
