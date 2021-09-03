({
    doInit : function(component,event,recordId){
            var action = component.get("c.getAllFilesOnsObjectRecord");
            action.setParams({
                sObjectId : recordId,
            });

            action.setCallback(this, function(response){
                var state = response.getState();
                if(state === "SUCCESS"){
                    var existingFilesArr = response.getReturnValue();
                    console.log(existingFilesArr)
                    if(existingFilesArr != null && existingFilesArr != undefined && existingFilesArr.length > 0){
                        component.set("v.sObjectAttachedFiles", existingFilesArr);
                    }
                }
            });
            this.getProfilePhoto(component,event,recordId);
        $A.enqueueAction(action);
        },

    getProfilePhoto:function(component,event,recordId){
        let action = component.get("c.getProfilePhoto");
            action.setParams({
                productId : recordId,
            });

            action.setCallback(this, function(response){
                let state = response.getState();
                if(state === "SUCCESS"){
                    let profilePhotoUrl = response.getReturnValue();
                    component.set("v.profilePhoto", profilePhotoUrl);
                }
            });
        $A.enqueueAction(action);
    },
    displayPhoto:function (component, event,element,id) {
      component.set("v.profilePhoto",id);
//      $A.get('e.force:refreshView').fire();
    },

    toggleProfilePhotos:function (component, event,document,id_str) {
        let photoProfileId=component.get("v.profilePhoto");
        if(id_str!=photoProfileId){
           this.displayPhoto(component, event,document,id_str);
        }
    },
})