package com.banquesang.model.entity;

import com.banquesang.model.enums.GroupeSanguin;
import com.banquesang.model.enums.StatutPoche;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "poches_sang")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PocheSang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "groupe_sanguin")
    private GroupeSanguin groupeSanguin;

    @Column(name = "volume")
    private Integer volume;

    @Column(name = "date_prelevement")
    private LocalDate datePrelevement;

    @Column(name = "date_expiration")
    private LocalDate dateExpiration;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutPoche statut;

    @OneToOne
    @JoinColumn(name = "don_id")
    private Don don;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stock;
}