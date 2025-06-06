import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Scan {
 private uploadUrl = 'http://localhost:5041/api/Excel/upload';

  constructor(private http: HttpClient) {}

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match backend expected key

    return this.http.post(this.uploadUrl, formData);
  }

compareExcels(file1: File, file2: File): Observable<any> {
  const formData = new FormData();
  formData.append('file1', file1); // Match backend's expected key
  formData.append('file2', file2); // Match backend's expected key

  return this.http.post('http://localhost:5041/api/ExcelCompare/compare', formData);
}


private baseUrl = 'http://localhost:5041/api/Excel';

  exportExcel(startDate: string, endDate: string) {
    const url = `${this.baseUrl}/export?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get(url, { responseType: 'blob' }); // Download file as blob
  }

}
