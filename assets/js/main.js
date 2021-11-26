function Validator(formSelector) {
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
        }element=element.parentElement;
    }
    var formRules={

    };
    // quy uoc tao rule : co loi thi return error message || return undefined
    var validatorRules={
        required:function(value) {
            return value?undefined:'Vui lòng nhập trường này'
        },
        email:function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)?undefined:'Bạn nhập chưa đúng email';
        },
        min:function(min) {
            return function(value) {
                return value.length>=min?undefined:`Vui lòng nhập ít nhất ${min} ký tự`;
            }
        },
        max:function(max) {
            return function(value) {
                return value.length<=max?undefined:`Vui lòng nhập ít nhất ${max} ký tự`;
            }
        },
    };
    // lay ra form element trong DOM theo 'formselector'
    var formElement = document.querySelector(formSelector)
    // console.log(formElement)
// chi xu ly khi co element trong DOM
    if(formElement) {
        var inputs=formElement.querySelectorAll('[name][rules]')
        // console.log(inputs)
        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
               var ruleInfo;
               var isRuleHasValue=rule.includes(':');
                if(rule.includes(':')){
                    ruleInfo=rule.split(':')
                    rule=ruleInfo[0];
                }
                var ruleFunc=validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunc=ruleFunc(ruleInfo[1])
                }
                // console.log(rule)
                if(Array.isArray(formRules[input.name])){
                        formRules[input.name].push(ruleFunc)
                }else{
                    formRules[input.name]=[ruleFunc];
                }
            }
            input.onblur = handleValidate;
            input.oninput = handleClearError;
          
        }
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;
            for(var rule of rules){
                errorMessage = rule(event.target.value);
                if(errorMessage)break;
            }
           
        //   Nếu có lỗi thì in ra UL
            if(errorMessage){
                  var formGroup = getParent(event.target,'.form-group');
                if(formGroup){
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message');
                    if(formMessage){
                        formMessage.innerText=errorMessage;
                    }
                }
            }
            return !errorMessage;
        }
        // hàm clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target,'.form-group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector('.form-message');
                if(formMessage){
                    formMessage.innerText='';
                }
            }

        }
        
    }
    // xử lý hàm submit form
        formElement.onsubmit = function (event) {
            event.preventDefault();

            var inputs=formElement.querySelectorAll('[name][rules]')
            var isValid = true;

            for(var input of inputs){
                 if(!handleValidate({ target: input })){
                    isValid = false;
                }
            }
            // Khi khong co loi~ thi submit form 
            if(isValid){
                formElement.submit();
            }
        }
}