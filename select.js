var Select = (function (Select) {
    var typeOpt = {
        selectedList: 'string',
        selectedLabel: 'string',
        selectedValue: 'string',
        selectedImage: 'string',
        selectedDesc: 'string',
        optionList: 'string',
        optionListItem: 'string',
        visibleLabel: 'boolean',
        visibleValue: 'boolean',
        visibleImage: 'boolean',
        visibleDesc: 'boolean',
        change: 'function'
    },
    errorMsg = {
        wrongType: function (params) {
            return `This ${params} options's type is wrong.`
        },
        notDefined: function (params) {
            return `This ${params} is not defined.`
        },
    };
    var utils = (function () {
        function selector(id, selector) {
            const result = document.querySelectorAll(`#${id} ${selector}`);
            if(result.length === 1) {
                return result[0];
            } else {
                return result;
            }
        }
        function exceptNull(key) {
            return this.opt[key] ? `.${this.opt[key]}` : `.${key}`;
        }
        function findIdx(value) {
            var i = this.options.length,
                index = 0;
            while (i--) {
                if (this.options[i].value === value) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        function open() {
            this.active = true;
            this.elementSelect.classList.add(this.activeClass);
            this.elementOptionList.style.display = 'block';
            this.elementOptionList.style.zIndex = '2';
            this.elementOptionList.style.position = 'relative';
            this.elementDim.style.display = 'block';
        }
        function select(index) {
            this.index = index;
            this.value = this.options[index].value;

            if (!!this.opt.visibleLabel) utils.innerText(this.elementSelectedLabel, this.options[index].label);
            if (!!this.opt.visibleValue) utils.innerText(this.elementSelectedValue, this.options[index].value);
            if (!!this.opt.visibleDesc) utils.innerText(this.elementSelectedDesc, this.options[index].desc);
            if (!!this.opt.visibleImage) utils.setAttribute(this.elementSelectedImage, 'src', this.options[index].image);

            utils.close.call(this);
            this.change();
        }

        function innerText(el, text) {
            el.innerText = text;
        }
        function setAttribute(el, type, src) {
            el.setAttribute(type, src);
        }
        function close() {
            this.active = false;
            this.elementSelect.classList.remove(this.activeClass);
            this.elementOptionList.style.display = 'none';
            this.elementDim.style.display = 'none';
            this.elementOptionList.style.zIndex = null;
            this.elementOptionList.style.position = null
        }
        function makeDom(selector, tag, style) {
            var element = document.createElement(tag);
            element.setAttribute('style', style);
            selector.append(element);
            return element;
        }

        function addEvent(selector, fn) {
            var _this = this,i = selector.length;
            if (i > 1) {
                while (i--) {
                    function _fn() {
                        var index = utils.findIdx.call(_this, this.dataset.value);
                        fn(index);
                    }
                    selector[i].onclick =  _fn;
                }
            } else {
                function _fn() {
                    fn(fn);
                }
                selector.onclick = _fn;
            }
        }

        return {
            selector,
            exceptNull,
            open,
            select,
            close,
            findIdx,
            innerText,
            setAttribute,
            makeDom,
            addEvent
        };
    }());


    function Select(id, opt) {
        var _this = this;
        this.opt = {
            selectedList: 'selectedList',
            selectedLabel: 'selectedLabel',
            selectedValue: 'selectedValue',
            selectedImage: 'selectedImage',
            selectedDesc: 'selectedDesc',
            optionList: 'optionList',
            optionListItem: 'optionListItem',
            visibleLabel: true,
            visibleValue: false,
            visibleImage: false,
            visibleDesc: false,
        };
        Object.entries(opt).map(function (o) {
            if (typeOpt[o[0]] === undefined) {
                throw errorMsg.notDefined(o[0]);
            }
            if (typeOpt[o[0]] !== typeof o[1]) {
                throw errorMsg.wrongType(o[0]);
            }
            _this.opt[o[0]] = o[1];
        });
        this.active = false;
        this.id = id;
        this.elementSelect = document.getElementById(id);
        this.elementSelectedList = utils.selector(this.id, utils.exceptNull.call(this, this.opt.selectedList));

        (this.opt.visibleLabel) && (this.elementSelectedLabel = utils.selector(this.id, utils.exceptNull.call(this, this.opt.selectedLabel)));
        (this.opt.visibleValue) && (this.elementSelectedValue = utils.selector(this.id, utils.exceptNull.call(this, this.opt.selectedValue)));
        (this.opt.visibleImage) && (this.elementSelectedImage = utils.selector(this.id, utils.exceptNull.call(this, this.opt.selectedImage)));
        (this.opt.visibleDesc) && (this.elementSelectedDesc = utils.selector(this.id, utils.exceptNull.call(this, this.opt.selectedDesc)));
        this.elementOptionList = utils.selector(this.id, utils.exceptNull.call(this, this.opt.optionList));
        this.elementOptionListItems = utils.selector(this.id, utils.exceptNull.call(this, this.opt.optionListItem));
        this.elementDim = utils.makeDom(this.elementSelect, 'i', 'z-index: 1;position: fixed;top: 0;left: 0;display:none;width: 100%;height: 100%;');
        this.activeClass = utils.exceptNull.call(this, 'active');
        this.options = this.getOption();
        this.value = this.elementSelect.dataset.value ? this.elementSelect.dataset.value : this.options[0].value;
        this.index = utils.findIdx.call(this, this.value);
        this.close();
        this.setIndex(this.index);
        this.event();
    }

    Select.prototype.change = function (fn) {
        if (this.opt.change) {
            this.opt.change(this.get());
        } else if (fn) {
            this.opt.change = fn
        }
    }

    Select.prototype.update = function () {
        this.elementOptionListItems = utils.selector(this.id, utils.exceptNull.call(this, 'optionListItem'));
        this.options = this.getOption();
        this.event();
    }

    Select.prototype.get = function () {
        return this.options[this.index]
    }

    Select.prototype.getOption = function () {
        var i = this.elementOptionListItems.length;
        this.options = this.options ? this.options : [];
        while (i--) {
            var option = {};
            (this.elementOptionListItems[i].dataset.value) && (option.value = this.elementOptionListItems[i].dataset.value);
            (this.elementOptionListItems[i].dataset.label) && (option.label = this.elementOptionListItems[i].dataset.label);
            (this.elementOptionListItems[i].dataset.desc) && (option.desc = this.elementOptionListItems[i].dataset.desc);
            (this.elementOptionListItems[i].dataset.image) && (option.image = this.elementOptionListItems[i].dataset.image);
            this.options.unshift(option);
        }
        return this.options;
    }

    Select.prototype.event = function () {
        utils.addEvent.call(this, this.elementSelectedList, utils.open.bind(this));
        utils.addEvent.call(this, this.elementOptionListItems, utils.select.bind(this));
        utils.addEvent.call(this, this.elementDim, utils.close.bind(this));
    }

    Select.prototype.setValue = function (value) {
        var index = utils.findIdx.call(this, value);
        utils.select.call(this, index);
    }

    Select.prototype.setIndex = function (index) {
        utils.select.call(this, index);
    }

    Select.prototype.close = function () {
        utils.close.call(this);
    }

    Select.prototype.open = function () {
        utils.open.call(this)
    }

    return Select;
}(Select || {}));
var label = new Select('label', {
    change: function (e) {
        console.log(e)
    }
});
var labelDesc = new Select('labelDesc', {
    visibleDesc: true
});