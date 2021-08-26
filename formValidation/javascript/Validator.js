
function Validator(options) {

    //function get parentElement for getting the errorElement to show message
    function getParentElement(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // object to save rules of inputElement
    selectorRulesTest = {};

    // validate function
    function validate(inputElement, rule) {
        //get error element
        var errorElement = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        // rule value is object ( select and test function)
        var errorMessage; 

        //get rulesTest of current inputElement
        var currentRulesTest = selectorRulesTest[rule.selector];

        for(var i = 0; i < currentRulesTest.length; i++) {
            // now currentTest is testFunction of each rule
            var currentTest = currentRulesTest[i];

            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = currentTest(formElement.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = currentTest(inputElement.value) //inputElement.value is value that user type in input tag
            }
            // if having an error message, break out of loop
            if(errorMessage) break;

        }
        
        if(errorMessage) {
            errorElement.innerText = errorMessage;
            getParentElement(inputElement, options.formGroupSelector).classList.add('invalid');
        }else {
            errorElement.innerText ='';
            getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // get element of form
    var formElement = document.querySelector(options.form)
    if(formElement) {
        // loop over each formElement and handle it
        options.rules.forEach(function(rule) {
            // save rules for each input
            if(Array.isArray(selectorRulesTest[rule.selector])) {
                selectorRulesTest[rule.selector].push(rule.test);
            }
            else {
                selectorRulesTest[rule.selector] = [rule.test];
            }

            // get input element 
            var inputElements = formElement.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function(inputElement) {
                //handle when user blur
                if(inputElement) {
                    inputElement.onblur = function() {
                        validate(inputElement, rule);
                    }
                }
                // handle when user input
                inputElement.oninput = function() {
                    var errorElement = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText ='';
                    getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });
        })

        // handle event submit
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;
            // validate all input elements
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });

            var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
            
            // if success
            if (isFormValid) {
                // submit with javascript
                if( typeof options.onSubmit === 'function') {
                    var formValues = Array.from(enableInput).reduce(function(values, input) {
                        // set key and value to object
                        
                        switch(input.type) {
                            case 'radio':
                                //or - values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                if(input.matches(':checked')) {
                                    values[input.name] = input.value;
                                }
                                break;
                            case 'checkbox':
                                if(input.matches(':checked')) {
                                    if(!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                }
                                else {
                                    values[input.name] = '';
                                }
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {}); // initial values is an empty objects
                    // now formValues are object with keys that input.name and values
                    // console.log(formValues);
                    options.onSubmit(formValues);
                }
                //submit with default action
                else {
                    formElement.submit();
                }

            }
        }
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined: message || 'Vui lòng nhập Email';
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Mật Khẩu phải có tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}