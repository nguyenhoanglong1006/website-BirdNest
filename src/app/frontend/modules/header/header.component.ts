import { Component, OnInit, HostListener, Inject, PLATFORM_ID, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CartService } from '~/services/apicart/cart.service';
import { Globals } from '~/globals';
import { ToslugService } from '~/services/integrated/toslug.service';
import { MenuService } from '~/services/modules/menu.service';
import { HomeService } from '~/services/home/home.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [ToslugService],
})
export class HeaderComponent implements OnInit {
    
    public company: any = {};

    public hovermenu: boolean = true;

    public width: number;

    public screenHome: boolean = true;

    modalRef: BsModalRef;

    navigationSubs;

    public mutiLang: any = { active: {}, data: [] };

    public refreshed: boolean = true;


    public user: any = {}

    constructor(
        public globals: Globals,

        public translate: TranslateService,

        public router: Router,

        public toSlug: ToslugService,

        public routerAtc: ActivatedRoute,

        public modalService: BsModalService,

        public menuService: MenuService,

        public homeService: HomeService,

        public apiCart: CartService,

        @Inject(DOCUMENT) private document: Document,

        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
            
        }

        this.navigationSubs = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.onCheckRouter();
            }
        });

    }

    ngOnInit() {
        this.onCheckRouter();
        this.menu.getMenu();
        this.category.get()
    }

    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }
    public menu = {
        data: [],
        getMenu: () => {
            this.menuService.getMenu({ position: 'menuTop' }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.menu.data = resp.data;
                }
            })
        }

    };


    public menuMobile = {
        show: <boolean>true,
        onMenu: (show: boolean) => {
            this.menuMobile.show = show;
        },
    };

    @HostListener('window:scroll', []) checkScroll() {
        if (isPlatformBrowser(this.platformId)) {
            const elm = document.getElementById('header');
            const headerTop = <HTMLInputElement>document.getElementsByClassName('header-top')[0]!;
            const logo = <HTMLInputElement>document.getElementsByClassName('logo-header')[0]!;

            if (window.scrollY > 700) {
                elm.classList.add('navbar-fixed');

                /* TODO: Hidden header top when scroll */
                // headerTop.classList.add('d-none');
                // logo.style.marginTop = 'var(--marginTopUnset)';

            } else {
                elm.classList.remove('navbar-fixed');

                /*TODO: Remove hidden header top when scroll */
                headerTop.classList.remove('d-none');

                logo.style.marginTop = 'var(--marginTop)';
            }
        }
    }
    
    public search = {
        token: '',

        value: '',

        onSearch: () => {
            // this.search.value = this.toSlug._ini(this.search.value.replace(/\s+/g, ' ').trim());

            if (this.search.check_search(this.search.value)) {
                this.router.navigate([
                    '/' +
                    (this.globals.language._language == 'vn' ? '/tim-kiem/' : 'en/search/') +
                    this.search.value,
                ]);

                this.document.getElementById('search').blur();
            }

            this.search.value = '';

            // this.menuMobile.onMenu(true);

            // this.modalRef.hide();
        },

        check_search: (value) => {
            let skip = true;
            skip =
                value.toString().length > 0 &&
                    value != '' &&
                    value != '-' &&
                    value != '[' &&
                    value != ']' &&
                    value != '\\' &&
                    value != '{' &&
                    value != '}'
                    ? true
                    : false;
            return skip;
        },
    };


    openModalSearch(template: TemplateRef<any>) {
        this.search.value = '';
        this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: 'gray modal-lg search-modal' }),
        );
    }
 

    onCheckRouter() {
        let link = window.location.pathname;
        switch (link) {
            case '/':
            case '/en':
                this.screenHome = true;
                break;
            default:
                this.screenHome = false;
                break;
        }
    }

    focusSearch() {
        setTimeout(() => {
            this.document.getElementById('search').focus();
        }, 300);
    }
    cart = {
        close: () => {
            this.document.getElementById('notification').classList.remove("d-block");
        },
        router: () => {
            this.router.navigate(['/gio-hang']);
            this.document.getElementById('notification').classList.remove("d-block");
        }
    }
    logout() {
        this.globals.CUSTOMERS.remove()
        setTimeout(() => {
            this.router.navigate(['/'])
        }, 200)
    }
    public category = {
        data: <any>[],
        get: (): void => {
            this.homeService.getCategories().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.category.data = resp.data;
                }
            });
        },
    };
}
