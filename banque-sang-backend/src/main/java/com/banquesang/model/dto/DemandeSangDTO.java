package com.banquesang.model.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DemandeSangDTO {
    private Long id;
    private String groupeSanguin;
    private Integer quantiteDemandee;
    private String priorite;
    private LocalDateTime dateDemande;
    private LocalDate dateRequise;
    private String statut;
    private String description;
    private String nomHopital;  // ← manquait
}