package com.sdrouet.easy_restaurant.dto.role;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignRoleDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Role IDs are required")
    private Set<Long> roleIds;
}
