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
            return document.querySelectorAll(`#${id} ${selector}`);
        }
        function exceptNull(_this, key) {
            return _this.opt[key] ? `.${_this.opt[key]}` : `.${key}`;
        }
        function findIdx(_this, value) {
            var i = _this.options.length,
                index = 0;
            while (i--) {
                if (_this.options[i].value === value) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        function open(_this) {
            _this.active = true;
            _this.elementSelect.classList.add(this.activeClass);
            _this.elementOptionList.style.display = 'block';
            _this.elementOptionList.style.zIndex = '2';
            _this.elementOptionList.style.position = 'relative';
            _this.elementDim.style.display = 'block';
        }
        function select(_this, index) {
            _this.index = index;
            _this.value = _this.options[index].value;

            if (!!_this.opt.visibleLabel) utils.innerText(_this.elementSelectedLabel, _this.options[index].label);
            if (!!_this.opt.visibleValue) utils.innerText(_this.elementSelectedValue, _this.options[index].value);
            if (!!_this.opt.visibleDesc) utils.innerText(_this.elementSelectedDesc, _this.options[index].desc);
            if (!!_this.opt.visibleImage) utils.setAttribute(_this.elementSelectedImage, 'src', _this.options[index].image);

            utils.close(_this);
            _this.change();
        }

        function innerText(el, text) {
            el.innerText = text;
        }
        function setAttribute(el, type, src) {
            el.setAttribute(type, src);
        }
        function close(_this) {
            _this.active = false;
            _this.elementSelect.classList.remove(this.activeClass);
            _this.elementOptionList.style.display = 'none';
            _this.elementDim.style.display = 'none';
            _this.elementOptionList.style.zIndex = null;
            _this.elementOptionList.style.position = null
        }
        function makeDom(selector, tag, style) {
            var element = document.createElement(tag);
            element.setAttribute('style', style);
            selector.append(element);
            return element;
        }

        function addEvent(_this, selector, fn) {
            var i = selector.length;
            if (i > 1) {
                while (i--) {
                    function _fn(el) {
                        var index = utils.findIdx(_this, el.target.dataset.value);
                        fn(_this, index);
                    }
                    selector[i].addEventListener('click', _fn, false);
                }
            } else {
                function _fn() {
                    fn(_this, fn);
                }
                selector.addEventListener('click', _fn, false);
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
        this.elementSelectedList = utils.selector(this.id, utils.exceptNull(this, this.opt.selectedList))[0];

        (this.opt.visibleLabel) && (this.elementSelectedLabel = utils.selector(this.id, utils.exceptNull(this, this.opt.selectedLabel))[0]);
        (this.opt.visibleValue) && (this.elementSelectedValue = utils.selector(this.id, utils.exceptNull(this, this.opt.selectedValue))[0]);
        (this.opt.visibleImage) && (this.elementSelectedImage = utils.selector(this.id, utils.exceptNull(this, this.opt.selectedImage))[0]);
        (this.opt.visibleDesc) && (this.elementSelectedDesc = utils.selector(this.id, utils.exceptNull(this, this.opt.selectedDesc))[0]);
        this.elementOptionList = utils.selector(this.id, utils.exceptNull(this, this.opt.optionList))[0];
        this.elementOptionListItems = utils.selector(this.id, utils.exceptNull(this, this.opt.optionListItem));
        this.elementDim = utils.makeDom(this.elementSelect, 'i', 'z-index: 1;position: fixed;top: 0;left: 0;display:none;width: 100%;height: 100%;');
        this.activeClass = utils.exceptNull(this, 'active');
        this.options = this.getOption();
        this.value = this.elementSelect.dataset.value ? this.elementSelect.dataset.value : this.options[0].value;
        this.index = utils.findIdx(this, this.value);
        this.close();
        this.setIndex(this.index);
        this.event();
    }

    Select.prototype.change = function (fn) {
        if (this.opt.change) {
            this.opt.change(this.get());
        }
        if (fn) {
            fn(this.get());
        }
    }

    Select.prototype.update = function () {
        this.elementOptionListItems = utils.selector(this.id, utils.exceptNull(this, 'optionListItem'));
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
        utils.addEvent(this, this.elementSelectedList, utils.open);
        utils.addEvent(this, this.elementOptionListItems, utils.select);
        utils.addEvent(this, this.elementDim, utils.close);
    }

    Select.prototype.setValue = function (value) {
        var index = utils.findIdx(this, value);
        utils.select(this, index);
    }

    Select.prototype.setIndex = function (index) {
        utils.select(this, index);
    }

    Select.prototype.close = function () {
        utils.close(this);
    }

    Select.prototype.open = function () {
        utils.open(this)
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