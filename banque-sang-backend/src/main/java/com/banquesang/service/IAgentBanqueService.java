package com.banquesang.service;

import com.banquesang.model.entity.AgentBanque;
import java.util.List;

public interface IAgentBanqueService {
    AgentBanque creer(AgentBanque agent);
    AgentBanque modifier(Long id, AgentBanque agent);
    void supprimer(Long id);
    AgentBanque findById(Long id);
    List<AgentBanque> findAll();
    List<AgentBanque> findByCentre(Long centreDonId);
}