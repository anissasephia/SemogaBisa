import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, NavController, ToastController } from '@ionic/angular';
import { toastController } from '@ionic/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import {
  loginFail,
  loginSuccess,
  recoverPassword,
  recoverPasswordFail,
  recoverPasswordSuccess,
} from 'src/store/login/login.actions';
import { LoginState } from 'src/store/login/LoginState';
import { LoginPageForm } from './login.page.form';
import { login } from 'src/store/login/login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  @ViewChild('autocomplete') autocomplete!: IonInput;
  form: FormGroup;
  loginStateSubscription!: Subscription;
  

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private toastController: ToastController,
    private navController: NavController
   // private authService: AuthService
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
    this.form = new LoginPageForm(this.formBuilder).createForm();

    this.loginStateSubscription = this.store
      .select('login')
      .subscribe(loginState => {
        this.onIsrecoveredPassword(loginState);
        //this.onIsrecoveringPassword(loginState);

        //this.onIsLoggingIn(loginState);
        this.onIsLoggedIn(loginState);

        this.onError(loginState);
        this.toggleLoading(loginState);
      });
  }

  ngOnDestroy() {
    if (this.loginStateSubscription) {
      this.loginStateSubscription.unsubscribe();
    }
  }
  // ionViewDidEnter() {
  //   this.autocomplete.getInputElement().then((ref:any)=>{
  //     const autocomplete = new google.maps.places.Autocomplete(ref);
  //     autocomplete.addListener('place_changed', () => {
  //       console.log(autocomplete.getPlace());
  //     });
  //   })
  // }

  private toggleLoading(loginState: LoginState) {
    if (loginState.isLoggingIn || loginState.isRecoveringPassword) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  private onIsLoggedIn(loginState: LoginState) {
    if (loginState.isLoggedIn) {
      this.navController.navigateRoot(['home']);
    }
  }
  // private onIsLoggingIn(loginState: LoginState) {
  //   if (loginState.isLoggingIn) {
  //     const email = this.form.get('email')?.value;
  //     const password = this.form.get('password')?.value;
  //     this.authService.login(email, password).subscribe(
  //       user => {
  //         this.store.dispatch(loginSuccess({ user }));
  //       },
  //       error => {
  //         this.store.dispatch(loginFail({ error }));
  //       }
  //     );
  //   }
  // }

  private async onError(loginState: LoginState) {
    if (loginState.error) {
      const toaster = await this.toastController.create({
        position: 'bottom',
        message: loginState.error.message,
        color: 'danger',
      });
      toaster.present();
    }
  }

  // private onIsrecoveringPassword(loginState: LoginState) {
  //   if (loginState.isRecoveringPassword) {
  //     this.authService
  //       .recoverEmailPassword(this.form.get('email')?.value)
  //       .subscribe(
  //         () => {
  //           this.store.dispatch(recoverPasswordSuccess());
  //         },
  //         error => {
  //           this.store.dispatch(recoverPasswordFail({ error }));
  //         }
  //       );
  //   }
  // }

  private async onIsrecoveredPassword(loginState: LoginState) {
    if (loginState.isRecoveredPassword) {
      const toaster = await this.toastController.create({
        position: 'bottom',
        message: 'Recovery email sent',
        color: 'primary',
      });
      toaster.present();
    }
  }

  forgotEmailPassword() {
    //this.store.dispatch(recoverPassword());
    this.store.dispatch(recoverPassword({email: this.form.get('email')?.value}));
    // setTimeout(() => {
    //   this.store.dispatch(hide());
    // }, 3000);
  }

  login() {
    this.store.dispatch(login({email: this.form.get('email')?.value, password: this.form.get('password')?.value}));
    //this.router.navigate(['home']);
  }

  register() {
    this.router.navigate(['register']);
  }
}
