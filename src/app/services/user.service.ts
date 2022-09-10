import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const baseUrl = 'http://localhost:8080/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }

  get(id: any): Observable<User> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByEmail(email: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?email=${email}`);
  }

  findByCompany(company_name: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?company_name=${company_name}`);
  }

  findByCif(cif: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/company?cif=${cif}`);
  }

  findByRole(rol: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?rol=${rol}`);
  }

  findUsersByCif(cif: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/bycompany/${cif}`);
  }

  findOrCreateAdmin(): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/admin`);
  }
}
