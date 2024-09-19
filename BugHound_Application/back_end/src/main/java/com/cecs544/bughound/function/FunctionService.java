package com.cecs544.bughound.function;

import com.cecs544.bughound.program.Program;
import com.cecs544.bughound.program.ProgramRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FunctionService {

    @Autowired
    private ProgramRepository programRepository;
    @Autowired
    private FunctionRepository functionRepository;

    public Function createFunction(FunctionCreateDto function) throws IllegalStateException {
        // Check if a function with the same name and program ID already exists
        Long programId = function.getProgramId();
        Optional<Function> existingFunction = functionRepository.findByFuncNameAndProgramId(function.getFuncName(), programId);
        if (existingFunction.isPresent()) {
            throw new IllegalStateException("Function with the same name already exists for this program.");
        }

        try {
            Program program = programRepository.findById(programId)
                    .orElseThrow(() -> new IllegalArgumentException("Program with ID " + programId + " not found"));
            Function entity = new Function();
            entity.setFuncName(function.getFuncName());
            entity.setProgram(program);
            return functionRepository.save(entity);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Failed to create the function due to data integrity issues.", e);
        }
    }

    public Function getFunction(Long programId, Long funcId) {
        return functionRepository.findByProgramIdAndFuncId(programId, funcId);
    }

    @Transactional
    public Function updateFunctionName(Long programId, Long funcId, String newFuncName) throws Exception {
        
        Optional<Function> existingFunction = functionRepository.findByFuncNameAndProgramId(newFuncName, programId);
        if (existingFunction.isPresent() && !existingFunction.get().getFuncId().equals(funcId)) {
            throw new IllegalStateException("A function with the same name already exists for this program.");
        }

        Function function = functionRepository.findByProgramIdAndFuncId(programId, funcId);
        if (function == null) {
            throw new Exception("Function not found.");
        }

        function.setFuncName(newFuncName);
        return functionRepository.save(function);
    }

    public List<FunctionDetailDTO> findAllFunctionDetails() {
        List<Function> functionsWithProgramDetails = functionRepository.findAllFunctionDetails();
        return functionsWithProgramDetails.stream()
                .map(f -> new FunctionDetailDTO(f.getFuncId(), f.getFuncName(),
                        f.getProgram().getId(), f.getProgram().getProgName(), f.getProgram().getProgVersion(),
                        f.getProgram().getProgRelease()))
                .toList();
    }

    @Transactional
    public void deleteFunction(Long programId, Long funcId) {
        functionRepository.deleteByProgramIdAndFuncId(programId, funcId);
    }

    public Function getFunction(Long functionId) {
        return functionRepository.findById(functionId)
                .orElseThrow(() -> new IllegalArgumentException("Function with ID " + functionId + " not found"));
    }
}
