/**
 * Created by cant on 12/7/16.
 */
export class UserCredential {
  public Email: string;
  public Id: string;
  public IsLoggedIn: boolean = false;

  constructor (Email?: string, Id?: string, IsLoggedIn: boolean = false) {
    this.Email = Email || '';
    this.Id = Id || '';
    this.IsLoggedIn = IsLoggedIn;
  }
}
