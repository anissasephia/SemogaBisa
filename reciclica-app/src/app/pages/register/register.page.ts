import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { RegisterPageForm } from './form/register.page.form';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { register } from 'src/store/register/register.actions';

import { RegisterState } from 'src/store/register/RegisterState';
import { hide, show } from 'src/store/loading/loading.actions';
import { IonInput, ToastController } from '@ionic/angular';
import { login } from 'src/store/login/login.actions';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/loaction/location.service';


declare var google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  @ViewChild('autocomplete')
  autocomplete!: IonInput;

  registerForm!: RegisterPageForm;
  registerStateSubscription!: Subscription;

  constructor(private formBuilder:FormBuilder, private store: Store<AppState>, private toastController: ToastController, 
    private locationServices: LocationService 
    // private geolocation: Geolocation, 
    ) {
    
   }

  ngOnInit() {
    this.createForm();
    this.watchRegisterState();
    this.fillUserAddressWithUserCurrentPosition();
  }

  ngOnDestroy() {
  this.registerStateSubscription.unsubscribe();
  }

  // ionViewDidEnter() {
  //   this.autocomplete.getInputElement().then((ref: any) => {
  //     const autocomplete = new google.maps.places.Autocomplete(ref);
  //     autocomplete.addListener('place_changed', () => {
  //       this.registerForm.setAddress(autocomplete.getPlace())
  //     })
  //   })
  // }

  register(){
    this.registerForm.getForm().markAllAsTouched();
    if (this.registerForm.getForm().valid){
      this.store.dispatch(register({userRegister: this.registerForm.getForm().value}))
    }
    
  }
  private fillUserAddressWithUserCurrentPosition() {
    // this.geolocation.getCurrentPosition().then(position => {
    //   this.locationServices.geocode(position.coords).subscribe(result => {
    //     this.registerForm.setAddress(result);
    //   });
    // })

    navigator.geolocation.getCurrentPosition((enableHighAccuracy) => {
      console.log(enableHighAccuracy)
    })
  }

  private createForm(){
    this.registerForm = new RegisterPageForm(this.formBuilder);
  }

  private watchRegisterState() {
    this.registerStateSubscription = this.store.select('register').subscribe(state => {
        this.toggleLoading(state);
        this.onRegistered(state);
        
        this.onError(state);
        
    })
  }

  private onRegistered(state: RegisterState){
    if (state.isRegistered){
      this.store.dispatch(login({
       email: this.registerForm.getForm().value.email,
       password: this.registerForm.getForm().value.password
      }))
     }
  }
  private onError(state: RegisterState){
    if (state.error){
      this.toastController.create({
        message: state.error.message,
        duration: 5000,
        header: 'Registration not done'
      }).then(toast => toast.present());
    }
  }

  private toggleLoading(state: RegisterState) {
    if (state.isRegistering){
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }



  

}