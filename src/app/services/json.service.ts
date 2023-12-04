import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {

  constructor(private httpClient: HttpClient) { }

  public async getJsonAsync<T>(path: string): Promise<T> {
    return lastValueFrom(this.httpClient.get<T>(path));
  }
}
