package com.sdrouet.easy_restaurant.controller;

import com.sdrouet.easy_restaurant.dto.common.ApiResponse;
import com.sdrouet.easy_restaurant.dto.role.AssignPermissionsDTO;
import com.sdrouet.easy_restaurant.dto.role.AssignRoleDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleRequestDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleResponseDTO;
import com.sdrouet.easy_restaurant.service.RoleService;
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
@RequestMapping("/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> create(@Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO response = roleService.create(requestDTO);
        return ResponseEntity.ok(ApiResponse.ok("Rol creado con éxito", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> findById(@PathVariable Long id) {
        RoleResponseDTO response = roleService.findById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<Page<RoleResponseDTO>>> findAll(@PageableDefault(size = 20) Pageable pageable) {
        Page<RoleResponseDTO> response = roleService.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequestDTO requestDTO) {
        RoleResponseDTO response = roleService.update(id, requestDTO);
        return ResponseEntity.ok(ApiResponse.ok("Rol actualizado con éxito", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Rol eliminado con éxito"));
    }

    @PostMapping("/assign-permissions")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<RoleResponseDTO>> assignPermissions(@Valid @RequestBody AssignPermissionsDTO assignDTO) {
        RoleResponseDTO response = roleService.assignPermissions(assignDTO);
        return ResponseEntity.ok(ApiResponse.ok("Permisos asignados con éxito", response));
    }

    @PostMapping("/assign-to-user")
    @PreAuthorize("hasAuthority('MANAGE_PERMISSIONS')")
    public ResponseEntity<ApiResponse<Void>> assignRolesToUser(@Valid @RequestBody AssignRoleDTO assignDTO) {
        roleService.assignRolesToUser(assignDTO);
        return ResponseEntity.ok(ApiResponse.ok("Roles asignados al usuario con éxito"));
    }
}
