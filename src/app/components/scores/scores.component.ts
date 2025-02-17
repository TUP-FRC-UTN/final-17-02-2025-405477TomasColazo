import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, Score} from '../../services/api.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-scores',
  imports: [
    DatePipe
  ],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit, OnDestroy {

  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  scores: Score[] = []
  subs = new Subscription();
  isAdmin = false;

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin()
    this.loadScores();
  }

  private loadScores() {
    const currentUser = this.authService.currentUser$;
    if (this.isAdmin){
      this.subs.add(this.api.scores.subscribe(score => {
        this.scores = score.sort((a, b) => b.attemptsLeft - a.attemptsLeft);
      }));
    }else {
      this.subs.add(currentUser.subscribe(user =>{
        this.subs.add(this.api.getGamesPlayed(user?.username ?? '').subscribe(userScores => {
          this.scores = userScores.sort((a, b) => b.attemptsLeft - a.attemptsLeft);

        }));
      }))
    }
  }

}
