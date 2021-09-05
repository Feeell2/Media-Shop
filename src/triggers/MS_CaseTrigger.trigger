trigger MS_CaseTrigger on Case  (before insert) {
    MS_TriggerFactory.createHandler(Case.getSObjectType());
}