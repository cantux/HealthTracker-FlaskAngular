/**
 * Created by cant on 12/7/16.
 */

export class UserDetail {
  public Email: string;
  public Password: string;
  public Name: string;
  public Surname: string;
  public Height: number;

  // constructor must only have one implementation
  // following only creates a types
  constructor ();
  constructor (Email : string, Password: string);
  constructor (Email: string, Password: string, Name: string, Surname: string, Height: number);
  constructor (Email?: string,
               Password?: string,
               Name?: string,
               Surname?: string,
               Height?: number) {
    this.Email = Email || '';
    this.Password = Password || '';
    this.Name = Name || '';
    this.Surname = Surname || '';
    this.Height = Height || 0;
  }

}
