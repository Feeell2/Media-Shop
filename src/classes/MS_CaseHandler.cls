public with sharing class MS_CaseHandler implements MS_ITriggerInterface {
    public void bulkBefore() {
        MS_CaseAssignmentToServiceChanel.assignmentOwnerToCase(Trigger.new);
    }

    public void bulkAfter() {
    }
}