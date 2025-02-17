import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Word {
  id: string;
  word: string;
  category: string;
}
export interface Score{
  playerName: string;
  word: string;
  attemptsLeft: number;
  score: number;
  date:string;
  idGame:string;
  id:string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly client = inject(HttpClient);

  private apiUrl = 'https://671fe287e7a5792f052fdf93.mockapi.io';

  get randomWords(): Observable<Word[]> {
    return this.client.get<Word[]>(`${this.apiUrl}/words`);
  }

  submitScore(score: any): Observable<any> {
    return this.client.post(`${this.apiUrl}/scores`, score);
  }

  get scores(){
    return this.client.get<Score[]>(`${this.apiUrl}/scores`);
  }

  getGamesPlayed(playername:string){
    return this.client.get<Score[]>(`${this.apiUrl}/scores?playerName=${playername}`);
  }
}
