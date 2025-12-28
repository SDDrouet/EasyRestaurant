package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.config.annotation.AllowedSortFields;
import com.sdrouet.easy_restaurant.config.annotation.AuditableAction;
import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.Role;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.enums.ErrorCode;
import com.sdrouet.easy_restaurant.mapper.UserMapper;
import com.sdrouet.easy_restaurant.repository.RoleRepository;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import com.sdrouet.easy_restaurant.repository.specification.UserSpecs;
import com.sdrouet.easy_restaurant.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    @AuditableAction(action = "CREATE", resource = "USER")
    public User register(RegisterUserRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw ErrorCode.BAD_REQUEST.exception("Username ya registrado");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw ErrorCode.BAD_REQUEST.exception("Email ya registrado");
        }

        Role userRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() ->
                        ErrorCode.RESOURCE_NOT_FOUND.exception("ROLE_USER no existe"));

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .roles(Set.of(userRole))
                .build();

        return userRepository.save(user);
    }

    @Override
    @AuditableAction(action = "UPDATE", resource = "USER")
    @Transactional
    public UserResponse updateUser(UpdateUserRequest updateUserRequest) {

        Optional<User> userOpt = userRepository.findById(updateUserRequest.id());

        if (userOpt.isEmpty()) {
            throw ErrorCode.RESOURCE_NOT_FOUND.exception("Usuario no encontrado");
        }

        User user = userOpt.get();

        if (!user.getEmail().equals(updateUserRequest.email()) && userRepository.existsByEmail(updateUserRequest.email())) {
            throw ErrorCode.BAD_REQUEST.exception("Email ya registrado");
        }

        user.setEmail(updateUserRequest.email());
        user.setFirstName(updateUserRequest.firstName());
        user.setLastName(updateUserRequest.lastName());

        User userUpdated = userRepository.save(user);

        return UserMapper.toUpdateUserResponse(userUpdated);
    }

    @Override
    public User changeUserStatus(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) throw ErrorCode.RESOURCE_NOT_FOUND.exception("Usuario no encontrado");

        User user = userOptional.get();

        user.setIsActive(!user.getIsActive());

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> ErrorCode.RESOURCE_NOT_FOUND.exception("Usuario no encontrado")
        );
    }

    @Override
    @AllowedSortFields({"id", "username", "email", "firstName", "lastName"})
    public Page<User> getUsers(Pageable pageable, String username, String email, String name) {
        Specification<User> spec = Specification.unrestricted();
        spec.and(UserSpecs.usernameLike(username))
                .and(UserSpecs.emailLike(email))
                .and(UserSpecs.fullNameLike(name));

        return userRepository.findAll(spec, pageable);
    }


}
