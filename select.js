var Select = (function(Select){
    var id,opt;
    var utils = (function(){
        function selector(selector) {
            return document.querySelectorAll(selector);
        }
        function opt(obj, key){
            return obj ? `.${obj[key]}` : `.${key}`;
        }
        function findIdx(_this, value) {
            var i = _this.options.length,
            index = 0;
            while(i--) {
                if(_this.options[i].value === value){
                    index = i;
                    break;
                }
            }
            return index;
        }
        function open(_this) {
            _this.active = true;
            _this.id.classList.add(this.activeClass);
            _this.elementOptionWrap.style.display = 'block';
            _this.elementOptionWrap.style.zIndex = '2';
            _this.elementOptionWrap.style.position = 'relative';
            _this.elementDim.style.display = 'block';
        }
        function select(_this, index) {
            _this.value = _this.options[index].value;
            _this.elementSelected.innerText = _this.options[index].label;
            utils.close(_this);
        }
        function close(_this) {
            _this.active = false;
            _this.id.classList.remove(this.activeClass);
            _this.elementOptionWrap.style.display = 'none';
            _this.elementDim.style.display = 'none';
            _this.elementOptionWrap.style.zIndex = null;
            _this.elementOptionWrap.style.position = null
        }
        function makeDom(selector, tag, style) {
            var element = document.createElement(tag);
            element.setAttribute('style', style);
            selector.append(element);
            return element;
        }

        function addEvent(_this, selector, fn) {
            var i = selector.length;
            if(i > 1) {
                while(i--) {
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
            opt,
            open,
            select,
            close,
            findIdx,
            makeDom,
            addEvent
        };
    }());


    function Select(_id, _opt) {
        id = _id;
        opt = _opt;
        this.active = false;
        this.id = document.getElementById(id);
        this.elementSelected = utils.selector(utils.opt(opt, 'selected'))[0];
        this.elementOptionWrap = utils.selector(utils.opt(opt, 'option-list'))[0];
        this.elementOptions = utils.selector(utils.opt(opt, 'option-list__item'));
        this.elementDim = utils.makeDom(this.id, 'i', 'z-index: 1;position: fixed;top: 0;left: 0;display:none;width: 100%;height: 100%;');
        this.activeClass = utils.opt(opt, 'active');
        this.options = this.getOption();
        this.value = this.id.dataset.value ? this.id.dataset.value : this.options[0].value;
        this.index = utils.findIdx(this, this.value);
        this.close();
        this.setIndex(this.index);
        this.event();
    }

    Select.prototype.change = function(fn) {

    }

    Select.prototype.update = function() {
        this.elementOptions = utils.selector(utils.opt(opt, 'option-list__item'));
        this.options = this.getOption();
        this.event();
    }

    Select.prototype.getOption = function() {
        var i = this.elementOptions.length;
        this.options = this.options ? this.options : [];
        while(i--) {
            this.options.unshift({
                value: this.elementOptions[i].dataset.value,
                label: this.elementOptions[i].dataset.label
            })
        }
        return this.options;
    }

    Select.prototype.event = function() {
        utils.addEvent(this, this.elementSelected, utils.open);
        utils.addEvent(this, this.elementOptions, utils.select);
        utils.addEvent(this, this.elementDim, utils.close);
    }

    Select.prototype.setValue = function(value) {
        this.index = utils.findIdx(this, value);
        utils.select(this, this.index);
    }

    Select.prototype.setIndex = function(index) {
        utils.select(this, index);
    }

    Select.prototype.close = function() {
        utils.close(this);
    }

    Select.prototype.open = function() {
        utils.open(this)
    }

    return Select;
}(Select || {}));
var a = new Select('a');