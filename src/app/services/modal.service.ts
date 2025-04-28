// import { EventEmitter, Injectable } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { NotificationModalComponent } from '../modals/notification-modal/notification-modal.component';
// import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class ModalService {

//   public closeAllEvent = new EventEmitter<void>();
//   constructor(private dialog: MatDialog) { }

//   closeAllDialogs(){
//     this.closeAllEvent.emit();
//   }

//   openNotificationModal(message: string, okButtonCallback?: () => void, hideButton?: boolean,): MatDialogRef<NotificationModalComponent> {
//     this.dialog.closeAll();
//     return this.dialog.open(NotificationModalComponent, {
//       data: {
//         message: message,
//         hideButton: hideButton,
//         okButtonCallback: okButtonCallback,
//         closeAllEvent: this.closeAllEvent
//       },
//       panelClass: 'custom-dialog-surface'
//     });
//   }


//   openConfirmationModal(message: string): MatDialogRef<ConfirmationModalComponent>  {
//     this.dialog.closeAll();
//     return this.dialog.open(ConfirmationModalComponent, {
//       data: {
//         message: message,
//       },
//       panelClass: 'custom-dialog-surface'
//     });
//   }
// }
