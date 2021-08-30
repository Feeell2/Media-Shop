({
    search: function(component,event,helper){
        if(component.get('v.name')===""){
            helper.doInit(component,event);
        }else{
             helper.doSearch(component,event)
        }

    },
    init: function(component,event,helper){
        helper.doInit(component,event)
    },

    filterSearch: function(component,event,helper){
        helper.doSearch(component,event);
    },
})