/**
 * 
 * @param {*} commandInfoOutput 
 * @returns An Array of command names extracted from the given string
 */
const getRedisCommandsFromCommandInfo = (commandInfoOutput) => {
    const getCommandsRegExp = RegExp('cmdstat_(.+):', 'g');
    let result = [];
    while ((tmp = getCommandsRegExp.exec(commandInfoOutput)) !== null) {
        result.push(tmp[1])
    }
    return result;
}

/**
 * given an array with command names returns an array with objects
 * {
 *   name : givenName
 *   minVersion : First version this command was released by redis
 *   dragonflyVersion : First version this command was released by dragonfly
 * }
 */
const addMinVersion = (commands) => {
    return commands.reduce(function(res, curItem) {
        const cmd = redisCommandsList[curItem.toUpperCase()];
        const dfSupport = cmd ? cmd["dragonfly_since"] : null;

        const tmp = {
            name : curItem,
            minVersion : cmd ? cmd["since"] : "Unsupported",
            dragonflyVersion : dfSupport ? "Supported" : "Unsupported"
        }
        res.push(tmp);
        return res;
    }, []);
}

/**
 * 
 * @param {string} version 
 * @returns An array holding command names that are supported in the given version
 */
const getCommandNamesArrFilterByVersion = (version) => {
    return Object.keys(redisCommandsList)
        .filter((key) => redisCommandsList[key]["since"] <= version)
        .map(key => key);
}

const getRedisVersions = () => {
    var result = [];
    Object.keys(redisCommandsList).forEach(element => {
        var version = redisCommandsList[element]["since"];        
        if (!result.includes(version)) {
            result.push(version);
        }
    });
    return result;
}

