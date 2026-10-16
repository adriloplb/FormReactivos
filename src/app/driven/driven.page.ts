import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonInput, IonButton, IonSpinner, IonButtons, IonIcon, IonSegment,
  IonSegmentButton, IonLabel, IonNote, AlertController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { moon, sunny, download } from 'ionicons/icons';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-driven',
  templateUrl: './driven.page.html',
  styleUrls: ['./driven.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonInput, IonButton, IonSpinner, IonButtons, IonIcon, IonSegment,
    IonSegmentButton, IonLabel, IonNote
  ],
})
export class DrivenPage {
  // Modelo de datos vinculado mediante [(ngModel)]
  public userModel = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: ''
  };

  public isSubmitting = signal<boolean>(false);
  public isDarkMode = signal<boolean>(false);
  public datosEnviados = signal<{ nombre: string; email: string; fechaNacimiento: string; passwordHash: string } | null>(null);

  // Fecha máxima (hoy)
  public maxFechaHoy: string = new Date().toISOString().split('T')[0];

  constructor(private alertController: AlertController) {
    addIcons({ moon, sunny, download });
  }

  // Alternar Modo Oscuro
  public toggleDarkMode(): void {
    this.isDarkMode.set(!this.isDarkMode());
    document.body.classList.toggle('dark', this.isDarkMode());
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode());
  }

  // Cifrado Hash SHA-256 de la contraseña
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Comprobar si la fecha seleccionada es futura
  public esFechaFutura(): boolean {
    if (!this.userModel.fechaNacimiento) return false;
    const selected = new Date(this.userModel.fechaNacimiento);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selected > today;
  }

  public async onSubmit(formValid: boolean | null): Promise<void> {
    if (!formValid || this.esFechaFutura()) return;

    this.isSubmitting.set(true);

    try {
      // Cifrar contraseña antes de volcar a consola
      const hashedPassword = await this.hashPassword(this.userModel.password);

      const payload = {
        nombre: this.userModel.nombre,
        email: this.userModel.email,
        fechaNacimiento: this.userModel.fechaNacimiento,
        passwordHash: hashedPassword
      };

      console.log('Payload enviado desde Template-Driven Form (SHA-256):', payload);

      await new Promise(resolve => setTimeout(resolve, 1500));

      this.datosEnviados.set(payload);

      const alert = await this.alertController.create({
        header: 'Éxito (Template-Driven)',
        message: 'El formulario basado en plantilla se ha enviado correctamente.',
        buttons: ['Aceptar']
      });
      await alert.present();

      // Resetear modelo
      this.userModel = { nombre: '', email: '', password: '', fechaNacimiento: '' };
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Descargar PDF con jsPDF
  public descargarPDF(): void {
    const datos = this.datosEnviados();
    if (!datos) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Resumen de Registro (Template-Driven Form)', 14, 20);

    doc.setFontSize(12);
    doc.text(`Nombre Completo: ${datos.nombre}`, 14, 35);
    doc.text(`Correo Electrónico: ${datos.email}`, 14, 45);
    doc.text(`Fecha de Nacimiento: ${datos.fechaNacimiento}`, 14, 55);
    doc.text(`Contraseña Cifrada (SHA-256):`, 14, 65);
    
    doc.setFontSize(9);
    doc.text(`${datos.passwordHash}`, 14, 73);

    doc.save(`driven_registro_${datos.nombre.replace(/\s+/g, '_')}.pdf`);
  }
}