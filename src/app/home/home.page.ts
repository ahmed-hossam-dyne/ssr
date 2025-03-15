import { HttpClient } from '@angular/common/http';
import { Component, inject, makeStateKey, TransferState } from '@angular/core';

const dataKey = makeStateKey<{ data: string }>('data');
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  readonly #http = inject(HttpClient);
  readonly #transferState = inject(TransferState);
  fallbackImg = 'https://ionicframework.com/docs/img/demos/card-media.png';
  menus: any[] = [];
  isLoading = false;

  constructor() {
    this.getMenu();
  }

  getMenu(): void {
    const url =
      'https://enupu74bl9.execute-api.us-east-1.amazonaws.com/v1/sopd/restaurantinfo';
    const body = {
      qrcode: 'app',
      branch_id: '6203fba0-e2de-11ef-98ae-c3fc59dc6fae',
      favorites_only: false,
      device_fingerprint: 'd0255318-32fd-4ed5-bc6f-7b4e6fb4250f',
      source: 'web',
      source_details: 'http://localhost:8100',
      app_version: '1.0.0',
    };
    this.sendPOSTRequest(url, body);
  }

  goToNewMenu(): void {
    console.log('goToMenu');
    const url =
      'https://enupu74bl9.execute-api.us-east-1.amazonaws.com/v1/sopd/restaurantinfo';
    const body = {
      qrcode: 'app',
      branch_id: 'acd2bcb0-fff0-11ee-bbc2-2bb1de0fa3c8',
      favorites_only: false,
      device_fingerprint: 'd0255318-32fd-4ed5-bc6f-7b4e6fb4250f',
      source: 'web',
      source_details: 'http://localhost:8100',
      app_version: '1.0.0',
    };
    this.sendPOSTRequest(url, body);
  }

  sendPOSTRequest(url: string, body: any): void {
    this.isLoading = true;
    const serverData = this.#transferState.get(dataKey, null) as any;
    if (!serverData || serverData.result.branch_id !== body.branch_id) {
      this.#http.post(url, body).subscribe((data: any) => {
        console.log('fresh data', data);
        this.isLoading = false;
        this.#transferState.set(dataKey, data);
        const menus = data?.result?.menus;
        if (menus) {
          this.menus = data?.result?.menus.slice();
          console.log('meus', this.menus);
        }
      });
    } else {
      console.log('cached data', serverData);
      this.isLoading = false;
      const menus = serverData?.result?.menus;
      if (menus) {
        this.menus = serverData?.result?.menus.slice();
        console.log('meus', this.menus);
      }
    }
  }
}