let redisCommandsList = {
    "ACL": {
        "summary": "A container for Access List Control commands ",
        "since": "6.0.0",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "ACL CAT": {
        "summary": "List the ACL categories or the commands inside a category",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(1) since the categories and commands are a fixed set.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "categoryname",
                "type": "string",
                "optional": true
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL DELUSER": {
        "summary": "Remove the specified ACL users and the associated rules",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(1) amortized time considering the typical user.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "username",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL DRYRUN": {
        "summary": "Returns whether the user can execute the given command without executing the command.",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(1).",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "username",
                "type": "string"
            },
            {
                "name": "command",
                "type": "string"
            },
            {
                "name": "arg",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL GENPASS": {
        "summary": "Generate a pseudorandom secure password to use for ACL users",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "bits",
                "type": "integer",
                "optional": true
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL GETUSER": {
        "summary": "Get the rules for a specific ACL user",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of password, command and pattern rules that the user has.",
        "history": [
            [
                "6.2.0",
                "Added Pub/Sub channel patterns."
            ],
            [
                "7.0.0",
                "Added selectors and changed the format of key and channel patterns from a list to their rule representation."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "username",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "ACL LIST": {
        "summary": "List the current ACL rules in ACL config file format",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of configured users.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL LOAD": {
        "summary": "Reload the ACLs from the configured ACL file",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of configured users.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL LOG": {
        "summary": "List latest events denied because of ACLs in place",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N) with N being the number of entries shown.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "operation",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer"
                    },
                    {
                        "name": "reset",
                        "type": "pure-token",
                        "token": "RESET"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL SAVE": {
        "summary": "Save the current ACL rules in the configured ACL file",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of configured users.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL SETUSER": {
        "summary": "Modify or create the rules for a specific ACL user",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of rules provided.",
        "history": [
            [
                "6.2.0",
                "Added Pub/Sub channel patterns."
            ],
            [
                "7.0.0",
                "Added selectors and key based permissions."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "username",
                "type": "string"
            },
            {
                "name": "rule",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL USERS": {
        "summary": "List the username of all the configured ACL rules",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(N). Where N is the number of configured users.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "ACL WHOAMI": {
        "summary": "Return the name of the user associated to the current connection",
        "since": "6.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "APPEND": {
        "summary": "Append a value to a key",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1). The amortized time complexity is O(1) assuming the appended value is small and the already present value is of any size, since the dynamic string library used by Redis will double the free space available on every reallocation.",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "ASKING": {
        "summary": "Sent by cluster clients after an -ASK redirect",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 1,
        "command_flags": [
            "fast"
        ]
    },
    "AUTH": {
        "summary": "Authenticate to the server",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "connection",
        "complexity": "O(N) where N is the number of passwords defined for the user",
        "history": [
            [
                "6.0.0",
                "Added ACL style (username and password)."
            ]
        ],
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "username",
                "type": "string",
                "since": "6.0.0",
                "optional": true
            },
            {
                "name": "password",
                "type": "string"
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "no_auth",
            "allow_busy"
        ]
    },
    "BGREWRITEAOF": {
        "summary": "Asynchronously rewrite the append-only file",
        "since": "1.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading"
        ]
    },
    "BGSAVE": {
        "summary": "Asynchronously save the dataset to disk",
        "since": "1.0.0",
        "group": "server",
        "complexity": "O(1)",
        "history": [
            [
                "3.2.2",
                "Added the `SCHEDULE` option."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "schedule",
                "type": "pure-token",
                "token": "SCHEDULE",
                "since": "3.2.2",
                "optional": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading"
        ]
    },
    "BITCOUNT": {
        "summary": "Count set bits in a string",
        "since": "2.6.0",
        "group": "bitmap",
        "complexity": "O(N)",
        "history": [
            [
                "7.0.0",
                "Added the `BYTE|BIT` option."
            ]
        ],
        "acl_categories": [
            "@read",
            "@bitmap",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "index",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "start",
                        "type": "integer"
                    },
                    {
                        "name": "end",
                        "type": "integer"
                    },
                    {
                        "name": "index_unit",
                        "type": "oneof",
                        "since": "7.0.0",
                        "optional": true,
                        "arguments": [
                            {
                                "name": "byte",
                                "type": "pure-token",
                                "token": "BYTE"
                            },
                            {
                                "name": "bit",
                                "type": "pure-token",
                                "token": "BIT"
                            }
                        ]
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "BITFIELD": {
        "summary": "Perform arbitrary bitfield integer operations on strings",
        "since": "3.2.0",
        "group": "bitmap",
        "complexity": "O(1) for each subcommand specified",
        "acl_categories": [
            "@write",
            "@bitmap",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "notes": "This command allows both access and modification of the key",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true,
                "variable_flags": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "encoding_offset",
                "type": "block",
                "token": "GET",
                "optional": true,
                "arguments": [
                    {
                        "name": "encoding",
                        "type": "string"
                    },
                    {
                        "name": "offset",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "encoding_offset_value",
                "type": "block",
                "token": "SET",
                "optional": true,
                "arguments": [
                    {
                        "name": "encoding",
                        "type": "string"
                    },
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "value",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "encoding_offset_increment",
                "type": "block",
                "token": "INCRBY",
                "optional": true,
                "arguments": [
                    {
                        "name": "encoding",
                        "type": "string"
                    },
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "increment",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "wrap_sat_fail",
                "type": "oneof",
                "token": "OVERFLOW",
                "optional": true,
                "arguments": [
                    {
                        "name": "wrap",
                        "type": "pure-token",
                        "token": "WRAP"
                    },
                    {
                        "name": "sat",
                        "type": "pure-token",
                        "token": "SAT"
                    },
                    {
                        "name": "fail",
                        "type": "pure-token",
                        "token": "FAIL"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    },
    "BITFIELD_RO": {
        "summary": "Perform arbitrary bitfield integer operations on strings. Read-only variant of BITFIELD",
        "since": "6.2.0",
        "group": "bitmap",
        "complexity": "O(1) for each subcommand specified",
        "acl_categories": [
            "@read",
            "@bitmap",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "encoding_offset",
                "type": "block",
                "token": "GET",
                "arguments": [
                    {
                        "name": "encoding",
                        "type": "string"
                    },
                    {
                        "name": "offset",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "BITOP": {
        "summary": "Perform bitwise operations between strings",
        "since": "2.6.0",
        "group": "bitmap",
        "complexity": "O(N)",
        "acl_categories": [
            "@write",
            "@bitmap",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 3
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "operation",
                "type": "string"
            },
            {
                "name": "destkey",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "BITPOS": {
        "summary": "Find first bit set or clear in a string",
        "since": "2.8.7",
        "group": "bitmap",
        "complexity": "O(N)",
        "history": [
            [
                "7.0.0",
                "Added the `BYTE|BIT` option."
            ]
        ],
        "acl_categories": [
            "@read",
            "@bitmap",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "bit",
                "type": "integer"
            },
            {
                "name": "index",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "start",
                        "type": "integer"
                    },
                    {
                        "name": "end_index",
                        "type": "block",
                        "optional": true,
                        "arguments": [
                            {
                                "name": "end",
                                "type": "integer"
                            },
                            {
                                "name": "index_unit",
                                "type": "oneof",
                                "since": "7.0.0",
                                "optional": true,
                                "arguments": [
                                    {
                                        "name": "byte",
                                        "type": "pure-token",
                                        "token": "BYTE"
                                    },
                                    {
                                        "name": "bit",
                                        "type": "pure-token",
                                        "token": "BIT"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "BLMOVE": {
        "summary": "Pop an element from a list, push it to another list and return it; or block until one is available",
        "since": "6.2.0",
        "group": "list",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@list",
            "@slow",
            "@blocking"
        ],
        "arity": 6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "wherefrom",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            },
            {
                "name": "whereto",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "noscript",
            "blocking"
        ]
    },
    "BLMPOP": {
        "summary": "Pop elements from a list, or block until one is available",
        "since": "7.0.0",
        "group": "list",
        "complexity": "O(N+M) where N is the number of provided keys and M is the number of elements returned.",
        "acl_categories": [
            "@write",
            "@list",
            "@slow",
            "@blocking"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "timeout",
                "type": "double"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "where",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "blocking",
            "movablekeys"
        ]
    },
    "BLPOP": {
        "summary": "Remove and get the first element in a list, or block until one is available",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of provided keys.",
        "history": [
            [
                "6.0.0",
                "`timeout` is interpreted as a double instead of an integer."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@slow",
            "@blocking"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -2,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "noscript",
            "blocking"
        ]
    },
    "BRPOP": {
        "summary": "Remove and get the last element in a list, or block until one is available",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of provided keys.",
        "history": [
            [
                "6.0.0",
                "`timeout` is interpreted as a double instead of an integer."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@slow",
            "@blocking"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -2,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "noscript",
            "blocking"
        ]
    },
    "BRPOPLPUSH": {
        "summary": "Pop an element from a list, push it to another list and return it; or block until one is available",
        "since": "2.2.0",
        "group": "list",
        "complexity": "O(1)",
        "deprecated_since": "6.2.0",
        "replaced_by": "`BLMOVE` with the `RIGHT` and `LEFT` arguments",
        "history": [
            [
                "6.0.0",
                "`timeout` is interpreted as a double instead of an integer."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@slow",
            "@blocking"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "noscript",
            "blocking"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "BZMPOP": {
        "summary": "Remove and return members with scores in a sorted set or block until one is available",
        "since": "7.0.0",
        "group": "sorted-set",
        "complexity": "O(K) + O(N*log(M)) where K is the number of provided keys, N being the number of elements in the sorted set, and M being the number of elements popped.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow",
            "@blocking"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "timeout",
                "type": "double"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "where",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "blocking",
            "movablekeys"
        ]
    },
    "BZPOPMAX": {
        "summary": "Remove and return the member with the highest score from one or more sorted sets, or block until one is available",
        "since": "5.0.0",
        "group": "sorted-set",
        "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
        "history": [
            [
                "6.0.0",
                "`timeout` is interpreted as a double instead of an integer."
            ]
        ],
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast",
            "@blocking"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -2,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "noscript",
            "blocking",
            "fast"
        ]
    },
    "BZPOPMIN": {
        "summary": "Remove and return the member with the lowest score from one or more sorted sets, or block until one is available",
        "since": "5.0.0",
        "group": "sorted-set",
        "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
        "history": [
            [
                "6.0.0",
                "`timeout` is interpreted as a double instead of an integer."
            ]
        ],
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast",
            "@blocking"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -2,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "timeout",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "noscript",
            "blocking",
            "fast"
        ]
    },
    "CLIENT": {
        "summary": "A container for client connection commands",
        "since": "2.4.0",
        "group": "connection",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "CLIENT CACHING": {
        "summary": "Instruct the server about tracking or not keys in the next request",
        "since": "6.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "mode",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "yes",
                        "type": "pure-token",
                        "token": "YES"
                    },
                    {
                        "name": "no",
                        "type": "pure-token",
                        "token": "NO"
                    }
                ]
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT GETNAME": {
        "summary": "Get the current connection name",
        "since": "2.6.9",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT GETREDIR": {
        "summary": "Get tracking notifications redirection client ID if any",
        "since": "6.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "CLIENT ID": {
        "summary": "Returns the client ID for the current connection",
        "since": "5.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT INFO": {
        "summary": "Returns information about the current client connection.",
        "since": "6.2.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLIENT KILL": {
        "summary": "Kill the connection of a client",
        "since": "2.4.0",
        "group": "connection",
        "complexity": "O(N) where N is the number of client connections",
        "history": [
            [
                "2.8.12",
                "Added new filter format."
            ],
            [
                "2.8.12",
                "`ID` option."
            ],
            [
                "3.2.0",
                "Added `master` type in for `TYPE` option."
            ],
            [
                "5.0.0",
                "Replaced `slave` `TYPE` with `replica`. `slave` still supported for backward compatibility."
            ],
            [
                "6.2.0",
                "`LADDR` option."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "ip:port",
                "type": "string",
                "optional": true
            },
            {
                "name": "client-id",
                "type": "integer",
                "token": "ID",
                "since": "2.8.12",
                "optional": true
            },
            {
                "name": "normal_master_slave_pubsub",
                "type": "oneof",
                "token": "TYPE",
                "since": "2.8.12",
                "optional": true,
                "arguments": [
                    {
                        "name": "normal",
                        "type": "pure-token",
                        "token": "NORMAL"
                    },
                    {
                        "name": "master",
                        "type": "pure-token",
                        "token": "MASTER",
                        "since": "3.2.0"
                    },
                    {
                        "name": "slave",
                        "type": "pure-token",
                        "token": "SLAVE"
                    },
                    {
                        "name": "replica",
                        "type": "pure-token",
                        "token": "REPLICA",
                        "since": "5.0.0"
                    },
                    {
                        "name": "pubsub",
                        "type": "pure-token",
                        "token": "PUBSUB"
                    }
                ]
            },
            {
                "name": "username",
                "type": "string",
                "token": "USER",
                "optional": true
            },
            {
                "name": "ip:port",
                "type": "string",
                "token": "ADDR",
                "optional": true
            },
            {
                "name": "ip:port",
                "type": "string",
                "token": "LADDR",
                "since": "6.2.0",
                "optional": true
            },
            {
                "name": "yes/no",
                "type": "string",
                "token": "SKIPME",
                "optional": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT LIST": {
        "summary": "Get the list of client connections",
        "since": "2.4.0",
        "group": "connection",
        "complexity": "O(N) where N is the number of client connections",
        "history": [
            [
                "2.8.12",
                "Added unique client `id` field."
            ],
            [
                "5.0.0",
                "Added optional `TYPE` filter."
            ],
            [
                "6.2.0",
                "Added `laddr` field and the optional `ID` filter."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "normal_master_replica_pubsub",
                "type": "oneof",
                "token": "TYPE",
                "since": "5.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "normal",
                        "type": "pure-token",
                        "token": "NORMAL"
                    },
                    {
                        "name": "master",
                        "type": "pure-token",
                        "token": "MASTER"
                    },
                    {
                        "name": "replica",
                        "type": "pure-token",
                        "token": "REPLICA"
                    },
                    {
                        "name": "pubsub",
                        "type": "pure-token",
                        "token": "PUBSUB"
                    }
                ]
            },
            {
                "name": "id",
                "type": "block",
                "token": "ID",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "client-id",
                        "type": "integer",
                        "multiple": true
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLIENT NO-EVICT": {
        "summary": "Set client eviction mode for the current connection",
        "since": "7.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "enabled",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "on",
                        "type": "pure-token",
                        "token": "ON"
                    },
                    {
                        "name": "off",
                        "type": "pure-token",
                        "token": "OFF"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT PAUSE": {
        "summary": "Stop processing commands from clients for some time",
        "since": "2.9.50",
        "group": "connection",
        "complexity": "O(1)",
        "history": [
            [
                "6.2.0",
                "`CLIENT PAUSE WRITE` mode added along with the `mode` option."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "timeout",
                "type": "integer"
            },
            {
                "name": "mode",
                "type": "oneof",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "write",
                        "type": "pure-token",
                        "token": "WRITE"
                    },
                    {
                        "name": "all",
                        "type": "pure-token",
                        "token": "ALL"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT REPLY": {
        "summary": "Instruct the server whether to reply to commands",
        "since": "3.2.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "on_off_skip",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "on",
                        "type": "pure-token",
                        "token": "ON"
                    },
                    {
                        "name": "off",
                        "type": "pure-token",
                        "token": "OFF"
                    },
                    {
                        "name": "skip",
                        "type": "pure-token",
                        "token": "SKIP"
                    }
                ]
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT SETNAME": {
        "summary": "Set the current connection name",
        "since": "2.6.9",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "connection-name",
                "type": "string"
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT TRACKING": {
        "summary": "Enable or disable server assisted client side caching support",
        "since": "6.0.0",
        "group": "connection",
        "complexity": "O(1). Some options may introduce additional complexity.",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "status",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "on",
                        "type": "pure-token",
                        "token": "ON"
                    },
                    {
                        "name": "off",
                        "type": "pure-token",
                        "token": "OFF"
                    }
                ]
            },
            {
                "name": "client-id",
                "type": "integer",
                "token": "REDIRECT",
                "optional": true
            },
            {
                "name": "prefix",
                "type": "string",
                "token": "PREFIX",
                "optional": true,
                "multiple": true,
                "multiple_token": true
            },
            {
                "name": "bcast",
                "type": "pure-token",
                "token": "BCAST",
                "optional": true
            },
            {
                "name": "optin",
                "type": "pure-token",
                "token": "OPTIN",
                "optional": true
            },
            {
                "name": "optout",
                "type": "pure-token",
                "token": "OPTOUT",
                "optional": true
            },
            {
                "name": "noloop",
                "type": "pure-token",
                "token": "NOLOOP",
                "optional": true
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT TRACKINGINFO": {
        "summary": "Return information about server assisted client side caching for the current connection",
        "since": "6.2.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT UNBLOCK": {
        "summary": "Unblock a client blocked in a blocking command from a different connection",
        "since": "5.0.0",
        "group": "connection",
        "complexity": "O(log N) where N is the number of client connections",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "client-id",
                "type": "integer"
            },
            {
                "name": "timeout_error",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "timeout",
                        "type": "pure-token",
                        "token": "TIMEOUT"
                    },
                    {
                        "name": "error",
                        "type": "pure-token",
                        "token": "ERROR"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLIENT UNPAUSE": {
        "summary": "Resume processing of clients that were paused",
        "since": "6.2.0",
        "group": "connection",
        "complexity": "O(N) Where N is the number of paused clients",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CLUSTER": {
        "summary": "A container for cluster commands",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "CLUSTER ADDSLOTS": {
        "summary": "Assign new hash slots to receiving node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of hash slot arguments",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "slot",
                "type": "integer",
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER ADDSLOTSRANGE": {
        "summary": "Assign new hash slots to receiving node",
        "since": "7.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of the slots between the start slot and end slot arguments.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "start-slot_end-slot",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "start-slot",
                        "type": "integer"
                    },
                    {
                        "name": "end-slot",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER BUMPEPOCH": {
        "summary": "Advance the cluster config epoch",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER COUNT-FAILURE-REPORTS": {
        "summary": "Return the number of failure reports active for a given node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the number of failure reports",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "node-id",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER COUNTKEYSINSLOT": {
        "summary": "Return the number of local keys in the specified hash slot",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "slot",
                "type": "integer"
            }
        ],
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER DELSLOTS": {
        "summary": "Set hash slots as unbound in receiving node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of hash slot arguments",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "slot",
                "type": "integer",
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER DELSLOTSRANGE": {
        "summary": "Set hash slots as unbound in receiving node",
        "since": "7.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of the slots between the start slot and end slot arguments.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "start-slot_end-slot",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "start-slot",
                        "type": "integer"
                    },
                    {
                        "name": "end-slot",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER FAILOVER": {
        "summary": "Forces a replica to perform a manual failover of its master.",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "options",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "force",
                        "type": "pure-token",
                        "token": "FORCE"
                    },
                    {
                        "name": "takeover",
                        "type": "pure-token",
                        "token": "TAKEOVER"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER FLUSHSLOTS": {
        "summary": "Delete a node's own slots information",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER FORGET": {
        "summary": "Remove a node from the nodes table",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "node-id",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER GETKEYSINSLOT": {
        "summary": "Return local key names in the specified hash slot",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(log(N)) where N is the number of requested keys",
        "acl_categories": [
            "@slow"
        ],
        "arity": 4,
        "arguments": [
            {
                "name": "slot",
                "type": "integer"
            },
            {
                "name": "count",
                "type": "integer"
            }
        ],
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "CLUSTER INFO": {
        "summary": "Provides info about Redis Cluster node state",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER KEYSLOT": {
        "summary": "Returns the hash slot of the specified key",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the number of bytes in the key",
        "acl_categories": [
            "@slow"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "key",
                "type": "string"
            }
        ],
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER LINKS": {
        "summary": "Returns a list of all TCP links to and from peer nodes in cluster",
        "since": "7.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of Cluster nodes",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER MEET": {
        "summary": "Force a node cluster to handshake with another node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "ip",
                "type": "string"
            },
            {
                "name": "port",
                "type": "integer"
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER MYID": {
        "summary": "Return the node id",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER NODES": {
        "summary": "Get Cluster config for the node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of Cluster nodes",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER REPLICAS": {
        "summary": "List replica nodes of the specified master node",
        "since": "5.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "node-id",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER REPLICATE": {
        "summary": "Reconfigure a node as a replica of the specified master node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "node-id",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER RESET": {
        "summary": "Reset a Redis Cluster node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the number of known nodes. The command may execute a FLUSHALL as a side effect.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "hard_soft",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "hard",
                        "type": "pure-token",
                        "token": "HARD"
                    },
                    {
                        "name": "soft",
                        "type": "pure-token",
                        "token": "SOFT"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SAVECONFIG": {
        "summary": "Forces the node to save cluster state on disk",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SET-CONFIG-EPOCH": {
        "summary": "Set the configuration epoch in a new node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "config-epoch",
                "type": "integer"
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SETSLOT": {
        "summary": "Bind a hash slot to a specific node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "slot",
                "type": "integer"
            },
            {
                "name": "subcommand",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "node-id",
                        "type": "string",
                        "token": "IMPORTING"
                    },
                    {
                        "name": "node-id",
                        "type": "string",
                        "token": "MIGRATING"
                    },
                    {
                        "name": "node-id",
                        "type": "string",
                        "token": "NODE"
                    },
                    {
                        "name": "stable",
                        "type": "pure-token",
                        "token": "STABLE"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "stale",
            "no_async_loading"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SHARDS": {
        "summary": "Get array of cluster slots to node mappings",
        "since": "7.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of cluster nodes",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SLAVES": {
        "summary": "List replica nodes of the specified master node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "deprecated_since": "5.0.0",
        "replaced_by": "`CLUSTER REPLICAS`",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "node-id",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "stale"
        ],
        "doc_flags": [
            "deprecated"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "CLUSTER SLOTS": {
        "summary": "Get array of Cluster slot to node mappings",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(N) where N is the total number of Cluster nodes",
        "deprecated_since": "7.0.0",
        "replaced_by": "`CLUSTER SHARDS`",
        "history": [
            [
                "4.0.0",
                "Added node IDs."
            ],
            [
                "7.0.0",
                "Added additional networking metadata field."
            ]
        ],
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "stale"
        ],
        "doc_flags": [
            "deprecated"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "COMMAND": {
        "summary": "Get array of Redis command details",
        "since": "2.8.13",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(N) where N is the total number of Redis commands",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -1,
        "command_flags": [
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "COMMAND COUNT": {
        "summary": "Get total number of Redis commands",
        "since": "2.8.13",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "COMMAND DOCS": {
        "summary": "Get array of specific Redis command documentation",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(N) where N is the number of commands to look up",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "command-name",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "COMMAND GETKEYS": {
        "summary": "Extract keys given a full Redis command",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(N) where N is the number of arguments to the command",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -4,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "COMMAND GETKEYSANDFLAGS": {
        "summary": "Extract keys and access flags given a full Redis command",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(N) where N is the number of arguments to the command",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -4,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "COMMAND HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "COMMAND INFO": {
        "summary": "Get array of specific Redis command details, or all when no argument is given.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(N) where N is the number of commands to look up",
        "history": [
            [
                "7.0.0",
                "Allowed to be called with no argument to get info on all commands."
            ]
        ],
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "command-name",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "COMMAND LIST": {
        "summary": "Get an array of Redis command names",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(N) where N is the total number of Redis commands",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "filterby",
                "type": "oneof",
                "token": "FILTERBY",
                "optional": true,
                "arguments": [
                    {
                        "name": "module-name",
                        "type": "string",
                        "token": "MODULE"
                    },
                    {
                        "name": "category",
                        "type": "string",
                        "token": "ACLCAT"
                    },
                    {
                        "name": "pattern",
                        "type": "pattern",
                        "token": "PATTERN"
                    }
                ]
            }
        ],
        "command_flags": [
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "CONFIG": {
        "summary": "A container for server configuration commands",
        "since": "2.0.0",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "CONFIG GET": {
        "summary": "Get the values of configuration parameters",
        "since": "2.0.0",
        "group": "server",
        "complexity": "O(N) when N is the number of configuration parameters provided",
        "history": [
            [
                "7.0.0",
                "Added the ability to pass multiple pattern parameters in one call"
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "parameter",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "parameter",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CONFIG HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "CONFIG RESETSTAT": {
        "summary": "Reset the stats returned by INFO",
        "since": "2.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CONFIG REWRITE": {
        "summary": "Rewrite the configuration file with the in memory configuration",
        "since": "2.8.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "CONFIG SET": {
        "summary": "Set configuration parameters to the given values",
        "since": "2.0.0",
        "group": "server",
        "complexity": "O(N) when N is the number of configuration parameters provided",
        "history": [
            [
                "7.0.0",
                "Added the ability to set multiple parameters in one call."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "arguments": [
            {
                "name": "parameter_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "parameter",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:all_succeeded"
        ]
    },
    "COPY": {
        "summary": "Copy a key",
        "since": "6.2.0",
        "group": "generic",
        "complexity": "O(N) worst case for collections, where N is the number of nested items. O(1) for string values.",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "destination-db",
                "type": "integer",
                "token": "DB",
                "optional": true
            },
            {
                "name": "replace",
                "type": "pure-token",
                "token": "REPLACE",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "DBSIZE": {
        "summary": "Return the number of keys in the selected database",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 1,
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:agg_sum"
        ]
    },
    "DEBUG": {
        "summary": "A container for debugging commands",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "doc_flags": [
            "syscmd"
        ]
    },
    "DECR": {
        "summary": "Decrement the integer value of a key by one",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "DECRBY": {
        "summary": "Decrement the integer value of a key by the given number",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "decrement",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "DEL": {
        "summary": "Delete a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(N) where N is the number of keys that will be removed. When a key to remove holds a value other than a string, the individual complexity for this key is O(M) where M is the number of elements in the list, set, sorted set or hash. Removing a single key that holds a string value is O(1).",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RM": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "write"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:agg_sum"
        ]
    },
    "DISCARD": {
        "summary": "Discard all commands issued after MULTI",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "transactions",
        "complexity": "O(N), when N is the number of queued commands",
        "acl_categories": [
            "@fast",
            "@transaction"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "allow_busy"
        ]
    },
    "DUMP": {
        "summary": "Return a serialized version of the value stored at the specified key.",
        "since": "2.6.0",
        "group": "generic",
        "complexity": "O(1) to access the key and additional O(N*M) to serialize it, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1).",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "ECHO": {
        "summary": "Echo the given string",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 2,
        "arguments": [
            {
                "name": "message",
                "type": "string"
            }
        ],
        "command_flags": [
            "fast"
        ]
    },
    "EVAL": {
        "summary": "Execute a Lua script server side",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "scripting",
        "complexity": "Depends on the script that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "notes": "We cannot tell how the keys will be used so we assume the worst, RW and UPDATE",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "script",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "optional": true,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "may_replicate",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "EVALSHA": {
        "summary": "Execute a Lua script server side",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "scripting",
        "complexity": "Depends on the script that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "sha1",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "optional": true,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "may_replicate",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "EVALSHA_RO": {
        "summary": "Execute a read-only Lua script server side",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "Depends on the script that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "sha1",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "EVAL_RO": {
        "summary": "Execute a read-only Lua script server side",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "Depends on the script that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "notes": "We cannot tell how the keys will be used so we assume the worst, RO and ACCESS",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "script",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "EXEC": {
        "summary": "Execute all commands issued after MULTI",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "transactions",
        "complexity": "Depends on commands in the transaction",
        "acl_categories": [
            "@slow",
            "@transaction"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "skip_slowlog"
        ]
    },
    "EXISTS": {
        "summary": "Determine if a key exists",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(N) where N is the number of keys to check.",
        "history": [
            [
                "3.0.3",
                "Accepts multiple `key` arguments."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:agg_sum"
        ]
    },
    "EXPIRE": {
        "summary": "Set a key's time to live in seconds",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added options: `NX`, `XX`, `GT` and `LT`."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "seconds",
                "type": "integer"
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "7.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    },
                    {
                        "name": "gt",
                        "type": "pure-token",
                        "token": "GT"
                    },
                    {
                        "name": "lt",
                        "type": "pure-token",
                        "token": "LT"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "EXPIREAT": {
        "summary": "Set the expiration for a key as a UNIX timestamp",
        "since": "1.2.0",        
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added options: `NX`, `XX`, `GT` and `LT`."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "unix-time-seconds",
                "type": "unix-time"
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "7.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    },
                    {
                        "name": "gt",
                        "type": "pure-token",
                        "token": "GT"
                    },
                    {
                        "name": "lt",
                        "type": "pure-token",
                        "token": "LT"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "EXPIRETIME": {
        "summary": "Get the expiration Unix timestamp for a key",
        "since": "7.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "FAILOVER": {
        "summary": "Start a coordinated failover between this server and one of its replicas.",
        "since": "6.2.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "target",
                "type": "block",
                "token": "TO",
                "optional": true,
                "arguments": [
                    {
                        "name": "host",
                        "type": "string"
                    },
                    {
                        "name": "port",
                        "type": "integer"
                    },
                    {
                        "name": "force",
                        "type": "pure-token",
                        "token": "FORCE",
                        "optional": true
                    }
                ]
            },
            {
                "name": "abort",
                "type": "pure-token",
                "token": "ABORT",
                "optional": true
            },
            {
                "name": "milliseconds",
                "type": "integer",
                "token": "TIMEOUT",
                "optional": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "stale"
        ]
    },
    "FCALL": {
        "summary": "Invoke a function",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "Depends on the function that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "notes": "We cannot tell how the keys will be used so we assume the worst, RW and UPDATE",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "function",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "may_replicate",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "FCALL_RO": {
        "summary": "Invoke a read-only function",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "Depends on the function that is executed.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "key_specs": [
            {
                "notes": "We cannot tell how the keys will be used so we assume the worst, RO and ACCESS",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "function",
                "type": "string"
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "arg",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "stale",
            "skip_monitor",
            "no_mandatory_keys",
            "movablekeys"
        ]
    },
    "FLUSHALL": {
        "summary": "Remove all keys from all databases",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(N) where N is the total number of keys in all databases",
        "history": [
            [
                "4.0.0",
                "Added the `ASYNC` flushing mode modifier."
            ],
            [
                "6.2.0",
                "Added the `SYNC` flushing mode modifier."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "async",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "async",
                        "type": "pure-token",
                        "token": "ASYNC",
                        "since": "4.0.0"
                    },
                    {
                        "name": "sync",
                        "type": "pure-token",
                        "token": "SYNC",
                        "since": "6.2.0"
                    }
                ]
            }
        ],
        "command_flags": [
            "write"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FLUSHDB": {
        "summary": "Remove all keys from the current database",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(N) where N is the number of keys in the selected database",
        "history": [
            [
                "4.0.0",
                "Added the `ASYNC` flushing mode modifier."
            ],
            [
                "6.2.0",
                "Added the `SYNC` flushing mode modifier."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "async",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "async",
                        "type": "pure-token",
                        "token": "ASYNC",
                        "since": "4.0.0"
                    },
                    {
                        "name": "sync",
                        "type": "pure-token",
                        "token": "SYNC",
                        "since": "6.2.0"
                    }
                ]
            }
        ],
        "command_flags": [
            "write"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FUNCTION": {
        "summary": "A container for function commands",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "FUNCTION DELETE": {
        "summary": "Delete a function by name",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@slow",
            "@scripting"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "library-name",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FUNCTION DUMP": {
        "summary": "Dump all functions into a serialized binary payload",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(N) where N is the number of functions",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "noscript"
        ]
    },
    "FUNCTION FLUSH": {
        "summary": "Deleting all functions",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(N) where N is the number of functions deleted",
        "acl_categories": [
            "@write",
            "@slow",
            "@scripting"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "async",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "async",
                        "type": "pure-token",
                        "token": "ASYNC"
                    },
                    {
                        "name": "sync",
                        "type": "pure-token",
                        "token": "SYNC"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FUNCTION HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "FUNCTION KILL": {
        "summary": "Kill the function currently in execution.",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "allow_busy"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:one_succeeded"
        ]
    },
    "FUNCTION LIST": {
        "summary": "List information about all the functions",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(N) where N is the number of functions",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "library-name-pattern",
                "type": "string",
                "token": "LIBRARYNAME",
                "optional": true
            },
            {
                "name": "withcode",
                "type": "pure-token",
                "token": "WITHCODE",
                "optional": true
            }
        ],
        "command_flags": [
            "noscript"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "FUNCTION LOAD": {
        "summary": "Create a function with the given arguments (name, code, description)",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(1) (considering compilation time is redundant)",
        "acl_categories": [
            "@write",
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "replace",
                "type": "pure-token",
                "token": "REPLACE",
                "optional": true
            },
            {
                "name": "function-code",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FUNCTION RESTORE": {
        "summary": "Restore all the functions on the given payload",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(N) where N is the number of functions on the payload",
        "acl_categories": [
            "@write",
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "serialized-value",
                "type": "string"
            },
            {
                "name": "policy",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "flush",
                        "type": "pure-token",
                        "token": "FLUSH"
                    },
                    {
                        "name": "append",
                        "type": "pure-token",
                        "token": "APPEND"
                    },
                    {
                        "name": "replace",
                        "type": "pure-token",
                        "token": "REPLACE"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "FUNCTION STATS": {
        "summary": "Return information about the function currently running (name, description, duration)",
        "since": "7.0.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "allow_busy"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_shards",
            "response_policy:special"
        ]
    },
    "GEOADD": {
        "summary": "Add one or more geospatial items in the geospatial index represented using a sorted set",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(log(N)) for each item added, where N is the number of elements in the sorted set.",
        "history": [
            [
                "6.2.0",
                "Added the `CH`, `NX` and `XX` options."
            ]
        ],
        "acl_categories": [
            "@write",
            "@geo",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    }
                ]
            },
            {
                "name": "change",
                "type": "pure-token",
                "token": "CH",
                "since": "6.2.0",
                "optional": true
            },
            {
                "name": "longitude_latitude_member",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "longitude",
                        "type": "double"
                    },
                    {
                        "name": "latitude",
                        "type": "double"
                    },
                    {
                        "name": "member",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "GEODIST": {
        "summary": "Returns the distance between two members of a geospatial index",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(log(N))",
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member1",
                "type": "string"
            },
            {
                "name": "member2",
                "type": "string"
            },
            {
                "name": "unit",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "m",
                        "type": "pure-token",
                        "token": "M"
                    },
                    {
                        "name": "km",
                        "type": "pure-token",
                        "token": "KM"
                    },
                    {
                        "name": "ft",
                        "type": "pure-token",
                        "token": "FT"
                    },
                    {
                        "name": "mi",
                        "type": "pure-token",
                        "token": "MI"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "GEOHASH": {
        "summary": "Returns members of a geospatial index as standard geohash strings",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(log(N)) for each member requested, where N is the number of elements in the sorted set.",
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "GEOPOS": {
        "summary": "Returns longitude and latitude of members of a geospatial index",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(N) where N is the number of members requested.",
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "GEORADIUS": {
        "summary": "Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
        "deprecated_since": "6.2.0",
        "replaced_by": "`GEOSEARCH` and `GEOSEARCHSTORE` with the `BYRADIUS` argument",
        "history": [
            [
                "6.2.0",
                "Added the `ANY` option for `COUNT`."
            ]
        ],
        "acl_categories": [
            "@write",
            "@geo",
            "@slow"
        ],
        "arity": -6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            },
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STORE",
                        "startfrom": 6
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STOREDIST",
                        "startfrom": 6
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "longitude",
                "type": "double"
            },
            {
                "name": "latitude",
                "type": "double"
            },
            {
                "name": "radius",
                "type": "double"
            },
            {
                "name": "unit",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "m",
                        "type": "pure-token",
                        "token": "M"
                    },
                    {
                        "name": "km",
                        "type": "pure-token",
                        "token": "KM"
                    },
                    {
                        "name": "ft",
                        "type": "pure-token",
                        "token": "FT"
                    },
                    {
                        "name": "mi",
                        "type": "pure-token",
                        "token": "MI"
                    }
                ]
            },
            {
                "name": "withcoord",
                "type": "pure-token",
                "token": "WITHCOORD",
                "optional": true
            },
            {
                "name": "withdist",
                "type": "pure-token",
                "token": "WITHDIST",
                "optional": true
            },
            {
                "name": "withhash",
                "type": "pure-token",
                "token": "WITHHASH",
                "optional": true
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "since": "6.2.0",
                        "optional": true
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "token": "STORE",
                "optional": true
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 2,
                "token": "STOREDIST",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "GEORADIUSBYMEMBER": {
        "summary": "Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member",
        "since": "3.2.0",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
        "deprecated_since": "6.2.0",
        "replaced_by": "`GEOSEARCH` and `GEOSEARCHSTORE` with the `BYRADIUS` and `FROMMEMBER` arguments",
        "acl_categories": [
            "@write",
            "@geo",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            },
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STORE",
                        "startfrom": 5
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STOREDIST",
                        "startfrom": 5
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "radius",
                "type": "double"
            },
            {
                "name": "unit",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "m",
                        "type": "pure-token",
                        "token": "M"
                    },
                    {
                        "name": "km",
                        "type": "pure-token",
                        "token": "KM"
                    },
                    {
                        "name": "ft",
                        "type": "pure-token",
                        "token": "FT"
                    },
                    {
                        "name": "mi",
                        "type": "pure-token",
                        "token": "MI"
                    }
                ]
            },
            {
                "name": "withcoord",
                "type": "pure-token",
                "token": "WITHCOORD",
                "optional": true
            },
            {
                "name": "withdist",
                "type": "pure-token",
                "token": "WITHDIST",
                "optional": true
            },
            {
                "name": "withhash",
                "type": "pure-token",
                "token": "WITHHASH",
                "optional": true
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "optional": true
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "token": "STORE",
                "optional": true
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 2,
                "token": "STOREDIST",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "GEORADIUSBYMEMBER_RO": {
        "summary": "A read-only variant for GEORADIUSBYMEMBER",
        "since": "3.2.10",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
        "deprecated_since": "6.2.0",
        "replaced_by": "`GEOSEARCH` with the `BYRADIUS` and `FROMMEMBER` arguments",
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "radius",
                "type": "double"
            },
            {
                "name": "unit",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "m",
                        "type": "pure-token",
                        "token": "M"
                    },
                    {
                        "name": "km",
                        "type": "pure-token",
                        "token": "KM"
                    },
                    {
                        "name": "ft",
                        "type": "pure-token",
                        "token": "FT"
                    },
                    {
                        "name": "mi",
                        "type": "pure-token",
                        "token": "MI"
                    }
                ]
            },
            {
                "name": "withcoord",
                "type": "pure-token",
                "token": "WITHCOORD",
                "optional": true
            },
            {
                "name": "withdist",
                "type": "pure-token",
                "token": "WITHDIST",
                "optional": true
            },
            {
                "name": "withhash",
                "type": "pure-token",
                "token": "WITHHASH",
                "optional": true
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "optional": true
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "GEORADIUS_RO": {
        "summary": "A read-only variant for GEORADIUS",
        "since": "3.2.10",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements inside the bounding box of the circular area delimited by center and radius and M is the number of items inside the index.",
        "deprecated_since": "6.2.0",
        "replaced_by": "`GEOSEARCH` with the `BYRADIUS` argument",
        "history": [
            [
                "6.2.0",
                "Added the `ANY` option for `COUNT`."
            ]
        ],
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "longitude",
                "type": "double"
            },
            {
                "name": "latitude",
                "type": "double"
            },
            {
                "name": "radius",
                "type": "double"
            },
            {
                "name": "unit",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "m",
                        "type": "pure-token",
                        "token": "M"
                    },
                    {
                        "name": "km",
                        "type": "pure-token",
                        "token": "KM"
                    },
                    {
                        "name": "ft",
                        "type": "pure-token",
                        "token": "FT"
                    },
                    {
                        "name": "mi",
                        "type": "pure-token",
                        "token": "MI"
                    }
                ]
            },
            {
                "name": "withcoord",
                "type": "pure-token",
                "token": "WITHCOORD",
                "optional": true
            },
            {
                "name": "withdist",
                "type": "pure-token",
                "token": "WITHDIST",
                "optional": true
            },
            {
                "name": "withhash",
                "type": "pure-token",
                "token": "WITHHASH",
                "optional": true
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "since": "6.2.0",
                        "optional": true
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "GEOSEARCH": {
        "summary": "Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle.",
        "since": "6.2.0",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape",
        "acl_categories": [
            "@read",
            "@geo",
            "@slow"
        ],
        "arity": -7,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "token": "FROMMEMBER",
                "optional": true
            },
            {
                "name": "longitude_latitude",
                "type": "block",
                "token": "FROMLONLAT",
                "optional": true,
                "arguments": [
                    {
                        "name": "longitude",
                        "type": "double"
                    },
                    {
                        "name": "latitude",
                        "type": "double"
                    }
                ]
            },
            {
                "name": "circle",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "radius",
                        "type": "double",
                        "token": "BYRADIUS"
                    },
                    {
                        "name": "unit",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "m",
                                "type": "pure-token",
                                "token": "M"
                            },
                            {
                                "name": "km",
                                "type": "pure-token",
                                "token": "KM"
                            },
                            {
                                "name": "ft",
                                "type": "pure-token",
                                "token": "FT"
                            },
                            {
                                "name": "mi",
                                "type": "pure-token",
                                "token": "MI"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "box",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "width",
                        "type": "double",
                        "token": "BYBOX"
                    },
                    {
                        "name": "height",
                        "type": "double"
                    },
                    {
                        "name": "unit",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "m",
                                "type": "pure-token",
                                "token": "M"
                            },
                            {
                                "name": "km",
                                "type": "pure-token",
                                "token": "KM"
                            },
                            {
                                "name": "ft",
                                "type": "pure-token",
                                "token": "FT"
                            },
                            {
                                "name": "mi",
                                "type": "pure-token",
                                "token": "MI"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "optional": true
                    }
                ]
            },
            {
                "name": "withcoord",
                "type": "pure-token",
                "token": "WITHCOORD",
                "optional": true
            },
            {
                "name": "withdist",
                "type": "pure-token",
                "token": "WITHDIST",
                "optional": true
            },
            {
                "name": "withhash",
                "type": "pure-token",
                "token": "WITHHASH",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "GEOSEARCHSTORE": {
        "summary": "Query a sorted set representing a geospatial index to fetch members inside an area of a box or a circle, and store the result in another key.",
        "since": "6.2.0",
        "group": "geo",
        "complexity": "O(N+log(M)) where N is the number of elements in the grid-aligned bounding box area around the shape provided as the filter and M is the number of items inside the shape",
        "acl_categories": [
            "@write",
            "@geo",
            "@slow"
        ],
        "arity": -8,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "member",
                "type": "string",
                "token": "FROMMEMBER",
                "optional": true
            },
            {
                "name": "longitude_latitude",
                "type": "block",
                "token": "FROMLONLAT",
                "optional": true,
                "arguments": [
                    {
                        "name": "longitude",
                        "type": "double"
                    },
                    {
                        "name": "latitude",
                        "type": "double"
                    }
                ]
            },
            {
                "name": "circle",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "radius",
                        "type": "double",
                        "token": "BYRADIUS"
                    },
                    {
                        "name": "unit",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "m",
                                "type": "pure-token",
                                "token": "M"
                            },
                            {
                                "name": "km",
                                "type": "pure-token",
                                "token": "KM"
                            },
                            {
                                "name": "ft",
                                "type": "pure-token",
                                "token": "FT"
                            },
                            {
                                "name": "mi",
                                "type": "pure-token",
                                "token": "MI"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "box",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "width",
                        "type": "double",
                        "token": "BYBOX"
                    },
                    {
                        "name": "height",
                        "type": "double"
                    },
                    {
                        "name": "unit",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "m",
                                "type": "pure-token",
                                "token": "M"
                            },
                            {
                                "name": "km",
                                "type": "pure-token",
                                "token": "KM"
                            },
                            {
                                "name": "ft",
                                "type": "pure-token",
                                "token": "FT"
                            },
                            {
                                "name": "mi",
                                "type": "pure-token",
                                "token": "MI"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "count",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT"
                    },
                    {
                        "name": "any",
                        "type": "pure-token",
                        "token": "ANY",
                        "optional": true
                    }
                ]
            },
            {
                "name": "storedist",
                "type": "pure-token",
                "token": "STOREDIST",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "GET": {
        "summary": "Get the value of a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@string",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "GETBIT": {
        "summary": "Returns the bit value at offset in the string value stored at key",
        "since": "2.2.0",
        "group": "bitmap",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@bitmap",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "offset",
                "type": "integer"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "GETDEL": {
        "summary": "Get the value of a key and delete the key",
        "since": "6.2.0",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "GETEX": {
        "summary": "Get the value of a key and optionally set its expiration",
        "since": "6.2.0",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "notes": "RW and UPDATE because it changes the TTL",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "expiration",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "seconds",
                        "type": "integer",
                        "token": "EX"
                    },
                    {
                        "name": "milliseconds",
                        "type": "integer",
                        "token": "PX"
                    },
                    {
                        "name": "unix-time-seconds",
                        "type": "unix-time",
                        "token": "EXAT"
                    },
                    {
                        "name": "unix-time-milliseconds",
                        "type": "unix-time",
                        "token": "PXAT"
                    },
                    {
                        "name": "persist",
                        "type": "pure-token",
                        "token": "PERSIST"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "GETRANGE": {
        "summary": "Get a substring of the string stored at a key",
        "since": "2.4.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.",
        "acl_categories": [
            "@read",
            "@string",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "end",
                "type": "integer"
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "GETSET": {
        "summary": "Set the string value of a key and return its old value",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "deprecated_since": "6.2.0",
        "replaced_by": "`SET` with the `!GET` argument",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "HDEL": {
        "summary": "Delete one or more hash fields",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the number of fields to be removed.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple `field` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "HELLO": {
        "summary": "Handshake with Redis",
        "since": "6.0.0",
        "group": "connection",
        "complexity": "O(1)",
        "history": [
            [
                "6.2.0",
                "`protover` made optional; when called without arguments the command reports the current connection's context."
            ]
        ],
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "arguments",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "protover",
                        "type": "integer"
                    },
                    {
                        "name": "username_password",
                        "type": "block",
                        "token": "AUTH",
                        "optional": true,
                        "arguments": [
                            {
                                "name": "username",
                                "type": "string"
                            },
                            {
                                "name": "password",
                                "type": "string"
                            }
                        ]
                    },
                    {
                        "name": "clientname",
                        "type": "string",
                        "token": "SETNAME",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "no_auth",
            "allow_busy"
        ]
    },
    "HEXISTS": {
        "summary": "Determine if a hash field exists",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@hash",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "HGET": {
        "summary": "Get the value of a hash field",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@hash",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "HGETALL": {
        "summary": "Get all the fields and values in a hash",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the size of the hash.",
        "acl_categories": [
            "@read",
            "@hash",
            "@slow"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "HINCRBY": {
        "summary": "Increment the integer value of a hash field by the given number",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            },
            {
                "name": "increment",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "HINCRBYFLOAT": {
        "summary": "Increment the float value of a hash field by the given amount",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            },
            {
                "name": "increment",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "HKEYS": {
        "summary": "Get all the fields in a hash",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the size of the hash.",
        "acl_categories": [
            "@read",
            "@hash",
            "@slow"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "HLEN": {
        "summary": "Get the number of fields in a hash",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",        
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@hash",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "HMGET": {
        "summary": "Get the values of all the given hash fields",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the number of fields being requested.",
        "acl_categories": [
            "@read",
            "@hash",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "HMSET": {
        "summary": "Set multiple hash fields to multiple values",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the number of fields being set.",
        "deprecated_since": "4.0.0",
        "replaced_by": "`HSET` with multiple field-value pairs",
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "field",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "HRANDFIELD": {
        "summary": "Get one or multiple random fields from a hash",
        "since": "6.2.0",
        "group": "hash",
        "complexity": "O(N) where N is the number of fields returned",
        "acl_categories": [
            "@read",
            "@hash",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "options",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer"
                    },
                    {
                        "name": "withvalues",
                        "type": "pure-token",
                        "token": "WITHVALUES",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "HSCAN": {
        "summary": "Incrementally iterate hash fields and associated values",
        "since": "2.8.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
        "acl_categories": [
            "@read",
            "@hash",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "cursor",
                "type": "integer"
            },
            {
                "name": "pattern",
                "type": "pattern",
                "token": "MATCH",
                "optional": true
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "HSET": {
        "summary": "Set the string value of a hash field",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1) for each field/value pair added, so O(N) to add N field/value pairs when the command is called with multiple field/value pairs.",
        "history": [
            [
                "4.0.0",
                "Accepts multiple `field` and `value` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "field",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "HSETNX": {
        "summary": "Set the value of a hash field, only if the field does not exist",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@hash",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "HSTRLEN": {
        "summary": "Get the length of the value of a hash field",
        "since": "3.2.0",
        "group": "hash",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@hash",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "field",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "HVALS": {
        "summary": "Get all the values in a hash",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "hash",
        "complexity": "O(N) where N is the size of the hash.",
        "acl_categories": [
            "@read",
            "@hash",
            "@slow"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "INCR": {
        "summary": "Increment the integer value of a key by one",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "INCRBY": {
        "summary": "Increment the integer value of a key by the given amount",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "increment",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "INCRBYFLOAT": {
        "summary": "Increment the float value of a key by the given amount",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "increment",
                "type": "double"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "INFO": {
        "summary": "Get information and statistics about the server",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added support for taking multiple section arguments."
            ]
        ],
        "acl_categories": [
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "section",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_shards",
            "response_policy:special"
        ]
    },
    "KEYS": {
        "summary": "Find all keys matching the given pattern",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(N) with N being the number of keys in the database, under the assumption that the key names in the database and the given pattern have limited length.",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "arguments": [
            {
                "name": "pattern",
                "type": "pattern"
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "request_policy:all_shards",
            "nondeterministic_output_order"
        ]
    },
    "LASTSAVE": {
        "summary": "Get the UNIX time stamp of the last successful save to disk",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@fast",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "loading",
            "stale",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "LATENCY": {
        "summary": "A container for latency diagnostics commands",
        "since": "2.8.13",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "LATENCY DOCTOR": {
        "summary": "Return a human readable latency analysis report.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_nodes",
            "response_policy:special"
        ]
    },
    "LATENCY GRAPH": {
        "summary": "Return a latency graph for the event.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "event",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_nodes",
            "response_policy:special"
        ]
    },
    "LATENCY HELP": {
        "summary": "Show helpful text about the different subcommands.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "LATENCY HISTOGRAM": {
        "summary": "Return the cumulative distribution of latencies of a subset of commands or all.",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(N) where N is the number of commands with latency information being retrieved.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "command",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_nodes",
            "response_policy:special"
        ]
    },
    "LATENCY HISTORY": {
        "summary": "Return timestamp-latency samples for the event.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "event",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_nodes",
            "response_policy:special"
        ]
    },
    "LATENCY LATEST": {
        "summary": "Return the latest latency samples for all events.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:all_nodes",
            "response_policy:special"
        ]
    },
    "LATENCY RESET": {
        "summary": "Reset latency data for one or more events.",
        "since": "2.8.13",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "event",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:all_succeeded"
        ]
    },
    "LCS": {
        "summary": "Find longest common substring",
        "since": "7.0.0",
        "group": "string",
        "complexity": "O(N*M) where N and M are the lengths of s1 and s2, respectively",
        "acl_categories": [
            "@read",
            "@string",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key1",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "key2",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "len",
                "type": "pure-token",
                "token": "LEN",
                "optional": true
            },
            {
                "name": "idx",
                "type": "pure-token",
                "token": "IDX",
                "optional": true
            },
            {
                "name": "len",
                "type": "integer",
                "token": "MINMATCHLEN",
                "optional": true
            },
            {
                "name": "withmatchlen",
                "type": "pure-token",
                "token": "WITHMATCHLEN",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "LINDEX": {
        "summary": "Get an element from a list by its index",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of elements to traverse to get to the element at index. This makes asking for the first or the last element of the list O(1).",
        "acl_categories": [
            "@read",
            "@list",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "index",
                "type": "integer"
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "LINSERT": {
        "summary": "Insert an element before or after another element in a list",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of elements to traverse before seeing the value pivot. This means that inserting somewhere on the left end on the list (head) can be considered O(1) and inserting somewhere on the right end (tail) is O(N).",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "where",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "before",
                        "type": "pure-token",
                        "token": "BEFORE"
                    },
                    {
                        "name": "after",
                        "type": "pure-token",
                        "token": "AFTER"
                    }
                ]
            },
            {
                "name": "pivot",
                "type": "string"
            },
            {
                "name": "element",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "LLEN": {
        "summary": "Get the length of a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@list",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "LMOVE": {
        "summary": "Pop an element from a list, push it to another list and return it",
        "since": "6.2.0",
        "group": "list",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "wherefrom",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            },
            {
                "name": "whereto",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "LMPOP": {
        "summary": "Pop elements from a list",
        "since": "7.0.0",
        "group": "list",
        "complexity": "O(N+M) where N is the number of provided keys and M is the number of elements returned.",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "where",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "left",
                        "type": "pure-token",
                        "token": "LEFT"
                    },
                    {
                        "name": "right",
                        "type": "pure-token",
                        "token": "RIGHT"
                    }
                ]
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "movablekeys"
        ]
    },
    "LOLWUT": {
        "summary": "Display some computer art and the Redis version",
        "since": "5.0.0",
        "group": "server",
        "acl_categories": [
            "@read",
            "@fast"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "version",
                "type": "integer",
                "token": "VERSION",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "LPOP": {
        "summary": "Remove and get the first elements in a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of elements returned",
        "history": [
            [
                "6.2.0",
                "Added the `count` argument."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "since": "6.2.0",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "LPOS": {
        "summary": "Return the index of matching elements on a list",
        "since": "6.0.6",
        "group": "list",
        "complexity": "O(N) where N is the number of elements in the list, for the average case. When searching for elements near the head or the tail of the list, or when the MAXLEN option is provided, the command may run in constant time.",
        "acl_categories": [
            "@read",
            "@list",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string"
            },
            {
                "name": "rank",
                "type": "integer",
                "token": "RANK",
                "optional": true
            },
            {
                "name": "num-matches",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            },
            {
                "name": "len",
                "type": "integer",
                "token": "MAXLEN",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "LPUSH": {
        "summary": "Prepend one or multiple elements to a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple `element` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "LPUSHX": {
        "summary": "Prepend an element to a list, only if the list exists",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.",
        "history": [
            [
                "4.0.0",
                "Accepts multiple `element` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "LRANGE": {
        "summary": "Get a range of elements from a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(S+N) where S is the distance of start offset from HEAD for small lists, from nearest end (HEAD or TAIL) for large lists; and N is the number of elements in the specified range.",
        "acl_categories": [
            "@read",
            "@list",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "stop",
                "type": "integer"
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "LREM": {
        "summary": "Remove elements from a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N+M) where N is the length of the list and M is the number of elements removed.",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer"
            },
            {
                "name": "element",
                "type": "string"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "LSET": {
        "summary": "Set the value of an element in a list by its index",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the length of the list. Setting either the first or the last element of the list is O(1).",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "index",
                "type": "integer"
            },
            {
                "name": "element",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "LTRIM": {
        "summary": "Trim a list to the specified range",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of elements to be removed by the operation.",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "stop",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "MEMORY": {
        "summary": "A container for memory diagnostics commands",
        "since": "4.0.0",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "MEMORY DOCTOR": {
        "summary": "Outputs memory problems report",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "hints": [
            "nondeterministic_output",
            "request_policy:all_shards",
            "response_policy:special"
        ]
    },
    "MEMORY HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "MEMORY MALLOC-STATS": {
        "summary": "Show allocator internal stats",
        "since": "4.0.0",
        "group": "server",
        "complexity": "Depends on how much memory is allocated, could be slow",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "hints": [
            "nondeterministic_output",
            "request_policy:all_shards",
            "response_policy:special"
        ]
    },
    "MEMORY PURGE": {
        "summary": "Ask the allocator to release memory",
        "since": "4.0.0",
        "group": "server",
        "complexity": "Depends on how much memory is allocated, could be slow",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "MEMORY STATS": {
        "summary": "Show memory usage details",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "hints": [
            "nondeterministic_output",
            "request_policy:all_shards",
            "response_policy:special"
        ]
    },
    "MEMORY USAGE": {
        "summary": "Estimate the memory usage of a key",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(N) where N is the number of samples.",
        "acl_categories": [
            "@read",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "token": "SAMPLES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "MGET": {
        "summary": "Get the values of all the given keys",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(N) where N is the number of keys to retrieve.",
        "acl_categories": [
            "@read",
            "@string",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "request_policy:multi_shard"
        ]
    },
    "MIGRATE": {
        "summary": "Atomically transfer a key from a Redis instance to another one.",
        "since": "2.6.0",
        "group": "generic",
        "complexity": "This command actually executes a DUMP+DEL in the source instance, and a RESTORE in the target instance. See the pages of these commands for time complexity. Also an O(N) data transfer between the two instances is performed.",
        "history": [
            [
                "3.0.0",
                "Added the `COPY` and `REPLACE` options."
            ],
            [
                "3.0.6",
                "Added the `KEYS` option."
            ],
            [
                "4.0.7",
                "Added the `AUTH` option."
            ],
            [
                "6.0.0",
                "Added the `AUTH2` option."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow",
            "@dangerous"
        ],
        "arity": -6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 3
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "KEYS",
                        "startfrom": -2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true,
                "incomplete": true
            }
        ],
        "arguments": [
            {
                "name": "host",
                "type": "string"
            },
            {
                "name": "port",
                "type": "integer"
            },
            {
                "name": "key_or_empty_string",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "key",
                        "type": "key",
                        "key_spec_index": 0
                    },
                    {
                        "name": "empty_string",
                        "type": "pure-token",
                        "token": ""
                    }
                ]
            },
            {
                "name": "destination-db",
                "type": "integer"
            },
            {
                "name": "timeout",
                "type": "integer"
            },
            {
                "name": "copy",
                "type": "pure-token",
                "token": "COPY",
                "since": "3.0.0",
                "optional": true
            },
            {
                "name": "replace",
                "type": "pure-token",
                "token": "REPLACE",
                "since": "3.0.0",
                "optional": true
            },
            {
                "name": "password",
                "type": "string",
                "token": "AUTH",
                "since": "4.0.7",
                "optional": true
            },
            {
                "name": "username_password",
                "type": "block",
                "token": "AUTH2",
                "since": "6.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "name": "password",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "token": "KEYS",
                "since": "3.0.6",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "movablekeys"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "MODULE": {
        "summary": "A container for module commands",
        "since": "4.0.0",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "MODULE HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "MODULE LIST": {
        "summary": "List all modules loaded by the server",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(N) where N is the number of loaded modules.",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "noscript"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "MODULE LOAD": {
        "summary": "Load a module",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "path",
                "type": "string"
            },
            {
                "name": "arg",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading"
        ]
    },
    "MODULE LOADEX": {
        "summary": "Load a module with extended parameters",
        "since": "7.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "path",
                "type": "string"
            },
            {
                "name": "configs",
                "type": "block",
                "token": "CONFIG",
                "optional": true,
                "multiple": true,
                "arguments": [
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "args",
                "type": "block",
                "token": "ARGS",
                "optional": true,
                "multiple": true,
                "arguments": [
                    {
                        "name": "arg",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading"
        ]
    },
    "MODULE UNLOAD": {
        "summary": "Unload a module",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "name",
                "type": "string"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading"
        ]
    },
    "MONITOR": {
        "summary": "Listen for all requests received by the server in real time",
        "since": "1.0.0",
        "group": "server",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "MOVE": {
        "summary": "Move a key to another database",
        "since": "1.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "db",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "MSET": {
        "summary": "Set multiple keys to multiple values",
        "since": "1.0.1",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(N) where N is the number of keys to set.",
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 2,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "key",
                        "type": "key",
                        "key_spec_index": 0
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:all_succeeded"
        ]
    },
    "MSETNX": {
        "summary": "Set multiple keys to multiple values, only if none of the keys exist",
        "since": "1.0.1",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(N) where N is the number of keys to set.",
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 2,
                        "limit": 0
                    }
                },
                "OW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "key",
                        "type": "key",
                        "key_spec_index": 0
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:agg_min"
        ]
    },
    "MULTI": {
        "summary": "Mark the start of a transaction block",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "transactions",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@transaction"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "allow_busy"
        ]
    },
    "OBJECT": {
        "summary": "A container for object introspection commands",
        "since": "2.2.3",
        "group": "generic",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "OBJECT ENCODING": {
        "summary": "Inspect the internal encoding of a Redis object",
        "since": "2.2.3",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "OBJECT FREQ": {
        "summary": "Get the logarithmic access frequency counter of a Redis object",
        "since": "4.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "OBJECT HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "6.2.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "OBJECT IDLETIME": {
        "summary": "Get the time since a Redis object was last accessed",
        "since": "2.2.3",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "OBJECT REFCOUNT": {
        "summary": "Get the number of references to the value of the key",
        "since": "2.2.3",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "PERSIST": {
        "summary": "Remove the expiration from a key",
        "since": "2.2.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "PEXPIRE": {
        "summary": "Set a key's time to live in milliseconds",
        "since": "2.6.0",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added options: `NX`, `XX`, `GT` and `LT`."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "milliseconds",
                "type": "integer"
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "7.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    },
                    {
                        "name": "gt",
                        "type": "pure-token",
                        "token": "GT"
                    },
                    {
                        "name": "lt",
                        "type": "pure-token",
                        "token": "LT"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "PEXPIREAT": {
        "summary": "Set the expiration for a key as a UNIX timestamp specified in milliseconds",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added options: `NX`, `XX`, `GT` and `LT`."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "unix-time-milliseconds",
                "type": "unix-time"
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "7.0.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    },
                    {
                        "name": "gt",
                        "type": "pure-token",
                        "token": "GT"
                    },
                    {
                        "name": "lt",
                        "type": "pure-token",
                        "token": "LT"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "PEXPIRETIME": {
        "summary": "Get the expiration Unix timestamp for a key in milliseconds",
        "since": "7.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "PFADD": {
        "summary": "Adds the specified elements to the specified HyperLogLog.",
        "since": "2.8.9",
        "group": "hyperloglog",
        "complexity": "O(1) to add every element.",
        "acl_categories": [
            "@write",
            "@hyperloglog",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "PFCOUNT": {
        "summary": "Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).",
        "since": "2.8.9",
        "group": "hyperloglog",
        "complexity": "O(1) with a very small average constant time when called with a single key. O(N) with N being the number of keys, and much bigger constant times, when called with multiple keys.",
        "acl_categories": [
            "@read",
            "@hyperloglog",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "notes": "RW because it may change the internal representation of the key, and propagate to replicas",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "may_replicate"
        ]
    },
    "PFDEBUG": {
        "summary": "Internal commands for debugging HyperLogLog values",
        "since": "2.8.9",
        "group": "hyperloglog",
        "complexity": "N/A",
        "acl_categories": [
            "@write",
            "@hyperloglog",
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "admin"
        ],
        "doc_flags": [
            "syscmd"
        ]
    },
    "PFMERGE": {
        "summary": "Merge N different HyperLogLogs into a single one.",
        "since": "2.8.9",
        "group": "hyperloglog",
        "complexity": "O(N) to merge N HyperLogLogs, but with high constant times.",
        "acl_categories": [
            "@write",
            "@hyperloglog",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "insert": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destkey",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "sourcekey",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "PFSELFTEST": {
        "summary": "An internal command for testing HyperLogLog values",
        "since": "2.8.9",
        "group": "hyperloglog",
        "complexity": "N/A",
        "acl_categories": [
            "@hyperloglog",
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "admin"
        ],
        "doc_flags": [
            "syscmd"
        ]
    },
    "PING": {
        "summary": "Ping the server",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "message",
                "type": "string",
                "optional": true
            }
        ],
        "command_flags": [
            "fast"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:all_succeeded"
        ]
    },
    "PSETEX": {
        "summary": "Set the value and expiration in milliseconds of a key",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "milliseconds",
                "type": "integer"
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "PSUBSCRIBE": {
        "summary": "Listen for messages published to channels matching the given patterns",
        "since": "2.0.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of patterns the client is already subscribed to.",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "pattern",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "pattern",
                        "type": "pattern"
                    }
                ]
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "PSYNC": {
        "summary": "Internal command used for replication",
        "since": "2.8.0",
        "group": "server",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "replicationid",
                "type": "string"
            },
            {
                "name": "offset",
                "type": "integer"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading",
            "no_multi"
        ]
    },
    "PTTL": {
        "summary": "Get the time to live for a key in milliseconds",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "2.8.0",
                "Added the -2 reply."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "PUBLISH": {
        "summary": "Post a message to a channel",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "pubsub",
        "complexity": "O(N+M) where N is the number of clients subscribed to the receiving channel and M is the total number of subscribed patterns (by any client).",
        "acl_categories": [
            "@pubsub",
            "@fast"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "channel",
                "type": "string"
            },
            {
                "name": "message",
                "type": "string"
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale",
            "fast",
            "may_replicate"
        ]
    },
    "PUBSUB": {
        "summary": "A container for Pub/Sub commands",
        "since": "2.8.0",
        "group": "pubsub",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "PUBSUB CHANNELS": {
        "summary": "List active channels",
        "since": "2.8.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of active channels, and assuming constant time pattern matching (relatively short channels and patterns)",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "pattern",
                "type": "pattern",
                "optional": true
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale"
        ]
    },
    "PUBSUB HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "6.2.0",
        "group": "pubsub",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "PUBSUB NUMPAT": {
        "summary": "Get the count of unique patterns pattern subscriptions",
        "since": "2.8.0",
        "group": "pubsub",
        "complexity": "O(1)",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "pubsub",
            "loading",
            "stale"
        ]
    },
    "PUBSUB NUMSUB": {
        "summary": "Get the count of subscribers for channels",
        "since": "2.8.0",
        "group": "pubsub",
        "complexity": "O(N) for the NUMSUB subcommand, where N is the number of requested channels",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale"
        ]
    },
    "PUBSUB SHARDCHANNELS": {
        "summary": "List active shard channels",
        "since": "7.0.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of active shard channels, and assuming constant time pattern matching (relatively short channels).",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "pattern",
                "type": "pattern",
                "optional": true
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale"
        ]
    },
    "PUBSUB SHARDNUMSUB": {
        "summary": "Get the count of subscribers for shard channels",
        "since": "7.0.0",
        "group": "pubsub",
        "complexity": "O(N) for the SHARDNUMSUB subcommand, where N is the number of requested channels",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale"
        ]
    },
    "PUNSUBSCRIBE": {
        "summary": "Stop listening for messages posted to channels matching the given patterns",
        "since": "2.0.0",
        "group": "pubsub",
        "complexity": "O(N+M) where N is the number of patterns the client is already subscribed and M is the number of total patterns subscribed in the system (by any client).",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "pattern",
                "type": "pattern",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "QUIT": {
        "summary": "Close the connection",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": -1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "no_auth",
            "allow_busy"
        ]
    },
    "RANDOMKEY": {
        "summary": "Return a random key from the keyspace",
        "since": "1.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": 1,
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "request_policy:all_shards",
            "nondeterministic_output"
        ]
    },
    "READONLY": {
        "summary": "Enables read queries for a connection to a cluster replica node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 1,
        "command_flags": [
            "loading",
            "stale",
            "fast"
        ]
    },
    "READWRITE": {
        "summary": "Disables read queries for a connection to a cluster replica node",
        "since": "3.0.0",
        "group": "cluster",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 1,
        "command_flags": [
            "loading",
            "stale",
            "fast"
        ]
    },
    "RENAME": {
        "summary": "Rename a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "newkey",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "RENAMENX": {
        "summary": "Rename a key, only if the new key does not exist",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "3.2.0",
                "The command no longer returns an error when source and destination names are the same."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "newkey",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "REPLCONF": {
        "summary": "An internal command for configuring the replication stream",
        "since": "3.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale",
            "allow_busy"
        ],
        "doc_flags": [
            "syscmd"
        ]
    },
    "REPLICAOF": {
        "summary": "Make the server a replica of another instance, or promote it as master.",
        "since": "5.0.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "host",
                "type": "string"
            },
            {
                "name": "port",
                "type": "integer"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "stale",
            "no_async_loading"
        ]
    },
    "RESET": {
        "summary": "Reset the connection",
        "since": "6.2.0",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "no_auth",
            "allow_busy"
        ]
    },
    "RESTORE": {
        "summary": "Create a key using the provided serialized value, previously obtained using DUMP.",
        "since": "2.6.0",
        "group": "generic",
        "complexity": "O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).",
        "history": [
            [
                "3.0.0",
                "Added the `REPLACE` modifier."
            ],
            [
                "5.0.0",
                "Added the `ABSTTL` modifier."
            ],
            [
                "5.0.0",
                "Added the `IDLETIME` and `FREQ` options."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "ttl",
                "type": "integer"
            },
            {
                "name": "serialized-value",
                "type": "string"
            },
            {
                "name": "replace",
                "type": "pure-token",
                "token": "REPLACE",
                "since": "3.0.0",
                "optional": true
            },
            {
                "name": "absttl",
                "type": "pure-token",
                "token": "ABSTTL",
                "since": "5.0.0",
                "optional": true
            },
            {
                "name": "seconds",
                "type": "integer",
                "token": "IDLETIME",
                "since": "5.0.0",
                "optional": true
            },
            {
                "name": "frequency",
                "type": "integer",
                "token": "FREQ",
                "since": "5.0.0",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "RESTORE-ASKING": {
        "summary": "An internal command for migrating keys in a cluster",
        "since": "3.0.0",
        "group": "server",
        "complexity": "O(1) to create the new key and additional O(N*M) to reconstruct the serialized value, where N is the number of Redis objects composing the value and M their average size. For small string values the time complexity is thus O(1)+O(1*M) where M is small, so simply O(1). However for sorted set values the complexity is O(N*M*log(N)) because inserting values into sorted sets is O(log(N)).",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@slow",
            "@dangerous"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "asking"
        ],
        "doc_flags": [
            "syscmd"
        ]
    },
    "ROLE": {
        "summary": "Return the role of the instance in the context of replication",
        "since": "2.8.12",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@fast",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast"
        ]
    },
    "RPOP": {
        "summary": "Remove and get the last elements in a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(N) where N is the number of elements returned",
        "history": [
            [
                "6.2.0",
                "Added the `count` argument."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "since": "6.2.0",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "RPOPLPUSH": {
        "summary": "Remove the last element in a list, prepend it to another list and return it",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1)",
        "deprecated_since": "6.2.0",
        "replaced_by": "`LMOVE` with the `RIGHT` and `LEFT` arguments",
        "acl_categories": [
            "@write",
            "@list",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "RPUSH": {
        "summary": "Append one or multiple elements to a list",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple `element` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "RPUSHX": {
        "summary": "Append an element to a list, only if the list exists",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "list",
        "complexity": "O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.",
        "history": [
            [
                "4.0.0",
                "Accepts multiple `element` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@list",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "element",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "SADD": {
        "summary": "Add one or more members to a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(1) for each element added, so O(N) to add N elements when the command is called with multiple arguments.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple `member` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@set",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "SAVE": {
        "summary": "Synchronously save the dataset to disk",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(N) where N is the total number of keys in all databases",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading",
            "no_multi"
        ]
    },
    "SCAN": {
        "summary": "Incrementally iterate the keys space",
        "since": "2.8.0",
        "group": "generic",
        "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection.",
        "history": [
            [
                "6.0.0",
                "Added the `TYPE` subcommand."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@read",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "cursor",
                "type": "integer"
            },
            {
                "name": "pattern",
                "type": "pattern",
                "token": "MATCH",
                "optional": true
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            },
            {
                "name": "type",
                "type": "string",
                "token": "TYPE",
                "since": "6.0.0",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output",
            "request_policy:special"
        ]
    },
    "SCARD": {
        "summary": "Get the number of members in a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@set",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "SCRIPT": {
        "summary": "A container for Lua scripts management commands",
        "since": "2.6.0",
        "group": "scripting",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "SCRIPT DEBUG": {
        "summary": "Set the debug mode for executed scripts.",
        "since": "3.2.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "mode",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "yes",
                        "type": "pure-token",
                        "token": "YES"
                    },
                    {
                        "name": "sync",
                        "type": "pure-token",
                        "token": "SYNC"
                    },
                    {
                        "name": "no",
                        "type": "pure-token",
                        "token": "NO"
                    }
                ]
            }
        ],
        "command_flags": [
            "noscript"
        ]
    },
    "SCRIPT EXISTS": {
        "summary": "Check existence of scripts in the script cache.",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "scripting",
        "complexity": "O(N) with N being the number of scripts to check (so checking a single script is an O(1) operation).",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -3,
        "arguments": [
            {
                "name": "sha1",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:agg_logical_and"
        ]
    },
    "SCRIPT FLUSH": {
        "summary": "Remove all the scripts from the script cache.",
        "since": "2.6.0",
        "group": "scripting",
        "complexity": "O(N) with N being the number of scripts in cache",
        "history": [
            [
                "6.2.0",
                "Added the `ASYNC` and `SYNC` flushing mode modifiers."
            ]
        ],
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "async",
                "type": "oneof",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "async",
                        "type": "pure-token",
                        "token": "ASYNC"
                    },
                    {
                        "name": "sync",
                        "type": "pure-token",
                        "token": "SYNC"
                    }
                ]
            }
        ],
        "command_flags": [
            "noscript"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:all_succeeded"
        ]
    },
    "SCRIPT HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "SCRIPT KILL": {
        "summary": "Kill the script currently in execution.",
        "since": "2.6.0",
        "group": "scripting",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 2,
        "command_flags": [
            "noscript",
            "allow_busy"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:one_succeeded"
        ]
    },
    "SCRIPT LOAD": {
        "summary": "Load the specified Lua script into the script cache.",
        "since": "2.6.0",
        "dragonfly_since" : "0.1",
        "group": "scripting",
        "complexity": "O(N) with N being the length in bytes of the script body.",
        "acl_categories": [
            "@slow",
            "@scripting"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "script",
                "type": "string"
            }
        ],
        "command_flags": [
            "noscript",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:all_succeeded"
        ]
    },
    "SDIFF": {
        "summary": "Subtract multiple sets",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the total number of elements in all given sets.",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "SDIFFSTORE": {
        "summary": "Subtract multiple sets and store the resulting set in a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the total number of elements in all given sets.",
        "acl_categories": [
            "@write",
            "@set",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SELECT": {
        "summary": "Change the selected database for the current connection",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "connection",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@connection"
        ],
        "arity": 2,
        "arguments": [
            {
                "name": "index",
                "type": "integer"
            }
        ],
        "command_flags": [
            "loading",
            "stale",
            "fast"
        ]
    },
    "SET": {
        "summary": "Set the string value of a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "history": [
            [
                "2.6.12",
                "Added the `EX`, `PX`, `NX` and `XX` options."
            ],
            [
                "6.0.0",
                "Added the `KEEPTTL` option."
            ],
            [
                "6.2.0",
                "Added the `GET`, `EXAT` and `PXAT` option."
            ],
            [
                "7.0.0",
                "Allowed the `NX` and `GET` options to be used together."
            ]
        ],
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "notes": "RW and ACCESS due to the optional `GET` argument",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true,
                "variable_flags": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "value",
                "type": "string"
            },
            {
                "name": "expiration",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "seconds",
                        "type": "integer",
                        "token": "EX",
                        "since": "2.6.12"
                    },
                    {
                        "name": "milliseconds",
                        "type": "integer",
                        "token": "PX",
                        "since": "2.6.12"
                    },
                    {
                        "name": "unix-time-seconds",
                        "type": "unix-time",
                        "token": "EXAT",
                        "since": "6.2.0"
                    },
                    {
                        "name": "unix-time-milliseconds",
                        "type": "unix-time",
                        "token": "PXAT",
                        "since": "6.2.0"
                    },
                    {
                        "name": "keepttl",
                        "type": "pure-token",
                        "token": "KEEPTTL",
                        "since": "6.0.0"
                    }
                ]
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "2.6.12",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    }
                ]
            },
            {
                "name": "get",
                "type": "pure-token",
                "token": "GET",
                "since": "6.2.0",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    },
    "SETBIT": {
        "summary": "Sets or clears the bit at offset in the string value stored at key",
        "since": "2.2.0",
        "group": "bitmap",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@bitmap",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "offset",
                "type": "integer"
            },
            {
                "name": "value",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SETEX": {
        "summary": "Set the value and expiration of a key",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "seconds",
                "type": "integer"
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SETNX": {
        "summary": "Set the value of a key, only if the key does not exist",
        "since": "1.0.0",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@string",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "SETRANGE": {
        "summary": "Overwrite part of a string at key starting at the specified offset",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1), not counting the time taken to copy the new string in place. Usually, this string is very small so the amortized complexity is O(1). Otherwise, complexity is O(M) with M being the length of the value argument.",
        "acl_categories": [
            "@write",
            "@string",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "offset",
                "type": "integer"
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SHUTDOWN": {
        "summary": "Synchronously save the dataset to disk and then shut down the server",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "server",
        "complexity": "O(N) when saving, where N is the total number of keys in all databases when saving data, otherwise O(1)",
        "history": [
            [
                "7.0.0",
                "Added the `NOW`, `FORCE` and `ABORT` modifiers."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "nosave_save",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "nosave",
                        "type": "pure-token",
                        "token": "NOSAVE"
                    },
                    {
                        "name": "save",
                        "type": "pure-token",
                        "token": "SAVE"
                    }
                ]
            },
            {
                "name": "now",
                "type": "pure-token",
                "token": "NOW",
                "since": "7.0.0",
                "optional": true
            },
            {
                "name": "force",
                "type": "pure-token",
                "token": "FORCE",
                "since": "7.0.0",
                "optional": true
            },
            {
                "name": "abort",
                "type": "pure-token",
                "token": "ABORT",
                "since": "7.0.0",
                "optional": true
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "loading",
            "stale",
            "no_multi",
            "allow_busy"
        ]
    },
    "SINTER": {
        "summary": "Intersect multiple sets",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "SINTERCARD": {
        "summary": "Intersect multiple sets and return the cardinality of the result",
        "since": "7.0.0",
        "group": "set",
        "complexity": "O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "limit",
                "type": "integer",
                "token": "LIMIT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "SINTERSTORE": {
        "summary": "Intersect multiple sets and store the resulting set in a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N*M) worst case where N is the cardinality of the smallest set and M is the number of sets.",
        "acl_categories": [
            "@write",
            "@set",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SISMEMBER": {
        "summary": "Determine if a given value is a member of a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@set",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "SLAVEOF": {
        "summary": "Make the server a replica of another instance, or promote it as master.",
        "since": "1.0.0",
        "group": "server",
        "complexity": "O(1)",
        "deprecated_since": "5.0.0",
        "replaced_by": "`REPLICAOF`",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "host",
                "type": "string"
            },
            {
                "name": "port",
                "type": "integer"
            }
        ],
        "command_flags": [
            "admin",
            "noscript",
            "stale",
            "no_async_loading"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "SLOWLOG": {
        "summary": "A container for slow log commands",
        "since": "2.2.12",
        "group": "server",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "SLOWLOG GET": {
        "summary": "Get the slow log's entries",
        "since": "2.2.12",
        "group": "server",
        "complexity": "O(N) where N is the number of entries returned",
        "history": [
            [
                "4.0.0",
                "Added client IP address, port and name to the reply."
            ]
        ],
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "count",
                "type": "integer",
                "optional": true
            }
        ],
        "command_flags": [
            "admin",
            "loading",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "nondeterministic_output"
        ]
    },
    "SLOWLOG HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "6.2.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "SLOWLOG LEN": {
        "summary": "Get the slow log's length",
        "since": "2.2.12",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "loading",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:agg_sum",
            "nondeterministic_output"
        ]
    },
    "SLOWLOG RESET": {
        "summary": "Clear all entries from the slow log",
        "since": "2.2.12",
        "group": "server",
        "complexity": "O(N) where N is the number of entries in the slowlog",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 2,
        "command_flags": [
            "admin",
            "loading",
            "stale"
        ],
        "hints": [
            "request_policy:all_nodes",
            "response_policy:all_succeeded"
        ]
    },
    "SMEMBERS": {
        "summary": "Get all the members in a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the set cardinality.",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "SMISMEMBER": {
        "summary": "Returns the membership associated with the given elements for a set",
        "since": "6.2.0",
        "group": "set",
        "complexity": "O(N) where N is the number of elements being checked for membership",
        "acl_categories": [
            "@read",
            "@set",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "SMOVE": {
        "summary": "Move a member from one set to another",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@set",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "source",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "SORT": {
        "summary": "Sort the elements in a list, set or sorted set",
        "since": "1.0.0",
        "group": "generic",
        "complexity": "O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M the number of returned elements. When the elements are not sorted, complexity is O(N).",
        "acl_categories": [
            "@write",
            "@set",
            "@sortedset",
            "@list",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            },
            {
                "notes": "For the optional BY/GET keyword. It is marked 'unknown' because the key names derive from the content of the key we sort",
                "begin_search": {
                    "type": "unknown",
                    "spec": {}
                },
                "find_keys": {
                    "type": "unknown",
                    "spec": {}
                },
                "RO": true,
                "access": true
            },
            {
                "notes": "For the optional STORE keyword. It is marked 'unknown' because the keyword can appear anywhere in the argument array",
                "begin_search": {
                    "type": "unknown",
                    "spec": {}
                },
                "find_keys": {
                    "type": "unknown",
                    "spec": {}
                },
                "OW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "pattern",
                "type": "pattern",
                "key_spec_index": 1,
                "token": "BY",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "pattern",
                "type": "pattern",
                "key_spec_index": 1,
                "token": "GET",
                "optional": true,
                "multiple": true,
                "multiple_token": true
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "sorting",
                "type": "pure-token",
                "token": "ALPHA",
                "optional": true
            },
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 2,
                "token": "STORE",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    },
    "SORT_RO": {
        "summary": "Sort the elements in a list, set or sorted set. Read-only variant of SORT.",
        "since": "7.0.0",
        "group": "generic",
        "complexity": "O(N+M*log(M)) where N is the number of elements in the list or set to sort, and M the number of returned elements. When the elements are not sorted, complexity is O(N).",
        "acl_categories": [
            "@read",
            "@set",
            "@sortedset",
            "@list",
            "@slow",
            "@dangerous"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            },
            {
                "notes": "For the optional BY/GET keyword. It is marked 'unknown' because the key names derive from the content of the key we sort",
                "begin_search": {
                    "type": "unknown",
                    "spec": {}
                },
                "find_keys": {
                    "type": "unknown",
                    "spec": {}
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "pattern",
                "type": "pattern",
                "key_spec_index": 1,
                "token": "BY",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "pattern",
                "type": "pattern",
                "key_spec_index": 1,
                "token": "GET",
                "optional": true,
                "multiple": true,
                "multiple_token": true
            },
            {
                "name": "order",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "asc",
                        "type": "pure-token",
                        "token": "ASC"
                    },
                    {
                        "name": "desc",
                        "type": "pure-token",
                        "token": "DESC"
                    }
                ]
            },
            {
                "name": "sorting",
                "type": "pure-token",
                "token": "ALPHA",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "SPOP": {
        "summary": "Remove and return one or multiple random members from a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "Without the count argument O(1), otherwise O(N) where N is the value of the passed count.",
        "history": [
            [
                "3.2.0",
                "Added the `count` argument."
            ]
        ],
        "acl_categories": [
            "@write",
            "@set",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "since": "3.2.0",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "SPUBLISH": {
        "summary": "Post a message to a shard channel",
        "since": "7.0.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of clients subscribed to the receiving shard channel.",
        "acl_categories": [
            "@pubsub",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "not_key": true
            }
        ],
        "arguments": [
            {
                "name": "channel",
                "type": "string"
            },
            {
                "name": "message",
                "type": "string"
            }
        ],
        "command_flags": [
            "pubsub",
            "loading",
            "stale",
            "fast",
            "may_replicate"
        ]
    },
    "SRANDMEMBER": {
        "summary": "Get one or multiple random members from a set",
        "since": "1.0.0",
        "group": "set",
        "complexity": "Without the count argument O(1), otherwise O(N) where N is the absolute value of the passed count.",
        "history": [
            [
                "2.6.0",
                "Added the optional `count` argument."
            ]
        ],
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "since": "2.6.0",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "SREM": {
        "summary": "Remove one or more members from a set",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the number of members to be removed.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple `member` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@set",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "SSCAN": {
        "summary": "Incrementally iterate Set elements",
        "since": "2.8.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "cursor",
                "type": "integer"
            },
            {
                "name": "pattern",
                "type": "pattern",
                "token": "MATCH",
                "optional": true
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "SSUBSCRIBE": {
        "summary": "Listen for messages published to the given shard channels",
        "since": "7.0.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of shard channels to subscribe to.",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "not_key": true
            }
        ],
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "STRLEN": {
        "summary": "Get the length of the value stored in a key",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@string",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "SUBSCRIBE": {
        "summary": "Listen for messages published to the given channels",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of channels to subscribe to.",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -2,
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "SUBSTR": {
        "summary": "Get a substring of the string stored at a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "string",
        "complexity": "O(N) where N is the length of the returned string. The complexity is ultimately determined by the returned length, but because creating a substring from an existing string is very cheap, it can be considered O(1) for small strings.",
        "deprecated_since": "2.0.0",
        "replaced_by": "`GETRANGE`",
        "acl_categories": [
            "@read",
            "@string",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "end",
                "type": "integer"
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "SUNION": {
        "summary": "Add multiple sets",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the total number of elements in all given sets.",
        "acl_categories": [
            "@read",
            "@set",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output_order"
        ]
    },
    "SUNIONSTORE": {
        "summary": "Add multiple sets and store the resulting set in a key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "set",
        "complexity": "O(N) where N is the total number of elements in all given sets.",
        "acl_categories": [
            "@write",
            "@set",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "SUNSUBSCRIBE": {
        "summary": "Stop listening for messages posted to the given shard channels",
        "since": "7.0.0",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of clients already subscribed to a channel.",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -1,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "not_key": true
            }
        ],
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "SWAPDB": {
        "summary": "Swaps two Redis databases",
        "since": "4.0.0",
        "group": "server",
        "complexity": "O(N) where N is the count of clients watching or blocking on keys from both databases.",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast",
            "@dangerous"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "index1",
                "type": "integer"
            },
            {
                "name": "index2",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "SYNC": {
        "summary": "Internal command used for replication",
        "since": "1.0.0",
        "group": "server",
        "acl_categories": [
            "@admin",
            "@slow",
            "@dangerous"
        ],
        "arity": 1,
        "command_flags": [
            "admin",
            "noscript",
            "no_async_loading",
            "no_multi"
        ]
    },
    "TIME": {
        "summary": "Return the current server time",
        "since": "2.6.0",
        "group": "server",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast"
        ],
        "arity": 1,
        "command_flags": [
            "loading",
            "stale",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "TOUCH": {
        "summary": "Alters the last access time of a key(s). Returns the number of existing keys specified.",
        "since": "3.2.1",
        "group": "generic",
        "complexity": "O(N) where N is the number of keys that will be touched.",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:agg_sum"
        ]
    },
    "TTL": {
        "summary": "Get the time to live for a key in seconds",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "history": [
            [
                "2.8.0",
                "Added the -2 reply."
            ]
        ],
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "TYPE": {
        "summary": "Determine the type stored at key",
        "since": "1.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@keyspace",
            "@read",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "UNLINK": {
        "summary": "Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.",
        "since": "4.0.0",
        "dragonfly_since" : "0.1",
        "group": "generic",
        "complexity": "O(1) for each key removed regardless of its size. Then the command does O(N) work in a different thread in order to reclaim memory, where N is the number of allocations the deleted objects where composed of.",
        "acl_categories": [
            "@keyspace",
            "@write",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RM": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ],
        "hints": [
            "request_policy:multi_shard",
            "response_policy:agg_sum"
        ]
    },
    "UNSUBSCRIBE": {
        "summary": "Stop listening for messages posted to the given channels",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "pubsub",
        "complexity": "O(N) where N is the number of clients already subscribed to a channel.",
        "acl_categories": [
            "@pubsub",
            "@slow"
        ],
        "arity": -1,
        "arguments": [
            {
                "name": "channel",
                "type": "string",
                "optional": true,
                "multiple": true
            }
        ],
        "command_flags": [
            "pubsub",
            "noscript",
            "loading",
            "stale"
        ]
    },
    "UNWATCH": {
        "summary": "Forget about all watched keys",
        "since": "2.2.0",
        "group": "transactions",
        "complexity": "O(1)",
        "acl_categories": [
            "@fast",
            "@transaction"
        ],
        "arity": 1,
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "allow_busy"
        ]
    },
    "WAIT": {
        "summary": "Wait for the synchronous replication of all the write commands sent in the context of the current connection",
        "since": "3.0.0",
        "group": "generic",
        "complexity": "O(1)",
        "acl_categories": [
            "@slow",
            "@connection"
        ],
        "arity": 3,
        "arguments": [
            {
                "name": "numreplicas",
                "type": "integer"
            },
            {
                "name": "timeout",
                "type": "integer"
            }
        ],
        "command_flags": [
            "noscript"
        ],
        "hints": [
            "request_policy:all_shards",
            "response_policy:agg_min"
        ]
    },
    "WATCH": {
        "summary": "Watch the given keys to determine execution of the MULTI/EXEC block",
        "since": "2.2.0",
        "group": "transactions",
        "complexity": "O(1) for every key.",
        "acl_categories": [
            "@fast",
            "@transaction"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 0
                    }
                }
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            }
        ],
        "command_flags": [
            "noscript",
            "loading",
            "stale",
            "fast",
            "allow_busy"
        ]
    },
    "XACK": {
        "summary": "Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1) for each message ID processed.",
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "group",
                "type": "string"
            },
            {
                "name": "id",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "XADD": {
        "summary": "Appends a new entry to a stream",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1) when adding a new entry, O(N) when trimming where N being the number of entries evicted.",
        "history": [
            [
                "6.2.0",
                "Added the `NOMKSTREAM` option, `MINID` trimming strategy and the `LIMIT` option."
            ],
            [
                "7.0.0",
                "Added support for the `<ms>-*` explicit ID form."
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -5,
        "key_specs": [
            {
                "notes": "UPDATE instead of INSERT because of the optional trimming feature",
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "nomkstream",
                "type": "pure-token",
                "token": "NOMKSTREAM",
                "since": "6.2.0",
                "optional": true
            },
            {
                "name": "trim",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "strategy",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "maxlen",
                                "type": "pure-token",
                                "token": "MAXLEN"
                            },
                            {
                                "name": "minid",
                                "type": "pure-token",
                                "token": "MINID",
                                "since": "6.2.0"
                            }
                        ]
                    },
                    {
                        "name": "operator",
                        "type": "oneof",
                        "optional": true,
                        "arguments": [
                            {
                                "name": "equal",
                                "type": "pure-token",
                                "token": "="
                            },
                            {
                                "name": "approximately",
                                "type": "pure-token",
                                "token": "~"
                            }
                        ]
                    },
                    {
                        "name": "threshold",
                        "type": "string"
                    },
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "LIMIT",
                        "since": "6.2.0",
                        "optional": true
                    }
                ]
            },
            {
                "name": "id_or_auto",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "auto_id",
                        "type": "pure-token",
                        "token": "*"
                    },
                    {
                        "name": "id",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "field_value",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "field",
                        "type": "string"
                    },
                    {
                        "name": "value",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "XAUTOCLAIM": {
        "summary": "Changes (or acquires) ownership of messages in a consumer group, as if the messages were delivered to the specified consumer.",
        "since": "6.2.0",
        "group": "stream",
        "complexity": "O(1) if COUNT is small.",
        "history": [
            [
                "7.0.0",
                "Added an element to the reply array, containing deleted entries the command cleared from the PEL"
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "group",
                "type": "string"
            },
            {
                "name": "consumer",
                "type": "string"
            },
            {
                "name": "min-idle-time",
                "type": "string"
            },
            {
                "name": "start",
                "type": "string"
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            },
            {
                "name": "justid",
                "type": "pure-token",
                "token": "JUSTID",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "XCLAIM": {
        "summary": "Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(log N) with N being the number of messages in the PEL of the consumer group.",
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -6,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "group",
                "type": "string"
            },
            {
                "name": "consumer",
                "type": "string"
            },
            {
                "name": "min-idle-time",
                "type": "string"
            },
            {
                "name": "id",
                "type": "string",
                "multiple": true
            },
            {
                "name": "ms",
                "type": "integer",
                "token": "IDLE",
                "optional": true
            },
            {
                "name": "unix-time-milliseconds",
                "type": "unix-time",
                "token": "TIME",
                "optional": true
            },
            {
                "name": "count",
                "type": "integer",
                "token": "RETRYCOUNT",
                "optional": true
            },
            {
                "name": "force",
                "type": "pure-token",
                "token": "FORCE",
                "optional": true
            },
            {
                "name": "justid",
                "type": "pure-token",
                "token": "JUSTID",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "XDEL": {
        "summary": "Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1) for each single item to delete in the stream, regardless of the stream size.",
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "id",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "XGROUP": {
        "summary": "A container for consumer groups commands",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "XGROUP CREATE": {
        "summary": "Create a consumer group.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added the `entries_read` named argument."
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            },
            {
                "name": "id",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "new_id",
                        "type": "pure-token",
                        "token": "$"
                    }
                ]
            },
            {
                "name": "mkstream",
                "type": "pure-token",
                "token": "MKSTREAM",
                "optional": true
            },
            {
                "name": "entries_read",
                "type": "integer",
                "token": "ENTRIESREAD",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "XGROUP CREATECONSUMER": {
        "summary": "Create a consumer in a consumer group.",
        "since": "6.2.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": 5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "insert": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            },
            {
                "name": "consumername",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "XGROUP DELCONSUMER": {
        "summary": "Delete a consumer from a consumer group.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": 5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            },
            {
                "name": "consumername",
                "type": "string"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "XGROUP DESTROY": {
        "summary": "Destroy a consumer group.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(N) where N is the number of entries in the group's pending entries list (PEL).",
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "XGROUP HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@stream",
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "XGROUP SETID": {
        "summary": "Set a consumer group to an arbitrary last delivered ID value.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added the optional `entries_read` argument."
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            },
            {
                "name": "id",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "name": "new_id",
                        "type": "pure-token",
                        "token": "$"
                    }
                ]
            },
            {
                "name": "entries_read",
                "type": "integer",
                "token": "ENTRIESREAD",
                "optional": true
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "XINFO": {
        "summary": "A container for stream introspection commands",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "Depends on subcommand.",
        "acl_categories": [
            "@slow"
        ],
        "arity": -2
    },
    "XINFO CONSUMERS": {
        "summary": "List the consumers in a consumer group",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "groupname",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "XINFO GROUPS": {
        "summary": "List the consumer groups of a stream",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added the `entries-read` and `lag` fields"
            ]
        ],
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "XINFO HELP": {
        "summary": "Show helpful text about the different subcommands",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@stream",
            "@slow"
        ],
        "arity": 2,
        "command_flags": [
            "loading",
            "stale"
        ]
    },
    "XINFO STREAM": {
        "summary": "Get information about a stream",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added the `max-deleted-entry-id`, `entries-added`, `recorded-first-entry-id`, `entries-read` and `lag` fields"
            ]
        ],
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "full",
                "type": "block",
                "token": "FULL",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "COUNT",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "XLEN": {
        "summary": "Return the number of entries in a stream",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@stream",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "XPENDING": {
        "summary": "Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(N) with N being the number of elements returned, so asking for a small fixed number of entries per call is O(1). O(M), where M is the total number of entries scanned when used with the IDLE filter. When the command returns just the summary and the list of consumers is small, it runs in O(1) time; otherwise, an additional O(N) time for iterating every consumer.",
        "history": [
            [
                "6.2.0",
                "Added the `IDLE` option and exclusive range intervals."
            ]
        ],
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "group",
                "type": "string"
            },
            {
                "name": "filters",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "min-idle-time",
                        "type": "integer",
                        "token": "IDLE",
                        "since": "6.2.0",
                        "optional": true
                    },
                    {
                        "name": "start",
                        "type": "string"
                    },
                    {
                        "name": "end",
                        "type": "string"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    },
                    {
                        "name": "consumer",
                        "type": "string",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "XRANGE": {
        "summary": "Return a range of elements in a stream, with IDs matching the specified IDs interval",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(N) with N being the number of elements being returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).",
        "history": [
            [
                "6.2.0",
                "Added exclusive ranges."
            ]
        ],
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "string"
            },
            {
                "name": "end",
                "type": "string"
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "XREAD": {
        "summary": "Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "For each stream mentioned: O(N) with N being the number of elements being returned, it means that XREAD-ing with a fixed COUNT is O(1). Note that when the BLOCK option is used, XADD will pay O(M) time in order to serve the M clients blocked on the stream getting new data.",
        "acl_categories": [
            "@read",
            "@stream",
            "@slow",
            "@blocking"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STREAMS",
                        "startfrom": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 2
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            },
            {
                "name": "milliseconds",
                "type": "integer",
                "token": "BLOCK",
                "optional": true
            },
            {
                "name": "streams",
                "type": "block",
                "token": "STREAMS",
                "arguments": [
                    {
                        "name": "key",
                        "type": "key",
                        "key_spec_index": 0,
                        "multiple": true
                    },
                    {
                        "name": "id",
                        "type": "string",
                        "multiple": true
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly",
            "blocking",
            "movablekeys"
        ]
    },
    "XREADGROUP": {
        "summary": "Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "For each stream mentioned: O(M) with M being the number of elements returned. If M is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1). On the other side when XREADGROUP blocks, XADD will pay the O(N) time in order to serve the N clients blocked on the stream getting new data.",
        "acl_categories": [
            "@write",
            "@stream",
            "@slow",
            "@blocking"
        ],
        "arity": -7,
        "key_specs": [
            {
                "begin_search": {
                    "type": "keyword",
                    "spec": {
                        "keyword": "STREAMS",
                        "startfrom": 4
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": -1,
                        "keystep": 1,
                        "limit": 2
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "group_consumer",
                "type": "block",
                "token": "GROUP",
                "arguments": [
                    {
                        "name": "group",
                        "type": "string"
                    },
                    {
                        "name": "consumer",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            },
            {
                "name": "milliseconds",
                "type": "integer",
                "token": "BLOCK",
                "optional": true
            },
            {
                "name": "noack",
                "type": "pure-token",
                "token": "NOACK",
                "optional": true
            },
            {
                "name": "streams",
                "type": "block",
                "token": "STREAMS",
                "arguments": [
                    {
                        "name": "key",
                        "type": "key",
                        "key_spec_index": 0,
                        "multiple": true
                    },
                    {
                        "name": "id",
                        "type": "string",
                        "multiple": true
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "blocking",
            "movablekeys"
        ]
    },
    "XREVRANGE": {
        "summary": "Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(N) with N being the number of elements returned. If N is constant (e.g. always asking for the first 10 elements with COUNT), you can consider it O(1).",
        "history": [
            [
                "6.2.0",
                "Added exclusive ranges."
            ]
        ],
        "acl_categories": [
            "@read",
            "@stream",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "end",
                "type": "string"
            },
            {
                "name": "start",
                "type": "string"
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "XSETID": {
        "summary": "An internal command for replicating stream values",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(1)",
        "history": [
            [
                "7.0.0",
                "Added the `entries_added` and `max_deleted_entry_id` arguments."
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "last-id",
                "type": "string"
            },
            {
                "name": "entries_added",
                "type": "integer",
                "token": "ENTRIESADDED",
                "optional": true
            },
            {
                "name": "max_deleted_entry_id",
                "type": "string",
                "token": "MAXDELETEDID",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "XTRIM": {
        "summary": "Trims the stream to (approximately if '~' is passed) a certain size",
        "since": "5.0.0",
        "group": "stream",
        "complexity": "O(N), with N being the number of evicted entries. Constant times are very small however, since entries are organized in macro nodes containing multiple entries that can be released with a single deallocation.",
        "history": [
            [
                "6.2.0",
                "Added the `MINID` trimming strategy and the `LIMIT` option."
            ]
        ],
        "acl_categories": [
            "@write",
            "@stream",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "trim",
                "type": "block",
                "arguments": [
                    {
                        "name": "strategy",
                        "type": "oneof",
                        "arguments": [
                            {
                                "name": "maxlen",
                                "type": "pure-token",
                                "token": "MAXLEN"
                            },
                            {
                                "name": "minid",
                                "type": "pure-token",
                                "token": "MINID",
                                "since": "6.2.0"
                            }
                        ]
                    },
                    {
                        "name": "operator",
                        "type": "oneof",
                        "optional": true,
                        "arguments": [
                            {
                                "name": "equal",
                                "type": "pure-token",
                                "token": "="
                            },
                            {
                                "name": "approximately",
                                "type": "pure-token",
                                "token": "~"
                            }
                        ]
                    },
                    {
                        "name": "threshold",
                        "type": "string"
                    },
                    {
                        "name": "count",
                        "type": "integer",
                        "token": "LIMIT",
                        "since": "6.2.0",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "write"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "ZADD": {
        "summary": "Add one or more members to a sorted set, or update its score if it already exists",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)) for each item added, where N is the number of elements in the sorted set.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple elements."
            ],
            [
                "3.0.2",
                "Added the `XX`, `NX`, `CH` and `INCR` options."
            ],
            [
                "6.2.0",
                "Added the `GT` and `LT` options."
            ]
        ],
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "condition",
                "type": "oneof",
                "since": "3.0.2",
                "optional": true,
                "arguments": [
                    {
                        "name": "nx",
                        "type": "pure-token",
                        "token": "NX"
                    },
                    {
                        "name": "xx",
                        "type": "pure-token",
                        "token": "XX"
                    }
                ]
            },
            {
                "name": "comparison",
                "type": "oneof",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "gt",
                        "type": "pure-token",
                        "token": "GT"
                    },
                    {
                        "name": "lt",
                        "type": "pure-token",
                        "token": "LT"
                    }
                ]
            },
            {
                "name": "change",
                "type": "pure-token",
                "token": "CH",
                "since": "3.0.2",
                "optional": true
            },
            {
                "name": "increment",
                "type": "pure-token",
                "token": "INCR",
                "since": "3.0.2",
                "optional": true
            },
            {
                "name": "score_member",
                "type": "block",
                "multiple": true,
                "arguments": [
                    {
                        "name": "score",
                        "type": "double"
                    },
                    {
                        "name": "member",
                        "type": "string"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "ZCARD": {
        "summary": "Get the number of members in a sorted set",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZCOUNT": {
        "summary": "Count the members in a sorted set with scores within the given values",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "double"
            },
            {
                "name": "max",
                "type": "double"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZDIFF": {
        "summary": "Subtract multiple sorted sets",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "ZDIFFSTORE": {
        "summary": "Subtract multiple sorted sets and store the resulting sorted set in a new key",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(L + (N-K)log(N)) worst case where L is the total number of elements in all the sets, N is the size of the first set, and K is the size of the result set.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    },
    "ZINCRBY": {
        "summary": "Increment the score of a member in a sorted set",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)) where N is the number of elements in the sorted set.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "update": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "increment",
                "type": "integer"
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "fast"
        ]
    },
    "ZINTER": {
        "summary": "Intersect multiple sorted sets",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input sorted sets and M being the number of elements in the resulting sorted set.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "weight",
                "type": "integer",
                "token": "WEIGHTS",
                "optional": true,
                "multiple": true
            },
            {
                "name": "aggregate",
                "type": "oneof",
                "token": "AGGREGATE",
                "optional": true,
                "arguments": [
                    {
                        "name": "sum",
                        "type": "pure-token",
                        "token": "SUM"
                    },
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "ZINTERCARD": {
        "summary": "Intersect multiple sorted sets and return the cardinality of the result",
        "since": "7.0.0",
        "group": "sorted-set",
        "complexity": "O(N*K) worst case with N being the smallest input sorted set, K being the number of input sorted sets.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "limit",
                "type": "integer",
                "token": "LIMIT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "ZINTERSTORE": {
        "summary": "Intersect multiple sorted sets and store the resulting sorted set in a new key",
        "since": "2.0.0",
        "group": "sorted-set",
        "complexity": "O(N*K)+O(M*log(M)) worst case with N being the smallest input sorted set, K being the number of input sorted sets and M being the number of elements in the resulting sorted set.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            },
            {
                "name": "weight",
                "type": "integer",
                "token": "WEIGHTS",
                "optional": true,
                "multiple": true
            },
            {
                "name": "aggregate",
                "type": "oneof",
                "token": "AGGREGATE",
                "optional": true,
                "arguments": [
                    {
                        "name": "sum",
                        "type": "pure-token",
                        "token": "SUM"
                    },
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    },
    "ZLEXCOUNT": {
        "summary": "Count the number of members in a sorted set between a given lexicographical range",
        "since": "2.8.9",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)) with N being the number of elements in the sorted set.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "max",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZMPOP": {
        "summary": "Remove and return members with scores in a sorted set",
        "since": "7.0.0",
        "group": "sorted-set",
        "complexity": "O(K) + O(N*log(M)) where K is the number of provided keys, N being the number of elements in the sorted set, and M being the number of elements popped.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "where",
                "type": "oneof",
                "arguments": [
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "movablekeys"
        ]
    },
    "ZMSCORE": {
        "summary": "Get the score associated with the given members in a sorted set",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(N) where N is the number of members being requested.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZPOPMAX": {
        "summary": "Remove and return members with the highest scores in a sorted set",
        "since": "5.0.0",
        "group": "sorted-set",
        "complexity": "O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "ZPOPMIN": {
        "summary": "Remove and return members with the lowest scores in a sorted set",
        "since": "5.0.0",
        "group": "sorted-set",
        "complexity": "O(log(N)*M) with N being the number of elements in the sorted set, and M being the number of elements popped.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "access": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "count",
                "type": "integer",
                "optional": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "ZRANDMEMBER": {
        "summary": "Get one or multiple random elements from a sorted set",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(N) where N is the number of elements returned",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -2,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "options",
                "type": "block",
                "optional": true,
                "arguments": [
                    {
                        "name": "count",
                        "type": "integer"
                    },
                    {
                        "name": "withscores",
                        "type": "pure-token",
                        "token": "WITHSCORES",
                        "optional": true
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "ZRANGE": {
        "summary": "Return a range of members in a sorted set",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.",
        "history": [
            [
                "6.2.0",
                "Added the `REV`, `BYSCORE`, `BYLEX` and `LIMIT` options."
            ]
        ],
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "max",
                "type": "string"
            },
            {
                "name": "sortby",
                "type": "oneof",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "byscore",
                        "type": "pure-token",
                        "token": "BYSCORE"
                    },
                    {
                        "name": "bylex",
                        "type": "pure-token",
                        "token": "BYLEX"
                    }
                ]
            },
            {
                "name": "rev",
                "type": "pure-token",
                "token": "REV",
                "since": "6.2.0",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "since": "6.2.0",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ]
    },
    "ZRANGEBYLEX": {
        "summary": "Return a range of members in a sorted set, by lexicographical range",
        "since": "2.8.9",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
        "deprecated_since": "6.2.0",
        "replaced_by": "`ZRANGE` with the `BYSCORE` argument",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "max",
                "type": "string"
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "ZRANGEBYSCORE": {
        "summary": "Return a range of members in a sorted set, by score",
        "since": "1.0.5",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
        "deprecated_since": "6.2.0",
        "replaced_by": "`ZRANGE` with the `BYSCORE` argument",
        "history": [
            [
                "2.0.0",
                "Added the `WITHSCORES` modifier."
            ]
        ],
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "double"
            },
            {
                "name": "max",
                "type": "double"
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "since": "2.0.0",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "ZRANGESTORE": {
        "summary": "Store a range of members from sorted set into another key",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements stored into the destination key.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": -5,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "dst",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "src",
                "type": "key",
                "key_spec_index": 1
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "max",
                "type": "string"
            },
            {
                "name": "sortby",
                "type": "oneof",
                "optional": true,
                "arguments": [
                    {
                        "name": "byscore",
                        "type": "pure-token",
                        "token": "BYSCORE"
                    },
                    {
                        "name": "bylex",
                        "type": "pure-token",
                        "token": "BYLEX"
                    }
                ]
            },
            {
                "name": "rev",
                "type": "pure-token",
                "token": "REV",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom"
        ]
    },
    "ZRANK": {
        "summary": "Determine the index of a member in a sorted set",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N))",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZREM": {
        "summary": "Remove one or more members from a sorted set",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(M*log(N)) with N being the number of elements in the sorted set and M the number of elements to be removed.",
        "history": [
            [
                "2.4.0",
                "Accepts multiple elements."
            ]
        ],
        "acl_categories": [
            "@write",
            "@sortedset",
            "@fast"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string",
                "multiple": true
            }
        ],
        "command_flags": [
            "write",
            "fast"
        ]
    },
    "ZREMRANGEBYLEX": {
        "summary": "Remove all members in a sorted set between the given lexicographical range",
        "since": "2.8.9",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "max",
                "type": "string"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "ZREMRANGEBYRANK": {
        "summary": "Remove all members in a sorted set within the given indexes",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "stop",
                "type": "integer"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "ZREMRANGEBYSCORE": {
        "summary": "Remove all members in a sorted set within the given scores",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements removed by the operation.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": 4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RW": true,
                "delete": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "min",
                "type": "double"
            },
            {
                "name": "max",
                "type": "double"
            }
        ],
        "command_flags": [
            "write"
        ]
    },
    "ZREVRANGE": {
        "summary": "Return a range of members in a sorted set, by index, with scores ordered from high to low",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements returned.",
        "deprecated_since": "6.2.0",
        "replaced_by": "`ZRANGE` with the `REV` argument",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "start",
                "type": "integer"
            },
            {
                "name": "stop",
                "type": "integer"
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "ZREVRANGEBYLEX": {
        "summary": "Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.",
        "since": "2.8.9",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
        "deprecated_since": "6.2.0",
        "replaced_by": "`ZRANGE` with the `REV` and `BYLEX` arguments",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "max",
                "type": "string"
            },
            {
                "name": "min",
                "type": "string"
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "ZREVRANGEBYSCORE": {
        "summary": "Return a range of members in a sorted set, by score, with scores ordered from high to low",
        "since": "2.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N)+M) with N being the number of elements in the sorted set and M the number of elements being returned. If M is constant (e.g. always asking for the first 10 elements with LIMIT), you can consider it O(log(N)).",
        "deprecated_since": "6.2.0",
        "replaced_by": "`ZRANGE` with the `REV` and `BYSCORE` arguments",
        "history": [
            [
                "2.1.6",
                "`min` and `max` can be exclusive."
            ]
        ],
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "max",
                "type": "double"
            },
            {
                "name": "min",
                "type": "double"
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            },
            {
                "name": "offset_count",
                "type": "block",
                "token": "LIMIT",
                "optional": true,
                "arguments": [
                    {
                        "name": "offset",
                        "type": "integer"
                    },
                    {
                        "name": "count",
                        "type": "integer"
                    }
                ]
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "doc_flags": [
            "deprecated"
        ]
    },
    "ZREVRANK": {
        "summary": "Determine the index of a member in a sorted set, with scores ordered from high to low",
        "since": "2.0.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(log(N))",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZSCAN": {
        "summary": "Incrementally iterate sorted sets elements and associated scores",
        "since": "2.8.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(1) for every call. O(N) for a complete iteration, including enough command calls for the cursor to return back to 0. N is the number of elements inside the collection..",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "cursor",
                "type": "integer"
            },
            {
                "name": "pattern",
                "type": "pattern",
                "token": "MATCH",
                "optional": true
            },
            {
                "name": "count",
                "type": "integer",
                "token": "COUNT",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly"
        ],
        "hints": [
            "nondeterministic_output"
        ]
    },
    "ZSCORE": {
        "summary": "Get the score associated with the given member in a sorted set",
        "since": "1.2.0",
        "dragonfly_since" : "0.1",
        "group": "sorted-set",
        "complexity": "O(1)",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@fast"
        ],
        "arity": 3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "member",
                "type": "string"
            }
        ],
        "command_flags": [
            "readonly",
            "fast"
        ]
    },
    "ZUNION": {
        "summary": "Add multiple sorted sets",
        "since": "6.2.0",
        "group": "sorted-set",
        "complexity": "O(N)+O(M*log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in the resulting sorted set.",
        "acl_categories": [
            "@read",
            "@sortedset",
            "@slow"
        ],
        "arity": -3,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 0,
                "multiple": true
            },
            {
                "name": "weight",
                "type": "integer",
                "token": "WEIGHTS",
                "optional": true,
                "multiple": true
            },
            {
                "name": "aggregate",
                "type": "oneof",
                "token": "AGGREGATE",
                "optional": true,
                "arguments": [
                    {
                        "name": "sum",
                        "type": "pure-token",
                        "token": "SUM"
                    },
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            },
            {
                "name": "withscores",
                "type": "pure-token",
                "token": "WITHSCORES",
                "optional": true
            }
        ],
        "command_flags": [
            "readonly",
            "movablekeys"
        ]
    },
    "ZUNIONSTORE": {
        "summary": "Add multiple sorted sets and store the resulting sorted set in a new key",
        "since": "2.0.0",
        "group": "sorted-set",
        "complexity": "O(N)+O(M log(M)) with N being the sum of the sizes of the input sorted sets, and M being the number of elements in the resulting sorted set.",
        "acl_categories": [
            "@write",
            "@sortedset",
            "@slow"
        ],
        "arity": -4,
        "key_specs": [
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 1
                    }
                },
                "find_keys": {
                    "type": "range",
                    "spec": {
                        "lastkey": 0,
                        "keystep": 1,
                        "limit": 0
                    }
                },
                "OW": true,
                "update": true
            },
            {
                "begin_search": {
                    "type": "index",
                    "spec": {
                        "index": 2
                    }
                },
                "find_keys": {
                    "type": "keynum",
                    "spec": {
                        "keynumidx": 0,
                        "firstkey": 1,
                        "keystep": 1
                    }
                },
                "RO": true,
                "access": true
            }
        ],
        "arguments": [
            {
                "name": "destination",
                "type": "key",
                "key_spec_index": 0
            },
            {
                "name": "numkeys",
                "type": "integer"
            },
            {
                "name": "key",
                "type": "key",
                "key_spec_index": 1,
                "multiple": true
            },
            {
                "name": "weight",
                "type": "integer",
                "token": "WEIGHTS",
                "optional": true,
                "multiple": true
            },
            {
                "name": "aggregate",
                "type": "oneof",
                "token": "AGGREGATE",
                "optional": true,
                "arguments": [
                    {
                        "name": "sum",
                        "type": "pure-token",
                        "token": "SUM"
                    },
                    {
                        "name": "min",
                        "type": "pure-token",
                        "token": "MIN"
                    },
                    {
                        "name": "max",
                        "type": "pure-token",
                        "token": "MAX"
                    }
                ]
            }
        ],
        "command_flags": [
            "write",
            "denyoom",
            "movablekeys"
        ]
    }
}