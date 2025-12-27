package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserResponse;
import com.sdrouet.easy_restaurant.entity.Role;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.exception.ResourceNotFoundException;
import com.sdrouet.easy_restaurant.repository.RoleRepository;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Nested
    class RegisterUser {
        @Test
        void shouldRegisterUserSuccessfully() {
            RegisterUserRequest request = new RegisterUserRequest(
                    "username",
                    "email@example.com",
                    "password",
                    "firstname",
                    "lastname"
            );

            Role roleUser = Role.builder()
                    .id(1L)
                    .name("ADMIN")
                    .build();

            when(userRepository.existsByUsername(request.username())).thenReturn(false);
            when(userRepository.existsByEmail(request.email())).thenReturn(false);
            when(roleRepository.findByName("ADMIN")).thenReturn(Optional.ofNullable(roleUser));
            when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));


            // Act
            User user = userService.register(request);

            // Assert
            assertNotNull(user);
            assertEquals("username", user.getUsername());
            assertEquals("email@example.com", user.getEmail());
            assertEquals("encoded-password", user.getPassword());
            assertEquals("firstname", user.getFirstName());
            assertEquals("lastname", user.getLastName());
            assertTrue(user.getIsActive());
            assertEquals("ADMIN", user.getRoles().isEmpty() ? null : user.getRoles().iterator().next().getName());

            verify(userRepository, times(1)).save(any(User.class));

        }

        @Test
        void shouldTrowExceptionWhenUsernameAlreadyExists() {
            RegisterUserRequest request = new RegisterUserRequest(
                    "username",
                    "email@example.com",
                    "password",
                    "firstname",
                    "lastname"
            );

            when(userRepository.existsByUsername(request.username())).thenReturn(true);

            assertThrows(
                    IllegalArgumentException.class,
                    () -> userService.register(request)
            );

            verify(userRepository, never()).save(any());
        }

        @Test
        void shouldTrowExceptionWhenEmailAlreadyExists() {
            RegisterUserRequest request = new RegisterUserRequest(
                    "username",
                    "email@example.com",
                    "password",
                    "firstname",
                    "lastname"
            );

            when(userRepository.existsByUsername(request.username())).thenReturn(true);

            assertThrows(
                    IllegalArgumentException.class,
                    () -> userService.register(request)
            );

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    class UpdateUser {

        @Test
        void shouldUpdateUserSuccessfully() {
            UpdateUserRequest request = new UpdateUserRequest(
                    1L,
                    "new_email@example.com",
                    "newFirstName",
                    "newLastName"
            );

            User userDB = User.builder()
                    .id(1L)
                    .username("username")
                    .email("email@example.com")
                    .firstName("firstName")
                    .lastName("lastname")
                    .isActive(true)
                    .password("password-encoded")
                    .build();

            when(userRepository.findById(request.id())).thenReturn(Optional.ofNullable(userDB));
            when(userRepository.existsByEmail(request.email())).thenReturn(false);
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            UpdateUserResponse userResponse = userService.updateUser(request);

            // Asserts
            assertNotNull(userResponse);
            assertEquals("new_email@example.com", userResponse.email());
            assertEquals("newFirstName", userResponse.firstName());
            assertEquals("newLastName", userResponse.lastName());

            verify(userRepository, times(1)).existsByEmail(any());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        void shouldUpdateUserSuccess_WhenEmailNotHasChanges() {
            UpdateUserRequest request = new UpdateUserRequest(
                    1L,
                    "email@example.com",
                    "newFirstName",
                    "newLastName"
            );

            User userDB = User.builder()
                    .id(1L)
                    .username("username")
                    .email("email@example.com")
                    .firstName("firstName")
                    .lastName("lastname")
                    .isActive(true)
                    .password("password-encoded")
                    .build();

            when(userRepository.findById(request.id())).thenReturn(Optional.ofNullable(userDB));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            UpdateUserResponse userResponse = userService.updateUser(request);

            // Asserts
            assertNotNull(userResponse);
            assertEquals("email@example.com", userResponse.email());
            assertEquals("newFirstName", userResponse.firstName());
            assertEquals("newLastName", userResponse.lastName());

            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        void shouldThrowException_WhenEmailAlreadyExists() {
            UpdateUserRequest request = new UpdateUserRequest(
                    1L,
                    "new_email@example.com",
                    "newFirstName",
                    "newLastName"
            );

            User userDB = User.builder()
                    .id(1L)
                    .username("username")
                    .email("email@example.com")
                    .firstName("firstName")
                    .lastName("lastname")
                    .isActive(true)
                    .password("password-encoded")
                    .build();

            when(userRepository.findById(request.id())).thenReturn(Optional.ofNullable(userDB));
            when(userRepository.existsByEmail(request.email())).thenReturn(true);

            // Assert
            assertThrows(
                    IllegalArgumentException.class,
                    () -> userService.updateUser(request)
            );

        }

        @Test
        void shouldThrowException_WhenUserIsNotFound() {
            UpdateUserRequest request = new UpdateUserRequest(
                    1L,
                    "new_email@example.com",
                    "newFirstName",
                    "newLastName"
            );

            when(userRepository.findById(request.id())).thenReturn(Optional.empty());

            assertThrows(
                    ResourceNotFoundException.class,
                    () -> userService.updateUser(request)
            );
        }

    }


}