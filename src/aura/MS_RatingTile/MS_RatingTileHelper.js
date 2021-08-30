({
    addRatingHelper:function(component,event,movieId,userId,ratingValue,callback){
//            let addRatingProduct = $A.get("e.c:MS_AddRateProductEvent");
            let addRatingProduct = component.getEvent("addRatingValue");
            addRatingProduct.setParams({
                "value": ratingValue,
            });
            let addRatingMethod=component.get("c.addRatingToFilm");
            addRatingMethod.setParams({
                'id': movieId,
                'userId':userId,
                'mark':ratingValue,
            })
            addRatingMethod.setCallback(this,function(response){
               let state=response.getState();
               let result = response.getReturnValue();
               if(state === "SUCCESS") {
                   addRatingProduct.fire();
                   this.showToast(component,event,"Add your Rate","success");
                }else{
                     this.showToast(component,event,"Rate not added","error");
                }
            });
            $A.enqueueAction(addRatingMethod);
        },

        showToast : function(component, event,message,typeToast) {
            component.set("v.type", typeToast);
            component.set("v.message", message);
            let childComponent = component.find("toastRatingComponent");
            let fireToast = childComponent.toast();
        }
})