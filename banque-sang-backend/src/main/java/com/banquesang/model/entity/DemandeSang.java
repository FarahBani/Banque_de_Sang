package com.banquesang.model.entity;

import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.model.enums.Priorite;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes_sang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeSang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin")
    private GroupeSanguin groupeSanguin;

    @Column(name = "quantite_demandee")
    private Integer quantiteDemandee;

    @Enumerated(EnumType.STRING)
    @Column(name = "priorite")
    private Priorite priorite;

    @Column(name = "date_demande")
    private LocalDateTime dateDemande;

    @Column(name = "date_requise")
    private LocalDate dateRequise;

    @Column(name = "statut")
    private String statut;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "medecin_hopital_id")
    private MedecinHopital medecinHopital;
}