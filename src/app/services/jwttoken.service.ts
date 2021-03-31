import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../model/APIResponse';
import { JwtResponse } from '../model/JwtToken';
import { LoginUser } from '../model/User';
import { UserService } from './user.service';
import moment from 'moment';
import { RegisterOptions } from '../model/RegisterOptions';
import * as hash from 'object-hash';
import { Observable, throwError } from 'rxjs';
import {flatMap, map, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class JwtTokenService {

  private JwtToken: string = null;
  private readonly prodUserEndpoint = 'https://tispyl.uber.space:41920/api/user';
  private readonly devUserEndpoint = 'http://localhost:25670/api/user';
  private endpoint = environment.production ? this.prodUserEndpoint : this.devUserEndpoint;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  /** Tries to retrieves expires_at value from local storage */
  private getExpiration(): moment.Moment {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  /** Stores jwt-token for a given user name in the local storage */
  private storeToken(authResult: JwtResponse, username: string): void {
    console.info('Session-Key saved.');
    const expiresAt = moment().add(authResult.expiresIn, 'second');
    localStorage.setItem('jwt_token', authResult.jwtToken);
    localStorage.setItem('username', username);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  login(username: string, password: string): Observable<LoginUser> {
    return this.http.post<APIResponse<JwtResponse>>(this.endpoint + '/token', {username, password}).pipe(
      map( (jwt: APIResponse<JwtResponse>) => {
        if (jwt.success) {
          this.storeToken(jwt.payload, username);
          return jwt;
        } else {
          throwError(jwt);
        }
      }),
      flatMap( () => this.userService.getUserByLoginName(username) ),
      map( (usr: APIResponse<LoginUser>) => {
        this.userService.setActiveUser(usr.payload as LoginUser);
        return usr.payload;
      })
    );
  }

  register(registerOptions: RegisterOptions): Observable<Boolean> {
    return this.http.post<APIResponse<JwtResponse>>(this.endpoint, registerOptions).pipe(
      map( (jwt: APIResponse<JwtResponse>) => {
        if (jwt.success) {
          return true;
        } else {
          throwError(jwt);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('username');
    this.userService.setActiveUser(undefined);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  setJwtToken(token: string): void {
    this.JwtToken = token;
  }

  getJwtToken(): string {
    return this.JwtToken;
  }




}
