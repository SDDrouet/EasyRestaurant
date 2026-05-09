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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    TableModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
] as const;