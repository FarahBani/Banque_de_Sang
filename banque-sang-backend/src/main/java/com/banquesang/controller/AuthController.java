package com.banquesang.controller;

import com.banquesang.model.entity.Utilisateur;
import com.banquesang.repository.UtilisateursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UtilisateursRepository utilisateurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String motDePasse = payload.get("password");

        Optional<Utilisateur> utilisateur = utilisateurRepository.findByEmail(email);

        if (utilisateur.isEmpty() || !utilisateur.get().getMotDePasse().equals(motDePasse)) {
            return ResponseEntity.status(401).body(Map.of("message", "Email ou mot de passe incorrect"));
        }

        Utilisateur u = utilisateur.get();
        String role = u.getClass().getSimpleName().toUpperCase();

        return ResponseEntity.ok(Map.of(
                "token", "savelife-" + role + "-" + email,
                "user", Map.of(
                        "id", u.getId().toString(),
                        "email", u.getEmail(),
                        "fullName", u.getNom() + " " + u.getPrenom(),
                        "role", role
                )
        ));
    }
}