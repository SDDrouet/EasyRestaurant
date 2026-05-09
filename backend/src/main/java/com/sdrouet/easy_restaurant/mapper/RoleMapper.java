package com.sdrouet.easy_restaurant.mapper;

import com.sdrouet.easy_restaurant.dto.role.RoleRequestDTO;
import com.sdrouet.easy_restaurant.dto.role.RoleResponseDTO;
import com.sdrouet.easy_restaurant.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoleMapper {

    private final PermissionMapper permissionMapper;

    public Role toEntity(RoleRequestDTO dto) {
        return Role.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    public RoleResponseDTO toDTO(Role entity) {
        return RoleResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .permissions(entity.getPermissions() != null ?
                        entity.getPermissions().stream()
                                .map(permissionMapper::toDTO)
                                .collect(Collectors.toSet())
                        : null)
                .build();
    }

    public void updateEntityFromDTO(RoleRequestDTO dto, Role entity) {
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
    }
}
