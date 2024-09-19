package com.cecs544.bughound.program;

import jakarta.persistence.*;

@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id", nullable = false)
    private Long id;

    @Column(name = "program_name", nullable = false)
    private String progName;

    @Column(name = "program_version", nullable = false)
    private String progVersion;

    @Column(name = "program_release", nullable = false)
    private String progRelease;

    public Long getId() {
        return id;
    }

    public void setId(Long program_id) {
        this.id = program_id;
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

