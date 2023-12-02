import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {

  postForm: FormGroup;
  imageForm: FormGroup;
  registForm: FormGroup;
  loginForm: FormGroup;

  isLinear = false;
  clickLogin: boolean = false;
  clickRegist: boolean = false;

  constructor(private fb: FormBuilder) {
    // Inicializáld a Reactive formot a FormBuilder segítségével
    this.registForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordAgain: ['', [Validators.required, Validators.minLength(6)]],
      temporaryAdoptiveParent: ['', Validators.required]
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      images: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.imageForm = this.fb.group({
      images: [null]
    });
  }

  onLogin() {
    this.clickLogin = true;
    this.clickRegist = false;
  }

  onRegist() {
    this.clickRegist = true;
    this.clickLogin = false;
  }

  onFileSelected(event: any) {
    console.log("kepfeltoltes");
    if (event.target.files.length > 0) {
      const fileArray = Array.from(event.target.files);
      // this.imageForm.get('images').setValue(fileArray);
    }
  }

  uploadImages() {
    console.log("upload");

    const formData = new FormData();
    // const images = this.imageForm.get('images').value;

    // for (let i = 0; i < images.length; i++) {
    //   formData.append('images', images[i]);
    // }
  
    // Itt megteheted a képek feltöltését a szerverre
    // Például: hívj meg egy HTTP POST kérést a képekkel
  
  }

  onSubmit() {
    // A form elküldése esetén itt kezelheted az adatokat
    if (this.postForm.valid) {
      console.log(this.postForm.value);
      // További logika: például HTTP kérést küldhetsz a szerverre
    }
  }
}
