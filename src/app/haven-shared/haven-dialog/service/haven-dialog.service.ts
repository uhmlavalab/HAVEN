import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HavenMessageDialogComponent } from '../components/haven-message-dialog/haven-message-dialog.component';
import { HavenConfirmDialogComponent } from '../components/haven-confirm-dialog/haven-confirm-dialog.component';
import { HavenSavesessionDialogComponent } from '../components/haven-savesession-dialog/haven-savesession-dialog.component';
import { HavenLoadingDialogComponent } from '../components/haven-loading-dialog/haven-loading-dialog.component';

@Injectable()
export class HavenDialogService {

  constructor(public dialog: MatDialog) { }

  openErrorDialog(message: string): MatDialogRef<HavenMessageDialogComponent> {
    const dialogRef = this.dialog.open(HavenMessageDialogComponent, {
      width: '300px',
      data: { title: 'Error', message: message }
    });
    return dialogRef;
  }

  openMessageDialog(message: string): MatDialogRef<HavenMessageDialogComponent> {
    const dialogRef = this.dialog.open(HavenMessageDialogComponent, {
      width: '300px',
      data: { title: 'Message', message: message }
    });
    return dialogRef;
  }

  openConfirmationMessage(message: string): MatDialogRef<HavenConfirmDialogComponent> {
    const dialogRef = this.dialog.open(HavenConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirm', message: message }
    });
    return dialogRef;
  }

  openLoadingDialog(message: string): MatDialogRef<HavenLoadingDialogComponent> {
    const dialogRef = this.dialog.open(HavenLoadingDialogComponent, {
      width: '300px',
      data: { title: 'Loading', message: message }
    });
    return dialogRef;
  }

  openSaveSessionDialog() {
    const dialogRef = this.dialog.open(HavenSavesessionDialogComponent, {
      width: '300px',
    });
    return dialogRef;
  }



}
