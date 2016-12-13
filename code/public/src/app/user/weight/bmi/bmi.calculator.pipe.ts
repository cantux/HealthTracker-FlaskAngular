/**
 * Created by cant on 12/13/16.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'calculateBmi'})
export class BmiCalculatorPipe implements PipeTransform {
  transform(value:number, exponent: number) {
    return value / (exponent * exponent)
  }
}
