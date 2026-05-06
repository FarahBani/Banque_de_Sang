package com.banquesang.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class OllamaService {

    // URL par défaut d'Ollama
    private final String URL = "http://localhost:11434/api/generate";

    public String chat(String message, String contexte) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. DÉFINITION DES RÈGLES (SYSTEM PROMPT)
            // On force l'IA à être brève, sans fautes et sans introductions inutiles

            String systemInstruction =
                    "Tu es l'assistant SaveLife, expert pour le don de sang EN TUNISIE. " +
                            "CONSIGNES LOCALES : " +
                            "1. Utilise les statistiques de la population tunisienne (ex: le groupe O+ est le plus fréquent en Tunisie). " +
                            "2. Ne mentionne JAMAIS la France ou la population française. " +
                            "3. Réponds en français parfait, sans fautes, en 2 phrases maximum. " +
                            "4. Sois direct et médical. " +
                            "5. Les centres de collecte sont les Centres de Transfusion Sanguine (CTS) tunisiens.";

            // Construction du prompt final envoyé à Llama3
            String prompt = systemInstruction + "\n\nQuestion du donneur : " + message + "\nRéponse courte :";

            // 2. PRÉPARATION DU CORPS DE LA REQUÊTE
            Map<String, Object> body = Map.of(
                    "model", "llama3",
                    "prompt", prompt,
                    "stream", false,
                    "options", Map.of(
                            "temperature", 0.3,   // Réduit les erreurs et les divagations
                            "num_predict", 120    // Limite physique du nombre de mots générés
                    )
            );

            // 3. ENVOI DE LA REQUÊTE HTTP
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(URL, request, Map.class);

            // 4. RÉCUPÉRATION ET NETTOYAGE DE LA RÉPONSE
            if (response.getBody() != null && response.getBody().get("response") != null) {
                String result = response.getBody().get("response").toString().trim();

                // Sécurité : si Ollama renvoie quand même un texte vide
                return result.isEmpty() ? "Désolé, je ne peux pas répondre à cette question." : result;
            }

            return "Erreur : Le serveur de chat ne répond pas.";

        } catch (Exception e) {
            // Log de l'erreur dans la console pour le debug
            System.err.println("Erreur OllamaService: " + e.getMessage());
            return "Désolé, le service d'assistance est indisponible pour le moment.";
        }
    }
}