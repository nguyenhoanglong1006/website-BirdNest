import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { Globals } from '~/globals';
import { SlideService } from '~/services/home/slide.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

    public slider = [];

    public width: number;

    public isBrowser: boolean;

    constructor(
        public slideService: SlideService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public globals: Globals
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        if (this.isBrowser) {
            this.width = window.innerWidth;
        }
        this.getSlide();
    }

    getSlide(): void {
        this.slideService.getSlide({ type: 2 }).subscribe((resp: any) => {
            if (resp.status == 1) {
                this.slider = resp.data;
                console.log(this.slider);
                
            }
        });
    }
    lo

  
}
