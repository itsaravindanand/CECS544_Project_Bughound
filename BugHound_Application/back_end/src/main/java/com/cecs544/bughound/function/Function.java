package com.cecs544.bughound.function;

import com.cecs544.bughound.program.Program;
import jakarta.persistence.*;

@Entity
@Table(name = "functions")
public class Function {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "function_id", nullable = false)
    private Long funcId;

    @Column(name = "function_name", nullable = false)
    private String funcName;

    @ManyToOne
    @JoinColumn(name = "program_id", referencedColumnName = "program_id")
    private Program program;

    /*@Column(name = "program_id", nullable = false)
    private Long programId;*/

    public Long getFuncId() {
        return funcId;
    }

    public void setFuncId(Long funcId) {
        this.funcId = funcId;
    }

    public String getFuncName() {
        return funcName;
    }

    public void setFuncName(String funcName) {
        this.funcName = funcName;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }
}
