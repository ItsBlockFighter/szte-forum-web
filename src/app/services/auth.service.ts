import {inject, Injectable, OnInit} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user} from "@angular/fire/auth";
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {firstValueFrom, from, Observable, of, switchMap} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private database: Firestore = inject(Firestore);

  private authUser = user(this.auth);

  get user(): Observable<User | null> {
    return this.authUser.pipe(
      switchMap(authUser => {
        if (authUser && authUser.uid) {
          return from(this.getUserById(authUser.uid));
        } else {
          return of(null);
        }
      })
    );
  }

  get currentUser(): Promise<User | null> {
    return firstValueFrom(this.user);
  }

  logout() {
    return this.auth.signOut();
  }

  async getUserById(id: string) {
    const docRef = doc(this.database, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {id: docSnap.id, ...docSnap.data()} as User;
    }
    return null;
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password)
  }

  async register(username: string, email: string, password: string) {
    const {user: authUser} = await createUserWithEmailAndPassword(this.auth, email, password);
    try {
      await setDoc(doc(this.database, 'users', authUser.uid), {
        username: username,
        email: email,
      });
    } catch (e) {
      throw new Error('Failed to create user!');
    }
  }
}
