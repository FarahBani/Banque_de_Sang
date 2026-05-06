package com.banquesang.service.impl;

import com.banquesang.exception.ResourceNotFoundException;
import com.banquesang.model.entity.AgentBanque;
import com.banquesang.repository.AgentBanqueRepository;
import com.banquesang.service.IAgentBanqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AgentBanqueServiceImpl implements IAgentBanqueService {

    private final AgentBanqueRepository agentRepository;

    @Override
    public AgentBanque creer(AgentBanque agent) {
        return agentRepository.save(agent);
    }

    @Override
    public AgentBanque modifier(Long id, AgentBanque agent) {
        AgentBanque existant = findById(id);
        existant.setNom(agent.getNom());
        existant.setPrenom(agent.getPrenom());
        existant.setEmail(agent.getEmail());
        existant.setTelephone(agent.getTelephone());
        existant.setMatricule(agent.getMatricule());
        existant.setDateEmbauche(agent.getDateEmbauche());
        existant.setGrade(agent.getGrade());
        existant.setCentreDon(agent.getCentreDon());
        return agentRepository.save(existant);
    }

    @Override
    public void supprimer(Long id) {
        findById(id);
        agentRepository.deleteById(id);
    }

    @Override
    public AgentBanque findById(Long id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "AgentBanque introuvable avec id : " + id));
    }

    @Override
    public List<AgentBanque> findAll() {
        return agentRepository.findAll();
    }

    @Override
    public List<AgentBanque> findByCentre(Long centreDonId) {
        return agentRepository.findByCentreDonId(centreDonId);
    }
}

