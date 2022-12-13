import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { SortDirective } from "./sort.directive";

@Component({
    template: `
        <table>
            <thead>
                <tr>
                    <th id="ordenaId" [pimSort]="stores" [(order)]="idDestination" data-name="id">Id</th>
                    <th id="ordenaName" [pimSort]="stores" [(order)]="nameDestination" data-name="name">Name</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let store of stores">
                    <th class="id">{{ store.id }}</th>
                    <th class="name">{{ store.name }}</th>
                </tr>
            </tbody>
        </table>
    `,
})
class TestHostComponent {
    idDestination: string = "desc";
    nameDestination: string = "desc";
    stores = [
        { id: 2, name: "Taquaral" },
        { id: 3, name: "Barão" },
        { id: 1, name: "Mansões" },
    ];
}

describe("SortDirective", () => {
    let componentTest: TestHostComponent;
    let fixtureTest: ComponentFixture<TestHostComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientModule],
                declarations: [SortDirective, TestHostComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixtureTest = TestBed.createComponent(TestHostComponent);
        componentTest = fixtureTest.componentInstance;
        fixtureTest.detectChanges();
    });

    it("should order by id", () => {
        let ids = fixtureTest.debugElement.nativeElement.querySelectorAll(".id");
        expect(ids[0].textContent.trim()).toEqual("2");
        expect(ids[1].textContent.trim()).toEqual("3");
        expect(ids[2].textContent.trim()).toEqual("1");

        const ordernaId = fixtureTest.debugElement.nativeElement.querySelector("#ordenaId");
        ordernaId.click();
        fixtureTest.detectChanges();

        ids = fixtureTest.debugElement.nativeElement.querySelectorAll(".id");
        expect(ids[0].textContent.trim()).toEqual("3");
        expect(ids[1].textContent.trim()).toEqual("2");
        expect(ids[2].textContent.trim()).toEqual("1");

        ordernaId.click();
        fixtureTest.detectChanges();

        ids = fixtureTest.debugElement.nativeElement.querySelectorAll(".id");
        expect(ids[0].textContent.trim()).toEqual("1");
        expect(ids[1].textContent.trim()).toEqual("2");
        expect(ids[2].textContent.trim()).toEqual("3");
    });

    it("should order by name", () => {
        let names = fixtureTest.debugElement.nativeElement.querySelectorAll(".name");
        expect(names[0].textContent.trim()).toEqual("Taquaral");
        expect(names[1].textContent.trim()).toEqual("Barão");
        expect(names[2].textContent.trim()).toEqual("Mansões");

        const ordernaId = fixtureTest.debugElement.nativeElement.querySelector("#ordenaName");
        ordernaId.click();
        fixtureTest.detectChanges();

        names = fixtureTest.debugElement.nativeElement.querySelectorAll(".name");
        expect(names[0].textContent.trim()).toEqual("Taquaral");
        expect(names[1].textContent.trim()).toEqual("Mansões");
        expect(names[2].textContent.trim()).toEqual("Barão");

        ordernaId.click();
        fixtureTest.detectChanges();

        names = fixtureTest.debugElement.nativeElement.querySelectorAll(".name");
        expect(names[0].textContent.trim()).toEqual("Barão");
        expect(names[1].textContent.trim()).toEqual("Mansões");
        expect(names[2].textContent.trim()).toEqual("Taquaral");
    });
});
