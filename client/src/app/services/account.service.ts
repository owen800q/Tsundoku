import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FirebaseAuth, FirebaseFunctions } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';

import { User } from 'shared/entity';
import { NetworkService } from './network.service';
import { UserService } from './user.service';

/** 登録 / ログイン / ログアウト / 退会処理, ログイン中のアカウントの情報の保持 を担当する */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private auth: FirebaseAuth;
  private functions: FirebaseFunctions;
  loginSubject = new BehaviorSubject<User | null>(null);
  login$ = this.loginSubject.asObservable();

  constructor(private router: Router,
              private networkService: NetworkService,
              private userService: UserService,
              private afAuth: AngularFireAuth,
              private afFunctions: AngularFireFunctions) {
    this.auth = this.afAuth.auth;
    this.functions = this.afFunctions.functions;

    this.networkService.observable.subscribe((online) => {
      if (!online) {
        return;
      }

      this.auth.onAuthStateChanged(async user => {
        if (user) {
          this.loginSubject.next(await this.userService.getUserByUID(user.uid));
          return;
        }

        if (['/', '/login', '/register'].indexOf(location.pathname) === -1)
            await this.router.navigate(['/login']);
      });
    });
  }

  async login(email: string, password: string): Promise<void> {
    if (this.auth.currentUser) return;

    const result = await this.auth.signInWithEmailAndPassword(email, password);

    if (result == null || result.user == null) throw new Error('ログインに失敗しました');

    const hitUser = await this.userService.getUserByUID(result.user.uid);

    if (hitUser === null) throw new Error('指定した UID に対応するユーザーが見つかりません');

    localStorage.setItem('myself', JSON.stringify(hitUser));
  }

  get uid() { return this.loginSubject.value && this.loginSubject.value.uid; }

  get name() { return this.loginSubject.value && this.loginSubject.value.name; }

  get screenName() { return this.loginSubject.value && this.loginSubject.value.screenName; }

  get image() { return this.loginSubject.value && this.loginSubject.value.image; }

  get bio() { return this.loginSubject.value && this.loginSubject.value.bio; }
}
