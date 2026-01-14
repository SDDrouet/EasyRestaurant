import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { AutoFocusModule } from 'primeng/autofocus';

// Agrupas todo en un array constante
export const SHARED_UI_MODULES = [
    CardModule,
    InputTextModule,
    IftaLabelModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    AutoFocusModule,
] as const;