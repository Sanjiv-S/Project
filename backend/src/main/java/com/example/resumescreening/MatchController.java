package com.example.resumescreening;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.IOException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MatchController {

    private static final Map<String, List<String>> JOB_KEYWORDS = Map.of(
        "java_developer", List.of("java", "spring", "api", "hibernate"),
        "data_scientist", List.of("python", "pandas", "machine", "tensorflow")
    );

    @PostMapping("/match")
    public int calculateMatch(@RequestBody ResumeData data) {
        return calculateScore(data.resume, getKeywords(data.jd));
    }

   @PostMapping("/upload-pdf")
    public Map<String, Object> uploadResume(@RequestParam("file") MultipartFile file,
                                        @RequestParam("jd") String jd) throws IOException {
    PDDocument doc = PDDocument.load(file.getInputStream());
    String resumeText = new PDFTextStripper().getText(doc);
    doc.close();
    resumeText = resumeText.toLowerCase();

    Map<String, Object> result = new HashMap<>();

    // Match keywords
    List<String> keywords = JOB_KEYWORDS.getOrDefault(jd, new ArrayList<>());
    List<String> matched = new ArrayList<>();

    for (String keyword : keywords) {
        if (resumeText.contains(keyword.toLowerCase())) {
            matched.add(keyword);
        }
    }

    int score = (int) ((matched.size() / (double) keywords.size()) * 100);
    result.put("score", score);
    result.put("matchedKeywords", matched);

    // Extract sections
    Map<String, String> extractedInfo = new HashMap<>();
    List<String> missingSections = new ArrayList<>();

    // Name (simple assumption - first capitalized line)
    String[] lines = resumeText.split("\n");
    for (String line : lines) {
        if (line.matches("^[a-zA-Z ]{2,}$") && Character.isUpperCase(line.trim().charAt(0))) {
            extractedInfo.put("name", line.trim());
            break;
        }
    }

    // Email
    String emailRegex = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,6}";
    Matcher emailMatcher = Pattern.compile(emailRegex).matcher(resumeText);
    if (emailMatcher.find()) {
        extractedInfo.put("email", emailMatcher.group());
    } else {
        missingSections.add("Email");
    }

    // Education
    if (resumeText.contains("education") || resumeText.contains("qualification")) {
        extractedInfo.put("education", "Present");
    } else {
        missingSections.add("Education");
    }

    // Skills
    if (resumeText.contains("skills")) {
        extractedInfo.put("skills", "Present");
    } else {
        missingSections.add("Skills");
    }

    // Experience
    if (resumeText.contains("experience")) {
        extractedInfo.put("experience", "Present");
    } else {
        missingSections.add("Experience");
    }
    result.put("Name",extractName(resumeText));
    result.put("extractedInfo", extractedInfo);
    result.put("missingSections", missingSections);
    result.put("suggestions", missingSections.isEmpty() ? "All essential sections are present." :
            "Consider adding: " + String.join(", ", missingSections));
    result.put("sectionsContent", extractSectionsContent(resumeText));


    return result;
}
    private Map<String, String> extractSectionsContent(String resumeText) {
    Map<String, String> sectionsContent = new HashMap<>();
    String[] lines = resumeText.split("\\r?\\n");

    String currentSection = "";
    StringBuilder currentContent = new StringBuilder();
    Map<String, StringBuilder> contentMap = new HashMap<>();
    Set<String> sectionKeywords = Set.of("education", "skills", "experience", "projects");

    for (String line : lines) {
        String lower = line.toLowerCase().trim();
        if (sectionKeywords.contains(lower)) {
            if (!currentSection.isEmpty() && currentContent.length() > 0) {
                contentMap.put(currentSection, new StringBuilder(currentContent.toString()));
            }
            currentSection = lower;
            currentContent = new StringBuilder();
        } else if (!currentSection.isEmpty()) {
            currentContent.append(line).append("\n");
        }
    }

    if (!currentSection.isEmpty() && currentContent.length() > 0) {
        contentMap.put(currentSection, currentContent);
    }

    // Convert to string output or "Not Found"
    for (String section : sectionKeywords) {
        sectionsContent.put(section, contentMap.getOrDefault(section, new StringBuilder("Not found")).toString().trim());
    }

    return sectionsContent;
}

    private String extractName(String text) {
        String[] lines = text.split("\n");
        return lines.length > 0 ? lines[0].trim() : "Not found";
    }



    private int calculateScore(String resume, List<String> jdKeywords) {
        String[] resumeWords = resume.toLowerCase().split("\\W+");
        Set<String> resumeSet = new HashSet<>(Arrays.asList(resumeWords));
        long matchCount = jdKeywords.stream().filter(resumeSet::contains).count();
        return (int) ((matchCount / (double) jdKeywords.size()) * 100);
    }

    private List<String> getKeywords(String jd) {
        if (JOB_KEYWORDS.containsKey(jd.toLowerCase())) {
            return JOB_KEYWORDS.get(jd.toLowerCase());
        } else {
            return Arrays.asList(jd.toLowerCase().split("\\W+"));
        }
    }

    public static class ResumeData {
        public String resume;
        public String jd;
    }
}
