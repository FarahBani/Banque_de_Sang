package com.banquesang.model.entity;

import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.model.enums.StatutRDV;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tests_sanguins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestSanguin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_test")
    private LocalDate dateTest;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin")
    private GroupeSanguin groupeSanguin;

    @Column(name = "maladie")
    private Boolean maladie;

    @Column(name = "resultat_vih")
    private Boolean resultatVIH;

    @Column(name = "resultat_hepatite_b")
    private Boolean resultatHepatiteB;

    @Column(name = "resultat_hepatite_c")
    private Boolean resultatHepatiteC;

    @Column(name = "commentaire")
    private String commentaire;

    @OneToOne
    @JoinColumn(name = "don_id")
    private Don don;
}