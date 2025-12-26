package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserResponse;
import com.sdrouet.easy_restaurant.entity.Role;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.mapper.UserMapper;
import com.sdrouet.easy_restaurant.repository.RoleRepository;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import com.sdrouet.easy_restaurant.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

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
    public User register(RegisterUserRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username ya registrado");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email ya registrado");
        }

        Role userRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() ->
                        new IllegalStateException("ROLE_USER no existe"));

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
    public UpdateUserResponse updateUser(UpdateUserRequest updateUserRequest) {

        Optional<User> userOpt = userRepository.findById(updateUserRequest.id());

        if (userOpt.isEmpty()) {
            throw new ResourceAccessException("Usuario no encontrado");
        }

        User user = userOpt.get();

        if (!user.getEmail().equals(updateUserRequest.email()) && userRepository.existsByEmail(updateUserRequest.email())) {
            throw new IllegalArgumentException("Email ya registrado");
        }

        user.setEmail(updateUserRequest.email());
        user.setFirstName(updateUserRequest.firstName());
        user.setLastName(updateUserRequest.lastName());

        User userUpdated = userRepository.save(user);

        return UserMapper.toUpdateUserResponse(userUpdated);
    }

}
