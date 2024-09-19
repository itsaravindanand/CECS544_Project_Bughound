CREATE TABLE users
(
    first_name VARCHAR(32)  NOT NULL,
    last_name  VARCHAR(32)  NOT NULL,
    email_id   VARCHAR(32)  NOT NULL,
    username   VARCHAR(32)  NOT NULL,
    password   VARCHAR(255) NOT NULL,
    user_type  enum ('TESTER','DEVELOPER','ADMIN'),
    PRIMARY KEY (username),
    UNIQUE (email_id)
);

CREATE TABLE programs
(
    program_id      INT AUTO_INCREMENT PRIMARY KEY,
    program_name    VARCHAR(32) NOT NULL,
    program_version VARCHAR(32) NOT NULL,
    program_release VARCHAR(32) NOT NULL,
    UNIQUE (program_name, program_version, program_release)
);

CREATE TABLE functions
(
    function_id   INT AUTO_INCREMENT PRIMARY KEY,
    function_name VARCHAR(64) NOT NULL,
    program_id    INT         NOT NULL REFERENCES programs (program_id),
    UNIQUE (program_id, function_name)
);

CREATE TABLE bugs
(
    bug_id                INT UNIQUE                                                                                NOT NULL AUTO_INCREMENT,
    buggy_program_id      INT                                                                                       NOT NULL REFERENCES programs (program_id),
    report_type           enum ('CODING_ERROR', 'DESIGN_ISSUE', 'SUGGESTION', 'DOCUMENTATION', 'HARDWARE', 'QUERY') NOT NULL,
    severity              enum ('MINOR', 'SERIOUS', 'FATAL')                                                        NOT NULL,
    problem_summary       VARCHAR(150)                                                                               NOT NULL,
    reproducible          bool,
    detailed_summary      VARCHAR(200),
    suggestion            VARCHAR(200),
    reported_by           VARCHAR(32)                                                                               NOT NULL REFERENCES users (username),
    report_date           DATE                                                                                      NOT NULL,
    function_id           VARCHAR(32) REFERENCES functions (function_id),
    assigned_to           VARCHAR(32) REFERENCES users (username),
    status                enum ('OPEN', 'RESOLVED', 'CLOSED'),
    priority              enum ('FIX_IMMEDIATELY', 'FIX_AS_SOON_AS_POSSIBLE', 'FIX_BEFORE_NEXT_MILESTONE', 'FIX_BEFORE_RELEASE', 'FIX_IF_POSSIBLE', 'OPTIONAL'),
    resolution            enum ('PENDING', 'FIXED', 'CANNOT_BE_REPRODUCED', 'DEFERRED', 'AS_DESIGNED', 'WITHDRAWN_BY_REPORTER', 'NEED_MORE_INFO', 'DISAGREE_WITH_SUGGESTION', 'DUPLICATE'),
    resolution_program_id VARCHAR(32) REFERENCES programs (program_id),
    resolved_by           VARCHAR(32) REFERENCES users (username),
    resolved_date         DATE,
    tested_by             VARCHAR(32) REFERENCES users (username),
    tested_date           DATE,
    treat_as_deferred     bool,
    PRIMARY KEY (bug_id)
);

CREATE TABLE attachments
(
    bug_id         INT NOT NULL REFERENCES bugs (bug_id),
    attachment_id  INT NOT NULL AUTO_INCREMENT,
    attachment_ext VARCHAR(64) NOT NULL,
    attachment     MEDIUMBLOB NOT NULL,
    PRIMARY KEY (attachment_id)
);

CREATE TABLE comments
(
    bug_id       INT         NOT NULL REFERENCES bugs (bug_id),
    comment_time DATETIME    NOT NULL,
    reported_by  VARCHAR(32) NOT NULL REFERENCES users (username),
    comment      VARCHAR(32) NOT NULL,
    PRIMARY KEY (bug_id, comment_time)
);