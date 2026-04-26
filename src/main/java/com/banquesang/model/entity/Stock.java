package com.banquesang.model.entity;

import com.banquesang.model.enums.GroupeSanguin;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin")
    private GroupeSanguin groupeSanguin;

    @Column(name = "quantite_disponible")
    private Integer quantiteDisponible;

    @Column(name = "seuil_minimum")
    private Integer seuilMinimum;

    @Column(name = "est_critique")
    private Integer estCritique;

    @Column(name = "localisation")
    private String localisation;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<PocheSang> poches;
}