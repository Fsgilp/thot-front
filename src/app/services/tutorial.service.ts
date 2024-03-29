import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';


const baseUrl = 'https://guarded-chamber-42489.herokuapp.com/api/tutorials';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(baseUrl);
  }

  getAllPublished(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}/published`);
  }

  get(id: any): Observable<Tutorial> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getByTitle(title: any): Observable<any> {
    return this.http.get(`${baseUrl}/find/title?title=${title}`);
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

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }

  findByKey(key: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?key=${key}`);
  }

  findByAuthor(author: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?author=${author}`);
  }
}
