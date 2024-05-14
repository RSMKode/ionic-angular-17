import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, delay } from 'rxjs';
import { ApiResult, FullMovieResult } from '@app/interfaces/ApiResult';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);

  constructor() {}

  getMovies(page: number = 1, query?: string): Observable<ApiResult> {
    if (query) {
      return this.searchMovies(query, page).pipe(delay(500));
    }
    return this.getTopRatedMovies(page).pipe(delay(500));
  }

  getTopRatedMovies(page: number = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${BASE_URL}/movie/popular?page=${page}&api_key=${API_KEY}`
    );
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${BASE_URL}/search/movie?query=${query}&page=${page}&api_key=${API_KEY}`
    );
  }

  getMovieDetails(id: string): Observable<FullMovieResult> {
    return this.http.get<FullMovieResult>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
  }
}
