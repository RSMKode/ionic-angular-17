import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonAlert,
  IonImg,
  IonLabel,
  IonBadge,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { MovieResult } from '@app/interfaces/ApiResult';
import { catchError, finalize, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonIcon,
    IonBadge,
    IonLabel,
    IonImg,
    IonAlert,
    IonSkeletonText,
    IonAvatar,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    DatePipe,
    RouterModule,
  ],
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public movies: MovieResult[] = [];
  public dummyArray = new Array(15);
  public query: string = '';

  public error = null;
  public isLoading = false;

  constructor() {
    this.loadMovies();
  }

  // loadMovies(event?: InfiniteScrollCustomEvent) {
  //   this.movieService.getTopRatedMovies().subscribe((res) => {
  //     console.log(res);

  //     this.movies = res.results;
  //     console.log(this.movies);

  //     const movieId = this.movies[0].id;
  //     this.movieService.getMovieDetails(movieId.toString()).subscribe((res) => {
  //       console.log(res);
  //     });
  //   });
  // }

  handleSearch(event: CustomEvent) {
    const query = event.detail.value;
    this.query = query;
    this.movies = [];
    this.currentPage = 1;
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService
      .getMovies(this.currentPage, this.query)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }),
        catchError((errorResponse: any) => {
          console.log(errorResponse);
          this.error = errorResponse.error.status_message;
          return [];
        })
      )
      .subscribe({
        next: (response) => {
          console.log({ response });
          this.movies.push(...response.results);
          if (event) {
            // console.log(event);
            event.target.disabled = this.currentPage === response.total_pages;
          }
        },
      });
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    console.log({ currentPage: this.currentPage });
    this.loadMovies(event);
  }
}
