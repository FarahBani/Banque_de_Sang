package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrateurs")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("ADMINISTRATEUR")
public class Administrateur extends Utilisateur {

    @Column(name = "niveau_acces")
    private Integer niveauAcces;
}