var budgetController = (function() {
    
     var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
        
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    var Income = function(id,description,value){
        this.id= id;
        this.description = description;
        this.value = value;
    };
    
     var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
           sum += current.value; 
        });
        data.totals[type] = sum;
    };
    
     var data = {
        
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percenatge: -1
        
    };
    
  
    
    return{
        addItem:function(type,des,val){
            var newItem,ID;
            
            //Create  new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
            //Create new Item based on 'inc' or 'exp'
            if(type === 'exp'){
               newItem = new Expense(ID,des,val);
            }else if(type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            
            //push into our data structure
            data.allItems[type].push(newItem);
            
            //return newItem
            return newItem;
       },
        
        deleteItem:function(type,id) {
            var ids,index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        
        calculateBudget:function() {
            
        //calculate totalIncome and totalExpenses
        calculateTotal('exp');
        calculateTotal('inc');
            
        //calculate budget:income-expenes
        data.budget = data.totals.inc - data.totals.exp;
            
            
        //calculate the percetnage of expense spent
        if(data.totals.inc > 0) {
            data.percenatge = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else{
            data.percenatge = -1;
        }    
        
     },
       
        
        getBudget:function() {
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percenatge
                
            };
        },
        
        calulatePercentages:function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
                
            });
            
        },
        
        getPercentages:function() {
            var allPerc = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            
            return allPerc;
            
        }
        
        
        
        
        
    };
    
    
    
    
    
})();

var UIController = (function() {
    
    var DOMStrings = {
      inputType:  '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel:  '.item__percentage',
      dateLabel: '.budget__title--month'
    };
    
    var nodeListForEach = function(list,callback){
      for(var i = 0;i < list.length; i++){
          callback(list[i],i);
      }  
    };
    
    var formatNumber = function(num,type) {
        var num,numsplit,int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numsplit = num.split('.');
        int = numsplit[0];
        if(int.length > 3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);
        }
             dec= numsplit[1];
            return (type === 'exp' ?  '-' :  '+') + ' ' + int + '.' + dec;
    };

    
    
    return{
        
        addListItem:function(obj,type) {
            var html,newHtml,element;
            
            //Create HTML strings with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
             }else if(type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //Replace the placeholder text with actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //Insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        deleteListItem:function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        clearFields:function() {
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ' , ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array) {
                current.value = "";
                
            });
            
            fieldsArr[0].focus();
            
        },
        
        getInput:function() {
            return{
              type:document.querySelector(DOMStrings.inputType).value,
              description:document.querySelector(DOMStrings.inputDescription).value,
              value:parseFloat(document.querySelector(DOMStrings.inputValue).value)   
            };
              
         },
        
        getDOMStrings:function(){
            return DOMStrings;
        },
        
        displayBudget:function(obj) {
            if(obj.budget == 0){
               document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget; 
            }
            if(obj.budget > 0){
                document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,'inc');
            }
            else if(obj.budget < 0){
               document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,'exp'); 
            }
            if(obj.totalInc == 0){
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            }
            
            if(obj.totalInc > 0){
                document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            }
            if(obj.totalExp == 0){
                document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            }
             if(obj.totalExp > 0){
                document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            }
            
            
            
            
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "--";
            }
            
            
            
        },
        
        displayPercentages:function(percentages) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            nodeListForEach(fields,function(current,index) {
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '--';
                }
                
                
            });
            
            
        },
        
       displayMonth: function() {
          var now,year,month,months;
          now = new Date();
          year = now.getFullYear();
          months = ['January','February','March','April','May','June','July','August','September','October','November','December']; 
          month = now.getMonth();    
          document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;    
            
        },
        
        changedType:function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListForEach(fields,function(currenet){
                currenet.classList.toggle('red-focus');
                
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        }
        
    };
    
    
    
    
    
})();


var Controller = (function(budgetCtrl,UICtrl) {
    
    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
        if(event.keyCode === 13  || event.which === 13){
            ctrlAddItem();
        }
    });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);
        
}
    
    
    var updateBudget = function() {
        
        //calculate budget
        budgetCtrl.calculateBudget();
        
        //return the budget
        var budget = budgetCtrl.getBudget();
        
        //display budget
        UICtrl.displayBudget(budget);
        
        
    };
    
    var updatePercentages =  function() {
        //1.Calculate the percentages
        budgetCtrl.calulatePercentages();
        
        //2.Read percentages from budget Controller
        var percentages = budgetCtrl.getPercentages();
        
        //3.Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
        
    };
   
     var ctrlAddItem = function() {
        var input,newItem;
        
        //Get the input field data
        var input = UICtrl.getInput();
        
        //2.Add item to budgetController
        if(input.description !== ""  && !isNaN(input.value) && input.value > 0){
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
         }
        
        //Add Item to UI
        UICtrl.addListItem(newItem,input.type);
         
         //Clear fields
         UICtrl.clearFields();
         
         //Calculate and update budget
         updateBudget();
         
         //Calculate and update percentages
         updatePercentages();
         
         
        
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID,splitID,type,ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        
        if(itemID){
            //inc-1
          splitID = itemID.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]);
            
        //Delete the item from data structure
        budgetCtrl.deleteItem(type,ID);
            
        //Delete the item from UI
        UICtrl.deleteListItem(itemID);
            
        //Calculate and update budget
         updateBudget();
         
         //Calculate and update percentages
         updatePercentages();
            
        }
        
        
    };
    
    return{
        init:function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
                
            });
            setUpEventListeners();
        }
        
    };
    
    
    
    
    
})(budgetController,UIController);
Controller.init();
