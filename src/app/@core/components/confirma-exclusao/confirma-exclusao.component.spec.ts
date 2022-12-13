import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { createTranslateLoader } from "src/app/app.factories";

import { ConfirmaExclusaoComponent } from "./confirma-exclusao.component";

describe("ConfirmaExclusaoComponent", () => {
    let component: ConfirmaExclusaoComponent;
    let fixture: ComponentFixture<ConfirmaExclusaoComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
                    }),
                ],
                declarations: [ConfirmaExclusaoComponent],
                providers: [BsModalRef],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmaExclusaoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should find the text from h1", () => {
        const h1 = fixture.debugElement.nativeElement.querySelector("h1");
        expect(h1.textContent).toEqual("ARE_YOU_SURE_YOU_WANT_TO_DELETE");
    });

    it("should have been called cancel()", () => {
        spyOn(component, "cancel");
        let button = fixture.debugElement.nativeElement.querySelector(".btn-light");
        button.click();
        expect(component.cancel).toHaveBeenCalled();
    });

    it("should have been called confirm()", () => {
        spyOn(component, "confirm");
        let button = fixture.debugElement.nativeElement.querySelector(".btn-danger");
        button.click();
        expect(component.confirm).toHaveBeenCalled();
    });

    it("Confirmed should be true", () => {
        component.confirmed.subscribe((result) => {
            expect(result).toEqual(true);
        });

        spyOn(component, "confirm").and.callThrough();
        component.confirm();
        expect(component.confirm).toHaveBeenCalled();
    });

    it("Confirmed should be false", () => {
        component.confirmed.subscribe((result) => {
            expect(result).toEqual(false);
        });

        spyOn(component, "cancel").and.callThrough();
        component.cancel();
        expect(component.cancel).toHaveBeenCalled();
    });
});
