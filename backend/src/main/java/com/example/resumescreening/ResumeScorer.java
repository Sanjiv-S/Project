package com.example.resumescreening;

import java.util.List;

public class ResumeScorer {
    public static double calculateMatchScore(String resumeText, List<String> keywords) {
        int matched = 0;
        resumeText = resumeText.toLowerCase();

        for (String keyword : keywords) {
            if (resumeText.contains(keyword.toLowerCase())) {
                matched++;
            }
        }

        return (double) matched / keywords.size() * 100;
    }
}
