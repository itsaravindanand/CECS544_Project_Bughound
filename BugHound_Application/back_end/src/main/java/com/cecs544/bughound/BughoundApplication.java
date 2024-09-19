package com.cecs544.bughound;

import com.cecs544.bughound.bug.*;
import com.cecs544.bughound.function.*;
import com.cecs544.bughound.program.Program;
import com.cecs544.bughound.program.ProgramService;
import com.cecs544.bughound.user.User;
import com.cecs544.bughound.user.UserDTO;
import com.cecs544.bughound.user.UserService;
import com.cecs544.bughound.user.UserUpdateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@EnableTransactionManagement
@RestController
public class BughoundApplication {

    public static void main(String[] args) {
        SpringApplication.run(BughoundApplication.class, args);
    }

    @Autowired
    private BugService bugService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProgramService programService;

    @Autowired
    private FunctionService functionService;

    //create a new bug with attachments
    @PostMapping("/bugs/createBug")
    public ResponseEntity<Bug> createBug(@RequestBody BugCreationDto bugDto) {
        Bug createdBug = bugService.createBugWithAttachments(bugDto);
        return new ResponseEntity<>(createdBug, HttpStatus.CREATED);
    }

    //get bug with bugId
    @GetMapping("/bugs/{bugId}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long bugId) {
        //Bug bug = bugService.getBugById(id).get();

        return bugService.getBugById(bugId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //get bug(s) with reportedBy
    @GetMapping("/bugs/reportedBy/{username}")
    public ResponseEntity<List<Bug>> getBugsReportedBy(@PathVariable String username) {
        List<Bug> bugs = bugService.getBugsReportedBy(username);
        return ResponseEntity.ok(bugs);
    }

    //get bug summaries with reportBy
    @GetMapping("/bugs/summary/reportedBy/{username}")
    public ResponseEntity<List<BugSummaryDto>> getBugsReportedBySummary(@PathVariable("username") String username) {
        List<BugSummaryDto> bugSummaries = bugService.getBugsReportedBySummary(username);
        return ResponseEntity.ok(bugSummaries);
    }

    //get bug(s) with assignedTo
    @GetMapping("/bugs/assignedTo/{username}")
    public ResponseEntity<List<Bug>> getBugsAssignedTo(@PathVariable("username") String username) {
        List<Bug> bugs = bugService.getBugsAssignedTo(username);
        return ResponseEntity.ok(bugs);
    }

    //get bug summaries with assignedTo
    @GetMapping("/bugs/summary/assignedTo/{username}")
    public ResponseEntity<List<BugSummaryDto>> getBugsAssignedToSummary(@PathVariable("username") String username) {
        List<BugSummaryDto> bugSummaries = bugService.getBugsAssignedToSummary(username);
        return ResponseEntity.ok(bugSummaries);
    }

    //get all bug summaries
    @GetMapping("/bugs/summaries")
    public ResponseEntity<List<BugSummaryDto>> getAllBugSummaries() {
        List<BugSummaryDto> bugSummaries = bugService.getAllBugSummaries();
        return ResponseEntity.ok(bugSummaries);
    }

    //get all bugs with attachments and comments
    @GetMapping("/bugs")
    public ResponseEntity<List<Bug>> getAllBugs() {
        List<Bug> bugs = bugService.getAllBugsWithCommentsAndAttachments();
        return ResponseEntity.ok(bugs);
    }

    //update a bug with bugId
    @PutMapping("/bugs/{bugId}")
    public ResponseEntity<Bug> updateBugReport(@PathVariable Long bugId, @RequestBody BugUpdateDto bugUpdateDto) {
        Bug updatedBug = bugService.updateBugReport(bugId, bugUpdateDto);
        return ResponseEntity.ok(updatedBug);
    }

    //create new user
    @PostMapping("/user/createuser")
    public ResponseEntity<?> addNewUser(@RequestBody UserDTO userDTO) {
        try {
            UserDTO createdUser = userService.addNewUser(userDTO);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    //get user with username
    @GetMapping("/user/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        Optional<UserDTO> userDTO = userService.getUser(username);
        return userDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //get a list of usernames with userType as DEVELOPER
    @GetMapping("/user/developers")
    public ResponseEntity<List<String>> getDeveloperUsernames() {
        List<String> developerUsernames = userService.findDeveloperUsernames();
        return ResponseEntity.ok(developerUsernames);
    }

    //get list of users with developer role
    @GetMapping("/user/usernames")
    public ResponseEntity<List<String>> getUsernames() {
        List<String> developerUsernames = userService.findAllUsernames();
        return ResponseEntity.ok(developerUsernames);
    }

    //read a list of all users
    @GetMapping("/user/details")
    public ResponseEntity<List<UserDTO>> getAllUserDetails() {
        List<UserDTO> userDTOs = userService.getAllUserDetails();
        return ResponseEntity.ok(userDTOs);
    }

    //delete user with username
    @DeleteMapping("/user/remove/{username}")
    public ResponseEntity<Void> deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.ok().build();
    }

    //authenticate user with username and password
    @PostMapping("/user/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody UserDTO userDTO) {
        Optional<User.UserType> userType = userService.authenticateUser(userDTO.getUsername(), userDTO.getPassword());
        if (userType.isPresent()) {
            return ResponseEntity.ok(userType.get().name());
        } else {
            return ResponseEntity.status(401).body("Authentication failed: Incorrect username or password");
        }
    }

    //update user with username
    @PutMapping("/user/update/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody UserUpdateDto userUpdateDto) {
        try {
            User updatedUser = userService.updateUser(username, userUpdateDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    //create program
    @PostMapping("/program/create")
    public ResponseEntity<?> createProgram(@RequestBody Program program) {
        try {
            Program createdProgram = programService.createProgram(program);
            return new ResponseEntity<>(createdProgram, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //get list of programs
    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programService.getAllPrograms();
        return ResponseEntity.ok(programs);
    }

    //get program with programId
    @GetMapping("/program/{id}")
    public ResponseEntity<Program> getProgramById(@PathVariable Long id) {
        return programService.getProgramById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //update program with programId
    @PutMapping("/program/update/{id}")
    public ResponseEntity<?> updateProgram(@PathVariable Long id, @RequestBody Program program) {
        try {
            Program updatedProgram = programService.updateProgram(id, program);
            return ResponseEntity.ok(updatedProgram);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    //get program details with programId
    @GetMapping("/program/id/{name}/{version}/{release}")
    public ResponseEntity<Long> getProgramIdByDetails(@PathVariable String name, @PathVariable String version, @PathVariable String release) {
        return programService.getProgramIdByDetails(name, version, release)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //get program with program details
    @GetMapping("/program/details/{name}/{version}/{release}")
    public ResponseEntity<Program> getProgramByDetails(@PathVariable String name, @PathVariable String version, @PathVariable String release) {
        return programService.getProgramByDetails(name, version, release)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //delete program with programId
    @DeleteMapping("/program/delete/{programId}")
    public ResponseEntity<?> deleteProgram(@PathVariable Long programId) {
        boolean isDeleted = programService.deleteProgramById(programId);
        if (isDeleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //create function area
    @PostMapping("/function/create")
    public ResponseEntity<?> createFunction(@RequestBody FunctionCreateDto function) {
        try {
            Function createdFunction = functionService.createFunction(function);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdFunction);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    //get list of all functions
    @GetMapping("/functions")
    public ResponseEntity<List<FunctionDetailDTO>> getAllFunctions() {
        List<FunctionDetailDTO> functions = functionService.findAllFunctionDetails();
        return ResponseEntity.ok(functions);
    }

    //get functions with programId and functionId
    @GetMapping("/function/{programId}/{funcId}")
    public ResponseEntity<Function> getFunction(@PathVariable Long programId, @PathVariable Long funcId) {
        Function function = functionService.getFunction(programId, funcId);
        return ResponseEntity.ok(function);
    }

    //update functions
    @PutMapping("/function/{programId}/{funcId}")
    public ResponseEntity<?> updateFunctionName(@PathVariable Long programId, @PathVariable Long funcId, @RequestBody FunctionUpdateDto dto) {
        try {
            Function function = functionService.updateFunctionName(programId, funcId, dto.getFuncName());
            return ResponseEntity.ok(function);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //delete function with programId and functionId
    @DeleteMapping("/function/remove/{programId}/{funcId}")
    public ResponseEntity<Void> deleteFunction(@PathVariable Long programId, @PathVariable Long funcId) {
        functionService.deleteFunction(programId, funcId);
        return ResponseEntity.ok().build();
    }
}
