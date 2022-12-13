import { HttpHeaders } from "@angular/common/http";

import { HttpResponseInterface } from "./http-response.interface";

export interface HttpErrorResponseInterface {
    error: HttpResponseInterface<any>;
    headers: HttpHeaders[];
    message: string;
    ok: boolean;
    status: number;
    statusText: string;
    url: string;
}
