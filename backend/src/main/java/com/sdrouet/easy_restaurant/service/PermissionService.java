package com.sdrouet.easy_restaurant.service;

import com.sdrouet.easy_restaurant.dto.permission.PermissionRequestDTO;
import com.sdrouet.easy_restaurant.dto.permission.PermissionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PermissionService {
    PermissionResponseDTO create(PermissionRequestDTO requestDTO);

    PermissionResponseDTO findById(Long id);

    Page<PermissionResponseDTO> findAll(Pageable pageable);

    PermissionResponseDTO update(Long id, PermissionRequestDTO requestDTO);

    void delete(Long id);
}
