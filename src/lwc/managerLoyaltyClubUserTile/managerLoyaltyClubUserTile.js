import { LightningElement,api } from 'lwc';
import removeMember from '@salesforce/apex/MS_ManagerLoyaltyClubHandler.removeMember';
import getMembers from '@salesforce/apex/MS_ManagerLoyaltyClubHandler.getMembers';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import remove from '@salesforce/label/c.Remove';
import success from '@salesforce/label/c.Success';
import memberRemoved from '@salesforce/label/c.Member_removed';

export default class ManagerLoyaltyClubUserTile extends LightningElement {
    label={
        remove,
        success,
        memberRemoved,
    }
@api user;
deleteCon(event) {
        removeMember({ user: { ...this.user, sobjectType: 'User' } })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: this.label.success,
                        message: this.label.memberRemoved,
                        variant: 'success'
                    })
                );
                const callLoadMembers=new CustomEvent('callinparent',{
                    detail:event.target.value,
                })
                this.dispatchEvent(callLoadMembers);

            })
            .catch((err) => console.error(err));
    }
     loadMembers() {
            getMembers()
                .then(result => {
                    console.log(result);
                    this.isSpinner=false;
                    this.listMembers = result;
                })
                .catch(error => {
                    console.error(error);
                });
     }
}