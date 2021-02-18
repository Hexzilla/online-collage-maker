import { Injectable } from '@angular/core';
import { User } from 'src/datamodel/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    // private afs: AngularFirestore,
    private http: HttpClient
  ) { }

  // createUser(user: User) {
  //   return this.afs.collection('users').doc(user.uid).set(user);
  // }

  saveFilePath(id: string, filepath: string, filesize: string) {

  }

  // getCurrentUser(id: string) {
  //   return this.afs.doc<User>('users/' + id).valueChanges();
  // }

  toggleUserRole(id: string) {
    return this.http.post(`${environment.url}/users/updateUserRole`, { id: id });
  }


}
