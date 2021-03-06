import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostStudent } from './post-student.model';
import { PostStudentService } from './post-student.service';

@Injectable()
export class PostStudentPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private postStudentService: PostStudentService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.postStudentService.find(id).subscribe((postStudent) => {
                this.postStudentModalRef(component, postStudent);
            });
        } else {
            return this.postStudentModalRef(component, new PostStudent());
        }
    }

    postStudentModalRef(component: Component, postStudent: PostStudent): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.postStudent = postStudent;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
