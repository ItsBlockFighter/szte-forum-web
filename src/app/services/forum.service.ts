import {inject, Injectable} from '@angular/core';
import {Forum} from '../models/forum';
import {Post} from "../models/post";
import {Thread} from "../models/thread";
import {User} from "../models/user";
import {Category} from "../models/category";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private database: Firestore = inject(Firestore);

  constructor() {
  }

  getForumsByParentId(parentId: string) {
    const forumsCollection = collection(this.database, 'forums');
    const forumsQuery = query(
      forumsCollection,
      where('parentId', '==', parentId),
      orderBy('creationDate', 'asc')
    );
    return collectionData(forumsQuery, {idField: 'id'}) as Observable<Forum[]>;
  }

  getThreadsByForumId(forumId: string) {
    const threadsCollection = collection(this.database, 'threads');
    const threadsQuery = query(
      threadsCollection,
      where('forumId', '==', forumId),
      orderBy('creationDate', 'asc')
    );
    return collectionData(threadsQuery, {idField: 'id'}) as Observable<Thread[]>;
  }

  getCategories() {
    const categoriesCollection = collection(this.database, 'categories');
    const categoriesQuery = query(
      categoriesCollection,
      orderBy('creationDate', 'asc')
    );
    return collectionData(categoriesQuery, {idField: 'id'}) as Observable<Category[]>;
  }

  async getUserById(userId: string): Promise<User> {
    const docRef = doc(this.database, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {id: docSnap.id, ...docSnap.data()} as User;
    } else {
      throw new Error('No such document!');
    }
  }

  async getForumById(id: string) {
    const docRef = doc(this.database, 'forums', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {id: docSnap.id, ...docSnap.data()} as Forum;
    } else {
      throw new Error('No such document!');
    }
  }

  async getThreadById(id: string) {
    const docRef = doc(this.database, 'threads', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {id: docSnap.id, ...docSnap.data()} as Thread;
    } else {
      throw new Error('No such document!');
    }
  }

  getPostsByThreadId(id: string) {
    const postsCollection = collection(this.database, 'posts');
    const postsQuery = query(
      postsCollection,
      where('threadId', '==', id),
      orderBy('creationDate', 'asc')
    );
    return collectionData(postsQuery, {idField: 'id'}) as Observable<Post[]>;
  }

  async countThreadsByForumId(forumId: string) {
    const threadsCollection = collection(this.database, 'threads');
    const threadsQuery = query(
      threadsCollection,
      where('forumId', '==', forumId)
    );
    return await getDocs(threadsQuery).then(snapshot => snapshot.size);
  }

  async countForumsByParentId(parentId: string) {
    const forumsCollection = collection(this.database, 'forums');
    const forumsQuery = query(
      forumsCollection,
      where('parentId', '==', parentId)
    );
    return await getDocs(forumsQuery).then(snapshot => snapshot.size);
  }

  async countPostsByThreadId(id: string) {
    const postsCollection = collection(this.database, 'posts');
    const postsQuery = query(
      postsCollection,
      where('threadId', '==', id)
    );
    return await getDocs(postsQuery).then(snapshot => snapshot.size);
  }

  async totalThreads() {
    const threadsCollection = collection(this.database, 'threads');
    return await getDocs(threadsCollection).then(snapshot => snapshot.size);
  }

  async totalPosts() {
    const postsCollection = collection(this.database, 'posts');
    return await getDocs(postsCollection).then(snapshot => snapshot.size);
  }

  async totalUsers() {
    const usersCollection = collection(this.database, 'users');
    return await getDocs(usersCollection).then(snapshot => snapshot.size);
  }

  async updatePost(post: Post) {
    await updateDoc(
      doc(this.database, 'posts', post.id), {
        content: post.content,
        lastUpdate: new Date()
      }
    )
  }

  async createPost(post: Post) {
    await addDoc(collection(this.database, 'posts'), post);
  }

  async deletePost(post: Post) {
    await deleteDoc(doc(this.database, 'posts', post.id));
  }

  async createThread(thread: Thread) {
    return await addDoc(collection(this.database, 'threads'), thread);
  }

  async deleteThread(thread: Thread) {
    await deleteDoc(doc(this.database, 'threads', thread.id));
  }
}
