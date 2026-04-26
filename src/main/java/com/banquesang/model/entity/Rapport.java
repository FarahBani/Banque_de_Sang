package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rapports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre")
    private String titre;

    @Column(name = "type")
    private String type;

    @Column(name = "date_generation")
    private LocalDateTime dateGeneration;

    @Column(name = "donnees", columnDefinition = "TEXT")
    private String donnees;

    @Column(name = "periode")
    private String periode;

    @ManyToOne
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;
}