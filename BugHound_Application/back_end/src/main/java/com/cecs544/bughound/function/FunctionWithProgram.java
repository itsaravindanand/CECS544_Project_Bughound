package com.cecs544.bughound.function;

import jakarta.persistence.Column;

public class FunctionWithProgram {
    @Column(name = "function_id", nullable = false)
    private Long funcId;

    @Column(name = "function_name", nullable = false)
    private String funcName;

    private Long program_id;

    @Column(name = "program_name", nullable = false)
    private String progName;

    @Column(name = "program_version", nullable = false)
    private String progVersion;

    @Column(name = "program_release", nullable = false)
    private String progRelease;

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

    public Long getProgram_id() {
        return program_id;
    }

    public void setProgram_id(Long program_id) {
        this.program_id = program_id;
    }

    public String getProgName() {
        return progName;
    }

    public void setProgName(String progName) {
        this.progName = progName;
    }

    public String getProgVersion() {
        return progVersion;
    }

    public void setProgVersion(String progVersion) {
        this.progVersion = progVersion;
    }

    public String getProgRelease() {
        return progRelease;
    }

    public void setProgRelease(String progRelease) {
        this.progRelease = progRelease;
    }
}
