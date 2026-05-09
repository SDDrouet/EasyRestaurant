package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.dto.permission.PermissionRequestDTO;
import com.sdrouet.easy_restaurant.dto.permission.PermissionResponseDTO;
import com.sdrouet.easy_restaurant.service.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> create(@Valid @RequestBody PermissionRequestDTO requestDTO) {
        PermissionResponseDTO response = permissionService.create(requestDTO);
        return ResponseEntity.ok(ApiResponse.ok("Permiso creado con éxito", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> findById(@PathVariable Long id) {
        PermissionResponseDTO response = permissionService.findById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<Page<PermissionResponseDTO>>> findAll(@PageableDefault(size = 20) Pageable pageable) {
        System.out.println("holas23");
        Page<PermissionResponseDTO> response = permissionService.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<PermissionResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody PermissionRequestDTO requestDTO) {
        PermissionResponseDTO response = permissionService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.ok("Permiso actualizado con éxito", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        permissionService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Permiso eliminado con éxito"));
    }
}
