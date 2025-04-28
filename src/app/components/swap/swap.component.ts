import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-swap',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './swap.component.html',
  styleUrl: './swap.component.scss'
})
export class SwapComponent {
  sourceImage: File | null = null;
  targetVideo: File | null = null;
  outputVideoUrl: string | null = null;
  loading = false;
  uploadProgress = 0;
  processingProgress = 0;  // For processing the video after upload

  sourceImagePreview: string | null = null;  // Preview URL for the source image
  targetVideoPreview: string | null = null;  // Preview URL for the target video

  constructor(private http: HttpClient) {}

  onSourceImageSelected(event: any) {
    this.sourceImage = event.target.files[0];
    if (this.sourceImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.sourceImagePreview = e.target.result;
      };
      reader.readAsDataURL(this.sourceImage);  // Convert image to base64 URL
    }
  }

  onTargetVideoSelected(event: any) {
    this.targetVideo = event.target.files[0];
    if (this.targetVideo) {
      this.targetVideoPreview = URL.createObjectURL(this.targetVideo);  // Create video URL for preview
    }
  }

  submit() {
    if (!this.sourceImage || !this.targetVideo) {
      alert('Please select both a source image and a target video.');
      return;
    }

    const formData = new FormData();
    formData.append('sourceImage', this.sourceImage);
    formData.append('targetVideo', this.targetVideo);
    formData.append('model', 'inswapper_128');

    this.loading = true;
    this.uploadProgress = 0;
    this.processingProgress = 0;

    this.http.post('http://localhost:5500/api/swap-face', formData, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);
            }
            break;

          case HttpEventType.Response:
            const videoBlob = new Blob([event.body!], { type: 'video/mp4' });
            this.outputVideoUrl = URL.createObjectURL(videoBlob);
            this.loading = false;
            this.uploadProgress = 100; // Complete upload
            break;
        }
      },
      error: (error) => {
        console.error('Error uploading:', error);
        alert('Face swap failed.');
        this.loading = false;
      }
    });
  }
}
