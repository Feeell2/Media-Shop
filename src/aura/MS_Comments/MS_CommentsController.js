({
    init : function(component, event, helper){
         let recordId=component.get("v.recordId");
         helper.getCommentsHelper(component,event,recordId);
    },

    addCommentController:function(component,event,helper){
        let recordId=component.get("v.recordId");
        let text=component.get('v.text');
        let userId=$A.get("$SObjectType.CurrentUser.Id");
        helper.addCommentsHelper(component,event,userId,recordId,text,helper);
        helper.getCommentsHelper(component,event,id);
    },

    getCommentsController:function(component,event,helper){
        helper.getCommentsHelper(component,event,id);
    },
})