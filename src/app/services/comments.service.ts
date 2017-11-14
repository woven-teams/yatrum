import { environment } from './../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ServerAuthService } from './server-auth.service';
import { Comment } from '../models/comment';

@Injectable()
export class CommentsService {
  private apiLink: string = environment.API_ENDPOINT; // "http://localhost:3000";

  constructor(
    private http: Http,
    private toastyService: ToastyService,
    private authService: ServerAuthService,
  ) { }

  getUserAuthToken() {
    let user_data = JSON.parse(localStorage.getItem('user'));
    if (user_data) {
      return user_data.auth_token;
    }
  }

  /**
	 * Get Trip Comments
	 * @method getComments
	 * @param {string} tripId of trip
	 * @return {Observable} Observable with Comments
	 */
  getComments(tripId: string): Observable<any> {
    return this.http.get(`${this.apiLink}/trips/${tripId}/comments`)
      .map((data: Response) => data.json())
      .catch((res: Response) => this.catchError(res));
  }

  /**
	 * Add Comment
	 * @method addComment
	 * @param {Comment} comment
	 * @return {Observable} Observable with Comment
	 */
  addComment(comment: Comment): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getUserAuthToken()
      // use Restangular which creates interceptor
    });

    return this.http.post(
      `${this.apiLink}/trips/${comment['trip_id']}/comments`,
      { comment: comment },
      { headers: headers }
    )
      .map((data: Response) => data.json())
      .catch((res: Response) => this.catchError(res));
  }

	/**
	 * Delete Comment
	 * @method deleteComment
	 * @param {Comment} comment
	 * @return {Observable} Observable with Comment
	 */
  deleteComment(comment: Comment): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getUserAuthToken()
      // use Restangular which creates interceptor
    });

    return this.http.delete(
      `${this.apiLink}/trips/${comment['trip_id']}/comments/${comment['id']}`,
      { headers: headers }
    )
      .map((data: Response) => comment)
      .catch((res: Response) => this.catchError(res));
  }

  catchError(response: Response): Observable<String> {
    if (response.status == 401) {
      this.authService.redirectToLogin();
      this.toastyService.warning({ title: "Login", msg: "You need to login." });
    } else {
      this.toastyService.error({ title: "Server Error", msg: "Something went wrong !!!" });
    }
    console.log('in catch error method');
    // not returning throw as it raises an error on the parent observable
    // MORE INFO at https://youtu.be/3LKMwkuK0ZE?t=24m29s
    return Observable.of('server error');
  }
}
