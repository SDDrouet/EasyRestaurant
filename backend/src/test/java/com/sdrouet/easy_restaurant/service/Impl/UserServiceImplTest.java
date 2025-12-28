package com.sdrouet.easy_restaurant.service.Impl;

import com.sdrouet.easy_restaurant.dto.auth.RegisterUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UpdateUserRequest;
import com.sdrouet.easy_restaurant.dto.user.UserResponse;
import com.sdrouet.easy_restaurant.entity.Role;
import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.exception.ApiException;
import com.sdrouet.easy_restaurant.repository.RoleRepository;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
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
                    ApiException.class,
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
                    ApiException.class,
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
            UserResponse userResponse = userService.updateUser(request);

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
            UserResponse userResponse = userService.updateUser(request);

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
                    ApiException.class,
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
                    ApiException.class,
                    () -> userService.updateUser(request)
            );
        }

        @Test
        void shouldChangeUserStatus() {
            Long userId = 1L;
            User user = User.builder()
                    .id(1L)
                    .isActive(true)
                    .build();

            when(userRepository.findById(userId)).thenReturn(Optional.ofNullable(user));
            assertNotNull(user);
            when(userRepository.save(user)).thenAnswer(invocation -> invocation.getArgument(0));

            User userResponse = userService.changeUserStatus(userId);

            assertEquals(false, userResponse.getIsActive());

            verify(userRepository, times(1)).findById((any(Long.class)));
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        void shouldGetUserById() {
            Long userId = 1L;
            User user = User.builder()
                    .id(1L)
                    .build();

            when(userRepository.findById(userId)).thenReturn(Optional.ofNullable(user));

            User userResponse = userService.getUserById(userId);

            assertNotNull(userResponse);
            assertEquals(userId, userResponse.getId());

            verify(userRepository, times(1)).findById(any(Long.class));
        }

        @Test
        void shouldThrowException_WhenUserByIdNotFound() {
            Long userId = 1L;

            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThrows(ApiException.class, () -> userService.getUserById(userId));

            verify(userRepository, times(1)).findById(any(Long.class));
        }

        @Test
        void shouldGetAllUsers() {
            // Given
            Pageable pageable = PageRequest.of(0, 10);

            User user = User.builder()
                    .id(1L)
                    .username("a1")
                    .email("b1")
                    .build();

            Page<User> page = new PageImpl<>(
                    List.of(user),
                    pageable,
                    1
            );

            when(userRepository.findAll(
                    ArgumentMatchers.<Specification<User>>any(),
                    eq(pageable)
            )).thenReturn(page);

            // When
            Page<User> result = userService.getUsers(pageable, "", "", "");

            // Then
            assertNotNull(result);
            assertEquals(1, result.getTotalElements());
            assertEquals("a1", result.getContent().get(0).getUsername());

            verify(userRepository)
                    .findAll(ArgumentMatchers.<Specification<User>>any(), eq(pageable));
        }

    }


}