import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {

  private apiUrl = 'http://172.16.100.66:5041/api/User/get-all';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

private baseUrl = 'http://172.16.100.66:5041/api/User';

createUser(userData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/create`, userData);
}

 private base1Url = 'http://172.16.100.66:5041/api/User';


  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.base1Url}/update/${id}`, userData);
  }

    deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}`);
  }

}
