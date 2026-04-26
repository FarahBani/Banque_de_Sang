package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "centres_don")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CentreDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "horaires")
    private String horaires;

    @Column(name = "actif")
    private Boolean actif = true;

    @OneToMany(mappedBy = "centreDon", cascade = CascadeType.ALL)
    private List<Donneur> donneurs;

    @OneToMany(mappedBy = "centreDon", cascade = CascadeType.ALL)
    private List<AgentBanque> agentsBanque;
}