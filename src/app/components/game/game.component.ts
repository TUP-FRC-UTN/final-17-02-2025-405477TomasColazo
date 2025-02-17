import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ApiService, Score} from '../../services/api.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {
  alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  currentWord = '';
  wordDisplay: string[] = [];
  usedLetters: string[] = [];
  incorrectLetters: string[] = [];
  errors = 0;
  gameOver = false;
  won = false;
  subs = new Subscription();

    private readonly gameService: ApiService = inject(ApiService);
    private readonly authService: AuthService = inject(AuthService);


  ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

  ngOnInit() {
    this.startNewGame();
  }

  startNewGame() {
    this.subs.add(this.gameService.randomWords.subscribe(words => {
      const randomIndex = Math.floor(Math.random() * words.length);
      this.currentWord = words[randomIndex].word.toUpperCase();
      console.log(this.currentWord)
      this.resetGame();
    }))
  }

  resetGame() {
    this.wordDisplay = Array(this.currentWord.length).fill('_');
    this.usedLetters = [];
    this.incorrectLetters = [];
    this.errors = 0;
    this.gameOver = false;
    this.won = false;
  }

  guessLetter(letter: string) {
    if (this.usedLetters.includes(letter) || this.gameOver) return;

    this.usedLetters.push(letter);

    if (this.currentWord.includes(letter)) {

      for (let i = 0; i < this.currentWord.length; i++) {
        if (this.currentWord[i] === letter) {
          this.wordDisplay[i] = letter;
        }
      }


      if (!this.wordDisplay.includes('_')) {
        this.won = true;
        this.gameOver = true;
        this.saveScore();
      }
    } else {
      this.incorrectLetters.push(letter);
      this.errors++;


      if (this.errors >= 6) {
        this.gameOver = true;
        this.saveScore();
      }
    }
  }

  calculateScore(): number {
    const attemptsLeft = 6 - this.errors;
    const scoreMap: { [key: number]: number } = {
      6: 100,
      5: 80,
      4: 60,
      3: 40,
      2: 20,
      1: 10,
      0: 0
    };
    return scoreMap[attemptsLeft];
  }

  generateGameId(): string {

    const currentUser = this.authService.currentUser$;
    let gameId = '';
    let userScores:Score[] = [];

    this.subs.add(currentUser.subscribe(user => {
      if (user) {
        this.subs.add(this.gameService.getGamesPlayed(user.username).subscribe(
          s => userScores = s
        ))
        const names = user.username.split(' ');
        const initials = names.map(name => name[0]).join('');

        const gameNumber = userScores.length;
        gameId = `P${gameNumber}${initials}`;
      }
    }))

    return gameId;
  }

  saveScore() {
    let name = '';
    this.authService.currentUser$.subscribe(user => name = user?.username ?? '')
    const score = {
      playerName: name,
      word: this.currentWord,
      attemptsLeft: 6 - this.errors,
      score: this.calculateScore(),
      date: new Date().toISOString().split('T')[0],
      idGame: this.generateGameId()
    };

    this.gameService.submitScore(score).subscribe({
      next: () => console.log('Score saved successfully'),
      error: (error) => console.error('Error saving score:', error)
    });
  }

}
