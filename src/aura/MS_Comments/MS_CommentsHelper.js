({
    addCommentsHelper:function(component,event,userId,id,text,callback){
          component.set('v.text','');
          let addCommentMethod=component.get("c.addComment");
          if(text.length>0){
              addCommentMethod.setParams({
                    'id': id,
                    'userId': userId,
                    'text':text,
                 })
                 addCommentMethod.setCallback(this,function(response){
                 let state=response.getState();
                 let result = response.getReturnValue();
                 if(state === "SUCCESS") {
                     this.getCommentsHelper(component,event,id);
                     this.showToast(component,event,"Add comment",'success')
                 }else{
                     this.showToast(component,event,"Comment can't added",'error')
                 }
                 })
                 $A.enqueueAction(addCommentMethod);
          }else{
              this.showToast(component,event,"Cannot add empty comment",'error')
          }

       },

       getCommentsHelper:function(component,event,id,callback){
           console.log('lala')
          let getCommentMethod=component.get("c.getComments");
          getCommentMethod.setParams({
             'id': id
          })
          getCommentMethod.setCallback(this,function(response){
          let state=response.getState();
          let result = response.getReturnValue();
          if(state === "SUCCESS") {
              console.log(result)
               component.set('v.listComments',JSON.parse(JSON.stringify(result.listComments)));
               component.set('v.userType',JSON.parse(JSON.stringify(result.userType)));
          }
          })
       $A.enqueueAction(getCommentMethod);
    },

    showToast : function(component, event,message,typeToast) {
        component.set("v.type", typeToast);
        component.set("v.message", message);
        let childComponent = component.find("toastCommentsComponent");
        let fireToast = childComponent.toast();
    }

})