import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  @Input() type!: string;
  postForm: FormGroup;
  // imageForm: FormGroup;

  isLinear = false;

  constructor(private fb: FormBuilder, private dbService: DatabaseService) {

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      location: ['', Validators.required],
    });

    // this.imageForm = this.fb.group({
    //   images: ['' , Validators.required]
    // });
  }

  onFileSelected(event: any) {
    console.log("kepfeltoltes");
    if (event.target.files.length > 0) {
      const fileArray = Array.from(event.target.files);
      // this.imageForm.get('images').setValue(fileArray);
    }
  }

  // onFileSelected(event: any) {
  // Handle file selection if needed
  // }

  // uploadImages() {
  // Implement image upload logic if needed
  // }

  onSubmit() {
    if (this.postForm.valid) {
      console.log(this.postForm.value);
      let current_post = {
        title: this.postForm.value.title,
        description: this.postForm.value.description,
        location: this.postForm.value.location,
        // images: this.imageForm.value.images,
        date: new Date().toISOString(),
        type: this.type,
      };
      
      this.dbService.addNewPost(current_post);
    }
  }
}
