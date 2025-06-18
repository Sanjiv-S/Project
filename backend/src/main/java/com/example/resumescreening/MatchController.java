package com.example.resumescreening;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.IOException;
import java.util.*;

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

    Map<String, Object> result = new HashMap<>();
    List<String> keywords = JOB_KEYWORDS.getOrDefault(jd, new ArrayList<>());
    List<String> matched = new ArrayList<>();

    for (String keyword : keywords) {
        if (resumeText.toLowerCase().contains(keyword.toLowerCase())) {
            matched.add(keyword);
        }
    }

    int score = (int) ((matched.size() / (double) keywords.size()) * 100);
    result.put("score", score);
    result.put("matchedKeywords", matched);
    return result;
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
