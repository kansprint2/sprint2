$(document).ready(function () {

    if ($('table').length > 0) {
        $('table').DataTable({
            stateSave: false,
            responsive: true
        });
    }

    $('#login_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        framework: 'bootstrap',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

    });

    $('#register_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        framework: 'bootstrap',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter first name.'
                    }
                }
            },
            surname: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter surname.'
                    }
                }
            },
            email: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter email.'
                    },
                    regexp: {
                        regexp: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/,
                        message: 'Email can contain only alphabetical characters, underscore and numbers but no spaces.'
                    }
                }
            },
            username: {
                validators: {
                    stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Please enter username.'
                    },
                    regexp: {
                        regexp: /^[\w]+$/,
                        message: 'Username can contain only alphabetical characters, underscore and numbers but no spaces.'
                    }
                }
            },
            password: {
                validators: {
                    stringLength: {
                        min: 8,
                    }
                }
            },
            password2: {
                validators: {
                    identical: {
                        field: 'password',
                        message: 'Entered passwords are not equal.'
                    }
                }
            }
        }
    });

    $('#project_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        framework: 'bootstrap',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter project name.'
                    }
                }
            },
            description: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please enter description.'
                    }
                }
            },
            members: {
                validators: {

                    notEmpty: {
                        message: 'Please select at least one member.'
                    }
                }
            },
            product_owner: {
                validators: {

                    notEmpty: {
                        message: 'Product Owner must be selected.'
                    }
                }
            },
            scrum_master: {
                validators: {

                    notEmpty: {
                        message: 'Scrum Master must be selected.'
                    }
                }
            }

        }
    });

    $('#sprint_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        framework: 'bootstrap',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            selected_date: {
                validators: {
                    stringLength: {
                        min: 15,
                        message: 'Please select start and end date.'
                    },
                    notEmpty: {
                        message: 'Please select start and end date.'
                    }
                }
            },
            velocity: {
                validators: {
                    stringLength: {
                        min: 1,
                    },
                    notEmpty: {
                        message: 'Please enter sprint velocity.'
                    }
                }
            },
            sprint_project: {
                validators: {

                    notEmpty: {
                        message: 'Please select project.'
                    }
                }
            }
        }
    });

});