import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CredentialsHttpInterceptor } from '../../interceptor/http-interceptor';
import { UrlService } from '../../services/url.service';
import { CreditService } from '../../services/credit.service';
import { firstValueFrom } from 'rxjs';
import { LocalstorageService } from '../../services/shared-data.service';

@Component({
  selector: 'app-swap',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
  templateUrl: './swap.component.html',
  styleUrl: './swap.component.scss',

})
export class SwapComponent implements OnInit {
  sourceImage: File | null = null;
  targetVideo: File | null = null;
  outputVideoUrl: string | null = null;
  loading = false;
  uploadProgress = 0;
  processingProgress = 0;  // For processing the video after upload
  credit: number;
  creditsToBeUsed: number;

  sourceImagePreview: string | null = null;  // Preview URL for the source image
  targetVideoPreview: string | null = null;  // Preview URL for the target video

  constructor(private http: HttpClient, private url: UrlService, private creditService: CreditService, private router: Router, private localStorage: LocalstorageService) { }

  async ngOnInit() {
    firstValueFrom(this.creditService.getCredit()).then(e => {
      if (e.isSuccess) {
        this.credit = e.data;
      }
      else {
        alert("Could not get credit")
      }
    }).catch(e => alert("Could not get credit"))
  }

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

      // Create a video element to load the file and extract duration
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = this.targetVideoPreview;

      videoElement.onloadedmetadata = () => {
        const durationInSeconds = videoElement.duration;
        console.log(`Video duration: ${durationInSeconds} seconds`);
        this.creditsToBeUsed = Math.round(durationInSeconds);
        // Optionally store the duration in a class property
        // this.videoDuration = durationInSeconds;
      };
    }
  }

  submit() {
    if (!this.sourceImage || !this.targetVideo) {
      alert('Please select both a source image and a target video.');
      return;
    }

    const confirmed = confirm(`This will use ${this.creditsToBeUsed} credits. Proceed?`);
    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append('sourceImage', this.sourceImage);
    formData.append('targetVideo', this.targetVideo);
    formData.append('model', 'inswapper_128');

    this.loading = true;
    this.uploadProgress = 0;
    this.processingProgress = 0;

    this.http.post(`${this.url.getHttpBaseUrl()}/api/swap-face`, formData, {
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
        console.log("ERROR UPLOADING")
        console.error('Error uploading:', error);
        alert('Face swap failed. Make sure you have sufficient credits and try again');
        this.loading = false;
      }
    });
  }

  logOut(){
    this.localStorage.removeEverything();
    this.router.navigate(['login'])
  }
}
