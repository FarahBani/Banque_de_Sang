package com.banquesang.model.entity;

import com.banquesang.model.enums.StatutDon;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Don {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_don")
    private LocalDateTime dateDon;

    @Column(name = "quantite")
    private Integer quantite;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutDon statut;

    @Column(name = "lieu")
    private String lieu;

    @Column(name = "commentaire")
    private String commentaire;

    @ManyToOne
    @JoinColumn(name = "donneur_id")
    private Donneur donneur;

    @OneToOne(mappedBy = "don", cascade = CascadeType.ALL)
    private TestSanguin testSanguin;

    @OneToOne(mappedBy = "don", cascade = CascadeType.ALL)
    private Certificat certificat;

    @OneToOne(mappedBy = "don", cascade = CascadeType.ALL)
    private PocheSang pocheSang;
}