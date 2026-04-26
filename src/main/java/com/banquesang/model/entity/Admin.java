package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("ADMIN")
public class Admin extends Utilisateur {

    @Column(name = "rapport_access")
    private Boolean rapportAccess = true;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "statut_account")
    private String statutAccount; // ACTIF, SUSPENDU, etc.

}
