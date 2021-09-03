({
<<<<<<< HEAD
      createRecord : function (component, event) {
          var navEvt = $A.get("e.force:navigateToSObject");
          navEvt.setParams({
            "recordId": component.get("v.product.Product2.Id"),
            "slideDevName": "related"
          });
          navEvt.fire();
          this.getProductsToList(component, event);
=======
      navigateToRecordDetail : function (component, event,helper) {
            helper.navigateToRecordDetailHelper(component, event);
>>>>>>> MS_#5
      },

      addProductToCart:function(component,event,helper){
            helper.addToCartHelper(component,event);
      },

      getProductsToList:function(component,event,helper){
            helper.getProductsToListHelper(component,event);
      },
<<<<<<< HEAD



  })
=======
 })
>>>>>>> MS_#5
