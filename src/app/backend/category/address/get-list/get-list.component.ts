import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '../../../../globals';
import { TableService } from '../../../../services/integrated/table.service';
import { AlertComponent } from '../../../modules/alert/alert.component';

@Component({
    selector: 'app-get-list-address',
    templateUrl: './get-list.component.html',
})
export class GetlistComponent implements OnInit, OnDestroy {

    private connect;
    private conf = {
        getlist: {
            path: "settings/address/getlist",
            token: 'getListAddress'
        },
        changestatus: {
            path: "settings/address/changestatus",
            token: 'changestatusAddress'
        },
        remove: {
            path: "settings/address/remove",
            token: 'removeAddress'
        },
        changePin: {
            path: "settings/address/changepin",
            token: 'changepin'
        },
    }
    private cols = [
        { title: 'lblStt', field: 'index', show: true },
        { title: 'lblName', field: 'name', show: true, filter: true },
        { title: 'lblMakerDate', field: 'maker_date', show: true, filter: true },
        { title: 'lblAction', field: 'action', show: true },
        { title: '#', field: 'status', show: true, filter: true },
    ];
    public id: number = 0;
    public tableService = new TableService();
    private modalRef: BsModalRef;
    public flags: boolean = true;

    constructor(
        public globals: Globals,
        private modalService: BsModalService,
        private toastr: ToastrService,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
            switch (resp.token) {

                case this.conf.getlist.token:
                    if (resp.status == 1) {
                        this.tableService._ini({ data: [] });
                        this.tableService.sorting = { field: "orders", sort: "asc", type: 'number' };
                        this.tableService._concat(resp['data'], true);
                    }
                    break;

                case this.conf.remove.token:
                    this.toastr[type](resp.message, type, { closeButton: true });
                    if (resp.status == 1) { this.tableService._delRowData(this.id) }
                    break;

                case this.conf.changePin.token:
                case this.conf.changestatus.token:
                    this.toastr[type](resp.message, type);
                    if (resp.status == 1) {
                        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, });
                    }
                    break;
                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.tableService._ini({ cols: this.cols, data: [], keyword: 'getListSliders' });
        this.globals.send({ path: this.conf.getlist.path, token: this.conf.getlist.token, });
    }

    ngOnDestroy() {
        this.connect ? this.connect.unsubscribe() : '';
    }

    onRemove(item: any): void {
        this.id = item.id;
        this.modalRef = this.modalService.show(AlertComponent, { initialState: { messages: 'settings.address.remove', name: item.name } });
        this.modalRef.content.onClose.subscribe(result => {
            if (result == true) {
                this.globals.send({ path: this.conf.remove.path, token: this.conf.remove.token, params: { id: item.id } });
            }
        });
    }

    changeStatus = (id, status) => {
        if (this.flags) {
            this.globals.send({ path: this.conf.changestatus.path, token: this.conf.changestatus.token, data: { status: status == 1 ? 0 : 1 }, params: { id: id, } });
        }
    }

    changePin(item) {
        if (this.flags) {
            this.flags = false;
            
            this.globals.send({ 
                path: this.conf.changePin.path, 
                token: this.conf.changePin.token, 
                params: { 
                    id: +item.id, 
                    pin: +item.pin 
                } 
            });
        }
    }
}