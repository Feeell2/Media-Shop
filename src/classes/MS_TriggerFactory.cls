public with sharing class MS_TriggerFactory {
    public static void createHandler(Schema.sObjectType soType) {
        MS_ITriggerInterface handler = getHandler(soType);
        if(handler == null) {
            throw new TriggerException('No Trigger Handler registered for Object Type: ' + soType.getDescribe());
        }
        execute(handler);
    }
    private static void execute(MS_ITriggerInterface handler) {
        if(Trigger.isBefore) {
            handler.bulkBefore();
        }
        else {
            handler.bulkAfter();
        }
    }
    private static MS_ITriggerInterface getHandler(Schema.sObjectType soType) {
        if(soType == Case.getSObjectType()) {
            return new MS_CaseHandler();
        }

        return null;
    }
    public class TriggerException extends Exception {}
}