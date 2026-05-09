package com.sdrouet.easy_restaurant.mapper;

import com.sdrouet.easy_restaurant.dto.permission.PermissionRequestDTO;
import com.sdrouet.easy_restaurant.dto.permission.PermissionResponseDTO;
import com.sdrouet.easy_restaurant.entity.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {

    public Permission toEntity(PermissionRequestDTO dto) {
        return Permission.builder()
                .name(dto.getName())
                .resource(dto.getResource())
                .action(dto.getAction())
                .build();
    }

    public PermissionResponseDTO toDTO(Permission entity) {
        return PermissionResponseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .resource(entity.getResource())
                .action(entity.getAction())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDTO(PermissionRequestDTO dto, Permission entity) {
        entity.setName(dto.getName());
        entity.setResource(dto.getResource());
        entity.setAction(dto.getAction());
    }
}
