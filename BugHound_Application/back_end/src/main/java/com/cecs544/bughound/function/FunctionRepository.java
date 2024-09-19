package com.cecs544.bughound.function;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FunctionRepository extends JpaRepository<Function, Long> {
    Function findByProgramIdAndFuncId(Long programId, Long funcId);  // Corrected method name

    Optional<Function> findByFuncNameAndProgramId(String funcName, Long programId);

    void deleteByProgramIdAndFuncId(Long programId, Long funcId);

    @Query("SELECT f FROM Function f JOIN FETCH f.program")
    List<Function> findAllFunctionDetails();
}

