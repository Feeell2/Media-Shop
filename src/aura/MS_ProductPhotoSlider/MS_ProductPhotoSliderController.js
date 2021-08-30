({
    init : function(component,event,helper){
       let recordId=component.get("v.recordId");
       helper.doInit(component, event,recordId);
    },
     setMainsPhoto: function(component, event, helper) {
        let ctarget = event.currentTarget;
        let id_str = ctarget.dataset.value;
        let tmpstr=id_str.replace('.','');
        const idPhotoToSelected=document.getElementById(tmpstr);
        helper.toggleProfilePhotos(component, event,idPhotoToSelected,tmpstr);
     },
})