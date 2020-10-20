import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public leitorQRCode: any;

  public content: HTMLElement;
  public imgLogo: HTMLElement;

  public leitura: string;

  constructor(
    private qrScanner: QRScanner,
    public alertController: AlertController
    ) { }

  public lerQRCode() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;
          this.imgLogo = document.getElementById('logo') as HTMLElement;

          this.content.style.opacity = "0";
          this.imgLogo.style.opacity = "0";

          this.qrScanner.show(); // show camera preview

          // start scanning
          this.leitorQRCode = this.qrScanner.scan().subscribe((text: string) => {
            
            this.leitura = (text['result']) ? text['result'] : text;

            this.content.style.opacity = '1';
            this.imgLogo.style.opacity = '1';

            this.qrScanner.hide(); // hide camera preview
            this.leitorQRCode.unsubscribe(); // stop scanning

            this.presentAlert('LEITURA:', this.leitura);
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

}
