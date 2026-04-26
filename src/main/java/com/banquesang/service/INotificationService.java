package com.banquesang.service;

import com.banquesang.model.entity.Notification;
import java.util.List;

public interface INotificationService {

    // Méthodes métier spécifiques à Notification
    void envoyer(Long notificationId);
    void marquerCommeLue(Long notificationId);
    void archiver(Long notificationId);

    // Méthodes CRUD standards
    Notification creer(Notification notification);
    Notification modifier(Long id, Notification notification);
    void supprimer(Long id);
    Notification findById(Long id);
    List<Notification> findAll();
}
