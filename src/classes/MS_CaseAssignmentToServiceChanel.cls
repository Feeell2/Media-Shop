public with sharing class MS_CaseAssignmentToServiceChanel {
    public static void assignmentOwnerToCase(List<Case> cases){
        List<Group> groups = [Select Id, Name FROM Group WHERE Type = 'Queue'];
        Map<String, Id> mapServiceGroup = new Map<String, Id>();
        for (Group g:groups){
            mapServiceGroup.put(g.Name,g.Id);
        }
        for(Case newCase : cases) {
            if(newCase.Type == 'Payment') {
                newCase.OwnerId = mapServiceGroup.get(newCase.Type);
            } else if(newCase.Type == 'Shipping') {
                newCase.OwnerId = mapServiceGroup.get(newCase.Type);
            } else if(newCase.Type == 'Technical') {
                newCase.OwnerId = mapServiceGroup.get(newCase.Type);
            }
        }
    }


}