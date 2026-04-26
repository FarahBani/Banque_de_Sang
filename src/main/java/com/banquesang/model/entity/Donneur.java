package com.banquesang.model.entity;

import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.model.enums.TypeBadge;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "donneurs")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("DONNEUR")
public class Donneur extends Utilisateur {

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin")
    private GroupeSanguin groupeSanguin;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "poids")
    private Float poids;

    @Column(name = "adresse")
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(name = "badge")
    private TypeBadge badge;

    @Column(name = "grade")
    private String grade;

    @Column(name = "eligible")
    private Boolean eligible = false;

    @ManyToOne
    @JoinColumn(name = "centre_don_id")
    private CentreDon centreDon;

    @OneToMany(mappedBy = "donneur", cascade = CascadeType.ALL)
    private List<Don> dons;

    @OneToMany(mappedBy = "donneur", cascade = CascadeType.ALL)
    private List<RendezVous> rendezVous;
}