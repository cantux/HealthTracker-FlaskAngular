/**
 * Created by cant on 12/11/16.
 */

interface Food {
  FoodId: number;
  MeasureLabel: string;
  Quantity: number;
}

export class FoodList {
  foods: Food[];
}
