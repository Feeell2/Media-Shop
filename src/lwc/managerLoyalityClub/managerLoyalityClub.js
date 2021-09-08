import { LightningElement,track } from 'lwc';
import getMembers from '@salesforce/apex/MS_ManagerLoyaltyClubHandler.getMembers';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import membersLoyaltyClub from '@salesforce/label/c.Members_Loyalty_Club';
import noMembers from '@salesforce/label/c.No_members';


export default class ManagerLoyalityClub extends LightningElement {
    label={
        membersLoyaltyClub,
        noMembers,
    }
    @track listMembers=[];
    @track emptyList=false;
    @track childComponent;
    @track isSpinner = false;
    connectedCallback() {
          this.isSpinner = true;
          this.loadMembers();
    }

    loadMembers() {
        getMembers()
            .then(result => {
                console.log(result);
                this.isSpinner=false;
                this.listMembers = result;
                if(this.listMembers.length==0){
                    this.emptyList=true;
                }else{
                    this.emptyList=false;
                }
                 this.isSpinner = false;
            })
            .catch(error => {
                console.error(error);
            });
    }

    passToParent(event){
        this.childComponent = event.detail;
        this.loadMembers();
    }
}