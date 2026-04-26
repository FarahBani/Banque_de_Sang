package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "agents_banque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("AGENT_BANQUE")
public class AgentBanque extends Utilisateur {

    @Column(name = "matricule")
    private String matricule;

    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;

    @Column(name = "grade")
    private String grade;

    @ManyToOne
    @JoinColumn(name = "centre_don_id")
    private CentreDon centreDon;
}