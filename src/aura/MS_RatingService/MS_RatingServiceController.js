({
    init:function(component,event,helper){
    let recordId=component.get('v.recordId');
    let userId=$A.get("$SObjectType.CurrentUser.Id");
    helper.getAverageMovieRating(component,event,recordId);
    helper.getUserMovieRating(component,event,recordId,userId);
    },
    getRatingValue:function(component,event,helper){
        let recordId=component.get('v.recordId')
        let value=event.getParam('value');
        console.log('getRatingValue '+value);
        component.set('v.userRating',value);
        helper.getAverageMovieRating(component,event,recordId);
    }
})