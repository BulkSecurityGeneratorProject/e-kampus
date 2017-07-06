import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ContactMechanism } from './contact-mechanism.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ContactMechanismService {

    private resourceUrl = 'api/contact-mechanisms';
    private resourceSearchUrl = 'api/_search/contact-mechanisms';

    constructor(private http: Http) { }

    create(contactMechanism: ContactMechanism): Observable<ContactMechanism> {
        const copy = this.convert(contactMechanism);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(contactMechanism: ContactMechanism): Observable<ContactMechanism> {
        const copy = this.convert(contactMechanism);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: any): Observable<ContactMechanism> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }


    delete(id?: any): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

	executeProcess(contactMechanism: any): Observable<String> {
        const copy = this.convert(contactMechanism);
        return this.http.post(this.resourceUrl + '/execute', copy).map((res: Response) => {
            return res.json();
        });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(contactMechanism: ContactMechanism): ContactMechanism {
        const copy: ContactMechanism = Object.assign({}, contactMechanism);
        return copy;
    }
}