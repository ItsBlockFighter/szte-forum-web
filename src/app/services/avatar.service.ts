import {inject, Injectable} from '@angular/core';
import {getDownloadURL, ref, Storage, uploadBytes} from "@angular/fire/storage";

interface AvatarCache {
  [userId: string]: {
    url: string,
    timestamp: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private storage: Storage = inject(Storage)

  private cache: AvatarCache = {}

  constructor() {
  }

  async getAvatarUrl(userId: string) {
    if (this.cache[userId] && Date.now() - this.cache[userId].timestamp < 300000) {
      return this.cache[userId].url
    }

    try {
      const url = await getDownloadURL(ref(this.storage, `images/${userId}/avatar.jpg`))
      if (!url) {
        return null
      }
      this.cache[userId] = {
        url,
        timestamp: Date.now()
      }
      return url
    } catch (error) {
      return null
    }
  }

  async uploadAvatar(userId: string, file: File) {
    try {
      const result = await uploadBytes(ref(this.storage, `images/${userId}/avatar.jpg`), file)
      const url = await getDownloadURL(result.ref)
      if (url) {
        this.cache[userId] = {
          url,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      throw new Error('Failed to upload avatar')
    }
  }
}
