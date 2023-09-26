package com.example.store.common;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@Profile("default")
@ControllerAdvice
public class LiveReloadConfig {

    @ModelAttribute("liveReload")
    boolean liveReload() {
        return true;
    }

}
