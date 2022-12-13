import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WaitingService } from "pricefyfrontlib/app/shared/components/waiting/waiting.service";
import { finalize } from "rxjs/operators";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
    constructor(private waitingService: WaitingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        this.waitingService.show();

        return next.handle(req).pipe(
            finalize(() => {
                this.waitingService.hide();
            })
        );
    }
}
