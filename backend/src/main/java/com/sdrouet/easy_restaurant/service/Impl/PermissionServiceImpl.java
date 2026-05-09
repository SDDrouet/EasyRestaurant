package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.annotation.AuditableAction;
import com.sdrouet.easy_restaurant.dto.permission.PermissionRequestDTO;
import com.sdrouet.easy_restaurant.dto.permission.PermissionResponseDTO;
import com.sdrouet.easy_restaurant.entity.Permission;
import com.sdrouet.easy_restaurant.exception.ResourceAlreadyExistsException;
import com.sdrouet.easy_restaurant.exception.ResourceNotFoundException;
import com.sdrouet.easy_restaurant.mapper.PermissionMapper;
import com.sdrouet.easy_restaurant.repository.PermissionRepository;
import com.sdrouet.easy_restaurant.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Override
    @Transactional
    @AuditableAction(action = "CREATE", resource = "PERMISSION")
    public PermissionResponseDTO create(PermissionRequestDTO requestDTO) {
        if (permissionRepository.existsByName(requestDTO.getName())) {
            throw new ResourceAlreadyExistsException("Permission with name " + requestDTO.getName() + " already exists");
        }

        Permission permission = permissionMapper.toEntity(requestDTO);
        Permission savedPermission = permissionRepository.save(permission);
        return permissionMapper.toDTO(savedPermission);
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionResponseDTO findById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
        return permissionMapper.toDTO(permission);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PermissionResponseDTO> findAll(Pageable pageable) {
        return permissionRepository.findAll(pageable)
                .map(permissionMapper::toDTO);
    }

    @Override
    @Transactional
    @AuditableAction(action = "UPDATE", resource = "PERMISSION")
    public PermissionResponseDTO update(Long id, PermissionRequestDTO requestDTO) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));

        if (!permission.getName().equals(requestDTO.getName()) &&
                permissionRepository.existsByName(requestDTO.getName())) {
            throw new ResourceAlreadyExistsException("Permission with name " + requestDTO.getName() + " already exists");
        }

        permissionMapper.updateEntityFromDTO(requestDTO, permission);
        Permission updatedPermission = permissionRepository.save(permission);
        return permissionMapper.toDTO(updatedPermission);
    }

    @Override
    @Transactional
    @AuditableAction(action = "DELETE", resource = "PERMISSION")
    public void delete(Long id) {
        if (!permissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Permission not found with id: " + id);
        }
        permissionRepository.deleteById(id);
    }
}
