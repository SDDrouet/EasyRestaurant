package com.sdrouet.easy_restaurant.config.security.listener;

import com.sdrouet.easy_restaurant.entity.User;
import com.sdrouet.easy_restaurant.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AuthenticationSuccessListener {
    private final UserRepository userRepository;

    @EventListener
    @Transactional
    public void onAuthenticationSuccess(AuthenticationSuccessEvent event) {
        Long userId = ((User) event.getAuthentication().getPrincipal()).getId();
        userRepository.updateLastLoginById(userId);
    }
}
