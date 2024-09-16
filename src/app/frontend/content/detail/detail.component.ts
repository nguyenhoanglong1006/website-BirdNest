import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  BsDatepickerDirective,
  BsLocaleService,
} from "ngx-bootstrap/datepicker";
import { defineLocale } from "ngx-bootstrap/chronos";
import { isPlatformBrowser } from "@angular/common";
import { Location } from "@angular/common";

import { PageService } from "~/services/page/page.service";
import { AppService } from "~/services/app.service";
import { Globals } from "~/globals";
import { defineLocaleDatepicker } from "~/frontend/typings";
import { HomeService } from "~/services/home/home.service";

@Component({
  selector: "app-content-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.css"],
})
export class DetailContentComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker: BsDatepickerDirective;



  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public homeService: HomeService,
    public pageService: PageService,
    private appService: AppService,
    public globals: Globals,
    private loction: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    private localeService: BsLocaleService
  ) {}

  ngOnInit() {
    this.news.get();
  }

  public news = {
    data: <any>[],
    get: (): void => {
      this.homeService.getNews().subscribe((resp: any) => {
        if (resp.status == 1) {
          this.news.data = resp.data;
        }
      });
    },
  };
}
