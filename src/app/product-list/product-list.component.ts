import { Component } from '@angular/core';

import { products } from '../products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products = products;


  callAPI() {
    const apiName = 'angulartutorialApiHello';
    const path = '/items/1';
    const myInit = {
//      headers: {}, // OPTIONAL
//      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        name: 'param' // OPTIONAL
      }
    };

    API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
        window.alert('Response from API: ' + response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  share() {
    window.alert('The product has been shared!');
  }

  onNotify() {
    window.alert('You will be notified when the product goes on sale');
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
