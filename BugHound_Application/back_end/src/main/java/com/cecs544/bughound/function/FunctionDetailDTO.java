package com.cecs544.bughound.function;

public class FunctionDetailDTO {
    private Long funcId;
    private String funcName;
    private Long programId;
    private String progName;
    private String progVersion;
    private String progRelease;

    public FunctionDetailDTO(Long funcId, String funcName, Long programId, String progName, String progVersion, String progRelease) {
        this.funcId = funcId;
        this.funcName = funcName;
        this.programId = programId;
        this.progName = progName;
        this.progVersion = progVersion;
        this.progRelease = progRelease;
    }

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

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
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

