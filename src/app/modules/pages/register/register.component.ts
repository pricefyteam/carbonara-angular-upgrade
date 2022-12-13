import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../../../../../pricefyfrontlib/app/core/settings/settings.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
    valForm: FormGroup;
    passwordForm: FormGroup;

    constructor(public settings: SettingsService, fb: FormBuilder) {
        let password = new FormControl("", [Validators.required]);
        let certainPassword = new FormControl("", [Validators.required]);

        this.passwordForm = fb.group({
            password: password,
            confirmPassword: certainPassword,
        });

        this.valForm = fb.group({
            email: [null, [Validators.required]],
            accountagreed: [null, Validators.required],
            passwordGroup: this.passwordForm,
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        for (let c in this.passwordForm.controls) {
            this.passwordForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
            console.log("Valid!");
            console.log(value);
        }
    }

    ngOnInit() {}
}
