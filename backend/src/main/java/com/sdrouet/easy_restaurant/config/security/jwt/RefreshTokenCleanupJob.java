package com.sdrouet.easy_restaurant.config.security.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RefreshTokenCleanupJob {

    private final RefreshTokenCleanupService cleanupService;

    @Scheduled(cron = "0 0/5 * * * *")
    public void run() {
        cleanupService.cleanup();
    }
}
