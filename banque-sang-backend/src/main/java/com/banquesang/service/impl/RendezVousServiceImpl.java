package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.RendezVous;
import com.banquesang.model.enums.StatutRDV;
import com.banquesang.repository.RendezVousRepository;
import com.banquesang.service.IRendezVousService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RendezVousServiceImpl implements IRendezVousService {

    private final RendezVousRepository rendezVousRepository;

    @Override
    public RendezVous creer(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }

    @Override
    public RendezVous modifier(Long id, RendezVous rendezVous) {
        RendezVous existant = findById(id);
        existant.setDateHeure(rendezVous.getDateHeure());
        existant.setAdresse(rendezVous.getAdresse());
        existant.setNotes(rendezVous.getNotes());
        existant.setStatut(rendezVous.getStatut());
        return rendezVousRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        rendezVousRepository.deleteById(id);
    }

    @Override
    public RendezVous findById(Long id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "RendezVous introuvable avec id : " + id));
    }

    @Override
    public List<RendezVous> findAll() {
        return rendezVousRepository.findAll();
    }

    @Override
    public void confirmer(Long id) {
        RendezVous rdv = findById(id);
        rdv.setStatut(StatutRDV.CONFIRME);
        rendezVousRepository.save(rdv);
    }

    @Override
    public void annuler(Long id) {
        RendezVous rdv = findById(id);
        rdv.setStatut(StatutRDV.ANNULE);
        rendezVousRepository.save(rdv);
    }

    @Override
    public void reprogrammer(Long id, LocalDateTime nouvelleDate) {
        RendezVous rdv = findById(id);
        rdv.setDateHeure(nouvelleDate);
        rendezVousRepository.save(rdv);
    }

    @Override
    public void envoyerRappel(Long id) {
        throw new UnsupportedOperationException("À implémenter");
    }
}
