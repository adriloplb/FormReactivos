import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
})
export class RegistroPage {
  public registroForm: FormGroup;
  public isSubmitting = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    // Configuración del formulario reactivo con validaciones[cite: 4]
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      // Campo de fecha de nacimiento requerido
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.registroForm.value;
      console.log('Datos del formulario:', formData);

      // Simulación de envío asíncrono[cite: 5]
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Alerta flotante de confirmación
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'El formulario se ha enviado correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();

      this.registroForm.reset();
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}