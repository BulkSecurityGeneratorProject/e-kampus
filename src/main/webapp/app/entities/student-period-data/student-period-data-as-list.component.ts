import {Component, OnInit, OnChanges, OnDestroy, Input} from '@angular/core';
import {Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import {StudentPeriodData} from './student-period-data.model';
import {StudentPeriodDataService} from './student-period-data.service';
import {ITEMS_PER_PAGE, Principal, ResponseWrapper} from '../../shared';
import {PaginationConfig} from '../../blocks/config/uib-pagination.config';

import {LazyLoadEvent} from 'primeng/primeng';
import {ToasterService} from '../../shared/alert/toaster.service';

@Component({
    selector: 'jhi-student-period-data-as-list',
    templateUrl: './student-period-data-as-list.component.html'
})
export class StudentPeriodDataAsList implements OnInit, OnDestroy, OnChanges {
    @Input() filterBy: any;

    currentAccount: any;
    studentPeriodData: StudentPeriodData[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(
        private studentPeriodDataService: StudentPeriodDataService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private toasterService: ToasterService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 1;
        this.predicate = 'idStudentPeriod';
        this.reverse = 'asc';
    }

    loadAll() {
        this.studentPeriodDataService.query({
            filterBy: this.filterBy,
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()}).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/student-period-data'], {queryParams:
            {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate(['/student-period-data', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInStudentPeriodData();
    }

    ngOnChanges() {
        this.loadAll();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: StudentPeriodData) {
        return item.idStudentPeriod;
    }

    registerChangeInStudentPeriodData() {
        this.eventSubscriber = this.eventManager.subscribe('studentPeriodDataListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'idStudentPeriod') {
            result.push('idStudentPeriod');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.studentPeriodData = data;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    executeProcess(data) {
        this.studentPeriodDataService.executeProcess(data).subscribe(
           data => console.log('this: ', data),
           err => console.log(err),
           () => this.toasterService.showToaster('info', 'Data Proces', 'Done process in system..')
        );
    }

    loadDataLazy(event: LazyLoadEvent) {
        this.itemsPerPage = event.rows;
        this.page = Math.ceil(event.first / this.itemsPerPage) + 1;

        if (event.sortField !== undefined) {
            this.predicate = event.sortField;
            this.reverse = event.sortOrder;
        }
        this.loadAll();
    }

    updateRowData(event) {
        if (event.data.id !== undefined) {
            this.studentPeriodDataService.update(event.data)
                .subscribe((res: StudentPeriodData) =>
                    this.onRowDataSaveSuccess(res), (res: Response) => this.onRowDataSaveError(res));
        } else {
            this.studentPeriodDataService.create(event.data)
                .subscribe((res: StudentPeriodData) =>
                    this.onRowDataSaveSuccess(res), (res: Response) => this.onRowDataSaveError(res));
        }
    }

    private onRowDataSaveSuccess(result: StudentPeriodData) {
        this.toasterService.showToaster('info', 'StudentPeriodData Saved', 'Data saved..');
    }

    private onRowDataSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }
}
