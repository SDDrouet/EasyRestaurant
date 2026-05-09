package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.annotation.AuditableAction;
import com.sdrouet.easy_restaurant.dto.role.AssignPermissionsDTO;
import com.sdrouet.easy_restaurant.dto.role.AssignRoleDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleRequestDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleResponseDTO;
import com.sdrouet.easy_restaurant.entity.Permission;
import com.sdrouet.easy_restaurant.entity.Role;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.exception.ResourceAlreadyExistsException;
import com.sdrouet.easy_restaurant.exception.ResourceInUseException;
import com.sdrouet.easy_restaurant.exception.ResourceNotFoundException;
import com.sdrouet.easy_restaurant.mapper.RoleMapper;
import com.sdrouet.easy_restaurant.repository.PermissionRepository;
import com.sdrouet.easy_restaurant.repository.RoleRepository;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import com.sdrouet.easy_restaurant.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final RoleMapper roleMapper;

    @Override
    @Transactional
    @AuditableAction(action = "CREATE", resource = "ROLE")
    public RoleResponseDTO create(RoleRequestDTO requestDTO) {
        if (roleRepository.existsByName(requestDTO.getName())) {
            throw new ResourceAlreadyExistsException("Role with name " + requestDTO.getName() + " already exists");
        }

        Role role = roleMapper.toEntity(requestDTO);
        role.setPermissions(new HashSet<>());
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDTO(savedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDTO findById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return roleMapper.toDTO(role);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleResponseDTO> findAll(Pageable pageable) {
        return roleRepository.findAll(pageable)
                .map(roleMapper::toDTO);
    }

    @Override
    @Transactional
    @AuditableAction(action = "UPDATE", resource = "ROLE")
    public RoleResponseDTO update(Long id, RoleRequestDTO requestDTO) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));

        if (!role.getName().equals(requestDTO.getName()) &&
                roleRepository.existsByName(requestDTO.getName())) {
            throw new ResourceAlreadyExistsException("Role with name " + requestDTO.getName() + " already exists");
        }

        roleMapper.updateEntityFromDTO(requestDTO, role);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }

    @Override
    @Transactional
    @AuditableAction(action = "DELETE", resource = "ROLE")
    public void delete(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found with id: " + id);
        }
        if (userRepository.existsUserAssignedToRole(id)) {
            throw new ResourceInUseException("No se puede eliminar el rol porque está asignado a uno o más usuarios");
        }
        roleRepository.deleteById(id);
    }

    @Override
    @Transactional
    @AuditableAction(action = "UPDATE", resource = "ROLE")
    public RoleResponseDTO assignPermissions(AssignPermissionsDTO assignDTO) {
        Role role = roleRepository.findById(assignDTO.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + assignDTO.getRoleId()));

        Set<Permission> permissions = assignDTO.getPermissionIds().stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                        .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId)))
                .collect(Collectors.toSet());

        role.setPermissions(permissions);
        Role updatedRole = roleRepository.save(role);
        return roleMapper.toDTO(updatedRole);
    }

    @Override
    @Transactional
    @AuditableAction(action = "UPDATE", resource = "USER_ROLE")
    public void assignRolesToUser(AssignRoleDTO assignDTO) {
        User user = userRepository.findById(assignDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assignDTO.getUserId()));

        Set<Role> roles = assignDTO.getRoleIds().stream()
                .map(roleId -> roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + roleId)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);
    }
}
