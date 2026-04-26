package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "medecins_hopital")
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("MEDECIN")
public class MedecinHopital extends Utilisateur {

    @Column(name = "specialite")
    private String specialite;

    @Column(name = "numero_ordre")
    private String numeroOrdre;

    @Column(name = "service_hospitalier")
    private String serviceHospitalier;

    @Column(name = "certification_transfusion")
    private Boolean certificationTransfusion;

    @ManyToOne
    @JoinColumn(name = "hopital_id")
    private Hopital hopital;

    @OneToMany(mappedBy = "medecinHopital", cascade = CascadeType.ALL)
    private List<DemandeSang> demandesSang;
}