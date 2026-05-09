package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.role.AssignPermissionsDTO;
import com.sdrouet.easy_restaurant.dto.role.AssignRoleDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleRequestDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleService {
    RoleResponseDTO create(RoleRequestDTO requestDTO);
    RoleResponseDTO findById(Long id);
    Page<RoleResponseDTO> findAll(Pageable pageable);
    RoleResponseDTO update(Long id, RoleRequestDTO requestDTO);
    void delete(Long id);
    RoleResponseDTO assignPermissions(AssignPermissionsDTO assignDTO);
    void assignRolesToUser(AssignRoleDTO assignDTO);
}
