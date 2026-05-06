package com.banquesang.model.entity;

import com.banquesang.model.enums.StatutRDV;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rendez_vous")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_heure")
    private LocalDateTime dateHeure;

    @Column(name = "duree_estimee")
    private Integer dureeEstimee;

    @Column(name = "adresse")
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutRDV statut;

    @Column(name = "creneau_disponible")
    private String creneauDisponible;

    @Column(name = "notes")
    private String notes;

    @ManyToOne
    @JoinColumn(name = "donneur_id")
    private Donneur donneur;

    @ManyToOne
    @JoinColumn(name = "centre_don_id")
    private CentreDon centreDon;
}