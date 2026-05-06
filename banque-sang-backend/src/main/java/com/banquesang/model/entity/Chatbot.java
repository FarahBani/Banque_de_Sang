package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatbots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chatbot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "modele")
    private String modele;

    @Column(name = "version")
    private String version;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "contexte", columnDefinition = "TEXT")
    private String contexte;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
}