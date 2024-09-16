import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../globals';
import { uploadFileService } from '../../../services/integrated/upload.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LinkService } from '../../../services/integrated/link.service';
import { ToslugService } from '../../../services/integrated/toslug.service';
import { PagebuilderComponent } from '../../modules/pagebuilder/pagebuilder.component';
import { AlertComponent } from '../../modules/alert/alert.component';

@Component({
    selector: 'app-process-content',
    templateUrl: './process.component.html',
    providers: [LinkService, ToslugService]
})
export class ProcessContentComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getListGroup: {
            path: "pages/index/getlistgroup",
            token: 'getListGroup'
        },
        getRow: {
            path: "contents/index/getrow",
            token: 'getRowContent'
        },
        process: {
            path: "contents/index/process",
            token: 'processContent'
        },

        getListTags: {
            path: "settings/tags/getlist",
            token: 'getListTags'
        }
    }
    @ViewChild('inputSearchTags') private inputSearchTags: ElementRef;

    public modalRef: BsModalRef;
    public fm: FormGroup;
    public dataGroup = [];
    public id: number = 0;
    public images = new uploadFileService();
    public file = new uploadFileService();
    public flags: boolean = true;
    public position = [
        { value: 0, name: "pages.hidden" },
        { value: 1, name: "pages.top" },
        { value: 2, name: "pages.bottom" },
    ];

    public mutiLang: any = [];
    public lang_id: any;
    public idTamp: number = 0;
    public code: string = '';
    public idGroup: number = 0;

    constructor(
        public fb: FormBuilder,
        public globals: Globals,
        public link: LinkService,
        public toastr: ToastrService,
        public router: Router,
        public routerAct: ActivatedRoute,
        private modalService: BsModalService,
    ) {
        this.lang_id = this.globals.language.get(true);
        this.mutiLang = this.globals.language.getData();

        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getRow.token:
                    if (resp.status == 1) {
                        if (Object.keys(resp.data).length > 0) {
                            this.code = resp.data.code;
                            this.id = resp.data.id;
                            this.idGroup = resp.data.group_id;
                            this.lang_id = resp.data.language_id;
                            this.tags.dataList = resp.data.tags;
                            this.globals.send({ path: this.conf.getListGroup.path, token: this.conf.getListGroup.token, params: { type: 4, lang_id: +this.lang_id } });
                            this.fmConfigs(resp.data);
                        } else {
                            this.id = 0;
                            this.fmConfigs();
                        }
                    }
                    break;

                case this.conf.getListGroup.token:
                    if (resp.status == 1) {
                        this.dataGroup = resp.data;
                    }
                    break;

                case this.conf.getListTags.token:
                    if (resp.status == 1) {
                        this.tags.data = resp.data
                    }
                    break;

                case this.conf.process.token:
                    this.flags = true;
                    let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) {
                        this.router.navigate(['/admin/contents/update/', resp.data])
                    }
                    break;

                default:
                    break;
            }
        });
    }
    ngOnInit() {

        this.routerAct.params.subscribe(params => {
            this.id = +params.id || 0;
            this.idTamp = +params.id || 0;
            if (this.id && this.id > 0) {
                this.globals.send({ path: this.conf.getRow.path, token: this.conf.getRow.token, params: { id: this.id, lang_id: +this.lang_id } });
            } else {
                this.globals.send({ path: this.conf.getListGroup.path, token: this.conf.getListGroup.token, params: { type: 4, lang_id: +this.lang_id } });
                this.fmConfigs()
            }
        })
        this.code = 'n' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000);
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    fmConfigs(item: any = "") {

        item = typeof item === 'object' ? item : { status: 1, page_id: +this.idGroup > 0 ? this.idGroup : "" };

        this.fm = this.fb.group({
            name: [item.name ? item.name : '', [Validators.required]],
            link: [item.link ? item.link : '', [Validators.required]],
            title: [item.title ? item.title : '', [Validators.maxLength(75)]],
            detail: [item.detail ? item.detail : '',],
            page_id: [item.page_id ? item.page_id : '', [Validators.required]],
            description: [item.description ? item.description : '', [Validators.maxLength(325)]],
            note: item.note ? item.note : '',
            date: [item.date ? new Date(item.date) : new Date(), [Validators.required]],
            author: item.author ? item.author : '',
            builder: item.builder ? item.builder : '',
            position: item.position ? item.position : 0,
            status: (item.status && item.status == 1) ? true : false,
        });
        const imagesConfig = { path: this.globals.BASE_API_URL + ((item.images && !item.images.includes('uploads/contents/')) ? 'uploads/contents/' : ''), data: item.images ? item.images : '' };
        this.images = new uploadFileService();
        this.images._ini(imagesConfig);
        this.file._ini({ path: this.globals.BASE_API_URL + ((item.file && !item.file.includes('uploads/file/')) ? 'uploads/file/' : ''), data: item.file ? item.file : '', type: 2 });
    }

    onChangeLink(e) {
        const url = this.link._convent(e.target.value.trim());
        this.fm.value.link = url;
    }

    public tags = {
        data: [],
        dataList: [],
        valueSearch: '',
        field: ['name'],
        _select: (item) => {
            let skip = true;
            for (let i = 0; i < this.tags.dataList.length; i++) {
                if (this.tags.dataList[i].name.toLowerCase() == item.name.toLowerCase()) {
                    skip = false;
                    break;
                }
            }
            if (skip == true) {
                this.tags.dataList.push(item)
            }
        },

        _remove: (item) => {
            for (let i = 0; i < this.tags.dataList.length; i++) {
                if (this.tags.dataList[i].name.toLowerCase() == item.name.toLowerCase()) {
                    this.tags.dataList.splice(i, 1);
                }
            }
        },
        _focusSearch: () => {
            setTimeout(() => {
                this.inputSearchTags.nativeElement.focus();
            }, 300);
            this.tags.data.length == 0 ? this.globals.send({ path: this.conf.getListTags.path, token: this.conf.getListTags.token, params: { lang_id: this.lang_id } }) : '';
        },
        _clear: () => {
            this.tags.valueSearch = ''
        }
    }

    pageBuilder = {
        flag: false,
        _openModal: () => {
            this.pageBuilder.flag = true;
            this.modalRef = this.modalService.show(PagebuilderComponent, {
                class: 'full-screen-modal',
                initialState: { data: this.fm.value.builder }
            });
            this.modalRef.content.onClose.subscribe(result => {
                this.pageBuilder.flag = (result.length > 0 || result == true) ? false : true;
                if (result.length > 0) {
                    this.fm.controls['builder'].setValue(result);
                }
                document.querySelector('.fp-add-view') ? document.querySelector('.fp-add-view').classList.remove('fp-add-view') : '';
                document.querySelector('.fp-full-view') ? document.querySelector('.fp-full-view').classList.remove('fp-full-view') : '';
                let toolbar = document.querySelectorAll('.fp-block-toolbar');
                if (toolbar.length > 0) {
                    for (let i = 0; i < toolbar.length; i++) {
                        toolbar[i].remove()
                    }
                }
            })
        },
        _clear: () => {
            this.modalRef = this.modalService.show(AlertComponent, {
                initialState: { messages: 'pageBuilder.removeBlock' }
            });
            this.modalRef.content.onClose.subscribe(result => {
                if (result == true && this.id > 0) {
                    this.fm.controls['builder'].setValue('');
                }
            });
        }
    }

    onSubmit() {
        if (this.fm.valid && this.flags) {
            this.flags = false
            const data = this.fm.value;
            data.code = this.code;
            data.name = data.name.trim();
            data.images = this.images._get(true);
            data.images.path = 'uploads/contents/';
            data.file = this.file._get(true);
            data.file.path = 'uploads/file/';
            data.link = this.link._convent(data.link);
            data.status = (data.status == true || data.status == 1) ? 1 : 0;
            data.date = this.globals.time.format(data.date);
            this.globals.send({ path: this.conf.process.path, token: this.conf.process.token, data: { data: data, tags: this.tags.dataList }, params: { id: this.id || 0, lang_id: this.lang_id } });
        }
    }
}