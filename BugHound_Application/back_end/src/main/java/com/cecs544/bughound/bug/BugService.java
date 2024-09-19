package com.cecs544.bughound.bug;

import com.cecs544.bughound.attachment.Attachment;
import com.cecs544.bughound.attachment.AttachmentDto;
import com.cecs544.bughound.attachment.AttachmentRepository;
import com.cecs544.bughound.comment.Comment;
import com.cecs544.bughound.comment.CommentRepository;
import com.cecs544.bughound.function.Function;
import com.cecs544.bughound.function.FunctionRepository;
import com.cecs544.bughound.function.FunctionService;
import com.cecs544.bughound.program.Program;
import com.cecs544.bughound.program.ProgramService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BugService {

    @Autowired
    private BugRepository bugRepository;
    @Autowired
    private ProgramService programService;
    @Autowired
    private FunctionService functionService;
    @Autowired
    private FunctionRepository functionRepository;
    @Autowired
    private AttachmentRepository attachmentRepository;
    @Autowired
    private CommentRepository commentRepository;

    public Optional<Bug> getBugById(Long id) {
        return bugRepository.findById(id);
    }

    @Transactional
    public Bug createBugWithAttachments(BugCreationDto bugDto) {
        Long buggyProgramId = bugDto.getBuggyProgramId();
        Program program = programService.getProgram(buggyProgramId);
        Bug bug = new Bug();
        bug.setBuggyProgram(program);
        bug.setReportType(Bug.ReportType.valueOf(bugDto.getReportType().toUpperCase()));
        bug.setSeverity(Bug.Severity.valueOf(bugDto.getSeverity().toUpperCase()));
        bug.setProblemSummary(bugDto.getProblemSummary());
        bug.setReproducible(bugDto.getReproducible());
        bug.setDetailedSummary(bugDto.getDetailedSummary());
        bug.setSuggestion(bugDto.getSuggestion());
        bug.setReportedBy(bugDto.getReportedBy());
        bug.setReportDate(bugDto.getReportDate());
        bug.setStatus(Bug.Status.OPEN);
        Bug save = bugRepository.save(bug);

        List<AttachmentDto> inputAPIAttachmentDto = bugDto.getAttachments();
        for (AttachmentDto attachmentDto : inputAPIAttachmentDto) {
            Attachment attachment = new Attachment();
            attachment.setAttachmentExt(attachmentDto.getAttachmentExt());
            attachment.setBug(save);
            attachment.setAttachment(attachmentDto.getAttachmentData());
            attachmentRepository.save(attachment);
        }
        return save;
    }

    @Transactional
    public Bug updateBugReport(Long bugId, BugUpdateDto bugUpdateDto) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found with id: " + bugId));

        if (bugUpdateDto.getBuggyProgramId() != null) {
            Program program = programService.getProgram(bugUpdateDto.getBuggyProgramId());
            bug.setBuggyProgram(program);
        }
        if (bugUpdateDto.getReportType() != null) {
            bug.setReportType(Bug.ReportType.valueOf(bugUpdateDto.getReportType().toUpperCase()));
        }
        if (bugUpdateDto.getSeverity() != null) {
            bug.setSeverity(Bug.Severity.valueOf(bugUpdateDto.getSeverity().toUpperCase()));
        }
        if (bugUpdateDto.getProblemSummary() != null) {
            bug.setProblemSummary(bugUpdateDto.getProblemSummary());
        }
        if (bugUpdateDto.getReproducible() != null) {
            bug.setReproducible(bugUpdateDto.getReproducible());
        }
        if (bugUpdateDto.getDetailedSummary() != null) {
            bug.setDetailedSummary(bugUpdateDto.getDetailedSummary());
        }
        if (bugUpdateDto.getSuggestion() != null) {
            bug.setSuggestion(bugUpdateDto.getSuggestion());
        }
        if (bugUpdateDto.getReportedBy() != null) {
            bug.setReportedBy(bugUpdateDto.getReportedBy());
        }
        if (bugUpdateDto.getReportDate() != null) {
            bug.setReportDate(bugUpdateDto.getReportDate());
        }
        if (bugUpdateDto.getFunctionId() != null) {
            Function function = functionService.getFunction(bugUpdateDto.getFunctionId());
            bug.setFunction(function);
        }
        if (bugUpdateDto.getAssignedTo() != null) {
            bug.setAssignedTo(bugUpdateDto.getAssignedTo());
        }
        if (bugUpdateDto.getStatus() != null) {
            bug.setStatus(Bug.Status.valueOf(bugUpdateDto.getStatus().toUpperCase()));
        }
        if (bugUpdateDto.getPriority() != null) {
            bug.setPriority(Bug.Priority.valueOf(bugUpdateDto.getPriority().toUpperCase()));
        }
        if (bugUpdateDto.getResolution() != null) {
            bug.setResolution(Bug.Resolution.valueOf(bugUpdateDto.getResolution().toUpperCase()));
        }
        if (bugUpdateDto.getResolutionProgramId() != null) {
            Program program = programService.getProgram(bugUpdateDto.getResolutionProgramId());
            bug.setResolutionProgram(program);
        }
        if (bugUpdateDto.getResolvedBy() != null) {
            bug.setResolvedBy(bugUpdateDto.getResolvedBy());
        }
        if (bugUpdateDto.getResolvedDate() != null) {
            bug.setResolvedDate(bugUpdateDto.getResolvedDate());
        }
        if (bugUpdateDto.getTestedBy() != null) {
            bug.setTestedBy(bugUpdateDto.getTestedBy());
        }
        if (bugUpdateDto.getTestedDate() != null) {
            bug.setTestedDate(bugUpdateDto.getTestedDate());
        }
        if (bugUpdateDto.getTreatAsDeferred() != null) {
            bug.setTreatAsDeferred(bugUpdateDto.getTreatAsDeferred());
        }

        bug = bugRepository.save(bug);

        if (bugUpdateDto.getComment() != null && !bugUpdateDto.getComment().trim().isEmpty()) {
            Comment comment = new Comment();
            comment.setBugId(bugId); // Make sure this matches your entity field
            comment.setCommentTime(LocalDateTime.now());
            comment.setReportedBy(bugUpdateDto.getCommentReporter());
            comment.setComment(bugUpdateDto.getComment());
            commentRepository.save(comment);
        }

        if (bugUpdateDto.getAttachments() != null) {
            List<AttachmentDto> inputAPIAttachmentDto = bugUpdateDto.getAttachments();
            for (AttachmentDto attachmentDto : inputAPIAttachmentDto) {
                Attachment attachment = new Attachment();
                attachment.setAttachmentExt(attachmentDto.getAttachmentExt());
                attachment.setBug(bug);
                attachment.setAttachment(attachmentDto.getAttachmentData());
                attachmentRepository.save(attachment);
            }
        }
        return bug;
    }

    public List<Bug> getBugsReportedBy(String reportedBy) {
        return bugRepository.findByReportedBy(reportedBy);
    }

    public List<BugSummaryDto> getBugsReportedBySummary(String reportedBy) {
        return bugRepository.findByReportedBy(reportedBy).stream().map(bug -> {
            BugSummaryDto dto = new BugSummaryDto();
            dto.setBugId(bug.getBug_id());
            dto.setBuggyProgram(programService.getProgram(bug.getBug_id()));
            dto.setProblemSummary(bug.getProblemSummary());
            dto.setStatus(bug.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<Bug> getBugsAssignedTo(String assignedTo) {
        return bugRepository.findByAssignedTo(assignedTo);
    }

    public List<BugSummaryDto> getBugsAssignedToSummary(String assignedTo) {
        return bugRepository.findByAssignedTo(assignedTo).stream().map(bug -> {
            BugSummaryDto dto = new BugSummaryDto();
            dto.setBugId(bug.getBug_id());
            dto.setBuggyProgram(bug.getBuggyProgram());
            dto.setProblemSummary(bug.getProblemSummary());
            dto.setStatus(bug.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<BugSummaryDto> getAllBugSummaries() {
        return bugRepository.findAll().stream().map(bug -> {
            BugSummaryDto dto = new BugSummaryDto();
            dto.setBugId(bug.getBug_id());
            dto.setBuggyProgram(bug.getBuggyProgram());
            dto.setProblemSummary(bug.getProblemSummary());
            dto.setStatus(bug.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<Bug> getAllBugsWithCommentsAndAttachments() {
        return bugRepository.findAll();
    }
}
