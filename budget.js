

//budget controller
var budgetController=(function () {
   var Expense=function(id,description,value){
     this.id=id;
     this.description=description;
     this.value=value;
   }

   var Income=function(id,description,value){
    this.id=id;
    this.description=description;
    this.value=value;
  }
  var calculateTotal=function(type){
var sum=0;
data.allIteam[type].forEach(function(cur){
sum+=cur.value;
});
data.total[type]=sum;
  }


var data={
  allIteam:{
    exp:[],
    inc:[]
  },
  total:{
    exp:0,
    inc:0
  },
  budget:0,
  percentage:-1
  
}
return{
  addItem:function(type,des,val){
var newIteam,ID;

//[1,2,3,4,5], nextId=6
//[1,2,4,6,8], nextId=9
//ID=lastID+1;

//create new ID
if(data.allIteam[type].length>0){
  ID=data.allIteam[type][data.allIteam[type].length-1].id+1;
}
else{
  ID=0;
}

//create new Itembased on 'inc' or  'exp' type
    if(type === 'exp'){
  newIteam=new Expense(ID,des,val);
  }
  else if(type === 'inc'){
    newIteam=new Income(ID,des,val);
  }
  //push it into a dataStruture
  data.allIteam[type].push(newIteam);

  //return new element
  return newIteam;

  },


  deleteItem:function(type,id){
    var ids ,index;
//id=6
// data.allIteam[type][id];
//ids=[1 2 4 6 8]
//index =3
ids = data.allItem[type].map(function(current) {
  return current.id;
});
index=ids.indexOf(id);  
if(index !== -1){
  data.allIteam[type].splice(index, 1);

}


  }, 



  calculateBudget:function(){
// calcluate total income and expenses
calculateTotal('exp');
calculateTotal('inc');
// calcluate budget income-expense
data.budget=data.total.inc-data.total.exp;
//cal % of income that we spends
if(data.total.inc>0){
data.percentage=Math.round((data.total.exp/data.total.inc)*100);
}else{
  data.percentage=-1;
}
  },

getBudget:function(){
return{
  budget:data.budget,
  totalInc:data.total.inc,
  totalExp:data.total.exp,
  percentage:data.percentage
}
},

  testing:function(){
    console.log(data)
  }
}
})();



//UI controller
var UIController=(function () {
 
    var DomString={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputButton:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container'
    }
    
    
    
    return{
        getInput:function(){
         
            return{

             type:document.querySelector(DomString.inputType).value,//will be incor exp
            description:document.querySelector(DomString.inputDescription).value,
            value:parseFloat(document.querySelector(DomString.inputValue).value)

         }
        },

        addListItem:function(obj,type){
          var html,newHtml,element;
        //create HTML text String with placeholder text
        if(type==='inc'){
          element=DomString.incomeContainer;
       html= '<div class="item clearfix" id="income-%id%">'+
       '<div class="item__description">%description%</div>'+
       '<div class="right clearfix"><div class="item__value">%value%</div>'+
       '<div class="item__delete"><button class="item__delete--btn">'+
         '<i class="ion-ios-close-outline"></i></button></div></div> </div>'
        }
        else if(type==='exp'){ 
          element=DomString.expenseContainer;
      html= '<div class="item clearfix" id="expense-%id%">'+
      '<div class="item__description">%description%</div>'+
      '<div class="right clearfix"><div class="item__value">%value%</div>'+
      '<div class="item__percentage">21%</div>'+
      '<div class="item__delete"><button class="item__delete--btn">'+
        '<i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
       //repalce the palceholder text with the actual data
newHtml=html.replace('%id%',obj.id);
newHtml=newHtml.replace('%description%',obj.description);
newHtml=newHtml.replace('%value%',obj.value);
         //insert HTML into the DOM(insert JSON HTML method)
 document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);


         
        },

deleteListItem:function(selectorID){
  var ele=document.getElementById(selectorID);
  ele.parentNode.removeChild(ele);
},
        claerFields:function(){
          var fields,fieldArray;
fields=document.querySelectorAll(DomString.inputDescription + ','+ DomString.inputValue);
//it is in the form of list and we have to convert to array and use slice 
//and we cant use slice method directly 
 fieldArray=Array.prototype.slice.call(fields);
 fieldArray.forEach(function(current,index,array) {
  current.value="";
  

});
fieldArray[0].focus();

        },


        displayBudget:function(obj){
          
document.querySelector(DomString.budgetLabel).textContent=obj.budget;
document.querySelector(DomString.incomeLabel).textContent=obj.totalInc;
document.querySelector(DomString.expenseLabel).textContent=obj.totalExp;

if(obj.percentage>0){
  document.querySelector(DomString.percentageLabel).textContent=obj.percentage+'%';
}
else{
  document.querySelector(DomString.percentageLabel).textContent='---';
}
        },




        getDomString:function(){
            return DomString;
        }
    }
})();



//Global controller
var controller=(function (budgerCntrl,UICtrl) {

    var setUpEventListeners=function(){
      var DOM=UICtrl.getDomString();
      document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);
      document.addEventListener('keypress',function(event) {
        if(event.keyCode===13 || event.which===13){
    
          ctrlAddItem();
        }
        
      });
      document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    };


    var UpdateBudget=function(){
//1.Calculate the budget 
budgerCntrl.calculateBudget();
//2. return the budget
var budget=budgerCntrl.getBudget();

    //3.Display the budget on the UI
  UICtrl.displayBudget(budget);
    }
  
  
  
    
    var ctrlAddItem=function(){
      var input,newItem;
         //1.get the filed input data 
     input=UICtrl.getInput();
    
if(input.description!=="" && !isNaN(input.value) && input.value>0){
    //2.Add the item to the budget contoller
 newItem=budgerCntrl.addItem(input.type,input.description,input.value);


    //3.add the item to the UI

UICtrl.addListItem(newItem,input.type);

// 4.clear filed

UICtrl.claerFields();
   // 5.calculate and update budget
   UpdateBudget();
  }

    }
  
var ctrlDeleteItem=function(event){
// console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
var itemID,sliptID,type,ID;
itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

if(itemID)
{
  //inc-1
  sliptID=itemID.split('-');
  // console.log(sliptID);
  type=sliptID[0];
  ID=parseInt(sliptID[1]);

  //1.delete the item from the data structure
budgerCntrl.deleteItem(type,ID);


  //2.delete item from the UI
UICtrl.deleteListItem(itemID);


//3.Update and show the new budget
UpdateBudget();

}
};



  return{
    init:function(){
      console.log('application has started ');
      UICtrl.displayBudget({
         budget:0,
         totalInc:0,
         totalExp:0,
         percentage:-1
      });
      setUpEventListeners();
    }
  }
  

})(budgetController,UIController);
controller.init();  