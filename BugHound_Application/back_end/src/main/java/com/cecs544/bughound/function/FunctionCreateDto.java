package com.cecs544.bughound.function;

public class FunctionCreateDto {
    private String funcName;
    private Long programId;

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
}
