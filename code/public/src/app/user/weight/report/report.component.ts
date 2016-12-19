/**
 * Created by cant on 12/13/16.
 */
import { Component } from '@angular/core';

import { WeightService } from '../weight.service';

@Component({
  selector: 'report',
  templateUrl: './report.component.html'
})
export class ReportComponent {

  data: any;

  constructor(private weightService: WeightService) {
  }

  ngOnInit() {
    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Weights',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    }
  }


}
