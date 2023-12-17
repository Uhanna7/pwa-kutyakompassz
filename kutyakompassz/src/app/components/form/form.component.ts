import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';
import { IDBService } from 'src/app/services/idb.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() type!: string;
  postForm: FormGroup;
  imageForm: FormGroup;

  images: any[] = [];

  user: any;

  isLinear = false;

  constructor(
    private fb: FormBuilder,
    private dbService: DatabaseService,
    private afAuth: AngularFireAuth,
    private storageService: StorageService,
    private idbService: IDBService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      location: ['', Validators.required],
    });

    this.imageForm = this.fb.group({
      images: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  onFileSelected(event: any) {
    if (
      event.target.files.length > 0 &&
      event.target.files.length < 5 &&
      this.imageForm.get('images')
    ) {
      const fileArray = Array.from(event.target.files);
      const imagesControl = this.imageForm.get('images');

      if (imagesControl) {
        imagesControl.setValue(fileArray);
      } else {
        console.error("The 'images' control is null.");
      }
    }
  }

  async onSubmit() {
    if (this.postForm.valid && this.user) {
      const downloadURLs = await this.uploadImages();
      if (downloadURLs) {
        const current_post = {
          title: this.postForm.value.title,
          description: this.postForm.value.description,
          location: this.postForm.value.location,
          date: new Date().toISOString(),
          type: this.type,
          images: downloadURLs,
          userId: this.user.uid,
        };

        this.dbService.addNewPost(current_post, this.imageForm.value.images);
        this.idbService.addPost(current_post);
      }
    }
    this.postForm.reset();
    this.imageForm.reset();
  }

  private async uploadImages(): Promise<string[] | null> {
    const images = this.imageForm.value.images;
    const downloadURLs: string[] = [];

    for (const image of images) {
      const downloadURL = await this.storageService
        .uploadImage(image as File, 'posts')
        .toPromise();

      if (downloadURL) {        
        downloadURLs.push(downloadURL);
      } else {
        console.error('Error uploading image:', image);
        return null;
      }
    }

    return downloadURLs;
  }
}
