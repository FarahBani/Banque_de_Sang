package com.banquesang.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificats")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Certificat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_certificat")
    private LocalDate dateCertificat;

    @Column(name = "fichier_pdf")
    private String fichierPDF;

    @Column(name = "numero_serie")
    private String numeroSerie;

    @OneToOne
    @JoinColumn(name = "don_id")
    private Don don;
}