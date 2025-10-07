import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {


  private apiUrl = 'http://localhost:5041/api/User/UserSummary';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

private baseUrl = 'http://localhost:5041/api/User';

createUser(userData: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/create`, userData);
}

 private base1Url = 'http://localhost:5041/api/User';


  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.base1Url}/update/${id}`, userData);
  }

    deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}`);
  }

  private base2Url = 'http://localhost:5041/api/Excel/uploadedfileSummary';

  getUploadedName(){
     return this.http.get(this.base2Url);
  }


  private base3Url = 'http://localhost:5041/api/Excel/count';

  getCount(){
    return this.http.get(this.base3Url);
  }
   private base4Url = 'http://localhost:5041/api/ExcelCompare/top10-highest-differences';

  gethighestdifference(){
    return this.http.get(this.base4Url);
  }

  private base5Url = 'http://localhost:5041/api/ExcelCompare/top10-smallest-differences';

  getlowestdifference(){
    return this.http.get(this.base5Url);
  }

   private base6Url = 'http://localhost:5041/api/ExcelCompare/mismatch-summary';


  getdifferenceoutof(){
    return this.http.get(this.base6Url);
  }

}
