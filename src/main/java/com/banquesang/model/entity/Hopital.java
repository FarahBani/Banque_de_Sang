package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "hopitaux")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hopital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "email")
    private String email;

    @Column(name = "convention_active")
    private Boolean conventionActive = false;

    @OneToMany(mappedBy = "hopital", cascade = CascadeType.ALL)
    private List<MedecinHopital> medecins;
}